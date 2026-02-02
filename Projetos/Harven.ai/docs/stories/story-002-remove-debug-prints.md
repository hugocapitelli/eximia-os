# Story HARVEN-002: Remover Debug Prints do Backend

**Story ID:** HARVEN-002
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Crítica
**Pontos:** 3
**Status:** Completed

---

## User Story

**Como** operador do sistema Harven.AI,
**Quero** que logs de debug não apareçam em produção,
**Para que** os logs sejam limpos e não exponham informações sensíveis.

---

## Contexto

Existem **56 ocorrências** de `print(f"DEBUG:...)` no `main.py`:

```python
print(f"DEBUG: Buscando RA: {data.ra}")           # Linha 519 - EXPÕE RA
print(f"DEBUG: Safe file path: {file_path}...")   # Linha 2574 - EXPÕE PATHS
print(f"DEBUG: Success! URL: {public_url}")       # Várias linhas
```

**Problemas:**
- Logs de produção poluídos
- Possível exposição de dados sensíveis (RAs, paths)
- Performance degradada
- Dificulta troubleshooting real

---

## Acceptance Criteria

- [x] Zero `print(f"DEBUG` no código
- [x] Todos convertidos para `logger.debug()` (structlog)
- [x] Log level configurável por ambiente
- [x] Informações sensíveis removidas ou mascaradas

---

## Technical Details

### Logger Já Configurado

O projeto já tem structlog configurado:
```python
# main.py linha 62-74
structlog.configure(
    processors=[...],
    wrapper_class=structlog.make_filtering_bound_logger(get_log_level()),
    ...
)
logger = structlog.get_logger()
```

### Padrão de Substituição

**De:**
```python
print(f"DEBUG: Buscando RA: {data.ra}")
```

**Para:**
```python
logger.debug("auth_lookup", ra=data.ra[:4] + "***")  # Mascarar parcialmente
```

### Níveis de Log Recomendados

| Situação | Nível |
|----------|-------|
| Início de operação | `logger.debug` |
| Sucesso de operação | `logger.info` |
| Falha recuperável | `logger.warning` |
| Erro de operação | `logger.error` |

### Configuração de Ambiente

```bash
# .env.example
LOG_LEVEL=DEBUG   # Desenvolvimento
LOG_LEVEL=INFO    # Produção
```

---

## Tasks

- [x] Identificar todas as 56 ocorrências de DEBUG prints
- [x] Categorizar por tipo (auth, upload, AI, etc.)
- [x] Substituir por logger.debug com contexto estruturado
- [x] Mascarar dados sensíveis (RAs, tokens, paths internos)
- [x] Verificar que LOG_LEVEL funciona corretamente
- [x] Testar em ambiente de desenvolvimento
- [x] Documentar padrões de logging

---

## Ocorrências por Categoria

| Categoria | Quantidade | Arquivos |
|-----------|------------|----------|
| Auth/Login | 4 | main.py:519-530 |
| Avatar Upload | 10 | main.py:1471-1568 |
| Course Upload | 12 | main.py:2051-2130 |
| Discipline Upload | 6 | main.py:2144-2179 |
| Content Upload | 14 | main.py:2423-2592 |
| TTS/Audio | 10 | main.py:2959-3234 |

---

## Definition of Done

- [x] `grep -r "DEBUG:" backend/` retorna zero resultados
- [x] `LOG_LEVEL=DEBUG` mostra logs debug em dev
- [x] `LOG_LEVEL=INFO` esconde logs debug em prod
- [x] Nenhum dado sensível exposto em logs

---

## File List

| Arquivo | Ação |
|---------|------|
| `backend/main.py` | Modificar (56 locais) |
| `backend/.env.example` | Verificar LOG_LEVEL |

---

## Notes

- Fazer em commits pequenos por categoria
- Manter mensagens de log úteis para debugging
- Usar formato estruturado do structlog
