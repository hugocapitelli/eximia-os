---
title: "KB-03: RICE Prioritization & Feature Prioritization Frameworks"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-03-rice-prioritization"
  - "kb-03: rice prioritization & f"
  - "1. rice framework"
  - "1.1 visão geral"
  - "1.2 fórmula"
  - "1.3 componentes detalhados"
  - "1.4 calculando rice score"
  - "1.5 interpretando rice scores"
  - "2. value vs effort matrix"
  - "2.1 overview"
tags:
  - "galaxy-specialist"
  - "knowledge-base"
---

# KB-03: RICE Prioritization & Feature Prioritization Frameworks

## 1. RICE Framework

### 1.1 Visão Geral

**RICE** é um framework de priorização quantitativo desenvolvido pela Intercom que permite comparar features de forma objetiva usando quatro fatores: Reach, Impact, Confidence e Effort.

### 1.2 Fórmula

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

### 1.3 Componentes Detalhados

#### Reach (Alcance)
**Definição**: Número de pessoas/eventos impactados em um período definido.

| Método de Medição | Exemplo |
|-------------------|---------|
| Usuários por período | 5.000 usuários/quarter |
| Transações por período | 10.000 conversões/mês |
| Sessions | 50.000 sessions/week |

**Best Practices**:
- ✅ Use período consistente (geralmente quarter)
- ✅ Baseie em dados reais quando possível
- ✅ Seja conservador em estimativas
- ❌ Não use "todos os usuários" sem dados

**Como Estimar**:
```
Reach = (Users who encounter context) × (% who would use feature)

Exemplo:
- 10.000 usuários ativos mensais
- Feature aparece em fluxo de checkout
- 60% dos usuários chegam ao checkout
- Estimativa: 6.000 users/month = 18.000/quarter
```

---

#### Impact (Impacto)
**Definição**: Quanto o feature contribui para o objetivo quando usado.

| Score | Nível | Descrição | Multiplicador |
|-------|-------|-----------|---------------|
| 3 | Massive | Muda fundamentalmente o produto/experiência | 3x |
| 2 | High | Melhoria significativa, claramente percebida | 2x |
| 1 | Medium | Melhoria moderada, benefício claro | 1x |
| 0.5 | Low | Melhoria marginal, nice-to-have | 0.5x |
| 0.25 | Minimal | Impacto quase imperceptível | 0.25x |

**Calibração de Impact**:

| Exemplo | Impact | Justificativa |
|---------|--------|---------------|
| Adicionar dark mode | Medium (1) | Melhora experiência, mas não core value |
| Reduzir tempo de load de 5s para 1s | High (2) | Impacto significativo em conversão |
| Adicionar export para Excel | Low (0.5) | Útil para subset de usuários |
| Redesign completo do onboarding | Massive (3) | Afeta toda aquisição |

**Best Practices**:
- ✅ Calibre com exemplos passados
- ✅ Pergunte: "Se funcionasse perfeitamente, quanto muda?"
- ❌ Não inflacione - a maioria é Medium (1)

---

#### Confidence (Confiança)
**Definição**: Quão certo você está das estimativas de Reach e Impact.

| Score | Nível | Evidência | Multiplicador |
|-------|-------|-----------|---------------|
| 100% | High | Dados quantitativos, pesquisa robusta, precedente | 1.0 |
| 80% | Medium | Dados qualitativos, pesquisa inicial, intuição fundamentada | 0.8 |
| 50% | Low | Palpite, sem dados, novo território | 0.5 |

**Evidências por Nível**:

**High Confidence (100%)**:
- Analytics mostra comportamento
- A/B test anterior validou hipótese
- Feedback consistente de 20+ usuários
- Competitor já implementou com sucesso

**Medium Confidence (80%)**:
- 5-10 entrevistas sugerem demanda
- Feature request recorrente em suporte
- Dados qualitativos suportam
- Intuição de PM experiente com fundamento

**Low Confidence (50%)**:
- Ideia nova sem validação
- Poucos dados sobre comportamento
- Território desconhecido
- Hipótese não testada

**Best Practices**:
- ✅ Seja honesto - confidence baixo não é ruim, é informação
- ✅ Use para priorizar discovery antes de development
- ❌ Não inflacione confidence para "vender" feature

---

#### Effort (Esforço)
**Definição**: Trabalho total necessário, medido em person-months.

