"""
ExímIA Agent Service - Agents Router

Endpoints for managing AI agents (Synthetic Minds).
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.services.chat_service import get_chat_service
from app.models.agent import Agent, AgentSummary

router = APIRouter(prefix="/agents", tags=["agents"])


@router.get("/", response_model=list[AgentSummary])
async def list_agents(
    query: Optional[str] = Query(None, description="Search query"),
    domain: Optional[str] = Query(None, description="Filter by domain"),
    limit: int = Query(10, ge=1, le=50, description="Number of results"),
):
    """
    List available agents.

    Returns a list of active agents, optionally filtered by query or domain.
    """
    service = get_chat_service()
    agents = await service.get_agents(query=query, domain=domain, limit=limit)
    return agents


@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: str):
    """
    Get agent details by ID.
    """
    service = get_chat_service()
    agent = await service.get_agent(agent_id)

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    return agent


@router.get("/slug/{slug}", response_model=Agent)
async def get_agent_by_slug(slug: str):
    """
    Get agent details by slug.
    """
    service = get_chat_service()
    agent = await service.get_agent_by_slug(slug)

    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    return agent


@router.get("/domains/list")
async def list_domains():
    """
    List available agent domains.
    """
    # For now, return hardcoded list
    # TODO: Query from database
    return {
        "domains": [
            {"name": "General", "icon": "🤖", "count": 1},
            {"name": "Strategy", "icon": "🎯", "count": 1},
            {"name": "Education", "icon": "📚", "count": 1},
            {"name": "Copywriting", "icon": "✍️", "count": 0},
            {"name": "Finance", "icon": "💰", "count": 0},
            {"name": "Technology", "icon": "💻", "count": 0},
        ]
    }
