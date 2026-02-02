# Academy Sessões Socráticas

## Visão Geral

**Módulo:** Academy
**Tela:** Sessões Socráticas
**Prioridade:** P0 (MVP)
**Status:** Especificação Completa

**Propósito:** Interface de diálogo interativo com IA usando o método socrático — a IA faz perguntas para guiar o aprendizado ao invés de simplesmente fornecer respostas. Este é o diferencial principal do Academy.

---

## Conceito do Método Socrático

O método socrático é baseado em perguntas guiadas que levam o aluno a descobrir o conhecimento por si mesmo, ao invés de receber respostas prontas.

### Princípios do Diálogo Socrático na Academy:

1. **Perguntas antes de respostas** — A IA pergunta primeiro, guia depois
2. **Contextualização** — Perguntas relacionadas ao contexto do usuário
3. **Progressão** — Começa simples, aumenta complexidade
4. **Reflexão** — Convida o aluno a pensar antes de prosseguir
5. **Validação** — Confirma entendimento antes de avançar

---

## Wireframe - Sessão Socrática

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ← Product Management 101 > Módulo 2 > Sessão Socrática                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🗣️ SESSÃO SOCRÁTICA: Descoberta do Seu Produto                   │   │
│  │                                                                  │   │
│  │ Nesta sessão, vamos explorar juntos como aplicar os conceitos   │   │
│  │ de descoberta de produto ao seu contexto real.                  │   │
│  │                                                                  │   │
│  │ ⏱️ ~25 minutos  │  📊 Progresso: 3/8 perguntas                   │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ 🤖 Sócrates (IA)                                        │    │   │
│  │  │                                                         │    │   │
│  │  │ Você mencionou que está construindo o ExímIA APP.       │    │   │
│  │  │ Antes de pensarmos em features, vamos entender          │    │   │
│  │  │ profundamente o problema.                               │    │   │
│  │  │                                                         │    │   │
│  │  │ Me conte: quando você imagina seu usuário ideal         │    │   │
│  │  │ usando seu produto, qual é a primeira coisa que         │    │   │
│  │  │ ele faz quando abre o app? E por quê?                   │    │   │
│  │  │                                                         │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ 👤 Você                                                 │    │   │
│  │  │                                                         │    │   │
│  │  │ Ele provavelmente vai para a Inbox para ver se tem      │    │   │
│  │  │ algo novo, ou para o Journey para ver as metas do dia.  │    │   │
│  │  │ Acho que depende se ele é mais reativo ou proativo.     │    │   │
│  │  │                                                         │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ 🤖 Sócrates (IA)                                        │    │   │
│  │  │                                                         │    │   │
│  │  │ Interessante! Você identificou dois comportamentos      │    │   │
│  │  │ distintos. Isso me faz pensar...                        │    │   │
│  │  │                                                         │    │   │
│  │  │ Se você tivesse que escolher APENAS UM desses           │    │   │
│  │  │ comportamentos como o principal, qual seria?            │    │   │
│  │  │                                                         │    │   │
│  │  │ E mais importante: por que esse comportamento é         │    │   │
│  │  │ mais valioso para o usuário do que o outro?             │    │   │
│  │  │                                                         │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │ 💭 Pensando...                                          │    │   │
│  │  │                                                         │    │   │
│  │  │ Dica: Não existe resposta errada. O objetivo é          │    │   │
│  │  │ explorar seu raciocínio.                                │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │ Digite sua resposta...                                    │  │   │
│  │  │                                                           │  │   │
│  │  │                                                           │  │   │
│  │  │                                                           │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │                                                                  │   │
│  │  [Enviar]  │  [💡 Preciso de ajuda]  │  [⏭️ Pular pergunta]     │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📊 PROGRESSO DA SESSÃO                                          │   │
│  │                                                                  │   │
│  │  ○ ○ ○ ● ○ ○ ○ ○                                                │   │
│  │  1 2 3 4 5 6 7 8                                                │   │
│  │                                                                  │   │
│  │  [Salvar e Sair]                                                │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## TypeScript Interfaces

