"""Agent Registry - Dynamic agent discovery and management"""

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml

from eximia_runtime.core.config import settings


@dataclass
class AgentInfo:
    """Metadata about a registered agent"""
    name: str
    path: Path
    tier: int = 1  # 1=Tactical, 2=Executive, 3=Expert
    version: str = "1.0.0"
    capabilities: list[str] = field(default_factory=list)
    dependencies: list[str] = field(default_factory=list)
    category: str = "general"  # executive, research, clone, factory, etc.

    @property
    def has_system_prompt(self) -> bool:
        """Check if agent has a system prompt file"""
        return (
            (self.path / "agente_core.md").exists() or
            (self.path / "03_prompt" / "prompt_operacional.md").exists() or
            (self.path / "prompt.md").exists()
        )

    @property
    def has_knowledge_base(self) -> bool:
        """Check if agent has knowledge bases"""
        kb_dir = self.path / "knowledge_base"
        if not kb_dir.exists():
            kb_dir = self.path / "02_profile" / "knowledge_base"
        return kb_dir.exists() and any(kb_dir.glob("*.md"))

    @property
    def has_schemas(self) -> bool:
        """Check if agent has input/output schemas"""
        return (
            (self.path / "input_schema.json").exists() or
            (self.path / "03_prompt" / "input_schema.json").exists()
        )


class AgentRegistry:
    """Registry for discovering and managing agents"""

    def __init__(self):
        self._agents: dict[str, AgentInfo] = {}
        self._loaded = False

    def discover_agents(self, force: bool = False) -> None:
        """Scan directories for agent definitions"""
        if self._loaded and not force:
            return

        self._agents.clear()

        # Scan main agent directories (The_*)
        for agent_dir in settings.agents_dirs:
            if not agent_dir.exists():
                continue

            # Check if it's a direct agent folder (has agente_core.md or 03_prompt/)
            if self._is_agent_dir(agent_dir):
                self._register_agent(agent_dir)
            else:
                # Scan subdirectories
                for subdir in agent_dir.iterdir():
                    if subdir.is_dir() and self._is_agent_dir(subdir):
                        self._register_agent(subdir)

        self._loaded = True

    def _is_agent_dir(self, path: Path) -> bool:
        """Check if path contains an agent definition"""
        return (
            (path / "agente_core.md").exists() or
            (path / "03_prompt" / "prompt_operacional.md").exists() or
            (path / "README.md").exists() and (path / "knowledge_base").exists()
        )

    def _register_agent(self, agent_path: Path) -> None:
        """Register an agent from its directory"""
        name = self._normalize_name(agent_path.name)

        # Try to load metadata from registry.yaml if exists
        tier = 1
        capabilities = []
        category = "general"

        registry_file = agent_path / "registry.yaml"
        if registry_file.exists():
            with open(registry_file) as f:
                meta = yaml.safe_load(f) or {}
                tier = meta.get("tier", 1)
                capabilities = meta.get("capabilities", [])
                category = meta.get("category", "general")
        else:
            # Infer from path
            if "The_" in agent_path.name:
                tier = 3  # Expert level for main agents
                category = "executive"
            elif "Clone_Factory" in str(agent_path):
                tier = 2
                category = "factory"
            elif "Clones" in str(agent_path):
                tier = 2
                category = "clone"

        agent = AgentInfo(
            name=name,
            path=agent_path,
            tier=tier,
            capabilities=capabilities,
            category=category,
        )

        self._agents[name] = agent

    def _normalize_name(self, name: str) -> str:
        """Normalize agent name to lowercase with underscores"""
        return name.lower().replace("-", "_").replace(" ", "_")

    def get(self, name: str) -> AgentInfo | None:
        """Get agent by name"""
        self.discover_agents()
        normalized = self._normalize_name(name)
        return self._agents.get(normalized)

    def list_all(self) -> list[AgentInfo]:
        """List all registered agents"""
        self.discover_agents()
        return list(self._agents.values())

    def list_by_category(self, category: str) -> list[AgentInfo]:
        """List agents by category"""
        self.discover_agents()
        return [a for a in self._agents.values() if a.category == category]

    def list_by_tier(self, tier: int) -> list[AgentInfo]:
        """List agents by tier"""
        self.discover_agents()
        return [a for a in self._agents.values() if a.tier == tier]


# Singleton instance
registry = AgentRegistry()
