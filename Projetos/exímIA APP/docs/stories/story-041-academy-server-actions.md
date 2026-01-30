# Story EXIMIA-041: Academy Server Actions (Courses & Enrollments)

**Story ID:** EXIMIA-041
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 5
**Pontos:** 13
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-038 (Supabase Client), EXIMIA-015 (Academy Schema), EXIMIA-036 (RLS Fixes)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** ter APIs funcionais para o Academy,
**Para que** eu possa navegar cursos, me matricular e acompanhar meu progresso.

---

## Contexto

Esta story implementa todas as Server Actions para o módulo Academy (Courses, Enrollments, Progress).
NÃO inclui o chat Socrático (story separada EXIMIA-042).

---

## Acceptance Criteria

### Courses API (Public)
- [ ] `getCourses(filters?)` - Listar cursos publicados com filtros
- [ ] `getCourse(slug)` - Obter curso com módulos e lições
- [ ] `searchCourses(query)` - Buscar cursos por título/descrição

### Courses API (Author)
- [ ] `createCourse(data)` - Criar novo curso (apenas authors)
- [ ] `updateCourse(id, data)` - Atualizar curso próprio
- [ ] `deleteCourse(id)` - Deletar curso draft
- [ ] `publishCourse(id)` - Publicar curso

### Modules API (Author)
- [ ] `createModule(courseId, data)` - Criar módulo
- [ ] `updateModule(id, data)` - Atualizar módulo
- [ ] `deleteModule(id)` - Deletar módulo
- [ ] `reorderModules(courseId, order)` - Reordenar módulos

### Lessons API (Author)
- [ ] `createLesson(moduleId, data)` - Criar lição
- [ ] `updateLesson(id, data)` - Atualizar lição
- [ ] `deleteLesson(id)` - Deletar lição
- [ ] `reorderLessons(moduleId, order)` - Reordenar lições

### Enrollments API
- [ ] `enrollInCourse(courseId)` - Matricular usuário
- [ ] `getEnrollments()` - Cursos do usuário
- [ ] `getEnrollment(courseId)` - Status de matrícula específica
- [ ] `pauseEnrollment(enrollmentId)` - Pausar matrícula
- [ ] `resumeEnrollment(enrollmentId)` - Retomar matrícula

### Progress API
- [ ] `markLessonComplete(lessonId, enrollmentId)` - Marcar lição completa
- [ ] `markLessonIncomplete(lessonId, enrollmentId)` - Desmarcar
- [ ] `getProgress(enrollmentId)` - Progresso detalhado
- [ ] `updateWatchTime(lessonId, seconds)` - Atualizar tempo de vídeo

---

## Technical Details

### Directory Structure

```
src/lib/actions/academy/
├── courses.ts         # Courses CRUD
├── modules.ts         # Modules CRUD
├── lessons.ts         # Lessons CRUD
├── enrollments.ts     # Enrollment management
├── progress.ts        # Progress tracking
└── index.ts           # Re-exports
```

### Courses Server Actions

```typescript
// src/lib/actions/academy/courses.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// =============================================================================
// SCHEMAS
// =============================================================================

const CourseFiltersSchema = z.object({
  category: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
  search: z.string().optional(),
  is_free: z.boolean().optional(),
  limit: z.number().int().positive().default(20),
  offset: z.number().int().nonnegative().default(0),
});

const CreateCourseSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  short_description: z.string().max(300).optional(),
  thumbnail_url: z.string().url().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "expert"]).default("beginner"),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  is_free: z.boolean().default(true),
  price_cents: z.number().int().nonnegative().optional(),
  duration_hours: z.number().positive().optional(),
});

export type CourseFilters = z.infer<typeof CourseFiltersSchema>;
export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;

// =============================================================================
// PUBLIC READ
// =============================================================================

export async function getCourses(filters?: CourseFilters) {
  const supabase = await createClient();
  const validated = CourseFiltersSchema.parse(filters || {});

  let query = supabase
    .from("courses")
    .select(
      `
      id,
      title,
      slug,
      short_description,
      thumbnail_url,
      difficulty,
      category,
      tags,
      is_free,
      price_cents,
      duration_hours,
      enrolled_count,
      avg_rating,
      author_name,
      created_at
    `,
      { count: "exact" }
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (validated.category) {
    query = query.eq("category", validated.category);
  }
  if (validated.difficulty) {
    query = query.eq("difficulty", validated.difficulty);
  }
  if (validated.is_free !== undefined) {
    query = query.eq("is_free", validated.is_free);
  }
  if (validated.search) {
    query = query.or(
      `title.ilike.%${validated.search}%,short_description.ilike.%${validated.search}%`
    );
  }

  query = query.range(validated.offset, validated.offset + validated.limit - 1);

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to fetch courses: ${error.message}`);
  }

  return { courses: data || [], total: count || 0 };
}

