-- ============================================
-- Codex Embeddings Schema - pgvector
-- Created: 2026-01-14
-- Purpose: Add vector embeddings support for semantic search
-- ============================================

-- Ensure pgvector extension is enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create vector embeddings table
CREATE TABLE IF NOT EXISTS vector_embeddings (
    content_id VARCHAR(100) PRIMARY KEY REFERENCES contents(id) ON DELETE CASCADE,
    embedding vector(1024), -- mxbai-embed-large dimensionality (Ollama)
    model VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create HNSW index for fast cosine similarity search
-- HNSW (Hierarchical Navigable Small World) is optimized for similarity search
CREATE INDEX IF NOT EXISTS idx_embedding_hnsw 
ON vector_embeddings USING hnsw (embedding vector_cosine_ops);

-- Alternative: IVFFlat index (faster build, slower search)
-- CREATE INDEX IF NOT EXISTS idx_embedding_ivfflat 
-- ON vector_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Add comments
COMMENT ON TABLE vector_embeddings IS 'Vector embeddings for semantic search in Codex';
COMMENT ON COLUMN vector_embeddings.embedding IS 'Vector embedding (1024 dimensions for mxbai-embed-large)';
COMMENT ON COLUMN vector_embeddings.model IS 'Model used to generate embedding (e.g., ollama/mxbai-embed-large)';

-- Helper function to calculate cosine similarity (optional, built-in operators work too)
CREATE OR REPLACE FUNCTION cosine_similarity(a vector, b vector)
RETURNS float AS $$
BEGIN
    RETURN 1 - (a <=> b);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Success message
SELECT 'Vector embeddings schema created successfully!' as result;
