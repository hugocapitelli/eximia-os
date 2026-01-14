# PRP - ETAPA 1: Fundação & Infraestrutura
## Agenda Cheia - Product Requirement Prompt

**Data:** 2026-01-08
**Versão:** 1.0
**Prioridade:** P0 (Crítica - Bloqueador)
**Estimativa:** 2-3 sprints

---

## 🎯 Objetivo

Estabelecer a fundação técnica completa do projeto Agenda Cheia, incluindo setup de projeto, arquitetura de pastas, configurações de ambiente, database schema, migrations e pipeline CI/CD básico.

---

## 📊 Contexto

Esta é a primeira etapa do desenvolvimento do Agenda Cheia, uma solução SaaS que recupera receita perdida para salões de beleza através de recall automatizado via WhatsApp. A infraestrutura deve suportar:

- Multi-tenancy (isolamento de salões)
- Integração com WhatsApp Business API (Z-API)
- IA conversacional (GPT-4o mini)
- Compliance LGPD total
- Escalabilidade para 5.000+ salões

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológica

**Backend:**
- Framework: NestJS (TypeScript)
- Runtime: Node.js 20+ LTS
- Package Manager: pnpm
- Documentação API: Swagger/OpenAPI

**Frontend:**
- Framework: React 18+ (Vite)
- Linguagem: TypeScript
- State Management: Zustand + React Query
- UI Components: shadcn/ui + Tailwind CSS
- Form Management: React Hook Form + Zod

**Database:**
- Primary: Supabase PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage
- Realtime: Supabase Realtime (webhooks)

**Infraestrutura:**
- Hosting Backend: Vercel / Railway
- Hosting Frontend: Vercel
- CDN: Vercel Edge Network
- Monitoring: Sentry

---

## 📁 Estrutura de Pastas

### Backend (NestJS)

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/               # Autenticação e autorização
│   │   ├── tenants/            # Multi-tenancy
│   │   ├── users/              # Gestão de usuários
│   │   ├── clients/            # Gestão de clientes dos salões
│   │   ├── whatsapp/           # Integração Z-API
│   │   ├── recall/             # Engine de recall
│   │   ├── conversations/      # Bot conversacional
│   │   ├── analytics/          # Dashboard e métricas
│   │   └── compliance/         # LGPD e audit logs
│   ├── common/
│   │   ├── decorators/         # Custom decorators
│   │   ├── filters/            # Exception filters
│   │   ├── guards/             # Auth guards
│   │   ├── interceptors/       # Interceptors
│   │   ├── pipes/              # Validation pipes
│   │   └── utils/              # Utilities
│   ├── config/                 # Configurações (env, database, etc)
│   ├── database/
│   │   ├── migrations/         # Database migrations
│   │   ├── seeds/              # Seed data
│   │   └── entities/           # TypeORM entities (se usar)
│   ├── main.ts                 # Entry point
│   └── app.module.ts           # Root module
├── test/
│   ├── unit/                   # Testes unitários
│   ├── integration/            # Testes de integração
│   └── e2e/                    # Testes end-to-end
├── .env.example
├── .env.development
├── .env.production
├── nest-cli.json
├── tsconfig.json
└── package.json
```

### Frontend (React)

```
frontend/
├── src/
│   ├── app/                    # App routing (React Router)
│   ├── pages/
│   │   ├── auth/               # Login, signup
│   │   ├── onboarding/         # Onboarding (7 telas)
│   │   ├── dashboard/          # Dashboard principal
│   │   ├── conversations/      # Inbox de conversas
│   │   ├── clients/            # Gestão de clientes
│   │   ├── confirmations/      # Lazy Sync confirmações
│   │   └── settings/           # Configurações
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   ├── features/           # Feature-specific components
│   │   └── common/             # Shared components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/
│   │   ├── api/                # API client (axios/fetch)
│   │   ├── supabase/           # Supabase client
│   │   ├── utils/              # Utilities
│   │   └── validators/         # Zod schemas
│   ├── stores/                 # Zustand stores
│   ├── types/                  # TypeScript types
│   ├── styles/                 # Global styles
│   ├── main.tsx                # Entry point
│   └── App.tsx                 # Root component
├── public/
├── .env.example
├── .env.development
├── .env.production
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 🗄️ Database Schema (v1.0)

### Tabelas Principais

#### 1. tenants (Salões)
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id),
  plan VARCHAR(50) DEFAULT 'trial', -- trial, basic, pro
  trial_clients_recovered INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active', -- active, suspended, churned

  -- Compliance LGPD
  lgpd_consent BOOLEAN DEFAULT FALSE,
  lgpd_consent_date TIMESTAMP,
  dpa_signed BOOLEAN DEFAULT FALSE,
  dpa_signed_date TIMESTAMP,

  -- WhatsApp
  whatsapp_number VARCHAR(20),
  whatsapp_connected BOOLEAN DEFAULT FALSE,
  whatsapp_connection_id VARCHAR(255), -- Z-API instance ID
  whatsapp_quality_rating VARCHAR(20) DEFAULT 'green', -- green, yellow, red

  -- Billing
  stripe_customer_id VARCHAR(255),
  billing_email VARCHAR(255),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tenants_owner ON tenants(owner_id);
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
```

#### 2. users (Usuários do sistema)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,

  -- Auth (Supabase Auth)
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  auth_provider VARCHAR(50) DEFAULT 'whatsapp', -- whatsapp, email

  -- Profile
  full_name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'owner', -- owner, receptionist, professional

  -- Preferences
  language VARCHAR(10) DEFAULT 'pt-BR',
  timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',

  -- Timestamps
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
```

