---
title: "Accessibility (WCAG 3.0 "Silver") & Inclusive Design"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "accessibility-wcag-3.0-guide"
  - "accessibility (wcag 3.0 "silve"
  - "1. the core shift: from "pass/"
  - "2. cognitive accessibility (th"
  - "3. functional categories for d"
  - "4. hierarchy of severity (for "
  - "5. agent instructions for prd "
  - "codex"
  - "knowledge"
tags:
  - "galaxy-codex"
  - "document"
---

# Accessibility (WCAG 3.0 "Silver") & Inclusive Design

**Source Authority:** W3C WAI (Silver Task Force).

## 1. The Core Shift: From "Pass/Fail" to "Outcomes"
WCAG 3.0 moves from binary A/AA/AAA to a holistic scoring system (Bronze/Silver/Gold).
*   **Focus:** It's not just about screen readers; it's about **Cognitive Load**.

## 2. Cognitive Accessibility (The New Frontier)
Design for neurodiversity (ADHD, Dyslexia, Autism, Anxiety).
*   **Plain Language:** Use Hemingway Editor level (Grade 6-8). Avoid metaphors.
*   **Wayfinding:** "Where am I?" and "Where can I go?" must be answerable in 2 seconds.
*   **Authentication:** Remove memory tests. "Paste" into password fields MUST be allowed. "Magic Links" preferred over complex passwords.
*   **Time-Outs:** Warn users before sessions expire (Anxiety reduction).

## 3. Functional Categories for Designers
*   **Vision:** High contrast (APCA algorithm preferred over ratio). Text resizing up to 200% without breaking layout.
*   **Motor:** Target size minimum **44x44 CSS pixels**. Keyboard focus states must be highly visible (2px outline).
*   **Input Agnostic:** The interface must work with Mouse, Touch, Keyboard, and Voice Control equally.

## 4. Hierarchy of Severity (for PRD Prioritization)
1.  **Critical (Blocker):** User cannot complete the primary job (e.g., Keyboard trap).
2.  **Serious (Barrier):** User can complete job but with significant difficulty/pain.
3.  **Moderate (Annoyance):** Mild frustration.

## 5. Agent Instructions for PRD Generation
1.  **A11y Acceptance Criteria:** Every User Story in the PRD must have an "Accessibility" AC section.
    *   *Example:* "Focus must move to the modal window immediately upon opening."
2.  **Cognitive Check:** In the "User Interface" section, explicitly state: "UI must simulate a low-stress environment. No auto-playing media or flashing elements."
3.  **Alt Text Spec:** Require that all non-decorative images have a defined Alt-Text strategy in the data model.

#galaxy-codex