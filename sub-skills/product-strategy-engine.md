---
name: product-strategy-engine
description: Define estratégias de expansão, pivotagem, posicionamento e evolução do produto.
user-invocable: false
---

## 🧠 Descrição

Fecha o ciclo estratégico do produto: revisita a estratégia original de F1 à luz dos dados reais de produção, feedback de usuários e métricas de negócio — e define a direção do próximo ciclo de produto.

Sela F7 e, quando acionada, alimenta o retorno ao início do pipeline com contexto enriquecido. A estratégia de produto não é definida uma vez — é revisada a cada milestone com dados reais.

---

## 🚀 Responsabilidades

* Avaliar o desempenho do produto contra as métricas definidas em `metrics-definition-engine`
* Revisar hipóteses originais de `ideation-engine`: quais foram confirmadas, quais foram refutadas
* Analisar o contexto de mercado atualizado: o cenário competitivo mudou desde F1?
* Avaliar o produto atual contra o posicionamento estratégico definido
* Decidir direção do próximo ciclo: persevere (continuar na direção atual), pivot (mudar direção estratégica), scale (ampliar o que funciona)
* Definir o próximo conjunto de hipóteses e objetivos estratégicos
* Atualizar `market.landscape` e `market.positioning` com aprendizados reais

---

## 🔥 Regras obrigatórias

* Decisão de pivot deve ser baseada em dados, não em pressão de prazo ou insatisfação subjetiva
* Hipóteses refutadas devem ser documentadas como tais — não ignoradas ou reinterpretadas post-hoc
* A estratégia atualizada deve ser consistente com `architectural-reassessment-engine` — produto estratégico e arquitetura devem coevoluir
* Persevere não significa "sem mudanças" — significa continuar na direção confirmada pelos dados com refinamentos

---

## ⚠️ Anti-patterns (proibido)

* Pivot por pressão de stakeholders sem evidência de dados
* "Persevere" como decisão padrão quando os dados apontam para necessidade de mudança
* Revisão estratégica sem atualizar o contexto de mercado
* Estratégia de produto desalinhada com capacidade técnica e arquitetural atual

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.feedback_insights[]`, `product.metrics[]`
* `market.landscape`, `market.positioning`
* `product.hypotheses[]` (originais vs. resultados reais)

### Saídas para o OrchestratorContext
* `product.strategy_update` — direção do próximo ciclo com justificativa baseada em dados
* Atualização de `market.landscape` e `market.positioning`

### Dependências
`user-feedback-engine`, `continuous-evolution-engine`.

### Paralelismo
`architectural-reassessment-engine`.

---

## 🎯 Objetivo final

Garantir que a direção do produto no próximo ciclo seja informada pelo aprendizado real do ciclo atual — fechando o loop entre hipótese, execução, medição e decisão que define um ciclo de produto orientado a dados.
