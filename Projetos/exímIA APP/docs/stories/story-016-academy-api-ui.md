# Story EXIMIA-016: Academy API & UI Integration

**Story ID:** EXIMIA-016
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 5
**Pontos:** 13
**Prioridade:** P1 (Alto)
**Depende de:** EXIMIA-015 (Academy Schema)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** navegar e consumir cursos,
**Para que** eu possa aprender de forma estruturada.

---

## Acceptance Criteria

### API
- [ ] `getCourses(filters)` — Listar cursos publicados
- [ ] `getCourse(slug)` — Detalhes do curso com módulos/lições
- [ ] `enrollInCourse(courseId)` — Matricular usuário
- [ ] `getEnrollments()` — Cursos do usuário
- [ ] `markLessonComplete(lessonId)` — Marcar lição concluída
- [ ] `getProgress(enrollmentId)` — Progresso detalhado

### UI - Catalog Page
- [ ] Grid de cursos com cards
- [ ] Filtros (categoria, dificuldade, preço)
- [ ] Search por título
- [ ] Enrolled badge nos cursos matriculados

### UI - Course Page
- [ ] Header com thumbnail, título, descrição
- [ ] Stats (duração, módulos, enrolled)
- [ ] Módulos expandíveis com lições
- [ ] Botão Enroll / Continue
- [ ] Progress bar se matriculado

### UI - Lesson Page
- [ ] Content renderer (text, video)
- [ ] Navigation (prev/next)
- [ ] Mark complete button
- [ ] Progress sidebar
- [ ] Socratic chat (se habilitado)

---

## Technical Details

### API Actions

```typescript
// lib/actions/academy/courses.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getCourses(filters: {
  category?: string;
  difficulty?: string;
  search?: string;
} = {}) {
  const supabase = createClient();

  let query = supabase
    .from("courses")
    .select(`
      *,
      course_modules (
        id,
        title,
        sort_order,
        lessons (id)
      )
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.difficulty) query = query.eq("difficulty", filters.difficulty);
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data || [];
}

export async function getCourse(slug: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      course_modules (
        *,
        lessons (*)
      )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function enrollInCourse(courseId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Count total lessons
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId);

  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      user_id: user.id,
      course_id: courseId,
      total_lessons: lessons?.length || 0,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") { // Already enrolled
      return await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single()
        .then(r => r.data);
    }
    throw new Error(error.message);
  }

  // Update course enrolled count
  await supabase.rpc("increment_enrolled_count", { course_id: courseId });

  revalidatePath("/academy");
  return data;
}

export async function getEnrollments() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      course:courses (*)
    `)
    .order("last_activity_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function markLessonComplete(lessonId: string, enrollmentId: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Upsert progress
  const { error: progressError } = await supabase
    .from("lesson_progress")
    .upsert({
      user_id: user.id,
      lesson_id: lessonId,
      enrollment_id: enrollmentId,
      is_completed: true,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: "user_id,lesson_id",
    });

  if (progressError) throw new Error(progressError.message);

  // Update enrollment progress
  const { data: completedCount } = await supabase
    .from("lesson_progress")
    .select("id")
    .eq("enrollment_id", enrollmentId)
    .eq("is_completed", true);

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("total_lessons")
    .eq("id", enrollmentId)
    .single();

  const progress = ((completedCount?.length || 0) / (enrollment?.total_lessons || 1)) * 100;

  await supabase
    .from("enrollments")
    .update({
      lessons_completed: completedCount?.length || 0,
      progress_percent: progress,
      last_lesson_id: lessonId,
      last_activity_at: new Date().toISOString(),
      completed_at: progress >= 100 ? new Date().toISOString() : null,
      status: progress >= 100 ? "completed" : "active",
    })
    .eq("id", enrollmentId);

  revalidatePath("/academy");
}
```

### UI Components

