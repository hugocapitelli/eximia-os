---
title: "KB_01 - Download Strategies"
galaxy: "TOOLS"
galaxy-color: "#FFD700"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-01-download-strategies"
  - "kb_01 - download strategies"
  - "visão geral"
  - "ferramenta principal: yt-dlp"
  - "o que é"
  - "instalação"
  - "via pip (recomendado)"
  - "via winget (windows)"
  - "via brew (macos)"
  - "comandos essenciais"
tags:
  - "galaxy-tools"
  - "knowledge-base"
---

# KB_01 - Download Strategies

## Visão Geral

Este documento descreve as estratégias e ferramentas para download de mídia de diferentes plataformas.

---

## Ferramenta Principal: yt-dlp

### O que é
yt-dlp é um fork do youtube-dl com melhorias significativas de velocidade, features e manutenção ativa. Suporta 1000+ sites.

### Instalação

```bash
# Via pip (recomendado)
pip install yt-dlp

# Via winget (Windows)
winget install yt-dlp

# Via brew (macOS)
brew install yt-dlp
```

### Comandos Essenciais

```bash
# Download básico (melhor qualidade)
yt-dlp "https://youtube.com/watch?v=VIDEO_ID"

# Apenas áudio (MP3)
yt-dlp -x --audio-format mp3 "URL"

# Com legendas
yt-dlp --write-subs --sub-lang en,pt "URL"

# Apenas legendas (sem vídeo)
yt-dlp --skip-download --write-subs "URL"

# Playlist inteira
yt-dlp --yes-playlist "PLAYLIST_URL"

# Metadados em JSON
yt-dlp --dump-json "URL" > metadata.json
```

### Opções Importantes

| Flag | Descrição |
|------|-----------|
| `-x` | Extrai apenas áudio |
| `--audio-format mp3` | Converte para MP3 |
| `--audio-quality 0` | Melhor qualidade de áudio |
| `-f bestaudio` | Seleciona melhor stream de áudio |
| `--write-subs` | Baixa legendas |
| `--sub-lang en` | Especifica idioma da legenda |
| `--write-auto-subs` | Baixa legendas auto-geradas |
| `-o "%(title)s_%(id)s.%(ext)s"` | Template de nome de arquivo |
| `--restrict-filenames` | Remove caracteres especiais |
| `--no-playlist` | Baixa apenas vídeo, não playlist |
| `--playlist-items 1-10` | Baixa itens específicos |
| `--download-archive archive.txt` | Evita re-downloads |

---

## Estratégias por Plataforma

### YouTube

```bash
# Vídeo único com legendas
yt-dlp --write-subs --write-auto-subs --sub-lang en,pt \
       -o "%(title)s_%(id)s.%(ext)s" "URL"

# Canal inteiro (últimos 50)
yt-dlp --playlist-end 50 \
       --download-archive downloaded.txt \
       "https://youtube.com/@CHANNEL/videos"

# Busca e download
yt-dlp "ytsearch10:David Goggins interview"
```

### Vimeo

```bash
# Funciona igual YouTube
yt-dlp "https://vimeo.com/VIDEO_ID"

# Com autenticação (vídeos privados com link)
yt-dlp --referer "https://site-que-embeda.com" "URL"
```

### Spotify (Podcasts)

Requer `spotdl` para áudio:

```bash
pip install spotdl

# Download de episódio
spotdl "https://open.spotify.com/episode/xxx"

# Podcast inteiro
spotdl "https://open.spotify.com/show/xxx"
```

### Twitter/X

```bash
# Vídeos do Twitter
yt-dlp "https://twitter.com/user/status/xxx"
```

### Arquivos Locais

Não requer download, apenas transcrição direta.

---

## Rate Limiting e Boas Práticas

### Evitar Bloqueios

```bash
# Adicionar delays entre downloads
yt-dlp --sleep-interval 5 --max-sleep-interval 30 "URL"

# Usar cookies do navegador (se logado)
yt-dlp --cookies-from-browser chrome "URL"

# Limitar velocidade
yt-dlp --limit-rate 1M "URL"
```

### Arquivo de Downloads

Manter registro para evitar duplicatas:

```bash
# Usa arquivo para tracking
yt-dlp --download-archive archive.txt "URL"
```

O arquivo `archive.txt` contém:
```
youtube VIDEO_ID1
youtube VIDEO_ID2
vimeo VIDEO_ID3
```

---

## Extração de Metadados

### JSON Completo

```bash
yt-dlp --dump-json "URL" | python -m json.tool
```

### Campos Úteis

```python
{
    "id": "VIDEO_ID",
    "title": "Título do vídeo",
    "description": "Descrição completa",
    "duration": 3600,  # segundos
    "upload_date": "20240115",
    "uploader": "Nome do canal",
    "view_count": 1000000,
    "like_count": 50000,
    "channel_url": "https://...",
    "subtitles": {...},
    "automatic_captions": {...}
}
```

---

## Troubleshooting

### Erro: Video unavailable
- Verificar se vídeo existe e está público
- Tentar com VPN se geo-blocked

### Erro: Unable to extract
- Atualizar yt-dlp: `pip install -U yt-dlp`
- Verificar se URL está correta

### Download muito lento
- Usar `--concurrent-fragments 5`
- Verificar conexão de internet

### Legendas não encontradas
- Verificar idiomas disponíveis: `yt-dlp --list-subs "URL"`
- Usar `--write-auto-subs` para auto-geradas

---

## Referências

- [yt-dlp GitHub](https://github.com/yt-dlp/yt-dlp)
- [Supported Sites](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md)
- [spotdl GitHub](https://github.com/spotDL/spotify-downloader)

#galaxy-tools