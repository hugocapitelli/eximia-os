# Story HARVEN-009: Configurar CI/CD com GitHub Actions

**Story ID:** HARVEN-009
**Epic:** HARVEN-EPIC-001 (Technical Debt Cleanup)
**Prioridade:** Média
**Pontos:** 3
**Status:** Completed
**Depende de:** HARVEN-001 (ESLint), HARVEN-003 (Pytest)

---

## User Story

**Como** desenvolvedor do Harven.AI,
**Quero** que testes e validações rodem automaticamente em cada PR,
**Para que** bugs sejam detectados antes de ir para produção.

---

## Contexto

Atualmente:
- Nenhum workflow GitHub Actions
- Deploy manual para Coolify
- Testes não executados automaticamente
- Lint não verificado em PRs

---

## Acceptance Criteria

- [x] Workflow CI rodando em cada PR
- [x] Lint do frontend verificado
- [x] Typecheck do frontend verificado
- [x] Testes do backend rodando
- [x] Build do frontend verificado
- [x] Status checks obrigatórios no PR

---

## Technical Details

### Workflow CI

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # ================================
  # Frontend Checks
  # ================================
  frontend:
    name: Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: harven.ai-platform-mockup

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: harven.ai-platform-mockup/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: https://api.harven.eximiaventures.com.br

  # ================================
  # Backend Checks
  # ================================
  backend:
    name: Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend

    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'
          cache-dependency-path: backend/requirements*.txt

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run tests
        run: pytest --cov=. --cov-report=xml
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL_TEST }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY_TEST }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          file: backend/coverage.xml
          fail_ci_if_error: false

  # ================================
  # Docker Build Check
  # ================================
  docker:
    name: Docker Build
    runs-on: ubuntu-latest
    needs: [frontend, backend]

    steps:
      - uses: actions/checkout@v4

      - name: Build Backend Image
        run: docker build -t harven-backend:test ./backend

      - name: Build Frontend Image
        run: docker build -t harven-frontend:test ./harven.ai-platform-mockup
        env:
          VITE_API_URL: https://api.harven.eximiaventures.com.br
```

### Branch Protection Rules

Configurar no GitHub:
1. Settings > Branches > Add rule
2. Branch name pattern: `main`
3. Require status checks:
   - `Frontend`
   - `Backend`
   - `Docker Build`
4. Require PR reviews: 1

### Secrets Necessários

| Secret | Descrição |
|--------|-----------|
| `SUPABASE_URL_TEST` | URL do projeto Supabase de teste |
| `SUPABASE_KEY_TEST` | Key do projeto de teste |
| `OPENAI_API_KEY` | Key para testes de IA (opcional) |

---

## Tasks

- [ ] Criar `.github/workflows/ci.yml`
- [ ] Testar workflow em branch de feature
- [ ] Configurar secrets no GitHub
- [ ] Configurar branch protection rules
- [ ] Documentar processo no README
- [ ] Criar ambiente de teste no Supabase (opcional)

---

## Workflow CD (Opcional - Fase Futura)

```yaml
# .github/workflows/cd.yml (para depois)
name: CD

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Coolify
    runs-on: ubuntu-latest
    needs: [ci]

    steps:
      - name: Trigger Coolify Webhook
        run: |
          curl -X POST "${{ secrets.COOLIFY_WEBHOOK_URL }}"
```

---

## Definition of Done

- [ ] CI rodando em cada PR
- [ ] Todos os checks passando
- [ ] Branch protection configurada
- [ ] Documentação atualizada

---

## File List

| Arquivo | Ação |
|---------|------|
| `.github/workflows/ci.yml` | Criar |
| `README.md` | Atualizar |

---

## Notes

- Começar com CI simples, expandir depois
- Usar cache de npm/pip para velocidade
- Considerar matrix para múltiplas versões de Node/Python
- CD pode ser adicionado em story separada
