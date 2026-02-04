---
title: "Domain Driven Design (DDD) for PMs"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "domain-driven-design-for-pms"
  - "domain driven design (ddd) for"
  - "1. the core shift: ubiquitous "
  - "2. bounded contexts (the barri"
  - "3. event storming basics"
  - "4. entity vs. value object"
  - "5. agent instructions for prd "
  - "codex"
  - "knowledge"
tags:
  - "galaxy-codex"
  - "document"
---

# Domain Driven Design (DDD) for PMs

**Source Authority:** Eric Evans, Martin Fowler.

## 1. The Core Shift: Ubiquitous Language
Product and Code must speak the same language.
*   **The Anti-Pattern:** PM says "User", Design says "Persona", Dev says "Account".
*   **The DDD Fix:** Everyone says "**Customer**".
*   **Agent Rule:** Identify the "Ubiquitous Language" terms in the Glossary section of the PRD and enforce them.

## 2. Bounded Contexts (The Barrier to Sprawl)
A "Context" is a linguistic boundary.
*   *Example:* The word "Ticket" means something different in "Customer Support" vs. "Event Booking".
*   **Strategic Implication:** Do not build a "Monolithic User". Build a "SupportUser" and a "BookingUser".
*   **Agent Instruction:** In the PRD, define the **Bounded Context** (e.g., "This feature lives entirely within the 'Fulfillment' context").

## 3. Event Storming Basics
Use "Domain Events" to describe requirements.
*   *Format:* [Noun] [Verb] [Past Tense].
*   *Ex:* `OrderPlaced`, `PaymentFailed`, `ItemShipped`.
*   **Why:** This maps 1:1 to modern Event-Driven Architectures.

## 4. Entity vs. Value Object
*   **Entity:** Has an ID. Its identity matters (e.g., a specific User).
*   **Value Object:** Defined by its attributes. No ID (e.g., an Address).
*   *Tip:* If you change a property and it becomes a "different thing", it's a Value Object.

## 5. Agent Instructions for PRD Generation
1.  **Event Section:** Instead of just "User Stories", include a section called `Domain Events` listing the triggers this feature generates.
2.  **Glossary Check:** Start the PRD with a `Ubiquitous Language Glossary` defining 3-5 core terms.
3.  **Context Definition:** Explicitly state: "This feature belongs to the [Name] Domain."

#galaxy-codex