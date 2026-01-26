# KB_01 — Coleta de Vídeos e Transcrições

## Propósito
Documentar os métodos para C1 Hunter coletar e transcrever conteúdo de vídeo da internet.

---

## 1. Métodos de Coleta de Transcrições

### 1.1 Transcrições Automáticas do YouTube

O YouTube gera transcrições automáticas para a maioria dos vídeos. Para acessar:

**Via Web (Manual):**
1. Abrir vídeo no YouTube
2. Clicar nos 3 pontos (...) abaixo do vídeo
3. Selecionar "Mostrar transcrição"
4. Copiar texto completo

**Via API Python (Automático):**
```python
# Instalar: pip install youtube-transcript-api

from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id):
    """
    Obtém transcrição de um vídeo do YouTube
    video_id: ex. 'dQw4w9WgXcQ' (parte após v= na URL)
    """
    try:
        transcript = YouTubeTranscriptApi.get_transcript(
            video_id,
            languages=['en', 'pt']  # Prioriza inglês, fallback português
        )
        # Concatenar todo o texto
        full_text = ' '.join([entry['text'] for entry in transcript])
        return full_text
    except Exception as e:
        print(f"Erro: {e}")
        return None

# Uso
video_id = "5tSTk1083VY"  # JRE #1080 - David Goggins
transcript = get_transcript(video_id)
```

**Via yt-dlp (Linha de Comando):**
```bash
# Instalar: pip install yt-dlp

# Baixar apenas legendas (sem vídeo)
yt-dlp --write-auto-sub --sub-lang en --skip-download "https://youtube.com/watch?v=VIDEO_ID"

# Converter para texto puro
yt-dlp --write-auto-sub --convert-subs srt --skip-download "URL"
```

---

### 1.2 Transcrições Profissionais

Para podcasts populares, buscar transcrições já existentes:

| Fonte | URL | Qualidade |
|-------|-----|-----------|
| **Podscribe** | podscribe.app | Alta (paga) |
| **Rev.com** | rev.com/blog/transcripts | Alta |
| **Podcast Notes** | podcastnotes.org | Média |
| **Summary sites** | Buscar "{podcast name} transcript" | Variável |

---

### 1.3 Whisper AI (Transcrição Local)

Para vídeos sem transcrição disponível:

```python
# Instalar: pip install openai-whisper

import whisper

def transcribe_audio(audio_path):
    """
    Transcreve áudio usando Whisper da OpenAI
    Suporta: mp3, wav, m4a, mp4, etc.
    """
    model = whisper.load_model("base")  # ou "small", "medium", "large"
    result = model.transcribe(audio_path)
    return result["text"]

# Primeiro, baixar áudio do YouTube
# yt-dlp -x --audio-format mp3 "URL"
# Depois transcrever
text = transcribe_audio("video.mp3")
```

---

## 2. Workflow de Coleta de Vídeos

### Passo a Passo

```
1. IDENTIFICAR vídeos relevantes
   └── Buscar: "{nome} podcast", "{nome} interview", "{nome} speech"

2. PRIORIZAR por qualidade
   └── Podcasts longos (1h+) > Entrevistas (30min) > Clips (<10min)

3. VERIFICAR transcrição disponível
   └── YouTube auto-subs? Transcrição profissional existe?

4. COLETAR transcrição
   └── Método automático primeiro, manual se necessário

5. LIMPAR texto
   └── Remover timestamps, [música], [risos], etc.

6. SALVAR em formato padrão
   └── 1_raw_data/youtube/{categoria}/{titulo}_{video_id}.md
```

### Template de Salvamento

```markdown
# {Título do Vídeo}

## Metadata
- **Video ID:** {id}
- **URL:** https://youtube.com/watch?v={id}
- **Canal:** {nome do canal}
- **Data:** {data de publicação}
- **Duração:** {duração}
- **Tipo:** {podcast/interview/lecture}
- **Método de Transcrição:** {auto/manual/whisper}

## Transcrição

{texto completo da transcrição}

## Timestamps-Chave (opcional)

- 00:15:30 — Fala sobre {tópico}
- 01:23:45 — Menciona {conceito importante}
```

---

## 3. Fontes Prioritárias por Plataforma

### YouTube
- Podcasts: JRE, Lex Fridman, Huberman Lab, Tim Ferriss
- Entrevistas em canais de terceiros
- Palestras e keynotes
- Clips curtos (para catchphrases)

### Outras Plataformas
| Plataforma | Como Acessar |
|------------|--------------|
| **Spotify** | Buscar transcrições em sites terceiros |
| **TED Talks** | Transcrições oficiais disponíveis no site |
| **Vimeo** | Sem auto-subs, usar Whisper |
| **Twitter/X** | Baixar vídeos curtos, transcrever |
| **Instagram** | Baixar Reels, transcrever |

---

## 4. Quality Checks

Após coletar transcrição:

- [ ] Texto legível (não apenas timestamps)
- [ ] Identifica quem está falando (se múltiplos speakers)
- [ ] Captura 80%+ do conteúdo (verificar manualmente trecho)
- [ ] Formatado em markdown
- [ ] Metadata completo

---

## 5. Limitações

| Limitação | Workaround |
|-----------|------------|
| Vídeo sem legendas | Usar Whisper |
| Áudio de baixa qualidade | Tentar modelo Whisper "large" |
| Vídeo privado | Buscar entrevistas alternativas |
| Idioma não-inglês | Whisper suporta 99 idiomas |

---

## 6. Integração com The_Veritas

Quando C1 Hunter ativa The_Veritas para pesquisa:

```yaml
veritas_request:
  mode: "video_research"
  target: "{nome do especialista}"
  platforms:
    - youtube
    - ted
    - podcast_sites
  content_types:
    - long_form_podcasts  # 1h+
    - interviews
    - speeches
    - clips
  output:
    - video_urls
    - existing_transcripts
    - summary_of_content
```

The_Veritas retorna URLs e resumos, C1 Hunter coleta transcrições.

---

**Versão:** 1.0
**Clone Factory Module:** C1_Hunter
