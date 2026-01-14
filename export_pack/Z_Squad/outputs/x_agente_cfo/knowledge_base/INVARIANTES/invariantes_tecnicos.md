# INVARIANTES — Guardrails Técnicos Formais

**Categoria:** INVARIANTES (Guardrails Inquebráveis)
**Agente:** CFO v4.0
**Update:** Controlado (governança rigorosa)
**Fonte:** Design Review Board, compliance

---

## 🚨 INVARIANTES TEMPORAIS

### INV-001: Decisão Precipitada (CRITICAL)

**Regra:**
```
IF valor_decisao > R$ 100.000:
  ASSERT (ts_decisao - ts_input) >= 172.800  # 48h em segundos
  ELSE HALT "Violação INV-001: Decisão >R$ 100k requer mínimo 48h análise"
```

**Exceções:**
- Cash runway <30 dias (emergência financeira)
- Aprovação CEO + Board explícita

**Severidade:** CRITICAL
**Fonte:** Dalio Review - Evitar decisões precipitadas

---

### INV-002: FOMO Detector (HIGH)

**Regra:**
```
IF (deadline_seller < 7 dias) AND (valor_decisao > R$ 100.000):
  HALT "Violação INV-002: FOMO detectado - deadline artificial"
  MESSAGE "Pressão de tempo é tática de vendedor. Walk away se necessário."
```

**Severidade:** HIGH
**Fonte:** Behavioral Finance - FOMO bias

---

### INV-003: Due Diligence Mínima (CRITICAL)

**Regra:**
```
IF tipo_decisao == 'M&A':
  ASSERT due_diligence_days >= 5
  ELSE HALT "Violação INV-003: M&A requer mínimo 5 dias DD"
```

**Severidade:** CRITICAL
**Fonte:** Goldman Sachs M&A best practices

---

## 🔢 INVARIANTES QUANTITATIVOS

### INV-004: Overpayment Prevention (CRITICAL)

**Regra:**
```
IF tipo_analise == 'M&A':
  fair_value_range = DCF_range  # (P25, Median, P75)
  IF preco_pedido > fair_value_range.P75:
    WARNING "Violação INV-004: Preço pedido >P75 fair value (overpayment risk)"
    REQUIRE justificacao_escrita
```

**Severidade:** CRITICAL
**Fonte:** McKinsey M&A research

---

### INV-005: Strategic Fit Threshold (HIGH)

**Regra:**
```
IF tipo_decisao == 'M&A':
  ASSERT strategic_fit_score >= 35  # Threshold justificado (C1 - Drucker)
  ELSE RETURN 'NO-GO', "Fit insuficiente (score <35/50)"
```

**Severidade:** HIGH
**Fonte:** McKinsey research - 65% success rate quando fit ≥35

---

### INV-006: Synergy Haircut Obrigatório (HIGH)

**Regra:**
```
IF sinergias_projetadas > 0:
  haircut_minimo = 0.30  # 30% mínimo
  haircut_recomendado = 0.40  # 40% padrão

  IF haircut_aplicado < haircut_minimo:
    HALT "Violação INV-006: Haircut <30% proibido (optimism bias)"

  IF tipo_sinergia == 'revenue':
    ASSERT haircut_aplicado >= 0.50  # Revenue synergies 50%
```

**Severidade:** HIGH
**Fonte:** Base rate - 40% de M&As realizam 100% sinergias

---

### INV-007: NPV Negativo (CRITICAL)

**Regra:**
```
IF expected_NPV < 0:
  RETURN 'NO-GO', "NPV negativo destrói valor"

IF NPV_base < 0 AND NPV_bull > 0:
  WARNING "NPV positivo apenas em cenário otimista - validar premissas Bull"
```

**Severidade:** CRITICAL
**Fonte:** Brealey & Myers - NPV rule

---

### INV-008: WACC Validation (MEDIUM)

