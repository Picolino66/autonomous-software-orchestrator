---
name: ai-docs-self-healing-engine
description: Mantém /docs como Knowledge Layer do projeto para IA — documentação humana, índices machine-readable, grafos de código e integração, freshness verificável e healing localizado dirigido por diff.
user-invocable: false
---

## 🧠 Descrição

Estabelece e mantém `/docs` como a **AI Documentation Knowledge Layer** do projeto: uma base de conhecimento que permite a qualquer agente responder sobre arquitetura, features, fluxos, regras de negócio, endpoints, dependências e impacto de mudanças **sem varrer o código-fonte**.

A camada tem duas faces complementares:

* **Camada humana** — `/docs/**.md`, conciso e navegável, com `/docs/index.md` como ponto de entrada
* **Camada de recuperação** — `/docs/.ai/*.json`, índices compactos, Code Graph, Integration Graph, Business Flow Graph, Traceability Graph e freshness

Enquanto a `documentation-engine` produz documentação técnica orientada ao desenvolvedor (OpenAPI, ADRs, guia de dev), esta skill constrói e mantém a estrutura de conhecimento consultada por agentes — organizada por módulo e feature, com identidade estável e verificação objetiva de atualidade.

A documentação é tratada como código vivo: o drift é detectado por `git diff` + hash de símbolo, e não pela percepção do modelo. A correção é sempre **localizada**, proporcional ao tipo de mudança detectada.

A skill é **transversal a F4–F7** e opera em quatro modos explícitos: `bootstrap`, `incremental`, `audit` e `continuous`.

Especificação normativa completa — schemas, vocabulários, IDs, confiança, freshness e quality gate — em [knowledge-layer.md](../knowledge-layer.md).

---

## 🔁 Modos de operação

| Modo | Fase | Gatilho | Escopo |
|---|---|---|---|
| `bootstrap` | F4 | após `agentic-project-structure-engine` | criar `/docs` e `/docs/.ai` com IDs derivados das specs; índices ainda sem código |
| `incremental` | F5 | cada entrega de módulo/feature | documentar o que foi implementado; atualizar índices e grafos afetados |
| `audit` | F6 | antes do deploy | auditoria completa, quality gate `AI-DOC`, retrieval test suite |
| `continuous` | F7 | mudança de código, incidente, evolução | healing localizado dirigido por diff; refresh de freshness |

### `bootstrap` (F4)

* Cria `/docs/index.md`, `/docs/modules/` e `/docs/.ai/` com metadata de schema
* Atribui **IDs estáveis** a módulos e features planejadas, a partir de `agentic.specs_map` e `engineering.module_map`
* Gera `index.json`, `features.json` e `freshness.json` com entradas ainda sem `source_hash` (código inexistente)
* Marca cada feature planejada com `state: planned` — documentar comportamento ainda não implementado é anti-pattern
* Registra `repository_id` e, quando aplicável, `system_id`

### `incremental` (F5)

* A cada feature entregue: cria ou atualiza o `.md` da feature com frontmatter mínimo preenchido
* Executa análise estática do escopo entregue e atualiza os nodes/edges afetados
* Atualiza somente os índices derivados impactados
* Calcula `source_hash` dos símbolos referenciados e grava `last_verified_commit`
* Nenhuma feature é considerada entregue sem doc e entrada de índice correspondentes

### `audit` (F6)

* Varredura completa de consistência: links, órfãos, índices apontando para artefatos inexistentes, símbolos apontando para código inexistente
* Reconciliação entre contratos publicados (OpenAPI/AsyncAPI) e `routes.json`/`events.json`
* Validação do Integration Graph e das relações cross-repo críticas
* Execução da **Retrieval Test Suite** e registro das métricas
* Aplicação do quality gate `AI-DOC`
* Sincronização de `AGENTS.md`, `CLAUDE.md` e `GEMINI.md` quando houver mudança estrutural

### `continuous` (F7)

* Healing dirigido por diff a cada mudança de código (protocolo abaixo)
* Reavaliação de freshness em cadência regular
* Atualização do Business Flow Graph quando a operação revela fluxo real divergente do documentado
* Fornece análise de impacto para `maintenance-engine`, `continuous-evolution-engine` e `architectural-reassessment-engine`

---

## 🚀 Responsabilidades

