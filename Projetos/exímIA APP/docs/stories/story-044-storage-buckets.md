# Story EXIMIA-044: Storage Buckets & Upload Actions

**Story ID:** EXIMIA-044
**Epic:** EXIMIA-EPIC-001 (Core Foundation)
**Sprint:** 4
**Pontos:** 3
**Prioridade:** P1 (Alta)
**Depende de:** EXIMIA-009 (Supabase Setup)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** poder fazer upload de imagens (avatares, capas de livros, thumbnails de cursos),
**Para que** eu possa personalizar meu perfil e conteúdo.

---

## Contexto

O Supabase Storage permite armazenamento de arquivos com CDN e policies de acesso.
Esta story configura os buckets necessários e implementa as Server Actions de upload.

---

## Acceptance Criteria

### Buckets
- [ ] `avatars` - Avatares de usuários (público, 2MB max)
- [ ] `book-covers` - Capas de livros (público, 2MB max)
- [ ] `course-thumbnails` - Thumbnails de cursos (público, 5MB max)
- [ ] `lesson-content` - Vídeos e PDFs de lições (privado, 100MB max)

### Storage Policies
- [ ] Avatars: Usuário pode upload/delete apenas seu próprio avatar
- [ ] Book Covers: Usuário pode upload/delete apenas capas de seus livros
- [ ] Course Thumbnails: Author pode upload/delete apenas de seus cursos
- [ ] Lesson Content: Author pode upload apenas em seus cursos

### Upload Actions
- [ ] `uploadAvatar(formData)` - Upload de avatar
- [ ] `uploadBookCover(bookId, formData)` - Upload de capa de livro
- [ ] `uploadCourseThumbnail(courseId, formData)` - Upload de thumbnail
- [ ] `deleteFile(bucket, path)` - Deletar arquivo

### Validations
- [ ] Validação de tipo MIME
- [ ] Validação de tamanho
- [ ] Sanitização de nomes de arquivo

---

## Technical Details

### Migration SQL (Buckets)

```sql
-- supabase/migrations/008_storage_buckets.sql

-- =============================================================================
-- CREATE BUCKETS
-- =============================================================================

-- Note: Buckets are typically created via Dashboard or Supabase CLI
-- This migration creates the policies

-- =============================================================================
-- AVATARS BUCKET POLICIES
-- =============================================================================

-- Public read access
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Users can upload their own avatar (folder structure: {user_id}/avatar.{ext})
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- =============================================================================
-- BOOK COVERS BUCKET POLICIES
-- =============================================================================

-- Public read access
CREATE POLICY "Public can view book covers"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'book-covers');

-- Users can upload covers for their books (folder structure: {book_id}/cover.{ext})
CREATE POLICY "Users can upload book covers"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'book-covers'
    AND EXISTS (
      SELECT 1 FROM books
      WHERE books.id::text = (storage.foldername(name))[1]
      AND books.user_id = auth.uid()
    )
  );

-- Users can update covers for their books
CREATE POLICY "Users can update book covers"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'book-covers'
    AND EXISTS (
      SELECT 1 FROM books
      WHERE books.id::text = (storage.foldername(name))[1]
      AND books.user_id = auth.uid()
    )
  );

-- Users can delete covers for their books
CREATE POLICY "Users can delete book covers"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'book-covers'
    AND EXISTS (
      SELECT 1 FROM books
      WHERE books.id::text = (storage.foldername(name))[1]
      AND books.user_id = auth.uid()
    )
  );

-- =============================================================================
-- COURSE THUMBNAILS BUCKET POLICIES
-- =============================================================================

-- Public read access
CREATE POLICY "Public can view course thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'course-thumbnails');

-- Authors can upload thumbnails for their courses
CREATE POLICY "Authors can upload course thumbnails"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'course-thumbnails'
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id::text = (storage.foldername(name))[1]
      AND courses.author_id = auth.uid()
    )
  );

-- Authors can update thumbnails for their courses
CREATE POLICY "Authors can update course thumbnails"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'course-thumbnails'
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id::text = (storage.foldername(name))[1]
      AND courses.author_id = auth.uid()
    )
  );

-- Authors can delete thumbnails for their courses
CREATE POLICY "Authors can delete course thumbnails"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'course-thumbnails'
    AND EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id::text = (storage.foldername(name))[1]
      AND courses.author_id = auth.uid()
    )
  );

-- =============================================================================
-- LESSON CONTENT BUCKET POLICIES (Private)
-- =============================================================================

-- Only enrolled users can view lesson content
CREATE POLICY "Enrolled users can view lesson content"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'lesson-content'
    AND EXISTS (
      SELECT 1 FROM enrollments e
      JOIN lessons l ON l.course_id = e.course_id
      WHERE l.id::text = (storage.foldername(name))[1]
      AND e.user_id = auth.uid()
      AND e.status = 'active'
    )
  );

-- Authors can upload content to their lessons
CREATE POLICY "Authors can upload lesson content"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'lesson-content'
    AND EXISTS (
      SELECT 1 FROM lessons l
      JOIN courses c ON c.id = l.course_id
      WHERE l.id::text = (storage.foldername(name))[1]
      AND c.author_id = auth.uid()
    )
  );
```

### Upload Server Actions

