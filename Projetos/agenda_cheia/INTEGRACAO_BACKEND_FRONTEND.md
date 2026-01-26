# 🔌 INTEGRAÇÃO BACKEND PYTHON ↔ REACT FRONTEND

**Data:** 2026-01-26
**Status:** Arquitetura Definida - Pronto para Implementação

---

## 📋 VISÃO GERAL

```
┌──────────────────────────────────────────────────────────────────┐
│                    AGENDA CHEIA - FULL STACK                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  FRONTEND (React/TypeScript - JÁ EXISTE)               │   │
│  │  ├── Dashboard (proprietário)                          │   │
│  │  ├── Calendar (agenda profissional)                    │   │
│  │  ├── Chat (conversas com clientes)                     │   │
│  │  ├── Recall (campanhas)                                │   │
│  │  └── Context API + localStorage                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↕ (HTTP + WebSocket)                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  BACKEND (Python FastAPI - NOVO)                       │   │
│  │  ├── Agentes (Prazo Certo, Encher Agenda, Chat)       │   │
│  │  ├── Orchestrator (coordena tudo)                      │   │
│  │  ├── API REST (endpoints)                              │   │
│  │  ├── Event Bus (pub/sub)                               │   │
│  │  └── Celery + Redis (jobs assincronos)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                            ↕ (Prisma ORM)                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  DATABASE (PostgreSQL)                                 │   │
│  │  └── Mesma DB que já existe (compatível com Prisma)  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  INTEGRAÇÕES (N8N, WhatsApp, Gemini)                  │   │
│  │  ├── N8N Webhooks ← → Backend                          │   │
│  │  ├── WhatsApp / SMS / Email (via N8N)                 │   │
│  │  └── Gemini LLM (via Backend)                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔗 FLUXOS DE INTEGRAÇÃO

### FLUXO 1: Agente Dispara → React Atualiza

```
┌─────────────────────────────────────────────────────────────┐
│  CENÁRIO: Backend criou auth_request, React precisa saber  │
├─────────────────────────────────────────────────────────────┤

1. AGENTE (Backend)
   ├─ Executa lógica (ex: PrazoCerto encontrou clientes)
   ├─ Cria auth_request no DB
   ├─ Dispara event: "AuthRequestCreatedEvent"
   └─ Publica em EventBus

2. EVENTBUS (Redis Pub/Sub)
   ├─ Recebe evento
   ├─ Roteia para subscribers
   └─ Envia para React via WebSocket

3. REACT (Frontend)
   ├─ Recebe WebSocket message
   ├─ "Nova autorização pendente!"
   ├─ Atualiza Context: addAuthRequest(...)
   ├─ Dashboard mostra notification
   ├─ Tabela "Autorizações Pendentes" atualiza
   └─ Owner pode confirmar/rejeitar

4. OWNER CLICA "APROVAR"
   ├─ POST /api/v1/sync/confirm-auth-request/{id}
   ├─ Backend recebe decisão
   ├─ Cria appointment
   ├─ Dispara NotificationSentEvent
   └─ React remove de "pendentes"

   RESULTADO: auth_request → appointment → WhatsApp enviado
```

**Implementação React:**

```typescript
// hooks/useAgentSync.ts
export const useAgentSync = () => {
  const { dispatch } = useContext(AppContext);

  useEffect(() => {
    // Conectar WebSocket
    const ws = new WebSocket(
      `wss://${BACKEND_URL}/ws/sync?tenant_id=${tenantId}`
    );

    ws.onmessage = (event) => {
      const eventData = JSON.parse(event.data);

      switch (eventData.event_type) {
        case "auth_request_created":
          // Uma automação criou um novo auth_request
          dispatch({
            type: "ADD_AUTH_REQUEST",
            payload: eventData.data.auth_request,
          });
          // Notificar usuário
          toast.success("Nova autorização para revisar!");
          break;

        case "campaign_completed":
          // Campanha terminou
          dispatch({
            type: "SET_CAMPAIGN_STATS",
            payload: eventData.data.stats,
          });
          break;

        case "ai_response":
          // Chat: IA respondeu
          dispatch({
            type: "ADD_CHAT_MESSAGE",
            payload: {
              conversation_id: eventData.data.conversation_id,
              message: eventData.data.message,
              intent: eventData.data.intent,
            },
          });
          break;
      }
    };

    return () => ws.close();
  }, []);
};
```

---

### FLUXO 2: Chat (Webhook N8N → Backend → React)

```
┌─────────────────────────────────────────────────────────────┐
│  CENÁRIO: Cliente envia msg WhatsApp → IA responde         │
├─────────────────────────────────────────────────────────────┤

