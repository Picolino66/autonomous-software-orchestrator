---
name: autonomous-software-orchestrator
description: Orquestra todo o ciclo de criação de software do zero à evolução contínua, coordenando skills especialistas, mantendo contexto arquitetural compartilhado, validando entregas por quality gates, controlando dependências entre agentes e garantindo consistência sistêmica entre produto, arquitetura, engenharia, qualidade, operação e escala.
---

## 🧠 Descrição

O `autonomous-software-orchestrator` é o sistema nervoso central de engenharia autônoma de software. Ele não executa tarefas isoladas — ele governa a execução total do ciclo de vida de um sistema: da ideação estratégica à evolução contínua em produção.

Opera como um **CTO autônomo + Arquiteto Principal + Coordenador de Agentes**, tomando decisões estruturais, definindo sequências de execução, ativando sub-skills especialistas na ordem correta, compartilhando contexto arquitetural entre todos os agentes, validando qualidade entre fases e impedindo degradação sistêmica.

O orquestrador mantém um objeto `OrchestratorContext` vivo durante toda a execução — um estado canônico do sistema que cresce incrementalmente e é compartilhado entre todos os agentes ativos. Cada sub-skill lê deste contexto e escreve de volta nele. Nenhum agente opera em isolamento.

Toda decisão arquitetural tomada é registrada como ADR (Architecture Decision Record) no contexto. Toda entrega de fase passa por um quality gate explícito antes de avançar. Toda inconsistência detectada entre agentes provoca rollback parcial à última fase estável.

Referências:
- [pipeline.md](./pipeline.md) — fases de execução completas com quality gates
- [sub-skills/](./sub-skills/) — 55 sub-skills individuais no formato de skill completo
- [context-management.md](./context-management.md) — protocolo de contexto, snapshots e sincronização
- [knowledge-layer.md](./knowledge-layer.md) — especificação da AI Documentation Knowledge Layer (índices, grafos, freshness, retrieval)

---

## 🏗️ Arquitetura da Super Skill

### Modelo de orquestração

```
┌──────────────────────────────────────────────────┐
│            AUTONOMOUS ORCHESTRATOR               │
│                                                  │
│  ┌───────────────────────────────────────────┐   │
│  │        OrchestratorContext (JSON)         │   │
│  │   phase | decisions | ADRs | outputs      │   │
│  └───────────────────────────────────────────┘   │
│                       │                           │
│       ┌───────────────▼───────────────┐          │
│       │      PhaseController          │          │
│       │  - aciona sub-skills          │          │
│       │  - valida quality gates       │          │
│       │  - gerencia paralelismo       │          │
│       │  - controla dependências      │          │
│       └───────────────┬───────────────┘          │
│                       │                           │
│       ┌───────────────▼───────────────┐          │
│       │    ExternalSkillResolver      │          │
│       │  - descobre skills externas   │          │
│       │  - avalia relevância/score    │          │
│       │  - delega (substituto/compl.) │          │
│       │  - fallback para sub-skill    │          │
│       └───────┬───────────────┬───────┘          │
│               │               │                   │
│     sub-skill │               │ skill externa     │
│      interno  │               │ (.agents/skills/) │
│               ▼               ▼                   │
│   ┌───────────────────────────────────────────┐  │
│   │           SnapshotEngine                  │  │
│   │  O1 → O2 → O3 → O4 → O5 → O6 → O7       │  │
│   └───────────────────────────────────────────┘  │
└──────────────────────────────────────────────────┘
```

### Componentes internos

* **PhaseController** — controla qual fase está ativa, quais sub-skills podem ser ativadas e bloqueia avanço se quality gate falhar
* **ContextBus** — mecanismo de leitura/escrita do `OrchestratorContext` com versionamento por fase
* **DependencyGraph** — grafo de dependências entre sub-skills; impede execução fora de ordem
* **QualityGateEngine** — valida critérios de conclusão antes de avançar cada fase
* **ConflictDetector** — compara outputs de agentes paralelos e detecta inconsistências antes de merge no contexto
* **SnapshotEngine** — persiste estado do contexto ao final de cada fase (O1–O7), permitindo rollback
* **ADRRegistry** — registra todas as decisões arquiteturais com justificativa, alternativas consideradas e impacto
* **CompressionEngine** — sumariza partes antigas do contexto para evitar token explosion em execuções longas
* **ExternalSkillResolver** — descobre skills externas instaladas (globais e locais ao projeto), avalia relevância por contexto de tecnologia e fase, e delega execução quando uma skill especializada supera a capacidade do sub-skill interno

