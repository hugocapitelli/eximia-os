"""
Harven.AI - Response Compression Middleware
===========================================

Provides GZip compression for API responses.
"""

import gzip
from typing import Callable
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response, StreamingResponse
from starlette.types import ASGIApp
import structlog

logger = structlog.get_logger()

# Minimum response size for compression (bytes)
MIN_COMPRESSION_SIZE = 500

# Content types eligible for compression
COMPRESSIBLE_TYPES = {
    "application/json",
    "text/plain",
    "text/html",
    "text/css",
    "text/javascript",
    "application/javascript",
    "application/xml",
    "text/xml",
}


class GZipMiddleware(BaseHTTPMiddleware):
    """
    Middleware that compresses responses using GZip.

    Features:
    - Respects Accept-Encoding header
    - Only compresses responses above minimum size
    - Only compresses text-based content types
    - Adds proper Content-Encoding header
    """

    def __init__(
        self,
        app: ASGIApp,
        minimum_size: int = MIN_COMPRESSION_SIZE,
        compresslevel: int = 6,
    ):
        """
        Initialize GZip middleware.

        Args:
            app: ASGI application
            minimum_size: Minimum response size for compression
            compresslevel: GZip compression level (1-9, higher = better compression)
        """
        super().__init__(app)
        self.minimum_size = minimum_size
        self.compresslevel = compresslevel

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Process request and compress response if appropriate."""
        # Check if client accepts gzip
        accept_encoding = request.headers.get("Accept-Encoding", "")
        if "gzip" not in accept_encoding.lower():
            return await call_next(request)

        # Get the response
        response = await call_next(request)

        # Skip if already encoded
        if response.headers.get("Content-Encoding"):
            return response

        # Skip streaming responses
        if isinstance(response, StreamingResponse):
            return response

        # Check content type
        content_type = response.headers.get("Content-Type", "")
        base_content_type = content_type.split(";")[0].strip()

        if base_content_type not in COMPRESSIBLE_TYPES:
            return response

        # Get response body
        body = b""
        async for chunk in response.body_iterator:
            body += chunk

        # Skip if too small
        if len(body) < self.minimum_size:
            return Response(
                content=body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type,
            )

        # Compress the body
        compressed_body = gzip.compress(body, compresslevel=self.compresslevel)

        # Only use compressed version if it's smaller
        if len(compressed_body) >= len(body):
            return Response(
                content=body,
                status_code=response.status_code,
                headers=dict(response.headers),
                media_type=response.media_type,
            )

        # Create new headers with compression info
        headers = dict(response.headers)
        headers["Content-Encoding"] = "gzip"
        headers["Content-Length"] = str(len(compressed_body))
        headers["Vary"] = "Accept-Encoding"

        logger.debug(
            "response_compressed",
            original_size=len(body),
            compressed_size=len(compressed_body),
            ratio=f"{(1 - len(compressed_body) / len(body)) * 100:.1f}%",
        )

        return Response(
            content=compressed_body,
            status_code=response.status_code,
            headers=headers,
            media_type=response.media_type,
        )
