---
title: "KB_02: Hoshin Kanri (Policy Deployment)"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-hoshin-kanri"
  - "kb_02: hoshin kanri (policy de"
  - "📖 origem"
  - "🎯 estrutura core"
  - "os 7 níveis de hoshin kanri"
  - "🔄 o processo catchball"
  - "o que é catchball?"
  - "protocolo de catchball"
  - "📐 ferramentas visuais hoshin"
  - "x-matrix (hoshin kanri matrix)"
tags:
  - "galaxy-specialist"
  - "knowledge-base"
---

# KB_02: Hoshin Kanri (Policy Deployment)

## 📖 Origem
Metodologia japonesa de gestão estratégica ("Compass Management"). Nasceu do movimento Lean/TQM e é usada por Toyota, Xerox, e outras organizações que valorizam alinhamento cascata.

## 🎯 Estrutura Core

### Os 7 Níveis de Hoshin Kanri

```
1. True North (Visão de 5-10 anos)
   ↓
2. Breakthrough Objectives (3-5 anos)
   ↓
3. Annual Objectives (1 ano)
   ↓
4. Strategies (Meios para atingir objetivos)
   ↓
5. Tactics (Ações específicas)
   ↓
6. KPIs (Métricas de acompanhamento)
   ↓
7. Owner (Responsável único)
```

**Regra de Ouro:** Não pode haver "Orphan Goals" (metas sem pai na cadeia).

## 🔄 O Processo Catchball

### O que é Catchball?
É a negociação **bidirecional** entre níveis hierárquicos. Não é top-down puro.

```
CEO propõe: "Aumentar EBITDA em 25%"
   ↓ (lança a bola)
COO pega e analisa: "Não é viável sem novas contratações. Proposta: 18% com orçamento aprovado OU 25% se liberar $500k para automação"
   ↓ (devolve a bola)
CEO ajusta: "Aprovado. 25% com budget de automação. Mas dividido em 2 fases."
   ↓ (re-lança)
COO aceita e cascateia para os gerentes
```

**Por que funciona?**
- Evita metas irrealistas impostas de cima
- Cria ownership (quem negocia, compra a meta)
- Identifica bloqueios antes do plano estar "pronto"

### Protocolo de Catchball
1. **Top-Down (Lançamento):** Liderança propõe objetivos
2. **Bottom-Up (Análise):** Times avaliam viabilidade e contraindicam
3. **Negociação (Ajuste):** Ambos os lados ajustam até acordo
4. **Commitment:** Só depois do acordo, o plano é "locked"

## 📐 Ferramentas Visuais Hoshin

### X-Matrix (Hoshin Kanri Matrix)

```
        [Annual Goals]
            |
  [Strategies] ←→ [Tactics]
            |
        [Metrics/KPIs]
```

**Como preencher:**
1. Defina 3-5 Annual Goals (não mais que isso!)
2. Para cada goal, liste 2-3 Strategies
3. Para cada strategy, defina 3-5 Tactics
4. Atribua KPIs que medem cada nível
5. Marque intersecções (correlações entre goals e strategies)

**Exemplo Resumido:**

| Goal | Strategy | Tactic | KPI | Owner |
|------|----------|--------|-----|-------|
| Reduzir OPEX 20% | Automatizar processos manuais | Implementar RPA em Finance | % de processos automatizados | CFO |
| ... | Renegociar contratos | Audit de fornecedores Q1 | Savings acumulados ($) | Procurement |

### A3 Thinking (Problem-Solving)

Ferramenta complementar ao Hoshin para quando algo não está funcionando.

**Template A3:**
```markdown
## Background
[Contexto do problema]

## Current Situation
[Dados atuais, gráficos]

## Goal
[Estado futuro desejado]

## Root Cause Analysis
[5 Whys aplicados]

## Countermeasures
[3-5 ações propostas]

## Implementation Plan
[Quem, O quê, Quando]

## Follow-Up
[Como medir sucesso]
```

## 🧠 Regras de Ouro Hoshin

### 1. Limite de 5 Goals por Nível
Se você tem 10 prioridades, não tem nenhuma prioridade.
- **Empresa:** Max 5 annual goals
- **Departamento:** Max 5 goals (alinhados aos da empresa)
- **Individual:** Max 3 goals

### 2. PDCA Rigoroso
Hoshin opera em ciclos PDCA (Plan-Do-Check-Act):
- **Plan:** Define o Hoshin (Catchball + X-Matrix)
- **Do:** Executa (trimestralmente revisado)
- **Check:** Audita (métricas vs targets)
- **Act:** Ajusta (revisa estratégias se não estiver funcionando)

**Frequência Recomendada:**
- **Plan:** Annual (offsite de planejamento)
- **Check:** Quarterly (revisão de progresso)
- **Act:** Continuous (ajustes táticos semanais)

