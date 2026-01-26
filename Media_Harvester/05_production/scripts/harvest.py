#!/usr/bin/env python3
"""
Media_Harvester - Download e transcrição de vídeos/podcasts
Uso: python harvest.py [comando] [args]

Comandos:
    single   - Download de vídeo único
    search   - Busca e download de múltiplos vídeos
    playlist - Download de playlist inteira
    transcribe - Transcrever arquivo local

Destinos:
    --clone NAME    Salva em Clones/{NAME}/1_raw_data/youtube/
    --codex         Salva em 00_Codex/eximia_data/01_LIBRARY/media/
    --topic TOPIC   (com --codex) Organiza por tópico: media/{topic}/{type}/

Exemplos:
    # Para Clones
    python harvest.py single "URL" --clone david_goggins
    python harvest.py search "Elon Musk interview" --max 5 --clone elon_musk

    # Para Codex (biblioteca geral)
    python harvest.py single "URL" --codex --topic "produtividade"
    python harvest.py search "Naval Ravikant podcast" --max 5 --codex --topic "startups"
    python harvest.py search "Python tutorial" --codex --topic "programacao" --type tutorials
"""

import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict, Any

# Verificar dependências
try:
    import yt_dlp
except ImportError:
    print("ERRO: yt-dlp não instalado. Execute: pip install yt-dlp")
    sys.exit(1)


# =============================================================================
# CONFIGURAÇÃO
# =============================================================================

BASE_DIR = Path(__file__).parent.parent.parent.parent.parent.parent  # Volta para eximIA.OS (6 níveis)
CLONES_DIR = BASE_DIR / "Clones"
CODEX_DIR = BASE_DIR / "00_Codex" / "eximia_data" / "01_LIBRARY" / "media"
DEFAULT_MODEL = "medium"
MAX_RETRIES = 3
TIMEOUT_SECONDS = 1800  # 30 minutos


# =============================================================================
# UTILIDADES
# =============================================================================

def sanitize_filename(title: str, max_length: int = 100) -> str:
    """Remove caracteres inválidos para nome de arquivo."""
    # Caracteres proibidos em Windows
    invalid_chars = r'[<>:"/\\|?*]'
    sanitized = re.sub(invalid_chars, '', title)

    # Limitar tamanho
    if len(sanitized) > max_length:
        sanitized = sanitized[:max_length]

    # Remover espaços extras
    sanitized = ' '.join(sanitized.split())

    return sanitized


def sanitize_topic(topic: str) -> str:
    """Sanitiza nome de tópico para usar como pasta."""
    # Converter para snake_case
    sanitized = topic.lower().strip()
    sanitized = re.sub(r'[^a-z0-9]+', '_', sanitized)
    sanitized = sanitized.strip('_')
    return sanitized


def format_duration(seconds: int) -> str:
    """Formata duração em minutos."""
    minutes = seconds // 60
    return f"{minutes} min"


def categorize_video(metadata: Dict) -> str:
    """Categoriza vídeo por tipo baseado em heurísticas."""
    duration_min = metadata.get("duration", 0) / 60
    title_lower = metadata.get("title", "").lower()

    # Shorts (< 10 min)
    if duration_min < 10:
        return "shorts"

    # Tutorials
    tutorial_keywords = ["tutorial", "how to", "como fazer", "aprenda", "learn", "course", "aula"]
    if any(kw in title_lower for kw in tutorial_keywords):
        return "tutorials"

    # Interviews
    interview_keywords = ["interview", "entrevista", "q&a", "conversation with"]
    if any(kw in title_lower for kw in interview_keywords):
        return "interviews"

    # Podcasts
    podcast_keywords = ["podcast", "episode", "ep.", "#", "joe rogan", "lex fridman", "huberman"]
    if any(kw in title_lower for kw in podcast_keywords):
        return "podcasts"

    # Lectures
    lecture_keywords = ["ted", "talk", "speech", "lecture", "keynote", "palestra", "motivational"]
    if any(kw in title_lower for kw in lecture_keywords):
        return "lectures"

    # Default
    return "podcasts"


