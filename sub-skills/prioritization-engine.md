---
name: prioritization-engine
description: Prioriza tarefas e funcionalidades com base em valor, risco e esforço.
user-invocable: false
---

## 🧠 Descrição

Ordena o backlog por critério objetivo, combinando valor para o usuário, risco técnico e esforço de implementação — produzindo uma sequência de execução que maximiza o valor entregue por ciclo de desenvolvimento.

Sela F4. A ordem de implementação não pode ser arbitrária: features de alta dependência técnica devem ser implementadas antes, features de alto risco devem ser validadas cedo, features de alto valor para a hipótese do MVP devem entrar no primeiro ciclo.

---

## 🚀 Responsabilidades

* Aplicar framework de priorização ao backlog: RICE (Reach, Impact, Confidence, Effort) ou ICE simplificado
* Identificar features com dependências técnicas que determinam a sequência mínima
* Separar e priorizar itens de infraestrutura e setup (sempre primeiro)
* Definir o primeiro sprint com foco em setup + fluxo crítico de validação do MVP
* Definir threshold de cobertura de testes a ser atingido por fase de desenvolvimento
* Documentar o raciocínio por trás das top 10 prioridades

---

## 🔥 Regras obrigatórias

* Setup de projeto e infraestrutura (CI/CD, lint, test framework) sempre no sprint 0 — nunca adiável
* Features com dependências de integração externa devem ser priorizadas no início para detectar problemas cedo
* A sequência deve permitir uma demo ou validação end-to-end do fluxo principal dentro das primeiras 2-3 semanas
* Threshold de cobertura de testes deve ser definido e registrado nesta fase — não negociado durante o desenvolvimento

---

## ⚠️ Anti-patterns (proibido)

* Priorizar por "o que é mais fácil" sem considerar valor para o MVP
* Deixar features críticas para os sprints finais por serem complexas
* Threshold de cobertura "a definir depois"
* Nenhuma critério explícito de priorização — backlog ordenado por preferência de quem tem mais voz

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `engineering.backlog[]`
* `product.metrics[]`, `feasibility.risks[]`
* `product.mvp_scope[]`

### Saídas para o OrchestratorContext
* `engineering.priorities` — backlog ordenado com score e justificativa
* `engineering.test_coverage_threshold` — threshold de cobertura acordado

### Dependências
`backlog-generation-engine`.

### Paralelismo
Nenhum — sela F4.

---

## 🎯 Objetivo final

Entregar uma sequência de execução que garanta: (1) infraestrutura pronta antes do desenvolvimento, (2) fluxo crítico de validação entregável rapidamente, (3) riscos altos tratados cedo, (4) threshold de qualidade definido antes de começar a medir.
