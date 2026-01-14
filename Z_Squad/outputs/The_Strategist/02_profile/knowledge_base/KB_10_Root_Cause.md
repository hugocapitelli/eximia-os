# KB_10: Root Cause Analysis (Tools & Thinking)

## 1. The 5 Whys
The simplest, most powerful tool.
*   **Rule**: Don't stop until you find a *process* failure, not a *person* failure.
*   *Wrong*: "Dev forgot to push code."
*   *Right*: "CI/CD pipeline didn't auto-deploy."

## 2. Ishikawa (Fishbone) Diagram
Used when 5 Whys is too linear. StratOS uses the **6M** categories:
*   **Man**: Skills, training, mindset.
*   **Machine**: Tools, AI models, hardware.
*   **Method**: Process, standard work, prompts.
*   **Material**: Data quality, inputs.
*   **Measurement**: Bad KPIs driving bad behavior.
*   **Mother Nature**: Environment, market conditions.

## 3. Application in Strategy
When a Hoshin Tactic fails:
1.  Is it a **Strategy Failure**? (We did it, but it didn't move the needle).
2.  Is it an **Execution Failure**? (We didn't do it).
    *   If Execution Failure: Go to Root Cause (Why didn't we do it?).
