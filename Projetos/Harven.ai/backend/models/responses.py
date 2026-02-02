"""
Harven.AI - Response Models
============================
Standardized response models for the API.
"""

from typing import Optional, List, Any
from pydantic import BaseModel


class ErrorDetail(BaseModel):
    """Detail about a specific error."""
    field: Optional[str] = None
    message: str


class ErrorResponse(BaseModel):
    """Standardized error response format."""
    error: bool = True
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    request_id: Optional[str] = None


class SuccessResponse(BaseModel):
    """Standardized success response format."""
    success: bool = True
    message: str
    data: Optional[Any] = None


class PaginatedResponse(BaseModel):
    """Paginated response format."""
    data: List[Any]
    total: int
    page: int
    per_page: int
    has_more: bool = False
