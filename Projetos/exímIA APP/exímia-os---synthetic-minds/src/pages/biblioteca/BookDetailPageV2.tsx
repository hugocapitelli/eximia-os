// BookDetailPageV2 - Book detail with favorites, notes, and summaries
// EXIMIA-107, EXIMIA-108

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  BookOpen,
  Star,
  Calendar,
  Building2,
  FileText,
  Plus,
  Loader2,
  Trash2,
} from 'lucide-react';
import { NoteCard, NoteEditor } from '../../components/biblioteca';
import { useFavorite } from '../../hooks/biblioteca';
import {
  getCatalogBook,
  getBookSummaries,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../../services/biblioteca';
import type { BookCatalog, BookSummary, UserNote } from '../../types/biblioteca';
import toast from 'react-hot-toast';

export const BookDetailPageV2: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();

  const [book, setBook] = useState<BookCatalog | null>(null);
  const [summaries, setSummaries] = useState<BookSummary[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'summaries' | 'notes'>('about');
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);

  // Favorite hook
  const { isFavorite, isLoading: favoriteLoading, toggle: toggleFavorite } = useFavorite(bookId || '');

  // Load book data
  useEffect(() => {
    if (!bookId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [bookResult, summariesResult, notesResult] = await Promise.all([
          getCatalogBook(bookId),
          getBookSummaries(bookId),
          getNotes({ catalog_id: bookId }),
        ]);

        if (bookResult.success && bookResult.data) {
          setBook(bookResult.data);
        }

        if (summariesResult.success && summariesResult.data) {
          setSummaries(summariesResult.data);
        }

        if (notesResult.success && notesResult.data) {
          setNotes(notesResult.data);
        }
      } catch (error) {
        toast.error('Erro ao carregar livro');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookId]);

  // Handle note save
  const handleSaveNote = useCallback(async (content: string, noteId?: string) => {
    if (!bookId) return;

    if (noteId) {
      // Update existing note
      const result = await updateNote(noteId, { content });
      if (result.success && result.data) {
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? result.data! : n))
        );
        toast.success('Nota atualizada');
      } else {
        throw new Error(result.error);
      }
    } else {
      // Create new note
      const result = await createNote({
        catalog_id: bookId,
        content,
        type: 'note',
      });
      if (result.success && result.data) {
        setNotes((prev) => [result.data!, ...prev]);
        toast.success('Nota criada');
      } else {
        throw new Error(result.error);
      }
    }
  }, [bookId]);

  // Handle note delete
  const handleDeleteNote = useCallback(async (noteId: string) => {
    const result = await deleteNote(noteId);
    if (result.success) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      toast.success('Nota excluída');
    } else {
      toast.error(result.error || 'Erro ao excluir nota');
    }
  }, []);

  if (!bookId) {
    return <Navigate to="/biblioteca" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!book) {
    return <Navigate to="/biblioteca" replace />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
        </div>
      </header>

      {/* Book Hero */}
      <section className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 bg-zinc-800 rounded-lg overflow-hidden shadow-xl">
                {book.cover_url ? (
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    📚
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                  {book.authors && book.authors.length > 0 && (
                    <p className="text-lg text-zinc-400 mb-4">
                      por {book.authors.join(', ')}
                    </p>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`p-3 rounded-full transition-colors ${
                    isFavorite
                      ? 'bg-red-500/20 text-red-500'
                      : 'bg-zinc-800 text-zinc-400 hover:text-red-500'
                  }`}
                  aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-zinc-500 mb-6">
                {book.published_date && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {book.published_date}
                  </div>
                )}
                {book.publisher && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4" />
                    {book.publisher}
                  </div>
                )}
                {book.page_count && (
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    {book.page_count} páginas
                  </div>
                )}
                {book.average_rating && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    {book.average_rating.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Categories */}
              {book.categories && book.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-zinc-800 rounded-full text-sm text-zinc-300"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              {summaries.length > 0 && (
                <button
                  onClick={() => navigate(`/biblioteca/book/${bookId}/read`)}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors font-medium"
                >
                  <BookOpen className="w-5 h-5" />
                  Ler Resumo
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <nav className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {(['about', 'summaries', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-amber-500 text-white'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab === 'about' && 'Sobre'}
                {tab === 'summaries' && `Resumos (${summaries.length})`}
                {tab === 'notes' && `Notas (${notes.length})`}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <main className="container mx-auto px-4 py-8">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Descrição</h2>
            {book.description ? (
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {book.description}
              </p>
            ) : (
              <p className="text-zinc-500">Nenhuma descrição disponível.</p>
            )}
          </div>
        )}

        {/* Summaries Tab */}
        {activeTab === 'summaries' && (
          <div>
            {summaries.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-500">Nenhum resumo disponível para este livro</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {summaries.map((summary) => (
                  <div
                    key={summary.id}
                    className="bg-zinc-900 rounded-lg p-6 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer"
                    onClick={() => navigate(`/biblioteca/book/${bookId}/read?summary=${summary.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{summary.title}</h3>
                        <p className="text-zinc-500 text-sm mt-1">
                          {summary.chapter_count || 0} capítulos • Versão {summary.version}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        summary.status === 'published'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {summary.status === 'published' ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Minhas Notas</h2>
              <button
                onClick={() => {
                  setEditingNote(null);
                  setShowNoteEditor(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova Nota
              </button>
            </div>

            {notes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-500">Você ainda não tem notas para este livro</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={(n) => {
                      setEditingNote(n);
                      setShowNoteEditor(true);
                    }}
                    onDelete={handleDeleteNote}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Note Editor Modal */}
      <NoteEditor
        isOpen={showNoteEditor}
        note={editingNote}
        catalogId={bookId}
        onSave={handleSaveNote}
        onClose={() => {
          setShowNoteEditor(false);
          setEditingNote(null);
        }}
      />
    </div>
  );
};

export default BookDetailPageV2;