def get_output_dir(clone_name: str = None, codex: bool = False, topic: str = None, category: str = "podcasts") -> Path:
    """Retorna diretório de saída baseado no destino."""
    if codex:
        if topic:
            return CODEX_DIR / sanitize_topic(topic) / category
        else:
            return CODEX_DIR / category
    elif clone_name:
        return CLONES_DIR / clone_name / "1_raw_data" / "youtube" / category
    else:
        return Path("./output") / category


# =============================================================================
# DOWNLOAD
# =============================================================================

def get_video_info(url: str) -> Optional[Dict]:
    """Extrai metadados do vídeo sem baixar."""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return info
    except Exception as e:
        print(f"Erro ao extrair info: {e}")
        return None


def get_subtitles(url: str, language: str = "en") -> Optional[str]:
    """Tenta baixar legendas do YouTube."""
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'writesubtitles': True,
        'writeautomaticsub': True,
        'subtitleslangs': [language, 'pt', 'en'],
        'skip_download': True,
        'outtmpl': '%(id)s',
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

            # Verificar legendas manuais primeiro
            if info.get('subtitles'):
                for lang in [language, 'en', 'pt']:
                    if lang in info['subtitles']:
                        print(f"  Legendas manuais encontradas ({lang})")
                        return extract_subtitle_text(info['subtitles'][lang])

            # Fallback para auto-geradas
            if info.get('automatic_captions'):
                for lang in [language, 'en', 'pt']:
                    if lang in info['automatic_captions']:
                        print(f"  Legendas auto-geradas encontradas ({lang})")
                        return extract_subtitle_text(info['automatic_captions'][lang])

            return None
    except Exception as e:
        print(f"  Erro ao buscar legendas: {e}")
        return None


def extract_subtitle_text(subtitle_data: List[Dict], max_retries: int = 3) -> Optional[str]:
    """Extrai texto das legendas de vários formatos com retry."""
    import urllib.request
    import urllib.error

    # Tentar cada formato disponível
    for fmt in subtitle_data:
        ext = fmt.get('ext', '')
        url = fmt.get('url', '')

        if not url:
            continue

        # Retry com backoff exponencial
        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    wait_time = 2 ** attempt  # 2, 4, 8 segundos
                    print(f"    Retry {attempt + 1}/{max_retries} após {wait_time}s...")
                    time.sleep(wait_time)

                response = urllib.request.urlopen(url, timeout=30)
                content = response.read().decode('utf-8')
                break  # Sucesso, sai do retry loop

            except urllib.error.HTTPError as e:
                if e.code == 429:  # Rate limited
                    if attempt < max_retries - 1:
                        continue  # Tenta novamente
                    print(f"    Rate limited (429) após {max_retries} tentativas")
                    continue  # Tenta próximo formato
                raise  # Outro erro HTTP
            except Exception as e:
                if attempt < max_retries - 1:
                    continue
                raise
        else:
            continue  # Todos os retries falharam, tenta próximo formato

        try:

            # JSON3 format (YouTube)
            if ext == 'json3':
                data = json.loads(content)
                texts = []
                for event in data.get('events', []):
                    if 'segs' in event:
                        for seg in event['segs']:
                            if 'utf8' in seg:
                                texts.append(seg['utf8'])
                if texts:
                    return ' '.join(texts).strip()

            # VTT format
            elif ext == 'vtt':
                lines = content.split('\n')
                texts = []
                for line in lines:
                    line = line.strip()
                    # Ignorar headers, timestamps e linhas vazias
                    if not line or line.startswith('WEBVTT') or '-->' in line or line.isdigit():
                        continue
                    # Remover tags HTML
                    clean_line = re.sub(r'<[^>]+>', '', line)
                    if clean_line:
                        texts.append(clean_line)
                if texts:
                    return ' '.join(texts).strip()

            # SRV3 format (outro formato do YouTube)
            elif ext in ['srv3', 'srv2', 'srv1']:
                # Parse como XML
                import xml.etree.ElementTree as ET
                root = ET.fromstring(content)
                texts = []
                for elem in root.iter():
                    if elem.text:
                        texts.append(elem.text.strip())
                if texts:
                    return ' '.join(texts).strip()

            # TTML format
            elif ext == 'ttml':
                import xml.etree.ElementTree as ET
                root = ET.fromstring(content)
                texts = []
                # Namespace handling
                ns = {'tt': 'http://www.w3.org/ns/ttml'}
                for p in root.findall('.//tt:p', ns):
                    if p.text:
                        texts.append(p.text.strip())
                # Fallback sem namespace
                if not texts:
                    for p in root.iter():
                        if p.text and p.text.strip():
                            texts.append(p.text.strip())
                if texts:
                    return ' '.join(texts).strip()

        except Exception as e:
            print(f"    Erro ao extrair formato {ext}: {e}")
            continue

    return None


