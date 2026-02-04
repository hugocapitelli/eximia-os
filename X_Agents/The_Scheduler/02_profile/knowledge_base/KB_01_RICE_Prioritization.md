---
title: "KB_01 — RICE Prioritization Framework"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-rice-prioritization"
  - "kb_01 — rice prioritization fr"
  - "o que é rice?"
  - "os 4 componentes"
  - "1. reach (alcance)"
  - "2. impact (impacto)"
  - "3. confidence (confiança)"
  - "4. effort (esforço)"
  - "calculando rice"
  - "exemplo 1: the_negotiator"
tags:
  - "galaxy-specialist"
  - "knowledge-base"
---

# KB_01 — RICE Prioritization Framework

## O que é RICE?

**RICE** é um framework de priorização criado pela Intercom para decidir quais features/projetos construir primeiro com base em **valor quantificável**.

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

---

## Os 4 Componentes

### 1. REACH (Alcance)
**Pergunta:** Quantas pessoas/agentes serão impactados por período?

**Para Agentes eximIA.OS:**
- Quantos agentes existentes vão usar este novo agente?
- Quantos workflows serão melhorados?
- Quantos usuários do sistema se beneficiam?

**Escala:**
```
1-5:   Nicho (1-2 agentes)
6-15:  Moderado (3-5 agentes ou domínio específico)
16-50: Alto (6+ agentes ou cross-functional)
50+:   Massive (impacta todos os agentes)
```

**Exemplo:**
- **The_Negotiator** (usado por CFO, CLO, CEO) = Reach 15
- **Harven_Tester** (só Harven.ai) = Reach 3
- **The_Veritas** (usado por TODOS) = Reach 50+

---

### 2. IMPACT (Impacto)
**Pergunta:** Qual o tamanho do impacto quando usado?

**Escala (Intercom):**
```
0.25 = Minimal impact
0.5  = Low impact
1.0  = Medium impact
2.0  = High impact
3.0  = Massive impact
```

**Para eximIA.OS:**
- **Massive (3.0):** Desbloqueia capacidade totalmente nova (ex: The_Veritas - fact-checking)
- **High (2.0):** Melhora significativa em workflow existente (ex: The_Prototyper - PRDs)
- **Medium (1.0):** Melhoria incremental (ex: suporte a novo formato)
- **Low (0.5):** Nice to have (ex: formatação melhor)
- **Minimal (0.25):** Cosmético

**Exemplo:**
- **The_CFO** = 3.0 (cria capacidade financeira do zero)
- **Copy_Chief** = 2.0 (melhora significativa em copywriting)
- **Minor formatting agent** = 0.5

---

### 3. CONFIDENCE (Confiança)
**Pergunta:** Quão confiante estou nas estimativas de Reach/Impact/Effort?

**Escala:**
```
100% = High confidence (dados sólidos, caso de uso claro)
80%  = Medium confidence (alguma incerteza)
50%  = Low confidence (chutando muito)
```

**Para eximIA.OS:**
- **100%:** Caso de uso testado, escopos claros, referências existem
- **80%:** Boa ideia, mas precisa validação
- **50%:** Experimental, pode ou não dar certo

**Exemplo:**
- **The_CLO** (legal já usado diariamente) = 100%
- **The_Scheduler** (novo mas escopo claro) = 100%
- **Experimental AI tutor** (não testado) = 50%

---

### 4. EFFORT (Esforço)
**Pergunta:** Quantas horas/pessoa para construir?

**Para eximIA.OS (baseado em Tiers):**
```
Tier 1 (Tactical):  4-8h   (média: 6h)
Tier 2 (Executive): 6-12h  (média: 9h)
Tier 3 (Expert):    25-40h (média: 32h)
Clones:             25-40h (média: 30h)
```

**Ajustes:**
- +25% se tem muitas dependências
- +50% se domínio totalmente novo (sem referências)
- -25% se é variação de agente existente

**Exemplo:**
- **The_Negotiator** (Tier 2, claro) = 8h
- **The_CFO** (Tier 3, complexo) = 35h
- **Harven_Tester** (Tier 1, simples) = 5h

---

## Calculando RICE

### Exemplo 1: The_Negotiator

```
Reach:      15 (usado por CFO, CLO, CEO + PMO)
Impact:     3.0 (massive - automatiza prep de negociações)
Confidence: 100% = 1.0
Effort:     8h (Tier 2)

RICE = (15 × 3.0 × 1.0) / 8
RICE = 45.0 / 8
RICE = 5.625

Arredondado: 5.6
```

### Exemplo 2: Naval Ravikant Clone

```
Reach:      8 (founders, CEO, estrategistas)
Impact:     2.0 (high - filosofia de startup única)
Confidence: 80% = 0.8
Effort:     30h (Clone Factory padrão)

RICE = (8 × 2.0 × 0.8) / 30
RICE = 12.8 / 30
RICE = 0.427

Arredondado: 0.4
```

### Exemplo 3: The_Veritas (já construído)

```
Reach:      50 (usado por TODOS os agentes)
Impact:     3.0 (massive - elimina alucinações)
Confidence: 100% = 1.0
Effort:     35h (Tier 3 complex)

RICE = (50 × 3.0 × 1.0) / 35
RICE = 150 / 35
RICE = 4.29

Arredondado: 4.3
```

