---
name: business-understanding-engine
description: Compreende regras de negócio, domínio, processos e contexto operacional do sistema.
user-invocable: false
---

## 🧠 Descrição

Aprofunda o entendimento do domínio de negócio além do nível estratégico: mapeia as regras que governam o funcionamento do sistema, os processos que precisam ser suportados e o contexto operacional em que o produto será utilizado.

Opera após `ideation-engine`, traduzindo objetivos estratégicos em conhecimento de domínio estruturado. Enquanto `ideation-engine` fala de problemas e hipóteses, esta sub-skill fala de invariantes de negócio, fluxos operacionais e glossário de domínio — os fundamentos que `data-modeling-engine` e `backend-development-engine` dependerão diretamente.

É o ponto de intersecção entre produto e engenharia: sem este mapeamento, desenvolvedores codificam suposições de domínio em vez de regras reais.

---

## 🚀 Responsabilidades

* Mapear regras de negócio: invariantes, validações, restrições e condicionais do domínio
* Documentar processos de negócio relevantes (fluxos de aprovação, ciclos de vida de entidades, transições de estado)
* Identificar entidades de domínio principais e suas relações conceituais (pré-data-modeling)
* Construir glossário de domínio: termos específicos do negócio com definição precisa
* Identificar atores do sistema (internos, externos, sistemas de terceiros)
* Mapear fluxos críticos de negócio end-to-end
* Detectar ambiguidades e inconsistências nas regras de negócio antes que se tornem bugs

---

## 🔥 Regras obrigatórias

* Toda regra de negócio deve ter fonte identificável (stakeholder, documento, legislação) — sem regras "inventadas"
* Conflitos entre regras de negócio devem ser explicitados e resolvidos antes de avançar — nunca deixar ambiguidade para o desenvolvedor resolver
* O glossário de domínio deve ter ao menos os 10 termos mais utilizados com definições precisas e inequívocas
* Nunca modelar dados antes de esta sub-skill ter completado — data-modeling-engine depende do domínio entendido
* Fluxos críticos devem incluir estados de exceção, não apenas o happy path

---

## ⚠️ Anti-patterns (proibido)

* Regras de negócio expressas como código ("se status == 2 então...") em vez de linguagem de domínio
* Glossário com termos que têm significados diferentes dependendo do contexto sem separação explícita
* Mapear apenas o happy path dos processos, ignorando exceções e casos extremos
* Confundir regra de negócio com regra de interface (validação de UI não é regra de domínio)
* Documentar "como o sistema atual funciona" quando o objetivo é redesenhar o processo

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.problems[]`, `product.strategic_goals[]`, `product.hypotheses[]`
* `product.domain`, `product.personas[]`

### Saídas para o OrchestratorContext
* `product.business_rules[]` — regras de negócio com fonte e prioridade
* `product.domain_processes[]` — processos mapeados com fluxo e estados
* `product.domain_glossary` — glossário de domínio

### Dependências
`ideation-engine`.

### Paralelismo
Nenhum neste ponto.

---

## 🎯 Objetivo final

Entregar o mapa de domínio que permite que arquitetos modelem dados corretamente e desenvolvedores codifiquem regras de negócio reais. Sem este artefato, o risco de modelagem incorreta do domínio é alto e o custo de correção cresce exponencialmente a cada fase subsequente.
