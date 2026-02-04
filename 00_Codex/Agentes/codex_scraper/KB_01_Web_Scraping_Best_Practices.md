---
title: "Web Scraping Best Practices"
galaxy: "CODEX"
galaxy-color: "#A9A9A9"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-web-scraping-best-practices"
  - "web scraping best practices"
  - "overview"
  - "princípios fundamentais"
  - "1. respeitar robots.txt"
  - "2. rate limiting"
  - "3. user-agent apropriado"
  - "técnicas de extração"
  - "1. trafilatura (recomendado pa"
  - "2. beautifulsoup (fallback)"
tags:
  - "galaxy-codex"
  - "knowledge-base"
---

# Web Scraping Best Practices

## Overview

Este KB documenta as melhores práticas para extração de conteúdo web de forma ética, eficiente e robusta.

## Princípios Fundamentais

### 1. Respeitar robots.txt
- Sempre verificar e respeitar as diretrizes do robots.txt
- Não fazer scraping de sites que explicitamente proíbem
- Respeitar períodos de espera (Crawl-delay)

### 2. Rate Limiting
- Implementar delays entre requests (mínimo 1-2 segundos)
- Não sobrecarregar servidores
- Usar exponential backoff em caso de erros

### 3. User-Agent Apropriado
- Sempre identificar seu bot com User-Agent descritivo
- Incluir informação de contato se possível
- Exemplo: `Mozilla/5.0 (compatible; CodexBot/1.0; +https://example.com/bot)`

## Técnicas de Extração

### 1. Trafilatura (Recomendado para Artigos)
```python
import trafilatura

html = requests.get(url).text
content = trafilatura.extract(
    html,
    output_format='markdown',
    include_comments=False,
    include_tables=True
)
```

**Vantagens:**
- Otimizado para artigos e notícias
- Remove automaticamente ads, menus, footers
- Excelente qualidade de extração
- Suporta múltiplos idiomas

### 2. BeautifulSoup (Fallback)
```python
from bs4 import BeautifulSoup

soup = BeautifulSoup(html, 'html.parser')
# Remover elementos indesejados
for tag in soup(['script', 'style', 'nav', 'footer']):
    tag.decompose()
content = soup.get_text(separator='\\n\\n')
```

**Quando usar:**
- Sites com estrutura não-padrão
- Quando trafilatura falha
- Necessidade de controle fino

### 3. Selenium (Casos Especiais)
Apenas para sites que requerem JavaScript:
- SPAs (Single Page Applications)
- Conteúdo carregado dinamicamente
- Sites com proteção anti-bot

**Atenção:** Mais lento e consome mais recursos.

## Metadata Extraction

### Fontes Prioritárias

1. **Open Graph Tags**
```html
<meta property="og:title" content="Article Title">
<meta property="og:author" content="Author Name">
<meta property="og:published_time" content="2024-01-01">
```

2. **Schema.org / JSON-LD**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Title",
  "author": {"name": "Author"}
}
</script>
```

3. **HTML Meta Tags**
```html
<meta name="author" content="Author">
<meta name="description" content="Summary">
```

4. **Fallbacks**
- Tag `<title>`
- Tag `<h1>`
- Primeira linha de conteúdo

## Tratamento de Erros

### Erros Comuns

**1. Timeout (30s recomendado)**
```python
try:
    response = requests.get(url, timeout=30)
except requests.Timeout:
    # Retry with exponential backoff
```

**2. HTTP Errors**
- 404: Conteúdo não encontrado
- 403/401: Acesso negado
- 429: Rate limit excedido (aguardar)
- 500: Erro do servidor (retry)

**3. Encoding Issues**
```python
response.encoding = response.apparent_encoding
text = response.text
```

## Content Cleaning

### Remoções Comuns

1. **Múltiplas linhas vazias:** `\n{3,}` → `\n\n`
2. **Espaços extras:** ` {2,}` → ` `
3. **Caracteres de controle:** Remover `\x00-\x1f`
4. **Elementos HTML:** scripts, styles, nav, footer, aside

### Preservar

- Parágrafos (line breaks duplos)
- Headings e estrutura
- Links importantes
- Tabelas (se relevantes)
- Listas

## Formatos Especiais

### PDFs
```python
import PyPDF2

with open(pdf_path, 'rb') as file:
    reader = PyPDF2.PdfReader(file)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
```

### Videos (Metadata)
- Título do vídeo
- Canal/autor
- Descrição
- Transcrição (se disponível via API)

## Ética e Legalidade

### Sempre:
- ✅ Respeitar robots.txt
- ✅ Implementar rate limiting
- ✅ Identificar seu bot
- ✅ Verificar termos de serviço
- ✅ Armazenar apenas o necessário

### Nunca:
- ❌ Scraping agressivo (DDoS)
- ❌ Ignorar robots.txt
- ❌ Copiar conteúdo protegido sem permissão
- ❌ Bypass de paywalls
- ❌ Scraping de dados pessoais sem consentimento

## Performance

### Otimizações

1. **Connection Pooling**
```python
session = requests.Session()
adapter = requests.adapters.HTTPAdapter(pool_connections=10)
session.mount('http://', adapter)
```

2. **Caching**
- Não fazer scraping do mesmo URL múltiplas vezes
- Implementar cache local com TTL

3. **Async para Múltiplos URLs**
```python
import asyncio
import aiohttp

async def fetch_many(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_one(session, url) for url in urls]
        return await asyncio.gather(*tasks)
```

## Referências

- [Trafilatura Documentation](https://trafilatura.readthedocs.io/)
- [BeautifulSoup Documentation](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)
- [robots.txt Specification](https://www.robotstxt.org/)
- [Schema.org Reference](https://schema.org/)

#galaxy-codex