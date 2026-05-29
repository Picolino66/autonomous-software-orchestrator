---
name: scope-definition-engine
description: Define escopo do projeto, limites funcionais, prioridades e exclusões do sistema.
user-invocable: false
---

## 🧠 Descrição

Define explicitamente o que está dentro e fora do produto, em qual fase, com qual prioridade. Transforma a lista de requisitos em um escopo executável com limites claros.

Sem escopo definido, projetos sofrem de scope creep — o acúmulo gradual de "e se a gente também fizer isso" que transforma produtos focados em sistemas inchados e difíceis de entregar. Esta sub-skill torna o escopo uma decisão explícita, não uma consequência acidental.

Opera após `requirements-engine` e fornece insumo para `feasibility-analysis-engine`, `backlog-generation-engine` e `technical-planning-engine`.

---

## 🚀 Responsabilidades

* Delimitar o escopo incluído no produto (funcionalidades, fluxos, integrações)
* Documentar explicitamente o que está excluído e por quê
* Definir faseamento: o que vai no MVP, V1, V2+
* Estabelecer critérios objetivos para inclusão/exclusão de funcionalidades
* Identificar dependências externas que impactam o escopo
* Alinhar escopo com o modelo de negócio e proposta de valor central
* Proteger o escopo do MVP contra adições que comprometam velocidade de entrega

---

## 🔥 Regras obrigatórias

* O escopo do MVP deve ser o mínimo necessário para validar a hipótese principal — não o mínimo possível de implementar
* Toda exclusão deve ter justificativa documentada: "excluído porque [razão]" — nunca escopo reduzido por conveniência sem justificativa
* Funcionalidades "nice to have" não entram no MVP sem evidência de que são necessárias para validação da hipótese
* O escopo deve ser consistente com o modelo de negócio: funcionalidades que não suportam a proposta de valor primária são candidatas à exclusão
* Nunca ampliar escopo durante F1 sem `requirements-engine` validar o novo requisito

---

## ⚠️ Anti-patterns (proibido)

* "Deixar em aberto" — toda funcionalidade deve ter decisão explícita de inclusão/exclusão/fase
* MVP com mais de 3-5 fluxos core (indício de escopo não cortado o suficiente)
* Excluir funcionalidades críticas à proposta de valor por serem "difíceis"
* Incluir integrações complexas no MVP sem validação de que são necessárias
* Escopo definido sem input das personas primárias

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `requirements.functional[]`, `requirements.non_functional[]`, `requirements.constraints[]`
* `business.model`, `business.value_proposition`
* `product.personas[]`, `product.strategic_goals[]`

### Saídas para o OrchestratorContext
* `scope.included[]` — funcionalidades e fluxos incluídos com fase de entrega
* `scope.excluded[]` — funcionalidades excluídas com justificativa
* `scope.boundaries` — limites explícitos do sistema
* `scope.phasing` — roadmap de fases (MVP → V1 → V2+)

### Dependências
`requirements-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Entregar um escopo com limites inequívocos que sirvam como referência para todas as decisões de priorização, arquitetura e desenvolvimento. O escopo deve ser defensável: qualquer adição deve justificar por que não viola os critérios estabelecidos.
