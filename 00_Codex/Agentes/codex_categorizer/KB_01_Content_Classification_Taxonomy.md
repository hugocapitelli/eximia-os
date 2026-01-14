# Content Classification Taxonomy

## Tipos de Conteúdo

###  1. Article
Artigos web, blog posts, ensaios online

**Características:**
- 500-5000 palavras
- Autor individual ou editorial
- Publicado em site/blog
- Data de publicação

**Exemplos:**
- Blog posts técnicos
- Artigos de opinião
- Tutoriais
- Reportagens

### 2. Book
Livros completos ou capítulos

**Características:**
- 10.000+ palavras
- ISBN (quando disponível)
- Editora
- Capítulos/seções

**Subtipos:**
- Fiction
- Non-fiction
- Technical
- Academic

### 3. Research Paper
Papers acadêmicos, whitepapers

**Características:**
- Abstract/resumo
- Metodologia
- Referências bibliográficas
- Formato acadêmico

**Indicadores:**
- DOI
- ArXiv ID
- Seções: Introduction, Methods, Results, Discussion

### 4. Podcast
Episódios de podcast ou transcrições

**Características:**
- Áudio original
- Duração
- Host/convidados
- Série/episódio

**Metadata:**
- RSS feed
- Plataforma (Spotify, Apple Podcasts)
- Número/temporada

### 5. Video
Vídeos online (YouTube, Vimeo, etc)

**Características:**
- Duração
- Canal/criador
- Visualizações
- Descrição

**Fontes:**
- You Tube
- Vimeo
- Cursos online

### 6. Web Page
Páginas web genéricas

**Características:**
- Não se encaixa em outras categorias
- Landing pages
- Documentação
- FAQs

## Classificação Automática

### Indicadores por Tipo

**Article:**
```python
indicators = [
    'article' in og_type,
    word_count between 500-5000,
    has_author,
    has_publish_date,
    url_contains(['blog', 'article', 'post'])
]
```

**Research Paper:**
```python
indicators = [
    has_abstract,
    has_references_section,
    has_doi or arxiv_id,
    file_type == 'pdf',
    url_contains(['arxiv.org', 'doi.org', 'scholar'])
]
```

**Book:**
```python
indicators = [
    word_count > 10000,
    has_isbn,
    has_chapters,
    url_contains(['books', 'ebook'])
]
```

**Video:**
```python
indicators = [
    url_contains(['youtube.com', 'vimeo.com']),
    has_duration_metadata,
    og_type == 'video'
]
```

## Tags por Categoria

### Tecnologia
- programming, coding, software
- ai, ml, data-science
- web-development, frontend, backend
- devops, cloud, infrastructure

### Negócios
- startups, entrepreneurship
- business, strategy, management
- marketing, sales, growth
- finance, investment, valuation

### Ciência
- research, academic, study
- biology, physics, chemistry
- medicine, health, healthcare

### Educação
- learning, education, teaching
- tutorial, guide, how-to
- course, university

### Cultura
- philosophy, art, culture
- history, society
- psychology, behavior

## Confidence Scoring

### High Confidence (>0.9)
- Múltiplos indicadores fortes
- Metadata clara e completa
- Tipo óbvio pelo conteúdo

### Medium Confidence (0.7-0.9)
- Alguns indicadores presentes
- Tipo dedutível mas não óbvio
- Metadata parcial

### Low Confidence (<0.7)
- Poucos indicadores
- Conteúdo ambíguo
- Requer review manual

## Prompt para Gemini

```python
CLASSIFICATION_PROMPT = """
Analise o conteúdo e retorne classificação em JSON:

CONTEÚDO:
{content}

Classificar como:
- article: blog posts, artigos web (500-5000 palavras)
- book: livros, ebooks (>10k palavras)
- research_paper: papers acadêmicos, whitepapers
- podcast: episódios, transcrições
- video: vídeos online
- web_page: genérico (fallback)

JSON:
{
  "type": "...",
  "confidence": 0.0-1.0,
  "reasoning": "Por que esta classificação?"
}
"""
```