### Modos de execução

| Modo | Descrição |
|---|---|
| `full-pipeline` | Executa todas as 7 fases da esteira completa |
| `phase-resume` | Retoma a partir de um snapshot específico (O1–O7) |
| `feature-evolution` | Executa apenas fases 4–7 para novas features em sistema existente |
| `architecture-review` | Executa apenas análise e reavaliação arquitetural |
| `incident-response` | Ativa diretamente fase 7 com foco em incidente e recuperação |

---

## 🔌 Integração com Skills Externas

O orquestrador não opera em silo. Antes de ativar qualquer sub-skill interno a partir de F2, o `ExternalSkillResolver` verifica se existe uma skill mais especializada disponível — instalada globalmente ou definida localmente no projeto.

### Fontes de skills (prioridade decrescente)

```
1. .agents/skills/          ← skills criadas para o projeto atual (máxima prioridade)
2. ~/.agents/skills/        ← skills globais instaladas via npx skills
3. ~/.claude/skills/        ← skills Claude globais
4. npx skills find <query>  ← registro remoto (fallback quando nenhuma local serve)
```

### Como a descoberta funciona

O orquestrador lê o campo `description:` de cada `SKILL.md` disponível nas fontes e avalia — com base no contexto atual (`tech_stack`, fase, tarefa) — se alguma skill instalada é mais especializada que o sub-skill interno prestes a ser ativado. Não há lista fixa: qualquer skill instalada pode ser descoberta e usada, inclusive skills novas adicionadas ao projeto depois que a esteira começou.

### Modos de uso

* **Substituto** — skill externa cobre completamente o sub-skill interno; interna marcada como `DELEGATED`
* **Complementar** — skill externa aprofunda um aspecto; ambas executam, interna consolida no contexto

Skills externas sempre recebem o `OrchestratorContext` completo como entrada e têm seus outputs mergeados de volta via `ContextBus` + `ConflictDetector`. Quality gates continuam sendo responsabilidade do orquestrador — não da skill externa.

Ver protocolo completo em [sub-skills/external-skill-resolver.md](./sub-skills/external-skill-resolver.md).

---

## 🧩 Sub-skills Especialistas

O orquestrador coordena 55 sub-skills organizadas em 7 fases, duas delas atuando também de forma transversal (`external-skill-resolver` em F2–F7 e `ai-docs-self-healing-engine` em F4–F7). Cada sub-skill está documentada individualmente em [sub-skills/](./sub-skills/).

### Mapa rápido por fase

| Fase | Sub-skills ativadas |
|---|---|
| F1 — Discovery & Strategy | `market-context-analysis`, `business-model-definition`, `persona-definition-engine`, `ideation-engine`, `business-understanding-engine`, `requirements-engine`, `scope-definition-engine`, `feasibility-analysis-engine`, `mvp-validation-engine`, `metrics-definition-engine` |
| F2 — Architecture & Design | `global-architecture-engine`, `system-design-engine`, `layered-architecture-engine`, `integration-definition-engine`, `infrastructure-strategy-engine`, `technology-stack-selector`, `security-architecture-engine` |
| F3 — Data & API Contracts | `data-modeling-engine`, `api-contract-engine`, `data-consistency-engine` |
| F4 — UX/UI & Planning | `ux-ui-design-engine`, `usability-testing-engine`, `technical-planning-engine`, `agentic-project-structure-engine`, `ai-docs-self-healing-engine` (modo `bootstrap`), `backlog-generation-engine`, `prioritization-engine` |
| F5 — Engineering Execution | `project-setup-engine`, `code-governance-engine`, `architectural-patterns-engine`, `cicd-pipeline-engine`, `quality-gates-engine`, `backend-development-engine`, `frontend-development-engine`, `mobile-development-engine`, `distributed-architecture-engine`, `orchestration-engine`, `ai-docs-self-healing-engine` (modo `incremental`) |
| F6 — Quality, Docs & Deploy | `automated-testing-engine`, `quality-assurance-engine`, `security-testing-engine`, `manual-qa-notion-export-engine`, `documentation-engine`, `operational-documentation-engine`, `ai-docs-self-healing-engine` (modo `audit`), `deployment-engine`, `post-deployment-validation-engine` |
| F7 — Operate & Evolve | `observability-engine`, `incident-management-engine`, `maintenance-engine`, `continuous-evolution-engine`, `user-feedback-engine`, `performance-and-scale-engine`, `infrastructure-cost-optimization-engine`, `architectural-reassessment-engine`, `product-strategy-engine`, `ai-docs-self-healing-engine` (modo `continuous`) |
| **Transversal (F2–F7)** | **`external-skill-resolver`** — avalia e delega para skills externas antes de cada sub-skill a partir de F2 |
| **Transversal (F4–F7)** | **`ai-docs-self-healing-engine`** — mantém a AI Documentation Knowledge Layer em quatro modos: `bootstrap` (F4), `incremental` (F5), `audit` (F6) e `continuous` (F7) |

