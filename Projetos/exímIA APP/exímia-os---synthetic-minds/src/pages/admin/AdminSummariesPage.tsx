// AdminSummariesPage - Admin page to manage book summaries
// EXIMIA-207

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  BookOpen,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { getCatalogBooks, getBookSummaries, isAdmin, createSummary } from '../../services/biblioteca';
import type { BookCatalog, BookSummary } from '../../types/biblioteca';
import toast from 'react-hot-toast';

export const AdminSummariesPage: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookCatalog[]>([]);
  const [summaries, setSummaries] = useState<Record<string, BookSummary[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Check admin access
  useEffect(() => {
    const checkAccess = async () => {
      const admin = await isAdmin();
      if (!admin) {
        toast.error('Acesso não autorizado');
        navigate('/biblioteca');
      }
    };
    checkAccess();
  }, [navigate]);

  // Load books
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      try {
        const result = await getCatalogBooks({ limit: 100 });
        if (result.success && result.data) {
          setBooks(result.data);
        }
      } catch (error) {
        toast.error('Erro ao carregar livros');
      } finally {
        setLoading(false);
      }
    };
    loadBooks();
  }, []);

  // Load summaries for selected book
  useEffect(() => {
    if (!selectedBook) return;

    const loadSummaries = async () => {
      try {
        const result = await getBookSummaries(selectedBook);
        if (result.success && result.data) {
          setSummaries((prev) => ({
            ...prev,
            [selectedBook]: result.data!,
          }));
        }
      } catch (error) {
        console.error('Error loading summaries:', error);
      }
    };
    loadSummaries();
  }, [selectedBook]);

  // Filter books by search
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors?.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Create new summary
  const handleCreateSummary = useCallback(async () => {
    if (!selectedBook) {
      toast.error('Selecione um livro primeiro');
      return;
    }

    setCreating(true);
    try {
      const book = books.find((b) => b.id === selectedBook);
      const result = await createSummary(selectedBook, {
        title: book?.title || 'Novo Resumo',
        version: 1,
        status: 'draft',
      });

      if (result.success && result.data) {
        toast.success('Resumo criado! Redirecionando para o editor...');
        navigate(`/admin/summaries/${result.data.id}/edit`);
      } else {
        toast.error(result.error || 'Erro ao criar resumo');
      }
    } catch (error) {
      toast.error('Erro ao criar resumo');
    } finally {
      setCreating(false);
    }
  }, [selectedBook, books, navigate]);

  const selectedBookSummaries = selectedBook ? summaries[selectedBook] || [] : [];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Gerenciar Resumos</h1>
              <p className="text-zinc-500 mt-1">Crie e edite resumos de livros</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Book List */}
          <div>
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar livro..."
                  className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-amber-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {filteredBooks.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => setSelectedBook(book.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedBook === book.id
                        ? 'bg-amber-500/10 border-amber-500'
                        : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            📚
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{book.title}</p>
                        {book.authors && (
                          <p className="text-sm text-zinc-500 truncate">
                            {book.authors.join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summaries Panel */}
          <div>
            {selectedBook ? (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Resumos</h2>
                  <button
                    onClick={handleCreateSummary}
                    disabled={creating}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {creating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    Novo Resumo
                  </button>
                </div>

                {selectedBookSummaries.length === 0 ? (
                  <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                    <BookOpen className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                    <p className="text-zinc-500">Nenhum resumo para este livro</p>
                    <p className="text-zinc-600 text-sm mt-1">
                      Crie o primeiro resumo clicando no botão acima
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedBookSummaries.map((summary) => (
                      <div
                        key={summary.id}
                        className="p-4 bg-zinc-900 rounded-lg border border-zinc-800"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium">{summary.title}</h3>
                            <div className="flex items-center gap-3 mt-2 text-sm text-zinc-500">
                              <span className="flex items-center gap-1">
                                {summary.status === 'published' ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Publicado
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    Rascunho
                                  </>
                                )}
                              </span>
                              <span>Versão {summary.version}</span>
                              <span>{summary.chapter_count || 0} capítulos</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/biblioteca/book/${selectedBook}/read?summary=${summary.id}`)}
                              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                              title="Visualizar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/summaries/${summary.id}/edit`)}
                              className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-zinc-800 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
                <BookOpen className="w-12 h-12 mx-auto text-zinc-700 mb-4" />
                <p className="text-zinc-500">Selecione um livro para ver seus resumos</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSummariesPage;
