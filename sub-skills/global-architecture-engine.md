---
name: global-architecture-engine
description: Define arquitetura macro do sistema incluindo padrão estrutural, serviços e limites de domínio.
user-invocable: false
---

## 🧠 Descrição

Âncora de F2. Define o padrão arquitetural macro do sistema — monolito modular, microsserviços, serverless ou híbrido — com base no contexto de produto, escala esperada, maturidade do time e restrições de viabilidade.

Esta é a decisão mais impactante e de maior custo de reversão em todo o pipeline. Uma escolha errada de padrão arquitetural em F2 se paga com meses de refatoração em F5/F7. Por isso, a decisão deve ser documentada como ADR com alternativas consideradas, trade-offs e condições de revisão.

Seu output é a fundação sobre a qual todas as outras sub-skills de F2 operam.

---

## 🚀 Responsabilidades

* Selecionar o padrão arquitetural principal com justificativa baseada em evidências (não preferência)
* Identificar os serviços ou módulos de alto nível do sistema
* Definir os limites entre domínios (bounded contexts) em linguagem de DDD
* Mapear responsabilidades de cada serviço/módulo
* Identificar pontos de integração entre serviços
* Documentar ADR de padrão arquitetural com: contexto, alternativas, decisão, trade-offs, condições de revisão
* Definir critérios para evolução da arquitetura (quando um módulo deve virar serviço, etc.)

---

## 🔥 Regras obrigatórias

* A escolha de microsserviços para um MVP ou time pequeno (< 5 devs) requer justificativa excepcional — o default é modular monolith
* Toda decisão arquitetural deve produzir um ADR antes de prosseguir
* Bounded contexts devem ser definidos em linguagem de domínio, não em termos técnicos
* A arquitetura deve ser consistente com `feasibility.constraints[]` — não propor o que foi identificado como inviável
* Nunca definir arquitetura baseada em preferência de tecnologia — partir das necessidades do domínio

---

## ⚠️ Anti-patterns (proibido)

* "Vamos começar com microsserviços porque é mais moderno" sem análise de custo/benefício
* Bounded contexts definidos por camada técnica (controller, service, repository) em vez de domínio
* Arquitetura definida sem considerar o time que vai implementá-la
* Monolito "big ball of mud" sem modularização como alternativa ao microsserviços
* Separar serviços por funcionalidade técnica (auth-service, email-service) em vez de domínio de negócio

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Snapshot O1 completo: `product.*`, `requirements.*`, `scope.*`, `feasibility.*`

### Saídas para o OrchestratorContext
* `architecture.pattern` — padrão selecionado
* `architecture.services[]` — serviços/módulos com responsabilidades
* `architecture.boundaries[]` — bounded contexts definidos
* `architecture.adrs[]` — ADR de padrão arquitetural

### Dependências
Snapshot O1 aprovado.

### Paralelismo
Nenhum — âncora de F2.

---

## 🎯 Objetivo final

Estabelecer a estrutura macro do sistema como uma decisão documentada, justificada e revisável — não como um pressuposto implícito. O padrão arquitetural escolhido deve ser adequado ao contexto real do produto, não ao contexto ideal de um artigo técnico.
