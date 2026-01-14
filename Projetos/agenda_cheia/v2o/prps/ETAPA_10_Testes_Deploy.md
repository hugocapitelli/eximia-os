# PRP - ETAPA 10: Testes & Deploy
## Agenda Cheia - Product Requirement Prompt

**Data:** 2026-01-08
**Prioridade:** P0 | **Estimativa:** 1 sprint

---

## 🎯 Objetivo

Implementar estratégia completa de testes e deploy:
- Testes unitários (backend + frontend)
- Testes de integração
- Testes E2E (end-to-end)
- CI/CD automatizado
- Staging environment
- Deploy zero-downtime
- Rollback strategy

---

## 🧪 Estratégia de Testes

### Pirâmide de Testes

```
        ╱╲
       ╱E2E╲         10% - Testes E2E (Playwright)
      ╱────╲
     ╱ Integ╲        30% - Testes de Integração
    ╱────────╲
   ╱  Unit    ╲      60% - Testes Unitários (Jest)
  ╱────────────╲
```

**Meta de Cobertura:** >80%

---

## 1. Testes Unitários (Jest)

### Backend (NestJS)

```typescript
// recalls.service.spec.ts
describe('RecallsService', () => {
  let service: RecallsService;
  let clientsRepo: MockType<Repository<Client>>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RecallsService,
        {
          provide: getRepositoryToken(Client),
          useFactory: mockRepository,
        },
      ],
    }).compile();

    service = module.get(RecallsService);
    clientsRepo = module.get(getRepositoryToken(Client));
  });

  describe('identifyRecallCandidates', () => {
    it('should identify clients D-2 from ideal return date', async () => {
      const mockClients = [
        { id: '1', lastVisitDate: subDays(new Date(), 19), serviceCycleDays: 21 },
      ];
      clientsRepo.find.mockResolvedValue(mockClients);

      const candidates = await service.identifyRecallCandidates();

      expect(candidates).toHaveLength(1);
      expect(candidates[0].id).toBe('1');
    });

    it('should skip opted-out clients', async () => {
      const mockClients = [
        { id: '2', optedOut: true, lastVisitDate: subDays(new Date(), 19) },
      ];
      clientsRepo.find.mockResolvedValue(mockClients);

      const candidates = await service.identifyRecallCandidates();

      expect(candidates).toHaveLength(0);
    });

    it('should skip clients without consent', async () => {
      const mockClients = [
        { id: '3', consentWhatsapp: false, lastVisitDate: subDays(new Date(), 19) },
      ];
      clientsRepo.find.mockResolvedValue(mockClients);

      const candidates = await service.identifyRecallCandidates();

      expect(candidates).toHaveLength(0);
    });
  });

  describe('calculatePriorityScore', () => {
    it('should prioritize high-value clients', () => {
      const client = {
        totalSpent: 5000,
        visitCount: 50,
        recallAttempts: 0,
      } as Client;

      const score = service.calculatePriorityScore(client);

      expect(score).toBeGreaterThan(600); // High score
    });
  });
});
```

### Frontend (React)

```typescript
// ClientList.test.tsx
describe('ClientList', () => {
  it('renders client list correctly', () => {
    const mockClients = [
      { id: '1', name: 'Maria Silva', phone: '11999998888', status: 'active' },
      { id: '2', name: 'João Santos', phone: '11988887777', status: 'at_risk' },
    ];

    render(<ClientList clients={mockClients} />);

    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('João Santos')).toBeInTheDocument();
  });

  it('filters clients by search term', async () => {
    const mockClients = [
      { id: '1', name: 'Maria Silva', phone: '11999998888' },
      { id: '2', name: 'João Santos', phone: '11988887777' },
    ];

    render(<ClientList clients={mockClients} />);

    const searchInput = screen.getByPlaceholderText('Buscar...');
    await userEvent.type(searchInput, 'Maria');

    expect(screen.getByText('Maria Silva')).toBeVisible();
    expect(screen.queryByText('João Santos')).not.toBeInTheDocument();
  });

  it('displays empty state when no clients', () => {
    render(<ClientList clients={[]} />);

    expect(screen.getByText(/nenhum cliente encontrado/i)).toBeInTheDocument();
  });
});
```

---

## 2. Testes de Integração

```typescript
// recalls.integration.spec.ts
describe('Recalls Integration', () => {
  let app: INestApplication;
  let tenantId: string;
  let clientId: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Setup test tenant and client
    const tenant = await createTestTenant();
    const client = await createTestClient(tenant.id);
    tenantId = tenant.id;
    clientId = client.id;
  });

  afterAll(async () => {
    await cleanupTestData();
    await app.close();
  });

  it('should create and send recall for eligible client', async () => {
    // Arrange: Client with last visit 19 days ago (cycle 21)
    await updateClient(clientId, {
      lastVisitDate: subDays(new Date(), 19),
      serviceCycleDays: 21,
      consentWhatsapp: true,
      optedOut: false,
    });

    // Act: Run recall job
    const response = await request(app.getHttpServer())
      .post('/recalls/run-daily-job')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Assert: Recall created and sent
    const recalls = await getRecallsByClient(clientId);
    expect(recalls).toHaveLength(1);
    expect(recalls[0].status).toBe('sent');
    expect(recalls[0].attemptNumber).toBe(1);
  });

  it('should handle webhook and update message status', async () => {
    // Arrange: Existing recall
    const recall = await createTestRecall(clientId);

    // Act: Simulate Z-API webhook
    await request(app.getHttpServer())
      .post('/webhooks/zapi')
      .set('X-API-Key', process.env.WEBHOOK_SECRET)
      .send({
        event: 'MESSAGE_STATUS_UPDATE',
        data: {
          messageId: recall.whatsappMessageId,
          status: 'read',
          timestamp: Date.now(),
        },
      })
      .expect(200);

    // Assert: Status updated
    const updatedRecall = await getRecall(recall.id);
    expect(updatedRecall.status).toBe('read');
  });
});
```

