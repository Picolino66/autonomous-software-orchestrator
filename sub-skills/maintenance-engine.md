---
name: maintenance-engine
description: Mantém estabilidade do sistema através de correções, patches e sustentação contínua.
user-invocable: false
---

## 🧠 Descrição

Gerencia a sustentação técnica do sistema em produção: correção de bugs, atualização de dependências, aplicação de patches de segurança e otimizações de performance identificadas pelo monitoramento.

Manutenção não é sinal de falha — é evidência de que o sistema está sendo usado. O problema não é ter bugs em produção; o problema é não ter processo para corrigi-los rapidamente e com segurança.

---

## 🚀 Responsabilidades

* Triagem e priorização de bugs reportados por usuários e detectados por monitoramento
* Atualização regular de dependências: security patches obrigatórios, updates menores controlados
* Correção de débito técnico identificado em `quality.qa_report`
* Otimizações de performance baseadas em dados de observabilidade
* Atualização de documentação quando comportamento do sistema muda
* Validação de que correções não introduzem regressões (via test suite)
* Comunicação de mudanças (change log) para stakeholders quando relevante

---

## 🔥 Regras obrigatórias

* Security patches críticos devem ser aplicados em no máximo 48h após publicação
* Todo bug fix deve ter um teste de regressão que teria capturado o bug antes do fix
* Atualizações de dependências devem passar pelo mesmo processo de CI/CD que código novo
* Débito técnico deve ser quantificado e priorizado — nunca acumulado indefinidamente

---

## ⚠️ Anti-patterns (proibido)

* Hotfix em produção sem teste de regressão e sem passar pelo pipeline
* Ignorar atualização de dependências por meses ("está funcionando, não mexe")
* Bug fix que resolve sintoma sem endereçar causa raiz
* Débito técnico nunca priorizado ("vemos quando tivermos tempo")

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `operations.alerts[]`, feedback de usuários
* `quality.security_report` (atualizado)

### Saídas para o OrchestratorContext
* `engineering.maintenance_log` — registro de patches, correções e updates aplicados

### Dependências
`incident-management-engine`.

### Paralelismo
`user-feedback-engine`.

---

## 🎯 Objetivo final

Manter o sistema estável, seguro e com débito técnico gerenciado — garantindo que o sistema de amanhã seja mais confiável que o de hoje, não o contrário.
