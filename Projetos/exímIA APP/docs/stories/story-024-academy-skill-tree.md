# Story EXIMIA-024: Academy Skill Tree

**Story ID:** EXIMIA-024
**Epic:** EXIMIA-EPIC-006 (Academy Module)
**Sprint:** 8
**Pontos:** 8
**Prioridade:** P2 (Média)
**Depende de:** EXIMIA-022 (Academy Courses)

---

## User Story

**Como** usuário do exímIA APP,
**Quero** visualizar meu progresso de skills em uma árvore de habilidades,
**Para que** eu possa ver claramente minha evolução e quais skills desbloquear em seguida.

---

## Contexto

Visualização gamificada de skills/competências. Skills são desbloqueadas
ao completar cursos ou módulos específicos. Inspirado em sistemas de RPG.

---

## Referências de Dados

| Arquivo | Localização | Conteúdo |
|---------|-------------|----------|
| **Feature Spec** | `docs/features/Academy/ACADEMY_SKILL_TREE.md` | Wireframes, interfaces, sistema de unlock |
| **Mock Data** | `app/src/data/academy-skill-tree-mock.ts` | Dados de exemplo |
| **Types** | `app/src/types/academy-skills.ts` | Skill, SkillNode interfaces |

---

## Acceptance Criteria

### Visualização da Árvore
- [ ] Árvore visual com nodes de skills conectados
- [ ] Diferentes estados: locked, available, in_progress, unlocked
- [ ] Linhas de conexão entre skills (dependências)
- [ ] Zoom in/out na árvore
- [ ] Pan/drag para navegar

### Skill Node
- [ ] Ícone/imagem da skill
- [ ] Nome da skill
- [ ] Nível atual (1-5 ou similar)
- [ ] Estado visual (cor, opacidade para locked)
- [ ] Tooltip com descrição ao hover
- [ ] Progress ring para in_progress

### Skill Detail Panel
- [ ] Descrição completa da skill
- [ ] Como desbloquear (cursos necessários)
- [ ] Progresso atual
- [ ] Níveis da skill (1-5)
- [ ] Badges/achievements relacionados
- [ ] Link para cursos que desenvolvem essa skill

### Filtros e Categorias
- [ ] Filtrar por categoria (Tech, Business, Soft Skills)
- [ ] Mostrar apenas desbloqueadas
- [ ] Busca por nome

---

## Technical Details

### Database Schema

```sql
-- Skills (admin-defined)
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  category TEXT NOT NULL,
  max_level INTEGER DEFAULT 5,

  -- Position in tree (for visualization)
  tree_x INTEGER DEFAULT 0,
  tree_y INTEGER DEFAULT 0,

  -- Unlock requirements
  required_skill_ids UUID[],
  required_skill_levels INTEGER[], -- parallel array with required levels

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skill-Course mapping (which courses contribute to which skills)
CREATE TABLE skill_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  points_per_completion INTEGER DEFAULT 100, -- points toward skill level
  UNIQUE(skill_id, course_id)
);

-- User skill progress
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  unlocked_at TIMESTAMPTZ,
  last_progress_at TIMESTAMPTZ,
  UNIQUE(user_id, skill_id)
);

-- Points required per level
CREATE TABLE skill_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  points_required INTEGER NOT NULL,
  badge_name TEXT,
  badge_icon TEXT,
  UNIQUE(skill_id, level)
);

-- Indexes
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_skill_courses_skill ON skill_courses(skill_id);

-- RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Users can view own skill progress" ON user_skills FOR ALL USING (auth.uid() = user_id);
```

### Server Actions

