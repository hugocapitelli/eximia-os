# User Story Mapping: Advanced Techniques & Slicing Strategies

**Source Authority:** Jeff Patton, with Tier 3 extensions for Complex Product Architectures.

## 1. Core Philosophy: "The Map is the Territory"
User Story Mapping is not just backlog management; it is a **spatial visualization** of the user journey that forces "Big Picture" thinking.
*   **X-Axis (Narrative Flow):** The chronological journey of the user. "What do they do first, next, and last?"
*   **Y-Axis (Priority/release):** The criticality of the task. "Is this strictly necessary for the immediate goal?"

## 2. Advanced Slicing Strategies
Tier 3 Agents must not just "list" stories; they must **slice** them strategically to define valuable releases.

### Strategy A: The "Walking Skeleton" (MVP)
*   **Definition:** The thinnest possible path through the system that is technically functional end-to-end.
*   **Goal:** Technical validation + Core Value delivery.
*   **Agent Instruction:** Identifying the "backbone" (high-level activities) and selecting ONLY the top card from each column required to complete the loop.

### Strategy B: Slicing by "Learning" (Risk Reduction)
*   **Use Case:** High uncertainty features (e.g., AI integration, new market).
*   **Method:** Slice a release NOT by "value to user" but by "value of information to the team".
*   **Example:** Constructing a "Search" feature slice that only returns static results to test the UI flow before building the indexing backend.

### Strategy C: Slicing by "Persona Goals"
*   **Method:** Create specific horizontal slices for distinct personas.
*   **Example:**
    *   *Slice 1 (Admin):* "I can configure the system."
    *   *Slice 2 (End User):* "I can use the configured system."
    *   *Release Order:* Often Admin features are built first, but a "Wizard of Oz" slice might allow manual admin while End User value is delivered.

## 3. The "Split" Tactics (Micro-Slicing)
When a story is too big (Epic), apply these INVEST-compliant split patterns:

1.  **Workflow Steps:** Split a complex "Registration" story into: "Enter Email", "Validate Token", "Set Password", "Enrich Profile".
2.  **Business Rules:** Split "Search" into: "Search by Name" (Simple), "Search by Date" (Complex), "Boolean Search" (Advanced).
3.  **Data Variance:** Split "Export Data" into: "Export to CSV" (Simple), "Export to PDF" (Complex formatting).
4.  **Interface Variance:** Split "Dashboard" into: "View on Web", "View on Mobile", "View via API".

## 4. Prioritization Frameworks within the Map
*   **MoSCoW Matrix:** Apply labels (Must, Should, Could, Won't) directly to cards.
*   **The "Specific Outcome" Line:** Draw a line. Everything above it contributes to "Outcome A" (e.g., Increase Retention). Everything below is backlog.

## 5. Agent Instructions for PRD Generation
When generating a PRD using this KB:
1.  **Visualize the Backbone:** Explicitly list the user activities in the PRD `User Journey` section.
2.  **Define the Slice:** Explicitly state *which* slice this PRD covers (e.g., "This PRD covers the 'Walking Skeleton' slice for the Checkout Flow").
3.  **Justify the Cut:** Explain *why* certain stories were pushed below the release line (e.g., "Advanced filtering pushed to v1.1 to prioritize core search speed").
