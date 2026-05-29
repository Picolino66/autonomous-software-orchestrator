---
name: architectural-patterns-engine
description: Define e aplica padrões arquiteturais como Clean Architecture, DDD e modularização ao código.
user-invocable: false
---

## 🧠 Descrição

Implementa os padrões arquiteturais decididos em F2 como estruturas concretas de código: templates de módulo, exemplos de implementação de use cases, repositórios, entities, value objects e adapters — que servem como referência para toda a implementação em F5.

A distância entre "vamos usar Clean Architecture" (F2) e "cada desenvolvedor entende Clean Architecture diferente" (F5) é o problema que esta sub-skill resolve. Ela torna os padrões tangíveis antes que o desenvolvimento de features comece.

---

## 🚀 Responsabilidades

* Criar template de módulo completo seguindo a arquitetura de camadas definida
* Implementar exemplos funcionais de: Entity, Value Object, Use Case, Repository interface, Repository implementation, Controller/Adapter
* Definir como injeção de dependência é configurada no projeto
* Criar exemplos de testes por camada (unit test de use case, integration test de repositório)
* Documentar os padrões como guia de referência para o time
* Implementar padrões transversais: error handling, logging, validation pipeline

---

## 🔥 Regras obrigatórias

* O template de módulo deve ter testes funcionando — um template sem testes não valida que os padrões são testáveis
* Injeção de dependência deve ser explícita e centralizada — não instanciação direta de dependências dentro de use cases
* O guia de padrões deve cobrir casos de dúvida comum: "onde coloco X?", "como testo Y?"
* Padrões devem ser consistentes com o `architecture.layer_map` — nenhuma exceção sem documentação

---

## ⚠️ Anti-patterns (proibido)

* Template de módulo sem testes funcionando
* Padrões definidos apenas em documentação sem exemplo de código executável
* Injeção de dependência via singleton global em vez de DI container
* "Isso vai ser refatorado depois para o padrão certo" — padrões devem ser aplicados desde o início

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.*`, `engineering.project_structure`

### Saídas para o OrchestratorContext
* `engineering.patterns_applied[]` — padrões implementados com referência ao código de exemplo

### Dependências
`project-setup-engine`.

### Paralelismo
`code-governance-engine`.

---

## 🎯 Objetivo final

Garantir que os padrões arquiteturais abstratos definidos em F2 existam como código executável antes que o desenvolvimento de features comece, eliminando a ambiguidade de interpretação individual que levaria a implementações inconsistentes.
