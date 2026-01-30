# Story EXIMIA-010: Authentication Pages

**Story ID:** EXIMIA-010
**Epic:** EXIMIA-EPIC-003 (Backend Infrastructure)
**Sprint:** 3
**Pontos:** 8
**Prioridade:** P0 (Crítico)
**Depende de:** EXIMIA-009 (Supabase Setup), EXIMIA-007 (Templates)

---

## User Story

**Como** visitante do exímIA APP,
**Quero** poder criar uma conta e fazer login,
**Para que** eu possa acessar minhas funcionalidades personalizadas.

---

## Contexto

Autenticação é o gateway para todo o app.
Usando Supabase Auth com:
- Email/Password
- OAuth (Google, GitHub) - preparado
- Password recovery
- Email verification (opcional para MVP)

---

## Acceptance Criteria

### Login Page
- [ ] Email + Password inputs
- [ ] "Lembrar de mim" checkbox
- [ ] "Esqueci minha senha" link
- [ ] OAuth buttons (Google, GitHub)
- [ ] Link para Register
- [ ] Error handling (invalid credentials)
- [ ] Loading state durante submit
- [ ] Redirect para /dashboard após sucesso

### Register Page
- [ ] Name, Email, Password inputs
- [ ] Password confirmation
- [ ] Password strength indicator
- [ ] Terms of Service checkbox
- [ ] OAuth buttons
- [ ] Link para Login
- [ ] Validation errors
- [ ] Success → redirect to dashboard (ou email verification)

### Forgot Password Page
- [ ] Email input
- [ ] Submit button
- [ ] Success message
- [ ] Back to login link

### Reset Password Page
- [ ] New password input
- [ ] Confirm password
- [ ] Submit button
- [ ] Redirect to login após sucesso

### Auth Callback
- [ ] Handle OAuth redirects
- [ ] Handle email verification
- [ ] Handle password reset tokens

### Protected Routes
- [ ] Middleware protegendo /dashboard/*
- [ ] Redirect para /login se não autenticado
- [ ] Preserve intended destination

---

## Technical Details

### Login Page

```tsx
// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { Button, Input, Checkbox, Icon } from "@/components/ui";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) setError(error.message);
  };

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle="Entre para continuar sua jornada">
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Icon name="Mail" size={18} />}
          required
        />

        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leftIcon={<Icon name="Lock" size={18} />}
          required
        />

        <div className="flex items-center justify-between">
          <Checkbox
            label="Lembrar de mim"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link href="/forgot-password" className="text-sm text-eximia-400 hover:underline">
            Esqueci minha senha
          </Link>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Entrar
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-zinc-900 text-zinc-500">ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="secondary" onClick={() => handleOAuth("google")}>
            <Icon name="Chrome" size={18} /> Google
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleOAuth("github")}>
            <Icon name="Github" size={18} /> GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-eximia-400 hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
```

### Register Page

```tsx
// app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { Button, Input, Checkbox, Icon, Badge } from "@/components/ui";
import Link from "next/link";

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (password.length < 6) return { label: "Muito fraca", color: "bg-red-500", width: "20%" };
  if (password.length < 8) return { label: "Fraca", color: "bg-orange-500", width: "40%" };
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) return { label: "Média", color: "bg-yellow-500", width: "60%" };
  if (password.length >= 12) return { label: "Muito forte", color: "bg-green-500", width: "100%" };
  return { label: "Forte", color: "bg-green-400", width: "80%" };
}

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      setError("Você precisa aceitar os termos de uso");
      return;
    }

    if (!passwordsMatch) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Criar conta" subtitle="Comece sua jornada com ExímIA">
      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <Input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<Icon name="User" size={18} />}
          required
        />

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Icon name="Mail" size={18} />}
          required
        />

        <div className="space-y-2">
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Icon name="Lock" size={18} />}
            required
          />
          {password && (
            <div>
              <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${passwordStrength.color} transition-all`}
                  style={{ width: passwordStrength.width }}
                />
              </div>
              <span className="text-xs text-zinc-500">{passwordStrength.label}</span>
            </div>
          )}
        </div>

        <Input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          leftIcon={<Icon name="Lock" size={18} />}
          error={confirmPassword && !passwordsMatch ? "Senhas não coincidem" : undefined}
          success={confirmPassword && passwordsMatch}
          required
        />

        <Checkbox
          label={
            <span>
              Aceito os{" "}
              <Link href="/terms" className="text-eximia-400 hover:underline">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="/privacy" className="text-eximia-400 hover:underline">
                Política de Privacidade
              </Link>
            </span>
          }
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
        />

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          disabled={!acceptTerms || !passwordsMatch}
        >
          Criar conta
        </Button>

        <p className="text-center text-sm text-zinc-500 mt-6">
          Já tem uma conta?{" "}
          <Link href="/login" className="text-eximia-400 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
```

### Auth Callback

```typescript
// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Error ou sem code → redirect para login
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
```

### Signout Route

```typescript
// app/auth/signout/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/login", request.url));
}
```

### Protected Route Middleware

```typescript
// middleware.ts (atualizar)
import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  // Skip public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return response;
  }

  // Check auth for protected routes
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = new URL("/login", request.url);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
```

---

## Tasks

- [ ] Implementar Login page com validações
- [ ] Implementar Register page com password strength
- [ ] Implementar Forgot Password page
- [ ] Implementar Reset Password page
- [ ] Criar auth/callback route
- [ ] Criar auth/signout route
- [ ] Atualizar middleware para proteger rotas
- [ ] Testar fluxo completo de auth
- [ ] Testar OAuth com Google/GitHub
- [ ] Testar password recovery

---

## Definition of Done

- [ ] Login funcionando (email + OAuth)
- [ ] Register funcionando
- [ ] Password recovery funcionando
- [ ] Protected routes funcionando
- [ ] Redirect preservando destination
- [ ] TypeScript sem erros
- [ ] PR aprovado e merged

---

## Files to Create/Modify

```
app/
├── (auth)/
│   ├── layout.tsx                [CREATE]
│   ├── login/
│   │   └── page.tsx              [MODIFY]
│   ├── register/
│   │   └── page.tsx              [MODIFY]
│   ├── forgot-password/
│   │   └── page.tsx              [CREATE]
│   └── reset-password/
│       └── page.tsx              [CREATE]
├── auth/
│   ├── callback/
│   │   └── route.ts              [CREATE]
│   └── signout/
│       └── route.ts              [CREATE]
└── middleware.ts                 [MODIFY]
```

---

## Referências

- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [PRD Design System - AuthLayout](../../00_Core/PRD-Design-System-v5.0.md)

---

**Story criada por River (SM)**
**Data:** 2026-01-29
