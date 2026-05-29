---
name: security-testing-engine
description: Executa validações de vulnerabilidade, segurança e testes de segurança da aplicação.
user-invocable: false
---

## 🧠 Descrição

Executa análise de segurança da aplicação em múltiplas camadas: análise estática (SAST), análise de dependências (SCA), análise dinâmica (DAST) e testes de controle de acesso. Valida que o modelo de segurança definido em F2 foi corretamente implementado.

Vulnerabilidades encontradas em produção custam ordens de magnitude mais que vulnerabilidades encontradas antes do deploy. Esta sub-skill é o firewall da qualidade de segurança antes da entrega.

---

## 🚀 Responsabilidades

* Executar análise estática (SAST): injeção, XSS, CSRF, exposure de dados sensíveis no código
* Executar análise de composição de software (SCA): vulnerabilidades em dependências diretas e transitivas
* Executar análise dinâmica (DAST): testes de endpoints com payloads maliciosos em ambiente de staging
* Testar controles de autenticação: endpoints protegidos, força de tokens, expiração
* Testar controles de autorização: IDOR, privilege escalation, acesso a recursos de outros tenants
* Verificar que dados sensíveis não são logados, retornados em erros ou expostos em headers
* Gerar relatório de segurança com findings classificados por severidade (Critical, High, Medium, Low)

---

## 🔥 Regras obrigatórias

* Vulnerabilidades Critical e High bloqueiam deploy — sem exceção sem aprovação formal documentada
* DAST deve ser executado em ambiente de staging com dados sintéticos — nunca em produção
* Autenticação e autorização devem ser testados explicitamente, não apenas validados em code review
* Secrets em código ou repositório são Critical — deploy bloqueado imediatamente

---

## ⚠️ Anti-patterns (proibido)

* "Segurança como checklist" executado apenas antes do primeiro deploy, nunca repetido
* Ignorar vulnerabilidades em dependências transitivas
* DAST executado em ambiente de produção com dados reais
* Findings de segurança como backlog sem prioridade equivalente a bugs críticos

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Código-fonte, `architecture.security_model`
* `contracts.api_spec`

### Saídas para o OrchestratorContext
* `quality.security_report` — findings de SAST, SCA, DAST com severidade e mitigação

### Dependências
Build estável de F5.

### Paralelismo
`automated-testing-engine`.

---

## 🎯 Objetivo final

Garantir que nenhuma vulnerabilidade conhecida de alta severidade chegue a produção, e que o modelo de segurança definido em F2 foi corretamente implementado e não apenas planejado.
