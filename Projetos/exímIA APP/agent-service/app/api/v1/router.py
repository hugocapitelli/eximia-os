"""
ExímIA Agent Service - API v1 Router
"""
from fastapi import APIRouter

from app.api.v1 import health, agents, chat

api_router = APIRouter()

# Include sub-routers
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(agents.router, tags=["Agents"])
api_router.include_router(chat.router, tags=["Chat"])
