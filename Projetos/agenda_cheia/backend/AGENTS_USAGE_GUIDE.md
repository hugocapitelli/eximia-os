# 📖 GUIA DE USO DOS AGENTES

**Como usar os agentes Python na prática**

---

## 1️⃣ SETUP INICIAL

### Instalar dependências

```bash
cd backend
pip install -r requirements.txt
```

### Variáveis de ambiente (.env)

```bash
# Database
DATABASE_URL=postgresql://agenda_user:agenda_pass@localhost:5432/agenda_cheia

# LLM
GEMINI_API_KEY=sk-...

# Redis
REDIS_URL=redis://localhost:6379

# N8N
N8N_WEBHOOK_URL=https://n8n.seu-dominio.com/webhook

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Iniciar serviços (Docker Compose)

```bash
docker-compose up -d postgres redis celery_worker celery_beat
```

---

## 2️⃣ INSTANCIAR AGENTES

### Exemplo 1: Executar PrazoCerto manualmente

```python
# backend/scripts/run_prazo_certo.py

import asyncio
from app.core.types import ExecutionContext, Agent as AgentType, AutomationWorkflowType
from app.agents.prazo_certo_agent import PrazoCertoAgent
from app.providers import (
    PostgreSQLDataProvider,
    GeminiLLMProvider,
    TwilioNotificationProvider,
    RedisEventBus,
)


async def main():
    # Step 1: Instanciar Providers
    data_provider = PostgreSQLDataProvider(
        database_url="postgresql://agenda_user:agenda_pass@localhost/agenda_cheia"
    )
    llm_provider = GeminiLLMProvider(api_key="sk-...")
    notification_provider = TwilioNotificationProvider(
        account_sid="AC...",
        auth_token="...",
    )
    event_bus = RedisEventBus(redis_url="redis://localhost:6379")

    # Step 2: Instanciar Agente
    agent = PrazoCertoAgent(
        data_provider=data_provider,
        llm_provider=llm_provider,
        notification_provider=notification_provider,
        event_bus=event_bus,
    )

    # Step 3: Preparar contexto
    tenant_id = "salon-uuid-123"
    execution_id = "exec-uuid-456"

    agent_obj = AgentType(
        tenant_id=tenant_id,
        agent_id="agent-prazo-certo-001",
        agent_type=AutomationWorkflowType.PRAZO_CERTO,
        execution_id=execution_id,
    )

    # Buscar dados do banco
    clients = await data_provider.get_clients(tenant_id)
    services = await data_provider.get_services(tenant_id)
    professionals = await data_provider.get_professionals(tenant_id)
    appointments = await data_provider.get_appointments(tenant_id)

    context = ExecutionContext(
        agent=agent_obj,
        clients=clients,
        professionals=professionals,
        services=services,
        appointments=appointments,
        campaign_config={
            "service_id": "manicure-uuid",  # Serviço alvo
            "professional_id": None,  # Qualquer profissional
            "offer_type": "discount",
            "offer_value": 15,
        },
    )

    # Step 4: Executar agente
    result = await agent.execute(context)

    # Step 5: Verificar resultado
    print(f"Status: {result.status}")
    print(f"Auth requests criados: {len(result.auth_requests_created)}")
    print(f"Métrics: {result.metrics}")
    for event in result.events:
        print(f"Event: {event.event_type}")


if __name__ == "__main__":
    asyncio.run(main())
```

**Rodar:**
```bash
python backend/scripts/run_prazo_certo.py
```

---

### Exemplo 2: Usar via Orchestrator (RECOMENDADO)

```python
# backend/scripts/run_via_orchestrator.py

import asyncio
from app.core.orchestrator import DefaultOrchestrator
from app.agents.prazo_certo_agent import PrazoCertoAgent
from app.providers import (
    PostgreSQLDataProvider,
    GeminiLLMProvider,
    TwilioNotificationProvider,
    RedisEventBus,
)


async def main():
    # Providers
    data = PostgreSQLDataProvider("postgresql://...")
    llm = GeminiLLMProvider("sk-...")
    notify = TwilioNotificationProvider(...)
    events = RedisEventBus("redis://...")

    # Orchestrator
    orchestrator = DefaultOrchestrator(
        data_provider=data,
        llm_provider=llm,
        notification_provider=notify,
        event_bus=events,
    )

    # Registrar agentes
    orchestrator.register_agent(
        "prazo_certo",
        PrazoCertoAgent(data, llm, notify, events),
    )

    # Executar via orchestrator
    result = await orchestrator.execute_workflow(
        workflow_type="prazo_certo",
        tenant_id="salon-uuid-123",
        campaign_config={
            "service_id": "manicure-uuid",
            "offer_type": "discount",
            "offer_value": 15,
        },
    )

    print(f"Resultado: {result.status}")


