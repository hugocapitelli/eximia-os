# Story HARVEN-006: Separar main.py em Routers - Fase 2

**Story ID:** HARVEN-006
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Alta
**Pontos:** 8
**Status:** Draft
**Depende de:** HARVEN-005

---

## User Story

**Como** desenvolvedor do Harven.AI,
**Quero** completar a modularização do backend,
**Para que** cada domínio tenha seu próprio arquivo e seja fácil de manter.

---

## Contexto

Após a Fase 1 (HARVEN-005), o `main.py` ainda terá ~3800 linhas com:
- Disciplines (turmas)
- Courses (cursos)
- Chapters (capítulos)
- Contents (conteúdos)
- Questions (perguntas)
- AI Services (6 agentes)
- Chat Sessions
- Users
- Notifications
- Integrations

**Esta é a Fase 2:** Extrair os domínios restantes.

---

## Acceptance Criteria

- [ ] Todos os routers de domínio extraídos
- [ ] `main.py` com apenas ~200-300 linhas (inicialização)
- [ ] Todos os 60+ endpoints funcionando
- [ ] Estrutura clara e organizada
- [ ] Testes passando

---

## Technical Details

### Estrutura Final

```
backend/
├── main.py                       # ~200 linhas (apenas setup)
├── routers/
│   ├── __init__.py
│   ├── auth.py                   # (Fase 1)
│   ├── health.py                 # (Fase 1)
│   ├── upload.py                 # (Fase 1)
│   ├── admin.py                  # (Fase 1)
│   ├── disciplines.py            # ~400 linhas
│   ├── courses.py                # ~300 linhas
│   ├── chapters.py               # ~150 linhas
│   ├── contents.py               # ~200 linhas
│   ├── questions.py              # ~150 linhas
│   ├── users.py                  # ~400 linhas
│   ├── chat_sessions.py          # ~300 linhas
│   ├── notifications.py          # ~150 linhas
│   ├── ai_services.py            # ~600 linhas
│   ├── integrations.py           # ~400 linhas
│   └── dashboard.py              # ~100 linhas
├── models/
│   ├── __init__.py
│   ├── requests.py
│   ├── responses.py
│   └── domain.py                 # Modelos de domínio
├── services/                     # (já existe)
│   ├── ai_service.py
│   └── integration_service.py
├── agents/                       # (já existe)
└── utils/
    ├── __init__.py
    ├── auth.py
    └── dependencies.py
```

### Endpoints por Router (Fase 2)

| Router | Endpoints | Linhas Estimadas |
|--------|-----------|------------------|
| `disciplines.py` | 15 endpoints | ~400 |
| `courses.py` | 10 endpoints | ~300 |
| `chapters.py` | 5 endpoints | ~150 |
| `contents.py` | 7 endpoints | ~200 |
| `questions.py` | 5 endpoints | ~150 |
| `users.py` | 12 endpoints | ~400 |
| `chat_sessions.py` | 10 endpoints | ~300 |
| `notifications.py` | 6 endpoints | ~150 |
| `ai_services.py` | 10 endpoints | ~600 |
| `integrations.py` | 10 endpoints | ~400 |
| `dashboard.py` | 2 endpoints | ~100 |

---

## Tasks

### Router: disciplines.py
- [ ] Extrair `GET /disciplines`
- [ ] Extrair `POST /disciplines`
- [ ] Extrair `GET /disciplines/{id}`
- [ ] Extrair endpoints de teachers
- [ ] Extrair endpoints de students
- [ ] Testar

### Router: courses.py
- [ ] Extrair CRUD de courses
- [ ] Extrair upload de imagem de curso
- [ ] Extrair `GET /courses/{id}/chapters`
- [ ] Testar

### Router: chapters.py
- [ ] Extrair CRUD de chapters
- [ ] Testar

### Router: contents.py
- [ ] Extrair CRUD de contents
- [ ] Extrair upload de conteúdo
- [ ] Testar

