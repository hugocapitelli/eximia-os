# KB_02 — Valuation Frameworks

## 1. DCF (Discounted Cash Flow)

### Fundamento
Segundo Damodaran (Investment Valuation, 2012), o valor de qualquer ativo é o valor presente dos fluxos de caixa futuros esperados.

### Fórmula
```
Enterprise Value = Σ (FCF_t / (1+WACC)^t) + Terminal Value / (1+WACC)^n
```

### Componentes

| Componente | Descrição | Fonte |
| :--- | :--- | :--- |
| FCF | Free Cash Flow = EBIT(1-T) + D&A - CapEx - ΔWC | Damodaran (2012) |
| WACC | Weighted Average Cost of Capital | Modigliani-Miller (1958) |
| Terminal Value | Valor perpétuo = FCF_n+1 / (WACC - g) | Gordon Growth Model |
| g | Growth rate terminal (≤ PIB nominal) | Damodaran constraint |

### Brasil Context
- Nubank IPO (2021): Used DCF with 25% cost of equity
- Magazine Luiza: DCF with e-commerce growth premium
- Fonte: S-1 Filings, CVM

---

## 2. WACC (Weighted Average Cost of Capital)

### Fórmula
```
WACC = (E/V) × Re + (D/V) × Rd × (1-T)
```

Onde (Modigliani-Miller, 1958):
- E = Market value of equity
- D = Market value of debt
- Re = Cost of equity (CAPM)
- Rd = Cost of debt
- T = Tax rate

### Cost of Equity (CAPM)
```
Re = Rf + β × (Rm - Rf) + Country Risk Premium
```

### Brasil Premiums (2024)
| Component | Range | Source |
| :--- | :--- | :--- |
| Risk-free (US 10Y) | 4-5% | Treasury |
| Equity Risk Premium | 5-6% | Damodaran (2024) |
| Brasil CRP | 2-4% | Damodaran (2024) |
| Typical Re Brasil | 12-18% | B3 Benchmarks |

---

## 3. Comparable Companies Analysis

### Metodologia
Segundo McKinsey (Valuation, 2020), múltiplos devem refletir empresas com:
- Similar growth profile
- Similar risk profile
- Similar profitability

### Múltiplos Principais
| Múltiplo | Uso | Limitação |
| :--- | :--- | :--- |
| EV/EBITDA | General valuation | Ignora CapEx |
| EV/Revenue | Early-stage, tech | Não reflete margem |
| P/E | Mature companies | Afetado por capital structure |
| EV/EBIT | CapEx-heavy | Menos comum |

### Brasil SaaS Multiples (2024)
| Stage | EV/ARR Range | NRR Threshold |
| :--- | :--- | :--- |
| Early | 8-15x | >100% |
| Growth | 5-12x | >110% |
| Mature | 3-8x | >120% |

Fonte: a16z (2015), Bessemer (2024), análise própria

---

## 4. Precedent Transactions

### Quando Usar (McKinsey, 2020)
- M&A valuation
- Control premium analysis
- Private company valuation

### Adjustments Necessários
1. **Control Premium:** +20-40% sobre trading multiples
2. **Synergy Premium:** Parte capturada pelo vendedor
3. **Time Adjustment:** Transações >2 anos requerem ajuste

### Brasil M&A Precedents (2021-2024)
| Transaction | Multiple | Year |
| :--- | :--- | :--- |
| iFood (controlling stake) | 25x Revenue | 2022 |
| Loft Series D | 15x ARR | 2021 |
| Stone IPO | 10x Revenue | 2018 |

---

## 5. SaaS Metrics (Tech Valuation)

### Framework a16z (16 Metrics, 2015)
| Metric | Definition | Good Benchmark |
| :--- | :--- | :--- |
| ARR | Annual Recurring Revenue | Growing >50% |
| NRR | Net Revenue Retention | >110% |
| LTV/CAC | Customer value / acquisition cost | >3x |
| Payback | Months to recover CAC | <18 months |
| Burn Multiple | Net Burn / Net New ARR | <2x |

### Magic Number (Bessemer, 2020)
```
Magic Number = Net New ARR / S&M Spend Last Quarter
```
- < 0.5: Inefficient
- 0.5-1.0: Acceptable
- > 1.0: Efficient growth

---

## Invariantes de Valuation

1. **Terminal growth ≤ GDP nominal** (Damodaran, 2012)
2. **DCF e Comps devem convergir ±20%** (McKinsey, 2020)
3. **WACC Brasil: 12-18% typical** (B3 data)
4. **Control premium: 20-40%** (Precedents)
5. **Synergy haircut: 30-60%** (McKinsey, 2020)
