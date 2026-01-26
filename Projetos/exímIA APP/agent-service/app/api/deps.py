"""
ExímIA Agent Service - API Dependencies

Shared dependencies for API endpoints (auth, db, etc.)
"""
from typing import Annotated

from fastapi import Depends, HTTPException, Header, status
from jose import JWTError, jwt

from app.config import settings
from app.services.supabase import get_supabase_client, SupabaseClient


async def get_current_user_id(
    authorization: Annotated[str | None, Header()] = None,
) -> str:
    """
    Extract and validate user ID from JWT token.

    Args:
        authorization: Bearer token from Authorization header

    Returns:
        User ID from token

    Raises:
        HTTPException: If token is missing or invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = parts[1]

    try:
        # Decode JWT without verification for now
        # In production, verify with Supabase JWT secret
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret or "secret",
            algorithms=["HS256"],
            options={"verify_signature": bool(settings.supabase_jwt_secret)},
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )
        return user_id
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )


# Type alias for dependency injection
CurrentUserId = Annotated[str, Depends(get_current_user_id)]
SupabaseClientDep = Annotated[SupabaseClient, Depends(get_supabase_client)]
