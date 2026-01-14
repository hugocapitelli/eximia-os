# KB-04: Customer Discovery & Interview Analysis

## 1. Fundamentos de Customer Discovery

### 1.1 O que é Customer Discovery?

**Customer Discovery** é o processo sistemático de entender profundamente os problemas, necessidades, comportamentos e contextos dos clientes antes de construir soluções.

### 1.2 Princípios Core

| Princípio | Descrição | Anti-Pattern |
|-----------|-----------|--------------|
| **Problem-First** | Entender o problema antes de propor solução | Mostrar protótipo na primeira entrevista |
| **Behavior > Opinion** | O que fazem > o que dizem que farão | "Você usaria X?" |
| **Past > Future** | Perguntar sobre passado, não futuro | "Você compraria?" |
| **Why 5x** | Aprofundar com "por quê?" repetido | Aceitar primeira resposta |
| **Non-Leading** | Perguntas abertas, não indutivas | "Não seria ótimo se...?" |

### 1.3 Quando Fazer Discovery

```
┌─────────────────────────────────────────────────────────────┐
│                 DISCOVERY MOMENTS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ FAZER DISCOVERY:                                        │
│     • Novo produto/feature significativo                    │
│     • Problema mal entendido                                │
│     • Baixa confidence em hipóteses                         │
│     • Métricas não movem como esperado                      │
│     • Entrando em novo mercado/segmento                     │
│                                                             │
│  ⚠️ DISCOVERY LIGHT:                                        │
│     • Iteração incremental em feature existente             │
│     • Dados quantitativos já existem                        │
│     • Problema bem documentado                              │
│                                                             │
│  ❌ SKIP DISCOVERY:                                         │
│     • Bug fix                                               │
│     • Compliance/legal requirement                          │
│     • Tech debt com impacto claro                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Customer Interview Framework

### 2.1 Estrutura de Entrevista (45-60 min)

```markdown
## Customer Interview Guide

### Prep (antes)
- [ ] Definir objetivo específico da entrevista
- [ ] Preparar 5-7 perguntas principais
- [ ] Revisar o que já sabemos sobre o entrevistado
- [ ] Preparar recording (com permissão)

### Opening (5 min)
- Agradecer pelo tempo
- Explicar propósito (entender, não vender)
- Pedir permissão para gravar
- "Não há respostas certas ou erradas"

### Context Questions (10 min)
1. "Me conte sobre seu papel e responsabilidades"
2. "Como é um dia típico para você?"
3. "Que ferramentas/processos você usa para [área]?"

### Problem Exploration (20 min)
4. "Me conte sobre a última vez que você [situação relacionada ao problema]"
5. "O que foi mais difícil/frustrante sobre isso?"
6. "Como você resolveu? O que aconteceu depois?"
7. "Com que frequência isso acontece?"
8. "Qual o impacto quando isso acontece?"

### Solution Validation (15 min) - se aplicável
9. "Me mostre como você faz [processo] hoje"
10. "O que funcionaria melhor para você?"
11. "Se existisse [solução], o que mudaria para você?"

### Wrap-up (5 min)
12. "Há algo mais sobre [tópico] que eu deveria saber?"
13. "Conhece outras pessoas que enfrentam esse problema?"
14. "Posso entrar em contato para follow-up?"

