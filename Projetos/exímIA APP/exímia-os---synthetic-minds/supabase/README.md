# Supabase Database Setup

Este diretório contém as migrations do banco de dados para os módulos Academy e Biblioteca do projeto exímIA OS.

## Ordem de Execução

As migrations devem ser executadas na seguinte ordem:

1. **000_profiles_table.sql** - Cria a tabela de perfis e RBAC
2. **001_academy_schema.sql** - Cria todas as tabelas do módulo Academy
3. **002_biblioteca_schema.sql** - Cria todas as tabelas do módulo Biblioteca
4. **003_rls_policies.sql** - Implementa Row-Level Security em todas as tabelas

## Como Aplicar as Migrations

### Opção 1: Via Supabase Dashboard

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto
3. Navegue até **SQL Editor**
4. Copie o conteúdo de cada migration (na ordem acima)
5. Cole no editor e clique em **Run**

### Opção 2: Via Supabase CLI

```bash
# Instalar Supabase CLI (se ainda não instalado)
npm install -g supabase

# Inicializar Supabase no projeto
supabase init

# Link com seu projeto remoto
supabase link --project-ref YOUR_PROJECT_REF

# Aplicar todas as migrations
supabase db push
```

## Configuração do Projeto

Após aplicar as migrations, configure as variáveis de ambiente:

1. Copie `.env.example` para `.env.local`:
```bash
cp .env.example .env.local
```

2. Preencha com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

## Estrutura do Banco de Dados

### public.profiles
- Perfis de usuários com RBAC (user, admin, moderator)
- Auto-criação via trigger no signup

### academy schema (10 tabelas)
- **courses**: Catálogo de cursos
- **modules**: Módulos dos cursos
- **lessons**: Aulas
- **enrollments**: Matrículas dos usuários
- **lesson_progress**: Progresso nas aulas
- **tracks**: Trilhas de aprendizado
- **track_courses**: Relação trilhas-cursos
- **socratic_sessions**: Sessões do chat socrático
- **achievements**: Conquistas disponíveis
- **user_achievements**: Conquistas dos usuários

### biblioteca schema (5 tabelas)
- **authors**: Autores de livros
- **books**: Biblioteca pessoal do usuário
- **reading_progress**: Progresso de leitura
- **notes**: Notas, highlights e citações
- **reading_goals**: Metas de leitura anual

## Segurança (RLS)

Todas as tabelas possuem Row-Level Security (RLS) ativado:

- **Usuários** podem acessar apenas seus próprios dados
- **Admins** têm acesso completo a todos os dados
- **Cursos publicados** são públicos (read-only)
- **Autores** são públicos (read-only)

## Gerando TypeScript Types

Após aplicar as migrations, gere os tipos TypeScript:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/database.types.ts
```

## Verificando as Migrations

Para verificar se todas as tabelas foram criadas:

```sql
-- No SQL Editor do Supabase
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname IN ('public', 'academy', 'biblioteca')
ORDER BY schemaname, tablename;
```

## Suporte

Para problemas com as migrations:
1. Verifique se as variáveis de ambiente estão corretas
2. Confirme que o projeto Supabase está ativo
3. Execute as migrations na ordem correta
4. Consulte a documentação do Supabase: https://supabase.com/docs
