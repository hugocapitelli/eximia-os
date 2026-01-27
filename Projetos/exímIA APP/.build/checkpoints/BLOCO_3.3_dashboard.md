# BLOCO 3.3 - Journey Dashboard

**Fase:** 3 - JOURNEY
**Status:** DONE
**Data:** 27 Janeiro 2026

---

## Escopo

Dashboard agregado do módulo Journey com métricas consolidadas, widgets de goals e habits, AI insights, quick actions e activity feed.

---

## Arquivos Modificados

### Page
- `app/src/app/(dashboard)/journey/page.tsx`
  - Transformado de redirect para dashboard completo
  - Layout responsivo 3 colunas (2+1)
  - Widgets modulares

---

## Features Implementadas

### Metric Cards (Top Row)
- **Active Goals:** Contagem de goals in_progress com total
- **Goal Progress:** Progresso médio de todos os goals
- **Today's Habits:** Percentual de hábitos completados hoje
- **Best Streak:** Maior streak atual entre todos os hábitos

### Goals Widget
- Lista dos goals prioritários (filtrados por status in_progress/not_started)
- Ordenação por prioridade (critical → high → medium → low)
- Progress bar por goal
- Indicador de cor customizada
- Link para página de goals
- Empty state com CTA

### Habits Widget
- CompactHabitList com toggle de completion
- Integração com useHabits para complete/uncomplete
- Mostra até 5 hábitos do dia
- Link para página de habits
- Empty state com CTA

### AI Insights Widget
- Análise inteligente baseada em dados de goals e habits
- **Warnings:**
  - Goals stalled (progress < 25%)
  - Streaks at risk (due today + not completed + streak >= 7)
- **Celebrations:**
  - Long streaks (>= 30 dias)
  - Completed goals
- **Tips:**
  - Sugestões contextuais
- Estilo visual diferenciado por tipo (warning/celebration/tip)

### Quick Actions Widget
- Grid 2x2 de ações rápidas
- Links para: New Goal, New Habit, Review Progress, Inbox
- Cores distintas por ação
- Hover states

### Streaks Overview Widget
- Top 5 hábitos com streaks ativos
- Ordenado por streak (maior primeiro)
- StreakBadge com cores dinâmicas
- Empty state motivacional

### Recent Activity Widget
- Feed de atividades recentes
- Goals completados
- Hábitos completados hoje
- Ícones diferenciados por tipo
- Timestamps relativos
- Empty state

---

## Componentes Internos

```typescript
// Widget container reutilizável
function WidgetCard({ title, icon, action, children })

// AI Insights com análise
function AIInsights({ goals, habits })

// Quick Actions grid
function QuickActions()

// Recent Activity feed
function RecentActivity({ goals, habits })

// Streaks Overview list
function StreaksOverview({ habits })
```

---

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  METRIC CARDS (4 colunas)                                   │
│  [Active Goals] [Goal Progress] [Today's Habits] [Streak]   │
├───────────────────────────────────┬─────────────────────────┤
│  LEFT COLUMN (2/3)                │  RIGHT COLUMN (1/3)     │
│  ┌─────────────────────────────┐  │  ┌───────────────────┐  │
│  │  GOALS WIDGET               │  │  │  AI INSIGHTS      │  │
│  │  - Priority goals list      │  │  │  - Warnings       │  │
│  │  - Progress bars            │  │  │  - Celebrations   │  │
│  │  - View All link            │  │  │  - Tips           │  │
│  └─────────────────────────────┘  │  └───────────────────┘  │
│  ┌─────────────────────────────┐  │  ┌───────────────────┐  │
│  │  HABITS WIDGET              │  │  │  QUICK ACTIONS    │  │
│  │  - Today's habits           │  │  │  - 2x2 grid       │  │
│  │  - Completion toggles       │  │  │  - Colored links  │  │
│  │  - View All link            │  │  └───────────────────┘  │
│  └─────────────────────────────┘  │  ┌───────────────────┐  │
│                                    │  │  STREAKS          │  │
│                                    │  │  - Top streaks    │  │
│                                    │  └───────────────────┘  │
│                                    │  ┌───────────────────┐  │
│                                    │  │  RECENT ACTIVITY  │  │
│                                    │  │  - Activity feed  │  │
│                                    │  └───────────────────┘  │
└───────────────────────────────────┴─────────────────────────┘
```

---

## Dependências

- BLOCO 3.1 (Goals) - useGoals hook, Goal types
- BLOCO 3.2 (Habits) - useHabits hook, HabitWithStatus types
- BLOCO 0.5 (Molecules) - MetricCard
- BLOCO 0.6 (Layout) - DashboardShell, Header
- components/ui - Card, Button, Text, Badge, Spinner, Icons

---

## Hooks Utilizados

```typescript
const { goals, isLoading: goalsLoading } = useGoals({ autoFetch: true });
const { habits, stats, completeHabit, uncompleteHabit, isLoading } = useHabits({ autoFetch: true });
```

---

## Rotas Disponíveis

- `/journey` - Dashboard (este BLOCO)
- `/journey/goals` - Lista de goals (BLOCO 3.1)
- `/journey/goals/[id]` - Detalhe do goal (BLOCO 3.1)
- `/journey/habits` - Lista de habits (BLOCO 3.2)

---

## Testes Sugeridos

1. Carregamento inicial com loading states
2. AI Insights com diferentes cenários de dados
3. Quick completion de habits do dashboard
4. Navegação para páginas de detalhe
5. Empty states quando não há dados
6. Responsividade em diferentes telas

---

*Checkpoint criado em 27/01/2026*
