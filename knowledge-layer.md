# AI Documentation Knowledge Layer — Especificação Normativa

Especificação da camada de conhecimento consumida por agentes de IA. Define layout de artefatos, identificadores estáveis, schema de frontmatter, vocabulário dos grafos, modelo de confiança, estratégia de análise estática, correlação multi-repositório, freshness, classificação de mudança, protocolo de retrieval, quality gate e suíte de testes de recuperação.

Documento normativo. A skill operacional que o executa é [sub-skills/ai-docs-self-healing-engine.md](./sub-skills/ai-docs-self-healing-engine.md). As convenções de identidade e rastreabilidade são estabelecidas em F4 por [sub-skills/agentic-project-structure-engine.md](./sub-skills/agentic-project-structure-engine.md).

---

## 1. Princípio e camadas

```
              HUMAN LAYER
              /docs/**.md
                   │
             RETRIEVAL LAYER
              /docs/.ai/
                   │
          ┌────────┼────────┐
          │        │        │
       indexes   graphs   freshness
          │        │        │
          └────────┼────────┘
                   │
             ANALYSIS LAYER
          AST + contratos + diff
                   │
                   ▼
               SOURCE CODE
```

**Princípio central:**

```
INDEX FIRST → DOCS SECOND → CODE LAST
```

O agente consulta índices compactos antes de abrir documentos, e documentos antes de abrir código. Código é o fallback quando a camada de conhecimento não é suficiente ou está comprovadamente desatualizada.

O Knowledge Graph é a união de quatro grafos com propósitos distintos:

```
Knowledge Graph = Code Graph + Integration Graph + Business Flow Graph + Traceability Graph
```

| Grafo | Responde | Derivado de |
|---|---|---|
| Code Graph | estrutura interna: quem chama, implementa, lê, escreve | AST, imports, metadata de framework |
| Integration Graph | comunicação entre módulos, serviços e repositórios | rotas, contratos, clientes HTTP, tópicos, filas |
| Business Flow Graph | comportamento em linguagem de domínio | specs, regras de negócio, jornadas, correlação com features |
| Traceability Graph | rastreabilidade bidirecional entre artefatos | requisitos, regras, ADRs, testes, docs |

---

## 2. Layout de `/docs`

```
/docs
  index.md                       ← ponto de entrada humano (preservado)

  /.ai                           ← camada machine-readable (derivada)
    index.json
    features.json
    freshness.json
    modules.json
    routes.json
    events.json
    entities.json
    symbols.json
    code-graph.json
    integration-graph.json
    business-flows.json
    traceability.json
    retrieval-tests.json

  /modules
    /<module>
      index.md
      <feature>.md
```

### 2.1 Obrigatoriedade dos artefatos

Proporcionalidade é regra. Um projeto pequeno não precisa de doze arquivos JSON.

| Artefato | Quando é obrigatório |
|---|---|
| `index.json` | **sempre** — manifesto raiz e roteador de todos os demais |
| `features.json` | **sempre** — catálogo de features com ID estável |
| `freshness.json` | **sempre** — estado de verificação por documento |
| `modules.json` | quando o projeto tem mais de um módulo |
| `routes.json` | quando o projeto expõe ou consome endpoints |
| `events.json` | quando há eventos, filas, tópicos ou webhooks |
| `entities.json` | quando há persistência ou modelo de domínio explícito |
| `integration-graph.json` | quando há mais de um serviço, repositório ou integração externa |
| `symbols.json` | sob demanda — projetos onde busca por classe/método é frequente |
| `code-graph.json` | sob demanda — quando análise de impacto estrutural é necessária |
| `business-flows.json` | sob demanda — quando existem fluxos de negócio ponta a ponta |
| `traceability.json` | sob demanda — obrigatório quando há regras de negócio identificadas (`BR-*`) |
| `retrieval-tests.json` | sob demanda — recomendado a partir de F6 |

Um artefato ausente não é falha de gate; um artefato **presente e inconsistente** é.

A tabela acima descreve o escopo **repositório**. Sistemas multi-repositório possuem também um escopo **sistema**, na raiz que agrupa os repositórios, com obrigatoriedade própria — ver §8.4.

### 2.2 Metadata obrigatória em todo artefato `.ai`

```json
{
  "schema_version": "1",
  "generated_at": "2026-08-31T12:00:00Z",
  "source_commit": "9243abc",
  "generator": "ai-docs-self-healing-engine",
  "repository_id": "checkout-api",
  "system_id": "commerce-platform"
}
```

`repository_id` é obrigatório; `system_id` é obrigatório apenas quando o repositório participa de um sistema multi-repositório.

### 2.3 `index.json` — manifesto raiz

Único arquivo que o agente sempre pode carregar por inteiro. Deve permanecer compacto (alvo: < 8 KB).