```typescript
interface SocraticSession {
  id: string;
  lessonId: string;
  courseId: string;
  moduleId: string;

  // Session Config
  title: string;
  description: string;
  estimatedMinutes: number;
  totalQuestions: number;

  // State
  status: 'not_started' | 'in_progress' | 'completed';
  currentQuestionIndex: number;
  startedAt?: Date;
  completedAt?: Date;

  // Conversation
  messages: SocraticMessage[];

  // Context
  userContext?: UserContext;        // Info coletada sobre o usuário

  // AI Config
  systemPrompt: string;
  questionFlow: QuestionTemplate[];
}

interface SocraticMessage {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: Date;
  questionIndex?: number;           // Qual pergunta do fluxo
  isHelpRequest?: boolean;          // Se foi pedido de ajuda
  skipped?: boolean;                // Se a pergunta foi pulada
}

interface QuestionTemplate {
  index: number;
  topic: string;
  baseQuestion: string;             // Template da pergunta
  followUpQuestions?: string[];     // Perguntas de aprofundamento
  hints?: string[];                 // Dicas se o usuário pedir ajuda
  expectedConcepts?: string[];      // Conceitos que devem ser explorados
}

interface UserContext {
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  mainChallenge?: string;
  previousAnswers: Record<string, string>;
}

interface SocraticSessionResult {
  sessionId: string;
  completedAt: Date;
  totalTime: number;                 // seconds
  questionsAnswered: number;
  questionsSkipped: number;
  insights: string[];                // Key insights extraídos pela IA
  nextSteps: string[];               // Sugestões de próximos passos
  xpEarned: number;
}
```

---

## Fluxo da Sessão Socrática

```
┌────────────────────────────────────────────────────────────────────┐
│                   SOCRATIC SESSION FLOW                            │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│   1. INTRODUÇÃO                                                    │
│      ├── Apresenta contexto da sessão                             │
│      └── Pergunta sobre o projeto do usuário (se primeira vez)    │
│                                                                    │
│   2. PERGUNTAS GUIADAS (Loop)                                      │
│      ├── IA faz pergunta baseada no topic                         │
│      ├── Usuário responde                                         │
│      ├── IA analisa resposta                                      │
│      │   ├── Se completa: avança para próxima                    │
│      │   ├── Se superficial: faz follow-up                       │
│      │   └── Se pedir ajuda: dá dica                             │
│      └── Repete até completar ou pular                            │
│                                                                    │
│   3. SÍNTESE                                                       │
│      ├── IA resume os principais insights                         │
│      ├── Conecta com conceitos do módulo                         │
│      └── Sugere próximos passos                                   │
│                                                                    │
│   4. CONCLUSÃO                                                     │
│      ├── XP awarded                                               │
│      ├── Lesson marcada como completa                             │
│      └── Opção de salvar insights no Journey                      │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## IA Behavior Guidelines

### Persona do "Sócrates"

```typescript
const SOCRATES_SYSTEM_PROMPT = `
Você é Sócrates, um mentor de aprendizado que usa o método socrático.

REGRAS FUNDAMENTAIS:
1. NUNCA dê respostas diretas - sempre faça perguntas
2. Comece com perguntas simples, aumente a complexidade gradualmente
3. Use o contexto do projeto real do usuário
4. Valide o entendimento antes de avançar
5. Seja encorajador, mas desafie o pensamento

ESTRUTURA DAS PERGUNTAS:
- Comece com "O que você acha que..."
- Use "Por que você acredita que..."
- Explore com "Como isso se relaciona com..."
- Aprofunde com "E se considerar também..."

QUANDO O USUÁRIO RESPONDE:
- Reconheça pontos válidos
- Identifique gaps de raciocínio
- Faça follow-up se a resposta for superficial
- Conecte com conceitos do curso quando apropriado

QUANDO O USUÁRIO PEDE AJUDA:
- Dê uma dica, não a resposta
- Reformule a pergunta de forma mais específica
- Ofereça um exemplo para reflexão
`;
```

---

## Integração Connection Layer

```
Events Emitidos:
- academy.socratic.started { session_id, lesson_id }
- academy.socratic.message.sent { session_id, message_type }
- academy.socratic.help.requested { session_id, question_index }
- academy.socratic.question.skipped { session_id, question_index }
- academy.socratic.completed { session_id, duration, insights }

