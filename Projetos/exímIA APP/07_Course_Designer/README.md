# Course Designer v1.0
**Status:** ✅ **PRD COMPLETO - PRONTO PARA REVISÃO**
**Tipo:** Ferramenta Interna ExímIA OS
**Data:** 26 Janeiro 2026

---

## 🎯 O QUE É

**Engine lógico** que transforma ideias de cursos em arquiteturas pedagógicas completas.

```
INPUT (5 min)               →    OUTPUT (30 seg)
─────────────────────────────────────────────────────────
Título do curso             →    10 módulos estruturados
Público-alvo                →    Problemas-motor por módulo
Duração total               →    Ciclo ELC+ (6 estágios)
Objetivo de negócio         →    Rubricas de avaliação
                            →    Roteiro de facilitação
                            →    Quality Score: 92.5/100
```

**Resultado:** De 40-80h de design manual → 1h (98% faster)

---

## 📁 ESTRUTURA DE ARQUIVOS

```
07_Course_Designer/
├── README.md                           ← Este arquivo
├── HANDOFF_COURSE_DESIGNER.md          ← Resumo executivo detalhado
└── PRD-Course-Designer-v1.0.md         ← PRD completo (1,066 linhas)

99_Analysis/
├── COURSE_DESIGN_METHODOLOGIES_RESEARCH.md    ← Pesquisa (40+ fontes)
├── COURSE_DESIGNER_LOGIC_ARCHITECTURE.md      ← Arquitetura (12 algoritmos)
├── EXPERIENTIAL_LEARNING_METHODOLOGY.md       ← Metodologia Kolb 6-stage
└── TASK_COMPLETION_SUMMARY_26-01-2026.md      ← Task summary completo
```

**Total de documentação:** ~25,000 palavras
**Status:** ✅ Todos arquivos completos

---

## 🚀 QUICK START (Para Revisar)

### 1. Leia o PRD Principal (20 min)
📄 `PRD-Course-Designer-v1.0.md`

**O que tem:**
- Visão geral do produto
- Metodologia (Kolb + ELC+)
- Arquitetura (5 fases, 12 algoritmos)
- Input/output schemas
- Features detalhadas
- Tech stack (Python + Next.js)
- Roadmap de implementação (8 semanas)

---

### 2. Revise o Handoff (10 min)
📄 `HANDOFF_COURSE_DESIGNER.md`

**O que tem:**
- Executive summary
- Key features explicadas
- Exemplos de output
- Casos de uso
- Decisões necessárias
- Perguntas para discutir

---

### 3. (Opcional) Aprofunde na Pesquisa (30 min)
📄 `COURSE_DESIGN_METHODOLOGIES_RESEARCH.md`
📄 `COURSE_DESIGNER_LOGIC_ARCHITECTURE.md`
📄 `EXPERIENTIAL_LEARNING_METHODOLOGY.md`

**O que tem:**
- 40+ fontes acadêmicas
- Comparação de 7 frameworks
- 12 algoritmos com pseudocódigo
- Passo a passo prático Kolb

---

## 💡 CONCEITO EM 60 SEGUNDOS

### Problema
Empreendedores ExímIA precisam criar cursos mas:
- ❌ Não têm formação em pedagogia
- ❌ Gastam 40-80h desenhando "na intuição"
- ❌ Resultado: baixa retenção (10-30%)

### Solução
Course Designer automatiza design instrucional:
- ✅ Input: 5 campos básicos (5 min)
- ✅ Processing: Algoritmos + metodologias (30 seg)
- ✅ Output: Blueprint completo (retenção 70-85%)

### Diferencial
```
TRADICIONAL:
Tópicos → Slides → "Espera" que aluno aprenda

COURSE DESIGNER:
Competência → Problema-motor → Experiência → Validação
```

---

## 🏗️ ARQUITETURA DO ENGINE

### 5 Fases de Processamento

```
┌─────────────────────────────────────────────┐
│  PHASE 1: ANALYZER                          │
│  ├── Parse input                            │
│  ├── Select framework (decision tree)       │
│  └── Profile audience                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  PHASE 2: ARCHITECT                         │
│  ├── Generate objectives (Bloom + ABCD)     │
│  ├── Design assessments FIRST               │
│  ├── Sequence modules                       │
│  └── Map ELC+ (6 stages per module)         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  PHASE 3: CALCULATOR                        │
│  ├── Allocate durations                     │
│  ├── Analyze cognitive load (≤7 chunks)     │
│  └── Optimize chunks                        │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  PHASE 4: VALIDATOR                         │
│  ├── Check alignment (1:1)                  │
│  ├── Validate Bloom progression             │
│  └── Generate quality score (0-100)         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│  PHASE 5: GENERATOR                         │
│  ├── Build JSON blueprint                   │
│  ├── Create problema-motor                  │
│  └── Generate facilitation script           │
└─────────────────────────────────────────────┘
```

