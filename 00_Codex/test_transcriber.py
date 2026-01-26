#!/usr/bin/env python3
"""
Test do VideoTranscriber com .env loading
"""
import sys
from pathlib import Path

# Carregar .env
from dotenv import load_dotenv
env_path = Path(__file__).parent / "00_Codex" / ".env"
load_dotenv(env_path)

print(f"📁 Carregando .env de: {env_path}")

import os
print(f"🔑 Gemini Key: {os.getenv('GOOGLE_GEMINI_API_KEY')[:20]}..." if os.getenv('GOOGLE_GEMINI_API_KEY') else "❌ Key não encontrada")

# Adicionar paths
project_root = Path(r"c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS")
sys.path.insert(0, str(project_root / "00_Codex" / "Agentes"))

from codex_transcriber.transcriber import VideoTranscriber

# Testar
print("\n🎬 Testando VideoTranscriber...")
transcriber = VideoTranscriber()

url = "https://youtube.com/shorts/TnHFxc3biRc?si=Dz64XjheUGE0cgak"
print(f"\n📹 Processando: {url}\n")

result = transcriber.transcribe_video(url, method="gemini")

if result['status'] == 'success':
    print("\n✅ SUCESSO!\n")
    print(f"📝 Título: {result['metadata']['title']}")
    print(f"⏱️  Duração: {result['metadata'].get('duration', 'N/A')}s")
    print(f"🎯 Confiança: {result['metadata']['confidence']:.2f}")
    print(f"\n📄 Transcrição:")
    print("="*50)
    print(result['transcript'])
    print("="*50)
else:
    print(f"\n❌ ERRO: {result.get('message')}")
