#!/usr/bin/env python3
"""
Operações de database para o Projeto Codex (Postgres/Supabase Edition)
Versão: 2.0.0 (Unified Cloud)
"""

import psycopg2
import json
import sys
from pathlib import Path
from typing import List, Dict, Optional
from psycopg2.extras import RealDictCursor, Json

# Config Import
try:
    # Tenta importar do path relativo se rodando como script
    sys.path.append(str(Path(__file__).parent.parent.parent))
    from eximia_runtime.core.config import settings
except ImportError:
    # Fallback se rodando via modulo
    from eximia_runtime.core.config import settings


class CodexDatabase:
    """Gerenciador de database do Projeto Codex (Postgres)"""
    
    def __init__(self):
        self.db_url = settings.vector_db_url
        if not self.db_url:
            raise ValueError("VECTOR_DB_URL não configurado no .env")

    def _get_connection(self):
        """Retorna conexão Postgres"""
        return psycopg2.connect(self.db_url, cursor_factory=RealDictCursor)
    
    # ===== CRUD: Contents =====
    
    def add_content(
        self,
        content_id: str,
        title: str,
        content_type: str,
        source_url: Optional[str] = None,
        author: Optional[str] = None,
        file_path: Optional[str] = None,
        tags: Optional[List[str]] = None,
        metadata: Optional[Dict] = None,
        notes: Optional[str] = None
    ) -> bool:
        """Adiciona novo conteúdo ao database"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                # Inserir conteúdo
                cursor.execute("""
                    INSERT INTO contents (id, title, type, source_url, author, file_path, notes, metadata_json)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """, (
                    content_id, title, content_type, source_url, author, 
                    file_path, notes, Json(metadata) if metadata else None
                ))
                
                # Inserir tags
                if tags:
                    for tag in tags:
                        cursor.execute("""
                            INSERT INTO content_tags (content_id, tag_name)
                            VALUES (%s, %s)
                            ON CONFLICT DO NOTHING
                        """, (content_id, tag.lower()))
            
            conn.commit()
            return True
            
        except Exception as e:
            conn.rollback()
            print(f"❌ Db Error: {e}")
            raise e
        finally:
            conn.close()
    
    def get_content(self, content_id: str) -> Optional[Dict]:
        """Busca conteúdo por ID"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT * FROM contents WHERE id = %s", (content_id,))
                row = cursor.fetchone()
                
                if not row:
                    return None
                
                # Buscar tags
                cursor.execute(
                    "SELECT tag_name FROM content_tags WHERE content_id = %s",
                    (content_id,)
                )
                tags = [r['tag_name'] for r in cursor.fetchall()]
                
                content = dict(row)
                content['tags'] = tags
                # Date objects might need conversion for JSON serialization outside
                if content.get('date_added'):
                    content['date_added'] = content['date_added'].isoformat()
                    
                return content
        finally:
            conn.close()
    
    def list_contents(
        self,
        content_type: Optional[str] = None,
        status: Optional[str] = None,
        author: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Dict]:
        """Lista conteúdos com filtros"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                query = "SELECT * FROM contents WHERE 1=1"
                params = []
                
                if content_type:
                    query += " AND type = %s"
                    params.append(content_type)
                
                if status:
                    query += " AND status = %s"
                    params.append(status)
                
                if author:
                    query += " AND author ILIKE %s"
                    params.append(f"%{author}%")
                
                query += " ORDER BY date_added DESC LIMIT %s OFFSET %s"
                params.extend([limit, offset])
                
                cursor.execute(query, params)
                rows = cursor.fetchall()
                
                contents = []
                for row in rows:
                    c = dict(row)
                    # Tags N+1 query (could be optimized with JOIN but keeping simple for parity)
                    cursor.execute("SELECT tag_name FROM content_tags WHERE content_id = %s", (c['id'],))
                    c['tags'] = [r['tag_name'] for r in cursor.fetchall()]
                    if c.get('date_added'):
                        c['date_added'] = c['date_added'].isoformat()
                    contents.append(c)
                
                return contents
        finally:
            conn.close()
    
    def update_content(
        self,
        content_id: str,
        new_id: Optional[str] = None,
        status: Optional[str] = None,
        file_path: Optional[str] = None,
        credibility_score: Optional[float] = None,
        notes: Optional[str] = None
    ) -> bool:
        """Atualiza campos de um conteúdo"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                # Se mudar ID, precisamos lidar com FKs (Cascade deve resolver se configurado, mas vamos verificar)
                # No Postgres, e possivel atualizar PK se houver Cascade.
                # A definicao SQL usa ON DELETE CASCADE mas nao ON UPDATE CASCADE explicitamente em todos
                # Assumindo que nao mudamos ID frequentemente, ou adicionaremos ON UPDATE CASCADE no SQL
                
                updates = []
                params = []
                
                if new_id:
                    updates.append("id = %s")
                    params.append(new_id)
                
                if status:
                    updates.append("status = %s")
                    params.append(status)
                    
                if file_path:
                    updates.append("file_path = %s")
                    params.append(file_path)
                
                if credibility_score is not None:
                    updates.append("credibility_score = %s")
                    params.append(credibility_score)
                
                if notes is not None:
                    updates.append("notes = %s")
                    params.append(notes)
                
                if not updates:
                    return False
                
                query = f"UPDATE contents SET {', '.join(updates)} WHERE id = %s"
                params.append(content_id)
                
                cursor.execute(query, params)
                conn.commit()
                return cursor.rowcount > 0
                
        except Exception as e:
            print(f"❌ Error updating: {e}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def delete_content(self, content_id: str) -> bool:
        """Remove conteúdo do database"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("DELETE FROM contents WHERE id = %s", (content_id,))
                conn.commit()
                return cursor.rowcount > 0
        finally:
            conn.close()
    
    def search(self, query: str, limit: int = 20) -> List[Dict]:
        """Busca full-text usando Postgres TSVECTOR"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                # Usar websearch_to_tsquery para consultas estilo Google
                sql = """
                    SELECT c.*, ts_rank(fts, websearch_to_tsquery('portuguese', %s)) as rank
                    FROM contents c
                    WHERE fts @@ websearch_to_tsquery('portuguese', %s)
                    ORDER BY rank DESC
                    LIMIT %s
                """
                cursor.execute(sql, (query, query, limit))
                
                results = []
                for row in cursor.fetchall():
                    c = dict(row)
                    if c.get('date_added'):
                        c['date_added'] = c['date_added'].isoformat()
                    results.append(c)
                
                return results
        finally:
            conn.close()
            
    def get_stats(self) -> Dict:
        """Retorna estatísticas do database"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                cursor.execute("SELECT type, COUNT(*) as count FROM contents GROUP BY type")
                by_type = {r['type']: r['count'] for r in cursor.fetchall()}
                
                cursor.execute("SELECT status, COUNT(*) as count FROM contents GROUP BY status")
                by_status = {r['status']: r['count'] for r in cursor.fetchall()}
                
                cursor.execute("""
                    SELECT tag_name, COUNT(*) as count FROM content_tags 
                    GROUP BY tag_name ORDER BY count DESC LIMIT 10
                """)
                top_tags = [(r['tag_name'], r['count']) for r in cursor.fetchall()]
                
                cursor.execute("""
                    SELECT author, COUNT(*) as count FROM contents 
                    WHERE author IS NOT NULL GROUP BY author ORDER BY count DESC LIMIT 10
                """)
                top_authors = [(r['author'], r['count']) for r in cursor.fetchall()]
                
                return {
                    'total': sum(by_type.values()),
                    'by_type': by_type,
                    'by_status': by_status,
                    'top_tags': top_tags,
                    'top_authors': top_authors
                }
        finally:
            conn.close()

    def get_next_sequence(self, prefix: str, year: int) -> int:
        """Calcula próxima sequência"""
        conn = self._get_connection()
        try:
            with conn.cursor() as cursor:
                # Busca IDs que combinam com prefix_year_
                pattern = f"{prefix}_{year}_%"
                cursor.execute("SELECT id FROM contents WHERE id LIKE %s", (pattern,))
                rows = cursor.fetchall()
                
                max_seq = 0
                for row in rows:
                    try:
                        parts = row['id'].split('_')
                        if len(parts) >= 3 and parts[-1].isdigit():
                            seq = int(parts[-1])
                            if seq > max_seq:
                                max_seq = seq
                    except:
                        continue
                return max_seq + 1
        finally:
            conn.close()

if __name__ == "__main__":
    try:
        db = CodexDatabase()
        stats = db.get_stats()
        print("✅ Conectado ao Supabase!")
        print(f"📊 Estatísticas: {stats}")
    except Exception as e:
        print(f"❌ Erro de conexão: {e}")
