# Story EXIMIA-038: Supabase Client Setup (Server & Browser)

**Story ID:** EXIMIA-038
**Epic:** EXIMIA-EPIC-001 (Core Foundation)
**Sprint:** 3
**Pontos:** 3
**Prioridade:** P0 (Bloqueante)
**Depende de:** EXIMIA-009 (Supabase Setup)
**Bloqueia:** Todas as stories de API (Journey, Academy, Books)

---

## User Story

**Como** desenvolvedor do exímIA APP,
**Quero** ter o Supabase client configurado para Server e Browser,
**Para que** eu possa implementar Server Actions e componentes cliente.

---

## Contexto

O projeto usa Next.js 15 com Server Actions. Precisamos de dois clientes Supabase:
- **Server Client**: Para Server Actions e Server Components
- **Browser Client**: Para componentes cliente e real-time subscriptions

---

## Acceptance Criteria

### Server Client
- [ ] `lib/supabase/server.ts` criado com `createServerClient`
- [ ] Suporta cookies do Next.js 15
- [ ] Funciona em Server Actions e Server Components
- [ ] TypeScript types corretos

### Browser Client
- [ ] `lib/supabase/client.ts` criado com `createBrowserClient`
- [ ] Singleton pattern para evitar múltiplas instâncias
- [ ] Suporta real-time subscriptions
- [ ] TypeScript types corretos

### Middleware
- [ ] `middleware.ts` atualizado para refresh de sessão
- [ ] Protected routes configuradas
- [ ] Redirect para login quando não autenticado

### Environment Variables
- [ ] `.env.local` configurado com todas as variáveis
- [ ] `.env.example` atualizado

---

## Technical Details

### Server Client

```typescript
// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Helper to get authenticated user
export async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

// Helper to require authenticated user (throws if not authenticated)
export async function requireAuthUser() {
  const user = await getAuthUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
```

### Browser Client

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return client;
}
```

### Middleware

```typescript
// src/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT use getSession() here.
  // getUser() validates the JWT with Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes that require authentication
  const protectedPaths = [
    "/dashboard",
    "/academy",
    "/journey",
    "/settings",
    "/inbox",
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Auth routes (login, register) - redirect to dashboard if already logged in
  const authPaths = ["/login", "/register", "/forgot-password"];
  const isAuthPath = authPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // Redirect to login if accessing protected route without auth
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth routes while logged in
  if (isAuthPath && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Type Generation Script

```json
// package.json (add script)
{
  "scripts": {
    "supabase:types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts"
  }
}
```

### Environment Variables

```env
# .env.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-only (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Tasks

- [ ] Instalar dependências: `@supabase/supabase-js`, `@supabase/ssr`
- [ ] Criar `src/lib/supabase/server.ts`
- [ ] Criar `src/lib/supabase/client.ts`
- [ ] Criar `src/lib/supabase/index.ts` (re-exports)
- [ ] Atualizar `src/middleware.ts`
- [ ] Criar `.env.example` com variáveis necessárias
- [ ] Gerar TypeScript types do Supabase
- [ ] Testar auth flow (login → protected route → logout)

---

## Definition of Done

- [ ] Server client funcionando em Server Actions
- [ ] Browser client funcionando em componentes cliente
- [ ] Middleware protegendo rotas corretamente
- [ ] TypeScript types gerados e funcionando
- [ ] Auth flow testado end-to-end
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
src/lib/supabase/
├── server.ts           [CREATE]
├── client.ts           [CREATE]
├── types.ts            [GENERATE]
└── index.ts            [CREATE]

src/
└── middleware.ts       [MODIFY/CREATE]

.env.example            [MODIFY]
package.json            [MODIFY - add script]
```

---

## CodeRabbit Integration

**Quality Gates:**
- [ ] No secrets in client code
- [ ] Proper cookie handling
- [ ] TypeScript strict mode compliance

**Expected Issues:** None

---

**Story criada por River (SM)**
**Data:** 2026-01-30
