# PRP - ETAPA 5: Integração WhatsApp (Z-API)
## Agenda Cheia - Product Requirement Prompt

**Data:** 2026-01-08
**Prioridade:** P0 | **Estimativa:** 1-2 sprints

---

## 🎯 Objetivo

Implementar integração completa com WhatsApp Business via Z-API:
- Conexão via QR Code
- Envio/recebimento de mensagens
- Webhooks para eventos em tempo real
- Suporte a múltiplos números
- Health check e reconnection automática

---

## 🔌 Integração Z-API

### Arquitetura

```
┌────────────┐     ┌─────────────┐     ┌──────────────┐
│  Frontend  │────▶│  Backend    │────▶│   Z-API      │
│            │     │  (NestJS)   │     │   Webhook    │
└────────────┘     └─────────────┘     └──────────────┘
                          │                     │
                          ▼                     ▼
                   ┌─────────────┐     ┌──────────────┐
                   │  Database   │     │  WhatsApp    │
                   │  (Supabase) │     │              │
                   └─────────────┘     └──────────────┘
```

### Endpoints Z-API

```typescript
// 1. Gerar QR Code
GET https://api.z-api.io/instances/{instanceId}/qr-code/image
Headers: {
  "Client-Token": "your-token",
  "Content-Type": "application/json"
}

// 2. Verificar Status de Conexão
GET https://api.z-api.io/instances/{instanceId}/status
Response: { connected: boolean, phone: string }

// 3. Enviar Mensagem
POST https://api.z-api.io/instances/{instanceId}/token/{token}/send-text
Body: {
  "phone": "5511999998888",
  "message": "Oi Maria! Faz 20 dias que você fez unha..."
}

// 4. Enviar Mensagem com Botões (futuro)
POST /send-button-message
Body: {
  "phone": "5511999998888",
  "message": "Quer agendar?",
  "buttons": [
    { "id": "1", "label": "👍 Sim" },
    { "id": "2", "label": "👎 Não" }
  ]
}

// 5. Webhook Configuration
POST /webhook/{instanceId}
Body: {
  "url": "https://app.agendacheia.com/api/webhooks/zapi",
  "events": [
    "MESSAGE_RECEIVED",
    "MESSAGE_STATUS_UPDATE",
    "CONNECTION_STATUS"
  ]
}
```

### Webhooks (Recebimento)

```typescript
POST /api/webhooks/zapi
Headers: {
  "X-API-Key": "secret-key"
}

// Evento: Mensagem Recebida
Body: {
  "event": "MESSAGE_RECEIVED",
  "instanceId": "inst-123",
  "data": {
    "messageId": "msg-456",
    "phone": "5511999998888",
    "fromMe": false,
    "text": "Quero agendar sim",
    "timestamp": 1704720000
  }
}

// Evento: Status de Mensagem
Body: {
  "event": "MESSAGE_STATUS_UPDATE",
  "data": {
    "messageId": "msg-456",
    "status": "read", // sent, delivered, read
    "timestamp": 1704720010
  }
}

// Evento: Status de Conexão
Body: {
  "event": "CONNECTION_STATUS",
  "data": {
    "connected": false,
    "reason": "disconnected_by_user"
  }
}
```

---

## 🖥️ Telas

### Tela: Configurar WhatsApp

```
┌─────────────────────────────────────────────────┐
│ ← Settings        WhatsApp Connection           │
│─────────────────────────────────────────────────│
│                                                 │
│ 📱 SEU WHATSAPP                                 │
│                                                 │
│ ┌───────────────────────────────────────────┐   │
│ │ Status: 🟢 Conectado                      │   │
│ │ Número: (11) 99999-8888                   │   │
│ │ Conectado desde: 10/01/2026 10:30         │   │
│ │                                           │   │
│ │ Quality Rating: 🟢 Verde                  │   │
│ │ Mensagens enviadas hoje: 15/50            │   │
│ │                                           │   │
│ │ [Desconectar]  [Testar Conexão]           │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│─────────────────────────────────────────────────│
│                                                 │
│ 🔍 HEALTH CHECK                                 │
│                                                 │
│ ┌───────────────────────────────────────────┐   │
│ │ ✅ Conexão com Z-API: OK                  │   │
│ │ ✅ Webhook configurado: OK                │   │
│ │ ✅ Rate limiting: OK (15/50 hoje)         │   │
│ │ ✅ Quality Rating: Verde                  │   │
│ │ ⚠️ Último sync: há 2 horas                │   │
│ │                                           │   │
│ │ [🔄 Forçar Sync]                          │   │
│ └───────────────────────────────────────────┘   │
│                                                 │
│─────────────────────────────────────────────────│
│                                                 │
│ ⚙️ CONFIGURAÇÕES AVANÇADAS                      │
│                                                 │
│ Rate Limiting                                   │
│ ○ Conservador (5 msgs/min, 30/dia)             │
│ ● Padrão (10 msgs/min, 50/dia)                 │
│ ○ Agressivo (15 msgs/min, 80/dia) ⚠️           │
│                                                 │
│ Auto-reconnect                                  │
│ ☑ Reconectar automaticamente se desconectar     │
│                                                 │
│ Notificações                                    │
│ ☑ Me avisar se WhatsApp desconectar             │
│ ☑ Me avisar se Quality Rating cair              │
│                                                 │
│ [Salvar Configurações]                          │
│                                                 │
│─────────────────────────────────────────────────│
│                                                 │
│ 🚨 TROUBLESHOOTING                              │
│                                                 │
│ Problemas comuns:                               │
│ • WhatsApp desconectou? [Reconectar]            │
│ • Quality Rating amarelo/vermelho? [Ver Guia]   │
│ • Mensagens não chegando? [Testar Envio]        │
│                                                 │
│ [📚 Ver Documentação Completa]                  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Alertas de Quality Rating

```
┌─────────────────────────────────────────────────┐
│ ⚠️ QUALITY RATING AMARELO                       │
│                                                 │
│ Seu Quality Rating no WhatsApp caiu para        │
│ AMARELO. Isso pode resultar em limitações.      │
│                                                 │
│ Possíveis causas:                               │
│ • Taxa de bloqueio alta                         │
│ • Mensagens reportadas como spam                │
│ • Taxa de opt-out elevada                       │
│                                                 │
│ Recomendações:                                  │
│ ✓ Reduza frequência de mensagens                │
│ ✓ Revise templates (evite spam)                 │
│ ✓ Envie apenas para quem consentiu              │
│                                                 │
│ [Ver Detalhes]  [Pausar Recalls]  [OK]          │
└─────────────────────────────────────────────────┘
```

---

## ✅ Critérios de Aceite

- [ ] Conexão via QR Code funcional
- [ ] Envio de mensagens com rate limiting
- [ ] Recebimento via webhook
- [ ] Health check automático (5 min)
- [ ] Reconnection automática
- [ ] Quality Rating monitoring
- [ ] Alerta se desconectar
- [ ] Suporte a múltiplos números (futuro)
- [ ] Logs de auditoria

---

**Status:** ⏳ Aguardando
**Owner:** Backend Lead
