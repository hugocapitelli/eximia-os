"""
Codex Embeddings Module
Handles semantic search using vector embeddings
"""

import os
import json
import requests
from typing import Optional, List, Dict, Any
from pathlib import Path

import structlog

logger = structlog.get_logger()


class CodexEmbedder:
    """Manages embedding generation and semantic search for Codex"""
    
    def __init__(
        self,
        model: str = "ollama",
        ollama_model: str = "mxbai-embed-large",
        ollama_url: str = "http://localhost:11434"
    ):
        self.model = model
        self.ollama_model = ollama_model
        self.ollama_url = ollama_url
        
        # Dimensionality by model
        self.dimensions = {
            "mxbai-embed-large": 1024,  # Ollama
            "text-embedding-3-small": 1536,  # OpenAI
        }
    
    def get_dimensions(self) -> int:
        """Get embedding dimensions for current model"""
        if self.model == "ollama":
            return self.dimensions.get(self.ollama_model, 1024)
        return 1536  # OpenAI default
    
    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """
        Generate embedding for text.
        
        Args:
            text: Text to embed
            
        Returns:
            List of floats (embedding vector) or None if failed
        """
        if not text or not text.strip():
            logger.warning("empty_text_for_embedding")
            return None
        
        # Truncate very long texts (embeddings have token limits)
        text = text[:8000]  # ~2000 tokens
        
        if self.model == "ollama":
            return self._generate_ollama_embedding(text)
        elif self.model == "openai":
            return self._generate_openai_embedding(text)
        else:
            logger.error("unknown_embedding_model", model=self.model)
            return None
    
    def _generate_ollama_embedding(self, text: str) -> Optional[List[float]]:
        """Generate embedding using Ollama local model"""
        try:
            response = requests.post(
                f"{self.ollama_url}/api/embeddings",
                json={
                    "model": self.ollama_model,
                    "prompt": text
                },
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                embedding = data.get("embedding")
                
                logger.info(
                    "ollama_embedding_generated",
                    dimensions=len(embedding) if embedding else 0
                )
                return embedding
            else:
                logger.error(
                    "ollama_error",
                    status=response.status_code,
                    error=response.text[:200]
                )
                return None
                
        except requests.exceptions.ConnectionError:
            logger.error("ollama_not_running", url=self.ollama_url)
            return None
        except Exception as e:
            logger.error("ollama_embedding_failed", error=str(e))
            return None
    
    def _generate_openai_embedding(self, text: str) -> Optional[List[float]]:
        """Generate embedding using OpenAI API"""
        try:
            import openai
            from eximia_runtime.core.config import settings
            
            client = openai.OpenAI(api_key=settings.openai_api_key)
            
            response = client.embeddings.create(
                input=text,
                model="text-embedding-3-small"
            )
            
            embedding = response.data[0].embedding
            logger.info("openai_embedding_generated", dimensions=len(embedding))
            return embedding
            
        except Exception as e:
            logger.error("openai_embedding_failed", error=str(e))
            return None
    
    def index_content(self, content_id: str, text: str) -> bool:
        """
        Generate and store embedding for content.
        
        Args:
            content_id: ID of the content
            text: Text to embed
            
        Returns:
            True if successful
        """
        embedding = self.generate_embedding(text)
        if not embedding:
            return False
        
        # Store in database
        try:
            from eximia_runtime.core.config import settings
            import psycopg2
            
            conn = psycopg2.connect(settings.vector_db_url)
            with conn.cursor() as cur:
                # Delete existing embedding if any
                cur.execute(
                    "DELETE FROM vector_embeddings WHERE content_id = %s",
                    (content_id,)
                )
                
                # Insert new embedding
                cur.execute("""
                    INSERT INTO vector_embeddings (content_id, embedding, model)
                    VALUES (%s, %s, %s)
                """, (
                    content_id,
                    str(embedding),  # pgvector accepts string format
                    f"{self.model}/{self.ollama_model}"
                ))
            
            conn.commit()
            conn.close()
            
            logger.info("embedding_stored", content_id=content_id)
            return True
            
        except Exception as e:
            logger.error("embedding_storage_failed", error=str(e))
            return False
    
    def search_similar(
        self,
        query: str,
        limit: int = 10,
        min_similarity: float = 0.7
    ) -> List[Dict[str, Any]]:
        """
        Semantic search for similar content.
        
        Args:
            query: Search query
            limit: Max number of results
            min_similarity: Minimum cosine similarity (0-1)
            
        Returns:
            List of matching contents with similarity scores
        """
        # Generate query embedding
        query_embedding = self.generate_embedding(query)
        if not query_embedding:
            logger.warning("query_embedding_failed")
            return []
        
        try:
            from eximia_runtime.core.config import settings
            import psycopg2
            from psycopg2.extras import RealDictCursor
            
            conn = psycopg2.connect(settings.vector_db_url, cursor_factory=RealDictCursor)
            with conn.cursor() as cur:
                # Cosine similarity search using pgvector
                cur.execute("""
                    SELECT 
                        c.id,
                        c.title,
                        c.type,
                        c.author,
                        c.source_agent,
                        c.date_added,
                        1 - (ve.embedding <=> %s::vector) as similarity
                    FROM contents c
                    JOIN vector_embeddings ve ON c.id = ve.content_id
                    WHERE 1 - (ve.embedding <=> %s::vector) >= %s
                    ORDER BY ve.embedding <=> %s::vector
                    LIMIT %s
                """, (
                    str(query_embedding),
                    str(query_embedding),
                    min_similarity,
                    str(query_embedding),
                    limit
                ))
                
                results = []
                for row in cur.fetchall():
                    results.append({
                        'id': row['id'],
                        'title': row['title'],
                        'type': row['type'],
                        'author': row['author'],
                        'source_agent': row['source_agent'],
                        'date_added': row['date_added'].isoformat() if row['date_added'] else None,
                        'similarity': float(row['similarity'])
                    })
            
            conn.close()
            
            logger.info("semantic_search_completed", results=len(results))
            return results
            
        except Exception as e:
            logger.error("semantic_search_failed", error=str(e))
            return []
    
    def hybrid_search(
        self,
        query: str,
        limit: int = 10,
        alpha: float = 0.5
    ) -> List[Dict[str, Any]]:
        """
        Hybrid search combining keyword (FTS) and semantic search.
        
        Args:
            query: Search query
            limit: Max results
            alpha: Weight for semantic vs keyword (0=keyword only, 1=semantic only)
            
        Returns:
            Merged and re-ranked results
        """
        # Get keyword results
        try:
            from eximia_runtime.core.config import settings
            import psycopg2
            from psycopg2.extras import RealDictCursor
            
            conn = psycopg2.connect(settings.vector_db_url, cursor_factory=RealDictCursor)
            
            # Keyword search
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT c.id, c.title, c.type, c.author,
                           ts_rank(fts, websearch_to_tsquery('portuguese', %s)) as rank
                    FROM contents c
                    WHERE fts @@ websearch_to_tsquery('portuguese', %s)
                    ORDER BY rank DESC
                    LIMIT %s
                """, (query, query, limit * 2))
                
                keyword_results = {row['id']: dict(row) for row in cur.fetchall()}
            
            conn.close()
            
            # Semantic search
            semantic_results_list = self.search_similar(query, limit=limit * 2)
            semantic_results = {r['id']: r for r in semantic_results_list}
            
            # Merge using Reciprocal Rank Fusion (RRF)
            all_ids = set(keyword_results.keys()) | set(semantic_results.keys())
            
            merged = []
            for content_id in all_ids:
                # Get ranks (1-indexed)
                kw_rank = list(keyword_results.keys()).index(content_id) + 1 if content_id in keyword_results else 1000
                sem_rank = list(semantic_results.keys()).index(content_id) + 1 if content_id in semantic_results else 1000
                
                # RRF score
                k = 60  # constant
                rrf_score = (1 - alpha) / (k + kw_rank) + alpha / (k + sem_rank)
                
                # Get content info (prefer semantic result as it has more fields)
                content = semantic_results.get(content_id) or keyword_results.get(content_id)
                content['rrf_score'] = rrf_score
                merged.append(content)
            
            # Sort by RRF score
            merged.sort(key=lambda x: x['rrf_score'], reverse=True)
            
            logger.info("hybrid_search_completed", results=len(merged[:limit]))
            return merged[:limit]
            
        except Exception as e:
            logger.error("hybrid_search_failed", error=str(e))
            # Fallback to semantic only
            return self.search_similar(query, limit)


# Singleton instance
codex_embedder = CodexEmbedder()
