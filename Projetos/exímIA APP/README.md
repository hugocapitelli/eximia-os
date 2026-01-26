# ExímIA APP

> Sistema integrado de IA para empreendedores — Estratégia, Execução, Aprendizado e Marca em harmonia.

**Status:** Em Desenvolvimento (MVP)
**Versão:** 0.1.0
**Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS + Supabase

---

## Visão Geral

O ExímIA APP é uma plataforma all-in-one que dissolve a fragmentação entre ferramentas desconectadas. Em vez de usar múltiplas plataformas isoladas, oferecemos um **sistema nervoso central** onde:

- **Strategy** (Planejamento) alimenta
- **Journey** (Execução) que alimenta
- **Academy** (Aprendizado) que retroalimenta
- **Brand** (Identidade) que permeia tudo

Tudo conectado através da **Connection Layer** — o coração invisível que faz o sistema inteligente.

---

## Estrutura do Projeto

```
exímIA APP/
├── app/                          ← Next.js 16 (Frontend)
│   ├── src/
│   │   ├── components/           ← React components reutilizáveis
│   │   ├── pages/                ← Next.js pages (routing)
│   │   ├── lib/                  ← Utilitários e helpers
│   │   └── styles/               ← Tailwind config
│   ├── public/                   ← Assets estáticos
│   ├── package.json
│   └── Dockerfile                ← Container para produção
│
├── 00_Core/                      ← Fundação arquitetural
│   ├── PRD-Design-System-v5.0.md
│   ├── PRD-Connection-Layer-v5.0.md  ⭐ ESSENCIAL
│   ├── PRD-API-Endpoints-v5.0.md
│   └── PRD-Synthetic-Minds-Library-v1.0.md
│
├── 01_Journey/                   ← Execução pessoal
│   └── PRD-Journey-v5.0.md
│
├── 02_Academy/                   ← Aprendizado Socrático
│   └── PRD-Academy-v5.1.md       ⭐ ESTRATÉGICO
│
├── 03_Brand/                     ← Gestão de marca
│   └── PRD-Brand-v5.0.md
│
├── 04_Strategy/                  ← Planejamento estratégico
│   └── PRD-Strategy-v5.0.md
│
├── 05_PrototypOS/                ← Design e prototipagem
│   ├── PRD-PrototypOS-v5.0.md
│   └── PRD-Design-Systems-Library-v1.0.md
│
├── 06_Inbox/                     ← Captura universal
│   └── PRD-Inbox-v5.0.md
│
├── 07_Course_Designer/           ← X_Agent especializado
│   └── PRD-Course-Designer-v1.0.md
│
├── 08_Finance/                   ← Módulo financeiro (futuro)
│   └── PRD-Finance-v1.0.md
│
├── 99_Analysis/                  ← Análises e reviews
│   ├── PRD-Critical-Analysis-v5.0.md
│   ├── PRD-Metrics-v5.0.md
│   └── PRD-Personal-Metrics-v1.0.md
│
├── MANIFESTO.md                  ← Visão e filosofia
├── PRD-Master-Index-v5.0.md      ← Índice e navegação
└── PRD-ExímIA-OS.md              ← PRD original (referência)
```

---

## Quick Start

### 1. Setup Local

```bash
# Clonar e entrar na branch
cd "Projetos/exímIA APP"
git checkout project/eximia-app

# Instalar dependências do app
cd app
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais Supabase
```

### 2. Desenvolvimento

```bash
# Iniciar dev server
npm run dev

# Abrir navegador
# → http://localhost:3000
```

### 3. Type Checking & Linting

```bash
# Verificar tipos
npm run typecheck

# Lint
npm run lint
```

### 4. Build & Deploy

```bash
# Build
npm run build

# Testar production build
npm start
```

---

## Arquitetura

### Frontend Stack

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| Next.js | 16.1.4 | Framework React (App Router) |
| React | 19.2.3 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first CSS |
| Supabase | 2.93.1 | Auth + Database |

### Estrutura de Componentes

