# Relatório Completo: Sistema de Arquivos para Desenvolvedores React/Next.js

## Módulo de Aprendizagem: Estrutura de Pastas, Imports, Exports e Organização de Projetos

---

## 1. Tipos de Arquivos e Extensões

### 1.1 Arquivos JavaScript/TypeScript

| Extensão | Descrição |
|----------|-----------|
| `.js` | Arquivo JavaScript padrão para lógica e componentes |
| `.jsx` | JavaScript com suporte a sintaxe JSX (React) |
| `.ts` | Arquivo TypeScript para código tipado |
| `.tsx` | TypeScript com suporte a sintaxe JSX (React + TypeScript) |
| `.mjs` | Módulo ES (ECMAScript Module) explícito |
| `.cjs` | Módulo CommonJS explícito |

### 1.2 Arquivos de Estilo

| Extensão | Descrição |
|----------|-----------|
| `.css` | Folha de estilos CSS padrão |
| `.scss` / `.sass` | CSS com pré-processador Sass (variáveis, mixins, aninhamento) |
| `.module.css` | CSS Modules - estilos com escopo local por componente |
| `.module.scss` | Sass Modules - combinação de Sass com CSS Modules |

### 1.3 Arquivos de Dados e Configuração

| Extensão | Descrição |
|----------|-----------|
| `.json` | Formato de dados JavaScript Object Notation |
| `.yaml` / `.yml` | Formato de dados YAML (configurações, dados estruturados) |
| `.md` | Markdown para documentação |
| `.mdx` | Markdown com suporte a componentes JSX (documentação interativa) |

### 1.4 Arquivos de Ambiente e Git

| Extensão | Descrição |
|----------|-----------|
| `.env` | Variáveis de ambiente (chaves de API, configurações) |
| `.env.local` | Variáveis locais (sobrescreve `.env`, não commitado) |
| `.env.development` | Variáveis específicas para desenvolvimento |
| `.env.production` | Variáveis específicas para produção |
| `.env.test` | Variáveis para ambiente de testes |
| `.gitignore` | Lista de arquivos/pastas ignorados pelo Git |

### 1.5 Arquivos de Configuração de Build

| Extensão | Descrição |
|----------|-----------|
| `.babelrc` / `babel.config.js` | Configuração do Babel (transpilação) |
| `.eslintrc.js` / `eslint.config.js` | Configuração do ESLint (linting) |
| `.prettierrc` / `prettier.config.js` | Configuração do Prettier (formatação) |

---

## 2. Padrões de Import/Export

### 2.1 Named Exports (Exports Nomeados)

```typescript
// Definição (utils.ts)
export const formatDate = (date: Date) => { /* ... */ };
export const formatCurrency = (value: number) => { /* ... */ };

// Uso
import { formatDate, formatCurrency } from './utils';
```

**Vantagens:**
- Clareza sobre o que está sendo exportado
- Melhor suporte de autocompleção em IDEs
- Facilita refatoração e renomeação
- Permite importar apenas o necessário

### 2.2 Default Exports (Exports Padrão)

```typescript
// Definição (Button.tsx)
const Button = () => { /* ... */ };
export default Button;

// Uso
import Button from './Button';
import MeuBotao from './Button'; // Pode renomear na importação
```

**Quando usar:**
- Um componente principal por arquivo
- Arquivo nomeado igual ao componente exportado

### 2.3 Re-exports (Barrel Files)

```typescript
// components/index.ts (barrel file)
export { Button } from './Button';
export { Input } from './Input';
export { Modal } from './Modal';
export * from './forms'; // Re-exporta tudo de forms

// Uso simplificado
import { Button, Input, Modal } from '@/components';
```

**Benefícios:**
- Importações mais limpas e organizadas
- Encapsula estrutura interna da pasta
- Facilita refatoração sem quebrar imports

### 2.4 Dynamic Imports (Imports Dinâmicos)

```typescript
// Import dinâmico com ES2020
const module = await import('./heavyModule');

// Com React.lazy()
const LazyComponent = React.lazy(() => import('./HeavyComponent'));

// Uso com Suspense
<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

**Casos de uso:**
- Code splitting (divisão de código)
- Carregamento sob demanda
- Redução do bundle inicial

### 2.5 Lazy Loading (Carregamento Preguiçoso)

```typescript
// Next.js dynamic import
import dynamic from 'next/dynamic';

