# Story EXIMIA-043: Event System (Connection Layer Foundation)

**Story ID:** EXIMIA-043
**Epic:** EXIMIA-EPIC-001 (Core Foundation)
**Sprint:** 7
**Pontos:** 8
**Prioridade:** P2 (Média)
**Depende de:** EXIMIA-035 (Profiles), EXIMIA-011 (Journey Schema), EXIMIA-015 (Academy Schema)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter um sistema de eventos entre módulos,
**Para que** ações em um módulo possam disparar reações em outros módulos.

---

## Contexto

O Event System é a base do Connection Layer - permite que módulos se comuniquem de forma desacoplada:
- Academy → Journey: Curso completado desbloqueia skill
- Journey → Brand: Livro lido adiciona expertise
- Journey → Academy: Meta criada sugere cursos relacionados

Esta story implementa a infraestrutura base de eventos.

---

## Acceptance Criteria

### Events Table
- [ ] Tabela `events` criada para armazenar eventos
- [ ] Campos: id, type, payload, user_id, processed, created_at
- [ ] Index para eventos não processados

### Trigger Functions
- [ ] `emit_event()` - Função genérica para disparar eventos
- [ ] Trigger em `enrollments` para `academy.course.enrolled`
- [ ] Trigger em `enrollments` (completion) para `academy.course.completed`
- [ ] Trigger em `books` (completion) para `journey.book.completed`
- [ ] Trigger em `habit_logs` para `journey.habit.completed`

### Event Processing
- [ ] Server Action `processEvents()` para processar eventos pendentes
- [ ] Lógica básica para cada tipo de evento
- [ ] Marcação de eventos como processados

### API Route (Cron trigger)
- [ ] `/api/cron/process-events` para trigger via Vercel Cron

---

## Technical Details

### Migration SQL

```sql
-- supabase/migrations/007_event_system.sql

-- =============================================================================
-- EVENTS TABLE
-- =============================================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event identification
  type TEXT NOT NULL,

  -- Event data
  payload JSONB NOT NULL DEFAULT '{}',

  -- Owner
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Processing status
  processed BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_unprocessed
  ON events(created_at)
  WHERE processed = FALSE;

CREATE INDEX idx_events_type
  ON events(type, created_at DESC);

CREATE INDEX idx_events_user
  ON events(user_id, created_at DESC);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Users can view their own events
CREATE POLICY "Users can view own events" ON events
  FOR SELECT USING (auth.uid() = user_id);

-- System can insert events (via triggers)
CREATE POLICY "System can insert events" ON events
  FOR INSERT WITH CHECK (true);

-- =============================================================================
-- EMIT EVENT FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION emit_event(
  p_event_type TEXT,
  p_payload JSONB,
  p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO events (type, payload, user_id)
  VALUES (p_event_type, p_payload, p_user_id)
  RETURNING id INTO v_event_id;

  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TRIGGER: Course Enrolled
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_course_enrolled()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM emit_event(
    'academy.course.enrolled',
    jsonb_build_object(
      'enrollment_id', NEW.id,
      'course_id', NEW.course_id,
      'enrolled_at', NEW.enrolled_at
    ),
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_enrollment_created
  AFTER INSERT ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_course_enrolled();

-- =============================================================================
-- TRIGGER: Course Completed
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_course_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    PERFORM emit_event(
      'academy.course.completed',
      jsonb_build_object(
        'enrollment_id', NEW.id,
        'course_id', NEW.course_id,
        'completed_at', NEW.completed_at,
        'progress_percent', NEW.progress_percent
      ),
      NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_enrollment_completed
  AFTER UPDATE OF status ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION trigger_course_completed();

-- =============================================================================
-- TRIGGER: Book Completed
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_book_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'completed' AND NEW.status = 'completed' THEN
    PERFORM emit_event(
      'journey.book.completed',
      jsonb_build_object(
        'book_id', NEW.id,
        'title', NEW.title,
        'author', NEW.author,
        'finished_at', NEW.finished_at,
        'rating', NEW.rating
      ),
      NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_book_completed
  AFTER UPDATE OF status ON books
  FOR EACH ROW
  EXECUTE FUNCTION trigger_book_completed();

-- =============================================================================
-- TRIGGER: Habit Completed (Daily)
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_habit_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE AND (OLD IS NULL OR OLD.completed = FALSE) THEN
    PERFORM emit_event(
      'journey.habit.completed',
      jsonb_build_object(
        'habit_log_id', NEW.id,
        'habit_id', NEW.habit_id,
        'log_date', NEW.log_date,
        'completed_at', NEW.completed_at
      ),
      NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_habit_completed
  AFTER INSERT OR UPDATE OF completed ON habit_logs
  FOR EACH ROW
  EXECUTE FUNCTION trigger_habit_completed();
```

