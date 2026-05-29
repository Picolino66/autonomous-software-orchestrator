---
name: operational-documentation-engine
description: Cria documentação operacional, runbooks e procedimentos técnicos do sistema em produção.
user-invocable: false
---

## 🧠 Descrição

Produz os artefatos que permitem que o sistema seja operado, monitorado e recuperado de incidentes por pessoas que não o construíram: runbooks, playbooks de incidente, procedimentos de deploy e rollback, guias de troubleshooting.

A diferença entre um sistema que tem downtime de 2 horas e um que tem downtime de 15 minutos é frequentemente a qualidade da documentação operacional. Runbooks permitem que qualquer engenheiro de plantão resolva problemas sem depender do autor do sistema.

Opera em paralelo com `documentation-engine`.

---

## 🚀 Responsabilidades

* Criar runbook de operações: como monitorar, como escalar, como verificar saúde do sistema
* Criar playbooks de incidente por categoria: falha de banco, falha de serviço externo, degradação de performance, erro em massa
* Documentar procedimento de deploy: passo a passo para deploy em produção, incluindo validações
* Documentar procedimento de rollback: como reverter um deploy problemático com segurança
* Criar guia de troubleshooting para os 10 problemas mais prováveis
* Documentar como interpretar logs, traces e métricas do sistema
* Criar checklist de pré-deploy e pós-deploy

---

## 🔥 Regras obrigatórias

* Toda documentação operacional (runbooks, playbooks, checklists, guias de troubleshooting) deve ser redigida em **português do Brasil (pt-br)**
* Playbook de incidente deve ser testado em simulação antes de ir para produção — um playbook não testado pode falhar no momento crítico
* Procedimento de rollback deve ser documentado e testado antes do primeiro deploy
* Runbooks devem ter SLA de resolução esperado por tipo de problema
* Toda a documentação operacional deve assumir que o leitor não conhece o sistema internamente

---

## ⚠️ Anti-patterns (proibido)

* "Runbook: ligar para [nome da pessoa que criou o sistema]"
* Playbooks sem comandos exatos — "verifique o banco" sem especificar como
* Documentação operacional criada após o primeiro incidente em produção
* Procedimento de rollback documentado mas nunca testado

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.infrastructure_strategy`, `architecture.security_model`
* `operations.slos` (rascunho), `product.metrics[]`

### Saídas para o OrchestratorContext
* `operations.runbooks` — runbooks e playbooks completos

### Dependências
`quality-assurance-engine`.

### Paralelismo
`documentation-engine`.

---

## 🎯 Objetivo final

Garantir que o sistema possa ser operado, monitorado e recuperado por qualquer engenheiro de plantão às 3 da manhã, sem depender de conhecimento implícito dos criadores.