```json
{
  "schema_version": "1",
  "generated_at": "2026-08-31T12:00:00Z",
  "source_commit": "9243abc",
  "generator": "ai-docs-self-healing-engine",
  "repository_id": "checkout-api",
  "system_id": "commerce-platform",
  "stack": ["typescript", "nestjs", "postgres"],
  "artifacts": {
    "features": { "path": ".ai/features.json", "count": 42, "hash": "sha256:..." },
    "routes":   { "path": ".ai/routes.json",   "count": 31, "hash": "sha256:..." },
    "freshness":{ "path": ".ai/freshness.json","count": 42, "hash": "sha256:..." }
  },
  "modules": [
    { "id": "auth",     "title": "Autenticação", "features": 6, "doc": "modules/auth/index.md" },
    { "id": "checkout", "title": "Checkout",     "features": 9, "doc": "modules/checkout/index.md" }
  ],
  "health": {
    "fresh": 39,
    "stale": 3,
    "stale_critical": 0,
    "broken_references": 0
  }
}
```

### 2.4 Fonte canônica e índices derivados

Para evitar versões conflitantes da mesma verdade:

| Informação | Fonte canônica | Índices derivados |
|---|---|---|
| Existência e identidade de feature | frontmatter do `.md` da feature | `features.json`, `index.json`, `modules.json` |
| Rota exposta | contrato (OpenAPI) ou código anotado | `routes.json`, `code-graph.json` |
| Evento publicado/consumido | contrato (AsyncAPI) ou código | `events.json`, `integration-graph.json` |
| Entidade/tabela | schema/migration/model | `entities.json` |
| Regra de negócio | `product.business_rules` + spec | `traceability.json` |
| Decisão arquitetural | ADR em `adr/` | `traceability.json` |
| Símbolo de código | código-fonte | `symbols.json`, `code-graph.json` |

Um índice derivado nunca introduz informação que não exista na fonte canônica. Divergência entre índice e fonte é sempre resolvida em favor da fonte, e o índice é regenerado.

---

## 3. IDs estáveis

Identidade é conceitual, não física. Renomear `payment.service.ts` não altera `payment.authorize`.

### 3.1 Gramática

```
<module>.<feature>[.<sub-feature>]
```

* kebab-case dentro de cada segmento; ponto como separador
* somente `[a-z0-9-]` em cada segmento; máximo 3 segmentos
* derivado do conceito de domínio, nunca do caminho ou nome de arquivo

```
auth.login
auth.refresh-token
checkout.create-order
payment.authorize
customer.credit-analysis
```

### 3.2 Prefixos de escopo

| Prefixo | Uso |
|---|---|
| `<repository_id>#<id>` | referência a um ID de outro repositório do mesmo sistema |
| `BR-<DOMÍNIO>-<NNN>` | regra de negócio (`BR-PAY-004`) |
| `ADR-<NNN>` | decisão arquitetural (`ADR-012`) |
| `FLOW-<slug>` | fluxo de negócio (`FLOW-finalizar-compra`) |

Dentro do próprio repositório, IDs são usados sem prefixo. Referências cross-repo são **sempre** qualificadas.

### 3.3 Ciclo de vida do ID

* Refatoração, rename de arquivo, mudança de camada ou troca de framework **não** alteram o ID
* O ID só muda quando o **conceito** muda (split, merge ou redefinição de escopo da feature)
* Ao mudar, o ID antigo permanece registrado:

```yaml
id: checkout.create-order
aliases:
  - checkout.new-order        # nome anterior, ainda buscável
superseded_by: null
```

* Um ID removido nunca é reutilizado para outro conceito
* IDs duplicados no mesmo repositório são erro de gate

---

## 4. Frontmatter de documentos de feature

Frontmatter é índice, não documentação. Deve caber confortavelmente em uma tela.

### 4.1 Schema mínimo obrigatório

```yaml
---
id: auth.login
type: feature
module: auth
title: Login
summary: >
  Autentica usuários por credenciais e cria uma sessão autenticada.
code:
  - src/auth/auth.controller.ts
  - src/auth/auth.service.ts
last_verified_commit: 9243abc
---
```

| Campo | Regra |
|---|---|
| `id` | único no repositório, segue §3 |
| `type` | `feature \| module \| flow \| rule \| adr \| integration` |
| `module` | ID do módulo dono |
| `title` | rótulo humano curto |
| `summary` | 1–3 linhas; é o texto usado no retrieval por linguagem natural |
| `code` | caminhos reais e existentes; mínimo 1 quando a feature já foi implementada |
| `last_verified_commit` | commit em que a correspondência doc↔código foi verificada |

### 4.2 Campos opcionais

`keywords`, `aliases`, `symbols`, `routes`, `entities`, `events`, `depends_on`, `related`, `business_rules`, `adrs`, `tests`, `repository_id`, `last_verified_at`, `confidence`.

Preencher apenas o que existe e é verificável. Campo opcional vazio deve ser omitido, não declarado como lista vazia.

### 4.3 Limites

* Máximo **10 itens** por lista; acima disso, a feature está grande demais e deve ser dividida
* Máximo **8 keywords**
* Nenhum campo de frontmatter repete conteúdo que já está no corpo do documento
* Nenhum campo carrega texto livre longo — texto longo pertence ao corpo em Markdown

