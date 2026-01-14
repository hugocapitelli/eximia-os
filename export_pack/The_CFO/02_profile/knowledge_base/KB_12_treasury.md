# KB_12 — Treasury Management

## 1. Fundamentos de Treasury

### Escopo do Treasury (One Money Way, 2024)
Treasury management foca em otimizar liquidez, gerenciar cash flow, e mitigar riscos financeiros para garantir que a empresa tenha fundos suficientes para operações e crescimento.

### Funções Core

| Função | Objetivo |
| :--- | :--- |
| **Cash Management** | Otimizar posição de caixa |
| **Liquidity Management** | Garantir funding disponível |
| **Risk Management** | Hedging FX, rates, commodities |
| **Bank Relationships** | Gestão de counterparties |
| **Payments** | Processamento eficiente |

---

## 2. Cash Management Best Practices (2024)

### Cash Flow Forecasting (Citi, 2024)
AI e machine learning para previsão de cash flow mais precisa, identificando padrões e sazonalidade.

| Horizonte | Método | Precisão Alvo |
| :--- | :--- | :--- |
| **13 semanas** | Direto por linha | ±5% |
| **Trimestral** | Driver-based | ±10% |
| **Anual** | Modelo integrado | ±15% |

### Cash Pooling (TRG International, 2024)

| Estrutura | Use Case | Benefício |
| :--- | :--- | :--- |
| **Physical Pooling** | Legal cash movement | Zero balancing |
| **Notional Pooling** | Offset sem transferência | Simplifica contabilidade |
| **Virtual Accounts** | Segregação sem contas reais | Visibilidade granular |

### Working Capital Optimization

| Alavanca | Ação | Impacto |
| :--- | :--- | :--- |
| **DSO** | Acelerar recebimentos | Libera caixa |
| **DIO** | Reduzir estoque | Libera caixa |
| **DPO** | Estender pagamentos | Preserva caixa |

---

## 3. Liquidity Management

### Liquidity Framework (Santander CIB, 2024)

```
LIQUIDITY WATERFALL

1. Operating Cash
   ├── Sufficient for 30-60 days
   └── Minimum: 1 month of OpEx

2. Committed Credit Lines
   ├── RCF undrawn
   └── Backup facility

3. Uncommitted Lines
   ├── Short-term facilities
   └── Commercial paper backup

4. Capital Markets Access
   ├── Debt issuance capability
   └── Equity raise option
```

### Real-Time Cash Visibility (Trovata, 2024)
- APIs para conectar bancos
- Dashboard multi-bank, multi-currency
- Alertas automatizados

---

## 4. Hedging Strategies (2024)

### Framework de Risco (HighRadius, 2024)

| Risco | Instrumento | Quando Usar |
| :--- | :--- | :--- |
| **FX** | Forwards, Options | Exposição conhecida |
| **Interest Rate** | Swaps, Caps | Dívida flutuante |
| **Commodity** | Futures, Swaps | Input/output prices |
| **Liquidity** | Credit lines | Contingency |

### FX Hedging Best Practices (The Global Treasurer, 2024)

**Hedge Ratio Guidelines:**
| Horizonte | Hedge % |
| :--- | :--- |
| 0-3 meses | 80-100% |
| 3-6 meses | 60-80% |
| 6-12 meses | 40-60% |
| 12+ meses | 20-40% |

**Layered Hedging (ACT, 2024):**
- Programa de 18 meses a 3 anos
- Múltiplos hedges em diferentes notionals
- Combinação forwards + options para melhor efetividade

### Tipos de Hedge (Corporate Alliance, 2024)

| Tipo | Protege | Accounting |
| :--- | :--- | :--- |
| **Cash Flow Hedge** | Transações futuras | OCI até settlement |
| **Fair Value Hedge** | Ativos/passivos existentes | P&L imediato |
| **Net Investment Hedge** | Subsidiárias FX | OCI permanente |

---

## 5. Technology Trends (2024)

### Treasury Management Systems (Euromoney, 2024)

| Trend | Benefício |
| :--- | :--- |
| **Cloud-based TMS** | Flexibilidade, real-time |
| **API connectivity** | Integração bancária |
| **AI/ML** | Previsão, anomalias |
| **Blockchain** | Pagamentos, transparência |

### Automation (EOXS, 2024)
- Reconciliação automática
- Payment processing STP
- Fraud detection em tempo real

### Cybersecurity (EOXS, 2024)
- Multi-factor authentication
- Encryption de dados
- Monitoramento contínuo

---

## 6. Brasil Treasury Specifics

### Instrumentos de Hedge Brasil

| Instrumento | Mercado | Use |
| :--- | :--- | :--- |
| **NDF (USD/BRL)** | OTC, B3 | FX hedging |
| **Futuro de Dólar** | B3 | FX hedging |
| **DI Futuro** | B3 | Interest rate |
| **Swap Cambial BCB** | BCB | FX intervention |

### Cash Management Brasil

| Produto | Banco | Característica |
| :--- | :--- | :--- |
| **CDB** | Múltiplos | CDI % |
| **LF** | Múltiplos | CDI, isenção IR PF |
| **Fundos DI** | Asset managers | Liquidez D+0/D+1 |
| **Compromissada** | BCB | Low risk, Selic |

### Regulamentação
- BACEN: Controles cambiais
- Circular 3.691: Operações cambiais
- IOF: Imposto operações financeiras

---

## 7. ESG em Treasury (FTI Treasury, 2024)

### Sustainability Focus
- ESG-linked credit facilities
- Green deposits
- Sustainable investment portfolio

### Frameworks
- UN Principles for Responsible Investment
- TCFD disclosure
- EU Taxonomy

---

## Invariantes de Treasury

1. **Cash forecast 13 weeks: mandatory** em empresas maduras
2. **Liquidity buffer: ≥1 mês OpEx** mínimo
3. **Hedge ratio: 50-100%** para exposições conhecidas
4. **Real-time visibility: essential** para decisões
5. **BRL volatility: 20-30%** anual (hedge important)
6. **IOF: considerar custo** em operações cambiais
