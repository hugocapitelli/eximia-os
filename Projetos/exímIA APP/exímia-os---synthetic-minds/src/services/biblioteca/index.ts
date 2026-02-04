// Biblioteca Services - Module Exports
// FASE 01

// Google Books API
export {
  searchGoogleBooks,
  getGoogleBookById,
  searchOpenLibrary,
  clearSearchCache,
  hybridBookSearch,
} from './googleBooks';

// AI Book Service
export {
  generateBookInfo,
  enhanceBookData,
  getAIBookSuggestions,
  aiInfoToSearchResult,
} from './aiBookService';

// Catalog
export {
  isAdmin,
  addBookToCatalog,
  addBookFromSearch,
  getCatalogBooks,
  getCatalogBook,
  getCatalogByCategory,
  getPopularBooks,
  getBooksWithSummaries,
  deleteBookFromCatalog,
  updateCatalogBook,
} from './catalog';

// Favorites
export {
  toggleFavorite,
  checkFavorites,
  isFavorited,
  getUserFavorites,
  getFavoritesCount,
  getUserStats,
  removeFromFavorites,
} from './favorites';

// Notes
export {
  createNote,
  updateNote,
  deleteNote,
  getNotes,
  getNote,
  getNotesCountByType,
  getAllUserNotes,
} from './notes';

// Summaries
export {
  getSummaryByCatalog,
  getSummaryWithChapters,
  getChapter,
  saveReadingProgress,
  getReadingProgress,
  getReadingProgress as getUserReadingProgress,
  saveReadingPreferences,
  getReadingPreferences,
  getReadingPreferences as getUserPreferences,
  createSummary,
  listSummaries,
  publishSummary,
  unpublishSummary,
  deleteSummary,
  addChapter,
  addChapter as createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
  updateSummary,
  getBookSummaries,
} from './summaries';

// Description Service (Story 7.4.0)
export {
  getBookDescription,
  clearDescriptionCache,
  getDescriptionCacheStats,
  cleanExpiredDescriptionCache,
  warmDescriptionCache,
} from './descriptionService';

// Notes - additional aliases
export { getNotes as getBookNotes } from './notes';

// Authors (Story 7.2.0)
export {
  createAuthor,
  linkAuthorToBook,
  checkAuthorExists,
  getAuthorByName,
  getAuthorBooks,
} from './authorService';
