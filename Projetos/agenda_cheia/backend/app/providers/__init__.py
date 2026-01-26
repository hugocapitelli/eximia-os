# backend/app/providers/__init__.py
"""
Providers package - Implementações de abstrações

Export principal dos providers:
- DataProvider: PostgreSQL
- LLMProvider: Gemini
- NotificationProvider: N8N, Twilio, SendGrid, Mock
- EventBus: Redis, InMemory
"""

from app.providers.data_provider import PostgreSQLDataProvider
from app.providers.llm_provider import GeminiLLMProvider
from app.providers.notification_provider import (
    NotificationProvider,
    N8NNotificationProvider,
    TwilioNotificationProvider,
    SendGridEmailProvider,
    MockNotificationProvider,
)
from app.providers.event_bus import (
    RedisEventBus,
    InMemoryEventBus,
)

__all__ = [
    "PostgreSQLDataProvider",
    "GeminiLLMProvider",
    "NotificationProvider",
    "N8NNotificationProvider",
    "TwilioNotificationProvider",
    "SendGridEmailProvider",
    "MockNotificationProvider",
    "RedisEventBus",
    "InMemoryEventBus",
]
