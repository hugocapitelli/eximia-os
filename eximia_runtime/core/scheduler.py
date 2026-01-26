"""
Scheduler - AIOS-inspired task scheduling for multi-agent orchestration

Implements:
- FIFO (First In, First Out) - Default, simple queue
- Round Robin - Time-sliced fairness for concurrent agents
- Priority - High-priority tasks (e.g., Legal) execute first

Based on research from:
- AIOS: LLM Agent Operating System (COLM 2025)
- https://arxiv.org/pdf/2403.16971
"""

import asyncio
import time
import uuid
from collections import deque
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Callable, Coroutine

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


class SchedulerAlgorithm(Enum):
    """Available scheduling algorithms"""
    FIFO = "fifo"
    ROUND_ROBIN = "round_robin"
    PRIORITY = "priority"


class TaskStatus(Enum):
    """Task lifecycle states"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    SUSPENDED = "suspended"


class TaskPriority(Enum):
    """
    Task priority levels.
    Based on eximIA.OS routing rules:
    - CRITICAL: Legal (CLO) always first
    - HIGH: Finance (CFO)
    - NORMAL: Default for most agents
    - LOW: Background tasks
    """
    CRITICAL = 0  # Legal, compliance
    HIGH = 1      # Finance, security
    NORMAL = 2    # Default
    LOW = 3       # Background, maintenance


# Agent to priority mapping (from CLAUDE.md routing rules)
AGENT_PRIORITY_MAP = {
    "the_clo": TaskPriority.CRITICAL,
    "the_cfo": TaskPriority.HIGH,
    "the_veritas": TaskPriority.NORMAL,
    "the_cmo": TaskPriority.NORMAL,
    "the_ceo": TaskPriority.NORMAL,
    "the_maestro": TaskPriority.HIGH,
}


@dataclass
class AgentTask:
    """
    Represents a task to be executed by an agent.

    Attributes:
        task_id: Unique identifier
        agent_name: Target agent
        input_data: Query or structured input
        priority: Execution priority
        session_id: Optional session for context
        callback: Optional async callback on completion
        created_at: Timestamp when task was created
        started_at: Timestamp when execution started
        completed_at: Timestamp when execution completed
        result: Execution result (set after completion)
        error: Error message if failed
        status: Current task status
        time_slice_ms: For Round Robin - max execution time before yield
    """
    task_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    agent_name: str = ""
    input_data: str | dict[str, Any] = ""
    priority: TaskPriority = TaskPriority.NORMAL
    session_id: str | None = None
    callback: Callable[[Any], Coroutine[Any, Any, None]] | None = None
    created_at: float = field(default_factory=time.time)
    started_at: float | None = None
    completed_at: float | None = None
    result: Any = None
    error: str | None = None
    status: TaskStatus = TaskStatus.PENDING
    time_slice_ms: int = 5000  # 5 seconds default for RR
    metadata: dict[str, Any] = field(default_factory=dict)

    def __lt__(self, other: "AgentTask") -> bool:
        """For priority queue ordering"""
        return self.priority.value < other.priority.value

    @property
    def wait_time_ms(self) -> float:
        """Time spent waiting in queue"""
        if self.started_at:
            return (self.started_at - self.created_at) * 1000
        return (time.time() - self.created_at) * 1000

    @property
    def execution_time_ms(self) -> float | None:
        """Total execution time"""
        if self.completed_at and self.started_at:
            return (self.completed_at - self.started_at) * 1000
        return None


@dataclass
class SchedulerStats:
    """Scheduler performance metrics"""
    total_tasks: int = 0
    completed_tasks: int = 0
    failed_tasks: int = 0
    cancelled_tasks: int = 0
    avg_wait_time_ms: float = 0.0
    avg_execution_time_ms: float = 0.0
    current_queue_size: int = 0
    running_tasks: int = 0
    tasks_per_minute: float = 0.0


class Scheduler:
    """
    AIOS-inspired task scheduler for eximIA.OS.

    Manages concurrent agent execution with configurable scheduling algorithms.

    Features:
    - Multiple scheduling algorithms (FIFO, Round Robin, Priority)
    - Concurrent execution with configurable limits
    - Task lifecycle management
    - Performance metrics
    - Graceful shutdown

    Example:
        scheduler = Scheduler(algorithm=SchedulerAlgorithm.PRIORITY)
        await scheduler.start()

        task = AgentTask(agent_name="the_cfo", input_data="Analyze revenue")
        task_id = await scheduler.submit(task)

        result = await scheduler.wait_for(task_id)
    """

    def __init__(
        self,
        algorithm: SchedulerAlgorithm = SchedulerAlgorithm.FIFO,
        max_concurrent: int = 10,
        executor: Any = None,
    ):
        """
        Initialize scheduler.

        Args:
            algorithm: Scheduling algorithm to use
            max_concurrent: Maximum concurrent tasks
            executor: AgentExecutor instance (lazy-loaded if None)
        """
        self.algorithm = algorithm
        self.max_concurrent = max_concurrent
        self._executor = executor

        # Task storage
        self._pending_queue: deque[AgentTask] = deque()
        self._priority_queue: list[AgentTask] = []  # Heap for priority
        self._running_tasks: dict[str, asyncio.Task] = {}
        self._completed_tasks: dict[str, AgentTask] = {}
        self._task_registry: dict[str, AgentTask] = {}

        # Round Robin state
        self._rr_index: int = 0
        self._suspended_tasks: deque[AgentTask] = deque()

        # Control
        self._running = False
        self._scheduler_task: asyncio.Task | None = None
        self._lock = asyncio.Lock()

        # Metrics
        self._stats = SchedulerStats()
        self._start_time: float = 0
        self._completion_times: list[float] = []

    @property
    def executor(self):
        """Lazy load executor"""
        if self._executor is None:
            from eximia_runtime.core.agent_executor import executor
            self._executor = executor
        return self._executor

    async def start(self) -> None:
        """Start the scheduler loop"""
        if self._running:
            logger.warning("scheduler_already_running")
            return

        self._running = True
        self._start_time = time.time()
        self._scheduler_task = asyncio.create_task(self._scheduler_loop())

        logger.info(
            "scheduler_started",
            algorithm=self.algorithm.value,
            max_concurrent=self.max_concurrent,
        )

    async def stop(self, graceful: bool = True, timeout: float = 30.0) -> None:
        """
        Stop the scheduler.

        Args:
            graceful: If True, wait for running tasks to complete
            timeout: Max wait time for graceful shutdown
        """
        self._running = False

        if graceful and self._running_tasks:
            logger.info(
                "scheduler_graceful_shutdown",
                running_tasks=len(self._running_tasks),
            )
            try:
                await asyncio.wait_for(
                    asyncio.gather(*self._running_tasks.values(), return_exceptions=True),
                    timeout=timeout,
                )
            except asyncio.TimeoutError:
                logger.warning("scheduler_shutdown_timeout")
                for task in self._running_tasks.values():
                    task.cancel()
        else:
            for task in self._running_tasks.values():
                task.cancel()

        if self._scheduler_task:
            self._scheduler_task.cancel()
            try:
                await self._scheduler_task
            except asyncio.CancelledError:
                pass

        logger.info("scheduler_stopped")

    async def submit(self, task: AgentTask) -> str:
        """
        Submit a task for execution.

        Args:
            task: Task to execute

        Returns:
            task_id for tracking
        """
        # Auto-assign priority based on agent if not set
        if task.priority == TaskPriority.NORMAL and task.agent_name in AGENT_PRIORITY_MAP:
            task.priority = AGENT_PRIORITY_MAP[task.agent_name]

        async with self._lock:
            self._task_registry[task.task_id] = task
            self._stats.total_tasks += 1

            if self.algorithm == SchedulerAlgorithm.PRIORITY:
                self._insert_by_priority(task)
            else:
                self._pending_queue.append(task)

        logger.info(
            "task_submitted",
            task_id=task.task_id,
            agent=task.agent_name,
            priority=task.priority.name,
            queue_size=len(self._pending_queue) + len(self._priority_queue),
        )

        return task.task_id

    async def submit_batch(self, tasks: list[AgentTask]) -> list[str]:
        """Submit multiple tasks at once"""
        task_ids = []
        for task in tasks:
            task_id = await self.submit(task)
            task_ids.append(task_id)
        return task_ids

    async def cancel(self, task_id: str) -> bool:
        """
        Cancel a pending or running task.

        Returns:
            True if cancelled, False if not found or already completed
        """
        async with self._lock:
            task = self._task_registry.get(task_id)
            if not task:
                return False

            if task.status == TaskStatus.PENDING:
                task.status = TaskStatus.CANCELLED
                self._stats.cancelled_tasks += 1
                # Remove from queue
                if task in self._pending_queue:
                    self._pending_queue.remove(task)
                if task in self._priority_queue:
                    self._priority_queue.remove(task)
                return True

            if task.status == TaskStatus.RUNNING:
                if task_id in self._running_tasks:
                    self._running_tasks[task_id].cancel()
                    task.status = TaskStatus.CANCELLED
                    self._stats.cancelled_tasks += 1
                    return True

        return False

    async def wait_for(self, task_id: str, timeout: float | None = None) -> Any:
        """
        Wait for a task to complete and return its result.

        Args:
            task_id: Task to wait for
            timeout: Max wait time in seconds

        Returns:
            Task result

        Raises:
            asyncio.TimeoutError: If timeout exceeded
            Exception: If task failed
        """
        start = time.time()

        while True:
            task = self._task_registry.get(task_id)
            if not task:
                raise ValueError(f"Task {task_id} not found")

            if task.status == TaskStatus.COMPLETED:
                return task.result

            if task.status == TaskStatus.FAILED:
                raise Exception(task.error or "Task failed")

            if task.status == TaskStatus.CANCELLED:
                raise asyncio.CancelledError(f"Task {task_id} was cancelled")

            if timeout and (time.time() - start) > timeout:
                raise asyncio.TimeoutError(f"Task {task_id} timed out")

            await asyncio.sleep(0.1)

    def get_task(self, task_id: str) -> AgentTask | None:
        """Get task by ID"""
        return self._task_registry.get(task_id)

    def get_stats(self) -> SchedulerStats:
        """Get current scheduler statistics"""
        self._stats.current_queue_size = len(self._pending_queue) + len(self._priority_queue)
        self._stats.running_tasks = len(self._running_tasks)

        # Calculate tasks per minute
        if self._start_time:
            elapsed_minutes = (time.time() - self._start_time) / 60
            if elapsed_minutes > 0:
                self._stats.tasks_per_minute = self._stats.completed_tasks / elapsed_minutes

        # Calculate averages
        if self._completion_times:
            self._stats.avg_execution_time_ms = sum(self._completion_times) / len(self._completion_times)

        return self._stats

    def _insert_by_priority(self, task: AgentTask) -> None:
        """Insert task in priority order (lower priority value = higher priority)"""
        import heapq
        heapq.heappush(self._priority_queue, task)

    def _get_next_task(self) -> AgentTask | None:
        """Get next task based on scheduling algorithm"""
        if self.algorithm == SchedulerAlgorithm.FIFO:
            return self._pending_queue.popleft() if self._pending_queue else None

        elif self.algorithm == SchedulerAlgorithm.PRIORITY:
            import heapq
            return heapq.heappop(self._priority_queue) if self._priority_queue else None

        elif self.algorithm == SchedulerAlgorithm.ROUND_ROBIN:
            # Check suspended tasks first (they get another time slice)
            if self._suspended_tasks:
                return self._suspended_tasks.popleft()
            return self._pending_queue.popleft() if self._pending_queue else None

        return None

    async def _scheduler_loop(self) -> None:
        """Main scheduler loop - dispatches tasks to executor"""
        while self._running:
            try:
                async with self._lock:
                    # Check if we can run more tasks
                    available_slots = self.max_concurrent - len(self._running_tasks)

                    for _ in range(available_slots):
                        task = self._get_next_task()
                        if not task:
                            break

                        if task.status == TaskStatus.CANCELLED:
                            continue

                        # Start task execution
                        task.status = TaskStatus.RUNNING
                        task.started_at = time.time()

                        asyncio_task = asyncio.create_task(
                            self._execute_task(task)
                        )
                        self._running_tasks[task.task_id] = asyncio_task

                # Small sleep to prevent busy loop
                await asyncio.sleep(0.01)

            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error("scheduler_loop_error", error=str(e))
                await asyncio.sleep(0.1)

    async def _execute_task(self, task: AgentTask) -> None:
        """Execute a single task"""
        try:
            logger.debug(
                "task_executing",
                task_id=task.task_id,
                agent=task.agent_name,
            )

            # Execute via agent executor
            result = await self.executor.execute(
                agent_name=task.agent_name,
                input_data=task.input_data,
                session_id=task.session_id,
            )

            task.result = result
            task.status = TaskStatus.COMPLETED
            task.completed_at = time.time()

            # Update stats
            self._stats.completed_tasks += 1
            if task.execution_time_ms:
                self._completion_times.append(task.execution_time_ms)
                # Keep only last 100 for average
                if len(self._completion_times) > 100:
                    self._completion_times.pop(0)

            logger.info(
                "task_completed",
                task_id=task.task_id,
                agent=task.agent_name,
                execution_time_ms=task.execution_time_ms,
            )

            # Run callback if provided
            if task.callback:
                try:
                    await task.callback(result)
                except Exception as e:
                    logger.warning("task_callback_error", error=str(e))

        except asyncio.CancelledError:
            task.status = TaskStatus.CANCELLED
            logger.info("task_cancelled", task_id=task.task_id)

        except Exception as e:
            task.status = TaskStatus.FAILED
            task.error = str(e)
            task.completed_at = time.time()
            self._stats.failed_tasks += 1

            logger.error(
                "task_failed",
                task_id=task.task_id,
                agent=task.agent_name,
                error=str(e),
            )

        finally:
            # Remove from running tasks
            async with self._lock:
                self._running_tasks.pop(task.task_id, None)
                self._completed_tasks[task.task_id] = task


# Module-level singleton
_scheduler: Scheduler | None = None


def get_scheduler(
    algorithm: SchedulerAlgorithm = SchedulerAlgorithm.PRIORITY,
    max_concurrent: int = 10,
) -> Scheduler:
    """
    Get or create the global scheduler instance.

    Args:
        algorithm: Scheduling algorithm (only used on first call)
        max_concurrent: Max concurrent tasks (only used on first call)
    """
    global _scheduler
    if _scheduler is None:
        _scheduler = Scheduler(
            algorithm=algorithm,
            max_concurrent=max_concurrent,
        )
    return _scheduler


async def reset_scheduler() -> None:
    """Reset the global scheduler (for testing)"""
    global _scheduler
    if _scheduler:
        await _scheduler.stop(graceful=False)
    _scheduler = None
