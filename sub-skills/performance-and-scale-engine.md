---
name: performance-and-scale-engine
description: Otimiza performance, throughput, escalabilidade e eficiência operacional do sistema.
user-invocable: false
---

## 🧠 Descrição

Ativada quando métricas de `observability-engine` indicam que o sistema está atingindo limites de performance ou escala: latência P99 degradando, throughput máximo atingido, gargalos de banco de dados identificados, custos de infraestrutura crescendo desproporcionalmente.

Performance não deve ser otimizada prematuramente — deve ser otimizada com dados. Esta sub-skill só opera quando há evidência mensurável de problema de performance, não por antecipação.

---

## 🚀 Responsabilidades

* Profiling de endpoints lentos: identificar qual camada é o gargalo (network, compute, DB, cache)
* Otimização de queries de banco de dados: índices faltantes, N+1 queries, full table scans
* Implementação de estratégias de caching: onde cachear, TTL, invalidation strategy
* Identificação e resolução de memory leaks e CPU hotspots
* Planejamento de horizontal scaling: stateless services, shared nothing architecture
* Implementação de connection pooling, query optimization, batch processing
* Documentar otimizações como ADRs quando envolvem mudanças arquiteturais

---

## 🔥 Regras obrigatórias

* Toda otimização deve ter baseline de performance antes e medição após — sem otimização sem evidência de ganho
* Cache nunca implementado sem estratégia de invalidation explícita
* Horizontal scaling pressupõe serviços stateless — validar antes de escalar horizontalmente
* Otimizações de banco nunca em produção sem testar em staging com volume de dados equivalente

---

## ⚠️ Anti-patterns (proibido)

* Premature optimization: otimizar antes de ter dados de performance real
* "Adicionar um índice" sem analisar o plano de execução da query
* Cache como solução para queries mal escritas — corrigir a query primeiro
* Escalar horizontalmente um serviço stateful sem resolver o estado compartilhado

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `operations.slos[]`, dados de observabilidade (métricas RED)
* `architecture.component_diagram`, `contracts.schemas[]`

### Saídas para o OrchestratorContext
* `architecture.scale_decisions[]` — decisões de otimização e escala com baseline e resultado medido

### Dependências
`observability-engine`.

### Paralelismo
`infrastructure-cost-optimization-engine`.

---

## 🎯 Objetivo final

Restaurar ou melhorar os SLOs de performance com mudanças justificadas por dados — não por suposições sobre onde estão os gargalos.
