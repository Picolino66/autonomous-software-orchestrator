---
name: data-modeling-engine
description: Modela entidades, relacionamentos, banco de dados e estrutura de persistência do sistema.
user-invocable: false
---

## 🧠 Descrição

Âncora de F3. Traduz o modelo de domínio (definido em `business-understanding-engine`) e as decisões arquiteturais (definidas em F2) em um modelo de dados formal: entidades, atributos, relacionamentos, constraints e estrutura de persistência por banco de dados.

O modelo de dados é um dos artefatos mais difíceis de evoluir sem impacto em produção. Uma modelagem errada em F3 se paga com migrations complexas, dados inconsistentes e reescrita de queries em F7. Por isso, exige máxima atenção às invariantes de domínio e à estratégia de consistência que `data-consistency-engine` refinará.

---

## 🚀 Responsabilidades

* Derivar entidades de negócio a partir do glossário de domínio e regras de negócio
* Definir atributos, tipos, nullability e valores default de cada entidade
* Modelar relacionamentos: cardinalidade, natureza (composição vs. associação), chaves estrangeiras
* Definir índices primários, únicos e compostos com justificativa de performance
* Versionar o schema desde a primeira versão (migration-based approach)
* Modelar para o banco de dados escolhido em `technology-stack-selector` (relacional, documento, etc.)
* Identificar entidades de alto volume que exigem estratégia de particionamento/sharding
* Documentar decisões de modelagem com justificativas (ex: por que desnormalizar em determinado ponto)

---

## 🔥 Regras obrigatórias

* O modelo de dados deve refletir o modelo de domínio, não a conveniência de persistência — nunca deixar o ORM ditar o modelo de domínio
* Toda entidade com ciclo de vida deve ter campo de soft delete ou histórico auditável quando o domínio exigir
* Dados pessoais (PII) devem ser identificados explicitamente no schema para guiar conformidade LGPD/GDPR
* Schemas devem ser versionados por migrations — nunca alterações manuais em produção
* Constraints de banco (NOT NULL, UNIQUE, FK) devem ser usados para garantir invariantes, não apenas validação na aplicação

---

## ⚠️ Anti-patterns (proibido)

* Tabela "genérica" com colunas `type`, `key`, `value` para evitar modelagem real
* Relacionamentos implícitos por convenção de nome sem constraint de FK
* Schema sem versionamento — impossibilita deploy confiável
* Modelar diretamente no ORM sem pensar no modelo de domínio
* Ignorar performance de queries na modelagem (índices como afterthought)

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `product.business_rules[]`, `product.domain_glossary`
* `architecture.tech_stack` (banco de dados)
* `architecture.layer_map`, `architecture.boundaries[]`

### Saídas para o OrchestratorContext
* `contracts.schemas[]` — entidades, atributos, relacionamentos, índices, versionamento

### Dependências
Snapshot O2 aprovado.

### Paralelismo
Nenhum — âncora de F3.

---

## 🎯 Objetivo final

Produzir um schema de banco de dados que seja fiel ao modelo de domínio, performático para os casos de uso críticos e evoluível sem downtime. O modelo deve ser versionado e documentado o suficiente para que qualquer desenvolvedor entenda as decisões tomadas.
