"""Agent Executor - Executes agents via LLM with validation"""

import os
import warnings
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

import litellm
import structlog

from eximia_runtime.core.config import settings
from eximia_runtime.core.registry import registry, AgentInfo
from eximia_runtime.core.agent_loader import AgentLoader, AgentConfig

# Configure LiteLLM with API keys from settings
if settings.openai_api_key:
    os.environ["OPENAI_API_KEY"] = settings.openai_api_key
if settings.gemini_api_key:
    os.environ["GEMINI_API_KEY"] = settings.gemini_api_key
if settings.anthropic_api_key:
    os.environ["ANTHROPIC_API_KEY"] = settings.anthropic_api_key

# Suppress noisy warnings
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")
warnings.filterwarnings("ignore", category=RuntimeWarning)
litellm.suppress_debug_info = True
litellm.set_verbose = False

logger = structlog.get_logger()


@dataclass
class AgentOutput:
    """Result from agent execution"""
    agent_name: str
    content: str
    model_used: str
    tokens_used: int
    execution_time_ms: float
    session_id: str | None = None
    metadata: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "agent_name": self.agent_name,
            "content": self.content,
            "model_used": self.model_used,
            "tokens_used": self.tokens_used,
            "execution_time_ms": self.execution_time_ms,
            "session_id": self.session_id,
            "metadata": self.metadata,
        }


class AgentExecutor:
    """Executes agents with input/output validation"""

    def __init__(self, model: str | None = None):
        self.model = model or settings.default_model
        self._config_cache: dict[str, AgentConfig] = {}

    async def execute(
        self,
        agent_name: str,
        input_data: dict[str, Any] | str,
        session_id: str | None = None,
        model_override: str | None = None,
    ) -> AgentOutput:
        """
        Execute an agent with the given input.

        Args:
            agent_name: Name of the agent to execute
            input_data: Query or structured input for the agent
            session_id: Optional session ID for context continuity
            model_override: Optional model to use instead of default

        Returns:
            AgentOutput with the response and metadata
        """
        start_time = datetime.now()

        # Get agent info from registry
        agent_info = registry.get(agent_name)
        if not agent_info:
            raise ValueError(f"Agent '{agent_name}' not found in registry")

        # Load agent configuration
        config = self._get_config(agent_info)

        # Build messages
        messages = self._build_messages(config, input_data, session_id)

        # Select model
        model = model_override or self.model

        # Execute via LiteLLM
        logger.info(
            "executing_agent",
            agent=agent_name,
            model=model,
            input_length=len(str(input_data)),
        )

        try:
            response = await litellm.acompletion(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=4096,
            )

            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if response.usage else 0

        except Exception as e:
            logger.error("agent_execution_failed", agent=agent_name, error=str(e))
            raise

        # Calculate execution time
        execution_time = (datetime.now() - start_time).total_seconds() * 1000

        logger.info(
            "agent_execution_complete",
            agent=agent_name,
            tokens=tokens_used,
            time_ms=execution_time,
        )

        # Calculate Cost
        from eximia_runtime.core.cost_engine import cost_engine
        
        input_tokens = len(str(input_data)) // 4 # Rough estimate if usage not available or as backup
        output_tokens = tokens_used # LiteLLM returns total, we should check prompt_tokens/completion_tokens if available
        
        # Try to get precise usage from litellm response object if possible
        # response.usage.prompt_tokens and response.usage.completion_tokens
        p_tokens = 0
        c_tokens = 0
        try:
            if hasattr(response, 'usage'):
                p_tokens = response.usage.prompt_tokens
                c_tokens = response.usage.completion_tokens
        except:
            # Fallback
            p_tokens = input_tokens
            c_tokens = tokens_used - p_tokens if tokens_used > p_tokens else 0
            
        cost_usd = cost_engine.calculate_cost(model, p_tokens, c_tokens)
        cost_engine.log_transaction(agent_name, model, p_tokens, c_tokens, cost_usd)

        output = AgentOutput(
            agent_name=agent_name,
            content=content,
            model_used=model,
            tokens_used=tokens_used,
            execution_time_ms=execution_time,
            session_id=session_id,
            metadata={
                "tier": config.tier,
                "kb_count": len(config.knowledge_base),
                "cost_usd": cost_usd,
                "usage": {
                    "input_tokens": p_tokens,
                    "output_tokens": c_tokens
                }
            },
        )

        # Auto-save output
        try:
            from eximia_runtime.utils.output_manager import output_manager
            query_str = str(input_data)[:200] if isinstance(input_data, str) else str(input_data.get("query", input_data))[:200]
            saved_path = output_manager.save(
                agent_name=agent_name,
                query=query_str,
                response=content,
                metadata={
                    "model": model,
                    "tokens": tokens_used,
                    "time_ms": execution_time,
                },
            )
            output.metadata["saved_to"] = str(saved_path)
        except Exception as e:
            logger.warning("output_save_failed", error=str(e))

        return output

    def _get_config(self, agent_info: AgentInfo) -> AgentConfig:
        """Load and cache agent configuration"""
        if agent_info.name not in self._config_cache:
            loader = AgentLoader(agent_info.path)
            self._config_cache[agent_info.name] = loader.load()
        return self._config_cache[agent_info.name]

    def _build_messages(
        self,
        config: AgentConfig,
        input_data: dict[str, Any] | str,
        session_id: str | None,
    ) -> list[dict[str, str]]:
        """Build message list for LLM API"""
        messages = [
            {"role": "system", "content": config.full_prompt}
        ]

        # Format user input
        if isinstance(input_data, str):
            user_content = input_data
        else:
            # Format structured input as markdown
            user_content = self._format_structured_input(input_data)

        messages.append({"role": "user", "content": user_content})

        return messages

    def _format_structured_input(self, data: dict[str, Any]) -> str:
        """Format structured input as readable text"""
        parts = []

        for key, value in data.items():
            formatted_key = key.replace("_", " ").title()
            if isinstance(value, list):
                value = ", ".join(str(v) for v in value)
            elif isinstance(value, dict):
                value = "\n" + "\n".join(f"  - {k}: {v}" for k, v in value.items())
            parts.append(f"**{formatted_key}:** {value}")

        return "\n\n".join(parts)

    def list_available_agents(self) -> list[dict[str, Any]]:
        """List all available agents with their info"""
        agents = registry.list_all()
        return [
            {
                "name": a.name,
                "tier": a.tier,
                "category": a.category,
                "has_prompt": a.has_system_prompt,
                "has_kb": a.has_knowledge_base,
                "path": str(a.path),
            }
            for a in agents
        ]


# Default executor instance
executor = AgentExecutor()
