---
name: documentation-engine
description: Gera documentação técnica, arquitetural e funcional completa do sistema.
user-invocable: false
---

## 🧠 Descrição

Gera a documentação técnica do sistema consolidando os artefatos produzidos em F1–F5: arquitetura do sistema, decisões registradas (ADRs), contratos de API, modelo de dados e guia de desenvolvimento.

Documentação não é um luxo — é o mecanismo que permite que o sistema evolua sem a presença dos criadores originais. Sistemas sem documentação técnica são sistemas com dívida de conhecimento que cresce a cada semana.

Opera em paralelo com `operational-documentation-engine` após `quality-assurance-engine`.

---

## 🚀 Responsabilidades

* Gerar documentação de arquitetura: visão macro, componentes, decisões (ADRs linkados)
* Publicar especificação OpenAPI/AsyncAPI como documentação de API interativa
* Documentar o modelo de dados: entidades, relacionamentos, índices, convenções
* Criar guia de desenvolvimento: setup, padrões, como adicionar um módulo, como escrever testes
* Documentar fluxos de integração com sistemas externos
* Criar diagrama de sequência dos fluxos críticos de negócio
* Documentar modelo de segurança: como funciona auth, como testar em local, como adicionar permissões

---

## 🔥 Regras obrigatórias

* Toda documentação gerada deve ser redigida em **português do Brasil (pt-br)**: arquitetura, guias de desenvolvimento, ADRs, descrições OpenAPI/AsyncAPI, diagramas e comentários
* Documentação deve ser gerada junto com o código — não após o projeto estar "estável"
* ADRs devem ser linkados da documentação de arquitetura — não documentação sem rastreabilidade de decisão
* Guia de desenvolvimento deve ser testado: um desenvolvedor novo deve conseguir fazer setup seguindo apenas o guia
* OpenAPI spec deve ser a documentação de API — nunca documentação separada que pode divergir

---

## ⚠️ Anti-patterns (proibido)

* Documentação de arquitetura que descreve o que deveria ser, não o que é
* Guia de desenvolvimento com passos que não funcionam por estarem desatualizados
* Documentação apenas no README.md do repositório sem estrutura navegável
* ADRs sem referência cruzada na documentação de arquitetura

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* Snapshots O1–O5, `contracts.api_spec`, `architecture.adrs[]`
* `engineering.patterns_applied[]`, `architecture.*`

### Saídas para o OrchestratorContext
* Documentação técnica completa e acessível

### Dependências
`quality-assurance-engine`.

### Paralelismo
`operational-documentation-engine`.

---

## 🎯 Objetivo final

Produzir documentação técnica que permita a qualquer engenheiro entender o sistema, contribuir para ele e evoluí-lo sem precisar das pessoas que o construíram originalmente.
