"""
Harven.AI - Rate Limiting Middleware
=====================================

Implements rate limiting to protect against abuse and brute force attacks.
Uses slowapi for per-endpoint rate limiting.
"""

import os
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import structlog

logger = structlog.get_logger()


def get_request_identifier(request: Request) -> str:
    """
    Get a unique identifier for rate limiting.

    Priority:
    1. X-Forwarded-For header (for proxied requests)
    2. Client IP address
    """
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Take the first IP (original client)
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


# Initialize the limiter
limiter = Limiter(
    key_func=get_request_identifier,
    default_limits=["100/minute"],  # Default: 100 requests per minute
    storage_uri=os.getenv("REDIS_URL", "memory://"),
    strategy="fixed-window",
)


# Custom rate limit exceeded handler
async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Handle rate limit exceeded errors."""
    logger.warning(
        "rate_limit_exceeded",
        client_ip=get_request_identifier(request),
        path=request.url.path,
        limit=str(exc.detail),
    )

    return JSONResponse(
        status_code=429,
        content={
            "error": "Too Many Requests",
            "message": "Você excedeu o limite de requisições. Tente novamente em alguns minutos.",
            "retry_after": exc.detail,
        },
        headers={"Retry-After": str(60)},  # Retry after 60 seconds
    )


class RateLimitMiddleware:
    """
    Middleware wrapper for rate limiting.

    Usage:
        app.state.limiter = limiter
        app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
        app.add_middleware(SlowAPIMiddleware)
    """

    @staticmethod
    def setup(app):
        """Setup rate limiting on the FastAPI app."""
        app.state.limiter = limiter
        app.add_exception_handler(RateLimitExceeded, rate_limit_handler)
        app.add_middleware(SlowAPIMiddleware)
        logger.info("rate_limiting_enabled")


# ============================================
# RATE LIMIT DECORATORS
# ============================================
# Use these decorators on endpoints:
#
# @app.post("/auth/login")
# @limiter.limit("5/minute")  # 5 requests per minute
# async def login(request: Request, ...):
#     ...
#
# @app.post("/ai/socrates/dialogue")
# @limiter.limit("10/minute")  # 10 requests per minute
# async def dialogue(request: Request, ...):
#     ...

# Predefined limits for common use cases
RATE_LIMITS = {
    "auth": "5/minute",       # Login, password reset
    "ai": "10/minute",        # AI agent endpoints
    "api": "100/minute",      # General API
    "admin": "30/minute",     # Admin operations
    "upload": "10/minute",    # File uploads
}
