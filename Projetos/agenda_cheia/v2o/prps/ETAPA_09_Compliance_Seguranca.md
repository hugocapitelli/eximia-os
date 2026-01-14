# PRP - ETAPA 9: Compliance & Segurança
## Agenda Cheia - Product Requirement Prompt

**Data:** 2026-01-08
**Prioridade:** P0 | **Estimativa:** 1 sprint

---

## 🎯 Objetivo

Implementar camada de compliance e segurança:
- LGPD: Audit logs, DPA, exportação de dados
- Opt-out funcional e persistente
- Rate limiting anti-ban WhatsApp
- Documentos legais (Termos, Privacidade, DPA)
- Checklist pré-lançamento

---

## 🔒 LGPD Compliance

### 1. Audit Logs (Rastreabilidade)

```typescript
// Todas as ações sensíveis são logadas
interface AuditLog {
  id: string;
  tenantId: string;
  userId?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  description: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

enum AuditAction {
  CLIENT_IMPORTED = 'client_imported',
  CLIENT_CREATED = 'client_created',
  CLIENT_UPDATED = 'client_updated',
  CLIENT_DELETED = 'client_deleted',
  MESSAGE_SENT = 'message_sent',
  OPT_OUT = 'opt_out',
  DATA_EXPORTED = 'data_exported',
  CONSENT_GIVEN = 'consent_given',
  CONSENT_REVOKED = 'consent_revoked',
}

// Exemplo de uso
await this.auditService.log({
  tenantId: tenant.id,
  userId: user.id,
  action: AuditAction.CLIENT_IMPORTED,
  resourceType: 'client',
  description: `Imported 245 clients from CSV`,
  metadata: {
    fileName: 'clientes.csv',
    rowCount: 245,
    validCount: 240,
    errorCount: 5,
  },
  ipAddress: request.ip,
  userAgent: request.headers['user-agent'],
});
```

### 2. Exportação de Dados (Direito do Titular)

```typescript
// GET /clients/:id/export-data
async exportClientData(clientId: string) {
  const client = await this.clientsRepository.findOne(clientId);
  const conversations = await this.conversationsRepository.find({
    clientId,
  });
  const messages = await this.messagesRepository.find({
    conversationId: In(conversations.map(c => c.id)),
  });
  const recalls = await this.recallsRepository.find({ clientId });

  const exportData = {
    personal_data: {
      name: client.name,
      phone: client.phone,
      email: client.email,
      first_visit_date: client.first_visit_date,
      last_visit_date: client.last_visit_date,
    },
    consent: {
      whatsapp: client.consent_whatsapp,
      consent_date: client.consent_date,
      opted_out: client.opted_out,
      opted_out_date: client.opted_out_date,
    },
    history: {
      visit_count: client.visit_count,
      total_spent: client.total_spent,
    },
    communications: {
      recalls_sent: recalls.length,
      conversations: conversations.length,
      messages: messages.map(m => ({
        date: m.sent_at,
        direction: m.direction,
        content: m.content,
      })),
    },
    audit_log: await this.auditService.getClientLogs(clientId),
  };

  // Log da exportação
  await this.auditService.log({
    action: AuditAction.DATA_EXPORTED,
    resourceId: clientId,
    description: 'Client data exported (LGPD request)',
  });

  return exportData;
}
```

### 3. Direito ao Esquecimento

```typescript
// DELETE /clients/:id (hard delete)
async deleteClient(clientId: string, reason: string) {
  // Valida se pode deletar
  const client = await this.clientsRepository.findOne(clientId);
  if (!client) throw new NotFoundException();

  // Log antes de deletar
  await this.auditService.log({
    action: AuditAction.CLIENT_DELETED,
    resourceId: clientId,
    description: `Client permanently deleted. Reason: ${reason}`,
    metadata: {
      clientName: client.name,
      clientPhone: client.phone,
    },
  });

  // Deleta em cascata (conversations, messages, recalls)
  await this.clientsRepository.delete(clientId);

  return { success: true, message: 'Client permanently deleted' };
}
```

### 4. DPA (Data Processing Agreement)

Template disponível em `PRD_AgendaCheia_v2.0.txt` seção 18.9.
Deve ser aceito durante onboarding (Tela 3).

---

## 🚫 Opt-out Funcional

```typescript
// Detecção de palavras-chave
const OPT_OUT_KEYWORDS = [
  'SAIR', 'PARAR', 'CANCELAR', 'STOP', 'UNSUBSCRIBE',
  'não quero mais', 'pare de me enviar',
];

async handleOptOut(clientId: string, reason?: string) {
  // Marca cliente como opted_out
  await this.clientsRepository.update(clientId, {
    opted_out: true,
    opted_out_date: new Date(),
    opt_out_reason: reason,
  });

  // Remove de todas as filas de recall
  await this.recallQueue.removeJobsByClientId(clientId);

  // Envia mensagem de confirmação
  await this.whatsappService.sendMessage({
    phone: client.phone,
    message: `Sem problemas! Você não vai mais receber mensagens automáticas.
