---
description: Trans crever vídeo (YouTube ou arquivo local) e adicionar ao Codex
---

# Workflow: Transcrever Vídeo

Extrai áudio de vídeos, gera transcrição automática e salva no Codex.

## 📋 Requisitos

### Software Necessário

1. **FFmpeg** (OBRIGATÓRIO)
   - Download: https://ffmpeg.org/download.html
   - Windows: Baixar build e adicionar ao PATH
   - Verificar instalação: `ffmpeg -version`

2. **Python Packages**
   ```bash
   py -m pip install yt-dlp
   py -m pip install openai
   py -m pip install google-generativeai
   ```

### API Keys

**Escolha UMA das opções** (recomendado: Gemini):

- **Gemini** (Recomendado) ✅
  - Configure: `GOOGLE_GEMINI_API_KEY` no `.env`
  - Gratuito dentro dos limites
  - Boa qualidade de transcrição

- **OpenAI Whisper**
  - Configure: `OPENAI_API_KEY` no `.env`  
  - Melhor qualidade, mas pago ($0.006/min)

- **Google Speech-to-Text**
  - Configure: `GOOGLE_APPLICATION_CREDENTIALS`
  - Mais complexo de configurar

## 💻 Uso

### YouTube Videos

```bash
py 00_Codex/Agentes/codex_cli/cli.py add https://youtube.com/watch?v=VIDEO_ID
```

**Exemplo com YouTube Shorts**:
```bash
py 00_Codex/Agentes/codex_cli/cli.py add https://youtube.com/shorts/TnHFxc3biRc
```

### Arquivo Local

Primeiro, implemente o comando no CLI (veja seção Integração), depois:

```bash
py 00_Codex/AgenTES/codex_cli/cli.py transcribe "C:\path\to\video.mp4"
```

## ⚙️ Configuração (Opcional)

No arquivo `00_Codex/.env`:

```bash
# Método padrão de transcrição (gemini, whisper, ou google)
TRANSCRIPTION_DEFAULT_METHOD=gemini

# API Keys
GOOGLE_GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here  # se usar Whisper
```

## 🔧 Integração com CodexCLI

O sistema `VideoTranscriber` foi criado mas ainda precisa ser  integrado ao CLI principal. Para integrar:

1. Rodar o script de integração:
```bash
py "C:\Users\hugoc\.gemini\antigravity\brain\133cfb04-50b8-4de3-86c3-d9df6ad23ee5\integrate_video_transcriber.py"
```

OU manualmente adicionar ao `cli.py`:
- Import: `from codex_transcriber.transcriber import VideoTranscriber`
- No `__init__`: `self.transcriber = VideoTranscriber()`
- Modificar `cmd_add` para detectar vídeos

## 📊 Como Funciona

1. **Detecta** se URL é de vídeo (YouTube, Vimeo, etc)
2. **Baixa áudio** usando yt-dlp
3. **Extrai** para MP3 usando FFmpeg
4. **Transcreve** usando API escolhida (Gemini/Whisper/Google)
5. **Formata** como Markdown estruturado
6. **Categoriza** automaticamente
7. **Salva** no Codex (INBOX → LIBRARY)

## ✨ Output Esperado

```
🎬 Vídeo detectado!
🎵 Extraindo áudio e transcrevendo...
📹 Plataforma detectada: youtube
📊 Extraindo metadados...
🎵 Extraindo áudio...
🤖 Transcrevendo com GEMINI...
✅ Transcrição completa!
   Título: I built this using Cursor AI
   Duração: 42s
   
🤖 Categorizando com IA...
✅ Categorização completa:
   Tipo: video
   Tags: cursor, ai, development, coding
   
📋 Preview:
   ID: i_built_this_using_cursor_ai
   Título: I built this using Cursor AI
   Transcrição: This is what I built using Cursor AI...
   
✅ Aprovar e adicionar à biblioteca? (s/N): s

☁️ Sincronizando com a Nuvem...
   ✅ Upload concluído
💾 Salvando no database...
✅ Vídeo adicionado com sucesso!
   ID: i_built_this_using_cursor_ai
   Status: inbox
```

## 🛠️ Troubleshooting

### Erro: "FFmpeg não encontrado"
- Instale FFmpeg: https://ffmpeg.org/download.html
- Adicione ao PATH do sistema
- Reinicie o terminal

### Erro: "API key not valid"
- Verifique se a key está no `.env`
- Confirme que a key está ativa no console da API

### Erro: "yt-dlp não instalado"
```bash
py -m pip install yt-dlp
```

## 🚀 Próximos Passos

1. **Instalar FFmpeg**
2. **Configurar API key** (Gemini recomendado)
3. **Rodar script de integração** (se ainda não integrado)
4. **Testar** com um vídeo do YouTube
