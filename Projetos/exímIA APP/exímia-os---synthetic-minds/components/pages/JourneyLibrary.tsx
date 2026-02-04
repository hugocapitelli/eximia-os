import React, { useState, useMemo, useEffect } from 'react';
import { JOURNEY_BOOKS, CLONES } from '../../constants';
import { BOOK_CATEGORIES, type CategoryConfig, type BookCatalogView } from '@/types/biblioteca';
import { getCatalogBooks } from '@/services/biblioteca/catalog';
import { BookCardVisual } from '../journey/BookCardVisual';
import { Button } from '../atoms/Button';
import {
  LibraryHero,
  BookCardHorizontal,
  CollectionCard,
  CategoryChips,
  AuthorCard,
} from '../library';
import {
  Plus,
  BookOpen,
  Clock,
  CheckCircle2,
  Library,
  Users,
  GraduationCap,
  Compass,
  Search,
  ChevronRight,
  Heart,
} from 'lucide-react';

// Mock authors data
const AUTHORS = [
  { id: '1', name: 'Cal Newport', booksCount: 4, specialty: 'Produtividade', hasMind: false },
  { id: '2', name: 'James Clear', booksCount: 2, specialty: 'Habitos', hasMind: false },
  { id: '3', name: 'Nassim Taleb', booksCount: 5, specialty: 'Filosofia', hasMind: false },
  { id: '4', name: 'Marty Cagan', booksCount: 3, specialty: 'Produto', hasMind: false },
  { id: '5', name: 'Steven Pinker', booksCount: 6, specialty: 'Psicologia', hasMind: false },
  { id: '6', name: 'Aldous Huxley', booksCount: 8, specialty: 'Ficcao', hasMind: false },
];

// Mock collections
const COLLECTIONS = [
  { id: '1', name: 'Naval Ravikant', icon: '🧠', bookCount: 5 },
  { id: '2', name: 'Inteligência Artificial', icon: '🤖', bookCount: 10 },
  { id: '3', name: 'Alta Performance', icon: '🚀', bookCount: 8 },
  { id: '4', name: 'Filosofia Clássica', icon: '📜', bookCount: 12 },
];

// Categories for filtering - using BOOK_CATEGORIES from types
const CATEGORIES: (CategoryConfig | { name: string; label: string })[] = [
  { name: 'todos', label: 'Todos' },
  ...BOOK_CATEGORIES,
];

interface JourneyLibraryProps {
  onNavigateToBook?: (bookId: string) => void;
  onNavigateToAuthor?: (authorName: string) => void;
}

