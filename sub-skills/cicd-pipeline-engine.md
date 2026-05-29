---
name: cicd-pipeline-engine
description: Configura pipelines automatizadas de build, testes, release e deploy do sistema.
user-invocable: false
---

## 🧠 Descrição

Implementa os pipelines de CI/CD que garantem que todo código integrado ao repositório seja automaticamente validado, testado, construído e, quando aprovado, entregue ao ambiente correto.

A pipeline é o sistema nervoso do processo de entrega: sem CI/CD, a qualidade do software é função da disciplina humana — com CI/CD, é função da automação. Times sem pipeline investem horas em processos que deveriam ser segundos.

---

## 🚀 Responsabilidades

* Configurar pipeline de CI (Pull Request): lint, type-check, testes, build, security scan
* Configurar pipeline de CD por ambiente: staging deploy automático, production com aprovação manual
* Implementar cache de dependências e artefatos de build para reduzir tempo de execução
* Configurar notificações de falha e sucesso de pipeline
* Implementar verificação de coverage com threshold definido em `engineering.test_coverage_threshold`
* Configurar docker build e push para container registry quando aplicável
* Implementar deploy strategy definida em `architecture.infrastructure_strategy` (blue/green, rolling, canary)

---

## 🔥 Regras obrigatórias

* Pipeline de CI deve falhar em: lint, type-check, testes, coverage abaixo do threshold, security scan crítico
* Nunca configurar deploy automático em produção sem gate de aprovação manual
* Cache deve ser configurado para node_modules, pip packages ou equivalente — pipeline sem cache é 3-5x mais lenta
* Secrets nunca hardcodados no arquivo de pipeline — sempre via secrets do provider
* Pipeline deve ser idempotente: rodar duas vezes com o mesmo input produz o mesmo resultado

---

## ⚠️ Anti-patterns (proibido)

* Pipeline que não falha em violações de qualidade (lint errors, testes quebrados)
* Deploy de produção sem step de aprovação manual
* Secrets em arquivos de pipeline commitados ao repositório
* Pipeline sem separação de jobs (tudo em um único job longo não paralelizável)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.tech_stack`, `architecture.infrastructure_strategy`
* `engineering.governance_rules`, `engineering.test_coverage_threshold`

### Saídas para o OrchestratorContext
* `engineering.cicd_config` — pipelines configuradas e funcionais

### Dependências
`code-governance-engine`, `architectural-patterns-engine`.

### Paralelismo
`quality-gates-engine`.

---

## 🎯 Objetivo final

Entregar pipelines que transformem cada push em uma validação automática da saúde do código, e cada merge na branch principal em uma entrega potencial para produção — sem intervenção manual além da aprovação humana onde necessário.
