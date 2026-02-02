// BookSearchModal Component - Search and add books to catalog (Admin)
// EXIMIA-103

import React, { useState, useCallback } from 'react';
import { Search, X, Plus, Loader2 } from 'lucide-react';
import type { BookSearchResult, BookCatalog, BookSearchModalProps } from '../../types/biblioteca';
import { searchGoogleBooks, addBookFromSearch } from '../../services/biblioteca';
import toast from 'react-hot-toast';

export function BookSearchModal({
  isOpen,
  onClose,
  onBookAdded,
}: BookSearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const books = await searchGoogleBooks(query);
      setResults(books);
    } catch (error) {
      toast.error('Erro ao buscar livros');
    } finally {
      setIsSearching(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAdd = async (book: BookSearchResult) => {
    setAddingId(book.externalId);
    try {
      const result = await addBookFromSearch(book);

      if (result.success && result.data) {
        toast.success('Livro adicionado ao catálogo!');
        onBookAdded?.(result.data);
        // Remove from results
        setResults(prev => prev.filter(b => b.externalId !== book.externalId));
      } else {
        toast.error(result.error || 'Erro ao adicionar livro');
      }
    } catch (error) {
      toast.error('Erro ao adicionar livro');
    } finally {
      setAddingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Adicionar Livro ao Catálogo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Buscar por título, autor ou ISBN..."
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border-0 focus:ring-2 focus:ring-amber-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              onClick={handleSearch}
              disabled={isSearching || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Buscar'
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {results.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {isSearching ? (
                <Loader2 className="w-8 h-8 animate-spin mx-auto" />
              ) : (
                <p>Busque um livro para adicionar ao catálogo</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((book) => (
                <div
                  key={book.externalId}
                  className="flex gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  {/* Cover */}
                  <div className="w-16 h-24 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden">
                    {book.thumbnailUrl ? (
                      <img
                        src={book.thumbnailUrl}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        📚
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold line-clamp-1">{book.title}</h3>
                    {book.authors.length > 0 && (
                      <p className="text-sm text-gray-500 truncate">
                        {book.authors.join(', ')}
                      </p>
                    )}
                    {book.publishedDate && (
                      <p className="text-xs text-gray-400 mt-1">
                        {book.publishedDate}
                      </p>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => handleAdd(book)}
                    disabled={addingId === book.externalId}
                    className="flex-shrink-0 self-center p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                  >
                    {addingId === book.externalId ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
