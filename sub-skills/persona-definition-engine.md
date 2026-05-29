---
name: persona-definition-engine
description: Identifica e estrutura personas, perfis de usuários, dores, comportamentos e objetivos.
user-invocable: false
---

## 🧠 Descrição

Constrói o mapa humano do produto: quem são os usuários, o que os motiva, o que os frustra, como se comportam e o que definem como sucesso. Opera na abertura de F1 em paralelo com `market-context-analysis` e `business-model-definition`.

Personas mal definidas são a causa raiz de produtos tecnicamente corretos, mas funcionalmente irrelevantes. Esta sub-skill garante que todo o pipeline subsequente — arquitetura, UX, backlog, priorização — esteja ancorado em perfis de usuário reais e não em suposições do time de produto.

O output alimenta `ideation-engine`, `ux-ui-design-engine`, `requirements-engine` e `prioritization-engine`.

---

## 🚀 Responsabilidades

* Identificar grupos de usuários distintos por comportamento, objetivo e contexto de uso
* Estruturar personas com: nome, perfil demográfico básico, contexto de trabalho/vida, dores principais, objetivos, gatilhos de decisão de compra/uso, nível de maturidade tecnológica
* Mapear a diferença entre payer (quem paga) e user (quem usa), quando distintos
* Identificar anti-personas: perfis que o produto não serve e por quê
* Priorizar personas por relevância estratégica (primária, secundária, terciária)
* Documentar jobs-to-be-done por persona: o que cada uma "contrata" o produto para fazer

---

## 🔥 Regras obrigatórias

* Mínimo de 2 personas estruturadas antes de quality gate de F1 — uma persona única raramente captura a realidade
* Cada persona deve ter dores específicas e verificáveis, não genéricas ("quer ser mais produtivo")
* Personas devem ser coerentes com o mercado identificado por `market-context-analysis`
* Anti-personas devem ser explicitadas: delimitar o escopo humano do produto é tão importante quanto definir o escopo funcional
* Nunca confundir cargo/papel com persona — o mesmo cargo pode ter comportamentos opostos dependendo do contexto

---

## ⚠️ Anti-patterns (proibido)

* Personas sem dores específicas ("quer uma solução fácil de usar")
* Criar personas para todos os segmentos possíveis sem priorização
* Omitir anti-personas, gerando escopo inflado para atender todos
* Personas que contradizem o modelo de negócio (ex: persona sem disposição a pagar em modelo pago)
* Definir personas sem input de dados reais ou hipóteses verificáveis

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Descrição do produto, `product.domain`
* `market.landscape`, `market.positioning` (se disponíveis)

### Saídas para o OrchestratorContext
* `product.personas[]` — lista de personas com: nome, perfil, dores, objetivos, jobs-to-be-done, prioridade (primária/secundária)

### Dependências
Nenhuma.

### Paralelismo
`market-context-analysis`, `business-model-definition`.

---

## 🎯 Objetivo final

Entregar personas acionáveis que funcionem como filtro de decisão em todas as fases do pipeline: "isso serve à persona primária?" deve ser uma pergunta respondível com o output desta sub-skill. Sem personas claras, priorização e UX se tornam exercícios de preferência pessoal.
