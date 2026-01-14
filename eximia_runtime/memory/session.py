"""Session Memory - Redis-based short-term memory for conversations"""

import json
from datetime import datetime
from typing import Any

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


class SessionMemory:
    """
    Redis-based session memory for conversation context.
    
    Stores:
    - Chat history
    - Session context
    - Response cache (with TTL)
    
    Falls back to in-memory storage if Redis is unavailable.
    """

    def __init__(self, redis_url: str | None = None):
        self.redis_url = redis_url or settings.redis_url
        self._client = None
        self._fallback_store: dict[str, Any] = {}
        self._use_fallback = False

    @property
    def client(self):
        """Lazy Redis connection with fallback"""
        if self._use_fallback:
            return None

        if self._client is None:
            try:
                import redis
                self._client = redis.from_url(
                    self.redis_url,
                    decode_responses=True,
                )
                # Test connection
                self._client.ping()
                logger.info("redis_connected", url=self.redis_url)
            except Exception as e:
                logger.warning("redis_unavailable_using_fallback", error=str(e))
                self._use_fallback = True
                return None

        return self._client

    def _get_key(self, session_id: str, suffix: str = "") -> str:
        """Generate Redis key"""
        base = f"eximia:session:{session_id}"
        return f"{base}:{suffix}" if suffix else base

    async def save_context(
        self,
        session_id: str,
        context: dict[str, Any],
        ttl: int = 3600,
    ) -> None:
        """
        Save session context.
        
        Args:
            session_id: Unique session identifier
            context: Context data to store
            ttl: Time-to-live in seconds (default: 1 hour)
        """
        key = self._get_key(session_id, "context")
        data = json.dumps(context)

        if self.client:
            self.client.setex(key, ttl, data)
        else:
            self._fallback_store[key] = {
                "data": data,
                "expires": datetime.now().timestamp() + ttl,
            }

    async def get_context(self, session_id: str) -> dict[str, Any] | None:
        """Retrieve session context"""
        key = self._get_key(session_id, "context")

        if self.client:
            data = self.client.get(key)
            return json.loads(data) if data else None
        else:
            stored = self._fallback_store.get(key)
            if stored and stored["expires"] > datetime.now().timestamp():
                return json.loads(stored["data"])
            return None

    async def append_message(
        self,
        session_id: str,
        role: str,
        content: str,
        max_messages: int = 20,
    ) -> None:
        """
        Append a message to chat history.
        
        Args:
            session_id: Session identifier
            role: Message role (user/assistant/system)
            content: Message content
            max_messages: Maximum messages to keep (FIFO)
        """
        key = self._get_key(session_id, "messages")
        message = json.dumps({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(),
        })

        if self.client:
            self.client.rpush(key, message)
            self.client.ltrim(key, -max_messages, -1)
            self.client.expire(key, 86400)  # 24h TTL
        else:
            if key not in self._fallback_store:
                self._fallback_store[key] = []
            self._fallback_store[key].append(message)
            self._fallback_store[key] = self._fallback_store[key][-max_messages:]

    async def get_messages(
        self,
        session_id: str,
        limit: int = 10,
    ) -> list[dict[str, Any]]:
        """Get recent chat history"""
        key = self._get_key(session_id, "messages")

        if self.client:
            messages = self.client.lrange(key, -limit, -1)
            return [json.loads(m) for m in messages]
        else:
            stored = self._fallback_store.get(key, [])
            return [json.loads(m) for m in stored[-limit:]]

    async def cache_response(
        self,
        cache_key: str,
        response: str,
        ttl: int = 300,
    ) -> None:
        """Cache an agent response"""
        key = f"eximia:cache:{cache_key}"

        if self.client:
            self.client.setex(key, ttl, response)
        else:
            self._fallback_store[key] = {
                "data": response,
                "expires": datetime.now().timestamp() + ttl,
            }

    async def get_cached_response(self, cache_key: str) -> str | None:
        """Retrieve cached response"""
        key = f"eximia:cache:{cache_key}"

        if self.client:
            return self.client.get(key)
        else:
            stored = self._fallback_store.get(key)
            if stored and stored["expires"] > datetime.now().timestamp():
                return stored["data"]
            return None

    async def clear_session(self, session_id: str) -> None:
        """Clear all data for a session"""
        if self.client:
            pattern = self._get_key(session_id, "*")
            keys = self.client.keys(pattern)
            if keys:
                self.client.delete(*keys)
        else:
            prefix = self._get_key(session_id)
            self._fallback_store = {
                k: v for k, v in self._fallback_store.items()
                if not k.startswith(prefix)
            }

    def get_sync_messages(self, session_id: str, limit: int = 10) -> list[dict]:
        """Synchronous version of get_messages"""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
            return loop.run_until_complete(self.get_messages(session_id, limit))
        except RuntimeError:
            # No event loop, use new one
            return asyncio.run(self.get_messages(session_id, limit))


# Singleton instance
session_memory = SessionMemory()