export async function getCourse(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(
      `
      *,
      course_modules (
        *,
        lessons (
          id,
          title,
          slug,
          description,
          type,
          duration_minutes,
          sort_order,
          is_preview
        )
      )
    `
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    throw new Error(`Course not found: ${error.message}`);
  }

  // Sort modules and lessons by sort_order
  data.course_modules = data.course_modules
    ?.sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((mod: any) => ({
      ...mod,
      lessons: mod.lessons?.sort((a: any, b: any) => a.sort_order - b.sort_order),
    }));

  return data;
}

// =============================================================================
// AUTHOR CRUD
// =============================================================================

export async function createCourse(input: CreateCourseInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Check if user is author
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || !["author", "admin"].includes(profile.role)) {
    throw new Error("Only authors can create courses");
  }

  const validated = CreateCourseSchema.parse(input);

  // Check if slug is unique
  const { data: existing } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", validated.slug)
    .single();

  if (existing) {
    throw new Error("A course with this slug already exists");
  }

  const { data, error } = await supabase
    .from("courses")
    .insert({
      ...validated,
      author_id: user.id,
      author_name: profile.full_name || user.email,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create course: ${error.message}`);
  }

  revalidatePath("/academy");
  return data;
}

export async function publishCourse(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify course has at least one module with one lesson
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(`
      id,
      author_id,
      status,
      course_modules (
        id,
        lessons (id)
      )
    `)
    .eq("id", id)
    .single();

  if (courseError || !course) {
    throw new Error("Course not found");
  }

  if (course.author_id !== user.id) {
    throw new Error("You can only publish your own courses");
  }

  if (course.status === "published") {
    throw new Error("Course is already published");
  }

  const totalLessons = course.course_modules?.reduce(
    (sum: number, mod: any) => sum + (mod.lessons?.length || 0),
    0
  ) || 0;

  if (totalLessons === 0) {
    throw new Error("Course must have at least one lesson to be published");
  }

  const { error } = await supabase
    .from("courses")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to publish course: ${error.message}`);
  }

  revalidatePath("/academy");
}
```

### Enrollments Server Actions

```typescript
// src/lib/actions/academy/enrollments.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enrollInCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Get course info and lesson count
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select(`
      id,
      title,
      slug,
      is_free,
      price_cents,
      course_modules (
        lessons (id)
      )
    `)
    .eq("id", courseId)
    .eq("status", "published")
    .single();

  if (courseError || !course) {
    throw new Error("Course not found");
  }

  // Count total lessons
  const totalLessons = course.course_modules?.reduce(
    (sum: number, mod: any) => sum + (mod.lessons?.length || 0),
    0
  ) || 0;

  // Check if already enrolled
  const { data: existing } = await supabase
    .from("enrollments")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (existing) {
    if (existing.status === "active") {
      return existing; // Already enrolled
    }

    // Reactivate paused/cancelled enrollment
    const { data, error } = await supabase
      .from("enrollments")
      .update({
        status: "active",
        last_activity_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidatePath("/academy");
    return data;
  }

  // Create new enrollment
  const { data: enrollment, error: enrollError } = await supabase
    .from("enrollments")
    .insert({
      user_id: user.id,
      course_id: courseId,
      status: "active",
      total_lessons: totalLessons,
    })
    .select()
    .single();

  if (enrollError) {
    throw new Error(`Enrollment failed: ${enrollError.message}`);
  }

  // Increment course enrolled_count
  await supabase.rpc("increment_course_enrolled_count", {
    p_course_id: courseId,
  });

  // Update learning streak
  await supabase.rpc("update_user_streak", {
    p_user_id: user.id,
    p_streak_type: "learning",
  });

  revalidatePath("/academy");
  revalidatePath(`/academy/courses/${course.slug}`);
  revalidatePath("/academy/my-courses");

  return enrollment;
}

export async function getEnrollments() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      course:courses (
        id,
        title,
        slug,
        short_description,
        thumbnail_url,
        difficulty,
        category,
        duration_hours
      )
    `)
    .eq("user_id", user.id)
    .order("last_activity_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch enrollments: ${error.message}`);
  }

  return data || [];
}