1. CLIENTE
   └─ Envia: "Quero agendar um corte"

2. WHATSAPP → N8N
   └─ Webhook dispara N8N workflow

3. N8N WORKFLOW
   ├─ Parse mensagem
   ├─ Busca cliente no DB
   └─ POST /api/v1/webhooks/n8n/message-received
      {
        "tenant_id": "uuid",
        "client_id": "uuid",
        "client_name": "João",
        "phone": "+5511999999999",
        "message": "Quero agendar um corte",
        "channel": "whatsapp",
        "timestamp": "2024-01-15T10:00:00Z"
      }

4. BACKEND (FastAPI)
   ├─ Webhook recebe em background
   ├─ Chama ChatAgent.execute()
   │  ├─ Gera resposta IA: "Ótimo! Qual profissional prefere?"
   │  ├─ Detecta intenção: BOOKING
   │  ├─ Cria auth_request (lazy sync)
   │  └─ Emite AIResponseEvent
   ├─ Publica em EventBus
   └─ Trigger N8N para enviar resposta WhatsApp

5. REACT (Frontend)
   ├─ Recebe WebSocket: AIResponseEvent
   ├─ Chat.tsx atualiza conversa
   ├─ Mostra resposta da IA
   ├─ Se BOOKING detectado:
   │  └─ Mostra notificação: "IA sugeriu agendamento"
   └─ Owner vê em "Autorizações Pendentes"

6. OWNER APROVA
   ├─ POST /api/v1/sync/confirm-auth-request
   ├─ Backend cria appointment
   └─ N8N envia confirmação ao cliente

   RESULTADO: Conversa → Agendamento (tudo automático)
```

**Implementação Chat React:**

```typescript
// pages/Chat.tsx
import { useAgentSync } from "../hooks/useAgentSync";

export const Chat: React.FC = () => {
  const { appContext, dispatch } = useContext(AppContext);
  const [currentConversation, setCurrentConversation] = useState(null);

  // Conectar ao WebSocket para updates em tempo real
  useAgentSync();

  const handleSendMessage = async (message: string) => {
    // 1. Enviar para backend (webhook)
    const response = await fetch(
      `${BACKEND_URL}/api/v1/webhooks/n8n/message-received`,
      {
        method: "POST",
        body: JSON.stringify({
          tenant_id: appContext.tenantId,
          client_id: currentConversation.clientId,
          message: message,
        }),
      }
    );

    // 2. IA irá responder via WebSocket (não fazer polling)
    // 3. Mensagem aparece automaticamente via AIResponseEvent
  };

  return (
    <div className="chat-container">
      {currentConversation && (
        <>
          <div className="messages">
            {currentConversation.messages.map((msg) => (
              <div className={`message ${msg.role}`}>{msg.content}</div>
            ))}
          </div>
          <input onSend={handleSendMessage} />
        </>
      )}
    </div>
  );
};
```

---

### FLUXO 3: Campanhas Agendadas (Backend → React)

```
┌─────────────────────────────────────────────────────────────┐
│  CENÁRIO: Campanhas rodam automaticamente (Celery Beat)     │
├─────────────────────────────────────────────────────────────┤

CRONJOB (Celery Beat)
├─ 09:00 todo dia: PrazoCerto para todos os tenants
└─ 14:00 seg/qua/sex: EncherAgenda para todos os tenants

