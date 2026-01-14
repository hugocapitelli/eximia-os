# PRP - ETAPA 2: Autenticação & Tenant Management
## Agenda Cheia - Product Requirement Prompt

**Data:** 2026-01-08
**Versão:** 1.0
**Prioridade:** P0 (Crítica - Bloqueador)
**Estimativa:** 1-2 sprints

---

## 🎯 Objetivo

Implementar sistema de autenticação via WhatsApp (OTP), gerenciamento de multi-tenancy com isolamento de dados por salão e RBAC (Role-Based Access Control) básico.

---

## 📊 Contexto

O Agenda Cheia precisa suportar múltiplos salões (tenants) de forma isolada, onde cada salão tem seus próprios clientes, conversas e dados. A autenticação deve ser simples e usar WhatsApp como canal principal (familiar para o público-alvo).

---

## 🔐 Sistema de Autenticação

### Fluxo de Login via WhatsApp (OTP)

**Método:** One-Time Password via WhatsApp
**Provider:** Supabase Auth + Z-API

#### Etapa 1: Solicitação de Login
```
Usuário acessa: https://app.agendacheia.com/login
↓
Insere número de telefone: (11) 99999-8888
↓
Clica em "Enviar Código"
↓
Backend valida número e envia OTP via WhatsApp
```

#### Etapa 2: Envio de OTP
```
Sistema gera código: 6 dígitos (ex: 742851)
Validade: 5 minutos
Rate limit: 3 tentativas/10 minutos

Mensagem WhatsApp:
┌─────────────────────────────────────┐
│ *Agenda Cheia* 🔐                   │
│                                     │
│ Seu código de acesso é:             │
│                                     │
│ *7 4 2 8 5 1*                       │
│                                     │
│ Válido por 5 minutos.               │
│                                     │
│ Não compartilhe este código!        │
└─────────────────────────────────────┘
```

#### Etapa 3: Validação do OTP
```
Usuário digita código no frontend
↓
Frontend envia para backend
↓
Backend valida código
↓
Se válido: Cria JWT token
Se inválido: Retorna erro (3 tentativas)
Se expirado: Solicita novo código
```

#### Etapa 4: Sessão
```
JWT token armazenado em httpOnly cookie
Duração: 7 dias
Refresh token: 30 dias
Auto-refresh: 1 dia antes de expirar
```

---

## 🏢 Multi-Tenancy

### Estratégia de Isolamento

**Abordagem:** Database-level com Row Level Security (RLS)
**Identificador:** tenant_id (UUID) em todas as tabelas

#### Row Level Security (RLS) Policies

**1. Tenants Table**
```sql
-- Usuários só veem seu próprio tenant
CREATE POLICY "Users can view own tenant"
  ON tenants FOR SELECT
  USING (
    id IN (
      SELECT tenant_id FROM users
      WHERE auth.uid() = id
    )
  );

-- Apenas owner pode atualizar tenant
CREATE POLICY "Only owner can update tenant"
  ON tenants FOR UPDATE
  USING (
    owner_id = auth.uid()
  );
```

**2. Clients Table**
```sql
-- Usuários só veem clientes do seu tenant
CREATE POLICY "Users can view own tenant clients"
  ON clients FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth.uid() = id
    )
  );

-- Usuários podem inserir clientes no seu tenant
CREATE POLICY "Users can insert clients in own tenant"
  ON clients FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM users
      WHERE auth.uid() = id
    )
  );

-- Similar para UPDATE e DELETE
```

**3. Conversations, Messages, Recalls** (mesmo padrão)

#### Context Injection (Middleware)

**Backend (NestJS)**
```typescript
// tenant.decorator.ts
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.tenantId;
  },
);

// tenant.guard.ts
@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new UnauthorizedException('Tenant not found');
    }

    // Injeta tenant_id no contexto da requisição
    request.tenantId = user.tenantId;
    return true;
  }
}

// Uso em controller:
@Controller('clients')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ClientsController {
  @Get()
  async findAll(@CurrentTenant() tenantId: string) {
    // Automaticamente filtra por tenantId
    return this.clientsService.findAll(tenantId);
  }
}
```

---

## 👥 RBAC (Role-Based Access Control)

### Roles

**1. Owner (Dono do Salão)**
- Acesso total
- Pode convidar outros usuários
- Pode alterar plano e billing
- Pode excluir conta

**2. Receptionist (Recepcionista)**
- Pode ver dashboard
- Pode gerenciar clientes
- Pode confirmar agendamentos (Lazy Sync)
- Pode ver conversas
- NÃO pode alterar configurações críticas
- NÃO pode ver billing

**3. Professional (Profissional)**
- Pode ver apenas seus clientes
- Pode ver conversas relacionadas a ele
- NÃO pode adicionar/remover clientes
- NÃO pode ver billing

### Permissions Matrix

