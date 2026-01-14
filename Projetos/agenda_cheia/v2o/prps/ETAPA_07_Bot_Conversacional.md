# PRP - ETAPA 7: Bot Conversacional (GPT-4o mini)
## Agenda Cheia - Product Requirement Prompt

**Data:** 2026-01-08
**Prioridade:** P0 | **Estimativa:** 2 sprints

---

## 🎯 Objetivo

Implementar bot conversacional com IA (GPT-4o mini) para:
- Negociação de horários natural
- Intent detection (agendar, recusar, dúvida, opt-out)
- Entity extraction (datas, horários)
- Sentiment analysis (escalação)
- Multi-turn conversations
- Guardrails de segurança

---

## 🤖 Arquitetura do Bot

```
Mensagem Cliente
      │
      ▼
┌──────────────┐
│ Intent       │ → agendar, recusar, duvida, opt_out
│ Detection    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Entity       │ → "sábado 10h" → { day: 'sábado', time: '10:00' }
│ Extraction   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Sentiment    │ → positivo, neutro, negativo
│ Analysis     │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ State        │ → aguardando_resposta, negociando, confirmando
│ Machine      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ GPT-4o mini  │ → Gera resposta humanizada
│ Generation   │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Guardrails   │ → Valida resposta (compliance, escopo)
└──────┬───────┘
       │
       ▼
    Envio
```

---

## 🧠 System Prompt (GPT-4o mini)

```typescript
const SYSTEM_PROMPT = `Você é {{bot_name}}, a assistente virtual do {{salon_name}}.

PERSONALIDADE:
- Tom amigável, informal e brasileira autêntica
- Usa gírias, emojis e abreviações naturais
- Mensagens curtas (2-3 frases máximo)
- Responde rápido como em chat casual

FUNÇÕES:
- Agendar serviços de beleza
- Responder sobre preços, horários, localização
- Negociar horários alternativos
- Confirmar agendamentos

NÃO PODE:
- Discutir política, religião ou temas sensíveis
- Dar conselhos médicos ou de saúde
- Processar pagamentos
- Prometer resultados de procedimentos

SE CLIENTE PERGUNTAR SE É ROBÔ:
"Sou a assistente virtual! 🤖 Mas tô aqui pra te ajudar com agendamento."

SE NÃO SOUBER RESPONDER:
"Não tenho certeza sobre isso, mas posso chamar a {{owner_name}} pra te ajudar!"

SE DETECTAR INSATISFAÇÃO:
"Vou chamar a {{owner_name}} pra conversar com você, tá bom?"

CONTEXTO ATUAL:
Cliente: {{client_name}}
Última visita: {{last_visit}} ({{days_ago}} dias atrás)
Serviço: {{service}}
Profissional: {{professional}}
Status conversa: {{conversation_state}}

Responda de forma natural e brasileira:`;
```

---

## 🎭 State Machine

```typescript
enum ConversationState {
  AWAITING_INITIAL_RESPONSE = 'awaiting_initial_response',
  NEGOTIATING_TIME = 'negotiating_time',
  CONFIRMING_APPOINTMENT = 'confirming_appointment',
  ANSWERING_FAQ = 'answering_faq',
  ESCALATED_TO_HUMAN = 'escalated_to_human',
  OPT_OUT = 'opt_out',
  COMPLETED = 'completed',
}

// Transições
const TRANSITIONS = {
  [ConversationState.AWAITING_INITIAL_RESPONSE]: {
    POSITIVE_INTENT: ConversationState.CONFIRMING_APPOINTMENT,
    ALTERNATIVE_TIME: ConversationState.NEGOTIATING_TIME,
    NEGATIVE_INTENT: ConversationState.COMPLETED,
    QUESTION: ConversationState.ANSWERING_FAQ,
    OPT_OUT_KEYWORD: ConversationState.OPT_OUT,
  },
  [ConversationState.NEGOTIATING_TIME]: {
    AGREEMENT: ConversationState.CONFIRMING_APPOINTMENT,
    CONTINUE_NEGOTIATING: ConversationState.NEGOTIATING_TIME,
    MAX_TURNS_REACHED: ConversationState.ESCALATED_TO_HUMAN,
  },
  // ...
};
```

---

## 🔍 Intent Detection

