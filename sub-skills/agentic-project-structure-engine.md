---
name: agentic-project-structure-engine
description: Estrutura projetos para desenvolvimento orientado por agentes, organizando docs, specs, tasks, agents, skills, ADRs, ownership e rastreabilidade antes da implementação.
user-invocable: false
---

## 🧠 Descrição

Prepara o repositório para execução por múltiplos agentes de IA, criando ou validando uma arquitetura organizacional persistente para documentação, especificações, tarefas, skills, agentes e decisões arquiteturais.

Esta sub-skill não implementa código de produto. Ela transforma o planejamento técnico em um ecossistema agentic navegável, rastreável e pronto para execução coordenada.

Opera após `technical-planning-engine` e antes de `backlog-generation-engine`, garantindo que o backlog operacional seja derivado de specs e que cada agente tenha contexto, limites e ownership claros.

---

## 🚀 Responsabilidades

* Analisar domínio, requisitos, arquitetura, contratos, módulos e features planejadas
* Definir ou validar a estrutura agentic obrigatória do projeto
* Criar o mapa de relacionamento entre docs, specs, tasks, agents, skills e ADRs
* Definir ownership de cada artefato e limites de responsabilidade entre agentes
* Definir convenções de rastreabilidade entre requisito, doc, spec, task, implementação, teste e documentação atualizada
* Definir o mapa inicial de agentes necessários e as skills que cada agente deve usar
* Recomendar ADRs iniciais para decisões estruturais relevantes do ecossistema agentic
* Validar que nenhuma task operacional exista sem spec associada

---

## 📁 Estrutura obrigatória

Todo projeto preparado para execução agentic deve possuir ou receber recomendação explícita para possuir:

```txt
docs/
specs/
tasks/
skills/
agents/
adr/
```

### `docs/`

Fonte principal de contexto permanente do projeto.

Estrutura mínima recomendada:

```txt
docs/index.md
docs/business/
docs/architecture/
docs/flows/
docs/modules/
```

Responsável por negócio, arquitetura, fluxos, módulos e contexto duradouro que agentes devem consultar antes do código.

### `specs/`

Fonte primária de comportamento das features.

Cada spec deve conter, no mínimo:

```markdown
# Nome da Feature

## Objetivo
## Docs relacionados
## Requisitos relacionados
## Regras
## Comportamento
## Fluxos
## Critérios de aceite
## Tasks derivadas
```

Toda spec deve apontar para docs relacionados e requisitos de origem.

### `tasks/`

Fonte primária de execução operacional.

Estrutura obrigatória:

```txt
tasks/backlog/
tasks/todo/
tasks/doing/
tasks/done/
```

Cada task deve ser derivada de uma spec e conter, no mínimo:

```markdown
# Título da Task

## Spec relacionada
## Objetivo
## Escopo
## Fora de escopo
## Critérios de aceite
## Agente responsável
## Skills necessárias
## Evidências de conclusão
```

### `skills/`

Especializações reutilizáveis do projeto.

Skills ensinam como executar uma classe de trabalho. Elas não devem conter regra de negócio específica da aplicação.

### `agents/`

Agentes especializados do projeto.

Cada agente deve conter, no mínimo:

```markdown
# Nome do Agente

## Responsabilidade
## Escopo
## Limites
## Artefatos sob ownership
## Skills utilizadas
## Entradas esperadas
## Saídas esperadas
```

### `adr/`

Fonte primária de decisões arquiteturais.

Cada ADR deve conter, no mínimo:

```markdown
# ADR-NNN-titulo

## Contexto
## Opções consideradas
## Decisão
## Trade-offs
## Consequências
## Relações com docs/specs/tasks
```

---

## 🔄 Workflow obrigatório

Toda feature deve seguir:

```txt
Ideia
 ↓
Doc
 ↓
Spec
 ↓
Task Breakdown
 ↓
Implementação
 ↓
Teste
 ↓
Atualização Docs
```

O caminho `Ideia -> Código` é proibido. Quando uma ideia nova surgir, ela deve primeiro atualizar docs ou gerar uma spec antes de qualquer task de implementação.

---

## 🔥 Regras obrigatórias

* Docs são fonte primária de contexto
* Specs são fonte primária de comportamento
* Tasks são fonte primária de execução
* Skills são fonte primária de especialização
* ADRs são fonte primária de decisões arquiteturais
* Toda task deve apontar para uma spec
* Toda spec deve apontar para docs relacionados e requisitos de origem
* Toda implementação deve atualizar docs quando alterar comportamento, fluxo, contrato ou regra
* Todo artefato deve possuir ownership explícito
* Regras de negócio devem viver em docs/specs, nunca em skills
* Agentes devem ter responsabilidade, escopo, limites e skills declarados
* Toda saída deve ser redigida em português do Brasil (pt-br)

---

## ⚠️ Anti-patterns (proibido)

* Gerar código de produto diretamente
* Misturar docs com specs
* Misturar specs com tasks
* Colocar regras de negócio dentro de skills
* Criar task sem spec associada
* Criar implementação sem documentação ou spec prévia
* Criar agentes sem responsabilidade clara
* Criar estruturas sem ownership
* Usar `/docs` como backlog operacional
* Usar `tasks/` para decisões arquiteturais que deveriam virar ADR

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.domain`, `product.business_rules[]`
* `requirements.functional[]`, `requirements.non_functional[]`, `requirements.constraints[]`
* `scope.included[]`, `scope.excluded[]`, `scope.phasing`
* `architecture.*`
* `contracts.*`
* `engineering.module_map`, `engineering.feature_breakdown[]`

### Saídas para o OrchestratorContext
* `agentic.project_structure` — estrutura obrigatória recomendada, criada ou validada
* `agentic.docs_map` — organização de docs e pontos de entrada
* `agentic.specs_map` — specs por módulo/feature e vínculos com requisitos/docs
* `agentic.tasks_workflow` — estados, convenções e fluxo de movimentação de tasks
* `agentic.agents_map` — agentes necessários, responsabilidades, limites e ownership
* `agentic.skills_map` — skills locais/globais necessárias por agente e tipo de trabalho
* `agentic.traceability_rules` — convenções formais de rastreabilidade entre artefatos
* `agentic.initial_adrs_recommended` — ADRs iniciais recomendados para a organização agentic

### Dependências
`technical-planning-engine`.

### Paralelismo
Nenhum — o backlog operacional depende da estrutura agentic aprovada.

---

## 🎯 Objetivo final

Transformar o projeto em um ecossistema preparado para múltiplos agentes trabalharem simultaneamente com contexto persistente, documentação viva, rastreabilidade completa e evolução escalável — garantindo que nenhuma execução comece sem doc, spec, task, ownership e critérios de aceite claros.
