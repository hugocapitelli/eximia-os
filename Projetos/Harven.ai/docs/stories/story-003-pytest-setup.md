# Story HARVEN-003: Setup Pytest e Testes Básicos

**Story ID:** HARVEN-003
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Crítica
**Pontos:** 5
**Status:** Completed (já existia)

---

## User Story

**Como** desenvolvedor do Harven.AI,
**Quero** ter testes automatizados configurados,
**Para que** regressões sejam detectadas antes de ir para produção.

---

## Contexto

Atualmente o projeto tem **zero testes automatizados**:
- Nenhum arquivo de teste no backend
- Nenhum arquivo de teste no frontend
- Refatorações são arriscadas
- Bugs só são descobertos em produção

---

## Acceptance Criteria

- [x] Pytest configurado no backend
- [x] Pytest-asyncio para testes assíncronos
- [x] Arquivo `conftest.py` com fixtures básicas
- [x] Mínimo 5 testes para endpoints críticos (8 arquivos de teste)
- [x] Script `pytest` funcional
- [x] Coverage report configurado

---

## Technical Details

### Dependências Backend

```bash
pip install pytest pytest-asyncio pytest-cov httpx
```

Adicionar ao `requirements-dev.txt`:
```
pytest>=8.0.0
pytest-asyncio>=0.23.0
pytest-cov>=4.1.0
httpx>=0.26.0  # Para TestClient assíncrono
```

### Estrutura de Testes

```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Fixtures globais
│   ├── test_health.py       # Testes de health check
│   ├── test_auth.py         # Testes de autenticação
│   ├── test_disciplines.py  # Testes de disciplinas
│   └── test_ai_services.py  # Testes dos agentes IA
├── pytest.ini
└── ...
```

### pytest.ini

```ini
[pytest]
asyncio_mode = auto
testpaths = tests
python_files = test_*.py
python_functions = test_*
addopts = -v --tb=short
filterwarnings =
    ignore::DeprecationWarning
```

### conftest.py

```python
import pytest
from httpx import AsyncClient, ASGITransport
from main import app

@pytest.fixture
async def client():
    """Cliente HTTP assíncrono para testes."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def mock_supabase(mocker):
    """Mock do cliente Supabase."""
    mock = mocker.patch("main.supabase")
    return mock
```

### Exemplo de Teste

```python
# tests/test_health.py
import pytest

@pytest.mark.asyncio
async def test_root_endpoint(client):
    """Testa se o endpoint raiz está funcionando."""
    response = await client.get("/")
    assert response.status_code == 200
    assert "Harven.AI" in response.json()["message"]

@pytest.mark.asyncio
async def test_health_endpoint(client):
    """Testa endpoint de health check."""
    response = await client.get("/health")
    assert response.status_code == 200
```

---

## Tasks

- [ ] Criar `requirements-dev.txt` com dependências de teste
- [ ] Instalar dependências de teste
- [ ] Criar estrutura de diretórios `tests/`
- [ ] Criar `pytest.ini`
- [ ] Criar `conftest.py` com fixtures
- [ ] Criar `test_health.py` (2 testes)
- [ ] Criar `test_auth.py` (2 testes)
- [ ] Criar `test_disciplines.py` (2 testes)
- [ ] Configurar coverage report
- [ ] Adicionar script no README

---

## Testes Prioritários

| Endpoint | Criticidade | Motivo |
|----------|-------------|--------|
| `GET /` | Alta | Health check básico |
| `GET /health` | Alta | Usado pelo Docker |
| `POST /auth/login` | Crítica | Autenticação |
| `GET /disciplines` | Alta | Endpoint mais usado |
| `GET /api/ai/status` | Alta | Status dos agentes |

---

## Definition of Done

- [ ] `pytest` executa sem erros
- [ ] Mínimo 5 testes passando
- [ ] Coverage report gerado
- [ ] README atualizado com instruções

---

## File List

| Arquivo | Ação |
|---------|------|
| `backend/requirements-dev.txt` | Criar |
| `backend/pytest.ini` | Criar |
| `backend/tests/__init__.py` | Criar |
| `backend/tests/conftest.py` | Criar |
| `backend/tests/test_health.py` | Criar |
| `backend/tests/test_auth.py` | Criar |
| `backend/tests/test_disciplines.py` | Criar |

---

## Notes

- Começar com testes simples de integração
- Usar mocks para Supabase e OpenAI
- Não testar lógica externa (Supabase, OpenAI)
- Focar em testar nossa lógica de negócio
