---
name: code-governance-engine
description: Define governança de código, versionamento, convenções e organização técnica do projeto.
user-invocable: false
---

## 🧠 Descrição

Estabelece as regras que governam como o código é escrito, revisado e versionado: lint, formatting, commit conventions, branch strategy, code review checklist e políticas de merge. Garante que o código produzido por múltiplos desenvolvedores seja coeso e padronizado.

Sem governança, times produzem código heterogêneo que é difícil de ler, revisar e manter. Governança não é burocracia — é o conjunto de regras que torna o código previsível e consequentemente mais seguro de modificar.

---

## 🚀 Responsabilidades

* Configurar linter estático: ESLint, Pylint, golangci-lint — com ruleset compatível com a stack
* Configurar formatter: Prettier, Black, gofmt — com configuração commitada ao repositório
* Configurar pre-commit hooks (Husky + lint-staged ou equivalente)
* Definir e configurar conventional commits com commitlint
* Definir branch strategy: git-flow, trunk-based ou feature branch com regras explícitas
* Criar checklist de code review com itens de arquitetura, segurança e qualidade
* Configurar proteção de branch main/master: require PR, require review, require CI verde

---

## 🔥 Regras obrigatórias

* Lint e formatter devem rodar obrigatoriamente no pre-commit — código não formatado nunca chega ao repositório
* Branch principal (main/master) deve ter proteção habilitada: sem push direto, require PR + CI verde
* Conventional commits obrigatório — habilita geração automática de changelog
* Ruleset de lint deve ser commitada e versionada — não configuração individual por desenvolvedor
* Code review checklist deve incluir verificação de aderência aos padrões de camadas definidos em F2

---

## ⚠️ Anti-patterns (proibido)

* "Cada desenvolvedor usa seu próprio formatter" — inconsistência de código gera diffs irrelevantes
* Commits de merge direto na branch principal sem PR
* Convencional commits como "recomendação" em vez de regra técnica aplicada por hook
* Lint com muitos warnings ignorados — warnings acumulados perdem significado

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.tech_stack`, `engineering.project_structure`

### Saídas para o OrchestratorContext
* `engineering.governance_rules` — convenções, branch strategy, commit policy, review checklist

### Dependências
`project-setup-engine`.

### Paralelismo
`architectural-patterns-engine`.

---

## 🎯 Objetivo final

Criar um ambiente de desenvolvimento onde a qualidade mínima de código é garantida por ferramentas automáticas, não por disciplina individual — liberando code reviews para análise de lógica e arquitetura em vez de formatação e convenções.
