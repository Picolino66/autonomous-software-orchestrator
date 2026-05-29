---
name: orchestration-engine
description: Gerencia filas, eventos, workers, jobs e processamento assíncrono distribuído do sistema.
user-invocable: false
---

## 🧠 Descrição

Ativada quando o sistema requer processamento assíncrono: filas de mensagens, event bus, background jobs, workers e processamento batch. Implementa a camada de orquestração assíncrona que desacopla produtores de consumidores e viabiliza operações de longa duração.

Processamento assíncrono mal implementado é uma das principais fontes de bugs silenciosos em produção: mensagens perdidas, eventos processados múltiplas vezes, jobs que falham silenciosamente. Esta sub-skill garante que toda operação assíncrona tenha garantias explícitas.

---

## 🚀 Responsabilidades

* Configurar message broker/queue: RabbitMQ, Kafka, SQS, Redis Streams conforme stack
* Implementar producers de eventos com garantia de entrega (at-least-once mínimo)
* Implementar consumers idempotentes com processamento exactly-once quando crítico
* Configurar dead-letter queues (DLQ) para mensagens que excedem tentativas de retry
* Implementar background jobs e agendamento (cron jobs, scheduled tasks)
* Configurar monitoramento de filas: profundidade, latência de processamento, taxa de erro
* Definir estratégia de retry com backoff exponencial para cada tipo de job/consumer

---

## 🔥 Regras obrigatórias

* Toda mensagem crítica deve ter confirmação de processamento (acknowledgment) — sem fire-and-forget para operações de negócio
* Idempotência é obrigatória para todos os consumers — o sistema deve estar correto se uma mensagem for processada duas vezes
* DLQ é obrigatória para toda fila — mensagens que falham não devem ser descartadas silenciosamente
* Monitoramento de profundidade de fila deve gerar alerta antes de backup crítico
* Backoff exponencial com jitter em todos os retries — evita thundering herd

---

## ⚠️ Anti-patterns (proibido)

* Consumers sem idempotência em operações de escrita
* Fire-and-forget para operações com impacto financeiro ou de dados críticos
* DLQ sem monitoramento e processo de reprocessamento definido
* Retry agressivo sem backoff exponencial
* Jobs sem timeout definido (jobs zumbi que ficam presos indefinidamente)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.communication_patterns`, `architecture.async_config`
* `architecture.tech_stack`
* `engineering.backlog[]` (stories que requerem processamento assíncrono)

### Saídas para o OrchestratorContext
* `architecture.async_config` — configuração completa de mensageria, filas e jobs

### Dependências
`backend-development-engine` (partes síncronas implementadas).

### Paralelismo
Desenvolvimento contínuo de outros módulos.

---

## 🎯 Objetivo final

Implementar processamento assíncrono com garantias explícitas de entrega, idempotência e observabilidade — eliminando a categoria de bugs silenciosos que só aparecem em produção sob carga real.
