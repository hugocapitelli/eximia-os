"""Handoff Protocol - Agent-to-agent communication and task delegation"""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any

import structlog


logger = structlog.get_logger()


class HandoffStatus(str, Enum):
    """Status of a handoff operation"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class HandoffRequest:
    """Request to hand off a task to another agent"""
    from_agent: str
    to_agent: str
    task: str
    context: dict[str, Any] = field(default_factory=dict)
    priority: int = 1  # 1-5, higher = more urgent
    created_at: datetime = field(default_factory=datetime.now)
    status: HandoffStatus = HandoffStatus.PENDING


@dataclass
class HandoffResult:
    """Result of a handoff operation"""
    request: HandoffRequest
    success: bool
    result: str | None = None
    error: str | None = None
    execution_time_ms: float = 0
    tokens_used: int = 0


class HandoffProtocol:
    """
    Protocol for agent-to-agent task delegation.
    
    Enables:
    - Maestro delegating to specialist agents
    - Agents requesting help from other agents
    - Chained multi-agent workflows
    """

    def __init__(self, executor=None):
        self._executor = executor
        self._pending_handoffs: list[HandoffRequest] = []
        self._history: list[HandoffResult] = []

    @property
    def executor(self):
        """Lazy load executor"""
        if self._executor is None:
            from eximia_runtime.core.agent_executor import executor
            self._executor = executor
        return self._executor

    async def handoff(
        self,
        from_agent: str,
        to_agent: str,
        task: str,
        context: dict[str, Any] | None = None,
        priority: int = 1,
    ) -> HandoffResult:
        """
        Execute a handoff from one agent to another.
        
        Args:
            from_agent: Source agent name
            to_agent: Target agent name
            task: Task description/query
            context: Additional context to pass
            priority: Urgency level (1-5)
            
        Returns:
            HandoffResult with success status and output
        """
        request = HandoffRequest(
            from_agent=from_agent,
            to_agent=to_agent,
            task=task,
            context=context or {},
            priority=priority,
        )

        logger.info(
            "handoff_initiated",
            from_agent=from_agent,
            to_agent=to_agent,
            priority=priority,
        )

        request.status = HandoffStatus.IN_PROGRESS
        start_time = datetime.now()

        try:
            # Build input with context
            input_data = self._build_handoff_input(request)

            # Execute target agent
            result = await self.executor.execute(
                agent_name=to_agent,
                input_data=input_data,
            )

            execution_time = (datetime.now() - start_time).total_seconds() * 1000

            handoff_result = HandoffResult(
                request=request,
                success=True,
                result=result.content,
                execution_time_ms=execution_time,
                tokens_used=result.tokens_used,
            )

            request.status = HandoffStatus.COMPLETED

            logger.info(
                "handoff_completed",
                from_agent=from_agent,
                to_agent=to_agent,
                tokens=result.tokens_used,
                time_ms=execution_time,
            )

        except Exception as e:
            handoff_result = HandoffResult(
                request=request,
                success=False,
                error=str(e),
            )
            request.status = HandoffStatus.FAILED

            logger.error(
                "handoff_failed",
                from_agent=from_agent,
                to_agent=to_agent,
                error=str(e),
            )

        self._history.append(handoff_result)
        return handoff_result

    def _build_handoff_input(self, request: HandoffRequest) -> dict[str, Any]:
        """Build input for the target agent"""
        input_data = {
            "task": request.task,
            "_handoff_from": request.from_agent,
            "_priority": request.priority,
        }

        if request.context:
            input_data["context"] = request.context

        return input_data

    async def chain(
        self,
        agents: list[str],
        initial_task: str,
        transform_output: bool = True,
    ) -> list[HandoffResult]:
        """
        Execute a chain of handoffs through multiple agents.
        
        Args:
            agents: List of agent names in order
            initial_task: Starting task
            transform_output: Use each output as next input
            
        Returns:
            List of handoff results
        """
        results = []
        current_task = initial_task

        for i, agent in enumerate(agents):
            from_agent = agents[i - 1] if i > 0 else "orchestrator"

            result = await self.handoff(
                from_agent=from_agent,
                to_agent=agent,
                task=current_task,
                context={"chain_position": i + 1, "chain_total": len(agents)},
            )

            results.append(result)

            if not result.success:
                logger.warning("chain_broken", at_agent=agent, position=i + 1)
                break

            if transform_output and result.result:
                current_task = f"Continue based on: {result.result[:1000]}"

        return results

    def get_history(self, limit: int = 10) -> list[HandoffResult]:
        """Get recent handoff history"""
        return self._history[-limit:]


# Singleton instance
handoff_protocol = HandoffProtocol()