### Debrief (depois)
- [ ] Escrever notas enquanto fresco
- [ ] Identificar 3-5 insights principais
- [ ] Marcar quotes importantes
- [ ] Atualizar synthesis document
```

### 2.2 Tipos de Perguntas

| Tipo | Propósito | Exemplo |
|------|-----------|---------|
| **Contextual** | Entender ambiente | "Me conte sobre seu trabalho" |
| **Comportamental** | Entender ações passadas | "Me conte sobre a última vez que..." |
| **Exploratória** | Aprofundar | "Por que isso acontece?" |
| **Quantificadora** | Dimensionar | "Com que frequência?" "Quanto custa?" |
| **Emocional** | Captar sentimentos | "Como você se sentiu quando...?" |
| **Comparativa** | Entender alternativas | "O que você tentou antes?" |

### 2.3 Perguntas a Evitar

| ❌ Evitar | Problema | ✅ Alternativa |
|-----------|----------|----------------|
| "Você gostaria de...?" | Hipotético, sem valor | "Me conte sobre a última vez que..." |
| "Você usaria X?" | Pessoas dizem sim para agradar | "Como você resolve isso hoje?" |
| "Não seria ótimo se...?" | Leading question | "O que facilitaria sua vida?" |
| "Você concorda que...?" | Confirma viés | "O que você acha sobre...?" |
| "Todo mundo faz X, você também?" | Social pressure | "Como você faz X?" |

---

## 3. Jobs-to-be-Done (JTBD) Framework

### 3.1 Conceito Core

**Job-to-be-Done**: O progresso que um cliente está tentando fazer em uma circunstância específica.

> "People don't want a quarter-inch drill. They want a quarter-inch hole."
> — Theodore Levitt

### 3.2 Job Statement Template

```
When [situation/trigger],
I want to [motivation/job],
So that [expected outcome].
```

**Exemplo**:
```
When I'm commuting to work in the morning,
I want to catch up on news quickly,
So that I feel informed for meetings.
```

### 3.3 Componentes de um Job

| Componente | Descrição | Exemplo |
|------------|-----------|---------|
| **Functional** | O que precisa ser feito | "Transferir dinheiro" |
| **Emotional** | Como quer se sentir | "Seguro, no controle" |
| **Social** | Como quer ser percebido | "Responsável, moderno" |
| **Context** | Quando/onde acontece | "Domingo à noite, em casa" |

### 3.4 Job Map

```
┌─────────────────────────────────────────────────────────────┐
│                      JOB MAP                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. DEFINE     → O que preciso alcançar?                    │
│       ↓                                                     │
│  2. LOCATE     → Onde encontro inputs necessários?          │
│       ↓                                                     │
│  3. PREPARE    → O que preciso preparar?                    │
│       ↓                                                     │
│  4. CONFIRM    → Estou pronto para começar?                 │
│       ↓                                                     │
│  5. EXECUTE    → Como executo o core job?                   │
│       ↓                                                     │
│  6. MONITOR    → Como sei que está funcionando?             │
│       ↓                                                     │
│  7. MODIFY     → Preciso ajustar algo?                      │
│       ↓                                                     │
│  8. CONCLUDE   → Como finalizo?                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Opportunity Solution Trees (OST)

### 4.1 Conceito

**Opportunity Solution Tree** (Teresa Torres): Estrutura visual que conecta outcomes desejados às oportunidades descobertas e soluções potenciais.

### 4.2 Estrutura

```
                    ┌─────────────────────┐
                    │   DESIRED OUTCOME   │
                    │  (Business/Product) │
                    └──────────┬──────────┘
                               │
           ┌───────────────────┼───────────────────┐
           ▼                   ▼                   ▼
    ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
    │ Opportunity │     │ Opportunity │     │ Opportunity │
    │      1      │     │      2      │     │      3      │
    └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
           │                   │                   │
      ┌────┴────┐         ┌────┴────┐         ┌────┴────┐
      ▼         ▼         ▼         ▼         ▼         ▼
   ┌─────┐  ┌─────┐    ┌─────┐  ┌─────┐    ┌─────┐  ┌─────┐
   │Sol A│  │Sol B│    │Sol C│  │Sol D│    │Sol E│  │Sol F│
   └─────┘  └─────┘    └─────┘  └─────┘    └─────┘  └─────┘
```

### 4.3 Regras de Construção

| Elemento | Regra | Exemplo |
|----------|-------|---------|
| **Outcome** | Mensurável, business-aligned | "Aumentar NPS de 30 para 50" |
| **Opportunity** | Descoberto em research, não inventado | "Usuários não encontram arquivos antigos" |
| **Solution** | Ideia para addressing opportunity | "Busca full-text", "Pastas inteligentes" |

