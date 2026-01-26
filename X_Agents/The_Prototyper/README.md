# The_Prototyper (ProtoOS)

> *"A good PRD doesn't describe a solution—it captures a problem so well that the solution becomes inevitable."*

**Status**: ✅ Production | **Score**: 9.2/10 | **Tier**: Executive | **Version**: 1.0.0

---

## Overview

**The_Prototyper (ProtoOS)** is an expert Product Management agent specialized in creating high-quality product documentation and prototypes. Built with the combined wisdom of Marty Cagan, Teresa Torres, Ken Norton, and Ryan Singer.

### Core Competencies

| Competency | Proficiency | Description |
|------------|-------------|-------------|
| PRD Development | Expert | Comprehensive Product Requirements Documents |
| PRP Creation | Expert | Product Requirement Prompts for AI-assisted dev |
| Wireframing | Advanced | ASCII/text-based wireframes with annotations |
| RICE Prioritization | Expert | Feature prioritization and roadmap planning |
| Customer Discovery | Advanced | Interview analysis and insight extraction |
| Success Metrics | Expert | KPI design and measurement frameworks |

---

## Quick Start

### Using the System Prompt

Copy the content from `03_prompt/prompt_operacional.md` as your system prompt.

### Example Interactions

**Creating a PRD:**
```
Create a PRD for user authentication with email/password and social login
```

**Creating a PRP:**
```
Create a PRP for implementing a React login component
```

**Creating a Wireframe:**
```
Create a wireframe for a dashboard with metrics cards and a data table
```

**Prioritizing Features:**
```
Prioritize these features using RICE:
- Dark mode (2000 users, medium impact, high confidence, small effort)
- API v2 (5000 users, high impact, medium confidence, large effort)
```

**Analyzing Interviews:**
```
Analyze this customer interview transcript: [paste transcript]
```

---

## Architecture

```
The_Prototyper/
├── README.md                    # This file
├── 01_spec/                     # Z1 Architect outputs
│   ├── spec_tecnica.json        # Technical specification
│   └── handoff_z1_z2.yaml       # Handoff to Z2
├── 02_profile/                  # Z2 Profiler outputs
│   ├── dna_mental.md            # Mental DNA & cognitive architecture
│   ├── style_guide.md           # Communication patterns
│   ├── handoff_z2_z3.yaml       # Handoff to Z3
│   └── knowledge_base/          # Domain knowledge
│       ├── kb_index.md          # KB index
│       ├── KB_01_PRD_Templates.md
│       ├── KB_02_PRP_Structure.md
│       ├── KB_03_RICE_Prioritization.md
│       ├── KB_04_Customer_Discovery.md
│       └── KB_05_Wireframing.md
├── 03_prompt/                   # Z3 Engineer outputs
│   ├── prompt_operacional.md    # ⭐ MAIN SYSTEM PROMPT
│   ├── handoff_z3_z4.yaml       # Handoff to Z4
│   └── schemas/
│       ├── input_schema.json    # Input validation schema
│       └── output_schema.json   # Output validation schema
├── 04_validation/               # Z4 Auditor outputs
│   ├── validation_report.md     # Audit findings & decision
│   └── test_results.yaml        # Detailed test results
└── 05_production/               # Z5 Evolver outputs
    ├── deploy_config.yaml       # Deployment configuration
    └── changelog.md             # Version history
```

---

## The ProtoOS Logic Loop

Every request is processed through this 4-step framework:

```
┌─────────────────────────────────────────────────────┐
│              PROTOOS LOGIC LOOP                     │
├─────────────────────────────────────────────────────┤
│  1. PROBLEM VALIDATION  → "What pain are we solving?"│
│  2. SCOPE DEFINITION    → "What's IN and OUT?"      │
│  3. SUCCESS CRITERIA    → "How do we know it worked?"│
│  4. SOLUTION ARTICULATION → "What's the minimum?"   │
└─────────────────────────────────────────────────────┘
```

### Circuit Breakers

The agent will pause and ask clarifying questions when it detects:

| Trigger | Detection |
|---------|-----------|
| 🔴 VAGUE PROBLEM | Cannot articulate problem in 1-2 sentences |
| 🔴 SOLUTION-FIRST | User describes solution without problem |
| 🔴 INFINITE SCOPE | No constraints provided |
| 🟡 VANITY METRICS | KPIs that don't indicate real value |
| 🟡 LOW CONFIDENCE | Many unvalidated assumptions |

---

## Knowledge Base Summary

| KB | Topic | Frameworks Covered |
|----|-------|-------------------|
| KB-01 | PRD Templates | Standard PRD, One-Page, Feature Brief, Agile Epic |
| KB-02 | PRP Structure | Context framing, Constraints, Validation criteria |
| KB-03 | Prioritization | RICE, Value/Effort Matrix, MoSCoW, Kano |
| KB-04 | Discovery | Interview Guide, JTBD, Opportunity Solution Trees |
| KB-05 | Wireframing | Breadboarding, ASCII templates, Flow diagrams |

---

## Mentor DNA

| Mentor | Contribution |
|--------|--------------|
| **Marty Cagan** | Product discovery, empowered teams, opportunity assessment |
| **Teresa Torres** | Continuous discovery, OSTs, interview techniques |
| **Ken Norton** | PRD craft, acceptance criteria, PM fundamentals |
| **Ryan Singer** | Shaping, breadboarding, appetite-based scoping |

---

## Validation Summary

| Metric | Score | Threshold |
|--------|-------|-----------|
| Global Score | 9.2/10 | ≥8.5 |
| Schema Compliance | 100% | 100% |
| DNA Alignment | 92% | ≥90% |
| Hallucination Rate | 2% | <5% |
| Jailbreak Resistance | 100% | 100% |

**Status**: ✅ APPROVED (Unconditional)

---

## Languages

- **Portuguese (BR)**: Full support
- **English**: Full support
- **Technical Terms**: Maintained in English (PRD, KPI, RICE, MVP, etc.)

---

## Version History

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2026-01-11 | Initial release |

---

## Next Review

**Scheduled**: 2026-04-11 (90 days from deployment)

**Planned Improvements**:
- Enhanced wireframe state documentation
- Improved interview gap detection
- Additional prioritization frameworks (ICE, WSJF)

---

## Created By

**Z Squad Elite Multiagent Factory v2.0**

- Z1_Architect → Technical Specification
- Z2_Profiler → Mental DNA & Knowledge Base
- Z3_Engineer → System Prompt & Schemas
- Z4_Auditor → Validation & Testing
- Z5_Evolver → Production & Monitoring

---

*ProtoOS — Transforming visions into actionable product documentation*


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->