const DynamicChart = dynamic(() => import('./Chart'), {
  loading: () => <p>Carregando gráfico...</p>,
  ssr: false // Desabilita renderização no servidor
});
```

**Candidatos ideais para lazy loading:**
- Componentes grandes com muito código
- Componentes condicionais (modais, dropdowns)
- Funcionalidades secundárias ou não essenciais

### 2.6 Tree Shaking (Eliminação de Código Morto)

Tree shaking é o processo de eliminar código não utilizado do bundle final.

**Requisitos:**
- Usar ES Modules (import/export), não CommonJS
- Configurar `sideEffects: false` no `package.json`
- Evitar imports "estrela" desnecessários (`import *`)

```json
// package.json
{
  "sideEffects": false
}
```

**Por que ES Modules são necessários:**
- Imports são estáticos e analisáveis em tempo de compilação
- CommonJS é dinâmico e não pode ser otimizado da mesma forma

---

## 3. Sistemas de Módulos

### 3.1 CommonJS (Node.js Tradicional)

```javascript
// Exportação
module.exports = { funcao1, funcao2 };
// ou
exports.funcao1 = funcao1;

// Importação
const { funcao1, funcao2 } = require('./modulo');
```

**Características:**
- Carregamento síncrono
- Resolução em tempo de execução
- Padrão original do Node.js

### 3.2 ES Modules (ESM)

```javascript
// Exportação
export const funcao1 = () => {};
export default funcao2;

// Importação
import funcao2, { funcao1 } from './modulo';
```

**Características:**
- Carregamento assíncrono
- Análise estática (permite tree shaking)
- Padrão oficial do JavaScript
- Suporte nativo em browsers modernos

### 3.3 Interoperabilidade

| De | Para | Possível? |
|----|------|-----------|
| ESM | CommonJS | Sim (usando `import()` dinâmico) |
| CommonJS | ESM | Sim (usando `require()` para CJS) |

### 3.4 Configuração no package.json

```json
{
  "type": "module"     // Todos os .js são ESM
  // ou
  "type": "commonjs"   // Padrão: todos os .js são CJS
}
```

**Extensões explícitas:**
- `.mjs` = sempre ES Module
- `.cjs` = sempre CommonJS

---

## 4. Estrutura de Projeto React

### 4.1 Estrutura Básica Recomendada

```
src/
├── components/        # Componentes reutilizáveis
│   ├── ui/           # Componentes básicos (Button, Input, Card)
│   ├── forms/        # Componentes de formulário
│   └── layout/       # Header, Footer, Sidebar
├── pages/            # Páginas da aplicação
├── hooks/            # Custom hooks reutilizáveis
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── useFetch.ts
├── utils/            # Funções utilitárias puras
│   ├── formatters.ts
│   └── validators.ts
├── lib/              # Configurações de bibliotecas externas
│   ├── axios.ts
│   └── supabase.ts
├── services/         # Camada de API e regras de negócio
│   ├── api/
│   │   ├── client.ts
│   │   ├── users.ts
│   │   └── products.ts
│   └── auth.ts
├── types/            # Definições TypeScript globais
│   ├── index.ts
│   └── api.ts
├── constants/        # Constantes da aplicação
│   ├── routes.ts
│   └── config.ts
├── assets/           # Recursos estáticos processados pelo bundler
│   ├── images/
│   └── icons/
├── styles/           # Estilos globais
│   ├── globals.css
│   └── variables.css
└── context/          # React Contexts globais
    └── AuthContext.tsx
```

### 4.2 Pasta `components/`

Componentes reutilizáveis da UI, organizados por função ou complexidade.

```
components/
├── ui/              # Componentes atômicos (atoms)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.module.css
│   │   └── index.ts
│   └── Input/
├── forms/           # Componentes de formulário (molecules)
├── layout/          # Estrutura de página (organisms)
└── index.ts         # Barrel file para exportações
```

### 4.3 Pasta `hooks/`

Custom hooks reutilizáveis seguindo convenções React.

**Exemplos comuns:**
- `useAuth` - Gerenciamento de autenticação
- `useLocalStorage` - Persistência no localStorage
- `useFetch` / `useQuery` - Requisições HTTP
- `useDebounce` - Debounce de valores
- `useMediaQuery` - Responsividade
- `useForm` - Gerenciamento de formulários

### 4.4 Pasta `services/` ou `api/`

Camada de abstração para comunicação com APIs.

```typescript
// services/api/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// services/api/users.ts
import { apiClient } from './client';

