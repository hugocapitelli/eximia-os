"""
Memo Integration Module
Handles idea management with dual storage (database + markdown files)
"""

import json
import sqlite3
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import re


class MemoIntegration:
    """Integration layer for Memo agent with Codex database and file storage"""
    
    def __init__(self, db_path: str = None, ideas_dir: str = None):
        if db_path is None:
            db_path = Path.home() / "OneDrive" / "Área de Trabalho" / "exímIA Ventures" / "eximIA.OS" / "00_Codex" / "eximia_data" / "vault.db"
        if ideas_dir is None:
            ideas_dir = Path.home() / "OneDrive" / "Área de Trabalho" / "exímIA Ventures" / "eximIA.OS" / "00_Codex" / "eximia_data" / "04_IDEAS"
        
        self.db_path = Path(db_path)
        self.ideas_dir = Path(ideas_dir)
        self.ideas_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_connection(self) -> sqlite3.Connection:
        """Get database connection"""
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn
    
    def _slugify(self, text: str) -> str:
        """Convert text to filename-safe slug"""
        text = text.lower()
        text = re.sub(r'[^\w\s-]', '', text)
        text = re.sub(r'[-\s]+', '_', text)
        return text[:50]  # Limit length
    
    def save_idea(
        self,
        title: str,
        content: str,
        idea_type: str = "atom",
        tags: List[str] = None,
        connections: List[int] = None,
        cluster_name: str = None,
        request_approval: bool = True
    ) -> Dict:
        """
        Save idea to both database and markdown file
        
        Args:
            title: Idea title
            content: Idea content
            idea_type: "atom" | "cluster" | "insight"
            tags: List of tags
            connections: List of connected idea IDs
            cluster_name: Name if this is a cluster
            request_approval: If True, return data for user approval instead of saving
        
        Returns:
            Dict with save status or approval request
        """
        if tags is None:
            tags = []
        if connections is None:
            connections = []
        
        # Prepare data
        idea_data = {
            "title": title,
            "content": content,
            "idea_type": idea_type,
            "tags": tags,
            "connections": connections,
            "cluster_name": cluster_name,
            "created_at": datetime.now().isoformat()
        }
        
        if request_approval:
            return {
                "status": "pending_approval",
                "data": idea_data,
                "message": f"Ready to save {idea_type}: '{title}'"
            }
        
        # Save to database
        conn = self._get_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO content (
                title, content_text, category, tags, 
                idea_type, connections, cluster_name, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            title,
            content,
            "ideas",
            ",".join(tags),
            idea_type,
            json.dumps(connections),
            cluster_name,
            idea_data["created_at"]
        ))
        
        idea_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Save to markdown file with Obsidian links
        slug = self._slugify(title)
        filename = f"{idea_id:04d}_{slug}.md"
        
        if idea_type == "cluster":
            filename = f"cluster_{filename}"
        elif idea_type == "insight":
            filename = f"insight_{filename}"
        
        file_path = self.ideas_dir / filename
        
        # Get connection filenames for Obsidian links
        connection_links = []
        if connections:
            conn = self._get_connection()
            cursor = conn.cursor()
            for conn_id in connections:
                cursor.execute(
                    "SELECT title, idea_type FROM content WHERE id = ? AND category = 'ideas'",
                    (conn_id,)
                )
                row = cursor.fetchone()
                if row:
                    conn_slug = self._slugify(row["title"])
                    conn_filename = f"{conn_id:04d}_{conn_slug}"
                    if row["idea_type"] == "cluster":
                        conn_filename = f"cluster_{conn_filename}"
                    elif row["idea_type"] == "insight":
                        conn_filename = f"insight_{conn_filename}"
                    connection_links.append(f"[[{conn_filename}]]")
            conn.close()
        
        # Build markdown with Obsidian syntax
        md_content = f"""# {title}

**Type:** {idea_type}  
**Created:** {idea_data['created_at']}  
**Tags:** #{' #'.join(tags) if tags else 'none'}

## Content

{content}

## Connections

{chr(10).join(f'- {link}' for link in connection_links) if connection_links else '- None'}

## Metadata

- **ID:** {idea_id}
- **Cluster:** {cluster_name or 'N/A'}

---
*Generated by Memo*
"""
        
        file_path.write_text(md_content, encoding='utf-8')
        
        return {
            "status": "saved",
            "id": idea_id,
            "file": str(file_path),
            "data": idea_data
        }
    
    def list_ideas(
        self,
        page: int = 1,
        page_size: int = 25,
        idea_type: str = None
    ) -> Dict:
        """
        List ideas with pagination
        
        Args:
            page: Page number (1-indexed)
            page_size: Ideas per page
            idea_type: Filter by type (optional)
        
        Returns:
            Dict with ideas and pagination info
        """
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Count total
        count_query = "SELECT COUNT(*) FROM content WHERE category = 'ideas'"
        if idea_type:
            count_query += f" AND idea_type = '{idea_type}'"
        
        total = cursor.execute(count_query).fetchone()[0]
        total_pages = (total + page_size - 1) // page_size
        
        # Get page data
        offset = (page - 1) * page_size
        query = """
            SELECT id, title, idea_type, tags, connections, cluster_name, created_at
            FROM content
            WHERE category = 'ideas'
        """
        if idea_type:
            query += f" AND idea_type = '{idea_type}'"
        query += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
        
        rows = cursor.execute(query, (page_size, offset)).fetchall()
        conn.close()
        
        ideas = []
        for row in rows:
            ideas.append({
                "id": row["id"],
                "title": row["title"],
                "type": row["idea_type"],
                "tags": row["tags"].split(",") if row["tags"] else [],
                "connections": json.loads(row["connections"]) if row["connections"] else [],
                "cluster_name": row["cluster_name"],
                "created_at": row["created_at"]
            })
        
        return {
            "ideas": ideas,
            "page": page,
            "page_size": page_size,
            "total": total,
            "total_pages": total_pages,
            "has_next": page < total_pages,
            "has_prev": page > 1
        }
    
    def search_similar(
        self,
        query: str,
        top_k: int = 5,
        threshold: float = 0.7
    ) -> List[Dict]:
        """
        Search for similar ideas (placeholder for semantic search)
        
        Currently uses basic text matching.
        TODO: Implement embedding-based semantic search.
        
        Args:
            query: Search query
            top_k: Number of results
            threshold: Similarity threshold (0-1)
        
        Returns:
            List of similar ideas with scores
        """
        conn = self._get_connection()
        cursor = conn.cursor()
        
        # Simple text search for now
        cursor.execute("""
            SELECT id, title, content_text, idea_type, tags
            FROM content
            WHERE category = 'ideas'
            AND (title LIKE ? OR content_text LIKE ?)
            LIMIT ?
        """, (f"%{query}%", f"%{query}%", top_k))
        
        results = []
        for row in cursor.fetchall():
            results.append({
                "id": row["id"],
                "title": row["title"],
                "type": row["idea_type"],
                "tags": row["tags"].split(",") if row["tags"] else [],
                "similarity": 0.8  # Placeholder score
            })
        
        conn.close()
        return results


# Global instance
memo = MemoIntegration()


# Convenience functions
def save_idea(*args, **kwargs):
    """Save an idea (see MemoIntegration.save_idea)"""
    return memo.save_idea(*args, **kwargs)


def list_ideas(*args, **kwargs):
    """List ideas (see MemoIntegration.list_ideas)"""
    return memo.list_ideas(*args, **kwargs)


def search_similar(*args, **kwargs):
    """Search similar ideas (see MemoIntegration.search_similar)"""
    return memo.search_similar(*args, **kwargs)