def download_audio(url: str, output_path: Path) -> Optional[Path]:
    """Baixa apenas áudio do vídeo."""
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '128',
        }],
        'outtmpl': str(output_path / '%(id)s.%(ext)s'),
        'quiet': True,
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            audio_file = output_path / f"{info['id']}.mp3"
            return audio_file if audio_file.exists() else None
    except Exception as e:
        print(f"  Erro no download: {e}")
        return None


# =============================================================================
# TRANSCRIÇÃO
# =============================================================================

def transcribe_with_whisper(audio_path: Path, model: str = "medium", language: str = None) -> Optional[str]:
    """Transcreve áudio usando Whisper."""

    # Tentar faster-whisper primeiro (mais rápido, usa ctranslate2)
    try:
        from faster_whisper import WhisperModel

        # Detectar dispositivo - faster_whisper pode rodar sem torch
        device = "cpu"
        compute_type = "int8"

        # Tentar detectar CUDA via torch se disponível
        try:
            import torch
            if torch.cuda.is_available():
                device = "cuda"
                compute_type = "float16"
        except ImportError:
            pass  # Sem torch, usa CPU

        print(f"  Usando faster-whisper ({model}) em {device}")

        model_instance = WhisperModel(model, device=device, compute_type=compute_type)
        segments, info = model_instance.transcribe(
            str(audio_path),
            language=language,
            beam_size=5
        )

        texts = [segment.text for segment in segments]
        return ' '.join(texts)

    except ImportError as e:
        print(f"  faster-whisper não disponível: {e}")
    except Exception as e:
        print(f"  Erro em faster-whisper: {e}")

    # Fallback para whisper original (OpenAI)
    try:
        import whisper

        print(f"  Usando whisper original ({model})")

        model_instance = whisper.load_model(model)
        result = model_instance.transcribe(
            str(audio_path),
            language=language
        )

        return result["text"]

    except ImportError:
        print("  ERRO: Nenhum motor Whisper disponível!")
        print("  Instale: pip install faster-whisper")
        print("  Ou: pip install openai-whisper")
        return None
    except Exception as e:
        print(f"  Erro na transcrição: {e}")
        return None


# =============================================================================
# FORMATAÇÃO DE OUTPUT
# =============================================================================

