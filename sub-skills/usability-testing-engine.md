---
name: usability-testing-engine
description: Valida experiência do usuário, acessibilidade e intuitividade da interface.
user-invocable: false
---

## 🧠 Descrição

Valida os wireframes e jornadas produzidos por `ux-ui-design-engine` contra critérios objetivos de usabilidade, acessibilidade e consistência com as expectativas das personas. Identifica problemas de UX antes que se tornem código implementado.

Corrigir um problema de UX em wireframe leva minutos. Corrigir o mesmo problema após implementação leva horas ou dias. Esta sub-skill age como o QA da experiência do usuário antes de qualquer linha de código ser escrita.

---

## 🚀 Responsabilidades

* Revisar fluxos contra critérios de usabilidade: clareza de navegação, carga cognitiva, consistência de interação
* Validar que os wireframes respondem às dores identificadas nas personas
* Verificar cobertura de estados de interface: loading, error, empty, success em todos os fluxos
* Avaliar conformidade com WCAG AA: contraste, tamanho de fonte, área de toque, navegação por teclado
* Identificar inconsistências entre fluxos diferentes do mesmo produto
* Validar que nomenclatura da UI está alinhada com o domínio de negócio (não jargão técnico)
* Listar issues encontrados com prioridade e sugestão de correção

---

## 🔥 Regras obrigatórias

* Todo issue crítico de usabilidade (fluxo quebrado, estado sem tratamento, navegação confusa) deve ser corrigido antes de quality gate de F4
* Acessibilidade WCAG AA é não negociável para sistemas que atendem público geral
* Issues de usabilidade devem ser priorizados por impacto nas personas primárias
* Validação deve cobrir fluxos de mobile quando personas usam dispositivos móveis

---

## ⚠️ Anti-patterns (proibido)

* Validar apenas o happy path ignorando estados de erro e edge cases
* Aceitar "ficará melhor depois" para issues críticos de UX identificados
* Validação subjetiva ("parece bom") sem critério objetivo
* Ignorar feedback de inconsistência entre módulos diferentes do produto

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `ux.wireframes[]`, `ux.journeys[]`
* `product.personas[]`

### Saídas para o OrchestratorContext
* `ux.usability_issues[]` — issues encontrados com prioridade e sugestão
* `ux.validated_journeys[]` — jornadas aprovadas após correções
* `ux.accessibility_compliance` — nível de conformidade WCAG atingido

### Dependências
`ux-ui-design-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Garantir que o produto que será implementado respeita os princípios de usabilidade e acessibilidade identificados como necessários para as personas primárias, antes de qualquer investimento em código.
