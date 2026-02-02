# Story HARVEN-005: Separar main.py em Routers - Fase 1

**Story ID:** HARVEN-005
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Alta
**Pontos:** 8
**Status:** Partial (estrutura criada)

---

## User Story

**Como** desenvolvedor do Harven.AI,
**Quero** que o backend seja modularizado em arquivos separados,
**Para que** seja mais fácil manter, testar e trabalhar em equipe.

---

## Contexto

O arquivo `main.py` tem **4.814 linhas** com todos os endpoints:
- Difícil de navegar
- Conflitos de merge frequentes
- Impossível testar isoladamente
- Acoplamento alto entre componentes

**Esta é a Fase 1:** Extrair routers de domínios menores (Auth, Health, Upload, Admin)

---

## Acceptance Criteria

- [ ] Router `auth.py` extraído e funcional
- [ ] Router `health.py` extraído e funcional
- [ ] Router `upload.py` extraído e funcional
- [ ] Router `admin.py` extraído e funcional
- [ ] `main.py` reduzido em ~1000 linhas
- [ ] Todos os endpoints continuam funcionando
- [ ] Testes existentes passando

---

## Technical Details

### Estrutura Alvo (Fase 1)

```
backend/
├── main.py                    # ~3800 linhas (reduzido de 4814)
├── routers/
│   ├── __init__.py
│   ├── auth.py               # ~100 linhas
│   ├── health.py             # ~50 linhas
│   ├── upload.py             # ~300 linhas
│   └── admin.py              # ~500 linhas
├── models/
│   ├── __init__.py
│   └── requests.py           # Pydantic models extraídos
└── utils/
    ├── __init__.py
    └── auth.py               # (já criado em HARVEN-004)
```

### Padrão de Router FastAPI

```python
# routers/auth.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth"])

class LoginRequest(BaseModel):
    ra: str
    password: str

@router.post("/login")
async def login(data: LoginRequest):
    # Lógica movida do main.py
    ...
```

### Registro no main.py

```python
# main.py
from routers import auth, health, upload, admin

app.include_router(auth.router)
app.include_router(health.router)
app.include_router(upload.router)
app.include_router(admin.router)
```

### Endpoints por Router (Fase 1)

| Router | Endpoints | Linhas Estimadas |
|--------|-----------|------------------|
| `health.py` | `/`, `/health`, `/metrics` | ~50 |
| `auth.py` | `/auth/login` | ~100 |
| `upload.py` | `/upload`, `/upload/video`, `/upload/audio` | ~300 |
| `admin.py` | `/admin/*` (15 endpoints) | ~500 |

---

## Tasks

### Setup
- [x] Criar diretório `backend/routers/`
- [x] Criar `routers/__init__.py`
- [x] Criar diretório `backend/models/`
- [x] Criar `models/__init__.py`

### Router: health.py
- [ ] Extrair endpoints `/` e `/health`
- [ ] Mover configuração Prometheus
- [ ] Registrar router no main.py
- [ ] Testar endpoints

### Router: auth.py
- [ ] Extrair `LoginRequest` model
- [ ] Extrair endpoint `/auth/login`
- [ ] Mover lógica de autenticação
- [ ] Registrar router no main.py
- [ ] Testar login

### Router: upload.py
- [ ] Extrair endpoints de upload genérico
- [ ] Extrair endpoints de upload de vídeo
- [ ] Extrair endpoints de upload de áudio
- [ ] Mover função helper de upload (se existir)
- [ ] Registrar router no main.py
- [ ] Testar uploads

### Router: admin.py
- [ ] Extrair endpoints `/admin/stats`
- [ ] Extrair endpoints `/admin/settings`
- [ ] Extrair endpoints `/admin/logs`
- [ ] Extrair endpoints `/admin/backups`
- [ ] Extrair endpoints `/admin/security`
- [ ] Registrar router no main.py
- [ ] Testar endpoints admin

### Finalização
- [ ] Remover código duplicado do main.py
- [ ] Verificar imports
- [ ] Rodar todos os testes
- [ ] Testar manualmente endpoints críticos

---

## Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Quebrar endpoints | Testar cada router antes de mergear |
| Imports circulares | Usar injeção de dependência |
| Variáveis globais (supabase) | Passar como dependência ou usar context |

### Handling de Dependências Globais

```python
# utils/dependencies.py
from functools import lru_cache
from supabase import Client

_supabase: Client = None

def get_supabase() -> Client:
    global _supabase
    if _supabase is None:
        raise RuntimeError("Supabase not initialized")
    return _supabase

def init_supabase(client: Client):
    global _supabase
    _supabase = client

# No router:
from fastapi import Depends
from utils.dependencies import get_supabase

@router.get("/disciplines")
async def get_disciplines(supabase: Client = Depends(get_supabase)):
    ...
```

---

## Definition of Done

- [ ] 4 routers criados e funcionais
- [ ] main.py reduzido em ~1000 linhas
- [ ] Nenhum endpoint quebrado
- [ ] Testes passando
- [ ] Código revisado

---

## File List

| Arquivo | Ação |
|---------|------|
| `backend/routers/__init__.py` | Criar |
| `backend/routers/health.py` | Criar |
| `backend/routers/auth.py` | Criar |
| `backend/routers/upload.py` | Criar |
| `backend/routers/admin.py` | Criar |
| `backend/models/__init__.py` | Criar |
| `backend/models/requests.py` | Criar |
| `backend/utils/dependencies.py` | Criar |
| `backend/main.py` | Modificar (extrair código) |

---

## Notes

- Fazer commits pequenos por router
- Testar após cada extração
- Manter backward compatibility
- Fase 2 (HARVEN-006) extrairá: disciplines, courses, chapters, contents, ai_services