def format_transcript_markdown(
    title: str,
    url: str,
    video_id: str,
    channel: str,
    duration: int,
    language: str,
    transcript_source: str,
    transcript_text: str,
    publish_date: str = None,
    view_count: int = None,
    destination: str = "clone",  # "clone" ou "codex"
    topic: str = None
) -> str:
    """Formata transcrição no padrão Markdown do eximIA.OS."""

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    md = f"""# {title}

**URL:** {url}
**Video ID:** {video_id}
**Canal:** {channel}
**Duração:** {format_duration(duration)}
**Idioma:** {language}
**Tipo de Transcrição:** {transcript_source}
**Data de Download:** {now}
"""

    if publish_date:
        md += f"**Data de Publicação:** {publish_date}\n"
    if view_count:
        md += f"**Views:** {view_count:,}\n"
    if topic:
        md += f"**Tópico:** {topic}\n"

    md += f"""
---

## Transcrição

{transcript_text}

---

## Metadados Técnicos

```json
{{
  "video_id": "{video_id}",
  "duration_seconds": {duration},
  "word_count": {len(transcript_text.split())},
  "transcript_source": "{transcript_source}",
  "destination": "{destination}"{f',{chr(10)}  "topic": "{topic}"' if topic else ""}
}}
```

---

<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->

## Obsidian Connections

**Family:** [[{"Codex" if destination == "codex" else "Clones"}]]
{"**Topic:** [[" + topic + "]]" if topic else ""}

<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->
"""

    return md


def generate_batch_summary(
    query: str,
    results: List[Dict],
    output_dir: Path,
    destination: str = "clone",
    topic: str = None
) -> str:
    """Gera _BATCH_SUMMARY.md."""

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    successful = [r for r in results if r.get("success")]
    failed = [r for r in results if not r.get("success")]

    # Contar por tipo de transcrição
    manual = sum(1 for r in successful if r.get("source") == "manual_subtitles")
    auto = sum(1 for r in successful if r.get("source") == "auto_subtitles")
    whisper_count = sum(1 for r in successful if "whisper" in r.get("source", ""))

    total_duration = sum(r.get("duration", 0) for r in successful)

    md = f"""# Media Batch Download Summary

**Search Query:** {query}
**Destination:** {"Codex Library" if destination == "codex" else "Clone Factory"}
{"**Topic:** " + topic if topic else ""}
**Downloaded:** {now}
**Total Duration:** {format_duration(total_duration)}

---

## Statistics

| Metric | Count |
|--------|-------|
| Total videos processed | {len(results)} |
| Transcripts downloaded | {len(successful)} |
| Using manual subtitles | {manual} |
| Using auto-generated | {auto} |
| Using Whisper | {whisper_count} |
| Failed | {len(failed)} |

---

## Downloaded Transcripts

| Title | Duration | Words | Language | Source |
|-------|----------|-------|----------|--------|
"""

    for r in successful:
        title = r.get("title", "Unknown")[:50]
        duration = format_duration(r.get("duration", 0))
        words = r.get("word_count", 0)
        lang = r.get("language", "?")
        source = r.get("source", "?")
        md += f"| {title}... | {duration} | {words} | {lang} | {source} |\n"

    if failed:
        md += """
---

## Failed Downloads

| Title | Reason |
|-------|--------|
"""
        for r in failed:
            title = r.get("title", r.get("url", "Unknown"))[:50]
            error = r.get("error", "Unknown error")
            md += f"| {title} | {error} |\n"

    md += f"""
---

<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->

## Obsidian Connections

**Family:** [[{"Codex" if destination == "codex" else "Clones"}]]
{"**Topic:** [[" + topic + "]]" if topic else ""}

<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->
"""

    return md


# =============================================================================
# COMANDOS PRINCIPAIS
# =============================================================================