### 3. Visual Management
Tudo deve estar visível. Hoshin não funciona em gavetas.
- **Hoshin Board:** Quadro físico/virtual com X-Matrix
- **Status Colors:** Verde/Amarelo/Vermelho para cada goal
- **Leader Standard Work:** Rotina semanal de check dos KPIs

## 🚫 Anti-Patterns (Erros Comuns)

### ❌ Top-Down sem Catchball
**Problema:** CEO define tudo sozinho e manda executar.  
**Consequência:** Resistência, falta de ownership, metas irrealistas.

**Solução:** Sempre reserve 2-3 rounds de catchball.

### ❌ Excesso de Metas
**Problema:** Hoshin com 15 annual goals.  
**Consequência:** Paralisia, ninguém lembra das prioridades.

**Solução:** Force ranking. Escolha as 5 mais críticas.

### ❌ Hoshin na Gaveta
**Problema:** Plano bonito mas nunca revisitado.  
**Consequência:** Execução desalinhada, plano vira peça de ficção.

**Solução:** Quarterly reviews obrigatórios + X-Matrix visível.

## 🛠️ Templates Práticos

### Template: Hoshin Anual Completo

```markdown
# Hoshin Kanri 2026 — [Nome da Empresa]

## 🌟 True North (Visão 2030)
Ser a referência em [setor] no Brasil, reconhecida por [diferencial].

## 🎯 Breakthrough Objectives (3 anos - 2026-2028)
1. Alcançar $50M ARR
2. Expandir para LATAM (México + Argentina)
3. IPO ou aquisição estratégica

---

## 📅 Annual Objectives 2026

### Objetivo 1: Dobrar a receita
**Target:** $20M → $40M ARR  
**Owner:** CEO

#### Strategies
1. **S1.1:** Expandir força de vendas (5 → 15 AEs)
   - **Tactic:** Contratar Sales Manager até Mar/2026
   - **Tactic:** Onboarding program de 30 dias
   - **KPI:** Ramp time (dias até primeiro deal)

2. **S1.2:** Lançar tier Enterprise
   - **Tactic:** Roadmap aprovado até Jan/2026
   - **Tactic:** Beta com 5 clientes até May/2026
   - **KPI:** Enterprise ARR (target: $5M)

#### Catchball Notes
- **Input CFO:** Budget aprovado de $800k para Sales Hiring
- **Input Head of Product:** Enterprise features requerem 2 quarters (não 1)
- **Ajuste:** Fase 1 em Q1-Q2, Fase 2 em Q3-Q4

---

### Objetivo 2: Construir cultura de excelência
**Target:** Engagement Score de 6.5 → 8.0  
**Owner:** People & Culture Lead

#### Strategies
1. **S2.1:** Implementar carreira em Y (IC vs Management)
   - **Tactic:** Framework pronto até Feb/2026
   - **Tactic:** Calibração salarial até Mar/2026
   - **KPI:** % de turnover (target: < 15%/ano)

2. **S2.2:** Academia Interna
   - **Tactic:** 1 workshop técnico/mês
   - **Tactic:** Budget de $50k para cursos externos
   - **KPI:** Avg horas de treinamento/pessoa (target: 40h/ano)

---

## 📊 KPI Dashboard (Scorecard)

| Goal | Leading KPI | Target | Q1 | Q2 | Q3 | Q4 | Status |
|------|-------------|--------|----|----|----|----|--------|
| G1: Revenue | Pipeline Coverage | 3x | 2.8x | - | - | - | 🟡 |
| G1: Revenue | ARR | $40M | $25M | - | - | - | 🟢 |
| G2: Culture | Engagement | 8.0 | 7.2 | - | - | - | 🟢 |

---

## 🔄 Governance

### Quarterly Hoshin Review (Offsite - 4h)
1. **Check:** Cada goal apresenta status (Green/Yellow/Red)
2. **Act:** Se Yellow/Red, root cause via A3
3. **Adjust:** Se estratégia não está funcionando, substitua (não insista)

### Monthly Leadership Sync (2h)
- Review de KPIs
- Bloqueios escalados
- Catchball de ajustes táticos
```

## 🎓 Quando Usar Hoshin Kanri (vs outros)

✅ **Use Hoshin se:**
- Organização madura com cultura de processos
- Alinhamento cascata é crítico (matriz, múltiplas BUs)
- Lean/Six Sigma já é cultural fit
- Horizonte de planejamento é anual (não trimestral)

❌ **Evite Hoshin se:**
- Startup em pivoting constante
- Não há disciplina para quarterly reviews
- Organização pequena (<20 pessoas) onde alinhamento é informal

---

**Fontes:**
- "Hoshin Kanri: The Strategic Approach to Continuous Improvement" (Yoji Akao)
- Lean Enterprise Institute (2024)
- Toyota Management System Handbook

#galaxy-specialist