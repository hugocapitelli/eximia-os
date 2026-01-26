# Migration Guide: eximIA.OS v2.0 (AIOS-Enhanced)

## Overview

This guide covers the migration from eximIA.OS v1.x to v2.0, which introduces AIOS-inspired features for improved performance, scalability, and resource management.

**New Features in v2.0:**
- Task Scheduler with FIFO, Round Robin, and Priority algorithms
- Context Manager with snapshot/restore capabilities
- Trie Memory Store with K-LRU eviction
- Tool Manager with sandboxed execution
- Comprehensive Benchmark Suite

---

## Breaking Changes

### 1. Orchestrator API Changes

**Before (v1.x):**
```python
from eximia_runtime.core.orchestrator import orchestrator

result = await orchestrator.route(request)
```

**After (v2.0):**
```python
from eximia_runtime.core.orchestrator import orchestrator, create_orchestrator

# Basic usage (unchanged)
result = await orchestrator.route(request)

# With scheduler enabled
result = await orchestrator.route(
    request,
    use_scheduler=True,
    session_id="session_123",
)

# Custom orchestrator with full features
custom_orch = create_orchestrator(
    use_scheduler=True,
    use_context_manager=True,
)
```

### 2. Session Management

The session management now integrates with Context Manager for improved context preservation.

**Before (v1.x):**
```python
# Manual session handling
session = await session_manager.create_session(agent_name)
```

**After (v2.0):**
```python
# With context snapshots
from eximia_runtime.core.context_manager import get_context_manager

ctx_manager = get_context_manager()

# Create snapshot before long operations
snapshot = await ctx_manager.create_snapshot(
    task_id="task-123",
    agent_name="the_cfo",
    messages=conversation_history,
)

# Restore later if needed
restored = await ctx_manager.restore_snapshot(snapshot.snapshot_id)
```

### 3. Memory Management

New trie-based memory store replaces simple dict-based storage.

**Before (v1.x):**
```python
# Simple in-memory storage
memory_cache[key] = value
```

**After (v2.0):**
```python
from eximia_runtime.memory.trie_store import get_trie_store

store = get_trie_store(max_size_mb=100)

# Store with agent isolation
await store.store(
    key="agent:session:message_id",
    content="Message content",
    agent_name="the_cfo",
)

# Retrieve
item = await store.get("agent:session:message_id")
```

---

## New Components

### 1. Scheduler

The scheduler manages task execution with configurable algorithms.

```python
from eximia_runtime.core.scheduler import (
    get_scheduler,
    Scheduler,
    SchedulerAlgorithm,
    AgentTask,
    TaskPriority,
)

# Get default scheduler
scheduler = get_scheduler(
    algorithm=SchedulerAlgorithm.PRIORITY,
    max_concurrent=10,
)

# Start the scheduler
await scheduler.start()

# Submit a task
task = AgentTask(
    agent_name="the_cfo",
    input_data="Analyze revenue trends",
    priority=TaskPriority.HIGH,
)
task_id = await scheduler.submit(task)

# Wait for result
result = await scheduler.wait_for(task_id, timeout=60)

# Stop scheduler
await scheduler.stop(graceful=True)
```

**Priority Levels:**
- `CRITICAL` (0): Legal/compliance tasks (the_clo)
- `HIGH` (1): Finance tasks (the_cfo)
- `NORMAL` (2): Default for most agents
- `LOW` (3): Background/maintenance tasks

### 2. Context Manager

Manages execution context with snapshot/restore capabilities.

```python
from eximia_runtime.core.context_manager import (
    get_context_manager,
    ContextSnapshot,
)

ctx_manager = get_context_manager()

# Check context window limits
is_safe, available = ctx_manager.check_context_window(
    model="gpt-4o",
    current_tokens=50000,
    additional_tokens=10000,
)

# Truncate context if needed
truncated = await ctx_manager.truncate_context(
    messages=conversation_history,
    model="gpt-4o",
    preserve_recent=4,
)

# Token budget tracking
budget = ctx_manager.get_token_budget("session_123", "gpt-4o")
ctx_manager.update_token_budget("session_123", tokens_used=1500)
```

### 3. Trie Memory Store

Efficient memory management with prefix deduplication.

```python
from eximia_runtime.memory.trie_store import (
    get_trie_store,
    TrieMemoryStore,
)

store = get_trie_store(
    max_size_mb=100,
    k_threshold=0.8,  # Evict at 80% capacity
)

# Store conversation
await store.store(
    key="the_cfo:session_123:msg_1",
    content="User asked about valuation...",
    agent_name="the_cfo",
)

# Retrieve by prefix
items = await store.get_by_prefix("the_cfo:session_123:")

# Iterate all items for an agent
for item in store.iter_agent("the_cfo"):
    print(item.content)

# Get stats
stats = store.get_stats()
print(f"Compression ratio: {stats.compression_ratio:.2%}")
```

### 4. Tool Manager

Sandboxed tool execution with permissions.

```python
from eximia_runtime.core.tool_manager import (
    get_tool_manager,
    ToolDefinition,
    ToolType,
    ToolPermission,
)

manager = get_tool_manager()

# Register custom tool
manager.register_tool(ToolDefinition(
    name="custom_search",
    tool_type=ToolType.API_CALL,
    description="Custom search API",
    handler=my_search_handler,
    required_permission=ToolPermission.READ_ONLY,
    sandboxed=True,
))

# Set agent permissions
manager.set_agent_permissions(
    agent_name="the_veritas",
    allowed_tools={"web_search", "web_fetch", "file_read"},
    permission_level=ToolPermission.READ_ONLY,
)

# Execute tool
result = await manager.execute(
    tool_name="web_search",
    agent_name="the_veritas",
    input_data={"query": "market research"},
)
```

