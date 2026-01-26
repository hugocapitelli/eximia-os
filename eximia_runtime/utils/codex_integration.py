"""
Codex Integration - Universal Data Capture
Version: 2.0.0
Purpose: Automatically captures ALL agent outputs and saves to Codex database
"""

import subprocess
import asyncio
import json
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any

import structlog

logger = structlog.get_logger()


class CodexIntegration:
    """Handles automatic integration of ALL agent outputs with Codex"""
    
    # Agent name to content type mapping
    AGENT_TYPE_MAP = {
        'the_veritas': 'research',
        'veritas': 'research',
        'intellex': 'processed',
        'z1_architect': 'agent_spec',
        'z2_profiler': 'agent_profile',
        'z3_engineer': 'agent_prompt',
        'z4_auditor': 'agent_audit',
        'z5_evolver': 'agent_evolution',
        'the_cfo': 'financial_analysis',
        'the_clo': 'legal_analysis',
        'the_cmo': 'marketing_analysis',
        'the_ceo': 'strategic_analysis',
        'the_maestro': 'orchestration',
        'stratos': 'strategy',
        'the_prototyper': 'product_design',
        'harven': 'educational',
        'clone': 'clone_output',
    }
    
    # Content type prefixes for ID generation
    TYPE_PREFIX_MAP = {
        'research': 'res',
        'processed': 'proc',
        'agent_spec': 'spec',
        'agent_profile': 'prof',
        'agent_prompt': 'prompt',
        'agent_audit': 'audit',
        'agent_evolution': 'evol',
        'financial_analysis': 'fin',
        'legal_analysis': 'leg',
        'marketing_analysis': 'mkt',
        'strategic_analysis': 'strat',
        'orchestration': 'orch',
        'strategy': 'hoshin',
        'product_design': 'prd',
        'educational': 'edu',
        'clone_output': 'clone',
        'agent_output': 'out',
    }
    
    @classmethod
    def _determine_content_type(cls, agent_name: str) -> str:
        """Map agent name to content type"""
        agent_lower = agent_name.lower().replace(' ', '_')
        
        # Check direct match
        if agent_lower in cls.AGENT_TYPE_MAP:
            return cls.AGENT_TYPE_MAP[agent_lower]
        
        # Check partial match
        for key, value in cls.AGENT_TYPE_MAP.items():
            if key in agent_lower:
                return value
        
        # Default
        return 'agent_output'
    
    @classmethod
    def _generate_content_id(cls, content_type: str) -> str:
        """Generate unique content ID following Codex convention"""
        prefix = cls.TYPE_PREFIX_MAP.get(content_type, 'out')
        year = datetime.now().year
        timestamp = datetime.now().strftime('%m%d_%H%M%S')
        return f"{prefix}_{year}_{timestamp}"
    
    @classmethod
    def _get_codex_database(cls):
        """Get CodexDatabase instance (lazy import to avoid circular deps)"""
        import sys
        from pathlib import Path
        
        # Add Codex scripts to path
        project_root = Path(__file__).parent.parent.parent
        codex_scripts = project_root / "00_Codex" / "scripts"
        if str(codex_scripts) not in sys.path:
            sys.path.insert(0, str(codex_scripts))
        
        try:
            from database import CodexDatabase
            return CodexDatabase()
        except Exception as e:
            logger.warning("codex_database_unavailable", error=str(e))
            return None
    
    @classmethod
    def capture(
        cls,
        content: str,
        agent_name: str,
        query: str,
        metadata: Optional[Dict[str, Any]] = None,
        filepath: Optional[Path] = None,
        parent_content_id: Optional[str] = None
    ) -> Optional[str]:
        """
        Capture any agent output and save to Codex.
        
        Args:
            content: The agent's response content
            agent_name: Name of the agent that generated the output
            query: Original query that triggered the agent
            metadata: Optional metadata (model, tokens, cost, etc.)
            filepath: Optional path to saved file
            parent_content_id: Optional reference to parent content
            
        Returns:
            content_id if saved successfully, None otherwise
        """
        try:
            # Determine content type
            content_type = cls._determine_content_type(agent_name)
            
            # Generate unique ID
            content_id = cls._generate_content_id(content_type)
            
            # Build title from query
            title = query[:100] if query else f"{agent_name} output"
            
            # Build generation context
            generation_context = {
                'agent': agent_name,
                'query': query,
                'timestamp': datetime.now().isoformat(),
                'filepath': str(filepath) if filepath else None,
            }
            if metadata:
                generation_context.update({
                    'model': metadata.get('model'),
                    'tokens': metadata.get('tokens'),
                    'cost_usd': metadata.get('cost_usd'),
                    'time_ms': metadata.get('time_ms'),
                })
            
            # Auto-generate tags from agent and content type
            tags = [
                content_type,
                agent_name.lower().replace(' ', '_'),
                'auto_captured',
                f"year_{datetime.now().year}",
            ]
            
            # Get database
            db = cls._get_codex_database()
            if not db:
                logger.warning("codex_capture_skipped", reason="database_unavailable")
                return cls._fallback_file_save(content, agent_name, query, filepath)
            
            # Save to database
            db.add_content(
                content_id=content_id,
                title=title,
                content_type=content_type,
                source_url=None,
                author=agent_name,
                file_path=str(filepath) if filepath else None,
                tags=tags,
                metadata=generation_context,
                notes=f"Auto-captured from {agent_name}",
                source_agent=agent_name,
                parent_content_id=parent_content_id
            )
            
            # Add provenance record
            cls._add_provenance(db, content_id, agent_name, query, metadata)
            
            # Generate and store embedding for semantic search (async, non-blocking)
            try:
                import sys
                from pathlib import Path
                codex_scripts = Path(__file__).parent.parent.parent / "00_Codex" / "scripts"
                if str(codex_scripts) not in sys.path:
                    sys.path.insert(0, str(codex_scripts))
                
                from codex_embeddings import codex_embedder
                # Index in background - don't block if embedding fails
                codex_embedder.index_content(content_id, content)
            except Exception as e:
                logger.debug("embedding_generation_skipped", error=str(e))
                # Not critical - content is saved, embedding is optional
            
            logger.info(
                "codex_capture_success",
                content_id=content_id,
                agent=agent_name,
                type=content_type
            )
            
            return content_id
            
        except Exception as e:
            logger.error("codex_capture_failed", error=str(e), agent=agent_name)
            return None
    
    @classmethod
    def _add_provenance(
        cls,
        db,
        content_id: str,
        agent_name: str,
        query: str,
        metadata: Optional[Dict[str, Any]]
    ):
        """Add provenance record for detailed tracking"""
        try:
            conn = db._get_connection()
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO agent_provenance 
                    (content_id, agent_name, model_used, tokens_used, cost_usd, query_text)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (
                    content_id,
                    agent_name,
                    metadata.get('model') if metadata else None,
                    metadata.get('tokens') if metadata else None,
                    metadata.get('cost_usd') if metadata else None,
                    query
                ))
            conn.commit()
            conn.close()
        except Exception as e:
            # Table might not exist yet, just log
            logger.debug("provenance_insert_failed", error=str(e))
    
    @classmethod
    def _fallback_file_save(
        cls,
        content: str,
        agent_name: str,
        query: str,
        original_filepath: Optional[Path]
    ) -> Optional[str]:
        """Fallback: save to Codex INBOX as file if DB unavailable"""
        try:
            project_root = Path(__file__).parent.parent.parent
            codex_inbox = project_root / "00_Codex" / "eximia_data" / "00_INBOX"
            codex_inbox.mkdir(parents=True, exist_ok=True)
            
            # Generate filename
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_agent = agent_name.lower().replace(' ', '_')[:20]
            filename = f"pending_{safe_agent}_{timestamp}.md"
            
            # Build content
            md_content = f"""---
agent: {agent_name}
query: {query}
captured: {datetime.now().isoformat()}
status: pending
---

# {agent_name} Output

**Query:** {query}

---

{content}
"""
            
            filepath = codex_inbox / filename
            filepath.write_text(md_content, encoding='utf-8')
            
            logger.info("codex_fallback_save", path=str(filepath))
            return filename
            
        except Exception as e:
            logger.error("codex_fallback_failed", error=str(e))
            return None
    
    # Legacy method for backward compatibility
    @staticmethod
    def auto_integrate(filepath: Path, agent_name: str):
        """
        Legacy method - now redirects to capture().
        Kept for backward compatibility with existing code.
        """
        try:
            if filepath.exists():
                content = filepath.read_text(encoding='utf-8')
                CodexIntegration.capture(
                    content=content,
                    agent_name=agent_name,
                    query=f"Auto-integrated from {filepath.name}",
                    filepath=filepath
                )
        except Exception as e:
            logger.warning("auto_integrate_failed", error=str(e))
