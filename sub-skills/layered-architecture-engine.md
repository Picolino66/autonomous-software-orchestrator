---
name: layered-architecture-engine
description: Organiza arquitetura por camadas, responsabilidades e separação estrutural do sistema.
user-invocable: false
---

## 🧠 Descrição

Define a organização interna de cada módulo/serviço em camadas com responsabilidades explícitas e regras de dependência rigorosas. Garante que a estrutura de código reflita os princípios de Clean Architecture, Hexagonal ou o padrão escolhido para o projeto.

Opera em paralelo com `integration-definition-engine` após `system-design-engine`. Enquanto `system-design-engine` define como os componentes se comunicam externamente, esta sub-skill define como cada componente é estruturado internamente.

Sem separação de camadas bem definida, qualquer módulo com mais de 500 linhas começa a acumular acoplamento implícito que se torna débito técnico impossível de pagar sem reescrita.

---

## 🚀 Responsabilidades

* Definir as camadas do sistema: Domain, Application, Infrastructure, Presentation (ou equivalentes do padrão escolhido)
* Especificar as responsabilidades e restrições de cada camada
* Definir a direção de dependências entre camadas (dependências sempre apontam para o domínio)
* Mapear onde cada tipo de artefato vive: entidades, use cases, repositórios, controllers, DTOs
* Definir os contratos entre camadas (interfaces, ports)
* Estabelecer regras de organização de pastas que espelhem a arquitetura de camadas
* Documentar padrões de módulo para uso como template em `project-setup-engine`

---

## 🔥 Regras obrigatórias

* A camada de domínio (domain/core) não pode ter dependência de framework, banco de dados ou infraestrutura — violação desta regra é crítica
* Toda comunicação entre camadas deve passar por interfaces/ports — nunca dependência direta de implementação concreta entre camadas
* Use cases na camada de aplicação devem orquestrar, não implementar lógica de domínio
* Controllers/adapters não devem conter lógica de negócio — apenas transformação de dados e delegação
* Regras de organização de pastas devem ser documentadas e aplicadas uniformemente em todos os módulos

---

## ⚠️ Anti-patterns (proibido)

* Lógica de negócio em controllers ou repositórios
* Entidades de domínio com imports de frameworks (JPA annotations no domain, decorators de ORM em entidades puras)
* Camadas sem fronteiras claras ("coloco aqui porque é mais fácil")
* Use cases que chamam outros use cases diretamente (violação de boundary)
* Estrutura de pastas por tipo técnico (controllers/, services/, repositories/) em vez de domínio

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.pattern`, `architecture.component_diagram`
* `architecture.services[]`, `architecture.boundaries[]`

### Saídas para o OrchestratorContext
* `architecture.layer_map` — definição das camadas, responsabilidades e regras de dependência
* `architecture.module_responsibilities[]` — responsabilidades mapeadas por módulo

### Dependências
`system-design-engine`.

### Paralelismo
`integration-definition-engine`.

---

## 🎯 Objetivo final

Estabelecer a arquitetura interna dos módulos de forma que isolamento, testabilidade e manutenibilidade sejam propriedades estruturais do código — não disciplina individual de cada desenvolvedor. A separação de camadas deve ser verificável automaticamente por lint e testes de arquitetura.
