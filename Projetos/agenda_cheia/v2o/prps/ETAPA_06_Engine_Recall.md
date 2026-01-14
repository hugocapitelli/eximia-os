# PRP - ETAPA 6: Engine de Recall Automatizado
## Agenda Cheia - Product Requirement Prompt

**Data:** 2026-01-08
**Prioridade:** P0 | **Estimativa:** 2 sprints

---

## 🎯 Objetivo

Implementar engine de recall automatizado com:
- Lógica de cálculo de ciclos
- Scheduler/Queue system (BullMQ)
- Rate limiting (10 msgs/min, 50/dia)
- Templates personalizados
- Re-tentativas inteligentes
- A/B testing de mensagens

---

## ⚙️ Arquitetura do Engine

```
┌────────────────────────────────────────────────┐
│         RECALL ENGINE (Diário às 00:00)        │
└────────────────────────────────────────────────┘
                    │
          ┌─────────▼──────────┐
          │  1. IDENTIFICAÇÃO  │
          │  (Clientes D-2)    │
          └─────────┬──────────┘
                    │
          ┌─────────▼──────────┐
          │  2. PRIORIZAÇÃO    │
          │  (Score + Fila)    │
          └─────────┬──────────┘
                    │
          ┌─────────▼──────────┐
          │  3. AGENDAMENTO    │
          │  (Queue + Delay)   │
          └─────────┬──────────┘
                    │
          ┌─────────▼──────────┐
          │  4. ENVIO          │
          │  (Rate Limited)    │
          └─────────┬──────────┘
                    │
          ┌─────────▼──────────┐
          │  5. MONITORAMENTO  │
          │  (Webhook)         │
          └────────────────────┘
```

---

## 🔄 Fluxos

### 1. Identificação Diária (Cron Job)

```typescript
// Executa diariamente às 00:00 UTC-3
@Cron('0 0 * * *', { timeZone: 'America/Sao_Paulo' })
async identifyRecallCandidates() {
  const today = new Date();

  // Busca clientes elegíveis para recall D-2
  const candidates = await this.clientsRepository
    .createQueryBuilder('client')
    .where('client.opted_out = false')
    .andWhere('client.consent_whatsapp = true')
    .andWhere(`
      DATE(client.last_visit_date + INTERVAL '1 day' * client.service_cycle_days)
      BETWEEN :d2 AND :d0
    `, {
      d2: addDays(today, 2),
      d0: today
    })
    .andWhere('client.recall_attempts < 3')
    .getMany();

  // Calcula score de prioridade
  for (const client of candidates) {
    const score = this.calculatePriorityScore(client);
    await this.recallQueue.add('send-recall', {
      clientId: client.id,
      priority: score,
      attempt: client.recall_attempts + 1,
    });
  }
}
```

### 2. Cálculo de Prioridade

```typescript
calculatePriorityScore(client: Client): number {
  let score = 100;

  // Quanto mais tempo sem visitar, maior prioridade
  const daysSinceLastVisit = differenceInDays(
    new Date(),
    client.last_visit_date
  );
  score += daysSinceLastVisit * 2;

  // Clientes com mais visitas têm prioridade
  score += client.visit_count * 5;

  // Clientes com maior gasto têm prioridade
  score += client.total_spent / 10;

  // Reduz prioridade se já tentou recall
  score -= client.recall_attempts * 20;

  return score;
}
```

### 3. Queue System (BullMQ)

```typescript
// recall.processor.ts
@Processor('recall-queue')
export class RecallProcessor {

  @Process('send-recall')
  async handleRecall(job: Job<RecallJobData>) {
    const { clientId, attempt, templateVariant } = job.data;

    // Rate limiting check
    const todayCount = await this.getTodayRecallCount();
    if (todayCount >= 50) {
      // Reagendar para amanhã
      await job.moveToDelayed(
        Date.now() + 24 * 60 * 60 * 1000
      );
      return;
    }

    // Delay randômico (anti-padrão)
    const delay = random(5000, 15000);
    await sleep(delay);

    // Busca cliente e tenant
    const client = await this.clientsService.findOne(clientId);
    const tenant = await this.tenantsService.findOne(client.tenantId);

    // Seleciona template (A/B testing)
    const template = this.selectTemplate(attempt, templateVariant);

    // Personaliza mensagem
    const message = this.personalizeMessage(template, client, tenant);

    // Envia via WhatsApp
    const result = await this.whatsappService.sendMessage({
      instanceId: tenant.whatsapp_connection_id,
      phone: client.phone,
      message: message,
    });

    // Registra recall
    await this.recallsRepository.save({
      tenantId: tenant.id,
      clientId: client.id,
      type: 'maintenance',
      attemptNumber: attempt,
      templateVariant: templateVariant,
      messageSent: message,
      status: result.success ? 'sent' : 'failed',
      sentAt: new Date(),
    });

    // Atualiza cliente
    await this.clientsRepository.update(clientId, {
      lastRecallSentAt: new Date(),
      recallAttempts: attempt,
    });
  }
}
```

