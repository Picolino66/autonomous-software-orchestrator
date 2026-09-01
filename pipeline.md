# Pipeline de Execução — autonomous-software-orchestrator

Descreve as 7 fases da esteira, com sub-skills ativadas, entradas exigidas, saídas produzidas e critérios de quality gate para avanço.

---

## F1 — Discovery & Strategy

**Objetivo:** Construir o contexto completo de produto, mercado e negócio antes de qualquer decisão técnica.

**Sub-skills ativadas (podem ser parcialmente paralelas):**

| Sub-skill | Paralela com |
|---|---|
| `market-context-analysis` | `persona-definition-engine` |
| `business-model-definition` | `persona-definition-engine` |
| `persona-definition-engine` | `market-context-analysis`, `business-model-definition` |
| `ideation-engine` | após as 3 anteriores |
| `business-understanding-engine` | `ideation-engine` |
| `requirements-engine` | após `business-understanding-engine` |
| `scope-definition-engine` | após `requirements-engine` |
| `feasibility-analysis-engine` | após `scope-definition-engine` |
| `mvp-validation-engine` | após `feasibility-analysis-engine` |
| `metrics-definition-engine` | paralela com `mvp-validation-engine` |

**Entradas obrigatórias no contexto:**
- Descrição inicial do produto ou ideia
- Domínio de negócio
- Restrições conhecidas (orçamento, prazo, regulatório)

**Saídas produzidas no `OrchestratorContext`:**
- `product.domain` — domínio e subdomínios
- `product.personas` — perfis de usuário estruturados
- `product.business_rules` — regras de negócio identificadas
- `product.mvp_hypothesis` — hipótese validada do MVP
- `product.metrics` — KPIs e definição de sucesso
- `scope.included` / `scope.excluded` — limites funcionais
- `feasibility.verdict` — viabilidade técnica/financeira/operacional

**Quality gate F1 → F2:**
- [ ] Pelo menos 2 personas estruturadas com dores e objetivos definidos
- [ ] MVP hypothesis declarada e validada por `mvp-validation-engine`
- [ ] Escopo com limites explícitos (incluído e excluído)
- [ ] Métricas de sucesso definidas e mensuráveis
- [ ] Viabilidade técnica avaliada como VIÁVEL ou VIÁVEL_COM_RISCOS

---

## F2 — Architecture & Design

**Objetivo:** Definir toda a arquitetura macro do sistema com decisões registradas como ADRs antes de qualquer linha de código.

**Sub-skills ativadas (sequência obrigatória):**

```
global-architecture-engine
    ↓
system-design-engine
    ↓
layered-architecture-engine ←→ integration-definition-engine (paralelas)
    ↓
infrastructure-strategy-engine
    ↓
technology-stack-selector
    ↓
security-architecture-engine
```

**Entradas obrigatórias no contexto:**
- Snapshot O1 completo
- `product.domain`, `scope.included`, `feasibility.verdict`

**Saídas produzidas:**
- `architecture.pattern` — monolito modular, microsserviços, serverless ou híbrido
- `architecture.tech_stack` — linguagens, frameworks, databases, mensageria, cloud
- `architecture.layer_map` — mapa de camadas e responsabilidades por camada
- `architecture.integration_contracts` — contratos de integração externa definidos
- `architecture.infrastructure_strategy` — cloud provider, containers, scaling strategy
- `architecture.security_model` — auth, authz, criptografia, segredos
- `architecture.adrs` — pelo menos 3 ADRs registrados (padrão arquitetural, stack, segurança)

**Quality gate F2 → F3:**
- [ ] Padrão arquitetural selecionado com ADR registrado
- [ ] Stack tecnológica locked com justificativa
- [ ] Modelo de segurança definido (auth/authz, threat model básico)
- [ ] Estratégia de infraestrutura definida
- [ ] Contratos de integração externos catalogados
- [ ] Nenhuma decisão arquitetural contraditória detectada pelo `ConflictDetector`

---

## F3 — Data & API Contracts

**Objetivo:** Definir e bloquear todos os contratos de dados e APIs antes do desenvolvimento, garantindo que implementações não possam divergir.

**Sub-skills ativadas:**

```
data-modeling-engine
    ↓
api-contract-engine (depende de data-modeling)
    ↓
data-consistency-engine (depende de ambas)
```