### 4.4 Exemplo completo

```yaml
---
id: auth.login
type: feature
module: auth
title: Login
summary: >
  Autentica usuários por credenciais e cria uma sessão autenticada com JWT.
keywords: [login, autenticação, signin, jwt, sessão]
aliases: [entrar, autenticar]
code:
  - src/auth/auth.controller.ts
  - src/auth/auth.service.ts
symbols: [AuthController.login, AuthService.login]
routes: ["POST /auth/login"]
entities: [User, Session]
depends_on: [auth.jwt]
related: [auth.logout, auth.refresh-token]
business_rules: [BR-AUTH-001]
adrs: [ADR-012]
tests: [test/auth/login.spec.ts]
last_verified_commit: 9243abc
last_verified_at: 2026-08-31T12:00:00Z
---
```

---

## 5. Code Graph

Representa relações estruturais **detectáveis** no código.

### 5.1 Vocabulário de nodes

Vocabulário fechado. Um tipo fora desta lista não entra no grafo.

```
repository · module · file · class · interface · function · method
endpoint · job · worker · command · query · entity · event · queue
database-table · external-api · ui-page · ui-component · user-action · business-rule
```

```json
{
  "id": "payment-api#PaymentService.authorize",
  "type": "method",
  "repository_id": "payment-api",
  "file": "src/payment/payment.service.ts",
  "feature": "payment.authorize",
  "symbol_hash": "sha256:..."
}
```

`file` é informativo e pode mudar sem invalidar o node; `id` e `feature` são a identidade.

### 5.2 Vocabulário de edges

Vocabulário fechado:

```
imports · calls · implements · extends · handles · uses · reads · writes
publishes · consumes · depends_on · validates · maps_to · handled_by · persists_to
```

```json
{
  "from": "checkout-api#CheckoutController.create",
  "to": "checkout-api#CheckoutService.execute",
  "relation": "calls",
  "confidence": "deterministic",
  "evidence": ["ast:call-expression:src/checkout/checkout.controller.ts#L42"]
}
```

Exemplo de cadeia representável:

```
CheckoutController.create → calls → CheckoutService.execute
CheckoutService.execute   → calls → PaymentService.authorize
PaymentService.authorize  → validates → SaldoMinimoRule
```

### 5.3 Modelo de confiança e evidência

| Nível | Significado | Exemplo |
|---|---|---|
| `deterministic` | comprovado por AST ou contrato declarado | `@Post("/checkout")`; chamada resolvida no AST |
| `high` | resolvido por metadata confiável com uma única resolução possível | interface injetada por DI com implementação única registrada |
| `inferred` | derivado de convenção ou similaridade sem vínculo estrutural | nome de método parecido com nome de rota |
| `unknown` | suspeita registrada sem base suficiente | reflexão, dispatch dinâmico, fluxo dirigido por configuração |

Regras:

* `evidence[]` é **obrigatório** para `deterministic` e `high`
* Relação `inferred` ou `unknown` **nunca** é apresentada como fato arquitetural; ao usá-la em uma resposta, o agente declara a incerteza
* Quando não há evidência, a relação não é criada — ausência é preferível a invenção
* Relação `inferred` que se torna comprovada é promovida com registro de evidência; nunca promovida por acúmulo de repetições

### 5.4 Limites técnicos declarados

O Code Graph oferece **alta precisão estrutural** sobre o que é deterministicamente verificável. Não oferece — e não deve prometer — completude. Casos que impedem resolução total:

reflexão · dispatch dinâmico em runtime · DI resolvida dinamicamente · metaprogramação · fluxos dirigidos por configuração · feature flags · integrações externas opacas · código gerado em build · plugins carregados dinamicamente.

Esses casos são registrados como `unknown` com a razão, não omitidos silenciosamente.

---

## 6. Análise estática e cadeia de fallback

O grafo deve ser derivado de análise estática sempre que tecnicamente possível, e não de leitura interpretativa por LLM.

### 6.1 Estratégia por stack

A skill detecta a stack em `architecture.tech_stack` e escolhe o analisador. Nenhuma biblioteca é obrigatória universalmente.

| Stack | Analisador preferido | Alternativas |
|---|---|---|
| TypeScript / JavaScript | TypeScript Compiler API | `ts-morph`, parser Babel/SWC |
| C# / .NET | Roslyn | analisadores de compilação equivalentes |
| Java / Kotlin | JavaParser, Spoon | APIs de compilador da JVM |
| Python | módulo `ast` da stdlib | ferramentas de análise equivalentes |
| Go | `go/ast`, `go/packages` | — |
| PHP | `nikic/PHP-Parser` | — |
| Ruby | `parser`, `prism` | — |
| Rust | `syn` | — |
| Outras | parser oficial da linguagem quando existir | fallback da §6.2 |

### 6.2 Cadeia de fallback

```
1. AST da linguagem                       → deterministic
2. Metadata de framework / DI / decorators→ deterministic | high
3. Contratos publicados (OpenAPI/AsyncAPI)→ deterministic
4. Configuração e manifests               → high
5. Convenção conhecida do framework       → inferred
6. Leitura interpretativa por LLM         → inferred (último recurso, sempre marcado)
```

