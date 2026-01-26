# backend/app/main.py
"""
FastAPI Application - Agenda Cheia Backend

Inicializa:
1. FastAPI app
2. Dependências (DataProvider, LLMProvider, EventBus, etc)
3. Rotas (automations, webhooks, sync)
4. WebSocket
5. Middlewares
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings, print_config
from app.dependencies import (
    initialize_dependencies,
    shutdown_dependencies,
    register_agents,
    get_orchestrator,
)


# ============================================================================
# LOGGING SETUP
# ============================================================================

logging.basicConfig(
    level=logging.getLevelName(settings.LOG_LEVEL),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)

logger = logging.getLogger(__name__)


# ============================================================================
# LIFESPAN (Startup/Shutdown)
# ============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerencia lifecycle da aplicação

    Startup: inicializa dependências
    Shutdown: limpa recursos
    """

    logger.info("=" * 60)
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info("=" * 60)

    # Imprimir config
    if settings.DEBUG:
        print_config()

    # Inicializar dependências
    await initialize_dependencies()

    # Registrar agentes
    orchestrator = await get_orchestrator()
    await register_agents(orchestrator)

    logger.info("✓ Application ready!")

    yield

    # SHUTDOWN
    logger.info("=" * 60)
    logger.info("🛑 Shutting down application...")
    logger.info("=" * 60)

    await shutdown_dependencies()

    logger.info("✓ Application shut down!")


# ============================================================================
# CREATE FASTAPI APP
# ============================================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)


# ============================================================================
# MIDDLEWARES
# ============================================================================

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging middleware
@app.middleware("http")
async def log_requests(request, call_next):
    """Log todas as requisições HTTP"""
    logger.debug(f"{request.method} {request.url.path}")
    response = await call_next(request)
    logger.debug(f"Response: {response.status_code}")
    return response


# ============================================================================
# ERROR HANDLERS
# ============================================================================

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handler geral de exceções"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "error": str(exc) if settings.DEBUG else None,
        },
    )


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
    }


# ============================================================================
# ROUTES
# ============================================================================

# Automations
from app.api.v1 import automations

app.include_router(automations.router)

# Webhooks
from app.api.v1 import webhooks

app.include_router(webhooks.router)

# Sync
from app.api.v1 import sync

app.include_router(sync.router)


# ============================================================================
# WEBSOCKET
# ============================================================================

from fastapi import WebSocket

@app.websocket("/ws/sync")
async def websocket_endpoint(websocket: WebSocket, tenant_id: str):
    """
    WebSocket para sincronização real-time com React

    Protocolo:
    1. Cliente se conecta: ws://backend/ws/sync?tenant_id=uuid
    2. Backend registra conexão
    3. Backend envia eventos quando agentes terminam
    4. React atualiza UI automaticamente
    """

    from app.dependencies import get_event_bus

    await websocket.accept()
    logger.info(f"WebSocket connected: {tenant_id}")

    event_bus = await get_event_bus()
    await event_bus.register_websocket(tenant_id, websocket)

    try:
        # Keep connection alive
        while True:
            # Receber mensagens do cliente (opcional)
            data = await websocket.receive_text()
            logger.debug(f"WebSocket message from {tenant_id}: {data}")

    except Exception as e:
        logger.warning(f"WebSocket error: {e}")
    finally:
        await event_bus.unregister_websocket(tenant_id, websocket)
        logger.info(f"WebSocket disconnected: {tenant_id}")


# ============================================================================
# STARTUP MESSAGE
# ============================================================================

logger.info(f"""

╔══════════════════════════════════════════════════════════════╗
║                   AGENDA CHEIA - BACKEND                    ║
║                                                              ║
║  Version: {settings.APP_VERSION:45}║
║  Environment: {settings.ENVIRONMENT:42}║
║  Debug: {str(settings.DEBUG):50}║
║                                                              ║
║  📚 Docs: http://localhost:8000/docs                        ║
║  🔗 OpenAPI: http://localhost:8000/openapi.json            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

""")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower(),
    )