```typescript
// src/lib/actions/storage/upload.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =============================================================================
// CONSTANTS
// =============================================================================

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_COVER_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB

// =============================================================================
// HELPERS
// =============================================================================

function validateFile(
  file: File,
  allowedTypes: string[],
  maxSize: number
): void {
  if (!file || !(file instanceof File)) {
    throw new Error("No file provided");
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      `Invalid file type. Allowed: ${allowedTypes.map((t) => t.split("/")[1]).join(", ")}`
    );
  }

  if (file.size > maxSize) {
    throw new Error(
      `File too large. Maximum: ${Math.round(maxSize / 1024 / 1024)}MB`
    );
  }
}

function sanitizeFilename(filename: string): string {
  // Remove special characters, keep extension
  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const timestamp = Date.now();
  return `${timestamp}.${ext}`;
}

async function uploadToStorage(
  supabase: any,
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return publicUrl;
}

// =============================================================================
// AVATAR UPLOAD
// =============================================================================

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File;
  validateFile(file, ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE);

  const filename = sanitizeFilename(file.name);
  const path = `${user.id}/${filename}`;

  const publicUrl = await uploadToStorage(supabase, "avatars", path, file);

  // Update profile with new avatar URL
  await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  revalidatePath("/settings");
  revalidatePath("/dashboard");

  return publicUrl;
}

// =============================================================================
// BOOK COVER UPLOAD
// =============================================================================

export async function uploadBookCover(bookId: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify book ownership
  const { data: book, error: bookError } = await supabase
    .from("books")
    .select("id, user_id")
    .eq("id", bookId)
    .single();

  if (bookError || !book || book.user_id !== user.id) {
    throw new Error("Book not found or access denied");
  }

  const file = formData.get("file") as File;
  validateFile(file, ALLOWED_IMAGE_TYPES, MAX_COVER_SIZE);

  const filename = sanitizeFilename(file.name);
  const path = `${bookId}/${filename}`;

  const publicUrl = await uploadToStorage(supabase, "book-covers", path, file);

  // Update book with new cover URL
  await supabase.from("books").update({ cover_url: publicUrl }).eq("id", bookId);

  revalidatePath("/journey/books");
  revalidatePath(`/journey/books/${bookId}`);

  return publicUrl;
}

// =============================================================================
// COURSE THUMBNAIL UPLOAD
// =============================================================================

export async function uploadCourseThumbnail(
  courseId: string,
  formData: FormData
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify course ownership
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id, author_id, slug")
    .eq("id", courseId)
    .single();

  if (courseError || !course || course.author_id !== user.id) {
    throw new Error("Course not found or access denied");
  }

  const file = formData.get("file") as File;
  validateFile(file, ALLOWED_IMAGE_TYPES, MAX_THUMBNAIL_SIZE);

  const filename = sanitizeFilename(file.name);
  const path = `${courseId}/${filename}`;

  const publicUrl = await uploadToStorage(
    supabase,
    "course-thumbnails",
    path,
    file
  );

  // Update course with new thumbnail URL
  await supabase
    .from("courses")
    .update({ thumbnail_url: publicUrl })
    .eq("id", courseId);

  revalidatePath("/academy");
  revalidatePath(`/academy/courses/${course.slug}`);

  return publicUrl;
}

// =============================================================================
// DELETE FILE
// =============================================================================

export async function deleteFile(bucket: string, path: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Policies will enforce authorization
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }

  return true;
}
```

---

## Tasks

- [ ] Criar buckets no Supabase Dashboard:
  - [ ] `avatars` (public, 2MB)
  - [ ] `book-covers` (public, 2MB)
  - [ ] `course-thumbnails` (public, 5MB)
  - [ ] `lesson-content` (private, 100MB)
- [ ] Criar migration `008_storage_buckets.sql`
- [ ] Implementar policies de storage
- [ ] Criar `src/lib/actions/storage/upload.ts`
- [ ] Implementar `uploadAvatar`
- [ ] Implementar `uploadBookCover`
- [ ] Implementar `uploadCourseThumbnail`
- [ ] Implementar `deleteFile`
- [ ] Testar uploads de cada tipo
- [ ] Testar policies (acesso negado para não-owner)

---

## Definition of Done

- [ ] Buckets criados no Supabase
- [ ] Policies aplicadas
- [ ] Upload de avatar funcionando
- [ ] Upload de book cover funcionando
- [ ] Upload de course thumbnail funcionando
- [ ] Delete funcionando com autorização
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── 008_storage_buckets.sql        [CREATE]

src/lib/actions/storage/
├── upload.ts                       [CREATE]
└── index.ts                        [CREATE]
```

---

## Bucket Configuration (Supabase Dashboard)

| Bucket | Public | Max Size | MIME Types |
|--------|--------|----------|------------|
| avatars | Yes | 2MB | image/jpeg, image/png, image/webp |
| book-covers | Yes | 2MB | image/jpeg, image/png, image/webp |
| course-thumbnails | Yes | 5MB | image/jpeg, image/png, image/webp |
| lesson-content | No | 100MB | video/mp4, application/pdf |

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] File type validation
- [ ] Size validation
- [ ] Path traversal prevention
- [ ] Policy correctness

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