Descer um nível na cadeia rebaixa a confiança da relação produzida. Nenhum passo da cadeia produz `deterministic` a partir de um passo inferior.

### 6.3 Fontes complementares obrigatórias

AST isolada não reconstrói fluxos reais. O grafo combina:

```
AST + imports + metadata de framework + injeção de dependência
    + OpenAPI + AsyncAPI + clientes HTTP + rotas + contratos de evento
    + filas + models de banco + configuração + convenções conhecidas do framework
```

---

## 7. Integration Graph

Mapeia comunicação entre módulos, serviços e repositórios — o que atravessa uma fronteira de processo ou de deploy.

### 7.1 Transportes suportados

HTTP/REST · GraphQL · gRPC · Kafka · RabbitMQ · SQS · SNS · WebSocket · filas genéricas · eventos de domínio · webhooks · banco compartilhado · storage compartilhado · API externa de terceiro.

### 7.2 Integration boundary

Uma `integration boundary` é o ponto onde a análise estática de um repositório termina. Cada boundary registra as duas pontas quando conhecidas e o contrato que as une.

```json
{
  "id": "commerce-platform:checkout-authorize-payment",
  "system_id": "commerce-platform",
  "transport": "http",
  "contract": "POST /payments/authorize",
  "producer": { "repository_id": "checkout-api",  "node": "CheckoutService.execute" },
  "consumer": { "repository_id": "payment-api",   "node": "PaymentController.authorize" },
  "confidence": "deterministic",
  "evidence": [
    "http-client:src/checkout/payment.client.ts#L18",
    "openapi:payment-api/openapi.yaml#/paths/~1payments~1authorize/post"
  ]
}
```

Quando apenas uma ponta é conhecida, a outra é `null` e a boundary é registrada como `dangling` — informação útil, nunca completada por adivinhação.

---

## 8. Multi-repositório

A correlação cross-repo é feita por **contrato**, nunca por caminho relativo de arquivo.

### 8.1 Conceitos

| Conceito | Definição |
|---|---|
| `repository_id` | identidade estável de um repositório dentro do sistema |
| `system_id` | identidade do sistema lógico que agrupa repositórios |
| `integration boundary` | ponto de travessia entre dois repositórios ou serviços |

### 8.2 Manifesto de sistema

Cada repositório participante declara, em seu `index.json`, o `system_id` e os repositórios com que se integra. A correlação é resolvida casando **chaves de contrato**:

| Transporte | Chave de correlação |
|---|---|
| HTTP/REST | método + path (normalizado) |
| GraphQL | nome da operação + tipo raiz |
| gRPC | pacote + serviço + método |
| Mensageria | nome do tópico/fila + versão do schema do evento |
| Banco compartilhado | nome do schema + tabela |
| Webhook | URL de destino + tipo de evento |

### 8.3 Fluxo ponta a ponta representável

```
repo: storefront-web      CheckoutPage.submit
                              ↓ HTTP POST /checkout
repo: checkout-api        CheckoutController.create → CheckoutService.execute
                              ↓ HTTP POST /payments/authorize
repo: payment-api         PaymentService.authorize → SaldoMinimoRule.validate
```

Cada travessia é uma `integration boundary` com confiança e evidência próprias. A confiança do fluxo completo é a **menor** confiança entre suas travessias.

### 8.4 Camada de sistema (raiz multi-repositório)

Quando os repositórios de um sistema vivem lado a lado sob uma pasta comum, essa pasta recebe uma camada de conhecimento própria — **fina e roteadora**, nunca uma cópia do que está dentro dos repositórios.

```
<system_id>/                       ← raiz do sistema (pode não ser um repositório git)
  docs/
    index.md                       ← mapa dos repositórios e dos fluxos ponta a ponta
    .ai/
      system.json                  ← registro de repositórios (obrigatório)
      integration-graph.json       ← travessias agregadas do sistema (obrigatório)
      business-flows.json          ← fluxos que atravessam repositórios (quando existirem)
  AGENTS.md · CLAUDE.md · GEMINI.md ← regras globais do sistema

  <repository_id>/                 ← repositório com git próprio
    docs/                          ← camada completa do escopo repositório (§2)
    AGENTS.md · CLAUDE.md · GEMINI.md
```

**Obrigatoriedade no escopo sistema:**

| Artefato | Quando é obrigatório |
|---|---|
| `system.json` | **sempre** que existir a camada de sistema |
| `integration-graph.json` | **sempre** — é a razão de existir desta camada |
| `business-flows.json` | quando houver fluxo de negócio atravessando repositórios |
| `freshness.json` | sob demanda — apenas se a raiz tiver documentos próprios além do índice |

`features.json` e `code-graph.json` **não existem** no escopo sistema: feature e estrutura de código pertencem ao repositório dono.

