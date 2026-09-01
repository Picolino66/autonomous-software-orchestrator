---
name: quality-gates-engine
description: Implementa validações automáticas de qualidade, cobertura, lint e análise estática.
user-invocable: false
---

## 🧠 Descrição

Configura e implementa os quality gates automáticos que impedem código abaixo do padrão de qualidade acordado de ser integrado ao repositório principal. Complementa `cicd-pipeline-engine` com as ferramentas específicas de análise de qualidade.

Quality gates são a diferença entre "qualidade como intenção" e "qualidade como propriedade verificável do sistema". Sem gates automáticos, a qualidade é negociada a cada PR sob pressão de prazo.

---

## 🚀 Responsabilidades

* Configurar análise estática de código (SonarQube, CodeClimate ou equivalente)
* Configurar verificação de cobertura de testes com o threshold de `engineering.test_coverage_threshold`
* Configurar análise de complexidade ciclomática com threshold
* Configurar verificação de duplicação de código
* Configurar análise de dependências: outdated packages, security vulnerabilities (npm audit, Snyk, Dependabot)
* Definir e documentar os critérios de aprovação de cada gate
* Configurar relatórios de qualidade gerados por pipeline para rastreabilidade histórica
* Registrar o gate `AI-DOC` da knowledge layer como verificação automatizada do pipeline de PR — integridade referencial dos índices, documentos órfãos, links quebrados, IDs duplicados, freshness e presença de secrets (ver `scripts/validate-knowledge-layer.mjs`)

---

## 🔥 Regras obrigatórias

* Coverage abaixo do threshold bloqueia merge — não é recomendação
* Vulnerabilidades críticas em dependências bloqueiam merge — não são warning
* Análise estática deve estar no pipeline de PR, não apenas em builds noturnos
* Thresholds devem ser documentados no repositório — não configuração apenas na ferramenta externa
* Documento em estado `stale-critical` ou referência quebrada na knowledge layer bloqueia merge — não é warning
* Degradação de qualidade (coverage caindo, complexidade aumentando) deve gerar alerta antes de virar bloqueador

---

## ⚠️ Anti-patterns (proibido)

* Quality gates como informativos que ninguém verifica
* Threshold de coverage definido abaixo do coverage atual ("para não bloquear nada")
* Ignorar warnings de análise estática por acúmulo ("tem muito, vemos depois")
* Nenhum rastreamento histórico de métricas de qualidade

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `engineering.governance_rules`, `engineering.test_coverage_threshold`

### Saídas para o OrchestratorContext
* `engineering.quality_thresholds` — thresholds configurados e ferramentas ativas

### Dependências
`code-governance-engine`.

### Paralelismo
`cicd-pipeline-engine`.

---

## 🎯 Objetivo final

Transformar qualidade de código de uma expectativa subjetiva em uma propriedade verificável automaticamente — onde code review se foca em lógica e arquitetura, não em métricas mensuráveis por máquina.
