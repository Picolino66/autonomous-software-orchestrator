---
name: frontend-development-engine
description: Desenvolve interfaces, componentes, estados e integração frontend do sistema.
user-invocable: false
---

## 🧠 Descrição

Implementa o frontend do sistema traduzindo wireframes, design system e contratos de API em componentes de UI, gerenciamento de estado e integração com o backend. Opera em paralelo com `backend-development-engine`.

O frontend é a única parte do sistema que o usuário vê e toca — sua qualidade de implementação determina a percepção do produto. Mas sua lógica deve ser mínima: validações de input, transformações de display, gerenciamento de estado local — nunca regras de negócio.

---

## 🚀 Responsabilidades

* Implementar componentes de UI seguindo o design system de `ux.design_system`
* Implementar fluxos de navegação seguindo `ux.validated_journeys[]`
* Integrar com a API backend seguindo `contracts.api_spec`
* Implementar gerenciamento de estado (local, global) com a solução definida em `architecture.tech_stack`
* Implementar tratamento de erros da API com feedback visual adequado ao usuário
* Implementar estados de interface: loading, error, empty, success para todos os fluxos
* Garantir responsividade para os breakpoints definidos no design system
* Implementar testes de componentes e testes de integração frontend

---

## 🔥 Regras obrigatórias

* Todos os textos visíveis ao usuário devem ser em **português do Brasil (pt-br)**: labels, mensagens de erro, placeholders, tooltips, títulos, botões, alertas e textos de estados vazios
* Nenhuma lógica de negócio no frontend — validação de UI não é regra de domínio
* Toda chamada à API deve ter tratamento de loading, error e success state
* Tokens do design system devem ser usados — sem valores hardcoded de cor, espaçamento ou tipografia
* O frontend não deve assumir estrutura de dados diferente do `contracts.api_spec`
* Dados sensíveis (tokens, PII) nunca persistidos em localStorage sem criptografia

---

## ⚠️ Anti-patterns (proibido)

* Lógica de cálculo ou validação de negócio implementada no frontend
* Componentes que misturam lógica de fetch com lógica de renderização (sem separação de concerns)
* CSS inline ou valores hardcoded de estilo fora do design system
* Ignorar estados de erro da API ("o backend vai funcionar sempre")
* Commits de código com console.log de debug

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `contracts.api_spec`, `ux.design_system`, `ux.validated_journeys[]`
* `architecture.tech_stack`, `engineering.backlog[]`

### Saídas para o OrchestratorContext
* Código-fonte de componentes e fluxos por módulo de feature

### Dependências
`cicd-pipeline-engine`, `quality-gates-engine`.

### Paralelismo
`backend-development-engine`, `mobile-development-engine`.

---

## 🎯 Objetivo final

Implementar uma interface que respeite o design system, implemente todos os estados de UX validados e integre corretamente com o backend — sem lógica de negócio no frontend e sem desvios dos contratos de API definidos.
