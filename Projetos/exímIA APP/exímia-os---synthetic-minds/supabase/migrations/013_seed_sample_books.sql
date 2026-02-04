-- ============================================================
-- MIGRATION 013: Seed Sample Books & Summaries
-- Purpose: Populate database with example books and summaries
-- for testing the biblioteca module
-- ============================================================

-- Get current user ID (replace with actual admin user ID)
-- For testing, we'll use a placeholder that needs to be replaced

-- ============================================================
-- STEP 1: Insert Sample Authors
-- ============================================================

INSERT INTO public.authors (name, bio, photo_url)
VALUES
  ('James Clear', 'Escritor especializado em hábitos e melhoria de desempenho', NULL),
  ('Carol S. Dweck', 'Psicóloga e pesquisadora em psicologia da educação', NULL),
  ('Mark Fisher', 'Empreendedor e especialista em desenvolvimento financeiro', NULL),
  ('Napoleon Hill', 'Escritor e pioneiro no estudo de sucesso pessoal', NULL),
  ('Stephen Covey', 'Educador e autor de best-sellers sobre liderança', NULL);

-- ============================================================
-- STEP 2: Insert Sample Books
-- ============================================================

INSERT INTO public.book_catalog (
  title,
  subtitle,
  author_name,
  author_id,
  description,
  language,
  cover_url,
  categories,
  page_count,
  publisher,
  published_date
)
SELECT
  'Hábitos Atômicos',
  'Pequenas Mudanças, Resultados Extraordinários',
  'James Clear',
  a.id,
  'Um livro revolucionário sobre como pequenos hábitos podem levar a resultados extraordinários. James Clear mostra como aumentar sua produtividade e quebrar maus hábitos.',
  'pt',
  'https://images-na.ssl-images-amazon.com/images/P/8550802158.01.L.jpg',
  ARRAY['produtividade', 'hábitos', 'desenvolvimento pessoal'],
  320,
  'Intrínseca',
  '2019-01-01'::date
FROM public.authors a WHERE a.name = 'James Clear'
;

INSERT INTO public.book_catalog (
  title,
  subtitle,
  author_name,
  author_id,
  description,
  language,
  cover_url,
  categories,
  page_count,
  publisher,
  published_date
)
SELECT
  'Mindset: A Atitude Mental para o Sucesso',
  'Como Sua Mentalidade Determina Seu Sucesso na Vida',
  'Carol S. Dweck',
  a.id,
  'Carol Dweck apresenta o conceito revolucionário de mentalidade fixa vs. mentalidade de crescimento, mostrando como sua atitude pode transformar sua vida.',
  'pt',
  'https://images-na.ssl-images-amazon.com/images/P/8595089795.01.L.jpg',
  ARRAY['psicologia', 'desenvolvimento pessoal', 'educação'],
  432,
  'Objetiva',
  '2017-01-01'::date
FROM public.authors a WHERE a.name = 'Carol S. Dweck'
;

INSERT INTO public.book_catalog (
  title,
  subtitle,
  author_name,
  author_id,
  description,
  language,
  cover_url,
  categories,
  page_count,
  publisher,
  published_date
)
SELECT
  'Os 7 Hábitos das Pessoas Altamente Eficazes',
  'Lições Poderosas para a Mudança Pessoal',
  'Stephen Covey',
  a.id,
  'Um clássico que ensina os princípios fundamentais para alcançar eficácia em todas as áreas da vida.',
  'pt',
  'https://images-na.ssl-images-amazon.com/images/P/8532530206.01.L.jpg',
  ARRAY['liderança', 'hábitos', 'desenvolvimento pessoal'],
  432,
  'Best Seller',
  '1989-01-01'::date
FROM public.authors a WHERE a.name = 'Stephen Covey'
;

-- ============================================================
-- STEP 3: Create Sample Summary
-- NOTE: You must replace 'YOUR_ADMIN_USER_ID' with actual admin user ID
-- To find your user ID:
--   1. Go to Supabase Dashboard → Authentication → Users
--   2. Copy your User ID (UUID format)
-- ============================================================

INSERT INTO public.book_summaries (
  catalog_id,
  title,
  created_by,
  is_published,
  published_at
)
SELECT
  bc.id,
  'Resumo: Hábitos Atômicos',
  (SELECT id FROM auth.users LIMIT 1), -- Uses first user (should be your admin account)
  FALSE,
  NULL
FROM public.book_catalog bc
WHERE bc.title = 'Hábitos Atômicos'
;