export const JourneyLibrary: React.FC<JourneyLibraryProps> = ({
  onNavigateToBook,
  onNavigateToAuthor,
}) => {
  const [mainTab, setMainTab] = useState<'explorar' | 'autores' | 'favoritos' | 'cursos' | 'comunidade'>('explorar');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [catalogBooks, setCatalogBooks] = useState<BookCatalogView[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  // Load books from database
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoadingBooks(true);
      const result = await getCatalogBooks({
        limit: 100,
        category: selectedCategory === 'todos' ? undefined : selectedCategory,
      });
      if (result.success && result.data) {
        setCatalogBooks(result.data.data);
      }
      setIsLoadingBooks(false);
    };

    loadBooks();
  }, [selectedCategory]);

  // Check if author has a corresponding Mind
  const authorHasMind = (authorName: string): boolean => {
    return CLONES.some(
      (clone) =>
        clone.name.toLowerCase().includes(authorName.toLowerCase()) ||
        authorName.toLowerCase().includes(clone.name.toLowerCase())
    );
  };

  const handleToggleFavorite = (bookId: string) => {
    setFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const mainTabs = [
    { id: 'explorar', label: 'Explorar', icon: Compass },
    { id: 'autores', label: 'Autores', icon: Users },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'cursos', label: 'Cursos', icon: GraduationCap },
    { id: 'comunidade', label: 'Comunidade', icon: Users },
  ];

  // Filter books - already filtered by category in useEffect
  const filteredBooks = useMemo(() => {
    return catalogBooks;
  }, [catalogBooks]);

  // Get new releases (first 2 books from catalog)
  const newReleases = catalogBooks.slice(0, 2);

  // Books by status for Favoritos tab (using favorites state)
  // Since catalog data doesn't have status, we use the mock data for now
  const readingBooks = JOURNEY_BOOKS.filter((b) => b.status === 'reading');
  const toReadBooks = JOURNEY_BOOKS.filter((b) => b.status === 'to_read');
  const completedBooks = JOURNEY_BOOKS.filter((b) => b.status === 'completed');

  // Stats calculation
  const readingCount = readingBooks.length;
  const completedCount = completedBooks.length;
  const toReadCount = toReadBooks.length;

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#050505]/80 border-b border-[#1F1F22]">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              {mainTabs.map((tab, idx) => (
                <React.Fragment key={tab.id}>
                  <button
                    onClick={() => setMainTab(tab.id as any)}
                    className={`text-xs font-bold tracking-widest transition-colors ${
                      mainTab === tab.id
                        ? 'text-white'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {tab.label.toUpperCase()}
                  </button>
                  {idx === 2 && <div className="h-4 w-[1px] bg-zinc-800" />}
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-0 top-1.5 w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
              <input
                type="text"
                placeholder="BUSCAR..."
                className="bg-transparent border-b border-zinc-800 text-[10px] font-bold tracking-widest py-1 pl-5 w-32 focus:w-48 focus:border-zinc-500 focus:outline-none transition-all text-zinc-300 placeholder-zinc-700 uppercase"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        {/* ============================================= */}
        {/* TAB: EXPLORAR (Amber accent) */}
        {/* ============================================= */}
        {mainTab === 'explorar' && (
          <>
            {/* Hero Section */}
            <LibraryHero
              variant="explore"
              bookCount={catalogBooks.length}
              onCTA={() => {
                // Scroll to catalog
                document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* NOVIDADES - Lançamentos */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                    NOVIDADES
                  </span>
                  <h2 className="text-xl font-bold text-white">Lançamentos</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {newReleases.map((book) => (
                  <BookCardHorizontal
                    key={book.id}
                    book={{
                      ...book,
                      author: book.author_name || 'Autor desconhecido',
                      coverUrl: book.cover_url || book.thumbnail_url,
                    } as any}
                    onBookClick={() => onNavigateToBook?.(book.id)}
                    onAuthorClick={() => onNavigateToAuthor?.(book.author_name || '')}
                  />
                ))}
              </div>
            </section>

            {/* CURADORIA - Coleções */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                    CURADORIA
                  </span>
                  <h2 className="text-xl font-bold text-white">Coleções</h2>
                </div>
                <button className="text-xs text-zinc-500 hover:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                  VER TODAS <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COLLECTIONS.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onClick={(id) => console.log('Collection clicked:', id)}
                  />
                ))}
              </div>
            </section>

            {/* Divider */}
            <div className="border-t border-[#1F1F22] my-10" />

            {/* Category Chips */}
            <CategoryChips
              categories={CATEGORIES}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />

            {/* CATÁLOGO COMPLETO */}
            <section id="catalogo" className="mt-8">
              <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-bold text-zinc-500 tracking-[0.2em]">
                    CATÁLOGO COMPLETO
                  </h2>
                  <div className="h-[1px] w-12 bg-zinc-800" />
                </div>
                <span className="text-[10px] font-bold text-zinc-600 tracking-wider">
                  {filteredBooks.length} obras
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCardVisual
                    key={book.id}
                    book={{
                      ...book,
                      author: book.author_name || 'Autor desconhecido',
                      coverUrl: book.cover_url || book.thumbnail_url,
                      isFavorite: favorites.includes(book.id),
                    } as any}
                    onClick={() => onNavigateToBook?.(book.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onNavigateToAuthor={onNavigateToAuthor}
                    showAuthorButton={true}
                    hasMind={authorHasMind(book.author_name || '')}
                  />
                ))}

                {filteredBooks.length === 0 && (
                  <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-800 rounded-xl">
                    <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-400">
                      Nenhum livro encontrado nesta categoria.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* ============================================= */}
        {/* TAB: AUTORES */}
        {/* ============================================= */}
        {mainTab === 'autores' && (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-zinc-100">Autores</h1>
              <p className="text-zinc-400 mt-1 font-serif text-lg">
                Explore autores e suas obras.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {AUTHORS.map((author) => (
                <AuthorCard
                  key={author.id}
                  author={{
                    ...author,
                    hasMind: authorHasMind(author.name),
                  }}
                  onClick={() => onNavigateToAuthor?.(author.name)}
                />
              ))}
            </div>
          </>
        )}

        {/* ============================================= */}
        {/* TAB: FAVORITOS / MEUS LIVROS (Violet accent) */}
        {/* ============================================= */}
        {mainTab === 'favoritos' && (
          <>
            {/* Hero Section */}
            <LibraryHero
              variant="favorites"
              bookCount={readingCount + toReadCount + completedCount}
              onCTA={() => {}}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F22] flex items-center gap-4">
                <div className="p-3 bg-violet-900/20 rounded-lg text-violet-400">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100">{readingCount}</p>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                    Lendo
                  </p>
                </div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F22] flex items-center gap-4">
                <div className="p-3 bg-emerald-900/20 rounded-lg text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100">{completedCount}</p>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                    Concluídos
                  </p>
                </div>
              </div>
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F22] flex items-center gap-4">
                <div className="p-3 bg-zinc-800 rounded-lg text-zinc-500">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-100">{toReadCount}</p>
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">
                    Lista de Desejos
                  </p>
                </div>
              </div>
            </div>

            {/* LENDO AGORA */}
            {readingBooks.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">
                    EM PROGRESSO
                  </span>
                  <h2 className="text-xl font-bold text-white">Lendo Agora</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {readingBooks.map((book) => (
                    <BookCardVisual
                      key={book.id}
                      book={{ ...book, isFavorite: favorites.includes(book.id) }}
                      onClick={() => onNavigateToBook?.(book.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onNavigateToAuthor={onNavigateToAuthor}
                      showAuthorButton={true}
                      hasMind={authorHasMind(book.author)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* LISTA DE DESEJOS */}
            {toReadBooks.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-bold text-violet-500 uppercase tracking-widest">
                    PARA LER
                  </span>
                  <h2 className="text-xl font-bold text-white">Lista de Desejos</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {toReadBooks.map((book) => (
                    <BookCardVisual
                      key={book.id}
                      book={{ ...book, isFavorite: favorites.includes(book.id) }}
                      onClick={() => onNavigateToBook?.(book.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onNavigateToAuthor={onNavigateToAuthor}
                      showAuthorButton={true}
                      hasMind={authorHasMind(book.author)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* CONCLUÍDOS */}
            {completedBooks.length > 0 && (
              <section className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    FINALIZADOS
                  </span>
                  <h2 className="text-xl font-bold text-white">Concluídos</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {completedBooks.map((book) => (
                    <BookCardVisual
                      key={book.id}
                      book={{ ...book, isFavorite: favorites.includes(book.id) }}
                      onClick={() => onNavigateToBook?.(book.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onNavigateToAuthor={onNavigateToAuthor}
                      showAuthorButton={true}
                      hasMind={authorHasMind(book.author)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty State */}
            {readingBooks.length === 0 &&
              toReadBooks.length === 0 &&
              completedBooks.length === 0 && (
                <div className="py-24 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                  <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-zinc-400 mb-2">
                    Sua biblioteca está vazia
                  </h3>
                  <p className="text-zinc-500 mb-4">
                    Comece a construir sua biblioteca adicionando livros.
                  </p>
                  <Button
                    variant="primary"
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => setMainTab('explorar')}
                  >
                    Explorar Livros
                  </Button>
                </div>
              )}
          </>
        )}

        {/* Placeholder for other tabs */}
        {(mainTab === 'cursos' || mainTab === 'comunidade') && (
          <div className="py-24 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <GraduationCap className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 font-medium">
              {mainTab === 'cursos' && 'Cursos relacionados em breve.'}
              {mainTab === 'comunidade' && 'Comunidade em breve.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