def process_single_video(
    url: str,
    clone_name: str = None,
    codex: bool = False,
    topic: str = None,
    category: str = "auto",
    output_dir: Path = None,
    language: str = "en",
    model: str = "medium",
    prefer_subtitles: bool = True
) -> Dict:
    """Processa um único vídeo."""

    print(f"\nProcessando: {url}")

    # Extrair metadados
    info = get_video_info(url)
    if not info:
        return {"success": False, "error": "Não foi possível extrair metadados", "url": url}

    video_id = info.get("id", "unknown")
    title = info.get("title", "Unknown")
    channel = info.get("channel", info.get("uploader", "Unknown"))
    duration = info.get("duration", 0)
    detected_lang = info.get("language", language)

    # Safe print (evita erros de encoding)
    try:
        print(f"  Titulo: {title}")
    except UnicodeEncodeError:
        print(f"  Titulo: {title.encode('ascii', 'ignore').decode()}")
    print(f"  Duracao: {format_duration(duration)}")

    # Determinar categoria se auto
    if category == "auto":
        category = categorize_video(info)
        print(f"  Categoria detectada: {category}")

    # Determinar destino
    destination = "codex" if codex else "clone"
    if codex:
        print(f"  Destino: Codex Library" + (f" (topico: {topic})" if topic else ""))
    elif clone_name:
        print(f"  Destino: Clone {clone_name}")

    # Determinar diretório de saída
    if output_dir:
        out_dir = Path(output_dir)
    else:
        out_dir = get_output_dir(clone_name=clone_name, codex=codex, topic=topic, category=category)

    out_dir.mkdir(parents=True, exist_ok=True)

    # Tentar legendas primeiro
    transcript = None
    source = None

    if prefer_subtitles:
        transcript = get_subtitles(url, language)
        if transcript:
            source = "auto_subtitles"

    # Fallback para Whisper
    if not transcript:
        print("  Baixando audio para transcricao...")
        temp_dir = Path("./temp_audio")
        temp_dir.mkdir(exist_ok=True)

        audio_file = download_audio(url, temp_dir)

        if audio_file:
            print(f"  Transcrevendo com Whisper ({model})...")
            transcript = transcribe_with_whisper(audio_file, model, language)
            source = f"whisper-{model}"

            # Limpar arquivo temporário
            try:
                audio_file.unlink()
            except:
                pass

    if not transcript:
        return {
            "success": False,
            "error": "Não foi possível obter transcrição",
            "url": url,
            "title": title
        }

    # Formatar e salvar
    filename = f"{sanitize_filename(title)}_{video_id}.md"
    filepath = out_dir / filename

    markdown = format_transcript_markdown(
        title=title,
        url=url,
        video_id=video_id,
        channel=channel,
        duration=duration,
        language=detected_lang,
        transcript_source=source,
        transcript_text=transcript,
        publish_date=info.get("upload_date"),
        view_count=info.get("view_count"),
        destination=destination,
        topic=topic
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(markdown)

    print(f"  Salvo: {filepath}")

    return {
        "success": True,
        "path": str(filepath),
        "title": title,
        "video_id": video_id,
        "duration": duration,
        "word_count": len(transcript.split()),
        "language": detected_lang,
        "source": source
    }


def search_and_download(
    query: str,
    max_results: int = 10,
    clone_name: str = None,
    codex: bool = False,
    topic: str = None,
    category: str = "auto",
    **kwargs
) -> List[Dict]:
    """Busca vídeos e baixa transcrições."""

    print(f"\nBuscando: '{query}' (max {max_results})")
    destination = "codex" if codex else "clone"

    # Buscar vídeos
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'force_generic_extractor': False,
    }

    results = []

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        search_results = ydl.extract_info(f"ytsearch{max_results}:{query}", download=False)

        if not search_results or 'entries' not in search_results:
            print("Nenhum resultado encontrado")
            return results

        entries = search_results['entries']
        print(f"Encontrados: {len(entries)} videos\n")

        for i, entry in enumerate(entries, 1):
            url = entry.get('url') or f"https://youtube.com/watch?v={entry.get('id')}"
            # Safe print
            try:
                print(f"[{i}/{len(entries)}] {entry.get('title', 'Unknown')[:60]}...")
            except UnicodeEncodeError:
                print(f"[{i}/{len(entries)}] (titulo com caracteres especiais)")

            result = process_single_video(
                url=url,
                clone_name=clone_name,
                codex=codex,
                topic=topic,
                category=category,
                **kwargs
            )
            results.append(result)

    # Gerar batch summary
    if results:
        if category == "auto":
            # Usar categoria mais comum
            categories = [categorize_video({"title": r.get("title", ""), "duration": r.get("duration", 600)})
                         for r in results if r.get("success")]
            category = max(set(categories), key=categories.count) if categories else "podcasts"

        out_dir = get_output_dir(clone_name=clone_name, codex=codex, topic=topic, category=category)
        summary = generate_batch_summary(query, results, out_dir, destination=destination, topic=topic)
        summary_path = out_dir / "_BATCH_SUMMARY.md"

        with open(summary_path, "w", encoding="utf-8") as f:
            f.write(summary)

        print(f"\nBatch summary: {summary_path}")

    # Resumo final
    successful = sum(1 for r in results if r.get("success"))
    print(f"\n{'='*50}")
    print(f"COMPLETO: {successful}/{len(results)} videos processados")
    if codex:
        print(f"Destino: Codex Library" + (f" / {topic}" if topic else ""))
    elif clone_name:
        print(f"Destino: Clone {clone_name}")

    return results


