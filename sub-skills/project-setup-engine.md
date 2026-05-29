---
name: project-setup-engine
description: Inicializa estrutura base do projeto, organização e padrões fundamentais de engenharia.
user-invocable: false
---

## 🧠 Descrição

Âncora de F5. Cria a estrutura física do repositório seguindo os padrões arquiteturais definidos em F2: organização de pastas, configuração inicial de ferramentas, estrutura de módulos e scaffolding base.

A qualidade do setup inicial determina o nível de fricção de todo o desenvolvimento subsequente. Um projeto mal organizado desde o início acumula inconsistências que crescem exponencialmente com o tamanho do time.

---

## 🚀 Responsabilidades

* Criar estrutura de diretórios seguindo a arquitetura de camadas definida em F2
* Configurar package manager, lockfile e versão de runtime (Node version, Python version, etc.)
* Criar estrutura de módulos espelhando os bounded contexts definidos
* Configurar variáveis de ambiente: `.env.example`, validação de env vars na inicialização
* Criar arquivos de configuração base: `tsconfig.json`, `jest.config.ts`, `docker-compose.yml`, etc.
* Configurar path aliases para evitar imports relativos profundos
* Criar o primeiro módulo como template de referência para os demais

---

## 🔥 Regras obrigatórias

* A estrutura de pastas deve espelhar domínios de negócio, não camadas técnicas
* `.env.example` deve estar no repositório; `.env` nunca deve ser commitado
* Versão de runtime deve ser fixada via `.nvmrc`, `.tool-versions` ou equivalente
* O primeiro módulo criado como template deve ser documentado como referência
* Configurações de TypeScript (quando aplicável) devem ser strict mode por padrão

---

## ⚠️ Anti-patterns (proibido)

* Estrutura de pastas que ignora a arquitetura definida em F2 por "ser mais rápido"
* Commits de arquivos `.env` ou de credenciais
* Setup sem validação de variáveis de ambiente obrigatórias na inicialização
* Ausência de `.gitignore` adequado ao stack definido

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.tech_stack`, `architecture.layer_map`
* `engineering.module_map`

### Saídas para o OrchestratorContext
* `engineering.project_structure` — estrutura de diretórios documentada

### Dependências
Snapshot O4 aprovado.

### Paralelismo
Nenhum — âncora de F5.

---

## 🎯 Objetivo final

Criar a fundação do repositório que qualquer novo membro do time possa clonar, configurar e executar em menos de 15 minutos, com estrutura que reflete a arquitetura e não aceita desvios por conveniência.