### 4.4 Best Practices

- ✅ Multiple opportunities per outcome
- ✅ Multiple solutions per opportunity
- ✅ Opportunities from research, not brainstorm
- ✅ Test solutions, not just ship
- ❌ Jumping straight to solutions
- ❌ Only one solution per opportunity

---

## 5. Interview Analysis Process

### 5.1 Análise Individual

Para cada entrevista, extrair:

```markdown
## Interview Analysis: [Participant Name/ID]

### Metadata
- Date: [Date]
- Duration: [Time]
- Role: [Role]
- Company: [Company/Size]

### Key Quotes
> "[Verbatim quote]" — on [topic]
> "[Another quote]" — on [topic]

### Pain Points Identified
| Pain Point | Severity | Frequency | Evidence |
|------------|----------|-----------|----------|
| [Pain 1] | High/Med/Low | Daily/Weekly/Monthly | [Quote/observation] |

### Jobs-to-be-Done
| Job | Context | Current Solution |
|-----|---------|------------------|
| [Job statement] | [When/where] | [How they do it now] |

### Feature Requests
| Request | Priority (their view) | Underlying Need |
|---------|----------------------|-----------------|
| [Request] | Must/Nice-to-have | [Real need behind it] |

### Surprises / Insights
- [Something unexpected learned]
- [Assumption challenged]

### Follow-up Questions
- [Question for next interview]
```

### 5.2 Síntese Cross-Interview

```markdown
## Interview Synthesis: [Research Project]

### Overview
- Total Interviews: [N]
- Date Range: [Start] - [End]
- Segments Covered: [List]

### Pain Point Frequency
| Pain Point | Mentions | % of Interviews | Avg Severity |
|------------|----------|-----------------|--------------|
| Pain A | 8/10 | 80% | High |
| Pain B | 6/10 | 60% | Medium |
| Pain C | 3/10 | 30% | High |

### Emerging Themes
1. **Theme 1**: [Description]
   - Supporting evidence: [N] interviews
   - Key quotes: [1-2 quotes]

2. **Theme 2**: [Description]
   - Supporting evidence: [N] interviews
   - Key quotes: [1-2 quotes]

### Jobs-to-be-Done (Consolidated)
| Job | Segment | Frequency | Current Satisfaction |
|-----|---------|-----------|----------------------|
| [Job 1] | [Who] | [How often] | Low/Med/High |

### Opportunity Areas
| Opportunity | Evidence Strength | Potential Impact |
|-------------|-------------------|------------------|
| [Opp 1] | Strong (8/10) | High |
| [Opp 2] | Medium (5/10) | Medium |

### Recommendations
1. **High Confidence**: [Action] based on [evidence]
2. **Needs Validation**: [Hypothesis] - suggest [validation method]
3. **Deprioritize**: [Area] due to [reason]
```

---

## 6. Sentiment Analysis

### 6.1 Framework de Sentimento

| Score | Label | Indicators |
|-------|-------|------------|
| -2 | Very Negative | Frustração extrema, palavrões, desistência |
| -1 | Negative | Reclamações, insatisfação, workarounds |
| 0 | Neutral | Factual, sem emoção clara |
| +1 | Positive | Satisfação, elogios leves |
| +2 | Very Positive | Entusiasmo, advocacy, delight |

### 6.2 Indicadores Linguísticos

**Negativo**:
- "Odeio quando...", "É impossível...", "Perco tempo com..."
- Suspiros, pausas longas
- Exemplos de falhas repetidas

**Positivo**:
- "Adoro...", "É muito fácil...", "Não vivo sem..."
- Tom animado
- Recomendação espontânea

### 6.3 Template de Sentiment por Tópico

