---
name: integration-definition-engine
description: Define integrações externas, contratos, gateways e comunicação entre serviços.
user-invocable: false
---

## 🧠 Descrição

Mapeia e especifica todas as integrações que o sistema precisa estabelecer com o mundo externo: APIs de terceiros, sistemas legados, gateways de pagamento, provedores de identidade, serviços de cloud e comunicação entre os próprios serviços do sistema.

Opera em paralelo com `layered-architecture-engine` após `system-design-engine`. Integrações mal planejadas são uma das principais causas de atrasos em projetos: um provider de pagamento com API complexa ou um sistema legado com restrições de acesso podem bloquear entregas inteiras se não forem mapeados previamente.

---

## 🚀 Responsabilidades

* Catalogar todas as dependências externas do sistema (APIs, SDKs, sistemas de terceiros)
* Definir os contratos de integração: formato de dados, autenticação, rate limits, SLAs do provider
* Especificar estratégia de integração para cada dependência: SDK oficial, REST direto, via gateway/adapter
* Identificar dependências críticas de path (sem as quais o sistema não funciona) vs. dependências opcionais
* Definir estratégias de fallback e degradação graciosa para cada integração crítica
* Mapear riscos de cada dependência externa: lock-in, instabilidade, custo, descontinuação
* Definir contratos de comunicação entre os próprios serviços do sistema (quando microsserviços)

---

## 🔥 Regras obrigatórias

* Toda integração com sistema externo deve ter um adapter/anti-corruption layer — nunca consumir APIs de terceiros diretamente na camada de domínio
* Dependências críticas de path devem ter circuit breaker e fallback definidos em F2 — não em F5
* Rate limits de APIs externas devem ser mapeados e considerados no design de filas e batching
* Contratos de comunicação entre serviços devem ser versionados desde o início — nunca começar sem versionamento
* Toda integração com dados pessoais (OAuth, analytics, CRM) deve ser mapeada para avaliação de conformidade por `security-architecture-engine`

---

## ⚠️ Anti-patterns (proibido)

* Chamar APIs de terceiros diretamente a partir de use cases de domínio
* Ignorar rate limits até o sistema ir para produção e começar a ser bloqueado
* Dependência de sistema legado sem anti-corruption layer que proteja o domínio
* Contratos de integração implícitos ("ambos os serviços vão saber o formato")
* Não mapear custo de integração (chamadas de API têm custo em escala)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.services[]`, `architecture.communication_patterns`
* `requirements.non_functional[]`, `requirements.constraints[]`
* `scope.included[]`

### Saídas para o OrchestratorContext
* `architecture.integration_contracts[]` — catálogo de integrações com contrato e estratégia
* `architecture.external_dependencies[]` — dependências externas com riscos e mitigação

### Dependências
`system-design-engine`.

### Paralelismo
`layered-architecture-engine`.

---

## 🎯 Objetivo final

Garantir que nenhuma dependência externa seja uma surpresa em F5. O catálogo de integrações deve ser completo o suficiente para que `technology-stack-selector` e `infrastructure-strategy-engine` possam tomar decisões informadas sobre ferramentas e provedores.
