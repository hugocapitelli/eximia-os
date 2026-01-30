# Supabase Setup Guide - exímIA OS

Este guia detalha o processo completo de configuração do Supabase para os módulos **Academy** e **Biblioteca** do projeto exímIA OS.

## 📋 Pré-requisitos

- [ ] Conta no Supabase (https://supabase.com)
- [ ] Node.js 18+ instalado
- [ ] Projeto React + Vite rodando localmente

## 🚀 Passo 1: Criar Projeto no Supabase

1. Acesse o **Supabase Dashboard**: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha os dados:
   - **Name**: `eximia-os-production`
   - **Database Password**: Gere uma senha forte (salve em um gerenciador de senhas)
   - **Region**: Escolha a região mais próxima dos seus usuários (ex: `us-east-1`, `sa-east-1`)
   - **Pricing Plan**: Free ou Pro (conforme necessidade)
4. Aguarde a criação do projeto (3-5 minutos)

## 🔑 Passo 2: Obter Credenciais

1. No Dashboard do projeto, navegue até **Settings** → **API**
2. Copie as seguintes informações:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public**: Chave pública (pode ser exposta no frontend)
   - **service_role**: Chave privada (NUNCA exponha no frontend)

## 💻 Passo 3: Configurar Variáveis de Ambiente

1. No diretório raiz do projeto, copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Edite `.env.local` e preencha com suas credenciais:
```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **IMPORTANTE**: Nunca commite `.env.local` no git!

## 📊 Passo 4: Aplicar Migrations do Banco de Dados

### Opção A: Via Supabase Dashboard (Recomendado para primeira vez)

1. Navegue até **SQL Editor** no Dashboard
2. Execute as migrations **na ordem abaixo**:

#### Migration 1: Profiles Table
```sql
-- Copie todo o conteúdo de: supabase/migrations/000_profiles_table.sql
-- Cole no SQL Editor e clique em "Run"
```

#### Migration 2: Academy Schema
```sql
-- Copie todo o conteúdo de: supabase/migrations/001_academy_schema.sql
-- Cole no SQL Editor e clique em "Run"
```

#### Migration 3: Biblioteca Schema
```sql
-- Copie todo o conteúdo de: supabase/migrations/002_biblioteca_schema.sql
-- Cole no SQL Editor e clique em "Run"
```

#### Migration 4: RLS Policies
```sql
-- Copie todo o conteúdo de: supabase/migrations/003_rls_policies.sql
-- Cole no SQL Editor e clique em "Run"
```

### Opção B: Via Supabase CLI (Para desenvolvedores avançados)

```bash
# Instalar Supabase CLI globalmente
npm install -g supabase

# Inicializar Supabase no projeto
supabase init

# Fazer login no Supabase
supabase login

# Linkar com projeto remoto
supabase link --project-ref SEU_PROJECT_ID

# Aplicar todas as migrations
supabase db push
```

## ✅ Passo 5: Verificar Instalação

### 5.1 Verificar Tabelas no Dashboard

1. Navegue até **Table Editor** no Dashboard
2. Confirme que os seguintes schemas existem:
   - **public** (profiles)
   - **academy** (10 tabelas)
   - **biblioteca** (5 tabelas)

### 5.2 Testar Conexão no Código

```typescript
// src/lib/supabase/test-connection.ts
import { supabase } from './client'

export async function testConnection() {
  const { data, error } = await supabase
    .from('profiles')
    .select('count')
    .limit(1)

  if (error) {
    console.error('Connection error:', error)
    return false
  }

  console.log('✅ Supabase connected successfully!')
  return true
}
```

## 📝 Passo 6: Gerar TypeScript Types

```bash
# Gerar tipos automaticamente a partir do schema do banco
npm run supabase:types
```

Isso criará/atualizará o arquivo `src/lib/supabase/database.types.ts` com todos os tipos TypeScript do seu banco.

## 🔐 Passo 7: Criar Primeiro Usuário Admin

1. No Dashboard, navegue até **Authentication** → **Users**
2. Clique em **"Add user"** → **"Create new user"**
3. Preencha:
   - **Email**: seu-email@exemplo.com
   - **Password**: senha-segura
   - **Auto Confirm User**: ✅ Marque esta opção
4. Clique em **"Create user"**
5. Vá para o **SQL Editor** e execute:

```sql
-- Definir usuário como admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'seu-email@exemplo.com';
```

## 🧪 Passo 8: Testar Funcionalidades

### Testar Authentication

```typescript
import { supabase } from './lib/supabase/client'

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'teste@exemplo.com',
  password: 'senha123',
  options: {
    data: {
      full_name: 'Usuário Teste'
    }
  }
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teste@exemplo.com',
  password: 'senha123'
})
```

### Testar Academy API

```typescript
// Criar um curso (como admin)
const { data, error } = await supabase
  .from('academy.courses')
  .insert({
    slug: 'intro-javascript',
    title: 'Introdução ao JavaScript',
    description: 'Aprenda JavaScript do zero',
    level: 'Iniciante',
    category: 'Programação',
    status: 'published'
  })
```

### Testar Biblioteca API

```typescript
// Adicionar um livro
const { data, error } = await supabase
  .from('biblioteca.books')
  .insert({
    title: 'Clean Code',
    author_name: 'Robert C. Martin',
    total_pages: 464,
    status: 'reading'
  })
```

## 📦 Estrutura Final

Após completar todos os passos, você terá:

```
exímia-os---synthetic-minds/
├── .env.local                    # Credenciais do Supabase (não commitado)
├── .env.example                  # Template de variáveis
├── supabase/
│   ├── migrations/
│   │   ├── 000_profiles_table.sql
│   │   ├── 001_academy_schema.sql
│   │   ├── 002_biblioteca_schema.sql
│   │   └── 003_rls_policies.sql
│   └── README.md
├── src/
│   └── lib/
│       └── supabase/
│           ├── client.ts        # Supabase client configurado
│           ├── types.ts         # Tipos base
│           └── database.types.ts # Tipos gerados (após npm run supabase:types)
└── package.json                 # Com script supabase:types
```

## 🐛 Troubleshooting

### Erro: "relation does not exist"
- **Causa**: Migration não foi aplicada
- **Solução**: Execute as migrations na ordem correta

### Erro: "JWT expired" ou "Invalid API key"
- **Causa**: Credenciais incorretas ou expiradas
- **Solução**: Verifique `.env.local` e copie novamente do Dashboard

### Erro: "new row violates row-level security policy"
- **Causa**: RLS está bloqueando a operação
- **Solução**: Verifique se o usuário está autenticado e tem permissões corretas

### Tabelas não aparecem no Table Editor
- **Causa**: Schemas `academy` e `biblioteca` não são exibidos por padrão
- **Solução**: Use o SQL Editor para visualizar: `SELECT * FROM academy.courses;`

## 📚 Próximos Passos

Após concluir o setup:

1. ✅ Implemente componentes React para Academy
2. ✅ Implemente componentes React para Biblioteca
3. ✅ Configure autenticação com Supabase Auth UI
4. ✅ Implemente sistema de progresso de cursos
5. ✅ Adicione integração com Socratic AI

## 🔗 Links Úteis

- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

---

**Desenvolvido para exímIA OS** | Backend Phase 1 Implementation