```markdown
| Tópico | Sentiment Score | Evidence |
|--------|-----------------|----------|
| Onboarding | -1 (Negative) | "Demorei 3 dias para entender" |
| Core Feature | +1 (Positive) | "Uma vez que entendi, funciona bem" |
| Suporte | +2 (Very Positive) | "Melhor suporte que já tive" |
| Preço | 0 (Neutral) | "É caro, mas justo pelo que entrega" |
```

---

## 7. Competitor Analysis from Interviews

### 7.1 O que Capturar

- Competitors mencionados espontaneamente
- O que usam e por quê
- O que gostam/não gostam
- Por que não migraram (se usando competitor)
- Por que migraram (se ex-usuário de competitor)

### 7.2 Template

```markdown
## Competitive Landscape (from Interviews)

### Mentioned Competitors
| Competitor | Mentions | Context |
|------------|----------|---------|
| Comp A | 6/10 | "Usamos antes de vocês" |
| Comp B | 3/10 | "Avaliamos mas não escolhemos" |

### Switching Drivers
| From | To | Reason |
|------|-----|--------|
| Comp A | Our Product | "Preço e suporte" |
| Our Product | Comp B | "Features específicos" |

### Competitive Strengths/Weaknesses (Perceived)
| Competitor | Strength | Weakness |
|------------|----------|----------|
| Comp A | "Mais features" | "Muito complexo" |
| Comp B | "Mais barato" | "Suporte ruim" |
```

---

## 8. Validação de Hypotheses

### 8.1 Hypothesis Template

```
We believe that [building/changing X]
For [target users]
Will [achieve outcome Y]
We'll know we're right when [measurable indicator]
```

### 8.2 Validation Methods

| Method | When Use | Evidence Strength |
|--------|----------|-------------------|
| **Interviews** | Early discovery | Medium (qualitative) |
| **Surveys** | Quantify findings | Medium (self-reported) |
| **Prototype Testing** | Solution validation | High (behavior) |
| **Fake Door Test** | Demand validation | High (behavior) |
| **A/B Test** | In-product validation | Very High (actual) |
| **Beta/Pilot** | Full validation | Very High (actual) |

### 8.3 Evidence Scoring

```
┌─────────────────────────────────────────────────────────────┐
│                 EVIDENCE HIERARCHY                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🥇 STRONGEST: Actual behavior in production                │
│      └─> A/B test results, conversion data                  │
│                                                             │
│  🥈 STRONG: Behavior in realistic context                   │
│      └─> Prototype testing, fake door tests                 │
│                                                             │
│  🥉 MEDIUM: Stated behavior/preference                      │
│      └─> Surveys, interview statements about future         │
│                                                             │
│  🎖️ WEAK: Opinions                                          │
│      └─> "Would you use X?" responses                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Templates de Output

### 9.1 Interview Insight Report

```markdown
# Customer Discovery Report: [Project Name]

## Executive Summary
[2-3 parágrafos resumindo principais findings]

## Methodology
- Interviews: [N] ([breakdown by segment])
- Period: [dates]
- Approach: [structured/semi-structured]

## Key Findings

### Finding 1: [Título]
**Summary**: [1-2 sentences]
**Evidence**: [N] of [M] interviews mentioned this
**Key Quotes**:
> "[Quote 1]"
> "[Quote 2]"
**Implication**: [What this means for product]

[Repeat for each finding]

## Opportunity Areas
| Priority | Opportunity | Evidence | Recommended Action |
|----------|-------------|----------|-------------------|
| P0 | [Opp] | Strong | [Action] |
| P1 | [Opp] | Medium | [Action] |

## Recommendations
1. [Recommendation with rationale]
2. [Recommendation with rationale]

## Next Steps
- [ ] [Immediate action]
- [ ] [Follow-up research needed]

## Appendix
- Interview guide used
- Participant demographics
- Raw quotes by theme
```

---

## Referências

- Torres, T. (2021). *Continuous Discovery Habits*
- Fitzpatrick, R. (2013). *The Mom Test*
- Christensen, C. (2016). *Competing Against Luck* (JTBD)
- Blank, S. (2013). *The Four Steps to the Epiphany*
