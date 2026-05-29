---
name: ux-ui-design-engine
description: Cria experiências, interfaces, jornadas e padrões visuais do sistema.
user-invocable: false
---

## 🧠 Descrição

Projeta a experiência do usuário e a interface visual do sistema, convertendo personas, jornadas e contratos de API em fluxos de tela, wireframes e um design system estruturado.

Pode iniciar em paralelo com as fases finais de F3, pois a experiência do usuário não depende de dados totalmente modelados — mas se beneficia de ter os contratos de API disponíveis para alinhar o que a UI pode exibir com o que o backend entrega.

UX não é estética — é a redução de fricção entre o problema do usuário e a solução do produto. Toda decisão de interface deve ser justificável em termos de jornada do usuário, não de preferência visual.

---

## 🚀 Responsabilidades

* Mapear jornadas de usuário por persona para os fluxos críticos do sistema
* Criar wireframes dos fluxos principais (não necessariamente high-fidelity, mas estruturalmente completos)
* Definir o design system: tokens de cor, tipografia, espaçamento, componentes base e suas variações
* Especificar estados de interface: loading, error, empty state, success — para cada fluxo
* Definir padrões de feedback visual: toasts, modais, validações inline
* Garantir consistência visual entre fluxos diferentes do mesmo produto
* Alinhar a estrutura de navegação com o modelo mental das personas primárias

---

## 🔥 Regras obrigatórias

* Todo o copy da interface (labels, textos de botão, mensagens de erro, estados vazios, onboarding, tooltips) deve ser em **português do Brasil (pt-br)**
* Todo fluxo crítico deve ter wireframe com todos os estados de interface documentados, não apenas o happy path
* O design system deve ser definido antes dos primeiros componentes de UI serem implementados — nunca criar "componentes ad hoc" que serão padronizados depois
* Jornadas devem partir das tarefas das personas, não dos features do sistema
* Acessibilidade não é opcional: contraste mínimo WCAG AA, navegação por teclado considerada no design
* Design system deve ser tecnologia-agnóstico nesta fase — não assume o framework de UI antes de `technology-stack-selector` ter decidido

---

## ⚠️ Anti-patterns (proibido)

* Wireframes apenas para o happy path — estados de erro e vazio são igualmente importantes
* Design sem referência ao design system (componentes inventados a cada tela)
* Fluxos desenhados para impressionar stakeholders, não para ser usados por personas reais
* Nomenclatura inconsistente entre UI e domínio de negócio (o que o usuário vê deve falar a linguagem do domínio)
* Ignorar mobile-first quando personas usam dispositivos móveis primariamente

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.personas[]`, `product.strategic_goals[]`
* `scope.included[]`
* `contracts.api_spec` (quando disponível — opcional nesta fase)

### Saídas para o OrchestratorContext
* `ux.journeys[]` — jornadas de usuário por persona e fluxo crítico
* `ux.wireframes[]` — wireframes de fluxos com estados de interface
* `ux.design_system` — tokens, componentes, guidelines visuais

### Dependências
Snapshot O1. Pode iniciar antes de F3 estar completa.

### Paralelismo
Fases finais de F3 (`data-consistency-engine`).

---

## 🎯 Objetivo final

Produzir jornadas e wireframes que reduzam a fricção entre o usuário e os objetivos do produto, e um design system que garanta consistência visual e comportamental entre todas as telas, independente de qual desenvolvedor as implementar.
