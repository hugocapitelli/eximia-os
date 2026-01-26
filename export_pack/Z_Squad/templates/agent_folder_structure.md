# Agent Folder Structure — Z Squad Standard

## 📁 Estrutura Padrão

Todo agente criado pelo Z Squad deve seguir esta estrutura de pastas:

```
outputs/
└── {Agent_Name}/
    │
    ├── 📋 README.md              # Guia rápido do agente (gerado pelo Z Squad)
    │
    ├── 01_spec/                  # Z1 Architect outputs
    │   ├── spec_tecnica.json     # Especificação técnica
    │   └── handoff_z1_z2.yaml    # Handoff para Z2
    │
    ├── 02_profile/               # Z2 Profiler outputs
    │   ├── dna_mental.md         # DNA Mental
    │   ├── style_guide.md        # Guia de estilo (opcional)
    │   ├── knowledge_base/       # Base de conhecimento
    │   │   ├── kb_index.md       # Índice da KB
    │   │   └── *.md              # Arquivos de referência
    │   └── handoff_z2_z3.yaml    # Handoff para Z3
    │
    ├── 03_prompt/                # Z3 Engineer outputs
    │   ├── prompt_operacional.md # System prompt final
    │   ├── schemas/
    │   │   ├── input_schema.json
    │   │   └── output_schema.json
    │   └── handoff_z3_z4.yaml    # Handoff para Z4
    │
    ├── 04_validation/            # Z4 Auditor outputs
    │   ├── validation_report.md  # Relatório de validação
    │   ├── test_results/         # Logs de testes (opcional)
    │   │   └── *.json
    │   └── quality_checklist.md  # Checklist 10-point (opcional)
    │
    └── 05_production/            # Z5 Evolver / Deploy
        ├── deploy_config.yaml    # Config de deploy (opcional)
        └── changelog.md          # Histórico de versões
```

## 🏷️ Convenções de Nomenclatura

| Tipo | Formato | Exemplo |
| :--- | :--- | :--- |
| Pasta do agente | `PascalCase` | `CFO_Agent`, `Marketing_Director` |
| Arquivos principais | `snake_case.ext` | `spec_tecnica.json` |
| Handoffs | `handoff_zN_zM.yaml` | `handoff_z1_z2.yaml` |
| KBs | `kb_*.md` | `kb_valuation.md` |

## 🔢 Numeração de Pastas

A numeração `01_`, `02_`, etc. garante:
- Ordenação consistente em qualquer file explorer
- Clareza sobre qual módulo Z produziu cada output
- Facilidade de navegação

## 📝 README.md Padrão

Cada agente deve ter um `README.md` na raiz com:

```markdown
# {Agent Name} v{version}

**Status:** {draft | validated | production}
**Score:** {X.X}/10
**Criado em:** {YYYY-MM-DD}

## Quick Start
[Como usar o agente em 3 passos]

## Competências
- [Lista de competências]

## Arquivos Importantes
- `03_prompt/prompt_operacional.md` — O prompt para usar
- `02_profile/dna_mental.md` — Personalidade do agente
- `04_validation/validation_report.md` — Resultado da validação

## Clones Mentores
- [Lista de clones]

## Limitações
- [O que o agente NÃO faz]
```

## ✅ Checklist de Completude

| Pasta | Arquivo | Obrigatório? |
| :--- | :--- | :---: |
| / | README.md | ✅ |
| 01_spec | spec_tecnica.json | ✅ |
| 02_profile | dna_mental.md | ✅ |
| 02_profile/knowledge_base | ≥1 arquivo | ✅ |
| 03_prompt | prompt_operacional.md | ✅ |
| 03_prompt/schemas | input_schema.json | ✅ |
| 03_prompt/schemas | output_schema.json | ✅ |
| 04_validation | validation_report.md | ✅ |


---


<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->


## 🧠 Obsidian Connections


**Family:** [[Agentes]]


<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->