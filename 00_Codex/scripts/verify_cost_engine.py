
import sys
from pathlib import Path

# Setup path
project_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(project_root))

from eximia_runtime.core.cost_engine import cost_engine

def test_cost(model, input_t, output_t, expected_approx=None):
    cost = cost_engine.calculate_cost(model, input_t, output_t)
    print(f"Model: {model:<40} | In: {input_t:<5} | Out: {output_t:<5} | Cost: ${cost:.6f}")
    
    # Test logging
    cost_engine.log_transaction("test_agent", model, input_t, output_t, cost)
    
    if expected_approx:
        assert abs(cost - expected_approx) < 0.0001, f"Expected {expected_approx}, got {cost}"

print("🚀 Verifying Cost Engine...\n")

# 1. Claude 3.5 Sonnet (3.00/15.00)
# 1M in = $3.00
test_cost("anthropic/claude-3-5-sonnet", 1_000_000, 0, 3.00)
# 1M out = $15.00
test_cost("anthropic/claude-3-5-sonnet", 0, 1_000_000, 15.00)

# 2. Claude 3 Opus (15.00/75.00)
# 1k in = 0.015
test_cost("anthropic/claude-3-opus", 1_000, 0, 0.015)

# 3. Claude 4.5 Sonnet (Assuming 3.5 pricing for now as placeholder)
test_cost("anthropic/claude-4-5-sonnet", 1_000_000, 0, 3.00)

# 4. Ollama (Free)
test_cost("ollama/qwen2.5:14b", 5000, 2000, 0.0)

# 5. Unknown model (Free)
test_cost("unknown/model", 100, 100, 0.0)

print("\n✅ Verification Complete!")
