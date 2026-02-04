# Story 7.2.0: Author Management Services

**Epic:** Library Editor Enhancement
**Status:** Ready for Dev
**Priority:** P1
**Assignee:** @dev (Dex)
**Estimated:** 4 hours
**Phase:** 2 (Parallel with 7.3, 7.4)

---

## 📋 Story

As a **Library Admin**,
I want to **manage authors separately and link them to books**,
So that **books can reference author profiles with bios, photos, and social links**.

---

## 🎯 Acceptance Criteria

### Services Created
- [ ] `createAuthor(name: string, bio?: string, photoUrl?: string, socialLinks?: any)`
  - [ ] Validate name is not empty
  - [ ] Return created author with id

- [ ] `linkAuthorToBook(bookId: string, authorId: string)`
  - [ ] Update book_catalog.author_id
  - [ ] Verify author exists

- [ ] `checkAuthorExists(name: string): boolean`
  - [ ] Case-insensitive search
  - [ ] Return true/false

- [ ] `getAuthorByName(name: string)`
  - [ ] Return full author object or null

- [ ] `getAuthorBooks(authorId: string)`
  - [ ] Return array of books by author

### Error Handling
- [ ] Author not found errors caught properly
- [ ] Duplicate author names handled (allow if different ID)
- [ ] Validation errors with clear messages

### Integration
- [ ] Export all services from `src/services/biblioteca/index.ts`
- [ ] Update type exports in `src/types/biblioteca.ts`

---

## 📝 Dev Notes

### File Structure
```
src/services/biblioteca/
├─ authorService.ts (NEW)
├─ index.ts (UPDATE - add exports)
```

### Database Operations
- Use Supabase client from existing patterns
- Follow RLS policies for authors table
- Admins only for create/update

### Testing
- [ ] Create author successfully
- [ ] Find existing author
- [ ] Link author to book
- [ ] Get author books
- [ ] Handle non-existent author gracefully

---

## 🔗 Dependencies

**Depends on:** 7.1.0 (Database), 7.0.0 (Design Tokens - indirect)
**Blocks:** 7.5.0 (Edit Panel needs author linking)

**Related Files:**
- New: `src/services/biblioteca/authorService.ts`
- Update: `src/services/biblioteca/index.ts`
- Update: `src/types/biblioteca.ts` (if new types needed)

---

## 📊 Dev Agent Record

### Code Quality Review (CodeRabbit)
- Check: Error handling patterns
- Check: Type safety
- Check: Query efficiency
- Check: RLS policy alignment

### Completion Notes
```
[Pending]
```

### File List
**New:**
- src/services/biblioteca/authorService.ts

**Modified:**
- src/services/biblioteca/index.ts

### Change Log
```
[Pending]
```

---

## ✅ Definition of Done
- All author services working
- Error handling complete
- Types properly exported
- No TypeScript errors
- Ready for UI integration (Story 7.5.0)

