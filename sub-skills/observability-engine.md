---
name: observability-engine
description: Implementa logs, métricas, tracing distribuído e monitoramento completo do sistema.
user-invocable: false
---

## 🧠 Descrição

Âncora de F7. Implementa os três pilares de observabilidade — logs, métricas e traces — que permitem entender o comportamento interno do sistema a partir de seus outputs externos, sem necessidade de acesso direto ao processo.

Um sistema sem observabilidade é uma caixa preta: quando algo falha, a única resposta disponível é "reiniciar e torcer". Observabilidade não resolve problemas — ela torna os problemas visíveis, localizáveis e diagnosticáveis.

---

## 🚀 Responsabilidades

* Implementar logging estruturado (JSON) com correlation ID em todos os serviços
* Configurar coleta e exportação de métricas: Prometheus, CloudWatch, Datadog — conforme stack
* Implementar distributed tracing com OpenTelemetry: spans em todas as operações críticas
* Configurar dashboards operacionais com métricas RED (Rate, Errors, Duration) por serviço
* Definir e configurar SLOs: disponibilidade, latência P50/P95/P99, taxa de erro
* Configurar retenção de logs por ambiente e por nível de criticidade
* Implementar alertas baseados em SLO breach (não em métricas internas isoladas)

---

## 🔥 Regras obrigatórias

* SLOs devem ser definidos antes do primeiro deploy em produção — nunca retroativamente
* Logs não devem conter dados sensíveis (PII, tokens, passwords) — verificação obrigatória
* Correlation ID deve ser propagado de ponta a ponta: da requisição do usuário até o banco de dados e integrações externas
* Alertas baseados em SLO breach são prioridade sobre alertas de métricas internas

---

## ⚠️ Anti-patterns (proibido)

* Logs não estruturados (strings livres impossibilitam parsing e busca)
* Alertas em CPU usage ou disk usage sem correlação com experiência do usuário
* Distributed tracing sem sampling inteligente em alto volume (tracing 100% é proibitivo em escala)
* SLOs definidos pós-incidente para formalizar o que "estava acontecendo"

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.tech_stack`, `architecture.infrastructure_strategy`
* `product.metrics[]`, Snapshot O6

### Saídas para o OrchestratorContext
* `operations.observability_config` — configuração de logs, métricas, tracing
* `operations.slos[]` — SLOs definidos e ativos

### Dependências
Snapshot O6 aprovado.

### Paralelismo
Nenhum — âncora de F7.

---

## 🎯 Objetivo final

Transformar o sistema em uma caixa transparente onde qualquer degradação de performance, erro ou comportamento anômalo é detectado, localizado e diagnosticado em minutos — não em horas.
