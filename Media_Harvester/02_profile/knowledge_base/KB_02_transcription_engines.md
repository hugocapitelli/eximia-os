---
title: "KB_02 - Transcription Engines"
galaxy: "TOOLS"
galaxy-color: "#FFD700"
document-type: "knowledge-base"
status: "documented"
created-date: "2026-02-02"
last-updated: "2026-02-02"
keywords:
  - "kb-02-transcription-engines"
  - "kb_02 - transcription engines"
  - "visão geral"
  - "1. openai whisper (local)"
  - "o que é"
  - "instalação"
  - "básico"
  - "com dependências de áudio"
  - "ffmpeg (necessário)"
  - "windows: winget install ffmpeg"
tags:
  - "galaxy-tools"
  - "knowledge-base"
---

# KB_02 - Transcription Engines

## Visão Geral

Comparativo e guia de uso das principais engines de transcrição disponíveis.

---

## 1. OpenAI Whisper (Local)

### O que é
Modelo de speech-to-text open-source da OpenAI. Roda localmente, gratuito, suporta 99 idiomas.

### Instalação

```bash
# Básico
pip install openai-whisper

# Com dependências de áudio
pip install openai-whisper ffmpeg-python

# FFmpeg (necessário)
# Windows: winget install ffmpeg
# macOS: brew install ffmpeg
# Linux: apt install ffmpeg
```

### Modelos Disponíveis

| Modelo | Parâmetros | VRAM | Velocidade | Qualidade |
|--------|------------|------|------------|-----------|
| tiny | 39M | ~1GB | 32x | Baixa |
| base | 74M | ~1GB | 16x | Razoável |
| small | 244M | ~2GB | 6x | Boa |
| medium | 769M | ~5GB | 2x | Muito boa |
| large | 1550M | ~10GB | 1x | Excelente |
| large-v3 | 1550M | ~10GB | 1x | Melhor |

**Recomendação:** `medium` para balance qualidade/velocidade.

### Uso via CLI

```bash
# Transcrever arquivo
whisper audio.mp3 --model medium --language pt

# Com timestamps
whisper audio.mp3 --model medium --output_format srt

# Especificar output
whisper audio.mp3 --output_dir ./transcripts
```

### Uso via Python

```python
import whisper

model = whisper.load_model("medium")
result = model.transcribe("audio.mp3", language="pt")

print(result["text"])

# Com timestamps
for segment in result["segments"]:
    print(f"[{segment['start']:.2f}s] {segment['text']}")
```

### Outputs Disponíveis
- `.txt` - Texto puro
- `.srt` - Legendas com timestamps
- `.vtt` - WebVTT (web)
- `.json` - Completo com metadados

---

## 2. Faster-Whisper (Recomendado)

### O que é
Reimplementação do Whisper usando CTranslate2. **4x mais rápido** e usa **menos memória**.

### Instalação

```bash
pip install faster-whisper
```

### Uso

```python
from faster_whisper import WhisperModel

# Usar GPU se disponível
model = WhisperModel("medium", device="cuda", compute_type="float16")
# Ou CPU
model = WhisperModel("medium", device="cpu", compute_type="int8")

segments, info = model.transcribe("audio.mp3", language="pt")

print(f"Detected language: {info.language} ({info.language_probability:.2f})")

for segment in segments:
    print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
```

### Vantagens
- 4x mais rápido que Whisper original
- Metade da memória
- Mesma qualidade
- Suporta batching

---

## 3. WhisperX (Com Diarização)

### O que é
Whisper + word-level timestamps + diarização (quem fala). Ideal para entrevistas e podcasts.

### Instalação

```bash
pip install whisperx

# Para diarização, precisa token HuggingFace
# (modelo pyannote requer aceitar termos de uso)
```

### Uso

```python
import whisperx

device = "cuda"
audio_file = "interview.mp3"

# 1. Transcrever
model = whisperx.load_model("medium", device)
result = model.transcribe(audio_file)

# 2. Alinhar palavras
model_a, metadata = whisperx.load_align_model(language_code="en", device=device)
result = whisperx.align(result["segments"], model_a, metadata, audio_file, device)

# 3. Diarizar (quem fala)
diarize_model = whisperx.DiarizationPipeline(use_auth_token="HF_TOKEN")
diarize_segments = diarize_model(audio_file)
result = whisperx.assign_word_speakers(diarize_segments, result)

for segment in result["segments"]:
    print(f"[{segment['speaker']}] {segment['text']}")
```

### Output com Diarização