| T-Shirt | Person-Months | Descrição |
|---------|---------------|-----------|
| XS | 0.5 | Dias de trabalho, uma pessoa |
| S | 1 | Uma pessoa, uma semana |
| M | 2 | Uma pessoa, duas semanas ou duas pessoas, uma semana |
| L | 4 | Um mês de trabalho, time pequeno |
| XL | 8+ | Mês+ de trabalho, time médio |

**O que incluir no Effort**:
- ✅ Desenvolvimento
- ✅ Design
- ✅ QA
- ✅ PM (planning, coordination)
- ✅ DevOps / Infrastructure
- ❌ Não incluir: manutenção futura, marketing

**Como Estimar**:
```
Effort = (Dev hours + Design hours + QA hours + PM hours) / 160

Exemplo:
- Dev: 80h
- Design: 40h
- QA: 20h
- PM: 20h
Total: 160h = 1 person-month (M)
```

---

### 1.4 Calculando RICE Score

**Fórmula Completa**:
```
RICE = (Reach × Impact × Confidence) / Effort

Onde:
- Reach = número absoluto
- Impact = 0.25 | 0.5 | 1 | 2 | 3
- Confidence = 0.5 | 0.8 | 1.0
- Effort = 0.5 | 1 | 2 | 4 | 8+
```

**Exemplo Prático**:

| Feature | Reach | Impact | Conf | Effort | RICE |
|---------|-------|--------|------|--------|------|
| Dark Mode | 2000 | 1 (Med) | 0.8 | 2 (M) | 800 |
| Faster Load | 5000 | 2 (High) | 1.0 | 4 (L) | 2500 |
| Excel Export | 500 | 0.5 (Low) | 1.0 | 1 (S) | 250 |
| New Onboarding | 3000 | 3 (Massive) | 0.5 | 8 (XL) | 562 |

**Ranking**: Faster Load (2500) > Dark Mode (800) > New Onboarding (562) > Excel Export (250)

---

### 1.5 Interpretando RICE Scores

```
┌─────────────────────────────────────────────────────────────┐
│               RICE SCORE INTERPRETATION                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Score > 1000    │ 🟢 QUICK WIN                            │
│                   │ Alta prioridade, executar logo          │
│                   │                                         │
│   Score 500-1000  │ 🟡 BIG BET                              │
│                   │ Avaliar estrategicamente, alto potencial │
│                   │                                         │
│   Score 100-500   │ ⚪ FILL-IN                              │
│                   │ Se houver capacidade, considerar        │
│                   │                                         │
│   Score < 100     │ 🔴 TIME SINK                            │
│                   │ Evitar, ROI baixo                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Value vs Effort Matrix

### 2.1 Overview

Alternativa mais simples ao RICE, útil para decisões rápidas ou quando dados são limitados.

### 2.2 Matriz 2x2

```
                      LOW EFFORT              HIGH EFFORT
                 ┌────────────────────┬────────────────────┐
                 │                    │                    │
    HIGH VALUE   │    QUICK WINS      │     BIG BETS       │
                 │    [DO FIRST]      │   [PLAN CAREFULLY] │
                 │                    │                    │
                 ├────────────────────┼────────────────────┤
                 │                    │                    │
    LOW VALUE    │    FILL-INS        │    TIME SINKS      │
                 │    [IF CAPACITY]   │     [AVOID]        │
                 │                    │                    │
                 └────────────────────┴────────────────────┘
