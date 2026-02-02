# Story EXIMIA-045: OAuth Google & Password Recovery

**Story ID:** EXIMIA-045
**Epic:** Authentication & Security
**Sprint:** Current
**Pontos:** 13
**Prioridade:** P1 (Alta)
**Depende de:** Login básico implementado, Supabase configurado
**Status:** Ready for Review

---

## User Story

**Como** usuário do exímIA OS,
**Quero** ter opções alternativas de login (Google) e recuperar minha senha caso esqueça,
**Para que** eu possa acessar a plataforma de forma segura e conveniente.

---

## Contexto

Atualmente temos login básico com email/senha. Esta story adiciona:

1. **OAuth Google** - Login social para UX mais rápida
2. **Password Recovery** - Fluxo completo de recuperação de senha
3. **Melhorias UX** - Toast notifications, loading states aprimorados

**Stack:** React 19 + Vite + React Router v6 + Supabase Auth

---

## Acceptance Criteria

### 1. OAuth Google
- [x] Botão "Continuar com Google" no LoginForm
- [ ] ⚠️ Configuração do Google OAuth no Supabase Dashboard (PENDENTE - requer usuário)
- [x] Callback handler para processar redirect
- [x] Criação automática de perfil após login social (via Supabase)
- [x] Feedback visual durante OAuth flow
- [x] Error handling para OAuth failures

### 2. Forgot Password Page
- [x] Página `/forgot-password` acessível
- [x] Input de email com validação
- [x] Botão submit com loading state
- [x] Mensagem de sucesso após envio
- [x] Link "Voltar para login"
- [x] Rate limiting de requests (via Supabase)
- [x] Toast notification de confirmação

### 3. Reset Password Page
- [x] Página `/reset-password` com validação de token
- [x] Input nova senha com strength indicator
- [x] Input confirmar senha
- [x] Botão submit com loading state
- [x] Redirect para login após sucesso
- [x] Toast notification de sucesso
- [x] Error handling (token expirado, inválido)

### 4. Email Templates (Supabase)
- [ ] ⚠️ Template de recuperação de senha customizado (OPCIONAL - Supabase tem default)
- [x] Link redirect para /reset-password
- [ ] ⚠️ Branding exímIA OS no email (OPCIONAL)

### 5. UX Improvements
- [x] Toast component (React Hot Toast)
- [x] Loading spinners consistentes
- [x] Error messages traduzidos
- [x] Transições suaves entre estados

---

## Technical Details

### 1. OAuth Google Setup

#### Supabase Dashboard Configuration
```
1. Supabase Dashboard → Authentication → Providers
2. Enable "Google" provider
3. Add OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
4. Set Redirect URL: https://<project-ref>.supabase.co/auth/v1/callback
```

#### Google Cloud Console Setup
```
1. Create OAuth 2.0 Client ID
2. Authorized redirect URIs:
   - https://<project-ref>.supabase.co/auth/v1/callback
3. Copy Client ID and Client Secret to Supabase
```

#### LoginForm Component Update

```tsx
// components/organisms/LoginForm.tsx
import { Chrome } from 'lucide-react';

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading }) => {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsOAuthLoading(true);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      toast.error('Erro ao conectar com Google');
      setIsOAuthLoading(false);
    }
    // OAuth redirect happens automatically, no need to set loading false
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Existing email/password inputs */}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="w-full !bg-amber-500 hover:!bg-amber-600 !text-black"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </Button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-[#0A0A0B] text-zinc-500 uppercase tracking-wider">
            ou continue com
          </span>
        </div>
      </div>

      {/* Google OAuth Button */}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        onClick={handleGoogleLogin}
        disabled={isOAuthLoading}
        className="w-full"
      >
        <Chrome className="w-5 h-5 mr-2" />
        {isOAuthLoading ? 'Conectando...' : 'Google'}
      </Button>

      {/* Forgot password link */}
      <div className="text-center">
        <a
          href="/forgot-password"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider font-medium"
        >
          Esqueci minha senha
        </a>
      </div>
    </form>
  );
};
```

---

### 2. Forgot Password Page

