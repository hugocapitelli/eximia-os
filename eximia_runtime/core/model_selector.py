"""
Model Selector Engine - Intelligently selects the best LLM for the task
"""

from typing import Any
import structlog
from eximia_runtime.core.config import settings

logger = structlog.get_logger()

class ModelSelector:
    """
    Intelligent engine to select the best LLM model based on:
    1. Agent Tier (Expert/Executive/Tactical)
    2. Query Complexity (Heuristic analysis)
    3. User Preferences (via Config)
    """

    # Model Definitions
    MODELS = {
        "tier_3_reasoning": ["claude-3-5-sonnet-20240620", "claude-3-opus-20240229"],
        "tier_2_balanced": ["gemini/gemini-1.5-pro", "openai/gpt-4o"],
        "tier_1_speed": ["gemini/gemini-1.5-flash", "ollama/qwen2.5:14b", "ollama/llama3.1:8b"],
    }

    def select_model(self, agent_name: str, query: str, agent_tier: int = 1) -> dict:
        """
        Analyze task and recommend the best model.
        Returns a dictionary with recommendation and reasoning.
        """
        complexity_score = self._assess_complexity(query, agent_tier)
        recommended_model = self._pick_model(complexity_score)
        
        return {
            "agent_name": agent_name,
            "query_preview": query[:100] + "..." if len(query) > 100 else query,
            "complexity_score": complexity_score,
            "complexity_level": self._get_level_name(complexity_score),
            "recommended_model": recommended_model,
            "alternatives": self._get_alternatives(complexity_score),
            "reasoning": self._generate_reasoning(complexity_score, agent_tier, query)
        }

    def _assess_complexity(self, query: str, agent_tier: int) -> int:
        """
        Score complexity from 1 (Low) to 5 (High).
        Base score = Agent Tier.
        Adjust based on keywords/intent.
        """
        score = agent_tier # Start with agent tier (1, 2, or 3)
        
        query_lower = query.lower()
        
        # High complexity triggers (+2)
        if any(kw in query_lower for kw in ["strategy", "architect", "complex", "deep", "analysis", "synthesis", "plan", "design"]):
            score += 2
            
        # Medium complexity triggers (+1)
        elif any(kw in query_lower for kw in ["summary", "list", "compare", "explain", "code", "debug"]):
            score += 1
            
        # Simple task triggers (-1) - caps at min 1
        elif any(kw in query_lower for kw in ["format", "check", "simple", "quick", "hello"]):
            score -= 1

        # Cap between 1 and 5
        return max(1, min(5, score))

    def _pick_model(self, score: int) -> str:
        """Select model based on score"""
        if score >= 4:
            # High Complexity -> Tier 3 Reasoning
            # Prefer Sonnet 3.5 if key available, else Opus, else Fallback
            if settings.anthropic_api_key:
                return self.MODELS["tier_3_reasoning"][0] # Sonnet 3.5
            elif settings.openai_api_key:
                return "openai/gpt-4o"
            else:
                return "gemini/gemini-1.5-pro" # Fallback high end

        elif score >= 2:
            # Medium Complexity -> Tier 2 Balanced
            if settings.gemini_api_key:
                return self.MODELS["tier_2_balanced"][0] # Gemini 1.5 Pro
            elif settings.openai_api_key:
                return "openai/gpt-4o-mini"
            else:
                return "ollama/qwen2.5:14b" # Fallback local

        else:
            # Low Complexity -> Tier 1 Speed
            # Prefer Local Ollama if available/implied, else Gemini Flash
            return "ollama/qwen2.5:14b" # Default to strong local for speed/privacy

    def _get_alternatives(self, score: int) -> list[str]:
        """Return valid alternatives"""
        if score >= 4:
            return self.MODELS["tier_3_reasoning"] + [self.MODELS["tier_2_balanced"][0]]
        elif score >= 2:
             return self.MODELS["tier_2_balanced"] + [self.MODELS["tier_1_speed"][0]]
        else:
            return self.MODELS["tier_1_speed"]

    def _get_level_name(self, score: int) -> str:
        if score >= 4: return "High (Strategic/Creative)"
        if score >= 2: return "Medium (Analytical)"
        return "Low (Transactional)"

    def _generate_reasoning(self, score: int, tier: int, query: str) -> str:
        if score >= 4:
            return f"Task requires high-level reasoning (Score {score}/5). Recommended Claude 3.5 Sonnet for best nuance and instruction following."
        if score >= 2:
            return f"Task is standard complexity (Score {score}/5). Gemini 1.5 Pro offers best balance of window context and reasoning."
        return f"Task is straightforward (Score {score}/5). Local Ollama model is sufficient and fastest."

# Singleton
model_selector = ModelSelector()
