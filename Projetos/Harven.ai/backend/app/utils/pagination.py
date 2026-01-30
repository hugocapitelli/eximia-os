"""
Harven.AI - Pagination Utilities
================================

Provides cursor-based and offset pagination for API endpoints.
"""

from typing import TypeVar, Generic, List, Optional, Any
from pydantic import BaseModel, Field
from fastapi import Query

T = TypeVar("T")


class PaginationParams(BaseModel):
    """Pagination parameters for list endpoints."""

    page: int = Field(default=1, ge=1, description="Page number (1-indexed)")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")
    sort_by: Optional[str] = Field(default=None, description="Field to sort by")
    sort_order: str = Field(default="desc", pattern="^(asc|desc)$")

    @property
    def offset(self) -> int:
        """Calculate offset for database query."""
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        """Get limit for database query."""
        return self.page_size


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated response wrapper."""

    items: List[T]
    total: int = Field(description="Total number of items")
    page: int = Field(description="Current page number")
    page_size: int = Field(description="Items per page")
    total_pages: int = Field(description="Total number of pages")
    has_next: bool = Field(description="Whether there is a next page")
    has_previous: bool = Field(description="Whether there is a previous page")

    class Config:
        """Pydantic config."""

        arbitrary_types_allowed = True


class CursorPaginationParams(BaseModel):
    """Cursor-based pagination parameters (for infinite scroll)."""

    cursor: Optional[str] = Field(default=None, description="Cursor for next page")
    limit: int = Field(default=20, ge=1, le=100, description="Items to fetch")
    direction: str = Field(default="forward", pattern="^(forward|backward)$")


class CursorPaginatedResponse(BaseModel, Generic[T]):
    """Cursor-paginated response wrapper."""

    items: List[T]
    next_cursor: Optional[str] = Field(description="Cursor for next page")
    prev_cursor: Optional[str] = Field(description="Cursor for previous page")
    has_more: bool = Field(description="Whether there are more items")


def get_pagination_params(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: Optional[str] = Query(None, description="Sort field"),
    sort_order: str = Query("desc", pattern="^(asc|desc)$", description="Sort order"),
) -> PaginationParams:
    """
    FastAPI dependency for pagination parameters.

    Usage:
        @app.get("/items")
        async def list_items(pagination: PaginationParams = Depends(get_pagination_params)):
            ...
    """
    return PaginationParams(
        page=page,
        page_size=page_size,
        sort_by=sort_by,
        sort_order=sort_order,
    )


def paginate_query(query: Any, pagination: PaginationParams) -> Any:
    """
    Apply pagination to a Supabase query.

    Usage:
        query = supabase.table("items").select("*")
        query = paginate_query(query, pagination)
        result = query.execute()
    """
    # Apply sorting if specified
    if pagination.sort_by:
        is_desc = pagination.sort_order == "desc"
        query = query.order(pagination.sort_by, desc=is_desc)

    # Apply range for pagination
    start = pagination.offset
    end = start + pagination.page_size - 1
    query = query.range(start, end)

    return query


def create_paginated_response(
    items: List[T],
    total: int,
    pagination: PaginationParams,
) -> PaginatedResponse[T]:
    """
    Create a paginated response from items and count.

    Usage:
        result = query.execute()
        count_result = count_query.execute()
        return create_paginated_response(
            items=result.data,
            total=count_result.count,
            pagination=pagination
        )
    """
    total_pages = (total + pagination.page_size - 1) // pagination.page_size if total > 0 else 1

    return PaginatedResponse(
        items=items,
        total=total,
        page=pagination.page,
        page_size=pagination.page_size,
        total_pages=total_pages,
        has_next=pagination.page < total_pages,
        has_previous=pagination.page > 1,
    )


def encode_cursor(value: Any) -> str:
    """Encode a value as a cursor string."""
    import base64
    import json

    data = json.dumps({"v": value})
    return base64.urlsafe_b64encode(data.encode()).decode()


def decode_cursor(cursor: str) -> Any:
    """Decode a cursor string to its original value."""
    import base64
    import json

    try:
        data = base64.urlsafe_b64decode(cursor.encode()).decode()
        return json.loads(data)["v"]
    except Exception:
        return None
