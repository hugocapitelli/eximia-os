# backend/app/api/v1/webhooks.py
"""
API Routes - Webhooks

Endpoints para receber eventos de N8N, WhatsApp, etc
"""

from fastapi import APIRouter, BackgroundTasks
from typing import Dict, Any
import logging

from app.dependencies import get_orchestrator


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/webhooks", tags=["webhooks"])


# ============================================================================
# N8N WEBHOOKS - Receber mensagens e eventos
# ============================================================================

@router.post("/n8n/message-received")
async def on_message_received(
    payload: Dict[str, Any],
    background_tasks: BackgroundTasks,
    orchestrator = None,  # Seria injetado aqui
):
    """
    N8N envia mensagem de cliente para backend

    POST /api/v1/webhooks/n8n/message-received
    {
        "tenant_id": "uuid",
        "client_id": "uuid",
        "client_name": "João",
        "phone": "+5511999999999",
        "message": "Quero agendar um corte",
        "channel": "whatsapp",
        "timestamp": "2024-01-15T10:00:00Z"
    }
    """

    logger.info(f"Message received: {payload.get('client_name')}")

    # Processar em background
    background_tasks.add_task(
        process_client_message,
        payload,
    )

    return {"status": "accepted", "message_id": payload.get("id")}


@router.post("/n8n/appointment-confirmed")
async def on_appointment_confirmed(
    payload: Dict[str, Any],
    background_tasks: BackgroundTasks,
):
    """
    N8N confirma que cliente aceitou agendamento

    POST /api/v1/webhooks/n8n/appointment-confirmed
    """

    logger.info(f"Appointment confirmed: {payload.get('appointment_id')}")

    background_tasks.add_task(
        process_appointment_confirmation,
        payload,
    )

    return {"status": "accepted"}


@router.post("/n8n/sync-response")
async def on_sync_response(
    payload: Dict[str, Any],
    background_tasks: BackgroundTasks,
):
    """
    N8N retorna resposta de integração (CRM, etc)

    POST /api/v1/webhooks/n8n/sync-response
    """

    logger.info(f"Sync response received: {payload.get('event_type')}")

    background_tasks.add_task(
        process_sync_response,
        payload,
    )

    return {"status": "accepted"}


# ============================================================================
# BACKGROUND TASKS
# ============================================================================

async def process_client_message(payload: Dict[str, Any]):
    """Processa mensagem de cliente via ChatAgent"""

    # TODO: Implementar processamento real
    # orchestrator = await get_orchestrator()
    # await orchestrator.execute_workflow(
    #     workflow_type="chat_ia",
    #     tenant_id=payload["tenant_id"],
    #     conversation={...},
    # )

    logger.info(f"Processing message: {payload}")


async def process_appointment_confirmation(payload: Dict[str, Any]):
    """Processa confirmação de agendamento"""

    logger.info(f"Processing appointment confirmation: {payload}")


async def process_sync_response(payload: Dict[str, Any]):
    """Processa resposta de sincronização"""

    logger.info(f"Processing sync response: {payload}")
