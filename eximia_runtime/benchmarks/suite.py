"""
Benchmark Suite - AIOS-inspired performance benchmarking

Implements:
- Scheduler performance tests (throughput, latency, fairness)
- Context Manager tests (snapshot/restore, token tracking)
- Memory Manager tests (trie efficiency, eviction)
- End-to-end agent benchmarks

Based on research from:
- AIOS: LLM Agent Operating System (COLM 2025)
- https://arxiv.org/pdf/2403.16971
"""

import asyncio
import json
import statistics
import time
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Coroutine

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


class BenchmarkCategory(Enum):
    """Categories of benchmarks"""
    SCHEDULER = "scheduler"
    CONTEXT = "context"
    MEMORY = "memory"
    AGENT = "agent"
    E2E = "end_to_end"
    STRESS = "stress"


class BenchmarkStatus(Enum):
    """Benchmark execution status"""
    PENDING = "pending"
    RUNNING = "running"
    PASSED = "passed"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class BenchmarkMetrics:
    """Performance metrics from a benchmark run"""
    # Timing
    min_latency_ms: float = 0.0
    max_latency_ms: float = 0.0
    avg_latency_ms: float = 0.0
    p50_latency_ms: float = 0.0
    p95_latency_ms: float = 0.0
    p99_latency_ms: float = 0.0

    # Throughput
    operations_per_second: float = 0.0
    total_operations: int = 0
    successful_operations: int = 0
    failed_operations: int = 0

    # Resource usage
    memory_used_mb: float = 0.0
    peak_memory_mb: float = 0.0

    # Custom metrics
    custom: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary"""
        return {
            "latency": {
                "min_ms": self.min_latency_ms,
                "max_ms": self.max_latency_ms,
                "avg_ms": self.avg_latency_ms,
                "p50_ms": self.p50_latency_ms,
                "p95_ms": self.p95_latency_ms,
                "p99_ms": self.p99_latency_ms,
            },
            "throughput": {
                "ops_per_second": self.operations_per_second,
                "total_ops": self.total_operations,
                "successful_ops": self.successful_operations,
                "failed_ops": self.failed_operations,
            },
            "memory": {
                "used_mb": self.memory_used_mb,
                "peak_mb": self.peak_memory_mb,
            },
            "custom": self.custom,
        }


@dataclass
class BenchmarkResult:
    """Result of a single benchmark"""
    name: str
    category: BenchmarkCategory
    status: BenchmarkStatus
    metrics: BenchmarkMetrics
    duration_seconds: float
    started_at: datetime
    completed_at: datetime | None = None
    error_message: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary"""
        return {
            "name": self.name,
            "category": self.category.value,
            "status": self.status.value,
            "metrics": self.metrics.to_dict(),
            "duration_seconds": self.duration_seconds,
            "started_at": self.started_at.isoformat(),
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "error_message": self.error_message,
            "metadata": self.metadata,
        }


@dataclass
class BenchmarkConfig:
    """Configuration for a benchmark"""
    name: str
    category: BenchmarkCategory
    iterations: int = 100
    warmup_iterations: int = 10
    concurrency: int = 1
    timeout_seconds: float = 300.0
    setup_fn: Callable[[], Coroutine[Any, Any, Any]] | None = None
    teardown_fn: Callable[[], Coroutine[Any, Any, Any]] | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