#### 3. clients (Clientes dos salões)
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Identificação
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),

  -- Histórico
  first_visit_date DATE,
  last_visit_date DATE,
  visit_count INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,

  -- Preferências
  preferred_professional VARCHAR(255),
  preferred_service VARCHAR(255),
  service_cycle_days INTEGER, -- ex: 21 dias para unha

  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, at_risk, churned, inactive

  -- Compliance LGPD
  consent_whatsapp BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMP,
  opted_out BOOLEAN DEFAULT FALSE,
  opted_out_date TIMESTAMP,
  opt_out_reason TEXT,

  -- Recall
  last_recall_sent_at TIMESTAMP,
  recall_attempts INTEGER DEFAULT 0,
  last_recall_response TEXT,

  -- Metadata
  notes TEXT,
  tags TEXT[], -- ex: ['vip', 'aniversariante']

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP,

  -- Unique constraint
  UNIQUE(tenant_id, phone)
);

-- Indexes
CREATE INDEX idx_clients_tenant ON clients(tenant_id);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_last_visit ON clients(last_visit_date);
CREATE INDEX idx_clients_opted_out ON clients(opted_out) WHERE opted_out = TRUE;
```

#### 4. conversations (Conversas WhatsApp)
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- Identificação
  whatsapp_chat_id VARCHAR(255), -- ID do chat no WhatsApp

  -- Status
  status VARCHAR(50) DEFAULT 'active', -- active, completed, escalated, opted_out

  -- Intent/Contexto
  intent VARCHAR(100), -- recall_maintenance, reactivation, no_show_prevention
  current_state VARCHAR(100), -- aguardando_resposta, negociando, confirmando, etc

  -- Controle
  bot_enabled BOOLEAN DEFAULT TRUE,
  human_took_over BOOLEAN DEFAULT FALSE,
  human_took_over_at TIMESTAMP,
  escalation_reason TEXT,

  -- Métricas
  message_count INTEGER DEFAULT 0,
  bot_message_count INTEGER DEFAULT 0,
  user_message_count INTEGER DEFAULT 0,

  -- Resultado
  outcome VARCHAR(100), -- scheduled, declined, no_response, escalated
  scheduled_date TIMESTAMP,
  scheduled_service VARCHAR(255),
  scheduled_professional VARCHAR(255),

  -- Timestamps
  first_message_at TIMESTAMP,
  last_message_at TIMESTAMP,
  closed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX idx_conversations_client ON conversations(client_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_chat_id ON conversations(whatsapp_chat_id);
```

#### 5. messages (Mensagens das conversas)
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Identificação
  whatsapp_message_id VARCHAR(255), -- ID da mensagem no WhatsApp

  -- Conteúdo
  direction VARCHAR(10) NOT NULL, -- inbound, outbound
  sender VARCHAR(50) NOT NULL, -- bot, human, client
  content_type VARCHAR(50) DEFAULT 'text', -- text, image, audio, document
  content TEXT NOT NULL,

  -- Status (para outbound)
  status VARCHAR(50), -- sent, delivered, read, failed
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,

  -- IA (para bot messages)
  gpt_model VARCHAR(50),
  gpt_prompt_tokens INTEGER,
  gpt_completion_tokens INTEGER,
  gpt_cost DECIMAL(10,6),

  -- Timestamps
  sent_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_whatsapp_id ON messages(whatsapp_message_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at DESC);
```

#### 6. recalls (Recalls enviados)
```sql
CREATE TABLE recalls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),

  -- Tipo
  type VARCHAR(50) NOT NULL, -- maintenance, reactivation, no_show_prevention

  -- Tentativa
  attempt_number INTEGER DEFAULT 1, -- 1, 2, 3
  max_attempts INTEGER DEFAULT 3,

  -- Template usado
  template_variant VARCHAR(10), -- A, B, C
  message_sent TEXT,

  -- Timing
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, sent, delivered, read, responded, failed

  -- Resposta
  response_received BOOLEAN DEFAULT FALSE,
  response_received_at TIMESTAMP,
  response_intent VARCHAR(100), -- agendar, recusar, mais_tarde, duvida, opt_out

  -- Resultado
  outcome VARCHAR(100), -- scheduled, declined, no_response, failed
  revenue_recovered DECIMAL(10,2),

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_recalls_tenant ON recalls(tenant_id);
CREATE INDEX idx_recalls_client ON recalls(client_id);
CREATE INDEX idx_recalls_status ON recalls(status);
CREATE INDEX idx_recalls_scheduled ON recalls(scheduled_for);
```

#### 7. confirmations (Lazy Sync - Confirmações pendentes)
```sql
CREATE TABLE confirmations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id),

  -- Agendamento proposto
  proposed_date TIMESTAMP NOT NULL,
  proposed_service VARCHAR(255) NOT NULL,
  proposed_professional VARCHAR(255),

  -- Status
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, denied, timeout

  -- Resposta
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMP,
  response_via VARCHAR(50), -- whatsapp, dashboard
  denial_reason TEXT,

  -- Timeout
  timeout_at TIMESTAMP, -- 30 minutos após criação

  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_confirmations_tenant ON confirmations(tenant_id);