### Router: questions.py
- [ ] Extrair CRUD de questions
- [ ] Extrair batch update
- [ ] Testar

### Router: users.py
- [ ] Extrair CRUD de users
- [ ] Extrair endpoints de avatar
- [ ] Extrair endpoints de stats/activities
- [ ] Extrair endpoints de achievements
- [ ] Extrair endpoints de progress
- [ ] Testar

### Router: chat_sessions.py
- [ ] Extrair CRUD de sessions
- [ ] Extrair endpoints de messages
- [ ] Extrair export Moodle
- [ ] Testar

### Router: notifications.py
- [ ] Extrair todos endpoints de notifications
- [ ] Testar

### Router: ai_services.py
- [ ] Extrair endpoints do Creator
- [ ] Extrair endpoints do Socrates
- [ ] Extrair endpoints do Analyst
- [ ] Extrair endpoints do Editor
- [ ] Extrair endpoints do Tester
- [ ] Extrair endpoints do Organizer
- [ ] Extrair endpoints TTS
- [ ] Testar cada agente

### Router: integrations.py
- [ ] Extrair endpoints JACAD
- [ ] Extrair endpoints Moodle
- [ ] Extrair endpoints de status/logs
- [ ] Testar

### Router: dashboard.py
- [ ] Extrair `GET /dashboard/stats`
- [ ] Extrair `GET /search`
- [ ] Testar

### Finalização
- [ ] Limpar main.py (apenas inicialização)
- [ ] Verificar todos os imports
- [ ] Rodar suite completa de testes
- [ ] Documentar estrutura no README

---

## main.py Final

```python
# main.py - Apenas inicialização
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Observability
import sentry_sdk
from prometheus_fastapi_instrumentator import Instrumentator
import structlog

# Routers
from routers import (
    auth, health, upload, admin,
    disciplines, courses, chapters, contents, questions,
    users, chat_sessions, notifications,
    ai_services, integrations, dashboard
)

# Utils
from utils.dependencies import init_supabase
from supabase import create_client

logger = structlog.get_logger()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_supabase(create_client(SUPABASE_URL, SUPABASE_KEY))
    logger.info("startup_complete")
    yield
    # Shutdown
    logger.info("shutdown")

app = FastAPI(
    title="Harven.AI API",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(CORSMiddleware, ...)

# Prometheus
Instrumentator().instrument(app).expose(app)

# Register all routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(disciplines.router)
app.include_router(courses.router)
app.include_router(chapters.router)
app.include_router(contents.router)
app.include_router(questions.router)
app.include_router(users.router)
app.include_router(chat_sessions.router)
app.include_router(notifications.router)
app.include_router(ai_services.router)
app.include_router(integrations.router)
app.include_router(dashboard.router)
app.include_router(upload.router)
app.include_router(admin.router)
```

---

## Definition of Done

- [ ] main.py com ~200 linhas
- [ ] 15 routers criados e funcionais
- [ ] Todos os 60+ endpoints funcionando
- [ ] Zero código duplicado
- [ ] Testes passando
- [ ] README atualizado com nova estrutura

---

## File List

| Arquivo | Ação |
|---------|------|
| `backend/routers/disciplines.py` | Criar |
| `backend/routers/courses.py` | Criar |
| `backend/routers/chapters.py` | Criar |
| `backend/routers/contents.py` | Criar |
| `backend/routers/questions.py` | Criar |
| `backend/routers/users.py` | Criar |
| `backend/routers/chat_sessions.py` | Criar |
| `backend/routers/notifications.py` | Criar |
| `backend/routers/ai_services.py` | Criar |
| `backend/routers/integrations.py` | Criar |
| `backend/routers/dashboard.py` | Criar |
| `backend/main.py` | Modificar (reduzir) |
| `backend/README.md` | Atualizar |

---

## Notes

- Priorizar por frequência de uso: disciplines > courses > ai_services
- Manter backward compatibility durante migração
- Testar em ambiente de staging antes de produção