---

## Interpretando Scores

### Faixas de Referência

```
RICE > 5.0    🔥 BUILD NOW - Altíssimo valor
RICE 3.0-5.0  ✅ High Priority - Construa logo
RICE 1.0-3.0  📋 Medium Priority - Backlog
RICE 0.5-1.0  💭 Low Priority - Considere
RICE < 0.5    ❌ Don't Build - Valor muito baixo
```

### Decisões

**Cenário 1: Scores similares**
```
Agent A: RICE 4.5 (Effort: 8h)
Agent B: RICE 4.3 (Effort: 30h)

Decisão: Agent A (menos esforço, ROI similar)
```

**Cenário 2: Alto score mas bloqueado**
```
Agent X: RICE 8.0 mas depende de Agent Y (não pronto)

Decisão: Build Agent Y primeiro, depois X
```

**Cenário 3: Quick wins vs. Big bets**
```
Quick Win: RICE 3.0 (Effort: 5h)
Big Bet:   RICE 5.0 (Effort: 40h)

Decisão: Depende do contexto (momentum vs. capacidade nova)
```

---

## Workflow de Priorização

### Passo 1: Capture Todas as Ideias
```markdown
- The_Negotiator (Tier 2)
- Naval Clone
- The_Analyst (Tier 3)
- Marketplace_Seller v2
- ...
```

### Passo 2: Estime RICE para Cada
```markdown
1. Reach (quantitativo)
2. Impact (0.25 - 3.0)
3. Confidence (50-100%)
4. Effort (horas)
5. Calculate score
```

### Passo 3: Ordene por RICE (Descendente)
```
1. The_Negotiator:    RICE 5.6
2. The_Veritas:       RICE 4.3  (já feito)
3. The_Analyst:       RICE 2.8
4. Naval Clone:       RICE 0.4
```

### Passo 4: Aplique Filtros
```
✅ Dependencies met?
✅ Resources available?
✅ Aligns with strategy?
```

### Passo 5: Commit to Top 3
Build os 3 primeiros (que não estão bloqueados)

---

## Anti-Patterns

### ❌ RICE Manipulation
**Problema:** Inflar Reach/Impact para favorecer seu projeto favorito
**Solução:** Use dados objetivos, não wishful thinking

### ❌ Effort Underestimation
**Problema:** "Vai ser rápido" (famoso last words)
**Solução:** Use históricos, adicione buffer 25%

### ❌ Ignoring Confidence
**Problema:** Tratar 50% confidence como 100%
**Solução:** Penalize projetos incertos baixando confidence

### ❌ Building Low RICE "Because É Legal"
**Problema:** Ignorar score baixo porque gosta da ideia
**Solução:** Discipline - RICE < 1.0 vai pro fim do backlog

---

## Casos Especiais

### Caso 1: Dependency Agents
**Exemplo:** Agent X (RICE 8.0) precisa de Agent Y (RICE 2.0)

**Solução:**
```
Build Y primeiro (mesmo com RICE menor)
Justificativa: Desbloqueia X (valor maior)
```

### Caso 2: Strategic Bets
**Exemplo:** Experimental agent (RICE 0.8) mas estratégico

**Solução:**
```
Isole 10-20% do tempo para experiments
Mas maioria (80%) em high RICE
```

### Caso 3: Maintenance vs. New
**Exemplo:** Fix bug (no RICE) vs. New agent (RICE 3.0)

**Solução:**
```
Bugs críticos sempre primeiro
Bugs menores: compare com RICE equivalente
```

---

## Exemplos do eximIA.OS

### Backlog Real (Hipotético)

| Agent             | Tier | Reach | Impact | Conf | Effort | RICE  | Decision        |
|:------------------|:-----|------:|-------:|-----:|-------:|------:|:----------------|
| The_Negotiator    | 2    | 15    | 3.0    | 100% | 8h     | 5.63  | 🔥 BUILD NOW    |
| The_Veritas       | 3    | 50    | 3.0    | 100% | 35h    | 4.29  | ✅ Done         |
| The_Analyst       | 3    | 12    | 2.0    | 80%  | 30h    | 0.64  | 📋 Backlog      |
| Naval Clone       | -    | 8     | 2.0    | 80%  | 30h    | 0.43  | 💭 Low Priority |
| Marketplace v2    | 1    | 3     | 1.0    | 50%  | 6h     | 0.25  | ❌ Don't Build  |

**Ordem de Build:**
1. The_Negotiator (RICE 5.63, 8h) → ROI altíssimo
2. The_Analyst (RICE 0.64, 30h) → Só se tiver tempo
3. Naval Clone (RICE 0.43) → Backlog
4. Marketplace v2 → Reconsiderar scope

---

## Referências

- **Intercom RICE Framework:** https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers/
- **Silicon Valley Product Group (SVPG):** Inspired prioritization
- **eximIA.OS Tier System:** Agent complexity taxonomy

---

**Última Atualização:** 2026-01-24
**Mantido por:** The Scheduler

#galaxy-specialist