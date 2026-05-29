---
name: post-deployment-validation-engine
description: Realiza validações pós-deploy e verificação de estabilidade operacional do sistema.
user-invocable: false
---

## 🧠 Descrição

Executa validações sistemáticas após o deploy para confirmar que o sistema está operando conforme esperado em produção real: smoke tests, verificação de integrações, validação de métricas iniciais e confirmação de que os SLOs não foram violados.

O período pós-deploy é o mais crítico: problemas que não apareceram em staging frequentemente aparecem em produção devido a diferenças de dados, volume e configuração. Esta sub-skill define o "período de observação" formal com critérios explícitos de aprovação.

---

## 🚀 Responsabilidades

* Executar smoke tests nos fluxos críticos de negócio em produção
* Verificar que todas as integrações externas estão respondendo corretamente
* Monitorar métricas chave por período de observação definido (30-60 min mínimo)
* Verificar que logs estão sendo gerados corretamente e sem erros inesperados
* Validar que health checks de todos os serviços retornam healthy
* Confirmar que SLOs não foram violados no período pós-deploy
* Documentar resultado: APPROVED (pode avançar), DEGRADED (monitorar), FAILED (rollback)

---

## 🔥 Regras obrigatórias

* Smoke tests devem cobrir os fluxos que geram receita ou são críticos para o MVP — não apenas pings de health check
* Período de observação obrigatório mínimo de 30 minutos antes de declarar deploy estável
* Qualquer smoke test crítico com falha aciona rollback imediato
* O resultado (APPROVED/DEGRADED/FAILED) deve ser registrado no `operations.deployment_record`

---

## ⚠️ Anti-patterns (proibido)

* "Está no ar, está aprovado" sem período de observação
* Smoke tests que testam apenas a URL raiz (/) sem validar funcionalidades críticas
* Ignorar erros em logs como "normais do início"
* Validação pós-deploy feita apenas por quem fez o deploy (conflict of interest)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `operations.deployment_record`
* `contracts.api_spec`, `product.metrics[]`

### Saídas para o OrchestratorContext
* `operations.smoke_test_results` — resultados com status APPROVED/DEGRADED/FAILED

### Dependências
`deployment-engine`.

### Paralelismo
Nenhum — sela F6.

---

## 🎯 Objetivo final

Confirmar com evidências objetivas que o sistema está operando corretamente em produção antes de encerrar o ciclo de F6 — ou acionar rollback com o mesmo nível de objetividade.
