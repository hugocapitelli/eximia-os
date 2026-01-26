# 🔌 PROVIDERS - Visão Geral

**Data, LLM, Notifications e EventBus implementados e prontos para plugar**

---

## 📂 ESTRUTURA CRIADA

```
backend/
├── app/
│   ├── core/
│   │   ├── types.py                    ✅ Tipos compartilhados
│   │   ├── abstractions.py             ✅ Interfaces (contratos)
│   │   └── orchestrator.py             ✅ Orquestrador
│   │
│   ├── providers/                       ✅ IMPLEMENTAÇÕES
│   │   ├── __init__.py
│   │   ├── data_provider.py             ✅ PostgreSQL
│   │   ├── llm_provider.py              ✅ Gemini
│   │   ├── notification_provider.py     ✅ N8N, Twilio, Email
│   │   └── event_bus.py                 ✅ Redis Pub/Sub
│   │
│   ├── agents/
│   │   ├── prazo_certo_agent.py        ✅ Retorno automático
│   │   ├── encher_agenda_agent.py      ✅ Preencher buracos
│   │   └── chat_agent.py               ✅ Chat com IA
│   │
│   ├── api/v1/
│   │   ├── automations.py              ✅ POST /execute
│   │   ├── webhooks.py                 ✅ POST /webhooks
│   │   └── sync.py                     ✅ GET/POST /sync
│   │
│   ├── config.py                        ✅ Settings
│   ├── dependencies.py                  ✅ Injeção de dependência
│   ├── main.py                          ✅ FastAPI app
│   └── __init__.py
│
├── .env.example                         ✅ Template de config
├── requirements.txt                     ✅ Dependências
└── PROVIDERS_OVERVIEW.md               ✅ Este arquivo
```

---

## 🔗 4 PROVIDERS IMPLEMENTADOS

### 1️⃣ **DataProvider** - PostgreSQL

**Arquivo:** `app/providers/data_provider.py`

**Interface:** `PostgreSQLDataProvider`

**Métodos:**
```python
# Clients
get_client(tenant_id, client_id)
get_clients(tenant_id)
get_clients_for_campaign(tenant_id, service_id, criteria)

# Professionals
get_professional(tenant_id, professional_id)
get_professionals(tenant_id)

# Services
get_service(tenant_id, service_id)
get_services(tenant_id)

# Appointments
get_appointments(tenant_id, date_from, date_to, professional_id, status)
create_appointment(appointment_data)
get_available_slots(tenant_id, professional_id, date_from, date_to)

# Auth Requests (Lazy Sync)
create_auth_request(tenant_id, appointment_data, created_by_agent)
get_pending_auth_requests(tenant_id)
update_auth_request(request_id, status, tenant_id)

# Config
get_salon_config(tenant_id)
get_ai_config(tenant_id)

# Execution Logging
save_execution(tenant_id, execution_id, workflow_type, status, metrics, error)
get_executions(tenant_id, workflow_type, limit)
```

**Como usar:**
```python
data_provider = PostgreSQLDataProvider(
    database_url="postgresql://user:pass@localhost/agenda_cheia"
)
await data_provider.initialize()

clients = await data_provider.get_clients(tenant_id="salon-123")
```

---

### 2️⃣ **LLMProvider** - Gemini

**Arquivo:** `app/providers/llm_provider.py`

**Interface:** `GeminiLLMProvider`

**Métodos:**
```python
# Geração de texto
generate(prompt, temperature=0.7, max_tokens=500)

# Chat com histórico
chat(message, history, system_prompt, temperature=0.8, max_tokens=1000)

# Detecção de intenção
detect_intent(text, intent_list=["booking", "inquiry", "complaint", ...])

# Extração de dados estruturados
extract_data(text, schema)  # Retorna JSON

# Ranking de clientes
rank_clients(clients, criteria)  # Retorna lista ordenada

# Helpers
summarize(text, max_length=200)
translate(text, target_language="en")
generate_personalized_message(template, variables, personality, tone)
```

**Como usar:**
```python
llm_provider = GeminiLLMProvider(api_key="sk-...")

message = await llm_provider.generate(
    "Gere uma mensagem de agendamento"
)

intent = await llm_provider.detect_intent(
    "Quero agendar",
    intent_list=["booking", "inquiry", "complaint"]
)
```

---

### 3️⃣ **NotificationProvider** - Múltiplos Canais

**Arquivo:** `app/providers/notification_provider.py`

**4 Implementações:**