### 4. Templates com A/B Testing

```typescript
const TEMPLATES = {
  A: { // Direto
    variant: 'A',
    message: `Oi {{nome}}! É a {{bot_name}} do {{salao_name}} 💅

Notei que faz uns {{dias}} dias que você fez {{servico}} com a {{profissional}}.
Tá na hora da manutenção!

Tenho vaga na {{dia_semana}} {{horario}}. Quer que eu segure pra você?

Para parar mensagens, responda SAIR`,
  },

  B: { // Social Proof
    variant: 'B',
    message: `Oi {{nome}}! É a {{bot_name}} do {{salao_name}} 😊

A {{profissional}} comentou de você esses dias! Sua {{servico}} vence essa semana.

Tenho vaga {{dia_semana}} {{horario}}. Serve?

Para parar mensagens, responda SAIR`,
  },

  C: { // Urgência
    variant: 'C',
    message: `Oi {{nome}}!

Tô com UMA vaga {{dia_semana}} {{horario}} que encaixa certinho no seu ciclo de {{servico}}.

Seguro pra você? Vai rápido! 🏃‍♀️

Para parar mensagens, responda SAIR`,
  },
};

selectTemplate(attempt: number, variant?: string): Template {
  // Se já especificou variant (retry), usa a mesma
  if (variant) return TEMPLATES[variant];

  // Primeira tentativa: A/B testing aleatório
  if (attempt === 1) {
    const variants = ['A', 'B', 'C'];
    const random = variants[Math.floor(Math.random() * variants.length)];
    return TEMPLATES[random];
  }

  // Tentativas seguintes: usa variantes diferentes
  const previousVariant = await this.getPreviousVariant(clientId);
  const nextVariant = this.getNextVariant(previousVariant);
  return TEMPLATES[nextVariant];
}
```

### 5. Personalização de Mensagens

```typescript
personalizeMessage(
  template: Template,
  client: Client,
  tenant: Tenant,
): string {
  const days = differenceInDays(new Date(), client.last_visit_date);
  const suggestedSlot = this.suggestTimeSlot(client);

  return template.message
    .replace('{{nome}}', client.name.split(' ')[0])
    .replace('{{bot_name}}', tenant.bot_name || 'Júlia')
    .replace('{{salao_name}}', tenant.name)
    .replace('{{dias}}', days.toString())
    .replace('{{servico}}', client.preferred_service || 'manutenção')
    .replace('{{profissional}}', client.preferred_professional || 'equipe')
    .replace('{{dia_semana}}', suggestedSlot.dayOfWeek)
    .replace('{{horario}}', suggestedSlot.time);
}

suggestTimeSlot(client: Client): { dayOfWeek: string; time: string } {
  // Analisa histórico do cliente
  const preferredDay = client.historicalPreferredDay || 'sexta';
  const preferredTime = client.historicalPreferredTime || '15h';

  return {
    dayOfWeek: preferredDay,
    time: preferredTime,
  };
}
```

---

## 📊 Métricas do Engine

```typescript
// Dashboard de Recall Engine
{
  today: {
    identified: 42,
    queued: 42,
    sent: 38,
    failed: 4,
    responded: 15,
    scheduled: 8,
    rateLimitReached: false,
  },
  performance: {
    avgResponseTime: '2.5h',
    conversionRate: '21%', // responded / sent
    schedulingRate: '53%', // scheduled / responded
  },
  abTesting: {
    variantA: { sent: 14, responded: 5, rate: '35.7%' },
    variantB: { sent: 12, responded: 3, rate: '25.0%' },
    variantC: { sent: 12, responded: 7, rate: '58.3%' }, // Winner
  },
}
```

---

## ✅ Critérios de Aceite

- [ ] Cron job executa diariamente às 00:00
- [ ] Identificação de clientes D-2, D-1, D+0
- [ ] Fila com priorização por score
- [ ] Rate limiting: 10 msgs/min, 50/dia
- [ ] Delay randômico 5-15s entre envios
- [ ] Templates A/B/C implementados
- [ ] Personalização de mensagens
- [ ] Re-tentativas (máx 3)
- [ ] Opt-out automático respeitado
- [ ] Quality Rating monitoring
- [ ] Dashboard de métricas

---

**Status:** ⏳ Aguardando
**Owner:** Backend Lead
