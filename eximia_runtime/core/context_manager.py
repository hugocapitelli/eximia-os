"""
Context Manager - AIOS-inspired context management for agent execution

Implements:
- Context snapshots for task interruption/resumption
- Context window guard to prevent overflow
- Cross-agent context sharing via handoffs
- Token budget tracking

Based on research from:
- AIOS: LLM Agent Operating System (COLM 2025)
- https://arxiv.org/pdf/2403.16971
"""

import asyncio
import hashlib
import json
import time
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


# Token limits by model (approximate)
MODEL_CONTEXT_LIMITS = {
    # OpenAI
    "gpt-4o": 128000,
    "gpt-4o-mini": 128000,
    "gpt-4-turbo": 128000,
    "gpt-4": 8192,
    "gpt-3.5-turbo": 16385,
    # Anthropic
    "claude-3-opus": 200000,
    "claude-3-sonnet": 200000,
    "claude-3-haiku": 200000,
    "claude-3-5-sonnet": 200000,
    "claude-opus-4": 200000,
    "claude-sonnet-4": 200000,
    # Google
    "gemini-pro": 32000,
    "gemini-1.5-pro": 1000000,
    "gemini-1.5-flash": 1000000,
    # Local
    "ollama/llama3": 8192,
    "ollama/mistral": 32000,
}

# Default safety margin (leave 20% for response)
CONTEXT_SAFETY_MARGIN = 0.80


class ContextStatus(Enum):
    """Context lifecycle states"""
    ACTIVE = "active"
    SUSPENDED = "suspended"
    RESTORED = "restored"
    EXPIRED = "expired"
    OVERFLOW = "overflow"


