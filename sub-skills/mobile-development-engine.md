---
name: mobile-development-engine
description: Desenvolve aplicações mobile com foco em experiência, performance e integração.
user-invocable: false
---

## 🧠 Descrição

Implementa a aplicação mobile do sistema quando mobile está no escopo definido. Opera em paralelo com `backend-development-engine` e `frontend-development-engine`, consumindo os mesmos contratos de API e design system.

Mobile tem restrições específicas que não existem no desenvolvimento web: conectividade intermitente, recursos limitados de hardware, ciclos de release via app stores e experiências de usuário nativas diferentes por plataforma. Estas restrições devem guiar o design e a implementação.

---

## 🚀 Responsabilidades

* Implementar fluxos de UI mobile seguindo wireframes e design system adaptados para mobile
* Integrar com API backend via `contracts.api_spec`, implementando estratégia de cache offline quando necessário
* Implementar gerenciamento de estado mobile com solução definida em `architecture.tech_stack`
* Implementar push notifications quando no escopo
* Garantir performance de renderização: evitar renders desnecessários, otimizar listas longas
* Implementar tratamento de conectividade: offline mode, retry de requests, feedback ao usuário
* Preparar builds para distribuição via app stores (iOS App Store, Google Play)

---

## 🔥 Regras obrigatórias

* Todos os textos visíveis ao usuário devem ser em **português do Brasil (pt-br)**: labels, mensagens de erro, notificações push, alertas, textos de estados offline e telas de onboarding
* Offline mode e estados de conectividade devem ser tratados explicitamente — não como edge case ignorado
* Nenhuma lógica de negócio no mobile — mesma regra do frontend web
* Performance de renderização deve ser validada em dispositivos de baixo custo, não apenas em emuladores de high-end
* Secrets e tokens de API nunca em código-fonte — via variáveis de build ou secure storage

---

## ⚠️ Anti-patterns (proibido)

* Assumir conectividade permanente sem tratamento de offline/degraded mode
* Implementar regras de negócio no app mobile
* Ignorar otimização de performance em listas longas (FlatList sem otimização, renderAll)
* Crash sem tratamento de erro exibindo stack trace para o usuário

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `contracts.api_spec`, `ux.design_system`
* `architecture.tech_stack` (stack mobile definida)
* `engineering.backlog[]`

### Saídas para o OrchestratorContext
* Código-fonte mobile por plataforma/feature

### Dependências
`cicd-pipeline-engine`, `quality-gates-engine`.

### Paralelismo
`backend-development-engine`, `frontend-development-engine`.

---

## 🎯 Objetivo final

Entregar uma aplicação mobile que funcione de forma confiável em condições de conectividade variável, respeite o design system, consuma os contratos de API corretamente e seja distribuível via app stores sem retrabalho de adequação.
