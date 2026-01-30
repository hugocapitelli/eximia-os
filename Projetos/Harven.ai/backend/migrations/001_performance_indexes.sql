-- ============================================
-- Harven.AI - Performance Indexes Migration
-- ============================================
-- Version: 1.0.0
-- Date: 2026-01-28
-- Description: Add indexes for frequently queried columns
-- ============================================

-- Drop existing indexes if they exist (for idempotency)
DROP INDEX IF EXISTS idx_users_ra;
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_role;
DROP INDEX IF EXISTS idx_disciplines_code;
DROP INDEX IF EXISTS idx_discipline_students_user;
DROP INDEX IF EXISTS idx_discipline_students_discipline;
DROP INDEX IF EXISTS idx_discipline_teachers_user;
DROP INDEX IF EXISTS idx_discipline_teachers_discipline;
DROP INDEX IF EXISTS idx_courses_discipline;
DROP INDEX IF EXISTS idx_courses_created_at;
DROP INDEX IF EXISTS idx_chapters_course;
DROP INDEX IF EXISTS idx_chapters_order;
DROP INDEX IF EXISTS idx_contents_chapter;
DROP INDEX IF EXISTS idx_questions_content;
DROP INDEX IF EXISTS idx_system_logs_created_at;
DROP INDEX IF EXISTS idx_system_logs_level;

-- ============================================
-- USERS TABLE INDEXES
-- ============================================

-- Index for login queries (RA lookup)
CREATE INDEX idx_users_ra ON users (ra);

-- Index for email lookup (alternative login)
CREATE INDEX idx_users_email ON users (email);

-- Index for role-based queries (filtering by role)
CREATE INDEX idx_users_role ON users (role);

-- Composite index for role + created_at (admin user lists)
CREATE INDEX idx_users_role_created ON users (role, created_at DESC);

-- ============================================
-- DISCIPLINES TABLE INDEXES
-- ============================================

-- Index for discipline code lookup
CREATE INDEX idx_disciplines_code ON disciplines (code);

-- Index for department filtering
CREATE INDEX idx_disciplines_department ON disciplines (department);

-- ============================================
-- DISCIPLINE RELATIONSHIPS INDEXES
-- ============================================

-- Student-discipline relationship (both directions)
CREATE INDEX idx_discipline_students_user ON discipline_students (user_id);
CREATE INDEX idx_discipline_students_discipline ON discipline_students (discipline_id);

-- Composite index for quick membership check
CREATE UNIQUE INDEX idx_discipline_students_membership
    ON discipline_students (discipline_id, user_id);

-- Teacher-discipline relationship
CREATE INDEX idx_discipline_teachers_user ON discipline_teachers (user_id);
CREATE INDEX idx_discipline_teachers_discipline ON discipline_teachers (discipline_id);

-- Composite index for quick teacher lookup
CREATE UNIQUE INDEX idx_discipline_teachers_assignment
    ON discipline_teachers (discipline_id, user_id);

-- ============================================
-- COURSES TABLE INDEXES
-- ============================================

-- Index for filtering courses by discipline
CREATE INDEX idx_courses_discipline ON courses (discipline_id);

-- Index for recent courses (dashboard)
CREATE INDEX idx_courses_created_at ON courses (created_at DESC);

-- Composite index for discipline + created_at
CREATE INDEX idx_courses_discipline_created
    ON courses (discipline_id, created_at DESC);

-- ============================================
-- CHAPTERS TABLE INDEXES
-- ============================================

-- Index for getting chapters by course
CREATE INDEX idx_chapters_course ON chapters (course_id);

-- Index for ordered chapter listing
CREATE INDEX idx_chapters_order ON chapters (course_id, "order");

-- ============================================
-- CONTENTS TABLE INDEXES
-- ============================================

-- Index for getting contents by chapter
CREATE INDEX idx_contents_chapter ON contents (chapter_id);

-- Index for content type filtering
CREATE INDEX idx_contents_type ON contents (content_type);

-- Composite index for ordered content listing
CREATE INDEX idx_contents_chapter_order
    ON contents (chapter_id, "order");

-- ============================================
-- QUESTIONS TABLE INDEXES
-- ============================================

-- Index for getting questions by content
CREATE INDEX idx_questions_content ON questions (content_id);

-- Index for difficulty filtering
CREATE INDEX idx_questions_difficulty ON questions (difficulty);

-- Index for cognitive level analysis
CREATE INDEX idx_questions_cognitive ON questions (cognitive_level);

-- ============================================
-- SYSTEM LOGS TABLE INDEXES
-- ============================================

-- Index for recent logs (monitoring)
CREATE INDEX idx_system_logs_created_at ON system_logs (created_at DESC);

-- Index for filtering by log level
CREATE INDEX idx_system_logs_level ON system_logs (level);

-- Composite index for level + time range queries
CREATE INDEX idx_system_logs_level_created
    ON system_logs (level, created_at DESC);

-- Index for user activity tracking
CREATE INDEX idx_system_logs_user ON system_logs (user_id);

-- ============================================
-- FULL-TEXT SEARCH INDEXES (PostgreSQL)
-- ============================================

-- Full-text search on course titles and descriptions
CREATE INDEX idx_courses_search ON courses
    USING gin(to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Full-text search on chapter titles
CREATE INDEX idx_chapters_search ON chapters
    USING gin(to_tsvector('portuguese', coalesce(title, '')));

-- Full-text search on content
CREATE INDEX idx_contents_search ON contents
    USING gin(to_tsvector('portuguese', coalesce(title, '') || ' ' || coalesce(content, '')));

-- ============================================
-- STATISTICS UPDATE
-- ============================================

-- Update table statistics for query planner
ANALYZE users;
ANALYZE disciplines;
ANALYZE discipline_students;
ANALYZE discipline_teachers;
ANALYZE courses;
ANALYZE chapters;
ANALYZE contents;
ANALYZE questions;
ANALYZE system_logs;

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify indexes were created:
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename;
