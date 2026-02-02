# Story EXIMIA-042: Socratic Chat Backend (Claude Integration)

**Story ID:** EXIMIA-042
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 6
**Pontos:** 13
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-041 (Academy Server Actions), EXIMIA-015 (Academy Schema)

---

## User Story

**Como** aluno do exímIA APP,
**Quero** ter uma experiência de aprendizado socrático com IA,
**Para que** eu possa aprender através de questionamento guiado ao invés de respostas diretas.

---

## Contexto

O chat Socrático é o diferencial do Academy. A IA nunca dá respostas diretas - sempre guia através de perguntas em três níveis:
1. **Clarificação** - "O que você quer dizer com...?"
2. **Desafio** - "E se considerássemos o oposto...?"
3. **Síntese** - "Como isso se conecta com...?"

Esta story implementa o backend do chat com integração ao Claude API.

---

## Acceptance Criteria

### Session Management
- [ ] `startSocraticSession(lessonId)` - Criar/retomar sessão
- [ ] `getSocraticSession(sessionId)` - Obter sessão com histórico
- [ ] `getSocraticSessions(lessonId)` - Listar sessões de uma lição

### Chat API
- [ ] `sendSocraticMessage(sessionId, message)` - Enviar mensagem e receber resposta
- [ ] Rate limiting (10 mensagens/minuto por usuário)
- [ ] Classificação automática de tipo de resposta (clarification, challenge, synthesis, feedback)

### System Prompt
- [ ] Prompt Socrático configurável por lição
- [ ] Fallback para prompt padrão
- [ ] Contexto da lição incluído no prompt

### Storage
- [ ] Messages armazenadas em JSONB
- [ ] Message count tracking
- [ ] Last message timestamp

### Error Handling
- [ ] Timeout handling (30s max)
- [ ] Token limit handling
- [ ] API error handling

---

## Technical Details

### Environment Variables

```env
# .env.local (server-only)
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Dependencies

```json
{
  "dependencies": {
    "@anthropic-ai/sdk": "^0.32.0"
  }
}
```

### Socratic Server Actions

```typescript
// src/lib/actions/academy/socratic.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { revalidatePath } from "next/cache";

// =============================================================================
// CONSTANTS
// =============================================================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const DEFAULT_SOCRATIC_PROMPT = `Você é um tutor socrático especializado em educação transformadora.

## Princípios Fundamentais:
1. **NUNCA dê respostas diretas** — sempre guie através de perguntas
2. **Use três níveis de questionamento:**
   - Clarificação: "O que você quer dizer com...?" / "Pode me explicar melhor...?"
   - Desafio: "E se considerássemos o oposto...?" / "Qual seria a contra-argumentação?"
   - Síntese: "Como isso se conecta com...?" / "Consegue resumir em suas palavras?"
3. **Reconheça insights genuínos** — quando o aluno demonstrar compreensão profunda, valide
4. **Mantenha o foco** — sempre conecte de volta ao tópico da lição
5. **Seja encorajador** — erros são oportunidades de aprendizado

## Contexto da Lição:
{LESSON_CONTEXT}

## Formato de Resposta:
- Respostas curtas (1-3 parágrafos máximo)
- Use analogias do dia a dia quando possível
- Termine SEMPRE com uma pergunta provocativa
- Não use bullet points excessivos

## Restrições:
- Nunca quebre o personagem de tutor socrático
- Se o aluno pedir resposta direta, responda com uma pergunta que o guie
- Se o aluno demonstrar frustração, ofereça uma dica sutil antes da pergunta`;

// Simple in-memory rate limiting (production should use Redis)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(userId);

  if (!limit || now > limit.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 10) {
    return false;
  }

  limit.count++;
  return true;
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

export async function startSocraticSession(lessonId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Check if session already exists for this lesson
  const { data: existingSession } = await supabase
    .from("socratic_sessions")
    .select("id, messages, message_count")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .single();

  if (existingSession) {
    return existingSession;
  }

  // Verify user is enrolled in the course containing this lesson
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, course_id, socratic_enabled")
    .eq("id", lessonId)
    .single();

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  if (!lesson.socratic_enabled) {
    throw new Error("Socratic chat is not enabled for this lesson");
  }

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", lesson.course_id)
    .eq("status", "active")
    .single();

  if (!enrollment) {
    throw new Error("You must be enrolled in this course to start a Socratic session");
  }

  // Create new session
  const { data: session, error } = await supabase
    .from("socratic_sessions")
    .insert({
      user_id: user.id,
      lesson_id: lessonId,
      messages: [],
      message_count: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return session;
}

export async function getSocraticSession(sessionId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("socratic_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(`Session not found: ${error.message}`);
  }

  return data;
}

// =============================================================================
// CHAT
// =============================================================================

export async function sendSocraticMessage(
  sessionId: string,
  userMessage: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Rate limiting
  if (!checkRateLimit(user.id)) {
    throw new Error("Rate limit exceeded. Please wait a moment before sending another message.");
  }

  // Validate message
  if (!userMessage || userMessage.trim().length === 0) {
    throw new Error("Message cannot be empty");
  }

  if (userMessage.length > 2000) {
    throw new Error("Message too long. Maximum 2000 characters.");
  }

  // Get session with lesson context
  const { data: session, error: sessionError } = await supabase
    .from("socratic_sessions")
    .select(`
      *,
      lesson:lessons (
        title,
        content,
        socratic_system_prompt
      )
    `)
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (sessionError || !session) {
    throw new Error("Session not found");
  }

  // Build messages history
  const messages = session.messages || [];
  const newUserMessage = {
    role: "user",
    content: userMessage.trim(),
    timestamp: new Date().toISOString(),
  };
  messages.push(newUserMessage);

  // Build system prompt with lesson context
  const lessonContext = `
