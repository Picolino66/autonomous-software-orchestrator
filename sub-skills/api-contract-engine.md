---
name: api-contract-engine
description: Define contratos de APIs, DTOs, versionamento e padronização de comunicação do sistema.
user-invocable: false
---

## 🧠 Descrição

Define e formaliza os contratos de todas as APIs do sistema: endpoints, métodos, parâmetros, request/response bodies (DTOs), códigos de status, versionamento e padrões de erro. Produz especificações OpenAPI (REST) ou AsyncAPI (eventos) como artefatos formais.

Opera após `data-modeling-engine` pois os DTOs de resposta derivam do modelo de dados, mas frequentemente diferem dele (transformações, campos calculados, campos ocultos por segurança).

O contrato de API é a fronteira entre serviços e entre frontend e backend. Uma vez que consumidores dependem de um contrato, mudá-lo sem versionamento quebra integrações.

---

## 🚀 Responsabilidades

* Definir todos os endpoints da API por domínio/recurso
* Especificar métodos HTTP, paths, query params, path params para cada endpoint
* Definir DTOs de request e response com tipos, validações e exemplos
* Estabelecer padrão de resposta de erro consistente em toda a API
* Definir estratégia de versionamento da API (URL versioning, header versioning)
* Especificar autenticação e autorização por endpoint
* Gerar especificação OpenAPI/AsyncAPI completa
* Definir padrões de nomenclatura de campos (camelCase, snake_case) e aplicar uniformemente
* Especificar paginação, filtragem e ordenação para endpoints de listagem

---

## 🔥 Regras obrigatórias

* Todo endpoint deve ter ao menos um exemplo de request e response documentado
* Códigos de status HTTP devem ser semânticos: 200 para sucesso, 201 para criação, 400 para erro do cliente, 401 para não autenticado, 403 para não autorizado, 404 para não encontrado, 422 para validação, 500 para erro interno
* Campos sensíveis (senhas, tokens, PII completo) nunca aparecem em responses
* Versionamento é obrigatório desde v1 — nunca começar sem versão
* DTOs de response não devem expor estrutura interna do banco — nunca retornar entidade de domínio diretamente

---

## ⚠️ Anti-patterns (proibido)

* Endpoints que retornam 200 com `success: false` no body — usar status codes corretos
* DTO com campos `data`, `info`, `misc` sem tipagem clara
* API sem paginação em endpoints que retornam listas potencialmente grandes
* Contrato implícito ("o frontend sabe o que esperar") sem especificação formal
* Misturar convenções de nomenclatura dentro do mesmo contrato

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `contracts.schemas[]`
* `architecture.communication_patterns`, `architecture.security_model`
* `requirements.functional[]`, `scope.included[]`

### Saídas para o OrchestratorContext
* `contracts.api_version` — versão base da API
* `contracts.api_spec` — especificação OpenAPI/AsyncAPI completa
* `contracts.dtos[]` — DTOs documentados por operação

### Dependências
`data-modeling-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Produzir contratos de API formais e verificáveis que sirvam como contrato legal entre times (frontend/backend, serviço A/serviço B). O contrato deve ser gerado antes do código — não extraído do código depois. Especificação primeiro, implementação depois.
