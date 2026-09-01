# Protocolo de Gerenciamento de Contexto — autonomous-software-orchestrator

Define o `OrchestratorContext`, protocolo de snapshots, estratégias de compressão, sincronização entre agentes paralelos, persistência de ADRs e formato de checkpoint/rollback.

---

## OrchestratorContext — Estrutura Canônica Completa

```json
{
  "orchestration_id": "uuid-v4",
  "created_at": "2026-01-01T00:00:00Z",
  "current_phase": "F1",
  "snapshot_version": "O1",
  "last_stable_snapshot": null,

  "product": {
    "name": "",
    "domain": "",
    "subdomains": [],
    "personas": [],
    "problems": [],
    "hypotheses": [],
    "strategic_goals": [],
    "business_rules": [],
    "domain_processes": [],
    "domain_glossary": {},
    "mvp_hypothesis": "",
    "mvp_scope": [],
    "learning_metrics": [],
    "metrics": [],
    "feedback_insights": [],
    "evolution_backlog": [],
    "strategy_update": null
  },

  "market": {
    "landscape": "",
    "competitors": [],
    "positioning": "",
    "trends": []
  },

  "business": {
    "model": "",
    "revenue_streams": [],
    "value_proposition": ""
  },

  "requirements": {
    "functional": [],
    "non_functional": [],
    "constraints": []
  },

  "scope": {
    "included": [],
    "excluded": [],
    "boundaries": "",
    "phasing": []
  },

  "feasibility": {
    "verdict": "VIAVEL | VIAVEL_COM_RISCOS | INVIAVEL",
    "risks": [],
    "constraints": []
  },

  "architecture": {
    "pattern": "modular-monolith | microservices | serverless | hybrid",
    "services": [],
    "boundaries": [],
    "component_diagram": "",
    "data_flows": [],
    "communication_patterns": "",
    "layer_map": {},
    "module_responsibilities": [],
    "integration_contracts": [],
    "external_dependencies": [],
    "infrastructure_strategy": {},
    "tech_stack": {},
    "security_model": {},
    "distributed_config": null,
    "async_config": null,
    "scale_decisions": [],
    "reassessment_report": null,
    "adrs": []
  },

  "ux": {
    "journeys": [],
    "wireframes": [],
    "design_system": {},
    "usability_issues": [],
    "validated_journeys": [],
    "accessibility_compliance": ""
  },

  "contracts": {
    "schemas": [],
    "api_version": "",
    "api_spec": "",
    "dtos": [],
    "consistency_model": "eventual | strong | causal",
    "transaction_boundaries": [],
    "concurrency_strategy": ""
  },

  "engineering": {
    "project_structure": "",
    "governance_rules": {},
    "patterns_applied": [],
    "cicd_config": "",
    "quality_thresholds": {},
    "module_map": {},
    "feature_breakdown": [],
    "backlog": [],
    "priorities": [],
    "test_coverage_threshold": 80,
    "coverage_report": null,
    "maintenance_log": []
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
      "source_commit": "9243abc",
      "repository_id": "checkout-api",
      "system_id": "commerce-platform",
      "artifacts": {
        "features.json": "sha256:...",
        "routes.json": "sha256:...",
        "freshness.json": "sha256:..."
      },
      "counts": { "modules": 7, "features": 42, "routes": 31, "events": 9 },
      "health": { "fresh": 39, "stale": 3, "stale_critical": 0, "broken_references": 0 },
      "retrieval_tests": { "success_rate": 0.93, "docs_only_rate": 0.85, "fallback_to_code_rate": 0.15 },
      "coverage_exceptions": [],
      "agents_synced": true
    }
  },

  "quality": {
    "gates_passed": [],
    "gates_failed": [],
    "test_results": null,
    "coverage_report": null,
    "security_report": null,
    "qa_report": null,
    "manual_qa_campaign": null,
    "manual_qa_notion_export": null
  },

  "operations": {
    "deployment_record": null,
    "smoke_test_results": null,
    "observability_config": null,
    "slos": [],
    "alerts": [],
    "runbooks": [],
    "incidents": [],
    "cost_optimization_report": null
  },

  "orchestration": {
    "external_skills_activated": [
      {
        "skill_name": "",
        "source": "",
        "reason": "",
        "replaces_internal": "",
        "mode": "substituto | complementar",
        "phase": "",
        "timestamp": "ISO8601"
      }
    ]
  }
}
```

