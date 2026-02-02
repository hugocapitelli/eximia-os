"""
Dependency Injection utilities for Harven.AI
Provides access to shared resources like Supabase client.
"""

from typing import Optional
from supabase import Client
from fastapi import HTTPException

_supabase: Optional[Client] = None
_logger = None


def init_supabase(client: Client):
    """Initialize the Supabase client."""
    global _supabase
    _supabase = client


def get_supabase() -> Client:
    """Get the Supabase client. Raises HTTPException if not initialized."""
    if _supabase is None:
        raise HTTPException(status_code=503, detail="Banco de dados desconectado")
    return _supabase


def init_logger(logger):
    """Initialize the logger."""
    global _logger
    _logger = logger


def get_logger():
    """Get the logger instance."""
    if _logger is None:
        import structlog
        return structlog.get_logger()
    return _logger
