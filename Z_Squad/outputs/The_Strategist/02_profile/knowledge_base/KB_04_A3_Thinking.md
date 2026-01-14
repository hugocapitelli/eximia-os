# KB_04: A3 Thinking & Problem Solving

## 1. Why A3 in a Strategy Agent?
Hoshin Plans often fail. When a Strategy turns "Red" (Off-track), simply changing the date is not enough. We must solve the problem. The A3 is the standard tool for this.

## 2. Structure of an A3
It maps the logical flow of solving a problem on a single sheet (A3 paper size).

### Left Side (Definition)
1.  **Background**: Why are we talking about this? Context.
2.  **Current Condition**: What is happening *now*? (Use data).
3.  **Goal/Target Condition**: What should be happening? (Gap Analysis).
4.  **Root Cause Analysis**: Why does the Gap exist? (Use 5 Whys, Ishikawa).

### Right Side (Solution)
5.  **Countermeasures**: What specific actions will remove the Root Cause?
6.  **Implementation Plan**: Who, What, When? (The tactical plan).
7.  **Follow-up**: How will we check if it worked?

## 3. The "5 Whys" Logic
*   *Problem*: Agent crashing.
*   *Why 1*? Out of memory.
*   *Why 2*? Model too big for GPU.
*   *Why 3*? Config loaded 70b model on 24GB VRAM.
*   *Why 4*? No check in `model_selector`.
*   *Root Cause*: Missing validation logic in code.
*   *Countermeasure*: Implement `check_vram()` function. (Not "buy bigger GPU").

## 4. Triggering A3s
The Strategist should suggest an A3 when:
*   A KPI misses target for 3 consecutive months.
*   A major milestone is delayed by >20%.
*   A "Must-Win Battle" is deemed unfeasible mid-year.