---

## `agentic.knowledge_layer` — apenas ponteiros

A AI Documentation Knowledge Layer ([knowledge-layer.md](./knowledge-layer.md)) produz índices e grafos que podem crescer para dezenas de megabytes. Esses artefatos vivem exclusivamente em `/docs/.ai/`.

O contexto guarda somente:

| Guarda | Não guarda |
|---|---|
| caminho dos artefatos | conteúdo dos índices |
| `schema_version` e `source_commit` | nodes e edges dos grafos |
| hash por artefato | listas de símbolos, rotas ou entidades |
| contagens e métricas de saúde | corpo de documentos |
| métricas da retrieval test suite | evidências das relações |
| exceções de cobertura declaradas | histórico de healing |

Um agente que precisa de detalhe abre o artefato em disco pela chave da consulta, percorrendo a vizinhança do node âncora — nunca carregando o grafo completo.

---

## Protocolo de Snapshots (O1–O7)

Snapshots são tirados ao final de cada fase, após o quality gate ser aprovado. Representam o estado estável e auditável do contexto naquele ponto do pipeline.

| Snapshot | Fase concluída | Seções congeladas | Gatilho |
|---|---|---|---|
| O1 | F1 — Discovery & Strategy | `product`, `market`, `business`, `requirements`, `scope`, `feasibility` | Quality gate F1 aprovado |
| O2 | F2 — Architecture & Design | `architecture` (todas as subchaves) | Quality gate F2 aprovado |
| O3 | F3 — Data & API Contracts | `contracts` (todas as subchaves) | Quality gate F3 aprovado |
| O4 | F4 — UX/UI & Planning | `ux`, `engineering.backlog`, `engineering.priorities`, `engineering.module_map`, `agentic` (exceto `agentic.docs_map` e `agentic.knowledge_layer`) | Quality gate F4 aprovado |
| O5 | F5 — Engineering Execution | `engineering` (todas as subchaves), `quality.coverage_report` | Quality gate F5 aprovado |
| O6 | F6 — Quality, Docs & Deploy | `quality` (todas), `operations.deployment_record`, `operations.smoke_test_results` | Quality gate F6 aprovado |
| O7 | F7 — Operate & Evolve | `operations` (todas as subchaves) | SLOs ativos + feedback loop operacional |

### Formato de snapshot

```json
{
  "snapshot_id": "O2",
  "phase_completed": "F2",
  "timestamp": "ISO8601",
  "frozen_sections": ["architecture"],
  "context_hash": "sha256-of-frozen-sections",
  "quality_gate_approval": {
    "approved_by": "QualityGateEngine",
    "criteria_met": ["tech_stack_locked", "security_model_defined", "..."],
    "timestamp": "ISO8601"
  }
}
```

### Immutabilidade de snapshots

* Seções congeladas em um snapshot **nunca podem ser modificadas diretamente** em fases subsequentes
* Modificações em seções congeladas requerem criação de um ADR de "decision override" com justificativa
* O `ConflictDetector` rejeita qualquer escrita em seção congelada sem ADR correspondente

### Exceção: artefatos derivados

`agentic.knowledge_layer` e `agentic.docs_map` são as únicas subchaves de `agentic` **exemptas** do congelamento de O4. Ambas descrevem artefatos derivados do código, que por definição evoluem em F5, F6 e F7 a cada entrega e a cada healing.

A exceção é estrita:

| Subchave de `agentic` | Congelada em O4 | Como muda |
|---|---|---|
| `project_structure`, `specs_map`, `tasks_workflow`, `agents_map`, `skills_map`, `traceability_rules`, `initial_adrs_recommended` | **sim** | apenas via ADR de decision override |
| `docs_map` | não | atualizada por `ai-docs-self-healing-engine` ao criar ou mover documentos |
| `knowledge_layer` | **não** | regravada a cada execução da skill; sempre com `source_commit` atualizado |

As *convenções* permanecem congeladas — gramática de IDs, `repository_id`/`system_id` e regras de rastreabilidade só mudam por ADR. O que evolui livremente é o **estado derivado** que essas convenções governam.

---

## Estratégia de Compressão de Contexto

Compressão é aplicada ao final de cada fase para evitar token explosion em execuções longas.

### Regras de compressão

**O que comprime:**
* Outputs detalhados de sub-skills que foram mergeados ao contexto → substituídos por sumário estruturado
* Histórico de raciocínio intermediário de agentes → descartado após merge confirmado
* Alternativas não escolhidas em decisões → retidas apenas no ADR correspondente, não no contexto principal
* Listas de resultados detalhados → mantidas apenas top-N mais relevantes + sumário dos demais

**O que NUNCA comprime:**
* ADRs — sempre preservados integralmente (contexto, opções, decisão, trade-offs, consequências)
* Quality gate approvals — logs completos sempre retidos
* Contratos de API e schemas — sempre na íntegra
* Snapshots — nunca comprimidos após serem tirados

**O que nunca entra no contexto:**
* Artefatos de `/docs/.ai/` — índices, Code Graph, Integration Graph, Business Flow Graph, traceability e freshness permanecem em disco; o contexto carrega apenas `agentic.knowledge_layer` com caminho, versão, hashes, contagens e métricas
* Corpo de documentos Markdown de `/docs` — lidos sob demanda pela chave da consulta

### Algoritmo de compressão por fase

```
1. Identificar seções com outputs detalhados de sub-skills
2. Verificar se outputs foram confirmados como mergeados ao contexto canônico
3. Para cada output confirmado:
   a. Extrair apenas o valor final (não o raciocínio que levou a ele)
   b. Substituir o output detalhado pelo valor extraído na posição canônica
   c. Descartar o output original
4. Recalcular hash do contexto comprimido
5. Registrar operação de compressão em audit log
```

### Estimativa de tamanho por snapshot

| Snapshot | Tamanho estimado pós-compressão |
|---|---|
| O1 | ~2–4k tokens |
| O2 | ~4–8k tokens |
| O3 | ~6–12k tokens |
| O4 | ~8–15k tokens |
| O5 | ~10–18k tokens |
| O6 | ~12–20k tokens |
| O7 | ~14–22k tokens |

Se qualquer snapshot exceder 25k tokens, `CompressionEngine` aciona compressão agressiva preservando apenas estrutura canônica + ADRs.

A AI Documentation Knowledge Layer **não altera** essas estimativas: por maior que o sistema fique, `agentic.knowledge_layer` permanece na ordem de centenas de tokens, porque guarda apenas referências. É exatamente esse o mecanismo que permite documentar sistemas grandes sem inflar o contexto.

---

## Sincronização entre Agentes Paralelos

Quando múltiplas sub-skills executam em paralelo (ex: `backend-development-engine` + `frontend-development-engine`), o `ContextBus` gerencia o acesso concorrente.

### Protocolo de leitura

* Todo agente lê uma **cópia imutável** do contexto no início de sua execução (read snapshot at start)
* Nenhum agente lê o contexto dinâmico de outro agente em execução
* Leituras são sempre servidas a partir do snapshot mais recente aprovado

### Protocolo de escrita

```
1. Sub-skill completa execução e produz output estruturado
2. Output é entregue ao ContextBus com metadados:
   {
     "produced_by": "backend-development-engine",
     "phase": "F5",
     "timestamp": "ISO8601",
     "target_keys": ["engineering.coverage_report", "quality.coverage_report"],
     "payload": { ... }
   }
3. ContextBus verifica:
   a. Nenhum lock ativo nos target_keys
   b. Output não contradiz seções congeladas
   c. Output é consistente com ADRs registrados
4. Se verificação passa: merge ao contexto principal, release de lock
5. Se verificação falha: output é enfileirado para resolução pelo ConflictDetector
```

