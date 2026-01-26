# ADR 001: Escolha de Stack Tecnológica
**Data:** 26 Janeiro 2026
**Status:** Aceito
**Decisores:** Hugo Capitelli

---

## Contexto

O ExímIA OS é uma plataforma de produtividade pessoal com agentes de IA integrados. Precisamos definir uma stack que:

1. Seja simples de desenvolver e manter
2. Suporte agentes de IA com streaming
3. Funcione bem como PWA
4. Seja deployável em VPS própria (Easypanel)
5. Minimize o número de serviços a gerenciar

---

## Decisão

### Frontend: Next.js 14 (App Router)

**Escolhido sobre:** Remix, SvelteKit, Nuxt

**Razões:**
- Maturidade e comunidade
- App Router com Server Components
- Integração nativa com Supabase
- PWA support maduro
- Pode rodar em container Docker

### Backend de Agentes: FastAPI (Python)

**Escolhido sobre:**
- Next.js API Routes (limitações de timeout)
- Supabase Edge Functions (50s limit, Deno)
- Node.js/Express (menos libs de IA)

**Razões:**
- Ecossistema Python para IA é superior
- FastAPI é async e performático
- Sem limites de timeout
- Controle total sobre o serviço
- Streaming nativo

### BaaS: Supabase

**Escolhido sobre:**
- PostgreSQL self-hosted (experiência traumática no Easypanel)
- Firebase (vendor lock-in, menos SQL)
- PlanetScale (sem RLS nativo)

**Razões:**
- PostgreSQL gerenciado
- Auth integrado
- RLS nativo
- Storage incluído
- Realtime se precisar
- Free tier generoso

### Auth: Supabase Auth

**Escolhido sobre:**
- NextAuth (complexidade adicional)
- Clerk (custo, mais um vendor)
- Auth0 (overkill)

**Razões:**
- Já está no Supabase
- RLS integrado (auth.uid())
- Zero configuração adicional
- Social logins fáceis

---

## Consequências

### Positivas

- **Simplicidade:** Apenas 2 serviços para deployar (Next.js + Agent Service)
- **Coesão:** Supabase centraliza dados, auth e storage
- **Flexibilidade:** Agent Service pode evoluir independentemente
- **Performance:** Streaming de IA sem limitações

### Negativas

- **Dois repositórios/deploys:** Frontend e Agent Service separados
- **Duas linguagens:** TypeScript + Python
- **Custo Supabase:** Pode aumentar com escala (mas ainda mais barato que self-host)

### Riscos

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Supabase downtime | Baixa | Status page, fallback read-only |
| Agent Service lento | Média | Monitoring, caching de prompts |
| Complexidade de deploy | Baixa | Docker + Easypanel simplifica |

---

## Alternativas Consideradas

### Alternativa A: Tudo em Next.js

```
Next.js (API Routes) → Supabase
```

**Rejeitada porque:** Limites de timeout (60s Vercel, variável em Docker) não são adequados para chat com agentes.

### Alternativa B: Tudo em Python

```
FastAPI (Full-stack) → Supabase
```

**Rejeitada porque:** Python não é ideal para UI, perdemos benefícios do Next.js (RSC, SSG, etc).

### Alternativa C: Supabase Edge Functions para Agentes

```
Next.js → Supabase Edge Functions → LLMs
```

**Rejeitada porque:** 50s timeout, Deno tem menos libs de IA, menos controle.

---

## Notas

Esta decisão pode ser revisitada se:
- Supabase se tornar muito caro
- Agent Service precisar de funcionalidades que Python não suporta bem
- Surgirem melhores opções de mercado

---

*Documento criado conforme padrão ADR (Architecture Decision Record)*