**Entradas obrigatórias:**
- Snapshot O2, `architecture.tech_stack`, `architecture.layer_map`
- `product.business_rules` (para derivar entidades e invariantes)

**Saídas produzidas:**
- `contracts.schemas` — modelos de dados versionados (ERD + schema definitions)
- `contracts.api_version` — versão base da API (ex: v1)
- `contracts.api_spec` — OpenAPI/AsyncAPI spec completa por serviço
- `contracts.consistency_model` — modelo de consistência (eventual, strong, causal)
- `contracts.transaction_boundaries` — limites transacionais definidos por aggregate
- `contracts.dtos` — DTOs de entrada e saída por operação

**Quality gate F3 → F4:**
- [ ] Schema de banco de dados versionado e revisado
- [ ] OpenAPI spec gerada e sem campos obrigatórios ausentes
- [ ] Modelo de consistência escolhido com ADR
- [ ] Limites transacionais mapeados por domínio
- [ ] Nenhum campo `any` ou `object` sem definição nas DTOs

---

## F4 — UX/UI & Planning

**Objetivo:** Validar experiência do usuário e construir o backlog técnico executável antes do desenvolvimento.

**Sub-skills ativadas:**

```
ux-ui-design-engine (paralela com F3 final)
    ↓
usability-testing-engine
    ↓
technical-planning-engine
    ↓
agentic-project-structure-engine
    ↓
backlog-generation-engine
    ↓
prioritization-engine
```

**Entradas obrigatórias:**
- Snapshot O1 (personas, jornadas), Snapshot O2 (tech stack)
- `contracts.api_spec` (para alinhar UI com contrato de API)

**Saídas produzidas:**
- `ux.journeys` — jornadas de usuário por persona
- `ux.wireframes` — wireframes de fluxos críticos
- `ux.design_system` — tokens, componentes, guidelines visuais
- `engineering.module_map` — mapa de módulos e suas dependências
- `agentic.project_structure` — estrutura obrigatória `docs/`, `specs/`, `tasks/`, `skills/`, `agents/`, `adr/` criada ou validada
- `agentic.specs_map` — specs por feature planejada com vínculos para docs e requisitos
- `agentic.agents_map` / `agentic.skills_map` — agentes e skills necessários por área de execução
- `agentic.traceability_rules` — convenções de rastreabilidade entre docs, specs, tasks, código, testes e ADRs
- `engineering.backlog` — histórias técnicas com critérios de aceitação
- `engineering.priorities` — backlog ordenado por valor × risco × esforço
- `engineering.test_coverage_threshold` — threshold de cobertura acordado

**Quality gate F4 → F5:**
- [ ] Jornadas críticas validadas por `usability-testing-engine`
- [ ] Backlog gerado com ao menos 1 sprint de capacidade definida
- [ ] Todas as histórias com critérios de aceitação verificáveis
- [ ] Módulos mapeados sem dependências circulares
- [ ] Estrutura agentic obrigatória criada ou validada
- [ ] Specs existentes para todas as features planejadas antes de gerar tasks/backlog
- [ ] Convenção de rastreabilidade definida entre docs, specs, tasks, implementação, testes e docs atualizados
- [ ] Mapa inicial de agentes e skills definido com ownership claro
- [ ] Threshold de cobertura de testes definido e registrado no contexto

---

## F5 — Engineering Execution

**Objetivo:** Desenvolver o sistema com governança de código, pipelines automáticas e padrões arquiteturais aplicados.

**Sub-skills ativadas:**

```
project-setup-engine
    ↓
code-governance-engine ←→ architectural-patterns-engine (paralelas)
    ↓
cicd-pipeline-engine ←→ quality-gates-engine (paralelas)
    ↓
backend-development-engine ←→ frontend-development-engine ←→ mobile-development-engine (paralelas por domínio)
    ↓
distributed-architecture-engine (quando microsserviços)
    ↓
orchestration-engine (quando filas/eventos/workers)
```

**Entradas obrigatórias:**
- Snapshot O4 completo
- `contracts.api_spec`, `contracts.schemas`, `engineering.backlog`
- `architecture.tech_stack`, `architecture.pattern`

**Saídas produzidas:**
- Código-fonte estruturado por módulo de domínio
- Pipelines CI/CD configuradas e funcionais
- `quality.gates_passed` — gates de lint, type-check, testes aprovados
- `engineering.coverage_report` — relatório de cobertura atual

