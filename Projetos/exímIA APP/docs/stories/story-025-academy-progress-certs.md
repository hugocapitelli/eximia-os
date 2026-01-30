# Story EXIMIA-025: Academy Progress & Certificates

**Story ID:** EXIMIA-025
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 8
**Pontos:** 8
**Prioridade:** P2 (Média)
**Depende de:** EXIMIA-022 (Academy Courses)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** ver meu progresso de aprendizado e baixar certificados dos cursos concluídos,
**Para que** eu possa acompanhar minha evolução e comprovar minhas certificações.

---

## Contexto

Dashboard de progresso com métricas de aprendizado, sistema de XP/níveis,
e geração de certificados em PDF para cursos completados.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec (Progresso)** | `docs/features/Academy/ACADEMY_PROGRESSO.md` | Wireframes, métricas, XP system |
| **Feature Spec (Certificados)** | `docs/features/Academy/ACADEMY_CERTIFICADOS.md` | Lista, PDF, compartilhamento |
| **Mock Data** | `app/src/data/academy-progress-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/academy-progress.ts` | Progress, Certificate interfaces |

---

## Acceptance Criteria

### Dashboard de Progresso
- [ ] Overview cards: Total XP, Nível atual, Cursos completos, Streak
- [ ] Barra de progresso para próximo nível
- [ ] Gráfico de horas de estudo por semana/mês
- [ ] Cursos em andamento com % progresso
- [ ] Certificados recentes
- [ ] Achievements/badges conquistados

### Sistema de XP e Níveis
- [ ] XP ganho por completar lições
- [ ] XP bônus por completar cursos
- [ ] XP por sessões socráticas
- [ ] Cálculo de nível baseado em XP total
- [ ] Animação de level up

### Streak System
- [ ] Streak de dias consecutivos aprendendo
- [ ] Definição: pelo menos 1 lição/dia
- [ ] Visual de streak (fire icon, contador)
- [ ] Notificação de streak em risco

### Histórico de Atividades
- [ ] Lista de ações recentes (curso iniciado, lição completa, etc.)
- [ ] Filtro por período
- [ ] Timeline visual

### Página de Certificados
- [ ] Lista de certificados obtidos
- [ ] Preview do certificado
- [ ] Download em PDF
- [ ] Compartilhar no LinkedIn
- [ ] Código de verificação único
- [ ] Página pública de verificação

---

## Technical Details

### Database Schema

```sql
-- User XP and Level
CREATE TABLE user_academy_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  courses_completed INTEGER DEFAULT 0,
  lessons_completed INTEGER DEFAULT 0,
  total_learning_minutes INTEGER DEFAULT 0,

  -- Streak
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP Transactions (history)
CREATE TABLE xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  xp_amount INTEGER NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('lesson', 'course', 'socratic', 'achievement', 'streak')),
  source_id TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Certificates
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  verification_code TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  pdf_url TEXT,

  -- User info at time of issue (for PDF)
  user_name TEXT NOT NULL,
  course_title TEXT NOT NULL,
  instructor_name TEXT NOT NULL,

  UNIQUE(user_id, course_id)
);

-- Achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Achievements
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Activity Log
CREATE TABLE learning_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lesson_started', 'lesson_completed', 'course_started', 'course_completed', 'socratic_completed', 'achievement_earned', 'level_up')),
  entity_id TEXT,
  entity_title TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Level thresholds
CREATE TABLE level_thresholds (
  level INTEGER PRIMARY KEY,
  xp_required INTEGER NOT NULL,
  title TEXT -- e.g., "Novice", "Apprentice", "Expert"
);

-- Indexes
CREATE INDEX idx_xp_transactions_user ON xp_transactions(user_id);
CREATE INDEX idx_certificates_user ON certificates(user_id);
CREATE INDEX idx_certificates_verification ON certificates(verification_code);
CREATE INDEX idx_activity_log_user ON learning_activity_log(user_id, created_at DESC);

-- RLS
ALTER TABLE user_academy_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats" ON user_academy_stats FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own XP" ON xp_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own certificates" ON certificates FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can verify certificates" ON certificates FOR SELECT USING (true);
CREATE POLICY "Users can view own achievements" ON user_achievements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view own activity" ON learning_activity_log FOR SELECT USING (auth.uid() = user_id);
```

### Server Actions

