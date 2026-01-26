# TEORIA — Fundamentos de Corporate Finance

**Categoria:** TEORIA (Verdades Imutáveis)
**Agente:** CFO v4.0
**Update:** Raramente (só quando teoria muda)
**Fonte:** Papers acadêmicos, livros técnicos

---

## 📐 VALUATION

### DCF (Discounted Cash Flow)

**Fórmula:**
```
Enterprise Value = Σ(FCFₜ / (1 + WACC)ᵗ) + TV / (1 + WACC)ⁿ

FCF = EBITDA - CAPEX - ΔWC - Tax on EBIT
TV = FCFₙ × (1 + g) / (WACC - g)

Constraint: g ≤ GDP nominal growth
```

**Fonte:** Damodaran "Investment Valuation" 3rd ed

### WACC

**Fórmula:**
```
WACC = (E/V × Rₑ) + (D/V × Rₐ × (1 - T))

Rₑ = Rբ + β × (Rₘ - Rբ)  [CAPM]

βₗₑᵥₑᵣₑₐ = βᵤₙₗₑᵥₑᵣₑₐ × [1 + (1 - T) × D/E]
```

**Fonte:** Brealey & Myers "Corporate Finance" 13th ed

### Múltiplos

**Fórmulas:**
```
EV/EBITDA = Enterprise Value / EBITDA
EV/Revenue = Enterprise Value / Revenue
P/E = Market Cap / Net Income

Usar mediana (não média) para peers
```

---

## 💰 RETORNO SOBRE INVESTIMENTO

### NPV

**Fórmula:**
```
NPV = -I₀ + Σ(CFₜ / (1 + r)ᵗ)

Regra:
  NPV > 0 → GO
  NPV < 0 → NO-GO
```

### IRR

**Fórmula:**
```
0 = -I₀ + Σ(CFₜ / (1 + IRR)ᵗ)

Regra:
  IRR > WACC → GO
  IRR < WACC → NO-GO

Nota: NPV é superior (se conflito, usar NPV)
```

### ROIC

**Fórmula:**
```
ROIC = NOPAT / Invested Capital
NOPAT = EBIT × (1 - T)

Regra:
  ROIC > WACC → Empresa cria valor
  ROIC < WACC → Empresa destrói valor
```

---

## 📈 CAPITAL STRUCTURE

### Modigliani-Miller

**Teorema I (com impostos):**
```
V_L = V_U + T × D

Conclusão: Debt cria valor via tax shield
```

**Trade-off Theory:**
```
Optimal D/E = Argmax(Tax Shield - Cost of Distress)
```

---

## 📊 PROBABILISTIC

### Teorema de Bayes

**Fórmula:**
```
P(A|B) = [P(B|A) × P(A)] / P(B)

Onde:
  P(A) = Prior
  P(B|A) = Likelihood
  P(A|B) = Posterior
```

### Expected Value

**Fórmula:**
```
E(X) = Σ(Pᵢ × Xᵢ)

Onde Σ(Pᵢ) = 1
```

---

## 📚 BASE RATES (Condition C4 - Silver)

**M&A Success Rate:**
- Base rate: 40% de M&As realizam objetivos (McKinsey 2023)
- Setor tech: 35% (mais baixo)
- Setor industrial: 45% (mais alto)

**Synergy Realization:**
- Base rate: 40% de M&As realizam 100% de sinergias projetadas
- Revenue synergies: 30% realizadas
- Cost synergies: 60% realizadas

**CAPEX Overrun:**
- Base rate: 60% de projetos CAPEX excedem orçamento
- Médio overrun: +25% vs orçado

**Forecast Accuracy:**
- Base rate: ±15% variance (Actual vs Forecast 1Y)
- Top quartile: ±10%
- Bottom quartile: ±25%

**Fonte:** McKinsey M&A Research, Journal of Finance, Big 4 reports

---

**Mantido por:** Arquiteto Cognitivo Elite
**Versão:** 4.0
**Data:** 2025-12-21


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->