# Story EXIMIA-022: Academy Courses Catalog

**Story ID:** EXIMIA-022
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 7
**Pontos:** 13
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-015 (Academy Schema), EXIMIA-016 (Academy API/UI)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** navegar por um catálogo de cursos organizados por categoria,
**Para que** eu possa encontrar e começar cursos relevantes para meu desenvolvimento.

---

## Contexto

Catálogo de cursos da Academy com sistema de progressão, filtros e
recomendações baseadas no perfil do usuário.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec (Catálogo)** | `docs/features/Academy/ACADEMY_CURSOS.md` | Wireframes, interfaces, eventos |
| **Feature Spec (Detalhe)** | `docs/features/Academy/ACADEMY_CURSO_DETAIL.md` | Detalhe do curso, módulos, lições |
| **Mock Data** | `app/src/data/academy-cursos-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/academy.ts` | Course, Module, Lesson interfaces |

---

## Acceptance Criteria

### Catálogo de Cursos
- [ ] Grid de cursos com thumbnail, título, instrutor, duração
- [ ] Filtros por categoria (Development, Business, Marketing, etc.)
- [ ] Filtros por nível (Beginner, Intermediate, Advanced)
- [ ] Filtros por duração
- [ ] Busca por título ou descrição
- [ ] Badge de progresso se curso iniciado
- [ ] Seção "Continue Aprendendo" (cursos em andamento)
- [ ] Seção "Recomendados para Você"

### Card de Curso
- [ ] Thumbnail/capa do curso
- [ ] Título e descrição curta
- [ ] Instrutor com avatar
- [ ] Duração total
- [ ] Nível de dificuldade
- [ ] Rating (estrelas)
- [ ] Progress bar (se iniciado)
- [ ] Badge "Novo" ou "Em Alta"

### Página de Detalhe do Curso
- [ ] Hero com thumbnail, título, instrutor
- [ ] Descrição completa
- [ ] O que você vai aprender (lista)
- [ ] Requisitos/pré-requisitos
- [ ] Lista de módulos com lições
- [ ] Progresso atual
- [ ] Botão "Iniciar Curso" ou "Continuar"
- [ ] Reviews e ratings
- [ ] Cursos relacionados

### Player de Lição
- [ ] Tipo vídeo: player com controles
- [ ] Tipo texto: conteúdo markdown
- [ ] Tipo quiz: perguntas interativas
- [ ] Marcar lição como concluída
- [ ] Navegação prev/next
- [ ] Sidebar com lista de lições (colapsável)

---

## Technical Details

### Database Schema (Extensão)

```sql
-- Courses (admin-created)
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  thumbnail_url TEXT,
  instructor_name TEXT NOT NULL,
  instructor_avatar TEXT,
  instructor_bio TEXT,

  -- Categorization
  category TEXT NOT NULL,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  tags TEXT[],

  -- Duration
  duration_minutes INTEGER DEFAULT 0,
  lessons_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,

  -- Requirements
  prerequisites TEXT[],
  learning_outcomes TEXT[],

  -- Stats
  enrolled_count INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0,
  ratings_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Course Modules
CREATE TABLE course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Course Lessons
CREATE TABLE course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'text', 'quiz', 'exercise')),
  content_url TEXT, -- video URL or markdown content
  content_text TEXT, -- for text lessons
  duration_minutes INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false, -- free preview
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Course Enrollments
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ,
  progress_percent INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  watch_time_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, lesson_id)
);

-- Course Reviews
CREATE TABLE course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX idx_courses_category ON courses(category) WHERE status = 'published';
CREATE INDEX idx_courses_level ON courses(level) WHERE status = 'published';
CREATE INDEX idx_course_enrollments_user ON course_enrollments(user_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id, course_id);

-- RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (status = 'published');
CREATE POLICY "Users can manage own enrollments" ON course_enrollments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own progress" ON lesson_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own reviews" ON course_reviews FOR ALL USING (auth.uid() = user_id);
```

### Server Actions

