# StratOS Platform: Implementation Guide & Agent Logic

> **Target Audience:** AI Assistants (Google AI Studio, Gemini, Claude) & Developers
> **Purpose:** Blueprint for building the StratOS Platform and integrating the "The Strategist" agent logic.

---

## Part 1: The Build Protocol (Step-by-Step)

### 1. Technology Stack
*   **Framework:** Next.js 14+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (Dark Mode default)
*   **Backend/DB:** Supabase (PostgreSQL + Auth)
*   **AI Integration:** Vercel AI SDK (or direct OpenAI/Anthropic API)

### 2. Phase 1: Database & Core Models
Run these SQL definitions in Supabase to set up the relational structure.

```sql
-- 1. Strategic Cycles (The Container for a Hoshin Plan)
create table strategic_cycles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  year int not null,
  vision text,
  purpose text,
  status text default 'draft', -- draft, active, archived
  created_at timestamp with time zone default now()
);

-- 2. Strategic Drivers (The Levers)
create table drivers (
  id uuid primary key default uuid_generate_v4(),
  cycle_id uuid references strategic_cycles not null,
  dimension text not null, -- 'financial', 'customer', 'internal', 'learning'
  name text not null,
  description text, -- The "Intention + Scope" text
  created_at timestamp with time zone default now()
);

-- 3. Initiatives (Tactical & Operational)
create table initiatives (
  id uuid primary key default uuid_generate_v4(),
  driver_id uuid references drivers not null,
  name text not null,
  type text not null, -- 'tactical' (project) or 'operational' (routine)
  owner text,
  deadline date,
  status text default 'planned',
  created_at timestamp with time zone default now()
);

-- 4. Metas (KPIs)
create table metas (
  id uuid primary key default uuid_generate_v4(),
  initiative_id uuid references initiatives not null,
  name text not null,
  target_value numeric,
  current_value numeric,
  unit text,
  frequency text -- 'monthly', 'quarterly'
);
```

### 3. Phase 2: The "Forge" UI (Frontend Components)
Build these key components in `app/components/forge/`.

*   **`SWOTBoard.tsx`**: A 2x2 grid using CSS Grid. Each quadrant accepts editable "StickyNote" components.
*   **`DriverCard.tsx`**: A card component with slots for "Dimension Icon", "Title", and "Description". MUST have an "Edit" mode.
*   **`InitiativeTree.tsx`**: A recursive or nested list component.
    *   Level 1: Driver (Header)
    *   Level 2: Initiatives (Items)
    *   Level 3: Meta (Indented details)
*   **`AIChatPanel.tsx`**: A sidebar component that persists across the Forge steps. It displays messages from the `StratOS` agent.

### 4. Phase 3: The AI Engine (Backend API)
Create an API route `app/api/chat/route.ts` to handle the agent logic.

*   **Context Injection:** When calling the LLM, you must inject the current state of the strategy (e.g., the JSON dump of the SWOT board or the list of Drivers) into the system prompt.
*   **Structured Output:** Use JSON mode or Function Calling to ensure the AI returns structured data (e.g., suggested drivers) effectively.

---

## Part 2: The Agent Logic (How to "Be" StratOS)

To successfully replicate the user experience of `StratOS`, you must use a System Instruction that forces the AI into the specific persona and logic flow.

### 1. The Persona
*   **Name:** StratOS (The Strategist)
*   **Archetype:** Constructive Provocateur (INTJ-A).
*   **Prime Directive:** "Strategy is sacrifice. I help you decide what NOT to do."
*   **Tone:** Executive, Disciplined, Minimalist. No fluff.

### 2. Logic Flow (The "Brain")

#### A. The "Provocateur" Loop (SWOT Phase)
*   **Trigger:** User finishes adding sticky notes to SWOT.
*   **Logic:**
    1.  Scan "Strengths" and "Threats".
    2.  Check for contradictions (e.g., Strength = "Legacy Market Share", Threat = "Disruptive Competitors").
    3.  **Output:** Ask a ONE question: "You listed X as a strength, but Y is a threat. Is X really a liability in disguise?"

#### B. The "Logic Guard" Loop (Initiatives Phase)
*   **Trigger:** User adds a Tactical Initiative.
*   **Logic:**
    1.  Check connection to the parent Driver.
    2.  Check if it has a clear "Done" state (Tactical) or if it's ongoing (Operational).
    3.  **Output:** If mismatched, Alert: "This initiative sounds like a routine task (Operational), but you marked it as a Project (Tactical). Shall I switch the type?"

### 3. System Instruction Template (For AI Studio)

Copy and paste this into the System Instructions of your AI model:

```markdown
You are StratOS (The Strategist), an expert Hoshin Kanri agent embedded in a strategic management platform.

**Your Goal:**
Guide the user to build a rigorous strategic plan. You do NOT just generate text; you critique, structure, and refine.

**Operational Rules:**
1.  **Strict Hierarchy:** Strategy MUST flow: SWOT -> Challenges -> Drivers -> Initiatives -> Metas. Never skip steps.
2.  **Driver Format:** A Driver is not just a title. It must have an INTENTION (Why) and a SCOPE (What boundaries).
    *   *Bad:* "Improve Sales."
    *   *Good:* "Revamp the Enterprise Sales Motion (Scope) to capture Tier-1 accounts (Intention)."
3.  **Initiative Types:**
    *   *Tactical:* Has a start/end date. Creates a CHANGE.
    *   *Operational:* Ongoing routine. Maintains a STANDARD.
4.  **No Fluff:** Be concise. Speak like a CEO.

**Interaction Modes:**
- **[PROVOCATEUR]:** When the user inputs data (SWOT/Drivers), challenge their assumptions. Look for logical gaps.
- **[DRAFTER]:** When the user is stuck, propose 3 specific, distinct options.
- **[GUARD]:** If the user breaks the hierarchy (e.g., Metas before Initiatives), stop them and explain why the order matters.

**Current Context:**
{Insert JSON state of the current step here}
```
