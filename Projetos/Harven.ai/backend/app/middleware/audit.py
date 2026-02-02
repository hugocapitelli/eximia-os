"""
Harven.AI - Audit Logging
==========================

Comprehensive audit logging for security-sensitive operations.
"""

import os
from datetime import datetime
from typing import Optional, Dict, Any
import structlog
from starlette.requests import Request

# Configure audit logger separately
audit_logger = structlog.get_logger("audit")


class AuditLogger:
    """
    Audit logger for tracking security-sensitive events.

    Events logged:
    - Authentication (login, logout, failed attempts)
    - Authorization (access denied)
    - Data modifications (create, update, delete)
    - Admin actions (settings changes, user management)
    - Security events (rate limits, suspicious activity)
    """

    @staticmethod
    async def log(
        action: str,
        user_id: Optional[str] = None,
        resource: Optional[str] = None,
        resource_id: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        request: Optional[Request] = None,
        severity: str = "INFO",
    ) -> None:
        """
        Log an audit event.

        Args:
            action: The action being performed (e.g., "login", "create_user")
            user_id: The ID of the user performing the action
            resource: The type of resource being accessed (e.g., "user", "discipline")
            resource_id: The ID of the specific resource
            details: Additional details about the event
            request: The Starlette request object (for IP, user agent)
            severity: Log severity (INFO, WARNING, ERROR, CRITICAL)
        """
        event_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "user_id": user_id,
            "resource": resource,
            "resource_id": resource_id,
            "severity": severity,
        }

        # Add request information if available
        if request:
            event_data["ip_address"] = _get_client_ip(request)
            event_data["user_agent"] = request.headers.get("User-Agent", "unknown")
            event_data["path"] = request.url.path
            event_data["method"] = request.method

        # Add additional details
        if details:
            # Filter out sensitive data
            safe_details = _filter_sensitive_data(details)
            event_data["details"] = safe_details

        # Log based on severity
        log_method = getattr(audit_logger, severity.lower(), audit_logger.info)
        log_method("audit_event", **event_data)


def _get_client_ip(request: Request) -> str:
    """Extract client IP from request, handling proxies."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _filter_sensitive_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Remove sensitive fields from audit log data."""
    sensitive_fields = {
        "password", "senha", "token", "secret", "key",
        "api_key", "access_token", "refresh_token",
        "credit_card", "ssn", "cpf",
    }

    filtered = {}
    for key, value in data.items():
        if key.lower() in sensitive_fields:
            filtered[key] = "[REDACTED]"
        elif isinstance(value, dict):
            filtered[key] = _filter_sensitive_data(value)
        else:
            filtered[key] = value

    return filtered


# ============================================
# CONVENIENCE FUNCTIONS
# ============================================

async def log_audit_event(
    action: str,
    request: Optional[Request] = None,
    user_id: Optional[str] = None,
    resource: Optional[str] = None,
    resource_id: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None,
    severity: str = "INFO",
) -> None:
    """
    Convenience function for logging audit events.

    Usage:
        await log_audit_event(
            action="user_login",
            request=request,
            user_id=user.id,
            details={"method": "password"}
        )
    """
    await AuditLogger.log(
        action=action,
        user_id=user_id,
        resource=resource,
        resource_id=resource_id,
        details=details,
        request=request,
        severity=severity,
    )


# ============================================
# AUDIT EVENT TYPES
# ============================================

class AuditEvents:
    """Standard audit event types."""

    # Authentication
    AUTH_LOGIN_SUCCESS = "auth.login.success"
    AUTH_LOGIN_FAILED = "auth.login.failed"
    AUTH_LOGOUT = "auth.logout"
    AUTH_TOKEN_REFRESH = "auth.token.refresh"
    AUTH_PASSWORD_CHANGE = "auth.password.change"

    # User Management
    USER_CREATE = "user.create"
    USER_UPDATE = "user.update"
    USER_DELETE = "user.delete"
    USER_ROLE_CHANGE = "user.role.change"

    # Data Operations
    DATA_CREATE = "data.create"
    DATA_UPDATE = "data.update"
    DATA_DELETE = "data.delete"
    DATA_EXPORT = "data.export"

    # Admin Actions
    ADMIN_SETTINGS_CHANGE = "admin.settings.change"
    ADMIN_BACKUP_CREATE = "admin.backup.create"
    ADMIN_BACKUP_RESTORE = "admin.backup.restore"
    ADMIN_FORCE_LOGOUT = "admin.force_logout"

    # Security Events
    SECURITY_RATE_LIMIT = "security.rate_limit"
    SECURITY_INVALID_TOKEN = "security.invalid_token"
    SECURITY_SUSPICIOUS_ACTIVITY = "security.suspicious"
    SECURITY_ACCESS_DENIED = "security.access_denied"

    # AI Operations
    AI_QUESTION_GENERATE = "ai.question.generate"
    AI_DIALOGUE_START = "ai.dialogue.start"
    AI_DIALOGUE_COMPLETE = "ai.dialogue.complete"
    AI_DETECTION_RUN = "ai.detection.run"
