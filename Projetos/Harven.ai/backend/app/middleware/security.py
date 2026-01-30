"""
Harven.AI - Security Headers Middleware
========================================

Adds security headers to all responses to protect against common attacks.
"""

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
import structlog

logger = structlog.get_logger()


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Middleware that adds security headers to all responses.

    Headers added:
    - X-Content-Type-Options: Prevents MIME type sniffing
    - X-Frame-Options: Prevents clickjacking
    - X-XSS-Protection: Legacy XSS protection
    - Strict-Transport-Security: Forces HTTPS
    - Content-Security-Policy: Controls resource loading
    - Referrer-Policy: Controls referrer information
    - Permissions-Policy: Controls browser features
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Legacy XSS protection (for older browsers)
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Force HTTPS (1 year, include subdomains)
        response.headers["Strict-Transport-Security"] = (
            "max-age=31536000; includeSubDomains; preload"
        )

        # Content Security Policy
        # Adjust based on your frontend requirements
        csp_directives = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",  # Relax for React
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self' data:",
            "connect-src 'self' https://api.openai.com https://*.supabase.co https://*.sentry.io",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
        ]
        response.headers["Content-Security-Policy"] = "; ".join(csp_directives)

        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Disable unnecessary browser features
        permissions = [
            "accelerometer=()",
            "camera=()",
            "geolocation=()",
            "gyroscope=()",
            "magnetometer=()",
            "microphone=()",
            "payment=()",
            "usb=()",
        ]
        response.headers["Permissions-Policy"] = ", ".join(permissions)

        # Cache control for API responses
        if request.url.path.startswith("/api") or request.url.path.startswith("/ai"):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
            response.headers["Pragma"] = "no-cache"

        return response


# ============================================
# INPUT SANITIZATION UTILITIES
# ============================================
import bleach
from typing import Any


def sanitize_html(content: str, allowed_tags: list = None) -> str:
    """
    Sanitize HTML content to prevent XSS attacks.

    Args:
        content: The HTML content to sanitize
        allowed_tags: List of allowed HTML tags (default: basic formatting)

    Returns:
        Sanitized HTML string
    """
    if allowed_tags is None:
        allowed_tags = ["p", "b", "i", "u", "strong", "em", "ul", "ol", "li", "br"]

    return bleach.clean(
        content,
        tags=allowed_tags,
        attributes={},
        strip=True,
    )


def sanitize_input(value: Any) -> Any:
    """
    Sanitize user input to prevent injection attacks.

    Args:
        value: The input value to sanitize

    Returns:
        Sanitized value
    """
    if isinstance(value, str):
        # Remove null bytes
        value = value.replace("\x00", "")

        # Check for SQL injection patterns
        dangerous_patterns = [
            "'", '"', ";", "--", "/*", "*/",
            "DROP", "DELETE", "INSERT", "UPDATE",
            "UNION", "SELECT", "EXEC", "EXECUTE",
        ]

        value_upper = value.upper()
        for pattern in dangerous_patterns:
            if pattern.upper() in value_upper and len(pattern) > 2:
                # Log potential attack
                logger.warning(
                    "potential_injection_attempt",
                    pattern=pattern,
                    value_preview=value[:50],
                )

        return value

    return value