asyncio.run(main())
```

---

## 3️⃣ AGENTES EM PRODUÇÃO (FastAPI)

### Estrutura de FastAPI

```python
# backend/app/main.py

from fastapi import FastAPI
from app.core.orchestrator import DefaultOrchestrator
from app.agents.prazo_certo_agent import PrazoCertoAgent
from app.agents.encher_agenda_agent import EncherAgendaAgent
from app.agents.chat_agent import ChatAgent
from app.providers import (...)

app = FastAPI()

# Instanciar dependências globais
data_provider = PostgreSQLDataProvider(...)
llm_provider = GeminiLLMProvider(...)
notification_provider = TwilioNotificationProvider(...)
event_bus = RedisEventBus(...)

orchestrator = DefaultOrchestrator(
    data_provider=data_provider,
    llm_provider=llm_provider,
    notification_provider=notification_provider,
    event_bus=event_bus,
)

# Registrar agentes
orchestrator.register_agent(
    "prazo_certo",
    PrazoCertoAgent(data_provider, llm_provider, notification_provider, event_bus),
)
orchestrator.register_agent(
    "encher_agenda",
    EncherAgendaAgent(data_provider, llm_provider, notification_provider, event_bus),
)
orchestrator.register_agent(
    "chat_ia",
    ChatAgent(data_provider, llm_provider, notification_provider, event_bus),
)
```

### Rotas de API

```python
# backend/app/api/v1/automations.py

from fastapi import APIRouter, Depends
from app.dependencies import get_orchestrator, get_current_user

router = APIRouter(prefix="/automations", tags=["automations"])


@router.post("/prazo-certo/execute")
async def execute_prazo_certo(
    campaign_config: dict,
    current_user=Depends(get_current_user),
    orchestrator=Depends(get_orchestrator),
):
    """Dispara campanha Prazo Certo"""

    result = await orchestrator.execute_workflow(
        workflow_type="prazo_certo",
        tenant_id=current_user["tenant_id"],
        campaign_config=campaign_config,
    )

    return {
        "status": result.status.value,
        "metrics": result.metrics,
        "auth_requests_created": len(result.auth_requests_created),
    }


@router.post("/encher-agenda/execute")
async def execute_encher_agenda(
    professional_id: str,
    context: dict,
    current_user=Depends(get_current_user),
    orchestrator=Depends(get_orchestrator),
):
    """Dispara campanha Encher Agenda"""

    result = await orchestrator.execute_workflow(
        workflow_type="encher_agenda",
        tenant_id=current_user["tenant_id"],
        campaign_config={
            "professional_id": professional_id,
            **context,
        },
    )

    return {
        "status": result.status.value,
        "metrics": result.metrics,
    }


@router.post("/chat/process-message")
async def process_chat_message(
    conversation_id: str,
    client_id: str,
    message: str,
    current_user=Depends(get_current_user),
    orchestrator=Depends(get_orchestrator),
):
    """Processa mensagem de cliente via chat"""

    # Buscar conversa
    conversation = await get_conversation(conversation_id)

    result = await orchestrator.execute_workflow(
        workflow_type="chat_ia",
        tenant_id=current_user["tenant_id"],
        conversation={
            "id": conversation_id,
            "client_id": client_id,
            "messages": conversation.messages + [
                {"role": "client", "content": message}
            ],
        },
    )

    return {
        "status": result.status.value,
        "ai_response": result.events[0].data["message"]
        if result.events
        else None,
    }
```

---

## 4️⃣ AGENDAMENTO AUTOMÁTICO (Celery)

### Tasks

```python
# backend/app/tasks/automation_tasks.py

from celery import shared_task
from app.core.orchestrator import DefaultOrchestrator
from app.providers import (...)


@shared_task(bind=True)
def execute_prazo_certo_daily(self):
    """Roda Prazo Certo todos os dias às 09:00"""

    # Instanciar orchestrator
    orchestrator = DefaultOrchestrator(...)

    # Buscar todos os tenants
    tenants = get_all_active_tenants()

    for tenant in tenants:
        try:
            result = orchestrator.execute_workflow(
                workflow_type="prazo_certo",
                tenant_id=tenant["id"],
                campaign_config={
                    "service_id": None,  # Todos os serviços
                    "offer_type": "discount",
                    "offer_value": 10,
                },
            )
            logger.info(f"Prazo Certo executed for {tenant['id']}: {result.status}")
        except Exception as e:
            logger.error(f"Error in Prazo Certo for {tenant['id']}: {e}")
            raise self.retry(countdown=300)  # Retry em 5min