---

## 3. Testes E2E (Playwright)

```typescript
// onboarding.e2e.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Onboarding Flow', () => {
  test('should complete onboarding successfully', async ({ page }) => {
    // Tela 1: Bem-vindo
    await page.goto('/onboarding');
    await expect(page.locator('h1')).toContainText('Agenda Cheia');
    await page.click('button:has-text("Começar Grátis")');

    // Tela 2: Dados Básicos
    await page.fill('input[name="salonName"]', 'Salão Teste E2E');
    await page.fill('input[name="ownerName"]', 'João Teste');
    await page.fill('input[name="phone"]', '11999999999');
    await page.fill('input[name="email"]', 'teste@email.com');
    await page.click('button:has-text("Continuar")');

    // Tela 3: Consentimento LGPD
    await page.check('input[name="termsAccepted"]');
    await page.check('input[name="riskAccepted"]');
    await page.check('input[name="lgpdConsent"]');
    await page.check('input[name="secondaryNumberAwareness"]');
    await page.click('button:has-text("Aceitar Todos e Continuar")');

    // Tela 4: Conectar WhatsApp (skip)
    await page.click('button:has-text("Pular por Enquanto")');

    // Tela 5: Importar Clientes (skip)
    await page.click('button:has-text("Continuar Sem Clientes")');

    // Tela 6: Configurar Ciclos (defaults)
    await page.click('button:has-text("Continuar")');

    // Tela 7: Tudo Pronto
    await expect(page.locator('h1')).toContainText('Tudo Pronto');
    await page.click('button:has-text("Sim, Ativar Recalls")');

    // Assert: Redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome-banner"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/onboarding');
    await page.click('button:has-text("Começar Grátis")');

    // Try to continue without filling fields
    await page.click('button:has-text("Continuar")');

    // Assert: Error messages
    await expect(page.locator('text=Campo obrigatório')).toHaveCount(3);
  });
});
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: cd backend && pnpm install

      - name: Lint
        run: cd backend && pnpm lint

      - name: Type check
        run: cd backend && pnpm tsc --noEmit

      - name: Unit tests
        run: cd backend && pnpm test:unit --coverage

      - name: Integration tests
        run: cd backend && pnpm test:integration

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: cd frontend && pnpm install

      - name: Lint
        run: cd frontend && pnpm lint

      - name: Type check
        run: cd frontend && pnpm tsc --noEmit

      - name: Unit tests
        run: cd frontend && pnpm test --coverage

      - name: Build
        run: cd frontend && pnpm build

  e2e-tests:
    runs-on: ubuntu-latest
    needs: [test-backend, test-frontend]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright
        run: pnpm playwright install --with-deps

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/

  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    needs: [test-backend, test-frontend, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          scope: staging

  deploy-production:
    if: github.ref == 'refs/heads/main'
    needs: [test-backend, test-frontend, e2e-tests]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 🌍 Environments

### 1. Development (Local)
- `localhost:3000` (backend)
- `localhost:5173` (frontend)
- Database: Local Supabase ou remoto dev

### 2. Staging
- `api-staging.agendacheia.com`
- `app-staging.agendacheia.com`
- Database: Supabase Staging
- Deploy automático: `develop` branch

### 3. Production
- `api.agendacheia.com`
- `app.agendacheia.com`
- Database: Supabase Production
- Deploy automático: `main` branch

---

## 🔄 Rollback Strategy

```bash
# Vercel permite rollback via CLI
vercel rollback <deployment-url>

# Ou via interface web:
# 1. Acesse Vercel Dashboard
# 2. Selecione deployment anterior
# 3. Click "Promote to Production"

# Database rollback (Supabase)
# 1. Backup automático diário
# 2. Restore via Supabase Dashboard
# 3. Re-run migrations se necessário
```

---

## ✅ Critérios de Aceite

### Testes
- [ ] Cobertura >80% backend
- [ ] Cobertura >70% frontend
- [ ] Todos testes unitários passando
- [ ] Todos testes integração passando
- [ ] Todos testes E2E passando
- [ ] Performance tests (opcional)

### CI/CD
- [ ] Pipeline CI/CD configurado
- [ ] Deploy automático staging (develop)
- [ ] Deploy automático production (main)
- [ ] Smoke tests após deploy
- [ ] Rollback testado e documentado

### Monitoring
- [ ] Sentry em produção
- [ ] Logs centralizados
- [ ] Uptime monitoring
- [ ] Alertas configurados

---

**Status:** ⏳ Aguardando
**Owner:** Tech Lead, QA Lead, DevOps