### Regras de ativação

* Sub-skills só são ativadas quando todas as suas dependências estão marcadas como `COMPLETED` no `OrchestratorContext`
* Sub-skills sem dependências entre si dentro da mesma fase podem ser executadas em paralelo
* O orquestrador nunca ativa uma sub-skill sem antes injetar o `OrchestratorContext` atualizado como input
* Toda sub-skill deve produzir output estruturado que é mergeado de volta ao contexto ao finalizar
* A partir de F2, o `ExternalSkillResolver` é consultado antes de ativar qualquer sub-skill de execução — se uma skill externa mais especializada existir, ela pode substituir ou complementar o sub-skill interno
* Skills locais do projeto (`.agents/skills/`) têm prioridade sobre skills globais — sempre verificar o projeto antes das fontes globais
* `ai-docs-self-healing-engine` é transversal a F4–F7 e não é uma etapa única: seu modo é determinado pela fase ativa e pelo gatilho (entrega de feature, auditoria pré-deploy, mudança de código em produção)

---

## 🔄 Fluxo Completo da Esteira

Ver detalhamento completo em [pipeline.md](./pipeline.md).

### Resumo executivo das 7 fases

```
F1: DISCOVERY & STRATEGY
    ↓ [gate: product-context validated, scope defined, MVP hypothesis]
F2: ARCHITECTURE & DESIGN
    ↓ [gate: tech stack locked, architecture decision recorded, security model defined]
F3: DATA & API CONTRACTS
    ↓ [gate: schema versioned, contracts published, consistency model chosen]
F4: UX/UI & PLANNING
    ↓ [gate: user journey validated, backlog groomed, priorities set]
F5: ENGINEERING EXECUTION
    ↓ [gate: all tests green, coverage ≥ threshold, no critical lint violations]
F6: QUALITY, DOCS & DEPLOY
    ↓ [gate: security scan passed, docs complete, deploy verified, rollback tested]
F7: OPERATE & EVOLVE
    ↓ [gate: SLOs defined, alerts active, feedback loop operational]
    ↻ [loop back to F2 or F4 based on architectural or feature triggers]
```

### Controle de dependências entre fases

* F2 requer F1 completa (arquitetura depende de contexto de negócio e requisitos)
* F3 requer F2 completa (modelos de dados dependem de decisões arquiteturais)
* F4 pode iniciar em paralelo com F3 (UX não depende de schema finalizado)
* F5 requer F2 + F3 + F4 completas (desenvolvimento depende de tudo anterior)
* F6 executa incrementalmente à medida que F5 entrega módulos
* F7 inicia assim que o primeiro deploy estável de F6 é validado

---

## 🧠 Gerenciamento de Contexto

Ver protocolo completo em [context-management.md](./context-management.md).

### OrchestratorContext — estrutura canônica

