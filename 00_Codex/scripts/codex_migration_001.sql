-- ============================================
-- Codex Migration 001 - Data Consolidation
-- Created: 2026-01-14
-- Purpose: Add columns for automatic data capture from all agents
-- ============================================

-- Add source agent tracking
ALTER TABLE contents ADD COLUMN IF NOT EXISTS source_agent VARCHAR(100);
ALTER TABLE contents ADD COLUMN IF NOT EXISTS parent_content_id VARCHAR(100);
ALTER TABLE contents ADD COLUMN IF NOT EXISTS generation_context JSONB;

-- Create index for source_agent queries
CREATE INDEX IF NOT EXISTS idx_contents_source_agent ON contents(source_agent);

-- Create agent provenance table for detailed tracking
CREATE TABLE IF NOT EXISTS agent_provenance (
    id SERIAL PRIMARY KEY,
    content_id VARCHAR(100) REFERENCES contents(id) ON DELETE CASCADE,
    agent_name VARCHAR(100) NOT NULL,
    agent_version VARCHAR(20),
    model_used VARCHAR(100),
    tokens_used INTEGER,
    cost_usd DECIMAL(10,6),
    execution_time_ms INTEGER,
    query_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_provenance_content_id ON agent_provenance(content_id);
CREATE INDEX IF NOT EXISTS idx_provenance_agent_name ON agent_provenance(agent_name);

-- Update FTS trigger to include source_agent in search
-- (Optional: if you want to search by agent name)
DROP TRIGGER IF EXISTS contents_fts_trigger ON contents;

CREATE OR REPLACE FUNCTION update_contents_fts() RETURNS trigger AS $$
BEGIN
    NEW.fts := to_tsvector('portuguese', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.author, '') || ' ' ||
        COALESCE(NEW.source_agent, '') || ' ' ||
        COALESCE(NEW.notes, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contents_fts_trigger
    BEFORE INSERT OR UPDATE ON contents
    FOR EACH ROW
    EXECUTE FUNCTION update_contents_fts();

-- Add comment for documentation
COMMENT ON COLUMN contents.source_agent IS 'Name of the agent that generated this content';
COMMENT ON COLUMN contents.parent_content_id IS 'Reference to parent content if derived';
COMMENT ON COLUMN contents.generation_context IS 'JSON with execution context (model, query, etc)';
COMMENT ON TABLE agent_provenance IS 'Detailed provenance tracking for agent outputs';