| Recurso                 | Owner | Receptionist | Professional |
|-------------------------|:-----:|:------------:|:------------:|
| Dashboard               |   ✅   |      ✅       |      ✅       |
| Ver clientes            |   ✅   |      ✅       |   ✅ (seus)   |
| Adicionar clientes      |   ✅   |      ✅       |      ❌       |
| Editar clientes         |   ✅   |      ✅       |      ❌       |
| Excluir clientes        |   ✅   |      ✅       |      ❌       |
| Ver conversas           |   ✅   |      ✅       |   ✅ (suas)   |
| Assumir controle bot    |   ✅   |      ✅       |      ❌       |
| Confirmar agendamentos  |   ✅   |      ✅       |      ❌       |
| Configurar ciclos       |   ✅   |      ❌       |      ❌       |
| Configurar WhatsApp     |   ✅   |      ❌       |      ❌       |
| Gerenciar usuários      |   ✅   |      ❌       |      ❌       |
| Ver billing             |   ✅   |      ❌       |      ❌       |
| Cancelar conta          |   ✅   |      ❌       |      ❌       |

### Implementação RBAC

**Backend (Guard)**
```typescript
// roles.decorator.ts
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}

// Uso:
@Post()
@Roles(Role.Owner, Role.Receptionist)
@UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
async addClient(@CurrentTenant() tenantId: string, @Body() dto: CreateClientDto) {
  // ...
}
```

---

## 🖥️ Telas e Wireframes

### Tela 1: Login

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                  💅 Agenda Cheia                │
│                                                 │
│     Recupere clientes que sumiram com IA        │
│                                                 │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │  📱 WhatsApp                              │ │
│  │  ┌────────┬─────────────────────────────┐ │ │
│  │  │ +55 ▼ │ (__) _____-____              │ │ │
│  │  └────────┴─────────────────────────────┘ │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │         📨 Enviar Código                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Vamos enviar um código de 6 dígitos via       │
│  WhatsApp para você fazer login.               │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Primeiro acesso?                               │
│  ┌───────────────────────────────────────────┐ │
│  │       Criar Conta Grátis                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│                                                 │
│          🔒 Seus dados estão seguros            │
│              Compliance LGPD                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tela 2: Validação OTP

```
┌─────────────────────────────────────────────────┐
│                                                 │
│                  💅 Agenda Cheia                │
│                                                 │
│         Código enviado para (11) 99999-8888     │
│                                                 │
│                                                 │
│  Digite o código de 6 dígitos:                 │
│                                                 │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│  │ 7 │ │ 4 │ │ 2 │ │ 8 │ │ 5 │ │ 1 │         │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘         │
│                                                 │
│                                                 │
│          ⏱ Código expira em 4:32               │
│                                                 │
│                                                 │
│  Não recebeu?                                   │
│  ┌───────────────────────────────────────────┐ │
│  │         Reenviar Código                   │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Número errado? ← Voltar                        │
│                                                 │
│                                                 │
│  💡 Dica: Abra o WhatsApp no seu celular       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tela 3: Primeiro Acesso (Criar Tenant)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ← Voltar        🎉 Bem-vindo!                  │
│                                                 │
│  ──────────────────────────────────────────────  │
│                                                 │
│  Vamos criar sua conta em 30 segundos:          │
│                                                 │
│  Nome do seu salão *                            │
│  ┌───────────────────────────────────────────┐ │
│  │ Salão da Carla                            │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Seu nome *                                     │
│  ┌───────────────────────────────────────────┐ │
│  │ Carla Santos                              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Email (opcional)                               │
│  ┌───────────────────────────────────────────┐ │
│  │ carla@salao.com                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  WhatsApp                                       │
│  ┌────────┬─────────────────────────────────┐  │
│  │ +55 ▼ │ (11) 99999-8888 ✓ Verificado    │  │
│  └────────┴─────────────────────────────────┘  │
│                                                 │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │           Continuar →                     │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Ao continuar, você concorda com nossos         │
│  Termos de Uso e Política de Privacidade        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tela 4: Gerenciar Usuários (Owner)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  ← Dashboard        Usuários                    │
│                                                 │
│  ──────────────────────────────────────────────  │
│                                                 │
│  ┌───────────────────────────────────────────┐ │
│  │   + Convidar Usuário                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ 👤 Carla Santos (Você)                      ││
│  │ (11) 99999-8888 • carla@salao.com           ││
│  │ 🏆 Owner                                    ││
│  │                                             ││
│  │ Último acesso: Hoje às 10:30                ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ 👤 Ana Paula                                ││
│  │ (11) 98888-7777 • ana@gmail.com             ││
│  │ 💼 Receptionist                             ││
│  │                                             ││
│  │ Último acesso: Hoje às 09:15                ││
│  │ [Editar] [Remover]                          ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ 👤 Rafael Oliveira                          ││
│  │ (11) 97777-6666                             ││
│  │ ✂️ Professional                             ││
│  │                                             ││
│  │ Último acesso: Ontem às 18:20               ││
│  │ [Editar] [Remover]                          ││
│  └─────────────────────────────────────────────┘│
│                                                 │
│  ┌─────────────────────────────────────────────┐│
│  │ 📧 Convite Pendente                         ││
│  │ juliana@gmail.com                           ││
│  │ 💼 Receptionist                             ││
│  │                                             ││
│  │ Enviado em: 05/01/2026                      ││
│  │ [Reenviar] [Cancelar]                       ││
│  └─────────────────────────────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

### Tela 5: Convidar Usuário (Modal)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Convidar Usuário                           ✕   │
│  ──────────────────────────────────────────────  │
│                                                 │
│  Nome *                                         │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  WhatsApp ou Email *                            │
│  ┌───────────────────────────────────────────┐ │
│  │                                           │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Função *                                       │
│  ┌───────────────────────────────────────────┐ │
│  │ Selecione...                           ▼ │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  ○ 💼 Receptionist                              │
│     Pode gerenciar clientes e confirmar         │
│     agendamentos. Não pode alterar              │
│     configurações.                              │
│                                                 │
│  ○ ✂️ Professional                              │
│     Acesso limitado aos seus clientes.          │
│     Ideal para cabeleireiras, manicures, etc.   │
│                                                 │
│  ○ 🏆 Owner                                     │
│     Acesso total. Pode gerenciar usuários       │
│     e billing. Apenas 1 owner por salão.        │
│                                                 │
│                                                 │
│  ┌──────────────────┐  ┌──────────────────────┐│
│  │    Cancelar      │  │   Enviar Convite     ││
│  └──────────────────┘  └──────────────────────┘│
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 API Endpoints

### Auth Endpoints

```typescript
// POST /auth/send-otp
{
  phone: "+5511999998888"
}
// Response: { message: "OTP sent", expiresIn: 300 }

