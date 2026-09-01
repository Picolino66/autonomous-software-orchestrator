<div align="center">

```
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║        AUTONOMOUS SOFTWARE ORCHESTRATOR                           ║
║                                                                   ║
║        Do zero à produção. Com governança, contexto e rigor.      ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Sub-skills](https://img.shields.io/badge/sub--skills-55-purple?style=flat-square)
![Phases](https://img.shields.io/badge/phases-7-orange?style=flat-square)
![Quality Gates](https://img.shields.io/badge/quality%20gates-7-green?style=flat-square)
![Language](https://img.shields.io/badge/language-pt--BR-yellow?style=flat-square)

**Sistema nervoso central de engenharia autônoma de software.**  
Orquestra o ciclo de vida completo de um sistema — da ideação à evolução contínua em produção.

</div>

---

## O que é isso?

O `autonomous-software-orchestrator` não é uma skill comum. É um **sistema de orquestração de múltiplos agentes especialistas** que atua como CTO autônomo + Arquiteto Principal + Coordenador de Entregas — simultaneamente.

Ele recebe uma descrição de produto e executa autonomamente tudo que um time de engenharia de excelência faria: define estratégia, projeta arquitetura, contrata APIs, desenvolve, testa, documenta, faz deploy e opera — com rastreabilidade total e qualidade não negociável em cada etapa.

> Cada decisão arquitetural é registrada como ADR.  
> Cada fase avança somente após quality gate aprovado.  
> Nenhum agente opera sem o contexto compartilhado do sistema.

---

## A esteira em 7 fases

```
  ┌─────────────────────────────────────────────────────────────────────┐
  │                                                                     │
  │   F1  ──►  F2  ──►  F3  ──►  F4  ──►  F5  ──►  F6  ──►  F7          │
  │    │        │        │        │        │        │        │          │
  │  Discovery  Arch    Data    UX/UI    Enginer  Quality  Operate      │
  │  Strategy  Design  Contracts Planning  Exec   Docs     Evolve       │
  │                                                Deploy               │
  │                                                         │           │
  │                                              ┌──────────┤           │
  │                                              ▼          ▼           │
  │                                             F2         F4           │
  │                                         (arch evo) (feat evo)       │
  │                                                                     │
  └─────────────────────────────────────────────────────────────────────┘
```

Cada fase possui entradas obrigatórias, sub-skills ativadas e um quality gate explícito que bloqueia o avanço até que todos os critérios sejam atendidos.

---

## Fases em detalhe

<details>
<summary><strong>F1 — Discovery & Strategy</strong> &nbsp;·&nbsp; 10 sub-skills</summary>

> Constrói o contexto completo de produto, mercado e negócio antes de qualquer decisão técnica.

| Sub-skill | Responsabilidade |
|---|---|
| `market-context-analysis` | Análise de mercado, concorrentes e posicionamento |
| `business-model-definition` | Modelo de negócio e fontes de receita |
| `persona-definition-engine` | Perfis de usuário com dores e objetivos |
| `ideation-engine` | Geração e refinamento de ideias de produto |
| `business-understanding-engine` | Regras de negócio e processos de domínio |
| `requirements-engine` | Requisitos funcionais e não-funcionais |
| `scope-definition-engine` | Limites explícitos do sistema (incluído e excluído) |
| `feasibility-analysis-engine` | Viabilidade técnica, financeira e operacional |
| `mvp-validation-engine` | Validação da hipótese mínima de produto |
| `metrics-definition-engine` | KPIs e definição mensurável de sucesso |

**Quality gate:** personas estruturadas + MVP hypothesis validada + escopo com limites + métricas mensuráveis + viabilidade avaliada

</details>

<details>
<summary><strong>F2 — Architecture & Design</strong> &nbsp;·&nbsp; 7 sub-skills</summary>

> Define toda a arquitetura macro do sistema com decisões registradas como ADRs — antes de qualquer linha de código.

```
global-architecture-engine
        ↓
system-design-engine
        ↓
layered-architecture-engine  ◄──►  integration-definition-engine
        ↓
infrastructure-strategy-engine
        ↓
technology-stack-selector
        ↓
