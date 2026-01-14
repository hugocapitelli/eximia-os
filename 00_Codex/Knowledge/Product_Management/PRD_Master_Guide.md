# Master Guide: Product Requirements Document (PRD) construction

## Overview
This guide defines the standard structure and best practices for creating high-level Product Requirements Documents (PRDs) within the ecosystem. It combines industry-standard frameworks with specific high-performance elements observed in successful projects (e.g., "Agenda Cheia v2.0").

## Core Philosophy
A PRD is not just a list of features; it is a **validated business case** and a **detailed blueprint** for execution. It must answer "Why?", "Who?", "What?", and "How?" with data-backed confidence.

## Standard PRD Structure

### 1. Header & Metadata
*   **Title:** Clear product name and tagline.
*   **Version:** vX.X (Iterative).
*   **Status:** Draft, Ready for Approval, In Development.
*   **Confidence Score:** A unique metric (e.g., "82% - Validated by The_Veritas") indicating the reliability of the market data.
*   **Authors/Owners:** Who is responsible.

### 2. Executive Summary
*   **The Pitch:** 2-3 sentences explaining the product.
*   **Core Problem:** The single most painful issue being solved.
*   **Solution:** High-level description of the fix.
*   **Strategic Differentiation:** Why us? Why now?
*   **Validation:** Key stats (TAM, SAM, ROI) that justify the investment.

### 3. Context & Opportunity
*   **Market Sizing:** TAM (Total Addressable Market), SAM (Serviceable Available Market), SOM (Serviceable Obtainable Market).
*   **Trends:** "Why now?" (e.g., Regulatory changes, tech adoption curves).
*   **Competitive Landscape:**
    *   Direct Competitors.
    *   Indirect Competitors.
    *   **Our Unfair Advantage:** What makes us defensible?

### 4. Problem Definition (The "Why")
*   **Problem Statement:** Concise definition of the pain point.
*   **Evidence:** User quotes, survey data, market benchmarks.
*   **Root Causes:** Analysis of why this problem exists.

### 5. Target Audience (User Personas)
*   **Primary Persona:** Detailed demographics, behaviors, goals, and frustrations.
*   **Secondary Persona:** Other key stakeholders.
*   **Jobs to be Done (JTBD):** Functional, Emotional, and Social jobs the user hires the product to do.

### 6. Proposed Solution (The "What")
*   **Product Vision:** The detailed description of the product experience.
*   **How it Works:** Step-by-step user journey.
*   **Key Components:**
    *   **AI Agents/Assistants:** Persona, capabilities, tone of voice.
    *   **Interfaces:** Dashboards, Mobile Views, WhatsApp flows.
    *   **Integrations:** APIs (e.g., WhatsApp Business, Stripe).

### 7. Objectives & KPIs
*   **Business Objectives:** MRR, ARR, User Growth (Short, Medium, Long term).
*   **User Objectives:** Time saved, money made, stress reduced.
*   **Product KPIs:** Uptime, Latency, Task Success Rate, NPS.

### 8. Value Proposition & Business Model
*   **Value Prop Canvas:** Customer Pains vs. Gain Creators.
*   **USPs (Unique Selling Propositions):** The "Killer Features".
*   **Unit Economics:** CAC, LTV, Pricing, Margins.

### 9. Functional Requirements
*   **User Stories:** "As a [User], I want [Action] so that [Benefit]."
*   **Acceptance Criteria:** Specific conditions for "Done".
*   **Flows:** Onboarding, Core Usage, Retention loops.
*   Compliance: LGPD/GDPR specific requirements.

### 10. Non-Functional Requirements
*   **Performance:** Speed, Scale requirements.
*   **Security:** Data protection, Authentication.
*   **Compliance:** Legal constraints.

## Best Practices
1.  **"Proof-First" Mindset:** Highlight validation and confidence scores early.
2.  **Visuals over Text:** Use tables for comparisons and landscapes.
3.  **Human-Centric:** Focus heavily on the User Persona and their emotional state (frustrations/desires).
4.  **Living Document:** The PRD evolves with the product.
