#!/usr/bin/env python3
"""
Organize processed files into subfolders (articles/, books/, etc.)
and update database references.
"""

import sys
import shutil
from pathlib import Path

# Setup paths
script_dir = Path(__file__).parent
project_root = script_dir.parent
sys.path.insert(0, str(script_dir))

from database import CodexDatabase

def main():
    db = CodexDatabase()
    processed_dir = project_root / "eximia_data" / "02_PROCESSED"
    
    if not processed_dir.exists():
        print("❌ Processed directory not found")
        return

    # Folder mapping based on Codex standard
    type_folders = {
        "article": "articles",
        "book": "books",
        "research_paper": "papers",
        "podcast": "podcasts",
        "video": "videos",
        "web_page": "web"
    }

    # Iterate over files in the root of 02_PROCESSED
    # We only want files, not existing directories
    files_to_move = [f for f in processed_dir.glob("*.md") if f.is_file()]
    
    print(f"📦 Found {len(files_to_move)} files to organize")
    
    conn = db._get_connection()
    cursor = conn.cursor()
    
    moved_count = 0
    
    for p_file in files_to_move:
        print(f"\n📄 Checking: {p_file.name}")
        
        # 1. Identify original content to determine type
        # Logic similar to integrate_processed.py
        stem = p_file.stem
        for suffix in ["_processed_sonnet", "_processed_ollama", "_processed"]:
            if stem.endswith(suffix):
                stem = stem[:-len(suffix)]
                break
        
        original_name = stem + ".md"
        
        # Search DB for original
        cursor.execute("SELECT * FROM contents WHERE file_path LIKE ?", (f"%{original_name}",))
        row = cursor.fetchone()
        
        if not row:
            print(f"   ⚠️  Original content not found in DB. Skipping.")
            continue
            
        content_type = row['type']
        target_folder = type_folders.get(content_type, "others")
        
        # 2. Create destination directory
        dest_dir = processed_dir / target_folder
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        dest_file = dest_dir / p_file.name
        
        # 3. Move file
        try:
            shutil.move(str(p_file), str(dest_file))
            print(f"   🚚 Moved to: {target_folder}/")
            
            # 4. Update Database (processing_history)
            # Update path in history
            cursor.execute(
                "UPDATE processing_history SET output_path = ? WHERE output_path = ?",
                (str(dest_file), str(p_file))
            )
            if cursor.rowcount > 0:
                print("   ✅ Database updated")
            else:
                print("   ⚠️  No DB history record found to update")
                
            moved_count += 1
            
        except Exception as e:
            print(f"   ❌ Error moving file: {e}")

    conn.commit()
    conn.close()
    
    print(f"\n✨ Organization complete. Moved {moved_count} files.")

if __name__ == "__main__":
    main()
