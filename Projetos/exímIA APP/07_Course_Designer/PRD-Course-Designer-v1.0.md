# PRD — Course Designer
**Módulo:** 07_Course_Designer
**Versão:** 1.0
**Data:** 26 Janeiro 2026
**Status:** 🚧 **EM DESENVOLVIMENTO**
**Tipo:** Ferramenta Interna ExímIA OS

---

## SUMÁRIO EXECUTIVO

**Course Designer** é o engine lógico que transforma ideias de cursos em arquiteturas pedagógicas completas, estruturadas e baseadas em evidências.

**Para quem:** Empreendedores da ExímIA Ventures (uso interno)
**Para quê:** Criar cursos experienciais de alta qualidade sem precisar ser especialista em design instrucional
**Como:** Algoritmos baseados em 40+ metodologias de aprendizagem + Kolb + ELC+ 2026

**Filosofia:** *"Saídas primeiro, slides depois."*

---

## ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Problema & Solução](#2-problema--solução)
3. [Metodologia Base](#3-metodologia-base)
4. [Arquitetura do Engine](#4-arquitetura-do-engine)
5. [Input & Output](#5-input--output)
6. [Fluxo de Uso](#6-fluxo-de-uso)
7. [Features Detalhadas](#7-features-detalhadas)
8. [Quality Gates](#8-quality-gates)
9. [Tech Stack](#9-tech-stack)
10. [Roadmap de Implementação](#10-roadmap-de-implementação)

---

## 1. VISÃO GERAL

### 1.1 O Que É

Course Designer é um **sistema especialista** que:
- Recebe input básico (tema, público, duração)
- Processa usando metodologias de learning design
- Gera blueprint completo do curso (estrutura + conteúdo + avaliação)

### 1.2 O Que NÃO É

- ❌ Não é LMS (Moodle, Canvas)
- ❌ Não é criador de conteúdo (slides, vídeos)
- ❌ Não é para vender B2B
- ❌ Não substitui o professor (amplifica capacidade)

### 1.3 Diferencial

```
TRADICIONAL:
Professor pensa em tópicos → escreve slides → "espera" que aluno aprenda

COURSE DESIGNER:
Define competência → cria problema-motor → estrutura experiência → valida aprendizagem
```

**Resultado:** Cursos com 70-85% de retenção (vs. 10-30% tradicionais)

---

## 2. PROBLEMA & SOLUÇÃO

### 2.1 Problema Atual

**Para empreendedores da ExímIA:**
- Precisam criar cursos/treinamentos mas não têm formação em pedagogia
- Gastam 40-80h desenhando curso "na intuição"
- Resultado: cursos desorganizados, sem avaliação clara, baixa retenção

**Sintomas:**
- "Não sei por onde começar"
- "Tenho muito conteúdo mas não sei sequenciar"
- "Alunos assistem mas não aplicam"
- "Não sei como avaliar se aprenderam"

### 2.2 Solução

**Course Designer automatiza o design instrucional:**

```
INPUT (5 min):
├── Tema do curso
├── Público-alvo
├── Duração disponível
└── Objetivo de negócio

↓ [PROCESSING ENGINE - 30 seg]

OUTPUT (blueprint completo):
├── Estrutura de módulos
├── Objetivos de aprendizagem (Bloom + ABCD)
├── Problemas-motor (casos práticos)
├── Ciclo experiencial por módulo (6 etapas)
├── Avaliações alinhadas
├── Rubrica de qualidade
└── Roteiro de facilitação
```

**Resultado:** De 40h → 1h de design (98% faster)

---

## 3. METODOLOGIA BASE

### 3.1 Roda de Kolb Expandida (6 Etapas)

```
┌────────────────────────────────────────────────────────┐
│              CICLO EXPERIENCIAL COMPLETO                │
├────────────────────────────────────────────────────────┤
│                                                        │
│  1. SENTIR (18%)       →  Experiência concreta        │
│     Problema-motor | Caso real | Simulação            │
│                                                        │
│  2. OBSERVAR (12%)     →  Reflexão crítica            │
│     Debrief | Journaling | Discussão                  │
│                                                        │
│  3. PENSAR (18%)       →  Conceituação abstrata       │
│     Framework | Teoria | Modelo                       │
│                                                        │
│  4. FAZER (18%)        →  Experimentação ativa        │
│     Prática | Projeto | Aplicação                     │
│                                                        │
│  5. VALIDAR (12%)      →  Feedback e ajuste           │
│     Rubrica | Peer review | Autoavaliação             │
│                                                        │
│  6. INTERNALIZAR (22%) →  Transferência para vida     │
│     Ensinar outros | Compromisso | Plano de ação      │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Equivalência com ELC+ 2026:**
- SENTIR = IMMERSE
- OBSERVAR = REFLECT
- PENSAR = CONCEPTUALIZE
- FAZER = EXPERIMENT
- VALIDAR = CALIBRATE
- INTERNALIZAR = INTEGRATE

### 3.2 Frameworks Suportados

| Framework | Quando Usar |
|-----------|-------------|
| **Kolb (6 etapas)** | Default - sempre (experiencial) |
| **Backward Design** | Garantir alinhamento objetivo↔avaliação |
| **Action Mapping** | Cursos focados em performance/comportamento |
| **SAM** | Desenvolvimento rápido/iterativo |
| **Gagne's 9 Events** | Checklist de completude por aula |
| **Merrill's First Principles** | Adult learning / profissionais |

**Meta-Framework (usado pelo engine):**
```
Backward Design (estrutura)
+ Action Mapping (foco)
+ Kolb 6-stage (experiência)
+ Gagne's 9 Events (completude)
= Course Designer
```

---

## 4. ARQUITETURA DO ENGINE

### 4.1 Visão Macro

```
┌─────────────────────────────────────────────────────────┐
│                  COURSE DESIGNER ENGINE                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  INPUT                                                  │
│  ├── Formulário básico (5 campos)                       │
│  └── Preferências opcionais                             │
│                                                         │
│  ↓                                                      │
│                                                         │
│  PHASE 1: ANALYZER                                      │
│  ├── Parse & validate input                             │
│  ├── Select framework (decision tree)                   │
│  ├── Profile audience (Adult Learning + ZPD)            │
│  └── Calculate constraints                              │
│                                                         │
│  ↓                                                      │
│                                                         │
│  PHASE 2: ARCHITECT                                     │
│  ├── Generate objectives (Bloom + ABCD)                 │
│  ├── Design assessments FIRST (Backward Design)         │
│  ├── Sequence modules (prerequisites + spiral)          │
│  └── Map ELC+ structure (6 stages per module)           │
│                                                         │
│  ↓                                                      │
│                                                         │
│  PHASE 3: CALCULATOR                                    │
│  ├── Allocate durations (attention span: 15 min)        │
│  ├── Analyze cognitive load (Sweller: ≤7 chunks)        │
│  ├── Optimize chunks (Miller: 4-7)                      │
│  └── Distribute time (18-12-18-18-12-22%)               │
│                                                         │
│  ↓                                                      │
│                                                         │
│  PHASE 4: VALIDATOR                                     │
│  ├── Check alignment (obj ↔ assessment 1:1)             │
│  ├── Validate Bloom progression                         │
│  ├── Audit completeness (Gagne's 9)                     │
│  └── Generate quality score (0-100)                     │
│                                                         │
│  ↓                                                      │
│                                                         │
│  PHASE 5: GENERATOR                                     │
│  ├── Build JSON blueprint                               │
│  ├── Recommend activities per stage                     │
│  ├── Create problema-motor per module                   │
│  └── Generate facilitation script                       │
│                                                         │
│  ↓                                                      │
│                                                         │
│  OUTPUT                                                 │
│  ├── JSON blueprint (estruturado)                       │
│  ├── PDF executivo (1-pager)                            │
│  ├── Roteiro de facilitação (completo)                  │
│  └── Templates (entregáveis do aluno)                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Algoritmos-Chave

**12 Algoritmos Principais:**

1. **Framework Selector** - Decision tree para metodologia
2. **Objective Generator** - Cria objetivos ABCD + Bloom
3. **Assessment Designer** - Alinha avaliação antes de instrução
4. **Module Sequencer** - Pré-requisitos + spiral curriculum
5. **ELC+ Mapper** - 6 stages com % de tempo
6. **Duration Allocator** - Baseado em attention span
7. **Cognitive Load Analyzer** - Mantém ≤7 chunks (Sweller)
8. **Chunk Optimizer** - Agrupa em 4-7 blocos (Miller)
9. **Alignment Validator** - 1:1 objetivo↔assessment
10. **Bloom Progression Validator** - Lógica de espiral
11. **Completeness Auditor** - Checa Gagne's 9 Events
12. **Quality Scorecard** - Score multi-dimensional 0-100

---

## 5. INPUT & OUTPUT

### 5.1 Input Schema (Formulário)

```json
{
  "course_title": "Product Management Fundamentals",

  "business_goal": "Reduzir time-to-market melhorando decisões de PM",

  "target_audience": {
    "role": "Product Managers",
    "experience_level": "junior_to_mid",
    "prior_knowledge": ["basic agile", "basic UX"],
    "size": "15-30 pessoas"
  },

  "constraints": {
    "total_duration_hours": 40,
    "weeks": 12,
    "hours_per_week": 3.5,
    "delivery_mode": "online_async",
    "cohort_based": true
  },

  "preferences": {
    "learning_style": "experiential",
    "assessment_type": "authentic",
    "content_density": "lean"
  }
}
```

**Campos Obrigatórios:**
- `course_title`
- `target_audience.role`
- `target_audience.experience_level`
- `constraints.total_duration_hours` OU (`weeks` + `hours_per_week`)

**Campos Opcionais:**
- `business_goal` (recomendado para Action Mapping)
- `prior_knowledge` (ajuda no ZPD)
- `preferences` (senão usa defaults)

### 5.2 Output Schema (Blueprint)

```json
{
  "course_metadata": {
    "title": "Product Management Fundamentals",
    "version": "1.0",
    "generated_at": "2026-01-26T15:30:00Z",
    "total_duration_hours": 40,
    "estimated_retention_rate": "70-85%",
    "quality_score": 92.5
  },

  "framework_mix": {
    "primary": "Action_Mapping",
    "supporting": ["Backward_Design", "Kolb_6_Stage", "Gagnes_9_Events"],
    "rationale": "Lean content, behavior-focused, experiential"
  },

  "audience_profile": {
    "role": "Product Managers",
    "experience": "junior_to_mid",
    "learning_style": "Divergente",
    "zpd": {
      "can_do_alone": ["remember", "understand", "apply"],
      "can_do_with_support": ["analyze"]
    }
  },

  "course_architecture": {
    "total_modules": 10,
    "modules": [
      {
        "module_number": 1,
        "title": "Discovery & Validation",
        "duration_hours": 4,

        "objectives": [
          {
            "objective_id": "M1_OBJ1",
            "bloom_level": "Apply",
            "abcd": {
              "audience": "Junior PMs",
              "behavior": "Conduzir discovery interview",
              "condition": "Com roteiro estruturado",
              "degree": "80% coverage dos pontos-chave"
            }
          }
        ],

        "problema_motor": {
          "title": "O CEO quer feature ontem",
          "scenario": "CEO pediu feature X. Você tem 15 min para decidir: entra no sprint ou negoceia?",
          "tension": "Urgência vs Due Diligence",
          "deliverable": "Decisão + justificativa (1 página)"
        },

        "elc_plus_structure": {
          "SENTIR": {
            "percentage": 18,
            "duration_min": 43,
            "activities": [
              {
                "type": "case_study",
                "description": "Leia o caso: CEO pedindo feature urgente",
                "deliverable": "Sua decisão (Aceitar/Recusar/Negociar)"
              }
            ]
          },
          "OBSERVAR": {
            "percentage": 12,
            "duration_min": 29,
            "activities": [
              {
                "type": "reflection",
                "questions": [
                  "O que você priorizou? Por quê?",
                  "Onde você teve insegurança?"
                ],
                "deliverable": "3 aprendizados + 1 dúvida"
              }
            ]
          },
          "PENSAR": {
            "percentage": 18,
            "duration_min": 43,
            "activities": [
              {
                "type": "framework",
                "concept": "RICE Prioritization",
                "slides": 3,
                "deliverable": "Como RICE mudaria sua decisão?"
              }
            ]
          },
          "FAZER": {
            "percentage": 18,
            "duration_min": 43,
            "activities": [
              {
                "type": "application",
                "description": "Refaça decisão usando RICE",
                "deliverable": "Versão 2 (com framework aplicado)"
              }
            ]
          },
          "VALIDAR": {
            "percentage": 12,
            "duration_min": 29,
            "activities": [
              {
                "type": "peer_review",
                "rubric": "rubrica_decisao_pm.yaml",
                "deliverable": "2 forças + 1 ajuste"
              }
            ]
          },
          "INTERNALIZAR": {
            "percentage": 22,
            "duration_min": 53,
            "activities": [
              {
                "type": "commitment",
                "questions": [
                  "Onde vou aplicar esta semana?",
                  "Que gatilho vai me lembrar?"
                ],
                "deliverable": "Plano de aplicação (7 dias)"
              }
            ]
          }
        },

        "assessments": [
          {
            "type": "formative",
            "timing": "during_learning",
            "format": "Peer review da decisão",
            "rubric": "0-2 por critério"
          }
        ]
      }
    ]
  },

  "evaluation_plan": {
    "kirkpatrick_L1": "Survey pós-curso (NPS + satisfação)",
    "kirkpatrick_L2": "Rubrica de desempenho (todas as entregas)",
    "kirkpatrick_L3": "Follow-up 30 dias: aplicou no trabalho?",
    "kirkpatrick_L4": "90 dias: time-to-market reduziu?"
  },

  "quality_scorecard": {
    "overall_score": 92.5,
    "rating": "EXCELLENT",
    "dimensions": {
      "alignment": 100,
      "bloom_progression": 100,
      "elc_completeness": 100,
      "duration_optimization": 90,
      "cognitive_load": 85
    }
  },

  "generated_assets": {
    "facilitation_script": "roteiro_facilitacao_m1.md",
    "student_templates": [
      "template_decisao.pdf",
      "template_reflexao.pdf",
      "template_compromisso.pdf"
    ],
    "rubrics": [
      "rubrica_decisao_pm.yaml"
    ]
  }
}
```

---

## 6. FLUXO DE USO

### 6.1 User Journey (Típico)

```
1. USUÁRIO (empreendedor ExímIA) acessa Course Designer

2. PREENCHE FORMULÁRIO (5 min)
   ├── Título do curso
   ├── Público-alvo
   ├── Duração total
   └── Objetivo de negócio

3. ENGINE PROCESSA (30 seg)
   ├── Analisa constraints
   ├── Gera arquitetura
   ├── Cria problemas-motor
   └── Valida qualidade

4. RECEBE BLUEPRINT
   ├── PDF executivo (overview de 1 página)
   ├── JSON completo (para devs)
   └── Roteiro de facilitação (para professores)

5. REVISA & AJUSTA (opcional, 15 min)
   ├── Ajusta duração de módulos
   ├── Customiza problemas-motor
   └── Adiciona recursos específicos

6. EXPORTA & USA
   ├── PDF para compartilhar
   ├── Notion/Google Doc (importa estrutura)
   └── Começa a criar conteúdo (vídeos, slides)
```

### 6.2 Interface (Wireframe Conceitual)

```
┌──────────────────────────────────────────────────────────┐
│  [Logo ExímIA OS]                Course Designer    [?]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Criar Novo Curso                                        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 1. BÁSICO                                          │  │
│  │                                                    │  │
│  │ Título do curso:                                   │  │
│  │ [________________________________]                 │  │
│  │                                                    │  │
│  │ Objetivo de negócio (o que muda no aluno?):       │  │
│  │ [________________________________]                 │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 2. PÚBLICO                                         │  │
│  │                                                    │  │
│  │ Papel/Cargo: [______________]                      │  │
│  │ Nível: ( ) Iniciante ( ) Júnior (•) Pleno         │  │
│  │ Conhecimento prévio: [______________]              │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 3. DURAÇÃO                                         │  │
│  │                                                    │  │
│  │ Total de horas: [40___]                            │  │
│  │ Formato: ( ) Presencial (•) Online ( ) Híbrido    │  │
│  │ Cohort? (•) Sim ( ) Não                            │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│                   [Gerar Arquitetura →]                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Após processar:**

```
┌──────────────────────────────────────────────────────────┐
│  Product Management Fundamentals - Blueprint Gerado      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📊 RESUMO                                               │
│  ├── 10 módulos (4h cada)                                │
│  ├── 40 horas totais                                     │
│  ├── Retenção estimada: 70-85%                           │
│  └── Quality Score: 92.5/100 ⭐ EXCELLENT                │
│                                                          │
│  📚 MÓDULOS                                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │ M1: Discovery & Validation (4h)                    │  │
│  │ ├── Problema-motor: "CEO quer feature ontem"      │  │
│  │ ├── Competência: Conduzir discovery interview     │  │
│  │ └── [Ver detalhes →]                               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ M2: Priorização Estratégica (4h)                   │  │
│  │ ├── Problema-motor: "3 features, 1 sprint"        │  │
│  │ └── [Ver detalhes →]                               │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  [+ 8 módulos mais]                                      │
│                                                          │
│  📥 EXPORTAR                                             │
│  [PDF Executivo] [JSON Completo] [Roteiro Facilitação]  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 7. FEATURES DETALHADAS

### Feature 1: Geração Automática de Problemas-Motor

**O que é:** Para cada módulo, gera um caso/dilema prático que serve como "âncora" do aprendizado.

**Como funciona:**
1. Analisa competência-alvo do módulo
2. Cria cenário com tensão (urgência + ambiguidade + stakes)
3. Define entregável claro (decisão, plano, análise)

**Exemplo de output:**
```markdown
# Problema-Motor: CEO Quer Feature Ontem

## Contexto
Você é PM júnior na startup TechCorp (50 pessoas, Série A).
Hoje, sexta-feira 17h, CEO te chama no Slack:

"Vi o concorrente lançar feature X. Precisamos ter isso
segunda-feira. Coloca no sprint."

Você sabe que:
- Feature X levaria 2 sprints (4 semanas) para fazer bem
- Time já está 100% alocado
- Não há discovery validando necessidade
- CEO tende a ser impulsivo mas paga as contas

## Sua Missão
Decidir em 15 minutos:
- [ ] Aceitar (entra no sprint segunda)
- [ ] Recusar (explica por que não)
- [ ] Negociar (propõe alternativa)

## Entregável
Resposta ao CEO (máximo 1 página):
├── Decisão
├── Justificativa (3 razões)
└── Riscos assumidos (2-3)
```

---

### Feature 2: Rubrica de Avaliação Automática

**O que é:** Para cada competência, gera rubrica 0-2 por critério.

**Exemplo:**
```yaml
# Rubrica: Discovery Interview

criterios:
  clareza_perguntas:
    0: Perguntas fechadas ou indutivas
    1: Mix de abertas e fechadas
    2: 100% abertas, não-indutivas
    peso: 25%

  profundidade_escuta:
    0: Não faz follow-ups
    1: Alguns follow-ups
    2: Follow-ups profundos, explora contradições
    peso: 25%

  captura_evidencias:
    0: Notas vagas
    1: Notas estruturadas parciais
    2: Citações diretas + contexto
    peso: 25%

  sintese_insights:
    0: Não identifica padrões
    1: Alguns padrões básicos
    2: Padrões + hipóteses + próximos passos
    peso: 25%

total_max: 8 pontos
```

---

### Feature 3: Roteiro de Facilitação (Script)

**O que é:** Passo a passo exato do que o professor fala/faz em cada minuto.

**Exemplo:**
```markdown
# Roteiro de Facilitação - Módulo 1

## [0-10 min] SENTIR

### Abertura (2 min)
**Fala do facilitador:**
"Hoje vocês vão viver o dilema do PM: urgência vs. qualidade.
CEO quer feature ontem. Você tem 15 min para decidir.
Não há resposta certa — há trade-offs."

### Apresentar Caso (3 min)
**Ação:** Compartilhar link do brief
**Instrução aos alunos:**
"Leiam o caso. Identifiquem:
1. O dilema principal
2. As restrições
3. O que está em jogo"

### Decisão Individual (10 min)
**Timer:** Configurar 10 min
**Alunos:** Preenchem template de decisão
**Facilitador:** Circula, observa (não intervém)

**Pergunta de fechamento:**
"Onde você sentiu mais tensão?"

---

## [10-17 min] OBSERVAR

### Debrief em Plenária (7 min)
**Perguntas (uma por vez, pause 30 seg entre cada):**

1. "Quem aceitou? Por quê?" (mãos levantadas)
2. "Quem recusou? Por quê?"
3. "Quem negociou? Que alternativa propôs?"
4. "Onde vocês sentiram insegurança?"

**Facilitador:** Nomeia padrões sem julgar
"Vejo 3 grupos: os que priorizaram velocidade, qualidade, e os que buscaram meio-termo."

---

[... continua com PENSAR, FAZER, VALIDAR, INTERNALIZAR]
```

---

### Feature 4: Validação de Qualidade Multi-Dimensional

**Scorecard com 5 dimensões:**

| Dimensão | Peso | O Que Mede |
|----------|------|------------|
| **Alignment** | 30% | Objetivo ↔ Assessment (1:1?) |
| **Bloom Progression** | 20% | Espiral lógica (sem drops) |
| **ELC+ Completeness** | 25% | 6 estágios presentes + % correto |
| **Duration Optimization** | 15% | Aulas 20-30 min (attention span) |
| **Cognitive Load** | 10% | ≤7 chunks por aula (Sweller) |

**Cálculo:**
```python
overall_score = (
    alignment * 0.30 +
    bloom_progression * 0.20 +
    elc_completeness * 0.25 +
    duration * 0.15 +
    cognitive_load * 0.10
)
```

**Rating:**
- 90-100 = EXCELLENT
- 80-89 = GOOD
- 70-79 = ACCEPTABLE
- <70 = NEEDS_IMPROVEMENT

---

### Feature 5: Progressão de Complexidade (Spiral Curriculum)

**Lógica:**
```
MÓDULO 1: Caso simples
├── 1 variável
├── Decisão binária (sim/não)
└── Feedback direto

MÓDULO 2-3: Adicionam complexidade
├── 2-3 variáveis
├── Informação incompleta
└── Múltiplas opções

MÓDULO 4-6: Conflito humano
├── Stakeholders com agendas
├── Negociação/política
└── Trade-offs éticos

MÓDULO 7-9: Mundo real
├── Projeto do trabalho do aluno
├── Consequências reais
└── Autonomia total

MÓDULO 10: Síntese + Demonstração
├── Apresentação final
├── Meta-reflexão
└── Plano de 90 dias
```

---

## 8. QUALITY GATES

### 8.1 Pré-Geração (Input Validation)

Antes de processar, valida:
- [ ] Duração total ≥ 4 horas (mínimo para curso)
- [ ] Público-alvo definido
- [ ] Objetivo tem verbo de ação

### 8.2 Pós-Geração (Output Validation)

Blueprint só é entregue se:
- [ ] Quality Score ≥ 70
- [ ] Todos módulos têm 6 estágios ELC+
- [ ] 100% objetivos têm assessment
- [ ] Bloom progression sem drops >1
- [ ] Cognitive load ≤9 em todas aulas

### 8.3 Alertas Automáticos

Engine flagg se:
- ⚠️ Módulo >6h (sugerir split)
- ⚠️ Aula >40 min (atenção)
- ⚠️ >7 objetivos por módulo (chunking)
- ⚠️ Bloom drop detectado (ex: Create → Understand)

---

## 9. TECH STACK

### 9.1 Backend (Logic Engine)

**Linguagem:** Python 3.11+
**Por quê:** Melhor para algoritmos + data processing

**Core Libraries:**
```python
# Schema validation
pydantic>=2.0

# Data processing
pandas>=2.0

# Dependency graphs
networkx>=3.0

# PDF generation
reportlab>=4.0
```

**Estrutura:**
```
course_designer/
├── core/
│   ├── analyzer.py       # Phase 1
│   ├── architect.py      # Phase 2
│   ├── calculator.py     # Phase 3
│   ├── validator.py      # Phase 4
│   └── generator.py      # Phase 5
├── models/
│   ├── input_schema.py
│   └── output_schema.py
├── algorithms/
│   ├── framework_selector.py
│   ├── objective_generator.py
│   ├── elc_mapper.py
│   └── [... 12 algorithms ...]
├── knowledge_base/
│   ├── bloom_verbs.yaml
│   ├── activity_bank.yaml
│   ├── problema_motor_templates.yaml
│   └── rubric_templates.yaml
└── utils/
    ├── time_calculator.py
    └── quality_scorer.py
```

### 9.2 Frontend (UI)

**Framework:** Next.js 14 + React
**Por quê:** ExímIA OS já usa

**Componentes:**
```
components/
├── CourseForm.tsx        # Input form (5 campos)
├── BlueprintViewer.tsx   # Mostra resultado
├── ModuleCard.tsx        # Card de módulo
├── QualityBadge.tsx      # Badge de score
└── ExportButtons.tsx     # PDF/JSON/Notion
```

### 9.3 Storage

**Development:** JSON files (local)
**Production:** PostgreSQL
  - Tabela `courses` (metadata)
  - Tabela `blueprints` (JSON column com estrutura)
  - Tabela `templates` (reusáveis)

---

## 10. ROADMAP DE IMPLEMENTAÇÃO

### Sprint 1: Core Engine (2 semanas)

**Objetivo:** Engine funcional gerando blueprint básico

**Tasks:**
- [ ] Setup projeto Python
- [ ] Implementar input/output schemas (Pydantic)
- [ ] Implementar Phase 1: Analyzer
  - [ ] Input parser
  - [ ] Framework selector (decision tree)
- [ ] Implementar Phase 2: Architect
  - [ ] Objective generator (Bloom + ABCD)
  - [ ] Module sequencer (simples primeiro)
- [ ] Implementar Phase 5: Generator
  - [ ] JSON builder básico
- [ ] Testes unitários (80% coverage)

**Deliverable:** CLI que recebe JSON input e gera JSON output

---

### Sprint 2: ELC+ & Validation (2 semanas)

**Objetivo:** Estrutura experiencial completa + quality gates

**Tasks:**
- [ ] Implementar Phase 2: ELC+ Mapper
  - [ ] 6 stages per module
  - [ ] Time distribution (18-12-18-18-12-22%)
- [ ] Implementar Phase 3: Calculator
  - [ ] Duration allocator
  - [ ] Cognitive load analyzer
- [ ] Implementar Phase 4: Validator
  - [ ] Alignment checker
  - [ ] Bloom progression validator
  - [ ] Quality scorecard
- [ ] Activity bank (YAML)
  - [ ] 50+ atividades por estágio
- [ ] Testes de validação

**Deliverable:** Blueprint com ELC+ completo + score de qualidade

---

### Sprint 3: Problema-Motor & Assets (1 semana)

**Objetivo:** Geração de problemas-motor e assets auxiliares

**Tasks:**
- [ ] Problema-Motor generator
  - [ ] Templates por domínio
  - [ ] Tensor calculator (urgência × ambiguidade × stakes)
- [ ] Rubrica generator
  - [ ] Por competência
  - [ ] 0-2 scale per criterion
- [ ] Roteiro de facilitação generator
  - [ ] Script com falas
  - [ ] Timings exatos
- [ ] Template de entregáveis
  - [ ] Por tipo de atividade

**Deliverable:** Blueprint com problema-motor + rubrica + roteiro

---

### Sprint 4: Frontend & UX (2 semanas)

**Objetivo:** Interface web funcional

**Tasks:**
- [ ] Setup Next.js project
- [ ] CourseForm component
  - [ ] 5 campos obrigatórios
  - [ ] Validação client-side
- [ ] BlueprintViewer component
  - [ ] Cards de módulos
  - [ ] Expandable ELC+ structure
- [ ] QualityBadge component
  - [ ] Visual score (0-100)
  - [ ] Breakdown por dimensão
- [ ] Export functionality
  - [ ] JSON download
  - [ ] PDF generation
- [ ] API routes (Next.js)
  - [ ] POST /api/generate
  - [ ] GET /api/blueprint/:id

**Deliverable:** Web app funcional end-to-end

---

### Sprint 5: Polish & Launch (1 semana)

**Objetivo:** Refinamento e lançamento interno

**Tasks:**
- [ ] User testing com 3 empreendedores ExímIA
- [ ] Ajustes de UX baseado em feedback
- [ ] Documentação
  - [ ] README completo
  - [ ] Examples (3 cursos exemplo)
  - [ ] Video demo (5 min)
- [ ] Deploy
  - [ ] Vercel (frontend)
  - [ ] Railway/Render (backend API)
- [ ] Onboarding flow
  - [ ] Tutorial interativo (first use)

**Deliverable:** Course Designer v1.0 em produção (uso interno)

---

### Timeline Total: 8 semanas

```
Sprint 1: Core Engine          [██████████░░░░░░░░░░] Semanas 1-2
Sprint 2: ELC+ & Validation    [██████████░░░░░░░░░░] Semanas 3-4
Sprint 3: Problema-Motor       [██████░░░░░░░░░░░░░░] Semana 5
Sprint 4: Frontend & UX        [██████████░░░░░░░░░░] Semanas 6-7
Sprint 5: Polish & Launch      [██████░░░░░░░░░░░░░░] Semana 8
```

---

## ANEXOS

### A. Pesquisa Base

Todos algoritmos e metodologias baseados em:
- `COURSE_DESIGN_METHODOLOGIES_RESEARCH.md` (4,500 palavras, 40+ fontes)
- `EXPERIENTIAL_LEARNING_METHODOLOGY.md` (10,000 palavras, metodologia prática)
- `COURSE_DESIGNER_LOGIC_ARCHITECTURE.md` (9,000 palavras, arquitetura técnica)

### B. Glossário

**ABCD Method:** Framework para escrever objetivos (Audience, Behavior, Condition, Degree)
**Bloom's Taxonomy:** Hierarquia de complexidade cognitiva (Remember → Create)
**Cognitive Load:** Carga mental de processar informação (Sweller)
**ELC+ 2026:** Experiential Learning Cycle expandido (6 estágios)
**Problema-Motor:** Caso/dilema que âncora o aprendizado experiencial
**ZPD:** Zone of Proximal Development (Vygotsky)

### C. Exemplos de Output

Ver: `examples/` folder
- `pm_fundamentals_blueprint.json`
- `data_science_101_blueprint.json`
- `leadership_intensive_blueprint.json`

---

## DECISÃO

**Status:** 🚧 EM DESENVOLVIMENTO
**Prioridade:** ALTA (ferramenta core para ExímIA)
**Owner:** Hugo Capitelli
**Start Date:** 26 Janeiro 2026
**Target Launch:** Março 2026 (8 semanas)

**Aprovação necessária para:**
- [ ] Tech stack final
- [ ] UI/UX design
- [ ] Alocação de desenvolvedor(es)

---

**Próximo Passo:** Iniciar Sprint 1 (Core Engine)

---

*Course Designer v1.0 - PRD*
*ExímIA OS — Ferramentas de Agentes para Empreendedores*
*26 Janeiro 2026*