### 5. Benchmark Suite

Performance testing and validation.

```python
from eximia_runtime.benchmarks import (
    BenchmarkSuite,
    BenchmarkCategory,
    run_benchmarks,
)

# Quick run all benchmarks
results = await run_benchmarks()

# Or with specific categories
results = await run_benchmarks(
    categories=[BenchmarkCategory.SCHEDULER, BenchmarkCategory.MEMORY],
)

# Manual suite control
suite = BenchmarkSuite()
await suite.run_all()
suite.print_summary()
suite.export_results("my_benchmarks.json")
```

**CLI Usage:**
```bash
# Run all benchmarks
python -m eximia_runtime.benchmarks.cli --all

# Run specific category
python -m eximia_runtime.benchmarks.cli --category scheduler

# List available benchmarks
python -m eximia_runtime.benchmarks.cli --list
```

---

## Configuration Changes

### Environment Variables

New environment variables in v2.0:

```bash
# Scheduler settings
EXIMIA_MAX_CONCURRENT_TASKS=10
EXIMIA_DEFAULT_SCHEDULER_ALGORITHM=priority

# Memory settings
EXIMIA_TRIE_MAX_SIZE_MB=100
EXIMIA_TRIE_K_THRESHOLD=0.8

# Context settings
EXIMIA_SNAPSHOT_TTL_SECONDS=3600
EXIMIA_CONTEXT_SAFETY_MARGIN=0.8

# Tool settings
EXIMIA_ENABLE_SANDBOXING=true
EXIMIA_REQUIRE_CONFIRMATION_FOR_WRITES=true
```

### Config File

Update `eximia_runtime/core/config.py`:

```python
# New settings in v2.0
class Settings:
    # Scheduler
    max_concurrent_agents: int = 10
    default_scheduler_algorithm: str = "priority"

    # Memory
    trie_max_size_mb: int = 100
    trie_k_threshold: float = 0.8

    # Context
    snapshot_ttl: int = 3600
    context_safety_margin: float = 0.8

    # Tools
    enable_sandboxing: bool = True
    require_confirmation_for_writes: bool = True
```

---

## Migration Steps

### Step 1: Update Dependencies

```bash
pip install --upgrade structlog asyncio
```

### Step 2: Update Imports

```python
# Old imports
from eximia_runtime.core.orchestrator import orchestrator

# New imports (add as needed)
from eximia_runtime.core.scheduler import get_scheduler
from eximia_runtime.core.context_manager import get_context_manager
from eximia_runtime.memory.trie_store import get_trie_store
from eximia_runtime.core.tool_manager import get_tool_manager
```

### Step 3: Enable New Features

Update your agent execution code:

```python
# In your main execution file
from eximia_runtime.core.orchestrator import create_orchestrator

# Create orchestrator with new features
orch = create_orchestrator(
    use_scheduler=True,
    use_context_manager=True,
)

# Execute with session tracking
result = await orch.route(
    request=user_query,
    session_id=session_id,
    apply_veritas_first=True,
)
```

### Step 4: Run Benchmarks

Validate your setup:

```bash
python -m eximia_runtime.benchmarks.cli --all
```

### Step 5: Monitor Performance

Check the new metrics:

```python
# Orchestrator stats
stats = orch.get_stats()
print(stats)

# Scheduler stats
scheduler_stats = get_scheduler().get_stats()
print(f"Tasks/min: {scheduler_stats.tasks_per_minute}")

# Memory stats
memory_stats = get_trie_store().get_stats()
print(f"Compression: {memory_stats.compression_ratio:.2%}")
```

---

## Backwards Compatibility

The default orchestrator singleton maintains backwards compatibility:

```python
# This still works
from eximia_runtime.core.orchestrator import orchestrator

result = await orchestrator.route(request)
```

To fully disable new features (not recommended):

```python
from eximia_runtime.core.orchestrator import create_orchestrator

# Minimal orchestrator (v1.x behavior)
orch = create_orchestrator(
    use_scheduler=False,
    use_context_manager=False,
)
```

---

## Troubleshooting

### Issue: Scheduler not processing tasks

**Solution:** Ensure the scheduler is started:
```python
scheduler = get_scheduler()
await scheduler.start()
```

### Issue: Context snapshots not persisting

**Solution:** Check storage path permissions:
```python
ctx_manager = get_context_manager()
print(ctx_manager.storage_path)  # Verify path exists and is writable
```

### Issue: Memory store evicting too aggressively

**Solution:** Adjust K-threshold or increase max size:
```python
store = get_trie_store(
    max_size_mb=200,  # Increase capacity
    k_threshold=0.9,  # Delay eviction
)
```

### Issue: Tool execution permission denied

**Solution:** Set agent permissions:
```python
manager = get_tool_manager()
manager.set_agent_permissions(
    agent_name="your_agent",
    permission_level=ToolPermission.READ_WRITE,
)
```

---

## Support

For issues or questions:
- Review benchmark results for performance insights
- Check logs with `structlog` for detailed diagnostics
- Reference the AIOS paper for architectural concepts: https://arxiv.org/pdf/2403.16971

---

*eximIA.OS v2.0 - AIOS-Enhanced Multi-Agent System*
