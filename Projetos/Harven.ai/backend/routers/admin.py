"""
Harven.AI - Admin Router
=========================
Endpoints for administrative operations.
"""

from fastapi import APIRouter

router = APIRouter(prefix="/admin", tags=["Admin"])

# NOTE: Admin endpoints are complex and tightly coupled with main.py
# They will be migrated in a future refactoring phase.
# For now, this router serves as a placeholder for the modular architecture.
