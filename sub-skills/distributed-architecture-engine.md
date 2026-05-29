---
name: distributed-architecture-engine
description: Implementa arquiteturas distribuídas, microsserviços e comunicação desacoplada entre serviços.
user-invocable: false
---

## 🧠 Descrição

Ativada apenas quando `architecture.pattern == 'microservices'`. Implementa os componentes de infraestrutura que tornam microsserviços operacionais: API gateway, service discovery, service mesh, distributed tracing e configuração centralizada.

A diferença entre "um monolito dividido em processos separados" e "microsserviços" está nesta camada: sem service discovery, distributed tracing e circuit breakers, microsserviços herdam toda a complexidade operacional sem os benefícios de isolamento.

---

## 🚀 Responsabilidades

* Configurar API gateway: roteamento, rate limiting, autenticação centralizada, transformação de requests
* Implementar service discovery: registro e descoberta dinâmica de serviços
* Configurar distributed tracing: propagação de trace context entre serviços (OpenTelemetry)
* Implementar circuit breakers e retry policies entre serviços
* Configurar service mesh quando a escala justifica (Istio, Linkerd)
* Implementar configuração centralizada: environment-specific configs sem rebuild
* Definir estratégia de health checks por serviço

---

## 🔥 Regras obrigatórias

* Distributed tracing é obrigatório em microsserviços — sem ele, debugging de problemas cross-service é cego
* Circuit breaker deve ser configurado para toda chamada síncrona entre serviços
* API gateway é o único ponto de entrada externo — nenhum serviço exposto diretamente
* Health checks devem distinguir liveness (processo vivo) de readiness (pronto para receber tráfego)

---

## ⚠️ Anti-patterns (proibido)

* Microsserviços sem distributed tracing — torna incidentes em produção praticamente impossíveis de debugar
* Chamadas diretas entre serviços sem circuit breaker
* Serviços com configuração hardcoded por ambiente sem mecanismo de configuração centralizada
* Expor serviços internos diretamente sem passar pelo API gateway

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.services[]`, `architecture.communication_patterns`
* `architecture.infrastructure_strategy`, `architecture.tech_stack`
* `contracts.api_spec`

### Saídas para o OrchestratorContext
* `architecture.distributed_config` — API gateway, service discovery, tracing, circuit breakers configurados

### Dependências
`backend-development-engine` (pelo menos 1 serviço parcialmente implementado).

### Paralelismo
Desenvolvimento contínuo dos serviços.

---

## 🎯 Objetivo final

Tornar os microsserviços operacionalmente viáveis em produção — não apenas distribuídos em processos separados. Um sistema de microsserviços sem esta camada de infraestrutura distribuída é mais difícil de operar do que o monolito que substituiu.
