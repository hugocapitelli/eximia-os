# Story EXIMIA-021: Journey Calendar

**Story ID:** EXIMIA-021
**Epic:** EXIMIA-EPIC-004 (Journey Module)
**Sprint:** 6
**Pontos:** 13
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-013 (Journey UI)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** visualizar meus compromissos, hábitos e deadlines de metas em um calendário,
**Para que** eu possa planejar minha semana e fazer time blocking eficiente.

---

## Contexto

Calendário integrado ao Journey que consolida hábitos, deadlines de metas,
eventos pessoais e permite time blocking. Opcional: sync com Google Calendar.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Journey/JOURNEY_CALENDARIO.md` | Wireframes, interfaces TypeScript, eventos |
| **Mock Data** | `app/src/data/journey-calendario-mock.ts` | Dados de exemplo para desenvolvimento |
| **Types** | `app/src/types/journey-calendar.ts` | CalendarEvent, TimeBlock interfaces |

---

## Acceptance Criteria

### Visualizações
- [ ] View Dia: timeline vertical com slots de hora
- [ ] View Semana: 7 colunas com eventos
- [ ] View Mês: grid tradicional com dots/badges
- [ ] Navegação entre períodos (anterior/próximo)
- [ ] Botão "Hoje" para voltar à data atual

### Tipos de Eventos
- [ ] Hábitos recorrentes (auto-gerados)
- [ ] Deadlines de metas (auto-gerados)
- [ ] Time blocks (criados pelo usuário)
- [ ] Eventos externos (Google Calendar - opcional)

### Time Blocking
- [ ] Criar time block com drag & drop
- [ ] Editar time block (título, cor, horário)
- [ ] Deletar time block
- [ ] Cores por categoria (work, personal, focus, break)

### Modal de Evento
- [ ] Ver detalhes do evento
- [ ] Distinguir tipo (hábito, meta, time block)
- [ ] Link para entidade original (se aplicável)

### Integração Google Calendar (Opcional/Futuro)
- [ ] OAuth connect com Google
- [ ] Importar eventos do Google Calendar
- [ ] Exibir eventos externos com estilo diferenciado
- [ ] Read-only (não editar eventos do Google)

---

## Technical Details

### Database Schema

```sql
-- Calendar Events (user-created)
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT false,

  -- Type & categorization
  event_type TEXT DEFAULT 'time_block' CHECK (event_type IN ('time_block', 'deadline', 'habit', 'external')),
  category TEXT DEFAULT 'default' CHECK (category IN ('work', 'personal', 'focus', 'break', 'default')),
  color TEXT,

  -- Linked entities
  goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  habit_id UUID REFERENCES habits(id) ON DELETE SET NULL,
  external_id TEXT, -- Google Calendar event ID

  -- Recurrence
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT, -- iCal RRULE format

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Google Calendar Integration
CREATE TABLE calendar_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google')),
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  calendar_id TEXT, -- primary calendar ID
  sync_enabled BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Indexes
CREATE INDEX idx_calendar_events_user ON calendar_events(user_id);
CREATE INDEX idx_calendar_events_time ON calendar_events(user_id, start_time, end_time);

-- RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own events" ON calendar_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own integrations" ON calendar_integrations FOR ALL USING (auth.uid() = user_id);
```

### Server Actions

```typescript
// lib/actions/calendar.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  event_type: 'time_block' | 'deadline' | 'habit' | 'external';
  category: string;
  color: string | null;
  goal_id: string | null;
  habit_id: string | null;
}

export async function getCalendarEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get user-created events
  const { data: events, error } = await supabase
    .from("calendar_events")
    .select("*")
    .eq("user_id", user.id)
    .gte("start_time", startDate)
    .lte("end_time", endDate);

  if (error) throw error;

  // Get habits for the period (generate recurring events)
  const { data: habits } = await supabase
    .from("habits")
    .select("id, name, frequency, preferred_time, color")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const habitEvents = generateHabitEvents(habits || [], startDate, endDate);

  // Get goal deadlines
  const { data: goals } = await supabase
    .from("goals")
    .select("id, title, due_date")
    .eq("user_id", user.id)
    .gte("due_date", startDate)
    .lte("due_date", endDate)
    .in("status", ["active", "in_progress"]);

  const deadlineEvents = (goals || []).map((goal) => ({
    id: `deadline-${goal.id}`,
    title: `📌 ${goal.title}`,
    start_time: goal.due_date,
    end_time: goal.due_date,
    event_type: "deadline" as const,
    category: "default",
    color: "#EF4444",
    goal_id: goal.id,
    habit_id: null,
  }));

  return [...(events || []), ...habitEvents, ...deadlineEvents];
}

