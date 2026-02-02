# Journey Meta Detail

## Visão Geral

**Módulo:** Journey
**Tela:** Meta Detail (Goal Detail)
**Prioridade:** P0 (MVP)
**Status:** Especificação Completa

**Propósito:** Visualizar todos os detalhes de uma meta específica — progresso, Key Results, metas filhas, timeline de atividades, links com outras entidades e ações disponíveis.

---

## Wireframe Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Voltar para Metas                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  🎯 Lançar MVP do ExímIA APP                                    │   │
│  │                                                                  │   │
│  │  Entregar a primeira versão funcional do ExímIA APP com         │   │
│  │  módulos Journey e Academy funcionando para 100 beta testers.   │   │
│  │                                                                  │   │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━●━━━━━━━━━━━━━━  65%                │   │
│  │                                                                  │   │
│  │  📅 15 Mar 2026  │  🟢 On Track  │  Criada há 45 dias           │   │
│  │                                                                  │   │
│  │  [Editar]  [Marcar Completa]  [Arquivar]  [···]                 │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────┐  ┌─────────────────────────────────┐  │
│  │ 📊 KEY RESULTS          2/4 │  │ 🔗 HIERARQUIA                   │  │
│  ├─────────────────────────────┤  ├─────────────────────────────────┤  │
│  │                             │  │                                 │  │
│  │ [✓] 100 usuários beta       │  │ ↑ Meta Pai:                     │  │
│  │     100/100 ━━━━━━━━━━━━━━  │  │   📅 Lançar ExímIA para 1000   │  │
│  │                             │  │      usuários (Ano)             │  │
│  │ [✓] NPS acima de 50         │  │                                 │  │
│  │     62/50 ━━━━━━━━━━━━━━━━  │  │ ↓ Metas Filhas (3):             │  │
│  │                             │  │   ├─ Design System completo ✓   │  │
│  │ [ ] Churn < 5%              │  │   ├─ Auth implementado 🟢       │  │
│  │     8/5 ━━━━━━━━●━━━━━      │  │   └─ Academy MVP 🟡             │  │
│  │                             │  │                                 │  │
│  │ [ ] MRR R$ 5K               │  │ [+ Criar Meta Filha]            │  │
│  │     2K/5K ━━━━●━━━━━━━━━    │  │                                 │  │
│  │                             │  │                                 │  │
│  │ [+ Adicionar KR]            │  │                                 │  │
│  │                             │  │                                 │  │
│  └─────────────────────────────┘  └─────────────────────────────────┘  │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔗 CONEXÕES                                                      │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  📚 Academy                        🔄 Hábitos                    │   │
│  │  ├─ Product Management 101         ├─ Deep Work 2h/dia          │   │
│  │  └─ UX Design Fundamentals         └─ Code Review diário        │   │
│  │                                                                  │   │
│  │  📈 Strategy                                                     │   │
│  │  └─ Iniciativa: Product-Led Growth                              │   │
│  │                                                                  │   │
│  │  [+ Vincular Entidade]                                          │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📝 TIMELINE DE ATIVIDADES                                        │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  Hoje                                                            │   │
│  │  ├── 14:30  KR "100 usuários" atingido 🎉                       │   │
│  │  └── 10:00  Progresso atualizado para 65%                       │   │
│  │                                                                  │   │
│  │  Ontem                                                           │   │
│  │  ├── 16:00  Comentário: "Feedback positivo dos testers"         │   │
│  │  └── 09:00  Meta filha "Auth" marcada como concluída            │   │
│  │                                                                  │   │
│  │  28 Jan                                                          │   │
│  │  └── 11:30  Curso "UX Design" vinculado                         │   │
│  │                                                                  │   │
│  │  [Carregar mais...]                                              │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 💬 NOTAS E COMENTÁRIOS                           [+ Adicionar]   │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  📝 28 Jan 2026, 16:00                                          │   │
│  │  Feedback muito positivo dos beta testers. Próximo passo é      │   │
│  │  focar em resolver os bugs reportados antes do launch.          │   │
│  │                                                                  │   │
│  │  📝 20 Jan 2026, 10:30                                          │   │
│  │  Primeira versão do Academy funcionando. Falta integrar com     │   │
│  │  o sistema de progresso.                                        │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Seções Detalhadas

### Header da Meta

