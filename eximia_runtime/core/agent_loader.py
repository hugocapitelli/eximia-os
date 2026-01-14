"""Agent Loader - Loads agent configurations from Markdown/YAML files"""

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml


@dataclass
class AgentConfig:
    """Complete agent configuration loaded from files"""
    name: str
    system_prompt: str
    knowledge_base: list[str] = field(default_factory=list)
    input_schema: dict[str, Any] | None = None
    output_schema: dict[str, Any] | None = None
    frameworks: list[str] = field(default_factory=list)
    voice_profile: dict[str, Any] | None = None
    tier: int = 1

    @property
    def full_prompt(self) -> str:
        """Combines system prompt with knowledge base context"""
        if not self.knowledge_base:
            return self.system_prompt

        kb_context = "\n\n---\n\n## KNOWLEDGE BASE\n\n"
        kb_context += "\n\n".join(self.knowledge_base)

        return self.system_prompt + kb_context


class AgentLoader:
    """Loads agent configurations from the file system"""

    def __init__(self, agent_path: Path):
        self.path = agent_path
        self.name = agent_path.name

    def load(self) -> AgentConfig:
        """Load complete agent configuration"""
        system_prompt = self._load_system_prompt()
        knowledge_base = self._load_knowledge_base()
        input_schema = self._load_schema("input_schema.json")
        output_schema = self._load_schema("output_schema.json")
        frameworks = self._extract_frameworks(system_prompt)
        voice_profile = self._load_voice_profile()
        tier = self._detect_tier()

        return AgentConfig(
            name=self.name,
            system_prompt=system_prompt,
            knowledge_base=knowledge_base,
            input_schema=input_schema,
            output_schema=output_schema,
            frameworks=frameworks,
            voice_profile=voice_profile,
            tier=tier,
        )

    def _load_system_prompt(self) -> str:
        """Load the main system prompt from agente_core.md or prompt_operacional.md"""
        # Try different locations
        candidates = [
            self.path / "agente_core.md",
            self.path / "03_prompt" / "prompt_operacional.md",
            self.path / "prompt.md",
            self.path / "system_prompt.md",
        ]

        for candidate in candidates:
            if candidate.exists():
                return candidate.read_text(encoding="utf-8")

        # Fallback: read README.md if no prompt file found
        readme = self.path / "README.md"
        if readme.exists():
            return self._extract_prompt_from_readme(readme.read_text(encoding="utf-8"))

        raise FileNotFoundError(f"No system prompt found for agent at {self.path}")

    def _extract_prompt_from_readme(self, content: str) -> str:
        """Extract prompt section from README"""
        # Look for ## IDENTIDADE or ## PROMPT sections
        pattern = r"(## (?:IDENTIDADE|PROMPT|SYSTEM).*?)(?=\n## |\Z)"
        match = re.search(pattern, content, re.DOTALL | re.IGNORECASE)
        if match:
            return match.group(1)
        return content

    def _load_knowledge_base(self) -> list[str]:
        """Load all knowledge base files"""
        kb_dirs = [
            self.path / "knowledge_base",
            self.path / "02_profile" / "knowledge_base",
            self.path / "knowledge_bases",
        ]

        knowledge = []
        for kb_dir in kb_dirs:
            if kb_dir.exists():
                for kb_file in sorted(kb_dir.glob("*.md")):
                    content = kb_file.read_text(encoding="utf-8")
                    # Add file name as header
                    knowledge.append(f"### {kb_file.stem}\n\n{content}")

        return knowledge

    def _load_schema(self, filename: str) -> dict[str, Any] | None:
        """Load JSON schema for input/output validation"""
        candidates = [
            self.path / filename,
            self.path / "03_prompt" / filename,
        ]

        for candidate in candidates:
            if candidate.exists():
                with open(candidate, encoding="utf-8") as f:
                    return json.load(f)

        return None

    def _extract_frameworks(self, prompt: str) -> list[str]:
        """Extract mentioned frameworks from the prompt"""
        # Look for framework references like [Framework: X] or **Framework:** X
        pattern = r"(?:Framework[:\s]+|##\s+Framework\s*[:\-]\s*)([^\n\[\]]+)"
        matches = re.findall(pattern, prompt, re.IGNORECASE)
        return [m.strip() for m in matches if m.strip()]

    def _load_voice_profile(self) -> dict[str, Any] | None:
        """Load voice profile if exists"""
        candidates = [
            self.path / "VOICE_PROFILE.md",
            self.path / "02_profile" / "VOICE_PROFILES.md",
            self.path / "voice_profile.yaml",
        ]

        for candidate in candidates:
            if candidate.exists():
                content = candidate.read_text(encoding="utf-8")
                if candidate.suffix == ".yaml":
                    return yaml.safe_load(content)
                # Parse markdown voice profile
                return self._parse_voice_profile_md(content)

        return None

    def _parse_voice_profile_md(self, content: str) -> dict[str, Any]:
        """Parse voice profile from markdown format"""
        profile = {}

        # Extract key sections
        sections = {
            "tone": r"(?:##\s*)?(?:Tom|Tone)[:\s]+(.+)",
            "vocabulary": r"(?:##\s*)?(?:Vocabulário|Vocabulary)[:\s]+(.+)",
            "style": r"(?:##\s*)?(?:Estilo|Style)[:\s]+(.+)",
        }

        for key, pattern in sections.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                profile[key] = match.group(1).strip()

        return profile if profile else None

    def _detect_tier(self) -> int:
        """Detect agent tier based on structure"""
        # Check for tier indicators
        if (self.path / "META_ANALYSIS.md").exists():
            return 3  # Expert
        if (self.path / "FRAMEWORK_INDEX.md").exists():
            return 2  # Executive
        if (self.path / "02_profile").exists():
            return 3  # Z Squad structure = Expert

        # Count knowledge bases
        kb_count = 0
        for kb_dir in [self.path / "knowledge_base", self.path / "02_profile" / "knowledge_base"]:
            if kb_dir.exists():
                kb_count = len(list(kb_dir.glob("*.md")))

        if kb_count >= 12:
            return 3
        if kb_count >= 5:
            return 2
        return 1
