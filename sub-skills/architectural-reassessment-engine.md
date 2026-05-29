---
name: architectural-reassessment-engine
description: Reavalia arquitetura, limitações estruturais e evolução necessária conforme crescimento do sistema.
user-invocable: false
---

## 🧠 Descrição

Ativada quando o sistema atinge limites da arquitetura escolhida em F2: escala que o modular monolith não suporta, complexidade que justifica extração de microsserviços, ou acumulação de débito técnico que torna o sistema difícil de evoluir.

A reavaliação arquitetural não é falha do design original — é o reconhecimento de que arquiteturas corretas para um dado contexto tornam-se inadequadas quando o contexto muda. O problema não é mudar de arquitetura; é mudar sem avaliar o impacto corretamente.

---

## 🚀 Responsabilidades

* Avaliar o gap entre a arquitetura atual e os requisitos atuais de escala, complexidade e evolução
* Identificar bounded contexts que cresceram além dos limites do módulo atual
* Avaliar alternativas arquiteturais para o próximo estágio de escala
* Mapear o custo e risco da migração arquitetural vs. o custo de manter a arquitetura atual
* Definir estratégia de migração incremental: strangler fig, module extraction, domain event introduction
* Documentar a reavaliação como ADR que supersede as decisões anteriores
* Definir critérios de sucesso da migração arquitetural

---

## 🔥 Regras obrigatórias

* Reavaliação deve ser baseada em métricas concretas: tempo de deploy crescente, coupling alto, incidentes frequentes por mudanças simples
* Migração arquitetural nunca "big bang" — sempre incremental com rollback possível em cada etapa
* ADR de reavaliação deve referenciar os ADRs anteriores que está supersedendo com justificativa
* Custo de migração deve ser comparado com custo de não migrar (débito crescente) antes de decisão

---

## ⚠️ Anti-patterns (proibido)

* Migrar para microsserviços porque "o sistema cresceu" sem analisar se microsserviços resolvem o problema específico identificado
* Reescrever do zero em vez de migrar incrementalmente
* Reavaliação arquitetural sem trigger objetivo (métricas, incidentes, feedback de time)
* Decisão de reavaliação sem buy-in do time que vai executar a migração

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Todos os snapshots O1–O7, `architecture.adrs[]`
* `operations.slos[]`, `product.evolution_backlog[]`
* `engineering.maintenance_log`

### Saídas para o OrchestratorContext
* `architecture.reassessment_report` — análise com decisão: manter | refatorar | migrar
* `architecture.adrs[]` — ADR de evolução arquitetural adicionado

### Dependências
`continuous-evolution-engine`.

### Paralelismo
`product-strategy-engine`.

---

## 🎯 Objetivo final

Garantir que a arquitetura do sistema evolui junto com o produto de forma controlada e documentada — evitando tanto a estagnação arquitetural (não mudar quando deveria) quanto a instabilidade arquitetural (mudar sem necessidade ou sem planejamento).
