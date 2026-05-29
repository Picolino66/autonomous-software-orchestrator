---
name: automated-testing-engine
description: Cria e organiza suíte completa de testes unitários, integração, contrato e end-to-end.
user-invocable: false
---

## 🧠 Descrição

Implementa a suíte de testes automatizados do sistema cobrindo todas as camadas: testes unitários de use cases e entidades de domínio, testes de integração de repositórios e adapters, testes de contrato de API e testes end-to-end dos fluxos críticos.

Testes não são um passo opcional do desenvolvimento — são a documentação executável do comportamento esperado do sistema. Um sistema sem testes é um sistema que só pode ser modificado com medo.

Opera progressivamente à medida que `backend-development-engine` e `frontend-development-engine` entregam módulos.

---

## 🚀 Responsabilidades

* Implementar testes unitários da camada de domínio: entities, value objects, use cases
* Implementar testes de integração de repositórios com banco de dados real (não mockado)
* Implementar testes de contrato de API com `contracts.api_spec` como source of truth
* Implementar testes end-to-end dos fluxos críticos definidos em `ux.validated_journeys[]`
* Garantir que a cobertura atinja o threshold definido em `engineering.test_coverage_threshold`
* Configurar test fixtures, factories e seeds para dados de teste reutilizáveis
* Implementar testes de performance básicos para endpoints críticos (smoke load test)

---

## 🔥 Regras obrigatórias

* Testes de integração devem usar banco de dados real em container — nunca apenas mocks de repositório
* Testes de contrato devem falhar se a implementação diverge de `contracts.api_spec`
* Testes end-to-end devem cobrir o happy path e os principais caminhos de erro dos fluxos críticos
* Todo teste deve ter nome descritivo que funcione como documentação do comportamento
* Testes não devem ter dependência de ordem de execução — cada teste deve ser independente

---

## ⚠️ Anti-patterns (proibido)

* Mocks de banco de dados em testes de integração (mascaram problemas reais de queries)
* Testes que testam implementação em vez de comportamento ("certifica que chamou o método X")
* Coverage 100% com testes triviais que não validam comportamento real
* Testes end-to-end para tudo — reservar e2e para fluxos críticos, usar unit/integration para o resto
* Testes frágeis que falham por mudanças irrelevantes de implementação

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Código-fonte dos módulos implementados
* `contracts.api_spec`, `engineering.test_coverage_threshold`
* `ux.validated_journeys[]`

### Saídas para o OrchestratorContext
* `quality.test_results` — resultados da suíte de testes
* `quality.coverage_report` — relatório de cobertura por módulo

### Dependências
Módulos de `backend-development-engine` e `frontend-development-engine`.

### Paralelismo
`security-testing-engine`.

---

## 🎯 Objetivo final

Entregar uma suíte de testes que funcione como documentação executável do comportamento do sistema — onde qualquer desenvolvedor pode modificar código com confiança porque os testes capturarão regressões antes do deploy.