* Manter `/docs/index.md` como ponto de entrada humano, listando módulos com links navegáveis
* Manter `/docs/modules/<module>/index.md` e `/docs/modules/<module>/<feature>.md` conforme o template obrigatório
* Atribuir e preservar **IDs estáveis** independentes do nome físico do arquivo
* Gerar e manter os artefatos machine-readable de `/docs/.ai/` conforme obrigatoriedade proporcional ao projeto
* Derivar o **Code Graph** por análise estática da stack detectada, com fallback declarado e confiança registrada
* Derivar o **Integration Graph**, incluindo travessias entre repositórios do mesmo `system_id`
* Manter o **Business Flow Graph** ligando fluxos de domínio a features, rotas, símbolos e regras
* Manter o **Traceability Graph** bidirecional entre requisito, regra, feature, ADR, endpoint/evento, código, teste e doc
* Executar **análise de impacto** sob demanda, percorrendo o grafo no sentido inverso
* Detectar drift por `git diff` + `source_hash`, classificar o tipo de mudança e aplicar healing proporcional
* Validar links internos, órfãos e integridade referencial dos índices
* Sincronizar `AGENTS.md`, `CLAUDE.md` e `GEMINI.md` apenas em mudança estrutural ou regra global relevante
* Registrar no `OrchestratorContext` apenas **ponteiros e métricas** da knowledge layer — nunca os grafos

---

## 🔎 Protocolo de retrieval

Substitui a navegação sequencial anterior. Princípio: **INDEX FIRST → DOCS SECOND → CODE LAST**.

```
PERGUNTA
   ↓
detecção de intenção e chave (feature, endpoint, símbolo, evento, entidade, regra, ADR, fluxo, repositório)
   ↓
/docs/.ai/index.json                    (único artefato carregável por inteiro)
   ↓
consulta seletiva ao índice especializado da chave
   ↓
vizinhança do grafo (1-hop; 2-hop apenas em impacto ou fluxo ponta a ponta)
   ↓
leitura apenas dos docs candidatos
   ↓
suficiente?
   ├── sim → responder
   └── não → código-fonte, declarando o fallback na resposta
```

Se `index.json` não existir, a skill está em projeto ainda não indexado: opera-se em `bootstrap` antes de responder por navegação.

---

## 🩹 Protocolo de healing

```
git diff <last_indexed_commit>..HEAD
   ↓
arquivos alterados
   ↓
symbol diff (AST) + contract diff (OpenAPI/AsyncAPI)
   ↓
nodes alterados → edges impactadas → features impactadas → docs impactados
   ↓
classificar mudança: none | technical | behavioral | architectural
   ↓
healing proporcional à categoria
   ↓
refresh dos índices afetados + freshness + source_commit
```

| Categoria | Ação |
|---|---|
| `none` | atualizar apenas `last_verified_commit` e `source_hash`; não reescrever texto |
| `technical` | atualizar frontmatter e índices derivados; corpo só se entrada, saída ou erros mudaram |
| `behavioral` | reescrever `Regras de negócio` e `Fluxo resumido`; revisar Business Flow e traceability; `stale-critical` até concluir |
| `architectural` | tudo de `behavioral` + Integration Graph + `index.json` + exigir ADR + propagar para repositórios do mesmo `system_id` |

---

## 🔥 Regras obrigatórias

**Template de feature obrigatório** — frontmatter mínimo + corpo:

```markdown
---
id: <module>.<feature>
type: feature
module: <module>
title: <título curto>
summary: <1–3 linhas>
code: [<caminhos reais>]
last_verified_commit: <sha>
---

# Nome

## Descrição
## Localização no código
## Entrada
## Saída
## Dependências
## Regras de negócio
## Fluxo resumido
## Possíveis erros
```

**Estrutura de diretórios obrigatória:**

```
/docs
  index.md
  /.ai
    index.json
    features.json
    freshness.json
    (demais artefatos conforme obrigatoriedade proporcional)
  /modules
    /<module>
      index.md
      <feature>.md
```