**Regra:**
```
IF WACC_calculado < 0.05 OR WACC_calculado > 0.25:
  WARNING "WACC fora de range típico (5-25%) - validar cálculo"
  REQUIRE revisao_CFO
```

**Severidade:** MEDIUM
**Fonte:** Damodaran Cost of Capital

---

### INV-009: Terminal Value Sanity Check (HIGH)

**Regra:**
```
IF g_perpetuity > GDP_nominal_growth:
  HALT "Violação INV-009: g perpétuo >GDP nominal (irreal)"

pct_TV = Terminal_Value / Enterprise_Value
IF pct_TV > 0.80:
  WARNING "Terminal Value >80% do EV - sensível a g (validar premissas)"
```

**Severidade:** HIGH
**Fonte:** Damodaran Investment Valuation

---

## 📊 INVARIANTES QUALITATIVOS (Data Quality)

### INV-010: Missing Critical Data (CRITICAL)

**Regra:**
```
campos_criticos = ['revenue', 'ebitda', 'growth_rate', 'churn']
missing_count = count(campo for campo in campos_criticos if campo is NULL)

IF missing_count / len(campos_criticos) > 0.40:  # >40% missing
  HALT "Violação INV-010: >40% dados críticos ausentes - impossível prosseguir"
```

**Severidade:** CRITICAL
**Fonte:** Data quality best practices

---

### INV-011: Data Contradiction (HIGH)

**Regra:**
```
IF (revenue_trend == 'declining') AND (ebitda_trend == 'growing'):
  WARNING "Violação INV-011: Revenue ↓ mas EBITDA ↑ (contradição suspeita)"
  REQUIRE explicacao

IF (churn_rate_reported < 0.05) AND (setor_mediana > 0.12):
  WARNING "Churn 50% abaixo mediana setor (validar se real ou reporting error)"
```

**Severidade:** HIGH
**Fonte:** Signal vs Noise - data validation

---

### INV-012: Outlier Absurdo (HIGH)

**Regra:**
```
IF multiplo_pedido > (multiplo_setor_mediana × 2.5):
  WARNING "Violação INV-012: Múltiplo >2.5× mediana setor (outlier absurdo)"
  REQUIRE justificacao_seller
```

**Severidade:** HIGH
**Fonte:** Statistical outlier detection

---

## 🎯 INVARIANTES DE SIGNAL VS NOISE (Condition C3 - Silver)

### INV-013: Growth Spike Validation (MEDIUM)

**Regra:**
```
IF growth_rate_single_quarter > 0.50:  # Crescimento >50% em 1 trimestre
  ASSERT tem_explicacao_valida IN ['novo_produto', 'M&A', 'campanha_validada']
  ELSE WARNING "Violação INV-013: Growth spike sem explicação (possível noise)"
  ACTION "Remover spike, usar média móvel 3M"
```

**Severidade:** MEDIUM
**Fonte:** Nate Silver - Signal vs Noise

---

### INV-014: Revenue Anomaly (MEDIUM)

**Regra:**
```
IF abs(revenue_atual - revenue_forecast) / revenue_forecast > 0.30:  # Desvio >30%
  WARNING "Violação INV-014: Revenue desvio >30% vs forecast (investigar)"
  REQUIRE root_cause_analysis
```

**Severidade:** MEDIUM
**Fonte:** Variance analysis best practices

---

### INV-015: Hype Filter (MEDIUM)

**Regra:**
```
indicadores_hype = ['awards', 'PR_spike', 'social_media_buzz']
indicadores_fundamentals = ['churn_trend', 'LTV_CAC_ratio', 'NPS']

IF count(indicadores_hype) > 2 AND count(indicadores_fundamentals) == 0:
  WARNING "Violação INV-015: Hype sem fundamentals (noise)"
  ACTION "Haircut extra 20% em forecast"
```

**Severidade:** MEDIUM
**Fonte:** Signal vs Noise - hype detection

---

## ⚙️ INVARIANTES PROCEDURAIS

### INV-016: 3 Lentes Obrigatórias (HIGH)

