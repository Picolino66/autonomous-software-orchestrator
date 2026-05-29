---
name: ai-docs-self-healing-engine
description: Mantém /docs como fonte primária de contexto de IA, criando e sincronizando documentação por módulo e feature com o estado real do código.
user-invocable: false
---

## 🧠 Descrição

Estabelece e mantém `/docs` como o mapa primário do projeto para navegação, manutenção e contexto de IA. Opera em F6, em paralelo com `documentation-engine` e `operational-documentation-engine`, após `quality-assurance-engine`.

Enquanto a `documentation-engine` produz documentação técnica orientada ao desenvolvedor (OpenAPI, ADRs, guia de dev), esta skill constrói uma estrutura `/docs` navegável por IA — organizada por módulo e feature — que funciona como fonte primária de contexto para qualquer agente que interaja com o projeto no futuro.

A documentação é tratada como código vivo: detecta drift entre código e docs, corrige de forma incremental e localizada, e sincroniza arquivos de agentes (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) apenas quando houver mudança estrutural ou regra global relevante.

---

## 🚀 Responsabilidades

* Criar `/docs/index.md` como ponto de entrada do projeto para IA, listando todos os módulos com links navegáveis
* Criar `/docs/modules/<module>/index.md` para cada módulo identificado em `engineering.module_map`
* Criar `/docs/modules/<module>/<feature>.md` para cada feature do módulo, seguindo o template obrigatório
* Detectar inconsistências entre documentação existente e o estado real do código (entradas, saídas, regras de negócio, fluxos, contratos)
* Corrigir documentação de forma incremental e localizada — nunca recriar tudo quando atualização pontual resolve
* Validar links internos entre arquivos `/docs` — índices não podem ter links quebrados
* Sincronizar `AGENTS.md`, `CLAUDE.md` e `GEMINI.md` apenas quando houver mudança estrutural ou regra global relevante (novo padrão de consulta, nova fonte de verdade, nova restrição de agente)
* Registrar no `OrchestratorContext` o mapa de docs criados e o status de sincronização de agentes

---

## 🔥 Regras obrigatórias

**Fluxo de navegação obrigatório** ao acessar ou atualizar qualquer documentação:
1. Ler `/docs/index.md`
2. Identificar módulo e feature
3. Ler `/docs/modules/<module>/index.md` e o `.md` da feature
4. Acessar código apenas se a documentação não bastar ou precisar validação
5. Após qualquer mudança de código, atualizar a documentação correspondente

**Template de feature obrigatório** — todo arquivo `/docs/modules/<module>/<feature>.md` deve ter:
```markdown
# Nome

## Descrição
## Localização no código
## Entrada
## Saída
## Dependências
## Regras de negócio
## Fluxo resumido
## Possíveis erros
```

**Estrutura de diretórios obrigatória:**
```
/docs
  index.md
  /modules
    /<module>
      index.md
      <feature>.md
```

* **SEMPRE** redigir todo o conteúdo de `/docs` em **português do Brasil (pt-br)** — incluindo descrições, regras de negócio, fluxos resumidos e possíveis erros
* **SEMPRE** usar `/docs/index.md` como ponto de entrada antes de qualquer acesso ao código
* **SEMPRE** atualizar o `.md` da feature em mudanças de comportamento, bugfixes, regras, entradas, saídas, dependências ou fluxo
* **SEMPRE** criar novo `.md` para nova feature ao detectar novos arquivos, endpoints, jobs ou entidades
* **SEMPRE** atualizar índices ao adicionar, mover, renomear ou remover features
* **NUNCA** acessar código diretamente sem antes verificar se `/docs` já responde à questão

---

## ⚠️ Anti-patterns (proibido)

* Ignorar `/docs` e ir direto ao código sem necessidade
* Criar documentação genérica, vaga, duplicada ou fora de `/docs`
* Recriar toda a documentação quando atualização localizada e incremental resolve
* Quebrar a estrutura de diretórios ou o template obrigatório de feature
* Deixar índices com links quebrados ou features sem referência no índice do módulo
* Alterar `AGENTS.md`, `CLAUDE.md` ou `GEMINI.md` sem relevância estrutural ou regra global
* Documentar o que deveria existir em vez do que realmente existe no código
* Duplicar informação já presente na documentação técnica da `documentation-engine`

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `engineering.module_map` — mapa de módulos e features para estruturar `/docs/modules/`
* `architecture.*` — padrão arquitetural, camadas, decisões (ADRs) para contexto de módulos
* `contracts.api_spec` — contratos de API para documentar entradas/saídas das features de API
* `product.business_rules` — regras de negócio para seção "Regras de negócio" dos `.md`
* Snapshots O1–O5 — contexto acumulado de produto, decisões e implementação

### Saídas para o OrchestratorContext
* `documentation.docs_index` — estrutura de `/docs` criada (lista de módulos e features documentados)
* `documentation.module_docs_map` — mapa `{ module: { features: [string], index_path: string } }`
* `documentation.agents_synced` — booleano indicando se `AGENTS.md`/`CLAUDE.md`/`GEMINI.md` foram atualizados e quais regras foram adicionadas

### Dependências
`quality-assurance-engine`.

### Paralelismo
`documentation-engine`, `operational-documentation-engine`.

---

## 🎯 Objetivo final

Tornar `/docs` o mapa primário do projeto para qualquer agente de IA — presente ou futuro — navegar, entender e evoluir o sistema sem precisar varrer o código-fonte, reduzindo custo de contexto e garantindo que a documentação reflita sempre o estado real do sistema.
