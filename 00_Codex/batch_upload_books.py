#!/usr/bin/env python3
"""
Batch Upload Books to Codex
Uploads all PDF files from Downloads\Books directory
"""

import sys
from pathlib import Path

# Add Codex CLI to path
codex_path = Path(__file__).parent
sys.path.insert(0, str(codex_path / "Agentes" / "codex_cli"))

from cli import CodexCLI


def main():
    books_dir = Path(r"C:\Users\hugoc\Downloads\Books")
    
    if not books_dir.exists():
        print(f"❌ Diretório não encontrado: {books_dir}")
        return
    
    # Get all PDF files
    pdf_files = list(books_dir.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ Nenhum arquivo PDF encontrado em: {books_dir}")
        return
    
    print(f"📚 Encontrados {len(pdf_files)} livros para upload:")
    for i, pdf in enumerate(pdf_files, 1):
        size_mb = pdf.stat().st_size / (1024 * 1024)
        print(f"  {i}. {pdf.name} ({size_mb:.1f} MB)")
    
    print(f"\n🚀 Iniciando upload em lote...\n")
    
    # Initialize Codex CLI
    cli = CodexCLI()
    
    # Upload each file
    results = []
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"\n{'='*80}")
        print(f"📖 [{i}/{len(pdf_files)}] Processando: {pdf_file.name}")
        print(f"{'='*80}")
        
        try:
            result = cli.cmd_upload(str(pdf_file))
            results.append({
                "file": pdf_file.name,
                "status": result.get("status"),
                "content_id": result.get("content_id")
            })
        except Exception as e:
            print(f"❌ Erro ao processar {pdf_file.name}: {e}")
            results.append({
                "file": pdf_file.name,
                "status": "error",
                "error": str(e)
            })
    
    # Summary
    print(f"\n{'='*80}")
    print(f"📊 RESUMO DO UPLOAD")
    print(f"{'='*80}")
    
    success_count = sum(1 for r in results if r["status"] == "success")
    error_count = len(results) - success_count
    
    print(f"\n✅ Sucessos: {success_count}")
    print(f"❌ Erros: {error_count}")
    
    if success_count > 0:
        print(f"\n✅ Livros adicionados ao INBOX:")
        for r in results:
            if r["status"] == "success":
                print(f"  • {r['file']} (ID: {r['content_id']})")
    
    if error_count > 0:
        print(f"\n❌ Erros:")
        for r in results:
            if r["status"] != "success":
                print(f"  • {r['file']}: {r.get('error', 'Unknown error')}")
    
    print(f"\n💡 Próximo passo: Execute /codex-review para aprovar os conteúdos")


if __name__ == "__main__":
    main()
