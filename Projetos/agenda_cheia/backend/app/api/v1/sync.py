# backend/app/api/v1/sync.py
"""
API Routes - Sync

Endpoints para sincronizar frontend e backend
React ↔ Backend
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
import logging

from app.dependencies import (
    get_data_provider,
    get_current_user,
    get_event_bus,
)


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/sync", tags=["sync"])


# ============================================================================
# PENDING AUTH REQUESTS
# ============================================================================

@router.get("/pending-auth-requests")
async def get_pending_auth_requests(
    current_user: Dict[str, Any] = Depends(get_current_user),
    data_provider = Depends(get_data_provider),
):
    """
    Retorna lista de autorizações pendentes para React

    GET /api/v1/sync/pending-auth-requests

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
    """

    try:
        tenant_id = current_user["tenant_id"]

        requests = await data_provider.get_pending_auth_requests(tenant_id)

        return {
            "data": [
                {
                    "id": req.id,
                    "appointment_data": req.appointment_data.dict(),
                    "created_at": req.created_at.isoformat(),
                    "created_by_agent": req.created_by_agent,
                }
                for req in requests
            ]
        }

    except Exception as e:
        logger.error(f"Error fetching pending auth requests: {e}")
        raise HTTPException(status_code=500, detail="Error fetching requests")


# ============================================================================
# CONFIRM/REJECT AUTH REQUEST
# ============================================================================

@router.post("/confirm-auth-request/{request_id}")
async def confirm_auth_request(
    request_id: str,
    decision: str,  # "approve" | "reject"
    notes: str = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    data_provider = Depends(get_data_provider),
    event_bus = Depends(get_event_bus),
):
    """
    Owner do salão aprova/rejeita um auth_request

    POST /api/v1/sync/confirm-auth-request/{request_id}
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
    """

    try:
        tenant_id = current_user["tenant_id"]

        if decision not in ["approve", "reject"]:
            raise HTTPException(status_code=400, detail="Invalid decision")

        # Atualizar status do auth_request
        result = await data_provider.update_auth_request(
            request_id=request_id,
            status=decision,
            tenant_id=tenant_id,
        )

        logger.info(f"Auth request {request_id}: {decision}")

        if decision == "approve":
            # TODO: Criar appointment e enviar confirmação ao cliente
            pass

        return {
            "status": "success",
            "request_id": request_id,
            "decision": decision,
        }

    except Exception as e:
        logger.error(f"Error confirming auth request: {e}")
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# PUSH NOTIFICATIONS (opcional)
# ============================================================================

@router.post("/push-notification")
async def push_notification(
    notification_data: Dict[str, Any],
    current_user: Dict[str, Any] = Depends(get_current_user),
    event_bus = Depends(get_event_bus),
):
    """
    Backend envia notificação em tempo real para React

    POST /api/v1/sync/push-notification
    {
        "notification_id": "uuid",
        "type": "new_auth_request|campaign_complete|appointment_confirmed",
        "data": {...}
    }
    """

    try:
        tenant_id = current_user["tenant_id"]

        # Emitir para WebSocket (todos os clientes do tenant)
        from app.core.types import Event

        event = Event(
            id=notification_data.get("notification_id", ""),
            event_type=notification_data.get("type", "notification"),
            tenant_id=tenant_id,
            timestamp=__import__("datetime").datetime.now(),
            agent_id="system",
            data=notification_data.get("data", {}),
        )

        await event_bus.emit_to_frontend(tenant_id, event)

        return {"status": "sent"}

    except Exception as e:
        logger.error(f"Error sending push notification: {e}")
        raise HTTPException(status_code=500, detail="Error sending notification")


# ============================================================================
# SYNC STATE (optional - para polling se preferir)
# ============================================================================

@router.get("/state")
async def get_sync_state(
    current_user: Dict[str, Any] = Depends(get_current_user),
    data_provider = Depends(get_data_provider),
):
    """
    Retorna estado completo para sincronização

    GET /api/v1/sync/state

    Usado se frontend preferir polling em vez de WebSocket
    """

    try:
        tenant_id = current_user["tenant_id"]

        # Buscar dados
        auth_requests = await data_provider.get_pending_auth_requests(tenant_id)
        clients = await data_provider.get_clients(tenant_id)
        professionals = await data_provider.get_professionals(tenant_id)

        return {
            "auth_requests": len(auth_requests),
            "clients": len(clients),
            "professionals": len(professionals),
            "timestamp": __import__("datetime").datetime.now().isoformat(),
        }

    except Exception as e:
        logger.error(f"Error getting sync state: {e}")
        raise HTTPException(status_code=500, detail="Error getting state")
