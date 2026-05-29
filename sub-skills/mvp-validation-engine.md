---
name: mvp-validation-engine
description: Valida hipóteses de produto e define MVPs para aprendizado rápido e redução de risco.
user-invocable: false
---

## 🧠 Descrição

Define o Minimum Viable Product com rigor metodológico: não o menor produto possível, mas o produto mínimo que permite validar a hipótese central do negócio com o menor custo possível. Opera após `feasibility-analysis-engine` com veredicto favorável.

A distinção entre "mínimo viável" e "mínimo possível" é crítica. Um MVP que não valida a hipótese principal é desperdício de recursos. Um MVP sobrecarregado de features desperdiça o mesmo recurso. Esta sub-skill garante que o MVP seja calibrado para aprendizado máximo com investimento mínimo.

Seu output define o escopo exato do primeiro ciclo de entrega e alimenta `metrics-definition-engine` com as métricas de validação.

---

## 🚀 Responsabilidades

* Identificar a hipótese central que o MVP deve validar
* Definir o conjunto mínimo de features que valida essa hipótese (não mais, não menos)
* Estruturar o experimento de validação: o que medir, como medir, qual é o critério de sucesso
* Identificar o perfil de usuário para o experimento de validação (early adopters)
* Mapear o que o MVP deliberadamente não resolve e por quê
* Estimar o investimento necessário para o MVP e validar contra o modelo de negócio
* Definir o threshold de pivot vs. persevere baseado nos resultados do MVP

---

## 🔥 Regras obrigatórias

* O MVP deve validar exatamente 1 hipótese central — múltiplas hipóteses paralelas produzem resultados ambíguos
* O critério de sucesso do MVP deve ser definido antes do desenvolvimento, não depois
* Features que não contribuem para validar a hipótese central são excluídas do MVP, independente do esforço de implementação
* Prazo do MVP deve ser curto o suficiente para que o aprendizado ainda seja relevante estrategicamente
* Nunca confundir MVP com produto incompleto: MVP pode ter poucos fluxos, mas os que tem devem funcionar sem falhas

---

## ⚠️ Anti-patterns (proibido)

* MVP com features de "nice to have" que não contribuem para validação da hipótese
* Critério de sucesso definido após ver os resultados ("foi bem, é sucesso")
* MVP que leva mais de 3 meses para ser entregue — perde a janela de aprendizado rápido
* Validar com usuários que não representam a persona primária
* Não definir o que acontece se o MVP falhar (pivot strategy)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `feasibility.verdict`, `feasibility.risks[]`
* `product.hypotheses[]`, `product.strategic_goals[]`
* `scope.included[]`, `scope.phasing`
* `product.personas[]`

### Saídas para o OrchestratorContext
* `product.mvp_hypothesis` — hipótese central a validar
* `product.mvp_scope[]` — features exatas do MVP
* `product.learning_metrics[]` — métricas de validação com thresholds de sucesso

### Dependências
`feasibility-analysis-engine`.

### Paralelismo
`metrics-definition-engine`.

---

## 🎯 Objetivo final

Definir o MVP como um experimento científico: hipótese clara, método de validação definido, critério de sucesso estabelecido. O output deve permitir que o time construa o MVP sabendo exatamente o que deve ser verdade ao final para justificar continuar investindo.