**Quality gate F5 → F6:**
- [ ] Build sem erros em todos os módulos
- [ ] Cobertura de testes ≥ threshold definido em F4
- [ ] Zero violações de lint críticas
- [ ] Nenhum contrato de API divergindo da spec de F3
- [ ] Pipeline CI/CD verde em branch principal
- [ ] Nenhum secret hardcoded detectado em SAST scan

---

## F6 — Quality, Docs & Deploy

**Objetivo:** Garantir que o sistema está seguro, documentado, testado em profundidade e pronto para produção.

**Sub-skills ativadas:**

```
automated-testing-engine ←→ security-testing-engine (paralelas)
    ↓
quality-assurance-engine
    ↓
manual-qa-notion-export-engine ←→ documentation-engine ←→ operational-documentation-engine ←→ ai-docs-self-healing-engine (paralelas)
    ↓
deployment-engine
    ↓
post-deployment-validation-engine
```

**Entradas obrigatórias:**
- Snapshot O5, build artifacts validados, pipeline verde

**Saídas produzidas:**
- Suíte de testes completa (unit, integration, contract, e2e)
- Relatório de segurança (SAST, DAST, SCA)
- Campanha de QA manual por dia, CSV enxuto e conteúdo do corpo dos cards para Notion, quando aplicável
- Documentação técnica e arquitetural
- Runbooks e procedimentos operacionais
- Sistema deployado e validado em ambiente de produção

**Quality gate F6 → F7:**
- [ ] Security scan sem vulnerabilidades críticas ou altas sem mitigação
- [ ] Testes e2e nos fluxos críticos aprovados
- [ ] Quando solicitada, campanha manual cobre as telas e fluxos visíveis, possui IDs únicos, CSV enxuto e conteúdo dos cards validados
- [ ] Geração da campanha não foi registrada indevidamente como execução dos testes
- [ ] Documentação técnica completa e acessível
- [ ] `/docs/index.md` criado e índices de módulos sem links quebrados
- [ ] Runbooks de operação e incidente criados
- [ ] Deploy executado com rollback testado e funcional
- [ ] Post-deployment smoke tests aprovados

---

## F7 — Operate & Evolve

**Objetivo:** Operar o sistema com observabilidade completa, responder a incidentes, incorporar feedback e evoluir continuamente sem degradação arquitetural.

**Sub-skills ativadas (ciclo contínuo):**

```
observability-engine (permanente)
incident-management-engine (on-demand)
maintenance-engine (cadência regular)
    ↓
user-feedback-engine → continuous-evolution-engine
    ↓
performance-and-scale-engine (on KPI threshold breach)
infrastructure-cost-optimization-engine (cadência regular)
    ↓
architectural-reassessment-engine (on trigger: scale | complexity | tech debt)
    ↓
product-strategy-engine (ciclo de produto)
    ↻ retorna a F2 (evolução arquitetural) ou F4 (novas features)
```

**Entradas obrigatórias:**
- Snapshot O6, sistema em produção, SLOs definidos

**Saídas produzidas:**
- `operations.slos` — SLOs ativos e baseline estabelecido
- `operations.alerts` — alertas configurados
- Backlog de melhorias derivadas de feedback e métricas
- ADRs de evolução arquitetural quando aplicável
- Decisão de loop: retorno a F2 ou F4 com contexto atualizado

**Quality gate F7 (loop):**
- [ ] SLOs definidos para todos os endpoints/serviços críticos
- [ ] Alertas ativos e testados (alertas de teste disparados e recebidos)
- [ ] Feedback loop com usuários operacional
- [ ] Primeiro incident review realizado após primeira semana de produção
- [ ] Decisão de próxima evolução documentada com justificativa

---

## Diagrama de dependências entre fases

```
F1 ──────────────────────────────► F2
                                    │
                                    ▼
                                   F3 ◄─── (F4 pode iniciar em paralelo com F3 final)
                                    │
                            F3 + F4 ▼
                                   F5
                                    │
                                    ▼
                                   F6
                                    │
                                    ▼
                                   F7
                                    │
                           ┌────────┤
                           ▼        ▼
                          F2       F4
                      (arch      (features
                       evolution)  evolution)
```