```typescript
interface GoalHeader {
  id: string;
  title: string;
  description: string;
  progress: number;
  dueDate: Date | null;
  health: 'on_track' | 'at_risk' | 'behind';
  createdAt: Date;
  horizon: GoalHorizon;
  area: string;
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}
```

### Key Results Section

```typescript
interface KeyResult {
  id: string;
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  completed: boolean;
  progress: number;       // calculated: currentValue / targetValue * 100
  trend: 'up' | 'down' | 'stable';
  lastUpdatedAt: Date;
}
```

**Interações:**
- Click no KR expande para edição inline
- Input direto do valor atual
- Botão para marcar como completo

### Hierarquia Section

```typescript
interface GoalHierarchy {
  parentGoal: Goal | null;
  childGoals: Goal[];
  siblingGoals: Goal[];    // outros filhos do mesmo pai
}
```

**Navegação:**
- Click na meta pai → navega para detalhe
- Click na meta filha → navega para detalhe
- Criar meta filha → abre modal com parent pré-definido

### Conexões Section

```typescript
interface GoalConnections {
  linkedCourses: Course[];
  linkedHabits: Habit[];
  linkedInitiatives: Initiative[];
  linkedBooks: Book[];
  suggestedConnections: SuggestedConnection[];
}

interface SuggestedConnection {
  type: 'course' | 'habit' | 'book';
  entity: any;
  reason: string;
  confidence: number;
}
```

### Timeline Section

```typescript
interface GoalActivity {
  id: string;
  type: 'progress_update' | 'kr_completed' | 'note_added' | 'link_added' |
        'child_completed' | 'status_changed' | 'comment';
  description: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}
```

### Notas Section

```typescript
interface GoalNote {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Ações Disponíveis

### Header Actions

| Ação | Descrição |
|------|-----------|
| **Editar** | Abre modal de edição completa |
| **Marcar Completa** | Marca a meta como 100% concluída |
| **Arquivar** | Move para arquivo (não aparece mais na lista) |
| **Duplicar** | Cria cópia da meta |
| **Excluir** | Remove permanentemente (com confirmação) |

### Menu Overflow (···)

- Definir como Foco do Dia
- Compartilhar (futuro)
- Exportar
- Ver Histórico Completo

---

## Integração Connection Layer

```
Events Emitidos:
- goal.viewed { goal_id, user_id }
- goal.progress.updated { goal_id, old_value, new_value }
- goal.kr.updated { goal_id, kr_id, value }
- goal.note.added { goal_id, note_id }
- goal.link.created { goal_id, linked_entity_type, linked_entity_id }
- goal.completed { goal_id, duration_days }

Events Consumidos:
- habit.completed → Atualiza conexões
- course.progress.updated → Sugere atualizar progresso da meta
- initiative.updated → Sincroniza se vinculada
```

---

## AI Features

### Sugestões Automáticas

```
┌─────────────────────────────────────────────────────────────────────┐
│ 💡 SUGESTÕES DA IA                                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  📚 Curso recomendado: "Agile Product Development"                 │
│     Relevância: 87%  │  [Ver Curso] [Ignorar]                      │
│                                                                     │
│  🔄 Hábito sugerido: "Code Review 30min/dia"                       │
│     Baseado em metas similares  │  [Criar] [Ignorar]               │
│                                                                     │
│  ⚠️ Alerta: Progresso abaixo do esperado para a data               │
│     Sugestão: Dividir em sub-metas menores                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Estados da UI

### Loading State
- Skeleton para header
- Skeleton para cada seção

### Error State
```
Meta não encontrada ou você não tem permissão para visualizá-la.
[Voltar para Metas]
```

### Completed State
- Header com badge verde "Concluída"
- Confetti animation ao marcar como completa
- Ações mudam para "Reabrir" e "Arquivar"

---

## Responsividade

### Desktop (≥1024px)
- Layout 2 colunas para KRs e Hierarquia
- Sidebar com conexões

### Tablet (768px-1023px)
- Stack vertical
- Cards colapsáveis

### Mobile (<768px)
- Tudo em stack vertical
- Bottom sheet para ações
- Swipe para navegar entre metas

---

## Dados Mock (Referência)

**Localização:** `app/src/data/journey-meta-detail-mock.ts`

```typescript
export const MOCK_GOAL_DETAIL: GoalDetail = {
  // ... dados mock completos
};
```
