---
name: backlog-generation-engine
description: Gera backlog estruturado com tarefas, histórias de usuário e critérios técnicos.
user-invocable: false
---

## 🧠 Descrição

Converte o planejamento técnico e as specs aprovadas pela estrutura agentic em um backlog formal: histórias de usuário com critérios de aceitação verificáveis, tarefas técnicas e tasks de infraestrutura — prontos para serem priorizados e executados.

Um backlog bem gerado elimina ambiguidade no desenvolvimento: o desenvolvedor sabe exatamente o que "done" significa para cada item, sem precisar de conversas adicionais para começar a trabalhar.

---

## 🚀 Responsabilidades

* Gerar histórias de usuário para cada feature do `engineering.feature_breakdown`
* Escrever critérios de aceitação verificáveis para cada história (Given/When/Then quando aplicável)
* Criar tarefas técnicas para infraestrutura, setup e itens não funcionais
* Garantir rastreabilidade: cada história deve referenciar o requisito funcional ou não funcional que a originou
* Garantir que cada task/história referencie uma spec em `agentic.specs_map`
* Identificar stories que precisam de spike técnico antes de estimativa
* Separar histórias de MVP das histórias de V1 e versões subsequentes
* Verificar consistência entre histórias e contratos de API definidos em F3

---

## 🔥 Regras obrigatórias

* Todas as histórias de usuário, critérios de aceitação e descrições de tarefas devem ser redigidas em **português do Brasil (pt-br)**
* Toda história deve ter critério de aceitação verificável — sem critério, sem história
* Toda task ou história deve apontar para uma spec associada — sem spec, sem task
* Histórias não devem misturar múltiplos domínios de negócio — uma história, um contexto
* Tarefas técnicas sem valor direto para o usuário devem ser explicitamente vinculadas à história que as requer
* Histórias de MVP marcadas como tais e separadas das de versões futuras
* Critérios de aceitação devem ser consistentes com os contratos de API definidos em F3

---

## ⚠️ Anti-patterns (proibido)

* Histórias sem critério de aceitação ("implementar o cadastro de usuários")
* Tasks criadas diretamente de uma ideia sem doc e spec anteriores
* Histórias técnicas expressas em linguagem de implementação em vez de valor para o usuário
* Backlog sem rastreabilidade à origem (requisito, regra de negócio)
* Misturar bug fixes, features e débito técnico sem categorização

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `engineering.module_map`, `engineering.feature_breakdown[]`
* `agentic.specs_map`, `agentic.traceability_rules`
* `contracts.api_spec`, `requirements.functional[]`
* `scope.included[]`, `scope.phasing`

### Saídas para o OrchestratorContext
* `engineering.backlog[]` — histórias e tarefas com critérios de aceitação e rastreabilidade

### Dependências
`agentic-project-structure-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Entregar um backlog que elimine ambiguidade: qualquer desenvolvedor, ao pegar uma história, sabe exatamente o que deve ser verdade ao final para que o item seja considerado completo — sem reuniões adicionais de esclarecimento.
