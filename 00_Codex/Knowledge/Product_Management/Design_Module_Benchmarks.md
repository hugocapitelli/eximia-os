# Design Module: UI Benchmarks & Aesthetics (2026 Ready)

## Purpose
This module equips the Prototyping Agent with design literacy. Even without generating pixel-perfect UI code, the agent must *describe* and *blueprint* interfaces using modern, premium aesthetic vocabularies.

## 1. Core Design Philosophy: "Premium Utility"
*   **Minimalism:** Remove non-essential elements. "If it doesn't help the user decide or act, delete it."
*   **Utility-First:** Aesthetics must serve function. Beautiful buttons are useless if they aren't clickable.
*   **Mobile-First Root:** All designs must be conceived for a 360px width first, then expanded to desktop.

## 2. Benchmark Styles (The "Look & Feel")

### A. The "Glassmorphism 2.0" (Refined Depth)
*   **Concept:** Layered interface with translucent backgrounds, giving a sense of optical depth.
*   **Best for:** Overlays, Modals, Floating Actions, Dashboards.
*   **Key Traits:**
    *   `backdrop-filter: blur(12px)`
    *   Subtle white borders (1px, 20% opacity) for separation.
    *   Soft shadows to lift elements off the "base" layer.
*   **Prototyping Keywords:** "Frosted Glass", "Depth", "Layered", "Translucent".

### B. The "Bento Grid" (Modular & Bento)
*   **Concept:** Content organized in a responsive grid of distinct, rounded-corner boxes (like a Bento box).
*   **Best for:** Dashboards, Feature Showcases, Analytics, Landing Pages.
*   **Key Traits:**
    *   Highly modular (blocks can be 1x1, 2x1, 2x2).
    *   Consistent gaps (e.g., 16px or 24px) between all blocks.
    *   Content fits perfectly inside each tile.
*   **Prototyping Keywords:** "Modular", "Grid", "Tile-based", "Apple-style widgets".

### C. "Clean SaaS" (Minimal CRM)
*   **Concept:** Focus on data legibility, high whitespace, and distraction-free workflows.
*   **Best for:** CRMs, Table Views, Settings, Complex Forms.
*   **Key Traits:**
    *   **Typography:** Inter or San Francisco. Large headings, legible body text.
    *   **Color:** Monochromatic base with 1 accent color (e.g., "Blurple" or "Teal").
    *   **Contrast:** High contrast text on soft gray backgrounds.
*   **Prototyping Keywords:** "Stripe-like", "Linear-like", "High legibility", "Whitespace".

## 3. Mobile-First Patterns
*   **Bottom Navigation:** Primary actions within thumb reach (bottom 30% of screen).
*   **Card-Based Lists:** Tables are terrible on mobile. Convert rows into Cards.
*   **Big Tap Targets:** Buttons must be at least 44px height.

## 4. Interaction Primitives (Micro-interactions)
*   **Hover:** Subtle lift or brightness increase.
*   **Active:** Scale down (0.98) on click (tactile feel).
*   **Loading:** Skeleton screens (shimmer) instead of spinners.

## Agent Instruction for Wireframing
When creating wireframes, explicit design direction is required:
> "Wireframe a **Bento Grid Dashboard** for the Sales Overview. Use **Glassmorphism** for the floating 'Add New Deal' button. Ensure the layout is **Mobile-Responsive** (stacking text tiles)."