```json
{
  "orchestration_id": "uuid-v4",
  "created_at": "ISO8601",
  "current_phase": "F3",
  "snapshot_version": "O3",
  "product": {
    "name": "",
    "domain": "",
    "personas": [],
    "business_rules": [],
    "mvp_hypothesis": ""
  },
  "architecture": {
    "pattern": "modular-monolith | microservices | serverless",
    "tech_stack": {},
    "security_model": {},
    "adrs": []
  },
  "contracts": {
    "api_version": "",
    "schemas": [],
    "consistency_model": "eventual | strong | causal"
  },
  "engineering": {
    "backlog": [],
    "module_map": {},
    "test_coverage_threshold": 80
  },
  "agentic": {
    "project_structure": {},
    "docs_map": {},
    "specs_map": {},
    "tasks_workflow": {},
    "agents_map": {},
    "skills_map": {},
    "traceability_rules": [],
    "initial_adrs_recommended": [],
    "knowledge_layer": {
      "path": "docs/.ai",
      "schema_version": "1",
      "source_commit": "",
      "repository_id": "",
      "system_id": "",
      "artifacts": {},
      "counts": {},
      "health": {},
      "retrieval_tests": {}
    }
  },
  "quality": {
    "gates_passed": [],
    "gates_failed": [],
    "last_stable_snapshot": "O2"
  },
  "operations": {
    "slos": [],
    "alerts": [],
    "incidents": []
  },
  "orchestration": {
    "external_skills_activated": []
  }
}
```

> `agentic.knowledge_layer` guarda **apenas ponteiros e métricas** — caminho, versão de schema, commit de origem, hashes, contagens e saúde. Índices e grafos completos permanecem em `/docs/.ai/` e nunca entram no contexto, sob pena de token explosion.

### Estratégia de compressão

* Após cada fase concluída, o `CompressionEngine` sumariza os outputs detalhados em entradas estruturadas no contexto
* Histórico de raciocínio intermediário é descartado; apenas decisões finais + justificativas são retidas
* ADRs são sempre preservados integralmente (nunca comprimidos)
* Outputs de sub-skills que já foram mergeados ao contexto são descartados após confirmação de merge

---

## 🔥 Regras obrigatórias

* **SEMPRE** gerar toda documentação técnica, textos visíveis ao usuário na interface e comentários de código em **português do Brasil (pt-br)** — sem exceção em nenhuma sub-skill ou fase do pipeline
* **NUNCA** ativar uma sub-skill sem injetar o `OrchestratorContext` atualizado como contexto de entrada
* **NUNCA** avançar de fase sem que o quality gate da fase anterior esteja explicitamente aprovado
* **NUNCA** permitir que dois agentes modifiquem a mesma seção do contexto simultaneamente sem resolução de conflito pelo `ConflictDetector`
* **NUNCA** gerar código de implementação antes de F2 estar completa (arquitetura deve preceder código)
* **NUNCA** iniciar F5 sem `agentic-project-structure-engine` aprovada em F4 — implementação exige docs, specs, tasks, agentes, skills, ADRs e rastreabilidade definidos
* **NUNCA** fazer deploy sem F6 completamente validada (security scan, testes, docs)
* **NUNCA** ignorar uma ADR existente ao tomar nova decisão arquitetural — toda nova decisão deve referenciar ou atualizar ADRs anteriores
* **NUNCA** quebrar contratos de API definidos em F3 sem criar uma versão nova e atualizar todos os consumidores
* **NUNCA** escalar horizontalmente sem performance-and-scale-engine ter validado os gargalos
* **SEMPRE** registrar decisões arquiteturais como ADR com: contexto, opções consideradas, decisão tomada, trade-offs, consequências
* **SEMPRE** validar que outputs de sub-skills são consistentes com decisões já registradas no contexto antes de aceitar o merge
* **SEMPRE** manter rastreabilidade bidirecional: requisito → decisão arquitetural → implementação → teste → deploy
* **SEMPRE** acionar `architectural-reassessment-engine` quando qualquer KPI de F7 atingir threshold crítico
* **SEMPRE** respeitar a precedência de fontes de verdade: `código executável e contratos > ADRs > OrchestratorContext > documentação Markdown > índices derivados`
* **SEMPRE** resolver drift comprovado entre código e documentação em favor do código — `code wins`, doc marcado stale, healing localizado e índice regenerado
* **SEMPRE** concluir uma mudança de comportamento com healing localizado da documentação e refresh do índice correspondente — feature entregue sem doc e sem entrada de índice não conta como entregue
* **SEMPRE** consultar `/docs/.ai/index.json` antes de varrer código quando o projeto possui knowledge layer indexada
* **NUNCA** armazenar grafos, índices ou artefatos de `/docs/.ai/` dentro do `OrchestratorContext` — apenas caminho, hash, versão e métricas

