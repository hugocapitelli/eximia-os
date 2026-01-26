# Media_Harvester

> Agente especializado em download e transcrição de vídeos/podcasts para alimentar pipelines de clones e agentes do eximIA.OS.

## Quick Start

### 1. Instalar Dependências

```bash
# FFmpeg (necessário)
winget install ffmpeg  # Windows
brew install ffmpeg    # macOS

# Python packages
pip install yt-dlp faster-whisper ffmpeg-python
```

### 2. Usar

```bash
cd Z_Squad/outputs/Media_Harvester/05_production/scripts

# Download único
python harvest.py single "https://youtube.com/watch?v=5tSTk1083VY" \
  --clone david_goggins --type interviews

# Busca e download
python harvest.py search "David Goggins interview" \
  --max 10 --clone david_goggins

# Playlist inteira
python harvest.py playlist "https://youtube.com/playlist?list=xxx" \
  --clone elon_musk --type podcasts

# Transcrever arquivo local
python harvest.py transcribe "audio.mp3" --output ./transcripts
```

---

## Estrutura do Agente

```
Media_Harvester/
├── README.md                 # Este arquivo
├── 01_spec/
│   └── spec_tecnica.json    # Especificação técnica (Z1)
├── 02_profile/
│   ├── dna_mental.md        # Personalidade e princípios (Z2)
│   └── knowledge_base/
│       ├── KB_01_download_strategies.md
│       ├── KB_02_transcription_engines.md
│       └── KB_03_output_formats.md
├── 03_prompt/
│   ├── prompt_operacional.md # System prompt (Z3)
│   └── schemas/
│       ├── input_schema.json
│       └── output_schema.json
├── 04_validation/
│   └── validation_report.md  # Relatório de validação (Z4)
└── 05_production/
    └── scripts/
        ├── harvest.py        # Script principal
        └── requirements.txt  # Dependências
```

---

## Comandos Disponíveis

### `single` - Download de vídeo único

```bash
python harvest.py single "URL" [opções]

Opções:
  --clone NAME      Nome do clone (ex: david_goggins)
  --type TYPE       Categoria: auto|interviews|podcasts|lectures|shorts
  --output DIR      Diretório de saída customizado
  --language LANG   Idioma preferido (default: en)
  --model SIZE      Modelo Whisper: tiny|base|small|medium|large
  --no-subtitles    Forçar uso de Whisper (ignorar legendas)
```

### `search` - Busca e download em batch

```bash
python harvest.py search "QUERY" [opções]

Opções:
  --max N           Máximo de resultados (default: 10)
  --clone NAME      Nome do clone
  --type TYPE       Categoria
  --language LANG   Idioma
  --model SIZE      Modelo Whisper
```

### `playlist` - Download de playlist

```bash
python harvest.py playlist "PLAYLIST_URL" [opções]

Opções:
  --clone NAME      Nome do clone
  --type TYPE       Categoria
  --language LANG   Idioma
  --model SIZE      Modelo Whisper
```

### `transcribe` - Arquivo local

```bash
python harvest.py transcribe "arquivo.mp3" [opções]

Opções:
  --output DIR      Diretório de saída (default: ./transcripts)
  --language LANG   Idioma do áudio
  --model SIZE      Modelo Whisper
```

---

## Estrutura de Output

### Transcrição Individual

```
Clones/{clone}/1_raw_data/youtube/{tipo}/{titulo}_{id}.md
```

Exemplo:
```
Clones/david_goggins/1_raw_data/youtube/interviews/
└── Joe Rogan Experience #1080 - David Goggins_5tSTk1083VY.md
```

### Batch Summary

```
Clones/{clone}/1_raw_data/youtube/{tipo}/_BATCH_SUMMARY.md
```

---

## Prioridade de Transcrição

1. **Legendas manuais do YouTube** (maior qualidade)
2. **Legendas auto-geradas** (se idioma correto)
3. **Whisper local** (fallback universal)

---

## Modelos Whisper

| Modelo | VRAM | Velocidade | Qualidade |
|--------|------|------------|-----------|
| tiny | ~1GB | 32x | Baixa |
| base | ~1GB | 16x | Razoável |
| small | ~2GB | 6x | Boa |
| **medium** | ~5GB | 2x | **Muito boa** |
| large | ~10GB | 1x | Excelente |

**Recomendação:** Use `medium` para balance qualidade/velocidade.

---

## GPU vs CPU

Com **GPU NVIDIA**:
```bash
pip install torch --index-url https://download.pytorch.org/whl/cu118
```
→ 4x mais rápido

Sem GPU:
→ Funciona, mas mais lento (~10-15min para cada 10min de áudio)

---

## Exemplos de Uso

### Criar base para clone do David Goggins

```bash
# Baixar principais entrevistas
python harvest.py search "David Goggins interview full" \
  --max 10 --clone david_goggins --type interviews

# Baixar podcasts
python harvest.py search "David Goggins podcast" \
  --max 10 --clone david_goggins --type podcasts

# Baixar motivacionais
python harvest.py search "David Goggins motivational speech" \
  --max 5 --clone david_goggins --type lectures
```

### Criar base para clone do Elon Musk

```bash
python harvest.py search "Elon Musk interview 2024" \
  --max 10 --clone elon_musk --type interviews

python harvest.py single "https://youtube.com/watch?v=xxx" \
  --clone elon_musk --type podcasts
```

---

## Troubleshooting

### "yt-dlp não instalado"
```bash
pip install yt-dlp
```

### "ffmpeg not found"
```bash
winget install ffmpeg  # Windows
brew install ffmpeg    # macOS
```

### Transcrição muito lenta
- Usar modelo menor: `--model small`
- Verificar se GPU está ativa
- Priorizar legendas: remover `--no-subtitles`

### "CUDA out of memory"
- Usar modelo menor
- Script faz fallback automático para CPU

### Vídeo não disponível
- Verificar se URL está correta
- Vídeo pode ser privado ou geo-blocked

---

## Integração com Clone_Factory

O Media_Harvester é projetado para alimentar a **Fase 1 (Coleta)** do Clone_Factory:

```
Clone_Factory Pipeline:
  C1_Hunter (busca fontes)
    → Media_Harvester (baixa e transcreve) ✅
      → C2_Extractor (analisa)
        → C3_Creator (gera clone)
```

---

## Changelog

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0.0 | 2026-01-19 | Versão inicial |

---

## Suporte

- **Documentação:** Ver `02_profile/knowledge_base/`
- **Issues:** Reportar no repositório eximIA.OS
- **Criador:** Z_Squad Pipeline

---

## Licença

Uso interno eximIA Ventures. Não redistribuir conteúdo baixado.