security-architecture-engine
```

**Quality gate:** padrão arquitetural com ADR + stack locked + modelo de segurança + sem decisões contraditórias

</details>

<details>
<summary><strong>F3 — Data & API Contracts</strong> &nbsp;·&nbsp; 3 sub-skills</summary>

> Define e bloqueia contratos de dados e APIs antes do desenvolvimento. Implementações não podem divergir dos contratos definidos aqui.

```
data-modeling-engine
        ↓
api-contract-engine
        ↓
data-consistency-engine
```

**Saídas:** schemas versionados, spec OpenAPI/AsyncAPI completa, modelo de consistência (eventual | strong | causal), limites transacionais por aggregate

**Quality gate:** schema versionado + spec sem campos ausentes + modelo de consistência com ADR + zero campos `any` sem definição

</details>

<details>
<summary><strong>F4 — UX/UI & Planning</strong> &nbsp;·&nbsp; 6 sub-skills</summary>

> Valida experiência do usuário e constrói o backlog técnico executável. A estrutura agentic do projeto é criada aqui.

| Sub-skill | Saída principal |
|---|---|
| `ux-ui-design-engine` | Jornadas de usuário, wireframes, design system |
| `usability-testing-engine` | Validação dos fluxos críticos |
| `technical-planning-engine` | Mapa de módulos e feature breakdown |
| `agentic-project-structure-engine` | Estrutura `docs/`, `specs/`, `tasks/`, `skills/`, `agents/`, `adr/` |
| `backlog-generation-engine` | Histórias técnicas com critérios de aceitação |
| `prioritization-engine` | Backlog ordenado por valor × risco × esforço |

**Quality gate:** jornadas validadas + estrutura agentic criada + specs para todas as features + rastreabilidade definida + threshold de cobertura registrado

</details>

<details>
<summary><strong>F5 — Engineering Execution</strong> &nbsp;·&nbsp; 10 sub-skills</summary>

> Desenvolve o sistema com governança de código, pipelines automáticas e padrões arquiteturais aplicados.

```
project-setup-engine
        ↓
code-governance-engine  ◄──►  architectural-patterns-engine
        ↓
cicd-pipeline-engine    ◄──►  quality-gates-engine
        ↓
backend-development-engine  ◄──►  frontend-development-engine  ◄──►  mobile-development-engine
        ↓
distributed-architecture-engine   (quando microsserviços)
        ↓
orchestration-engine               (quando filas/eventos/workers)
```

**Quality gate:** build verde + cobertura ≥ threshold + zero lint crítico + nenhum contrato divergindo da spec de F3 + pipeline CI/CD verde + zero secrets hardcoded

</details>

<details>
<summary><strong>F6 — Quality, Docs & Deploy</strong> &nbsp;·&nbsp; 9 sub-skills</summary>

> Garante que o sistema está seguro, documentado, testado em profundidade e pronto para produção.

```
automated-testing-engine  ◄──►  security-testing-engine
        ↓
quality-assurance-engine
        ↓
manual-qa-notion-export-engine  ◄──►  documentation-engine  ◄──►  operational-documentation-engine  ◄──►  ai-docs-self-healing-engine
        ↓
deployment-engine
        ↓
post-deployment-validation-engine
```

**Saídas:** suíte completa de testes (unit, integration, contract, e2e), relatório SAST/DAST/SCA, campanha manual com CSV enxuto e roteiro no corpo dos cards do Notion quando aplicável, documentação técnica e arquitetural, runbooks, sistema deployado com rollback validado

**Quality gate:** security scan sem críticos + testes e2e aprovados + docs completa + rollback testado + smoke tests passando

</details>

<details>
<summary><strong>F7 — Operate & Evolve</strong> &nbsp;·&nbsp; 9 sub-skills</summary>

> Opera o sistema com observabilidade completa, responde a incidentes, incorpora feedback e evolui continuamente sem degradação arquitetural.

```
observability-engine              (permanente)
incident-management-engine        (on-demand)
maintenance-engine                (cadência regular)
        ↓
user-feedback-engine  →  continuous-evolution-engine
        ↓
performance-and-scale-engine      (on KPI threshold breach)
infrastructure-cost-optimization-engine
        ↓
architectural-reassessment-engine (on trigger: scale | complexity | tech debt)
        ↓
