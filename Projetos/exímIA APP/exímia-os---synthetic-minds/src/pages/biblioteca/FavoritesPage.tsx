// FavoritesPage - User's favorite books (styled like old "Meus Livros")
// EXIMIA-106

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  BookOpen,
  Clock,
  CheckCircle2,
  Plus,
  Loader2,
} from 'lucide-react';
import { LibraryHero } from '../../../components/library';
import { BookCardVisual } from '../../../components/journey/BookCardVisual';
import { Button } from '../../../components/atoms/Button';
import { getUserFavorites, getUserStats } from '../../services/biblioteca';
import type { UserFavorite } from '../../types/biblioteca';
import toast from 'react-hot-toast';

// Extended favorite with book data
interface FavoriteWithBook extends UserFavorite {
  title: string;
  author: string;
  author_name?: string;
  cover_url?: string;
  thumbnail_url?: string;
  status?: 'reading' | 'to_read' | 'completed';
  progress?: number;
  current_chapter?: number;
  chapter_count?: number;
  has_published_summary?: boolean;
  summary_completed?: boolean;
}

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteWithBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [localFavorites, setLocalFavorites] = useState<string[]>([]);

  // Stats
  const [stats, setStats] = useState({
    reading: 0,
    completed: 0,
    toRead: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [favResult, statsResult] = await Promise.all([
          getUserFavorites(),
          getUserStats(),
        ]);

        if (favResult.success && favResult.data) {
          // Map favorites to include status based on progress
          const mappedFavorites = favResult.data.map((fav: any) => {
            let status: 'reading' | 'to_read' | 'completed' = 'to_read';
            if (fav.summary_completed) {
              status = 'completed';
            } else if (fav.current_chapter && fav.current_chapter > 1) {
              status = 'reading';
            }

            return {
              ...fav,
              author: fav.author_name || 'Autor desconhecido',
              status,
            };
          });

          setFavorites(mappedFavorites);
          setLocalFavorites(mappedFavorites.map((f: any) => f.catalog_id));
        }

        if (statsResult.success && statsResult.data) {
          setStats({
            reading: statsResult.data.inProgress || 0,
            completed: statsResult.data.completed || 0,
            toRead: statsResult.data.notStarted || 0,
          });
        }
      } catch (error) {
        toast.error('Erro ao carregar favoritos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleToggleFavorite = (bookId: string) => {
    setLocalFavorites((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  // Filter books by status
  const readingBooks = favorites.filter((b) => b.status === 'reading');
  const toReadBooks = favorites.filter((b) => b.status === 'to_read');
  const completedBooks = favorites.filter((b) => b.status === 'completed');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#050505]/80 border-b border-[#1F1F22]">
        <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => navigate('/biblioteca')}
            className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← VOLTAR À BIBLIOTECA
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
        {/* Hero Section */}
        <LibraryHero
          variant="favorites"
          bookCount={favorites.length}
          onCTA={() => navigate('/biblioteca')}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F22] flex items-center gap-4">
            <div className="p-3 bg-violet-900/20 rounded-lg text-violet-400">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{stats.reading}</p>
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
              <p className="text-2xl font-bold text-zinc-100">{stats.completed}</p>
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
              <p className="text-2xl font-bold text-zinc-100">{stats.toRead}</p>
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
                  book={{
                    id: book.catalog_id,
                    title: book.title,
                    author: book.author,
                    cover: book.cover_url || book.thumbnail_url,
                    status: book.status,
                    progress: book.current_chapter && book.chapter_count
                      ? Math.round((book.current_chapter / book.chapter_count) * 100)
                      : 0,
                    isFavorite: localFavorites.includes(book.catalog_id),
                  }}
                  onClick={() => navigate(`/biblioteca/book/${book.catalog_id}`)}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigateToAuthor={(author) => navigate(`/biblioteca/author/${encodeURIComponent(author)}`)}
                  showAuthorButton={true}
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
                  book={{
                    id: book.catalog_id,
                    title: book.title,
                    author: book.author,
                    cover: book.cover_url || book.thumbnail_url,
                    status: book.status,
                    isFavorite: localFavorites.includes(book.catalog_id),
                  }}
                  onClick={() => navigate(`/biblioteca/book/${book.catalog_id}`)}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigateToAuthor={(author) => navigate(`/biblioteca/author/${encodeURIComponent(author)}`)}
                  showAuthorButton={true}
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
                  book={{
                    id: book.catalog_id,
                    title: book.title,
                    author: book.author,
                    cover: book.cover_url || book.thumbnail_url,
                    status: book.status,
                    isFavorite: localFavorites.includes(book.catalog_id),
                  }}
                  onClick={() => navigate(`/biblioteca/book/${book.catalog_id}`)}
                  onToggleFavorite={handleToggleFavorite}
                  onNavigateToAuthor={(author) => navigate(`/biblioteca/author/${encodeURIComponent(author)}`)}
                  showAuthorButton={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {favorites.length === 0 && (
          <div className="py-24 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
            <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-400 mb-2">
              Sua biblioteca está vazia
            </h3>
            <p className="text-zinc-500 mb-4">
              Comece a construir sua biblioteca adicionando livros aos favoritos.
            </p>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/biblioteca')}
            >
              Explorar Livros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
