# PRD — Academy (IA Socrática)
**Módulo:** 02_Academy
**Versão:** 5.1
**Data:** 26 Janeiro 2026
**Status:** ⭐ **ESTRATÉGICO** — Pilar de Receita

---

## Sumário Executivo

> **⭐ ESTRATÉGICO:** Academy é pilar de receita. Piloto para Harven.AI. Não negociável.

O módulo **Academy** é um **sistema de aprendizado profundo** que utiliza IA para criar experiências educacionais transformadoras através do método socrático.

**Filosofia:** *"Uma boa pergunta vale mais que mil respostas."*

**Diferencial:** Não transmitimos conhecimento — provocamos insight através de perguntas inteligentes.

**Estratégia de Produto:** Academy é o primeiro produto comercializável do ExímIA OS, servindo como piloto para Harven.AI (plataforma educacional corporativa).

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Filosofia: Método Socrático](#2-filosofia-método-socrático)
3. [Pipeline de 6 Agentes + Course Designer](#3-pipeline-de-6-agentes--course-designer)
4. [Features](#4-features)
5. [Modelos de Dados](#5-modelos-de-dados)
6. [Conexões com Connection Layer](#6-conexões-com-connection-layer)
7. [Fluxos de Usuário](#7-fluxos-de-usuário)
8. [API Endpoints](#8-api-endpoints)
9. [Métricas de Sucesso](#9-métricas-de-sucesso)
10. [Estratégia de Receita](#10-estratégia-de-receita)
11. [Course Creator (Arquitetura Upstream)](#11-course-creator-arquitetura-upstream)

---

# 1. Visão Geral

## 1.1 Por Que Academy Existe

A maioria das plataformas de ensino replica o modelo tradicional online:
- Professores transmitem conhecimento
- Alunos consomem passivamente
- Avaliações medem memorização
- Erro é evitado

**Academy inverte isso.**

```
┌─────────────────────────────────────────────────────────────────┐
│           EDUCAÇÃO TRADICIONAL vs ACADEMY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tradicional                    Academy                          │
│  ────────────                   ───────                          │
│  Conhecimento transmitido  →    Conhecimento emerge             │
│  Erro deve ser evitado     →    Erro é essencial                │
│  IA dá respostas           →    IA faz perguntas                │
│  Avalia memorização        →    Avalia pensamento crítico       │
│  Progresso linear          →    Progresso adaptativo            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.2 Posicionamento Estratégico

| Aspecto | Decisão | Rationale |
|---------|---------|-----------|
| **Pilar de Receita** | Sim | Academy é o primeiro produto vendável |
| **B2C** | Fase 1 | Validação com early adopters do ExímIA OS |
| **B2B** | Fase 2 | Harven.AI para empresas |
| **Pricing** | Freemium | Cursos básicos grátis, avançados pagos |
| **Diferencial** | Método Socrático | Único no mercado com IA socrática real |

## 1.3 Casos de Uso

| Usuário | Objetivo | Como Academy Ajuda |
|---------|----------|-------------------|
| **Empreendedor** | Aprender Product Management | Curso + IA questiona suas decisões de produto |
| **Desenvolvedor** | Dominar arquitetura de sistemas | Estudo de caso + IA desafia suas escolhas arquiteturais |
| **Gestor** | Melhorar liderança | Simulação + IA pergunta sobre motivações e trade-offs |
| **Estudante** | Preparar para entrevista técnica | Problemas + IA faz perguntas de aprofundamento |

---

# 2. Filosofia: Método Socrático

## 2.1 O Que É o Método Socrático

> *"I cannot teach anybody anything. I can only make them think."* — Sócrates

O método socrático é baseado em **perguntas** que:
1. Expõem contradições no pensamento
2. Revelam pressupostos ocultos
3. Aprofundam compreensão
4. Levam a insights pessoais

## 2.2 Aplicação no Academy

### Tradicional (ChatGPT)
```
User: "Como melhorar meu produto?"
AI: "Aqui estão 10 estratégias..."
    [Resposta genérica, sem contexto]
```

### Academy (Socrático)
```
User: "Como melhorar meu produto?"
AI: "Por que você acha que seu produto precisa melhorar?"
User: "As pessoas não estão usando."
AI: "O que você acha que está impedindo elas de usar?"
User: "Talvez seja complexo demais."
AI: "Interessante. O que especificamente é complexo?
     E como você determinou que é complexidade, não falta de valor percebido?"
```

### Os 3 Níveis de Pergunta

| Nível | Objetivo | Exemplo |
|-------|----------|---------|
| **Clarificação** | Entender o que o aluno pensa | "O que você quer dizer com 'complexo'?" |
| **Desafio** | Testar pressupostos | "Por que você assume que complexidade é o problema?" |
| **Síntese** | Provocar insight | "Se não é complexidade, o que mais poderia ser?" |

## 2.3 Princípios de Design

| Princípio | Aplicação |
|-----------|-----------|
| **Perguntas > Respostas** | IA pergunta 3x antes de explicar |
| **Erro é Essencial** | Deixe o aluno chegar a conclusões erradas e perceber |
| **Contexto Importa** | IA usa histórico do curso + Goals do usuário |
| **Adaptação Contínua** | Dificuldade ajusta baseado em respostas |

---

# 3. Pipeline de 6 Agentes + Course Designer

Academy é powered por uma **pipeline de 6 agentes especializados** que transformam conteúdo bruto em experiências educacionais interativas. Para arquitetura completa de cursos, a Academy integra com **Course_Designer** (X_Agent) via **Academy_Orchestrator**.

## 3.1 Arquitetura Completa

```
┌─────────────────────────────────────────────────────────────────┐
│                 COURSE ARCHITECTURE LAYER                        │
│                    (Upstream - X_Agent)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Course_Designer (X_Agent)                                      │
│  ├── Input: Professor requirements                              │
│  ├── Process: ELC+ 2026 / ADDIE / SAM design                   │
│  └── Output: JSON course blueprint                              │
│         ↓                                                       │
│  Academy_Orchestrator (Translation Layer)                       │
│  ├── Receives blueprint                                         │
│  ├── Translates to Harven.AI structure                         │
│  └── Coordinates 6 Academy agents                               │
│                                                                 │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ACADEMY PIPELINE                              │
│                 (Downstream - Content Layer)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Conteúdo Bruto]                                               │
│         ↓                                                       │
│   1. Creator      → Gera perguntas socráticas                   │
│         ↓                                                       │
│   2. Socrates     → Simula diálogo socrático                    │
│         ↓                                                       │
│   3. Analyst      → Detecta IA vs humano                        │
│         ↓                                                       │
│   4. Editor       → Polimento linguístico                       │
│         ↓                                                       │
│   5. Tester       → Validação de qualidade                      │
│         ↓                                                       │
│   6. Organizer    → Persistência estruturada                    │
│         ↓                                                       │
│  [Curso Interativo]                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 3.1.1 Course_Designer Integration (NEW)

**Status:** Especificado em [PRD-Course-Designer-v1.0.md](../../../X_Agents/Course_Designer/PRD-Course-Designer-v1.0.md)

**Purpose:** Criar arquitetura completa de cursos (módulos, sequenciamento, objetivos de aprendizado, avaliação Kirkpatrick) antes da Academy pipeline processar o conteúdo.

**Workflow:**
1. Professor fornece requirements → Course_Designer
2. Course_Designer gera blueprint JSON (estrutura do curso completo)
3. Academy_Orchestrator recebe blueprint
4. Para cada módulo do blueprint:
   - EDITOR estrutura conteúdo do professor
   - CREATOR gera perguntas socráticas baseadas nos objetivos de aprendizado
   - TESTER valida qualidade das perguntas
5. ORGANIZER exporta para Moodle/SCORM
6. ANALYST configura métricas por módulo
7. SOCRATES configura parâmetros de diálogo

**Value Prop:**
- ✅ Cursos arquitetados com rigor pedagógico (ELC+ 2026, Kirkpatrick)
- ✅ Professores economizam 80% do tempo de design
- ✅ Reusável para outros produtos (StratOS, etc.)

## 3.1.2 Academy_Orchestrator (NEW)

**Status:** A implementar (4h estimated)

**Responsibilities:**
- Lightweight translation layer entre Course_Designer e Academy pipeline
- Não tem lógica pedagógica própria (delega para Course_Designer)
- Apenas coordena os 6 agentes existentes baseado no blueprint

**Example:**
```yaml
# Blueprint input (from Course_Designer)
module:
  title: "Discovery & Validation"
  learning_objectives:
    - "Aplicar JTBD em discovery interviews"
  elc_plus_structure:
    immerse: { duration: 43min, activities: [...] }
    reflect: { duration: 29min, activities: [...] }
    # ... 6 stages

# Orchestrator actions
1. call_editor(module.content, module.title)
2. call_creator(module.learning_objectives, depth="socratic")
3. call_tester(questions, quality_threshold=8.0)
4. call_organizer(module_data, export_format="moodle")
5. configure_analyst(module.id, metrics=["engagement", "ai_detection"])
6. configure_socrates(module.id, dialogue_style="maieutic")
```

## 3.2 Descrição dos Agentes

### 1. Creator (Harven_Creator)

**Papel:** Geração de perguntas socráticas a partir de conteúdo educacional.

**Input:** Texto bruto, vídeo transcript, artigo
**Output:** Conjunto de perguntas em 3 níveis (Clarificação, Desafio, Síntese)

**Expertise:**
- Taxonomia de Bloom
- Anti-padrões de perguntas (evita perguntas óbvias)
- Templates de cenários práticos

### 2. Socrates (Harven_Socrates)

**Papel:** Simulação de diálogo socrático interativo.

**Input:** Pergunta + resposta do aluno
**Output:** Próxima pergunta baseada na resposta

**Expertise:**
- Método socrático clássico
- Feedback construtivo (não corrige diretamente)
- Criação de cenários práticos

**Exemplo:**
```
Aluno: "Arquitetura monolítica é ruim."
Socrates: "Por que você diz que é ruim?
           Em que situações um monolito seria adequado?"
```

### 3. Analyst (Harven_Analyst)

**Papel:** Detectar se resposta do aluno foi gerada por IA.

**Input:** Resposta do aluno
**Output:** Score de probabilidade de IA + flags

**Expertise:**
- Métricas de interação (tempo de resposta, padrões de edição)
- Análise de texto (perplex score, telltale phrases)

### 4. Editor (Harven_Editor)

**Papel:** Polimento linguístico de perguntas e conteúdo.

**Input:** Perguntas brutas do Creator
**Output:** Perguntas polidas, sem artefatos de prompt

**Expertise:**
- Preservação de intenção original
- Remoção de "rótulos de artefatos" (ex: "[CLARIFICAÇÃO]")
- Estrutura clara de parágrafos

### 5. Tester (Harven_Tester)

**Papel:** Validação de qualidade das perguntas.

**Input:** Perguntas finais
**Output:** Checklist de critérios (relevância, clareza, profundidade)

**Expertise:**
- Detecção de resposta direta (pergunta não deveria ter resposta óbvia)
- Validação de QA (não repetitiva, não superficial)

### 6. Organizer (Harven_Organizer)

**Papel:** Estruturação e persistência de dados.

**Input:** Perguntas validadas
**Output:** JSON estruturado para banco de dados

**Expertise:**
- Ciclo de vida de sessão
- Metadados (timestamps, versão, agente responsável)
- Exportação para Moodle/SCORM

---

# 4. Features

## 4.1 Features Overview

| Feature | Descrição | Rota |
|---------|-----------|------|
| **Dashboard** | Overview de cursos matriculados e progresso | `/academy` |
| **Course Catalog** | Catálogo de cursos disponíveis | `/academy/catalog` |
| **Course Detail** | Página de detalhe com ementa e preview | `/academy/courses/:id` |
| **Socratic Sessions** | Diálogo interativo com IA | `/academy/courses/:id/lesson/:lessonId` |
| **Progress Tracking** | Visualização de progresso e completion | `/academy/progress` |
| **Badges & Achievements** | Gamificação de aprendizado | `/academy/achievements` |
| **Skill Tree** | Mapa de skills desbloqueadas | `/academy/skills` |

## 4.2 Socratic Sessions (Core Feature)

Uma **Socratic Session** é o coração do Academy — um diálogo de 3+ turnos entre aluno e IA.

### Estrutura de Uma Sessão

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOCRATIC SESSION                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. ABERTURA                                                    │
│     IA: [Pergunta de Clarificação]                              │
│     Aluno: [Resposta inicial]                                   │
│                                                                 │
│  2. DESENVOLVIMENTO                                             │
│     IA: [Pergunta de Desafio baseada na resposta]              │
│     Aluno: [Resposta elaborada]                                 │
│                                                                 │
│  3. SÍNTESE                                                     │
│     IA: [Pergunta de Síntese]                                   │
│     Aluno: [Insight final]                                      │
│                                                                 │
│  4. FEEDBACK                                                    │
│     IA: "Excelente. Você identificou que..."                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Exemplo Real: Product Management

```
Turno 1 (Clarificação)
────────────────────
IA: "Você está lançando um MVP. Como você decide o que entra nele?"
Aluno: "Coloco as features mais importantes."

Turno 2 (Desafio)
────────────────────
IA: "Importante para quem? Para você ou para o usuário?
     E como você sabe o que é importante sem ter lançado?"
Aluno: "Hm, boa pergunta. Acho que preciso validar com usuários primeiro."

Turno 3 (Síntese)
────────────────────
IA: "Exato. E se você só tem 2 semanas para lançar, como decide entre
     'validar tudo' e 'lançar rápido'?"
Aluno: "Precisaria priorizar as hipóteses mais arriscadas."

Turno 4 (Feedback)
────────────────────
IA: "Muito bem. Você chegou ao conceito de 'riskiest assumption test'.
     Isso é exatamente o que Lean Startup recomenda."
```

### Detecção de IA

Quando o Analyst detecta resposta gerada por IA:
```
IA: "Percebi que você pode estar usando IA para responder.
     Não tem problema, mas isso reduz seu aprendizado. Que tal reformular
     com suas próprias palavras?"
```

## 4.3 Course Structure

Cada curso tem:

```
Course
  ├── Lessons (aulas)
  │     ├── Content (texto, vídeo, código)
  │     └── Socratic Questions
  ├── Projects (aplicação prática)
  ├── Assessments (validação de conhecimento)
  └── Resources (materiais complementares)
```

## 4.4 Badges & Skills

### Badges

| Badge | Critério |
|-------|----------|
| **First Step** | Completa primeira lição |
| **Challenger** | Responde 10 perguntas desafiadoras |
| **Deep Thinker** | Tem 5 insights validados pela IA |
| **Course Master** | Completa um curso inteiro |
| **Scholar** | Completa 5 cursos |

### Skills

Skills são "techs" desbloqueadas ao completar cursos:
- Product Management
- System Design
- Leadership
- Financial Modeling
- Data Analysis

Skills aparecem no Brand (expertise pessoal).

---

# 5. Modelos de Dados

## 5.1 Course

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  cover_url?: string;

  // Estrutura
  level: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  lessons: Lesson[];

  // Metadata
  instructor?: string;
  category: string;
  tags: string[];
  skills_unlocked: string[];

  // Status
  status: 'draft' | 'published' | 'archived';
  is_premium: boolean;  // Para receita

  created_at: Date;
  updated_at: Date;
}
```

## 5.2 Lesson

```typescript
interface Lesson {
  id: string;
  course_id: string;

  title: string;
  content: string;  // Markdown or HTML
  video_url?: string;
  order: number;

  // Socratic Questions (geradas pela pipeline)
  questions: SocraticQuestion[];

  // Completion
  estimated_duration_minutes: number;

  created_at: Date;
}
```

## 5.3 SocraticQuestion

```typescript
interface SocraticQuestion {
  id: string;
  lesson_id: string;

  text: string;
  level: 'clarification' | 'challenge' | 'synthesis';
  order: number;

  // Metadata da pipeline
  generated_by: 'creator' | 'socrates';
  quality_score?: number;

  created_at: Date;
}
```

## 5.4 StudentProgress

```typescript
interface StudentProgress {
  id: string;
  user_id: string;
  course_id: string;

  // Progress
  lessons_completed: string[];  // IDs das lições
  current_lesson_id?: string;
  completion_percentage: number;

  // Tracking
  started_at: Date;
  completed_at?: Date;
  last_accessed_at: Date;

  // Performance
  total_questions_answered: number;
  quality_answers_count: number;  // Respostas de alta qualidade
  insights_count: number;  // Insights validados pela IA
}
```

## 5.5 SocraticSession

```typescript
interface SocraticSession {
  id: string;
  user_id: string;
  lesson_id: string;
  question_id: string;

  // Diálogo
  turns: SessionTurn[];

  // Análise
  ai_detection_scores: number[];
  session_quality: 'low' | 'medium' | 'high';

  // Status
  status: 'active' | 'completed';
  started_at: Date;
  completed_at?: Date;
}

interface SessionTurn {
  speaker: 'ai' | 'student';
  message: string;
  timestamp: Date;
  ai_detection_score?: number;  // Se speaker = student
}
```

---

# 6. Conexões com Connection Layer

> Ver [PRD-Connection-Layer-v5.0.md](../00_Core/PRD-Connection-Layer-v5.0.md) para detalhes completos.

## 6.1 Eventos Emitidos por Academy

| Evento | Trigger | Data | Consumidores |
|--------|---------|------|--------------|
| `course.enrolled` | Usuário se matricula | `{course_id, title}` | Journey, Notifications |
| `lesson.completed` | Lição completada | `{lesson_id, course_id}` | Journey (atualiza Goals) |
| `course.completed` | Curso finalizado | `{course_id, skills_unlocked}` | Brand, Journey, Notifications |
| `skill.unlocked` | Skill desbloqueada | `{skill_name}` | Brand (atualiza expertise) |
| `insight.validated` | IA valida insight do aluno | `{insight_text, quality}` | Journey, Brand |

## 6.2 Eventos Consumidos por Academy

| Evento | Source | Ação Academy |
|--------|--------|--------------|
| `goal.created` | Journey | Se category = education, sugere cursos relevantes |
| `book.added` | Journey | Sugere cursos sobre o mesmo tema |
| `initiative.created` | Strategy | Sugere cursos para skill necessária |

## 6.3 Sugestões IA (Bidirecionais)

### Journey → Academy
```yaml
trigger: goal.created
condition:
  - goal.category == 'education'
  - goal.title contains ['product', 'management']
action:
  type: suggestion
  target_module: academy
  confidence: 0.85
  message: "Encontramos um curso relevante: 'Product Management Fundamentals'"
  link_course_id: "pm-101"
```

### Academy → Brand
```yaml
trigger: course.completed
condition:
  - course.skills_unlocked.length > 0
action:
  type: update
  target_module: brand
  payload:
    - add_expertise: course.skills_unlocked
    - update_bio_suggestion: "Adicione '[Skill]' ao seu perfil"
```

---

# 7. Fluxos de Usuário

## 7.1 Descobrir Curso a partir de Goal

```
1. User cria Goal em Journey: "Melhorar habilidades de produto"
2. Connection Layer detecta goal.created
3. Suggestion Engine busca cursos com tag "product management"
4. Notificação aparece em Journey Dashboard:
   "💡 Baseado na sua meta, encontramos: 'Product Management Fundamentals'"
5. User clica → redirecionado para Academy course detail
6. User se matricula
7. Entity Link criado: Goal ↔ Course
8. Progresso no curso atualiza progresso do Goal
```

## 7.2 Completar Sessão Socrática

```
1. User acessa lesson na Academy
2. IA inicia Socratic Session com pergunta de Clarificação
3. User responde
4. Analyst verifica se resposta é de IA (background)
5. Socrates gera próxima pergunta baseada na resposta
6. Repeat 3-5 por 3 turnos
7. IA dá feedback final validando insights
8. Session marcada como completed
9. Evento lesson.completed emitido
10. Goal linkado (se houver) atualiza progresso
```

## 7.3 Desbloquear Skill e Atualizar Brand

```
1. User completa último lesson de curso "System Design"
2. Academy emite course.completed com skills_unlocked: ["System Design"]
3. Connection Layer roteia para Brand module
4. Brand atualiza:
   - Adiciona "System Design" a expertise_areas
   - Gera sugestão de bio: "Adicione System Design ao seu perfil"
5. Notificação aparece para user:
   "🎉 Skill desbloqueada: System Design. Atualizar perfil?"
6. User aceita → redirecionado para Brand
```

---

# 8. API Endpoints

```
# Courses
GET    /api/academy/courses
GET    /api/academy/courses/:id
POST   /api/academy/courses/:id/enroll
GET    /api/academy/courses/:id/lessons

# Lessons
GET    /api/academy/lessons/:id
POST   /api/academy/lessons/:id/start
POST   /api/academy/lessons/:id/complete

# Socratic Sessions
POST   /api/academy/socratic/start
POST   /api/academy/socratic/message
GET    /api/academy/socratic/session/:id

# Progress
GET    /api/academy/progress
GET    /api/academy/progress/course/:courseId

# Achievements
GET    /api/academy/badges
GET    /api/academy/skills

# Admin (Pipeline)
POST   /api/academy/admin/generate-course
POST   /api/academy/admin/run-pipeline
GET    /api/academy/admin/pipeline-status
```

---

# 9. Métricas de Sucesso

## 9.1 Métricas Primárias

| Métrica | Cálculo | Target |
|---------|---------|--------|
| **Course Completion Rate** | Cursos finalizados / Iniciados | > 40% |
| **Socratic Engagement** | Msgs por sessão socrática | ≥ 3 turnos |
| **Return Rate** | Voltou em 7 dias após sessão | > 60% |
| **Insight Quality** | Insights validados / total respostas | > 20% |

## 9.2 Métricas de Pipeline

| Métrica | O Que Mede | Target |
|---------|------------|--------|
| **AI Detection Accuracy** | Acurácia do Analyst | > 85% |
| **Question Quality Score** | Score médio do Tester | > 7/10 |
| **Pipeline Success Rate** | Cursos gerados sem erro | > 95% |

## 9.3 Métricas de Conexão

| Métrica | O Que Mede | Target |
|---------|------------|--------|
| **Goal → Course Link Rate** | Cursos iniciados via sugestão de Goal | > 30% |
| **Skill Unlock → Brand Update** | Skills adicionadas ao Brand | > 70% |

---

# 10. Estratégia de Receita

## 10.1 Por Que Academy É o Pilar de Receita

| Fator | Rationale |
|-------|-----------|
| **Diferencial claro** | Método socrático com IA é único no mercado |
| **Value prop forte** | Aprendizado profundo > consumo passivo |
| **Low friction** | Já integrado ao ExímIA OS |
| **B2B path clear** | Harven.AI para empresas é próximo passo |

## 10.2 Modelo de Pricing (Freemium)

### Tier Free

- Acesso a 3 cursos básicos
- Unlimited lessons
- Socratic sessions básicas
- Badges

### Tier Pro ($19/mês)

- Unlimited courses
- Socratic sessions avançadas
- Skill tree completo
- Certificados
- Priority support

### Tier Enterprise (Custom)

- Harven.AI white-label
- Custom courses
- LMS integration (Moodle, Canvas)
- Analytics dashboard
- Dedicated support

## 10.3 Roadmap de Monetização

| Fase | Ação | Timeline |
|------|------|----------|
| **Fase 1** | Lançar Academy Free | Q1 2026 |
| **Fase 2** | Adicionar Tier Pro | Q2 2026 |
| **Fase 3** | Validar demand com 100 Pro users | Q2 2026 |
| **Fase 4** | Extrair Harven.AI como produto B2B | Q3 2026 |

---

# 11. Course Creator (Arquitetura Upstream)

## 11.1 Problema Identificado

A Academy pipeline (6 agentes) processa conteúdo mas **assume que a estrutura do curso já existe**. Professores precisam:
- Decidir quantos módulos criar
- Sequenciar conteúdo (pré-requisitos)
- Mapear objetivos de aprendizado
- Planejar avaliação (Kirkpatrick)
- Balancear estilos de aprendizagem

**Gap:** Academy não ajuda na arquitetura do curso — só na interatividade.

## 11.2 Solução: Hybrid Architecture

**Recomendação:** Criar **Course_Designer** como X_Agent reutilizável + **Academy_Orchestrator** como camada de integração leve.

### Arquitetura

```
Course_Designer (X_Agent - Reusável)
    ↓ (JSON blueprint)
Academy_Orchestrator (Harven-specific, 4h build)
    ↓ (coordena)
6 Academy Agents (unchanged)
    ↓
Harven.AI Course Ready
```

### Benefícios

| Benefício | Impacto |
|-----------|---------|
| **Reusável** | Course_Designer funciona para StratOS, futuras ventures |
| **Testável** | Z4_Auditor valida isoladamente |
| **Escalável** | Outros produtos criam seus orchestrators |
| **B2B Ready** | Course_Designer vendível standalone |
| **Academy intacta** | 6 agentes não mudam |

## 11.3 Course_Designer Capabilities

**Baseado em:** ELC_Architect + LXD_Architect + David Kolb Clone

**Core Features:**
- ✅ ELC+ 2026 (6 estágios: IMMERSE, REFLECT, CONCEPTUALIZE, EXPERIMENT, CALIBRATE, INTEGRATE)
- ✅ 61+ frameworks (ADDIE, SAM, Action Mapping, Backward Design)
- ✅ Kirkpatrick 4+1 evaluation
- ✅ 4 learning styles coverage
- ✅ Module sequencing (prerequisites, spiral curriculum)
- ✅ Content chunking (Miller 7±2, cognitive load)
- ✅ LMS export readiness (Moodle, Canvas, SCORM)

**Input:** Professor requirements (course title, duration, audience, business goal)
**Output:** JSON blueprint (complete course architecture)

**Spec:** [PRD-Course-Designer-v1.0.md](../../../X_Agents/Course_Designer/PRD-Course-Designer-v1.0.md)

## 11.4 Academy_Orchestrator

**Purpose:** Lightweight translation layer entre Course_Designer blueprint e Academy pipeline.

**Responsibilities:**
1. Receive JSON blueprint from Course_Designer
2. For each module:
   - Call EDITOR → structure professor's content
   - Call CREATOR → generate Socratic questions based on learning objectives
   - Call TESTER → validate question quality
   - Aggregate into Harven.AI session format
3. Call ORGANIZER → Moodle XML export
4. Configure ANALYST → set metrics per module
5. Configure SOCRATES → dialogue parameters

**Estimated Build:** 4 hours (lightweight, no pedagogy logic)

## 11.5 Implementation Timeline

| Phase | Deliverable | Duration |
|-------|-------------|----------|
| **Phase 1** | Course_Designer (X_Agent) via Z Squad | 11h |
| **Phase 2** | Academy_Orchestrator | 4h |
| **Phase 3** | Integration testing | 3h |
| **Total** | | **18h** |

**ROI:** 18h investment saves 9h per product. Payback after 2 products.

## 11.6 Strategic Value

| Value | Description |
|-------|-------------|
| **Positions eximIA.OS as enterprise-grade LXD platform** | Completa arquitetura de aprendizado, não só Q&A |
| **Enables B2B sales of Course_Designer standalone** | Pode ser vendido isoladamente |
| **Future-proof for multi-product portfolio** | Reutilizável em StratOS, futuras ventures |
| **Professores economizam 80% do tempo** | De design manual para blueprint automático |

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| **5.1** | 26/01/2026 | Adicionada integração com Course_Designer (X_Agent). Academy_Orchestrator especificado. Seção 11 completa. |
| **5.0** | 25/01/2026 | Modularização do PRD original. Expansão de pipeline de 6 agentes. Estratégia de receita. |

---

## Referências

- [PRD-Connection-Layer-v5.0.md](../00_Core/PRD-Connection-Layer-v5.0.md) — Integração de eventos
- [PRD-Journey-v5.0.md](../01_Journey/PRD-Journey-v5.0.md) — Sugestões baseadas em Goals
- [PRD-Brand-v5.0.md](../03_Brand/PRD-Brand-v5.0.md) — Skills e expertise
- [MANIFESTO.md](../MANIFESTO.md) — Visão e filosofia

### Sobre Harven.AI

Academy é o piloto para **Harven.AI** — plataforma educacional corporativa que usa IA socrática para treinamento empresarial. O pipeline de 6 agentes foi projetado desde o início para escalar para B2B.

---

*Academy v5.1 — Perguntas que Transformam*
*ExímIA OS — 2026*