```

### 2.3 Como Categorizar

| Quadrante | Critério | Ação |
|-----------|----------|------|
| **Quick Wins** | Alto valor, baixo esforço | Priorizar imediatamente |
| **Big Bets** | Alto valor, alto esforço | Avaliar ROI, planejar recursos |
| **Fill-ins** | Baixo valor, baixo esforço | Fazer quando houver tempo |
| **Time Sinks** | Baixo valor, alto esforço | Evitar ou descope |

### 2.4 Aplicação Prática

**Step 1**: Liste todos os features/iniciativas

**Step 2**: Para cada item, classifique:
- Value: High / Medium / Low
- Effort: High / Medium / Low

**Step 3**: Plot na matriz

**Step 4**: Priorize por quadrante:
1. Quick Wins primeiro
2. Big Bets com planning
3. Fill-ins se sobrar capacidade
4. Time Sinks descartados

---

## 3. MoSCoW Method

### 3.1 Overview

Framework de priorização por criticidade, ideal para definir escopo de releases e MVPs.

### 3.2 Categorias

| Categoria | Significado | % Típico do Escopo |
|-----------|-------------|-------------------|
| **M**ust Have | Sem isso, não há release | 60% |
| **S**hould Have | Importante, mas não bloqueador | 20% |
| **C**ould Have | Nice-to-have, melhoria | 20% |
| **W**on't Have | Não nesta release | N/A |

### 3.3 Definições Detalhadas

#### Must Have (Mo)
- **Critério**: Sem isso, o produto não funciona ou não entrega valor core
- **Teste**: "Se removermos, ainda é útil?" → Se não, é Must
- **Exemplos**:
  - Login/autenticação
  - Função core (ex: criar documento em um editor)
  - Compliance legal obrigatório

#### Should Have (S)
- **Critério**: Importante para completude, mas workaround existe
- **Teste**: "Usuário ficaria frustrado, mas conseguiria?" → Should
- **Exemplos**:
  - Notificações por email
  - Filtros avançados
  - Export de dados

#### Could Have (Co)
- **Critério**: Melhoria de experiência, não afeta função core
- **Teste**: "Só notar se tivermos?" → Could
- **Exemplos**:
  - Dark mode
  - Customização de interface
  - Integrações secundárias

#### Won't Have (W)
- **Critério**: Explicitamente fora de escopo desta release
- **Propósito**: Gerenciar expectativas, evitar scope creep
- **Exemplos**:
  - Features para V2
  - Edge cases raros
  - Nice-to-haves adiados

### 3.4 Template de MoSCoW

```markdown
## Release X.X MoSCoW

### Must Have (Release Blocker)
- [ ] Feature A - [Justificativa]
- [ ] Feature B - [Justificativa]

### Should Have (High Priority)
- [ ] Feature C - [Justificativa]
- [ ] Feature D - [Justificativa]

### Could Have (If Time Permits)
- [ ] Feature E - [Justificativa]
- [ ] Feature F - [Justificativa]

### Won't Have (Out of Scope)
- Feature G - [Por que adiado]
- Feature H - [Por que adiado]
```

---

## 4. Kano Model

### 4.1 Overview

Framework para entender satisfação do cliente baseado em tipos de features.

### 4.2 Categorias de Features

```
SATISFAÇÃO
    ↑
    │           ○ Delighters (Excitement)
    │          /
    │         /    ○ Performance (Linear)
    │        /    /
    │       /    /
────┼──────/────/─────────────────→ IMPLEMENTAÇÃO
    │     /    /
    │    /    /
    │   ○────/── Must-Be (Basic)
    │
    ↓
