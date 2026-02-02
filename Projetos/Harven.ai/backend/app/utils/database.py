"""
Harven.AI - Database Utilities
==============================

Connection pooling and database management for Supabase.
"""

import os
from typing import Optional, Generator
from contextlib import contextmanager
import threading

from supabase import create_client, Client
import structlog

logger = structlog.get_logger()


class DatabasePool:
    """
    Connection pool manager for Supabase clients.

    Implements a simple connection pool with thread-local storage
    for efficient connection reuse across async contexts.
    """

    _instance: Optional["DatabasePool"] = None
    _lock = threading.Lock()

    def __new__(cls):
        """Singleton pattern for connection pool."""
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        """Initialize the connection pool."""
        if self._initialized:
            return

        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self.service_key = os.getenv("SUPABASE_SERVICE_KEY")

        self._pool: list[Client] = []
        self._pool_size = int(os.getenv("DB_POOL_SIZE", "5"))
        self._pool_lock = threading.Lock()
        self._thread_local = threading.local()

        self._initialized = True
        logger.info("database_pool_initialized", pool_size=self._pool_size)

    def _create_client(self, use_service_key: bool = False) -> Optional[Client]:
        """Create a new Supabase client."""
        if not self.url:
            logger.error("supabase_url_not_configured")
            return None

        key = self.service_key if use_service_key and self.service_key else self.key
        if not key:
            logger.error("supabase_key_not_configured")
            return None

        try:
            client = create_client(self.url, key)
            return client
        except Exception as e:
            logger.error("supabase_client_creation_failed", error=str(e))
            return None

    def get_client(self, use_service_key: bool = False) -> Optional[Client]:
        """
        Get a Supabase client from the pool.

        Uses thread-local storage for connection affinity.

        Args:
            use_service_key: Use service role key for admin operations

        Returns:
            Supabase client or None if configuration is missing
        """
        # Check thread-local first
        thread_key = "admin_client" if use_service_key else "client"
        if hasattr(self._thread_local, thread_key):
            return getattr(self._thread_local, thread_key)

        # Try to get from pool
        with self._pool_lock:
            if self._pool and not use_service_key:
                client = self._pool.pop()
                setattr(self._thread_local, thread_key, client)
                return client

        # Create new client
        client = self._create_client(use_service_key)
        if client:
            setattr(self._thread_local, thread_key, client)
        return client

    def release_client(self, client: Client):
        """
        Return a client to the pool.

        Args:
            client: Supabase client to return
        """
        with self._pool_lock:
            if len(self._pool) < self._pool_size:
                self._pool.append(client)

    @contextmanager
    def session(self, use_service_key: bool = False) -> Generator[Client, None, None]:
        """
        Context manager for database sessions.

        Usage:
            with db_pool.session() as client:
                result = client.table("users").select("*").execute()
        """
        client = self.get_client(use_service_key)
        if not client:
            raise RuntimeError("Failed to get database client")

        try:
            yield client
        finally:
            self.release_client(client)

    def health_check(self) -> dict:
        """
        Check database connectivity.

        Returns:
            Health status dictionary
        """
        try:
            client = self.get_client()
            if not client:
                return {
                    "status": "unhealthy",
                    "error": "No client available",
                }

            # Simple query to verify connectivity
            result = client.table("users").select("id").limit(1).execute()

            return {
                "status": "healthy",
                "pool_size": len(self._pool),
                "configured_pool_size": self._pool_size,
            }
        except Exception as e:
            return {
                "status": "unhealthy",
                "error": str(e),
            }


# Global pool instance
_db_pool: Optional[DatabasePool] = None


def get_db_pool() -> DatabasePool:
    """Get the global database pool instance."""
    global _db_pool
    if _db_pool is None:
        _db_pool = DatabasePool()
    return _db_pool


def get_db(use_service_key: bool = False) -> Optional[Client]:
    """
    FastAPI dependency for getting a database client.

    Usage:
        @app.get("/users")
        async def get_users(db: Client = Depends(get_db)):
            return db.table("users").select("*").execute()
    """
    pool = get_db_pool()
    return pool.get_client(use_service_key)


def get_admin_db() -> Optional[Client]:
    """
    FastAPI dependency for getting an admin database client.

    Uses the service role key for bypassing RLS.
    """
    return get_db(use_service_key=True)