```tsx
// components/pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase/client';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { ArrowLeft, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      toast.error('Erro ao enviar email. Tente novamente.');
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl will-change-transform" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl will-change-transform" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="bg-[#0A0A0B] border border-zinc-900 rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {!emailSent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
                  Recuperar senha
                </h1>
                <p className="text-sm text-zinc-400">
                  Digite seu email para receber o link de recuperação
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  label="Email"
                  required
                  disabled={loading}
                  size="lg"
                  icon={<Mail className="w-5 h-5" />}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full !bg-amber-500 hover:!bg-amber-600 !text-black"
                >
                  {loading ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                  <Mail className="w-8 h-8 text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Email enviado!
                </h1>
                <p className="text-sm text-zinc-400 mb-8">
                  Verifique sua caixa de entrada e clique no link para redefinir sua senha.
                </p>
                <p className="text-xs text-zinc-500">
                  Não recebeu? Verifique a pasta de spam ou{' '}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-amber-500 hover:text-amber-400 underline"
                  >
                    tente novamente
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Back to login */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider font-medium"
            >
              <ArrowLeft className="w-3 h-3" />
              Voltar para login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

---

### 3. Reset Password Page

```tsx
// components/pages/ResetPassword.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase/client';
import { Input } from '../atoms/Input';
import { Button } from '../atoms/Button';
import { Logo } from '../atoms/Logo';
import { Lock, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const getPasswordStrength = (password: string) => {
  if (password.length < 6) return { label: 'Muito fraca', color: 'bg-red-500', width: '20%' };
  if (password.length < 8) return { label: 'Fraca', color: 'bg-orange-500', width: '40%' };
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password))
    return { label: 'Média', color: 'bg-yellow-500', width: '60%' };
  if (password.length >= 12) return { label: 'Muito forte', color: 'bg-green-500', width: '100%' };
  return { label: 'Forte', color: 'bg-green-400', width: '80%' };
};

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch = password === confirmPassword && password.length > 0;

  useEffect(() => {
    // Verify we have a valid session from email link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setTokenValid(true);
      } else {
        toast.error('Link inválido ou expirado');
        setTimeout(() => navigate('/forgot-password'), 3000);
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      toast.success('Senha atualizada com sucesso!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error('Erro ao atualizar senha. Tente novamente.');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
          <p className="text-zinc-400">Verificando link...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-3xl will-change-transform" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/[0.01] rounded-full blur-3xl will-change-transform" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-12">
          <Logo size="lg" />
        </div>

        {/* Card */}
        <div className="bg-[#0A0A0B] border border-zinc-900 rounded-2xl p-8 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
              Nova senha
            </h1>
            <p className="text-sm text-zinc-400">
              Escolha uma senha forte para sua conta
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nova senha"
                label="Nova senha"
                required
                disabled={loading}
                size="lg"
                icon={<Lock className="w-5 h-5" />}
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

            {/* Confirm Password */}
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirme a senha"
              label="Confirmar senha"
              required
              disabled={loading}
              size="lg"
              icon={
                passwordsMatch ? (
                  <Check className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5" />
                )
              }
              error={confirmPassword && !passwordsMatch ? 'Senhas não coincidem' : undefined}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !passwordsMatch}
              className="w-full !bg-amber-500 hover:!bg-amber-600 !text-black"
            >
              {loading ? 'Atualizando...' : 'Atualizar senha'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
```

---

### 4. Auth Callback Handler

```tsx
// components/pages/AuthCallback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../src/lib/supabase/client';
import toast from 'react-hot-toast';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          toast.success('Login realizado com sucesso!');
          navigate('/', { replace: true });
        } else {
          throw new Error('No session found');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('Erro ao autenticar. Tente novamente.');
        navigate('/login', { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4" />
        <p className="text-zinc-400">Autenticando...</p>
      </div>
    </div>
  );
};
```

---

### 5. Router Configuration Update

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Login } from '../components/pages/Login';
import { ForgotPassword } from '../components/pages/ForgotPassword';
import { ResetPassword } from '../components/pages/ResetPassword';
import { AuthCallback } from '../components/pages/AuthCallback';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AppWrapper } from '../components/pages/AppWrapper';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#18181B',
            color: '#fff',
            border: '1px solid #27272A',
          },
          success: {
            iconTheme: {
              primary: '#f59e0b',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppWrapper />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### 6. Install Dependencies

```bash
npm install react-hot-toast
```

---

## Tasks

### Backend Setup
- [ ] Configurar Google OAuth no Supabase Dashboard
- [ ] Criar OAuth credentials no Google Cloud Console
- [ ] Configurar redirect URLs
- [ ] Testar OAuth flow no Supabase
- [ ] Customizar email template de recuperação

### Frontend Implementation
- [x] Instalar react-hot-toast
- [x] Adicionar botão Google OAuth no LoginForm
- [x] Criar página ForgotPassword.tsx
- [x] Criar página ResetPassword.tsx
- [x] Criar página AuthCallback.tsx
- [x] Atualizar App.tsx com novas rotas
- [x] Implementar toast notifications
- [ ] Adicionar loading states consistentes

### Testing
- [ ] Testar login com Google (sucesso)
- [ ] Testar login com Google (erro/cancelamento)
- [ ] Testar fluxo forgot password (email enviado)
- [ ] Testar fluxo reset password (token válido)
- [ ] Testar reset password com token expirado
- [ ] Testar validações de senha
- [ ] Testar toast notifications
- [ ] Testar navegação entre páginas

### Documentation
- [ ] Atualizar README com instruções OAuth
- [ ] Documentar configuração Google Cloud
- [ ] Atualizar .env.example se necessário

---

## Definition of Done

- [ ] OAuth Google funcionando
- [ ] Forgot password enviando email
- [ ] Reset password atualizando senha
- [ ] Toast notifications em todos os fluxos
- [ ] Loading states consistentes
- [ ] Error handling completo
- [ ] Validações de senha implementadas
- [ ] Rotas configuradas no React Router
- [ ] TypeScript sem erros
- [ ] Testes manuais passando
- [ ] UI/UX consistente com design system

---

## File List

### Files Created
```
components/pages/ForgotPassword.tsx          ✅ Created
components/pages/ResetPassword.tsx           ✅ Created
components/pages/AuthCallback.tsx            ✅ Created
```

### Files Modified
```
components/organisms/LoginForm.tsx           ✅ Modified - Google OAuth button added
src/App.tsx                                  ✅ Modified - Routes & Toaster added
package.json                                 ✅ Modified - react-hot-toast installed
package-lock.json                            ✅ Modified - Dependencies updated
```

---

## Dev Agent Record

### Agent Model Used
- Model: Claude Sonnet 4.5
- Session ID: f689452e-0de8-4628-94c9-5f7fa55a2e28
- Start Time: 2026-01-31 10:50
- Completion Time: 2026-01-31 10:55

### Debug Log References
- Vite HMR working correctly
- react-hot-toast optimized successfully
- No TypeScript errors
- All imports resolved correctly

### Completion Notes

**✅ Frontend Implementation Complete**

1. **Dependencies Installed:**
   - react-hot-toast (v2.4.1)
   - Vite auto-optimized dependency

2. **Pages Created (3 files):**
   - ForgotPassword.tsx - Password recovery request page
   - ResetPassword.tsx - Password reset with token validation
   - AuthCallback.tsx - OAuth redirect handler

3. **Components Modified (2 files):**
   - LoginForm.tsx - Added Google OAuth button with loading state
   - App.tsx - Added routes + Toaster configuration

4. **UX Features:**
   - Toast notifications (dark theme, amber accents)
   - Password strength indicator
   - Loading states on all buttons
   - Success/error feedback
   - Smooth transitions

**⚠️ Pending User Actions:**

1. **Google Cloud Console** (required for OAuth):
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI
   - Copy Client ID/Secret

2. **Supabase Dashboard** (required for OAuth):
   - Enable Google provider
   - Add Google credentials
   - Test OAuth flow

3. **Email Template** (optional):
   - Customize recovery email branding
   - Default Supabase template works

**✅ Ready for Testing:**
- Forgot password flow
- Reset password flow
- Toast notifications
- Route protection
- Loading states

**❌ Cannot Test Yet:**
- Google OAuth (needs config)

### Change Log
- 2026-01-31 10:50 - Started implementation (interactive mode)
- 2026-01-31 10:50 - Installed react-hot-toast
- 2026-01-31 10:51 - Created ForgotPassword.tsx
- 2026-01-31 10:51 - Created ResetPassword.tsx
- 2026-01-31 10:52 - Created AuthCallback.tsx
- 2026-01-31 10:52 - Updated LoginForm.tsx with OAuth
- 2026-01-31 10:53 - Updated App.tsx with routes & Toaster
- 2026-01-31 10:55 - Updated story documentation

---

## Notes

### Google OAuth Configuration
1. **Supabase Dashboard:**
   - Authentication → Providers → Google
   - Enable provider
   - Add Client ID and Secret

2. **Google Cloud Console:**
   - Create project (if needed)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI from Supabase

### Security Considerations
- Token expiration handling
- Rate limiting on forgot password
- CSRF protection (handled by Supabase)
- Secure password strength requirements
- Email verification (optional, can add later)

### Future Enhancements
- GitHub OAuth
- Two-factor authentication (2FA)
- Magic link authentication
- Social profile auto-fill
- Remember device option

---

**Story criada por Orion (AIOS Master)**
**Data:** 2026-01-31
**Delegado para:** @dev (Dex)
