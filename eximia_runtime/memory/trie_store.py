"""
Trie Memory Store - AIOS-inspired memory management with compression

Implements:
- Trie-based prefix deduplication for conversation history
- K-LRU eviction policy (evict at K% threshold)
- Per-agent memory blocks
- Efficient memory utilization

Based on research from:
- AIOS: LLM Agent Operating System (COLM 2025)
- https://arxiv.org/pdf/2403.16971
"""

import asyncio
import hashlib
import json
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Iterator

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


@dataclass
class MemoryItem:
    """Individual memory item stored in the trie"""
    key: str
    content: str
    agent_name: str
    created_at: float = field(default_factory=time.time)
    last_accessed: float = field(default_factory=time.time)
    access_count: int = 0
    size_bytes: int = 0
    metadata: dict[str, Any] = field(default_factory=dict)

    def __post_init__(self):
        if self.size_bytes == 0:
            self.size_bytes = sys.getsizeof(self.content)

    def touch(self) -> None:
        """Update access timestamp and count"""
        self.last_accessed = time.time()
        self.access_count += 1

    @property
    def age_seconds(self) -> float:
        """Time since creation"""
        return time.time() - self.created_at

    @property
    def idle_seconds(self) -> float:
        """Time since last access"""
        return time.time() - self.last_accessed


class TrieNode:
    """
    Node in the Trie structure.

    Each node can store:
    - Children nodes (for prefix traversal)
    - A memory item (if this node represents a complete key)
    - Aggregated statistics for the subtree
    """

    __slots__ = ['children', 'item', 'subtree_size', 'subtree_count']

    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        self.item: MemoryItem | None = None
        self.subtree_size: int = 0  # Size of all items in subtree
        self.subtree_count: int = 0  # Count of items in subtree

    def is_leaf(self) -> bool:
        """Check if this node has no children"""
        return len(self.children) == 0

    def has_item(self) -> bool:
        """Check if this node stores an item"""
        return self.item is not None


@dataclass
class MemoryBlock:
    """
    Per-agent memory block with dedicated allocation.

    Ensures each agent has isolated memory that doesn't
    interfere with others.
    """
    agent_name: str
    max_size_bytes: int
    used_size_bytes: int = 0
    item_count: int = 0
    created_at: float = field(default_factory=time.time)

    @property
    def utilization(self) -> float:
        """Current utilization percentage"""
        if self.max_size_bytes == 0:
            return 0.0
        return self.used_size_bytes / self.max_size_bytes

    @property
    def available_bytes(self) -> int:
        """Available space in bytes"""
        return max(0, self.max_size_bytes - self.used_size_bytes)


@dataclass
class TrieStats:
    """Statistics for the Trie Memory Store"""
    total_items: int = 0
    total_size_bytes: int = 0
    total_nodes: int = 0
    compression_ratio: float = 0.0  # Estimated space saved via prefix sharing
    eviction_count: int = 0
    hit_count: int = 0
    miss_count: int = 0
    agent_blocks: int = 0


