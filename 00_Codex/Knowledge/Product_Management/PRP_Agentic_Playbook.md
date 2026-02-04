---
title: "Product Requirement Prompts (PRP) Playbook"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "prp-agentic-playbook"
  - "product requirement prompts (p"
  - "definition"
  - "the prp framework"
  - "structure of a prp"
  - "workflow: from prd to prp"
  - "example prp template"
  - "role"
  - "context"
  - "visual context (wireframe)"
tags:
  - "galaxy-codex"
  - "document"
---

# Product Requirement Prompts (PRP) Playbook

## Definition
**PRP (Product Requirement Prompts)** represents the evolution of PRDs for the AI Era. While a PRD is for humans, a PRP is a structured, machine-readable specification designed to instruct AI Agents (coders, designers, architects) to generate high-quality outputs with minimal hallucination.

## The PRP Framework
A successful PRP acts as a bridge between a high-level goal and executable code/artifacts.

### Structure of a PRP
1.  **Role Definition:** Explicitly stating who the AI is (e.g., "Senior React Engineer").
2.  **Context Injection:**
    *   **Project State:** Brief summary of the existing codebase.
    *   **Style Guides:** Links to specific UI/Code standards (e.g., "Use TailwindCSS, standard naming").
3.  **Visual Context (Wireframes):**
    *   **ASCII/Textural Wireframe:** A clear visual representation of the layout.
    *   **Component Mapping:** Labeling which part of the wireframe corresponds to which component.
4.  **Task Specification (The "What"):**
    *   **Input:** What data/files are provided.
    *   **Transformation:** The logic or creative process required.
    *   **Output:** Exact file names, formats, and expected content structure.
5.  **Constraints & Guardrails (The "No"):**
    *   "Do not use external libraries unless specified."
    *   "Do not modify files outside /src/components."
6.  **Step-by-Step Instructions (Chain of Thought):**
    *   Force the AI to think in steps (e.g., "1. Analyze file, 2. Plan change, 3. Execute").

## Workflow: From PRD to PRP
1.  **Extract:** Take a User Story from the PRD.
2.  **Visualize:** Create a low-fidelity wireframe (even text-based) for the interface.
3.  **Refine:** Break it down into atomic tasks (e.g., "Create Login UI", "Implement Auth Logic").
4.  **Prompt:** Wrap each atomic task in the PRP structure.

## Example PRP Template
```markdown
# Role
You are an expert Frontend Engineer.

# Context
We are differentiating the "Agenda Cheia" login screen.
Stack: React, Vite, TailwindCSS.

# Visual Context (Wireframe)
```text
+-------------------------------------------------------+
|  [ Logo ]                                             |
|                                                       |
|  +-------------------------------------------------+  |
|  |  Login                                          |  |
|  |                                                 |  |
|  |  [ Email Input ]                                |  |
|  |  [ Password Input ]                             |  |
|  |                                                 |  |
|  |  [ Login Button ]                               |  |
|  |                                                 |  |
|  |  [Forgot Password?]                             |  |
|  +-------------------------------------------------+  |
|                                                       |
+-------------------------------------------------------+
```

# Task
Create a `Login.tsx` component that matches the wireframe above.

# Specifications
- Use the glassmorphism design capability.
- Fields: Email, Password.
- Buttons: "Login", "Forgot Password".
- Form Validation: Zod.

# Constraints
- Strict Typescript usage.
- No `any` types.
```

#galaxy-codex