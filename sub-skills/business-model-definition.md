---
name: business-model-definition
description: Define modelo de negócio, monetização, proposta de valor e estratégia financeira do sistema.
user-invocable: false
---

## 🧠 Descrição

Define como o produto gera e captura valor no mercado. Opera em paralelo com `market-context-analysis` e `persona-definition-engine` na Fase 1, fornecendo o arcabouço econômico que guia todas as decisões de escopo, priorização e arquitetura subsequentes.

Sem modelo de negócio claro, o sistema não tem critério objetivo para priorizar features, dimensionar infraestrutura ou definir quais requisitos não funcionais são críticos (ex: um SaaS B2B tem exigências de compliance e uptime completamente diferentes de um MVP consumer).

O output desta sub-skill é insumo direto para `scope-definition-engine`, `feasibility-analysis-engine` e `prioritization-engine`.

---

## 🚀 Responsabilidades

* Definir o modelo de negócio primário (SaaS, marketplace, transacional, licença, freemium, etc.)
* Estruturar as fontes de receita (revenue streams) com lógica de monetização
* Articular a proposta de valor em termos de problema resolvido e ganho entregue
* Identificar segmentos de clientes pagantes vs. usuários não pagantes
* Definir estrutura de custos de alto nível (infraestrutura, people, CAC, COGS)
* Mapear canais de distribuição e aquisição previstos
* Identificar parceiros e recursos-chave para viabilizar o modelo
* Estabelecer hipóteses financeiras básicas para validação pelo `mvp-validation-engine`

---

## 🔥 Regras obrigatórias

* O modelo de negócio deve ser consistente com o posicionamento de `market-context-analysis` — não aceitar modelo que contradiz o contexto competitivo sem justificativa explícita
* Toda fonte de receita deve ter mecanismo de cobrança claramente definido (quem paga, quanto, quando, como)
* A proposta de valor deve ser expressa em linguagem do cliente, não em funcionalidades do sistema
* Modelos freemium devem definir explicitamente o que está no plano gratuito e por que o usuário upgradearia
* Nunca definir modelo de negócio sem identificar o payer (quem efetivamente paga) e o user (quem usa)

---

## ⚠️ Anti-patterns (proibido)

* "Vamos monetizar depois" — modelo de negócio indefinido invalida o planejamento financeiro e de escopo
* Confundir proposta de valor com lista de features
* Definir pricing sem validar disposição a pagar com personas
* Assumir que um modelo funciona porque funciona para um concorrente
* Modelos com mais de 3 fontes de receita primárias para um MVP — complexidade excessiva antes de validação

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Descrição inicial do produto
* `market.landscape`, `market.competitors[]`, `market.positioning`
* `product.domain`

### Saídas para o OrchestratorContext
* `business.model` — tipo e estrutura do modelo de negócio
* `business.revenue_streams[]` — fontes de receita com lógica de monetização
* `business.value_proposition` — proposta de valor estruturada

### Dependências
Nenhuma — pode iniciar em paralelo com `market-context-analysis`.

### Paralelismo
`market-context-analysis`, `persona-definition-engine`.

---

## 🎯 Objetivo final

Estabelecer o modelo econômico do produto de forma que cada decisão técnica — de escopo a infraestrutura — possa ser avaliada contra critérios de negócio objetivos. O output deve responder: quem paga, quanto, por quê e como o sistema captura esse valor.
