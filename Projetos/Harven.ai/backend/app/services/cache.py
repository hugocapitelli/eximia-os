"""
Harven.AI - Redis Cache Service
===============================

Provides caching functionality for the Harven.AI backend using Redis.
Includes decorators for easy caching of endpoint responses and service calls.
"""

import os
import json
import hashlib
import functools
from typing import Optional, Any, Callable, Union
from datetime import timedelta

import redis.asyncio as redis
import structlog

logger = structlog.get_logger()

# ============================================
# CONFIGURATION
# ============================================

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CACHE_PREFIX = os.getenv("CACHE_PREFIX", "harven:")
DEFAULT_TTL = int(os.getenv("CACHE_DEFAULT_TTL", "300"))  # 5 minutes

# TTL presets for different data types
CACHE_TTLS = {
    "user_profile": 60,          # 1 minute - user data changes frequently
    "course_list": 300,          # 5 minutes - course list rarely changes
    "chapter_content": 600,      # 10 minutes - chapter content stable
    "ai_response": 3600,         # 1 hour - AI responses are expensive
    "system_settings": 1800,     # 30 minutes - settings change rarely
    "stats": 60,                 # 1 minute - stats should be fresh
}


class CacheService:
    """
    Redis cache service for Harven.AI.

    Features:
    - Async Redis operations
    - Automatic JSON serialization
    - TTL management
    - Cache invalidation patterns
    - Circuit breaker for Redis failures
    """

    def __init__(self, redis_url: str = REDIS_URL):
        self.redis_url = redis_url
        self._client: Optional[redis.Redis] = None
        self._connected = False
        self._circuit_open = False
        self._failure_count = 0
        self._max_failures = 3

    async def connect(self) -> bool:
        """Initialize Redis connection."""
        if self._connected:
            return True

        try:
            self._client = redis.from_url(
                self.redis_url,
                encoding="utf-8",
                decode_responses=True
            )
            # Test connection
            await self._client.ping()
            self._connected = True
            self._circuit_open = False
            self._failure_count = 0
            logger.info("cache_connected", redis_url=self.redis_url)
            return True
        except Exception as e:
            logger.warning("cache_connection_failed", error=str(e))
            self._connected = False
            return False

    async def disconnect(self):
        """Close Redis connection."""
        if self._client:
            await self._client.close()
            self._connected = False
            logger.info("cache_disconnected")

    async def _check_circuit(self) -> bool:
        """Check if circuit breaker allows operation."""
        if self._circuit_open:
            return False
        return True

    def _record_failure(self):
        """Record a failure for circuit breaker."""
        self._failure_count += 1
        if self._failure_count >= self._max_failures:
            self._circuit_open = True
            logger.warning("cache_circuit_opened", failures=self._failure_count)

    def _make_key(self, key: str) -> str:
        """Create a namespaced cache key."""
        return f"{CACHE_PREFIX}{key}"

    async def get(self, key: str) -> Optional[Any]:
        """
        Get a value from cache.

        Args:
            key: Cache key

        Returns:
            Cached value or None if not found
        """
        if not await self._check_circuit():
            return None

        try:
            if not self._connected:
                await self.connect()

            full_key = self._make_key(key)
            value = await self._client.get(full_key)

            if value:
                logger.debug("cache_hit", key=key)
                return json.loads(value)

            logger.debug("cache_miss", key=key)
            return None

        except Exception as e:
            self._record_failure()
            logger.warning("cache_get_error", key=key, error=str(e))
            return None

    async def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None,
        ttl_type: Optional[str] = None
    ) -> bool:
        """
        Set a value in cache.

        Args:
            key: Cache key
            value: Value to cache (will be JSON serialized)
            ttl: Time to live in seconds
            ttl_type: Preset TTL type from CACHE_TTLS

        Returns:
            True if successful, False otherwise
        """
        if not await self._check_circuit():
            return False

        try:
            if not self._connected:
                await self.connect()

            # Determine TTL
            if ttl is None:
                if ttl_type and ttl_type in CACHE_TTLS:
                    ttl = CACHE_TTLS[ttl_type]
                else:
                    ttl = DEFAULT_TTL

            full_key = self._make_key(key)
            serialized = json.dumps(value)

            await self._client.setex(full_key, ttl, serialized)
            logger.debug("cache_set", key=key, ttl=ttl)
            return True

        except Exception as e:
            self._record_failure()
            logger.warning("cache_set_error", key=key, error=str(e))
            return False

    async def delete(self, key: str) -> bool:
        """
        Delete a key from cache.

        Args:
            key: Cache key

        Returns:
            True if successful, False otherwise
        """
        if not await self._check_circuit():
            return False

        try:
            if not self._connected:
                await self.connect()

            full_key = self._make_key(key)
            await self._client.delete(full_key)
            logger.debug("cache_delete", key=key)
            return True

        except Exception as e:
            self._record_failure()
            logger.warning("cache_delete_error", key=key, error=str(e))
            return False

    async def delete_pattern(self, pattern: str) -> int:
        """
        Delete all keys matching a pattern.

        Args:
            pattern: Key pattern (e.g., "user:*")

        Returns:
            Number of deleted keys
        """
        if not await self._check_circuit():
            return 0

        try:
            if not self._connected:
                await self.connect()

            full_pattern = self._make_key(pattern)
            keys = []
            async for key in self._client.scan_iter(match=full_pattern):
                keys.append(key)

            if keys:
                await self._client.delete(*keys)
                logger.info("cache_pattern_delete", pattern=pattern, count=len(keys))

            return len(keys)

        except Exception as e:
            self._record_failure()
            logger.warning("cache_pattern_delete_error", pattern=pattern, error=str(e))
            return 0

    async def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """
        Increment a counter in cache.

        Args:
            key: Cache key
            amount: Amount to increment

        Returns:
            New value or None on error
        """
        if not await self._check_circuit():
            return None

        try:
            if not self._connected:
                await self.connect()

            full_key = self._make_key(key)
            return await self._client.incrby(full_key, amount)

        except Exception as e:
            self._record_failure()
            logger.warning("cache_incr_error", key=key, error=str(e))
            return None

    async def get_stats(self) -> dict:
        """Get cache statistics."""
        try:
            if not self._connected:
                await self.connect()

            info = await self._client.info("stats")
            memory = await self._client.info("memory")

            return {
                "connected": self._connected,
                "circuit_open": self._circuit_open,
                "keyspace_hits": info.get("keyspace_hits", 0),
                "keyspace_misses": info.get("keyspace_misses", 0),
                "used_memory_human": memory.get("used_memory_human", "N/A"),
            }
        except Exception:
            return {
                "connected": False,
                "circuit_open": self._circuit_open,
                "error": "Failed to get stats"
            }


