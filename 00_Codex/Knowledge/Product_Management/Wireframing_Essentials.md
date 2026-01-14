# Wireframing Essentials & Best Practices

## Philosophy
Wireframes are the "blueprints" of the product. They prioritize **functionality** and **flow** over aesthetics. In the AI era, wireframes serve as critical visual context for specificing UI generation.

## The Process

### 1. Low-Fidelity (Lo-Fi) - "The Sketch"
*   **Goal:** Validate the concept and layout quickly.
*   **Tools:** Paper, Excalidraw, Balsamiq.
*   **Elements:** Boxes, lines, placeholder text (Lorem Ipsum).
*   **Focus:**
    *   Information Architecture (What goes where?).
    *   Navigation Flow (How do I get from A to B?).
    *   **NO** colors, **NO** images.

### 2. Mid-Fidelity (Mi-Fi) - "The Blueprint"
*   **Goal:** Refine spacing, proportions, and specific component placement.
*   **Tools:** Figma (Wireframe kits), Sketch.
*   **Elements:** Grayscale, real copy (no Lorem Ipsum), rigorous alignment.
*   **Focus:**
    *   Accessibility (Button sizes, contrast logic).
    *   Content hierarchy (H1 vs H2 vs Body).

### 3. High-Fidelity (Hi-Fi) - "The Mockup" (Optional in Wireframing)
*   **Goal:** Visual signed-off before code.
*   **Tools:** Figma, Penpot.
*   **Elements:** Brand colors, shadows, typography, actual images.
*   **Note:** Often merged with the final UI Design phase.

## Best Practices for AI-Driven Prototyping
When building wireframes to be consumed by AI Agents (like `generate_image` or coding bots):
1.  **Annotation is Key:** Label every component clearly (e.g., "Authentication Button", "Hero Section").
2.  **Semantic Structure:** Ensure the visual hierarchy implies the HTML structure (Header at top, clearly defined Sections).
3.  **Standard Patterns:** Use recognizable UI patterns (Burger menu, Cards, Modals) that AI models have been trained on.

## Checklist
- [ ] Does this screen solve the User Story?
- [ ] Is the primary call-to-action (CTA) obvious?
- [ ] Is the navigation consistent?
- [ ] Are we using real text to test content fit?