### Padrão global de campanhas manuais de QA no Notion

Quando F6 produzir uma campanha de QA manual no Notion, aplicar este padrão em qualquer projeto, salvo instrução explícita do usuário em contrário:

* Criar um banco de QA com somente quatro propriedades de controle: `Tarefa` (título), `Status` (seleção), `Sprint` (seleção) e `Prioridade` (seleção).
* Usar os status `Não iniciado`, `A fazer`, `Fazendo`, `Finalizado` e `Reprovado`, agrupados em um quadro Kanban por `Status`.
* Não criar propriedades para contexto do roteiro, resultado, evidência, dependência, impacto, perfil, módulo, feature, passos ou dados de teste. Essas informações pertencem ao corpo longo do card.
* Dar a cada card um título ordenável no formato `Dxx.yy — ação curta`, com dia e sequência sempre preenchidos com dois dígitos. Exemplo: `D01.01 — Validar acesso`.
* Configurar o quadro sem filtros e com ordenação crescente por `Tarefa`, garantindo que `D01.01` fique acima de `D01.02` e assim sucessivamente dentro de qualquer coluna de status.
* Exibir no card do quadro apenas `Tarefa`, `Sprint` e `Prioridade`; o roteiro completo deve ficar no corpo da página, abaixo das propriedades.
* Manter todos os cards planejados em `Não iniciado`; a execução humana é a única autorizada a mudar o status ou preencher o registro de execução.
* Ao finalizar a criação, validar: esquema mínimo, agrupamento por status, ausência de filtros, ordenação ascendente por `Tarefa`, títulos sem duplicidade e presença do roteiro no corpo de todos os cards.

---

## ⚠️ Anti-patterns (proibido)

* Agentes operando em isolamento, sem leitura do `OrchestratorContext` antes de executar
* Sub-skills sendo ativadas fora da ordem do grafo de dependências
* Decisões arquiteturais tomadas sem registro de ADR
* Código gerado contradizendo a arquitetura definida em F2
* APIs implementadas em F5 divergindo dos contratos definidos em F3
* Quality gates ignorados ou marcados como aprovados sem validação real
* Contexto crescendo sem compressão, levando a token explosion e perda de coerência
* Dois agentes paralelos modificando a mesma chave do contexto sem lock explícito
* Rollbacks de fase sem preservar o snapshot da fase anterior
* Deploy sem documentação operacional (`operational-documentation-engine` completa)
* Incidentes em F7 tratados sem acionar `incident-management-engine`
* Evolução de produto em F7 sem passar por `product-strategy-engine` e `requirements-engine`
* Criar task, história ou backlog operacional sem spec associada e rastreável
* Refatoração arquitetural sem `architectural-reassessment-engine` ter mapeado o impacto
* Acoplamento entre sub-skills — toda comunicação deve passar pelo `OrchestratorContext`
* Omissão de quality gates em fases "urgentes" — urgência não justifica pular gates
* Ignorar skills externas disponíveis por "já ter um sub-skill interno que faz isso" — especialização externa gera melhor resultado
* Ativar skill externa sem injetar `OrchestratorContext` — skill sem contexto arquitetural produz output desconexo da arquitetura
* Aceitar output de skill externa sem passar pelo `ConflictDetector` — mesmo outputs de specialists externos podem contradizer ADRs
* Assumir que skill externa cobre a responsabilidade completa sem verificar — usar modo complementar quando a cobertura for parcial
* Varrer todo o repositório para responder algo que já está indexado na knowledge layer
* Carregar o Code Graph ou o Integration Graph inteiro no contexto do LLM em vez de percorrer a vizinhança de um node âncora
* Tratar relação `inferred` como fato arquitetural comprovado — relação sem evidência não sustenta decisão
* Editar manualmente artefatos de `/docs/.ai/` em vez de corrigir a fonte canônica e regenerar
* Indexar secrets, credenciais, conteúdo de `.env` ou dados pessoais reais na knowledge layer
* Regenerar toda a knowledge layer após uma mudança localizada de código