class TrieMemoryStore:
    """
    Trie-based memory store with K-LRU eviction.

    Features:
    - Prefix deduplication: Common prefixes stored once
    - K-LRU eviction: Evict least-recently-used when K% full
    - Per-agent memory blocks: Isolation between agents
    - Efficient iteration and search

    Memory Layout:
    ```
    root
    ├── "the_cfo:" (agent prefix)
    │   ├── "session_123:" (session prefix)
    │   │   ├── "msg_1" -> MemoryItem
    │   │   └── "msg_2" -> MemoryItem
    │   └── "session_456:"
    │       └── "msg_1" -> MemoryItem
    └── "the_veritas:"
        └── ...
    ```

    Example:
        store = TrieMemoryStore(max_size_mb=100)

        # Store conversation
        await store.store(
            key="the_cfo:session_123:msg_1",
            content="User asked about valuation...",
            agent_name="the_cfo",
        )

        # Retrieve
        item = await store.get("the_cfo:session_123:msg_1")

        # Get all for agent
        items = list(store.iter_agent("the_cfo"))
    """

    def __init__(
        self,
        max_size_mb: int = 100,
        k_threshold: float = 0.8,
        default_block_size_mb: int = 10,
        enable_persistence: bool = False,
        storage_path: Path | None = None,
    ):
        """
        Initialize Trie Memory Store.

        Args:
            max_size_mb: Maximum total size in megabytes
            k_threshold: Eviction threshold (0.0-1.0)
            default_block_size_mb: Default size for agent blocks
            enable_persistence: Enable disk persistence
            storage_path: Path for persistent storage
        """
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.k_threshold = k_threshold
        self.default_block_size = default_block_size_mb * 1024 * 1024
        self.enable_persistence = enable_persistence
        self.storage_path = storage_path or Path(settings.base_path) / ".trie_memory"

        # Trie structure
        self._root = TrieNode()
        self._node_count = 1  # Root node

        # Current state
        self._current_size = 0
        self._item_count = 0

        # Agent blocks
        self._agent_blocks: dict[str, MemoryBlock] = {}

        # Statistics
        self._stats = TrieStats()
        self._eviction_count = 0
        self._hit_count = 0
        self._miss_count = 0

        # For iteration
        self._items: dict[str, MemoryItem] = {}  # key -> item (for O(1) lookup)

        self._lock = asyncio.Lock()

        # Ensure storage directory
        if self.enable_persistence:
            self.storage_path.mkdir(parents=True, exist_ok=True)

    def _get_or_create_block(self, agent_name: str) -> MemoryBlock:
        """Get or create memory block for an agent"""
        if agent_name not in self._agent_blocks:
            self._agent_blocks[agent_name] = MemoryBlock(
                agent_name=agent_name,
                max_size_bytes=self.default_block_size,
            )
        return self._agent_blocks[agent_name]

    def _traverse_to_node(self, key: str, create: bool = False) -> TrieNode | None:
        """
        Traverse trie to find node for key.

        Args:
            key: Key to traverse to
            create: If True, create nodes along the path

        Returns:
            Node at key position, or None if not found and not creating
        """
        node = self._root

        for char in key:
            if char not in node.children:
                if create:
                    node.children[char] = TrieNode()
                    self._node_count += 1
                else:
                    return None
            node = node.children[char]

        return node

    async def store(
        self,
        key: str,
        content: str,
        agent_name: str,
        metadata: dict[str, Any] | None = None,
    ) -> bool:
        """
        Store content in the trie.

        Args:
            key: Unique key (e.g., "agent:session:msg_id")
            content: Content to store
            agent_name: Agent name for block allocation
            metadata: Optional metadata

        Returns:
            True if stored successfully
        """
        async with self._lock:
            # Check if we need to evict first
            item_size = sys.getsizeof(content)
            await self._maybe_evict(item_size)

            # Get/create agent block
            block = self._get_or_create_block(agent_name)

            # Check block capacity
            if block.used_size_bytes + item_size > block.max_size_bytes:
                await self._evict_from_agent(agent_name, item_size)

            # Create memory item
            item = MemoryItem(
                key=key,
                content=content,
                agent_name=agent_name,
                size_bytes=item_size,
                metadata=metadata or {},
            )

            # Traverse and store
            node = self._traverse_to_node(key, create=True)
            if node is None:
                return False

            # Update if exists, or insert new
            old_item = node.item
            if old_item:
                # Update - adjust sizes
                self._current_size -= old_item.size_bytes
                block.used_size_bytes -= old_item.size_bytes
            else:
                self._item_count += 1
                block.item_count += 1

            node.item = item
            self._items[key] = item
            self._current_size += item_size
            block.used_size_bytes += item_size

            # Update subtree stats (propagate up)
            self._update_subtree_stats(key, item_size, 1 if not old_item else 0)

            logger.debug(
                "trie_store_item",
                key=key[:50],
                agent=agent_name,
                size=item_size,
            )

            return True

    async def get(self, key: str) -> MemoryItem | None:
        """
        Retrieve item by key.

        Args:
            key: Key to retrieve

        Returns:
            MemoryItem or None if not found
        """
        item = self._items.get(key)

        if item:
            item.touch()
            self._hit_count += 1
            return item

        self._miss_count += 1
        return None

    async def delete(self, key: str) -> bool:
        """
        Delete item by key.

        Args:
            key: Key to delete

        Returns:
            True if deleted, False if not found
        """
        async with self._lock:
            if key not in self._items:
                return False

            item = self._items.pop(key)

            # Update block stats
            if item.agent_name in self._agent_blocks:
                block = self._agent_blocks[item.agent_name]
                block.used_size_bytes -= item.size_bytes
                block.item_count -= 1

            # Update global stats
            self._current_size -= item.size_bytes
            self._item_count -= 1

            # Clear from trie (mark node as empty)
            node = self._traverse_to_node(key)
            if node:
                node.item = None

            return True

    async def get_by_prefix(self, prefix: str) -> list[MemoryItem]:
        """
        Get all items matching a prefix.

        Args:
            prefix: Key prefix to match

        Returns:
            List of matching items
        """
        return [
            item for key, item in self._items.items()
            if key.startswith(prefix)
        ]

    def iter_agent(self, agent_name: str) -> Iterator[MemoryItem]:
        """Iterate over all items for an agent"""
        for item in self._items.values():
            if item.agent_name == agent_name:
                yield item

    def iter_all(self) -> Iterator[MemoryItem]:
        """Iterate over all items"""
        return iter(self._items.values())

    async def _maybe_evict(self, required_bytes: int) -> None:
        """Evict items if we're over threshold"""
        threshold = self.max_size_bytes * self.k_threshold

        while self._current_size + required_bytes > threshold and self._items:
            # Find least recently used item
            lru_item = min(
                self._items.values(),
                key=lambda x: (x.last_accessed, -x.access_count)
            )

            await self.delete(lru_item.key)
            self._eviction_count += 1

            logger.debug(
                "trie_evicted_item",
                key=lru_item.key[:50],
                idle_seconds=lru_item.idle_seconds,
            )

    async def _evict_from_agent(self, agent_name: str, required_bytes: int) -> None:
        """Evict items from a specific agent's block"""
        agent_items = list(self.iter_agent(agent_name))

        if not agent_items:
            return

        # Sort by LRU
        agent_items.sort(key=lambda x: (x.last_accessed, -x.access_count))

        freed = 0
        for item in agent_items:
            if freed >= required_bytes:
                break
            await self.delete(item.key)
            freed += item.size_bytes
            self._eviction_count += 1

    def _update_subtree_stats(self, key: str, size_delta: int, count_delta: int) -> None:
        """Update subtree statistics along the path"""
        node = self._root
        for char in key:
            if char in node.children:
                node = node.children[char]
                node.subtree_size += size_delta
                node.subtree_count += count_delta

    def get_stats(self) -> TrieStats:
        """Get current statistics"""
        # Calculate compression ratio
        raw_size = sum(len(key) for key in self._items.keys())
        trie_size = self._node_count * 64  # Approximate node overhead

        compression_ratio = 1.0 - (trie_size / max(raw_size, 1))

        return TrieStats(
            total_items=self._item_count,
            total_size_bytes=self._current_size,
            total_nodes=self._node_count,
            compression_ratio=max(0, compression_ratio),
            eviction_count=self._eviction_count,
            hit_count=self._hit_count,
            miss_count=self._miss_count,
            agent_blocks=len(self._agent_blocks),
        )

    def get_agent_stats(self, agent_name: str) -> MemoryBlock | None:
        """Get stats for a specific agent"""
        return self._agent_blocks.get(agent_name)

    async def clear(self) -> None:
        """Clear all stored items"""
        async with self._lock:
            self._root = TrieNode()
            self._node_count = 1
            self._items.clear()
            self._current_size = 0
            self._item_count = 0
            self._agent_blocks.clear()

            logger.info("trie_store_cleared")

    async def clear_agent(self, agent_name: str) -> int:
        """
        Clear all items for an agent.

        Returns:
            Number of items cleared
        """
        async with self._lock:
            to_delete = [
                key for key, item in self._items.items()
                if item.agent_name == agent_name
            ]

            for key in to_delete:
                await self.delete(key)

            # Clear block
            if agent_name in self._agent_blocks:
                del self._agent_blocks[agent_name]

            return len(to_delete)

    # Persistence methods (optional)

    async def persist(self) -> None:
        """Persist current state to disk"""
        if not self.enable_persistence:
            return

        data = {
            "items": {
                key: {
                    "key": item.key,
                    "content": item.content,
                    "agent_name": item.agent_name,
                    "created_at": item.created_at,
                    "last_accessed": item.last_accessed,
                    "access_count": item.access_count,
                    "metadata": item.metadata,
                }
                for key, item in self._items.items()
            },
            "persisted_at": time.time(),
        }

        file_path = self.storage_path / "trie_store.json"
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

        logger.info("trie_store_persisted", items=len(self._items))

    async def load(self) -> bool:
        """Load state from disk"""
        if not self.enable_persistence:
            return False

        file_path = self.storage_path / "trie_store.json"
        if not file_path.exists():
            return False

        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            for key, item_data in data.get("items", {}).items():
                await self.store(
                    key=item_data["key"],
                    content=item_data["content"],
                    agent_name=item_data["agent_name"],
                    metadata=item_data.get("metadata", {}),
                )

            logger.info("trie_store_loaded", items=len(self._items))
            return True

        except Exception as e:
            logger.error("trie_store_load_failed", error=str(e))
            return False


# Module-level singleton
_trie_store: TrieMemoryStore | None = None


def get_trie_store(
    max_size_mb: int = 100,
    k_threshold: float = 0.8,
) -> TrieMemoryStore:
    """Get or create the global Trie Memory Store instance"""
    global _trie_store
    if _trie_store is None:
        _trie_store = TrieMemoryStore(
            max_size_mb=max_size_mb,
            k_threshold=k_threshold,
        )
    return _trie_store


async def reset_trie_store() -> None:
    """Reset the global Trie Memory Store (for testing)"""
    global _trie_store
    if _trie_store:
        await _trie_store.clear()
    _trie_store = None
