---
name: incident-management-engine
description: Define alertas, resposta a incidentes e estratégias de recuperação operacional do sistema.
user-invocable: false
---

## 🧠 Descrição

Define e implementa o sistema de gestão de incidentes: alertas configurados, processo de resposta (quem faz o quê quando um alerta dispara), comunicação com stakeholders e processo de post-mortem.

Incidentes não são se, são quando. A diferença entre um time que responde bem a incidentes e um que não responde é a qualidade do processo estabelecido antes do primeiro incidente — não durante.

---

## 🚀 Responsabilidades

* Configurar alertas em cima dos SLOs definidos por `observability-engine`
* Definir severity levels: P0 (sistema down), P1 (degradação crítica), P2 (degradação significativa), P3 (issue menor)
* Criar on-call rotation e processo de escalation por severity
* Definir runbook de resposta por tipo de alerta (banco lento, serviço externo down, error rate spike)
* Criar template de comunicação de incidente para stakeholders por severity
* Definir processo de post-mortem: timeline, root cause analysis, ação corretiva, prazo
* Configurar canais de alerta: PagerDuty, Slack, e-mail — conforme criticidade

---

## 🔥 Regras obrigatórias

* Todo alerta P0 deve ter runbook de resposta vinculado — sem alerta sem playbook
* Post-mortem é obrigatório para todos os incidentes P0 e P1 — não opcional
* Alertas devem ter thresholds que permitem ação preventiva antes de SLO breach total
* On-call rotation deve existir para sistemas em produção — nunca dependência de uma única pessoa

---

## ⚠️ Anti-patterns (proibido)

* Alert fatigue: excesso de alertas de baixa prioridade que treinam o time a ignorar alertas
* Post-mortem de blame — foco em processos e sistemas, nunca em pessoas
* Alertas sem runbook de resposta ("alguém vai saber o que fazer")
* Dependência de conhecimento implícito no processo de resposta a incidente

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `operations.slos[]`, `operations.observability_config`
* `operations.runbooks`

### Saídas para o OrchestratorContext
* `operations.alerts[]` — alertas configurados com severidade e runbook linkado

### Dependências
`observability-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Garantir que quando — não se — um incidente ocorrer, o time tem processo, ferramentas e runbooks para responder de forma organizada, reduzindo MTTR e prevenindo que o mesmo incidente se repita.