```json
{
  "schema_version": "1",
  "scope": "system",
  "system_id": "commerce-platform",
  "generated_at": "2026-09-01T12:00:00Z",
  "generator": "ai-docs-self-healing-engine",
  "repositories": [
    {
      "repository_id": "storefront-web",
      "path": "storefront-web",
      "role": "frontend",
      "docs": "storefront-web/docs/index.md",
      "knowledge_layer": "storefront-web/docs/.ai/index.json",
      "source_commit": "1a2b3c4",
      "features": 18
    },
    {
      "repository_id": "checkout-api",
      "path": "checkout-api",
      "role": "backend",
      "docs": "checkout-api/docs/index.md",
      "knowledge_layer": "checkout-api/docs/.ai/index.json",
      "source_commit": "9243abc",
      "features": 42
    }
  ],
  "health": {
    "repositories_indexed": 2,
    "boundaries": 7,
    "dangling_boundaries": 1
  }
}
```

`path` é relativo à raiz do sistema. `source_commit` registra em que commit de cada repositório a agregação foi feita — é o que permite detectar que a camada de sistema ficou atrás de um repositório sem reler todos.

### 8.5 Regra de não-duplicação

A separação entre os dois escopos é normativa:

| Pergunta | Responde | Escopo |
|---|---|---|
| Como esta feature funciona? | documento da feature | repositório |
| Que regra de negócio se aplica aqui? | doc + `traceability.json` | repositório |
| Quem chama este método? | `code-graph.json` | repositório |
| Quais repositórios existem e o que cada um faz? | `system.json` + `docs/index.md` | sistema |
| Como os repositórios se falam? | `integration-graph.json` agregado | sistema |
| Onde começa e termina um fluxo ponta a ponta? | `business-flows.json` do sistema | sistema |

* A raiz **nunca** copia descrição, regra, entrada, saída ou fluxo interno de uma feature — aponta para o documento dono, qualificado por `repository_id`
* O documento de um repositório **nunca** descreve a estrutura interna de outro repositório — referencia a travessia e o ID qualificado (`payment-api#payment.authorize`)
* Informação duplicada entre escopos é drift esperando para acontecer: haverá duas versões e nenhuma autoridade

### 8.6 Agregação e ordem de geração

A camada de sistema é **derivada** das camadas de repositório. Portanto:

```
1. gerar/atualizar cada repositório (fonte de verdade)
        ↓
2. ler os index.json e integration-graph.json de cada um
        ↓
3. casar as travessias por chave de contrato (§8.2)
        ↓
4. agregar em integration-graph.json do sistema
        ↓
5. escrever system.json com os source_commit apurados
```

Regras de agregação:

* Travessia com produtor em um repositório e consumidor em outro é registrada **uma única vez** no escopo sistema, com as duas pontas resolvidas
* Travessia com apenas uma ponta conhecida permanece `dangling`, com a ponta ausente explícita — a raiz não adivinha o destino
* Repositório do sistema que não está presente na pasta ou não é indexável entra em `system.json` com `"indexed": false` e razão declarada; não é omitido silenciosamente
* A camada de sistema nunca é gerada antes dos repositórios; se um `source_commit` de repositório mudou, a agregação está desatualizada e deve ser refeita — regenerar a raiz é barato, pois ela não contém detalhe

---

## 9. Business Flow Graph

Representa o comportamento em linguagem de domínio, independente da estrutura técnica.

```json
{
  "id": "FLOW-finalizar-compra",
  "title": "Finalizar compra",
  "steps": [
    { "order": 1, "label": "Criar checkout",        "features": ["checkout.create-order"] },
    { "order": 2, "label": "Validar estoque",       "features": ["inventory.reserve"], "business_rules": ["BR-INV-002"] },
    { "order": 3, "label": "Validar saldo",         "features": ["payment.balance-check"], "business_rules": ["BR-PAY-004"] },
    { "order": 4, "label": "Autorizar pagamento",   "features": ["payment.authorize"] },
    { "order": 5, "label": "Criar pedido",          "features": ["order.create"] },
    { "order": 6, "label": "Publicar OrderCreated", "events": ["OrderCreated"] }
  ],
  "repositories": ["storefront-web", "checkout-api", "payment-api"]
}
```

Ligação com a camada técnica:

```
business-flow ↕ features ↕ routes ↕ symbols ↕ business-rules
```

O Business Flow Graph permite responder perguntas conceituais sem carregar o detalhe técnico inteiro.

---

## 10. Traceability Graph

Rastreabilidade bidirecional obrigatória:

```
requirement ↕ business rule ↕ feature ↕ ADR ↕ endpoint/event ↕ code ↕ test ↕ documentation
```

```json
{
  "BR-PAY-004": {
    "requirement": "REQ-034",
    "features": ["payment.authorize"],
    "symbols": ["payment-api#PaymentService.authorize"],
    "routes": ["POST /payments/authorize"],
    "adrs": ["ADR-012"],
    "tests": ["test/payment/payment-authorize.spec.ts"],
    "docs": ["modules/payment/authorize.md"]
  }
}
```

Toda aresta é navegável nos dois sentidos: de `BR-PAY-004` para o teste, e do teste de volta para o requisito de origem.

