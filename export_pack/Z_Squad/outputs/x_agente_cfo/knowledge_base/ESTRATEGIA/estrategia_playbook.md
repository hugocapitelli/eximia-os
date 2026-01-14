# ESTRATEGIA — Playbook Tático

**Categoria:** ESTRATEGIA (Aplicação Prática)
**Agente:** CFO v4.0
**Update:** Frequente (novos casos, calibração)
**Fonte:** Casos práticos, learning loop

---

## 📋 PLAYBOOK 1: M&A GO/NO-GO

### FASE 1: SCREENING (30min)

**Bloqueadores:**
```
□ Strategic fit <20/50 → PASS
□ Múltiplo >P90 histórico → PASS
□ Lawsuit >20% valuation → PASS
□ Churn >20% → PASS
□ Customer concentration >60% → PASS
```

### FASE 2: VALUATION (1-2 dias)

**DCF:**
```
1. Forecast 5Y (Bear/Base/Bull)
2. WACC calculation
3. Terminal Value (g ≤ GDP growth)
4. Sensitivity (WACC ±1pp, g ±0.5pp)
→ Output: EV range (P25/Median/P75)
```

**Múltiplos:**
```
1. Selecionar 5-10 peers
2. Mediana EV/EBITDA
3. Aplicar ao EBITDA normalizado
→ Output: Fair value

Convergência:
  SE |DCF - Múltiplos| / DCF <15% → Confiança alta
```

### FASE 3: STRATEGIC FIT (30min)

**Scoring (0-50):**
```
1. Core Business Fit (0-10)
2. Sinergias Quantificáveis (0-10)
3. Complementaridade (0-10)
4. Cultural Fit (0-10)
5. Strategic Optionality (0-10)

Threshold (Condition C1 - Drucker):
  ≥35: GO
  25-34: GO-CONDITIONAL
  <25: NO-GO

Fonte justificação: McKinsey M&A research (65% success rate quando fit ≥35)
```

### FASE 4: SYNERGY HAIRCUT

**Regra:**
```
Synergies management: R$ X
Haircut: 40% (obrigatório)
Synergies adjusted: R$ X × 0.6

Casos especiais:
  Revenue synergies: Haircut 50%
  Cost synergies: Haircut 30%
```

### FASE 5: BAYESIAN UPDATE

**Processo:**
```
Prior: P(M&A sucesso) = 40% (base rate)

Para cada evidência DD:
  Atualizar: P(sucesso | evidência)

Evidências positivas (aumentam P):
  - Cultural fit forte: 40% → 64%
  - Tech stack compatível: 64% → 72%
  - Churn <10%: 72% → 78%

Decision:
  P(sucesso) >70% → GO
  P(sucesso) 50-70% → GO-CONDITIONAL
  P(sucesso) <50% → NO-GO
```

### DECISION FINAL

**Integração 3 lentes:**
```
Lente Financeira (Dalio):
  □ Fair value ≥ Preço pedido?
  □ Pain-to-benefit >2.5×?
  □ Timing ok (não topo ciclo)?

Lente Probabilística (Silver):
  □ P(sucesso) >60%?
  □ Expected NPV >0?
  □ Signal vs noise validado?

Lente Estratégica (Drucker):
  □ Fit score ≥35?
  □ Alinha com MBO?

SE todas ✅ → GO
SE maioria ✅ → GO-CONDITIONAL
SE não → NO-GO
```

---

## 📋 PLAYBOOK 2: CAPEX APPROVAL

### FASE 1: EFFECTIVENESS (30min)

**Perguntas Drucker:**
```
1. "Se não estivéssemos fazendo, começaríamos hoje?"
   SE não → HALT

2. "Contribui para objetivo estratégico?"
   SE não → HALT

3. "Qual custo de oportunidade?"
   SE existe alternativa melhor → HALT
```

### FASE 2: NPV ANALYSIS (1 dia)

**Cálculo:**
```
NPV = -I₀ + Σ(CFₜ / (1 + WACC)ᵗ)

Cenários:
  Bear (P=30%): Premissas conservadoras
  Base (P=50%): Premissas realistas
  Bull (P=20%): Premissas otimistas

Expected NPV = 0.3×NPV_bear + 0.5×NPV_base + 0.2×NPV_bull

Decision:
  Expected NPV >0 → GO
  Expected NPV <0 → NO-GO
```

---

## 📋 PLAYBOOK 3: TIMING DE CICLO

**Framework Dalio:**
```
Identificar fase:
  - Múltiplos P75-P90 histórico → TOPO
  - Múltiplos P25-P50 → MEIO
  - Múltiplos P10-P25 → FUNDO

Decisão:
  TOPO:
    M&A → CAUTELA (risco overpayment, haircut extra 20%)
    CAPEX → OK

  FUNDO:
    M&A → OPORTUNIDADE (buy low)
    CAPEX → CAUTELA (validar caixa)
```

---

## 📋 PLAYBOOK 4: SIGNAL VS NOISE (Condition C3 - Silver)

### Teste 1: CONSISTÊNCIA TEMPORAL

**Regra:**
```
Signal: Tendência 3+ trimestres
Noise: Spike pontual (1 trimestre outlier)

Action: Remover spike (média móvel 3M)
```

### Teste 2: FUNDAMENTALS VS HYPE

**Regra:**
```
Signal (confiar):
  - Churn ↓ (estrutural)
  - LTV/CAC ↑
  - NPS ↑

Noise (haircortar 20-30%):
  - Crescimento por desconto insustentável
  - Spike campanha pontual
  - PR/Awards
```

### Teste 3: VALIDAÇÃO EXTERNA

**Regra:**
```
Comparar forecast interno com:
  - Top-down (TAM × market share)
  - Peers growth mediana

SE divergência >20% → Investigar
```

---

## 🔄 LEARNING

**Update:** Trimestral
**Process:**
1. Validar decisões passadas (outcome real vs projetado)
2. Identificar padrões de erro
3. Calibrar thresholds
4. Atualizar playbook

---

**Mantido por:** Arquiteto Cognitivo Elite
**Versão:** 4.0
**Data:** 2025-12-21
