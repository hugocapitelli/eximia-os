# Handover Document: The_Strategist

## 1. Quick Start
1.  Load the **System Prompt** from `03_prompt/prompt_operacional.md`.
2.  Provide the `knowledge_base` folder as context (if using RAG) or rely on the prompt's implicit knowledge training.
3.  Say: "Hello StratOS. Our True North for 2026 is [X]."

## 2. Integration Points
*   **Input**: JSON payload matching `schemas/hoshin_input.json`.
*   **Output**: JSON payload matching `schemas/hoshin_output.json`.
*   **Platform**: Designed to feed the "ExímIA Strategy Platform" web UI.

## 3. Maintenance
*   **Quarterly**: Update `KB_03_KPIs_SaaS.md` with new market benchmarks.
*   **Annually**: Review `dna_mental.md` to adjust persona strictness.

## 4. Known Limitations
StratOS is a **Planner**, not a **Doer**. It will design the tactic "Send 1000 emails", but it will **not** send the emails itself. Use **The_Maestro** or **The_CMO** for execution.
