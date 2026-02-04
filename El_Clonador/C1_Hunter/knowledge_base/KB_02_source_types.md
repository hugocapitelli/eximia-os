---
title: "KB_02 — Fontes de Pesquisa por Tipo"
galaxy: "CREATION"
galaxy-color: "#FF8C00"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-source-types"
  - "kb_02 — fontes de pesquisa por"
  - "propósito"
  - "1. vídeo (youtube e outros)"
  - "youtube (prioridade máxima)"
  - "1. buscar vídeos"
  - "2. baixar transcrições"
  - "3. ou via python"
  - "ted talks"
  - "vimeo / outros"
tags:
  - "galaxy-creation"
  - "knowledge-base"
---

# KB_02 — Fontes de Pesquisa por Tipo

## Propósito
Guia de fontes e métodos de acesso para cada tipo de conteúdo.

---

## 1. Vídeo (YouTube e outros)

### YouTube (Prioridade Máxima)

**Podcasts Longos (1h+)**
| Podcast | Busca | Qualidade |
|---------|-------|-----------|
| Joe Rogan Experience | `{nome} site:youtube.com JRE` | ⭐⭐⭐⭐⭐ |
| Lex Fridman | `{nome} Lex Fridman` | ⭐⭐⭐⭐⭐ |
| Huberman Lab | `{nome} Huberman` | ⭐⭐⭐⭐⭐ |
| Tim Ferriss | `{nome} Tim Ferriss` | ⭐⭐⭐⭐⭐ |
| Rich Roll | `{nome} Rich Roll` | ⭐⭐⭐⭐ |
| Impact Theory | `{nome} Impact Theory` | ⭐⭐⭐⭐ |

**Método de Coleta:**
```bash
# 1. Buscar vídeos
yt-dlp --flat-playlist "ytsearch10:{nome} podcast interview"

# 2. Baixar transcrições
yt-dlp --write-auto-sub --skip-download "URL"

# 3. Ou via Python
from youtube_transcript_api import YouTubeTranscriptApi
```

### TED Talks

**Acesso:** ted.com/talks
**Transcrições:** Disponíveis oficialmente
**Busca:** `{nome} site:ted.com`

### Vimeo / Outros

**Método:** Baixar vídeo → Whisper AI
```bash
yt-dlp "URL_VIMEO"
whisper video.mp4 --model base
```

---

## 2. Web Articles

### Tier 1 (Alta Autoridade)

| Tipo | Fontes | Busca |
|------|--------|-------|
| Biografias oficiais | Wikipedia, Britannica | `{nome} biography` |
| Perfis jornalísticos | NYT, WSJ, Guardian | `{nome} profile site:nytimes.com` |
| Entrevistas escritas | Forbes, Inc, Fast Company | `{nome} interview site:forbes.com` |

### Tier 2 (Média-Alta)

| Tipo | Fontes | Busca |
|------|--------|-------|
| Análises | HBR, Medium (autores verificados) | `{nome} analysis` |
| Estudos de caso | Academic, business journals | `{nome} case study` |

### Ferramentas de Coleta

**Via The_Veritas:**
```yaml
query: "{nome} complete biography philosophy"
depth: "deep"
source_tier_min: 2
```

**Via Web Scraping (quando necessário):**
```python
import requests
from bs4 import BeautifulSoup

def scrape_article(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    # Extrair texto principal
    article = soup.find('article') or soup.find('main')
    return article.get_text() if article else None
```

---

## 3. Social Media

### Twitter/X

**Acesso:** Nitter (espelho público) ou API
**Busca:** `from:{handle} since:2023-01-01`
**Coletar:**
- Top tweets (mais engajamento)
- Threads importantes
- Respostas reveladoras

**Ferramenta:**
```bash
# Via snscrape (se disponível)
snscrape --jsonl twitter-user {handle} > tweets.json
```

### Instagram

**Acesso:** Perfil público ou sites de arquivo
**Coletar:**
- Captions de posts
- Legendas de Reels
- Stories arquivados (se disponíveis)

### LinkedIn

**Acesso:** Perfil público
**Coletar:**
- About section
- Posts públicos
- Artigos publicados

---

## 4. Livros

### Acesso a Conteúdo

| Método | Uso |
|--------|-----|
| **Google Books Preview** | Trechos gratuitos |
| **Amazon Look Inside** | Primeiras páginas |
| **Goodreads Quotes** | Citações populares |
| **Resumos** | Blinkist, getAbstract |
| **Audiobook Clips** | YouTube, Audible samples |

**Busca Recomendada:**
```
"{título do livro}" {autor} quotes
"{título do livro}" {autor} summary key points
"{título do livro}" {autor} best chapters
```

---

## 5. Podcasts (Áudio)

### Plataformas com Transcrições

| Plataforma | Transcrição Disponível |
|------------|------------------------|
| Spotify | Sim (recente) |
| Apple Podcasts | Não |
| YouTube (áudio) | Sim (auto-subs) |
| Podcast sites | Alguns têm show notes |

### Método de Coleta

```bash
# 1. Baixar episódio
yt-dlp -x --audio-format mp3 "URL"

# 2. Transcrever com Whisper
whisper episode.mp3 --model medium --language en

# 3. Limpar output
# Remover timestamps, formatar markdown
```

---

## 6. Priorização de Fontes

Para um clone de alta fidelidade, coletar nesta ordem:

```
1. PODCASTS LONGOS (1h+)
   └── Maior profundidade, linguagem natural, histórias pessoais

2. ENTREVISTAS
   └── Perguntas diretas, respostas reveladoras

3. LIVROS/ARTIGOS DO PRÓPRIO ESPECIALISTA
   └── Filosofia estruturada, frameworks

4. SOCIAL MEDIA
   └── Linguagem informal, catchphrases, opiniões rápidas

5. ARTIGOS SOBRE O ESPECIALISTA
   └── Contexto externo, percepção pública
```

---

## 7. Checklist de Cobertura

Para cada fonte coletada:

- [ ] URL/referência salva
- [ ] Conteúdo extraído em texto
- [ ] Formatado em markdown
- [ ] Categorizado (identity/cognition/voice/etc.)
- [ ] Qualidade verificada

---

**Versão:** 1.0
**Clone Factory Module:** C1_Hunter

#galaxy-creation