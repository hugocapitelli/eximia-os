// ExplorePage - Catalog exploration with search and filters
// EXIMIA-104

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Grid, List, Plus, Loader2 } from 'lucide-react';
import { BookCard, BookSearchModal } from '../../components/biblioteca';
import { getCatalogBooks, isAdmin } from '../../services/biblioteca';
import type { BookCatalog, BookCategory } from '../../types/biblioteca';
import { BOOK_CATEGORIES } from '../../types/biblioteca';
import toast from 'react-hot-toast';

type ViewMode = 'grid' | 'list';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  // Load books
  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCatalogBooks({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        limit: 50,
      });

      if (result.success && result.data) {
        setBooks(result.data.data);
      } else {
        toast.error(result.error || 'Erro ao carregar livros');
      }
    } catch (error) {
      toast.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  // Check admin status
  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await isAdmin();
      setUserIsAdmin(admin);
    };
    checkAdmin();
  }, []);

  // Load books on mount and when filters change
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Handle search with debounce
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#050505]/95 backdrop-blur-sm border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Explorar Biblioteca</h1>

            {/* Admin: Add Book Button */}
            {userIsAdmin && (
              <button
                onClick={() => setShowSearchModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar Livro
              </button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Buscar por título ou autor..."
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-zinc-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as BookCategory | 'all')}
                className="px-3 py-2.5 bg-zinc-900 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">Todas Categorias</option>
                {BOOK_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}
                aria-label="Visualização em grade"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}
                aria-label="Visualização em lista"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">Nenhum livro encontrado</p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-amber-500 hover:text-amber-400"
              >
                Limpar busca
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                : 'space-y-4'
            }
          >
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onClick={() => navigate(`/biblioteca/book/${book.id}`)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </main>

      {/* Admin: Search Modal */}
      {userIsAdmin && (
        <BookSearchModal
          isOpen={showSearchModal}
          onClose={() => setShowSearchModal(false)}
          onBookAdded={(newBook) => {
            setBooks((prev) => [newBook, ...prev]);
          }}
        />
      )}
    </div>
  );
};

export default ExplorePage;
