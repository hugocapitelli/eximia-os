# Story EXIMIA-023: Academy Socratic Sessions

**Story ID:** EXIMIA-023
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 7
**Pontos:** 13
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-022 (Academy Courses)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** participar de sessões de aprendizado Socrático com IA,
**Para que** eu possa aprender de forma ativa através de perguntas e reflexões guiadas.

---

## Contexto

Implementação do método Socrático com IA — ao invés de dar respostas diretas,
a IA guia o aprendizado através de perguntas que estimulam o pensamento crítico.
Vinculado a tópicos dos cursos.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Academy/ACADEMY_SESSOES_SOCRATICAS.md` | Wireframes, fluxo de perguntas, interfaces |
| **Mock Data** | `app/src/data/academy-socratic-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/academy-socratic.ts` | SocraticSession, Question interfaces |

---

## Acceptance Criteria

### Início de Sessão
- [ ] Seleção de tópico (vinculado a curso/módulo ou livre)
- [ ] Nível de dificuldade (iniciante, intermediário, avançado)
- [ ] Duração estimada da sessão
- [ ] Botão "Iniciar Sessão Socrática"

### Interface de Diálogo
- [ ] Chat-like interface com perguntas da IA
- [ ] Área de resposta do usuário (texto)
- [ ] Opção "Me dê uma dica" (ajuda sem dar resposta)
- [ ] Opção "Pular esta pergunta"
- [ ] Progress bar da sessão
- [ ] Contador de perguntas (3/10)

### Fluxo Socrático
- [ ] IA inicia com pergunta aberta sobre o tópico
- [ ] Baseado na resposta, IA faz follow-up questions
- [ ] Se usuário está no caminho certo: encorajamento + próxima pergunta
- [ ] Se usuário está confuso: pergunta mais simples ou dica
- [ ] Se usuário pede ajuda: dica sem resposta direta
- [ ] Ao final: resumo do que foi aprendido

### Finalização
- [ ] Resumo da sessão (pontos abordados)
- [ ] XP ganho pela sessão
- [ ] Insights/reflexões do usuário (salvar)
- [ ] Sugestão de próximo tópico
- [ ] Opção de salvar sessão para revisão

### Histórico
- [ ] Lista de sessões anteriores
- [ ] Replay/revisão de sessão
- [ ] Stats: sessões completadas, tópicos abordados

---

## Technical Details

### Database Schema

```sql
-- Socratic Sessions
CREATE TABLE socratic_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Topic
  topic TEXT NOT NULL,
  topic_type TEXT DEFAULT 'free' CHECK (topic_type IN ('course', 'module', 'lesson', 'free')),
  linked_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  linked_module_id UUID REFERENCES course_modules(id) ON DELETE SET NULL,
  linked_lesson_id UUID REFERENCES course_lessons(id) ON DELETE SET NULL,

  -- Config
  difficulty TEXT DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  estimated_minutes INTEGER DEFAULT 15,

  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Results
  questions_count INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  hints_used INTEGER DEFAULT 0,
  skipped_count INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,

  -- Summary
  summary TEXT,
  key_insights TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Session Messages (dialogue history)
