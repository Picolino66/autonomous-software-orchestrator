---
name: external-skill-resolver
description: Descobre, avalia e delega execução a skills externas ao orquestrador quando existe uma skill especializada mais adequada que o sub-skill interno para o contexto atual.
user-invocable: false
---

## 🧠 Descrição

Antes de ativar um sub-skill interno, o `ExternalSkillResolver` verifica se existe uma skill externa instalada — global (`~/.agents/skills/`, `~/.claude/skills/`) ou local ao projeto (`.agents/skills/`) — que seja mais especializada para o contexto atual de tecnologia, domínio ou fase.

Quando uma skill externa é identificada como mais adequada, o orquestrador a delega como agente principal, injetando o `OrchestratorContext` como entrada e mergeando o output de volta ao contexto canônico.

Isso permite que o orquestrador use skills de especialistas externos sem duplicar lógica interna — uma skill NestJS instalada no sistema é mais precisa para backend NestJS do que o sub-skill genérico `backend-development-engine`.

---

## 🗺️ Fontes de skills (prioridade decrescente)

```
1. .agents/skills/          ← skills locais do projeto (maior prioridade)
2. ~/.agents/skills/        ← skills globais instaladas
3. ~/.claude/skills/        ← skills Claude globais instaladas
4. npx skills find <query>  ← registro remoto (quando nenhuma local serve)
```

Regra de prioridade: **projeto > global > registro remoto**.  
Se duas fontes têm uma skill de mesmo domínio, a mais local vence.

---

## 🔍 Protocolo de descoberta

```
1. Ler todas as fontes de skills disponíveis (prioridade decrescente):
   a. Listar .agents/skills/ na raiz do projeto atual
   b. Listar ~/.agents/skills/
   c. Listar ~/.claude/skills/
   Para cada diretório encontrado: ler o campo `description:` do SKILL.md

2. Para cada skill descoberta, avaliar relevância contra o contexto atual:
   - Quais tecnologias estão em architecture.tech_stack?
   - Qual é a tarefa do sub-skill interno que está prestes a ser ativado?
   - O description: da skill externa cobre essa tecnologia e/ou essa tarefa?

3. Decidir:
   - Se a skill externa claramente especializa o que o sub-skill interno faria: delegar
   - Se cobre apenas parte: usar modo complementar
   - Se nenhuma skill externa é relevante: ativar sub-skill interno normalmente

4. Se a tarefa exige alta especialização e nenhuma skill instalada serve:
   → Acionar `npx skills find <termos-da-busca>` para buscar no registro remoto
   → Apresentar ao contexto as opções encontradas antes de prosseguir
```

A avaliação é feita lendo o `description:` de cada `SKILL.md` disponível e comparando com o que o orquestrador precisa executar naquele momento. Não há lista fixa de mapeamentos — o agente decide com base no que está instalado e no contexto real.

---

## 🔄 Protocolo de delegação

Quando uma skill externa é selecionada:

```
1. Injetar OrchestratorContext completo (ou seção relevante) como contexto de entrada da skill externa
2. Registrar no OrchestratorContext:
   {
     "external_skill_activated": {
       "skill_name": "nest-api-specialist",
       "source": "~/.agents/skills/nest-api-specialist",
       "reason": "tech_stack.backend = NestJS, score=0.92",
       "replaces_internal": "backend-development-engine",
       "phase": "F5",
       "timestamp": "ISO8601"
     }
   }
3. Executar a skill externa
4. Capturar output estruturado
5. Mergear output ao OrchestratorContext via ContextBus (mesmo protocolo de sub-skills internos)
6. Marcar sub-skill interno como DELEGATED (não SKIPPED — o interno serviu como referência de contrato)
```

### Modo complementar vs. modo substituto

| Modo | Quando usar | Comportamento |
|---|---|---|
| **Substituto** | skill externa cobre completamente a responsabilidade do sub-skill interno | Executa apenas a externa; interna marcada como DELEGATED |
| **Complementar** | skill externa aprofunda um aspecto específico, interna mantém coordenação | Ambas executam; externa produz output especializado, interna consolida no contexto |

---

## 🔎 Descoberta de skills do projeto

Além das fontes globais, o orquestrador deve verificar skills locais ao projeto em execução:

```
Verificar existência de:
  .agents/skills/          → skills específicas do projeto
  .claude/                 → configurações Claude com skills customizadas

Se encontrar SKILL.md com `user-invocable: false` e descrição relevante:
  → Tratar como sub-skill do projeto, com prioridade máxima
```

Isso permite que equipes criem skills customizadas para seu domínio específico que o orquestrador usará automaticamente.

---

## 🚀 Responsabilidades

* Escanear fontes de skills a cada início de fase e ao ativar sub-skills críticos
* Calcular score de relevância por skill disponível com base no contexto atual
* Decidir modo de uso: substituto ou complementar
* Injetar OrchestratorContext como entrada na skill externa
* Mergear outputs de volta ao contexto via ContextBus
* Registrar todas as delegações no audit log do contexto
* Acionar `skills-finder` ou `npx skills find` quando nenhuma skill instalada atende e a tarefa tem alta complexidade especializada

---

## 🔥 Regras obrigatórias

* Skills locais do projeto (`.agents/skills/`) têm prioridade absoluta sobre skills globais
* Nunca delegar para skill externa sem injetar `OrchestratorContext` atualizado como entrada
* O output de toda skill externa deve passar pelo `ConflictDetector` antes do merge — skills externas não têm acesso direto ao contexto
* Skills externas não substituem os quality gates — o gate da fase ainda valida o resultado, independente de quem gerou
* Se uma skill externa falha ou produz output incompatível, o sub-skill interno é ativado como fallback imediato
* Registrar sempre: qual skill foi usada, por que foi escolhida, o que substituiu
* Nunca delegar para skill externa em modo substituto sem ter mapeado que ela cobre **todas** as responsabilidades do sub-skill interno — se cobre parcialmente, usar modo complementar

---

## ⚠️ Anti-patterns (proibido)

* Descoberta de skills apenas no início do pipeline — deve ser feita antes de cada fase e a cada skill crítica
* Usar skill externa sem injetar contexto arquitetural — skills externas sem contexto produzem soluções desconexas da arquitetura
* Assumir que skill externa sempre produz output estruturado compatível com o OrchestratorContext sem validação
* Silenciar falhas de skills externas — toda falha deve ser registrada e o fallback ativado explicitamente
* Ignorar skills locais do projeto (`.agents/skills/`) em favor das globais
* Delegar para skill do registro remoto sem verificar se uma instalada localmente já serve

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `architecture.tech_stack` — tecnologias ativas (determinam qual skill externa é mais relevante)
* `current_phase` — fase atual (filtra skills por domínio de fase)
* `engineering.module_map` — módulos identificados (match com skills de domínio específico)

### Saídas para o OrchestratorContext
* `orchestration.external_skills_activated[]` — log de delegações: skill, fonte, razão, fase, modo
* Output mergeado da skill externa nas seções canônicas correspondentes

### Dependências
Ativado transversalmente: pode ser chamado antes de qualquer sub-skill a partir de F2.

### Paralelismo
Não executa em paralelo com o sub-skill que está avaliando — a avaliação precede a execução.

---

## 🎯 Objetivo final

Tornar o orquestrador aberto ao ecossistema de skills externas: em vez de tentar cobrir toda especialização internamente, ele descobre e delega para specialists externos quando existem — combinando a coordenação sistêmica do orquestrador com a profundidade técnica das skills especializadas.
