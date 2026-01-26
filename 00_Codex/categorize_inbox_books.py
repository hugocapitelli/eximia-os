#!/usr/bin/env python3
"""
Categorize Books in INBOX
Processes all PDF files already copied to INBOX directory
"""

import sys
import json
import shutil
from pathlib import Path

# Get Codex path
codex_path = Path(__file__).parent
inbox_path = codex_path / "eximia_data" / "00_INBOX"

# Add to Python path
sys.path.insert(0, str(codex_path / "Agentes" / "codex_categorizer"))
sys.path.insert(0, str(codex_path / "scripts"))

try:
    from categorizer import CodexCategorizer
    from database import CodexDatabase
except ImportError as e:
    print(f"❌ Erro ao importar módulos: {e}")
    print(f"\n💡 Listando arquivos em INBOX para review manual:")
    
    if inbox_path.exists():
        pdf_files = list(inbox_path.glob("*.pdf"))
        for i, pdf in enumerate(pdf_files, 1):
            size_mb = pdf.stat().st_size / (1024 * 1024)
            print(f"  {i}. {pdf.name} ({size_mb:.1f} MB)")
        print(f"\n✅ {len(pdf_files)} livros foram copiados para INBOX")
        print(f"📁 Localização: {inbox_path}")
        print(f"\n💡 Use /codex-review para processar estes arquivos")
    sys.exit(0)


def main():
    print(f"📚 Categorizando livros no INBOX...\n")
    
    # Get all PDF files in INBOX
    pdf_files = list(inbox_path.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ Nenhum PDF encontrado em: {inbox_path}")
        return
    
    print(f"📖 Encontrados {len(pdf_files)} PDFs para categorizar:")
    for i, pdf in enumerate(pdf_files, 1):
        size_mb = pdf.stat().st_size / (1024 * 1024)
        print(f"  {i}. {pdf.name} ({size_mb:.1f} MB)")
    
    print(f"\n🚀 Iniciando categorização...\n")
    
    # Initialize components
    categorizer = CodexCategorizer()
    db = CodexDatabase()
    
    # Process each file
    results = []
    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"\n{'='*80}")
        print(f"📖 [{i}/{len(pdf_files)}] Processando: {pdf_file.name}")
        print(f"{'='*80}")
        
        try:
            # Categorize
            print("🤖 Categorizando...")
            result = categorizer.analyze_content(str(pdf_file))
            
            if result['status'] == 'success':
                cat = result['categorization']
                print(f"✅ Tipo detectado: {cat['type']}")
                print(f"   Autor: {cat.get('author', 'N/A')}")
                print(f"   Tags: {', '.join(cat['tags'][:5])}")
                
                # Generate ID  
                temp_id = pdf_file.stem.lower().replace(' ', '-')[:50]
                
                # Save to database
                print("💾 Salvando no database...")
                db.add_content(
                    content_id=temp_id,
                    title=pdf_file.stem,
                    content_type=cat['type'],
                    source_url=f"file:///{str(pdf_file).replace(chr(92), '/')}",
                    author=cat.get('author'),
                    file_path=f"eximia_data/00_INBOX/{pdf_file.name}",
                    tags=cat['tags'],
                    notes=cat.get('summary', '')
                )
                
                results.append({
                    "file": pdf_file.name,
                    "status": "success",
                    "content_id": temp_id,
                    "type": cat['type']
                })
                print("✅ Concluído!")
                
            else:
                print(f"❌ Falha na categorização: {result.get('error', 'Unknown')}")
                results.append({
                    "file": pdf_file.name,
                    "status": "error",
                    "error": result.get('error', 'Categorization failed')
                })
                
        except Exception as e:
            print(f"❌ Erro: {e}")
            results.append({
                "file": pdf_file.name,
                "status": "error",
                "error": str(e)
            })
    
    # Summary
    print(f"\n{'='*80}")
    print(f"📊 RESUMO")
    print(f"{'='*80}")
    
    success_count = sum(1 for r in results if r["status"] == "success")
    error_count = len(results) - success_count
    
    print(f"\n✅ Processados: {success_count}")
    print(f"❌ Erros: {error_count}")
    
    if success_count > 0:
        print(f"\n✅ Livros adicionados ao Codex:")
        for r in results:
            if r["status"] == "success":
                print(f"  • {r['file']} (ID: {r['content_id']}, Tipo: {r['type']})")
    
    if error_count > 0:
        print(f"\n❌ Erros:")
        for r in results:
            if r["status"] != "success":
                print(f"  • {r['file']}: {r.get('error', 'Unknown')}")
    
    print(f"\n💡 Próximo passo: Use /codex-list ou /codex-search para verificar")


if __name__ == "__main__":
    main()
