---
description: Download e transcrição de vídeos/podcasts com Media_Harvester
---

## Comandos Disponíveis

### `/media-harvester single "URL"`
Download de vídeo único do YouTube ou outras plataformas

**Opções:**
- `--clone NAME` - Nome do clone (ex: david_goggins)
- `--type TYPE` - Categoria: auto|interviews|podcasts|lectures|shorts
- `--output DIR` - Diretório de saída customizado
- `--language LANG` - Idioma preferido (default: en)
- `--model SIZE` - Modelo Whisper: tiny|base|small|medium|large
- `--no-subtitles` - Forçar uso de Whisper (ignorar legendas)

**Exemplo:**
```bash
/media-harvester single "https://youtube.com/watch?v=5tSTk1083VY" --clone david_goggins --type interviews
```

---

### `/media-harvester search "QUERY"`
Busca no YouTube e download em batch

**Opções:**
- `--max N` - Máximo de resultados (default: 10)
- `--clone NAME` - Nome do clone
- `--type TYPE` - Categoria
- `--language LANG` - Idioma
- `--model SIZE` - Modelo Whisper

**Exemplo:**
```bash
/media-harvester search "David Goggins interview" --max 10 --clone david_goggins
```

---

### `/media-harvester playlist "URL"`
Download de playlist completa

**Opções:**
- `--clone NAME` - Nome do clone
- `--type TYPE` - Categoria
- `--language LANG` - Idioma
- `--model SIZE` - Modelo Whisper

**Exemplo:**
```bash
/media-harvester playlist "https://youtube.com/playlist?list=xxx" --clone elon_musk --type podcasts
```

---

### `/media-harvester transcribe "arquivo"`
Transcrever arquivo local (mp3, mp4, wav, etc)

**Opções:**
- `--output DIR` - Diretório de saída (default: ./transcripts)
- `--language LANG` - Idioma do áudio
- `--model SIZE` - Modelo Whisper

**Exemplo:**
```bash
/media-harvester transcribe "audio.mp3" --output ./transcripts
```

---

## Workflow de Execução

1. **Analisar comando do usuário:**
   - Identificar subcomando: `single`, `search`, `playlist`, ou `transcribe`
   - Extrair URL/query e opções

2. **Verificar dependências (primeira execução):**
   ```bash
   # Verificar FFmpeg
   ffmpeg -version
   
   # Se não instalado, instruir:
   # Windows: winget install ffmpeg
   # macOS: brew install ffmpeg
   
   # Verificar Python packages
   pip list | grep "yt-dlp\|faster-whisper\|ffmpeg-python"
   ```

3. **Executar script:**
   ```bash
   cd Z_Squad/outputs/Media_Harvester/05_production/scripts
   python harvest.py [subcomando] [argumentos]
   ```

4. **Monitorar saída:**
   - Download progress
   - Transcription progress
   - Erros/avisos

5. **Retornar resultado:**
   - Caminho dos arquivos gerados
   - Summary (para batch operations)
   - Estatísticas (tempo, tamanho, etc)

---

## Estrutura de Output

### Para Clones
```
El_Clonador/clones/{clone}/1_raw_data/youtube/{tipo}/
├── {titulo}_{id}.md
└── _BATCH_SUMMARY.md (para batch)
```

### Para Transcrições Standalone
```
{output_dir}/
└── {filename}.transcript.md
```

---

## Prioridade de Transcrição

1. **Legendas manuais do YouTube** (maior qualidade)
2. **Legendas auto-geradas** (se idioma correto)
3. **Whisper local** (fallback universal)

---

## Modelos Whisper Recomendados

| Modelo | VRAM | Velocidade | Uso |
|--------|------|------------|-----|
| tiny | ~1GB | 32x | Testes rápidos |
| base | ~1GB | 16x | Qualidade básica |
| small | ~2GB | 6x | Boa qualidade |
| **medium** | ~5GB | 2x | **Recomendado** |
| large | ~10GB | 1x | Máxima qualidade |

---

## Troubleshooting

### "ffmpeg not found"
```bash
# Windows
winget install ffmpeg

# macOS
brew install ffmpeg

# Verificar
ffmpeg -version
```

### "yt-dlp não instalado"
```bash
pip install yt-dlp faster-whisper ffmpeg-python
```

### Transcrição muito lenta
- Usar modelo menor: `--model small`
- Priorizar legendas: remover `--no-subtitles`
- Verificar se GPU está disponível

### "CUDA out of memory"
- Usar modelo menor: `--model small` ou `--model base`
- Script faz fallback automático para CPU

---

## Integração com Clone_Factory

O Media_Harvester alimenta a **Fase 1 (Coleta)** do Clone_Factory:

```
Clone_Factory Pipeline:
  C1_Hunter (busca fontes)
    → Media_Harvester (baixa e transcreve) ✅
      → C2_Extractor (analisa)
        → C3_Creator (gera clone)
```

---

## Notas Importantes

- ⚠️ **Respeitar copyright**: Usar apenas para uso pessoal/educacional
- ⚠️ **Verificar espaço em disco**: Vídeos podem ser grandes
- ⚠️ **GPU acelera 4x**: Recomendado para batch processing
- ✅ **Dual output**: Sempre gera arquivo de transcrição + metadados

---

## Exemplos Práticos

### Criar base para clone do Tim Ferriss
```bash
/media-harvester search "Tim Ferriss podcast interview" --max 15 --clone tim_ferriss --type podcasts
```

### Download de palestra específica
```bash
/media-harvester single "https://youtube.com/watch?v=xxx" --clone naval_ravikant --type lectures --language en
```

### Transcrever arquivo local para Codex
```bash
/media-harvester transcribe "reuniao_estrategica.mp4" --output ./00_Codex/transcricoes --language pt
```
