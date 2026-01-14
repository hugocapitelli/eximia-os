# KB-01: PRD Templates & Best Practices

## 1. Fundamentos

### O que é um PRD?
**Product Requirements Document (PRD)** é um documento que descreve o que um produto ou feature deve fazer, para quem, e como será medido o sucesso — sem prescrever como será implementado.

### Princípios Core

1. **Problem-First**: Comece pelo problema, não pela solução
2. **Clarity over Completeness**: Melhor ser claro em menos pontos do que vago em muitos
3. **Testable Criteria**: Se não pode ser testado, não está definido
4. **Living Document**: PRD evolui, não é escrito uma vez e esquecido
5. **Communication Tool**: O processo de criar é tão valioso quanto o documento

---

## 2. PRD Templates

### 2.1 Standard PRD Template (Complex Features)

**Uso**: Features que levam 6-8+ semanas, múltiplas user stories, impacto significativo.

```markdown
# PRD: [Nome do Feature]

**Versão**: 1.0
**Status**: Draft | In Review | Approved | In Development | Shipped
**Autor**: [Nome]
**Stakeholders**: [Lista]
**Última Atualização**: [Data]

---

## 1. Executive Summary
[2-3 parágrafos resumindo: problema, solução proposta, impacto esperado]

## 2. Problem Statement

### 2.1 Background
[Contexto: por que esse problema existe agora?]

### 2.2 Problem Definition
[Descrição clara do problema em 2-3 frases]

### 2.3 User Pain Points
| Pain Point | Severidade | Frequência | Evidence |
|------------|------------|------------|----------|
| [Dor 1] | Alta/Média/Baixa | Diária/Semanal/Mensal | [Fonte] |

### 2.4 Current Workarounds
[Como usuários resolvem hoje sem esse feature?]

## 3. Goals & Success Metrics

### 3.1 Primary Goal
[Um objetivo principal, mensurável]

### 3.2 Secondary Goals
- [Goal 2]
- [Goal 3]

### 3.3 Success Metrics
| Métrica | Baseline | Target | Prazo | Fonte de Dados |
|---------|----------|--------|-------|----------------|
| [KPI 1] | [Atual] | [Meta] | [Data] | [Analytics/Survey] |

### 3.4 Non-Goals (Out of Scope)
- ❌ [O que NÃO faremos - e por quê]
- ❌ [Outro item fora de escopo]

## 4. User Stories & Requirements

### 4.1 Personas Impactadas
| Persona | Descrição | % da Base | Prioridade |
|---------|-----------|-----------|------------|
| [Persona 1] | [Breve descrição] | [%] | P0/P1/P2 |

### 4.2 User Stories

#### US-001: [Título]
**Como** [persona],
**Quero** [ação/capability],
**Para que** [benefício/outcome].

**Acceptance Criteria:**
- [ ] AC-001.1: [Critério testável]
- [ ] AC-001.2: [Critério testável]
- [ ] AC-001.3: [Critério testável]

**Priority**: P0 (Must Have) | P1 (Should Have) | P2 (Could Have)

[Repetir para cada User Story]

## 5. Solution Overview

### 5.1 Proposed Solution
[Descrição high-level da solução - O QUE, não COMO]

### 5.2 User Flow
[Diagrama ou descrição do fluxo principal]

### 5.3 Wireframes
[Link ou embed de wireframes]

### 5.4 Edge Cases
| Caso | Comportamento Esperado | Priority |
|------|------------------------|----------|
| [Edge case 1] | [Como sistema deve reagir] | P0/P1/P2 |

## 6. Technical Considerations

### 6.1 Dependencies
- [Dependência de outro time/sistema]
- [API externa necessária]

### 6.2 Technical Constraints
- [Limitação técnica conhecida]
- [Performance requirements]

### 6.3 Security & Privacy
- [Considerações de segurança]
- [Dados sensíveis envolvidos]

## 7. Launch Plan

### 7.1 Rollout Strategy
- [ ] Phase 1: [% usuários, critério]
- [ ] Phase 2: [% usuários, critério]
- [ ] Phase 3: GA

### 7.2 Feature Flags
| Flag | Descrição | Default |
|------|-----------|---------|
| [flag_name] | [O que controla] | ON/OFF |

### 7.3 Monitoring & Alerts
- [Métricas a monitorar]
- [Thresholds para alertas]

## 8. Risks & Mitigations

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [Risco 1] | Alta/Média/Baixa | Alto/Médio/Baixo | [Plano] |

## 9. Open Questions
- [ ] [Questão ainda não resolvida]
- [ ] [Decisão pendente de input]

## 10. Appendix
- [Links para pesquisas]
- [Documentos relacionados]
- [Detalhes técnicos adicionais]

---

## Changelog
| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 1.0 | [Data] | [Nome] | Criação inicial |
```