### 12 Algoritmos Principais
1. Framework Selector
2. Objective Generator
3. Assessment Designer
4. Module Sequencer
5. ELC+ Mapper
6. Duration Allocator
7. Cognitive Load Analyzer
8. Chunk Optimizer
9. Alignment Validator
10. Bloom Progression Validator
11. Completeness Auditor
12. Quality Scorecard

---

## 📊 METODOLOGIA BASE

### Kolb 6-Stage = ELC+ 2026

```
ETAPA            ELC+ 2026         TEMPO    O QUE ACONTECE
──────────────────────────────────────────────────────────────
SENTIR        →  IMMERSE           18%     Problema-motor
OBSERVAR      →  REFLECT           12%     Reflexão crítica
PENSAR        →  CONCEPTUALIZE     18%     Framework teórico
FAZER         →  EXPERIMENT        18%     Aplicar framework
VALIDAR       →  CALIBRATE         12%     Peer review
INTERNALIZAR  →  INTEGRATE         22%     Plano de aplicação
```

**Por que esta estrutura?**
- Baseada em Kolb (aprendizagem experiencial)
- Alinhada com ELC+ 2026 (ExímIA standard)
- Validada por 40+ fontes acadêmicas
- Retenção: 70-85% (vs 10-30% tradicional)

---

## 🎯 KEY FEATURES

### 1. Geração de Problemas-Motor
Cria automaticamente casos práticos que servem como "âncora" do aprendizado.

**Exemplo:**
> **O CEO quer feature ontem**
>
> CEO liga sexta 17h: "Vi concorrente com feature X. Preciso segunda."
> Você tem 15 min para decidir: Aceitar / Recusar / Negociar

---

### 2. Rubrica Automática
Para cada competência, gera rubrica 0-2 por critério.

```yaml
clareza_perguntas:
  0: Perguntas fechadas
  1: Mix abertas/fechadas
  2: 100% abertas
  peso: 25%
```

---

### 3. Roteiro de Facilitação
Script minuto a minuto do que o professor fala/faz.

```markdown
[0-10 min] SENTIR
├── Abertura (2 min): "Hoje vocês vão viver..."
├── Apresentar caso (3 min): Compartilhar link
└── Decisão individual (10 min): Timer + template
```

---

### 4. Quality Scorecard
Validação multi-dimensional (0-100).

| Dimensão | Peso | Mede |
|----------|------|------|
| Alignment | 30% | Objetivo ↔ Assessment |
| Bloom Progression | 20% | Espiral lógica |
| ELC+ Completeness | 25% | 6 estágios completos |
| Duration | 15% | Attention span |
| Cognitive Load | 10% | ≤7 chunks |

**Rating:** 90-100 = EXCELLENT ⭐

---

### 5. Spiral Curriculum
Progressão automática de complexidade módulo a módulo.

```
M1: Caso simples (1 variável)
M2-3: Complexidade (2-3 variáveis)
M4-6: Conflito humano (stakeholders)
M7-9: Mundo real (projeto do aluno)
M10: Síntese + meta-reflexão
```

---

## 💻 TECH STACK

### Backend
- **Python 3.11+**
- Pydantic (schema validation)
- pandas (data processing)
- networkx (dependency graphs)
- reportlab (PDF generation)

### Frontend
- **Next.js 14 + React**
- Components: CourseForm, BlueprintViewer, ModuleCard

### Storage
- Dev: JSON files
- Prod: PostgreSQL

---

## 📅 ROADMAP

### 8 Semanas (5 Sprints)

```
Sprint 1 (2 weeks): Core Engine
├── Analyzer + Architect + Generator
└── CLI funcional

Sprint 2 (2 weeks): ELC+ & Validation
├── ELC+ Mapper (6 stages)
├── Calculator + Validator
└── Quality scorecard

Sprint 3 (1 week): Problema-Motor & Assets
├── Problema-motor generator
├── Rubrica generator
└── Roteiro de facilitação

Sprint 4 (2 weeks): Frontend & UX
├── Next.js app
├── Forms + Blueprint viewer
└── Export (PDF/JSON)

Sprint 5 (1 week): Polish & Launch
├── User testing
├── Documentation
└── Deploy
```