def process_playlist(
    url: str,
    clone_name: str = None,
    codex: bool = False,
    topic: str = None,
    category: str = "auto",
    **kwargs
) -> List[Dict]:
    """Processa playlist inteira."""

    print(f"\nProcessando playlist: {url}")

    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
    }

    results = []

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        playlist_info = ydl.extract_info(url, download=False)

        if not playlist_info or 'entries' not in playlist_info:
            print("Erro ao extrair playlist")
            return results

        entries = playlist_info['entries']
        print(f"Playlist: {playlist_info.get('title', 'Unknown')}")
        print(f"Total: {len(entries)} videos\n")

        for i, entry in enumerate(entries, 1):
            if not entry:
                continue

            video_url = entry.get('url') or f"https://youtube.com/watch?v={entry.get('id')}"
            print(f"[{i}/{len(entries)}]")

            result = process_single_video(
                url=video_url,
                clone_name=clone_name,
                codex=codex,
                topic=topic,
                category=category,
                **kwargs
            )
            results.append(result)

    return results


def transcribe_local_file(
    filepath: str,
    output_dir: str = None,
    codex: bool = False,
    topic: str = None,
    model: str = "medium",
    language: str = None
) -> Dict:
    """Transcreve arquivo local."""

    filepath = Path(filepath)
    if not filepath.exists():
        return {"success": False, "error": f"Arquivo não encontrado: {filepath}"}

    print(f"\nTranscrevendo: {filepath}")

    transcript = transcribe_with_whisper(filepath, model, language)

    if not transcript:
        return {"success": False, "error": "Falha na transcrição"}

    # Determinar saída
    if output_dir:
        out_dir = Path(output_dir)
    elif codex:
        out_dir = get_output_dir(codex=True, topic=topic, category="transcripts")
    else:
        out_dir = Path("./transcripts")

    out_dir.mkdir(parents=True, exist_ok=True)

    out_file = out_dir / f"{filepath.stem}_transcript.md"

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    destination = "codex" if codex else "local"

    content = f"""# Transcrição: {filepath.name}

**Arquivo:** {filepath}
**Data:** {now}
**Modelo:** whisper-{model}
**Palavras:** {len(transcript.split())}
{"**Tópico:** " + topic if topic else ""}

---

## Transcrição

{transcript}

---

<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->

## Obsidian Connections

**Family:** [[{"Codex" if codex else "Transcripts"}]]
{"**Topic:** [[" + topic + "]]" if topic else ""}

<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->
"""

    with open(out_file, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Salvo: {out_file}")

    return {
        "success": True,
        "path": str(out_file),
        "word_count": len(transcript.split())
    }


# =============================================================================
# CLI
# =============================================================================

def main():
    parser = argparse.ArgumentParser(
        description="Media_Harvester - Download e transcrição de vídeos/podcasts",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemplos:
  # Para Clones (criação de clones digitais)
  python harvest.py single "URL" --clone david_goggins
  python harvest.py search "Elon Musk interview" --max 5 --clone elon_musk

  # Para Codex (biblioteca de conhecimento)
  python harvest.py single "URL" --codex --topic "produtividade"
  python harvest.py search "Naval Ravikant podcast" --max 5 --codex --topic "startups"
  python harvest.py search "Python tutorial" --codex --topic "programacao" --type tutorials

  # Transcrição local
  python harvest.py transcribe "audio.mp3" --codex --topic "reunioes"
        """
    )

    subparsers = parser.add_subparsers(dest="command", help="Comando a executar")

    # Argumentos comuns de destino
    def add_destination_args(p):
        dest_group = p.add_mutually_exclusive_group()
        dest_group.add_argument("--clone", help="Nome do clone (salva em Clones/)")
        dest_group.add_argument("--codex", action="store_true", help="Salvar na biblioteca Codex")
        p.add_argument("--topic", help="Tópico para organização (usado com --codex)")

    # Single
    single_parser = subparsers.add_parser("single", help="Download de vídeo único")
    single_parser.add_argument("url", help="URL do vídeo")
    add_destination_args(single_parser)
    single_parser.add_argument("--type", default="auto", choices=["auto", "interviews", "podcasts", "lectures", "tutorials", "shorts"])
    single_parser.add_argument("--output", help="Diretório de saída customizado")
    single_parser.add_argument("--language", default="en", help="Idioma preferido (pt, en, es...)")
    single_parser.add_argument("--model", default="medium", choices=["tiny", "base", "small", "medium", "large"])
    single_parser.add_argument("--no-subtitles", action="store_true", help="Forçar uso de Whisper")

    # Search
    search_parser = subparsers.add_parser("search", help="Busca e download em batch")
    search_parser.add_argument("query", help="Query de busca")
    search_parser.add_argument("--max", type=int, default=10, help="Máximo de resultados")
    add_destination_args(search_parser)
    search_parser.add_argument("--type", default="auto", choices=["auto", "interviews", "podcasts", "lectures", "tutorials", "shorts"])
    search_parser.add_argument("--language", default="en")
    search_parser.add_argument("--model", default="medium")

    # Playlist
    playlist_parser = subparsers.add_parser("playlist", help="Download de playlist completa")
    playlist_parser.add_argument("url", help="URL da playlist")
    add_destination_args(playlist_parser)
    playlist_parser.add_argument("--type", default="auto")
    playlist_parser.add_argument("--language", default="en")
    playlist_parser.add_argument("--model", default="medium")

    # Transcribe
    transcribe_parser = subparsers.add_parser("transcribe", help="Transcrever arquivo local")
    transcribe_parser.add_argument("file", help="Caminho do arquivo de áudio/vídeo")
    transcribe_parser.add_argument("--output", help="Diretório de saída")
    transcribe_parser.add_argument("--codex", action="store_true", help="Salvar no Codex")
    transcribe_parser.add_argument("--topic", help="Tópico (usado com --codex)")
    transcribe_parser.add_argument("--language", help="Idioma do áudio")
    transcribe_parser.add_argument("--model", default="medium")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    if args.command == "single":
        process_single_video(
            url=args.url,
            clone_name=args.clone,
            codex=args.codex,
            topic=args.topic,
            category=args.type,
            output_dir=args.output,
            language=args.language,
            model=args.model,
            prefer_subtitles=not args.no_subtitles
        )

    elif args.command == "search":
        search_and_download(
            query=args.query,
            max_results=args.max,
            clone_name=args.clone,
            codex=args.codex,
            topic=args.topic,
            category=args.type,
            language=args.language,
            model=args.model
        )

    elif args.command == "playlist":
        process_playlist(
            url=args.url,
            clone_name=args.clone,
            codex=args.codex,
            topic=args.topic,
            category=args.type,
            language=args.language,
            model=args.model
        )

    elif args.command == "transcribe":
        transcribe_local_file(
            filepath=args.file,
            output_dir=args.output,
            codex=args.codex,
            topic=args.topic,
            model=args.model,
            language=args.language
        )


if __name__ == "__main__":
    main()
