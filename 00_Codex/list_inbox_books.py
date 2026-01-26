#!/usr/bin/env python3
"""
List Books in INBOX - Simple Status Check
"""

from pathlib import Path

codex_path = Path(__file__).parent
inbox_path = codex_path / "eximia_data" / "00_INBOX"

print("📚 Livros no INBOX do Codex")
print("=" * 80)
print()

if not inbox_path.exists():
    print(f"❌ INBOX não encontrado: {inbox_path}")
    exit(1)

pdf_files = sorted(inbox_path.glob("*.pdf"))

if not pdf_files:
    print("📁 INBOX está vazio (nenhum PDF encontrado)")
else:
    total_size = 0
    print(f"✅ {len(pdf_files)} livros encontrados:")
    print()
    
    for i, pdf in enumerate(pdf_files, 1):
        size_mb = pdf.stat().st_size / (1024 * 1024)
        total_size += pdf.stat().st_size
        print(f"  {i}. {pdf.name}")
        print(f"     Tamanho: {size_mb:.2f} MB")
        print()
    
    total_size_mb = total_size / (1024 * 1024)
    print("=" * 80)
    print(f"📊 Total: {len(pdf_files)} livros | {total_size_mb:.2f} MB")
    print()
    print(f"📁 Localização: {inbox_path}")
    print()
    print("💡 Próximos passos:")
    print("   • Use /codex-review para categorizar e aprovar estes livros")
    print("   • Ou aguarde processamento automático do Codex")