# ============================================
# GLOBAL CACHE INSTANCE
# ============================================

cache_service = CacheService()


# ============================================
# CACHING DECORATORS
# ============================================

def make_cache_key(*args, **kwargs) -> str:
    """Generate a cache key from function arguments."""
    key_parts = [str(arg) for arg in args]
    key_parts.extend(f"{k}={v}" for k, v in sorted(kwargs.items()))
    key_str = ":".join(key_parts)
    return hashlib.md5(key_str.encode()).hexdigest()[:16]


def cached(
    key_prefix: str,
    ttl: Optional[int] = None,
    ttl_type: Optional[str] = None
):
    """
    Decorator for caching function results.

    Usage:
        @cached("user", ttl_type="user_profile")
        async def get_user(user_id: str):
            ...

    Args:
        key_prefix: Prefix for cache key
        ttl: TTL in seconds (overrides ttl_type)
        ttl_type: Preset TTL type
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key
            arg_key = make_cache_key(*args, **kwargs)
            cache_key = f"{key_prefix}:{arg_key}"

            # Try to get from cache
            cached_value = await cache_service.get(cache_key)
            if cached_value is not None:
                return cached_value

            # Execute function
            result = await func(*args, **kwargs)

            # Cache the result
            if result is not None:
                await cache_service.set(cache_key, result, ttl=ttl, ttl_type=ttl_type)

            return result

        return wrapper
    return decorator


def invalidate_cache(patterns: list[str]):
    """
    Decorator to invalidate cache patterns after function execution.

    Usage:
        @invalidate_cache(["user:*", "course:{course_id}"])
        async def update_course(course_id: str, ...):
            ...
    """
    def decorator(func: Callable):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            result = await func(*args, **kwargs)

            # Invalidate patterns (format with kwargs if needed)
            for pattern in patterns:
                try:
                    formatted_pattern = pattern.format(**kwargs)
                except KeyError:
                    formatted_pattern = pattern
                await cache_service.delete_pattern(formatted_pattern)

            return result

        return wrapper
    return decorator
