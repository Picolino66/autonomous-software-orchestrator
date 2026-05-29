---
name: feasibility-analysis-engine
description: Avalia viabilidade técnica, operacional, financeira e estratégica do projeto.
user-invocable: false
---

## 🧠 Descrição

Analisa criticamente se o produto definido pode ser construído, operado e sustentado dentro das restrições reais de tecnologia, equipe, tempo e custo. Opera após `scope-definition-engine` e antes de qualquer decisão arquitetural.

A análise de viabilidade é o filtro que impede que projetos inviáveis consumam recursos antes que sua inviabilidade seja descoberta tardiamente. Ela não tem o objetivo de inviabilizar projetos ambiciosos — tem o objetivo de mapear riscos antes que se tornem bloqueadores.

O veredicto desta sub-skill (`VIAVEL`, `VIAVEL_COM_RISCOS` ou `INVIAVEL`) determina se o pipeline pode avançar para F2 e em quais condições.

---

## 🚀 Responsabilidades

* Avaliar viabilidade técnica: as tecnologias necessárias existem, são maduras e a equipe tem capacidade de adotá-las?
* Avaliar viabilidade operacional: é possível operar o sistema com os recursos disponíveis?
* Avaliar viabilidade financeira: o modelo de negócio sustenta o custo de construção e operação?
* Avaliar viabilidade temporal: o escopo definido é entregável no prazo esperado?
* Identificar riscos técnicos, operacionais, regulatórios e de mercado com probabilidade e impacto
* Definir condições de contorno para projetos `VIAVEL_COM_RISCOS`
* Recomendar ajustes de escopo quando viabilidade está comprometida

---

## 🔥 Regras obrigatórias

* Veredicto `INVIAVEL` deve bloquear o avanço do pipeline até revisão de escopo ou premissas
* Todo risco identificado deve ter: descrição, probabilidade (alta/média/baixa), impacto (alto/médio/baixo) e mitigação sugerida
* `VIAVEL_COM_RISCOS` exige que os riscos críticos tenham plano de mitigação antes de avançar para F2
* Nunca marcar como viável um projeto com dependência técnica de tecnologia não madura sem plano de contingência
* Viabilidade financeira deve considerar custos de infraestrutura em escala, não apenas no lançamento

---

## ⚠️ Anti-patterns (proibido)

* Análise de viabilidade otimista sem base em dados ou analogias
* Ignorar riscos regulatórios em domínios como fintech, healthtech, legaltech
* Viabilidade avaliada apenas sob condições ideais (equipe completa, sem bugs, sem delays)
* Não considerar custo de manutenção e operação pós-lançamento
* Marcar como viável sem analisar dependências externas críticas (APIs de terceiros, integrações)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `scope.included[]`, `scope.excluded[]`, `scope.phasing`
* `requirements.non_functional[]`, `requirements.constraints[]`
* `business.model`, `business.revenue_streams[]`

### Saídas para o OrchestratorContext
* `feasibility.verdict` — `VIAVEL | VIAVEL_COM_RISCOS | INVIAVEL`
* `feasibility.risks[]` — riscos identificados com probabilidade, impacto e mitigação
* `feasibility.constraints[]` — restrições confirmadas que devem guiar F2

### Dependências
`scope-definition-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Fornecer um julgamento honesto e documentado sobre a viabilidade do projeto que permita ao pipeline avançar com consciência dos riscos ou pausar para revisão estratégica. A análise deve ser criteriosa o suficiente para identificar riscos reais, mas não conservadora ao ponto de bloquear projetos com risco gerenciável.
