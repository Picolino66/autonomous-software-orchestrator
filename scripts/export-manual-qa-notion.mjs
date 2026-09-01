#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const HEADERS = [
  'Tarefa',
  'Status',
  'Sprint',
  'Prioridade',
];

function fail(message) {
  process.stderr.write('Erro: ' + message + '\n');
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    input: '',
    output: '',
    contentOutput: '',
    validateOnly: false,
    strict: false,
    status: 'Não iniciado',
    priority: 'Normal',
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--validate-only') {
      options.validateOnly = true;
      continue;
    }
    if (argument === '--strict') {
      options.strict = true;
      continue;
    }
    if (argument === '--help' || argument === '-h') {
      process.stdout.write([
        'Uso:',
        '  node scripts/export-manual-qa-notion.mjs --input <diretório> --output <arquivo.csv>',
        '',
        'Opções:',
        '  --validate-only       valida sem gravar o CSV',
        '  --strict              transforma avisos em erros',
        '  --content-output      caminho opcional do manifesto .content.json',
        '  --status <valor>      status inicial (padrão: Não iniciado)',
        '  --priority <valor>    prioridade padrão (padrão: Normal)',
        '',
      ].join('\n'));
      process.exit(0);
    }

    const keyMap = {
      '--input': 'input',
      '--output': 'output',
      '--content-output': 'contentOutput',
      '--status': 'status',
      '--priority': 'priority',
    };
    const key = keyMap[argument];
    if (!key) {
      fail('opção desconhecida: ' + argument);
    }
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) {
      fail('a opção ' + argument + ' exige um valor.');
    }
    options[key] = value;
    index += 1;
  }

  if (!options.input) {
    fail('informe --input com o diretório dos arquivos diários.');
  }
  if (!options.validateOnly && !options.output) {
    fail('informe --output ou use --validate-only.');
  }
  return options;
}

function plainText(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/[\x60*_]/g, '')
    .replace(/\\([\\[\]()#.!-])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function fieldFromBlock(block, name) {
  const expression = new RegExp('^\\*\\*' + name + ':\\*\\*\\s*(.*)$', 'i');
  const line = block.find((item) => expression.test(item.trim()));
  if (!line) {
    return '';
  }
  return plainText(line.trim().match(expression)[1]);
}

function stepsFromBlock(block) {
  return block
    .map((line) => line.trim().match(/^(\d+)\.\s+(.+)$/))
    .filter(Boolean)
    .map((match) => '☐ ' + match[1] + '. ' + plainText(match[2]))
    .join(' | ');
}

function relativeTargets(markdown) {
  const targets = [];
  const expression = /!?\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = expression.exec(markdown)) !== null) {
    const target = match[1].trim().split(/\s+["']/)[0].replace(/^<|>$/g, '');
    if (
      target &&
      !target.startsWith('#') &&
      !target.startsWith('http://') &&
      !target.startsWith('https://') &&
      !target.startsWith('mailto:')
    ) {
      targets.push(target);
    }
  }
  return targets;
}

function inspectSensitiveData(markdown, sourceName, warnings, errors) {
  const hardSecretPatterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\bsk-[A-Za-z0-9_-]{20,}\b/,
    /\b(?:eyJ[A-Za-z0-9_-]+\.){2}[A-Za-z0-9_-]+\b/,
    /https?:\/\/[^\s/:]+:[^\s/@]+@[^\s]+/,
  ];
  for (const pattern of hardSecretPatterns) {
    if (pattern.test(markdown)) {
      errors.push(sourceName + ': possível credencial ou segredo encontrado.');
      break;
    }
  }

  const emailExpression = /\b[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})\b/gi;
  const safeDomains = new Set(['example.com', 'example.org', 'example.net', 'test.invalid']);
  const domains = new Set();
  let emailMatch;
  while ((emailMatch = emailExpression.exec(markdown)) !== null) {
    const domain = emailMatch[1].toLowerCase();
    if (!safeDomains.has(domain)) {
      domains.add(domain);
    }
  }
  if (domains.size > 0) {
    warnings.push(
      sourceName +
        ': confirme que os e-mails dos domínios ' +
        Array.from(domains).join(', ') +
        ' são totalmente fictícios.'
    );
  }
}