```
src/
├── components/
│   ├── ui/                       ← Componentes base (Button, Input, etc.)
│   ├── layouts/                  ← Layouts (Header, Sidebar, etc.)
│   ├── modules/
│   │   ├── Strategy/             ← Módulo de Estratégia
│   │   ├── Journey/              ← Módulo de Execução
│   │   ├── Academy/              ← Módulo de Aprendizado
│   │   ├── Brand/                ← Módulo de Marca
│   │   └── PrototypOS/           ← Módulo de Prototipagem
│   └── ...
│
├── pages/
│   ├── index.tsx                 ← Home
│   ├── strategy/
│   ├── journey/
│   ├── academy/
│   ├── brand/
│   └── prototypos/
│
├── lib/
│   ├── api.ts                    ← Chamadas à API
│   ├── supabase.ts               ← Cliente Supabase
│   ├── hooks/                    ← Hooks customizados
│   └── utils/                    ← Utilitários
│
└── styles/
    └── globals.css               ← Estilos globais
```

---

## Fluxo de Trabalho

### 1. Ler PRDs (Documentação)

Comece pela **hierarquia de dependências** em `PRD-Master-Index-v5.0.md`:

```
Camada 1: Fundação
├─ MANIFESTO.md (visão)
├─ PRD-Design-System-v5.0.md (UI)
├─ PRD-Connection-Layer-v5.0.md (⭐ coração)
└─ PRD-Synthetic-Minds-Library-v1.0.md (clones)

Camada 2: Módulos Core
├─ PRD-Journey-v5.0.md
├─ PRD-Academy-v5.1.md (⭐ estratégico)
└─ PRD-Strategy-v5.0.md

Camada 3: Complementares
├─ PRD-Brand-v5.0.md
├─ PRD-PrototypOS-v5.0.md
└─ PRD-Inbox-v5.0.md
```

### 2. Implementação

```bash
# Criar componente novo
# → Consultar PRD relevante
# → Criar em src/components/{Módulo}/
# → Usar Design System tokens

# Adicionar funcionalidade
# → Implementar em componentes
# → Conectar com API (Connection Layer)
# → Testar com outros módulos

# Fazer commit
git add .
git commit -m "feat: [módulo] descrição concisa"
```

### 3. Testing & Review

```bash
# Rodar testes
npm test

# Type check
npm run typecheck

# Lint check
npm run lint

# Build check
npm run build
```

---

## Design System

O ExímIA APP segue os princípios do **Atomic Design**:

| Nível | Componentes | Exemplo |
|-------|-----------|---------|
| **Atoms** | Base UI | Button, Input, Label, Icon |
| **Molecules** | Compostos simples | FormGroup, Card, Alert |
| **Organisms** | Compostos complexos | NavigationBar, Hero, Modal |
| **Templates** | Layouts | DashboardLayout, PageLayout |
| **Pages** | Páginas completas | Strategy Page, Journey Page |

### Tokens Tailwind

```typescript
// Cores
primary: "#FF6B6B"       // Vermelho quente
secondary: "#4ECDC4"     // Turquesa
accent: "#FFE66D"        // Amarelo
neutral: "#2C3E50"       // Cinza-escuro

// Espaçamento
xs: "0.25rem"
sm: "0.5rem"
md: "1rem"
lg: "1.5rem"
xl: "2rem"
```

---

## Connection Layer

O **coração do sistema**. Implementa:

1. **Event Bus** — Toda ação gera evento
2. **Entity Links** — Conexões bidirecionais entre módulos
3. **Suggestion Engine** — IA proativa
4. **Cascading Rules** — Automações inteligentes
5. **Inbox Universal** — Captura rápida
6. **Notifications** — Sistema proativo

**Exemplo de fluxo:**
```
Strategy: Criar iniciativa "Lançar MVP"
    ↓ (evento)
Journey: Goal "Lançar MVP" criado automaticamente
    ↓ (sugestão)
Academy: "Encontramos curso de Product Management"
    ↓ (link bidirecional)
Brand: Tom de voz aplicado ao PRD gerado
```