export async function createTimeBlock(data: {
  title: string;
  start_time: string;
  end_time: string;
  category: string;
  color?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("calendar_events").insert({
    ...data,
    user_id: user.id,
    event_type: "time_block",
  });

  if (error) throw error;
  revalidatePath("/journey/calendar");
}

export async function updateTimeBlock(id: string, data: Partial<CalendarEvent>) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("calendar_events")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/journey/calendar");
}

export async function deleteTimeBlock(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("calendar_events").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/journey/calendar");
}

// Helper to generate habit events
function generateHabitEvents(habits: any[], startDate: string, endDate: string) {
  const events: CalendarEvent[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (const habit of habits) {
    let current = new Date(start);

    while (current <= end) {
      if (shouldShowHabit(habit.frequency, current)) {
        const time = habit.preferred_time || "09:00";
        const eventStart = new Date(current);
        eventStart.setHours(parseInt(time.split(":")[0]), parseInt(time.split(":")[1]));

        const eventEnd = new Date(eventStart);
        eventEnd.setMinutes(eventEnd.getMinutes() + 30);

        events.push({
          id: `habit-${habit.id}-${current.toISOString().split("T")[0]}`,
          title: `🔄 ${habit.name}`,
          start_time: eventStart.toISOString(),
          end_time: eventEnd.toISOString(),
          event_type: "habit",
          category: "personal",
          color: habit.color || "#10B981",
          goal_id: null,
          habit_id: habit.id,
        });
      }
      current.setDate(current.getDate() + 1);
    }
  }

  return events;
}

function shouldShowHabit(frequency: string, date: Date): boolean {
  const day = date.getDay();
  switch (frequency) {
    case "daily": return true;
    case "weekdays": return day >= 1 && day <= 5;
    case "weekends": return day === 0 || day === 6;
    default: return false;
  }
}
```

---

## Tasks

- [ ] Criar migration para calendar_events e calendar_integrations
- [ ] Implementar server actions para CRUD de eventos
- [ ] Criar página /journey/calendar
- [ ] Implementar view Dia com timeline
- [ ] Implementar view Semana
- [ ] Implementar view Mês
- [ ] Criar componente CalendarEventCard
- [ ] Implementar drag & drop para time blocks
- [ ] Criar modal de criação/edição de time block
- [ ] Gerar eventos de hábitos automaticamente
- [ ] Gerar eventos de deadlines automaticamente
- [ ] Loading states e navegação entre períodos
- [ ] (Opcional) Google Calendar OAuth integration

---

## Definition of Done

- [ ] 3 views funcionando (Dia, Semana, Mês)
- [ ] Time blocks criáveis e editáveis
- [ ] Hábitos e deadlines exibidos automaticamente
- [ ] Navegação entre períodos
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_journey_calendar.sql            [CREATE]

app/(dashboard)/journey/calendar/
└── page.tsx                            [CREATE]

components/journey/calendar/
├── CalendarHeader.tsx                  [CREATE]
├── DayView.tsx                         [CREATE]
├── WeekView.tsx                        [CREATE]
├── MonthView.tsx                       [CREATE]
├── CalendarEventCard.tsx               [CREATE]
├── TimeBlockModal.tsx                  [CREATE]
├── EventDetailModal.tsx                [CREATE]
└── index.ts                            [CREATE]

lib/actions/
└── calendar.ts                         [CREATE]

app/src/types/
└── journey-calendar.ts                 [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"journey.calendar.viewed" { view_mode, date_range }
"journey.timeblock.created" { event_id, start, end }
"journey.timeblock.updated" { event_id, changes }
"journey.timeblock.deleted" { event_id }

// Eventos consumidos
"journey.habit.created" → Regenerar eventos de hábitos
"journey.goal.updated" → Atualizar deadline events
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
