# PRD — Course Designer
**Agent:** X_Agents/Course_Designer
**Versão:** 1.0
**Data:** 26 Janeiro 2026
**Status:** 📋 **ESPECIFICADO** — Pronto para Desenvolvimento

---

## Sumário Executivo

> **STRATEGIC:** Course_Designer é um X_Agent reutilizável que combina as melhores práticas de ELC_Architect, LXD_Architect e David Kolb para criar arquiteturas de cursos completos baseadas em aprendizado experiencial.

**Filosofia:** *"Um curso bem arquitetado é invisível — o aluno só sente o aprendizado fluir."*

**Diferencial:** Único agent que combina o modelo ELC+ 2026 (6 estágios) com frameworks corporativos (ADDIE, SAM, Action Mapping) e avaliação Kirkpatrick 4+1.

**Estratégia de Produto:** Course_Designer é reusável across products (Harven.AI, StratOS, futuras ventures), gerando blueprints em JSON que podem ser consumidos por orchestrators específicos de cada produto.

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Competências Combinadas](#2-competências-combinadas)
3. [Modelo Central: ELC+ 2026](#3-modelo-central-elc-2026)
4. [Frameworks Suportados](#4-frameworks-suportados)
5. [Input/Output Schema](#5-inputoutput-schema)
6. [Knowledge Bases](#6-knowledge-bases)
7. [Validation Criteria](#7-validation-criteria)
8. [Integration Points](#8-integration-points)
9. [Implementation Plan](#9-implementation-plan)
10. [Success Metrics](#10-success-metrics)

---

# 1. Visão Geral

## 1.1 Por Que Course_Designer Existe

A maioria dos course creators foca em conteúdo, não em arquitetura de aprendizado:
- Organizam conteúdo linearmente
- Ignoram estilos de aprendizagem
- Não planejam avaliação sistemática
- Tratam módulos como caixas independentes

**Course_Designer inverte isso.**

```
┌─────────────────────────────────────────────────────────────────┐
│           CURSO TRADICIONAL vs COURSE_DESIGNER                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tradicional                    Course_Designer                  │
│  ────────────                   ───────────────                  │
│  Conteúdo primeiro         →    Objetivos primeiro              │
│  Estrutura linear          →    Ciclo experiencial              │
│  Um estilo de ensino       →    4 estilos de aprendizagem       │
│  Avaliação ad-hoc          →    Kirkpatrick 4+1 estruturado     │
│  Módulos independentes     →    Sequência com pré-requisitos    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 Posicionamento no Ecossistema

Course_Designer é um **X_Agent** — tactical specialist — que:
- ✅ É reutilizável across products (Harven.AI, StratOS, future)
- ✅ Gera outputs agnósticos (JSON blueprint)
- ✅ É testável isoladamente (Z4_Auditor)
- ✅ Pode ser vendido standalone (B2B)

## 1.3 Casos de Uso

| Cliente | Necessidade | Output Course_Designer |
|---------|-------------|------------------------|
| **Harven.AI** | Curso de 12 semanas para MBA | Blueprint → Academy_Orchestrator → Socratic Q&A |
| **StratOS** | Training de OKRs para equipe | Blueprint → Strategy training module |
| **Universidade** | Disciplina semestral (60h) | Blueprint → LMS export (Moodle/Canvas) |
| **Consultoria** | Workshop corporativo (2 dias) | Blueprint → Facilitator guide |

## 1.4 UI/UX Inspiration (LendárIA.OS by Alan)

**Baseado nos screenshots do demo (26/01/2026):**

### Dashboard Metrics

```
┌────────────────────────────────────────────────────────────────┐
│  COURSE CREATOR — GESTOR DE CONTEÚDO EDUCACIONAL              │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ CURSOS   │  │  TOTAL   │  │  HORAS   │  │  ALUNOS  │      │
│  │ ATIVOS   │  │   DE     │  │   DE     │  │ IMPACTA- │      │
│  │          │  │ LIÇÕES   │  │ CONTEÚDO │  │   DOS    │      │
│  │    8     │  │   161    │  │  28.8h   │  │   3.2k   │      │
│  │ +25%↑    │  │   +5↑    │  │  -0%     │  │  +95%↑   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└────────────────────────────────────────────────────────────────┘
```

### Production Pipeline (7 Stages)

```
BRIEFING → PESQUISA → CURRÍCULO → GERAÇÃO → VALIDAÇÃO → PRODUÇÃO → PUBLICADO
   8          3           1           2          8           4         12
```

**Detalhes observados:**
- Pipeline horizontal com checkmarks em cada etapa completa
- Números mostram quantidade de cursos em cada etapa
- Etapa atual destacada com cor primária
- Etapas passadas: checkmark verde
- Etapas futuras: círculo cinza

### Estrutura de Módulos

```
┌────────────────────────────────────────────────────────────────┐
│  📚 ESTRUTURA DO CURRÍCULO                3 módulos · 7 lições │
│                                                      ✏️ Editar  │
│                                                                │
│  M1  DO ZERO AO PRIMEIRO APP                                   │
│      2 lições · 0% completo                              [▼]   │
│                                                                │
│  M2  ARSENAL NO-CODE                                           │
│      3 lições · 0% completo                              [▼]   │
│                                                                │
│  M3  VIRANDO DINHEIRO                                          │
│      2 lições · 0% completo                              [▼]   │
└────────────────────────────────────────────────────────────────┘
```

### Ações Rápidas (Quick Actions)

```
┌────────────────────────┐
│  ⚡ AÇÕES RÁPIDAS      │
│                        │
│  📝 Editar Brief       │
│  🔍 Ver Pesquisa       │
│  📚 Editar Currículo   │
│  ✅ Validação de QA    │
└────────────────────────┘
```

### Curso Detail View

```
┌────────────────────────────────────────────────────────────────┐
│  [←] Voltar                          [Continuar Produção →]    │
│                                                                │
│  Vibecoding - Criação de Apps Sem Código com IA  [PUBLICADO]  │
│                                                                │
│  Crie aplicativos completos sem código usando IA generativa.   │
│  Aprenda Vibecoding e transforme ideias em apps funcionais     │
│  em minutos.                                                   │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ MÓDULOS  │  │ LIÇÕES   │  │PESQUISAS │  │FIDELIDADE│      │
│  │    3     │  │    7     │  │    0     │  │   --     │      │
│  │Todos com │  │6 public. │  │0 documen │  │sem avalia│      │
│  │conteúdo  │  │7 rascunh │  │tos apoio │  │   ções   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                │
│  📊 PIPELINE DE PRODUÇÃO                      0% completo      │
│  [✓]──[✓]──[✓]──[✓]──[✓]──[✓]──[◉]                           │
│  BRIEFING PESQ. CURR. GERAÇÃO VALID. PROD. PUBLICADO          │
└────────────────────────────────────────────────────────────────┘
```

**UI/UX Takeaways para ExímIA OS:**
1. Dashboard com métricas visuais (cards)
2. Pipeline de produção sempre visível
3. Módulos colapsáveis/expansíveis
4. Ações rápidas em sidebar
5. Progress indicators claros (% e visual)
6. Status badges (PUBLICADO, PROGRESSO, RASCUNHO)

---

# 2. Competências Combinadas

Course_Designer herda e combina o melhor de 3 agentes:

## 2.1 De ELC_Architect

✅ **Modelo ELC+ 2026** — 6 estágios evolutivos (vs. Kolb 4 original)
✅ **Time distribution standards** — Alocação prescritiva por estágio
✅ **Activity banks** — 6 bibliotecas de atividades por estágio
✅ **Retention-focused design** — Orientado por neurociência

## 2.2 De LXD_Architect

✅ **61+ Frameworks** — ADDIE, SAM, Action Mapping, Backward Design
✅ **Kirkpatrick 4+1 evaluation** — Plano estruturado de avaliação
✅ **Bloom Taxonomy (Revised)** — Objetivos de aprendizagem precisos
✅ **4 Learning Styles** — Divergente, Assimilador, Convergente, Acomodador
✅ **ROI calculation** — Phillips Level 5 (business impact)

## 2.3 De David Kolb Clone

✅ **Original Kolb 4-stage** — Backward compatibility
✅ **LSI 4.0 (9 styles)** — Diagnóstico detalhado de perfis
✅ **Theoretical grounding** — Awareness de críticas e evidências

## 2.4 Novas Capacidades (Exclusive to Course_Designer)

⭐ **Module Sequencing** — Pré-requisitos, spiral curriculum
⭐ **Content Chunking** — Miller 7±2, cognitive load management
⭐ **LMS Integration** — Export readiness (Moodle, Canvas, SCORM)
⭐ **Multi-framework selection** — User escolhe abordagem (ELC+, ADDIE, SAM, etc.)

---

# 3. Modelo Central: ELC+ 2026

## 3.1 Os 6 Estágios

```
┌─────────────────────────────────────────────────────────────────┐
│                      ELC+ 2026 CYCLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. IMMERSE (18%)        →  Vivenciar (Experiência Concreta)   │
│     ├── VR simulations                                          │
│     ├── Role-playing                                            │
│     └── Case study immersion                                    │
│                                                                 │
│  2. REFLECT (12%)        →  Observar (Observação Reflexiva)    │
│     ├── Debriefing                                              │
│     ├── Journaling                                              │
│     └── Peer discussion                                         │
│                                                                 │
│  3. CONCEPTUALIZE (18%)  →  Teorizar (Conceituação Abstrata)   │
│     ├── Framework presentation                                  │
│     ├── Model mapping                                           │
│     └── Theory connection                                       │
│                                                                 │
│  4. EXPERIMENT (18%)     →  Aplicar (Experimentação Ativa)     │
│     ├── Projects                                                │
│     ├── A/B testing                                             │
│     └── Real-world application                                  │
│                                                                 │
│  5. CALIBRATE (12%) ★    →  Ajustar (Validação e Feedback)     │
│     ├── Performance review                                      │
│     ├── Gap analysis                                            │
│     └── Iteration planning                                      │
│                                                                 │
│  6. INTEGRATE (22%) ★    →  Transferir (Consolidação)          │
│     ├── Teach others                                            │
│     ├── Create artifacts                                        │
│     └── System integration                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

★ = Novos estágios (não existem no Kolb original)
```

## 3.2 Time Distribution Standards

| Estágio | % Tempo | Justificativa |
|---------|---------|---------------|
| **IMMERSE** | 18% | Experiência concreta ativa engajamento |
| **REFLECT** | 12% | Processamento crítico (não subestimar) |
| **CONCEPTUALIZE** | 18% | Conexão teoria-prática |
| **EXPERIMENT** | 18% | Aplicação ativa (core do aprendizado) |
| **CALIBRATE** | 12% | Feedback loop (ajuste fino) |
| **INTEGRATE** | 22% | Maior alocação = consolidação via ensino |

**Total:** 100% (validado por neurociência: retenção ~70-90% quando ensina)

---

# 4. Frameworks Suportados

Course_Designer suporta 8 frameworks de design instrucional. User seleciona via input.

## 4.1 Framework Comparison

| Framework | Filosofia | Quando Usar |
|-----------|-----------|-------------|
| **ELC+ 2026** | Experiential, 6-stage cycle | Trainings, workshops, hands-on courses |
| **Kolb 4-Stage** | Experiential, original cycle | Backward compatibility |
| **ADDIE** | Waterfall, systematic | Corporate training, regulated environments |
| **SAM** | Agile, iterative | Fast-paced, startup contexts |
| **Action Mapping** | Behavior-first | Performance-driven courses |
| **Backward Design** | Objectives-first | Academic, assessment-focused |
| **Gagne 9 Events** | Cognitive, event-driven | K-12, structured learning |
| **Microlearning** | Chunked, just-in-time | Mobile, on-demand |

## 4.2 Default Recommendation

**If user doesn't specify:** Course_Designer defaults to **ELC+ 2026** com fallback para Kolb 4-stage se constraints temporais forem apertados.

**Rationale:** ELC+ tem melhor retenção (70-90%) vs. modelos lineares (10-30%).

---

# 5. Input/Output Schema

## 5.1 Input Schema (JSON)

```json
{
  "course_title": "Product Management Fundamentals",
  "duration": "12 weeks",
  "duration_hours": 40,
  "target_audience": {
    "role": "Product Managers",
    "level": "Junior to Mid",
    "context": "Tech startups"
  },
  "business_goal": "Reduce time-to-market by improving PM decision-making",
  "learning_objectives": [
    "Aplicar frameworks de priorização (RICE, ICE) em roadmaps reais",
    "Conduzir discovery interviews estruturadas com usuários"
  ],
  "constraints": {
    "time_per_week": 3,
    "delivery_mode": "online",
    "lms_platform": "Moodle",
    "assessment_required": true
  },
  "design_framework": "ELC+ 2026",
  "evaluation_framework": "Kirkpatrick"
}
```

## 5.2 Output Schema (JSON Blueprint)

```json
{
  "course_architecture": {
    "title": "Product Management Fundamentals",
    "duration_total_hours": 40,
    "modules": [
      {
        "module_number": 1,
        "title": "Discovery & Validation",
        "duration_hours": 4,
        "learning_objectives": [
          {
            "bloom_level": "Apply",
            "abcd_format": "Audience: Junior PMs, Behavior: Conduzir discovery interview, Condition: Com roteiro estruturado, Degree: 80% coverage dos pontos-chave"
          }
        ],
        "elc_plus_structure": {
          "immerse": {
            "duration_minutes": 43,
            "activities": [
              {
                "type": "case_study",
                "description": "Watch failed product launch: Juicero",
                "materials": ["Video: Juicero collapse story"],
                "learning_style": "Divergente"
              }
            ]
          },
          "reflect": {
            "duration_minutes": 29,
            "activities": [...]
          },
          "conceptualize": {...},
          "experiment": {...},
          "calibrate": {...},
          "integrate": {...}
        },
        "assessment": {
          "formative": [...],
          "summative": [...]
        },
        "learning_styles_coverage": {
          "divergente": true,
          "assimilador": true,
          "convergente": true,
          "acomodador": true
        },
        "prerequisites": []
      }
    ],
    "evaluation_plan": {
      "kirkpatrick_L1_reaction": {...},
      "kirkpatrick_L2_learning": {...},
      "kirkpatrick_L3_behavior": {...},
      "kirkpatrick_L4_results": {...}
    }
  },
  "metadata": {
    "generated_by": "Course_Designer v1.0",
    "design_framework": "ELC+ 2026",
    "total_modules": 10,
    "estimated_retention_rate": "70-85%",
    "generated_at": "2026-01-26T10:30:00Z"
  }
}
```

---

# 6. Knowledge Bases

Course_Designer tem **8 Knowledge Bases** (merged + new):

## KB_01: ELC+ 2026 Model
**Source:** ELC_Architect
**Content:** 6-stage cycle, time distribution standards, retention rates

## KB_02: Kolb Original 4-Stage
**Source:** LXD_Architect
**Content:** EC → OR → CA → EA cycle, 4 learning styles

## KB_03: Design Frameworks
**Source:** LXD_Architect KB_04
**Content:** ADDIE, SAM, Action Mapping, Backward Design

## KB_04: Learning Styles & LSI 4.0
**Source:** David Kolb Clone KB_04
**Content:** 4 core styles + 9 LSI 4.0 variants

## KB_05: Assessment Design
**Source:** LXD_Architect KB_06 + KB_07
**Content:** Kirkpatrick 4+1, Phillips ROI, Bloom Taxonomy

## KB_06: Module Sequencing (NEW)
**Content:** Prerequisites, cognitive load management (Sweller), spiral curriculum (Bruner)

## KB_07: Content Chunking (NEW)
**Content:** Miller's 7±2, microlearning principles, module duration guidelines

## KB_08: LMS Integration
**Source:** Harven_Organizer KB_03
**Content:** Moodle XML, Canvas API, SCORM packaging

---

# 7. Validation Criteria

Course_Designer blueprints são validados por Z4_Auditor com esta checklist:

## 7.1 Design Quality

| Critério | Validação | Target |
|----------|-----------|--------|
| **ELC+ Completeness** | Todos 6 estágios presentes? | 100% |
| **Time Distribution** | % alinhados com padrão? | ±5% |
| **Learning Styles Coverage** | 4 estilos representados? | 100% |
| **Bloom Taxonomy** | Objetivos usam verbos corretos? | ≥90% |
| **Assessment Alignment** | Assessments cobrem objetivos? | 100% |

## 7.2 Technical Quality

| Critério | Validação | Target |
|----------|-----------|--------|
| **JSON Schema Compliance** | Output válido? | 100% |
| **Prerequisite DAG** | Grafo acíclico? | Yes |
| **Chunk Size** | Módulos entre 30-120 min? | ≥80% |

## 7.3 Reusability

| Critério | Validação | Target |
|----------|-----------|--------|
| **Product Agnostic** | Blueprint funciona fora Harven? | Yes |
| **Framework Flexibility** | Suporta ≥3 frameworks? | Yes |
| **Multi-LMS** | Exportável para ≥2 LMS? | Yes |

---

# 8. Integration Points

## 8.1 Harven.AI (Academy Module)

```
Course_Designer (X_Agent)
    ↓ (outputs JSON blueprint)
Academy_Orchestrator (Harven-specific, 4h build)
    ↓ (coordinates)
6 Academy Agents (Creator, Socrates, Analyst, Editor, Tester, Organizer)
    ↓
Harven.AI Course Ready
```

**Academy_Orchestrator responsibilities:**
- Receive Course_Designer blueprint
- For each module → call CREATOR to generate Socratic questions
- Call TESTER to validate questions
- Call ORGANIZER to export Moodle XML
- Configure ANALYST metrics + SOCRATES dialogue parameters

## 8.2 StratOS (Strategy Module)

```
Course_Designer
    ↓ (outputs JSON blueprint)
Strategy_Training_Orchestrator
    ↓
OKR Workshop Materials
```

---

# 9. Implementation Plan

## Phase 1: Z1_Architect (2h)
- [ ] META_ANALYSIS.md (competency mapping)
- [ ] Benchmark scorecard (vs. ELC + LXD)

## Phase 2: Z2_Profiler (4h)
- [ ] dna_mental.md
- [ ] Merge KBs 01-05 (from existing agents)
- [ ] Create KBs 06-07 (new: sequencing + chunking)

## Phase 3: Z3_Engineer (3h)
- [ ] prompt_operacional.md
- [ ] input_schema.json + output_schema.json
- [ ] Example blueprints (3 use cases)

## Phase 4: Z4_Auditor (2h)
- [ ] validation_report.md
- [ ] Stress test with 3 frameworks (ELC+, ADDIE, SAM)
- [ ] Multi-product validation (Harven + StratOS)

**Total: 11 hours**

---

# 10. Success Metrics

## 10.1 Agent Performance

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **Blueprint Generation Time** | < 3 min | Timestamp output |
| **Z4_Auditor Score** | ≥ 9.0/10 | Validation report |
| **Multi-product Compatibility** | Works for ≥2 products | Harven + StratOS tests |

## 10.2 Downstream Impact (via Harven.AI)

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **Course Completion Rate** | > 40% | Harven analytics |
| **Student Satisfaction** | ≥ 8.5/10 | Kirkpatrick L1 |
| **Professor Time Saved** | -80% | Before/after comparison |

## 10.3 Business Metrics

| Métrica | Target | Como Medir |
|---------|--------|------------|
| **ROI Payback** | After 2 products | 18h investment / 9h saved per product |
| **Reuse Rate** | ≥50% | Blueprints used in multiple products |

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| **1.0** | 26/01/2026 | Especificação inicial. Combina ELC_Architect + LXD_Architect + Kolb Clone. 8 KBs. Hybrid architecture para Harven.AI. |

---

## Referências

- [COURSE_CREATOR_ANALYSIS.md](../../COURSE_CREATOR_ANALYSIS.md) — Análise estratégica completa (9.15/10 score)
- [ELC_Architect](../ELC_Architect/) — ELC+ 2026 model source
- [LXD_Architect](../LXD_Architect/) — 61 frameworks source
- [David Kolb Clone](../../Clones/david_kolb/) — Original Kolb source
- [PRD-Academy-v5.1.md](../../Projetos/exímIA APP/02_Academy/PRD-Academy-v5.1.md) — Integration with Harven.AI
- [Z_Squad](../../Z_Squad/) — Agent creation pipeline

---

*Course_Designer v1.0 — Where Learning Architecture Becomes Science*
*eximIA.OS — 2026*
