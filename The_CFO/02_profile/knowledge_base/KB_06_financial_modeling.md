---
title: "KB_06 — Financial Modeling"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-06-financial-modeling"
  - "kb_06 — financial modeling"
  - "1. fundamentos de modelagem fi"
  - "o que é um modelo financeiro"
  - "tipos de modelos"
  - "2. three-statement model"
  - "estrutura (rosenbaum & pearl, "
  - "linkages críticos"
  - "drivers típicos"
  - "3. dcf best practices"
tags:
  - "galaxy-specialist"
  - "knowledge-base"
---

# KB_06 — Financial Modeling

## 1. Fundamentos de Modelagem Financeira

### O Que é um Modelo Financeiro
Segundo Rosenbaum & Pearl (Investment Banking, 2020), um modelo financeiro é uma representação matemática de uma empresa que projeta performance futura com base em premissas.

### Tipos de Modelos

| Tipo | Uso | Complexidade |
| :--- | :--- | :---: |
| **3-Statement Model** | Base para todos os outros | Médio |
| **DCF Model** | Valuation intrínseco | Alto |
| **LBO Model** | Private Equity | Alto |
| **M&A Model** | Aquisições, sinergias | Alto |
| **Comparables** | Valuation relativo | Baixo |

---

## 2. Three-Statement Model

### Estrutura (Rosenbaum & Pearl, 2020)

```
┌─────────────────────────────────────────────────────┐
│             THREE-STATEMENT MODEL                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  INCOME STATEMENT ────► Net Income                  │
│         │                    │                       │
│         │                    ▼                       │
│         │            BALANCE SHEET                   │
│         │                    │                       │
│         │                    ▼                       │
│         └──────────► CASH FLOW STATEMENT            │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Linkages Críticos

| De | Para | Via |
| :--- | :--- | :--- |
| P&L | BS | Net Income → Retained Earnings |
| P&L | CFS | D&A, Interest, Tax |
| BS | CFS | ΔWorking Capital, ΔDebt, CapEx |
| CFS | BS | Ending Cash |

### Drivers Típicos

| Linha | Driver Comum |
| :--- | :--- |
| Revenue | % Growth, Units × Price |
| COGS | % of Revenue |
| SG&A | % of Revenue ou Fixed + Variable |
| D&A | % of PP&E |
| CapEx | % of Revenue ou maintenance + growth |
| Working Capital | Days (DSO, DIO, DPO) |

---

## 3. DCF Best Practices

### Período de Projeção
Segundo Damodaran (Investment Valuation, 2012):
- **Mínimo:** 5 anos
- **Ideal:** 7-10 anos para growth companies
- **High growth → Stable growth transition**

### Terminal Value Approaches

| Método | Fórmula | Quando Usar |
| :--- | :--- | :--- |
| **Perpetuity Growth** | FCF × (1+g) / (WACC - g) | Mature, stable |
| **Exit Multiple** | EBITDA × EV/EBITDA | M&A, PE |

### Sanity Checks (McKinsey, Valuation, 2020)
1. Terminal Value < 75% of Enterprise Value
2. Terminal Growth ≤ GDP nominal (2-4%)
3. Implied Terminal Multiple sensível
4. ROIC convergindo para WACC no longo prazo

---

## 4. Scenario Analysis

### Framework de Cenários (McKinsey, 2020)

| Cenário | Probabilidade | Key Assumptions |
| :--- | :---: | :--- |
| **Bull** | 20-25% | Growth +50%, Margins +200bps |
| **Base** | 50-60% | Management guidance |
| **Bear** | 20-25% | Growth -30%, Margins -200bps |

### Sensitivity Analysis

**Tornado Chart Variables:**
1. Revenue growth (±5%)
2. WACC (±1%)
3. Terminal growth (±0.5%)
4. Operating margin (±2%)

### Monte Carlo Simulation
Para análises complexas (Damodaran, 2012):
- 10,000+ iterations
- Distribuições para key drivers
- Output: probability distribution of value

---

## 5. Modeling Standards

### Best Practices (FAST Standard, 2018)

| Princípio | Descrição |
| :--- | :--- |
| **Flexible** | Fácil de modificar premissas |
| **Appropriate** | Nível certo de detalhe |
| **Structured** | Lógica clara, modular |
| **Transparent** | Fórmulas auditáveis |

### Layout Recomendado

```
Tab Structure:
├── Cover (Inputs toggles)
├── Assumptions (ALL inputs here)
├── Income Statement
├── Balance Sheet
├── Cash Flow
├── DCF
├── Scenarios
├── Output Summary
└── Audit/Checks
```

### Formatação

| Tipo | Cor | Descrição |
| :--- | :---: | :--- |
| Input | Azul | Valores digitados |
| Calculation | Preto | Fórmulas |
| Link | Verde | Referências a outras sheets |
| Check | Vermelho | Validações (deve = 0) |

---

## 6. Common Errors

### Erros de Modelagem (Rosenbaum & Pearl, 2020)

| Erro | Impacto | Prevenção |
| :--- | :--- | :--- |
| **Circular references** | Crash, valores errados | Use iterative calculation |
| **Hard-coded numbers** | Não escalável | Always reference inputs |
| **Missing linkages** | BS não fecha | Check Total Assets = L+E |
| **Wrong signs** | Cash flow invertido | CFS: inflows (+), outflows (-) |
| **Double counting** | Overvaluation | Trace each item once |

### Checklist de Auditoria

- [ ] Balance Sheet balances (A = L + E)
- [ ] Cash reconciles (Opening + CFS = Closing)
- [ ] FCF matches CFS operating - CapEx
- [ ] Terminal Value < 75% of EV
- [ ] WACC within reasonable range (8-15% Brasil)
- [ ] Growth rates sustainable

---

## 7. Brasil-Specific

### Ajustes para Brasil

| Aspecto | Ajuste |
| :--- | :--- |
| **Inflação** | Nominal vs Real projections |
| **Câmbio** | USD revenue em Real |
| **Juros** | Selic-indexed debt |
| **Impostos** | IRPJ 25% + CSLL 9% = 34% |
| **Working Capital** | Longer DSO (Brasil payment culture) |

### Brasil WACC Components (2024)

| Component | Range |
| :--- | :--- |
| Risk-free (US 10Y) | 4-5% |
| Equity Risk Premium | 5-6% |
| Brasil Country Risk | 2-4% |
| Size Premium | 0-3% |
| **Total Cost of Equity** | 12-18% |
| Cost of Debt (post-tax) | 8-12% |

---

## Invariantes de Modelagem

1. **BS must balance:** Total Assets = Liabilities + Equity
2. **Terminal Value < 75% of EV** (McKinsey)
3. **Terminal growth ≤ GDP nominal** (Damodaran)
4. **No hard-coded values in formulas** (FAST)
5. **All inputs on Assumptions tab** (FAST)
6. **Check cells = 0 for validation** (audit)


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-specialist