```typescript
// lib/actions/skills.ts
"use server";

import { createClient } from "@/lib/supabase/server";

interface SkillNode {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  category: string;
  max_level: number;
  tree_x: number;
  tree_y: number;
  required_skill_ids: string[];
  required_skill_levels: number[];
  // User progress
  current_level: number;
  current_points: number;
  points_for_next_level: number;
  status: 'locked' | 'available' | 'in_progress' | 'maxed';
  unlocked_at: string | null;
}

export async function getSkillTree(): Promise<SkillNode[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get all skills
  const { data: skills, error } = await supabase
    .from("skills")
    .select(`
      *,
      levels:skill_levels(level, points_required)
    `)
    .order("tree_y", { ascending: true })
    .order("tree_x", { ascending: true });

  if (error) throw error;

  // Get user progress if logged in
  let userProgress: Record<string, any> = {};
  if (user) {
    const { data: progress } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", user.id);

    userProgress = (progress || []).reduce((acc, p) => {
      acc[p.skill_id] = p;
      return acc;
    }, {} as Record<string, any>);
  }

  // Build skill nodes with status
  return (skills || []).map((skill) => {
    const progress = userProgress[skill.id];
    const currentLevel = progress?.current_level || 0;
    const currentPoints = progress?.current_points || 0;

    // Determine status
    let status: SkillNode['status'] = 'locked';

    if (currentLevel >= skill.max_level) {
      status = 'maxed';
    } else if (currentLevel > 0 || currentPoints > 0) {
      status = 'in_progress';
    } else if (checkRequirements(skill, userProgress)) {
      status = 'available';
    }

    // Get points for next level
    const nextLevelData = skill.levels.find((l: any) => l.level === currentLevel + 1);
    const pointsForNextLevel = nextLevelData?.points_required || 0;

    return {
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      description: skill.description,
      icon_url: skill.icon_url,
      category: skill.category,
      max_level: skill.max_level,
      tree_x: skill.tree_x,
      tree_y: skill.tree_y,
      required_skill_ids: skill.required_skill_ids || [],
      required_skill_levels: skill.required_skill_levels || [],
      current_level: currentLevel,
      current_points: currentPoints,
      points_for_next_level: pointsForNextLevel,
      status,
      unlocked_at: progress?.unlocked_at || null,
    };
  });
}

function checkRequirements(skill: any, userProgress: Record<string, any>): boolean {
  if (!skill.required_skill_ids || skill.required_skill_ids.length === 0) {
    return true; // No requirements
  }

  for (let i = 0; i < skill.required_skill_ids.length; i++) {
    const reqSkillId = skill.required_skill_ids[i];
    const reqLevel = skill.required_skill_levels?.[i] || 1;
    const progress = userProgress[reqSkillId];

    if (!progress || progress.current_level < reqLevel) {
      return false;
    }
  }

  return true;
}

export async function getSkillDetail(skillId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: skill, error } = await supabase
    .from("skills")
    .select(`
      *,
      levels:skill_levels(*),
      courses:skill_courses(
        course:courses(id, title, slug, thumbnail_url)
      )
    `)
    .eq("id", skillId)
    .single();

  if (error) throw error;

  // Get user progress
  let progress = null;
  if (user) {
    const { data } = await supabase
      .from("user_skills")
      .select("*")
      .eq("user_id", user.id)
      .eq("skill_id", skillId)
      .single();
    progress = data;
  }

  return { skill, progress };
}

// Called when user completes a course
export async function awardSkillPoints(userId: string, courseId: string) {
  const supabase = await createClient();

  // Get skills linked to this course
  const { data: skillCourses } = await supabase
    .from("skill_courses")
    .select("skill_id, points_per_completion")
    .eq("course_id", courseId);

  for (const sc of skillCourses || []) {
    await addPointsToSkill(userId, sc.skill_id, sc.points_per_completion);
  }
}

async function addPointsToSkill(userId: string, skillId: string, points: number) {
  const supabase = await createClient();

  // Get or create user_skill
  const { data: existing } = await supabase
    .from("user_skills")
    .select("*")
    .eq("user_id", userId)
    .eq("skill_id", skillId)
    .single();

  const currentPoints = (existing?.current_points || 0) + points;
  const currentLevel = existing?.current_level || 0;

  // Check for level up
  const { data: levels } = await supabase
    .from("skill_levels")
    .select("*")
    .eq("skill_id", skillId)
    .order("level", { ascending: true });

  let newLevel = currentLevel;
  let remainingPoints = currentPoints;

  for (const level of levels || []) {
    if (level.level > currentLevel && remainingPoints >= level.points_required) {
      newLevel = level.level;
      remainingPoints -= level.points_required;
    }
  }

  await supabase.from("user_skills").upsert({
    user_id: userId,
    skill_id: skillId,
    current_level: newLevel,
    current_points: remainingPoints,
    unlocked_at: !existing ? new Date().toISOString() : existing.unlocked_at,
    last_progress_at: new Date().toISOString(),
  });
}
```

---

## Tasks

- [ ] Criar migration para skills, skill_courses, user_skills, skill_levels
- [ ] Implementar server actions para skill tree
- [ ] Criar página /academy/skills
- [ ] Implementar SkillTree visualization component
- [ ] Criar SkillNode component com estados visuais
- [ ] Implementar conexões entre nodes (linhas/curvas)
- [ ] Criar SkillDetailPanel/Modal
- [ ] Implementar filtros por categoria
- [ ] Adicionar zoom e pan
- [ ] Integrar award de pontos ao completar cursos
- [ ] Seed de skills de exemplo
- [ ] Loading states

---

## Definition of Done

- [ ] Árvore de skills visualizando corretamente
- [ ] Estados de nodes funcionando
- [ ] Detalhe da skill exibindo informações
- [ ] Progresso sendo trackeado
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
supabase/migrations/
└── XXX_academy_skills.sql              [CREATE]

app/(dashboard)/academy/skills/
└── page.tsx                            [CREATE]

components/academy/
├── SkillTree.tsx                       [CREATE]
├── SkillNode.tsx                       [CREATE]
├── SkillConnection.tsx                 [CREATE]
├── SkillDetailPanel.tsx                [CREATE]
├── SkillFilters.tsx                    [CREATE]
└── index.ts                            [MODIFY]

lib/actions/
└── skills.ts                           [CREATE]
```

---

## Connection Layer Events

```typescript
// Eventos emitidos
"academy.skill.viewed" { skill_id }
"academy.skill.unlocked" { skill_id, skill_name }
"academy.skill.leveled_up" { skill_id, new_level }

// Eventos consumidos
"academy.course.completed" → Award skill points
```

---

**Story criada por River (SM) 🌊**
**Data:** 2026-01-29
