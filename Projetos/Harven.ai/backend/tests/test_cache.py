"""
Harven.AI - Cache Service Tests
===============================

Tests for the Redis cache service.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
import json


class TestCacheService:
    """Tests for CacheService class."""

    @pytest.fixture
    def mock_redis(self):
        """Mock Redis client."""
        with patch("app.services.cache.redis") as mock:
            mock_client = AsyncMock()
            mock.from_url.return_value = mock_client
            mock_client.ping = AsyncMock(return_value=True)
            mock_client.get = AsyncMock(return_value=None)
            mock_client.setex = AsyncMock(return_value=True)
            mock_client.delete = AsyncMock(return_value=1)
            mock_client.close = AsyncMock()
            yield mock_client

    @pytest.mark.asyncio
    async def test_connect_success(self, mock_redis):
        """Test successful Redis connection."""
        from app.services.cache import CacheService

        cache = CacheService("redis://localhost:6379")
        result = await cache.connect()

        assert result is True
        assert cache._connected is True

    @pytest.mark.asyncio
    async def test_connect_failure(self):
        """Test Redis connection failure."""
        with patch("app.services.cache.redis") as mock:
            mock_client = AsyncMock()
            mock.from_url.return_value = mock_client
            mock_client.ping = AsyncMock(side_effect=Exception("Connection refused"))

            from app.services.cache import CacheService
            cache = CacheService("redis://invalid:6379")
            result = await cache.connect()

            assert result is False
            assert cache._connected is False

    @pytest.mark.asyncio
    async def test_get_cache_hit(self, mock_redis):
        """Test getting a cached value."""
        mock_redis.get = AsyncMock(return_value=json.dumps({"data": "test"}))

        from app.services.cache import CacheService
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        result = await cache.get("test_key")

        assert result == {"data": "test"}
        mock_redis.get.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_cache_miss(self, mock_redis):
        """Test cache miss returns None."""
        mock_redis.get = AsyncMock(return_value=None)

        from app.services.cache import CacheService
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        result = await cache.get("nonexistent_key")

        assert result is None

    @pytest.mark.asyncio
    async def test_set_with_default_ttl(self, mock_redis):
        """Test setting a value with default TTL."""
        from app.services.cache import CacheService, DEFAULT_TTL
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        result = await cache.set("test_key", {"data": "value"})

        assert result is True
        mock_redis.setex.assert_called_once()
        call_args = mock_redis.setex.call_args
        assert call_args[0][1] == DEFAULT_TTL  # TTL should be default

    @pytest.mark.asyncio
    async def test_set_with_custom_ttl(self, mock_redis):
        """Test setting a value with custom TTL."""
        from app.services.cache import CacheService
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        result = await cache.set("test_key", {"data": "value"}, ttl=600)

        assert result is True
        call_args = mock_redis.setex.call_args
        assert call_args[0][1] == 600

    @pytest.mark.asyncio
    async def test_set_with_ttl_type(self, mock_redis):
        """Test setting a value with TTL type preset."""
        from app.services.cache import CacheService, CACHE_TTLS
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        result = await cache.set("test_key", {"data": "value"}, ttl_type="ai_response")

        assert result is True
        call_args = mock_redis.setex.call_args
        assert call_args[0][1] == CACHE_TTLS["ai_response"]

    @pytest.mark.asyncio
    async def test_delete_key(self, mock_redis):
        """Test deleting a cache key."""
        from app.services.cache import CacheService
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        result = await cache.delete("test_key")

        assert result is True
        mock_redis.delete.assert_called_once()

    @pytest.mark.asyncio
    async def test_delete_pattern(self, mock_redis):
        """Test deleting keys by pattern."""
        async def mock_scan_iter(match):
            for key in ["harven:user:1", "harven:user:2"]:
                yield key

        mock_redis.scan_iter = mock_scan_iter
        mock_redis.delete = AsyncMock(return_value=2)

        from app.services.cache import CacheService
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        count = await cache.delete_pattern("user:*")

        assert count == 2

    @pytest.mark.asyncio
    async def test_circuit_breaker_opens_after_failures(self, mock_redis):
        """Test circuit breaker opens after max failures."""
        mock_redis.get = AsyncMock(side_effect=Exception("Redis error"))

        from app.services.cache import CacheService
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        # Make max_failures requests
        for _ in range(cache._max_failures):
            await cache.get("test_key")

        assert cache._circuit_open is True

        # Next request should be blocked by circuit
        result = await cache.get("test_key")
        assert result is None

    @pytest.mark.asyncio
    async def test_get_stats(self, mock_redis):
        """Test getting cache statistics."""
        mock_redis.info = AsyncMock(side_effect=[
            {"keyspace_hits": 100, "keyspace_misses": 20},
            {"used_memory_human": "1.5M"}
        ])

        from app.services.cache import CacheService
        cache = CacheService()
        cache._client = mock_redis
        cache._connected = True

        stats = await cache.get_stats()

        assert stats["connected"] is True
        assert stats["keyspace_hits"] == 100
        assert stats["keyspace_misses"] == 20


class TestCacheDecorators:
    """Tests for caching decorators."""

    @pytest.mark.asyncio
    async def test_cached_decorator_cache_hit(self):
        """Test cached decorator returns cached value."""
        with patch("app.services.cache.cache_service") as mock_cache:
            mock_cache.get = AsyncMock(return_value={"cached": True})
            mock_cache.set = AsyncMock()

            from app.services.cache import cached

            @cached("test", ttl=60)
            async def my_function(arg1: str):
                return {"fresh": True}

            result = await my_function("value")

            assert result == {"cached": True}
            mock_cache.set.assert_not_called()  # Should not set when cache hit

    @pytest.mark.asyncio
    async def test_cached_decorator_cache_miss(self):
        """Test cached decorator executes function on cache miss."""
        with patch("app.services.cache.cache_service") as mock_cache:
            mock_cache.get = AsyncMock(return_value=None)
            mock_cache.set = AsyncMock()

            from app.services.cache import cached

            @cached("test", ttl=60)
            async def my_function(arg1: str):
                return {"fresh": True}

            result = await my_function("value")

            assert result == {"fresh": True}
            mock_cache.set.assert_called_once()

    @pytest.mark.asyncio
    async def test_invalidate_cache_decorator(self):
        """Test invalidate_cache decorator clears patterns."""
        with patch("app.services.cache.cache_service") as mock_cache:
            mock_cache.delete_pattern = AsyncMock(return_value=5)

            from app.services.cache import invalidate_cache

            @invalidate_cache(["user:*", "course:123"])
            async def update_user():
                return {"updated": True}

            result = await update_user()

            assert result == {"updated": True}
            assert mock_cache.delete_pattern.call_count == 2

    def test_make_cache_key_consistent(self):
        """Test cache key generation is consistent."""
        from app.services.cache import make_cache_key

        key1 = make_cache_key("arg1", "arg2", kwarg1="value1")
        key2 = make_cache_key("arg1", "arg2", kwarg1="value1")

        assert key1 == key2

    def test_make_cache_key_different_args(self):
        """Test different args produce different keys."""
        from app.services.cache import make_cache_key

        key1 = make_cache_key("arg1")
        key2 = make_cache_key("arg2")

        assert key1 != key2