class BenchmarkSuite:
    """
    Comprehensive benchmark suite for eximIA.OS.

    Features:
    - Scheduler benchmarks (FIFO, Priority, Round Robin)
    - Context Manager benchmarks (snapshot, restore, truncation)
    - Memory benchmarks (trie operations, eviction)
    - Agent execution benchmarks
    - Stress tests

    Example:
        suite = BenchmarkSuite()

        # Run all benchmarks
        results = await suite.run_all()

        # Run specific category
        results = await suite.run_category(BenchmarkCategory.SCHEDULER)

        # Export results
        suite.export_results("benchmarks_2026-01-23.json")
    """

    def __init__(
        self,
        output_dir: Path | None = None,
        verbose: bool = True,
    ):
        """
        Initialize benchmark suite.

        Args:
            output_dir: Directory for benchmark outputs
            verbose: Enable verbose logging
        """
        self.output_dir = output_dir or Path(settings.base_path) / "benchmarks"
        self.verbose = verbose

        # Results storage
        self._results: list[BenchmarkResult] = []
        self._benchmarks: dict[str, BenchmarkConfig] = {}

        # Ensure output directory
        self.output_dir.mkdir(parents=True, exist_ok=True)

        # Register built-in benchmarks
        self._register_builtin_benchmarks()

    def _register_builtin_benchmarks(self) -> None:
        """Register built-in benchmarks"""
        # Scheduler benchmarks
        self.register(BenchmarkConfig(
            name="scheduler_fifo_throughput",
            category=BenchmarkCategory.SCHEDULER,
            iterations=100,
        ))

        self.register(BenchmarkConfig(
            name="scheduler_priority_ordering",
            category=BenchmarkCategory.SCHEDULER,
            iterations=50,
        ))

        self.register(BenchmarkConfig(
            name="scheduler_concurrent_tasks",
            category=BenchmarkCategory.SCHEDULER,
            iterations=50,
            concurrency=10,
        ))

        # Context Manager benchmarks
        self.register(BenchmarkConfig(
            name="context_snapshot_create",
            category=BenchmarkCategory.CONTEXT,
            iterations=100,
        ))

        self.register(BenchmarkConfig(
            name="context_snapshot_restore",
            category=BenchmarkCategory.CONTEXT,
            iterations=100,
        ))

        self.register(BenchmarkConfig(
            name="context_truncation",
            category=BenchmarkCategory.CONTEXT,
            iterations=50,
        ))

        # Memory benchmarks
        self.register(BenchmarkConfig(
            name="trie_insert_performance",
            category=BenchmarkCategory.MEMORY,
            iterations=1000,
        ))

        self.register(BenchmarkConfig(
            name="trie_lookup_performance",
            category=BenchmarkCategory.MEMORY,
            iterations=1000,
        ))

        self.register(BenchmarkConfig(
            name="trie_eviction_lru",
            category=BenchmarkCategory.MEMORY,
            iterations=100,
        ))

        # Stress tests
        self.register(BenchmarkConfig(
            name="stress_50_concurrent",
            category=BenchmarkCategory.STRESS,
            iterations=50,
            concurrency=50,
            timeout_seconds=600.0,
        ))

        self.register(BenchmarkConfig(
            name="stress_100_concurrent",
            category=BenchmarkCategory.STRESS,
            iterations=100,
            concurrency=100,
            timeout_seconds=600.0,
        ))

    def register(self, config: BenchmarkConfig) -> None:
        """Register a benchmark"""
        self._benchmarks[config.name] = config

        if self.verbose:
            logger.debug("benchmark_registered", name=config.name)

    async def run_all(self) -> list[BenchmarkResult]:
        """Run all registered benchmarks"""
        self._results = []

        for name, config in self._benchmarks.items():
            result = await self._run_benchmark(config)
            self._results.append(result)

        return self._results

    async def run_category(self, category: BenchmarkCategory) -> list[BenchmarkResult]:
        """Run benchmarks in a specific category"""
        results = []

        for name, config in self._benchmarks.items():
            if config.category == category:
                result = await self._run_benchmark(config)
                results.append(result)
                self._results.append(result)

        return results

    async def run_benchmark(self, name: str) -> BenchmarkResult | None:
        """Run a specific benchmark by name"""
        config = self._benchmarks.get(name)
        if not config:
            logger.warning("benchmark_not_found", name=name)
            return None

        result = await self._run_benchmark(config)
        self._results.append(result)
        return result

    async def _run_benchmark(self, config: BenchmarkConfig) -> BenchmarkResult:
        """Execute a single benchmark"""
        logger.info(
            "benchmark_starting",
            name=config.name,
            category=config.category.value,
            iterations=config.iterations,
        )

        started_at = datetime.now()
        start_time = time.time()

        result = BenchmarkResult(
            name=config.name,
            category=config.category,
            status=BenchmarkStatus.RUNNING,
            metrics=BenchmarkMetrics(),
            duration_seconds=0.0,
            started_at=started_at,
        )

        try:
            # Setup
            if config.setup_fn:
                await config.setup_fn()

            # Run the appropriate benchmark
            metrics = await self._execute_benchmark(config)

            result.metrics = metrics
            result.status = BenchmarkStatus.PASSED

        except asyncio.TimeoutError:
            result.status = BenchmarkStatus.FAILED
            result.error_message = "Benchmark timed out"

        except Exception as e:
            result.status = BenchmarkStatus.FAILED
            result.error_message = str(e)
            logger.error("benchmark_error", name=config.name, error=str(e))

        finally:
            # Teardown
            if config.teardown_fn:
                try:
                    await config.teardown_fn()
                except Exception:
                    pass

            result.completed_at = datetime.now()
            result.duration_seconds = time.time() - start_time

        logger.info(
            "benchmark_completed",
            name=config.name,
            status=result.status.value,
            duration=f"{result.duration_seconds:.2f}s",
        )

        return result

    async def _execute_benchmark(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Execute the appropriate benchmark based on name"""

        # Dispatch to specific benchmark implementations
        benchmark_map = {
            "scheduler_fifo_throughput": self._bench_scheduler_fifo,
            "scheduler_priority_ordering": self._bench_scheduler_priority,
            "scheduler_concurrent_tasks": self._bench_scheduler_concurrent,
            "context_snapshot_create": self._bench_context_create,
            "context_snapshot_restore": self._bench_context_restore,
            "context_truncation": self._bench_context_truncation,
            "trie_insert_performance": self._bench_trie_insert,
            "trie_lookup_performance": self._bench_trie_lookup,
            "trie_eviction_lru": self._bench_trie_eviction,
            "stress_50_concurrent": self._bench_stress_concurrent,
            "stress_100_concurrent": self._bench_stress_concurrent,
        }

        bench_fn = benchmark_map.get(config.name)
        if bench_fn:
            return await bench_fn(config)

        # Default: simple latency test
        return await self._bench_default(config)

    # Scheduler Benchmarks

    async def _bench_scheduler_fifo(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark FIFO scheduler throughput"""
        from eximia_runtime.core.scheduler import (
            Scheduler, SchedulerAlgorithm, AgentTask, TaskPriority
        )

        scheduler = Scheduler(
            algorithm=SchedulerAlgorithm.FIFO,
            max_concurrent=10,
        )

        latencies = []
        successful = 0
        failed = 0

        # Warmup
        for _ in range(config.warmup_iterations):
            task = AgentTask(
                agent_name="benchmark_agent",
                input_data="warmup",
                priority=TaskPriority.NORMAL,
            )
            await scheduler.submit(task)

        # Clear warmup
        scheduler._pending_queue.clear()
        scheduler._task_registry.clear()

        # Benchmark
        start_total = time.time()

        for i in range(config.iterations):
            start = time.time()

            task = AgentTask(
                agent_name="benchmark_agent",
                input_data=f"benchmark_{i}",
                priority=TaskPriority.NORMAL,
            )

            try:
                await scheduler.submit(task)
                successful += 1
            except Exception:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        total_time = time.time() - start_total

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={"algorithm": "fifo"},
        )

    async def _bench_scheduler_priority(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark Priority scheduler ordering correctness"""
        from eximia_runtime.core.scheduler import (
            Scheduler, SchedulerAlgorithm, AgentTask, TaskPriority
        )

        scheduler = Scheduler(
            algorithm=SchedulerAlgorithm.PRIORITY,
            max_concurrent=1,  # Single to verify ordering
        )

        latencies = []
        successful = 0
        failed = 0
        order_correct = 0

        for i in range(config.iterations):
            start = time.time()

            # Submit tasks with different priorities
            tasks = [
                AgentTask(agent_name="low", input_data="low", priority=TaskPriority.LOW),
                AgentTask(agent_name="normal", input_data="normal", priority=TaskPriority.NORMAL),
                AgentTask(agent_name="high", input_data="high", priority=TaskPriority.HIGH),
                AgentTask(agent_name="critical", input_data="critical", priority=TaskPriority.CRITICAL),
            ]

            # Submit in reverse order
            for task in tasks:
                await scheduler.submit(task)

            # Verify ordering
            expected_order = [TaskPriority.CRITICAL, TaskPriority.HIGH, TaskPriority.NORMAL, TaskPriority.LOW]
            actual_order = [scheduler._get_next_task().priority for _ in range(4)]

            if actual_order == expected_order:
                order_correct += 1
                successful += 1
            else:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        return self._calculate_metrics(
            latencies=latencies,
            total_time=sum(latencies) / 1000,
            successful=successful,
            failed=failed,
            custom={
                "algorithm": "priority",
                "ordering_accuracy": order_correct / config.iterations,
            },
        )

    async def _bench_scheduler_concurrent(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark scheduler with concurrent task submission"""
        from eximia_runtime.core.scheduler import (
            Scheduler, SchedulerAlgorithm, AgentTask, TaskPriority
        )

        scheduler = Scheduler(
            algorithm=SchedulerAlgorithm.FIFO,
            max_concurrent=config.concurrency,
        )

        latencies = []
        successful = 0
        failed = 0

        start_total = time.time()

        async def submit_task(idx: int):
            start = time.time()
            task = AgentTask(
                agent_name=f"agent_{idx % 5}",
                input_data=f"task_{idx}",
            )
            await scheduler.submit(task)
            return (time.time() - start) * 1000

        # Submit concurrently
        for batch in range(config.iterations // config.concurrency):
            tasks = [
                submit_task(batch * config.concurrency + i)
                for i in range(config.concurrency)
            ]

            results = await asyncio.gather(*tasks, return_exceptions=True)

            for r in results:
                if isinstance(r, Exception):
                    failed += 1
                else:
                    successful += 1
                    latencies.append(r)

        total_time = time.time() - start_total

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={"concurrency": config.concurrency},
        )

    # Context Manager Benchmarks

    async def _bench_context_create(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark context snapshot creation"""
        from eximia_runtime.core.context_manager import ContextManager

        ctx_manager = ContextManager()
        latencies = []
        successful = 0
        failed = 0

        # Sample messages for snapshot
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello, how are you?"},
            {"role": "assistant", "content": "I'm doing well, thank you!"},
        ] * 10  # 30 messages

        start_total = time.time()

        for i in range(config.iterations):
            start = time.time()

            try:
                await ctx_manager.create_snapshot(
                    task_id=f"task_{i}",
                    agent_name="benchmark_agent",
                    system_prompt="Benchmark system prompt",
                    messages=messages,
                    model="gpt-4o",
                )
                successful += 1
            except Exception:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        total_time = time.time() - start_total

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={"message_count": len(messages)},
        )

    async def _bench_context_restore(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark context snapshot restoration"""
        from eximia_runtime.core.context_manager import ContextManager

        ctx_manager = ContextManager()
        latencies = []
        successful = 0
        failed = 0

        # Create snapshots first
        snapshot_ids = []
        for i in range(config.iterations):
            snapshot = await ctx_manager.create_snapshot(
                task_id=f"restore_task_{i}",
                agent_name="benchmark_agent",
                messages=[{"role": "user", "content": f"Message {i}"}],
            )
            snapshot_ids.append(snapshot.snapshot_id)

        start_total = time.time()

        for snapshot_id in snapshot_ids:
            start = time.time()

            try:
                await ctx_manager.restore_snapshot(snapshot_id)
                successful += 1
            except Exception:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        total_time = time.time() - start_total

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
        )

    async def _bench_context_truncation(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark context truncation algorithm"""
        from eximia_runtime.core.context_manager import ContextManager

        ctx_manager = ContextManager()
        latencies = []
        successful = 0
        failed = 0

        # Large message history
        messages = [
            {"role": "system", "content": "System prompt" * 100},
        ] + [
            {"role": "user" if i % 2 == 0 else "assistant", "content": f"Message {i} " * 50}
            for i in range(100)
        ]

        start_total = time.time()

        for i in range(config.iterations):
            start = time.time()

            try:
                truncated = await ctx_manager.truncate_context(
                    messages=messages.copy(),
                    model="gpt-4o",
                    max_tokens=8000,
                )
                successful += 1
            except Exception:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        total_time = time.time() - start_total

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={"original_messages": len(messages)},
        )

    # Memory Benchmarks

    async def _bench_trie_insert(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark trie memory store insertion"""
        from eximia_runtime.memory.trie_store import TrieMemoryStore

        store = TrieMemoryStore(max_size_mb=100)
        latencies = []
        successful = 0
        failed = 0

        start_total = time.time()

        for i in range(config.iterations):
            start = time.time()

            try:
                await store.store(
                    key=f"agent:session_{i % 10}:message_{i}",
                    content=f"This is test content {i} " * 20,
                    agent_name=f"agent_{i % 5}",
                )
                successful += 1
            except Exception:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        total_time = time.time() - start_total
        stats = store.get_stats()

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={
                "total_items": stats.total_items,
                "total_nodes": stats.total_nodes,
                "compression_ratio": stats.compression_ratio,
            },
        )

    async def _bench_trie_lookup(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark trie memory store lookup"""
        from eximia_runtime.memory.trie_store import TrieMemoryStore

        store = TrieMemoryStore(max_size_mb=100)
        latencies = []
        successful = 0
        failed = 0

        # Pre-populate store
        keys = []
        for i in range(config.iterations):
            key = f"agent:session_{i % 10}:message_{i}"
            await store.store(key, f"Content {i}", f"agent_{i % 5}")
            keys.append(key)

        start_total = time.time()

        for key in keys:
            start = time.time()

            try:
                item = await store.get(key)
                if item:
                    successful += 1
                else:
                    failed += 1
            except Exception:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        total_time = time.time() - start_total
        stats = store.get_stats()

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={
                "hit_count": stats.hit_count,
                "miss_count": stats.miss_count,
            },
        )

    async def _bench_trie_eviction(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Benchmark trie memory store eviction"""
        from eximia_runtime.memory.trie_store import TrieMemoryStore

        # Small store to trigger evictions
        store = TrieMemoryStore(max_size_mb=1, k_threshold=0.8)
        latencies = []
        successful = 0
        failed = 0

        start_total = time.time()

        for i in range(config.iterations):
            start = time.time()

            try:
                # Insert large content to trigger eviction
                await store.store(
                    key=f"evict:session:message_{i}",
                    content="X" * 10000,  # ~10KB per item
                    agent_name="evict_agent",
                )
                successful += 1
            except Exception:
                failed += 1

            latencies.append((time.time() - start) * 1000)

        total_time = time.time() - start_total
        stats = store.get_stats()

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={
                "eviction_count": stats.eviction_count,
                "final_items": stats.total_items,
            },
        )

    # Stress Tests

    async def _bench_stress_concurrent(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Stress test with high concurrency"""
        from eximia_runtime.core.scheduler import Scheduler, SchedulerAlgorithm, AgentTask
        from eximia_runtime.memory.trie_store import TrieMemoryStore

        scheduler = Scheduler(
            algorithm=SchedulerAlgorithm.PRIORITY,
            max_concurrent=config.concurrency,
        )
        store = TrieMemoryStore(max_size_mb=50)

        latencies = []
        successful = 0
        failed = 0

        async def stress_operation(idx: int):
            """Combined scheduler + memory operation"""
            start = time.time()

            # Submit task
            task = AgentTask(
                agent_name=f"stress_agent_{idx % 10}",
                input_data=f"stress_data_{idx}",
            )
            await scheduler.submit(task)

            # Store in memory
            await store.store(
                key=f"stress:session_{idx % 20}:item_{idx}",
                content=f"Stress content {idx} " * 10,
                agent_name=task.agent_name,
            )

            return (time.time() - start) * 1000

        start_total = time.time()

        # Run in batches
        batch_size = config.concurrency
        for batch in range(config.iterations // batch_size):
            tasks = [
                stress_operation(batch * batch_size + i)
                for i in range(batch_size)
            ]

            results = await asyncio.gather(*tasks, return_exceptions=True)

            for r in results:
                if isinstance(r, Exception):
                    failed += 1
                else:
                    successful += 1
                    latencies.append(r)

        total_time = time.time() - start_total

        return self._calculate_metrics(
            latencies=latencies,
            total_time=total_time,
            successful=successful,
            failed=failed,
            custom={
                "concurrency": config.concurrency,
                "scheduler_stats": scheduler.get_stats().__dict__,
                "memory_stats": store.get_stats().__dict__,
            },
        )

    async def _bench_default(self, config: BenchmarkConfig) -> BenchmarkMetrics:
        """Default benchmark for unregistered tests"""
        latencies = []

        for i in range(config.iterations):
            start = time.time()
            await asyncio.sleep(0.001)  # Minimal work
            latencies.append((time.time() - start) * 1000)

        return self._calculate_metrics(
            latencies=latencies,
            total_time=sum(latencies) / 1000,
            successful=config.iterations,
            failed=0,
        )

    def _calculate_metrics(
        self,
        latencies: list[float],
        total_time: float,
        successful: int,
        failed: int,
        custom: dict[str, Any] | None = None,
    ) -> BenchmarkMetrics:
        """Calculate benchmark metrics from raw data"""
        if not latencies:
            return BenchmarkMetrics()

        sorted_latencies = sorted(latencies)

        def percentile(p: float) -> float:
            idx = int(len(sorted_latencies) * p / 100)
            return sorted_latencies[min(idx, len(sorted_latencies) - 1)]

        return BenchmarkMetrics(
            min_latency_ms=min(latencies),
            max_latency_ms=max(latencies),
            avg_latency_ms=statistics.mean(latencies),
            p50_latency_ms=percentile(50),
            p95_latency_ms=percentile(95),
            p99_latency_ms=percentile(99),
            operations_per_second=len(latencies) / total_time if total_time > 0 else 0,
            total_operations=successful + failed,
            successful_operations=successful,
            failed_operations=failed,
            custom=custom or {},
        )

    def get_results(self) -> list[BenchmarkResult]:
        """Get all benchmark results"""
        return self._results

    def get_summary(self) -> dict[str, Any]:
        """Get summary of all benchmark results"""
        if not self._results:
            return {"status": "no_results"}

        passed = sum(1 for r in self._results if r.status == BenchmarkStatus.PASSED)
        failed = sum(1 for r in self._results if r.status == BenchmarkStatus.FAILED)
        skipped = sum(1 for r in self._results if r.status == BenchmarkStatus.SKIPPED)

        return {
            "total_benchmarks": len(self._results),
            "passed": passed,
            "failed": failed,
            "skipped": skipped,
            "pass_rate": passed / len(self._results) if self._results else 0,
            "total_duration_seconds": sum(r.duration_seconds for r in self._results),
            "by_category": {
                category.value: {
                    "count": sum(1 for r in self._results if r.category == category),
                    "passed": sum(1 for r in self._results if r.category == category and r.status == BenchmarkStatus.PASSED),
                }
                for category in BenchmarkCategory
            },
        }

    def export_results(self, filename: str | None = None) -> Path:
        """Export results to JSON file"""
        filename = filename or f"benchmark_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        output_path = self.output_dir / filename

        data = {
            "summary": self.get_summary(),
            "results": [r.to_dict() for r in self._results],
            "generated_at": datetime.now().isoformat(),
        }

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        logger.info("benchmark_results_exported", path=str(output_path))
        return output_path

    def print_summary(self) -> None:
        """Print summary to console"""
        summary = self.get_summary()

        print("\n" + "=" * 60)
        print("BENCHMARK SUITE RESULTS")
        print("=" * 60)
        print(f"Total: {summary.get('total_benchmarks', 0)} benchmarks")
        print(f"Passed: {summary.get('passed', 0)}")
        print(f"Failed: {summary.get('failed', 0)}")
        print(f"Pass Rate: {summary.get('pass_rate', 0):.1%}")
        print(f"Duration: {summary.get('total_duration_seconds', 0):.2f}s")
        print("-" * 60)

        for result in self._results:
            status_icon = "✓" if result.status == BenchmarkStatus.PASSED else "✗"
            print(f"{status_icon} {result.name}: {result.metrics.avg_latency_ms:.2f}ms avg")

        print("=" * 60 + "\n")


# Convenience function
async def run_benchmarks(
    categories: list[BenchmarkCategory] | None = None,
    export: bool = True,
) -> list[BenchmarkResult]:
    """
    Run benchmarks with optional category filter.

    Args:
        categories: Categories to run (None = all)
        export: Export results to file

    Returns:
        List of benchmark results
    """
    suite = BenchmarkSuite()

    if categories:
        results = []
        for category in categories:
            results.extend(await suite.run_category(category))
    else:
        results = await suite.run_all()

    if export:
        suite.export_results()

    suite.print_summary()
    return results
