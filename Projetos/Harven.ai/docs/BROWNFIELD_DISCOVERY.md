# Harven.AI - Brownfield Discovery Report

**Data:** 2026-02-02
**Projeto:** Harven.AI - Plataforma de Aprendizagem Socrática com IA
**Tipo:** Brownfield (projeto existente em desenvolvimento ativo)
**Status:** Em produção / Evolução contínua

---

## 1. Visão Geral do Projeto

### 1.1 Propósito
Harven.AI é uma plataforma educacional que utiliza **inteligência artificial** para criar experiências de aprendizado baseadas no **método socrático**. Em vez de dar respostas prontas, a IA guia o aluno através de perguntas provocativas que estimulam o pensamento crítico.

### 1.2 Principais Funcionalidades
- **6 Agentes de IA Especializados** - Sistema multiagente para geração, validação e análise
- **Gestão de Cursos Completa** - Upload de PDF, vídeos, textos
- **Diálogo Socrático Inteligente** - 3 turnos de conversação guiada
- **Detecção de IA** - Identifica se aluno usou ChatGPT/IA
- **Dashboard Administrativo** - Métricas, usuários, configurações
- **Exportação Moodle** - Integração com LMS existente
- **Integrações** - JACAD (Sistema Acadêmico) + Moodle LMS

### 1.3 Domínio do Problema
- **Setor:** EdTech / Educação Superior
- **Público-alvo:** Instituições de ensino, professores e alunos
- **Modelo:** B2B (SaaS para instituições)

---

## 2. Stack Tecnológico

### 2.1 Frontend

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | React | 19.2.3 |
| Linguagem | TypeScript | ~5.8.2 |
| Build Tool | Vite | 6.2.0 |
| HTTP Client | Axios | 1.13.2 |
| Auth Client | Supabase JS | 2.90.1 |
| Router | React Router | 7.12.0 |
| Error Tracking | Sentry React | 8.55.0 |
| Utilities | html2canvas | 1.4.1 |

### 2.2 Backend

| Componente | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | FastAPI | >=0.110.0 |
| Server (Dev) | Uvicorn | >=0.27.0 |
| Server (Prod) | Gunicorn | >=21.2.0 |
| Database Client | Supabase | >=2.3.0 |
| Validation | Pydantic | >=2.6.0 |
| AI/LLM | OpenAI | >=1.12.0 |
| TTS | ElevenLabs | >=1.0.0 |
| Monitoring | Sentry SDK | >=1.40.0 |
| Metrics | Prometheus | >=6.1.0 |
| Logging | Structlog | >=24.1.0 |
| Caching | Redis | >=5.0.0 |
| Rate Limiting | SlowAPI | >=0.1.9 |
| PDF Extraction | pdfplumber | >=0.10.0 |

### 2.3 Infraestrutura

| Componente | Tecnologia |
|-----------|-----------|
| Database | Supabase (PostgreSQL gerenciado) |
| Storage | Supabase Storage |
| Cache | Redis 7 Alpine |
| Containerização | Docker + Docker Compose |
| Reverse Proxy | Nginx |
| Metrics | Prometheus + Grafana |
| Logs | Loki |
| Deployment | Coolify (self-hosted) |
| SSL | Let's Encrypt |

---

## 3. Arquitetura

### 3.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│  - 23 views para Student/Instructor/Admin                   │
│  - Componentes reutilizáveis com design system              │
│  - Supabase client-side authentication                      │
├─────────────────────────────────────────────────────────────┤
│                      NGINX (Load Balancer)                   │
│  - Reverse proxy, gzip compression, security headers        │
├─────────────────────────────────────────────────────────────┤
│                  BACKEND (FastAPI + Python)                  │
│  - RESTful API com 60+ endpoints                             │
│  - 6 Agentes IA integrados                                   │
│  - Integração com JACAD e Moodle                             │
├─────────────────────────────────────────────────────────────┤
│                 SUPABASE (PostgreSQL + Storage)              │
│  - Database relacional com RLS policies                      │
│  - Storage buckets para imagens e vídeos                     │
│  - Real-time listeners (opcional)                           │
├─────────────────────────────────────────────────────────────┤
│        INTEGRAÇÕES EXTERNAS (OpenAI, ElevenLabs)            │
│  - GPT-4o-mini para geração de conteúdo                     │
│  - ElevenLabs para Text-to-Speech                           │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Fluxo de Requisição

```
Cliente Browser
    ↓
HTTPS/TLS (Let's Encrypt)
    ↓
Nginx (reverse proxy + cache + headers)
    ↓
FastAPI (rate limit, validação CORS)
    ↓
Pydantic (validação entrada)
    ↓
Supabase Client (query + RLS)
    ↓
PostgreSQL Database
    ↓
Resposta JSON
```

