"""
Harven.AI - Health Check Router
================================
Endpoints for health monitoring and status checks.
"""

from fastapi import APIRouter
from utils.dependencies import get_supabase

router = APIRouter(tags=["Health"])


@router.get("/")
async def root():
    """Verifica se o backend está rodando."""
    return {"message": "Harven.AI Backend está rodando!"}


@router.get("/health")
async def health_check():
    """Verifica o status de saúde do backend e conexão com banco de dados."""
    try:
        supabase = get_supabase()
        db_status = "connected" if supabase else "disconnected"
    except Exception:
        db_status = "disconnected"
    return {"status": "ok", "database": db_status}
