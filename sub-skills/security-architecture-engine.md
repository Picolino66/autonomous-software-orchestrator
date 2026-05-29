---
name: security-architecture-engine
description: Define autenticação, autorização, proteção de dados e arquitetura de segurança do sistema.
user-invocable: false
---

## 🧠 Descrição

Define o modelo de segurança do sistema antes de qualquer implementação: mecanismos de autenticação e autorização, estratégia de proteção de dados, modelo de ameaças e controles de segurança por camada. Finaliza F2.

Segurança adicionada como afterthought em F5 ou F6 resulta em retrabalho caro, vulnerabilidades estruturais e, frequentemente, em sistemas que não conseguem atender conformidade regulatória. Shift-left security começa aqui.

O modelo de segurança definido nesta sub-skill é consumido por `backend-development-engine`, `security-testing-engine` e `deployment-engine`.

---

## 🚀 Responsabilidades

* Definir mecanismo de autenticação: JWT, OAuth2/OIDC, SAML, API keys — com justificativa por contexto
* Definir modelo de autorização: RBAC, ABAC, policy-based — e como é aplicado por camada
* Realizar threat modeling básico: identificar ativos críticos, vetores de ataque e controles
* Definir estratégia de proteção de dados em repouso (encryption at rest) e em trânsito (TLS, mTLS)
* Especificar estratégia de gestão de secrets: vault, secrets manager, variáveis de ambiente
* Mapear requisitos de conformidade aplicáveis: LGPD, GDPR, PCI-DSS, SOC2, HIPAA
* Definir políticas de controle de acesso à infraestrutura (IAM, least privilege)
* Documentar modelo de segurança como ADR

---

## 🔥 Regras obrigatórias

* Nenhum secret pode ser definido para residir em código, repositório ou variável não criptografada
* Autorizações devem ser verificadas no backend — nunca confiar em autorização apenas no frontend
* Dados sensíveis (PII, financeiros, saúde) devem ter plano explícito de criptografia e acesso mínimo
* Requisitos de conformidade regulatória identificados são must-have — nunca rebaixar prioridade
* Threat model deve cobrir ao menos os OWASP Top 10 relevantes ao tipo de aplicação

---

## ⚠️ Anti-patterns (proibido)

* Autenticação por username/password sem MFA para sistemas com dados sensíveis
* RBAC definido com roles genéricas (admin, user) sem granularidade adequada ao domínio
* Secrets em `.env` commitados ao repositório
* Ignorar segurança de comunicação interna entre serviços ("a rede interna é segura")
* Conformidade regulatória "planejada para depois" — custa muito mais para adicionar retroativamente

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.tech_stack`, `architecture.communication_patterns`
* `architecture.integration_contracts[]`
* `requirements.non_functional[]`, `requirements.constraints[]`
* `product.personas[]`, `business.model`

### Saídas para o OrchestratorContext
* `architecture.security_model` — auth/authz, criptografia, secrets, threat model, conformidade
* `architecture.adrs[]` — ADR de security architecture adicionado

### Dependências
`technology-stack-selector`.

### Paralelismo
Nenhum — sela F2.

---

## 🎯 Objetivo final

Entregar um modelo de segurança abrangente que seja implementável pela equipe de desenvolvimento sem especialização adicional. Segurança deve ser uma propriedade estrutural do sistema — não uma lista de verificação adicionada antes do deploy.
