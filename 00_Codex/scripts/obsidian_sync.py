#!/usr/bin/env python3
"""
Obsidian Sync Script for Eximia OS (v2 - Hierarchy Edition)
Scans the entire Eximia OS directory to:
1. Identify content "Families" (Clones, Agents, Codex, etc.).
2. Creates Structural Hubs (Nodes) for visual hierarchy.
3. Injects connections into ALL Markdown files.
"""

import sqlite3
import os
import re
from pathlib import Path
from typing import List, Dict, Optional, Tuple

# --- Configuration ---
SCRIPT_DIR = Path(__file__).parent
# Assuming script is in 00_Codex/scripts, Project Root is 2 levels up
PROJECT_ROOT = SCRIPT_DIR.parent.parent.resolve() 
DATA_DIR = PROJECT_ROOT / "00_Codex" / "eximia_data"
DB_PATH = DATA_DIR / "vault.db"
HUBS_DIR = PROJECT_ROOT / "00_Codex" / "eximia_data" / "09_HUBS"

# Markers
FOOTER_MARKER_START = "<!-- ORACLE:OBSIDIAN_CONNECTIONS_START -->"
FOOTER_MARKER_END = "<!-- ORACLE:OBSIDIAN_CONNECTIONS_END -->"
FOOTER_HEADER = "## 🧠 Obsidian Connections"

# Hierarchy Definitions
# Key: Directory Pattern (regex), Value: (ChildNode, ParentNode)
HIERARCHY_RULES = [
    (r"Clones", "Clones", "ExímIA"),
    (r"Agents|X_Agents|Z_Squad|The_[A-Za-z]+", "Agentes", "ExímIA"),
    (r"Projetos", "Projetos", "ExímIA"),
    (r"01_LIBRARY", "Library", "Codex"),
    (r"02_PROCESSED", "Processed", "Codex"),
    (r"00_INBOX", "Inbox", "Codex"),
    (r"Conteudo_sintetizado", "Pesquisas", "ExímIA"), # Guessing context
]

# Hub Definitions (Node Name -> Parent Node)
# Defines the Skeleton
HUBS_STRUCTURE = {
    "ExímIA": None, # Sun 1
    "Codex": "ExímIA", # Sun 2 (Linked to Eximia or standalone? "Two main nodes". Let's link Codex to Eximia to make it one giant graph, or keep separate? User said "centralize in TWO main nodes". But usually OS contains Codex. I'll link Codex -> Eximia for a single unified universe, unless specified otherwise.)
    # Actually, let's keep them as top level Peers if requested? 
    # User: "centralize tudo em dois principais nós, o exímia... E por fim, o codex"
    # I will make Eximia and Codex top level, but maybe link them "Related" to each other.
    
    # Eximia Children
    "Clones": "ExímIA",
    "Agentes": "ExímIA",
    "Projetos": "ExímIA",
    "Pesquisas": "ExímIA",
    
    # Codex Children
    "Library": "Codex",
    "Processed": "Codex",
    "Inbox": "Codex"
}

def get_db_connection():
    if not DB_PATH.exists():
        return None
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn
    except:
        return None

def ensure_hubs():
    """Creates the Hub Markdown files if they don't exist."""
    if not HUBS_DIR.exists():
        HUBS_DIR.mkdir(parents=True)
        
    for node, parent in HUBS_STRUCTURE.items():
        filename = f"{node}.md"
        path = HUBS_DIR / filename
        
        content = f"# {node}\n\n"
        content += f"**Type:** #Hub #Structure\n"
        if parent:
            content += f"**Parent:** [[{parent}]]\n"
        
        # We don't overwrite if exists (to preserve user notes), unless it's empty
        if not path.exists():
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✨ Created Hub: {node}")

def determine_hierarchy(file_path: Path) -> Tuple[Optional[str], Optional[str]]:
    """Returns (ChildNode, ParentNode) based on path."""
    path_str = str(file_path)
    
    for pattern, child, parent in HIERARCHY_RULES:
        if re.search(pattern, path_str, re.IGNORECASE):
            return child, parent
    return None, None

