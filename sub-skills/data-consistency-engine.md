---
name: data-consistency-engine
description: Estrutura transações, consistência, concorrência e integridade de dados do sistema.
user-invocable: false
---

## 🧠 Descrição

Define como o sistema garante integridade e consistência dos dados em cenários de concorrência, falhas parciais e operações distribuídas. Complementa `data-modeling-engine` (estrutura) e `api-contract-engine` (contratos) com as garantias de comportamento sob carga e falha.

Este é frequentemente o aspecto mais negligenciado do design de sistemas — times descobrem problemas de consistência em produção, sob carga real, quando o custo de correção é máximo. Definir o modelo de consistência em F3 evita surpresas em F7.

---

## 🚀 Responsabilidades

* Definir o modelo de consistência do sistema: strong consistency, eventual consistency ou causal consistency — por domínio quando necessário
* Mapear os limites de transação: quais operações devem ser atômicas e em que nível (banco, aplicação, saga)
* Definir estratégia de concorrência: optimistic locking, pessimistic locking, ou eventual com conflict resolution
* Identificar operações que requerem idempotência e definir o mecanismo de idempotency key
* Definir estratégia de saga para transações distribuídas (quando microsserviços)
* Especificar comportamento de retry: quando retornar, com qual backoff, qual o limite
* Definir estratégia de compensação: o que acontece quando uma transação parcial falha

---

## 🔥 Regras obrigatórias

* Toda operação de escrita com impacto financeiro ou de estoque deve ter transação explícita e idempotência obrigatória
* Eventual consistency é uma escolha legítima, mas deve ser explícita e seus impactos visíveis ao usuário devem ser planejados
* Nunca deixar consistência de dados para ser resolvida "na implementação" — os limites de transação devem estar no design
* Operações que envolvem múltiplos serviços em microsserviços devem usar saga pattern com compensação definida
* Idempotency keys devem ser definidas antes de qualquer implementação de API de escrita

---

## ⚠️ Anti-patterns (proibido)

* Transações distribuídas via 2PC em microsserviços — alto acoplamento e baixa disponibilidade
* "Vamos usar eventual consistency e ver o que acontece" sem definir o comportamento visível ao usuário
* Retry sem idempotência — cria duplicação de dados ou side effects repetidos
* Ignoring race conditions porque "não vão acontecer" em sistemas single-user (vão acontecer em produção)
* Timeout de banco de dados indefinido

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `contracts.schemas[]`, `contracts.api_spec`
* `architecture.pattern`, `architecture.communication_patterns`
* `product.business_rules[]`

### Saídas para o OrchestratorContext
* `contracts.consistency_model` — modelo de consistência escolhido
* `contracts.transaction_boundaries[]` — limites transacionais por domínio
* `contracts.concurrency_strategy` — estratégia de concorrência e conflict resolution

### Dependências
`api-contract-engine`.

### Paralelismo
Nenhum — sela F3.

---

## 🎯 Objetivo final

Garantir que os contratos de dados do sistema incluam garantias de comportamento sob concorrência e falha — não apenas a estrutura dos dados em si. Consistência é uma propriedade do sistema, não uma propriedade do banco de dados.