---

## 11. Freshness

Verificação objetiva, sem inflar metadados.

### 11.1 Campos

| Campo | Onde vive | Propósito |
|---|---|---|
| `last_verified_commit` | frontmatter do doc | commit em que doc e código foram conferidos |
| `last_verified_at` | frontmatter (opcional) | carimbo temporal legível |
| `source_hash` | `freshness.json` | hash do corpo de **cada símbolo referenciado**, nunca do arquivo inteiro |
| `contract_hash` | `freshness.json` | hash do trecho de contrato (rota, schema de evento) |

```json
{
  "modules/payment/authorize.md": {
    "id": "payment.authorize",
    "last_verified_commit": "9243abc",
    "state": "fresh",
    "source_hashes": {
      "PaymentService.authorize": "sha256:a91f...",
      "SaldoMinimoRule.validate": "sha256:77c2..."
    },
    "contract_hashes": {
      "POST /payments/authorize": "sha256:31be..."
    }
  }
}
```

### 11.2 Economia

* Hash por **símbolo referenciado**, não por arquivo — evita invalidação em massa por mudança irrelevante no mesmo arquivo
* Nenhum hash para arquivo não referenciado por nenhuma feature
* `freshness.json` guarda somente os campos acima; nunca conteúdo

### 11.3 Estados

| Estado | Condição | Ação |
|---|---|---|
| `fresh` | todos os hashes conferem com o commit atual | nenhuma |
| `stale` | algum hash divergiu, impacto técnico ou menor | healing na próxima passagem incremental |
| `stale-critical` | divergência em regra de negócio, contrato público, evento ou fluxo | healing imediato; **bloqueia o quality gate** |

---

## 12. Classificação de mudança

Nem toda mudança de código exige reescrever documentação. Toda mudança é classificada antes de qualquer healing.

| Categoria | Exemplos | Ação prescrita |
|---|---|---|
| `none` | formatação, comentário, rename interno sem mudança conceitual, refactor equivalente | atualizar apenas `last_verified_commit` e `source_hash`; **não reescrever texto** |
| `technical` | assinatura de método, nova dependência interna, nova exceção, novo parâmetro opcional | atualizar frontmatter (`symbols`, `code`, `depends_on`) e índices derivados; corpo do doc só se `Entrada`/`Saída`/`Possíveis erros` mudaram |
| `behavioral` | regra de negócio, validação, autorização, cálculo, alteração de fluxo | reescrever `Regras de negócio` e `Fluxo resumido`; revisar Business Flow Graph e `traceability.json`; marcar `stale-critical` até concluído |
| `architectural` | novo serviço, nova fila, mudança de transporte, troca de banco, novo bounded context | tudo de `behavioral` + Integration Graph + `index.json` + **exigir ADR**; propagar para repositórios vizinhos do mesmo `system_id` |

Rename de símbolo que preserva comportamento é `technical`, nunca `behavioral` — e **nunca** altera o ID da feature.

---

## 13. Self-healing determinístico

O gatilho é o diff, não a percepção do modelo.

```
git diff <last_indexed_commit>..HEAD
   ↓
arquivos alterados
   ↓
symbol diff (AST) + contract diff (OpenAPI/AsyncAPI)
   ↓
nodes alterados
   ↓
edges impactadas (vizinhança 1-hop, expandida a 2-hop em mudança architectural)
   ↓
features impactadas (via node.feature)
   ↓
docs impactados (via features.json)
   ↓
classificação de mudança por doc (§12)
   ↓
healing localizado conforme a categoria
   ↓
refresh de índices afetados + freshness + source_commit
```

Regras:

* Regeneração total de índice só é permitida em modo `bootstrap`, em corrupção detectada ou em mudança de `schema_version`
* Documento não impactado pelo diff não é tocado — nem seu `last_verified_commit`
* Healing que altera um doc **sempre** atualiza os índices derivados correspondentes na mesma operação; doc e índice nunca ficam dessincronizados entre si

---

## 14. Protocolo de retrieval

```
QUESTION
   ↓
intent detection
   ↓
/docs/.ai/index.json                      (único carregamento integral permitido)
   ↓
candidate retrieval (índice especializado pela chave da pergunta)
   ↓
graph neighborhood (1-hop; 2-hop apenas se necessário)
   ↓
docs relevantes (somente os candidatos selecionados)
   ↓
suficiente?
   ├── sim → responder
   └── não → código-fonte (fallback declarado na resposta)
```

### 14.1 Roteamento por chave