-- ============================================================
-- STEP 4: Create Sample Chapters for the Summary
-- ============================================================

-- First, get the summary ID
WITH summary AS (
  SELECT id FROM public.book_summaries
  WHERE title = 'Resumo: Hábitos Atômicos'
  LIMIT 1
)
INSERT INTO public.summary_chapters (
  summary_id,
  chapter_number,
  title,
  subtitle,
  content,
  order_index,
  word_count
)
SELECT
  summary.id,
  1,
  'Introdução: O Poder dos Pequenos Hábitos',
  'Por que hábitos importam',
  '# Introdução

Os hábitos são a moeda da vida. Cada ação que você realiza é um voto para a pessoa que você quer ser. Nenhum resultado é alcançado isoladamente.

## A Regra dos 1%

Se você melhorar 1% a cada dia, em um ano você será 37 vezes melhor. Esse é o poder dos ganhos incrementais.

## Como Este Livro está Organizado

Vamos explorar:
- A ciência por trás dos hábitos
- Como construir hábitos que duram
- Como quebrar hábitos ruins
- Estratégias para implementar mudanças',
  0,
  450
FROM summary;

WITH summary AS (
  SELECT id FROM public.book_summaries
  WHERE title = 'Resumo: Hábitos Atômicos'
  LIMIT 1
)
INSERT INTO public.summary_chapters (
  summary_id,
  chapter_number,
  title,
  subtitle,
  content,
  order_index,
  word_count
)
SELECT
  summary.id,
  2,
  'O Loop do Hábito: Deixa, Estímulo, Resposta, Recompensa',
  'Compreender o ciclo que sustenta todos os hábitos',
  '# O Loop do Hábito

Todo hábito segue um padrão consistente:

## 1. Deixa (Cue)
O gatilho que inicia o comportamento. Pode ser:
- Um horário do dia
- Um local específico
- Uma pessoa
- Uma emoção
- Uma ação anterior

## 2. Estímulo (Craving)
O desejo de mudar seu estado. É o que te motiva a agir.

## 3. Resposta (Response)
O hábito em si - o que você faz.

## 4. Recompensa (Reward)
O benefício que você obtém. É o que seu cérebro está buscando.

## Exemplo: Beber Café da Manhã

- **Deixa**: Acordar
- **Estímulo**: Desejar estar acordado
- **Resposta**: Beber café
- **Recompensa**: Cafeína no sistema',
  1,
  380
FROM summary;

WITH summary AS (
  SELECT id FROM public.book_summaries
  WHERE title = 'Resumo: Hábitos Atômicos'
  LIMIT 1
)
INSERT INTO public.summary_chapters (
  summary_id,
  chapter_number,
  title,
  subtitle,
  content,
  order_index,
  word_count
)
SELECT
  summary.id,
  3,
  'Como Construir Hábitos que Duram',
  'As 4 leis da mudança de comportamento',
  '# Como Construir Hábitos que Duram

## Lei 1: Deixa o Hábito Óbvio
- Identifique seus hábitos atuais
- Crie um ambiente que facilite o comportamento desejado
- Use "stack" de hábitos: conecte novos hábitos a hábitos existentes

## Lei 2: Torne a Resposta Atrativa
- Pareie um hábito que você quer com algo que gosta
- Reduza o atrito: torne fácil fazer o que você quer
- Elimine barreiras ao comportamento desejado

## Lei 3: Torne a Resposta Fácil
- Comece pequeno (2 minutos)
- Aumente gradualmente
- Automate quando possível

## Lei 4: Torne a Recompensa Satisfatória
- Sinta a vitória imediatamente
- Use um rastreador de hábitos
- Celebre pequenas vitórias',
  2,
  520
FROM summary;

-- ============================================================
-- STEP 5: Publish the Summary
-- ============================================================

UPDATE public.book_summaries
SET is_published = TRUE, published_at = NOW()
WHERE title = 'Resumo: Hábitos Atômicos';

-- ============================================================
-- VERIFY DATA
-- ============================================================

SELECT 'BOOKS CREATED' as section, COUNT(*) as count FROM public.book_catalog;
SELECT 'SUMMARIES CREATED' as section, COUNT(*) as count FROM public.book_summaries;
SELECT 'CHAPTERS CREATED' as section, COUNT(*) as count FROM public.summary_chapters;
SELECT 'PUBLISHED SUMMARIES' as section, COUNT(*) as count FROM public.book_summaries WHERE is_published = TRUE;

-- ============================================================
-- DONE!
-- ============================================================