* **SEMPRE** redigir todo o conteúdo Markdown de `/docs` em **português do Brasil (pt-br)**
* **SEMPRE** consultar `/docs/.ai/index.json` antes de qualquer leitura de código
* **SEMPRE** atribuir ID estável a toda feature documentada, derivado do conceito e não do arquivo
* **SEMPRE** preservar o ID em refatoração, rename ou troca de framework; registrar nome anterior em `aliases`
* **SEMPRE** atualizar índices derivados na mesma operação em que o documento é alterado
* **SEMPRE** registrar `confidence` e `evidence` nas relações dos grafos
* **SEMPRE** classificar o tipo de mudança antes de decidir o escopo do healing
* **SEMPRE** aplicar a precedência de fonte de verdade: em drift comprovado, **code wins**, doc marcado stale e healing localizado
* **NUNCA** acessar código diretamente sem antes verificar se a knowledge layer responde
* **NUNCA** carregar grafos inteiros no contexto — apenas vizinhança a partir de um node âncora
* **NUNCA** gravar grafos ou índices dentro do `OrchestratorContext` — apenas caminho, hash, versão e métricas
* **NUNCA** apresentar relação `inferred` ou `unknown` como fato arquitetural
* **NUNCA** indexar secrets, tokens, senhas, connection strings, conteúdo de `.env`, credenciais de cloud ou dados pessoais reais — registrar apenas a existência conceitual da dependência
* **NUNCA** editar manualmente artefatos de `/docs/.ai/` — são derivados e regeneráveis
* **NUNCA** regenerar a knowledge layer inteira por causa de mudança localizada, exceto em `bootstrap`, corrupção detectada ou mudança de `schema_version`
* **NUNCA** prometer precisão total do Code Graph — usar "alta precisão estrutural" e "deterministicamente verificável"

---

## ⚠️ Anti-patterns (proibido)

* Ignorar `/docs` e ir direto ao código sem necessidade
* Varrer todo o repositório para responder algo já indexado
* Reconstruir todo o grafo após uma mudança localizada
* Armazenar o grafo inteiro no contexto do LLM
* Duplicar informação canônica em vários índices
* Inferir relação cross-service sem evidência
* Tratar relação probabilística como deterministicamente comprovada
* Documentar implementação que não existe no código
* Atualizar documentação sem atualizar o índice associado
* Alterar índice manualmente sem atualizar a fonte canônica
* Indexar secrets ou dados sensíveis
* Gerar centenas de documentos minúsculos sem valor semântico
* Usar o arquivo físico como identidade única da feature
* Frontmatter gigante que duplica o corpo do documento
* Marcar `last_verified_commit` sem ter verificado a correspondência
* Criar documentação genérica, vaga, duplicada ou fora de `/docs`
* Quebrar a estrutura de diretórios ou o template obrigatório de feature
* Deixar índices com links quebrados ou features sem referência no índice do módulo
* Alterar `AGENTS.md`, `CLAUDE.md` ou `GEMINI.md` sem relevância estrutural ou regra global
* Duplicar informação já presente na documentação técnica da `documentation-engine`

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `engineering.module_map`, `engineering.feature_breakdown[]` — estrutura de `/docs/modules/` e IDs iniciais
* `agentic.specs_map`, `agentic.traceability_rules` — convenções de identidade e rastreabilidade definidas em F4
* `architecture.*` — padrão arquitetural, camadas, `tech_stack` (define a estratégia de análise estática), ADRs
* `contracts.api_spec`, `contracts.schemas` — fonte canônica de rotas, eventos e entidades
* `product.business_rules[]`, `requirements.functional[]` — traceability e seção de regras de negócio
* Snapshots O1–O5 — contexto acumulado de produto, decisões e implementação

### Saídas para o OrchestratorContext
* `agentic.docs_map` — módulos e features documentados, com ID e caminho do doc
* `agentic.knowledge_layer` — **apenas ponteiros e métricas**:

```json
{
  "path": "docs/.ai",
  "schema_version": "1",
  "source_commit": "9243abc",
  "repository_id": "checkout-api",
  "system_id": "commerce-platform",
  "artifacts": { "features.json": "sha256:...", "routes.json": "sha256:..." },
  "counts": { "modules": 7, "features": 42, "routes": 31, "events": 9 },
  "health": { "fresh": 39, "stale": 3, "stale_critical": 0, "broken_references": 0 },
  "retrieval_tests": { "success_rate": 0.93, "docs_only_rate": 0.85 },
  "coverage_exceptions": ["dispatch dinâmico em src/plugins"],
  "agents_synced": true
}
```

### Dependências
`agentic-project-structure-engine` (modo `bootstrap`, F4); `quality-assurance-engine` (modo `audit`, F6).

### Paralelismo
`documentation-engine`, `operational-documentation-engine` (F6). Em F5 e F7, opera em paralelo às sub-skills de desenvolvimento e sustentação.

---

## 🎯 Objetivo final

Tornar `/docs` a camada de conhecimento primária do projeto para qualquer agente — presente ou futuro — encontrar contexto rapidamente, navegar fluxos ponta a ponta entre repositórios, medir o impacto de uma mudança antes de executá-la e manter documentação e código sincronizados por verificação objetiva, reduzindo leitura desnecessária de código e consumo de tokens sem alucinar dependências.