EXECUÇÃO:
1. Celery Beat trigger: execute_prazo_certo_campaign()
2. Orchestrator.execute_workflow("prazo_certo", tenant_id)
3. PrazoCertoAgent executa:
   ├─ Busca clientes em ciclo
   ├─ Cria auth_requests
   ├─ Envia WhatsApp (via N8N)
   ├─ Dispara CampaignCompletedEvent
   └─ Emite em EventBus

4. React ouve WebSocket:
   ├─ Recebe: "Campaign Completed"
   ├─ Stats: {sent: 45, clients_found: 50}
   ├─ Dashboard atualiza: "45 mensagens enviadas!"
   └─ Recall.tsx mostra resultados

SINCRONIZAÇÃO:
├─ Não precisa de polling
├─ Não precisa de refresh manual
├─ Tudo via WebSocket + Events
└─ Real-time em produção
```

---

### FLUXO 4: Aprovação Owner (React ↔ Backend)

```
┌─────────────────────────────────────────────────────────────┐
│  CENÁRIO: Owner precisa aprovar agendamento sugerido       │
├─────────────────────────────────────────────────────────────┤

1. DASHBOARD (React)
   ├─ Mostra card: "4 Agendamentos aguardando aprovação"
   ├─ Tabela com suggestions:
   │  ├─ [Carol] - Manicure - Seg 10:00 - João Silva
   │  ├─ Desconto: 15% (Prazo Certo)
   │  ├─ [APROVAR] [REJEITAR]
   │  └─ ...
   └─ Click APROVAR

2. REACT POST
   └─ /api/v1/sync/confirm-auth-request/request-uuid
      {
        "decision": "approve",
        "notes": "Confirmar com Carol"
      }

3. BACKEND (FastAPI)
   ├─ Recebe decision
   ├─ Cria appointment no DB
   ├─ Emite AppointmentCreatedEvent
   └─ Trigger N8N: enviar confirmação WhatsApp

4. REACT
   ├─ Recebe AppointmentCreatedEvent via WebSocket
   ├─ Remove de "pendentes"
   ├─ Adiciona a appointments
   ├─ Calendar atualiza
   └─ Dashboard: stats atualizam

   RESULTADO: Tudo sincronizado em tempo real
```

**Implementação Dashboard React:**

```typescript
// pages/Dashboard.tsx
export const Dashboard: React.FC = () => {
  const { appContext, dispatch } = useContext(AppContext);
  const [authRequests, setAuthRequests] = useState([]);

  useEffect(() => {
    // Buscar auth requests pendentes
    const loadPendingRequests = async () => {
      const res = await fetch(
        `${BACKEND_URL}/api/v1/sync/pending-auth-requests`,
        {
          headers: {
            Authorization: `Bearer ${appContext.token}`,
          },
        }
      );
      const data = await res.json();
      setAuthRequests(data.data);
    };

    loadPendingRequests();

    // Escutar updates via WebSocket
    const unsubscribe = useAgentSync((event) => {
      if (event.event_type === "auth_request_created") {
        setAuthRequests((prev) => [
          ...prev,
          event.data.auth_request,
        ]);
      } else if (event.event_type === "appointment_created") {
        setAuthRequests((prev) =>
          prev.filter((r) => r.id !== event.data.auth_request_id)
        );
      }
    });

    return unsubscribe;
  }, []);

  const handleApprove = async (authRequestId: string) => {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/sync/confirm-auth-request/${authRequestId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${appContext.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision: "approve" }),
      }
    );
    // Resultado vem via WebSocket, não precisa fazer setState manual
  };

  return (
    <div>
      <h2>Autorizações Pendentes ({authRequests.length})</h2>
      {authRequests.map((req) => (
        <div key={req.id} className="auth-request-card">
          <p>{req.appointment_data.client_name}</p>
          <p>{req.appointment_data.date} às {req.appointment_data.time}</p>
          <button onClick={() => handleApprove(req.id)}>Aprovar</button>
          <button onClick={() => handleReject(req.id)}>Rejeitar</button>
        </div>
      ))}
    </div>
  );
};
```

---

## 🔌 ENDPOINTS DA API

### Automações

```http
# Executar campanha Prazo Certo
POST /api/v1/automations/prazo-certo/execute
Content-Type: application/json
Authorization: Bearer {token}