```typescript
// lib/actions/academy-progress.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { generateCertificatePDF } from "@/lib/pdf/certificate";

export async function getAcademyProgress() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get or create stats
  let { data: stats } = await supabase
    .from("user_academy_stats")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!stats) {
    const { data: newStats } = await supabase
      .from("user_academy_stats")
      .insert({ user_id: user.id })
      .select()
      .single();
    stats = newStats;
  }

  // Get level info
  const { data: levelInfo } = await supabase
    .from("level_thresholds")
    .select("*")
    .lte("xp_required", stats!.total_xp)
    .order("level", { ascending: false })
    .limit(1)
    .single();

  const { data: nextLevel } = await supabase
    .from("level_thresholds")
    .select("*")
    .gt("xp_required", stats!.total_xp)
    .order("level", { ascending: true })
    .limit(1)
    .single();

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from("learning_activity_log")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  // Get recent certificates
  const { data: recentCertificates } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false })
    .limit(3);

  // Get achievements
  const { data: achievements } = await supabase
    .from("user_achievements")
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq("user_id", user.id);

  return {
    stats,
    level: levelInfo,
    nextLevel,
    xpToNextLevel: nextLevel ? nextLevel.xp_required - stats!.total_xp : 0,
    recentActivity: recentActivity || [],
    recentCertificates: recentCertificates || [],
    achievements: achievements || [],
  };
}

export async function awardXP(amount: number, sourceType: string, sourceId: string, description: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Record transaction
  await supabase.from("xp_transactions").insert({
    user_id: user.id,
    xp_amount: amount,
    source_type: sourceType,
    source_id: sourceId,
    description,
  });

  // Update stats
  const { data: stats } = await supabase
    .from("user_academy_stats")
    .select("total_xp, current_level")
    .eq("user_id", user.id)
    .single();

  const newTotalXP = (stats?.total_xp || 0) + amount;

  // Check for level up
  const { data: newLevelData } = await supabase
    .from("level_thresholds")
    .select("level")
    .lte("xp_required", newTotalXP)
    .order("level", { ascending: false })
    .limit(1)
    .single();

  const newLevel = newLevelData?.level || 1;
  const leveledUp = newLevel > (stats?.current_level || 1);

  await supabase
    .from("user_academy_stats")
    .update({
      total_xp: newTotalXP,
      current_level: newLevel,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (leveledUp) {
    await logActivity("level_up", null, `Level ${newLevel}`, { new_level: newLevel });
  }

  return { newTotalXP, newLevel, leveledUp };
}

export async function updateStreak() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];

  const { data: stats } = await supabase
    .from("user_academy_stats")
    .select("last_activity_date, current_streak, longest_streak")
    .eq("user_id", user.id)
    .single();

  if (!stats) return;

  const lastDate = stats.last_activity_date;
  let newStreak = stats.current_streak;

  if (lastDate === today) {
    // Already logged today
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  if (lastDate === yesterdayStr) {
    // Continuing streak
    newStreak += 1;
  } else {
    // Streak broken, start fresh
    newStreak = 1;
  }

  await supabase
    .from("user_academy_stats")
    .update({
      last_activity_date: today,
      current_streak: newStreak,
      longest_streak: Math.max(newStreak, stats.longest_streak),
    })
    .eq("user_id", user.id);
}

export async function getCertificates() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .order("issued_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function generateCertificate(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Check if course is completed
  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (!enrollment?.completed_at) {
    throw new Error("Course not completed");
  }

  // Check if certificate already exists
  const { data: existing } = await supabase
    .from("certificates")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .single();

  if (existing) {
    return existing;
  }

  // Get course and user info
  const { data: course } = await supabase
    .from("courses")
    .select("title, instructor_name")
    .eq("id", courseId)
    .single();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Generate verification code
  const verificationCode = `EXIMIA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // Generate PDF
  const pdfUrl = await generateCertificatePDF({
    userName: profile?.full_name || user.email || "Student",
    courseTitle: course!.title,
    instructorName: course!.instructor_name,
    issuedAt: new Date(),
    verificationCode,
  });

  // Save certificate
  const { data: certificate, error } = await supabase
    .from("certificates")
    .insert({
      user_id: user.id,
      course_id: courseId,
      verification_code: verificationCode,
      pdf_url: pdfUrl,
      user_name: profile?.full_name || user.email || "Student",
      course_title: course!.title,
      instructor_name: course!.instructor_name,
    })
    .select()
    .single();

  if (error) throw error;
  return certificate;
}

export async function verifyCertificate(code: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("certificates")
    .select("*")
    .eq("verification_code", code)
    .single();

  if (error) return null;
  return data;
}

async function logActivity(type: string, entityId: string | null, entityTitle: string, metadata?: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("learning_activity_log").insert({
    user_id: user.id,
    activity_type: type,
    entity_id: entityId,
    entity_title: entityTitle,
    metadata,
  });
}
```

---

## Tasks

- [ ] Criar migration para tabelas de progresso
- [ ] Implementar server actions
- [ ] Criar página /academy/progress
- [ ] Implementar XP e Level system
- [ ] Criar ProgressCard components
- [ ] Implementar streak tracking
- [ ] Criar Activity Timeline
- [ ] Criar página /academy/certificates
- [ ] Implementar PDF generation para certificados
- [ ] Criar página de verificação pública /verify/[code]
- [ ] Implementar compartilhamento LinkedIn
- [ ] Seed de achievements e level thresholds
- [ ] Loading states

---

## Definition of Done

- [ ] Dashboard de progresso exibindo todas métricas
- [ ] Sistema de XP funcionando
- [ ] Streak sendo trackeado
- [ ] Certificados sendo gerados em PDF
- [ ] Verificação pública funcionando
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_academy_progress.sql            [CREATE]

app/(dashboard)/academy/
├── progress/
│   └── page.tsx                        [CREATE]
└── certificates/
    └── page.tsx                        [CREATE]

app/verify/
└── [code]/
    └── page.tsx                        [CREATE] (public)

components/academy/
├── ProgressOverview.tsx                [CREATE]
├── XPProgressBar.tsx                   [CREATE]
├── StreakDisplay.tsx                   [CREATE]
├── ActivityTimeline.tsx                [CREATE]
├── CertificateCard.tsx                 [CREATE]
├── CertificatePreview.tsx              [CREATE]
├── AchievementBadge.tsx                [CREATE]
└── index.ts                            [MODIFY]

lib/actions/
└── academy-progress.ts                 [CREATE]

lib/pdf/
└── certificate.ts                      [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"academy.xp.earned" { user_id, amount, source }
"academy.level.up" { user_id, new_level }
"academy.streak.updated" { user_id, streak_days }
"academy.certificate.generated" { certificate_id, course_id }
"academy.achievement.earned" { achievement_id }

// Eventos consumidos
"academy.lesson.completed" → Award XP, update streak
"academy.course.completed" → Award bonus XP, unlock certificate
"academy.socratic.completed" → Award XP
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