### 3.3 Sistema de Agentes de IA

```
Entrada do Aluno
        ↓
[1] Creator OS        → Gera perguntas socráticas
        ↓
[2] Socrates OS       → Conduz diálogo (máx 3 iterações)
        ↓
[3] Analyst OS        → Detecta conteúdo de IA
        ↓
[4] Editor OS         → Refina respostas
        ↓
[5] Tester OS         → Valida qualidade
        ↓
[6] Organizer OS      → Persiste e exporta para Moodle
        ↓
Saída com tracking
```

---

## 4. Estrutura de Diretórios

### 4.1 Visão Geral

```
Harven.ai/
├── backend/                         # API FastAPI
│   ├── agents/                      # 6 agentes de IA
│   │   ├── __init__.py
│   │   ├── harven_creator.py        # Gerador de questões
│   │   ├── harven_socrates.py       # Motor de diálogo
│   │   ├── harven_analyst.py        # Detector de IA
│   │   ├── harven_editor.py         # Refinador
│   │   ├── harven_tester.py         # Validador
│   │   └── harven_organizer.py      # Organizador/Export
│   ├── services/
│   │   ├── ai_service.py            # Integração OpenAI
│   │   └── integration_service.py   # JACAD + Moodle
│   ├── main.py                      # API endpoints (~4500 linhas)
│   ├── requirements.txt             # Dependências Python
│   ├── Dockerfile                   # Build containerizado
│   └── .env.example
│
├── harven.ai-platform-mockup/       # Frontend React
│   ├── views/                       # 23 páginas
│   │   ├── StudentDashboard.tsx
│   │   ├── AdminConsole.tsx
│   │   ├── ChapterReader.tsx
│   │   └── ... (20 views adicionais)
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── ui/                      # Design system (8 componentes)
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── services/
│   │   └── api.ts                   # Cliente REST (~889 linhas)
│   ├── contexts/
│   │   └── SettingsContext.tsx      # Provider global
│   ├── lib/
│   │   └── supabase.ts              # Cliente Supabase
│   ├── types.ts                     # TypeScript interfaces
│   ├── App.tsx                      # Componente raiz
│   ├── routes.tsx                   # Roteamento
│   ├── package.json
│   └── Dockerfile
│
├── docs/                            # Documentação
│   ├── DEPLOYMENT.md
│   ├── RUNBOOK.md
│   ├── GUIA_INTEGRACOES_JACAD_MOODLE.md
│   └── PASSO_A_PASSO_INTEGRACOES.md
│
├── monitoring/                      # Configs Prometheus/Grafana
│
├── docker-compose.yml               # Orquestração
├── CLAUDE.md                        # Instruções para Claude
├── AI_AGENTS.md                     # Documentação dos agentes
├── ESPECIFICACOES_TECNICAS_HARVEN_AI.md # Especificações completas
└── README.md
```

### 4.2 Views do Frontend (23 páginas)

| View | Tipo | Descrição |
|------|------|-----------|
| StudentDashboard | Student | Dashboard principal do aluno |
| StudentAchievements | Student | Conquistas e gamificação |
| StudentHistory | Student | Histórico de atividades |
| CourseList | All | Lista de cursos |
| CourseDetails | All | Detalhes do curso |
| CourseEdit | Instructor | Edição de curso |
| ChapterDetail | All | Detalhes do capítulo |
| ChapterReader | Student | Leitor de conteúdo |
| InstructorList | Admin | Lista de professores |
| InstructorDetail | Admin | Detalhes do professor |
| DisciplineEdit | Instructor | Edição de disciplina |
| ContentCreation | Instructor | Criação de conteúdo |
| ContentRevision | Instructor | Revisão de conteúdo |
| AdminConsole | Admin | Console administrativo |
| AdminClassManagement | Admin | Gestão de turmas |
| UserManagement | Admin | Gestão de usuários |
| SystemSettings | Admin | Configurações do sistema |
| UserProfile | All | Perfil do usuário |
| AccountSettings | All | Configurações de conta |
| Login | Public | Tela de login |
| Achievements | All | Conquistas |
| HoshinInitiatives | Admin | Iniciativas estratégicas |
| StudentMonitor | Instructor | Monitor de alunos |

### 4.3 Componentes UI

- Avatar
- Badge
- Button
- Card
- Input
- Progress
- Select
- Tabs
- Header
- Sidebar
- ShareCard
- AchievementCard

---

## 5. API Endpoints

### 5.1 Categorias de Endpoints (60+)

