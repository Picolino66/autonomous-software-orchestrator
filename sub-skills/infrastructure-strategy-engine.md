---
name: infrastructure-strategy-engine
description: Planeja infraestrutura, cloud, containers, serverless e estratégia operacional do sistema.
user-invocable: false
---

## 🧠 Descrição

Define a estratégia de infraestrutura que suportará o sistema em produção: cloud provider, modelo de execução (containers, serverless, VMs), estratégia de escalabilidade, ambientes e abordagem de IaC (Infrastructure as Code).

Opera após `layered-architecture-engine` e `integration-definition-engine` terem definido a estrutura interna e as dependências externas. A estratégia de infraestrutura não pode ser definida sem conhecer o padrão arquitetural, os requisitos não funcionais e as integrações externas.

---

## 🚀 Responsabilidades

* Selecionar cloud provider(s) com justificativa baseada em requisitos e restrições
* Definir modelo de execução: containers (Kubernetes, ECS), serverless (Lambda, Cloud Functions), PaaS, ou híbrido
* Planejar estratégia de escalabilidade: horizontal, vertical, auto-scaling policies
* Definir ambientes: local, dev, staging, production — com estratégia de promoção entre ambientes
* Selecionar ferramenta de IaC: Terraform, Pulumi, CDK, etc.
* Planejar estratégia de networking: VPCs, subnets, load balancers, DNS
* Definir estratégia de backup, disaster recovery e RTO/RPO
* Estimar custo de infraestrutura por ambiente e fase

---

## 🔥 Regras obrigatórias

* A escolha de cloud provider deve ser justificada — lock-in de provider deve ser explicitamente aceito como trade-off
* Nenhum ambiente de produção sem estratégia de disaster recovery definida
* IaC é obrigatório — infraestrutura manual não replicável é inaceitável em ambiente de engenharia profissional
* Estratégia de escalabilidade deve ser coerente com os SLOs definidos em `metrics-definition-engine`
* Custo estimado de infraestrutura deve ser validado contra `feasibility.constraints[]`

---

## ⚠️ Anti-patterns (proibido)

* Infraestrutura definida sem considerar custo em escala ("vemos isso quando o produto crescer")
* Ambiente de produção diferente do ambiente de staging em configuração relevante
* Kubernetes para aplicações simples sem justificativa de complexidade operacional
* Nenhuma estratégia de rollback de infraestrutura
* Infraestrutura não versionada (click-ops, console manual)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.pattern`, `architecture.layer_map`
* `architecture.integration_contracts[]`
* `requirements.non_functional[]`, `feasibility.constraints[]`

### Saídas para o OrchestratorContext
* `architecture.infrastructure_strategy` — cloud, modelo de execução, IaC, ambientes, scaling, DR

### Dependências
`layered-architecture-engine`, `integration-definition-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Estabelecer uma estratégia de infraestrutura que seja replicável, versionada, escalável e dentro das restrições financeiras identificadas. A infraestrutura deve ser código, não configuração manual — garantindo que qualquer ambiente possa ser reproduzido deterministicamente.