product-strategy-engine
        ↻  retorna a F2 ou F4
```

**Quality gate:** SLOs definidos + alertas configurados + feedback loop operacional + primeiro incident review realizado + decisão de próxima evolução documentada

</details>

---

## Arquitetura interna

```
┌──────────────────────────────────────────────────────────────────┐
│                   AUTONOMOUS ORCHESTRATOR                        │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐    │
│   │               OrchestratorContext                       │    │
│   │     product | architecture | contracts | engineering    │    │
│   │     ux | quality | operations | agentic | ADRs          │    │
│   └─────────────────────────────┬───────────────────────────┘    │
│                                 │                                │
│   ┌─────────────────────────────▼───────────────────────────┐    │
│   │                   PhaseController                       │    │
│   │   aciona sub-skills · valida quality gates              │    │
│   │   controla dependências · gerencia paralelismo          │    │
│   └────────────────┬────────────────────────────────────────┘    │
│                    │                                             │
│   ┌────────────────▼────────────────────────────────────────┐    │
│   │              ExternalSkillResolver                      │    │
│   │   descobre skills externas · avalia relevância          │    │
│   │   delega (substituto ou complementar)                   │    │ 
│   └──────────────┬──────────────────────┬───────────────────┘    │
│                  │                      │                        │
│            sub-skill             skill externa                   │
│             interno           (.agents/skills/)                  │
│                  │                      │                        │
│   ┌──────────────▼──────────────────────▼───────────────────┐    │
│   │   ContextBus · ConflictDetector · CompressionEngine     │    │
│   └──────────────────────────┬──────────────────────────────┘    │
│                              │                                   │
│   ┌──────────────────────────▼──────────────────────────────┐    │
│   │                   SnapshotEngine                        │    │
│   │         O1 → O2 → O3 → O4 → O5 → O6 → O7                │    │
│   └─────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────┘
```

| Componente | Responsabilidade |
|---|---|
| **PhaseController** | Controla fase ativa, bloqueia avanço se quality gate falhar |
| **ContextBus** | Mediador de leitura/escrita do contexto com versionamento |
| **DependencyGraph** | Grafo de dependências entre sub-skills — impede execução fora de ordem |
| **QualityGateEngine** | Valida critérios de conclusão antes de avançar cada fase |
| **ConflictDetector** | Detecta inconsistências entre outputs de agentes paralelos |
| **SnapshotEngine** | Persiste estado canônico ao final de cada fase (O1–O7) |
| **ADRRegistry** | Registra decisões arquiteturais com contexto, alternativas e consequências |
| **CompressionEngine** | Sumariza partes antigas do contexto para evitar token explosion |
| **ExternalSkillResolver** | Descobre e delega para skills externas mais especializadas |

---

## OrchestratorContext — o estado vivo do sistema

Um único objeto JSON canônico cresce ao longo das 7 fases e é compartilhado entre todos os agentes. Nenhum agente opera sem ele.

```jsonc
{
  "orchestration_id": "uuid-v4",
  "current_phase": "F3",
  "snapshot_version": "O3",

  "product":      { "name", "domain", "personas", "mvp_hypothesis", "metrics" },
  "market":       { "landscape", "competitors", "positioning" },
  "architecture": { "pattern", "tech_stack", "security_model", "adrs": [] },
  "contracts":    { "api_version", "api_spec", "schemas", "consistency_model" },
  "ux":           { "journeys", "wireframes", "design_system" },
  "engineering":  { "backlog", "module_map", "coverage_report" },
  "agentic":      { "docs_map", "specs_map", "agents_map", "skills_map" },
  "quality":      { "gates_passed", "gates_failed", "security_report" },
  "operations":   { "slos", "alerts", "incidents", "runbooks" }
}
```

### Snapshots imutáveis por fase

| Snapshot | Seções congeladas |
|---|---|
| **O1** após F1 | `product` · `market` · `business` · `requirements` · `scope` · `feasibility` |
| **O2** após F2 | `architecture` (todas as subchaves) |
| **O3** após F3 | `contracts` (todas as subchaves) |
| **O4** após F4 | `ux` · `engineering.backlog` · `engineering.module_map` · `agentic` |
| **O5** após F5 | `engineering` · `quality.coverage_report` |
| **O6** após F6 | `quality` · `operations.deployment_record` |
| **O7** após F7 | `operations` (todas as subchaves) |

> Seções congeladas nunca são modificadas diretamente. Qualquer revisão exige um ADR de "decision override" com justificativa explícita.

---

## Modos de execução

| Modo | Quando usar |
|---|---|
| `full-pipeline` | Projeto novo do zero — executa todas as 7 fases |
| `phase-resume` | Retomar a partir de um snapshot salvo (`--from O3`, por exemplo) |
| `feature-evolution` | Novas features em sistema existente — fases 4 a 7 |
| `architecture-review` | Reavaliar arquitetura sem novo desenvolvimento |
| `incident-response` | Resposta direta a incidente em produção — ativa F7 direto |

---

## Integração com skills externas

A partir de F2, o `ExternalSkillResolver` consulta automaticamente skills instaladas antes de ativar qualquer sub-skill interno. Se uma skill mais especializada for encontrada, ela substitui ou complementa o sub-skill interno.

```
Prioridade de busca:

1.  .agents/skills/        ← skills do projeto atual       (máxima prioridade)
2.  ~/.agents/skills/      ← skills globais instaladas
3.  ~/.claude/skills/      ← skills Claude globais
4.  npx skills find        ← registro remoto               (fallback)
```

Skills externas sempre recebem o `OrchestratorContext` completo e têm seus outputs validados pelo `ConflictDetector` antes de serem mergeados — mesmo specialists externos podem contradizer ADRs existentes.

---

## Padrões aplicados

**Arquitetura**
Clean Architecture · Hexagonal (Ports & Adapters) · Domain-Driven Design · CQRS · Event-Driven · Modularização por domínio

**Qualidade**
Contract-first · Schema-first · OpenAPI-first · Idempotência · Retry com backoff exponencial · Circuit breaker · Cobertura mínima configurável

**Observabilidade**
Logs estruturados (JSON + correlation ID) · Distributed tracing (OpenTelemetry) · Métricas RED · SLOs explícitos · Alertas baseados em sintomas

**Segurança**
Threat modeling em F2 · Shift-left security (SAST/SCA em F5, DAST em F6) · Menor privilégio · Secrets em vault — nunca em repositório

---

## Estrutura do projeto

```
autonomous-software-orchestrator/
│
├── SKILL.md                           # Protocolo de orquestração e regras obrigatórias
├── pipeline.md                        # 7 fases com quality gates detalhados
├── context-management.md              # OrchestratorContext, snapshots, ADRs e rollback
├── scripts/
│   └── export-manual-qa-notion.mjs    # Gera propriedades e conteúdo dos cards do Notion
│
└── sub-skills/                        # 55 sub-skills individuais
    │
    ├── market-context-analysis.md
    ├── business-model-definition.md
    ├── persona-definition-engine.md
    ├── ...                            # F1 — 10 sub-skills
    │
    ├── global-architecture-engine.md
    ├── security-architecture-engine.md
    ├── ...                            # F2 — 7 sub-skills
    │
    ├── data-modeling-engine.md
    ├── api-contract-engine.md
    ├── ...                            # F3–F7 — 37 sub-skills
    │
    └── external-skill-resolver.md     # Transversal F2–F7
```

---

## Garantias do sistema

```
Zero ambiguidade arquitetural    →  toda decisão registrada como ADR antes de executar
Rastreabilidade total            →  requisito → ADR → implementação → teste → deploy
Qualidade não negociável         →  quality gates bloqueiam avanço sem aprovação explícita
Consistência garantida           →  produto, arquitetura, código, testes e operações alinhados
Evolução contínua segura         →  F7 aciona reavaliação antes de qualquer mudança estrutural
Contexto preservado              →  nenhum agente opera sem o OrchestratorContext atualizado
```

---

<div align="center">

**Documentação completa**

[pipeline.md](./pipeline.md) &nbsp;·&nbsp; [context-management.md](./context-management.md) &nbsp;·&nbsp; [sub-skills/](./sub-skills/) &nbsp;·&nbsp; [SKILL.md](./SKILL.md)

</div>
