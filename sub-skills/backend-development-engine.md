---
name: backend-development-engine
description: Desenvolve APIs, regras de negócio, processamento e arquitetura backend do sistema.
user-invocable: false
---

## 🧠 Descrição

Implementa o backend do sistema seguindo os padrões arquiteturais definidos em F2, os contratos de API definidos em F3 e o backlog priorizado em F4. Opera em paralelo com `frontend-development-engine` e `mobile-development-engine`.

O backend é responsável por implementar as regras de negócio, garantir a integridade dos dados, expor os contratos de API definidos e integrar com sistemas externos. Toda lógica de negócio reside aqui — nunca no frontend.

---

## 🚀 Responsabilidades

* Implementar use cases de domínio seguindo o padrão definido em `architectural-patterns-engine`
* Implementar controllers/adapters que expõem a API conforme `contracts.api_spec`
* Implementar repositórios seguindo as interfaces definidas na camada de domínio
* Implementar integrações com sistemas externos via adapters (anti-corruption layers)
* Garantir validação de input em todos os endpoints (DTOs com validação declarativa)
* Implementar autenticação e autorização conforme `architecture.security_model`
* Implementar logging estruturado em todas as operações críticas
* Manter cobertura de testes acima do threshold definido em `engineering.test_coverage_threshold`

---

## 🔥 Regras obrigatórias

* Comentários de código, mensagens de erro retornadas pela API e strings de log devem ser em **português do Brasil (pt-br)**
* Toda regra de negócio deve estar na camada de domínio — nunca em controllers ou repositórios
* Os contratos de API devem ser respeitados à risca — nenhuma divergência não documentada em relação a `contracts.api_spec`
* Autenticação e autorização devem ser implementadas como middleware/guards, não inline em cada handler
* Logs devem incluir correlation ID para rastreabilidade entre serviços
* Nenhum secret hardcoded — todos via variáveis de ambiente com validação na inicialização

---

## ⚠️ Anti-patterns (proibido)

* Lógica de negócio em controllers ou queries de banco direto em handlers
* Divergir dos contratos de API sem atualizar `contracts.api_spec`
* Repositórios que retornam entidades de banco diretamente para a camada de apresentação
* Try/catch vazio que engole erros sem log
* Implementar features fora do backlog priorizado sem justificativa

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `contracts.api_spec`, `contracts.schemas[]`
* `architecture.tech_stack`, `architecture.layer_map`, `architecture.security_model`
* `engineering.backlog[]`, `engineering.patterns_applied[]`

### Saídas para o OrchestratorContext
* Código-fonte estruturado por módulo
* `quality.coverage_report` (atualizado progressivamente)

### Dependências
`cicd-pipeline-engine`, `quality-gates-engine`.

### Paralelismo
`frontend-development-engine`, `mobile-development-engine`.

---

## 🎯 Objetivo final

Implementar um backend que respeite os contratos definidos, aplique as regras de negócio corretamente, seja testável por design e opere dentro dos padrões de segurança e observabilidade definidos — sem deixar decisões de arquitetura para o momento da implementação.
