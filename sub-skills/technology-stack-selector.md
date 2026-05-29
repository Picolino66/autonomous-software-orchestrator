---
name: technology-stack-selector
description: Seleciona tecnologias, frameworks, ferramentas e padrões técnicos do projeto.
user-invocable: false
---

## 🧠 Descrição

Decide as tecnologias que o sistema utilizará em cada camada: linguagens de programação, frameworks backend e frontend, bancos de dados, ORMs, ferramentas de mensageria, bibliotecas de teste e ferramentas de desenvolvimento.

Opera após `infrastructure-strategy-engine` pois a stack tecnológica deve ser compatível com a infraestrutura definida. A decisão de stack é bloqueante para todas as sub-skills de F5 — desenvolvedores não podem começar sem saber com o que trabalham.

A seleção deve ser baseada em evidências objetivas, não em modismo ou preferência pessoal.

---

## 🚀 Responsabilidades

* Selecionar linguagens de programação por camada/serviço com justificativa
* Escolher frameworks backend: considerando maturidade, ecossistema, performance e fit com o domínio
* Escolher frameworks/libs frontend: framework principal, estado, roteamento, UI components
* Selecionar banco(s) de dados: relacional, documento, cache, busca — com justificativa por caso de uso
* Escolher ferramentas de mensageria quando assíncrono está no escopo
* Definir ferramentas de teste por camada: unit, integration, e2e
* Mapear compatibilidade entre escolhas de stack e `architecture.infrastructure_strategy`
* Documentar decisões de stack como ADR com alternativas consideradas

---

## 🔥 Regras obrigatórias

* Toda escolha de tecnologia deve ter justificativa baseada em requisitos — nunca escolha por "é o que o time conhece" como único critério (apesar de ser critério legítimo)
* Stack deve ser compatível com os SLOs definidos: uma linguagem single-threaded para workloads CPU-bound é incompatível com SLO de latência
* Número de tecnologias diferentes deve ser minimizado — complexidade operacional cresce com heterogeneidade
* Tecnologias com menos de 2 anos de maturidade em produção exigem análise de risco explícita
* Versões de tecnologias devem ser fixadas — nunca "latest"

---

## ⚠️ Anti-patterns (proibido)

* "Vamos usar X porque é o que está em alta" sem análise de adequação
* Micro-stacks: um serviço diferente por linguagem em um time pequeno
* Banco de dados escolhido antes de entender o modelo de dados
* Stack incompatível com a infraestrutura escolhida (ex: linguagem que não tem runtime serverless maduro)
* Não registrar alternativas consideradas — dificulta revisão futura

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.*` (pattern, layer_map, communication_patterns, infrastructure_strategy)
* `requirements.non_functional[]`, `feasibility.constraints[]`

### Saídas para o OrchestratorContext
* `architecture.tech_stack` — stack detalhada por camada com versões e justificativa
* `architecture.adrs[]` — ADR de stack selection adicionado

### Dependências
`infrastructure-strategy-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Produzir uma stack tecnológica coerente, justificada e compatível com todos os requisitos identificados. O ADR de stack deve ser confortável o suficiente para ser defendido em revisão arquitetural — não uma escolha que ninguém questiona porque ninguém quer ser o responsável.
