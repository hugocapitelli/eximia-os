# CHECKPOINT: BLOCO 0.2 - Agent Service Setup
**Criado:** 26 Janeiro 2026
**Atualizado:** 26 Janeiro 2026
**Status:** `NOT_STARTED`

---

## Informações do Bloco

| Campo | Valor |
|-------|-------|
| **PRD Fonte** | N/A (infraestrutura) |
| **Dependências** | BLOCO 0.1 |
| **Instância Atual** | - |

---

## Checklist de Escopo

### Setup do Projeto
- [ ] Criar estrutura de pastas Python
- [ ] Configurar pyproject.toml ou requirements.txt
- [ ] Configurar ambiente virtual
- [ ] Instalar FastAPI + Uvicorn
- [ ] Criar main.py básico

### Estrutura Base
- [ ] Configurar routers
- [ ] Configurar settings (pydantic-settings)
- [ ] Criar endpoint /health
- [ ] Configurar CORS
- [ ] Configurar logging

### Integração Supabase
- [ ] Instalar supabase-py
- [ ] Criar client Supabase
- [ ] Testar conexão com banco
- [ ] Validação de JWT (auth)

### Deploy Easypanel
- [ ] Criar Dockerfile
- [ ] Configurar projeto no Easypanel
- [ ] Configurar variáveis de ambiente
- [ ] Deploy inicial
- [ ] Testar health check

### Comunicação Next.js ↔ Agent Service
- [ ] Criar client no Next.js para Agent Service
- [ ] Testar chamada do frontend para backend
- [ ] Verificar CORS funcionando

**Progresso:** 0/17 (0%)

---

## Estado Atual

### Última Ação Realizada
```
Nenhuma - bloco não iniciado
Depende de: BLOCO 0.1 (Setup Next.js)
```

### Próxima Ação Pendente
```
Aguardar conclusão do BLOCO 0.1
```

### Arquivos Modificados
```
Nenhum ainda
```

---

## Configurações Necessárias

### Variáveis de Ambiente

```env
# Supabase
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-role-key

# LLM Providers (será usado nos próximos blocos)
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key

# App
ENVIRONMENT=development
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000"]
```

### Estrutura de Pastas Esperada

```
agent-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app
│   ├── config.py               # Settings
│   │
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py             # Dependencies (auth, db)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py       # Main router
│   │       └── health.py       # Health endpoints
│   │
│   └── services/
│       ├── __init__.py
│       └── supabase.py         # Supabase client
│
├── tests/
│   └── test_health.py
│
├── Dockerfile
├── requirements.txt
├── pyproject.toml
└── README.md
```

### Dockerfile (referência)

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY app/ ./app/

# Run
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### requirements.txt (inicial)

```txt
fastapi>=0.100.0
uvicorn[standard]>=0.23.0
pydantic>=2.0.0
pydantic-settings>=2.0.0
httpx>=0.24.0
supabase>=2.0.0
python-jose[cryptography]>=3.3.0
```

---

## Código Base (referência)

### main.py

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title="ExímIA Agent Service",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "agent-service"}
```

### config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    environment: str = "development"
    log_level: str = "INFO"
    cors_origins: list[str] = ["http://localhost:3000"]

    supabase_url: str
    supabase_service_key: str

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## Blockers (se houver)

| Blocker | Descrição | Ação Necessária |
|---------|-----------|-----------------|
| Dependência | BLOCO 0.1 não concluído | Aguardar |

---

## Critério de Done

- [ ] `/health` retornando `{"status": "ok"}`
- [ ] Deploy funcionando no Easypanel
- [ ] Next.js consegue chamar Agent Service
- [ ] Logs visíveis no Easypanel
- [ ] CORS funcionando corretamente

---

## Histórico de Sessões

| Data | Instância | Ações | Resultado |
|------|-----------|-------|-----------|
| 26/01/2026 | - | Checkpoint criado | Setup inicial |

---

*Última atualização: 26 Janeiro 2026 - 14:00*
