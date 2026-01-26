"""
Orchestrator - Maestro as code for multi-agent coordination

Enhanced with AIOS-inspired features:
- Scheduler integration for task queuing and prioritization
- Context Manager for snapshot/restore and token budgets
- Improved multi-agent coordination
"""

from dataclasses import dataclass, field
from typing import Any

import structlog

from eximia_runtime.core.config import settings
from eximia_runtime.core.registry import registry
from eximia_runtime.protocols.veritas_first import veritas_protocol, VeritasValidation
from eximia_runtime.protocols.handoff import handoff_protocol, HandoffResult


logger = structlog.get_logger()


@dataclass
class OrchestratorResult:
    """Result from orchestrated execution"""
    final_response: str
    agents_used: list[str]
    handoffs: list[HandoffResult]
    veritas_validation: VeritasValidation | None
    total_tokens: int
    total_time_ms: float
    task_id: str | None = None
    metadata: dict[str, Any] = field(default_factory=dict)


class Orchestrator:
    """
    Central orchestrator (Maestro as code).

    Responsibilities:
    - Route requests to appropriate agents
    - Apply Veritas First protocol when needed
    - Coordinate multi-agent tasks
    - Synthesize responses from multiple agents
    - Manage task scheduling (via Scheduler)
    - Handle context preservation (via ContextManager)

    Enhanced Features (AIOS-inspired):
    - Priority-based task scheduling
    - Context snapshots for long-running tasks
    - Token budget tracking
    - Concurrent execution limits
    """

    # Agent routing rules
    ROUTING_RULES = {
        # Keywords -> Agent mapping
        "financial": "the_cfo",
        "valuation": "the_cfo",
        "budget": "the_cfo",
        "revenue": "the_cfo",
        "dcf": "the_cfo",
        "investment": "the_cfo",

        "legal": "the_clo",
        "compliance": "the_clo",
        "regulation": "the_clo",
        "contract": "the_clo",
        "liability": "the_clo",

        "marketing": "the_cmo",
        "brand": "the_cmo",
        "campaign": "the_cmo",
        "positioning": "the_cmo",

        "research": "the_veritas",
        "validate": "the_veritas",
        "fact": "the_veritas",
        "source": "the_veritas",

        "strategy": "the_ceo",
        "vision": "the_ceo",
        "decision": "the_ceo",

        "clone": "c3_creator",
        "personality": "c3_creator",
    }

    # Agent priority levels (from CLAUDE.md)
    AGENT_PRIORITIES = {
        "the_clo": 0,   # Legal always first
        "the_cfo": 1,   # Finance second
        "the_maestro": 1,
        "the_veritas": 2,
        "the_cmo": 2,
        "the_ceo": 2,
    }

    def __init__(
        self,
        executor=None,
        use_scheduler: bool = False,
        use_context_manager: bool = True,
    ):
        """
        Initialize orchestrator.

        Args:
            executor: AgentExecutor instance (lazy-loaded if None)
            use_scheduler: Enable scheduler for task queuing
            use_context_manager: Enable context management
        """
        self._executor = executor
        self._scheduler = None
        self._context_manager = None
        self._use_scheduler = use_scheduler
        self._use_context_manager = use_context_manager

    @property
    def executor(self):
        """Lazy load executor"""
        if self._executor is None:
            from eximia_runtime.core.agent_executor import executor
            self._executor = executor
        return self._executor

    @property
    def scheduler(self):
        """Lazy load scheduler"""
        if self._scheduler is None and self._use_scheduler:
            from eximia_runtime.core.scheduler import get_scheduler, SchedulerAlgorithm
            self._scheduler = get_scheduler(
                algorithm=SchedulerAlgorithm.PRIORITY,
                max_concurrent=settings.max_concurrent_agents if hasattr(settings, 'max_concurrent_agents') else 10,
            )
        return self._scheduler

    @property
    def context_manager(self):
        """Lazy load context manager"""
        if self._context_manager is None and self._use_context_manager:
            from eximia_runtime.core.context_manager import get_context_manager
            self._context_manager = get_context_manager()
        return self._context_manager

    def detect_intent(self, request: str) -> tuple[str, float]:
        """
        Detect which agent should handle the request.

        Returns:
            Tuple of (agent_name, confidence_score)
        """
        request_lower = request.lower()

        # Count keyword matches for each agent
        agent_scores: dict[str, int] = {}

        for keyword, agent in self.ROUTING_RULES.items():
            if keyword in request_lower:
                agent_scores[agent] = agent_scores.get(agent, 0) + 1

        if not agent_scores:
            # Default to Veritas for research/general queries
            return "the_veritas", 0.5

        # Get agent with highest score
        best_agent = max(agent_scores, key=agent_scores.get)
        confidence = min(agent_scores[best_agent] / 3, 1.0)

        return best_agent, confidence

    async def route(
        self,
        request: str,
        apply_veritas_first: bool = True,
        session_id: str | None = None,
        use_scheduler: bool | None = None,
    ) -> OrchestratorResult:
        """
        Route a request to the appropriate agent.

        Args:
            request: User request
            apply_veritas_first: Whether to apply Veritas First protocol
            session_id: Optional session for context
            use_scheduler: Override scheduler usage

        Returns:
            OrchestratorResult with response and metadata
        """
        import time
        start_time = time.time()

        # Detect target agent
        target_agent, confidence = self.detect_intent(request)

        logger.info(
            "orchestrator_routing",
            target=target_agent,
            confidence=confidence,
        )

        # Apply Veritas First if needed
        veritas_validation = None
        enriched_request = request

        if apply_veritas_first and veritas_protocol.requires_validation(target_agent, request):
            enriched_request, veritas_validation = await veritas_protocol.validate_and_enrich(
                target_agent,
                request,
            )

        # Check context window if context manager enabled
        if self.context_manager and session_id:
            budget = self.context_manager.get_token_budget(
                session_id,
                settings.default_model
            )

            request_tokens = self.context_manager.estimate_tokens(enriched_request)
            is_safe, available = self.context_manager.check_context_window(
                settings.default_model,
                budget.used_tokens,
                request_tokens,
            )

            if not is_safe:
                logger.warning(
                    "context_overflow_detected",
                    session_id=session_id,
                    action="truncating_or_warning",
                )

        # Determine execution path
        should_use_scheduler = use_scheduler if use_scheduler is not None else self._use_scheduler
        task_id = None

        if should_use_scheduler and self.scheduler:
            # Execute via scheduler
            result = await self._execute_via_scheduler(
                target_agent,
                enriched_request,
                session_id,
            )
            task_id = result.get("task_id")
            agent_result = result.get("result")
        else:
            # Direct execution
            agent_result = await self.executor.execute(
                agent_name=target_agent,
                input_data=enriched_request,
                session_id=session_id,
            )

        total_time = (time.time() - start_time) * 1000

        # Update token budget if context manager enabled
        if self.context_manager and session_id:
            self.context_manager.update_token_budget(
                session_id,
                agent_result.tokens_used,
            )

        return OrchestratorResult(
            final_response=agent_result.content,
            agents_used=[target_agent],
            handoffs=[],
            veritas_validation=veritas_validation,
            total_tokens=agent_result.tokens_used,
            total_time_ms=total_time,
            task_id=task_id,
            metadata={
                "confidence": confidence,
                "model": agent_result.model_used,
                "scheduled": should_use_scheduler,
            },
        )

    async def _execute_via_scheduler(
        self,
        agent_name: str,
        input_data: str,
        session_id: str | None,
    ) -> dict[str, Any]:
        """Execute task through scheduler"""
        from eximia_runtime.core.scheduler import AgentTask, TaskPriority

        # Determine priority
        priority_value = self.AGENT_PRIORITIES.get(agent_name, 2)
        priority = TaskPriority(priority_value)

        # Create task
        task = AgentTask(
            agent_name=agent_name,
            input_data=input_data,
            priority=priority,
            session_id=session_id,
        )

        # Ensure scheduler is running
        if not self.scheduler._running:
            await self.scheduler.start()

        # Submit and wait
        task_id = await self.scheduler.submit(task)
        result = await self.scheduler.wait_for(task_id, timeout=300)  # 5 min timeout

        return {
            "task_id": task_id,
            "result": result,
        }

    async def route_with_snapshot(
        self,
        request: str,
        session_id: str,
        apply_veritas_first: bool = True,
    ) -> OrchestratorResult:
        """
        Route request with automatic context snapshot.

        Creates a snapshot before execution for potential resumption.
        """
        # Create pre-execution snapshot
        if self.context_manager:
            target_agent, _ = self.detect_intent(request)
            await self.context_manager.create_snapshot(
                task_id=f"route-{session_id}",
                agent_name=target_agent,
                system_prompt="",  # Will be filled by executor
                messages=[{"role": "user", "content": request}],
                model=settings.default_model,
            )

        # Execute normally
        result = await self.route(
            request=request,
            apply_veritas_first=apply_veritas_first,
            session_id=session_id,
        )

        return result

    async def multi_agent_task(
        self,
        task: str,
        agents: list[str],
        mode: str = "parallel",
        use_scheduler: bool | None = None,
    ) -> OrchestratorResult:
        """
        Execute a task using multiple agents.

        Args:
            task: Task description
            agents: List of agents to use
            mode: "parallel", "chain", or "scheduled"
            use_scheduler: Override scheduler usage

        Returns:
            Synthesized result from all agents
        """
        import time
        import asyncio
        start_time = time.time()

        results = []
        handoffs = []
        total_tokens = 0
        task_ids = []

        should_use_scheduler = use_scheduler if use_scheduler is not None else self._use_scheduler

        if mode == "chain":
            # Sequential execution with handoffs
            chain_results = await handoff_protocol.chain(agents, task)
            handoffs = chain_results
            results = [r.result for r in chain_results if r.success]
            total_tokens = sum(r.tokens_used for r in chain_results)

        elif mode == "scheduled" or (should_use_scheduler and self.scheduler):
            # Scheduled parallel execution with priority
            results, task_ids, total_tokens = await self._execute_multi_scheduled(
                task, agents
            )

        else:
            # Simple parallel execution
            async def execute_agent(agent: str):
                return await self.executor.execute(agent, task)

            agent_results = await asyncio.gather(
                *[execute_agent(a) for a in agents],
                return_exceptions=True,
            )

            for i, result in enumerate(agent_results):
                if isinstance(result, Exception):
                    logger.error("parallel_agent_failed", agent=agents[i], error=str(result))
                else:
                    results.append(result.content)
                    total_tokens += result.tokens_used

        # Synthesize results
        synthesized = self._synthesize_results(results, agents)

        total_time = (time.time() - start_time) * 1000

        return OrchestratorResult(
            final_response=synthesized,
            agents_used=agents,
            handoffs=handoffs,
            veritas_validation=None,
            total_tokens=total_tokens,
            total_time_ms=total_time,
            metadata={
                "mode": mode,
                "task_ids": task_ids,
            },
        )

    async def _execute_multi_scheduled(
        self,
        task: str,
        agents: list[str],
    ) -> tuple[list[str], list[str], int]:
        """Execute multiple agents via scheduler"""
        from eximia_runtime.core.scheduler import AgentTask, TaskPriority
        import asyncio

        # Ensure scheduler is running
        if not self.scheduler._running:
            await self.scheduler.start()

        # Create tasks with priorities
        tasks = []
        for agent in agents:
            priority_value = self.AGENT_PRIORITIES.get(agent, 2)
            task_obj = AgentTask(
                agent_name=agent,
                input_data=task,
                priority=TaskPriority(priority_value),
            )
            tasks.append(task_obj)

        # Submit all tasks
        task_ids = await self.scheduler.submit_batch(tasks)

        # Wait for all to complete
        results = []
        total_tokens = 0

        for task_id in task_ids:
            try:
                result = await self.scheduler.wait_for(task_id, timeout=300)
                results.append(result.content)
                total_tokens += result.tokens_used
            except Exception as e:
                logger.error("scheduled_task_failed", task_id=task_id, error=str(e))
                results.append("")

        return results, task_ids, total_tokens

    def _synthesize_results(
        self,
        results: list[str],
        agents: list[str],
    ) -> str:
        """Combine results from multiple agents"""
        if not results:
            return "No results from agents."

        if len(results) == 1:
            return results[0]

        # Simple synthesis - combine with headers
        parts = ["# Multi-Agent Analysis\n"]

        for i, (agent, result) in enumerate(zip(agents, results)):
            if result:
                agent_name = agent.replace("the_", "").upper()
                parts.append(f"\n## {agent_name} Perspective\n\n{result[:2000]}\n")

        return "\n".join(parts)

    def get_available_agents(self) -> list[dict[str, Any]]:
        """List agents available for orchestration"""
        registry.discover_agents()
        return [
            {
                "name": a.name,
                "tier": a.tier,
                "category": a.category,
                "available": a.has_system_prompt,
                "priority": self.AGENT_PRIORITIES.get(a.name, 2),
            }
            for a in registry.list_all()
            if a.has_system_prompt
        ]

    def get_stats(self) -> dict[str, Any]:
        """Get orchestrator statistics"""
        stats = {
            "scheduler_enabled": self._use_scheduler,
            "context_manager_enabled": self._use_context_manager,
        }

        if self._scheduler:
            scheduler_stats = self._scheduler.get_stats()
            stats["scheduler"] = {
                "algorithm": self._scheduler.algorithm.value,
                "total_tasks": scheduler_stats.total_tasks,
                "completed_tasks": scheduler_stats.completed_tasks,
                "failed_tasks": scheduler_stats.failed_tasks,
                "queue_size": scheduler_stats.current_queue_size,
                "running_tasks": scheduler_stats.running_tasks,
            }

        if self._context_manager:
            stats["context_manager"] = self._context_manager.get_stats()

        return stats

    async def shutdown(self) -> None:
        """Graceful shutdown of orchestrator resources"""
        if self._scheduler:
            await self._scheduler.stop(graceful=True)
            logger.info("orchestrator_scheduler_stopped")

        if self._context_manager:
            await self._context_manager.cleanup_expired()
            logger.info("orchestrator_context_manager_cleaned")


# Singleton instance
orchestrator = Orchestrator()


# Factory for custom orchestrator instances
def create_orchestrator(
    use_scheduler: bool = False,
    use_context_manager: bool = True,
) -> Orchestrator:
    """
    Create a new orchestrator instance with custom settings.

    Args:
        use_scheduler: Enable scheduler for task queuing
        use_context_manager: Enable context management
    """
    return Orchestrator(
        use_scheduler=use_scheduler,
        use_context_manager=use_context_manager,
    )
