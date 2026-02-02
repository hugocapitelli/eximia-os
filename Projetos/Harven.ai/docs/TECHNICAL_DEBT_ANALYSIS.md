# Harven.AI - Análise de Débitos Técnicos

**Data:** 2026-02-02
**Analista:** Atlas (AIOS Analyst)
**Objetivo:** Identificar e priorizar débitos técnicos para facilitar mudanças futuras

---

## Resumo Executivo

| Severidade | Quantidade | Impacto |
|------------|------------|---------|
| 🔴 Crítico | 3 | Bloqueia escalabilidade e manutenção |
| 🟠 Alto | 5 | Dificulta mudanças e causa bugs |
| 🟡 Médio | 4 | Reduz qualidade e produtividade |
| 🟢 Baixo | 3 | Melhoria de qualidade |

**Estimativa total de refatoração:** 40-60 horas de desenvolvimento

---

## 🔴 Débitos Críticos (Prioridade Máxima)

### 1. Arquivo `main.py` Monolítico

**Localização:** `backend/main.py`
**Linhas:** 4.814 linhas em arquivo único
**Impacto:** Alto - Dificulta manutenção, testes e trabalho em equipe

**Problema:**
- Todos os 60+ endpoints em um único arquivo
- Difícil de navegar e manter
- Conflitos de merge frequentes
- Impossível testar componentes isoladamente

**TODOs encontrados no código:**
```python
# Linha 530: TODO: Implementar verificação real de hash (bcrypt/argon2)
# Linha 1455: TODO: Hash password
# Linha 2500: TODO: Add support for docx, pptx extraction
# Linha 4760: TODO: Validar assinatura quando webhook_secret estiver configurado
```

**Solução Recomendada:**
```
backend/
├── main.py              # Apenas inicialização e lifespan
├── routers/
│   ├── auth.py          # Autenticação
│   ├── disciplines.py   # Disciplinas/turmas
│   ├── courses.py       # Cursos
│   ├── chapters.py      # Capítulos
│   ├── contents.py      # Conteúdos
│   ├── questions.py     # Questões
│   ├── users.py         # Usuários
│   ├── ai_services.py   # 6 agentes de IA
│   ├── chat_sessions.py # Sessões de chat
│   ├── admin.py         # Admin endpoints
│   ├── integrations.py  # JACAD + Moodle
│   └── upload.py        # Upload de arquivos
├── models/
│   ├── requests.py      # Pydantic request models
│   └── responses.py     # Pydantic response models
├── services/            # (já existe)
└── utils/
    └── auth.py          # Helpers de autenticação
```

**Esforço estimado:** 16-24 horas

---

### 2. Debug Statements em Produção

**Localização:** `backend/main.py`
**Ocorrências:** 56 `print(f"DEBUG:...)` no código

**Problema:**
- Logs de debug vazando para produção
- Possível exposição de dados sensíveis
- Performance degradada
- Logs poluídos

**Exemplos encontrados:**
```python
print(f"DEBUG: Buscando RA: {data.ra}")           # Linha 519
print(f"DEBUG: Starting avatar upload...")         # Linha 1471
print(f"DEBUG: Safe file path: {file_path}...")   # Linha 2574
```

**Solução:**
1. Substituir todos `print(f"DEBUG:` por `logger.debug(`
2. Configurar log level adequado por ambiente
3. O structlog já está configurado, usar corretamente

**Esforço estimado:** 2-3 horas

---

### 3. Ausência de Testes Automatizados

**Localização:** Projeto inteiro
**Arquivos de teste encontrados:** 0

**Problema:**
- Sem pytest no backend
- Sem jest/vitest no frontend
- Regressões não detectadas
- Refatoração arriscada

**Solução:**
1. Backend: Configurar pytest + pytest-asyncio
2. Frontend: Configurar vitest (já usa Vite)
3. Criar testes para endpoints críticos primeiro

**Esforço estimado:** 8-12 horas (setup + testes básicos)

---

## 🟠 Débitos de Alta Prioridade

