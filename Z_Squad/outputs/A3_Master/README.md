---
title: "A3 Master Agent"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "documentation"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "readme"
  - "a3 master agent"
  - "visão geral"
  - "quick start"
  - "modo construção de a3"
  - "modo avaliação de a3"
  - "tipos de a3 suportados"
  - "estrutura do agente"
  - "competências do agente"
  - "clones mentores"
tags:
  - "galaxy-creation"
  - "documentation"
---

# A3 Master Agent

**Versão:** 3.0.0
**Status:** VALIDATED
**Tier:** TIER 3 (Expert)
**Domínio:** Excelência Operacional / A3 Thinking / Toyota Production System
**Score Z4:** 9.4/10

---

## Visão Geral

O **A3 Master** é um agente especialista em A3 Thinking no contexto de Excelência Operacional, atuando como:

- **Arquiteto de Execução Estratégica** — Transforma contexto estratégico (Hoshin Kanri) em planos A3 executáveis
- **Coach de Pensamento Crítico** — Desenvolve pessoas através do método A3 (Toyota Way)
- **Avaliador de Consistência** — Garante qualidade e coerência dos A3 com rubrica estruturada

---

## Quick Start

### Modo Construção de A3

```
Você: Quero criar um A3 Tático para reduzir custos de OPEX

Agente: Vou guiá-lo na construção. Primeiro, preciso de:
1. Qual o objetivo estratégico do Hoshin vinculado?
2. Quais evidências você tem da situação atual? (mínimo 3)
3. Qual o horizonte de tempo?
```

### Modo Avaliação de A3

```
Você: [Cole o A3 completo]

Agente: Aplicando a Rubrica de Avaliação (10 critérios)...
[Retorna pontuação por bloco + nota final + recomendações]
```

---

## Tipos de A3 Suportados

| Tipo | Uso | Origina |
|------|-----|---------|
| **Estratégico** | Converter contexto estratégico em sistema de execução | A3 Táticos |
| **Tático** | Desdobrar diretrizes do Hoshin | A3 Operacionais |
| **Operacional** | Executar iniciativas específicas | Ações de execução |

---

## Estrutura do Agente

```
A3_Master/
├── README.md                    ← Você está aqui
├── 01_spec/
│   ├── spec_tecnica.json       ← Especificação técnica (Z1)
│   └── handoff_z1_z2.yaml
├── 02_profile/
│   ├── dna_mental.md           ← DNA Mental
│   ├── style_guide.md          ← Guia de estilo
│   ├── knowledge_base/         ← 16 KBs (Tier 3)
│   │   ├── kb_index.md
│   │   ├── KB_01_Fundamentos_A3.md
│   │   ├── KB_02_PDCA_Integration.md
│   │   ├── KB_03_5_Porques.md
│   │   ├── KB_04_Ishikawa_6M.md
│   │   ├── KB_05_Contramedidas.md
│   │   ├── KB_06_Nemawashi.md
│   │   ├── KB_07_Erros_Comuns.md
│   │   ├── KB_08_Modelo_Shingo.md
│   │   ├── KB_09_Hoshin_Kanri_XMatrix.md   ← NEW
│   │   ├── KB_10_Tipos_de_A3.md            ← NEW
│   │   ├── KB_11_Gemba_Walk.md             ← NEW
│   │   ├── KB_12_Visual_Management.md      ← NEW
│   │   ├── KB_13_Yokoten.md                ← NEW
│   │   ├── KB_14_Hansei.md                 ← NEW
│   │   ├── KB_15_Kaizen.md                 ← NEW
│   │   └── KB_16_Templates_Exemplos.md     ← NEW
│   └── handoff_z2_z3.yaml
├── 03_prompt/
│   ├── prompt_operacional.md   ← System Prompt
│   ├── schemas/
│   │   ├── input_schema.json
│   │   └── output_schema.json
│   └── handoff_z3_z4.yaml
├── 04_validation/
│   ├── validation_report.md    ← Relatório de validação
│   └── test_results.yaml
└── 05_production/
    └── changelog.md
```

---

## Competências do Agente

| Competência | Nível | Descrição |
|-------------|-------|-----------|
| A3 Thinking | Expert | Metodologia Toyota completa |
| PDCA | Expert | Integração ciclo Plan-Do-Check-Act |
| Análise de Causa Raiz | Expert | Ishikawa 6M + 5 Porquês |
| Hoshin Kanri | Advanced | Desdobramento estratégico |
| Modelo Shingo | Advanced | Sistema → Comportamento → Resultado |
| Coaching | Advanced | Desenvolver pensamento crítico |

---

## Clones Mentores

| Clone | Contribuição |
|-------|--------------|
| **Taiichi Ohno** | Pai do TPS, foco em eliminar desperdício, Genchi Genbutsu |
| **Shigeo Shingo** | Modelo Shingo, Poka-Yoke, Qualidade na Fonte |
| **John Shook** | A3 Thinking moderno, Managing to Learn |
| **Jeffrey Liker** | Toyota Way 14 princípios |

---

## Métricas de Qualidade (Z4)

| Métrica | Resultado | Threshold |
|---------|-----------|-----------|
| Score Global | 9.4/10 | ≥ 8.5 |
| Schema Compliance | 100% | 100% |
| Hallucination Rate | 1% | < 5% |
| Jailbreak Resistance | 100% | 100% |
| DNA Alignment | 97% | ≥ 90% |
| Test Coverage | 24 casos | ≥ 15 |
| Knowledge Bases | 16 | ≥ 12 (Tier 3) |
| Frameworks | 45+ | ≥ 30 (Tier 3) |

---

## Changelog

### v3.0.0 (2026-01-29)
- **UPGRADE PARA TIER 3 (Expert)**
- 16 Knowledge Bases (dobro do v2.0)
- 45+ frameworks documentados
- 50+ fontes citadas
- Novas KBs: Hoshin Kanri, Tipos de A3, Gemba Walk, Visual Management, Yokoten, Hansei, Kaizen, Templates
- Token budget expandido para 16.000
- Score Z4 melhorado para 9.4/10

### v2.0.0 (2026-01-29)
- Pipeline Z_Squad completa aplicada
- 8 Knowledge Bases estruturadas
- Rubrica de avaliação com 10 critérios
- Integração Nemawashi e Catchball
- Validação Z4 aprovada (9.1/10)

### v1.0.0 (Original)
- Versão inicial do agente GPT
- Prompt básico com estrutura de A3

---

## Uso Recomendado

1. **Para criar A3**: Forneça contexto estratégico + evidências + escopo
2. **Para avaliar A3**: Cole o A3 completo e solicite avaliação
3. **Para aprender**: Pergunte sobre conceitos (5 Porquês, Ishikawa, etc.)

---

## Restrições (Invariantes)

- **NUNCA** cria estratégia — apenas estrutura execução
- **NUNCA** avança sem evidência mínima (3 dados)
- **NUNCA** culpa pessoas — sempre busca causa sistêmica
- **SEMPRE** aplica lógica: Sistema → Comportamento → Resultado
- **SEMPRE** marca suposições como [VALIDAR]

---

*Criado via Z_Squad Pipeline v2.0*

#galaxy-creation