Events Consumidos:
- journey.goal.updated → Atualiza contexto do usuário
- inbox.item.captured → Pode sugerir tópico para sessão
```

---

## Help & Skip Features

### Pedido de Ajuda
```
┌─────────────────────────────────────────────────────────────────────┐
│ 💡 DICA                                                             │
│                                                                     │
│ Pense sobre o principal problema que seu usuário enfrenta ANTES    │
│ de usar seu produto. O que ele está tentando resolver?             │
│                                                                     │
│ Exemplo: Para o Uber, não era "preciso de um app de transporte",   │
│ era "preciso chegar em algum lugar de forma confiável e rápida".   │
│                                                                     │
│ Qual seria o equivalente para o seu produto?                       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Pular Pergunta
```
┌─────────────────────────────────────────────────────────────────────┐
│ ⏭️ PULAR PERGUNTA                                                   │
│                                                                     │
│ Você pode pular esta pergunta, mas perderá parte do XP             │
│ e não terá os insights personalizados para este tópico.            │
│                                                                     │
│ [Pular Mesmo Assim]  [Voltar e Responder]                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Sessão Completa - Resultado

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🎉 SESSÃO CONCLUÍDA!                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  📊 SEUS RESULTADOS                                              │   │
│  │                                                                  │   │
│  │  Perguntas respondidas: 7/8                                     │   │
│  │  Tempo investido: 23 minutos                                    │   │
│  │  XP ganho: +75 XP                                               │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 💡 INSIGHTS DA SESSÃO                                            │   │
│  │                                                                  │   │
│  │  Com base nas suas respostas, identifiquei:                     │   │
│  │                                                                  │   │
│  │  1. Seu usuário principal é um empreendedor solo que sofre      │   │
│  │     com a fragmentação de ferramentas.                          │   │
│  │                                                                  │   │
│  │  2. O principal "job to be done" é ter um único lugar para      │   │
│  │     organizar metas, aprendizado e execução.                    │   │
│  │                                                                  │   │
│  │  3. Sua hipótese de valor está centrada na conexão entre        │   │
│  │     os módulos (Connection Layer).                              │   │
│  │                                                                  │   │
│  │  [💾 Salvar Insights no Journey]                                │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🎯 PRÓXIMOS PASSOS SUGERIDOS                                     │   │
│  │                                                                  │   │
│  │  • Validar a hipótese do Connection Layer com 5 usuários       │   │
│  │  • Definir a métrica North Star do produto                     │   │
│  │  • Continuar para o módulo de Priorização                      │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│                    [Próxima Lesson →]  [Voltar ao Curso]               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Estados da UI

### Session Not Started
```
Exibe descrição da sessão + botão [Iniciar Sessão]
```

### Session In Progress
```
Exibe chat interface com progresso
Opções: [Salvar e Sair] para continuar depois
```

### Session Completed
```
Exibe resultados e insights
Não pode ser refeita (apenas revisada)
```

---

## Dados Mock (Referência)

**Localização:** `app/src/data/academy-socratic-mock.ts`

```typescript
export const MOCK_SOCRATIC_SESSION: SocraticSession = {
  id: 'session_pm_discovery',
  title: 'Descoberta do Seu Produto',
  // ... dados completos
};
```
