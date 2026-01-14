# Engineering Handoff Protocol: The RFC "One-Pack"

**Source Authority:** Google Engineering Standards, Basecamp Shape Up.

## 1. The Core Philosophy: "Async by Default"
The goal of a handoff is to minimize "tap-on-the-shoulder" questions.
*   **The RFC (Request for Comments):** A handoff is not a command; it is a proposal.
*   **The "One-Pack":** All assets, specs, and logic must exist in ONE link (The Source of Truth).

## 2. The Handoff Artifact Structure (RFC)
Tier 3 Agents must generate specs in this strict format:

### Section A: The Context (Why)
*   **Problem Statement:** One sentence on why this exists.
*   **Success Metric:** "We win if X increases by Y."
*   **Non-Goals:** What we are EXPLICITLY NOT building.

### Section B: The Flows (How)
*   **Happy Path:** The ideal user journey.
*   **Unhappy Paths (The 80%):**
    1.  *Network Error:* What happens if the API fails?
    2.  *Empty State:* What if the user has no data?
    3.  *Partial State:* What if the user has only 1 item?
    4.  *Loading State:* Skeleton screens vs. Spinners.

### Section C: The Specs (What)
*   **UI/UX:** Link to Figma. Explicitly call out "Auto-Layout" behavior.
*   **Data Model:** Define the objects.
    *   `User { id: string, role: enum(admin, editor) }`
*   **Analytics Events:**
    *   `Event: button_clicked` | `Prop: location=header`

## 3. The "Definition of Ready" Checklist
A PRD is only ready for handoff if:
1.  [ ] All Copy is final (no Lorem Ipsum).
2.  [ ] All Error States are visually defined.
3.  [ ] Mobile Breakpoints are defined (320px, 768px).
4.  [ ] Accessibility Tags (Aria-labels) are suggested.

## 4. Agent Instructions for PRD Generation
1.  **RFC Header:** Start every PRD with a "RFC Metadata" block (Author, Status, Reviewers).
2.  **Error Matrix:** Include a table listing every possible user error and the corresponding UI feedback message.
    *   *Ex:* "Password too short" -> "Show Toast: 'Must be 8 chars'."
3.  **JSON Schema:** When specifying data, use pseudo-JSON blocks to help engineers visualize the payload.
