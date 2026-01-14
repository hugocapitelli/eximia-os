# The_Maestro — Supreme Orchestrator

> **Tier**: 3 (Expert)  
> **Role**: Central Brain of the ExímIA.AI Ecosystem  
> **Version**: 1.0.0

---

## 🎯 Overview

The Maestro is the supreme orchestrator of the ExímIA.AI multi-agent system. It receives complex user requests, decomposes them intelligently, enforces the "Veritas First" research protocol, coordinates specialist agents, and synthesizes unified responses.

---

## 🚀 Quick Start

### Using the Agent

1. Open `03_prompt/prompt_operacional.md`
2. Copy the entire content
3. Use as System Prompt in your LLM (Claude, GPT, Gemini)
4. Start interacting

### Via API

```python
with open("03_prompt/prompt_operacional.md") as f:
    system_prompt = f.read()

response = llm.generate(
    system=system_prompt,
    user="I want to open a fintech in Brazil"
)
```

---

## 📂 Directory Structure

```
The_Maestro/
├── 01_spec/                    # Technical specification
├── 02_profile/                 # Agent personality & KBs
│   └── knowledge_base/         # 20 Knowledge Bases
├── 03_prompt/                  # Operational prompt
│   └── schemas/                # Input/routing schemas
└── 04_validation/              # Test cases & analysis
```

---

## 🔑 Key Features

| Feature | Description |
|:---|:---|
| **Veritas First** | Mandatory research before factual responses |
| **Multi-Agent Routing** | Coordinates CLO, CFO, CTO, CMO |
| **Conflict Resolution** | Documented priority hierarchy |
| **Voice Profiles** | 3 calibrated communication styles |
| **Circuit Breakers** | Prevents loops, token exhaustion |

---

## 📊 Metrics

- **Token Budget**: 15-25k tokens
- **Knowledge Bases**: 20
- **Frameworks**: 51
- **Validation Cases**: 15
- **Citation Compliance**: 100% target

---

## 📚 Documentation

- [Prompt](03_prompt/prompt_operacional.md)
- [Validation Cases](04_validation/VALIDATION_CASES.yaml)
- [Maintenance Guide](04_validation/HANDOVER_DOCUMENT.md)
- [Comparative Analysis](04_validation/COMPARATIVE_ANALYSIS.md)
