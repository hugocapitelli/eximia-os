#!/usr/bin/env python3
"""Video Transcriber - 100% Python (SEM FFmpeg!)"""
import os
from pathlib import Path
from typing import Dict, Optional, Literal

try:
    import yt_dlp
except ImportError:
    yt_dlp = None

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None


class VideoTranscriber:
    """Agente de transcrição: yt-dlp + OpenAI Whisper (100% Python)"""
    
    def __init__(self, temp_dir: Optional[Path] = None):
        if temp_dir is None:
            base_path = Path(__file__).parent.parent.parent
            temp_dir = base_path / "temp_audio"
        self.temp_dir = Path(temp_dir)
        self.temp_dir.mkdir(parents=True, exist_ok=True)
    
    def transcribe_video(self, source: str, method: Literal["whisper", "gemini", "google"] = "whisper") -> Dict:
        """Transcreve vídeo usando OpenAI Whisper"""
        try:
            is_url = source.startswith('http')
            
            if is_url:
                platform = self._detect_platform(source)
                print(f"📹 Plataforma: {platform}")
            else:
                platform = "local"
                if not Path(source).exists():
                    return {"status": "error", "message": "Arquivo não encontrado"}
            
            metadata = {}
            if is_url:
                print("📊 Extraindo metadados...")
                metadata = self._extract_metadata(source)
            else:
                metadata = {"title": Path(source).stem}
            
            print("🎵 Baixando áudio em formato compatível...")
            audio_path = self._download_audio_smart(source, is_url)
            
            if not audio_path or not audio_path.exists():
                return {"status": "error", "message": "Falha ao baixar áudio"}
            
            print(f"🤖 Transcrevendo com OpenAI Whisper...")
            transcript, confidence = self._transcribe_whisper(audio_path)
            
            try:
                audio_path.unlink()
            except:
                pass
            
            if not transcript:
                return {"status": "error", "message": "Falha na transcrição"}
            
            return {
                "status": "success",
                "transcript": transcript,
                "metadata": {**metadata, "confidence": confidence, "transcript_method": "whisper", "platform": platform}
            }
        except Exception as e:
            return {"status": "error", "message": f"Erro: {str(e)}"}
    
    def _detect_platform(self, url: str) -> str:
        if 'youtube.com' in url or 'youtu.be' in url:
            return 'youtube'
        return 'other'
    
    def _extract_metadata(self, url: str) -> Dict:
        if yt_dlp is None:
            return {"title": "Unknown"}
        try:
            opts = {'quiet': True, 'no_warnings': True, 'skip_download': True}
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(url, download=False)
                return {"title": info.get('title', 'Unknown'), "author": info.get('uploader', None), "duration": info.get('duration', 0)}
        except:
            return {"title": "Unknown"}
    
    def _download_audio_smart(self, source: str, is_url: bool) -> Optional[Path]:
        """Download inteligente: tenta formatos que Whisper aceita SEM conversão"""
        if not is_url:
            return Path(source)
        if yt_dlp is None:
            return None
        
        try:
            output_base = self.temp_dir / f"audio_{hash(source) % 10000}"
            
            # Tentar baixar formatos nativos que Whisper aceita
            # Ordem de preferência: M4A > MP4 > MP3 > OGG
            formats_to_try = [
                ('bestaudio[ext=m4a]', '.m4a'),
                ('bestaudio[ext=mp4]', '.mp4'),
                ('bestaudio[ext=mp3]', '.mp3'),
                ('bestaudio[ext=ogg]', '.ogg'),
                ('bestaudio', ''),  # Qualquer formato de áudio
            ]
            
            for format_spec, expected_ext in formats_to_try:
                try:
                    print(f"  🔄 Tentando formato: {format_spec}")
                    output_path = output_base.with_suffix(expected_ext) if expected_ext else output_base
                    
                    opts = {
                        'format': format_spec,
                        'outtmpl': str(output_path),
                        'quiet': True,
                        'no_warnings': True,
                    }
                    
                    with yt_dlp.YoutubeDL(opts) as ydl:
                        ydl.download([source])
                    
                    # Procurar arquivo baixado
                    for f in self.temp_dir.glob(f"audio_{hash(source) % 10000}*"):
                        ext = f.suffix.lower()
                        # Verificar se é formato aceito pelo Whisper
                        if ext in ['.mp3', '.mp4', '.m4a', '.wav', '.flac', '.ogg', '.mpeg', '.mpga']:
                            file_size = f.stat().st_size / 1024
                            print(f"  ✅ Baixado: {f.name} ({file_size:.1f}KB)")
                            return f
                    
                except Exception as e:
                    print(f"  ⚠️  {format_spec} falhou: {str(e)[:30]}...")
                    continue
            
            # Se chegou aqui, nenhum formato funcionou
            print("❌ Não foi possível baixar em formato compatível")
            return None
            
        except Exception as e:
            print(f"❌ Erro ao baixar: {e}")
            return None
    
    def _transcribe_whisper(self, audio_path: Path) -> tuple[str, float]:
        """Transcreve usando OpenAI Whisper API"""
        if OpenAI is None:
            print("❌ OpenAI SDK não instalado")
            return ("", 0.0)
        
        try:
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                print("❌ OPENAI_API_KEY não configurada")
                return ("", 0.0)
            
            client = OpenAI(api_key=api_key)
            
            # Verificar tamanho (limite de 25MB)
            file_size_mb = audio_path.stat().st_size / (1024 * 1024)
            if file_size_mb > 25:
                print(f"⚠️  Arquivo muito grande: {file_size_mb:.1f}MB (limite: 25MB)")
                return ("", 0.0)
            
            print(f"📤 Enviando para OpenAI Whisper ({audio_path.suffix}, {file_size_mb:.1f}MB)...")
            with open(audio_path, 'rb') as audio_file:
                transcript = client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="text"
                )
            
            print(f"✅ Transcrição recebida!")
            return (transcript, 0.95)
            
        except Exception as e:
            print(f"❌ Erro Whisper: {e}")
            import traceback
            traceback.print_exc()
            return ("", 0.0)


if __name__ == "__main__":
    t = VideoTranscriber()
    r = t.transcribe_video("https://youtube.com/shorts/TnHFxc3biRc?si=Dz64XjheUGE0cgak")
    if r['status'] == 'success':
        print(f"\n✅ SUCESSO!\n📝 {r['metadata']['title']}\n📄 Transcrição:\n{r['transcript']}")
    else:
        print(f"\n❌ {r['message']}")
