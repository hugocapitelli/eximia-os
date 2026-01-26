# backend/app/dependencies.py
"""
FastAPI Dependency Injection

Define todas as dependências globais e como injetá-las em routes
"""

from typing import Optional
from functools import lru_cache
import logging

from fastapi import Depends, HTTPException, status

from app.config import settings
from app.providers import (
    PostgreSQLDataProvider,
    GeminiLLMProvider,
    N8NNotificationProvider,
    TwilioNotificationProvider,
    MockNotificationProvider,
    RedisEventBus,
    InMemoryEventBus,
)
from app.core.orchestrator import DefaultOrchestrator


logger = logging.getLogger(__name__)


# ============================================================================
# SINGLETON INSTANCES - Instancias globais de providers
# ============================================================================

_data_provider: Optional[PostgreSQLDataProvider] = None
_llm_provider: Optional[GeminiLLMProvider] = None
_notification_provider = None
_event_bus = None
_orchestrator: Optional[DefaultOrchestrator] = None


async def initialize_dependencies():
    """
    Inicializa todas as dependências (chamar no startup da app)

    Tipicamente em app/main.py:
    @app.on_event("startup")
    async def startup():
        await initialize_dependencies()
    """

    global _data_provider, _llm_provider, _notification_provider, _event_bus, _orchestrator

    logger.info("Initializing dependencies...")

    # 1. DataProvider
    _data_provider = PostgreSQLDataProvider(settings.DATABASE_URL)
    await _data_provider.initialize()
    logger.info("✓ DataProvider initialized")

    # 2. LLMProvider
    _llm_provider = GeminiLLMProvider(
        api_key=settings.GEMINI_API_KEY,
        model=settings.LLM_MODEL,
    )
    logger.info("✓ LLMProvider initialized")

    # 3. NotificationProvider
    if settings.NOTIFICATION_PROVIDER == "n8n":
        _notification_provider = N8NNotificationProvider(
            n8n_base_url=settings.N8N_BASE_URL,
            webhook_token=settings.N8N_WEBHOOK_TOKEN,
        )
    elif settings.NOTIFICATION_PROVIDER == "twilio":
        _notification_provider = TwilioNotificationProvider(
            account_sid=settings.TWILIO_ACCOUNT_SID,
            auth_token=settings.TWILIO_AUTH_TOKEN,
            whatsapp_phone=settings.TWILIO_WHATSAPP_PHONE,
            sms_phone=settings.TWILIO_SMS_PHONE,
        )
    else:
        _notification_provider = MockNotificationProvider()
    logger.info(f"✓ NotificationProvider initialized ({settings.NOTIFICATION_PROVIDER})")

    # 4. EventBus
    if settings.EVENT_BUS_TYPE == "redis":
        _event_bus = RedisEventBus(settings.REDIS_URL)
        await _event_bus.initialize()
    else:
        _event_bus = InMemoryEventBus()
        await _event_bus.initialize()
    logger.info(f"✓ EventBus initialized ({settings.EVENT_BUS_TYPE})")

    # 5. Orchestrator
    _orchestrator = DefaultOrchestrator(
        data_provider=_data_provider,
        llm_provider=_llm_provider,
        notification_provider=_notification_provider,
        event_bus=_event_bus,
    )
    logger.info("✓ Orchestrator initialized")

    logger.info("All dependencies initialized successfully!")


async def shutdown_dependencies():
    """Limpa dependências no shutdown"""

    global _data_provider, _event_bus

    logger.info("Shutting down dependencies...")

    if _data_provider:
        await _data_provider.close()
        logger.info("✓ DataProvider closed")

    if _event_bus:
        await _event_bus.close()
        logger.info("✓ EventBus closed")

    logger.info("All dependencies shut down successfully!")


# ============================================================================
# DEPENDENCY INJECTION FUNCTIONS
# ============================================================================

async def get_data_provider() -> PostgreSQLDataProvider:
    """Dependency: get DataProvider"""
    if not _data_provider:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="DataProvider not initialized",
        )
    return _data_provider


async def get_llm_provider() -> GeminiLLMProvider:
    """Dependency: get LLMProvider"""
    if not _llm_provider:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="LLMProvider not initialized",
        )
    return _llm_provider


async def get_notification_provider():
    """Dependency: get NotificationProvider"""
    if not _notification_provider:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="NotificationProvider not initialized",
        )
    return _notification_provider


async def get_event_bus():
    """Dependency: get EventBus"""
    if not _event_bus:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="EventBus not initialized",
        )
    return _event_bus


async def get_orchestrator() -> DefaultOrchestrator:
    """Dependency: get Orchestrator"""
    if not _orchestrator:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Orchestrator not initialized",
        )
    return _orchestrator


# ============================================================================
# AUTHENTICATION
# ============================================================================

async def get_current_user(token: str = Depends(None)):
    """
    Valida JWT token e retorna usuário

    Dependency para rotas protegidas
    """

    # TODO: Implementar validação JWT real
    # Por enquanto: mock para testes

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # Validar token
    try:
        # TODO: usar python-jose ou pyjwt para validar
        # payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        # user_id = payload.get("sub")

        # Mock para desenvolvimento
        user_id = "user-123"
        tenant_id = "tenant-456"

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    return {
        "user_id": user_id,
        "tenant_id": tenant_id,
        "role": "owner",  # ou "professional"
    }


# ============================================================================
# REGISTERED AGENTS
# ============================================================================

async def register_agents(orchestrator: DefaultOrchestrator = Depends(get_orchestrator)):
    """
    Registra agentes no orchestrator (chamar no startup)

    Tipicamente em app/main.py:
    @app.on_event("startup")
    async def startup():
        await initialize_dependencies()
        await register_agents()
    """

    from app.agents.prazo_certo_agent import PrazoCertoAgent
    from app.agents.encher_agenda_agent import EncherAgendaAgent
    from app.agents.chat_agent import ChatAgent

    data_provider = await get_data_provider()
    llm_provider = await get_llm_provider()
    notification_provider = await get_notification_provider()
    event_bus = await get_event_bus()

    # Registrar agentes
    orchestrator.register_agent(
        "prazo_certo",
        PrazoCertoAgent(
            data_provider=data_provider,
            llm_provider=llm_provider,
            notification_provider=notification_provider,
            event_bus=event_bus,
        ),
    )

    orchestrator.register_agent(
        "encher_agenda",
        EncherAgendaAgent(
            data_provider=data_provider,
            llm_provider=llm_provider,
            notification_provider=notification_provider,
            event_bus=event_bus,
        ),
    )

    orchestrator.register_agent(
        "chat_ia",
        ChatAgent(
            data_provider=data_provider,
            llm_provider=llm_provider,
            notification_provider=notification_provider,
            event_bus=event_bus,
        ),
    )

    logger.info(f"Registered {len(orchestrator.list_agents())} agents")
