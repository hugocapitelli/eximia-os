# Story HARVEN-008: Melhorar Error Handling Global

**Story ID:** HARVEN-008
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Média
**Pontos:** 5
**Status:** Partial (handlers criados)
**Depende de:** HARVEN-005, HARVEN-006 (Routers separados)

---

## User Story

**Como** operador do sistema,
**Quero** que erros sejam tratados consistentemente,
**Para que** seja fácil diagnosticar problemas e usuários recebam feedback útil.

---

## Contexto

Problemas atuais de error handling:

1. **151 blocos `except Exception`** que silenciam erros
2. **26 endpoints retornam `[]`** em caso de erro (sem indicar o problema)
3. **Erros não logados** corretamente
4. **Respostas inconsistentes** (às vezes 500, às vezes 200 com lista vazia)

Exemplo problemático:
```python
except Exception as e:
    print(f"Erro: {e}")
    return []  # ← Silencia o erro, retorna vazio
```

---

## Acceptance Criteria

- [x] Exception handlers globais configurados
- [x] Todas as exceções logadas com stack trace
- [x] Respostas de erro padronizadas
- [x] Códigos HTTP corretos (4xx client, 5xx server)
- [x] Mensagens de erro úteis para o cliente
- [x] Erros enviados para Sentry

---

## Technical Details

### Exception Handler Global

```python
# utils/exceptions.py
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import ValidationError
import structlog

logger = structlog.get_logger()

class AppException(Exception):
    """Base exception para erros da aplicação."""
    def __init__(self, message: str, code: str = "APP_ERROR", status_code: int = 500):
        self.message = message
        self.code = code
        self.status_code = status_code
        super().__init__(message)

class NotFoundError(AppException):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            message=f"{resource} não encontrado: {resource_id}",
            code="NOT_FOUND",
            status_code=404
        )

class ValidationException(AppException):
    def __init__(self, message: str):
        super().__init__(message=message, code="VALIDATION_ERROR", status_code=400)

class DatabaseError(AppException):
    def __init__(self, operation: str):
        super().__init__(
            message=f"Erro de banco de dados durante: {operation}",
            code="DATABASE_ERROR",
            status_code=503
        )
```

### Error Response Schema

```python
# models/responses.py
from pydantic import BaseModel
from typing import Optional, List

class ErrorDetail(BaseModel):
    field: Optional[str] = None
    message: str

class ErrorResponse(BaseModel):
    error: bool = True
    code: str
    message: str
    details: Optional[List[ErrorDetail]] = None
    request_id: Optional[str] = None

# Exemplo de resposta:
# {
#   "error": true,
#   "code": "NOT_FOUND",
#   "message": "Disciplina não encontrada: ABC123",
#   "request_id": "abc12345"
# }
```

### Handlers no main.py

```python
# main.py
from utils.exceptions import AppException, NotFoundError, DatabaseError
from models.responses import ErrorResponse

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.error(
        "app_exception",
        code=exc.code,
        message=exc.message,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            code=exc.code,
            message=exc.message,
            request_id=request.headers.get("X-Request-ID")
        ).model_dump()
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    logger.warning("validation_error", errors=exc.errors())
    return JSONResponse(
        status_code=422,
        content=ErrorResponse(
            code="VALIDATION_ERROR",
            message="Dados inválidos",
            details=[
                ErrorDetail(field=e["loc"][-1], message=e["msg"])
                for e in exc.errors()
            ]
        ).model_dump()
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.exception("unhandled_exception", exc_info=exc)
    # Sentry captura automaticamente
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            code="INTERNAL_ERROR",
            message="Erro interno do servidor"
        ).model_dump()
    )
```

### Refatoração de Endpoints

**De:**
```python
@app.get("/disciplines")
async def get_disciplines():
    try:
        response = supabase.table("disciplines").select("*").execute()
        return response.data or []
    except Exception as e:
        print(f"Erro: {e}")
        return []  # ← PROBLEMA
```

**Para:**
```python
@router.get("/disciplines", response_model=List[Discipline])
async def get_disciplines(supabase: Client = Depends(get_supabase)):
    try:
        response = supabase.table("disciplines").select("*").execute()
        return response.data or []
    except Exception as e:
        logger.exception("get_disciplines_error")
        raise DatabaseError("listar disciplinas")
```

---

## Tasks

- [ ] Criar `utils/exceptions.py` com classes de exceção
- [ ] Criar `models/responses.py` com ErrorResponse
- [ ] Adicionar exception handlers no main.py
- [ ] Refatorar endpoints de disciplines
- [ ] Refatorar endpoints de courses
- [ ] Refatorar endpoints de users
- [ ] Refatorar endpoints de ai_services
- [ ] Refatorar endpoints de admin
- [ ] Remover todos os `return []` silenciosos
- [ ] Verificar que Sentry recebe exceções
- [ ] Testar respostas de erro

---

## Padrão de Migração

Para cada endpoint:
1. Identificar casos de erro possíveis
2. Substituir `return []` por exceção apropriada
3. Adicionar logging estruturado
4. Testar cenário de erro

---

## Definition of Done

- [ ] Exception handlers configurados
- [ ] Zero `return []` após erro
- [ ] Todos os erros logados com contexto
- [ ] Respostas de erro no formato padronizado
- [ ] Testes de cenários de erro

---

## File List

| Arquivo | Ação |
|---------|------|
| `backend/utils/exceptions.py` | Criar |
| `backend/models/responses.py` | Criar/Expandir |
| `backend/main.py` | Adicionar handlers |
| `backend/routers/*.py` | Refatorar (cada router) |

---

## Notes

- Não expor detalhes de erro interno ao cliente em produção
- Logar stack trace completo internamente
- Usar códigos de erro consistentes para frontend
