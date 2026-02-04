---
title: "Jobs To Be Done (JTBD): Outcome-Driven Innovation Deep Dive"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "jobs-to-be-done-deep-dive"
  - "jobs to be done (jtbd): outcom"
  - "1. the core shift"
  - "2. the odi framework (outcome-"
  - "the job map"
  - "the outcome statement syntax"
  - "3. the opportunity algorithm"
  - "4. market segmentation by "job"
  - "5. agent instructions for prd/"
  - "codex"
tags:
  - "galaxy-codex"
  - "document"
---

# Jobs To Be Done (JTBD): Outcome-Driven Innovation Deep Dive

**Source Authority:** Anthony Ulwick (Strategyn), Clayton Christensen.

## 1. The Core Shift
Stop designing for "Personas" (Demographics). Start designing for **Jobs** (Motivations).
*   *Wrong:* "Design a mower for a 45-year-old suburban dad."
*   *Right:* "Design a solution to 'keep the grass low and beautiful' (The Job)."

## 2. The ODI Framework (Outcome-Driven Innovation)
To be a Tier 3 Architect, you must define requirements using **Outcome Statements**, not features.

### The Job Map
Break the job down into process steps:
1.  **Define:** Plan the approach.
2.  **Locate:** Gather inputs/tools.
3.  **Prepare:** Set up the environment.
4.  **Confirm:** Verify readiness.
5.  **Execute:** Perform the core task.
6.  **Monitor:** Check status.
7.  **Modify:** Adjust if needed.
8.  **Conclude:** Finish.

### The Outcome Statement Syntax
A valid requirement must follow this strict syntax to be measurable and solution-agnostic:
`[Direction of Improvement] + [Unit of Measure] + [Object of Control] + [Contextual Clarifier]`

*   *Bad:* "Reliable connection."
*   *Good (ODI):* "**Minimize** the **time** it takes to **re-establish connectivity** when **moving between signal zones**."

## 3. The Opportunity Algorithm
How to prioritize features in a PRP? Use the Opportunity Score.
$$ Opportunity = Importance + (Importance - Satisfaction) $$

*   **Underserved (Opportunity):** High Importance, Low Satisfaction. -> **BUILD THIS.**
*   **Overserved (Disruption target):** Low Importance, High Satisfaction. -> **CUT COSTS/SIMPLIFY.**
*   **Appropriately Served:** High Importance, High Satisfaction. -> **MAINTAIN.**

## 4. Market Segmentation by "Job"
Do not segment by "Small Business vs. Enterprise". Segment by **"The Struggle"**.
*   *Group A:* Users who struggle to "Define" the plan (Need templates/wizards).
*   *Group B:* Users who struggle to "Execute" accurately (Need automation/precision).

## 5. Agent Instructions for PRD/PRP Generation
1.  **Job Statement First:** Every PRD must start with: "The primary Job-to-be-Done for this feature is: [Action] + [Object] + [Context]."
2.  **Outcome-Based Requirements:** In the `Functional Requirements` section, write at least 50% of items as Outcome Statements (e.g., "Minimize the likelihood of data entry error...").
3.  **Satisfaction Gap:** When justifying a feature in a PRP, argue based on the *gap* between current satisfaction and importance.

#galaxy-codex