export async function getEnrollmentForCourse(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Not logged in
  }

  const { data } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  return data;
}
```

### Progress Server Actions

```typescript
// src/lib/actions/academy/progress.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(
  lessonId: string,
  enrollmentId: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify enrollment belongs to user
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, total_lessons, course_id")
    .eq("id", enrollmentId)
    .eq("user_id", user.id)
    .single();

  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  // Upsert lesson progress
  const { error: progressError } = await supabase
    .from("lesson_progress")
    .upsert(
      {
        user_id: user.id,
        lesson_id: lessonId,
        enrollment_id: enrollmentId,
        is_completed: true,
        completed_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,lesson_id",
      }
    );

  if (progressError) {
    throw new Error(`Failed to mark lesson complete: ${progressError.message}`);
  }

  // Calculate new progress
  const { data: completedLessons } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("is_completed", true);

  const lessonsCompleted = completedLessons?.length || 0;
  const progressPercent = Math.round(
    (lessonsCompleted / enrollment.total_lessons) * 100
  );

  // Update enrollment
  const enrollmentUpdates: Record<string, any> = {
    lessons_completed: lessonsCompleted,
    progress_percent: progressPercent,
    last_lesson_id: lessonId,
    last_activity_at: new Date().toISOString(),
  };

  // Mark as completed if 100%
  if (progressPercent >= 100) {
    enrollmentUpdates.status = "completed";
    enrollmentUpdates.completed_at = new Date().toISOString();
  }

  await supabase.from("enrollments").update(enrollmentUpdates).eq("id", enrollmentId);

  // Update learning streak
  await supabase.rpc("update_user_streak", {
    p_user_id: user.id,
    p_streak_type: "learning",
  });

  revalidatePath("/academy");
  revalidatePath("/academy/my-courses");

  return { lessonsCompleted, progressPercent };
}

export async function getLessonProgress(enrollmentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("lesson_progress")
    .select("lesson_id, is_completed, completed_at, watch_time_seconds")
    .eq("enrollment_id", enrollmentId)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(`Failed to fetch progress: ${error.message}`);
  }

  // Convert to map for easy lookup
  const progressMap: Record<string, any> = {};
  data?.forEach((p) => {
    progressMap[p.lesson_id] = p;
  });

  return progressMap;
}
```

---

## Tasks

- [ ] Criar `src/lib/actions/academy/courses.ts`
- [ ] Criar `src/lib/actions/academy/modules.ts`
- [ ] Criar `src/lib/actions/academy/lessons.ts`
- [ ] Criar `src/lib/actions/academy/enrollments.ts`
- [ ] Criar `src/lib/actions/academy/progress.ts`
- [ ] Criar `src/lib/actions/academy/index.ts`
- [ ] Criar função RPC `increment_course_enrolled_count`
- [ ] Implementar Zod schemas
- [ ] Testar fluxo público (listar, ver curso)
- [ ] Testar fluxo author (criar, editar, publicar)
- [ ] Testar fluxo enrollment (matricular, progresso)
- [ ] Verificar integração com streaks

---

## Definition of Done

- [ ] Todos os endpoints funcionando
- [ ] Author pode criar/editar/publicar cursos
- [ ] Usuário pode se matricular e acompanhar progresso
- [ ] Streaks atualizando corretamente
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/lib/actions/academy/
├── courses.ts         [CREATE]
├── modules.ts         [CREATE]
├── lessons.ts         [CREATE]
├── enrollments.ts     [CREATE]
├── progress.ts        [CREATE]
└── index.ts           [CREATE]

supabase/migrations/
└── 004c_academy_functions.sql  [CREATE - RPC functions]
```

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] No SQL injection vulnerabilities
- [ ] Author role verification
- [ ] Progress calculation accuracy
- [ ] Race condition handling in enrollments

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
