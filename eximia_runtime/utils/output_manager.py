"""Output manager for automatic saving of agent responses"""

import json
from datetime import datetime
from pathlib import Path
from typing import Any

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


class OutputManager:
    """
    Manages automatic saving of agent outputs.
    
    Saves responses to organized directories:
    - outputs/{agent_name}/{date}_{query_snippet}.md
    """

    def __init__(self, base_dir: Path | None = None):
        self.base_dir = base_dir or (settings.project_root / "eximia_runtime" / "outputs")
        self.base_dir.mkdir(parents=True, exist_ok=True)

    def save(
        self,
        agent_name: str,
        query: str,
        response: str,
        metadata: dict[str, Any] | None = None,
    ) -> Path:
        """
        Save an agent response to file.
        
        Args:
            agent_name: Name of the agent
            query: Original query
            response: Agent response
            metadata: Optional metadata (tokens, time, etc.)
            
        Returns:
            Path to saved file
        """
        # Create agent directory
        agent_dir = self.base_dir / agent_name.lower().replace(" ", "_")
        agent_dir.mkdir(parents=True, exist_ok=True)

        # Generate filename
        timestamp = datetime.now().strftime("%Y-%m-%d_%H%M%S")
        query_slug = self._slugify(query[:50])
        filename = f"{timestamp}_{query_slug}.md"

        filepath = agent_dir / filename

        # Build content
        content = self._format_output(agent_name, query, response, metadata)

        # Save
        filepath.write_text(content, encoding="utf-8")

        logger.info("output_saved", path=str(filepath))
        
        # Auto-integrate with Codex - capture ALL agent outputs
        try:
            from eximia_runtime.utils.codex_integration import CodexIntegration
            CodexIntegration.capture(
                content=response,
                agent_name=agent_name,
                query=query,
                metadata=metadata,
                filepath=filepath
            )
        except Exception as e:
            logger.warning("codex_integration_failed", error=str(e))
            
        return filepath

    def _slugify(self, text: str) -> str:
        """Convert text to filename-safe slug"""
        # Remove special characters, keep alphanumeric and spaces
        slug = "".join(c if c.isalnum() or c == " " else "" for c in text)
        # Convert spaces to underscores
        slug = slug.strip().replace(" ", "_").lower()
        # Limit length
        return slug[:40] if slug else "query"

    def _format_output(
        self,
        agent_name: str,
        query: str,
        response: str,
        metadata: dict | None,
    ) -> str:
        """Format output as markdown"""
        timestamp = datetime.now().isoformat()

        parts = [
            f"# {agent_name} Response",
            f"\n**Timestamp:** {timestamp}",
            f"\n**Query:** {query}",
            "\n---\n",
            response,
        ]

        if metadata:
            parts.append("\n\n---\n")
            parts.append("\n## Metadata\n")
            parts.append(f"- **Model:** {metadata.get('model', 'N/A')}")
            parts.append(f"- **Tokens:** {metadata.get('tokens', 'N/A')}")
            parts.append(f"- **Time:** {metadata.get('time_ms', 'N/A')}ms")
            parts.append(f"- **Cost:** ${metadata.get('cost_usd', 0.0):.6f}")
            if metadata.get("usage"):
                parts.append(f"- **Usage:** {metadata['usage']}")

        return "\n".join(parts)

    def list_outputs(self, agent_name: str | None = None, limit: int = 20) -> list[dict]:
        """List recent outputs"""
        outputs = []

        if agent_name:
            search_dirs = [self.base_dir / agent_name.lower()]
        else:
            search_dirs = [d for d in self.base_dir.iterdir() if d.is_dir()]

        for agent_dir in search_dirs:
            if not agent_dir.exists():
                continue
            for filepath in sorted(agent_dir.glob("*.md"), reverse=True)[:limit]:
                outputs.append({
                    "agent": agent_dir.name,
                    "file": filepath.name,
                    "path": str(filepath),
                    "created": datetime.fromtimestamp(filepath.stat().st_mtime).isoformat(),
                })

        return sorted(outputs, key=lambda x: x["created"], reverse=True)[:limit]

    def get_output(self, filepath: str) -> str | None:
        """Read a saved output"""
        path = Path(filepath)
        if path.exists():
            return path.read_text(encoding="utf-8")
        return None


# Singleton instance
output_manager = OutputManager()
