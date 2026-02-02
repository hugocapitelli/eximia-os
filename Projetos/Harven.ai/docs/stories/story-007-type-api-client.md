# Story HARVEN-007: Tipar API Client (Remover any)

**Story ID:** HARVEN-007
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Média
**Pontos:** 5
**Status:** Completed
**Depende de:** HARVEN-001 (ESLint configurado)

---

## User Story

**Como** desenvolvedor frontend,
**Quero** que o cliente de API tenha tipos corretos,
**Para que** o TypeScript detecte erros em tempo de compilação.

---

## Contexto

O arquivo `services/api.ts` tem **25+ usos de `: any`**:

```typescript
create: async (data: any) => { ... }
update: async (disciplineId: string, data: any) => { ... }
const params: any = {};
```

**Problemas:**
- TypeScript não detecta erros de tipo
- Autocompletion não funciona
- Refatorações são arriscadas
- Bugs só aparecem em runtime

---

## Acceptance Criteria

- [x] Zero uso de `any` em api.ts
- [x] Interfaces para todos os payloads de request
- [x] Interfaces para todos os responses
- [x] TypeScript strict sem erros
- [x] Autocompletion funcionando em todos os métodos

---

## Technical Details

### Arquivo types.ts Expandido

```typescript
// types.ts - Adicionar

// ===== Request Types =====

export interface LoginRequest {
  ra: string;
  password: string;
}

export interface DisciplineCreateRequest {
  name: string;
  code: string;
  department: string;
}

export interface DisciplineUpdateRequest {
  title?: string;
  department?: string;
  description?: string;
}

export interface CourseCreateRequest {
  title: string;
  description?: string;
  discipline_id: string;
  status?: 'Ativo' | 'Rascunho' | 'Arquivado';
}

export interface ChapterCreateRequest {
  title: string;
  order?: number;
}

export interface ContentCreateRequest {
  title: string;
  type: 'video' | 'text' | 'pdf' | 'quiz' | 'audio';
  text_content?: string;
  body?: string;
}

export interface QuestionCreateRequest {
  text: string;
  skill?: 'aplicacao' | 'analise' | 'sintese';
  intention?: string;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado';
}

export interface UserCreateRequest {
  ra: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

// ===== Response Types =====

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface Discipline {
  id: string;
  code: string;
  name?: string;
  title?: string;
  department: string;
  students?: number;
  courses_count?: number;
  created_at?: string;
}

export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  order: number;
  created_at?: string;
}

export interface Content {
  id: string;
  chapter_id: string;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'quiz' | 'audio';
  text_content?: string;
  body?: string;
  audio_url?: string;
  created_at?: string;
}

export interface Question {
  id: string;
  content_id: string;
  text: string;
  skill?: string;
  intention?: string;
  difficulty?: string;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  content_id: string;
  status: 'active' | 'completed' | 'exported';
  performance_score?: number;
  started_at?: string;
  completed_at?: string;
}

// ===== AI Types =====

export interface AIQuestionGenerationRequest {
  chapter_content: string;
  chapter_title?: string;
  learning_objective?: string;
  difficulty?: 'iniciante' | 'intermediario' | 'avancado';
  max_questions?: number;
}

export interface AIDialogueRequest {
  student_message: string;
  chapter_content: string;
  initial_question: { text: string };
  conversation_history?: Array<{ role: string; content: string }>;
  interactions_remaining?: number;
  session_id?: string;
  chapter_id?: string;
}

export interface AIDetectionRequest {
  text: string;
  context?: Record<string, unknown>;
}
```

### api.ts Refatorado

```typescript
import axios, { AxiosInstance } from 'axios';
import {
  LoginRequest,
  DisciplineCreateRequest,
  DisciplineUpdateRequest,
  Discipline,
  Course,
  // ... outros tipos
} from './types';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export const disciplinesApi = {
  list: async (userId?: string, role?: string): Promise<Discipline[]> => {
    const params: Record<string, string> = {};
    if (userId) params.user_id = userId;
    if (role) params.role = role;
    const response = await api.get<Discipline[]>('/disciplines', { params });
    return response.data;
  },

  create: async (data: DisciplineCreateRequest): Promise<Discipline> => {
    const response = await api.post<Discipline>('/disciplines', data);
    return response.data;
  },

  update: async (id: string, data: DisciplineUpdateRequest): Promise<Discipline> => {
    const response = await api.put<Discipline>(`/disciplines/${id}`, data);
    return response.data;
  },
  // ...
};
```

---

## Tasks

- [ ] Criar interfaces de Request no types.ts
- [ ] Criar interfaces de Response no types.ts
- [ ] Tipar `authApi`
- [ ] Tipar `dashboardApi`
- [ ] Tipar `disciplinesApi`
- [ ] Tipar `coursesApi`
- [ ] Tipar `chaptersApi`
- [ ] Tipar `contentsApi`
- [ ] Tipar `questionsApi`
- [ ] Tipar `usersApi`
- [ ] Tipar `chatSessionsApi`
- [ ] Tipar `notificationsApi`
- [ ] Tipar `adminApi`
- [ ] Tipar `aiApi`
- [ ] Tipar `integrationsApi`
- [ ] Remover todos os `any`
- [ ] Verificar com `npm run typecheck`
- [ ] Testar em runtime

---

## Definition of Done

- [ ] `grep ": any" api.ts` retorna zero
- [ ] `npm run typecheck` passa
- [ ] Autocompletion funciona em todos os métodos
- [ ] Nenhum erro de tipo em runtime

---

## File List

| Arquivo | Ação |
|---------|------|
| `harven.ai-platform-mockup/types.ts` | Expandir |
| `harven.ai-platform-mockup/services/api.ts` | Refatorar |

---

## Notes

- Considerar gerar tipos do OpenAPI schema no futuro
- Usar `unknown` quando realmente não souber o tipo
- Usar generics para responses paginados
