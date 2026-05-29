---
name: system-design-engine
description: Estrutura componentes, fluxos, integrações e comunicação de alto nível do sistema.
user-invocable: false
---

## 🧠 Descrição

Detalha a estrutura interna do sistema no nível de componentes, fluxos de dados e padrões de comunicação. Enquanto `global-architecture-engine` define o "o quê" (quais módulos/serviços existem), esta sub-skill define o "como" eles se relacionam e comunicam.

Opera após `global-architecture-engine` e produz os diagramas e descrições estruturais que todas as sub-skills de F2, F3 e F5 utilizarão como referência.

Um system design bem feito elimina ambiguidades de implementação: desenvolvedores sabem como os componentes se encaixam antes de escrever a primeira linha de código.

---

## 🚀 Responsabilidades

* Detalhar os componentes internos de cada serviço/módulo
* Mapear fluxos de dados entre componentes para os casos de uso críticos
* Definir padrões de comunicação: síncrono (REST, gRPC) vs. assíncrono (eventos, filas, pub/sub)
* Identificar pontos de single point of failure e propor redundância
* Mapear o fluxo de autenticação e autorização atravessando os componentes
* Identificar componentes de estado (stateful) vs. sem estado (stateless)
* Documentar decisões de comunicação como ADR quando há trade-offs relevantes

---

## 🔥 Regras obrigatórias

* Fluxos críticos devem ser documentados end-to-end, incluindo tratamento de erros
* Comunicação assíncrona exige definição explícita de: garantias de entrega, idempotência dos consumers e estratégia de dead-letter
* Componentes stateful devem ser identificados explicitamente — impactam escalabilidade e deploy
* Nenhum componente pode ter responsabilidade ambígua — se não fica claro quem faz o quê, o design está incompleto
* Nunca adicionar componentes por "future-proofing" — cada componente deve ter função imediata no escopo definido

---

## ⚠️ Anti-patterns (proibido)

* "Podemos definir os detalhes depois" — ambiguidade de design se transforma em acoplamento implícito no código
* Comunicação síncrona para operações de alta latência sem análise de impacto
* Eventos sem consumidor definido ("vamos usar eventos, alguém pode consumir depois")
* Componentes "utils" ou "helpers" sem responsabilidade de domínio clara
* Fluxos documentados apenas para o happy path

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.pattern`, `architecture.services[]`, `architecture.boundaries[]`

### Saídas para o OrchestratorContext
* `architecture.component_diagram` — descrição dos componentes e seus relacionamentos
* `architecture.data_flows[]` — fluxos de dados para casos de uso críticos
* `architecture.communication_patterns` — padrões de comunicação selecionados

### Dependências
`global-architecture-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Produzir um design de sistema detalhado o suficiente para que implementadores entendam como o sistema funciona como um todo antes de construir partes isoladas. A clareza do system design é inversamente proporcional ao acoplamento acidental entre componentes.
