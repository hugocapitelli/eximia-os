# PRD — Finance (Proposta)
**Módulo:** 08_Finance
**Versão:** 1.0
**Data:** 25 Janeiro 2026
**Status:** ⚠️ **PROPOSTA** — Não Implementado

---

## Sumário Executivo

> **Fonte:** PRD ExímIA Finance v2 (rewritten by Elon Clone)
> **Status:** Proposta para v5.0+

O módulo **Finance** é uma proposta de integração de gestão financeira pessoal e empresarial no ExímIA OS.

**Diferencial:** Multi-workspace (Pessoal + Business) em um único lugar, com insights proativos powered by IA.

**Decisão Arquitetural:** Implementar DEPOIS da Connection Layer estar funcionando. Não é prioridade imediata.

---

## Índice

1. [Por Que Finance no ExímIA OS?](#1-por-que-finance)
2. [Escopo Mínimo (v0.1)](#2-escopo-mínimo)
3. [Modelos de Dados](#3-modelos-de-dados)
4. [Proactive Insights Engine](#4-proactive-insights)
5. [Decisão Arquitetural](#5-decisão-arquitetural)
6. [Integração com Outros Módulos](#6-integração)

---

# 1. Por Que Finance no ExímIA OS?

## 1.1 Alinhamento com Manifesto

| Problema Identificado | Finance Resolve? |
|-----------------------|------------------|
| "Ferramentas isoladas criam ilhas" | ✅ Unifica PF + PJ em um lugar |
| "Dependência humana" | ✅ Insights proativos |
| "Falta de padrão" | ✅ Categorização consistente |

## 1.2 Sinergias com Módulos Existentes

| Conexão | Como Funciona |
|---------|---------------|
| **Strategy → Finance** | Iniciativas têm budget. Finance mostra burn rate. |
| **Journey → Finance** | Goals financeiros (ex: "Economizar 10k"). Tracking automático. |
| **Finance → Notifications** | "Você gastou 2x em Marketing este mês" |
| **Finance → Inbox** | Captura de despesas via foto/voz |

## 1.3 Gap Identificado

> "Empreendedores precisam controlar dinheiro, mas o ExímIA OS ignora isso completamente." — Análise Crítica v5.0

---

# 2. Escopo Mínimo (v0.1 Finance)

Baseado no PRD do Elon Clone — **radically scoped**:

| Feature | Status | Justificativa |
|---------|--------|---------------|
| **Multi-workspace (Personal + Business)** | ✅ Core | É O diferenciador |
| **Contas bancárias manuais** | ✅ Core | Inventário básico |
| **Cartões de crédito manuais** | ✅ Core | Inventário básico |
| **Transações manuais** | ✅ Core | Entrada de dados |
| **Categorização manual** | ✅ Core | Organização |
| **Totais simples** | ✅ Core | "Quanto tenho?" |
| **1 insight proativo** | ✅ Core | Prova de conceito |
| AI categorization | ❌ Depois | Nice-to-have |
| Open Finance | ❌ Depois | Complexidade |
| Gráficos elaborados | ❌ Depois | Vaidade |
| Orçamentos | ❌ Depois | Não é core |

**Total: 7 features.** Original tinha 70+. **Redução de 90%.**

---

# 3. Modelos de Dados

## 3.1 Workspace (Reutilizado)

Finance usa o mesmo conceito de workspace que Strategy. Um usuário pode ter:
- Workspace "Pessoal" (PF)
- Workspace "Minha Empresa" (PJ)
- Workspace "Side Project" (PJ2)

## 3.2 FinanceAccount

```typescript
interface FinanceAccount {
  id: string;
  workspace_id: string; // Link com workspace existente

  name: string;
  bank: string;
  balance: number;
  currency: 'BRL'; // Brazil first

  // Connection Layer
  linked_goals?: string[]; // Goals de Journey que envolvem esta conta

  created_at: Date;
  updated_at: Date;
}
```

## 3.3 FinanceCard

```typescript
interface FinanceCard {
  id: string;
  workspace_id: string;

  name: string;
  last_four?: string;
  credit_limit: number;
  current_balance: number;
  closing_day: number; // 1-31
  due_day: number;     // 1-31

  created_at: Date;
}
```

## 3.4 Transaction

```typescript
interface Transaction {
  id: string;
  workspace_id: string;
  account_id?: string;
  card_id?: string;

  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;

  // Connection Layer
  linked_goal?: string;      // Se relacionado a um Goal
  linked_initiative?: string; // Se é gasto de uma Initiative

  created_at: Date;
}
```

---

# 4. Proactive Insights Engine

O diferencial do Finance é ser **anti-dashboard**. O app FALA com você.

## 4.1 v0.1 Insights

| Insight | Trigger | Mensagem |
|---------|---------|----------|
| **Spending Spike** | Categoria > 150% média 3 meses | "Você gastou 2x em [X] este mês" |
| **MEI Alert** | Receita anual > 70% de R$81k | "Seu MEI está em X% do limite" |
| **Card Limit** | Uso > 80% do limite | "[Cartão] está em 85% do limite" |
| **Negative Forecast** | Projeção < 0 em 30 dias | "Saldo pode ficar negativo em [data]" |

## 4.2 Integração com Notification System

```yaml
# finance_insights.yaml
triggers:
  - name: spending_spike
    cron: "0 20 * * *"  # Diário às 20h
    condition: category_spend > (avg_3_months * 1.5)
    action:
      type: alert
      channels: [push, in_app]
      title: "Gasto acima do normal"
      body: "{{category}} está {{percent}}% acima da média"
```

---

# 5. Decisão Arquitetural

## 5.1 Opção A: Finance como Módulo Interno

```
ExímIA OS
├── Journey
├── Academy
├── Brand
├── Strategy
├── PrototypOS
└── Finance ← Novo módulo
```

**Prós:** Conexão nativa, UX unificada
**Contras:** Aumenta escopo, atrasa Connection Layer

## 5.2 Opção B: Finance como App Separado + API

```
ExímIA OS ←→ ExímIA Finance (app standalone)
    ↑               ↑
    └───── API ─────┘
```

**Prós:** Ship faster, valida demanda isoladamente
**Contras:** Mais infra, menos conexão

## 5.3 Recomendação (Elon Style)

> **Opção A, mas DEPOIS da Connection Layer funcionar.**

### Sequência Correta:

1. ✅ Connection Layer funcionando (Strategy ↔ Journey)
2. ✅ Validar que cross-module works
3. ⏳ Adicionar Finance como terceiro módulo conectado
4. ⏳ Cada insight financeiro conecta a Goals/Initiatives

**Status Atual:** Aguardando implementação da Connection Layer.

---

# 6. Integração com Outros Módulos

## 6.1 Eventos Emitidos

| Evento | Trigger | Consumidores |
|--------|---------|--------------|
| `transaction.created` | Nova transação | Journey (se linked_goal) |
| `insight.generated` | Insight financeiro | Notifications |
| `budget.exceeded` | Gasto > budget | Notifications, Strategy |
| `goal.milestone` | Meta financeira atingida | Journey, Notifications |

## 6.2 Eventos Consumidos

| Evento | Source | Ação Finance |
|--------|--------|--------------|
| `initiative.created` | Strategy | Sugere criar budget tracking |
| `goal.created` | Journey | Se goal.category = 'finance', link automático |
| `inbox.transaction_captured` | Inbox | Cria transaction automaticamente |

## 6.3 Entity Links

```typescript
// Exemplo: Transaction linkada a Goal
{
  source_module: 'finance',
  source_type: 'transaction',
  source_id: 'txn-123',
  target_module: 'journey',
  target_type: 'goal',
  target_id: 'goal-456',
  relationship: 'contributes_to',
  created_at: new Date()
}
```

---

## API Endpoints (Proposta)

```
# Workspaces
GET    /api/finance/workspaces

# Accounts
GET/POST   /api/finance/accounts
PUT/DELETE /api/finance/accounts/:id

# Cards
GET/POST   /api/finance/cards
PUT/DELETE /api/finance/cards/:id

# Transactions
GET/POST   /api/finance/transactions
PUT/DELETE /api/finance/transactions/:id
GET        /api/finance/transactions/summary

# Insights
GET    /api/finance/insights
POST   /api/finance/insights/:id/dismiss
```

---

## Métricas de Sucesso (Quando Implementado)

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Transaction Frequency** | Transactions / usuário / semana | > 5 |
| **Insight Action Rate** | Insights que geram ação | > 25% |
| **Goal Link Rate** | Transactions com linked_goal | > 30% |
| **Workspace Adoption** | Usuários com ≥2 workspaces | > 40% |

---

## Próximos Passos

### Fase 1: Validação (Q2 2026)
- [ ] Connection Layer implementada e validada
- [ ] Pesquisa com usuários sobre necessidades financeiras
- [ ] Protótipo de tela no Figma

### Fase 2: MVP (Q3 2026)
- [ ] Implementar 7 features core
- [ ] 1 insight proativo funcionando
- [ ] Integração com Journey e Strategy

### Fase 3: Evolução (Q4 2026)
- [ ] AI categorization
- [ ] Open Finance (se viável)
- [ ] Orçamentos

---

## Decisão Final

**Finance NÃO é prioridade para v5.0.**

Prioridades atuais:
1. ✅ Connection Layer (CRÍTICA)
2. ✅ Academy (pilar de receita)
3. ✅ Journey + Strategy cascade
4. ⏳ Inbox + Mobile PWA
5. ⏳ **Depois**: Finance

**Rationale:** Construir Finance antes da Connection Layer funcionar seria criar mais uma ilha. Finance só faz sentido quando a conexão já existe.

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| **1.0** | 25/01/2026 | Proposta inicial extraída do PRD original. Decisão: postergar implementação. |

---

## Referências

- [PRD-Connection-Layer-v5.0.md](../00_Core/PRD-Connection-Layer-v5.0.md) — Pré-requisito
- [PRD-Journey-v5.0.md](../01_Journey/PRD-Journey-v5.0.md) — Integração com Goals
- [PRD-Strategy-v5.0.md](../04_Strategy/PRD-Strategy-v5.0.md) — Budget tracking
- [PRD-Critical-Analysis-v5.0.md](../99_Analysis/PRD-Critical-Analysis-v5.0.md) — Gap identificado

---

*Finance v1.0 — Proposta para o Futuro*
*ExímIA OS — 2026*
