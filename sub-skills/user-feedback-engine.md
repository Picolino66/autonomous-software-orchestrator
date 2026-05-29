---
name: user-feedback-engine
description: Coleta, interpreta e transforma feedbacks de usuários em melhorias estratégicas do produto.
user-invocable: false
---

## 🧠 Descrição

Fecha o loop entre o produto em produção e as decisões de evolução: coleta feedback de usuários por múltiplos canais, analisa padrões, prioriza insights e transforma evidências de uso real em insumos para `continuous-evolution-engine` e `product-strategy-engine`.

Sem feedback loop estruturado, o produto evolui baseado em suposições de quem o construiu — não nas necessidades reais de quem o usa. Esta sub-skill garante que as métricas de comportamento real e as vozes dos usuários informam cada ciclo de evolução.

---

## 🚀 Responsabilidades

* Configurar canais de coleta de feedback: in-app, suporte, NPS, entrevistas, análise de comportamento
* Analisar dados de uso (analytics, heatmaps, session recordings) para identificar fricções
* Categorizar e priorizar feedback por tema, frequência e impacto nas personas primárias
* Identificar padrões de abandono, churn e baixo engajamento com causas prováveis
* Validar hipóteses de produto com dados reais de uso (vs. hipóteses de `ideation-engine`)
* Traduzir insights de feedback em hipóteses de melhoria acionáveis
* Comparar performance atual contra `product.metrics[]` definidos em F1

---

## 🔥 Regras obrigatórias

* Feedback deve ser coletado por múltiplos canais — nenhum canal único representa a diversidade dos usuários
* Insights devem ser baseados em padrões (N usuários com o mesmo problema), não em casos únicos (1 usuário reclamou)
* Dados de comportamento (analytics) têm peso maior que opiniões não solicitadas
* Feedback negativo sobre features que não existem no escopo não é bug — é input para priorização

---

## ⚠️ Anti-patterns (proibido)

* Implementar features pedidas por 1 usuário sem validação de padrão mais amplo
* Ignorar dados de analytics em favor de opiniões de stakeholders internos
* Feedback loop que nunca resulta em ação visível para os usuários (destrói engajamento)
* Coletar NPS sem agir sobre os detratores

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `operations.observability_config`, dados de uso reais
* `product.metrics[]`, `product.personas[]`

### Saídas para o OrchestratorContext
* `product.feedback_insights[]` — insights priorizados com evidências e hipóteses de melhoria

### Dependências
`observability-engine`.

### Paralelismo
`maintenance-engine`.

---

## 🎯 Objetivo final

Garantir que as decisões de evolução do produto sejam informadas por comportamento real de usuários reais — não por suposições do time de produto sobre o que os usuários querem.
