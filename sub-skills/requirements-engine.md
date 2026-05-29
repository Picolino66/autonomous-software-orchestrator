---
name: requirements-engine
description: Levanta, organiza e valida requisitos funcionais e não funcionais do sistema.
user-invocable: false
---

## 🧠 Descrição

Transforma regras de negócio, objetivos estratégicos e necessidades de personas em requisitos do sistema verificáveis. É a ponte formal entre o domínio do problema e o domínio da solução técnica.

Opera após `business-understanding-engine`, produzindo a especificação estruturada que `scope-definition-engine` usará para delimitar o produto e `feasibility-analysis-engine` avaliará tecnicamente.

Requisitos mal especificados são a principal causa de retrabalho em engenharia de software. Esta sub-skill garante que cada requisito seja verificável, rastreável, não ambíguo e classificado por tipo e prioridade.

---

## 🚀 Responsabilidades

* Derivar requisitos funcionais das regras de negócio e objetivos estratégicos
* Especificar requisitos não funcionais: performance, disponibilidade, segurança, escalabilidade, conformidade regulatória
* Classificar requisitos por: tipo (funcional/não funcional), prioridade (must/should/could/won't), origem (persona/negócio/técnico/regulatório)
* Garantir que cada requisito seja verificável (tem critério de aceitação claro)
* Identificar dependências entre requisitos
* Detectar requisitos conflitantes e escalar para resolução
* Documentar requisitos de conformidade (LGPD, PCI-DSS, SOC2, etc.) quando aplicáveis

---

## 🔥 Regras obrigatórias

* Todo requisito funcional deve ter critério de aceitação: "o sistema deve [ação] quando [condição], resultando em [resultado verificável]"
* Requisitos não funcionais devem ter threshold numérico quando possível (ex: "latência P99 < 500ms" em vez de "sistema deve ser rápido")
* Nenhum requisito pode ser ao mesmo tempo must-have e tecnicamente inviável — conflitos devem ser resolvidos antes de fechar a especificação
* Requisitos regulatórios são must-have por definição — nunca rebaixar sua prioridade
* Rastreabilidade obrigatória: todo requisito deve referenciar sua origem (persona X, regra de negócio Y, objetivo estratégico Z)

---

## ⚠️ Anti-patterns (proibido)

* Requisitos vagos: "o sistema deve ser intuitivo", "deve ser seguro", "deve escalar bem"
* Misturar requisito com solução técnica: "deve usar Redis para cache" não é requisito, é decisão de implementação
* Não classificar prioridade — tudo como must-have paralisa o projeto
* Omitir requisitos de segurança e conformidade por serem "implícitos"
* Requisitos que só podem ser verificados subjetivamente

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.business_rules[]`, `product.domain_processes[]`
* `product.personas[]`, `product.strategic_goals[]`
* `business.model`

### Saídas para o OrchestratorContext
* `requirements.functional[]` — requisitos funcionais com critério de aceitação e rastreabilidade
* `requirements.non_functional[]` — requisitos não funcionais com thresholds
* `requirements.constraints[]` — restrições técnicas, regulatórias e de negócio

### Dependências
`business-understanding-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Entregar uma especificação de requisitos que seja: completa (cobre os objetivos estratégicos), consistente (sem conflitos não resolvidos), verificável (critérios claros) e rastreável (origem documentada). Esta especificação é o contrato entre produto e engenharia.
