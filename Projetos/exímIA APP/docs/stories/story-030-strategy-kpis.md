# Story EXIMIA-030: Strategy KPIs Dashboard

**Story ID:** EXIMIA-030
**Epic:** EXIMIA-EPIC-008 (Strategy Module)
**Sprint:** 10
**Pontos:** 8
**Prioridade:** P2 (Média)
**Depende de:** EXIMIA-026 (Strategy Schema)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** monitorar meus KPIs (Key Performance Indicators) em um dashboard,
**Para que** eu possa acompanhar a saúde do meu negócio em tempo real.

---

## Contexto

Dashboard de KPIs com métricas configuráveis, thresholds de alerta,
histórico de valores e visualização de tendências.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Strategy/STRATEGY_KPIS.md` | Wireframes, interfaces |
| **Mock Data** | `app/src/data/strategy-kpis-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/strategy.ts` | KPI, KPIValue interfaces |

---

## Acceptance Criteria

### Dashboard de KPIs
- [ ] Grid de KPI cards organizados por categoria
- [ ] Status visual (verde/amarelo/vermelho)
- [ ] Valor atual e meta
- [ ] Trend indicator (up/down/stable)
- [ ] Filtros por categoria
- [ ] Busca por nome

### KPI Card
- [ ] Nome e ícone
- [ ] Valor atual grande
- [ ] Meta e % do target
- [ ] Trend com % de mudança
- [ ] Borda colorida pelo status
- [ ] Sparkline do histórico (opcional)

### Modal Criar/Editar KPI
- [ ] Nome e descrição
- [ ] Categoria (dropdown ou nova)
- [ ] Valor atual e meta
- [ ] Unidade (R$, %, users, etc.)
- [ ] Thresholds: verde, amarelo, vermelho
- [ ] Flag "menor é melhor"
- [ ] Frequência de atualização
- [ ] Destacar no dashboard

### Atualização de Valor
- [ ] Input rápido no card
- [ ] Ou modal com nota
- [ ] Histórico de valores
- [ ] Auto-cálculo de trend

### Histórico e Gráfico
- [ ] Gráfico de linha do histórico
- [ ] Período selecionável (7d, 30d, 90d, 1y)
- [ ] Linha de meta sobreposta
- [ ] Hover com detalhes

### Alertas
- [ ] Notificação quando KPI muda de status
- [ ] Lista de KPIs em alerta

---

## Technical Details

### Server Actions

```typescript
// lib/actions/kpis.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getKPIs(filters?: { category?: string; search?: string }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let query = supabase
    .from("kpis")
    .select("*")
    .eq("user_id", user.id)
    .order("display_order");

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.search) {
    query = query.ilike("name", `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getKPICategories() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data } = await supabase
    .from("kpis")
    .select("category")
    .eq("user_id", user.id);

  const categories = [...new Set(data?.map(k => k.category) || [])];
  return categories;
}

export async function createKPI(data: {
  name: string;
  description?: string;
  category: string;
  current_value: number;
  target_value: number;
  unit: string;
  threshold_green: number;
  threshold_yellow: number;
  threshold_red: number;
  is_lower_better?: boolean;
  icon?: string;
  is_highlighted?: boolean;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Calculate initial status
  const status = calculateKPIStatus(
    data.current_value,
    data.threshold_green,
    data.threshold_yellow,
    data.is_lower_better || false
  );

  const { data: kpi, error } = await supabase
    .from("kpis")
    .insert({
      ...data,
      user_id: user.id,
      status,
      last_updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;

  // Record initial value
  await supabase.from("kpi_values").insert({
    kpi_id: kpi.id,
    value: data.current_value,
  });

  revalidatePath("/strategy/kpis");
  return kpi;
}

export async function updateKPIValue(kpiId: string, newValue: number, note?: string) {
  const supabase = await createClient();

  // Get KPI details
  const { data: kpi } = await supabase
    .from("kpis")
    .select("current_value, threshold_green, threshold_yellow, is_lower_better")
    .eq("id", kpiId)
    .single();

  if (!kpi) throw new Error("KPI not found");

  // Calculate trend
  const trendValue = kpi.current_value !== 0
    ? ((newValue - kpi.current_value) / kpi.current_value) * 100
    : 0;

  const trendDirection = trendValue > 1 ? 'up' : trendValue < -1 ? 'down' : 'stable';

  // Calculate new status
  const status = calculateKPIStatus(
    newValue,
    kpi.threshold_green,
    kpi.threshold_yellow,
    kpi.is_lower_better
  );

  // Update KPI
  const { error } = await supabase
    .from("kpis")
    .update({
      current_value: newValue,
      trend_value: Math.round(trendValue * 10) / 10,
      trend_direction: trendDirection,
      status,
      last_updated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", kpiId);

  if (error) throw error;

  // Record value
  await supabase.from("kpi_values").insert({
    kpi_id: kpiId,
    value: newValue,
    note,
  });

  revalidatePath("/strategy/kpis");
}

export async function getKPIHistory(kpiId: string, days: number = 30) {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("kpi_values")
    .select("*")
    .eq("kpi_id", kpiId)
    .gte("recorded_at", startDate.toISOString())
    .order("recorded_at", { ascending: true });

  if (error) throw error;
  return data;
}

function calculateKPIStatus(
  value: number,
  greenThreshold: number,
  yellowThreshold: number,
  isLowerBetter: boolean
): 'green' | 'yellow' | 'red' {
  if (isLowerBetter) {
    if (value <= greenThreshold) return 'green';
    if (value <= yellowThreshold) return 'yellow';
    return 'red';
  } else {
    if (value >= greenThreshold) return 'green';
    if (value >= yellowThreshold) return 'yellow';
    return 'red';
  }
}
```

---

## Tasks

- [ ] Implementar server actions para KPIs
- [ ] Criar página /strategy/kpis
- [ ] Implementar KPICard component
- [ ] Criar KPIGrid with categories
- [ ] Implementar CreateKPIModal
- [ ] Criar UpdateValueModal/Input
- [ ] Implementar KPIDetailModal com gráfico
- [ ] Adicionar sparklines nos cards
- [ ] Filtros por categoria
- [ ] Seção de alertas
- [ ] Loading e empty states

---

## Definition of Done

- [ ] CRUD de KPIs funcionando
- [ ] Atualização com histórico
- [ ] Status calculando corretamente
- [ ] Trend indicator funcionando
- [ ] Gráfico de histórico
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/(dashboard)/strategy/kpis/
└── page.tsx                            [CREATE]

components/strategy/
├── KPICard.tsx                         [CREATE]
├── KPIGrid.tsx                         [CREATE]
├── CreateKPIModal.tsx                  [CREATE]
├── UpdateKPIValueModal.tsx             [CREATE]
├── KPIDetailModal.tsx                  [CREATE]
├── KPISparkline.tsx                    [CREATE]
├── KPIHistoryChart.tsx                 [CREATE]
├── KPIAlertsList.tsx                   [CREATE]
└── index.ts                            [MODIFY]

lib/actions/
└── kpis.ts                             [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"strategy.kpi.created" { kpi_id, name, category }
"strategy.kpi.updated" { kpi_id, old_value, new_value }
"strategy.kpi.status.changed" { kpi_id, old_status, new_status }

// Eventos consumidos
// Possível integração futura com fontes externas (Stripe, Analytics, etc.)
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
