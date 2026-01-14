
import os
import re
import shutil
import sys
from pathlib import Path

def main():
    # Setup paths
    project_root = Path(__file__).parent.parent.parent
    source_dir = project_root / "eximia_runtime" / "outputs" / "book_processor"
    target_dir = project_root / "00_Codex" / "eximia_data" / "02_PROCESSED"
    
    if not source_dir.exists():
        print("❌ Source directory not found")
        return

    target_dir.mkdir(parents=True, exist_ok=True)
    
    # Regex to extract filename from query in content
    # Format: Analyze and summarize this article (filename.md):
    filename_pattern = re.compile(r"Analyze and summarize this article \((.*?)\):")
    
    processed_count = 0
    
    print(f"🔍 Scanning {source_dir}...")
    
    for file_path in source_dir.glob("*.md"):
        try:
            content = file_path.read_text(encoding="utf-8")
            
            match = filename_pattern.search(content)
            if match:
                original_filename = match.group(1)
                # Ensure it ends with .md and remove existing .md if double
                stem = Path(original_filename).stem
                new_filename = f"{stem}_processed_ollama.md"
                
                dest_path = target_dir / new_filename
                
                print(f"✅ Found match: {original_filename}")
                print(f"   Move to: {new_filename}")
                
                shutil.copy2(file_path, dest_path)
                processed_count += 1
            else:
                print(f"⚠️  No filename match in {file_path.name}")
                
        except Exception as e:
            print(f"❌ Error processing {file_path.name}: {e}")
            
    print(f"\n📦 Recovered {processed_count} files.")
    
    if processed_count > 0:
        print("⚙️  Running integration scripts...")
        import subprocess
        # Run integration
        subprocess.run(["py", "00_Codex/scripts/integrate_processed.py"], cwd=str(project_root), shell=True)
        # Run organization
        subprocess.run(["py", "00_Codex/scripts/organize_processed.py"], cwd=str(project_root), shell=True)

if __name__ == "__main__":
    main()
