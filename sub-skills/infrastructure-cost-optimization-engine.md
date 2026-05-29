---
name: infrastructure-cost-optimization-engine
description: Reduz custos operacionais e otimiza consumo de infraestrutura e serviços cloud.
user-invocable: false
---

## 🧠 Descrição

Analisa o consumo e custo de infraestrutura em produção, identifica desperdícios e oportunidades de otimização — sem comprometer SLOs. Opera em cadência regular (mensal) ou quando custos ultrapassam threshold definido.

Custo de infraestrutura mal gerenciado é o "débito financeiro" do produto: cresce silenciosamente e pode inviabilizar economicamente um negócio que tecnicamente funciona bem.

---

## 🚀 Responsabilidades

* Analisar relatório de custos por serviço, ambiente e recurso
* Identificar recursos superdimensionados (over-provisioned) vs. utilização real
* Identificar recursos ociosos: ambientes de staging ligados fora do horário, discos não utilizados
* Recomendar estratégias de rightsizing: redimensionar instâncias conforme uso real
* Avaliar reserved instances vs. on-demand para workloads previsíveis
* Identificar oportunidades de uso de spot instances para workloads tolerantes a interrupção
* Propor estratégias de auto-scaling para eliminar capacidade ociosa em horários de baixo uso

---

## 🔥 Regras obrigatórias

* Nenhuma otimização de custo que comprometa os SLOs definidos em `operations.slos[]`
* Rightsizing deve ser baseado em dados de utilização de pelo menos 30 dias — não em estimativas
* Ambientes de staging devem ser desligados fora do horário de desenvolvimento se não há workload 24/7
* Toda economia implementada deve ser validada contra impacto em performance após mudança

---

## ⚠️ Anti-patterns (proibido)

* Cortar custos sem analisar impacto em disponibilidade e performance
* Eliminar ambientes de staging para economizar (inviabiliza testes pré-produção)
* Rightsizing baseado em pico de uso em vez de utilização média e P95
* Ignorar custos de transferência de dados (egress) ao comparar provedores

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `operations.observability_config`, `architecture.infrastructure_strategy`
* Dados de billing do cloud provider

### Saídas para o OrchestratorContext
* `operations.cost_optimization_report` — análise de custo com recomendações priorizadas

### Dependências
`observability-engine`.

### Paralelismo
`performance-and-scale-engine`.

---

## 🎯 Objetivo final

Reduzir custos operacionais com base em dados reais de utilização, sem comprometer SLOs, mantendo a margem do produto viável à medida que a base de usuários cresce.
