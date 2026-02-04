# Library Editor Enhancement - Stories Manifest

**Epic:** Library Editor Enhancement v7.0.0
**Total Stories:** 10
**Total Estimated Time:** 45 hours
**Phase Breakdown:** 0 (4h) + 1-4 (15h parallelizável) + 5-7 (16h) + 8-10 (10h)

---

## 📋 Stories Roadmap

### Phase 0: Foundation (BLOCKER - 4h)
✅ **Story 7.0.0** - Design Tokens & Atomic Components
- Creates: design-tokens.ts, Button, Badge, Card atoms
- Blocks: All other stories

### Phase 1: Database (3h)
✅ **Story 7.1.0** - Database Schema Extensions
- Creates: book_files, book_tags tables
- Extends: book_catalog, authors

### Phase 2: Author Management (4h) [Parallel with 7.3, 7.4]
📝 **Story 7.2.0** - Author Management Services
- Services: createAuthor, linkAuthor, checkAuthorExists, getAuthorBooks
- Uses: authors table extensions from 7.1.0

### Phase 3: File Infrastructure (5h) [Parallel with 7.2, 7.4]
📝 **Story 7.3.0** - File Upload Infrastructure
- Services: uploadBookFile, deleteBookFile, getBookFileUrl
- Storage: Supabase Storage integration
- Upload: Cover images and book files (PDF/EPUB)

### Phase 4: Description API (3h) [Parallel with 7.2, 7.3]
📝 **Story 7.4.0** - Automatic Description Fetching
- Services: getBookDescription (Google Books API + OpenLibrary API)
- Fallback: Manual input option
- Cache: By ISBN to avoid repeated calls

### Phase 5: Edit Panel UI (6h)
📝 **Story 7.5.0** - Enhanced Book Edit Panel Component
- Component: BookEditPanel organism
- Sections: BasicInfo, Categorization, Content, Cover, File, Author
- Uses: Atoms from 7.0.0, Services from 7.2-7.4

### Phase 6: Manual Add Modal (4h)
📝 **Story 7.6.0** - Manual Book Addition Modal
- Component: ManualAddBookModal
- Form: All book fields (title, author, categories, tags, description, cover, file)
- Author: Link existing or [+ Create] button inline

### Phase 7: Bulk Import (6h)
📝 **Story 7.7.0** - Bulk Book Import (JSON/YAML/PDF)
- Component: BulkImportPanel
- Parsers: JSON, YAML file parsers
- PDF: Extract metadata from PDF
- Preview: Show books to import before confirming

### Phase 8: Enhanced Book Cards (5h)
📝 **Story 7.8.0** - Enhanced Book Display Components
- Update: BookCardVisual, BookCardHorizontal
- Add: Categories display, tags display, description snippet
- Design: Use design tokens from 7.0.0
- Cover: Larger preview (h-80)

### Phase 9: Dual Action Buttons (2h)
📝 **Story 7.9.0** - Conditional Read Buttons
- Buttons: "Ler Resumo" (always) + "Ler Livro" (if has_file)
- Logic: Check is_available flag
- Navigation: Link to reading pages

### Phase 10: Accessibility & Quality (3h)
📝 **Story 7.10.0** - WCAG AA Accessibility & Final Polish
- Audit: WCAG AA compliance across all new components
- Tests: A11y tests for buttons, forms, cards
- Polish: Visual refinements, error handling, edge cases

---

## 🔄 Dependency Graph

```
7.0.0 (Design Tokens)
  ↓
7.1.0 (Database)
  ├─→ 7.2.0 (Author Mgmt) ──┐
  ├─→ 7.3.0 (File Upload) ──┤ (Run in parallel)
  └─→ 7.4.0 (Description) ──┘
       ↓
       7.5.0 (Edit Panel) ────┐
       7.6.0 (Manual Modal) ──┤ (Run in parallel)
       7.7.0 (Bulk Import) ───┘
            ↓
            7.8.0 (Book Cards) ──┐
            7.9.0 (Dual Buttons) ┤ (Run in parallel)
            7.10.0 (A11y) ───────┘
```

---

## 📊 Parallelization Strategy

### Parallel Track 1: Backend Services (7.2-7.4)
- Can run simultaneously after 7.1.0
- 4h + 5h + 3h = 12h real work, 5h wall time

### Parallel Track 2: Frontend Components (7.5-7.7)
- Can run simultaneously after 7.0.0
- 6h + 4h + 6h = 16h real work, 6h wall time

### Parallel Track 3: Final Polish (7.8-7.10)
- Can run simultaneously after 7.5-7.7 complete
- 5h + 2h + 3h = 10h real work, 5h wall time

**Total Wall Time:** ~25 hours (vs 45 hours sequential)

---

## 🎯 Story Sizes & Complexity

| Story | Size | Complexity | Critical | Notes |
|-------|------|-----------|----------|-------|
| 7.0.0 | XS | Low | ✅ Blocker | Foundation |
| 7.1.0 | S | Low | ✅ | Schema only |
| 7.2.0 | M | Medium | ✅ | CRUD ops |
| 7.3.0 | M | Medium | ✅ | File handling |
| 7.4.0 | S | Medium | ✅ | API integration |
| 7.5.0 | L | High | ✅ | Main feature |
| 7.6.0 | M | Medium | - | Variant of 7.5 |
| 7.7.0 | L | High | - | Complex parsing |
| 7.8.0 | M | Medium | - | UI updates |
| 7.9.0 | XS | Low | - | Simple conditional |
| 7.10.0 | S | Medium | - | Quality gate |

---

## 📝 Individual Story Templates

Each story includes:
- ✅ User Story (As a... I want... So that...)
- ✅ Acceptance Criteria (detailed checkboxes)
- ✅ Dev Notes (technical guidance)
- ✅ Dependencies (blocks/blocked-by)
- ✅ Dev Agent Record (for tracking)
- ✅ Definition of Done (quality gates)

---

## 🚀 Ready to Create Individual Stories?

Stories will be created in sequence:
1. ✅ Story 7.0.0 - Design Tokens (CREATED)
2. ✅ Story 7.1.0 - Database (CREATED)
3. → Story 7.2.0 - Author Management (ready)
4. → Story 7.3.0 - File Upload (ready)
5. → Story 7.4.0 - Description API (ready)
6. → Story 7.5.0 - Edit Panel (ready)
7. → Story 7.6.0 - Manual Modal (ready)
8. → Story 7.7.0 - Bulk Import (ready)
9. → Story 7.8.0 - Book Cards (ready)
10. → Story 7.9.0 - Dual Buttons (ready)
11. → Story 7.10.0 - A11y & Polish (ready)

---

## 📋 Next Steps

1. **Review Manifest** - Validate parallelization strategy
2. **Create Individual Stories** - Generate story files 7.2.0 → 7.10.0
3. **Add to Backlog** - Sequence in sprint planning
4. **Assign to @dev** - Begin with story 7.0.0
5. **Monitor Progress** - Track completion and blockers

