"""
Harven.AI - Health Check Module
===============================

Comprehensive health checks for production monitoring.
"""

import os
import time
from datetime import datetime
from typing import Dict, Any, Optional

from fastapi import APIRouter, Depends
from pydantic import BaseModel
import structlog
import psutil

logger = structlog.get_logger()

router = APIRouter(prefix="/health", tags=["Health"])


class ComponentHealth(BaseModel):
    """Health status of a single component."""

    status: str  # "healthy", "degraded", "unhealthy"
    latency_ms: Optional[float] = None
    message: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


class SystemMetrics(BaseModel):
    """System resource metrics."""

    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    memory_available_mb: float
    disk_percent: float


class HealthResponse(BaseModel):
    """Complete health check response."""

    status: str  # "healthy", "degraded", "unhealthy"
    timestamp: str
    version: str
    environment: str
    uptime_seconds: float
    components: Dict[str, ComponentHealth]
    system: Optional[SystemMetrics] = None


# Track startup time for uptime calculation
_startup_time = time.time()


async def check_supabase_health() -> ComponentHealth:
    """Check Supabase database connectivity."""
    start = time.time()
    try:
        # Import here to avoid circular imports
        from main import supabase

        if not supabase:
            return ComponentHealth(
                status="unhealthy",
                message="Supabase client not initialized"
            )

        # Simple health query
        result = supabase.table("users").select("id").limit(1).execute()
        latency = (time.time() - start) * 1000

        return ComponentHealth(
            status="healthy",
            latency_ms=round(latency, 2),
            message="Connected to Supabase"
        )
    except Exception as e:
        return ComponentHealth(
            status="unhealthy",
            latency_ms=round((time.time() - start) * 1000, 2),
            message=f"Supabase error: {str(e)}"
        )


async def check_redis_health() -> ComponentHealth:
    """Check Redis cache connectivity."""
    start = time.time()
    try:
        from app.services.cache import cache_service

        if not cache_service._connected:
            connected = await cache_service.connect()
            if not connected:
                return ComponentHealth(
                    status="degraded",
                    message="Redis not connected - caching disabled"
                )

        # Ping test
        await cache_service._client.ping()
        latency = (time.time() - start) * 1000

        stats = await cache_service.get_stats()

        return ComponentHealth(
            status="healthy",
            latency_ms=round(latency, 2),
            message="Redis connected",
            details={
                "memory_used": stats.get("used_memory_human", "N/A"),
                "hits": stats.get("keyspace_hits", 0),
                "misses": stats.get("keyspace_misses", 0),
            }
        )
    except Exception as e:
        return ComponentHealth(
            status="degraded",
            latency_ms=round((time.time() - start) * 1000, 2),
            message=f"Redis unavailable: {str(e)}"
        )


async def check_openai_health() -> ComponentHealth:
    """Check OpenAI API availability (lightweight check)."""
    try:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return ComponentHealth(
                status="degraded",
                message="OpenAI API key not configured"
            )

        # We don't actually call OpenAI to avoid costs
        # Just verify configuration is present
        return ComponentHealth(
            status="healthy",
            message="OpenAI API key configured"
        )
    except Exception as e:
        return ComponentHealth(
            status="degraded",
            message=f"OpenAI check failed: {str(e)}"
        )


def get_system_metrics() -> SystemMetrics:
    """Collect system resource metrics."""
    try:
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage("/")

        return SystemMetrics(
            cpu_percent=psutil.cpu_percent(interval=0.1),
            memory_percent=memory.percent,
            memory_used_mb=round(memory.used / (1024 * 1024), 2),
            memory_available_mb=round(memory.available / (1024 * 1024), 2),
            disk_percent=disk.percent,
        )
    except Exception:
        return SystemMetrics(
            cpu_percent=0,
            memory_percent=0,
            memory_used_mb=0,
            memory_available_mb=0,
            disk_percent=0,
        )


def determine_overall_status(components: Dict[str, ComponentHealth]) -> str:
    """Determine overall health status from components."""
    statuses = [c.status for c in components.values()]

    if all(s == "healthy" for s in statuses):
        return "healthy"
    elif any(s == "unhealthy" for s in statuses):
        return "unhealthy"
    else:
        return "degraded"


@router.get("", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Comprehensive health check endpoint.

    Returns status of all system components and resource metrics.
    Used by load balancers, Kubernetes probes, and monitoring systems.
    """
    # Collect component health in parallel
    components = {
        "database": await check_supabase_health(),
        "cache": await check_redis_health(),
        "ai_service": await check_openai_health(),
    }

    # Determine overall status
    status = determine_overall_status(components)

    # Collect system metrics
    system = get_system_metrics()

    # Log if unhealthy
    if status == "unhealthy":
        logger.warning("health_check_unhealthy", components={
            k: v.status for k, v in components.items()
        })

    return HealthResponse(
        status=status,
        timestamp=datetime.utcnow().isoformat() + "Z",
        version=os.getenv("APP_VERSION", "1.0.0"),
        environment=os.getenv("ENVIRONMENT", "development"),
        uptime_seconds=round(time.time() - _startup_time, 2),
        components=components,
        system=system,
    )


@router.get("/live")
async def liveness_probe() -> dict:
    """
    Kubernetes liveness probe.

    Returns 200 if the application is running.
    No dependency checks - just confirms the process is alive.
    """
    return {"status": "alive"}


@router.get("/ready")
async def readiness_probe() -> dict:
    """
    Kubernetes readiness probe.

    Returns 200 if the application is ready to receive traffic.
    Checks critical dependencies only.
    """
    # Check database (critical dependency)
    db_health = await check_supabase_health()

    if db_health.status == "unhealthy":
        return {"status": "not_ready", "reason": db_health.message}

    return {"status": "ready"}
