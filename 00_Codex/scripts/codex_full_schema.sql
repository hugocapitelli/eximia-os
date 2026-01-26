-- ============================================
-- Codex Complete Schema for Supabase
-- Version: 2.0.0 (Data Consolidation)
-- Created: 2026-01-14
-- Purpose: Create ALL tables for Codex including agent tracking
-- ============================================

-- Enable pgvector extension (for future semantic search)
create extension if not exists vector;

-- ============================================
-- STEP 1: Base Tables
-- ============================================

-- Contents Table (Main repository)
create table if not exists contents (
    id text primary key,
    title text not null,
    type text not null, -- article, book, paper, research, agent_output, etc
    source_url text,
    author text,
    file_path text, -- S3 Key (relative)
    notes text,
    metadata_json jsonb,
    status text default 'inbox', -- inbox, library, processed, archived
    date_added timestamp with time zone default timezone('utc'::text, now()),
    credibility_score float,
    
    -- NEW: Agent tracking columns
    source_agent varchar(100), -- Agent that generated this content
    parent_content_id varchar(100), -- Reference to parent content if derived
    generation_context jsonb, -- JSON with execution context (model, query, tokens, etc)
    
    -- Full Text Search vector
    fts tsvector generated always as (
        to_tsvector('portuguese', 
            coalesce(title, '') || ' ' || 
            coalesce(author, '') || ' ' ||
            coalesce(source_agent, '') || ' ' ||
            coalesce(notes, '')
        )
    ) stored
);

-- Index for FTS
create index if not exists contents_fts_idx on contents using gin (fts);

-- Index for source_agent queries
create index if not exists idx_contents_source_agent on contents(source_agent);
create index if not exists idx_contents_type on contents(type);
create index if not exists idx_contents_status on contents(status);
create index if not exists idx_contents_date on contents(date_added);

-- ============================================
-- STEP 2: Related Tables
-- ============================================

-- Tags Table (many-to-many)
create table if not exists content_tags (
    content_id text references contents(id) on delete cascade,
    tag_name text not null,
    confidence float default 1.0,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    primary key (content_id, tag_name)
);

create index if not exists idx_tags_name on content_tags(tag_name);

-- Processing History (Agent Audit Log)
create table if not exists processing_history (
    id serial primary key,
    content_id text references contents(id) on delete set null,
    agent text not null,
    action text not null,
    timestamp timestamp with time zone default timezone('utc'::text, now()),
    output_path text,
    status text,
    notes text
);

create index if not exists idx_processing_content on processing_history(content_id);

-- Relationships (Knowledge Graph)
create table if not exists relationships (
    source_id text references contents(id) on delete cascade,
    target_id text references contents(id) on delete cascade,
    type text, -- references, similar_to, extends, contradicts, derived_from, summarizes
    description text,
    strength float default 0.5,
    created_at timestamp with time zone default timezone('utc'::text, now()),
    primary key (source_id, target_id)
);

-- ============================================
-- STEP 3: Agent Provenance Table (NEW)
-- ============================================

-- Detailed tracking of agent outputs
create table if not exists agent_provenance (
    id serial primary key,
    content_id varchar(100) references contents(id) on delete cascade,
    agent_name varchar(100) not null,
    agent_version varchar(20),
    model_used varchar(100),
    tokens_used integer,
    cost_usd decimal(10,6),
    execution_time_ms integer,
    query_text text,
    created_at timestamp with time zone default timezone('utc'::text, now())
);

create index if not exists idx_provenance_content_id on agent_provenance(content_id);
create index if not exists idx_provenance_agent_name on agent_provenance(agent_name);

-- ============================================
-- STEP 4: Documentation Comments
-- ============================================

comment on table contents is 'Main repository for all knowledge content in Codex';
comment on column contents.source_agent is 'Name of the agent that generated this content';
comment on column contents.parent_content_id is 'Reference to parent content if derived';
comment on column contents.generation_context is 'JSON with execution context (model, query, etc)';
comment on table agent_provenance is 'Detailed provenance tracking for agent outputs';
comment on table content_tags is 'Tags associated with content items';
comment on table processing_history is 'Audit log of agent processing actions';
comment on table relationships is 'Knowledge graph connections between content items';

-- ============================================
-- Success output
-- ============================================
select 'Codex schema created successfully!' as result;
