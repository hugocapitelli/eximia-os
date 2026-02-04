---
title: "KB_05: Prompt Engineering Mastery (PraisonAI Edition)"
galaxy: "CORE"
galaxy-color: "#8B3A8B"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-05-prompt-engineering-mastery"
  - "kb_05: prompt engineering mast"
  - "1. the core philosophy: "garba"
  - "2. advanced techniques"
  - "a. step-back prompting (the st"
  - "b. chain of thought (the reaso"
  - "c. few-shot prompting (the tea"
  - "3. the "hyde" prep (hypothetic"
  - "4. the "gatekeeper" checklist"
  - "🧠 obsidian connections"
tags:
  - "galaxy-core"
  - "knowledge-base"
---

# KB_05: Prompt Engineering Mastery (PraisonAI Edition)

## 1. The Core Philosophy: "Garbage In, Garbage Out"
As the Chief of Staff, your primary weapon is the **Prompt**. A vague request to an agent is a waste of resources. This KB defines the techniques to craft "Praison-Level" prompts.

---

## 2. Advanced Techniques

### A. Step-Back Prompting (The Strategic View)
**Concept:** Before asking for the "How", ask for the "What" and "Why".
**When to use:** Strategic ambiguity.
**Template:**
> "Before answering the specific question about [X], first research the fundamental principles of [Y] involved. Use that context to answer."

### B. Chain of Thought (The Reasoning Path)
**Concept:** Force the agent to show its work.
**When to use:** Complex logic or math.
**Template:**
> "Thinking Process:
> 1. Identify the variables.
> 2. Analyze constraints.
> 3. Formulate hypothesis.
> 4. Generate output."

### C. Few-Shot Prompting (The Teacher)
**Concept:** Don't just tell, show. Give examples of the desired output.
**When to use:** Formatting strict compliance.
**Template:**
> "Task: Classify the feedback.
> Example 1: 'Too expensive' -> Tag: Pricing
> Example 2: 'App crashed' -> Tag: Bug
> Input: '[Actual Input]' -> Tag:"

---

## 3. The "HyDE" Prep (Hypothetical Document Embeddings)
Before delegating to the Researcher, ask yourself: *"What would the perfect answer look like?"*
Pass this "Target State" to the Researcher.

**Example:**
*   **Bad:** "Find info on AI."
*   **Good (HyDE Prep):** "Find AI trends specifically regarding **agentic workflows in SaaS**. I expect to see mentions of 'autonomous agents', 'self-healing code', and 'generative UI'."

---

## 4. The "Gatekeeper" Checklist
Before approving a prompt for the Researcher, verify:
1.  [ ] **Context:** Does the agent know *why* we need this?
2.  [ ] **Persona:** Did I define *who* the agent is acting as?
3.  [ ] **Constraint:** Did I say what *not* to do?
4.  [ ] **Format:** Did I specify Markdown, JSON, or CSV?


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-core