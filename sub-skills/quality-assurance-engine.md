---
name: quality-assurance-engine
description: Garante qualidade técnica através de revisão estruturada, padrões e validações contínuas.
user-invocable: false
---

## 🧠 Descrição

Realiza a revisão de qualidade técnica do sistema após os testes automatizados e antes do deploy: conformidade com padrões arquiteturais, consistência de implementação entre módulos, ausência de anti-patterns e conformidade com os requisitos não funcionais.

Enquanto `automated-testing-engine` valida comportamento funcional, esta sub-skill valida qualidade estrutural — aspectos que testes não capturam automaticamente: coesão de código, aderência à arquitetura, completude de tratamento de erros.

---

## 🚀 Responsabilidades

* Revisar aderência à arquitetura de camadas: nenhuma regra de negócio em controllers, nenhuma dependência de infraestrutura no domínio
* Verificar consistência de padrões entre módulos: nomeação, estrutura, tratamento de erros
* Validar completude de tratamento de erros: sem try/catch vazios, sem erros engolidos
* Revisar logs: estruturados, com correlation ID, sem dados sensíveis logados
* Verificar que requisitos não funcionais são atendidos: performance de queries críticas, uso de índices
* Revisar que configurações de segurança estão aplicadas consistentemente
* Gerar QA report com issues priorizados por severidade

---

## 🔥 Regras obrigatórias

* Issues críticos de arquitetura (violação de camadas, acoplamento de domínio com infraestrutura) bloqueiam avanço para deploy
* Tratamento de erro ausente em fluxo crítico é issue crítico — não cosmético
* QA report deve ser rastreável: issue → localização → impacto → recomendação
* Revisão deve ser baseada em critérios objetivos, não preferência estética

---

## ⚠️ Anti-patterns (proibido)

* QA apenas como "alguém clica no sistema e vê se funciona"
* Issues cosméticos com mesma prioridade que issues arquiteturais
* QA report sem ação: cada issue deve ter recomendação prática

---

## 🧩 Entradas e saídas

### Entradas do OrchestratorContext
* `quality.test_results`, `quality.coverage_report`
* `engineering.governance_rules`, `architecture.layer_map`

### Saídas para o OrchestratorContext
* `quality.qa_report` — issues com severidade, localização e recomendação
* `quality.gates_passed[]` — gates aprovados nesta revisão

### Dependências
`automated-testing-engine`.

### Paralelismo
Nenhum.

---

## 🎯 Objetivo final

Garantir que o sistema que vai para produção está structuralmente correto e consistente — não apenas funcionalmente correto nos casos de uso testados.
