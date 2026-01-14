
from dataclasses import dataclass
from typing import Optional
from pathlib import Path

@dataclass
class PricingTier:
    input_price_per_m: float  # USD per 1M tokens
    output_price_per_m: float # USD per 1M tokens

class CostEngine:
    """Calculates LLM costs based on model and token usage."""
    
    # Pricing Database (USD per 1M tokens)
    # Updated Jan 2026 (Hypothetical for 4.5)
    PRICING = {
        # OpenAI
        "openai/gpt-4o": PricingTier(2.50, 10.00),
        "openai/gpt-4o-mini": PricingTier(0.15, 0.60),
        "openai/gpt-4-turbo": PricingTier(10.00, 30.00),
        
        # Anthropic (Current)
        "anthropic/claude-3-5-sonnet": PricingTier(3.00, 15.00),
        "anthropic/claude-3-5-sonnet-20241022": PricingTier(3.00, 15.00),
        "anthropic/claude-3-5-sonnet-20240620": PricingTier(3.00, 15.00),
        "anthropic/claude-3-opus": PricingTier(15.00, 75.00),
        "anthropic/claude-3-haiku": PricingTier(0.25, 1.25),
        
        # Anthropic (Projected/Requested 4.5)
        # Assuming higher tier pricing for Opus, similar efficiency for Sonnet
        "anthropic/claude-4-5-sonnet": PricingTier(3.00, 15.00), # Placeholder
        "anthropic/claude-4-5-opus": PricingTier(15.00, 75.00),   # Placeholder
        
        # Google
        "gemini/gemini-2.0-flash": PricingTier(0.10, 0.40), # Estimate
        "gemini/gemini-1.5-pro": PricingTier(3.50, 10.50),
        
        # Local / Free
        "ollama": PricingTier(0.0, 0.0),
    }

    def __init__(self):
        self.project_root = Path(__file__).parent.parent.parent
        self.log_dir = self.project_root / "eximia_runtime" / "logs"
        self.log_file = self.log_dir / "cost_history.csv"
        self._init_log()

    def _init_log(self):
        """Initialize the CSV log file with headers."""
        if not self.log_dir.exists():
            self.log_dir.mkdir(parents=True, exist_ok=True)
            
        if not self.log_file.exists():
            import csv
            with open(self.log_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["timestamp", "agent", "model", "input_tokens", "output_tokens", "cost_usd"])

    def log_transaction(self, agent: str, model: str, input_tokens: int, output_tokens: int, cost: float):
        """Log a transaction to the CSV file."""
        import csv
        from datetime import datetime
        
        try:
            with open(self.log_file, "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow([
                    datetime.now().isoformat(),
                    agent,
                    model,
                    input_tokens,
                    output_tokens,
                    f"{cost:.6f}"
                ])
        except Exception as e:
            print(f"⚠️ Failed to log cost: {e}")

    @classmethod
    def calculate_cost(cls, model: str, input_tokens: int, output_tokens: int) -> float:
        """Calculate total USD cost for a transaction."""
        tier = cls._get_pricing_tier(model)
        
        input_cost = (input_tokens / 1_000_000) * tier.input_price_per_m
        output_cost = (output_tokens / 1_000_000) * tier.output_price_per_m
        
        return round(input_cost + output_cost, 6)

    @classmethod
    def _get_pricing_tier(cls, model: str) -> PricingTier:
        """Resolve pricing tier for a model name."""
        # Clean model name (e.g., remove provider prefix if fuzzy matching needed)
        # But our system usually uses full strings like "anthropic/claude..."
        
        # 1. Exact match
        if model in cls.PRICING:
            return cls.PRICING[model]
            
        # 2. Provider match (Ollama is always free)
        if model.startswith("ollama") or "qwen" in model or "llama" in model:
            return cls.PRICING["ollama"]
            
        # 3. Fuzzy match for versions
        for key in cls.PRICING:
            if key in model: # e.g. "claude-3-5-sonnet" in "anthropic/claude-3-5-sonnet-latest"
                return cls.PRICING[key]
                
        # 4. Default fallback (Zero or Log warning?)
        # For now return zero but maybe log?
        return PricingTier(0.0, 0.0)

# Singleton
cost_engine = CostEngine()