function parseDayFile(filePath, warnings, errors) {
  const sourceName = path.basename(filePath);
  const markdown = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
  const lines = markdown.split('\n');
  const titleLine = lines.find((line) => /^#\s+Dia\s+\d+/i.test(line.trim())) || '';
  const titleMatch = titleLine.trim().match(/^#\s+Dia\s+(\d+)\s+[—-]\s+(.+)$/i);

  if (!titleMatch) {
    errors.push(sourceName + ': título deve seguir “# Dia N — Tema”.');
    return null;
  }

  const dayNumber = Number(titleMatch[1]);
  const theme = plainText(titleMatch[2]);
  const dayProfile = fieldFromBlock(lines, 'Perfil usado');
  if (!dayProfile) {
    warnings.push(sourceName + ': perfil usado não foi declarado.');
  }

  for (const target of relativeTargets(markdown)) {
    const decodedTarget = decodeURIComponent(target.split('#')[0]);
    if (decodedTarget && !fs.existsSync(path.resolve(path.dirname(filePath), decodedTarget))) {
      errors.push(sourceName + ': link ou imagem inexistente: ' + target);
    }
  }
  inspectSensitiveData(markdown, sourceName, warnings, errors);

  const tasks = [];
  let currentModule = '';
  let currentFeature = '';

  for (let index = 0; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    const moduleMatch = trimmed.match(/^##\s+Módulo:\s+(.+)$/i);
    if (moduleMatch) {
      currentModule = plainText(moduleMatch[1]);
      currentFeature = '';
      continue;
    }
    const featureMatch = trimmed.match(/^###\s+Feature:\s+(.+)$/i);
    if (featureMatch) {
      currentFeature = plainText(featureMatch[1]);
      continue;
    }

    const taskMatch = trimmed.match(/^####\s+Tarefa\s+([A-Z0-9-]+)\s+[—-]\s+(.+)$/i);
    if (!taskMatch) {
      continue;
    }

    let blockEnd = index + 1;
    while (
      blockEnd < lines.length &&
      !/^##(?:#(?:#)?)?\s+(?:Módulo:|Feature:|Tarefa\s+)/i.test(lines[blockEnd].trim())
    ) {
      blockEnd += 1;
    }
    const block = lines.slice(index + 1, blockEnd);
    const task = {
      id: taskMatch[1].toUpperCase(),
      title: plainText(taskMatch[2]),
      module: currentModule,
      feature: currentFeature,
      profile: fieldFromBlock(block, 'Perfil') || dayProfile,
      objective: fieldFromBlock(block, 'Objetivo'),
      preparation: fieldFromBlock(block, 'Preparação'),
      testData: fieldFromBlock(block, 'Dados fictícios') || fieldFromBlock(block, 'Dados de teste'),
      steps: stepsFromBlock(block),
      expected: fieldFromBlock(block, 'Resultado esperado'),
      priority: fieldFromBlock(block, 'Prioridade'),
      sourceName,
      dayNumber,
      theme,
    };

    const required = {
      ID: task.id,
      título: task.title,
      módulo: task.module,
      feature: task.feature,
      objetivo: task.objective,
      preparação: task.preparation,
      'dados de teste': task.testData,
      passos: task.steps,
      'resultado esperado': task.expected,
    };
    for (const [label, value] of Object.entries(required)) {
      if (!value) {
        errors.push(sourceName + ' / ' + task.id + ': campo obrigatório ausente: ' + label + '.');
      }
    }
    const idDayMatch = task.id.match(/-D(\d{2})-T(\d{2})$/);
    if (!idDayMatch) {
      errors.push(sourceName + ' / ' + task.id + ': ID deve terminar com -Dxx-Tyy.');
    } else if (Number(idDayMatch[1]) !== dayNumber) {
      errors.push(sourceName + ' / ' + task.id + ': o dia do ID não corresponde ao arquivo.');
    }

    tasks.push(task);
    index = blockEnd - 1;
  }

  if (tasks.length === 0) {
    errors.push(sourceName + ': nenhuma tarefa encontrada.');
  }

  const hasCorrect = /assets\/dia-\d+\/correto\.(?:png|jpe?g|webp|svg)/i.test(markdown);
  const hasIncorrect = /assets\/dia-\d+\/incorreto\.(?:png|jpe?g|webp|svg)/i.test(markdown);
  if (!hasCorrect || !hasIncorrect) {
    warnings.push(sourceName + ': par visual correto/incorreto não foi encontrado.');
  }

  return { dayNumber, theme, sourceName, tasks };
}

function csvCell(value) {
  const text = String(value ?? '');
  return '"' + text.replace(/"/g, '""') + '"';
}

function dependencyFor(days, dayIndex, taskIndex) {
  if (taskIndex > 0) {
    return days[dayIndex].tasks[taskIndex - 1].id;
  }
  if (dayIndex > 0) {
    return 'Concluir Sprint Dia ' + String(days[dayIndex - 1].dayNumber).padStart(2, '0');
  }
  return 'Nenhuma';
}

function boardTitle(task, taskIndex) {
  return (
    'D' +
    String(task.dayNumber).padStart(2, '0') +
    '.' +
    String(taskIndex + 1).padStart(2, '0') +
    ' — ' +
    task.title
  );
}

function cardBody(task, dependency) {
  const profile = task.profile || 'Não informado';
  const steps = task.steps
    .split(' | ')
    .filter(Boolean)
    .map((step) => '- [ ] ' + step.replace(/^☐\s*/, ''));

  return [
    '## Roteiro',
    '',
    '**ID:** ' + task.id,
    '**Feature:** ' + task.feature,
    '**Perfil:** ' + profile,
    '**Dependência:** ' + dependency,
    '',
    '### Objetivo',
    task.objective,
    '',
    '### Preparação',
    task.preparation,
    '',
    '### Dados de teste',
    task.testData,
    '',
    '### Passos',
    ...steps,
    '',
    '### Resultado esperado',
    task.expected,
    '',
    '---',
    '',
    '## Registro da execução',
    '',
    '**Resultado obtido:**',
    '',
    '**Evidência:**',
    '',
    '**Problema encontrado:**',
    '',
    '**Arquivo de origem:** ' + task.sourceName,
    '',
  ].join('\n');
}

function buildRows(days, options) {
  const rows = [];
  for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
    const day = days[dayIndex];
    for (let index = 0; index < day.tasks.length; index += 1) {
      const task = day.tasks[index];

      rows.push([
        boardTitle(task, index),
        options.status,
        'Dia ' + String(day.dayNumber).padStart(2, '0') + ' — ' + day.theme,
        task.priority || options.priority,
      ]);
    }
  }
  return rows;
}

function buildContentManifest(days) {
  const cards = [];
  for (let dayIndex = 0; dayIndex < days.length; dayIndex += 1) {
    const day = days[dayIndex];
    for (let taskIndex = 0; taskIndex < day.tasks.length; taskIndex += 1) {
      const task = day.tasks[taskIndex];
      const dependency = dependencyFor(days, dayIndex, taskIndex);
      cards.push({
        id: task.id,
        title: boardTitle(task, taskIndex),
        sourceFile: task.sourceName,
        bodyMarkdown: cardBody(task, dependency),
      });
    }
  }
  return {
    schemaVersion: 1,
    matchProperty: 'Tarefa',
    databaseProperties: HEADERS,
    cards,
  };
}

function defaultContentOutput(csvOutput) {
  const extension = path.extname(csvOutput);
  const base = extension ? csvOutput.slice(0, -extension.length) : csvOutput;
  return base + '.content.json';
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const inputDirectory = path.resolve(options.input);
  if (!fs.existsSync(inputDirectory) || !fs.statSync(inputDirectory).isDirectory()) {
    fail('diretório de entrada inexistente: ' + inputDirectory);
  }

  const files = fs
    .readdirSync(inputDirectory)
    .filter((name) => /^dia-\d+-.+\.md$/i.test(name))
    .sort((left, right) => {
      const leftDay = Number(left.match(/^dia-(\d+)/i)[1]);
      const rightDay = Number(right.match(/^dia-(\d+)/i)[1]);
      return leftDay - rightDay || left.localeCompare(right, 'pt-BR');
    });
  if (files.length === 0) {
    fail('nenhum arquivo dia-NN-*.md encontrado em ' + inputDirectory);
  }

  const warnings = [];
  const errors = [];
  const days = files
    .map((name) => parseDayFile(path.join(inputDirectory, name), warnings, errors))
    .filter(Boolean)
    .sort((left, right) => left.dayNumber - right.dayNumber);

  const duplicateDays = days.filter(
    (day, index) => index > 0 && day.dayNumber === days[index - 1].dayNumber
  );
  for (const day of duplicateDays) {
    errors.push('Dia ' + day.dayNumber + ': há mais de um arquivo para a mesma sprint.');
  }

  const allTasks = days.flatMap((day) => day.tasks);
  const ids = new Set();
  for (const task of allTasks) {
    if (ids.has(task.id)) {
      errors.push(task.sourceName + ': ID duplicado: ' + task.id + '.');
    }
    ids.add(task.id);
  }

  if (options.strict && warnings.length > 0) {
    errors.push('modo estrito: ' + warnings.length + ' aviso(s) impedem a geração.');
  }

  for (const warning of warnings) {
    process.stderr.write('Aviso: ' + warning + '\n');
  }
  if (errors.length > 0) {
    for (const error of errors) {
      process.stderr.write('Erro: ' + error + '\n');
    }
    process.exit(1);
  }

  const rows = buildRows(days, options);
  const contentManifest = buildContentManifest(days);
  if (!options.validateOnly) {
    const outputPath = path.resolve(options.output);
    const contentOutputPath = path.resolve(
      options.contentOutput || defaultContentOutput(options.output)
    );
    if (outputPath === contentOutputPath) {
      fail('--output e --content-output devem apontar para arquivos diferentes.');
    }
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.mkdirSync(path.dirname(contentOutputPath), { recursive: true });
    const csv = [HEADERS, ...rows]
      .map((row) => row.map(csvCell).join(','))
      .join('\n') + '\n';
    fs.writeFileSync(outputPath, csv, 'utf8');
    fs.writeFileSync(contentOutputPath, JSON.stringify(contentManifest, null, 2) + '\n', 'utf8');
    process.stdout.write('CSV criado: ' + outputPath + '\n');
    process.stdout.write('Conteúdo dos cards criado: ' + contentOutputPath + '\n');
  }

  process.stdout.write(
    'Validação concluída: ' +
      days.length +
      ' sprint(s), ' +
      rows.length +
      ' card(s), ' +
      HEADERS.length +
      ' propriedades, 0 erro(s), ' +
      warnings.length +
      ' aviso(s).\n'
  );
}

main();