---

### 2.2 One-Page PRD Template (Medium Features)

**Uso**: Features de 2-4 semanas, escopo bem definido, menos stakeholders.

```markdown
# One-Page PRD: [Nome do Feature]

**Owner**: [Nome] | **Status**: [Status] | **Target**: [Sprint/Quarter]

---

## Problem
[2-3 frases descrevendo o problema]

## Solution
[2-3 frases descrevendo a solução proposta]

## User Stories
1. **[Persona]** wants to [ação] so that [benefício]
   - AC: [Critério 1], [Critério 2]

2. **[Persona]** wants to [ação] so that [benefício]
   - AC: [Critério 1], [Critério 2]

## Success Metrics
| Métrica | Target |
|---------|--------|
| [KPI 1] | [Meta] |
| [KPI 2] | [Meta] |

## Out of Scope
- [Item 1]
- [Item 2]

## Dependencies
- [Dependência 1]
- [Dependência 2]

## Open Questions
- [Questão 1]
```

---

### 2.3 Feature Brief Template (Exploration)

**Uso**: Fase de discovery, antes de commitar com desenvolvimento.

```markdown
# Feature Brief: [Nome]

**Hypothesis**: We believe that [building X] for [users Y] will [achieve outcome Z].
**Validation**: We'll know we're right when [metric changes by amount].

---

## Problem Space
[Qual é o problema? Para quem? Quão grande?]

## Opportunity Assessment
1. What problem are we solving?
2. Who are we solving it for?
3. How big is the opportunity?
4. What alternatives exist today?
5. Why now?

## Proposed Direction
[High-level approach - não solução detalhada]

## Key Risks
| Risk Type | Description | Mitigation Strategy |
|-----------|-------------|---------------------|
| Value | [Users may not want this] | [How to validate] |
| Usability | [May be hard to use] | [How to test] |
| Feasibility | [May be hard to build] | [Technical spike] |
| Business | [May not make money] | [Business validation] |

## Next Steps
- [ ] [Próxima ação de validação]
- [ ] [Discovery activity]

## Decision Needed
[Pedido específico: aprovar discovery? Aprovar dev? Mais research?]
```

---

### 2.4 Agile Epic Template

**Uso**: Contexto de sprints, integração com Jira/Linear/Asana.

```markdown
# Epic: [Nome do Epic]

**Epic ID**: [PROJ-123]
**Owner**: [Nome]
**Target Release**: [Version/Quarter]
**Status**: Backlog | Refinement | Ready | In Progress | Done

---

## Epic Summary
[Uma frase descrevendo o epic]

## Business Value
[Por que isso importa para o negócio?]

## User Value
[Por que isso importa para o usuário?]

## Stories in Epic

| Story ID | Title | Points | Status |
|----------|-------|--------|--------|
| PROJ-124 | [Story 1] | 5 | To Do |
| PROJ-125 | [Story 2] | 3 | To Do |
| PROJ-126 | [Story 3] | 8 | To Do |

## Acceptance Criteria (Epic Level)
- [ ] [Critério que define epic "done"]
- [ ] [Outro critério]

## Definition of Done
- [ ] All stories completed
- [ ] QA sign-off
- [ ] Documentation updated
- [ ] Metrics tracking live

## Dependencies
- **Blocks**: [O que esse epic bloqueia]
- **Blocked by**: [O que bloqueia esse epic]
```

---

## 3. Componentes Core de um PRD

### 3.1 Problem Statement

**Fórmula**:
```
[Users/Personas] experience [problem] when [context/trigger],
which causes [negative outcome/impact].
Currently, they [workaround], but this is [inadequate because].
```

**Exemplo**:
> Sales representatives experience difficulty tracking customer interactions when managing 50+ accounts, which causes missed follow-ups and lost deals. Currently, they use spreadsheets and calendar reminders, but this is inadequate because information is siloed and not searchable.

### 3.2 User Stories

