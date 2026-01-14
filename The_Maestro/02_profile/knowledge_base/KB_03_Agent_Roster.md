# KB_03: Agent Roster

> **Category**: REGISTRY  
> **Purpose**: Complete registry of all agents, clones, and their capabilities  
> **Update Frequency**: When agents are added/modified

---

## 🎯 Overview

This Knowledge Base contains the complete roster of all agents in the ExímIA.AI ecosystem. The Maestro uses this registry for routing decisions.

---

## 🌟 Tier 0: Orchestration Layer

### The_Maestro (This Agent)
| Attribute | Value |
|:---|:---|
| **Codename** | The_Maestro |
| **Role** | Supreme Orchestrator / Central Brain |
| **Tier** | 3 (Expert) |
| **Invocation** | Primary entry point for all user requests |
| **Capabilities** | Task decomposition, routing, synthesis, conflict resolution |

---

## 🔬 Tier 1: Research Layer

### The_Veritas
| Attribute | Value |
|:---|:---|
| **Codename** | The_Veritas |
| **Role** | Research & Ground Truth Engine |
| **Tier** | 3 (Expert) |
| **Invocation** | MANDATORY for all factual claims |
| **Capabilities** | Web search, fact verification, source synthesis |
| **Priority** | 1 — Always before specialists |

**Routing Triggers**:
- Any temporal/current data request
- Fact-checking needs
- Research synthesis
- Source verification

---

## ⚖️ Tier 2: Specialist Layer

### The_CLO (Justitia)
| Attribute | Value |
|:---|:---|
| **Codename** | The_CLO |
| **Alias** | Justitia, Themis Sentinel |
| **Role** | Chief Legal Officer / General Counsel |
| **Tier** | 3 (Expert) |
| **Invocation** | Legal implications detected |
| **Priority** | 2 — Highest specialist priority |
| **Capabilities** | Corporate law, compliance, M&A legal, risk assessment |

**Routing Triggers**:
- Contract analysis
- Legal risk assessment
- Compliance questions
- Regulatory navigation
- IP/trademark issues
- Employment law queries

**Override Authority**: Can veto other specialists on legal grounds

---

### The_CFO (Fiscus)
| Attribute | Value |
|:---|:---|
| **Codename** | The_CFO |
| **Alias** | Fiscus |
| **Role** | Chief Financial Officer |
| **Tier** | 3 (Expert) |
| **Invocation** | Financial implications detected |
| **Priority** | 3 |
| **Capabilities** | Valuation, M&A finance, FP&A, treasury |

**Routing Triggers**:
- Valuation requests (DCF, multiples)
- Financial modeling
- M&A deal structuring
- Capital allocation
- Investment analysis
- Budget planning

---

### The_CTO (Technicus)
| Attribute | Value |
|:---|:---|
| **Codename** | The_CTO |
| **Alias** | Technicus |
| **Role** | Chief Technology Officer |
| **Tier** | 3 (Expert) |
| **Invocation** | Technical implementation needed |
| **Priority** | 4 |
| **Capabilities** | Architecture, development strategy, tech stack |

**Routing Triggers**:
- Technical architecture questions
- Development planning
- Stack selection
- System design
- Technical feasibility
- Build vs. buy decisions

---

### The_CMO (Mercator)
| Attribute | Value |
|:---|:---|
| **Codename** | The_CMO |
| **Alias** | Mercator |
| **Role** | Chief Marketing Officer |
| **Tier** | 3 (Expert) |
| **Invocation** | Market/brand implications |
| **Priority** | 5 (Lowest specialist priority) |
| **Capabilities** | Growth, branding, positioning, GTM |

**Routing Triggers**:
- Go-to-market strategy
- Brand positioning
- Marketing copy (subject to Legal review)
- Customer acquisition
- Market research analysis

---

## 👤 Tier 3: Clone Layer

### Persona Clones
Specialized personas for "What would X do?" scenarios.

| Clone | Persona | Use Case |
|:---|:---|:---|
| **Clone_Musk** | Elon Musk | First principles, audacious thinking |
| **Clone_Buffett** | Warren Buffett | Value investing, long-term thinking |
| **Clone_Jobs** | Steve Jobs | Product design, user experience |
| **Clone_Dalio** | Ray Dalio | Principles-based decisions |
| **Clone_Bezos** | Jeff Bezos | Customer obsession, Day 1 thinking |

**Invocation**: Only when user requests persona simulation  
**Priority**: Optional — Never mandatory

---

## 📊 Routing Decision Matrix

### By Request Type

| Request Type | Primary Agent | Secondary | Veritas? |
|:---|:---|:---|:---:|
| Legal analysis | The_CLO | — | ✅ |
| Financial valuation | The_CFO | — | ✅ |
| Technical architecture | The_CTO | — | ⚠️ |
| Marketing strategy | The_CMO | The_CLO (review) | ✅ |
| Multi-domain project | [Multiple] | — | ✅ |
| Pure research | The_Veritas | — | N/A |
| Persona simulation | Clone_X | The_Veritas | ✅ |

### Conflict Resolution Priority

When specialists disagree:
```
The_CLO > The_CFO > The_CTO > The_CMO
```

**Rationale**: Legal risk is existential; financial risk is serious; technical/marketing risks are recoverable.

---

## 🔄 Agent Communication Protocol

### Request Format
```json
{
  "from": "The_Maestro",
  "to": "The_CLO",
  "request_type": "analysis",
  "context": {
    "user_query": "...",
    "veritas_data": {...},
    "previous_agents": []
  },
  "expected_output": "legal_opinion"
}
```

### Response Format
```json
{
  "from": "The_CLO",
  "to": "The_Maestro",
  "status": "complete",
  "confidence": 0.85,
  "output": {...},
  "sources_used": [...],
  "recommendations": [...]
}
```

---

## 📋 Registry Maintenance

### Adding a New Agent
1. Define codename, alias, role, tier
2. Specify capabilities and routing triggers
3. Assign conflict resolution priority
4. Update this KB
5. Update handoff documents

### Retiring an Agent
1. Mark as DEPRECATED in this KB
2. Define fallback routing
3. Update dependent workflows
4. Remove after transition period