| Categoria | Descrição | Quantidade |
|-----------|-----------|------------|
| Health | Status e healthchecks | 3 |
| Auth | Autenticação | 1 |
| Disciplines | Gestão de turmas | 15+ |
| Courses | Gestão de cursos | 10+ |
| Chapters | Gestão de capítulos | 5+ |
| Contents | Gestão de conteúdo | 7+ |
| Questions | Perguntas socráticas | 5+ |
| AI Services | 6 agentes de IA | 10 |
| Chat Sessions | Persistência de diálogos | 10+ |
| Notifications | Sistema de notificações | 6 |
| Dashboard | Estatísticas | 2 |
| User Progress | Progresso e conquistas | 8+ |
| Search | Busca global | 1 |
| Upload | Upload de arquivos | 3 |
| Admin | Configurações, logs, backups | 15+ |
| Integrations | JACAD + Moodle | 10+ |

### 5.2 Endpoints de IA

| Agente | Endpoint | Função |
|--------|----------|--------|
| Creator | `POST /api/ai/creator/generate` | Gera perguntas socráticas |
| Socrates | `POST /api/ai/socrates/dialogue` | Conduz diálogo |
| Analyst | `POST /api/ai/analyst/detect` | Detecta IA |
| Editor | `POST /api/ai/editor/edit` | Refina respostas |
| Tester | `POST /api/ai/tester/validate` | Valida qualidade |
| Organizer | `POST /api/ai/organizer/session` | Gerencia sessões |
| Organizer | `POST /api/ai/organizer/prepare-export` | Prepara Moodle |
| TTS | `POST /api/ai/tts/generate` | Text-to-Speech |

---

## 6. Modelo de Dados

### 6.1 Tabelas Principais

```
users
├── id (UUID, PK)
├── ra (VARCHAR, UNIQUE) - Registro Acadêmico
├── name (VARCHAR)
├── email (VARCHAR)
├── role (ENUM: STUDENT, INSTRUCTOR, ADMIN)
├── avatar (VARCHAR)
└── created_at (TIMESTAMP)

disciplines
├── id (UUID, PK)
├── code (VARCHAR)
├── name/title (VARCHAR)
├── department (VARCHAR)
└── created_at (TIMESTAMP)

courses
├── id (UUID, PK)
├── discipline_id (FK → disciplines)
├── title (VARCHAR)
├── description (TEXT)
├── thumbnail (VARCHAR)
├── status (ENUM: Ativo, Rascunho, Arquivado)
├── created_by (FK → users)
└── created_at (TIMESTAMP)

chapters
├── id (UUID, PK)
├── course_id (FK → courses)
├── title (VARCHAR)
├── order (INTEGER)
└── created_at (TIMESTAMP)

contents
├── id (UUID, PK)
├── chapter_id (FK → chapters)
├── title (VARCHAR)
├── type (ENUM: video, text, pdf, quiz, audio)
├── text_content (TEXT)
├── body (TEXT)
├── audio_url (VARCHAR)
└── created_at (TIMESTAMP)

questions
├── id (UUID, PK)
├── content_id (FK → contents)
├── text (TEXT)
├── skill (VARCHAR: aplicacao, analise, sintese)
├── intention (TEXT)
├── difficulty (ENUM: iniciante, intermediario, avancado)
└── created_at (TIMESTAMP)

chat_sessions
├── id (UUID, PK)
├── user_id (FK → users)
├── content_id (FK → contents)
├── status (ENUM: active, completed, exported)
├── performance_score (FLOAT)
├── moodle_export_id (VARCHAR, UNIQUE)
└── timestamps

chat_messages
├── id (UUID, PK)
├── session_id (FK → chat_sessions)
├── role (ENUM: user, assistant, system)
├── content (TEXT)
├── agent_type (VARCHAR)
├── metadata (JSONB)
└── created_at (TIMESTAMP)
```

### 6.2 Tabelas de Relacionamento

- `discipline_teachers` (discipline_id, teacher_id)
- `discipline_students` (discipline_id, student_id)

### 6.3 Tabelas Administrativas

- `system_settings`
- `system_logs`

---

## 7. Padrões de Navegação

### 7.1 Sistema de Rotas (State-based)

O frontend utiliza navegação baseada em estado:

```typescript
type ViewType =
  | 'STUDENT_DASHBOARD'
  | 'ADMIN_CONSOLE'
  | 'COURSE_DETAILS'
  | ... (19 views)

handleNavigate(view: ViewType, data?: any)
handleBack()
```

### 7.2 User Roles e Permissões