export const usersApi = {
  getAll: () => apiClient.get('/users'),
  getById: (id: string) => apiClient.get(`/users/${id}`),
  create: (data: CreateUserDTO) => apiClient.post('/users', data),
};
```

### 4.5 Pasta `public/`

Arquivos estáticos servidos diretamente sem processamento.

```
public/
├── favicon.ico
├── robots.txt
├── sitemap.xml
├── images/           # Imagens referenciadas por URL absoluta
├── fonts/           # Fontes personalizadas
└── locales/         # Arquivos de tradução
```

**Acesso:** Arquivos em `public/images/logo.png` são acessados via `/images/logo.png`.

---

## 5. Estrutura Específica do Next.js

### 5.1 App Router (Next.js 13+) - Arquivos Especiais

| Arquivo | Função |
|---------|--------|
| `page.tsx` | Define uma rota acessível publicamente |
| `layout.tsx` | Layout compartilhado (persiste entre navegações) |
| `template.tsx` | Similar ao layout, mas re-renderiza a cada navegação |
| `loading.tsx` | UI de carregamento (Suspense automático) |
| `error.tsx` | Boundary de erro para a rota |
| `not-found.tsx` | Página 404 customizada |
| `global-error.tsx` | Erro global (substitui root layout) |
| `default.tsx` | Fallback para rotas paralelas |
| `route.ts` | API Route Handler (GET, POST, etc.) |

### 5.2 Estrutura do App Router

```
app/
├── layout.tsx           # Root layout (obrigatório)
├── page.tsx            # Página inicial (/)
├── loading.tsx         # Loading global
├── error.tsx           # Error boundary global
├── not-found.tsx       # Página 404
├── globals.css         # Estilos globais
│
├── (auth)/             # Route Group (não afeta URL)
│   ├── login/
│   │   └── page.tsx    # /login
│   └── register/
│       └── page.tsx    # /register
│
├── dashboard/
│   ├── layout.tsx      # Layout do dashboard
│   ├── page.tsx        # /dashboard
│   └── settings/
│       └── page.tsx    # /dashboard/settings
│
├── blog/
│   ├── page.tsx        # /blog
│   └── [slug]/         # Rota dinâmica
│       └── page.tsx    # /blog/meu-post
│
├── api/                # Route Handlers
│   └── users/
│       └── route.ts    # /api/users (GET, POST)
│
└── @modal/             # Parallel Route (slot)
    └── login/
        └── page.tsx
```

### 5.3 Convenções de Rotas

| Padrão | Descrição |
|--------|-----------|
| `folder/` | Segmento de rota |
| `[param]/` | Rota dinâmica (`/blog/[slug]`) |
| `[...slug]/` | Catch-all (`/docs/a/b/c`) |
| `[[...slug]]/` | Optional catch-all |
| `(group)/` | Route Group (organização sem afetar URL) |
| `@slot/` | Parallel Route (renderização paralela) |
| `_folder/` | Pasta privada (ignorada pelo router) |

### 5.4 Pages Router (Legacy)

```
pages/
├── _app.tsx           # Componente raiz customizado
├── _document.tsx      # HTML document customizado
├── index.tsx          # Página inicial (/)
├── about.tsx          # /about
├── blog/
│   ├── index.tsx      # /blog
│   └── [slug].tsx     # /blog/:slug
└── api/               # API Routes
    └── users.ts       # /api/users
```

### 5.5 Middleware

```typescript
// middleware.ts (raiz do projeto)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verificação de autenticação, redirecionamentos, etc.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
```

### 5.6 Route Handlers vs Server Actions

| Característica | Route Handlers | Server Actions |
|----------------|----------------|----------------|
| Localização | `app/api/*/route.ts` | Inline ou arquivos separados |
| Uso principal | APIs públicas, webhooks | Mutações internas, formulários |
| Métodos HTTP | GET, POST, PUT, DELETE, etc. | Apenas POST |
| Caching | GET pode ser cacheado | Não cacheado |
| Chamada externa | Sim | Não recomendado |

---

## 6. Arquivos de Configuração

### 6.1 package.json

```json
{
  "name": "meu-projeto",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": { /* ... */ },
  "devDependencies": { /* ... */ }
}
```

### 6.2 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "ES2020"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### 6.3 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.exemplo.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### 6.4 tailwind.config.js (v3)

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
      },
    },
  },
  plugins: [],
};
```

### 6.5 postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 6.6 .eslintrc.json

```json
{
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### 6.7 .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### 6.8 .gitignore (Next.js)

```gitignore
# Dependencies
node_modules/
.pnp/
.pnp.js

# Build output
.next/
out/
build/
dist/

# Environment
.env
.env*.local

# IDE
.vscode/
.idea/

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS
.DS_Store
Thumbs.db

# Testing
coverage/

# TypeScript
*.tsbuildinfo

# Vercel
.vercel
```

---

## 7. Path Aliases (Aliases de Caminho)

### 7.1 Configuração Básica

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@utils/*": ["./src/utils/*"],
      "@lib/*": ["./src/lib/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

### 7.2 Uso na Prática

```typescript
// Sem aliases (imports relativos)
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../hooks/useAuth';

