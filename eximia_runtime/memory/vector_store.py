"""Vector Store - ChromaDB for long-term memory and semantic search"""

from pathlib import Path
from typing import Any

import chromadb
from chromadb.config import Settings
import structlog

from eximia_runtime.core.config import settings


logger = structlog.get_logger()


class VectorStore:
    """
    ChromaDB-based vector store for Knowledge Bases.
    
    Provides semantic search over agent knowledge bases,
    enabling context-aware responses without loading full KBs.
    """

    def __init__(self, persist_dir: Path | None = None):
        self.persist_dir = persist_dir or settings.chroma_persist_dir
        self.persist_dir.mkdir(parents=True, exist_ok=True)

        self.client = chromadb.PersistentClient(
            path=str(self.persist_dir),
            settings=Settings(anonymized_telemetry=False),
        )
        self._collections: dict[str, chromadb.Collection] = {}

    def get_collection(self, agent_name: str) -> chromadb.Collection:
        """Get or create collection for an agent"""
        if agent_name not in self._collections:
            # Normalize name for ChromaDB (alphanumeric + underscores only)
            collection_name = f"agent_{agent_name}".replace("-", "_")
            self._collections[agent_name] = self.client.get_or_create_collection(
                name=collection_name,
                metadata={"agent": agent_name},
            )
        return self._collections[agent_name]

    def index_knowledge_base(
        self,
        agent_name: str,
        kb_path: Path,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
    ) -> int:
        """
        Index a knowledge base directory for an agent.
        
        Args:
            agent_name: Name of the agent
            kb_path: Path to knowledge_base directory
            chunk_size: Characters per chunk
            chunk_overlap: Overlap between chunks
            
        Returns:
            Number of chunks indexed
        """
        collection = self.get_collection(agent_name)
        
        # Clear existing documents for this agent
        try:
            existing = collection.count()
            if existing > 0:
                collection.delete(where={"agent": agent_name})
        except Exception:
            pass  # Collection might be empty

        documents = []
        metadatas = []
        ids = []

        kb_files = list(kb_path.glob("*.md"))
        if not kb_files:
            logger.warning("no_kb_files_found", path=str(kb_path))
            return 0

        for kb_file in kb_files:
            content = kb_file.read_text(encoding="utf-8")
            chunks = self._chunk_text(content, chunk_size, chunk_overlap)

            for i, chunk in enumerate(chunks):
                doc_id = f"{agent_name}_{kb_file.stem}_{i}"
                documents.append(chunk)
                metadatas.append({
                    "agent": agent_name,
                    "file": kb_file.name,
                    "chunk_index": i,
                })
                ids.append(doc_id)

        if documents:
            collection.add(
                documents=documents,
                metadatas=metadatas,
                ids=ids,
            )

        logger.info(
            "kb_indexed",
            agent=agent_name,
            files=len(kb_files),
            chunks=len(documents),
        )

        return len(documents)

    def _chunk_text(
        self,
        text: str,
        chunk_size: int,
        overlap: int,
    ) -> list[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0

        while start < len(text):
            end = start + chunk_size

            # Try to break at paragraph or sentence
            if end < len(text):
                # Look for paragraph break
                para_break = text.rfind("\n\n", start, end)
                if para_break > start + chunk_size // 2:
                    end = para_break + 2
                else:
                    # Look for sentence break
                    sent_break = max(
                        text.rfind(". ", start, end),
                        text.rfind("! ", start, end),
                        text.rfind("? ", start, end),
                    )
                    if sent_break > start + chunk_size // 2:
                        end = sent_break + 2

            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)

            start = end - overlap

        return chunks

    async def search(
        self,
        query: str,
        agent_name: str,
        k: int = 5,
        min_relevance: float = 0.0,
    ) -> list[dict[str, Any]]:
        """
        Semantic search in agent's knowledge base.
        
        Args:
            query: Search query
            agent_name: Agent to search in
            k: Number of results
            min_relevance: Minimum relevance score (0-1)
            
        Returns:
            List of matching chunks with metadata
        """
        collection = self.get_collection(agent_name)

        if collection.count() == 0:
            return []

        results = collection.query(
            query_texts=[query],
            n_results=k,
        )

        documents = []
        for i, doc in enumerate(results["documents"][0]):
            metadata = results["metadatas"][0][i] if results["metadatas"] else {}
            distance = results["distances"][0][i] if results["distances"] else 0

            # Convert distance to relevance score (lower distance = higher relevance)
            relevance = 1 / (1 + distance)

            if relevance >= min_relevance:
                documents.append({
                    "content": doc,
                    "metadata": metadata,
                    "relevance": relevance,
                })

        return documents

    def search_sync(
        self,
        query: str,
        agent_name: str,
        k: int = 5,
    ) -> list[dict[str, Any]]:
        """Synchronous version of search"""
        import asyncio
        return asyncio.get_event_loop().run_until_complete(
            self.search(query, agent_name, k)
        )

    def index_all_agents(self) -> dict[str, int]:
        """Index knowledge bases for all discovered agents"""
        from eximia_runtime.core.registry import registry

        registry.discover_agents()
        results = {}

        for agent in registry.list_all():
            # Try different KB paths
            kb_paths = [
                agent.path / "knowledge_base",
                agent.path / "02_profile" / "knowledge_base",
                agent.path / "knowledge_bases",
            ]

            for kb_path in kb_paths:
                if kb_path.exists() and any(kb_path.glob("*.md")):
                    count = self.index_knowledge_base(agent.name, kb_path)
                    results[agent.name] = count
                    break

        return results


# Singleton instance
vector_store = VectorStore()
