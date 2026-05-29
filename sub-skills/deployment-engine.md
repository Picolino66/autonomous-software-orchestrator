---
name: deployment-engine
description: Executa estratégias de publicação, rollout e entrega do sistema em produção.
user-invocable: false
---

## 🧠 Descrição

Executa o deploy do sistema em produção seguindo a estratégia definida em `architecture.infrastructure_strategy`: blue/green, canary, rolling update ou deploy direto — com verificações de saúde automáticas e rollback automatizado em caso de falha.

O deploy é o momento de maior risco no ciclo de vida do software. Um deploy bem planejado limita o blast radius de problemas e permite reversão rápida. Um deploy mal planejado transforma pequenos bugs em grandes incidentes.

---

## 🚀 Responsabilidades

* Executar a estratégia de deploy definida (blue/green, canary, rolling)
* Verificar health checks de cada serviço após deploy antes de redirecionar tráfego
* Monitorar métricas chave durante o rollout (error rate, latência, disponibilidade)
* Executar rollback automático se métricas ultrapassam threshold de erro durante rollout
* Documentar o deployment record: versão, timestamp, serviços deployados, ambiente
* Executar migrações de banco de dados de forma segura: backward compatible, com rollback
* Validar que configurações de produção foram aplicadas corretamente

---

## 🔥 Regras obrigatórias

* Nenhum deploy de produção sem `documentation-engine` e `operational-documentation-engine` completos
* Migrações de banco devem ser backward compatible com a versão anterior do código — nenhuma migration que quebra o código anterior antes do deploy do novo
* Rollback automático deve estar configurado para acionar em: error rate > threshold, health checks falhos, latência P99 acima do SLO
* Deploy em produção sempre com aprovação manual documentada

---

## ⚠️ Anti-patterns (proibido)

* Deploy de código com migration que não é backward compatible
* Deploy sem smoke tests automatizados pós-deploy
* Rollback manual em produção sem procedimento documentado
* Deploy de sexta à tarde sem plantão disponível

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Build artifacts validados
* `architecture.infrastructure_strategy`, `engineering.cicd_config`
* `operations.runbooks`

### Saídas para o OrchestratorContext
* `operations.deployment_record` — registro completo do deploy executado

### Dependências
`documentation-engine`, `operational-documentation-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Executar o deploy de forma que falhas sejam detectadas e revertidas automaticamente antes de impactar todos os usuários, e que o estado do sistema em produção seja conhecido e documentado.