| Role | Acesso |
|------|--------|
| STUDENT | Dashboard, cursos, conquistas, perfil |
| INSTRUCTOR | Disciplinas, cursos, conteúdo, alunos |
| ADMIN | Tudo + settings + logs + backups |

---

## 8. Integrações

### 8.1 JACAD (Sistema Acadêmico)

- Sincronização de alunos e disciplinas
- Lookup por RA para login
- Importação em lote

### 8.2 Moodle LMS

- Exportação de sessões de chat
- Formato xAPI para Learning Record Store
- Webhooks para feedback

### 8.3 OpenAI

- Modelo: gpt-4o-mini (default)
- Alternativas: gpt-4o, gpt-4-turbo

### 8.4 ElevenLabs

- Text-to-Speech multilingual
- 29 vozes disponíveis
- Formato: mp3_44100_128

---

## 9. Observabilidade

### 9.1 Monitoramento

| Ferramenta | Função |
|-----------|--------|
| Prometheus | Coleta de métricas |
| Grafana | Dashboards e alertas |
| Loki | Agregação de logs |
| Sentry | Error tracking |

### 9.2 Logging

- Estruturado com Structlog
- Níveis: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Request ID em todas as requisições

### 9.3 Health Checks

- `GET /` - Backend status
- `GET /health` - Health endpoint
- `GET /api/ai/status` - AI agents status

---

## 10. Segurança

### 10.1 Implementado

- CORS configurado por ambiente
- Validação Pydantic em todos endpoints
- RLS (Row-Level Security) no Supabase
- Non-root user no Docker
- Security headers no Nginx
- Rate limiting com SlowAPI
- Sanitização com Bleach

### 10.2 Autenticação

- Login por RA + password
- Tokens em localStorage
- Normalização de roles no backend

---

## 11. Deploy

### 11.1 Ambientes

| Ambiente | URL |
|----------|-----|
| Frontend | https://harven.eximiaventures.com.br |
| Backend API | https://api.harven.eximiaventures.com.br |
| Grafana | https://grafana.harven.eximiaventures.com.br |

### 11.2 Docker Compose Services

- `backend` - FastAPI (1 replica, 1CPU, 1GB RAM)
- `frontend` - React/Nginx
- `redis` - Cache (256MB)
- `prometheus` - Métricas
- `grafana` - Dashboards
- `loki` - Logs

---

## 12. Technical Debt / Melhorias Identificadas

### 12.1 Alta Prioridade

1. **main.py monolítico** - ~4500 linhas em arquivo único
   - Recomendação: Separar em routers por domínio

2. **Sem testes automatizados** - Ausência de pytest/jest
   - Recomendação: Implementar testes unitários e e2e

3. **Linter não configurado** - Frontend sem ESLint
   - Recomendação: Configurar ESLint + Prettier

### 12.2 Média Prioridade

4. **JWT não implementado completamente**
   - Autenticação simplificada (RA + password)
   - Recomendação: Implementar JWT com refresh tokens

5. **Sem CI/CD configurado**
   - Recomendação: GitHub Actions para testes e deploy

6. **Variáveis hardcoded**
   - Alguns URLs de produção no código
   - Recomendação: Mover para variáveis de ambiente

### 12.3 Baixa Prioridade

7. **Design System incompleto**
   - 8 componentes básicos
   - Recomendação: Expandir conforme necessidade

8. **Documentação de API**
   - FastAPI gera OpenAPI automaticamente
   - Recomendação: Melhorar descrições

---

## 13. Próximos Passos Recomendados

### Para Novas Features

1. Criar story no padrão AIOS
2. Analisar impacto nos 6 agentes de IA
3. Verificar necessidade de novos endpoints
4. Atualizar tipos TypeScript
5. Implementar e testar

### Para Refatorações

1. Priorizar separação do main.py
2. Implementar testes antes de grandes mudanças
3. Manter compatibilidade com integrações existentes

### Para Deploy

1. Seguir RUNBOOK.md para troubleshooting
2. Verificar health checks antes de produção
3. Monitorar Sentry para erros

---

## 14. Contatos e Recursos

### Documentação

- `CLAUDE.md` - Instruções para Claude Code
- `AI_AGENTS.md` - Documentação dos agentes
- `ESPECIFICACOES_TECNICAS_HARVEN_AI.md` - Especificações completas
- `docs/RUNBOOK.md` - Runbook operacional
- `docs/DEPLOYMENT.md` - Guia de deploy

### URLs de Referência

- Supabase Dashboard: https://app.supabase.com
- OpenAI Dashboard: https://platform.openai.com
- ElevenLabs: https://elevenlabs.io

---

*Documento gerado automaticamente pelo AIOS Brownfield Discovery*
*Data: 2026-02-02*