### 4. Segurança de Senhas

**Localização:** `backend/main.py:530, 1455`
**Status:** TODO no código

**Problema:**
```python
# Linha 530: TODO: Implementar verificação real de hash (bcrypt/argon2)
# Linha 1455: if user.password: data["password"] = user.password # TODO: Hash
```

Senhas possivelmente sendo armazenadas/comparadas sem hash.

**Solução:**
1. Usar bcrypt (já está no requirements.txt)
2. Implementar hash na criação de usuário
3. Implementar verificação no login

**Esforço estimado:** 2-3 horas

---

### 5. Type Safety no Frontend (uso de `any`)

**Localização:** `harven.ai-platform-mockup/services/api.ts`
**Ocorrências:** 25+ usos de `: any`

**Problema:**
```typescript
create: async (data: any) => { ... }
update: async (disciplineId: string, data: any) => { ... }
```

- Perde benefícios do TypeScript
- Bugs difíceis de detectar
- Autocompletion não funciona

**Solução:**
1. Criar interfaces para todos os payloads
2. Substituir `any` por tipos específicos
3. Usar tipos gerados do OpenAPI (recomendado)

**Esforço estimado:** 4-6 horas

---

### 6. Error Handling Inconsistente

**Localização:** `backend/main.py`
**Ocorrências:** 151 blocos `except Exception`

**Problema:**
```python
except Exception as e:
    print(f"Erro: {e}")
    return []  # Silencia o erro, retorna vazio
```

- Erros silenciados
- 26 endpoints retornam `[]` em caso de erro
- Difícil debugar problemas em produção

**Solução:**
1. Criar exception handlers globais
2. Logar erros com stack trace
3. Retornar erros HTTP apropriados
4. Criar classes de exceção customizadas

**Esforço estimado:** 4-6 horas

---

### 7. Configuração ESLint/Prettier Ausente

**Localização:** `harven.ai-platform-mockup/`
**Arquivo:** `package.json` mostra `"lint": "echo 'No linter configured yet'"`

**Problema:**
- Código inconsistente
- Bugs de estilo não detectados
- Dificuldade de padronização em equipe

**Solução:**
```bash
npm install -D eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier eslint-config-prettier
```

**Esforço estimado:** 1-2 horas

---

### 8. TODOs no Frontend

**Localização:** Views do frontend

**Encontrados:**
```typescript
// AdminConsole.tsx:51 - author: 'Admin' // TODO: Get logged user name
// ChapterReader.tsx:910 - // TODO: Integrar com API de IA para reescrita
```

**Esforço estimado:** 2-3 horas

---

## 🟡 Débitos de Média Prioridade

### 9. Duplicação de Código de Upload

**Localização:** `backend/main.py`

**Problema:**
O mesmo padrão de upload (try multiple buckets) está repetido ~10 vezes:
```python
for bucket_name in ["courses", "avatars", "public"]:
    try:
        print(f"DEBUG: Trying bucket '{bucket_name}'...")
        # upload logic
    except Exception as bucket_err:
        print(f"DEBUG: Bucket '{bucket_name}' failed: {bucket_err}")
```

**Solução:**
Criar função helper `upload_to_storage(file, buckets, path)` em `utils/storage.py`

**Esforço estimado:** 2-3 horas

---

### 10. Ausência de CI/CD

**Localização:** Projeto inteiro
**Arquivos encontrados:** Nenhum workflow GitHub Actions

**Problema:**
- Deploy manual
- Sem validação automática de PRs
- Sem testes automatizados no pipeline

**Solução:**
Criar `.github/workflows/`:
- `ci.yml` - Lint, typecheck, testes
- `cd.yml` - Deploy para Coolify

**Esforço estimado:** 3-4 horas

---

### 11. Hardcoded URLs de Produção

**Localização:** Múltiplos arquivos

**Problema:**
```python
# main.py
"https://harven.eximiaventures.com.br"

# docker-compose.yml
VITE_API_URL=https://api.harven.eximiaventures.com.br
```