@dataclass
class ContextSnapshot:
    """
    Snapshot of execution context for suspension/resumption.

    Stores:
    - System prompt
    - Conversation history
    - Agent state
    - Token usage
    """
    snapshot_id: str
    task_id: str
    agent_name: str
    created_at: float = field(default_factory=time.time)
    expires_at: float | None = None

    # Context data
    system_prompt: str = ""
    messages: list[dict[str, str]] = field(default_factory=list)
    agent_state: dict[str, Any] = field(default_factory=dict)

    # Token tracking
    total_tokens: int = 0
    prompt_tokens: int = 0
    response_tokens: int = 0
    model: str = ""

    # Metadata
    status: ContextStatus = ContextStatus.ACTIVE
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Serialize to dictionary"""
        return {
            "snapshot_id": self.snapshot_id,
            "task_id": self.task_id,
            "agent_name": self.agent_name,
            "created_at": self.created_at,
            "expires_at": self.expires_at,
            "system_prompt": self.system_prompt,
            "messages": self.messages,
            "agent_state": self.agent_state,
            "total_tokens": self.total_tokens,
            "prompt_tokens": self.prompt_tokens,
            "response_tokens": self.response_tokens,
            "model": self.model,
            "status": self.status.value,
            "metadata": self.metadata,
        }

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ContextSnapshot":
        """Deserialize from dictionary"""
        data["status"] = ContextStatus(data.get("status", "active"))
        return cls(**data)

    @property
    def is_expired(self) -> bool:
        """Check if snapshot has expired"""
        if self.expires_at is None:
            return False
        return time.time() > self.expires_at

    @property
    def age_seconds(self) -> float:
        """Time since creation"""
        return time.time() - self.created_at


@dataclass
class TokenBudget:
    """Token budget tracking for an agent/session"""
    model: str
    max_tokens: int
    used_tokens: int = 0
    reserved_for_response: int = 4096

    @property
    def available_tokens(self) -> int:
        """Tokens available for input"""
        return max(0, self.max_tokens - self.used_tokens - self.reserved_for_response)

    @property
    def utilization(self) -> float:
        """Current utilization percentage"""
        if self.max_tokens == 0:
            return 0.0
        return self.used_tokens / self.max_tokens

    @property
    def is_overflow(self) -> bool:
        """Check if budget is exceeded"""
        return self.used_tokens > (self.max_tokens * CONTEXT_SAFETY_MARGIN)


class ContextManager:
    """
    Manages execution context for agents.

    Features:
    - Snapshot creation and restoration
    - Context window overflow prevention
    - Token budget tracking
    - Context persistence for long-running tasks

    Example:
        ctx_manager = ContextManager()

        # Create snapshot before suspension
        snapshot = await ctx_manager.create_snapshot(
            task_id="task-123",
            agent_name="the_cfo",
            messages=[...],
        )

        # Later, restore context
        restored = await ctx_manager.restore_snapshot(snapshot.snapshot_id)
    """

    def __init__(
        self,
        snapshot_ttl: int = 3600,  # 1 hour default
        storage_path: Path | None = None,
    ):
        """
        Initialize context manager.

        Args:
            snapshot_ttl: Time-to-live for snapshots in seconds
            storage_path: Path for persistent snapshot storage
        """
        self.snapshot_ttl = snapshot_ttl
        self.storage_path = storage_path or Path(settings.base_path) / ".context_snapshots"

        # In-memory storage
        self._snapshots: dict[str, ContextSnapshot] = {}
        self._task_snapshots: dict[str, str] = {}  # task_id -> snapshot_id
        self._token_budgets: dict[str, TokenBudget] = {}  # session_id -> budget

        # Ensure storage directory exists
        self.storage_path.mkdir(parents=True, exist_ok=True)

        self._lock = asyncio.Lock()

    def _generate_snapshot_id(self, task_id: str, agent_name: str) -> str:
        """Generate unique snapshot ID"""
        content = f"{task_id}:{agent_name}:{time.time()}"
        return hashlib.sha256(content.encode()).hexdigest()[:12]

    def estimate_tokens(self, text: str) -> int:
        """
        Estimate token count for text.

        Uses rough approximation: ~4 characters per token for English.
        For more accuracy, use tiktoken library.
        """
        # Rough estimate - can be improved with tiktoken
        return len(text) // 4

    def get_context_limit(self, model: str) -> int:
        """Get context window limit for a model"""
        # Check exact match first
        if model in MODEL_CONTEXT_LIMITS:
            return MODEL_CONTEXT_LIMITS[model]

        # Check partial match
        for key, limit in MODEL_CONTEXT_LIMITS.items():
            if key in model.lower():
                return limit

        # Default to conservative limit
        return 8192

    async def create_snapshot(
        self,
        task_id: str,
        agent_name: str,
        system_prompt: str = "",
        messages: list[dict[str, str]] | None = None,
        agent_state: dict[str, Any] | None = None,
        model: str = "",
        metadata: dict[str, Any] | None = None,
    ) -> ContextSnapshot:
        """
        Create a snapshot of current execution context.

        Args:
            task_id: Associated task ID
            agent_name: Agent name
            system_prompt: System prompt
            messages: Conversation messages
            agent_state: Additional agent state
            model: Model being used
            metadata: Additional metadata

        Returns:
            Created snapshot
        """
        snapshot_id = self._generate_snapshot_id(task_id, agent_name)

        # Calculate token usage
        total_text = system_prompt + " ".join(
            m.get("content", "") for m in (messages or [])
        )
        total_tokens = self.estimate_tokens(total_text)

        snapshot = ContextSnapshot(
            snapshot_id=snapshot_id,
            task_id=task_id,
            agent_name=agent_name,
            expires_at=time.time() + self.snapshot_ttl,
            system_prompt=system_prompt,
            messages=messages or [],
            agent_state=agent_state or {},
            total_tokens=total_tokens,
            model=model,
            metadata=metadata or {},
        )

        async with self._lock:
            self._snapshots[snapshot_id] = snapshot
            self._task_snapshots[task_id] = snapshot_id

        # Persist to disk
        await self._persist_snapshot(snapshot)

        logger.info(
            "context_snapshot_created",
            snapshot_id=snapshot_id,
            task_id=task_id,
            agent=agent_name,
            tokens=total_tokens,
        )

        return snapshot

    async def restore_snapshot(self, snapshot_id: str) -> ContextSnapshot | None:
        """
        Restore a saved snapshot.

        Args:
            snapshot_id: ID of snapshot to restore

        Returns:
            Restored snapshot or None if not found/expired
        """
        async with self._lock:
            snapshot = self._snapshots.get(snapshot_id)

            if not snapshot:
                # Try to load from disk
                snapshot = await self._load_snapshot(snapshot_id)

            if not snapshot:
                logger.warning("snapshot_not_found", snapshot_id=snapshot_id)
                return None

            if snapshot.is_expired:
                logger.warning("snapshot_expired", snapshot_id=snapshot_id)
                snapshot.status = ContextStatus.EXPIRED
                return None

            snapshot.status = ContextStatus.RESTORED

        logger.info(
            "context_snapshot_restored",
            snapshot_id=snapshot_id,
            task_id=snapshot.task_id,
            age_seconds=snapshot.age_seconds,
        )

        return snapshot

    async def get_snapshot_for_task(self, task_id: str) -> ContextSnapshot | None:
        """Get latest snapshot for a task"""
        snapshot_id = self._task_snapshots.get(task_id)
        if snapshot_id:
            return await self.restore_snapshot(snapshot_id)
        return None

    async def delete_snapshot(self, snapshot_id: str) -> bool:
        """Delete a snapshot"""
        async with self._lock:
            if snapshot_id in self._snapshots:
                snapshot = self._snapshots.pop(snapshot_id)
                self._task_snapshots.pop(snapshot.task_id, None)

                # Remove from disk
                file_path = self.storage_path / f"{snapshot_id}.json"
                if file_path.exists():
                    file_path.unlink()

                logger.info("snapshot_deleted", snapshot_id=snapshot_id)
                return True

        return False

    async def cleanup_expired(self) -> int:
        """Remove expired snapshots. Returns count of removed snapshots."""
        removed = 0

        async with self._lock:
            expired_ids = [
                sid for sid, snapshot in self._snapshots.items()
                if snapshot.is_expired
            ]

            for snapshot_id in expired_ids:
                snapshot = self._snapshots.pop(snapshot_id)
                self._task_snapshots.pop(snapshot.task_id, None)

                # Remove from disk
                file_path = self.storage_path / f"{snapshot_id}.json"
                if file_path.exists():
                    file_path.unlink()

                removed += 1

        if removed:
            logger.info("expired_snapshots_cleaned", count=removed)

        return removed

    def check_context_window(
        self,
        model: str,
        current_tokens: int,
        additional_tokens: int = 0,
    ) -> tuple[bool, int]:
        """
        Check if adding content would overflow context window.

        Args:
            model: Model name
            current_tokens: Current token count
            additional_tokens: Tokens to add

        Returns:
            Tuple of (is_safe, available_tokens)
        """
        limit = self.get_context_limit(model)
        safe_limit = int(limit * CONTEXT_SAFETY_MARGIN)

        total = current_tokens + additional_tokens
        available = safe_limit - current_tokens

        is_safe = total <= safe_limit

        if not is_safe:
            logger.warning(
                "context_window_overflow_risk",
                model=model,
                limit=limit,
                current=current_tokens,
                additional=additional_tokens,
                total=total,
            )

        return is_safe, available

    def get_token_budget(self, session_id: str, model: str) -> TokenBudget:
        """Get or create token budget for a session"""
        if session_id not in self._token_budgets:
            limit = self.get_context_limit(model)
            self._token_budgets[session_id] = TokenBudget(
                model=model,
                max_tokens=limit,
            )
        return self._token_budgets[session_id]

    def update_token_budget(
        self,
        session_id: str,
        tokens_used: int,
        model: str | None = None,
    ) -> TokenBudget:
        """Update token usage for a session"""
        budget = self.get_token_budget(session_id, model or settings.default_model)
        budget.used_tokens += tokens_used

        if budget.is_overflow:
            logger.warning(
                "token_budget_overflow",
                session_id=session_id,
                used=budget.used_tokens,
                max=budget.max_tokens,
            )

        return budget

    def reset_token_budget(self, session_id: str) -> None:
        """Reset token budget for a session"""
        if session_id in self._token_budgets:
            self._token_budgets[session_id].used_tokens = 0

    async def truncate_context(
        self,
        messages: list[dict[str, str]],
        model: str,
        max_tokens: int | None = None,
        preserve_system: bool = True,
        preserve_recent: int = 4,
    ) -> list[dict[str, str]]:
        """
        Truncate conversation to fit within context window.

        Strategy:
        1. Always preserve system message (if present)
        2. Always preserve most recent N messages
        3. Remove oldest messages first

        Args:
            messages: List of messages
            model: Model name
            max_tokens: Override max tokens
            preserve_system: Keep system message
            preserve_recent: Number of recent messages to always keep

        Returns:
            Truncated message list
        """
        if not messages:
            return messages

        limit = max_tokens or int(self.get_context_limit(model) * CONTEXT_SAFETY_MARGIN)

        # Separate system and user/assistant messages
        system_msg = None
        other_messages = []

        for msg in messages:
            if msg.get("role") == "system" and preserve_system:
                system_msg = msg
            else:
                other_messages.append(msg)

        # Calculate tokens
        total_tokens = 0
        if system_msg:
            total_tokens += self.estimate_tokens(system_msg.get("content", ""))

        # Messages with their token counts
        msg_tokens = [
            (msg, self.estimate_tokens(msg.get("content", "")))
            for msg in other_messages
        ]

        # If already under limit, return as-is
        current_total = total_tokens + sum(t for _, t in msg_tokens)
        if current_total <= limit:
            return messages

        # Preserve recent messages
        preserved = msg_tokens[-preserve_recent:] if len(msg_tokens) > preserve_recent else msg_tokens
        remaining = msg_tokens[:-preserve_recent] if len(msg_tokens) > preserve_recent else []

        preserved_tokens = sum(t for _, t in preserved)
        available = limit - total_tokens - preserved_tokens

        # Add older messages until we hit the limit
        kept_old = []
        for msg, tokens in reversed(remaining):
            if available >= tokens:
                kept_old.insert(0, msg)
                available -= tokens

        # Reconstruct message list
        result = []
        if system_msg:
            result.append(system_msg)
        result.extend(kept_old)
        result.extend(msg for msg, _ in preserved)

        logger.info(
            "context_truncated",
            original_count=len(messages),
            final_count=len(result),
            removed=len(messages) - len(result),
        )

        return result

    async def _persist_snapshot(self, snapshot: ContextSnapshot) -> None:
        """Save snapshot to disk"""
        file_path = self.storage_path / f"{snapshot.snapshot_id}.json"
        try:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(snapshot.to_dict(), f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.warning("snapshot_persist_failed", error=str(e))

    async def _load_snapshot(self, snapshot_id: str) -> ContextSnapshot | None:
        """Load snapshot from disk"""
        file_path = self.storage_path / f"{snapshot_id}.json"
        try:
            if file_path.exists():
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    snapshot = ContextSnapshot.from_dict(data)
                    self._snapshots[snapshot_id] = snapshot
                    return snapshot
        except Exception as e:
            logger.warning("snapshot_load_failed", error=str(e))
        return None

    def get_stats(self) -> dict[str, Any]:
        """Get context manager statistics"""
        return {
            "total_snapshots": len(self._snapshots),
            "active_budgets": len(self._token_budgets),
            "storage_path": str(self.storage_path),
            "snapshot_ttl": self.snapshot_ttl,
        }


# Module-level singleton
_context_manager: ContextManager | None = None


def get_context_manager() -> ContextManager:
    """Get or create the global context manager instance"""
    global _context_manager
    if _context_manager is None:
        _context_manager = ContextManager()
    return _context_manager


async def reset_context_manager() -> None:
    """Reset the global context manager (for testing)"""
    global _context_manager
    if _context_manager:
        await _context_manager.cleanup_expired()
    _context_manager = None