CREATE TABLE socratic_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES socratic_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('assistant', 'user')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'question' CHECK (message_type IN ('question', 'answer', 'hint', 'encouragement', 'summary')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_socratic_sessions_user ON socratic_sessions(user_id);
CREATE INDEX idx_socratic_messages_session ON socratic_messages(session_id);

-- RLS
ALTER TABLE socratic_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE socratic_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions" ON socratic_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own messages" ON socratic_messages FOR ALL
  USING (session_id IN (SELECT id FROM socratic_sessions WHERE user_id = auth.uid()));
```

### Server Actions & AI Integration

```typescript
// lib/actions/socratic.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSocraticQuestion, analyzeSocraticResponse } from "@/lib/ai/socratic";

export async function startSocraticSession(data: {
  topic: string;
  difficulty: string;
  linkedCourseId?: string;
  linkedModuleId?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Create session
  const { data: session, error } = await supabase
    .from("socratic_sessions")
    .insert({
      user_id: user.id,
      topic: data.topic,
      difficulty: data.difficulty,
      linked_course_id: data.linkedCourseId,
      linked_module_id: data.linkedModuleId,
    })
    .select()
    .single();

  if (error) throw error;

  // Generate first question
  const firstQuestion = await generateSocraticQuestion({
    topic: data.topic,
    difficulty: data.difficulty,
    isFirst: true,
  });

  // Save first question
  await supabase.from("socratic_messages").insert({
    session_id: session.id,
    role: "assistant",
    content: firstQuestion,
    message_type: "question",
  });

  return {
    sessionId: session.id,
    firstQuestion,
  };
}

export async function sendSocraticResponse(sessionId: string, userResponse: string) {
  const supabase = await createClient();

  // Get session context
  const { data: session } = await supabase
    .from("socratic_sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  // Get message history
  const { data: messages } = await supabase
    .from("socratic_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  // Save user response
  await supabase.from("socratic_messages").insert({
    session_id: sessionId,
    role: "user",
    content: userResponse,
    message_type: "answer",
  });

  // Analyze response and generate next question
  const aiResponse = await analyzeSocraticResponse({
    topic: session!.topic,
    difficulty: session!.difficulty,
    history: messages || [],
    userResponse,
    questionsAnswered: session!.questions_answered,
  });

  // Save AI response
  await supabase.from("socratic_messages").insert({
    session_id: sessionId,
    role: "assistant",
    content: aiResponse.content,
    message_type: aiResponse.type, // 'question', 'encouragement', 'summary'
  });

  // Update session stats
  await supabase
    .from("socratic_sessions")
    .update({
      questions_answered: session!.questions_answered + 1,
      status: aiResponse.isComplete ? "completed" : "in_progress",
      completed_at: aiResponse.isComplete ? new Date().toISOString() : null,
      xp_earned: aiResponse.isComplete ? calculateXP(session!) : session!.xp_earned,
      summary: aiResponse.summary,
      key_insights: aiResponse.keyInsights,
    })
    .eq("id", sessionId);

  return {
    response: aiResponse.content,
    type: aiResponse.type,
    isComplete: aiResponse.isComplete,
    summary: aiResponse.summary,
    xpEarned: aiResponse.isComplete ? calculateXP(session!) : 0,
  };
}

export async function requestHint(sessionId: string) {
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("socratic_sessions")
    .select("*, messages:socratic_messages(*)")
    .eq("id", sessionId)
    .single();

  const hint = await generateSocraticQuestion({
    topic: session!.topic,
    difficulty: session!.difficulty,
    history: session!.messages,
    requestHint: true,
  });

  // Save hint
  await supabase.from("socratic_messages").insert({
    session_id: sessionId,
    role: "assistant",
    content: hint,
    message_type: "hint",
  });

  // Update hints count
  await supabase
    .from("socratic_sessions")
    .update({ hints_used: session!.hints_used + 1 })
    .eq("id", sessionId);

  return { hint };
}

function calculateXP(session: any): number {
  const baseXP = 50;
  const questionBonus = session.questions_answered * 10;
  const hintPenalty = session.hints_used * 5;
  const skipPenalty = session.skipped_count * 10;
  const difficultyMultiplier = session.difficulty === "advanced" ? 1.5 :
                               session.difficulty === "intermediate" ? 1.2 : 1;

  return Math.max(10, Math.round((baseXP + questionBonus - hintPenalty - skipPenalty) * difficultyMultiplier));
}
```

### AI Prompt for Socratic Method

```typescript
// lib/ai/socratic.ts
export async function generateSocraticQuestion(params: {
  topic: string;
  difficulty: string;
  history?: any[];
  isFirst?: boolean;
  requestHint?: boolean;
}) {
  const systemPrompt = `Você é um tutor Socrático especialista.
Seu papel é guiar o aprendizado através de PERGUNTAS, nunca dando respostas diretas.

Princípios:
1. Faça perguntas abertas que estimulem reflexão
2. Se o aluno está no caminho certo, reconheça e aprofunde
3. Se está confuso, simplifique com perguntas menores
4. Nunca dê a resposta, mas guie até ela
5. Use linguagem ${params.difficulty === 'beginner' ? 'simples e acessível' : 'técnica apropriada'}

${params.requestHint ? 'O aluno pediu uma DICA. Dê uma dica que ajude a pensar na direção certa, mas NÃO dê a resposta.' : ''}

Tópico: ${params.topic}`;

  // Call AI API (OpenAI/Anthropic)
  // ... implementation
}
```

---

## Tasks

- [ ] Criar migration para socratic_sessions e socratic_messages
- [ ] Implementar AI integration para método socrático
- [ ] Criar página /academy/socratic
- [ ] Implementar StartSessionModal
- [ ] Criar SocraticChat component
- [ ] Implementar fluxo de perguntas e respostas
- [ ] Criar botões de Dica e Pular
- [ ] Implementar finalização com resumo
- [ ] Criar histórico de sessões
- [ ] Integrar XP system
- [ ] Loading states e error handling
- [ ] Testes com diferentes tópicos

---

## Definition of Done

- [ ] Iniciar sessão socrática funcionando
- [ ] Fluxo de diálogo com IA operacional
- [ ] Dicas e pular funcionando
- [ ] Finalização com resumo e XP
- [ ] Histórico de sessões
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_academy_socratic.sql            [CREATE]

app/(dashboard)/academy/socratic/
├── page.tsx                            [CREATE]
└── [sessionId]/
    └── page.tsx                        [CREATE]

components/academy/
├── StartSocraticModal.tsx              [CREATE]
├── SocraticChat.tsx                    [CREATE]
├── SocraticMessage.tsx                 [CREATE]
├── SocraticProgress.tsx                [CREATE]
├── SocraticSummary.tsx                 [CREATE]
├── SessionHistory.tsx                  [CREATE]
└── index.ts                            [MODIFY]

lib/actions/
└── socratic.ts                         [CREATE]

lib/ai/
└── socratic.ts                         [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"academy.socratic.started" { session_id, topic, difficulty }
"academy.socratic.message.sent" { session_id }
"academy.socratic.hint.requested" { session_id }
"academy.socratic.completed" { session_id, xp_earned, questions_answered }

// Eventos consumidos
"academy.course.lesson.completed" → Sugerir sessão socrática sobre o tópico
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
