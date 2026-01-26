#!/usr/bin/env python3
"""
Interactive Review V2 - Robust Manual Review
Works even without DB/Cloud connection
"""

import sys
import json
import shutil
import time
from pathlib import Path
from datetime import datetime

# Setup Paths
codex_path = Path(__file__).parent
inbox_path = codex_path / "eximia_data" / "00_INBOX"
library_path = codex_path / "eximia_data" / "01_LIBRARY"
local_log_path = library_path / "_local_metadata_log.json"

# Ensure Library Exists
(library_path / "books").mkdir(parents=True, exist_ok=True)

def slugify(text: str) -> str:
    """Simple slugify for filenames"""
    text = text.lower().strip()
    return "".join(c if c.isalnum() else "_" for c in text)

def get_next_id(prefix="book"):
    """Generate simple timestamp-based ID"""
    return f"{prefix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

def save_local_log(entry: dict):
    """Append to local JSON log"""
    data = []
    if local_log_path.exists():
        try:
            with open(local_log_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except:
            data = []
    
    data.append(entry)
    
    with open(local_log_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def main():
    print(f"\n📚 Codex Interactive Review (Robust Mode)\n")
    print(f"📁 Source: {inbox_path}")
    print(f"📁 Target: {library_path}")
    print("="*60)

    files = list(inbox_path.glob("*.pdf"))
    
    if not files:
        print("❌ Nenhum arquivo no INBOX")
        return

    processed = 0
    skipped = 0

    for i, file in enumerate(files, 1):
        print(f"\n\n📖 Conteúdo [{i}/{len(files)}]")
        print("-" * 40)
        print(f"Arquivo: {file.name}")
        try:
            size_mb = file.stat().st_size / (1024*1024)
            print(f"Tamanho: {size_mb:.2f} MB")
        except Exception as e:
            print(f"⚠️ Erro ao ler arquivo: {e}")
            print("Pulando...")
            continue
        
        while True:
            choice = input("\n[A]provar, [D]eletar, [S]kip, [Q]uit: ").upper()
            
            if choice == 'Q':
                print("Encerrando...")
                return
            
            if choice == 'S':
                print("⏩ Pulei.")
                skipped += 1
                break
                
            if choice == 'D':
                confirm = input("❗ Tem certeza? (y/n): ").lower()
                if confirm == 'y':
                    try:
                        file.unlink()
                        print("🗑️ Deletado.")
                    except Exception as e:
                        print(f"❌ Erro ao deletar: {e}")
                break
            
            if choice == 'A':
                # Generate Metadata
                title_input = input(f"Título [{file.stem}]: ").strip()
                title = title_input if title_input else file.stem
                
                author = input("Autor (opcional): ").strip()
                tags_input = input("Tags (sep. virgula): ").strip()
                tags = [t.strip() for t in tags_input.split(',')] if tags_input else []
                
                # Move File
                new_id = get_next_id()
                dest_dir = library_path / "books"
                dest_file = dest_dir / file.name
                
                try:
                    print(f"📦 Movendo para {dest_file.parent.name}...")
                    shutil.move(str(file), str(dest_file))
                    
                    # Log Metadata
                    meta = {
                        "id": new_id,
                        "title": title,
                        "author": author,
                        "type": "book",
                        "tags": tags,
                        "file_path": str(dest_file.relative_to(codex_path)),
                        "original_path": str(file),
                        "processed_at": datetime.now().isoformat()
                    }
                    
                    save_local_log(meta)
                    print(f"✅ Sucesso! ID: {new_id}")
                    processed += 1
                    
                    # Small delay to ensure timestamp diff for IDs
                    time.sleep(1) 
                    
                except Exception as e:
                    print(f"❌ Erro ao mover: {e}")
                
                break

    print("\n" + "="*60)
    print(f"🏁 Fim da revisão.")
    print(f"✅ Processados: {processed}")
    print(f"⏭️  Pulados: {skipped}")
    print(f"📝 Metadata salvo em: {local_log_path.name}")

if __name__ == "__main__":
    main()