// POST /auth/verify-otp
{
  phone: "+5511999998888",
  code: "742851"
}
// Response: {
//   accessToken: "jwt...",
//   refreshToken: "refresh...",
//   user: { id, name, tenantId, role }
// }

// POST /auth/refresh
{
  refreshToken: "refresh..."
}
// Response: { accessToken: "jwt..." }

// POST /auth/logout
// Response: { message: "Logged out" }
```

### Tenant Endpoints

```typescript
// POST /tenants (criar novo tenant)
{
  name: "Salão da Carla",
  ownerName: "Carla Santos",
  ownerPhone: "+5511999998888",
  ownerEmail: "carla@salao.com"
}

// GET /tenants/me (obter meu tenant)
// Response: { tenant: {...} }

// PATCH /tenants/me (atualizar meu tenant)
{
  name: "Salão da Carla - Campinas"
}

// DELETE /tenants/me (excluir conta)
```

### Users Endpoints

```typescript
// GET /users (listar usuários do meu tenant)
// Response: { users: [...] }

// POST /users/invite (convidar usuário)
{
  name: "Ana Paula",
  email: "ana@gmail.com", // ou phone
  role: "receptionist"
}

// PATCH /users/:id (atualizar role)
{
  role: "receptionist"
}

// DELETE /users/:id (remover usuário)
```

---

## ✅ Critérios de Aceite

### Autenticação
- [ ] Login via WhatsApp OTP funcionando
- [ ] Código expira em 5 minutos
- [ ] Rate limit de 3 tentativas/10 minutos
- [ ] JWT token com duração de 7 dias
- [ ] Refresh token automático
- [ ] Logout limpa sessão corretamente

### Multi-tenancy
- [ ] RLS habilitado em todas as tabelas
- [ ] Usuários só veem dados do seu tenant
- [ ] TenantGuard injeta tenantId automaticamente
- [ ] Migrations criam policies corretamente
- [ ] Teste de isolamento entre tenants passou

### RBAC
- [ ] 3 roles implementados (owner, receptionist, professional)
- [ ] Permissions matrix respeitada
- [ ] RolesGuard bloqueia acessos não autorizados
- [ ] Professional só vê seus próprios clientes
- [ ] Receptionist não vê billing

### Telas
- [ ] Login mobile-responsive
- [ ] Validação OTP com UX clara
- [ ] Criação de tenant em <30 segundos
- [ ] Gerenciamento de usuários (owner)
- [ ] Convite de usuários funcional

---

## 🔗 Dependências

- **Depende de:** ETAPA 1 (Fundação & Infraestrutura)
- **Bloqueia:** ETAPA 3 (Onboarding), ETAPA 4 (Gestão de Clientes)

---

## 📝 Notas de Segurança

1. **OTP:** Usar biblioteca battle-tested (otplib ou similar)
2. **Rate Limiting:** Implementar no nível de IP + telefone
3. **JWT Secret:** Rotacionar periodicamente
4. **Refresh Token:** Armazenar hash no DB, não plaintext
5. **LGPD:** Logar todas as ações em audit_logs

---

**Status:** ⏳ Aguardando Implementação
**Owner:** Backend Lead
**Revisores:** CTO, Security Lead
