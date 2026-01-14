"""Orchestrator - Maestro as code for multi-agent coordination"""

from dataclasses import dataclass
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


class Orchestrator:
    """
    Central orchestrator (Maestro as code).
    
    Responsibilities:
    - Route requests to appropriate agents
    - Apply Veritas First protocol when needed
    - Coordinate multi-agent tasks
    - Synthesize responses from multiple agents
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

    def __init__(self, executor=None):
        self._executor = executor

    @property
    def executor(self):
        """Lazy load executor"""
        if self._executor is None:
            from eximia_runtime.core.agent_executor import executor
            self._executor = executor
        return self._executor

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
    ) -> OrchestratorResult:
        """
        Route a request to the appropriate agent.
        
        Args:
            request: User request
            apply_veritas_first: Whether to apply Veritas First protocol
            session_id: Optional session for context
            
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

        # Execute target agent
        try:
            result = await self.executor.execute(
                agent_name=target_agent,
                input_data=enriched_request,
                session_id=session_id,
            )

            total_time = (time.time() - start_time) * 1000

            return OrchestratorResult(
                final_response=result.content,
                agents_used=[target_agent],
                handoffs=[],
                veritas_validation=veritas_validation,
                total_tokens=result.tokens_used,
                total_time_ms=total_time,
            )

        except Exception as e:
            logger.error("orchestrator_execution_failed", error=str(e))
            raise

    async def multi_agent_task(
        self,
        task: str,
        agents: list[str],
        mode: str = "parallel",
    ) -> OrchestratorResult:
        """
        Execute a task using multiple agents.
        
        Args:
            task: Task description
            agents: List of agents to use
            mode: "parallel" or "chain"
            
        Returns:
            Synthesized result from all agents
        """
        import time
        import asyncio
        start_time = time.time()

        results = []
        handoffs = []
        total_tokens = 0

        if mode == "chain":
            # Sequential execution with handoffs
            chain_results = await handoff_protocol.chain(agents, task)
            handoffs = chain_results
            results = [r.result for r in chain_results if r.success]
            total_tokens = sum(r.tokens_used for r in chain_results)

        else:
            # Parallel execution
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
        )

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
            }
            for a in registry.list_all()
            if a.has_system_prompt
        ]


# Singleton instance
orchestrator = Orchestrator()
