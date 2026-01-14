# KB_06 — Leitura de Dados Financeiros

## Categoria: ESTRATÉGIA
## Palavras: ~2,500
## Atualizado: 2026-01-07

---

## 1. Tipos de Documentos Financeiros

| Documento | Jurisdição | Conteúdo | Frequência |
| :--- | :--- | :--- | :--- |
| **10-K** | EUA (SEC) | Relatório anual completo | Anual |
| **10-Q** | EUA (SEC) | Relatório trimestral | Trimestral |
| **8-K** | EUA (SEC) | Eventos materiais | Ad hoc |
| **20-F** | EUA (SEC) | Relatório anual (estrangeiros) | Anual |
| **DFP** | Brasil (CVM) | Demonstração Fin. Padronizada | Anual |
| **ITR** | Brasil (CVM) | Info. Trimestral | Trimestral |
| **Fato Relevante** | Brasil (CVM) | Eventos materiais | Ad hoc |

---

## 2. Estrutura de um 10-K

### Partes Principais

```
10-K STRUCTURE
│
├── PART I
│   ├── Item 1: Business (descrição do negócio)
│   ├── Item 1A: Risk Factors ← IMPORTANTE
│   └── Item 1B: Unresolved Staff Comments
│
├── PART II
│   ├── Item 5: Market for Registrant's Common Equity
│   ├── Item 6: Selected Financial Data
│   ├── Item 7: MD&A ← MUITO IMPORTANTE
│   ├── Item 7A: Quantitative/Qualitative Disclosures
│   ├── Item 8: Financial Statements ← CORE
│   └── Item 9: Controls and Procedures
│
├── PART III
│   └── Items 10-14: Directors, Compensation, Security
│
└── PART IV
    └── Item 15: Exhibits and Financial Schedules
```

### Onde Encontrar Insights

| Seção | O que procurar |
| :--- | :--- |
| **Item 1 (Business)** | Modelo de negócio, competidores |
| **Item 1A (Risk Factors)** | Riscos reais que a empresa identifica |
| **Item 7 (MD&A)** | Explicação da gestão sobre resultados |
| **Item 8 (Financials)** | DRE, Balanço, Fluxo de Caixa |
| **Notes to Financials** | Detalhes contábeis, off-balance sheet |

---

## 3. Demonstrações Financeiras Básicas

### DRE (Demonstração de Resultados)

```
Receita Líquida                 100.0
(-) Custo dos Produtos Vendidos  (60.0)
─────────────────────────────────────────
= Lucro Bruto                     40.0   ← Margem Bruta: 40%
(-) Despesas Operacionais        (25.0)
─────────────────────────────────────────
= EBITDA                          15.0   ← Margem EBITDA: 15%
(-) Depreciação/Amortização       (3.0)
─────────────────────────────────────────
= EBIT                            12.0
(-) Despesas Financeiras          (4.0)
─────────────────────────────────────────
= EBT                              8.0
(-) Impostos                       (2.7)
─────────────────────────────────────────
= Lucro Líquido                    5.3   ← Margem Líquida: 5.3%
```

### Balanço Patrimonial

```
ATIVO                          PASSIVO + PL
├── Circulante                 ├── Circulante
│   ├── Caixa                  │   ├── Fornecedores
│   ├── Contas a Receber       │   └── Empréstimos CP
│   └── Estoques               │
│                              ├── Não Circulante
├── Não Circulante             │   └── Dívida LP
│   ├── Imobilizado            │
│   └── Intangível             └── Patrimônio Líquido
│                                  ├── Capital Social
└── Total Ativo                    └── Lucros Acumulados
```

### Fluxo de Caixa

```
FCO (Operacional)
├── Lucro Líquido
├── (+) Depreciação
├── (+/-) Variação Capital de Giro
└── = Caixa Gerado nas Operações

FCI (Investimento)
├── (-) CAPEX
├── (-) Aquisições
└── = Caixa Usado em Investimentos

FCF (Financiamento)
├── (+) Emissão de Dívida
├── (-) Amortização de Dívida
├── (-) Dividendos
└── = Caixa de Financiamento
```

---

## 4. Métricas Chave

### Métricas de Rentabilidade

| Métrica | Fórmula | Benchmark |
| :--- | :--- | :--- |
| Margem Bruta | Lucro Bruto / Receita | SaaS: >70% |
| Margem EBITDA | EBITDA / Receita | Varia por setor |
| Margem Líquida | Lucro Líquido / Receita | >10% é bom |
| ROE | Lucro Líquido / PL | >15% é bom |
| ROIC | NOPAT / Capital Investido | >WACC |

### Métricas de Alavancagem

| Métrica | Fórmula | Alerta |
| :--- | :--- | :--- |
| Dívida/EBITDA | Dívida Líquida / EBITDA | >4x é alto |
| Dívida/PL | Dívida Total / PL | >2x é alto |
| Cobertura de Juros | EBITDA / Despesa Juros | <3x é risco |

### Métricas SaaS

| Métrica | Fórmula | Benchmark |
| :--- | :--- | :--- |
| ARR | MRR × 12 | — |
| LTV | (ARPU × Margem) / Churn | — |
| CAC | Custo S&M / Novos Clientes | — |
| LTV/CAC | LTV / CAC | >3x |
| Payback | CAC / (ARPU × Margem) | <12 meses |
| NRR | ARR t+1 (cohort) / ARR t | >100% |
| Rule of 40 | Growth% + Margin% | >40% |

---

## 5. Red Flags em Relatórios

| Red Flag | O que indica |
| :--- | :--- |
| **Revenue Recognition changes** | Possível manipulação |
| **Growing receivables faster than sales** | Clientes não estão pagando |
| **Unusual items persisting** | "Extraordinário" virou ordinário |
| **Related party transactions** | Conflito de interesse |
| **Auditor change** | Possível disagreement |
| **Qualified opinion** | Auditor teve ressalvas |
| **Off-balance sheet items** | Passivos escondidos |
| **MD&A vague** | Gestão escondendo problemas |

---

## 6. Onde Encontrar

### EUA
- **SEC EDGAR:** https://www.sec.gov/edgar
- **Company IR pages:** investor.company.com

### Brasil
- **CVM:** https://www.gov.br/cvm
- **B3:** https://www.b3.com.br
- **Company RI pages:** ri.company.com.br

### Global
- **Bloomberg Terminal** (pago)
- **Refinitiv Eikon** (pago)
- **Yahoo Finance** (básico, gratuito)
- **Google Finance** (básico, gratuito)

---

## 7. Referências

- SEC. (2024). *EDGAR Filing Requirements*.
- CVM. (2024). *Instruções para Companhias Abertas*.
- Damodaran, A. (2012). *Investment Valuation*.
- Schilit, H. (2018). *Financial Shenanigans*.
