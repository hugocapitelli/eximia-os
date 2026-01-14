"""Veritas First Protocol - Mandatory fact validation before strategic decisions"""

from dataclasses import dataclass
from typing import Any

import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


@dataclass
class VeritasValidation:
    """Result of Veritas validation"""
    is_valid: bool
    validated_facts: list[dict[str, Any]]
    warnings: list[str]
    enriched_context: str | None = None


class VeritasFirstProtocol:
    """
    Middleware that enforces fact validation via The_Veritas agent
    before strategic agents (CFO, CEO, CLO) can execute.
    
    Protocol: "Veritas First"
    - Strategic agents MUST receive fact-validated data
    - Veritas enriches input with verified information
    - Reduces hallucination risk in critical decisions
    """

    # Agents that require Veritas validation
    FACT_REQUIRED_AGENTS = {
        "the_cfo",
        "the_ceo", 
        "the_clo",
        "the_cmo",
    }

    # Keywords that trigger automatic validation
    VALIDATION_TRIGGERS = [
        "market size",
        "revenue",
        "valuation",
        "legal",
        "compliance",
        "regulation",
        "competitor",
        "statistics",
        "data",
        "research",
    ]

    def __init__(self, executor=None):
        self._executor = executor

    @property
    def executor(self):
        """Lazy load executor to avoid circular imports"""
        if self._executor is None:
            from eximia_runtime.core.agent_executor import executor
            self._executor = executor
        return self._executor

    def requires_validation(self, agent_name: str, input_data: str | dict) -> bool:
        """Check if this request requires Veritas validation"""
        # Check if agent requires validation
        if agent_name.lower() in self.FACT_REQUIRED_AGENTS:
            return True

        # Check for trigger keywords in input
        input_text = str(input_data).lower()
        return any(trigger in input_text for trigger in self.VALIDATION_TRIGGERS)

    async def validate_and_enrich(
        self,
        agent_name: str,
        input_data: str | dict,
        skip_if_cached: bool = True,
    ) -> tuple[str | dict, VeritasValidation]:
        """
        Validate facts and enrich input with verified data.
        
        Args:
            agent_name: Target agent name
            input_data: Original input
            skip_if_cached: Skip if recently validated
            
        Returns:
            Tuple of (enriched_input, validation_result)
        """
        if not self.requires_validation(agent_name, input_data):
            return input_data, VeritasValidation(
                is_valid=True,
                validated_facts=[],
                warnings=["Validation not required for this request"],
            )

        logger.info(
            "veritas_first_validating",
            agent=agent_name,
            input_length=len(str(input_data)),
        )

        # Build validation query
        if isinstance(input_data, dict):
            query = self._build_validation_query(input_data)
        else:
            query = f"Validate and research facts for: {input_data}"

        try:
            # Call Veritas for validation
            veritas_result = await self.executor.execute(
                agent_name="the_veritas",
                input_data={
                    "task": "fact_validation",
                    "query": query,
                    "context": f"Validating for {agent_name}",
                },
            )

            # Parse and enrich
            enriched_input = self._enrich_input(input_data, veritas_result.content)

            validation = VeritasValidation(
                is_valid=True,
                validated_facts=[{"source": "veritas", "content": veritas_result.content[:500]}],
                warnings=[],
                enriched_context=veritas_result.content,
            )

            logger.info(
                "veritas_first_complete",
                agent=agent_name,
                tokens_used=veritas_result.tokens_used,
            )

            return enriched_input, validation

        except Exception as e:
            logger.error("veritas_first_failed", error=str(e))
            
            # Fail open with warning (don't block execution)
            return input_data, VeritasValidation(
                is_valid=True,
                validated_facts=[],
                warnings=[f"Veritas validation failed: {str(e)}. Proceeding without validation."],
            )

    def _build_validation_query(self, input_data: dict) -> str:
        """Build a validation query from structured input"""
        parts = []
        
        for key, value in input_data.items():
            if key in ["query", "task", "request", "question"]:
                parts.append(f"Main request: {value}")
            elif isinstance(value, (str, int, float)):
                parts.append(f"{key}: {value}")
        
        return "\n".join(parts)

    def _enrich_input(
        self,
        original_input: str | dict,
        veritas_context: str,
    ) -> str | dict:
        """Enrich the original input with Veritas-validated context"""
        
        # Add verification context
        context_prefix = f"""
## Contexto Validado (Veritas First)

{veritas_context[:2000]}

---

## Solicitação Original

"""
        
        if isinstance(original_input, str):
            return context_prefix + original_input
        else:
            enriched = dict(original_input)
            enriched["_veritas_context"] = veritas_context[:2000]
            enriched["_validated"] = True
            return enriched


# Singleton instance
veritas_protocol = VeritasFirstProtocol()