```

| Tipo | Descrição | Se Ausente | Se Presente |
|------|-----------|------------|-------------|
| **Must-Be** | Básico esperado | Insatisfação | Neutro |
| **Performance** | Quanto mais, melhor | Proporcional | Proporcional |
| **Delighter** | Inesperado positivo | Neutro | Alta satisfação |
| **Indifferent** | Não importa | Neutro | Neutro |
| **Reverse** | Não quer | Satisfação | Insatisfação |

### 4.3 Aplicação

**Priorização baseada em Kano**:
1. **Must-Be primeiro**: Sem isso, produto é rejeitado
2. **Performance second**: ROI direto em satisfação
3. **Delighters para diferenciação**: Competitive advantage
4. **Avoid Indifferent**: Esforço sem retorno

---

## 5. Weighted Scoring

### 5.1 Overview

Framework customizável onde você define critérios e pesos relevantes para seu contexto.

### 5.2 Template

| Feature | Critério 1 (peso 3) | Critério 2 (peso 2) | Critério 3 (peso 1) | Total |
|---------|---------------------|---------------------|---------------------|-------|
| Feature A | 5 × 3 = 15 | 3 × 2 = 6 | 4 × 1 = 4 | **25** |
| Feature B | 3 × 3 = 9 | 5 × 2 = 10 | 2 × 1 = 2 | **21** |
| Feature C | 4 × 3 = 12 | 4 × 2 = 8 | 5 × 1 = 5 | **25** |

### 5.3 Critérios Comuns

| Critério | Descrição | Peso Sugerido |
|----------|-----------|---------------|
| Strategic Alignment | Alinhamento com OKRs | Alto (3) |
| Customer Impact | Valor para usuário | Alto (3) |
| Revenue Potential | Potencial de receita | Médio-Alto (2-3) |
| Technical Feasibility | Facilidade de implementação | Médio (2) |
| Time to Value | Rapidez para entregar | Médio (2) |
| Risk | Risco de implementação | Baixo-Médio (1-2) |

---

## 6. Comparação de Frameworks

| Framework | Quando Usar | Pontos Fortes | Limitações |
|-----------|-------------|---------------|------------|
| **RICE** | Priorização quantitativa, muitos features | Objetivo, comparável | Requer dados de reach |
| **Value/Effort** | Decisões rápidas, poucos dados | Simples, intuitivo | Subjetivo |
| **MoSCoW** | Definir escopo de releases | Claro para stakeholders | Não ordena dentro de categoria |
| **Kano** | Estratégia de produto | Considera psicologia do usuário | Requer pesquisa |
| **Weighted** | Critérios customizados | Flexível | Pode ser gamificado |

---

## 7. Workflow de Priorização

```
┌─────────────────────────────────────────────────────────────┐
│                 PRIORITIZATION WORKFLOW                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. GATHER                                                  │
│     └─> Listar todos os features/iniciativas candidatos     │
│     └─> Coletar contexto (source, stakeholder, data)        │
│                                                             │
│  2. ESTIMATE                                                │
│     └─> Para cada item, estimar componentes do framework    │
│     └─> Documentar assumptions                              │
│     └─> Marcar confidence level                             │
│                                                             │
│  3. SCORE                                                   │
│     └─> Calcular scores (RICE, weighted, etc.)              │
│     └─> Rankear por score                                   │
│     └─> Identificar outliers para revisão                   │
│                                                             │
│  4. ANALYZE                                                 │
│     └─> Verificar distribuição (muitos quick wins? big bets?)│
│     └─> Checar dependencies entre items                     │
│     └─> Considerar capacity constraints                     │
│                                                             │
│  5. DECIDE                                                  │
│     └─> Selecionar items para próximo período               │
│     └─> Documentar rationale                                │
│     └─> Comunicar decisões e non-decisions                  │
│                                                             │
│  6. REVIEW                                                  │
│     └─> Periodicamente re-priorizar                         │
│     └─> Atualizar estimates com dados reais                 │
│     └─> Learn: scores previstos vs impacto real             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Armadilhas Comuns

| Armadilha | Sintoma | Solução |
|-----------|---------|---------|
| **HIPPO** | Highest Paid Person's Opinion domina | Usar dados, não posição |
| **Pet Project** | Features favoritos inflacionados | Calibração cruzada |
| **Recency Bias** | Último feedback vira prioridade | Agregar feedback sistematicamente |
| **Sunk Cost** | Continuar feature ruim por já ter investido | Avaliar futuro, não passado |
| **Analysis Paralysis** | Priorizar forever, não executar | Timeboxar decisão |
| **False Precision** | RICE score com 2 casas decimais | Usar buckets (High/Med/Low) |

---

## 9. Templates de Output

### 9.1 Prioritization Summary

```markdown
## Feature Prioritization Q1 2026

### Methodology
- Framework: RICE
- Period: Q1 2026 (Jan-Mar)
- Capacity: 12 person-months

### Results

| Rank | Feature | RICE | Quadrant | Decision |
|------|---------|------|----------|----------|
| 1 | Feature A | 2500 | Quick Win | ✅ Do Q1 |
| 2 | Feature B | 1200 | Quick Win | ✅ Do Q1 |
| 3 | Feature C | 800 | Big Bet | 🟡 Q2 |
| 4 | Feature D | 300 | Fill-in | ⚪ Backlog |
| 5 | Feature E | 50 | Time Sink | ❌ Won't Do |

### Rationale
- **Feature A**: Highest RICE, low effort, quick win
- **Feature C**: High potential but needs discovery first
- **Feature E**: Low reach, high effort - not worth investment

### Dependencies
- Feature A blocks Feature B
- Feature C requires API from Platform team

### Risks
- Feature B confidence is Low (50%) - needs validation
```

---

## Referências

- Intercom RICE Framework Documentation
- Kano, N. (1984). "Attractive Quality and Must-Be Quality"
- Clegg, D., Barker, R. (1994). Case Method Fast-Track (MoSCoW)
- Cagan, M. (2017). Inspired


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-specialist