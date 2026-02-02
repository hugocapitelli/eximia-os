# Story EXIMIA-009: Supabase Project Setup

**Story ID:** EXIMIA-009
**Epic:** EXIMIA-EPIC-003 (Backend Infrastructure)
**Sprint:** 3
**Pontos:** 5
**Prioridade:** P0 (Crítico)
**Depende de:** Nenhuma

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter o projeto Supabase configurado corretamente,
**Para que** eu possa começar a implementar backend com auth e database.

---

## Contexto

O Supabase será o backend-as-a-service do exímIA APP:
- **PostgreSQL** para database
- **Auth** para autenticação
- **Realtime** para eventos
- **Edge Functions** para lógica serverless
- **Storage** para arquivos

---

## Acceptance Criteria

- [ ] Projeto Supabase criado (exímIA-app-prod)
- [ ] Variáveis de ambiente configuradas no `.env.local`
- [ ] Cliente Supabase inicializado (`lib/supabase.ts`)
- [ ] Tipos TypeScript gerados
- [ ] Auth configurado (Email/Password + OAuth ready)
- [ ] RLS (Row Level Security) habilitado por padrão
- [ ] Connection testada (healthcheck)

---

## Technical Details

### 1. Criar Projeto no Supabase Dashboard

```
Project Name: eximia-app-prod
Region: São Paulo (sa-east-1)
Database Password: <STRONG_PASSWORD>
```

### 2. Variáveis de Ambiente

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...  # Apenas server-side
```

### 3. Cliente Supabase

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/supabase";

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

```typescript
// lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            // Handle in middleware
          }
        },
      },
    }
  );
}
```

```typescript
// lib/supabase/middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}
```

### 4. Middleware

```typescript
// middleware.ts
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### 5. Auth Configuration

No Supabase Dashboard:
- Enable Email/Password
- Configure SMTP (opcional para dev)
- Prepare OAuth providers (Google, GitHub)
- Set redirect URLs

```
Site URL: http://localhost:3000
Redirect URLs:
  - http://localhost:3000/auth/callback
  - https://app.eximia.ai/auth/callback
```

### 6. Type Generation

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to project
supabase link --project-ref <PROJECT_REF>

# Generate types
supabase gen types typescript --linked > types/supabase.ts
```

### 7. Healthcheck

```typescript
// app/api/health/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from("_healthcheck").select("*").limit(1);

    if (error && error.code !== "42P01") {
      throw error;
    }

    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: (error as Error).message },
      { status: 500 }
    );
  }
}
```

---

## Tasks

- [ ] Criar projeto no Supabase Dashboard
- [ ] Copiar credenciais para `.env.local`
- [ ] Instalar `@supabase/ssr`
- [ ] Criar `lib/supabase/client.ts`
- [ ] Criar `lib/supabase/server.ts`
- [ ] Criar `lib/supabase/middleware.ts`
- [ ] Criar `middleware.ts` na raiz
- [ ] Configurar Auth providers
- [ ] Gerar tipos TypeScript
- [ ] Criar healthcheck endpoint
- [ ] Testar conexão

---

## Definition of Done

- [ ] Supabase conectando sem erros
- [ ] Auth funcionando (signup/signin testado)
- [ ] Tipos gerados
- [ ] Healthcheck retornando 200
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/
├── lib/
│   └── supabase/
│       ├── client.ts             [CREATE]
│       ├── server.ts             [CREATE]
│       └── middleware.ts         [CREATE]
├── types/
│   └── supabase.ts               [CREATE] (generated)
└── middleware.ts                 [CREATE]

app/
└── api/
    └── health/
        └── route.ts              [CREATE]

.env.local                        [MODIFY]
.env.example                      [MODIFY]
```

---

## Referências

- [Supabase Next.js Guide](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [PRD Connection Layer](../../00_Core/PRD-Connection-Layer-v5.0.md)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