```
[SPEAKER_00] Welcome to the show. Today we have David Goggins.
[SPEAKER_01] Thanks for having me, man. Let's get after it.
[SPEAKER_00] So tell us about your morning routine.
[SPEAKER_01] I wake up at 4am every single day...
```

---

## 4. Legendas do YouTube (Zero-cost)

### Quando Usar
- Vídeo tem legendas manuais (alta qualidade)
- Vídeo tem legendas auto-geradas (qualidade OK)
- Você quer economizar tempo de processamento

### Como Verificar

```bash
# Listar legendas disponíveis
yt-dlp --list-subs "URL"
```

Output exemplo:
```
Available subtitles:
Language  Formats
en        vtt, ttml, srv3, srv2, srv1, json3
pt        vtt (auto-generated)
```

### Download

```bash
# Legendas manuais
yt-dlp --write-subs --sub-lang en --skip-download "URL"

# Legendas auto-geradas
yt-dlp --write-auto-subs --sub-lang en --skip-download "URL"

# Converter para texto puro
yt-dlp --write-subs --convert-subs srt --skip-download "URL"
```

### Parsing de VTT/SRT

```python
import re

def parse_srt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove timestamps e números
    text = re.sub(r'\d+\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\n', '', content)
    text = re.sub(r'^\d+$', '', text, flags=re.MULTILINE)

    # Limpa linhas vazias
    lines = [line.strip() for line in text.split('\n') if line.strip()]

    return ' '.join(lines)
```

---

## Comparativo de Qualidade

| Engine | WER (en) | WER (pt) | Velocidade | Custo | Diarização |
|--------|----------|----------|------------|-------|------------|
| Whisper large | ~3% | ~5% | 1x | Grátis | Não |
| Faster-Whisper | ~3% | ~5% | 4x | Grátis | Não |
| WhisperX | ~3% | ~5% | 3x | Grátis* | Sim |
| YouTube auto | ~8% | ~12% | Instant | Grátis | Não |
| YouTube manual | ~1% | ~2% | Instant | Grátis | Às vezes |
| AssemblyAI | ~4% | ~6% | 0.3x | $0.37/h | Sim |
| Deepgram | ~5% | ~8% | 0.5x | $0.25/h | Sim |

*WhisperX requer GPU para diarização eficiente

---

## Decisão de Qual Usar

```python
def choose_engine(video_metadata):
    """Lógica de decisão para escolher engine de transcrição."""

    # 1. Priorizar legendas manuais (melhor qualidade)
    if video_metadata.get("manual_subtitles"):
        return "youtube_manual"

    # 2. Se precisa diarização
    if video_metadata.get("type") in ["interview", "podcast"]:
        return "whisperx"

    # 3. Legendas auto OK para vídeos em inglês
    if video_metadata.get("auto_subtitles") and video_metadata.get("language") == "en":
        return "youtube_auto"

    # 4. Default: Faster-Whisper local
    return "faster_whisper"
```

---

## Otimizações de Performance

### GPU (NVIDIA)

```python
# Verificar CUDA disponível
import torch
print(f"CUDA available: {torch.cuda.is_available()}")
print(f"GPU: {torch.cuda.get_device_name(0)}")

# Usar float16 para economia de VRAM
model = WhisperModel("large", device="cuda", compute_type="float16")
```

### CPU (sem GPU)

```python
# Usar quantização int8 para velocidade
model = WhisperModel("medium", device="cpu", compute_type="int8")
```

### Batching

```python
# Processar múltiplos arquivos
from concurrent.futures import ThreadPoolExecutor

def transcribe_file(filepath):
    result = model.transcribe(filepath)
    return filepath, result

with ThreadPoolExecutor(max_workers=3) as executor:
    results = list(executor.map(transcribe_file, audio_files))
```

---

## Troubleshooting

### CUDA out of memory
- Usar modelo menor (medium → small)
- Usar `compute_type="int8"`
- Processar em chunks

### Transcrição lenta
- Verificar se GPU está sendo usada
- Usar faster-whisper ao invés de whisper
- Reduzir qualidade do áudio input

### Idioma errado detectado
- Especificar idioma manualmente: `language="pt"`
- Verificar se áudio tem múltiplos idiomas

### Palavras faltando
- Usar modelo maior
- Verificar qualidade do áudio
- Áudio muito baixo? Normalizar antes

---

## Referências

- [OpenAI Whisper](https://github.com/openai/whisper)
- [Faster-Whisper](https://github.com/guillaumekln/faster-whisper)
- [WhisperX](https://github.com/m-bain/whisperX)
- [AssemblyAI Docs](https://www.assemblyai.com/docs)

#galaxy-tools