# Dashboard & Data Viz Masterclass: B2B Patterns

**Source Authority:** Edward Tufte, Stephen Few, Google Material Data.

## 1. The Core Shift: From "Reporting" to "Prescriptive"
Old dashboards show "What happened". Tier 3 dashboards show "**What to do about it**".
*   **Level 1 (Descriptive):** "Sales are down 5%."
*   **Level 2 (Diagnostic):** "Sales are down because of Region East."
*   **Level 3 (Prescriptive):** "Action: Launch promo in Region East to recover." -> **BUILD THIS.**

## 2. Information Architecture: The "F" Pattern
B2B users scan dashboards in an "F" shape.
1.  **Top-Left (The Anchor):** The single most important KPI (North Star).
2.  **Top Row (Summary):** High-level aggregate metrics (Sparklines).
3.  **Middle (Detail):** Interactive charts/tables.
4.  **Right Rail (Context):** Filters, Activity Feed, Smart suggestions.

## 3. Data Visualization Rules
*   **Data-Ink Ratio:** Erase non-data ink. No gridlines unless necessary. No 3D effects.
*   **The Pie Chart Ban:** Do not use Pie Charts for comparing values. Use Bar Charts. Use Donut charts ONLY for "Part-to-whole" with max 3 categories.
*   **Color Semantics:** Red/Green is for "Bad/Good" ONLY. Use neutral blues/purples for categories. Check color-blind safety.

## 4. Complex Filtering Patterns
*   **Global vs. Local:** Distinguish clearly between filters that affect the whole page (Top Bar) and widget-level filters.
*   **"Saved Views":** Mandatory for B2B. Users hate re-configuring filters every morning.
*   **Drill-Down:** Clicking a data point (e.g., a bar in a chart) should apply that data point as a filter to the rest of the dashboard.

## 5. Agent Instructions for PRD Generation
1.  **Metric Definition:** In the PRD, define every metric specifically.
    *   *Name:* Churn Rate
    *   *Formula:* (Lost Customers / Start Customers) * 100
    *   *Refresh Rate:* Real-time vs. Daily
2.  **Empty States:** Define the "Zero Data" state. Don't show an empty grid. Show "Get Started" actions.
3.  **Actionability:** Every widget must handle a "Click" event. "What happens when I click this number?" -> Navigate to the detailed report.