// Com aliases (imports absolutos)
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
```

### 7.3 Convenções de Nomenclatura

| Alias | Uso |
|-------|-----|
| `@/` | Raiz do src (mais comum) |
| `@components/` | Componentes |
| `@hooks/` | Custom hooks |
| `@utils/` | Utilitários |
| `@lib/` | Bibliotecas configuradas |
| `@types/` | Definições TypeScript |
| `@assets/` | Recursos estáticos |

### 7.4 Compatibilidade com Bundlers

Next.js reconhece automaticamente os paths do `tsconfig.json`. Para outros bundlers:

**Webpack:**
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
}
```

**Vite:**
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, 'src'),
  },
}
```

---

## 8. Padrões de Organização de Código

### 8.1 Feature-Based (Baseado em Funcionalidades)

```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── index.ts
│   └── products/
│       └── ...
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
```

**Vantagens:**
- Alta coesão (relacionados ficam juntos)
- Facilita manutenção e escalabilidade
- Cada feature é independente
- Favorece trabalho em equipe paralelo

### 8.2 Atomic Design

Metodologia criada por Brad Frost com 5 níveis:

```
components/
├── atoms/           # Elementos básicos indivisíveis
│   ├── Button/
│   ├── Input/
│   ├── Label/
│   └── Icon/
├── molecules/       # Grupos de atoms funcionais
│   ├── SearchInput/ # Input + Button
│   ├── FormField/   # Label + Input + Error
│   └── NavItem/
├── organisms/       # Seções complexas da UI
│   ├── Header/
│   ├── Footer/
│   ├── ProductCard/
│   └── LoginForm/
├── templates/       # Layouts de página
│   ├── DashboardLayout/
│   └── AuthLayout/
└── pages/           # Instâncias específicas
    ├── HomePage/
    └── ProfilePage/
```

**Níveis explicados:**
1. **Atoms** - Botões, inputs, labels, ícones (não podem ser divididos)
2. **Molecules** - Combinações funcionais de atoms
3. **Organisms** - Seções complexas com lógica própria
4. **Templates** - Estrutura de página sem conteúdo real
5. **Pages** - Templates com conteúdo real

### 8.3 Domain-Driven Design (DDD)

```
src/
├── domain/
│   ├── user/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── services/
│   └── order/
│       └── ...
├── application/
│   ├── use-cases/
│   └── services/
├── infrastructure/
│   ├── api/
│   └── database/
└── presentation/
    ├── components/
    └── pages/
```

### 8.4 Colocation (Co-localização)

Princípio de manter arquivos relacionados próximos.

```
components/
└── UserProfile/
    ├── UserProfile.tsx      # Componente
    ├── UserProfile.test.tsx # Testes
    ├── UserProfile.module.css # Estilos
    ├── UserProfile.stories.tsx # Storybook
    ├── useUserProfile.ts    # Hook específico
    └── index.ts             # Exportação
```

**Benefícios:**
- Fácil encontrar arquivos relacionados
- Mover/renomear features é simples
- Dependências claras e localizadas

### 8.5 Recomendações Gerais

| Aspecto | Recomendação |
|---------|--------------|
| Profundidade de pastas | Máximo 3-4 níveis |
| Arquivos por pasta | Evitar mais de 10-15 |
| Convenção de nomes | kebab-case para pastas/arquivos, PascalCase para componentes |
| Barrel files | Usar com moderação (podem afetar tree shaking) |
| README local | Adicionar em pastas complexas |

---

## Fontes de Pesquisa

- [Next.js Official Documentation - Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Official Documentation - Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Next.js Official Documentation - Environment Variables](https://nextjs.org/docs/pages/guides/environment-variables)
- [React Official Documentation - Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
- [TypeScript Documentation - Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [Webpack Documentation - Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Robin Wieruch - React Folder Structure in 5 Steps](https://www.robinwieruch.de/react-folder-structure/)
- [Medium - Inside the App Router: Best Practices 2025](https://medium.com/better-dev-nextjs-react/inside-the-app-router-best-practices-for-next-js-file-and-directory-structure-2025-edition-ed6bc14a8da3)
- [LogRocket - CommonJS vs ES Modules](https://blog.logrocket.com/commonjs-vs-es-modules-node-js/)
- [web.dev - Code Splitting with React.lazy and Suspense](https://web.dev/code-splitting-suspense/)
- [Profy.dev - React API Layer Architecture](https://profy.dev/article/react-architecture-api-layer)
- [Medium - Atomic Design Pattern for React](https://medium.com/@janelle.wg/atomic-design-pattern-how-to-structure-your-react-application-2bb4d9ca5f97)

---

**Relatório compilado por:** The Veritas - Motor de Pesquisa eximIA.OS
**Data:** 31 de Janeiro de 2026
**Versão:** 1.0
