import os
import shutil
import json
import re
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path(r"c:\Users\hugoc\OneDrive\Área de Trabalho\exímIA Ventures\eximIA.OS\00_Codex\eximia_data")
INBOX_DIR = BASE_DIR / "00_INBOX"
LIBRARY_DIR = BASE_DIR / "01_LIBRARY"
LOG_FILE = LIBRARY_DIR / "_local_metadata_log.json"

# Type Mappings (CLI -> Directory)
TYPE_MAP = {
    "article": "articles",
    "book": "books",
    "research_paper": "research_papers",  # Corrected dir name
    "podcast": "podcasts",
    "video": "videos",
    "web_page": "web_pages", # Corrected dir name
    "other": "articles" # Fallback
}

def load_log():
    if LOG_FILE.exists():
        try:
            with open(LOG_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except:
            return []
    return []

def save_log(log_data):
    with open(LOG_FILE, 'w', encoding='utf-8') as f:
        json.dump(log_data, f, indent=2, ensure_ascii=False)

def get_frontmatter_info(file_path):
    """Extract type and title from frontmatter"""
    try:
        content = file_path.read_text(encoding='utf-8')
        match = re.search(r'^---\s+(.*?)\s+---', content, re.DOTALL)
        if match:
            fm = match.group(1)
            type_match = re.search(r'type:\s*(.*)', fm)
            title_match = re.search(r'title:\s*(.*)', fm)
            author_match = re.search(r'author:\s*(.*)', fm)
            tags_match = re.search(r'tags:\s*\[(.*?)\]', fm, re.DOTALL)
            
            c_type = type_match.group(1).strip() if type_match else "article" # Default
            title = title_match.group(1).strip() if title_match else file_path.stem
            author = author_match.group(1).strip() if author_match else "Unknown"
            
            tags = []
            if tags_match:
                tags = [t.strip().strip('"').strip("'") for t in tags_match.group(1).split(',')]
                
            return {
                "type": c_type,
                "title": title,
                "author": author,
                "tags": tags
            }
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
    
    # Fallback for binaries or errors
    return {
        "type": "book" if file_path.suffix == '.pdf' else "article",
        "title": file_path.stem,
        "author": "Unknown",
        "tags": []
    }

def update_frontmatter(file_path, new_id):
    """Update content_id in frontmatter"""
    if file_path.suffix != '.md':
        return
        
    content = file_path.read_text(encoding='utf-8')
    
    # Check if content_id exists
    if re.search(r'content_id:', content):
        new_content = re.sub(r'content_id:.*', f'content_id: {new_id}', content)
    else:
        # Add it to end of frontmatter
        new_content = re.sub(r'(---.*?)(\n---)', f'\\1\ncontent_id: {new_id}\\2', content, flags=re.DOTALL)
        
    file_path.write_text(new_content, encoding='utf-8')

def main():
    if not INBOX_DIR.exists():
        print("Inbox empty or not found.")
        return

    log_data = load_log()
    processed_count = 0
    
    print(f"Processing inbox: {INBOX_DIR}")

    for file_path in INBOX_DIR.iterdir():
        if file_path.name.startswith('.'): continue
        
        print(f"Processing {file_path.name}...")
        
        # 1. Gather Info
        info = get_frontmatter_info(file_path)
        
        # 2. Heuristics for specific files
        if file_path.name == 'i_built_this_using_cursor_ai.md':
            info['type'] = 'video'
        elif file_path.name == 'temp_upload.pdf':
            info['type'] = 'book' # Assuming PDF is a book/paper
            info['title'] = 'Ralph O NPC Dev' # Contextual rename
        
        # 3. Generate ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        # Ensure unique ID slightly if processing fast
        import time; time.sleep(0.1) 
        
        prefix_map = {
            "article": "art", "book": "book", "video": "vid", 
            "podcast": "pod", "research_paper": "paper", "web_page": "web"
        }
        prefix = prefix_map.get(info['type'], 'doc')
        new_id = f"{prefix}_{timestamp}"
        
        # 4. Determine Destiny
        dest_folder_name = TYPE_MAP.get(info['type'], "articles")
        dest_dir = LIBRARY_DIR / dest_folder_name
        dest_dir.mkdir(parents=True, exist_ok=True)
        
        new_filename = file_path.name
        if file_path.name == 'temp_upload.pdf':
            new_filename = f"Ralph_O_NPC_Dev_{timestamp}.pdf"
            
        dest_path = dest_dir / new_filename
        
        # 5. Execute Move & Update
        try:
            shutil.copy2(file_path, dest_path)
            
            # Update Frontmatter (on destination)
            update_frontmatter(dest_path, new_id)
            
            # Remove Source
            os.remove(file_path)
            
            # 6. Log
            entry = {
                "id": new_id,
                "title": info['title'],
                "author": info['author'],
                "type": info['type'],
                "tags": info['tags'],
                "file_path": str(dest_path.relative_to(BASE_DIR.parent)), # Store relative to project root approx
                "original_path": str(file_path),
                "processed_at": datetime.now().isoformat(),
                "status": "library_offline_approved"
            }
            log_data.append(entry)
            processed_count += 1
            print(f"  [OK] Moved to {dest_folder_name} as {new_id}")
            
        except Exception as e:
            print(f"  [ERROR] Failed to process {file_path.name}: {e}")

    save_log(log_data)
    print(f"\nDone. Processed {processed_count} items.")

if __name__ == "__main__":
    main()
