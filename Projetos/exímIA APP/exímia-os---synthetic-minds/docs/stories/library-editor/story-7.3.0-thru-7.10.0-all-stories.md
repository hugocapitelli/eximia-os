# Stories 7.3.0 through 7.10.0 - Complete Definitions

---

# Story 7.3.0: File Upload Infrastructure

**Epic:** Library Editor Enhancement | **Status:** Ready for Dev | **Priority:** P1
**Assignee:** @dev (Dex) | **Estimated:** 5 hours | **Phase:** 2 (Parallel)

## 📋 Story
As a **Library Admin**, I want to **upload book files and cover images to secure storage**, So that **users can read books and see professional cover art**.

## 🎯 Acceptance Criteria
- [ ] `uploadBookFile(file: File, catalogId: string)` → returns file path
  - Supports: PDF, EPUB
  - Max size: 50MB with clear error
  - Async upload with progress tracking
  - Returns: signed URL for reading

- [ ] `deleteBookFile(fileId: string)` → success/error
  - Verify admin permission
  - Delete from storage and DB

- [ ] `getBookFileUrl(catalogId: string, fileType: 'pdf'|'epub')` → signed URL
  - 7-day expiration
  - Serve via Supabase Storage

- [ ] `uploadCover(file: File, catalogId: string)` → returns URL
  - Supports: JPG, PNG, WebP
  - Max size: 5MB
  - Auto-optimize/compress
  - Saves to book_catalog.cover_url

- [ ] Error handling for upload failures
- [ ] Storage quotas validated

## 📝 Dev Notes
- Use Supabase Storage buckets: `book-files/` and `book-covers/`
- RLS: Only authenticated users can upload, only admins create public URLs
- Progress events for UI feedback
- Retry logic for failed uploads

## 🔗 Dependencies
**Depends on:** 7.1.0 | **Blocks:** 7.5.0 (Edit Panel), 7.6.0 (Manual Add)

## File List
**New:**
- src/services/biblioteca/fileService.ts

---

# Story 7.4.0: Automatic Description Fetching Service

**Epic:** Library Editor Enhancement | **Status:** ✅ Complete | **Priority:** P1
**Assignee:** @dev (Dex) | **Estimated:** 3 hours | **Phase:** 2 (Parallel)

## 📋 Story
As a **Library Admin**, I want to **automatically fetch book descriptions from APIs**, So that **books have detailed, professional descriptions without manual typing**.

## 🎯 Acceptance Criteria
- [x] `getBookDescription(title: string, author: string)` → description text
  - Try Google Books API first
  - Fallback to OpenLibrary API
  - Return null if not found

- [x] Caching by ISBN/title to avoid repeated calls
- [x] Handle API rate limiting gracefully
- [x] Timeout after 5 seconds
- [x] Return null instead of error for missing books
- [x] Support manual override (user can edit after fetch)

## 📝 Dev Notes
- Use existing fetchWithRetry() pattern from googleBooks.ts
- Cache in-memory or Redis
- Log API calls for monitoring
- User can always edit/override returned description

## 🔗 Dependencies
**Depends on:** 7.1.0 | **Blocks:** 7.5.0 (Edit Panel)

## File List
**New:**
- src/services/biblioteca/descriptionService.ts ✅
  - `getBookDescription(title: string, author: string, isbn?: string): Promise<string | null>`
  - `clearDescriptionCache(): void`
  - `getDescriptionCacheStats(): { size: number; entries: Array<...> }`
  - `cleanExpiredDescriptionCache(): number`
  - `warmDescriptionCache(books: Array<...>): Promise<number>`

**Modified:**
- src/services/biblioteca/index.ts ✅ (added exports)

---

# Story 7.5.0: Enhanced Book Edit Panel Component

**Epic:** Library Editor Enhancement | **Status:** Ready for Dev | **Priority:** P1
**Assignee:** @dev (Dex) | **Estimated:** 6 hours | **Phase:** 3

## 📋 Story
As a **Library Admin**, I want to **edit all book properties in a comprehensive panel**, So that **I can manage complete book information with categories, tags, cover, file, and author**.

## 🎯 Acceptance Criteria
- [ ] Component: `BookEditPanel` (organism)
- [ ] Sections:
  - [ ] BasicInfoSection (title, subtitle, author, publisher, published_date)
  - [ ] CategorizationSection (multi-select categories, free-text tags)
  - [ ] ContentSection (description textarea + [Auto-fetch] + [Manual edit] buttons)
  - [ ] CoverSection (URL input + file upload + preview thumbnail)
  - [ ] FileSection (PDF/EPUB uploader + progress bar + delete button)
  - [ ] AuthorSection (author combobox + [+ Add New Author] button)