**Target Launch:** Março 2026

---

## 📈 MÉTRICAS ESPERADAS

### Eficiência
- ⏱️ **Time to blueprint:** 5 min (vs 40-80h)
- 📊 **Quality score:** Target ≥85/100
- 🎯 **Retenção:** 70-85% (vs 10-30%)

### Adoção
- 👥 **Usuários:** Todos empreendedores ExímIA
- 📈 **Cursos criados:** Target 20+ (Q1 2026)
- ⭐ **NPS:** Target ≥50

---

## ❓ DECISÕES NECESSÁRIAS

### Tech
- [ ] Python + Next.js está OK?
- [ ] PostgreSQL está OK?
- [ ] Deploy: Vercel + Railway?

### Produto
- [ ] Integrar com LXD_Architect?
- [ ] Biblioteca de templates reutilizáveis?
- [ ] Feature de "clone curso"?

### Roadmap
- [ ] 8 semanas é OK?
- [ ] MVP: CLI primeiro, UI depois?
- [ ] Qual curso usar para validação?

---

## 📚 EXEMPLOS DE USO

### Caso 1: Curso Longo (40h)
```
INPUT:
- Título: Product Management Fundamentals
- Público: PMs júnior (1-3 anos)
- Duração: 40h (12 semanas)

OUTPUT:
- 10 módulos (4h cada)
- Problema-motor por módulo
- Quality: 92.5/100 ⭐
```

### Caso 2: Workshop Intensivo (8h)
```
INPUT:
- Título: Feedbacks Difíceis
- Público: Tech Leads
- Duração: 8h (2 dias)

OUTPUT:
- 2 módulos intensivos
- Role-play como problema-motor
- Quality: 88/100
```

### Caso 3: Treinamento Corporativo (16h)
```
INPUT:
- Título: Compliance LGPD
- Público: Gestores
- Duração: 16h (4 semanas)

OUTPUT:
- 4 módulos
- Casos reais de vazamentos
- Quality: 85/100
```

---

## 🎓 RESEARCH FOUNDATION

Tudo baseado em pesquisa extensiva:

**Documentos:**
1. `COURSE_DESIGN_METHODOLOGIES_RESEARCH.md` (4,500 palavras)
   - 40+ fontes citadas
   - 7 frameworks comparados (ADDIE, SAM, Kolb, etc.)

2. `COURSE_DESIGNER_LOGIC_ARCHITECTURE.md` (9,000 palavras)
   - 5 fases detalhadas
   - 12 algoritmos com pseudocódigo Python

3. `EXPERIENTIAL_LEARNING_METHODOLOGY.md` (10,000 palavras)
   - Kolb 6-stage explicado
   - Passo a passo prático
   - Templates completos

**Total:** ~24,000 palavras de documentação técnica

---

## ✅ STATUS ATUAL

### ✅ Completo
- [x] PRD completo (1,066 linhas)
- [x] Pesquisa extensiva (40+ fontes)
- [x] Arquitetura definida (5 fases, 12 algoritmos)
- [x] Metodologia validada (Kolb + ELC+)
- [x] Tech stack decidido
- [x] Roadmap executável (8 semanas)

### ⏳ Aguardando
- [ ] Revisão do Hugo
- [ ] Aprovação de tech stack
- [ ] Aprovação de timeline
- [ ] Alocação de dev(s)
- [ ] Go/no-go para Sprint 1

---

## 🚀 PRÓXIMOS PASSOS

### 1. Hugo Revisa
Arquivos para revisar:
1. `PRD-Course-Designer-v1.0.md` (PRD completo)
2. `HANDOFF_COURSE_DESIGNER.md` (resumo executivo)

**Tempo estimado:** 30 min

---

### 2. Decisões
- Aprovar tech stack?
- Aprovar timeline (8 semanas)?
- Alocar desenvolvedor(es)?
- Prioridade vs outros projetos?

---

### 3. Se Aprovado → Sprint 1
**Início:** Imediato
**Ações:**
1. Criar repo: `eximia-os/course-designer`
2. Setup Python project
3. Implementar schemas (Pydantic)
4. Começar Phase 1: Analyzer

---

## 💬 CONTATO

**Owner:** Hugo Capitelli
**Data:** 26 Janeiro 2026
**Status:** 🚧 **AGUARDANDO REVISÃO**

**Para discussão:**
Marcar call para alinhar decisões técnicas + roadmap.

---

*Course Designer v1.0*
*ExímIA OS — Ferramentas de Agentes para Empreendedores*
*"Saídas primeiro, slides depois."*