| Chave da pergunta | Índice consultado | Exemplo |
|---|---|---|
| linguagem natural | `features.json` (`summary`, `keywords`, `aliases`) | "Como funciona autenticação?" |
| feature / módulo | `features.json`, `modules.json` | "O que faz o módulo checkout?" |
| endpoint | `routes.json` | "Qual endpoint cria pedidos?" |
| classe / método / símbolo | `symbols.json` → `code-graph.json` | "Quem gera o JWT?" |
| evento | `events.json` → `integration-graph.json` | "Quem consome PaymentApproved?" |
| entidade / tabela | `entities.json` | "Onde User é persistido?" |
| regra de negócio | `traceability.json` | "Onde BR-PAY-004 é implementada?" |
| ADR | `traceability.json` | "Que código nasceu do ADR-012?" |
| arquivo | `features.json` (campo `code`) | "O que este arquivo implementa?" |
| repositório / integração | `index.json` → `integration-graph.json` | "Quais repositórios participam do checkout?" |
| user flow / tela | `business-flows.json` | "Quais telas usam esse endpoint?" |
| dependência / impacto | `code-graph.json` + `integration-graph.json` | "O que depende de PaymentService?" |

### 14.2 Regras de custo

* `index.json` é o único artefato carregável por inteiro
* Demais índices são consultados **seletivamente** pela chave; nunca carregados integralmente quando a consulta é pontual
* Grafos são percorridos por vizinhança a partir de um node âncora — **nunca** carregados inteiros no prompt
* Vizinhança padrão: 1-hop. 2-hop apenas para análise de impacto ou fluxo ponta a ponta
* Um agente interessado em `payment.authorize` recupera essa feature, sua vizinhança e seus docs — não as 500 features do repositório
* Cache por `source_commit`: enquanto o commit não muda, o resultado de uma consulta permanece válido

---

## 15. Análise de impacto

Responsabilidade explícita do sistema. Percorre o grafo no sentido **inverso** das arestas a partir do elemento alterado.

```
SaldoMinimoRule
      ↑ validates
PaymentService.authorize
      ↑ calls
CheckoutService.execute
      ↑ handled_by
POST /checkout
      ↑ calls (integration boundary)
CheckoutPage.submit
```

Saída obrigatória de uma análise de impacto:

| Dimensão | Origem |
|---|---|
| features impactadas | `code-graph` → `node.feature` |
| endpoints | `routes.json` |
| telas / componentes de UI | `business-flows.json`, `integration-graph.json` |
| consumidores e produtores de evento | `events.json` |
| testes | `traceability.json` (campo `tests`) |
| documentação a revisar | `features.json` → caminho do doc |
| outros repositórios | `integration-graph.json` por `system_id` |
| confiança do resultado | menor confiança do caminho percorrido |

Um caminho que atravessa uma aresta `inferred` produz um resultado `inferred` — apresentado como possibilidade a verificar, não como fato.

---

## 16. Precedência de fontes de verdade

```
1. código executável e contratos publicados
2. ADRs
3. OrchestratorContext
4. documentação Markdown gerada
5. índices derivados em /docs/.ai/
```

`/docs` é o **ponto de partida** de consulta do agente, não a autoridade final. Em drift comprovado:

```
code wins → doc marcado stale → healing localizado → índice regenerado
```

Exceção: quando o código contradiz um ADR vigente, isso não é drift de documentação — é violação arquitetural. O caso é escalado ao orquestrador (`ConflictDetector`), não silenciosamente absorvido pela documentação.

---

## 17. Artefatos derivados

`/docs/.ai/*` é majoritariamente conteúdo **derivado**. Portanto:

* pode ser integralmente regenerado a partir do código, dos contratos e dos documentos
* possui `schema_version`; incompatibilidade de versão exige regeneração completa
* **não** é editado manualmente — edição manual é anti-pattern e deve ser detectada
* aponta sempre para a fonte canônica correspondente (§2.4)
* deve detectar corrupção e inconsistência: `hash` divergente, node órfão, edge apontando para node inexistente, índice apontando para doc inexistente
* é versionado no repositório (permite diff, review e rollback) e regenerado, nunca mesclado à mão

---

## 18. Segurança

O indexador **jamais** registra em `/docs/.ai/` ou em `/docs/**.md`:

secrets · tokens · senhas · chaves privadas · connection strings com credenciais · conteúdo de `.env` · dados pessoais reais · credenciais de cloud · URLs assinadas.

Ao encontrar qualquer um desses elementos, registra-se apenas a **existência conceitual** da dependência:

```json
{
  "id": "external-api:payment-gateway",
  "type": "external-api",
  "auth": "api-key (referenciada por variável de ambiente)",
  "credentials": "não indexadas"
}
```

Nomes de variáveis de ambiente podem ser indexados; **valores** nunca.

---

## 19. Quality Gate `AI-DOC`

Checklist mensurável, verificável em parte por [scripts/validate-knowledge-layer.mjs](./scripts/validate-knowledge-layer.mjs).

```
[ ] módulos relevantes indexados em index.json
[ ] features relevantes possuem ID estável, único e conforme à gramática
[ ] nenhum link interno quebrado em /docs
[ ] nenhum documento órfão (doc sem entrada de índice)
[ ] nenhum índice apontando para documento inexistente
[ ] nenhum símbolo indexado apontando para código inexistente
[ ] endpoints públicos possuem feature documental associada
[ ] eventos relevantes possuem produtor e/ou consumidor mapeado
[ ] nenhum documento em estado stale-critical
[ ] freshness válido: commit e hashes presentes e coerentes
[ ] artefatos .ai com schema_version suportado e metadata completa
[ ] relações cross-repository críticas verificadas ou declaradas como dangling
[ ] nenhum secret indexado
[ ] toda relação apresentada como fato possui confidence deterministic ou high com evidência
```