@shared_task(bind=True)
def execute_encher_agenda_weekly(self):
    """Roda Encher Agenda 3x por semana"""

    orchestrator = DefaultOrchestrator(...)
    tenants = get_all_active_tenants()

    for tenant in tenants:
        # Para cada profissional do tenant
        professionals = orchestrator.data.get_professionals(tenant["id"])

        for prof in professionals:
            try:
                result = orchestrator.execute_workflow(
                    workflow_type="encher_agenda",
                    tenant_id=tenant["id"],
                    campaign_config={
                        "professional_id": prof["id"],
                        "days_ahead": 7,
                        "offer_type": "discount",
                        "offer_value": 20,
                    },
                )
                logger.info(f"Encher Agenda executed for {prof['id']}")
            except Exception as e:
                logger.error(f"Error in Encher Agenda: {e}")
```

### Celery Beat Schedule

```python
# backend/app/celery_config.py

from celery.schedules import crontab

# Configuração do Celery Beat
CELERY_BEAT_SCHEDULE = {
    # Prazo Certo: todo dia às 09:00
    "prazo-certo-daily": {
        "task": "app.tasks.automation_tasks.execute_prazo_certo_daily",
        "schedule": crontab(hour=9, minute=0),
    },
    # Encher Agenda: seg/qua/sex às 14:00
    "encher-agenda-weekly": {
        "task": "app.tasks.automation_tasks.execute_encher_agenda_weekly",
        "schedule": crontab(hour=14, minute=0, day_of_week="0,2,4"),
    },
}
```

---

## 5️⃣ INTEGRANDO COM N8N (WEBHOOKS)

### N8N envia para Backend

```python
# backend/app/api/v1/webhooks.py

from fastapi import APIRouter, BackgroundTasks
from app.dependencies import get_orchestrator

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/n8n/message-received")
async def on_message_received(
    payload: dict,
    background_tasks: BackgroundTasks,
    orchestrator=Depends(get_orchestrator),
):
    """
    N8N envia mensagem de cliente

    Payload:
    {
        "tenant_id": "uuid",
        "client_id": "uuid",
        "client_name": "João",
        "message": "Quero agendar",
        "phone": "+5511999999999"
    }
    """

    # Processar em background (não bloquear resposta)
    background_tasks.add_task(
        process_client_message,
        payload,
        orchestrator,
    )

    return {"status": "accepted"}


async def process_client_message(payload, orchestrator):
    """Task que processa mensagem do cliente"""

    # Buscar conversa
    conversation = await get_conversation(
        tenant_id=payload["tenant_id"],
        client_id=payload["client_id"],
    )

    # Executar ChatAgent via Orchestrator
    result = await orchestrator.execute_workflow(
        workflow_type="chat_ia",
        tenant_id=payload["tenant_id"],
        conversation={
            "id": conversation.id,
            "client_id": payload["client_id"],
            "client_name": payload["client_name"],
            "messages": conversation.messages
            + [{"role": "client", "content": payload["message"]}],
        },
    )

    # Resposta da IA já foi enviada via WebSocket
    # N8N vai receber a resposta numa outra callback
```

### Backend envia para N8N

```python
# backend/app/integrations/n8n_webhook.py

import httpx


class N8NWebhookClient:
    def __init__(self, n8n_webhook_url: str):
        self.base_url = n8n_webhook_url

    async def send_whatsapp_message(
        self, phone: str, message: str, tenant_id: str
    ):
        """Envia mensagem WhatsApp via N8N"""

        payload = {
            "action": "send_whatsapp",
            "phone": phone,
            "message": message,
            "tenant_id": tenant_id,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/send-message",
                json=payload,
            )

        return response.json()
```

---

## 6️⃣ TESTANDO AGENTES

### Unit Test

```python
# backend/tests/test_prazo_certo_agent.py

import pytest
from app.agents.prazo_certo_agent import PrazoCertoAgent
from app.core.types import ExecutionContext, AutomationWorkflowType, Agent as AgentType
from unittest.mock import AsyncMock, MagicMock


