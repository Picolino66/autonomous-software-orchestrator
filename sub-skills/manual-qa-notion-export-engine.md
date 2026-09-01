---
name: manual-qa-notion-export-engine
description: Converte telas e jornadas em uma campanha diária de QA manual para pessoas não técnicas, criando cards do Notion com poucas propriedades de controle e o roteiro detalhado no corpo da página.
user-invocable: false
---

## 🧠 Descrição

Transformar o comportamento visível do sistema em roteiros executáveis no navegador por uma pessoa sem conhecimento de programação. Organizar os roteiros em dias de trabalho, transformar cada tarefa em card e cada dia em sprint no Notion.

Manter somente dados usados para filtrar, ordenar ou priorizar como propriedades. Colocar objetivo, preparação, perfil, dados de teste, passos, resultado esperado e campos de relato no corpo do card.

Esta sub-skill complementa testes automatizados e revisão técnica. Ela não testa API, código, invasão ou segurança ofensiva e nunca considera um roteiro gerado como teste executado.

## 🚀 Responsabilidades

* Ler primeiro a documentação fonte de verdade e validar rotas, menus, telas, papéis, estados e regras no código quando necessário
* Inventariar fluxos visíveis, incluindo sucesso, erro, vazio, carregamento, confirmação, cancelamento, navegação e responsividade
* Ordenar os dias conforme a operação real e as dependências dos dados criados
* Dimensionar cada dia para a duração solicitada; usar 2 a 3 horas quando não houver orientação
* Escrever instruções simples, com ações visíveis como clicar, escrever, salvar, voltar e atualizar
* Criar IDs estáveis no formato QA-<SUPERFÍCIE>-Dxx-Tyy, salvo convenção existente
* Criar títulos ordenáveis no formato `Dxx.yy — ação curta`, em que `xx` é o dia e `yy` é a sequência da tarefa
* Produzir um Markdown por dia, uma linha CSV por tarefa e um conteúdo de página por card
* Gerar referências visuais de correto e incorreto quando solicitadas
* Validar estrutura, IDs, dependências, links, imagens, propriedades e conteúdo dos cards
* Atualizar índices e contexto do orquestrador sem marcar testes como executados

## 🔄 Fluxo obrigatório

1. Consultar docs/index.md e os índices dos módulos antes de inspecionar código.
2. Mapear superfície, telas, rotas, menus, papéis, permissões e regras críticas.
3. Ordenar por dependência operacional: acesso → cadastros-base → operação → fechamento → permissões → regressão.
4. Definir dados fictícios reutilizáveis e o que deve ser preservado entre os dias.
5. Criar a campanha seguindo Módulo → Feature → Tarefa → Passos.
6. Criar assets/dia-XX quando referências visuais fizerem parte do escopo.
7. Gerar o CSV enxuto e o manifesto de conteúdo com scripts/export-manual-qa-notion.mjs.
8. Importar o CSV como banco de dados do Notion ou criar o banco diretamente pelo conector.
9. Configurar um quadro Kanban sem filtros, agrupado por Status e ordenado por Tarefa crescente.
10. Exibir no cartão somente Tarefa, Sprint e Prioridade; preencher o corpo de cada card com o manifesto usando conector ou API do Notion.
11. Conferir cobertura, ordenação, visibilidade e registrar a campanha como PLANEJADA no OrchestratorContext.

## 📝 Contrato dos arquivos diários

Cada arquivo deve representar exatamente um dia:

    docs/qa-web/
      dia-01-acesso-e-navegacao.md
      dia-02-cadastros-base.md
      assets/
        dia-01/
          correto.png
          incorreto.png

Cada dia deve declarar título, tempo estimado, perfil usado, objetivo, preparação geral, dados preservados e navegação entre dias.

Cada tarefa deve conter:

* ID e título
* objetivo
* preparação
* dados fictícios
* passos numerados
* resultado esperado
* registro com Passou, Falhou e Bloqueado
* resultado obtido, evidência, problema encontrado e impacto

Usar impactos compreensíveis: Impede continuar, Atrapalha bastante, Atrapalha pouco e Somente visual.

## 🔑 Propriedades e quadro do Notion

Criar somente as quatro propriedades abaixo. A ordenação não exige uma propriedade `Ordem`: o prefixo do título é a chave determinística de ordenação.

| Propriedade | Tipo sugerido | Uso |
|---|---|---|
| Tarefa | Título | Nome ordenável no formato `Dxx.yy — ação curta` |
| Status | Seleção | Não iniciado, A fazer, Fazendo, Finalizado ou Reprovado |
| Sprint | Seleção | Dia de trabalho |
| Prioridade | Seleção | Crítica, Alta ou Normal |

O banco deve ter um quadro Kanban por `Status`, sem filtros e com ordenação crescente por `Tarefa`. Exibir no card somente `Tarefa`, `Sprint` e `Prioridade`.