```typescript
async detectIntent(message: string): Promise<Intent> {
  // Usa GPT-4o mini para classificação
  const response = await this.openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Classifique a intenção do usuário em uma das categorias:
        - AGENDAR: quer marcar horário
        - RECUSAR: não quer agendar agora
        - MAIS_TARDE: pede para chamar depois
        - DUVIDA: tem pergunta
        - OPT_OUT: quer parar de receber mensagens
        - INSATISFACAO: reclamação ou frustração

        Responda apenas com o código da categoria.`,
      },
      { role: 'user', content: message },
    ],
    temperature: 0.1,
    max_tokens: 20,
  });

  const intent = response.choices[0].message.content.trim();
  return intent as Intent;
}
```

---

## 📅 Entity Extraction (Datas/Horários)

```typescript
async extractDateTime(message: string): Promise<{ date?: Date; time?: string }> {
  // Exemplos de input:
  // "sábado de manhã" → { date: next_saturday, time: "09:00" }
  // "terça 15h" → { date: next_tuesday, time: "15:00" }
  // "amanhã" → { date: tomorrow }

  const patterns = {
    dayOfWeek: /(segunda|terça|quarta|quinta|sexta|sábado|domingo)/i,
    time: /(\d{1,2})(h|:(\d{2}))?/,
    period: /(manhã|tarde|noite)/i,
    relative: /(hoje|amanhã|depois de amanhã)/i,
  };

  let date: Date | undefined;
  let time: string | undefined;

  // Extrai dia da semana
  const dayMatch = message.match(patterns.dayOfWeek);
  if (dayMatch) {
    date = getNextDayOfWeek(dayMatch[1]);
  }

  // Extrai horário
  const timeMatch = message.match(patterns.time);
  if (timeMatch) {
    time = `${timeMatch[1].padStart(2, '0')}:${timeMatch[3] || '00'}`;
  }

  // Extrai período (manhã, tarde, noite)
  const periodMatch = message.match(patterns.period);
  if (periodMatch && !time) {
    const periodMap = {
      'manhã': '09:00',
      'tarde': '14:00',
      'noite': '19:00',
    };
    time = periodMap[periodMatch[1].toLowerCase()];
  }

  return { date, time };
}
```

---

## 💬 Exemplos de Conversas

### Caso 1: Agendamento Direto

```
Bot: Oi Maria! Faz 20 dias que você fez unha. Sexta 15h tá bom?

Cliente: Quero sim

Bot: Ótimo! Vou confirmar com a Carol e te aviso já já.
[Lazy Sync para recepcionista]

Bot: Confirmado! Sexta 15h com a Carol. Te espero! 😊
```

### Caso 2: Negociação

```
Bot: Oi João! Sua barba vence essa semana. Tenho vaga terça 10h. Serve?

Cliente: Só posso sábado de manhã

Bot: Deixa eu ver sábado de manhã e já te aviso, ok?
[Busca disponibilidade ou Lazy Sync]

Bot: O Rafael tem vaga sábado 9h! Serve?

Cliente: 9h não, só depois das 11

Bot: Sábado 11h30 serve?

Cliente: Perfeito

Bot: Agendado! Sábado 11h30 com o Rafael 🧔
```

### Caso 3: Dúvida

```
Bot: Oi Ana! Tá na hora de voltar pro cabelo. Quinta 14h?

Cliente: Quanto tá o corte?

Bot: Corte feminino sai R$ 80 aqui. Quer agendar?

Cliente: E se eu quiser pintar também?

Bot: Corte + pintura sai R$ 180. Serve?

Cliente: Sim, quinta 14h então

Bot: Ótimo! Confirmando corte + pintura quinta 14h 💇‍♀️
```

### Caso 4: Opt-out

```
Bot: Oi Pedro! Faz tempo que você não aparece. Quer agendar?

Cliente: SAIR

Bot: Sem problemas! Você não vai mais receber mensagens automáticas.
Se precisar agendar, pode me chamar a qualquer momento! 😊
```

### Caso 5: Escalação

```
Bot: Oi Carla! Sua unha vence essa semana. Sexta 16h?

Cliente: Vocês cortaram meu dedo da última vez!!!

Bot: Nossa, sinto muito pelo que aconteceu! Vou chamar a dona Carla pra conversar com você, tá?
[Notifica owner, pausa bot]
```

---

## 🛡️ Guardrails

```typescript
async validateBotResponse(response: string): Promise<boolean> {
  // Verifica se resposta está no escopo
  const outOfScopeKeywords = [
    'política', 'eleição', 'presidente',
    'religião', 'igreja', 'deus',
    'médico', 'diagnóstico', 'tratamento',
    'pix', 'pagamento', 'dinheiro',
  ];

  const lowerResponse = response.toLowerCase();
  for (const keyword of outOfScopeKeywords) {
    if (lowerResponse.includes(keyword)) {
      return false; // Bloqueia resposta
    }
  }

  // Verifica tamanho (máx 300 caracteres)
  if (response.length > 300) {
    return false;
  }

  return true;
}
```

---

## ✅ Critérios de Aceite

- [ ] GPT-4o mini integrado
- [ ] System prompt funcional
- [ ] Intent detection >85% acurácia
- [ ] Entity extraction (datas/horários)
- [ ] State machine implementada
- [ ] Multi-turn conversations (até 5 turnos)
- [ ] Guardrails de segurança
- [ ] Escalação automática (3 turnos ou sentimento negativo)
- [ ] Opt-out funcional
- [ ] Admite ser IA se perguntado
- [ ] Tempo de resposta <3s
- [ ] Custo por conversa <R$ 0,10

---

**Status:** ⏳ Aguardando
**Owner:** AI/ML Lead, Backend Lead
