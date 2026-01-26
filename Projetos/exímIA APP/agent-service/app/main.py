"""
ExímIA Agent Service - Main Application

FastAPI backend for AI agent orchestration.
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import api_router

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper()),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    logger.info(f"Starting ExímIA Agent Service v0.1.0 ({settings.environment})")
    yield
    logger.info("Shutting down ExímIA Agent Service")


app = FastAPI(
    title="ExímIA Agent Service",
    description="AI Agent orchestration service for ExímIA OS",
    version="0.1.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix=settings.api_v1_prefix)


@app.get("/health")
async def health_check():
    """Root health check endpoint."""
    return {
        "status": "ok",
        "service": "agent-service",
        "version": "0.1.0",
        "environment": settings.environment,
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "ExímIA Agent Service",
        "docs": "/docs" if settings.is_development else None,
        "health": "/health",
    }