{
  "campaign_id": "uuid",
  "context": {
    "service_id": "uuid",
    "professional_id": "uuid (optional)",
    "offer_type": "discount",
    "offer_value": 15
  }
}

Response:
{
  "status": "success",
  "campaign_id": "uuid",
  "suggestions_created": 12,
  "notifications_sent": 12
}
```

```http
# Executar Encher Agenda
POST /api/v1/automations/encher-agenda/execute
Content-Type: application/json
Authorization: Bearer {token}

{
  "professional_id": "uuid",
  "context": {
    "days_ahead": 7,
    "offer_type": "discount",
    "offer_value": 20
  }
}
```

### Sincronização (Frontend → Backend)

```http
# Buscar autorizações pendentes
GET /api/v1/sync/pending-auth-requests
Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "id": "uuid",
      "appointment_data": {...},
      "created_at": "2024-01-15T10:00:00Z",
      "created_by_agent": "prazo_certo"
    },
    ...
  ]
}
```

```http
# Owner aprova/rejeita autorização
POST /api/v1/sync/confirm-auth-request/{request_id}
Content-Type: application/json
Authorization: Bearer {token}

{
  "decision": "approve",
  "notes": "Confirmar com Carol"
}

Response:
{
  "status": "success",
  "appointment_id": "uuid",
  "client_notification_sent": true
}
```

### Webhooks (N8N → Backend)

```http
# N8N envia mensagem de cliente
POST /api/v1/webhooks/n8n/message-received
Content-Type: application/json

{
  "tenant_id": "uuid",
  "client_id": "uuid",
  "client_name": "João",
  "phone": "+5511999999999",
  "message": "Quero agendar",
  "channel": "whatsapp",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## 🌐 WebSocket (Real-time Sync)

### Conexão

```javascript
// Frontend
const ws = new WebSocket(
  `wss://backend.seu-dominio.com/ws/sync?tenant_id=${tenantId}&token=${token}`
);

ws.onmessage = (event) => {
  const { event_type, data } = JSON.parse(event.data);

  switch (event_type) {
    case "auth_request_created":
      // Uma automação criou novo auth_request
      dispatch({ type: "ADD_AUTH_REQUEST", payload: data });
      break;

    case "appointment_created":
      // Agendamento foi criado (após aprovação)
      dispatch({ type: "ADD_APPOINTMENT", payload: data });
      break;

    case "ai_response":
      // IA respondeu no chat
      dispatch({ type: "ADD_MESSAGE", payload: data });
      break;

    case "campaign_completed":
      // Campanha terminou
      dispatch({ type: "SET_CAMPAIGN_STATS", payload: data.stats });
      break;

    case "notification_sent":
      // Mensagem foi enviada
      console.log(`Notificação enviada para ${data.client_id}`);
      break;
  }
};
```

### Tipos de Eventos

```typescript
// Disparados pelo backend para React

interface AuthRequestCreatedEvent {
  event_type: "auth_request_created";
  data: {
    auth_request: {
      id: string;
      appointment_data: AppointmentData;
      created_by_agent: string;
      created_at: string;
    };
  };
}

interface AppointmentCreatedEvent {
  event_type: "appointment_created";
  data: {
    appointment_id: string;
    client_id: string;
    date: string;
    time: string;
    service_name: string;
  };
}

interface AIResponseEvent {
  event_type: "ai_response";
  data: {
    conversation_id: string;
    client_id: string;
    message: string;
    intent: "booking" | "inquiry" | "complaint" | "hello" | "unknown";
    booking_created: boolean;
  };
}

