# KB_03 - Output Formats

## Visão Geral

Padrões de formatação de saída para integração com Clone_Factory, Intellex e outros sistemas do eximIA.OS.

---

## Formato Padrão: Markdown

### Estrutura Completa

```markdown
# {Título do Vídeo}

**URL:** {url_original}
**Video ID:** {video_id}
**Canal:** {channel_name}
**Duração:** {minutos} min ({segundos} segundos)
**Idioma:** {language_code} ({language_name})
**Tipo de Transcrição:** {manual|auto-generated|whisper-{model}}
**Data de Publicação:** {YYYY-MM-DD}
**Data de Download:** {YYYY-MM-DD HH:MM:SS}
**Views:** {view_count}

---

## Transcrição

{conteudo_transcrito}

---

## Metadados Técnicos

```json
{
  "video_id": "{id}",
  "duration_seconds": {duration},
  "transcript_entries": {num_entries},
  "word_count": {word_count},
  "processing_time_seconds": {time}
}
```

---

<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->

## Obsidian Connections

**Family:** [[Clones]]
**Related:** [[{clone_name}]]

<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->
```

---

## Naming Convention

### Arquivos de Transcrição

```
{titulo_sanitizado}_{video_id}.md
```

**Regras de Sanitização:**
1. Remover caracteres especiais: `< > : " / \ | ? *`
2. Substituir espaços por underscores ou manter
3. Limitar a 100 caracteres
4. Manter video_id para unicidade

**Exemplos:**
```
Joe Rogan Experience #1080 - David Goggins_5tSTk1083VY.md
How to Build Immense Inner Strength_nDLb8_wgX50.md
```

### Batch Summary

```
_BATCH_SUMMARY.md
```

Sempre com underscore prefix para aparecer no topo da listagem.

---

## Estrutura de Diretórios

### Para Clone_Factory

```
Clones/
└── {clone_name}/
    └── 1_raw_data/
        ├── SOURCES_LIVE.md          # Lista de fontes rastreadas
        ├── PHASE_1_REPORT.md        # Relatório da fase de coleta
        │
        ├── youtube/
        │   ├── _BATCH_SUMMARY.md    # Resumo de todos os downloads
        │   │
        │   ├── interviews/          # Entrevistas longas
        │   │   ├── Joe Rogan Experience #1080_xxx.md
        │   │   └── _BATCH_SUMMARY.md
        │   │
        │   ├── podcasts/            # Aparições em podcasts
        │   │   ├── Lex Fridman #400_xxx.md
        │   │   └── _BATCH_SUMMARY.md
        │   │
        │   ├── lectures/            # Palestras, TEDs, keynotes
        │   │   ├── TED Talk 2022_xxx.md
        │   │   └── _BATCH_SUMMARY.md
        │   │
        │   └── shorts/              # Clips curtos (<10min)
        │       └── _BATCH_SUMMARY.md
        │
        ├── web_searches/            # Pesquisas web
        │   └── query_01_biography.md
        │
        └── social_media/            # Posts de redes sociais
            └── twitter_presence.md
```

### Categorização Automática

```python
def categorize_video(metadata):
    """Categoriza vídeo por tipo baseado em heurísticas."""

    duration_min = metadata["duration"] / 60
    title_lower = metadata["title"].lower()

    # Shorts (< 10 min)
    if duration_min < 10:
        return "shorts"

    # Interviews (palavras-chave)
    interview_keywords = ["interview", "entrevista", "q&a", "conversation with"]
    if any(kw in title_lower for kw in interview_keywords):
        return "interviews"

    # Podcasts
    podcast_keywords = ["podcast", "episode", "ep.", "#", "joe rogan", "lex fridman"]
    if any(kw in title_lower for kw in podcast_keywords):
        return "podcasts"

    # Lectures
    lecture_keywords = ["ted", "talk", "speech", "lecture", "keynote", "palestra"]
    if any(kw in title_lower for kw in lecture_keywords):
        return "lectures"

    # Default: interviews (mais comum para clones)
    return "interviews"
```

---

## Formato do Batch Summary