Não criar propriedades para ID, Ordem, Módulo, Feature, Perfil, Objetivo, Preparação, Dados de teste, Passos, Resultado esperado, Resultado obtido, Evidência, Problema, Dependência, Impacto ou Arquivo de origem. Esses dados pertencem ao corpo do card.

## 📄 Corpo do card

Preencher abaixo das propriedades, preservando esta estrutura:

    ## Roteiro

    **Feature:** ...
    **Perfil:** ...
    **Dependência:** ...

    ### Objetivo
    ...

    ### Preparação
    ...

    ### Dados de teste
    ...

    ### Passos
    - [ ] 1. ...
    - [ ] 2. ...

    ### Resultado esperado
    ...

    ---

    ## Registro da execução
    **Resultado obtido:**

    **Evidência:**

    **Problema encontrado:**

    **Arquivo de origem:** ...

Exigir print ou vídeo quando Status for Reprovado. Registrar o impacto no corpo como: Impede continuar, Atrapalha bastante, Atrapalha pouco ou Somente visual.

## 📦 Exportação e limitação do CSV

O importador CSV do Notion transforma linhas em páginas do banco e colunas em propriedades. Ele não preenche o corpo abaixo das propriedades.

Por isso, gerar dois artefatos:

1. CSV com somente as quatro propriedades de controle.
2. Arquivo .content.json com o Markdown do corpo de cada card, identificado pelo título ordenável.

Quando houver conector ou API disponível:

1. Criar ou importar os cards com as quatro propriedades de controle.
2. Localizar cada card pelo título `Dxx.yy — ação curta`.
3. Converter bodyMarkdown em blocos do Notion.
4. Anexar os blocos como conteúdo da página.
5. Confirmar que nenhum campo descritivo virou propriedade.

Quando houver somente importação manual por CSV, importar o CSV e informar que o corpo ainda não foi preenchido. Não criar colunas descritivas para esconder essa limitação. Usar o manifesto para copiar o conteúdo manualmente ou hidratá-lo depois.

## 🛠️ Recurso determinístico

Executar da raiz da superskill:

    node scripts/export-manual-qa-notion.mjs \
      --input /caminho/do/projeto/docs/qa-web \
      --output /caminho/do/projeto/docs/qa-web-notion.csv

O comando gera também docs/qa-web-notion.content.json. Usar --content-output para escolher outro caminho, --validate-only para não gravar e --strict para transformar avisos em erros.

## 🔥 Regras obrigatórias

* Redigir tudo em português do Brasil
* Usar somente ações visíveis e compreensíveis para a pessoa testadora
* Usar apenas dados fictícios; nunca registrar credenciais, URLs privadas, tokens ou dados pessoais
* Identificar imagem simulada como resultado esperado ilustrativo
* Preservar ordem e rastreabilidade entre os dias
* Não declarar Passou, Falhou ou Bloqueado antes da execução humana
* Manter exatamente as quatro propriedades do padrão; se um dado não é Tarefa, Status, Sprint ou Prioridade, colocá-lo no corpo
* Ordenar o quadro por Tarefa crescente em todas as colunas; não usar ordem manual ou data de criação como critério
* Não afirmar que o CSV sozinho preenche o corpo do card
* Não substituir testes automatizados, técnicos, de segurança ou acessibilidade

## ⚠️ Anti-patterns (proibido)

* Criar uma propriedade para cada trecho descritivo
* Criar ID, Ordem, Módulo, Impacto ou qualquer outro campo adicional sem autorização explícita
* Usar uma propriedade longa chamada Passos, Objetivo ou Resultado esperado
* Um arquivo por tarefa quando o contrato é um arquivo por dia
* Um único card por dia contendo todas as tarefas
* Passos técnicos como chamar endpoint, ver console ou alterar banco
* Dias que apagam dados necessários para o seguinte
* CSV montado manualmente sem validação
* Captura ilustrativa apresentada como evidência real
* Status preenchido durante a geração do planejamento
* Quadro sem agrupamento por Status, com filtros indevidos ou sem ordenação crescente por Tarefa
* Prometer corpo preenchido após uma importação exclusivamente CSV

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext

* product.personas e product.business_rules
* ux.validated_journeys e ux.accessibility_compliance
* engineering.module_map e agentic.docs_map
* quality.qa_report
* rotas, menus e implementação visível quando a documentação não bastar

### Saídas para o OrchestratorContext

* quality.manual_qa_campaign — diretório, superfície, dias, tarefas, perfis, status e cobertura
* quality.manual_qa_notion_export — CSV, manifesto de conteúdo, propriedades, cards, sprints, modo de hidratação e validação

### Dependências

quality-assurance-engine. A documentação existente deve ser consultada; ai-docs-self-healing-engine pode operar em paralelo.

### Paralelismo

documentation-engine, operational-documentation-engine e ai-docs-self-healing-engine, desde que não editem os mesmos arquivos.

## 🎯 Objetivo final

Entregar uma campanha que uma pessoa não técnica consiga executar e cards do Notion limpos: poucas propriedades para gestão e todo o roteiro legível no corpo da página, sem confundir planejamento com execução.