@pytest.mark.asyncio
async def test_prazo_certo_finds_return_cycle_clients():
    """Testa se agente encontra clientes em ciclo"""

    # Mock providers
    data_provider = AsyncMock()
    llm_provider = AsyncMock()
    notification_provider = AsyncMock()
    event_bus = AsyncMock()

    # Criar agente
    agent = PrazoCertoAgent(
        data_provider=data_provider,
        llm_provider=llm_provider,
        notification_provider=notification_provider,
        event_bus=event_bus,
    )

    # Criar contexto mock
    context = ExecutionContext(
        agent=AgentType(
            tenant_id="test-tenant",
            agent_id="test-agent",
            agent_type=AutomationWorkflowType.PRAZO_CERTO,
            execution_id="test-exec",
        ),
        clients=[
            {
                "id": "client-1",
                "name": "João",
                "last_visit": "2024-01-01",
                "status": "active",
            },
        ],
        services=[
            {
                "id": "service-1",
                "name": "Manicure",
                "return_cycle_days": 14,
            },
        ],
        appointments=[
            {
                "client_id": "client-1",
                "service_id": "service-1",
                "date": "2024-01-01",
            },
        ],
        campaign_config={
            "service_id": "service-1",
            "offer_type": "discount",
            "offer_value": 15,
        },
    )

    # Executar
    result = await agent.execute(context)

    # Verificar
    assert result.status == "success"
    assert len(result.auth_requests_created) > 0
```

### Integration Test

```python
# backend/tests/integration/test_prazo_certo_integration.py

@pytest.mark.asyncio
async def test_prazo_certo_full_flow():
    """Testa fluxo completo: agente → DB → eventos"""

    # Conectar ao DB real
    db = AsyncPgPool("postgresql://...")
    orchestrator = DefaultOrchestrator(
        data_provider=PostgreSQLDataProvider(db),
        llm_provider=GeminiLLMProvider("sk-..."),
        notification_provider=TwilioNotificationProvider(...),
        event_bus=RedisEventBus("redis://..."),
    )

    # Executar workflow
    result = await orchestrator.execute_workflow(
        workflow_type="prazo_certo",
        tenant_id="test-tenant",
        campaign_config={
            "service_id": "test-service",
            "offer_type": "discount",
            "offer_value": 15,
        },
    )

    # Verificar que auth requests foram criados no DB
    auth_requests = await db.fetch(
        "SELECT * FROM auth_requests WHERE workflow_id = $1",
        result.execution_id,
    )

    assert len(auth_requests) > 0
    assert result.status == "success"
```

---

## 📊 MONITORAMENTO

### Logs

```python
# Todos os agentes logam via Python logging

import logging

logger = logging.getLogger(__name__)

logger.info("[PrazoCerto] Iniciando campanha")
logger.debug("[PrazoCerto] Encontrados 25 clientes")
logger.warning("[PrazoCerto] Sem horários disponíveis para Carol")
logger.error("[PrazoCerto] Erro ao enviar WhatsApp", exc_info=True)
```

### Métricas

```python
# Após execução, verificar result.metrics

{
    "total_clients_found": 30,
    "suggestions_created": 25,
    "notifications_sent": 25,
    "duration_seconds": 12.5,
}
```

### Status de Execução

```python
# Salvo em DB via Orchestrator

await orchestrator.data.save_execution(
    tenant_id="uuid",
    execution_id="uuid",
    workflow_type="prazo_certo",
    status="success",  # ou "failed"
    metrics={...},
    error=None,  # ou mensagem de erro
)

# Consultar histórico
executions = await orchestrator.list_executions(
    tenant_id="uuid",
    workflow_type="prazo_certo",
    limit=50,
)
```

---

## 🔗 FLUXO COMPLETO

```
React Dashboard
    ↓ (Click "Executar Prazo Certo")
    ↓
FastAPI
  POST /api/v1/automations/prazo-certo/execute
    ↓
Orchestrator.execute_workflow()
    ↓
PrazoCertoAgent.execute()
    ├─ _find_return_cycle_clients()
    ├─ _create_suggestion() x 25
    ├─ send_notification() x 25
    └─ emit_event(CampaignCompletedEvent)
    ↓
Redis EventBus publica evento
    ↓
React WebSocket escuta
  onmessage: { event_type: "campaign_completed", stats: {...} }
    ↓
React atualiza Dashboard
  "✅ Campanha concluída: 25 mensagens enviadas"
  "4 Autorizações Pendentes"
```

---

## ✅ Checklist

- [ ] Providers implementados (Data, LLM, Notification, EventBus)
- [ ] Agentes registrados no Orchestrator
- [ ] FastAPI routes criadas
- [ ] WebSocket configurado
- [ ] Celery Beat schedules definidos
- [ ] N8N webhooks mapeados
- [ ] Tests passando (unit + integration)
- [ ] Monitoramento/logs setup
- [ ] React hooks conectados ao backend