### Resolução de conflitos

Quando dois agentes paralelos produzem outputs conflitantes para as mesmas chaves:

```
1. ConflictDetector recebe ambos os outputs
2. Analisa: qual output é consistente com os ADRs e snapshots anteriores?
3. Se um é claramente consistente e o outro não: aceita o consistente, rejeita o outro
4. Se ambos são inconsistentes com cada outro mas ambos são internamente válidos:
   a. Pausa ambos os agentes
   b. Escalona conflito para resolução manual via PhaseController
   c. Após resolução: atualiza ADRs e reinicia agentes com contexto correto
5. Registra conflito e resolução no audit log
```

---

## Persistência de ADRs

Cada ADR segue o formato padrão de Architecture Decision Record:

```json
{
  "id": "ADR-001",
  "title": "Padrão Arquitetural: Modular Monolith",
  "phase": "F2",
  "status": "ACCEPTED | SUPERSEDED | DEPRECATED",
  "context": "Descrição do problema ou situação que motivou a decisão",
  "options_considered": [
    {
      "name": "Microsserviços",
      "pros": ["..."],
      "cons": ["..."]
    },
    {
      "name": "Modular Monolith",
      "pros": ["..."],
      "cons": ["..."]
    }
  ],
  "decision": "Adotar Modular Monolith",
  "rationale": "Justificativa técnica detalhada",
  "trade_offs": ["..."],
  "consequences": ["..."],
  "supersedes": null,
  "superseded_by": null,
  "timestamp": "ISO8601"
}
```

### Regras de ADR

* Toda decisão que impacta mais de 1 módulo ou mais de 1 fase do pipeline requer ADR
* ADRs são numerados sequencialmente (ADR-001, ADR-002, ...)
* Quando uma decisão anterior é revisada, o ADR original é marcado como `SUPERSEDED` e um novo ADR com referência ao anterior é criado
* ADRs nunca são deletados — apenas marcados como `SUPERSEDED` ou `DEPRECATED`
* O `ConflictDetector` usa ADRs como ground truth para resolver conflitos entre agentes

---

## Formato de Checkpoint e Rollback

### Checkpoint

Checkpoints são pontos de retomada que permitem reiniciar o pipeline a partir de um estado específico sem perder trabalho anterior.

```json
{
  "checkpoint_id": "CHK-003",
  "snapshot_version": "O2",
  "phase_at_checkpoint": "F3",
  "sub_skill_at_checkpoint": "api-contract-engine",
  "context_at_checkpoint": "<<snapshot O2 completo>>",
  "reason": "Pausa solicitada pelo usuário",
  "timestamp": "ISO8601"
}
```

### Rollback de fase

Acionado quando:
* Quality gate de uma fase falha após múltiplas tentativas
* `ConflictDetector` detecta inconsistência irrecuperável no contexto
* Decisão arquitetural fundamental precisa ser revisada

```
Protocolo de rollback:
1. Identificar último snapshot estável (ex: O2)
2. Restaurar OrchestratorContext para o estado do snapshot O2
3. Marcar fase atual como ROLLED_BACK com justificativa
4. Criar ADR documentando o motivo do rollback e lições aprendidas
5. Reiniciar a partir do snapshot restaurado
6. Não descartar outputs da fase problemática — arquivá-los com status INVALIDATED
7. Informar ao usuário: fase revertida, motivo, próximos passos
```

### Retomada de execução (phase-resume mode)

```
Entrada: { "mode": "phase-resume", "from_snapshot": "O3" }

1. Carregar snapshot O3 do arquivo
2. Verificar integridade via context_hash
3. Definir current_phase = F4 (próxima após O3)
4. Injetar contexto nos agentes de F4
5. Continuar pipeline normalmente a partir de F4
```