---

## Variáveis de Ambiente

Criar `.env.local` na pasta `app/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API Backend (opcional)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Feature flags (opcional)
NEXT_PUBLIC_ENABLE_ACADEMY=true
NEXT_PUBLIC_ENABLE_STRATEGY=true
NEXT_PUBLIC_ENABLE_BRAND=true
```

---

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia dev server

# Build
npm run build           # Build para produção
npm start               # Inicia prod server

# Qualidade
npm run lint            # ESLint check
npm run typecheck       # TypeScript check (se configurado)
npm test                # Jest tests (se configurado)

# Deploy
npm run docker:build    # Build Docker image
```

---

## Convenções de Código

### 1. **Componentes React**

```typescript
// ✅ Bom
const StrategyCard: React.FC<StrategyCardProps> = ({ title, content }) => {
  return <div className="p-4 bg-white rounded-lg">{content}</div>
}

// ❌ Ruim
const card = () => {
  return <div>{content}</div>
}
```

### 2. **Nomes de Arquivos**

```
✅ StrategyForm.tsx       (PascalCase para componentes)
✅ useStrategy.ts         (camelCase para hooks)
✅ strategy-utils.ts      (kebab-case para utils)
❌ strategy_form.tsx      (snake_case)
❌ StrategyUtils.ts       (PascalCase para utils)
```

### 3. **Imports**

```typescript
// ✅ Organizado
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { Button } from '@/components/ui'
import { StrategyForm } from '@/components/modules/Strategy'
import { fetchStrategy } from '@/lib/api'

// ❌ Desorganizado
import { fetchStrategy } from '@/lib/api'
import Link from 'next/link'
import { Button } from '@/components/ui'
```

---

## Commits

Use **conventional commits**:

```bash
# Feature
git commit -m "feat: add Strategy module dashboard"

# Fix
git commit -m "fix: resolve Journey sync bug [#123]"

# Docs
git commit -m "docs: update README for Academy module"

# Chore
git commit -m "chore: update dependencies"

# Refactor
git commit -m "refactor: optimize Connection Layer event bus"
```

---

## Deployment

### Vercel (Recomendado)

```bash
# 1. Push branch
git push -u origin project/eximia-app

# 2. Criar PR
gh pr create --title "ExímIA APP: Module Implementation"

# 3. Merge em main
# (após aprovação)

# 4. Vercel deploya automaticamente
```

### Docker

```bash
# Build
docker build -t eximia-app:0.1.0 .

# Run
docker run -p 3000:3000 -e NEXT_PUBLIC_SUPABASE_URL=... eximia-app:0.1.0
```

---

## Próximos Passos

### MVP (Fase 1)
- [ ] Design System UI components
- [ ] Connection Layer event bus
- [ ] Strategy module (draft → cascade)
- [ ] Journey module (goals + habits)
- [ ] Academy module (IA Socrática MVP)

### Fase 2
- [ ] Brand module
- [ ] PrototypOS module
- [ ] Inbox universal
- [ ] Clone library integration

### Fase 3
- [ ] Finance module
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

---

## Recursos

- 📚 [MANIFESTO.md](./MANIFESTO.md) — Visão e filosofia
- 📋 [PRD Master Index](./PRD-Master-Index-v5.0.md) — Navegação completa
- 🏗️ [Connection Layer](./00_Core/PRD-Connection-Layer-v5.0.md) — Arquitetura central
- 🎓 [Academy PRD](./02_Academy/PRD-Academy-v5.1.md) — Pilar estratégico
- 📊 [Métricas](./99_Analysis/PRD-Metrics-v5.0.md) — KPIs de sucesso

---

## Time

- **Product Owner:** Hugo Capitelli
- **Company:** ExímIA Ventures
- **GitHub:** [eximIA.OS](https://github.com/eximia/eximia-os)

---

## Licença

Proprietary — ExímIA Ventures 2026

---

*Por empreendedores. Para empreendedores.*
*Da fragmentação à inteligência.*

**Última atualização:** 26 Janeiro 2026
