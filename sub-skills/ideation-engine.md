---
name: ideation-engine
description: Estrutura ideias de produto, problemas, hipóteses e objetivos estratégicos do sistema.
user-invocable: false
---

## 🧠 Descrição

Sintetiza os outputs de `market-context-analysis`, `business-model-definition` e `persona-definition-engine` em uma estrutura coesa de problemas, hipóteses e objetivos estratégicos. É a sub-skill que transforma inteligência de mercado e personas em direção de produto.

Opera como o "produto pensante" do pipeline — não gera ideias aleatórias, mas estrutura rigorosamente os problemas que o produto precisa resolver, as hipóteses que precisam ser validadas e os objetivos estratégicos que guiarão as decisões subsequentes.

O output é a fundação sobre a qual `business-understanding-engine` aprofunda as regras de negócio e `requirements-engine` deriva os requisitos funcionais.

---

## 🚀 Responsabilidades

* Sintetizar dores de personas em problemas de produto bem definidos (problema ≠ feature)
* Estruturar hipóteses de produto testáveis: "Acreditamos que [persona] tem [problema] porque [evidência]. Se resolvermos [solução], veremos [resultado mensurável]"
* Definir objetivos estratégicos de curto (MVP), médio (V1) e longo prazo (plataforma)
* Identificar premissas críticas que devem ser validadas antes de desenvolvimento
* Mapear oportunidades de diferenciação derivadas do contexto de mercado
* Priorizar problemas por impacto e frequência nas personas primárias

---

## 🔥 Regras obrigatórias

* Problemas devem ser expressos do ponto de vista do usuário, não da solução técnica
* Hipóteses devem ser falsificáveis — se não podem ser provadas erradas, não são hipóteses
* Cada objetivo estratégico deve ter no mínimo uma métrica de sucesso associável
* Nunca avançar com objetivos vagos como "melhorar a experiência" sem definir o que melhoria significa em termos mensuráveis
* Hipóteses críticas (as que invalidariam o produto se falsas) devem ser marcadas como tais

---

## ⚠️ Anti-patterns (proibido)

* "Idea dumping" sem estruturação em problemas e hipóteses
* Objetivos estratégicos sem conexão com as dores das personas identificadas
* Hipóteses não falsificáveis ("as pessoas vão amar o produto")
* Confundir objetivo estratégico com feature list
* Ignorar conflitos entre objetivos de personas diferentes

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `market.landscape`, `market.positioning`, `market.trends[]`
* `business.model`, `business.value_proposition`
* `product.personas[]`

### Saídas para o OrchestratorContext
* `product.problems[]` — problemas estruturados por persona e impacto
* `product.hypotheses[]` — hipóteses testáveis com estrutura padrão
* `product.strategic_goals[]` — objetivos estratégicos com horizonte temporal

### Dependências
`market-context-analysis`, `business-model-definition`, `persona-definition-engine`.

### Paralelismo
Nenhum — sequencial após as 3 anteriores.

---

## 🎯 Objetivo final

Entregar uma estrutura de problemas e hipóteses que funcione como bússola para todas as decisões de produto e engenharia. Qualquer feature, requisito ou decisão arquitetural deve ser rastreável a um problema e hipótese documentados aqui.
