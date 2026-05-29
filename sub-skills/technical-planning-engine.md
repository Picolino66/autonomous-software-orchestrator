---
name: technical-planning-engine
description: Divide o sistema em módulos, features e planejamento técnico executável.
user-invocable: false
---

## 🧠 Descrição

Converte a arquitetura definida em F2 e os contratos definidos em F3 em um mapa técnico executável: módulos do sistema, features decompostas, sequência de implementação e dependências entre partes.

Enquanto arquitetura define o "o quê" e o "como" estrutural, o planejamento técnico define o "em que ordem" e "por quem" — tornando a implementação em F5 gerenciável e sem bloqueios desnecessários.

---

## 🚀 Responsabilidades

* Mapear todos os módulos do sistema a serem implementados
* Decompor cada módulo em features implementáveis (granularidade de 1-5 dias de trabalho)
* Identificar dependências entre módulos e features (qual deve ser implementado antes de qual)
* Definir a sequência de implementação que minimiza bloqueios
* Identificar funcionalidades transversais (logging, auth, validação) que devem ser implementadas primeiro
* Estimar esforço de cada feature em unidade relativa (story points ou dias)
* Mapear riscos técnicos de implementação por módulo

---

## 🔥 Regras obrigatórias

* Nenhum módulo pode ser planejado sem ter arquitetura definida em F2 — planejar implementação de algo arquiteturalmente indefinido gera retrabalho
* Features com dependências externas (integrações) devem ter sua sequência planejada considerando o tempo de setup das integrações
* Funcionalidades de infraestrutura transversal (auth, logging, error handling) sempre entram antes de features de domínio
* Estimativas devem ser honestas — não planejar para o cenário ideal sem buffer para imprevistos

---

## ⚠️ Anti-patterns (proibido)

* Planejar tudo em paralelo sem considerar dependências reais entre componentes
* Features subdivididas em granularidade muito fina (horas) ou muito grossa (semanas) sem critério
* Ignorar a curva de aprendizado do time com novas tecnologias no planejamento
* Planejar implementação de banco de dados antes de ter schema finalizado

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.*` (Snapshot O2)
* `contracts.*` (Snapshot O3)
* `ux.validated_journeys[]`
* `scope.included[]`

### Saídas para o OrchestratorContext
* `engineering.module_map` — mapa de módulos com responsabilidades e dependências
* `engineering.feature_breakdown[]` — features decompostas com estimativa e sequência

### Dependências
`usability-testing-engine`, Snapshot O2, Snapshot O3.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Produzir um mapa técnico que permita ao time iniciar F5 com clareza total sobre o que implementar, em que ordem e com quais dependências — eliminando o risco de bloqueios por dependências não identificadas.