### Event Processing Server Action

```typescript
// src/lib/actions/events/process.ts
"use server";

import { createClient } from "@/lib/supabase/server";

const MAX_EVENTS_PER_BATCH = 100;
const MAX_RETRIES = 3;

export async function processEvents() {
  // Use service role for processing
  const supabase = await createClient();

  // Get unprocessed events
  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .eq("processed", false)
    .lt("retry_count", MAX_RETRIES)
    .order("created_at", { ascending: true })
    .limit(MAX_EVENTS_PER_BATCH);

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`);
  }

  const results = {
    processed: 0,
    failed: 0,
    errors: [] as string[],
  };

  for (const event of events || []) {
    try {
      await processEvent(supabase, event);

      // Mark as processed
      await supabase
        .from("events")
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
        })
        .eq("id", event.id);

      results.processed++;
    } catch (err: any) {
      console.error(`Failed to process event ${event.id}:`, err);

      // Increment retry count
      await supabase
        .from("events")
        .update({
          retry_count: event.retry_count + 1,
          error_message: err.message,
        })
        .eq("id", event.id);

      results.failed++;
      results.errors.push(`${event.id}: ${err.message}`);
    }
  }

  return results;
}

async function processEvent(supabase: any, event: any) {
  switch (event.type) {
    case "academy.course.enrolled":
      await handleCourseEnrolled(supabase, event);
      break;

    case "academy.course.completed":
      await handleCourseCompleted(supabase, event);
      break;

    case "journey.book.completed":
      await handleBookCompleted(supabase, event);
      break;

    case "journey.habit.completed":
      await handleHabitCompleted(supabase, event);
      break;

    default:
      console.log(`Unknown event type: ${event.type}`);
  }
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

async function handleCourseEnrolled(supabase: any, event: any) {
  // Update user learning streak
  await supabase.rpc("update_user_streak", {
    p_user_id: event.user_id,
    p_streak_type: "learning",
  });

  // TODO: Create notification
  // TODO: Suggest related goals
}

async function handleCourseCompleted(supabase: any, event: any) {
  // Update user learning streak
  await supabase.rpc("update_user_streak", {
    p_user_id: event.user_id,
    p_streak_type: "learning",
  });

  // TODO: Unlock skills
  // TODO: Issue certificate
  // TODO: Create notification
  // TODO: Update Brand module with new expertise
}

async function handleBookCompleted(supabase: any, event: any) {
  // Update user reading streak
  await supabase.rpc("update_user_streak", {
    p_user_id: event.user_id,
    p_streak_type: "reading",
  });

  // TODO: Check reading goal progress
  // TODO: Suggest related courses
  // TODO: Update Brand module with reading
}

async function handleHabitCompleted(supabase: any, event: any) {
  // Update user habits streak
  await supabase.rpc("update_user_streak", {
    p_user_id: event.user_id,
    p_streak_type: "habits",
  });

  // TODO: Check goal progress if habit linked to goal
  // TODO: Create streak milestone notification
}
```

### API Route for Cron

```typescript
// src/app/api/cron/process-events/route.ts
import { NextResponse } from "next/server";
import { processEvents } from "@/lib/actions/events/process";

export const runtime = "edge";
export const maxDuration = 60;

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await processEvents();
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Event processing error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Vercel Cron Config

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/process-events",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

---

## Tasks

- [ ] Criar migration `007_event_system.sql`
- [ ] Implementar tabela `events`
- [ ] Implementar função `emit_event()`
- [ ] Implementar triggers para cada evento
- [ ] Criar `src/lib/actions/events/process.ts`
- [ ] Criar `/api/cron/process-events/route.ts`
- [ ] Configurar `vercel.json` com cron
- [ ] Testar emissão de eventos (triggers)
- [ ] Testar processamento de eventos
- [ ] Adicionar CRON_SECRET ao .env.example

---

## Definition of Done

- [ ] Events sendo emitidos por triggers
- [ ] Events sendo processados pelo cron
- [ ] Streaks sendo atualizados via eventos
- [ ] Retry logic funcionando
- [ ] Error handling robusto
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── 007_event_system.sql           [CREATE]

src/lib/actions/events/
├── process.ts                      [CREATE]
└── index.ts                        [CREATE]

src/app/api/cron/process-events/
└── route.ts                        [CREATE]

vercel.json                         [CREATE/MODIFY]
.env.example                        [MODIFY - add CRON_SECRET]
```

---

## Future Enhancements (Not in this story)

- Notifications table and handlers
- Entity links between modules
- Suggestion engine
- Real-time subscriptions for events

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] CRON_SECRET validation
- [ ] Retry logic correctness
- [ ] No infinite loops in handlers
- [ ] Transaction safety

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
