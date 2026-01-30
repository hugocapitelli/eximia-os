# Academy Cursos (Catálogo)

## Visão Geral

**Módulo:** Academy
**Tela:** Cursos (Catálogo)
**Prioridade:** P0 (MVP)
**Status:** Especificação Completa

**Propósito:** Exibir o catálogo de cursos disponíveis, cursos em andamento e cursos concluídos. É o ponto de entrada principal do módulo Academy.

---

## Wireframe Principal

```
┌─────────────────────────────────────────────────────────────────────────┐
│  🎓 ACADEMY                                    [🔍 Buscar Cursos] [⚙️]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📊 MEU PROGRESSO                                                 │   │
│  │                                                                  │   │
│  │  Cursos em andamento: 3  │  Concluídos: 8  │  Certificados: 5   │   │
│  │                                                                  │   │
│  │  XP Total: 2.450 pts  │  Nível: Aprendiz Avançado (Lv. 7)       │   │
│  │  ━━━━━━━━━━━━━━━●━━━━━━━━━  450/800 para Lv. 8                  │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📖 CONTINUAR APRENDENDO                                          │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  ┌──────┐  Product Management 101                               │   │
│  │  │      │  ━━━━━━━━━━━━━━━●━━━━━━━  68% • 4/6 módulos          │   │
│  │  │[CAPA]│  Última sessão: Ontem                                 │   │
│  │  │      │  [Continuar →]                                        │   │
│  │  └──────┘                                                       │   │
│  │                                                                  │   │
│  │  ┌──────┐  UX Design Fundamentals                               │   │
│  │  │      │  ━━━━━━━●━━━━━━━━━━━━━━━  35% • 2/7 módulos          │   │
│  │  │[CAPA]│  Última sessão: 3 dias atrás                          │   │
│  │  │      │  [Continuar →]                                        │   │
│  │  └──────┘                                                       │   │
│  │                                                                  │   │
│  │  ┌──────┐  Persuasive Writing                                   │   │
│  │  │      │  ━━━●━━━━━━━━━━━━━━━━━━━  15% • 1/5 módulos          │   │
│  │  │[CAPA]│  Última sessão: 1 semana atrás                        │   │
│  │  │      │  [Continuar →]                                        │   │
│  │  └──────┘                                                       │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ [Todos] [Negócios] [Design] [Tech] [Marketing] [Soft Skills]    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 🔥 RECOMENDADOS PARA VOCÊ                                        │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  Baseado na sua meta "Lançar MVP do ExímIA APP":                │   │
│  │                                                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │          │  │          │  │          │  │          │        │   │
│  │  │  [CAPA]  │  │  [CAPA]  │  │  [CAPA]  │  │  [CAPA]  │        │   │
│  │  │          │  │          │  │          │  │          │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  │   Agile PM      Growth       User         Startup              │   │
│  │   ⭐ 4.8        Hacking     Research      Metrics              │   │
│  │   6 módulos     ⭐ 4.7      ⭐ 4.9        ⭐ 4.6               │   │
│  │   [+ Inscrever] 8 módulos   5 módulos    4 módulos            │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 📚 CATÁLOGO COMPLETO                              [Ver Todos →] │   │
│  ├─────────────────────────────────────────────────────────────────┤   │
│  │                                                                  │   │
│  │  Grid de cursos (3-4 colunas)                                   │   │
│  │                                                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │  [CAPA]  │  │  [CAPA]  │  │  [CAPA]  │  │  [CAPA]  │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  │   Curso 1       Curso 2       Curso 3       Curso 4            │   │
│  │                                                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │   │
│  │  │  [CAPA]  │  │  [CAPA]  │  │  [CAPA]  │  │  [CAPA]  │        │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘        │   │
│  │   Curso 5       Curso 6       Curso 7       Curso 8            │   │
│  │                                                                  │   │
│  │  [Carregar mais...]                                              │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Course Card Component

```
┌────────────────────────────────────┐
│                                    │
│           [CAPA/THUMB]             │
│                                    │
│  🏷️ Categoria                      │
│                                    │
├────────────────────────────────────┤
│                                    │
│  Título do Curso                   │
│  Descrição breve em duas          │
│  linhas no máximo...              │
│                                    │
│  ⭐ 4.8  │  📚 6 módulos  │ 🕐 4h   │
│                                    │
│  [Iniciar Curso] ou [Continuar]   │
│                                    │
└────────────────────────────────────┘
```

### Card States

| Estado | Visual |
|--------|--------|
| Não iniciado | Botão "Iniciar Curso" |
| Em andamento | Progress bar + "Continuar" |
| Concluído | Badge "Concluído" + Rating |
| Locked (Pro) | Overlay + "🔒 Pro" |

---

## TypeScript Interfaces

```typescript
type CourseCategory = 'business' | 'design' | 'tech' | 'marketing' | 'soft_skills' | 'leadership';
type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
type CourseStatus = 'not_started' | 'in_progress' | 'completed';

interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  coverImage: string;

  // Structure
  category: CourseCategory;
  level: CourseLevel;
  modules: CourseModule[];
  totalModules: number;
  estimatedHours: number;

  // Metadata
  author: string;
  authorAvatar?: string;
  tags: string[];
  skills: string[];                 // Skills desbloqueadas ao completar

  // Stats
  rating: number;                   // 1-5
  ratingCount: number;
  enrolledCount: number;

  // Gamification
  xpReward: number;
  certificateId?: string;

  // Access
  isPro: boolean;                   // Requer assinatura Pro
  isNew: boolean;
  isFeatured: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  estimatedMinutes: number;
}

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'socratic' | 'quiz' | 'exercise';
  order: number;
  estimatedMinutes: number;
  content?: string;                 // Para lessons de leitura
  videoUrl?: string;                // Para lessons de vídeo
  socraticPrompt?: string;          // Para sessões socráticas
}

interface UserCourseProgress {
  courseId: string;
  status: CourseStatus;
  progress: number;                 // 0-100
  currentModuleId: string;
  currentLessonId: string;
  completedLessons: string[];
  startedAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  rating?: number;
  review?: string;
}

interface CoursesPageData {
  userProgress: {
    level: number;
    xp: number;
    xpToNextLevel: number;
    coursesInProgress: number;
    coursesCompleted: number;
    certificatesEarned: number;
  };
  inProgressCourses: (Course & { progress: UserCourseProgress })[];
  recommendedCourses: Course[];
  allCourses: Course[];
  categories: CourseCategory[];
}
```

---

## Filtros e Busca

### Filtros Disponíveis

| Filtro | Opções |
|--------|--------|
| **Categoria** | Negócios, Design, Tech, Marketing, Soft Skills, Liderança |
| **Nível** | Iniciante, Intermediário, Avançado |
| **Duração** | < 2h, 2-5h, 5-10h, > 10h |
| **Status** | Todos, Não iniciados, Em andamento, Concluídos |
| **Acesso** | Gratuitos, Pro |

### Ordenação

- Mais populares
- Melhor avaliados
- Mais recentes
- Por progresso

---

## Integração Connection Layer

```
Events Emitidos:
- academy.courses.viewed { user_id, filters }
- academy.course.enrolled { course_id, user_id }
- academy.course.clicked { course_id }

Events Consumidos:
- goal.created → Sugere cursos relacionados
- skill.gap.detected → Destaca cursos relevantes
- course.completed → Atualiza lista de recomendações
```

---

## AI Recommendations

### Recommendation Engine

```typescript
interface CourseRecommendation {
  courseId: string;
  reason: string;
  confidence: number;              // 0-100
  basedOn: 'goal' | 'skill_gap' | 'similar_users' | 'history';
  relatedGoalId?: string;
}

// Exemplos de reasons:
// - "Baseado na sua meta 'Lançar MVP do ExímIA APP'"
// - "Usuários como você também gostaram"
// - "Para completar sua skill 'Product Management'"
// - "Baseado no curso 'UX Design' que você gostou"
```

---

## Estados da UI

### Empty State (Sem cursos em andamento)
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                           🎓                                        │
│                                                                     │
│              Comece sua jornada de aprendizado!                    │
│                                                                     │
│     Escolha um curso abaixo para começar a aprender               │
│     de forma interativa com IA.                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Empty Search Results
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                           🔍                                        │
│                                                                     │
│              Nenhum curso encontrado                               │
│                                                                     │
│     Tente buscar por outros termos ou                             │
│     remova alguns filtros.                                        │
│                                                                     │
│                      [Limpar Filtros]                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Dados Mock (Referência)

**Localização:** `app/src/data/academy-cursos-mock.ts`

```typescript
export const MOCK_COURSES: Course[] = [
  {
    id: 'course_pm_101',
    title: 'Product Management 101',
    description: 'Aprenda os fundamentos de gestão de produto...',
    category: 'business',
    level: 'beginner',
    totalModules: 6,
    estimatedHours: 8,
    rating: 4.8,
    xpReward: 500,
    isPro: false,
    // ...
  },
  // ... mais cursos
];
```