```markdown
# YouTube Batch Download Summary

**Search Query:** {query_or_playlist}
**Clone:** {clone_name}
**Downloaded:** {YYYY-MM-DD HH:MM:SS}
**Total Duration:** {total_hours}h {total_minutes}min

---

## Statistics

| Metric | Count |
|--------|-------|
| Total videos processed | {total} |
| Transcripts downloaded | {success} |
| Using manual subtitles | {manual} |
| Using auto-generated | {auto} |
| Using Whisper | {whisper} |
| Failed | {failed} |

---

## Downloaded Transcripts

| Title | Duration | Words | Language | Source |
|-------|----------|-------|----------|--------|
| {title_1} | {dur_1} min | {words_1} | {lang_1} | {src_1} |
| {title_2} | {dur_2} min | {words_2} | {lang_2} | {src_2} |
| ... | ... | ... | ... | ... |

---

## Failed Downloads

| Title | Reason |
|-------|--------|
| {title_x} | {error_message} |

---

## Processing Log

- Started: {start_time}
- Finished: {end_time}
- Total time: {elapsed}
- Average per video: {avg_time}

---

<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->

## Obsidian Connections

**Family:** [[Clones]]
**Clone:** [[{clone_name}]]

<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->
```

---

## Formatos Alternativos

### JSON (para processamento programático)

```json
{
  "meta": {
    "video_id": "xxx",
    "title": "Video Title",
    "url": "https://...",
    "channel": "Channel Name",
    "duration_seconds": 3600,
    "language": "en",
    "transcript_source": "whisper-medium",
    "downloaded_at": "2026-01-19T10:30:00Z"
  },
  "transcript": {
    "full_text": "...",
    "segments": [
      {
        "start": 0.0,
        "end": 5.5,
        "text": "Welcome to the show.",
        "speaker": "SPEAKER_00"
      }
    ],
    "word_count": 15000
  },
  "statistics": {
    "processing_time_seconds": 120,
    "entries_count": 500
  }
}
```

### SRT (para legendas)

```
1
00:00:00,000 --> 00:00:05,500
Welcome to the show.

2
00:00:05,500 --> 00:00:10,200
Today we have an incredible guest.
```

### TXT (texto puro)

```
Welcome to the show. Today we have an incredible guest. David Goggins is here to talk about...
```

---

## Validação de Output

### Checklist de Qualidade

```python
def validate_output(filepath):
    """Valida se output está no formato correto."""

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    checks = {
        "has_title": content.startswith("# "),
        "has_url": "**URL:**" in content,
        "has_duration": "**Duração:**" in content,
        "has_language": "**Idioma:**" in content,
        "has_transcript_section": "## Transcrição" in content,
        "has_obsidian_tags": "ORACLE:OBSIDIAN_CONNECTIONS" in content,
        "not_empty_transcript": len(content) > 500,
        "utf8_valid": True  # já passou se chegou aqui
    }

    passed = all(checks.values())
    return passed, checks
```

---

## Integração com Obsidian

### Tags Automáticas

O bloco `ORACLE:OBSIDIAN_CONNECTIONS` permite:
1. Backlinks para o clone pai
2. Navegação entre transcrições relacionadas
3. Queries dinâmicas no Dataview

### Exemplo de Query Dataview

```dataview
TABLE duration, language, transcript_source
FROM "Clones/david_goggins/1_raw_data/youtube"
WHERE file.name != "_BATCH_SUMMARY"
SORT duration DESC
```

---

## Encoding e Caracteres

### Regras
- Sempre UTF-8
- Preservar emojis se presentes na transcrição
- Escapar caracteres Markdown quando necessário (`*`, `_`, `[`, `]`)

### Sanitização de Título

```python
import re

def sanitize_filename(title):
    """Remove caracteres inválidos para nome de arquivo."""

    # Caracteres proibidos em Windows
    invalid_chars = r'[<>:"/\\|?*]'
    sanitized = re.sub(invalid_chars, '', title)

    # Limitar tamanho
    if len(sanitized) > 100:
        sanitized = sanitized[:100]

    # Remover espaços extras
    sanitized = ' '.join(sanitized.split())

    return sanitized
```
