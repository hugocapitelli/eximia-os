"""
ExímIA Agent Service - Supabase Client

Provides Supabase client for database operations.
"""
import logging
from functools import lru_cache

from supabase import create_client, Client

from app.config import settings

logger = logging.getLogger(__name__)


class SupabaseClient:
    """Wrapper for Supabase client with convenience methods."""

    def __init__(self, client: Client):
        self.client = client

    def table(self, name: str):
        """Access a table."""
        return self.client.table(name)

    def rpc(self, fn: str, params: dict = None):
        """Call a stored procedure."""
        return self.client.rpc(fn, params or {})

    @property
    def auth(self):
        """Access auth client."""
        return self.client.auth

    @property
    def storage(self):
        """Access storage client."""
        return self.client.storage


@lru_cache
def get_supabase_client() -> SupabaseClient:
    """
    Get cached Supabase client instance.

    Uses service role key for backend operations (bypasses RLS).
    """
    logger.info("Initializing Supabase client")

    client = create_client(
        supabase_url=settings.supabase_url,
        supabase_key=settings.supabase_service_key,
    )

    return SupabaseClient(client)


def get_user_supabase_client(access_token: str) -> SupabaseClient:
    """
    Get Supabase client with user's access token.

    Uses user's token for RLS-protected operations.
    """
    client = create_client(
        supabase_url=settings.supabase_url,
        supabase_key=settings.supabase_service_key,
    )

    # Set the user's access token
    client.auth.set_session(access_token, "")

    return SupabaseClient(client)
