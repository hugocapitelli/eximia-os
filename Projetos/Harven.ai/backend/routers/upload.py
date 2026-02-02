"""
Harven.AI - Upload Router
==========================
Endpoints for file uploads (images, videos, audio, documents).
"""

from fastapi import APIRouter

router = APIRouter(prefix="/upload", tags=["Upload"])

# NOTE: Upload endpoints are complex and tightly coupled with main.py
# They will be migrated in a future refactoring phase.
# For now, this router serves as a placeholder for the modular architecture.
