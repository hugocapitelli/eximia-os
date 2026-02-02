# Utils module for Harven.AI Backend
from .auth import hash_password, verify_password, needs_rehash
from .dependencies import get_supabase, init_supabase, get_logger, init_logger
from .exceptions import (
    AppException,
    NotFoundError,
    ValidationError,
    DatabaseError,
    AuthenticationError,
    AuthorizationError,
    ExternalServiceError,
    RateLimitError,
)

__all__ = [
    # Auth
    "hash_password",
    "verify_password",
    "needs_rehash",
    # Dependencies
    "get_supabase",
    "init_supabase",
    "get_logger",
    "init_logger",
    # Exceptions
    "AppException",
    "NotFoundError",
    "ValidationError",
    "DatabaseError",
    "AuthenticationError",
    "AuthorizationError",
    "ExternalServiceError",
    "RateLimitError",
]
