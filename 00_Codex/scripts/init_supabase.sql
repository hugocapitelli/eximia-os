-- Enable pgvector extension (if needed for future)
create extension if not exists vector;

-- Contents Table
create table if not exists contents (
    id text primary key,
    title text not null,
    type text not null, -- article, book, paper, etc
    source_url text,
    author text,
    file_path text, -- S3 Key (relative)
    notes text,
    metadata_json jsonb,
    status text default 'inbox', -- inbox, library, archived
    date_added timestamp with time zone default timezone('utc'::text, now()),
    credibility_score float,
    
    -- Full Text Search vector
    fts tsvector generated always as (to_tsvector('portuguese', title || ' ' || coalesce(notes, ''))) stored
);

-- Index for FTS
create index if not exists contents_fts_idx on contents using gin (fts);

-- Tags Table
create table if not exists content_tags (
    content_id text references contents(id) on delete cascade,
    tag_name text not null,
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

-- Relationships (Graph)
create table if not exists relationships (
    source_id text references contents(id) on delete cascade,
    target_id text references contents(id) on delete cascade,
    type text,
    description text,
    primary key (source_id, target_id)
);
