"""Base Agent class for custom agent implementations"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

from eximia_runtime.core.agent_executor import executor, AgentOutput


@dataclass
class BaseAgent(ABC):
    """
    Abstract base class for programmatic agent definitions.
    
    Use this when you need custom logic beyond what the markdown-based
    agents provide.
    """
    name: str
    tier: int = 1
    category: str = "general"
    capabilities: list[str] = field(default_factory=list)

    @property
    @abstractmethod
    def system_prompt(self) -> str:
        """Return the agent's system prompt"""
        pass

    @property
    def knowledge_base(self) -> list[str]:
        """Return knowledge base context (optional)"""
        return []

    async def execute(
        self, 
        query: str | dict[str, Any],
        model: str | None = None,
        session_id: str | None = None,
    ) -> AgentOutput:
        """Execute this agent with the given query"""
        # Use the executor with custom prompt
        return await executor.execute(
            agent_name=self.name,
            input_data=query,
            session_id=session_id,
            model_override=model,
        )

    def pre_process(self, input_data: dict[str, Any]) -> dict[str, Any]:
        """Hook to pre-process input before execution"""
        return input_data

    def post_process(self, output: AgentOutput) -> AgentOutput:
        """Hook to post-process output after execution"""
        return output


class SimpleAgent(BaseAgent):
    """
    Simple agent implementation with just a system prompt.
    
    Example:
        agent = SimpleAgent(
            name="my_agent",
            prompt="You are a helpful assistant...",
        )
        result = await agent.execute("Hello!")
    """

    def __init__(
        self,
        name: str,
        prompt: str,
        tier: int = 1,
        category: str = "general",
    ):
        super().__init__(name=name, tier=tier, category=category)
        self._prompt = prompt

    @property
    def system_prompt(self) -> str:
        return self._prompt