#### a) **N8NNotificationProvider** (RECOMENDADO para MVP)
```python
provider = N8NNotificationProvider(
    n8n_base_url="https://n8n.seu-dominio.com",
    webhook_token="token123"
)

await provider.send_whatsapp("+5511999999999", "Olá!", "tenant-123")
await provider.send_sms("+5511999999999", "Olá!", "tenant-123")
await provider.send_email("user@email.com", "Assunto", "Corpo", "tenant-123")
await provider.send_push("user-123", "Título", "Corpo", {"data": "..."})
```

#### b) **TwilioNotificationProvider**
```python
provider = TwilioNotificationProvider(
    account_sid="AC...",
    auth_token="...",
    whatsapp_phone="+5511999999999",
    sms_phone="+5511999999999"
)

await provider.send_whatsapp(...)
await provider.send_sms(...)
# Email não suportado - usar SendGrid
```

#### c) **SendGridEmailProvider**
```python
provider = SendGridEmailProvider(
    api_key="SG...",
    from_email="noreply@agenda.com"
)

await provider.send_email(
    "user@email.com",
    "Seu agendamento",
    "Você agendou com sucesso!",
    html_body="<h1>Agendamento confirmado</h1>"
)
```

#### d) **MockNotificationProvider** (Testes)
```python
provider = MockNotificationProvider()  # Loga em vez de enviar
await provider.send_whatsapp(...)  # Retorna ID fake
```

---

### 4️⃣ **EventBus** - Pub/Sub Real-time

**Arquivo:** `app/providers/event_bus.py`

**2 Implementações:**

#### a) **RedisEventBus** (PRODUÇÃO)
```python
event_bus = RedisEventBus(redis_url="redis://localhost:6379")
await event_bus.initialize()

# Publicar evento
event = AuthRequestCreatedEvent(...)
await event_bus.publish(event)

# Subscrever
async def on_auth_created(event):
    print(f"Nova autorização: {event.data}")

await event_bus.subscribe("auth_request_created", on_auth_created)

# Emitir para React
await event_bus.emit_to_frontend(tenant_id, event)

# Registrar WebSocket
await event_bus.register_websocket(tenant_id, websocket)

# Histórico
history = await event_bus.get_event_history(tenant_id, "auth_request_created")
```

#### b) **InMemoryEventBus** (TESTES/DEV)
```python
event_bus = InMemoryEventBus()
# Mesma interface, mas em memória (não multi-processo)
```

---

## 🧩 COMO TUDO SE CONECTA

### Inicialização (startup)

```python
# app/main.py
@app.on_event("startup")
async def startup():
    # 1. Inicializar providers
    await initialize_dependencies()

    # 2. Registrar agentes
    orchestrator = await get_orchestrator()
    await register_agents(orchestrator)
```

**O que acontece:**

```
initialize_dependencies()
  ├─ DataProvider.initialize()     → Conexão com PostgreSQL
  ├─ LLMProvider.__init__()        → Setup Gemini
  ├─ NotificationProvider.__init__() → Setup N8N/Twilio
  ├─ EventBus.initialize()         → Conexão com Redis
  └─ DefaultOrchestrator()         → Orquestrador com tudo conectado

register_agents(orchestrator)
  ├─ PrazoCertoAgent(providers)    → Registra
  ├─ EncherAgendaAgent(providers)  → Registra
  └─ ChatAgent(providers)          → Registra
```

### Execução (um agente roda)

```
React: POST /api/v1/automations/prazo-certo/execute
    ↓
FastAPI: orchestrator.execute_workflow()
    ↓
Orchestrator:
  ├─ Busca agente registrado: PrazoCertoAgent
  ├─ Monta context com dados do DataProvider
  └─ Chama: await agent.execute(context)
    ↓
PrazoCertoAgent:
  ├─ data_provider.get_clients()        → Busca clientes
  ├─ llm_provider.generate()            → Gera mensagens
  ├─ notification_provider.send_whatsapp() → Envia msgs
  ├─ data_provider.create_auth_request() → Cria lazy sync
  ├─ event_bus.publish(event)           → Publica evento
  └─ Retorna ExecutionResult
    ↓
FastAPI:
  ├─ data_provider.save_execution()     → Persiste em DB
  └─ event_bus.emit_to_frontend()       → Envia para React
    ↓
React WebSocket: Recebe evento
    ├─ "4 autorizações pendentes!"
    ├─ Atualiza Dashboard
    └─ Owner aprova/rejeita
```

---

## ⚙️ CONFIGURAÇÃO

### 1. Criar `.env`

```bash
cp backend/.env.example backend/.env
```