Título da Lição: ${session.lesson.title}
Conteúdo: ${JSON.stringify(session.lesson.content).slice(0, 4000)}
`;

  const systemPrompt = (
    session.lesson.socratic_system_prompt || DEFAULT_SOCRATIC_PROMPT
  ).replace("{LESSON_CONTEXT}", lessonContext);

  // Prepare messages for Claude (only last 20 messages to stay within context)
  const recentMessages = messages.slice(-20).map((m: any) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Call Claude API
  let assistantContent: string;
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      system: systemPrompt,
      messages: recentMessages,
    });

    assistantContent =
      response.content[0].type === "text" ? response.content[0].text : "";
  } catch (apiError: any) {
    console.error("Claude API error:", apiError);

    if (apiError.status === 429) {
      throw new Error("AI service is busy. Please try again in a moment.");
    }

    throw new Error("Failed to get AI response. Please try again.");
  }

  // Classify response type
  const responseType = classifyResponseType(assistantContent);

  const assistantMessage = {
    role: "assistant",
    content: assistantContent,
    timestamp: new Date().toISOString(),
    type: responseType,
  };
  messages.push(assistantMessage);

  // Update session
  const { error: updateError } = await supabase
    .from("socratic_sessions")
    .update({
      messages,
      message_count: messages.length,
      last_message_at: new Date().toISOString(),
    })
    .eq("id", sessionId);

  if (updateError) {
    throw new Error(`Failed to save message: ${updateError.message}`);
  }

  return assistantMessage;
}

// =============================================================================
// HELPERS
// =============================================================================

function classifyResponseType(
  content: string
): "clarification" | "challenge" | "synthesis" | "feedback" {
  const text = content.toLowerCase();

  // Clarification patterns
  if (
    text.includes("o que você quer dizer") ||
    text.includes("pode me explicar") ||
    text.includes("o que significa") ||
    text.includes("como você definiria")
  ) {
    return "clarification";
  }

  // Challenge patterns
  if (
    text.includes("e se") ||
    text.includes("considere o oposto") ||
    text.includes("contra-argumento") ||
    text.includes("por outro lado") ||
    text.includes("desafio")
  ) {
    return "challenge";
  }

  // Synthesis patterns
  if (
    text.includes("como isso se conecta") ||
    text.includes("resumindo") ||
    text.includes("em suas palavras") ||
    text.includes("qual a relação") ||
    text.includes("juntando tudo")
  ) {
    return "synthesis";
  }

  // Default to feedback
  return "feedback";
}
```

### Rate Limiting (Production - Optional Redis)

```typescript
// src/lib/utils/rate-limit.ts
// For production, use Upstash Redis

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only create if env vars are available
let socraticRateLimit: Ratelimit | null = null;

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = Redis.fromEnv();

  socraticRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
    prefix: "socratic",
  });
}

export async function checkSocraticRateLimit(userId: string): Promise<boolean> {
  if (!socraticRateLimit) {
    // Fallback to in-memory (already implemented in socratic.ts)
    return true;
  }

  const { success } = await socraticRateLimit.limit(userId);
  return success;
}
```

---

## Tasks

- [ ] Instalar `@anthropic-ai/sdk`
- [ ] Criar `src/lib/actions/academy/socratic.ts`
- [ ] Implementar `startSocraticSession`
- [ ] Implementar `sendSocraticMessage`
- [ ] Implementar rate limiting (in-memory)
- [ ] Implementar classificação de resposta
- [ ] Criar DEFAULT_SOCRATIC_PROMPT
- [ ] Testar fluxo completo de chat
- [ ] Testar rate limiting
- [ ] Testar error handling
- [ ] (Opcional) Implementar Redis rate limiting

---

## Definition of Done

- [ ] Chat funcionando end-to-end
- [ ] Rate limiting funcionando
- [ ] Mensagens persistidas corretamente
- [ ] Classificação de resposta funcionando
- [ ] Error handling robusto
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/lib/actions/academy/
├── socratic.ts              [CREATE]
└── index.ts                 [MODIFY - add export]

src/lib/utils/
└── rate-limit.ts            [CREATE - optional]

package.json                 [MODIFY - add @anthropic-ai/sdk]
.env.example                 [MODIFY - add ANTHROPIC_API_KEY]
```

---

## Security Considerations

- [ ] ANTHROPIC_API_KEY only used server-side
- [ ] Rate limiting prevents abuse
- [ ] Message length validation
- [ ] Session ownership validation
- [ ] No PII in logs

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] No API key exposure
- [ ] Rate limiting implementation
- [ ] Error handling completeness
- [ ] Input validation

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