**Regra:**
```
IF tipo_decisao IN ['M&A', 'CAPEX >R$ 500k']:
  ASSERT lente_financeira_completa == True  # Dalio
  ASSERT lente_probabilistica_completa == True  # Silver
  ASSERT lente_estrategica_completa == True  # Drucker
  ELSE HALT "Violação INV-016: Decisão crítica requer 3 lentes"
```

**Severidade:** HIGH
**Fonte:** Design Review Board - framework integrado

---

### INV-017: Bayesian Update M&A (MEDIUM)

**Regra:**
```
IF tipo_decisao == 'M&A':
  ASSERT prior_documented == True  # Base rate
  ASSERT evidencias_DD >= 3  # Mínimo 3 evidências DD
  ASSERT posterior_calculado == True  # P(sucesso | evidências)
  ELSE WARNING "Violação INV-017: Bayes não sistematizado"
```

**Severidade:** MEDIUM
**Fonte:** Nate Silver - Bayesian updating

---

### INV-018: Convergência DCF vs Múltiplos (MEDIUM)

**Regra:**
```
divergencia = abs(DCF_valuation - Multiplos_valuation) / DCF_valuation

IF divergencia > 0.25:  # Divergência >25%
  WARNING "Violação INV-018: DCF vs Múltiplos divergem >25% (revisar premissas)"
  REQUIRE reconciliacao
```

**Severidade:** MEDIUM
**Fonte:** Valuation best practices

---

## 🚫 INVARIANTES ÉTICOS

### INV-019: Conflict of Interest (CRITICAL)

**Regra:**
```
IF existe_conflito_interesse == True:
  HALT "Violação INV-019: Conflito de interesse identificado"
  REQUIRE disclosure_completo + aprovacao_board
```

**Severidade:** CRITICAL
**Fonte:** Corporate governance

---

### INV-020: Insider Information (CRITICAL)

**Regra:**
```
IF decisao_baseada_em_insider_info == True:
  HALT "Violação INV-020: Uso de insider information proibido"
  ESCALATE compliance_officer
```

**Severidade:** CRITICAL
**Fonte:** Securities regulations

---

## 🌪️ INVARIANTES BLACK SWAN

### INV-021: Stress Test Pass Rate (CRITICAL)

**Regra:**
```
stress_tests_pass_rate = tests_passed / total_tests

IF stress_tests_pass_rate < 0.70:
  HALT "Violação INV-021: Pass rate <70% (sistema frágil)"
  REQUIRE refinar_invariantes_e_retest

IF stress_tests_pass_rate < 0.90:
  WARNING "Pass rate <90% (target não atingido)"
```

**Severidade:** CRITICAL
**Fonte:** Goldman Sachs - 95% edge case coverage

---

### INV-022: Covenant Headroom (HIGH)

**Regra:**
```
IF decisao_afeta_debt == True:
  covenant_headroom = (covenant_limit - covenant_atual) / covenant_limit

  IF covenant_headroom < 0.20:  # <20% headroom
    WARNING "Violação INV-022: Covenant headroom <20% (risco quebra)"
    REQUIRE approval_treasurer
```

**Severidade:** HIGH
**Fonte:** Big 4 - Covenant management

---

## 📊 SUMMARY

**Total Invariantes:** 22
- CRITICAL: 9
- HIGH: 8
- MEDIUM: 5

**Categorias:**
- Temporal: 3
- Quantitativo: 6
- Qualitativo: 3
- Signal vs Noise: 3 (Condition C3 resolvida ✅)
- Procedural: 3
- Ético: 2
- Black Swan: 2

**Todas invariantes são:**
- ✅ Formais (IF/THEN lógica)
- ✅ Testáveis (automatizáveis)
- ✅ Auditáveis (rastreáveis)
- ✅ Severidade definida (CRITICAL/HIGH/MEDIUM)

---

**Mantido por:** Arquiteto Cognitivo Elite
**Versão:** 4.0
**Data:** 2025-12-21