**Formato INVEST**:
- **I**ndependent: Pode ser desenvolvida isoladamente
- **N**egotiable: Detalhes podem ser discutidos
- **V**aluable: Entrega valor ao usuário
- **E**stimable: Time pode estimar esforço
- **S**mall: Cabe em um sprint
- **T**estable: Tem critérios verificáveis

**Template**:
```
As a [persona],
I want [capability/action],
So that [benefit/outcome].
```

### 3.3 Acceptance Criteria

**Formato Given-When-Then (Gherkin)**:
```
Given [precondition/context],
When [action/trigger],
Then [expected outcome].
```

**Exemplo**:
```
Given I am a logged-in user on the dashboard,
When I click the "Export" button,
Then a CSV file with my data downloads within 5 seconds.
```

**Características de bons ACs**:
- ✅ Testáveis (pode verificar pass/fail)
- ✅ Específicos (sem ambiguidade)
- ✅ Completos (cobrem happy path e edge cases)
- ❌ Não são instruções de implementação

### 3.4 Success Metrics

**Framework de Métricas**:

| Tipo | Foco | Exemplo |
|------|------|---------|
| **Input** | O que colocamos | Dev hours, features shipped |
| **Output** | O que produzimos | Page views, sign-ups |
| **Outcome** | O que alcançamos | Revenue, retention |
| **Impact** | Mudança no mundo | Customer success, market share |

**Template de Métrica**:
```
| Métrica | Baseline | Target | Stretch | Prazo | Owner | Fonte |
|---------|----------|--------|---------|-------|-------|-------|
| [Nome]  | [Atual]  | [Meta] | [Ambicioso] | [Data] | [Quem] | [Tool] |
```

---

## 4. Best Practices

### 4.1 Antes de Escrever

- [ ] Validei que o problema existe (evidence)?
- [ ] Conheço quem é o usuário (persona)?
- [ ] Entendo as alternativas atuais (workarounds)?
- [ ] Sei como medir sucesso (metrics)?
- [ ] Tenho alignment dos stakeholders (buy-in)?

### 4.2 Durante a Escrita

- [ ] Problema está claro em <3 frases?
- [ ] Cada user story tem acceptance criteria?
- [ ] Out of scope está explícito?
- [ ] Métricas são quantificáveis?
- [ ] Riscos estão identificados?

### 4.3 Depois de Escrever

- [ ] Revisei com Engineering (feasibility)?
- [ ] Revisei com Design (usability)?
- [ ] Revisei com stakeholders (alignment)?
- [ ] Documentei open questions?
- [ ] Versionei o documento?

---

## 5. Anti-Patterns

| Anti-Pattern | Sintoma | Solução |
|--------------|---------|---------|
| **Solution-First** | PRD descreve "como" antes de "o quê" | Reescrever começando pelo problema |
| **Scope Creep** | PRD cresce infinitamente | Ser brutal com out-of-scope |
| **Vanity Metrics** | KPIs que não indicam valor | Focar em outcomes, não outputs |
| **Kitchen Sink** | Tudo é P0 | Forçar priorização real |
| **Vague Criteria** | "Deve ser rápido", "Deve ser bonito" | Quantificar: "<200ms", "NPS >8" |
| **No Owner** | Ninguém responsável | Definir DRI (Directly Responsible Individual) |

---

## 6. Checklist Final de PRD

```
PRD QUALITY CHECKLIST

□ Problem Statement
  □ Problema claro em <3 frases
  □ Evidence/data de suporte
  □ Impacto quantificado

□ Goals
  □ Primary goal definido
  □ Non-goals explícitos
  □ Success metrics SMART

□ User Stories
  □ Formato correto (As a... I want... So that...)
  □ Acceptance criteria testáveis
  □ Priorização clara (P0/P1/P2)

□ Solution
  □ Não prescreve implementação
  □ Wireframes/mocks linkados
  □ Edge cases documentados

□ Execution
  □ Dependencies mapeadas
  □ Risks identificados
  □ Launch plan definido

□ Governance
  □ Owner definido
  □ Stakeholders listados
  □ Review cycle estabelecido
```

---

## Referências

- Cagan, M. (2017). *Inspired: How to Create Tech Products Customers Love*
- Norton, K. (2005). *How to Write a Good PRD*
- Perri, M. (2018). *Escaping the Build Trap*
- Shape Up by Basecamp (2019)
