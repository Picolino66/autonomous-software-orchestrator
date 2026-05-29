---
name: metrics-definition-engine
description: Define métricas, KPIs e indicadores de sucesso do produto e sistema.
user-invocable: false
---

## 🧠 Descrição

Estrutura o sistema de métricas que permitirá ao produto e ao sistema serem gerenciados com base em dados reais. Vai além das métricas de vaidade — define indicadores que medem progresso real em direção aos objetivos estratégicos.

Opera em paralelo com `mvp-validation-engine` após `feasibility-analysis-engine`. Enquanto `mvp-validation-engine` define métricas específicas do experimento MVP, esta sub-skill define o sistema completo de métricas que cobrirá produto, engenharia e operações ao longo de todo o ciclo de vida.

O output alimenta `observability-engine` (F7) e `post-deployment-validation-engine` (F6) com os indicadores que devem ser monitorados em produção.

---

## 🚀 Responsabilidades

* Definir North Star Metric: o único indicador que melhor captura o valor entregue ao usuário
* Estruturar métricas de produto: ativação, engajamento, retenção, receita, referência (AARRR quando aplicável)
* Definir métricas técnicas: latência, disponibilidade, taxa de erros, cobertura de testes
* Estabelecer KPIs de negócio alinhados com o modelo de negócio (`business.model`)
* Definir frequência de medição e responsáveis por cada métrica
* Identificar métricas de leading indicator (preveem o futuro) vs. lagging indicator (confirmam o passado)
* Estabelecer thresholds de alerta e de ação para métricas críticas

---

## 🔥 Regras obrigatórias

* Cada KPI deve ter: definição precisa, fórmula de cálculo, fonte de dados, frequência, threshold de sucesso
* A North Star Metric deve capturar valor para o usuário, não apenas atividade interna (ex: "pedidos entregues com sucesso" > "pedidos criados")
* Métricas técnicas devem incluir SLOs para disponibilidade e latência antes de qualquer deploy
* Nenhuma métrica de vaidade (page views, downloads) sem contrapartida de métrica de valor
* Métricas devem ser instrumentadas antes do deploy — nunca retrofitadas após problemas em produção

---

## ⚠️ Anti-patterns (proibido)

* Excesso de métricas sem hierarquia — impossibilita foco
* Métricas sem fonte de dados definida ("mediremos isso depois")
* Confundir output metric com outcome metric
* Métricas que podem ser manipuladas sem melhorar o produto real
* Não definir o que fazer quando uma métrica atinge threshold crítico

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.strategic_goals[]`, `business.model`, `business.value_proposition`
* `scope.included[]`, `feasibility.constraints[]`

### Saídas para o OrchestratorContext
* `product.metrics[]` — KPIs com definição, fórmula, frequência, threshold e responsável

### Dependências
`feasibility-analysis-engine`.

### Paralelismo
`mvp-validation-engine`.

---

## 🎯 Objetivo final

Entregar um sistema de métricas que permita gerenciar o produto com dados em vez de intuição, detectar problemas antes que se tornem crises e tomar decisões de pivot ou persevere com evidências concretas.
