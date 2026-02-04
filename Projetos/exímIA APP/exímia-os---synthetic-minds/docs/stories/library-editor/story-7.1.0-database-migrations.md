# Story 7.1.0: Database Schema Extensions & Indexes

**Epic:** Library Editor Enhancement
**Status:** Ready for Dev
**Priority:** P1
**Assignee:** @dev (Dex)
**Estimated:** 3 hours
**Phase:** 1 (Database)

---

## 📋 Story

As a **Backend Developer**,
I want to **extend the book_catalog schema with new fields and create supporting tables**,
So that **we can store book files, tags, and normalized metadata for the enhanced editor**.

---

## 🎯 Acceptance Criteria

### book_catalog Extensions
- [ ] Add `tags TEXT[]` - array of custom tags
- [ ] Add `book_file_path TEXT` - path to uploaded PDF/EPUB
- [ ] Add `is_available BOOLEAN` - flag if book file exists for reading
- [ ] Add `synopsys_source TEXT` - tracks source (api | manual | ai)
- [ ] Add `synopsys_fetched_at TIMESTAMP` - when synopsys was fetched
- [ ] Migrate existing books without error (null values for new fields)

### New Table: book_files
- [ ] Create table with columns:
  - [ ] `id UUID PRIMARY KEY`
  - [ ] `catalog_id UUID REFERENCES book_catalog(id)` ON DELETE CASCADE
  - [ ] `file_path TEXT UNIQUE NOT NULL`
  - [ ] `file_type TEXT` - CHECK (pdf | epub | json | yaml)
  - [ ] `file_size INTEGER NOT NULL`
  - [ ] `mime_type TEXT NOT NULL`
  - [ ] `uploaded_at TIMESTAMP DEFAULT NOW()`
  - [ ] `uploaded_by UUID REFERENCES auth.users(id)`
- [ ] Add CONSTRAINT: unique_file_per_catalog UNIQUE(catalog_id, file_type)

### New Table: book_tags
- [ ] Create table with columns:
  - [ ] `id UUID PRIMARY KEY`
  - [ ] `catalog_id UUID REFERENCES book_catalog(id)` ON DELETE CASCADE
  - [ ] `tag TEXT NOT NULL`
  - [ ] `created_at TIMESTAMP DEFAULT NOW()`
- [ ] Add CONSTRAINT: unique_tag_per_book UNIQUE(catalog_id, tag)

### Authors Table Extensions
- [ ] Add `biography TEXT` - author biography
- [ ] Add `photo_url TEXT` - author photo URL
- [ ] Add `social_links JSONB` - social media links
- [ ] Add `is_verified BOOLEAN DEFAULT false` - author verified status

### Database Indexes
- [ ] Create `idx_book_files_catalog` on book_files(catalog_id)
- [ ] Create `idx_book_tags_catalog` on book_tags(catalog_id)
- [ ] Create `idx_book_tags_tag` on book_tags(tag)
- [ ] Create `idx_book_catalog_has_file` on book_catalog(is_available)

### RLS Policies
- [ ] book_files: Anyone can read, only admins can write/delete
- [ ] book_tags: Anyone can read, only book owners can write/delete
- [ ] Update authors RLS for new fields (same as existing)

### Testing
- [ ] Verify migrations run without errors
- [ ] Verify existing data preserved
- [ ] Verify constraints work (duplicate tags rejected)
- [ ] Verify indexes created
- [ ] Verify RLS policies applied

---

## 📝 Dev Notes

### Migration Strategy
- Use Supabase migrations in `supabase/migrations/`
- Name: `YYYYMMDDHHMMSS_add_library_enhancements.sql`
- Include both table creation AND data preservation for existing books

### Rollback Plan
Include down() migration that:
- Removes new tables
- Removes new columns from book_catalog and authors

### Testing Queries
```sql
-- Verify book_files table
SELECT * FROM book_files LIMIT 1;

-- Verify book_tags table
SELECT * FROM book_tags LIMIT 1;

-- Verify indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'book_files';

-- Verify constraints
SELECT constraint_name FROM information_schema.table_constraints
WHERE table_name = 'book_files';
```

---

## 🔗 Dependencies

**Depends on:** Story 7.0.0 (Design Tokens - needs to be deployed but no direct code dependency)
**Blocks:** Stories 7.2.0, 7.3.0, 7.4.0 (all backend services)

**Related Files:**
- New: `supabase/migrations/[timestamp]_add_library_enhancements.sql`
- `src/types/biblioteca.ts` (update interfaces after migration)

---

## 📊 Dev Agent Record

### Agent Model Used
- claude-haiku-4-5-20251001

### Code Quality Review (CodeRabbit)
**Scheduled:** After SQL written
- Check: SQL syntax correctness
- Check: Constraint definitions proper
- Check: Index naming conventions
- Check: No data loss in migration

### Debug Log
```
[Pending - Not started]
```

### Completion Notes
```
[Pending - Not started]
```

### File List
**New:**
- supabase/migrations/[timestamp]_add_library_enhancements.sql

**Modified:**
- None (migration-only)

### Change Log
```
[Pending - Not started]
```

---

## ✅ Definition of Done
- Migration file created and tested locally
- All tables created with proper constraints
- All indexes created
- RLS policies applied
- Existing data preserved
- No errors on rollback
- Ready for Phase 2 (Author services)