```typescript
// lib/actions/courses.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCourses(filters?: {
  category?: string;
  level?: string;
  search?: string;
}) {
  const supabase = await createClient();

  let query = supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("is_featured", { ascending: false })
    .order("enrolled_count", { ascending: false });

  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.level) query = query.eq("level", filters.level);
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      *,
      modules:course_modules(
        *,
        lessons:course_lessons(*)
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) throw error;

  // Get user enrollment if logged in
  let enrollment = null;
  let lessonProgress: Record<string, boolean> = {};

  if (user) {
    const { data: enrollmentData } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .single();

    enrollment = enrollmentData;

    if (enrollment) {
      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed")
        .eq("user_id", user.id)
        .eq("course_id", course.id);

      lessonProgress = (progress || []).reduce((acc, p) => {
        acc[p.lesson_id] = p.completed;
        return acc;
      }, {} as Record<string, boolean>);
    }
  }

  return { course, enrollment, lessonProgress };
}

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("course_enrollments").insert({
    user_id: user.id,
    course_id: courseId,
  });

  if (error) throw error;

  // Increment enrolled count
  await supabase.rpc("increment_enrolled_count", { course_id: courseId });

  revalidatePath("/academy");
}

export async function completeLesson(lessonId: string, courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("lesson_progress").upsert({
    user_id: user.id,
    lesson_id: lessonId,
    course_id: courseId,
    completed: true,
    completed_at: new Date().toISOString(),
  });

  // Update course progress
  await updateCourseProgress(user.id, courseId);

  revalidatePath(`/academy/courses`);
}

async function updateCourseProgress(userId: string, courseId: string) {
  const supabase = await createClient();

  // Get total lessons
  const { count: totalLessons } = await supabase
    .from("course_lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);

  // Get completed lessons
  const { count: completedLessons } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .eq("completed", true);

  const progress = Math.round(((completedLessons || 0) / (totalLessons || 1)) * 100);

  await supabase
    .from("course_enrollments")
    .update({
      progress_percent: progress,
      last_accessed_at: new Date().toISOString(),
      completed_at: progress === 100 ? new Date().toISOString() : null,
    })
    .eq("user_id", userId)
    .eq("course_id", courseId);
}
```

---

## Tasks

- [ ] Criar migration para tabelas de courses
- [ ] Implementar server actions para courses
- [ ] Criar página /academy (catálogo)
- [ ] Implementar CourseCard component
- [ ] Criar filtros e busca
- [ ] Criar página /academy/courses/[slug]
- [ ] Implementar CourseDetail component
- [ ] Criar LessonPlayer component
- [ ] Implementar progress tracking
- [ ] Criar seção "Continue Aprendendo"
- [ ] Criar seção de reviews
- [ ] Loading e empty states
- [ ] Seed de cursos de exemplo

---

## Definition of Done

- [ ] Catálogo listando cursos publicados
- [ ] Filtros e busca funcionais
- [ ] Página de detalhe com módulos/lições
- [ ] Sistema de progresso funcionando
- [ ] Marcar lição como concluída
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_academy_courses.sql             [CREATE]

app/(dashboard)/academy/
├── page.tsx                            [CREATE]
└── courses/
    └── [slug]/
        ├── page.tsx                    [CREATE]
        └── lessons/
            └── [lessonId]/
                └── page.tsx            [CREATE]

components/academy/
├── CourseCard.tsx                      [CREATE]
├── CourseGrid.tsx                      [CREATE]
├── CourseFilters.tsx                   [CREATE]
├── CourseDetail.tsx                    [CREATE]
├── ModuleList.tsx                      [CREATE]
├── LessonCard.tsx                      [CREATE]
├── LessonPlayer.tsx                    [CREATE]
├── VideoPlayer.tsx                     [CREATE]
├── TextLesson.tsx                      [CREATE]
├── CourseProgress.tsx                  [CREATE]
└── index.ts                            [CREATE]

lib/actions/
└── courses.ts                          [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"academy.course.viewed" { course_id, slug }
"academy.course.enrolled" { course_id, user_id }
"academy.lesson.started" { lesson_id, course_id }
"academy.lesson.completed" { lesson_id, course_id, time_spent }
"academy.course.completed" { course_id, user_id, time_to_complete }

// Eventos consumidos
// (nenhum por enquanto)
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
