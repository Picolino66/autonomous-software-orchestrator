---
name: market-context-analysis
description: Analisa mercado, concorrentes, tendências e oportunidades estratégicas para posicionamento do produto.
user-invocable: false
---

## 🧠 Descrição

Responsável por construir a inteligência de mercado que fundamenta todas as decisões estratégicas do produto. Opera na abertura da Fase 1 (Discovery & Strategy), fornecendo o contexto competitivo e setorial sem o qual nem o modelo de negócio nem as personas podem ser definidos com precisão.

A análise não é superficial. Ela mapeia atores existentes, identifica lacunas de mercado, detecta tendências emergentes e estabelece o posicionamento diferencial do produto antes de qualquer investimento em arquitetura ou engenharia.

Seu output alimenta diretamente `business-model-definition`, `ideation-engine` e, indiretamente, todas as decisões de escopo e priorização.

---

## 🚀 Responsabilidades

* Mapear o cenário competitivo: players diretos, indiretos e substitutos
* Identificar tendências de mercado relevantes ao domínio do produto
* Detectar lacunas e oportunidades não atendidas pelo mercado atual
* Analisar modelos de negócio dos concorrentes (freemium, SaaS, marketplace, etc.)
* Avaliar tamanho de mercado e segmentos endereçáveis (TAM, SAM, SOM quando aplicável)
* Identificar ameaças regulatórias, tecnológicas e de timing
* Definir posicionamento diferencial preliminar do produto
* Documentar fontes e premissas da análise para rastreabilidade

---

## 🔥 Regras obrigatórias

* Nunca produzir análise de mercado sem identificar ao menos 3 concorrentes diretos com comparativo de features e modelo de negócio
* Toda tendência citada deve ter base objetiva (dados, movimento de mercado, adoção tecnológica) — nunca opinião genérica
* O posicionamento definido deve ser diferenciado: não aceitar "mais barato" ou "mais fácil" como diferencial único sem evidência
* Registrar todas as premissas de mercado como `market.assumptions[]` para revisão futura
* Nunca definir posicionamento em mercado que `feasibility-analysis-engine` ainda não validou como viável

---

## ⚠️ Anti-patterns (proibido)

* Análise de mercado genérica sem relação com o produto em questão
* Listar concorrentes sem comparar atributos relevantes
* Ignorar concorrentes indiretos ou substitutos
* Definir TAM/SAM/SOM sem metodologia clara
* Recomendar posicionamento de nicho sem validar que o nicho tem demanda suficiente
* Omitir ameaças de timing (produto cedo demais, tarde demais, regulação emergente)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Descrição inicial do produto (campo livre do usuário)
* `product.domain` — domínio de negócio informado

### Saídas para o OrchestratorContext
* `market.landscape` — visão geral do mercado
* `market.competitors[]` — lista de concorrentes com atributos comparativos
* `market.positioning` — posicionamento diferencial recomendado
* `market.trends[]` — tendências relevantes identificadas
* `market.assumptions[]` — premissas da análise

### Dependências
Nenhuma — âncora de F1, pode iniciar imediatamente.

### Paralelismo
Pode executar em paralelo com `persona-definition-engine` e `business-model-definition`.

---

## 🎯 Objetivo final

Entregar inteligência de mercado estruturada que elimine decisões estratégicas baseadas em suposição. O output deve permitir que `ideation-engine` e `business-model-definition` trabalhem com contexto real de mercado, reduzindo o risco de construir um produto sem diferencial ou em mercado saturado sem vantagem competitiva clara.