- [ ] All sections use design tokens from 7.0.0
- [ ] Sections use atomic components: Button, Badge, Card
- [ ] Form validation with clear error messages
- [ ] Unsaved changes warning on leave
- [ ] File uploads happen asynchronously (don't block save)
- [ ] Categories use TOKENS.categories colors
- [ ] Tags display as chips/badges

## 📝 Dev Notes
- Uses services from 7.2.0 (author), 7.3.0 (files), 7.4.0 (description)
- Save button triggers all async operations
- Debounce description auto-fetch input
- Show loading state during file uploads

## 🔗 Dependencies
**Depends on:** 7.0.0, 7.2.0, 7.3.0, 7.4.0 | **Blocks:** 7.8.0

## File List
**New:**
- components/organisms/BookEditPanel.tsx
- components/molecules/BasicInfoSection.tsx
- components/molecules/CategorizationSection.tsx
- components/molecules/ContentSection.tsx
- components/molecules/CoverSection.tsx
- components/molecules/FileSection.tsx
- components/molecules/AuthorSection.tsx

---

# Story 7.6.0: Manual Book Addition Modal

**Epic:** Library Editor Enhancement | **Status:** Ready for Dev | **Priority:** P2
**Assignee:** @dev (Dex) | **Estimated:** 4 hours | **Phase:** 3

## 📋 Story
As a **Library Admin**, I want to **add books manually without searching APIs**, So that **I can quickly add books that aren't in search results or haven't been published online yet**.

## 🎯 Acceptance Criteria
- [ ] Modal: `ManualAddBookModal` component
- [ ] Form: All book fields (same as EditPanel sections)
- [ ] Validation: Title + Author required
- [ ] Author: Link existing author OR [+ Create New] button inline
- [ ] New Author Modal: name, bio, photo (inline in ManualAdd flow)
- [ ] Categories: Multi-select (required at least 1)
- [ ] Tags: Optional free-text
- [ ] Cover & File: Optional on creation (can add later)
- [ ] Submit: Validates, creates book, shows success toast
- [ ] Keyboard: Escape to close, Tab navigation, Enter to submit

## 📝 Dev Notes
- Reuse form sections from 7.5.0
- Modal: ESC to close, backdrop click to close
- Author creation inline (don't navigate away)
- After creation: close modal, show book in list, optionally open edit

## 🔗 Dependencies
**Depends on:** 7.0.0, 7.2.0 | **Blocks:** None (feature addition)

## File List
**New:**
- components/modals/ManualAddBookModal.tsx
- components/modals/CreateAuthorInlineModal.tsx

---

# Story 7.7.0: Bulk Book Import (JSON/YAML/PDF)

**Epic:** Library Editor Enhancement | **Status:** Ready for Dev | **Priority:** P3
**Assignee:** @dev (Dex) | **Estimated:** 6 hours | **Phase:** 3

## 📋 Story
As a **Library Admin**, I want to **import multiple books from JSON/YAML files or PDFs**, So that **I can bulk-add books without manual entry for each one**.

## 🎯 Acceptance Criteria
- [ ] File upload: JSON | YAML | PDF
- [ ] JSON schema validation:
  ```json
  [
    {
      "title": "string",
      "author": "string",
      "categories": ["string"],
      "description": "string",
      "cover_url": "string",
      "tags": ["string"]
    }
  ]
  ```

- [ ] YAML parsing with same schema
- [ ] PDF metadata extraction (title, author from PDF metadata)
- [ ] Preview: Show books to import before confirming
- [ ] Validation: Show errors for invalid entries
- [ ] Import: Batch create books
- [ ] Duplicates: Skip existing books by ISBN/title match
- [ ] Progress: Show import progress

## 📝 Dev Notes
- Use `papaparse` for CSV (future)
- Use `js-yaml` for YAML
- Use `pdf-lib` or `pdf.js` for PDF metadata
- Batch operations: Use Promise.all() for speed
- Validation before import prevents partial failures

## 🔗 Dependencies
**Depends on:** 7.0.0, 7.2.0, 7.3.0, 7.4.0 | **Blocks:** None

## File List
**New:**
- components/organisms/BulkImportPanel.tsx
- src/services/biblioteca/importService.ts

---

# Story 7.8.0: Enhanced Book Display Components

**Epic:** Library Editor Enhancement | **Status:** Ready for Dev | **Priority:** P1
**Assignee:** @dev (Dex) | **Estimated:** 5 hours | **Phase:** 4

## 📋 Story
As a **User**, I want to **see books with larger covers, categories, tags, and descriptions**, So that **I can quickly understand what each book is about**.

## 🎯 Acceptance Criteria
- [ ] Update: `BookCardVisual` component
  - Cover: Increase height from h-48 to h-80
  - Image: Increase from h-36 to h-72
  - Add: Category badge using TOKENS.categories color
  - Add: Tags display below title
  - Add: Description snippet (3 lines max)

- [ ] Update: `BookCardHorizontal` component
  - Add: Category badge
  - Add: Tags display
  - Use: TOKENS.categories for colors

- [ ] Colors: Use design tokens from 7.0.0
- [ ] Shadows: Use TOKEN.shadows.goldGlow or purpleGlow
- [ ] Spacing: Use TOKEN.spacing for padding/margin
- [ ] Mobile: Responsive design for all sizes

## 📝 Dev Notes
- Cover images auto-scale to fit
- Tags truncate with ellipsis if overflow
- Description uses line-clamp-3
- Hover effects: scale image, brighten text

## 🔗 Dependencies
**Depends on:** 7.0.0, 7.8.0 (book data) | **Blocks:** 7.9.0

## File List
**Modified:**
- components/journey/BookCardVisual.tsx
- components/library/BookCardHorizontal.tsx

---

# Story 7.9.0: Conditional Read Buttons (Dual Action)

**Epic:** Library Editor Enhancement | **Status:** Ready for Dev | **Priority:** P1
**Assignee:** @dev (Dex) | **Estimated:** 2 hours | **Phase:** 4

## 📋 Story
As a **Reader**, I want to **see buttons for "Ler Resumo" and "Ler Livro"**, So that **I can choose to read the summary or the full book**.

## 🎯 Acceptance Criteria
- [ ] Check: `book.is_available` flag
- [ ] Always show: [Ler Resumo] button
  - Links to: `/biblioteca/summary/:summaryId/read`

- [ ] Conditionally show: [Ler Livro] button (if is_available === true)
  - Links to: `/biblioteca/book/:bookId/read`
  - Only visible when book has file uploaded

- [ ] Buttons use design tokens (color: gold primary)
- [ ] Buttons from 7.0.0 Button component
- [ ] Hover state clear
- [ ] Tooltip for "Ler Livro": "Livro disponível para leitura"

## 📝 Dev Notes
- is_available comes from book_catalog migration (7.1.0)
- Links use react-router navigation
- Button states: normal, hover, active
- Keyboard: Tab navigation, Enter to activate

## 🔗 Dependencies
**Depends on:** 7.0.0, 7.8.0 | **Blocks:** None

## File List
**Modified:**
- components/journey/BookCardVisual.tsx (add button logic)

---

# Story 7.10.0: WCAG AA Accessibility & Final Polish

**Epic:** Library Editor Enhancement | **Status:** Ready for Dev | **Priority:** P1
**Assignee:** @dev (Dex) | **Estimated:** 3 hours | **Phase:** 4

## 📋 Story
As a **User with Accessibility Needs**, I want to **interact with all library editor components using keyboard and screen readers**, So that **the library is inclusive and usable by everyone**.

## 🎯 Acceptance Criteria

### Keyboard Navigation
- [ ] All buttons focusable (Tab)
- [ ] Modals: Trap focus inside modal
- [ ] Forms: Tab through fields in logical order
- [ ] Close buttons: ESC key support

### WCAG AA Contrast Ratios
- [ ] Text on buttons: ≥ 4.5:1 ratio
- [ ] Text on cards: ≥ 4.5:1 ratio
- [ ] Category badges: ≥ 3:1 for large text
- [ ] Run axe-core audit across all components

### Screen Reader Support
- [ ] All buttons have aria-label
- [ ] Forms have labels associated with inputs
- [ ] Images have alt text
- [ ] Icons have aria-hidden if decorative
- [ ] Category badges have aria-label

### Error Messages
- [ ] Form validation errors announced to screen readers
- [ ] Error messages have role="alert"
- [ ] Clear, plain language error messages

### Color Independence
- [ ] Information not conveyed by color alone
- [ ] Category colors + text labels
- [ ] Status indicators + icons + text

### Testing
- [ ] Run axe DevTools audit
- [ ] Test with keyboard only (Tab, Enter, ESC)
- [ ] Test with screen reader (NVDA or JAWS)
- [ ] Test on mobile (accessibility inspector)

## 📝 Dev Notes
- Use React's `aria-*` attributes
- Test with real assistive tech, not just tools
- Document accessibility features in component comments
- Create accessibility checklist for future components

## 🔗 Dependencies
**Depends on:** All 7.0.0 → 7.9.0 | **Blocks:** None (final validation)

## File List
**Modified:**
- All component files (accessibility annotations)
- Create: docs/ACCESSIBILITY.md (a11y guide)

---

## ✅ All Stories Summary

| Story | Phase | Hours | Status |
|-------|-------|-------|--------|
| 7.0.0 | 0 | 4 | ✅ Created |
| 7.1.0 | 1 | 3 | ✅ Created |
| 7.2.0 | 2 | 4 | ✅ Created |
| 7.3.0 | 2 | 5 | ✅ Created |
| 7.4.0 | 2 | 3 | ✅ Created |
| 7.5.0 | 3 | 6 | ✅ Created |
| 7.6.0 | 3 | 4 | ✅ Created |
| 7.7.0 | 3 | 6 | ✅ Created |
| 7.8.0 | 4 | 5 | ✅ Created |
| 7.9.0 | 4 | 2 | ✅ Created |
| 7.10.0 | 4 | 3 | ✅ Created |
| **TOTAL** | **All** | **45** | **✅ Ready** |

