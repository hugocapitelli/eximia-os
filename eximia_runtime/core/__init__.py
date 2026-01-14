"""Core module - Runtime nucleus"""

try:
    from eximia_runtime.core.config import settings
    from eximia_runtime.core.registry import AgentRegistry
    from eximia_runtime.core.agent_loader import AgentLoader
    from eximia_runtime.core.agent_executor import AgentExecutor
except ImportError:
    from .config import settings
    from .registry import AgentRegistry
    from .agent_loader import AgentLoader
    from .agent_executor import AgentExecutor

__all__ = ["settings", "AgentRegistry", "AgentLoader", "AgentExecutor"]