---

## 🧩 Padrões e boas práticas

### Arquitetura de software

* **Clean Architecture** — domain isolado de infraestrutura; dependências apontam para dentro
* **Hexagonal Architecture (Ports & Adapters)** — portas de entrada/saída explícitas, implementações substituíveis
* **Domain-Driven Design** — bounded contexts, aggregates, value objects, domain events
* **CQRS** — separação explícita de comandos e queries em domínios de alta complexidade
* **Event-Driven Architecture** — comunicação assíncrona via eventos para desacoplamento entre módulos
* **Modularização por domínio** — estrutura de pastas espelha o domínio de negócio, não a camada técnica

### Engenharia de qualidade

* **Testabilidade** — código escrito para ser testável por design; sem dependências ocultas
* **Cobertura mínima configurável** — threshold definido em F4, aplicado como quality gate em F6
* **Contrato-first** — APIs e eventos definidos antes do código (schema-first, OpenAPI-first)
* **Idempotência** — operações críticas devem ser idempotentes por padrão
* **Retry com backoff exponencial** — toda comunicação externa deve ter retry configurado
* **Circuit breaker** — isolamento de falhas de dependências externas

### Observabilidade e operações

* **Logs estruturados** — JSON, com correlation ID propagado entre serviços
* **Distributed tracing** — OpenTelemetry como padrão; spans em todas as operações críticas
* **Métricas RED** — Rate, Errors, Duration como baseline para todo serviço
* **SLOs explícitos** — definidos em F7 antes do primeiro deploy em produção
* **Alertas baseados em sintomas** — alertas em SLO breach, não em métricas internas

### Segurança

* **Threat modeling em F2** — ameaças identificadas antes de qualquer código
* **Shift-left security** — validações de segurança em F5 (SAST, SCA) e F6 (DAST, pen testing)
* **Princípio do menor privilégio** — toda identidade e serviço com permissões mínimas necessárias
* **Secrets em vault** — nenhum secret em repositório, variável de ambiente ou imagem

### Orquestração multi-agente

* **Context snapshots por fase** — estado persistido ao final de cada fase (O1–O7)
* **Estrutura agentic persistente** — `docs/`, `specs/`, `tasks/`, `skills/`, `agents/` e `adr/` formam a base de contexto compartilhado entre agentes
* **Knowledge layer para recuperação** — `INDEX FIRST → DOCS SECOND → CODE LAST`: índices compactos em `/docs/.ai/`, documentos Markdown para humanos, código apenas como fallback declarado
* **Sincronização via ContextBus** — toda leitura/escrita de contexto é mediada, nunca direta
* **Paralelismo controlado** — somente sub-skills sem dependência mútua rodam em paralelo
* **Merge determinístico** — outputs paralelos são mergeados em ordem determinística com detecção de conflito
* **Rastreabilidade de agentes** — cada output no contexto contém: sub-skill que gerou, timestamp, fase, versão do snapshot

---

## 🎯 Objetivo final

Entregar um sistema operacional de engenharia autônoma que permita a qualquer equipe — ou agente de IA — criar, evoluir e operar software profissional de nível enterprise do zero à produção, com:

* **Zero ambiguidade arquitetural** entre fases
* **Rastreabilidade total** de requisitos a deploy
* **Qualidade não negociável** via quality gates obrigatórios
* **Consistência garantida** entre produto, arquitetura, código, testes e operações
* **Evolução contínua segura** sem degradação arquitetural
* **Contexto preservado** entre todos os agentes envolvidos

O `autonomous-software-orchestrator` transforma um conjunto de agentes especialistas isolados em uma esteira de engenharia coesa, governada e orientada a valor — operando com a autonomia e rigor de uma engenharia de software de classe mundial.
