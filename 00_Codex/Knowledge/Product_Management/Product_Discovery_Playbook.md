---
title: "Product Discovery Playbook: Continuous Discovery & OST"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "product-discovery-playbook"
  - "product discovery playbook: co"
  - "1. the mindset: continuous dis"
  - "2. the opportunity solution tr"
  - "structure"
  - "pruning the tree"
  - "3. validating assumptions (not"
  - "4. the product trio"
  - "5. agent instructions for prd "
  - "codex"
tags:
  - "galaxy-codex"
  - "document"
---

# Product Discovery Playbook: Continuous Discovery & OST

**Source Authority:** Teresa Torres, Marty Cagan.

## 1. The Mindset: Continuous Discovery
Discovery is not a phase; it is a **continuous habit**.
*   **Rule:** "Weekly touchpoints with customers."
*   **Goal:** Mitigate the 4 Big Risks (Value, Usability, Feasibility, Viability) *before* building.

## 2. The Opportunity Solution Tree (OST)
A visual structure to visualize the path to the desired outcome.

### Structure
1.  **Desired Outcome (Root):** A business metric (e.g., "Increase Retention by 10%").
    *   *Agent Note:* Must be a number, not a "theme".
2.  **Opportunities (Branches):** Customer needs, pain points, or desires (e.g., "I can't find my past orders").
    *   *Key:* Use "I need" or "I want" statements.
3.  **Solutions (Leaves):** Ideas to solve the opportunity (e.g., "Add 'Buy Again' button").
4.  **experiments (Validation):** Tests to validate the solution (e.g., "Fake Door test on dashboard").

### Pruning the Tree
*   **Compare Opportunities:** Which opportunity, if solved, drives the Outcome the most?
*   **Compare Solutions:** Which solution solves the Opportunity with the least effort/risk?

## 3. Validating Assumptions (Not just "Ideas")
Don't test the *whole* idea. Test the **underlying assumptions**.
1.  **Desirability Assumption:** "Do they want this?" -> *Test:* Fake Door / Landing Page.
2.  **Usability Assumption:** "Can they figure out how to use it?" -> *Test:* Clickable Prototype / Usability Hub.
3.  **Feasibility Assumption:** "Can we build it?" -> *Test:* Tech Spike.
4.  **Viability Assumption:** "Does it make money/work for the business?" -> *Test:* Business Model Canvas / Legal review.

## 4. The Product Trio
Discovery is performed by the **Trio**:
1.  **Product Manager:** Focus on Value & Viability.
2.  **Product Designer:** Focus on Usability.
3.  **Tech Lead:** Focus on Feasibility.

*Agent Instruction:* When writing a PRD, explicitly call out "Open Questions" for the Designer and Tech Lead sections to simulate this collaboration.

## 5. Agent Instructions for PRD Generation
1.  **OST Integration:** In the `Context` section of the PRD, briefly describe the "Opportunity" being addressed and link it to the "Business Outcome".
2.  **Risk Assessment:** Create a section called `Discovery Risks` where you list specific Assumption Tests that *were* or *should be* run (e.g., "Assumption: Users want to share reports. Validation: 4/5 users clicked the 'Share' dummy button in interviews.").
3.  **Iterative Mindset:** Define "Success" not as "feature deployed" but as "Outcome impacted".

#galaxy-codex