### 19.1 Exceções declaradas

Cobertura de 100% **não** é regra universal. São exceções legítimas, desde que **declaradas** em `index.json` sob `coverage_exceptions`, com razão:

reflexão · dispatch dinâmico · fluxo dirigido por configuração · feature flags · integração externa opaca · código gerado em build · repositório do sistema fora do alcance da indexação.

Exceção declarada não reprova o gate. Lacuna **não declarada** reprova.

---

## 20. AI Documentation Retrieval Test Suite

A qualidade da documentação não se mede apenas por "arquivo existe" e "link funciona", mas por:

> Um agente consegue encontrar a resposta correta usando os índices e os docs, sem varrer o repositório inteiro?

### 20.1 Formato

```json
{
  "schema_version": "1",
  "questions": [
    {
      "id": "RT-001",
      "question": "Quem gera o JWT?",
      "key": "symbol",
      "expected_entry_point": "auth.jwt",
      "expected_artifacts": [".ai/symbols.json", "modules/auth/jwt.md"],
      "must_answer_without_code": true
    },
    {
      "id": "RT-002",
      "question": "Quem consome PaymentApproved?",
      "key": "event",
      "expected_entry_point": "PaymentApproved",
      "expected_artifacts": [".ai/events.json"],
      "must_answer_without_code": true
    }
  ]
}
```

As perguntas são **derivadas do próprio sistema** — uma por chave de retrieval da §14.1 que se aplique ao projeto, mais uma por fluxo de negócio crítico.

### 20.2 Métricas

| Métrica | Definição | Alvo sugerido |
|---|---|---|
| `retrieval success rate` | perguntas respondidas corretamente | ≥ 90% |
| `docs-only answer rate` | respondidas sem abrir código | ≥ 80% |
| `fallback-to-code rate` | exigiram leitura de código | ≤ 20% |
| `stale-answer rate` | respondidas com informação desatualizada | 0% |
| `broken-reference rate` | referências apontando para artefato inexistente | 0% |

Nesta versão a execução é manual ou semiautomatizada: o formato, as métricas e o ponto de integração (modo `audit`, F6) estão definidos; o runner automatizado é trabalho futuro.

---

## 21. Compatibilidade

A especificação é agnóstica de framework. Nenhuma regra assume NestJS, Angular, .NET, Spring ou qualquer stack específica.

| Cenário | Como a especificação se aplica |
|---|---|
| **Monorepo** | um `repository_id` por pacote/app; `system_id` comum; `/docs/.ai` na raiz ou por pacote, declarado em `index.json` |
| **Multi-repo** | um `/docs/.ai` por repositório; quando os repositórios compartilham uma pasta raiz, essa raiz recebe a camada de sistema (§8.4): `system.json` + Integration Graph agregado, fina e roteadora |
| **Microservices** | Integration Graph é o artefato central; Code Graph fica escopado por serviço |
| **Modular monolith** | Code Graph interno rico; Integration Graph pequeno, limitado a integrações externas |
| **Frontend + backend** | boundary HTTP/GraphQL correlaciona ação de UI a endpoint; nodes `ui-page`/`ui-component`/`user-action` |
| **Event-driven** | `events.json` obrigatório; edges `publishes`/`consumes`; correlação por tópico + versão de schema |
| **Workers e jobs** | nodes `job`/`worker`; gatilho (cron, fila, evento) registrado como edge de entrada |
| **APIs públicas** | contrato é fonte canônica de rotas; `contract_hash` garante freshness |
| **Sistemas legados** | AST pode não existir; opera-se com fallback (§6.2), confiança rebaixada e `coverage_exceptions` declaradas |

---

## 22. Anti-patterns da camada de conhecimento

* Varrer todo o repositório para responder algo já indexado
* Reconstruir todo o grafo após uma mudança localizada
* Carregar o grafo inteiro no contexto do LLM
* Duplicar informação canônica em vários índices
* Inferir relação cross-service sem evidência
* Tratar relação probabilística como deterministicamente comprovada
* Documentar implementação que não existe no código
* Atualizar documentação sem atualizar o índice associado
* Alterar índice manualmente sem atualizar a fonte canônica
* Indexar secrets, credenciais ou dados pessoais reais
* Gerar centenas de documentos minúsculos sem valor semântico
* Usar o arquivo físico como identidade única da feature
* Prometer precisão total do Code Graph
* Frontmatter gigante que duplica o corpo do documento
* Marcar `last_verified_commit` sem ter efetivamente verificado a correspondência
* Duplicar na raiz do sistema o conteúdo que pertence à documentação de um repositório
* Gerar a camada de sistema antes das camadas de repositório das quais ela deriva
* Descrever, no documento de um repositório, a estrutura interna de outro repositório