def get_codex_metadata(file_path: Path, conn) -> Tuple[List[str], List[Dict]]:
    """Fetches tags/relationships from DB if file is in Codex."""
    if not conn:
        return [], []
    
    # Try to match file_path in DB
    # DB paths might be relative or absolute. simpler to fuzzy match filename
    cursor = conn.cursor()
    filename = file_path.name
    
    cursor.execute("SELECT id FROM contents WHERE file_path LIKE ?", (f"%{filename}%",))
    row = cursor.fetchone()
    
    if not row:
        return [], []
    
    cid = row['id']
    
    # Tags
    cursor.execute("SELECT tag_name FROM content_tags WHERE content_id = ?", (cid,))
    tags = [r['tag_name'] for r in cursor.fetchall()]
    
    # Relationships
    cursor.execute("""
        SELECT r.relationship_type, c.title as target_title 
        FROM relationships r
        JOIN contents c ON r.target_id = c.id
        WHERE r.source_id = ?
    """, (cid,))
    relationships = [
        {'relationship_type': r['relationship_type'], 'target_title': r['target_title']}
        for r in cursor.fetchall()
    ]
    
    return tags, relationships

def generate_footer(hierarchy_node: str, tags: List[str], relationships: List[Dict]) -> str:
    """Generates the footer with Hierarchy + Codex Metadata."""
    lines = ["\n\n", "---", "\n", FOOTER_MARKER_START, "\n", FOOTER_HEADER, "\n"]
    
    # 1. Structural Link (The most important one for the user)
    if hierarchy_node:
        lines.append(f"**Family:** [[{hierarchy_node}]]\n")
    
    # 2. Tags
    if tags:
        obsidian_tags = [f"#{t.replace(' ', '-')}" for t in tags]
        lines.append(f"**Tags:** {' '.join(obsidian_tags)}\n")
        
    # 3. Relationships
    if relationships:
        lines.append("**Related:**")
        for rel in relationships:
            target = rel['target_title'].replace("|", "-").replace("[", "").replace("]", "")
            rtype = rel['relationship_type']
            lines.append(f"- [[{target}]] *({rtype})*")
            
    lines.append("\n" + FOOTER_MARKER_END)
    
    # If nothing to add, return empty? No, maybe we want to mark it as processed.
    # But if no hierarchy and no codex data, maybe skip.
    if not hierarchy_node and not tags and not relationships:
        return ""
        
    return "\n".join(lines)

def update_file(path: Path, footer_content: str) -> bool:
    if not footer_content:
        return False
        
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        pattern = re.compile(
            re.escape(FOOTER_MARKER_START) + r".*?" + re.escape(FOOTER_MARKER_END),
            re.DOTALL
        )
        
        if pattern.search(content):
            new_content = pattern.sub(footer_content.strip(), content)
        else:
            new_content = content.rstrip() + footer_content
            
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            return True
        return False
    except Exception as e:
        # print(f"❌ Error {path.name}: {e}") 
        return False

def sync():
    print(f"🔄 Starting Unified Obsidian Sync")
    print(f"📂 Root: {PROJECT_ROOT}")
    
    ensure_hubs()
    conn = get_db_connection()
    
    updated_count = 0
    scanned_count = 0
    
    # Recursive Scan
    for root, dirs, files in os.walk(PROJECT_ROOT):
        # Ignore hidden/system dirs
        dirs[:] = [d for d in dirs if not d.startswith('.') and not d.startswith('_')]
        
        for file in files:
            if not file.endswith('.md'):
                continue
                
            path = Path(root) / file
            
            # Skip the Hubs themselves to avoid loops/duplication? 
            # Or link Hubs to Parents? The Hubs are created manually above with links.
            # We should skip files in 09_HUBS if we don't want to double-append.
            if "09_HUBS" in str(path):
                continue

            scanned_count += 1
            
            # 1. Determine Hierarchy
            child_node, parent_node = determine_hierarchy(path)
            
            # 2. Get Codex Data (if any)
            tags, rels = get_codex_metadata(path, conn)
            
            # 3. Generate & Write
            footer = generate_footer(child_node, tags, rels)
            
            if update_file(path, footer):
                updated_count += 1
                # print(f"✅ Linked: {file} -> [[{child_node}]]")

    if conn:
        conn.close()
        
    print(f"\n✨ Sync Complete!")
    print(f"🔍 Scanned: {scanned_count} files")
    print(f"📝 Updated: {updated_count} files")

if __name__ == "__main__":
    sync()
