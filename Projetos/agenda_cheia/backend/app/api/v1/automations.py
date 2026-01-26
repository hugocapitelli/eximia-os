# backend/app/api/v1/automations.py
"""
API Routes - Automations

Endpoints para executar automações manualmente
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Dict, Any
import logging

from app.dependencies import (
    get_orchestrator,
    get_current_user,
)


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/automations", tags=["automations"])


# ============================================================================
# PRAZO CERTO - Retorno Automático
# ============================================================================

@router.post("/prazo-certo/execute")
async def execute_prazo_certo(
    campaign_config: Dict[str, Any],
    background_tasks: BackgroundTasks = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    orchestrator = Depends(get_orchestrator),
):
    """
    Dispara campanha Prazo Certo manualmente

    POST /api/v1/automations/prazo-certo/execute
    {
        "service_id": "uuid",
        "professional_id": "uuid (optional)",
        "offer_type": "discount",
        "offer_value": 15
    }
    """

    try:
        tenant_id = current_user["tenant_id"]

        logger.info(f"[PrazoCerto] Executando para tenant {tenant_id}")

        result = await orchestrator.execute_workflow(
            workflow_type="prazo_certo",
            tenant_id=tenant_id,
            campaign_config=campaign_config,
        )

        return {
            "status": result.status.value,
            "execution_id": result.execution_id,
            "metrics": result.metrics,
            "auth_requests_created": len(result.auth_requests_created),
            "error": result.error,
        }

    except Exception as e:
        logger.error(f"Error executing Prazo Certo: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# ENCHER AGENDA - Preencher Buracos
# ============================================================================

@router.post("/encher-agenda/execute")
async def execute_encher_agenda(
    professional_id: str,
    context: Dict[str, Any],
    background_tasks: BackgroundTasks = None,
    current_user: Dict[str, Any] = Depends(get_current_user),
    orchestrator = Depends(get_orchestrator),
):
    """
    Dispara campanha Encher Agenda manualmente

    POST /api/v1/automations/encher-agenda/execute
    {
        "professional_id": "uuid",
        "days_ahead": 7,
        "offer_type": "discount",
        "offer_value": 20
    }
    """

    try:
        tenant_id = current_user["tenant_id"]

        logger.info(f"[EncherAgenda] Executando para profissional {professional_id}")

        result = await orchestrator.execute_workflow(
            workflow_type="encher_agenda",
            tenant_id=tenant_id,
            campaign_config={
                "professional_id": professional_id,
                **context,
            },
        )

        return {
            "status": result.status.value,
            "execution_id": result.execution_id,
            "metrics": result.metrics,
            "error": result.error,
        }

    except Exception as e:
        logger.error(f"Error executing Encher Agenda: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# STATUS & HISTORY
# ============================================================================

@router.get("/executions")
async def get_executions(
    workflow_type: str = None,
    limit: int = 50,
    current_user: Dict[str, Any] = Depends(get_current_user),
    orchestrator = Depends(get_orchestrator),
):
    """
    Lista execuções recentes

    GET /api/v1/automations/executions?workflow_type=prazo_certo&limit=50
    """

    try:
        tenant_id = current_user["tenant_id"]

        executions = await orchestrator.list_executions(
            tenant_id=tenant_id,
            workflow_type=workflow_type,
            limit=limit,
        )

        return {"data": executions}

    except Exception as e:
        logger.error(f"Error fetching executions: {e}")
        raise HTTPException(status_code=500, detail="Error fetching executions")


@router.get("/executions/{execution_id}")
async def get_execution_details(
    execution_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user),
    orchestrator = Depends(get_orchestrator),
):
    """
    Detalhes de uma execução específica

    GET /api/v1/automations/executions/{execution_id}
    """

    try:
        tenant_id = current_user["tenant_id"]

        details = await orchestrator.get_execution_details(
            execution_id=execution_id,
            tenant_id=tenant_id,
        )

        if not details:
            raise HTTPException(status_code=404, detail="Execution not found")

        return {"data": details}

    except Exception as e:
        logger.error(f"Error fetching execution details: {e}")
        raise HTTPException(status_code=500, detail="Error fetching execution details")
