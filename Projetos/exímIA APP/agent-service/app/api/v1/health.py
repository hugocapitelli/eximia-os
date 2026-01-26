"""
ExímIA Agent Service - Health Endpoints
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.config import settings
from app.services.supabase import get_supabase_client, SupabaseClient

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response model."""
    status: str
    service: str
    version: str
    environment: str


class DetailedHealthResponse(HealthResponse):
    """Detailed health check with dependencies."""
    dependencies: dict[str, str]


@router.get("", response_model=HealthResponse)
async def health_check():
    """Basic health check."""
    return HealthResponse(
        status="ok",
        service="agent-service",
        version="0.1.0",
        environment=settings.environment,
    )


@router.get("/detailed", response_model=DetailedHealthResponse)
async def detailed_health_check(
    supabase: SupabaseClient = Depends(get_supabase_client)
):
    """Detailed health check including dependencies."""
    dependencies = {}

    # Check Supabase connection
    try:
        # Simple query to verify connection
        supabase.client.auth.get_session()
        dependencies["supabase"] = "ok"
    except Exception as e:
        dependencies["supabase"] = f"error: {str(e)}"

    # Overall status
    all_ok = all(v == "ok" for v in dependencies.values())

    return DetailedHealthResponse(
        status="ok" if all_ok else "degraded",
        service="agent-service",
        version="0.1.0",
        environment=settings.environment,
        dependencies=dependencies,
    )