```tsx
// components/academy/CourseCard.tsx
import { Card, Badge, Icon, Button } from "@/components/ui";
import Link from "next/link";

export function CourseCard({ course, isEnrolled, progress }: CourseCardProps) {
  return (
    <Card hoverable>
      <Link href={`/academy/courses/${course.slug}`}>
        {course.thumbnail_url && (
          <img
            src={course.thumbnail_url}
            alt={course.title}
            className="w-full h-40 object-cover"
          />
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={course.is_free ? "success" : "primary"}>
              {course.is_free ? "Grátis" : `R$ ${(course.price_cents / 100).toFixed(0)}`}
            </Badge>
            <Badge variant="outline">{course.difficulty}</Badge>
          </div>

          <h3 className="font-semibold text-white">{course.title}</h3>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
            {course.short_description}
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1">
              <Icon name="Clock" size={14} />
              {course.duration_hours}h
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Users" size={14} />
              {course.enrolled_count}
            </span>
          </div>

          {isEnrolled && (
            <div className="mt-3">
              <div className="h-1 bg-zinc-800 rounded-full">
                <div
                  className="h-full bg-eximia-400 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-zinc-500">{progress}% concluído</span>
            </div>
          )}
        </div>
      </Link>
    </Card>
  );
}
```

```tsx
// app/(dashboard)/academy/courses/[slug]/page.tsx
import { getCourse, enrollInCourse } from "@/lib/actions/academy";
import { getEnrollmentForCourse } from "@/lib/actions/academy";

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug);
  const enrollment = await getEnrollmentForCourse(course.id);

  return (
    <div>
      {/* Course Header */}
      <div className="relative">
        <img src={course.thumbnail_url} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950" />
        <div className="absolute bottom-0 p-8">
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
          <p className="text-zinc-400 mt-2">{course.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 grid grid-cols-3 gap-8">
        {/* Modules */}
        <div className="col-span-2 space-y-4">
          {course.course_modules.map((mod) => (
            <ModuleAccordion
              key={mod.id}
              module={mod}
              enrollment={enrollment}
            />
          ))}
        </div>

        {/* Sidebar */}
        <div>
          <EnrollmentCard course={course} enrollment={enrollment} />
        </div>
      </div>
    </div>
  );
}
```

---

## Tasks

- [ ] Implementar academy API actions
- [ ] Criar CourseCard component
- [ ] Criar CourseCatalog page
- [ ] Criar CoursePage com módulos
- [ ] Criar LessonPage com conteúdo
- [ ] Implementar enrollment flow
- [ ] Implementar progress tracking
- [ ] Criar Socratic chat component (UI)
- [ ] Testar fluxo completo

---

## Definition of Done

- [ ] Catálogo listando cursos
- [ ] Enrollment funcionando
- [ ] Progress tracking funcionando
- [ ] Lesson view funcionando
- [ ] TypeScript sem erros (`npm run typecheck`)
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/
├── lib/
│   └── actions/
│       └── academy/
│           ├── courses.ts        [CREATE]
│           ├── enrollments.ts    [CREATE]
│           └── progress.ts       [CREATE]
└── components/
    └── academy/
        ├── CourseCard.tsx        [CREATE]
        ├── CourseCatalog.tsx     [CREATE]
        ├── ModuleAccordion.tsx   [CREATE]
        ├── EnrollmentCard.tsx    [CREATE]
        ├── LessonContent.tsx     [CREATE]
        ├── ProgressSidebar.tsx   [CREATE]
        ├── SocraticChat.tsx      [CREATE]
        └── index.ts              [CREATE]

app/(dashboard)/academy/
├── page.tsx                      [MODIFY]
├── courses/
│   └── [slug]/
│       ├── page.tsx              [CREATE]
│       └── lessons/
│           └── [lessonSlug]/
│               └── page.tsx      [CREATE]
└── my-courses/
    └── page.tsx                  [CREATE]
```

---

**Story criada por River (SM)**
**Data:** 2026-01-29