**Solução:**
Todas as URLs devem vir de variáveis de ambiente

**Esforço estimado:** 1-2 horas

---

### 12. Webhook Security

**Localização:** `backend/main.py:4760`

**Problema:**
```python
# TODO: Validar assinatura quando webhook_secret estiver configurado
```

Webhooks do Moodle podem não estar validados

**Esforço estimado:** 1-2 horas

---

## 🟢 Débitos de Baixa Prioridade

### 13. Documentação de API Incompleta

**Problema:** Algumas rotas sem docstrings completas

**Esforço estimado:** 2-3 horas

---

### 14. Extração de DOCX/PPTX

**Localização:** `backend/main.py:2500`
```python
# TODO: Add support for docx, pptx extraction
```

**Esforço estimado:** 2-3 horas

---

### 15. Design System Incompleto

**Problema:** Apenas 8 componentes UI básicos

**Esforço estimado:** Conforme necessidade

---

## Plano de Ação Recomendado

### Fase 1: Preparação (Antes de Mudanças)
**Objetivo:** Habilitar mudanças seguras
**Duração:** 1-2 dias

| # | Tarefa | Prioridade | Horas |
|---|--------|------------|-------|
| 1 | Configurar ESLint/Prettier | 🟠 Alta | 2h |
| 2 | Remover prints DEBUG | 🔴 Crítico | 3h |
| 3 | Setup básico pytest | 🔴 Crítico | 4h |

### Fase 2: Segurança
**Objetivo:** Corrigir vulnerabilidades
**Duração:** 1 dia

| # | Tarefa | Prioridade | Horas |
|---|--------|------------|-------|
| 4 | Implementar hash de senhas | 🟠 Alta | 3h |
| 5 | Validar webhook signatures | 🟡 Média | 2h |

### Fase 3: Refatoração Estrutural
**Objetivo:** Melhorar manutenibilidade
**Duração:** 3-4 dias

| # | Tarefa | Prioridade | Horas |
|---|--------|------------|-------|
| 6 | Separar main.py em routers | 🔴 Crítico | 20h |
| 7 | Criar função helper de upload | 🟡 Média | 3h |
| 8 | Melhorar error handling | 🟠 Alta | 5h |

### Fase 4: Type Safety
**Objetivo:** Melhorar qualidade do código
**Duração:** 1-2 dias

| # | Tarefa | Prioridade | Horas |
|---|--------|------------|-------|
| 9 | Tipar api.ts (remover any) | 🟠 Alta | 5h |
| 10 | Resolver TODOs do frontend | 🟠 Alta | 3h |

### Fase 5: DevOps
**Objetivo:** Automatizar processos
**Duração:** 1 dia

| # | Tarefa | Prioridade | Horas |
|---|--------|------------|-------|
| 11 | Configurar CI/CD | 🟡 Média | 4h |
| 12 | Remover URLs hardcoded | 🟡 Média | 2h |

---

## Quick Wins (Podem ser feitos imediatamente)

1. **Remover prints DEBUG** - 3h, impacto imediato em logs
2. **Configurar ESLint** - 2h, melhora qualidade futura
3. **Hash de senhas** - 3h, segurança crítica

---

## Dependências entre Tarefas

```
[ESLint/Prettier] ──┐
                    ├──▶ [Tipar api.ts]
[Remover DEBUG] ────┤
                    ├──▶ [Separar main.py em routers]
[Setup pytest] ─────┘         │
                              ▼
                    [Melhorar error handling]
                              │
                              ▼
                    [Configurar CI/CD]
```

---

## Conclusão

O projeto está funcional mas acumulou débito técnico significativo no `main.py`. A recomendação é:

1. **Antes de novas features:** Fazer a Fase 1 (preparação)
2. **Se for mexer em auth:** Fazer a Fase 2 (segurança)
3. **Se for adicionar muitos endpoints:** Fazer a Fase 3 (refatoração)

O investimento de ~50h agora evitará problemas exponenciais no futuro.

---

— Atlas, investigando a verdade 🔎
