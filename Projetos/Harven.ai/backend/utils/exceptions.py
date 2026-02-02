"""
Harven.AI - Custom Exception Classes
=====================================
Standardized exception handling for the API.
"""

from typing import Optional


class AppException(Exception):
    """Base exception for application errors."""

    def __init__(
        self,
        message: str,
        code: str = "APP_ERROR",
        status_code: int = 500
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)


class NotFoundError(AppException):
    """Resource not found error."""

    def __init__(self, resource: str, resource_id: Optional[str] = None):
        message = f"{resource} não encontrado"
        if resource_id:
            message = f"{resource} não encontrado: {resource_id}"
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=404
        )


class ValidationError(AppException):
    """Data validation error."""

    def __init__(self, message: str, field: Optional[str] = None):
        self.field = field
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=400
        )


class DatabaseError(AppException):
    """Database operation error."""

    def __init__(self, operation: str, details: Optional[str] = None):
        message = f"Erro de banco de dados durante: {operation}"
        if details:
            message = f"{message} - {details}"
        super().__init__(
            message=message,
            code="DATABASE_ERROR",
            status_code=503
        )


class AuthenticationError(AppException):
    """Authentication error."""

    def __init__(self, message: str = "Credenciais inválidas"):
        super().__init__(
            message=message,
            code="AUTH_ERROR",
            status_code=401
        )


class AuthorizationError(AppException):
    """Authorization error."""

    def __init__(self, message: str = "Acesso não autorizado"):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=403
        )


class ExternalServiceError(AppException):
    """External service (AI, storage, etc) error."""

    def __init__(self, service: str, details: Optional[str] = None):
        message = f"Erro no serviço externo: {service}"
        if details:
            message = f"{message} - {details}"
        super().__init__(
            message=message,
            code="EXTERNAL_SERVICE_ERROR",
            status_code=502
        )


class RateLimitError(AppException):
    """Rate limit exceeded error."""

    def __init__(self, message: str = "Limite de requisições excedido"):
        super().__init__(
            message=message,
            code="RATE_LIMIT_EXCEEDED",
            status_code=429
        )
