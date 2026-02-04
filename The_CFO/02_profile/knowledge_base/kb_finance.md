---
title: "Knowledge Base — CFO Agent"
galaxy: "SPECIALIST"
galaxy-color: "#228B22"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-finance"
  - "knowledge base — cfo agent"
  - "📚 índice"
  - "1. valuation methods"
  - "1.1 dcf (discounted cash flow)"
  - "1.2 comparable companies (comp"
  - "1.3 precedent transactions"
  - "2. m&a frameworks"
  - "2.1 due diligence checklist"
  - "2.2 synergy analysis"
tags:
  - "galaxy-specialist"
  - "knowledge-base"
---

# Knowledge Base — CFO Agent

## 📚 Índice

1. [Valuation Methods](#1-valuation-methods)
2. [M&A Frameworks](#2-ma-frameworks)
3. [Financial KPIs](#3-financial-kpis)
4. [Fundraising](#4-fundraising)
5. [Risk Management](#5-risk-management)

---

## 1. Valuation Methods

### 1.1 DCF (Discounted Cash Flow)

**Quando usar:** Empresas com fluxo de caixa previsível e histórico.

**Fórmula:**
```
Enterprise Value = Σ (FCF_t / (1+WACC)^t) + Terminal Value
```

**Componentes:**
| Componente | Descrição | Range Típico |
| :--- | :--- | :--- |
| FCF Growth (Y1-5) | Crescimento próximo | 5-20% |
| FCF Growth (Y6-10) | Crescimento maduro | 2-10% |
| Terminal Growth | Perpetuidade | 2-4% |
| WACC | Custo de capital | 8-15% |

**Sensitivity Analysis:**
Sempre apresentar matriz com variação de ±2% em WACC e Terminal Growth.

### 1.2 Comparable Companies (Comps)

**Quando usar:** Mercados líquidos com peers comparáveis.

**Múltiplos Comuns:**
| Múltiplo | Fórmula | Uso |
| :--- | :--- | :--- |
| EV/Revenue | EV / Receita | Early-stage, SaaS |
| EV/EBITDA | EV / EBITDA | Empresas maduras |
| P/E | Preço / LPA | Empresas lucrativas |
| P/S | Preço / Receita | Growth companies |

**Seleção de Peers:**
- Mesmo setor
- Tamanho similar (±50% revenue)
- Mesma região/mercado
- Mesmo estágio de maturidade

### 1.3 Precedent Transactions

**Quando usar:** M&A, para estimar prêmio de controle.

**Ajustes:**
- Prêmio de controle: +20-40% sobre múltiplos de mercado
- Ajuste temporal: transações > 2 anos menos relevantes

---

## 2. M&A Frameworks

### 2.1 Due Diligence Checklist

| Área | Items | Red Flags |
| :--- | :--- | :--- |
| **Financeira** | Revenue recognition, EBITDA adjustments | Receita não-recorrente alta |
| **Legal** | Contratos, litígios, compliance | Processos materiais pendentes |
| **Operacional** | Dependency on key person, supply chain | Concentração de cliente > 30% |
| **Sinergias** | Cost synergies, revenue synergies | Sinergias > 30% do deal value |

### 2.2 Synergy Analysis

| Tipo | Timeline | Confiabilidade |
| :--- | :--- | :--- |
| Cost Synergies | 1-2 anos | Alta (70-80% realizadas) |
| Revenue Synergies | 2-4 anos | Baixa (30-50% realizadas) |

**Regra:** Aplicar haircut de 30% em sinergias projetadas.

### 2.3 Deal Structure

| Estrutura | Quando Usar | Trade-off |
| :--- | :--- | :--- |
| 100% Cash | Certeza de valor | Maior risco para comprador |
| Stock Deal | Incerteza de valor | Diluição, mas compartilha risco |
| Earnout | Gap de valuation | Complexidade, potencial conflito |

---

## 3. Financial KPIs

### 3.1 SaaS Metrics (Startups)

| Métrica | Fórmula | Benchmark |
| :--- | :--- | :--- |
| MRR | Receita mensal recorrente | Crescimento > 10% MoM (early) |
| ARR | MRR × 12 | N/A |
| Churn | Clientes perdidos / Total | < 5% mensal |
| LTV | ARPU × Margem × Tempo médio | > 3× CAC |
| CAC | Custo de aquisição | LTV/CAC > 3 |
| Burn Rate | Cash gasto por mês | < 18 meses runway |

### 3.2 Traditional Finance Metrics

| Métrica | Fórmula | Benchmark |
| :--- | :--- | :--- |
| Gross Margin | (Revenue - COGS) / Revenue | > 50% |
| EBITDA Margin | EBITDA / Revenue | > 15% |
| Net Margin | Net Income / Revenue | > 10% |
| ROE | Net Income / Equity | > 15% |
| Debt/EBITDA | Total Debt / EBITDA | < 3x |

---

## 4. Fundraising

### 4.1 Valuation por Estágio

| Estágio | Valuation Típica | Diluição |
| :--- | :--- | :--- |
| Pre-Seed | $500K - $2M | 10-15% |
| Seed | $2M - $10M | 15-25% |
| Series A | $10M - $30M | 15-25% |
| Series B | $30M - $100M | 15-20% |

### 4.2 Cap Table Basics

**Terms importantes:**
- **Pre-money:** Valuation antes do investimento
- **Post-money:** Pre-money + Investimento
- **Diluição:** % cedido = Investimento / Post-money

**Exemplo:**
```
Pre-money: $10M
Investimento: $2M
Post-money: $12M
Diluição: 2/12 = 16.7%
```

---

## 5. Risk Management

### 5.1 All Weather Framework (Dalio)

| Cenário | Características | Ativos que performam |
| :--- | :--- | :--- |
| Growth ↑ / Inflation ↓ | Goldilocks | Ações, crédito |
| Growth ↑ / Inflation ↑ | Boom | Commodities, TIPS |
| Growth ↓ / Inflation ↓ | Deflation | Bonds nominais, cash |
| Growth ↓ / Inflation ↑ | Stagflation | Ouro, commodities |

### 5.2 Scenario Analysis Template

| Cenário | Probabilidade | Revenue | EBITDA | Valuation |
| :--- | :--- | :--- | :--- | :--- |
| Bull | 25% | [+20%] | [+30%] | [$X] |
| Base | 50% | [+10%] | [+15%] | [$Y] |
| Bear | 25% | [-10%] | [-20%] | [$Z] |

**Expected Value = Σ (Probabilidade × Valuation)**


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-specialist