interface CampaignCompletedEvent {
  event_type: "campaign_completed";
  data: {
    campaign_type: "prazo_certo" | "encher_agenda";
    stats: {
      total_clients_found: number;
      suggestions_created: number;
      notifications_sent: number;
    };
  };
}
```

---

## 🔐 Autenticação

**Usar JWT com token Bearer**

```typescript
// Frontend
const token = localStorage.getItem("auth_token");

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

// Backend valida via middleware
@app.get("/api/v1/sync/pending-auth-requests")
async def get_pending_requests(
    current_user = Depends(get_current_user),
    sync_service = Depends()
):
    # current_user tem { tenant_id, user_id, role }
    return await sync_service.get_pending_requests(
        tenant_id=current_user["tenant_id"]
    )
```

---

## 📊 Context Update (React)

**AppContext.tsx deve ser atualizado quando eventos chegam:**

```typescript
// contexts/AppContext.tsx

type AppAction =
  | { type: "ADD_AUTH_REQUEST"; payload: AuthRequest }
  | { type: "REMOVE_AUTH_REQUEST"; payload: string }  // request_id
  | { type: "ADD_APPOINTMENT"; payload: Appointment }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_CAMPAIGN_STATS"; payload: object }
  | { type: "UPDATE_NOTIFICATIONS"; payload: Notification[] };

// Reducer já existente deve suportar:
case "ADD_AUTH_REQUEST":
  return {
    ...state,
    authRequests: [...(state.authRequests || []), action.payload],
  };

case "REMOVE_AUTH_REQUEST":
  return {
    ...state,
    authRequests: (state.authRequests || []).filter(
      (r) => r.id !== action.payload
    ),
  };
```

---

## 🚀 Checklist de Integração

### Phase 1: Setup Backend
- [ ] Criar estrutura Python (models, services, agents)
- [ ] Implementar Orchestrator
- [ ] Setup FastAPI + uvicorn
- [ ] Conectar PostgreSQL (Prisma)
- [ ] Setup Redis + Celery

### Phase 2: Integração Frontend
- [ ] Criar hook `useAgentSync` (WebSocket)
- [ ] Atualizar AppContext para novos tipos de eventos
- [ ] Implementar `<AuthRequestCard>` no Dashboard
- [ ] Integrar chat com API de webhooks

### Phase 3: N8N
- [ ] Criar workflow WhatsApp input
- [ ] Criar workflow para enviar respostas
- [ ] Mapear webhooks para Backend

### Phase 4: Testing
- [ ] Teste E2E: Cliente envia msg → IA responde → Owner aprova
- [ ] Teste de performance (load test)
- [ ] Teste de errores e retry logic

---

## 📝 Exemplo Completo: "Prazo Certo"

```
DIA 1 - 09:00 (Celery Beat dispara)
├─ Orchestrator executa PrazoCertoAgent
├─ Agent busca clientes em ciclo de retorno
├─ Cria 25 auth_requests
├─ Dispara CampaignCompletedEvent
│  {
│    "event_type": "campaign_completed",
│    "data": {
│      "campaign_type": "prazo_certo",
│      "stats": { "sent": 25, "total_found": 30 }
│    }
│  }
└─ Publica em Redis EventBus

REACT LISTENING (Dashboard)
├─ Websocket recebe evento
├─ "✅ Campanha Prazo Certo concluída: 25 mensagens enviadas!"
├─ Counter: "4 Autorizações Pendentes" (25 - 21 que ainda não chegaram)
└─ Owner vê tabela com clientes a aprovar

DIA 2 - Client recebe WhatsApp
├─ Cliente responde "Sim, quero agendar"
├─ N8N envia para Backend
├─ ChatAgent processa resposta
├─ Cria auth_request para confirmar
├─ React notifica owner via WebSocket
└─ Owner aprova → appointment criado

RESULTADO: Fluxo completo automático + manual
```

---

## 📚 Próximos Passos

1. **Implementar Providers** (DataProvider, LLMProvider, etc)
2. **Criar FastAPI routes** (automations, webhooks, sync)
3. **Setup N8N workflows**
4. **Implementar WebSocket server**
5. **Update React hooks** para sincronização real-time
6. **Testing** completo end-to-end
