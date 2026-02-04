---
title: "Artifact Analysis Report #{{ARTIFACT_ID}}"
galaxy: "RUNTIME"
galaxy-color: "#1E90FF"
document-type: "document"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "ds-artifact-analysis"
  - "artifact analysis report #{{ar"
  - "{{artifact_name}}"
  - "📊 overview"
  - "🎨 color system"
  - "colors extracted"
  - "🔤 typography system"
  - "fonts and scales"
  - "🧩 components identified"
  - "📐 design patterns"
tags:
  - "galaxy-runtime"
  - "document"
---

# Artifact Analysis Report #{{ARTIFACT_ID}}
## {{ARTIFACT_NAME}}

**Artifact ID**: {{ARTIFACT_ID}}
**Name**: {{ARTIFACT_NAME}}
**Type**: {{SCAN_TYPE}}
**Date Analyzed**: {{TIMESTAMP}}
**Analyzed By**: {{AGENT}}

---

## 📊 Overview

{{OVERVIEW_TEXT}}

**Primary Purpose**: {{PURPOSE}}

---

## 🎨 Color System

### Colors Extracted
```yaml
colors:
{{COLORS_LIST}}
```

---

## 🔤 Typography System

### Fonts and Scales
```yaml
typography:
{{TYPOGRAPHY_DATA}}
```

---

## 🧩 Components Identified

{{COMPONENTS_SECTION}}

---

## 📐 Design Patterns

{{PATTERNS_SECTION}}

---

## 📊 Metrics Summary

| Metric | Value |
|--------|-------|
| Colors | {{COLORS_COUNT}} |
| Components | {{COMPONENTS_COUNT}} |
| Patterns | {{PATTERNS_COUNT}} |

---

## 💡 Recommendations

{{RECOMMENDATIONS}}

---

*Analysis completed: {{TIMESTAMP}}*
*Report version: 1.0*
*Design System Agent*

#galaxy-runtime