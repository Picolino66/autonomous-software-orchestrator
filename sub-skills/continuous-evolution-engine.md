---
name: continuous-evolution-engine
description: Planeja melhorias contínuas, evolução técnica e novas funcionalidades do sistema.
user-invocable: false
---

## 🧠 Descrição

Sintetiza os outputs de `user-feedback-engine`, `maintenance-engine` e métricas de `observability-engine` em um plano de evolução do produto para o próximo ciclo. Decide o que entra no próximo backlog e se a evolução requer retorno a F2 (mudança arquitetural) ou a F4 (novas features sobre arquitetura existente).

Esta é a sub-skill que transforma F7 em um ciclo — não um ponto final. O software não termina com o deploy; termina quando é desligado.

---

## 🚀 Responsabilidades

* Consolidar insights de `user-feedback-engine`, débito técnico de `maintenance-engine` e dados de `observability-engine`
* Priorizar o backlog de evolução por: impacto nas métricas de produto, esforço estimado, urgência técnica
* Identificar se as evoluções requerem mudança arquitetural (retorno a F2) ou apenas novas features (retorno a F4)
* Propor revisão de hipóteses de produto: quais hipóteses foram confirmadas/refutadas pelos dados reais
* Definir o escopo do próximo ciclo de evolução
* Atualizar ADRs quando evolução implica revisão de decisões arquiteturais anteriores

---

## 🔥 Regras obrigatórias

* Toda evolução arquitetural deve acionar `architectural-reassessment-engine` antes de retornar a F2
* O backlog de evolução deve ser consistente com os ADRs vigentes — nenhuma evolução que contradiz decisões arquiteturais sem revisão formal
* Ciclo de evolução deve ser timeboxed: sem backlog infinito sem entrega
* Hipóteses revisadas com dados reais devem ser documentadas como atualização de `product.hypotheses[]`

---

## ⚠️ Anti-patterns (proibido)

* Ciclo de evolução sem priorização — tudo é importante = nada é importante
* Retornar a F4 com features que na verdade requerem mudança arquitetural (passando por cima da necessidade de F2)
* Ignorar débito técnico no backlog de evolução ("só features novas")
* Evoluir produto sem revisar se as hipóteses originais foram confirmadas

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.feedback_insights[]`
* `operations.slos[]`, `product.metrics[]`
* `engineering.maintenance_log`

### Saídas para o OrchestratorContext
* `product.evolution_backlog[]` — próximo ciclo priorizado
* Decisão de loop: retorno a F2 ou F4

### Dependências
`user-feedback-engine`, `maintenance-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Garantir que cada ciclo do produto seja melhor que o anterior — informado por dados reais, com priorização clara e decisão de qual parte do pipeline reativar para executar a evolução.