Editar com seus valores:
```
DATABASE_URL=postgresql://agenda_user:agenda_pass@localhost:5432/agenda_cheia
GEMINI_API_KEY=sk-...
N8N_BASE_URL=https://n8n.seu-dominio.com
REDIS_URL=redis://localhost:6379
```

### 2. Instalar dependências

```bash
cd backend
pip install -r requirements.txt
```

### 3. Iniciar serviços

```bash
# Terminal 1: PostgreSQL
docker run -d \
  --name postgres \
  -e POSTGRES_USER=agenda_user \
  -e POSTGRES_PASSWORD=agenda_pass \
  -e POSTGRES_DB=agenda_cheia \
  -p 5432:5432 \
  postgres:15

# Terminal 2: Redis
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:7

# Terminal 3: Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Testar

```bash
# Health check
curl http://localhost:8000/health

# Docs interativa
open http://localhost:8000/docs
```

---

## 🚀 DEPENDENCY INJECTION

**Em qualquer route, injete os providers:**

```python
from fastapi import Depends
from app.dependencies import (
    get_data_provider,
    get_llm_provider,
    get_notification_provider,
    get_event_bus,
    get_orchestrator,
)

@app.post("/api/v1/test")
async def test_route(
    data_provider = Depends(get_data_provider),
    llm_provider = Depends(get_llm_provider),
    notification_provider = Depends(get_notification_provider),
    event_bus = Depends(get_event_bus),
    orchestrator = Depends(get_orchestrator),
):
    # Todos estão prontos!
    clients = await data_provider.get_clients("tenant-123")
    message = await llm_provider.generate("prompt")
    return {"ok": True}
```

---

## 📊 ARQUITETURA DE PROVIDERS

```
┌─────────────────────────────────────────────────────────┐
│                   ABSTRAÇÕES (contratos)               │
├─────────────────────────────────────────────────────────┤
│  DataProvider | LLMProvider | NotificationProvider | EventBus
└─────────────────────────────────────────────────────────┘
                            ↑
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────┴────────┐ ┌───────┴────────┐ ┌───────┴────────┐
│  Implementações│ │  Implementações│ │  Implementações│
├────────────────┤ ├────────────────┤ ├────────────────┤
│  PostgreSQL    │ │  GeminiLLM     │ │  N8N           │
│  (async)       │ │  (Google API)  │ │  Twilio        │
│                │ │                │ │  SendGrid      │
│                │ │                │ │  Mock          │
└────────────────┘ └────────────────┘ └────────────────┘
        ↑                   ↑                   ↑
    Agent usa         Agent usa          Agent usa
```

---

## ✅ CHECKLIST - O QUE ESTÁ PRONTO

- [x] DataProvider (PostgreSQL completo)
- [x] LLMProvider (Gemini completo)
- [x] NotificationProvider (N8N, Twilio, SendGrid)
- [x] EventBus (Redis + InMemory)
- [x] Dependências FastAPI
- [x] Rotas /api/v1/automations
- [x] Rotas /api/v1/webhooks
- [x] Rotas /api/v1/sync
- [x] WebSocket /ws/sync
- [x] Config centralizada
- [x] requirements.txt

---

## 🎯 PRÓXIMOS PASSOS

1. **Criar banco de dados**
   ```bash
   docker-compose up
   # Rodar migrations Prisma
   ```

2. **Testar providers**
   ```bash
   pytest backend/tests/test_providers.py
   ```

3. **Conectar N8N**
   - Criar workflows em N8N
   - Apontar webhooks para backend

4. **Testar fluxo completo**
   - Cliente envia msg → Backend processa → React atualiza

5. **Deploy**
   - Docker images
   - Kubernetes (opcional)
   - CI/CD

---

## 📚 DOCUMENTAÇÃO CRIADA

1. **INTEGRACAO_BACKEND_FRONTEND.md** - Fluxos completos com React
2. **AGENTS_USAGE_GUIDE.md** - Como usar agentes
3. **PROVIDERS_OVERVIEW.md** - Este arquivo

---

## 🎬 RESUMO

**Todos os 4 providers estão 100% implementados e prontos para usar:**

- ✅ **DataProvider**: Acesso completo ao PostgreSQL
- ✅ **LLMProvider**: IA via Gemini com múltiplos métodos
- ✅ **NotificationProvider**: 4 implementações (N8N, Twilio, SendGrid, Mock)
- ✅ **EventBus**: Pub/Sub com Redis (+ InMemory para testes)

**FastAPI totalmente configurado:**
- ✅ Dependency Injection
- ✅ Rotas /automations, /webhooks, /sync
- ✅ WebSocket real-time
- ✅ Error handling

**Próximo passo:** Criar testes e integração com N8N!
