-- Schema SQLite para Projeto Codex
-- Versão: 1.0.0

-- Tabela principal de conteúdos
CREATE TABLE IF NOT EXISTS contents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('book', 'article', 'research_paper', 'podcast', 'video', 'web_page')),
    source_url TEXT,
    author TEXT,
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_published TEXT,
    status TEXT DEFAULT 'inbox' CHECK(status IN ('inbox', 'library', 'processed', 'archived')),
    credibility_score REAL,
    file_path TEXT,
    notes TEXT,
    metadata_json TEXT
);

-- Tabela de tags (many-to-many)
CREATE TABLE IF NOT EXISTS content_tags (
    content_id TEXT NOT NULL,
    tag_name TEXT NOT NULL,
    confidence REAL DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (content_id, tag_name),
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

-- Tabela de relacionamentos entre conteúdos
CREATE TABLE IF NOT EXISTS relationships (
    source_id TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relationship_type TEXT CHECK(relationship_type IN ('references', 'similar_to', 'extends', 'contradicts')),
    strength REAL DEFAULT 0.5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (source_id, target_id, relationship_type),
    FOREIGN KEY (source_id) REFERENCES contents(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES contents(id) ON DELETE CASCADE
);

-- Tabela de histórico de processamento
CREATE TABLE IF NOT EXISTS processing_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id TEXT NOT NULL,
    agent TEXT NOT NULL,
    action TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    output_path TEXT,
    status TEXT DEFAULT 'success' CHECK(status IN ('success', 'failed', 'pending')),
    notes TEXT,
    FOREIGN KEY (content_id) REFERENCES contents(id) ON DELETE CASCADE
);

-- Tabela FTS5 para busca full-text (independente para evitar bugs de sync)
CREATE VIRTUAL TABLE IF NOT EXISTS contents_fts USING fts5(
    content_id,
    title,
    author,
    content,
    tags
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_contents_status ON contents(status);
CREATE INDEX IF NOT EXISTS idx_contents_author ON contents(author);
CREATE INDEX IF NOT EXISTS idx_contents_date ON contents(date_added);
CREATE INDEX IF NOT EXISTS idx_tags_name ON content_tags(tag_name);
CREATE INDEX IF NOT EXISTS idx_processing_content ON processing_history(content_id);

-- Triggers para manter FTS5 sincronizado
CREATE TRIGGER IF NOT EXISTS contents_ai AFTER INSERT ON contents BEGIN
    INSERT INTO contents_fts(content_id, title, author, content, tags)
    VALUES (new.id, new.title, COALESCE(new.author, ''), '', '');
END;

CREATE TRIGGER IF NOT EXISTS contents_ad AFTER DELETE ON contents BEGIN
    DELETE FROM contents_fts WHERE content_id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS contents_au AFTER UPDATE ON contents BEGIN
    UPDATE contents_fts 
    SET content_id = new.id,
        title = new.title, 
        author = COALESCE(new.author, '')
    WHERE content_id = old.id;
END;
