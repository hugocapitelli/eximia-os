---
title: "HANDOVER DOCUMENT — The_Veritas"
galaxy: "CORE"
galaxy-color: "#8B3A8B"
document-type: "document"
status: "production"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "handover-document"
  - "handover document — the_verita"
  - "agent: the_veritas v1.0.0"
  - "class: 3 (expert)"
  - "status: production ready"
  - "date: 2026-01-07"
  - "1. executive summary"
  - "key differentiators"
  - "2. technical specifications"
  - "3. file structure"
tags:
  - "galaxy-core"
  - "document"
---

# HANDOVER DOCUMENT — The_Veritas

## Agent: The_Veritas v1.0.0
## Class: 3 (EXPERT)
## Status: PRODUCTION READY
## Date: 2026-01-07

---

## 1. Executive Summary

**The_Veritas** é um agente de pesquisa Tier 3 (Expert) projetado para fornecer **Ground Truth** (verdade fundamental) validada para o ecossistema eximIA.AI.

### Key Differentiators

| Feature | Value |
| :--- | :--- |
| **Anti-Hallucination** | CoVe 4-step process (ICLR 2024) |
| **Source Quality** | 4-tier system, SIFT/CRAAP evaluation |
| **Contradiction Handling** | Explicit protocol, never hidden |
| **Confidence Scoring** | 0-100% with justification |
| **Domain Expertise** | 18 KBs, 65 frameworks |

---

## 2. Technical Specifications

| Spec | Value |
| :---: | :--- |
| **Class** | 3 (EXPERT) |
| **Token Budget** | 18,000 |
| **Knowledge Bases** | 18 |
| **Total Words** | ~45,000 |
| **Frameworks** | 65 |
| **Validation Cases** | 15 |
| **Citation Compliance** | 100% target |

---

## 3. File Structure

```
The_Veritas/
├── 01_spec/
│   ├── spec_tecnica.json
│   ├── META_ANALYSIS.md
│   └── handoff_z1_z2.yaml
│
├── 02_profile/
│   ├── dna_mental.md
│   ├── FRAMEWORK_INDEX.md
│   ├── VOICE_PROFILES.md
│   ├── BIBLIOGRAPHY_RESEARCH.md
│   ├── handoff_z2_z3.yaml
│   └── knowledge_base/
│       ├── KB_01_metodologia_pesquisa.md
│       ├── KB_02_logica_booleana.md
│       ├── KB_03_avaliacao_fontes.md
│       ├── KB_04_vies_cognitivo.md
│       ├── KB_05_estruturacao_dados.md
│       ├── KB_06_dados_financeiros.md
│       ├── KB_07_fontes_agronegocio.md
│       ├── KB_08_anti_alucinacao.md
│       ├── KB_09_redacao_tecnica.md
│       ├── KB_10_etica_pesquisa.md
│       ├── KB_11_modelos_mentais_inteligencia.md
│       ├── KB_12_analise_estatistica.md
│       ├── KB_13_web_scraping_logic.md
│       ├── KB_14_nasa_usda_data.md
│       ├── KB_15_saas_metrics.md
│       ├── KB_16_sat_techniques.md
│       ├── KB_17_first_principles.md
│       └── KB_18_resolucao_contradicoes.md
│
├── 03_prompt/
│   ├── prompt_operacional.md (18K tokens)
│   ├── handoff_z3_z4.yaml
│   └── schemas/
│       ├── input_schema.json
│       └── output_schema.json
│
├── 04_validation/
│   ├── VALIDATION_CASES.yaml
│   ├── COMPARATIVE_ANALYSIS.md
│   └── HANDOVER_DOCUMENT.md
│
└── README.md
```

---

## 4. Integration Instructions

### 4.1 Basic Usage

1. **Load System Prompt**
   - Use `03_prompt/prompt_operacional.md` as system prompt
   - Append relevant KBs from `02_profile/knowledge_base/` as context

2. **Input Format**
   - See `03_prompt/schemas/input_schema.json`
   - Minimum: `{"query": "Your question here"}`

3. **Output Format**
   - See `03_prompt/schemas/output_schema.json`
   - Always includes: summary, sources, confidence_score, methodology

### 4.2 Recommended Stack

| Component | Recommendation |
| :--- | :--- |
| **LLM** | GPT-4o, Claude 3.5, Gemini 1.5 Pro |
| **Context** | 32K+ tokens (for prompt + KBs) |
| **RAG** | Optional for real-time data |
| **API** | JSON output mode |

### 4.3 KB Loading Strategy

| Scenario | KBs to Load |
| :--- | :--- |
| **General** | KB_01, KB_03, KB_08 |
| **Finance/SaaS** | KB_06, KB_12, KB_15 |
| **Agribusiness** | KB_07, KB_14 |
| **Academic** | KB_01, KB_09, KB_10 |
| **Deep Research** | All 18 KBs |

---

## 5. Maintenance Schedule

| Task | Frequency | Owner |
| :--- | :---: | :--- |
| **Update SaaS benchmarks** | Quarterly | Product |
| **Update WASDE/Conab links** | Monthly | Product |
| **Review and add frameworks** | Biannual | Z2 Profiler |
| **Add validation cases** | Biannual | Z4 Validator |
| **Prompt optimization** | Quarterly | Z3 Prompter |

---

## 6. Known Limitations

| Limitation | Mitigation |
| :--- | :--- |
| **Real-time data** | Use RAG or web search integration |
| **Knowledge cutoff** | Monthly KB updates |
| **Latency (CoVe)** | Use `depth: quick` for simple queries |
| **Languages** | Primary PT-BR, EN-US secondary |
| **Domain gaps** | Add new KBs as needed |

---

## 7. Support & Escalation

| Issue | Contact |
| :--- | :--- |
| **Prompt bugs** | Z3_Prompter |
| **KB updates** | Z2_Profiler |
| **Validation failures** | Z4_Validator |
| **Architecture** | Z1_Architect |

---

## 8. Changelog

| Version | Date | Changes |
| :--- | :---: | :--- |
| 1.0.0 | 2026-01-07 | Initial release |

---

## 9. Approval

| Role | Name | Approved |
| :--- | :--- | :---: |
| Z1_Architect | — | ✅ |
| Z2_Profiler | — | ✅ |
| Z3_Prompter | — | ✅ |
| Z4_Validator | — | ✅ |

**Status:** ✅ **PRODUCTION READY**


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->

#galaxy-core