CREATE INDEX idx_confirmations_status ON confirmations(status);
CREATE INDEX idx_confirmations_timeout ON confirmations(timeout_at) WHERE status = 'pending';
```

#### 8. audit_logs (Logs de auditoria LGPD)
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- Ator
  user_id UUID REFERENCES users(id),
  actor_type VARCHAR(50), -- user, system, bot

  -- Ação
  action VARCHAR(100) NOT NULL, -- client_imported, message_sent, opt_out, data_exported
  resource_type VARCHAR(100) NOT NULL, -- client, conversation, message
  resource_id UUID,

  -- Detalhes
  description TEXT,
  metadata JSONB,

  -- Compliance
  ip_address INET,
  user_agent TEXT,

  -- Timestamp
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
```

---

## ⚙️ Configurações

### Variáveis de Ambiente

**Backend (.env)**
```bash
# Node
NODE_ENV=development
PORT=3000

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agenda_cheia

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Z-API (WhatsApp)
ZAPI_URL=https://api.z-api.io
ZAPI_INSTANCE_ID=your-instance-id
ZAPI_TOKEN=your-token

# OpenAI (GPT-4o mini)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Stripe (Billing)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Sentry (Monitoring)
SENTRY_DSN=https://...

# Rate Limiting
RECALL_RATE_LIMIT_PER_MIN=10
RECALL_RATE_LIMIT_PER_DAY=50
```

**Frontend (.env)**
```bash
# API
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=30000

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Sentry
VITE_SENTRY_DSN=https://...

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LAZY_SYNC=true
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions Workflows

**1. Backend CI/CD (.github/workflows/backend.yml)**
```yaml
name: Backend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: cd backend && pnpm install

      - name: Lint
        run: cd backend && pnpm lint

      - name: Type check
        run: cd backend && pnpm tsc --noEmit

      - name: Unit tests
        run: cd backend && pnpm test:unit

      - name: E2E tests
        run: cd backend && pnpm test:e2e

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./backend
```

**2. Frontend CI/CD (.github/workflows/frontend.yml)**
```yaml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'frontend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: cd frontend && pnpm install

      - name: Lint
        run: cd frontend && pnpm lint

      - name: Type check
        run: cd frontend && pnpm tsc --noEmit

      - name: Build
        run: cd frontend && pnpm build

      - name: Test
        run: cd frontend && pnpm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID_FRONTEND }}
          working-directory: ./frontend
```

---

## ✅ Critérios de Aceite

### Setup Projeto
- [ ] Repositório Git inicializado com estrutura de pastas
- [ ] Backend NestJS rodando em localhost:3000
- [ ] Frontend React rodando em localhost:5173
- [ ] Supabase conectado e funcionando
- [ ] .env.example criados em ambos projetos
- [ ] README com instruções de setup

### Database
- [ ] Schema v1.0 aplicado no Supabase
- [ ] Migrations executando sem erros
- [ ] Seeds básicos funcionando
- [ ] Row Level Security (RLS) configurado para multi-tenancy
- [ ] Indexes criados e validados

### CI/CD
- [ ] GitHub Actions configurado
- [ ] Pipeline executando tests em PRs
- [ ] Deploy automático na main
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Monitoring Sentry configurado

### Documentação
- [ ] README com quick start
- [ ] CONTRIBUTING.md com guidelines
- [ ] API documentada com Swagger
- [ ] Schema ER diagram exportado

---

## 📚 Referências

- NestJS Documentation: https://docs.nestjs.com/
- Supabase Documentation: https://supabase.com/docs
- React + Vite: https://vitejs.dev/guide/
- shadcn/ui: https://ui.shadcn.com/
- Vercel Deployment: https://vercel.com/docs

---

## 🔗 Dependências

- **Bloqueadores:** Nenhum (primeira etapa)
- **Depende de:** Nenhum
- **Bloqueia:** Todas as outras etapas

---

## 📝 Notas Técnicas

1. **Multi-tenancy:** Usar Row Level Security (RLS) do Supabase para isolamento
2. **Migrations:** Usar Supabase CLI para versionar schema
3. **TypeScript:** Strict mode habilitado em ambos projetos
4. **Monorepo:** Considerar usar Turborepo se necessário no futuro
5. **Testes:** Jest + Testing Library no frontend, Jest + Supertest no backend

---

**Status:** ⏳ Aguardando Implementação
**Owner:** Tech Lead
**Revisores:** CTO, Backend Lead, Frontend Lead