Se precisar agendar, pode me chamar a qualquer momento! 😊`,
  });

  // Log de auditoria
  await this.auditService.log({
    action: AuditAction.OPT_OUT,
    resourceId: clientId,
    description: 'Client opted out of automated messages',
  });
}
```

---

## ⚡ Rate Limiting (Anti-Ban WhatsApp)

```typescript
// 3 níveis de rate limiting
enum RateLimitMode {
  CONSERVATIVE = 'conservative', // 5 msgs/min, 30/dia
  DEFAULT = 'default',           // 10 msgs/min, 50/dia
  AGGRESSIVE = 'aggressive',     // 15 msgs/min, 80/dia (risco)
}

@Injectable()
export class WhatsAppRateLimiter {
  async canSendMessage(tenantId: string): Promise<boolean> {
    const mode = await this.getMode(tenantId);
    const limits = this.getLimits(mode);

    // Check per-minute limit
    const sentLastMinute = await this.redis.get(
      `rate:${tenantId}:minute`
    );
    if (sentLastMinute >= limits.perMinute) {
      return false;
    }

    // Check daily limit
    const sentToday = await this.redis.get(
      `rate:${tenantId}:day`
    );
    if (sentToday >= limits.perDay) {
      return false;
    }

    return true;
  }

  async incrementCounters(tenantId: string) {
    // Incrementa contador por minuto (expira em 60s)
    await this.redis.incr(`rate:${tenantId}:minute`);
    await this.redis.expire(`rate:${tenantId}:minute`, 60);

    // Incrementa contador diário (expira em 24h)
    await this.redis.incr(`rate:${tenantId}:day`);
    await this.redis.expire(`rate:${tenantId}:day`, 86400);
  }

  private getLimits(mode: RateLimitMode) {
    const limitsMap = {
      [RateLimitMode.CONSERVATIVE]: { perMinute: 5, perDay: 30 },
      [RateLimitMode.DEFAULT]: { perMinute: 10, perDay: 50 },
      [RateLimitMode.AGGRESSIVE]: { perMinute: 15, perDay: 80 },
    };
    return limitsMap[mode];
  }
}
```

---

## 📋 Documentos Legais

### 1. Termos de Uso
- Definição do serviço
- Limitação de responsabilidade
- Isenção por banimento WhatsApp
- Política de reembolso
- Cancelamento

### 2. Política de Privacidade
- Dados coletados
- Finalidade do tratamento
- Base legal (LGPD)
- Compartilhamento de dados
- Direitos do titular
- Contato do DPO

### 3. DPA (Data Processing Agreement)
- Controlador vs Operador
- Obrigações do operador
- Subprocessadores
- Medidas de segurança
- Notificação de incidentes
- Transferência internacional

**Localização:** `/docs/legal/`
**Status:** Rascunho (requer revisão advogado)

---

## ✅ Checklist Pré-Lançamento

```markdown
### Compliance LGPD
- [ ] Termos de Uso revisados por advogado
- [ ] Política de Privacidade revisada
- [ ] DPA assinado por todos tenants
- [ ] Audit logs funcionando
- [ ] Exportação de dados testada
- [ ] Opt-out funcional
- [ ] Consentimento explícito no onboarding
- [ ] RIPD elaborado

### Segurança
- [ ] HTTPS em produção
- [ ] JWT secrets rotacionados
- [ ] Variáveis de ambiente seguras
- [ ] Rate limiting configurado
- [ ] SQL injection mitigado (prepared statements)
- [ ] XSS mitigado (sanitização)
- [ ] CORS configurado
- [ ] Helmet.js configurado

### WhatsApp Compliance
- [ ] Z-API aviso não-oficial exibido
- [ ] Rate limiting testado
- [ ] Quality Rating monitoring ativo
- [ ] Auto-identificação como bot (🤖)
- [ ] Opt-out fácil
- [ ] Máximo 3 tentativas por cliente

### Backup & Recovery
- [ ] Backup diário database
- [ ] Teste de restore executado
- [ ] Disaster recovery plan documentado

### Monitoring
- [ ] Sentry configurado
- [ ] Logs centralizados
- [ ] Alertas críticos configurados
- [ ] Uptime monitoring (UptimeRobot)
```

---

## ✅ Critérios de Aceite

- [ ] Audit logs em todas ações sensíveis
- [ ] Exportação de dados funcional
- [ ] Opt-out imediato e persistente
- [ ] Rate limiting anti-ban
- [ ] Documentos legais disponíveis
- [ ] Checklist pré-lançamento completo
- [ ] RIPD elaborado
- [ ] Advogado revisou documentos

---

**Status:** ⏳ Aguardando
**Owner:** CTO, Legal, DPO
