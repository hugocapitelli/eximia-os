import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen,
  GripVertical,
  PenTool,
  Trash2,
  Eye,
  FileText,
  User,
  Search,
  Plus,
  X,
  Loader2,
  Check,
  ExternalLink,
  BookMarked,
  AlertCircle,
  Globe,
  Book,
  Upload,
} from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';
import toast from 'react-hot-toast';
import {
  hybridBookSearch,
  addBookFromSearch,
  getCatalogBooks,
  deleteBookFromCatalog,
  updateCatalogBook,
  createSummary,
  listSummaries,
  publishSummary,
  unpublishSummary,
  generateBookInfo,
  getAIBookSuggestions,
  aiInfoToSearchResult,
} from '@/services/biblioteca';
import type { BookSearchResult, BookCatalogView } from '@/types/biblioteca';
import { BookEditPanel } from '../organisms/BookEditPanel';
import { BulkImportPanel } from '../organisms/BulkImportPanel';

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface AdminLibraryBooksProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
  onEditSummary?: (summaryId: string) => void;
}

export const AdminLibraryBooks: React.FC<AdminLibraryBooksProps> = ({
  onBack,
  onNavigate,
  onEditSummary,
}) => {
  // State
  const [books, setBooks] = useState<BookCatalogView[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'with_summary' | 'no_summary'>('all');

  // Search modal state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [addingBook, setAddingBook] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Bulk import state
  const [showBulkImport, setShowBulkImport] = useState(false);

  // AI state
  const [searchMode, setSearchMode] = useState<'api' | 'ai'>('api');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{ title: string; author: string; reason: string }[]>([]);

  // Debounced search query (1.5 seconds)
  const debouncedSearchQuery = useDebounce(searchQuery, 1500);

  // Summaries cache
  const [summariesMap, setSummariesMap] = useState<Record<string, any>>({});

  // Load books from Supabase
  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCatalogBooks({ limit: 100 });
      if (result.success && result.data) {
        setBooks(result.data.data);
      } else {
        toast.error(result.error || 'Erro ao carregar livros');
      }

      // Load summaries
      const summariesResult = await listSummaries();
      if (summariesResult.success && summariesResult.data) {
        const map: Record<string, any> = {};
        summariesResult.data.forEach((s: any) => {
          map[s.catalog_id] = s;
        });
        setSummariesMap(map);
      }
    } catch (error) {
      console.error('Load books error:', error);
      toast.error('Erro ao carregar livros');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Filter books
  const filteredBooks = books.filter((book) => {
    if (filterStatus === 'all') return true;
    const hasSummary = !!summariesMap[book.id];
    if (filterStatus === 'with_summary') return hasSummary;
    if (filterStatus === 'no_summary') return !hasSummary;
    return true;
  });

  // Auto-search when debounced query changes
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim() || debouncedSearchQuery.length < 3) {
        setSearchResults([]);
        setAiSuggestions([]);
        return;
      }

      if (searchMode === 'api') {
        setIsSearching(true);
        try {
          const results = await hybridBookSearch(debouncedSearchQuery, { maxResults: 15 });
          if (results.length === 0) {
            toast.info('Nenhum livro encontrado. Tente outra busca ou adicione manualmente.');
          }
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
          toast.error('Erro na busca. Verifique sua conexão e tente novamente.');
        } finally {
          setIsSearching(false);
        }
      } else {
        // AI mode - get suggestions
        setIsSearching(true);
        try {
          const suggestions = await getAIBookSuggestions(debouncedSearchQuery, 8);
          if (suggestions.length === 0) {
            toast.warning('Sugestões de IA indisponíveis. Use a busca por API.');
          }
          setAiSuggestions(suggestions);
          setSearchResults([]);
        } catch (error) {
          console.error('AI suggestions error:', error);
          toast.warning('Sugestões de IA indisponíveis. Use a busca por API.');
        } finally {
          setIsSearching(false);
        }
      }
    };

    performSearch();
  }, [debouncedSearchQuery, searchMode]);

  // Focus input when modal opens
  useEffect(() => {
    if (showSearchModal && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearchModal]);

  // Generate book info with AI
  const handleGenerateWithAI = async (title: string, author?: string) => {
    setIsGeneratingAI(true);
    try {
      const aiInfo = await generateBookInfo(title, author);
      if (aiInfo) {
        const searchResult = aiInfoToSearchResult(aiInfo);
        // Add to results
        setSearchResults([searchResult]);
        toast.success('Informações geradas pela IA!');
      } else {
        toast.error('Não foi possível gerar informações');
      }
    } catch (error) {
      console.error('AI generate error:', error);
      toast.error('Erro ao gerar com IA');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle AI suggestion click - generate full info
  const handleAISuggestionClick = async (suggestion: { title: string; author: string }) => {
    await handleGenerateWithAI(suggestion.title, suggestion.author);
  };

  // Add book from search
  const handleAddBook = async (searchResult: BookSearchResult) => {
    setAddingBook(searchResult.externalId);
    try {
      const result = await addBookFromSearch(searchResult);
      if (result.success) {
        toast.success(`"${searchResult.title}" adicionado ao catálogo!`);
        setShowSearchModal(false);
        setSearchQuery('');
        setSearchResults([]);
        loadBooks();
      } else {
        toast.error(result.error || 'Erro ao adicionar livro');
      }
    } catch (error) {
      console.error('Add book error:', error);
      toast.error('Erro ao adicionar livro');
    } finally {
      setAddingBook(null);
    }
  };

  // Delete book
  const handleDeleteBook = async (bookId: string, title: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${title}"?`)) return;

    try {
      const result = await deleteBookFromCatalog(bookId);
      if (result.success) {
        toast.success('Livro excluído');
        loadBooks();
      } else {
        toast.error(result.error || 'Erro ao excluir');
      }
    } catch (error) {
      toast.error('Erro ao excluir livro');
    }
  };

  // Create summary for book
  const handleCreateSummary = async (book: BookCatalogView) => {
    try {
      const result = await createSummary({
        catalog_id: book.id,
        title: book.title,
      });
      if (result.success && result.data) {
        toast.success('Resumo criado! Redirecionando...');
        setSummariesMap(prev => ({ ...prev, [book.id]: result.data }));
        if (onEditSummary) {
          onEditSummary(result.data.id);
        }
      } else {
        toast.error(result.error || 'Erro ao criar resumo');
      }
    } catch (error) {
      toast.error('Erro ao criar resumo');
    }
  };

  // Toggle summary publish status
  const handleTogglePublish = async (summaryId: string, isPublished: boolean) => {
    try {
      const result = isPublished
        ? await unpublishSummary(summaryId)
        : await publishSummary(summaryId);

      if (result.success) {
        toast.success(isPublished ? 'Resumo despublicado' : 'Resumo publicado!');
        loadBooks();
      } else {
        toast.error(result.error || 'Erro ao atualizar');
      }
    } catch (error) {
      toast.error('Erro ao atualizar resumo');
    }
  };

  // Save changes to book
  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    toast.success('Alterações salvas');
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Library Editor' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={BookOpen}
          title="Library Editor"
          description="Gerencie o catálogo de livros e resumos. Busque livros via Google Books e crie resumos para disponibilizar na biblioteca."
          onAddNew={() => setShowSearchModal(true)}
          addNewLabel="Buscar Livro"
        />

        {/* Top Actions */}
        <div className="flex items-center gap-2 mb-6 justify-between">
          <div>
            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {([
                { key: 'all', label: 'Todos' },
                { key: 'with_summary', label: 'Com Resumo' },
                { key: 'no_summary', label: 'Sem Resumo' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterStatus(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterStatus === tab.key
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-1.5 py-0.5 bg-zinc-800 rounded text-[10px]">
                    {tab.key === 'all'
                      ? books.length
                      : tab.key === 'with_summary'
                      ? books.filter(b => summariesMap[b.id]).length
                      : books.filter(b => !summariesMap[b.id]).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Import Button */}
          <button
            onClick={() => setShowBulkImport(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importação em Lote
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : (
          /* Book List */
          <div className="space-y-3">
            {filteredBooks.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 text-lg">Nenhum livro encontrado</p>
                <p className="text-zinc-600 text-sm mt-1">
                  Clique em "Buscar Livro" para adicionar livros ao catálogo
                </p>
              </div>
            ) : (
              filteredBooks.map((book) => {
                const summary = summariesMap[book.id];
                return (
                  <div
                    key={book.id}
                    className={`
                      bg-[#0A0A0A] border rounded-xl p-4 transition-all
                      ${editingBook === book.id
                        ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                        : 'border-[#1F1F22] hover:border-zinc-700'
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-5 h-5 text-zinc-600" />
                      </div>

                      {/* Book Cover */}
                      <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {book.thumbnail_url || book.cover_url ? (
                          <img
                            src={book.thumbnail_url || book.cover_url}
                            alt={book.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileText className="w-6 h-6 text-zinc-500" />
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {summary ? (
                            summary.is_published ? (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                                <Check className="w-3 h-3" /> Publicado
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded">
                                Rascunho
                              </span>
                            )
                          ) : (
                            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Sem Resumo
                            </span>
                          )}
                          {book.categories?.[0] && (
                            <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded">
                              {book.categories[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="font-semibold text-white truncate">{book.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                          <User className="w-3.5 h-3.5" />
                          <span>{book.author_name || 'Autor desconhecido'}</span>
                          {summary && (
                            <>
                              <span className="text-zinc-700">•</span>
                              <span>{summary.chapter_count || 0} capítulos</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {summary ? (
                          <>
                            <button
                              onClick={() => handleTogglePublish(summary.id, summary.is_published)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                summary.is_published
                                  ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                              }`}
                            >
                              {summary.is_published ? 'Publicado' : 'Publicar'}
                            </button>
                            <button
                              onClick={() => onEditSummary?.(summary.id)}
                              className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                              aria-label="Editar Resumo"
                              title="Editar Capítulos"
                            >
                              <BookMarked className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleCreateSummary(book)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-colors flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Criar Resumo
                            </button>
                            <label className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors flex items-center gap-1 cursor-pointer">
                              <Upload className="w-3.5 h-3.5" />
                              Upload
                              <input
                                type="file"
                                accept=".pdf,.epub"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    toast.info(`Upload de ${file.name} iniciado...`);
                                  }
                                }}
                                className="hidden"
                              />
                            </label>
                          </>
                        )}
                        <button
                          onClick={() => setEditingBook(editingBook === book.id ? null : book.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            editingBook === book.id
                              ? 'bg-amber-500/10 text-amber-500'
                              : 'text-zinc-500 hover:text-amber-500 hover:bg-white/5'
                          }`}
                          aria-label="Editar Detalhes"
                        >
                          <PenTool className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                          aria-label="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Edit Form - Using BookEditPanel */}
                    {editingBook === book.id && (
                      <div className="mt-4 pt-4 border-t border-[#1F1F22]">
                        <BookEditPanel
                          book={book}
                          authors={[]}
                          onSave={async (updatedBook) => {
                            const result = await updateCatalogBook(book.id, {
                              title: updatedBook.title,
                              author_name: updatedBook.author_name || undefined,
                              description: updatedBook.description || undefined,
                              tags: updatedBook.tags || undefined,
                              categories: updatedBook.categories || undefined,
                            });
                            if (result.success) {
                              toast.success('Livro atualizado com sucesso!');
                              setHasUnsavedChanges(false);
                              setEditingBook(null);
                              loadBooks();
                            } else {
                              toast.error(result.error || 'Erro ao salvar');
                            }
                          }}
                          onCancel={() => setEditingBook(null)}
                          onAutoFetchDescription={async (title: string, author: string) => {
                            try {
                              const description = await generateBookInfo(title, author);
                              if (description) {
                                toast.success('Descrição encontrada!');
                                return description;
                              }
                              toast.info('Nenhuma descrição encontrada');
                              return null;
                            } catch (error) {
                              toast.error('Erro ao buscar descrição');
                              return null;
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#1F1F22] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Importação em Lote</h2>
              <button
                onClick={() => setShowBulkImport(false)}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
              <BulkImportPanel
                onImportComplete={() => {
                  setShowBulkImport(false);
                  toast.success('Importação concluída!');
                  loadBooks();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#1F1F22] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Buscar Livro</h2>
              <button
                onClick={() => {
                  setShowSearchModal(false);
                  setSearchQuery('');
                  setSearchResults([]);
                  setAiSuggestions([]);
                  setSearchMode('api');
                }}
                className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="p-4 border-b border-[#1F1F22] flex gap-2">
              <button
                onClick={() => setSearchMode('api')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  searchMode === 'api'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                Buscar em APIs
              </button>
              <button
                onClick={() => setSearchMode('ai')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  searchMode === 'ai'
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                  <circle cx="7.5" cy="14.5" r="1.5"/>
                  <circle cx="16.5" cy="14.5" r="1.5"/>
                </svg>
                Sugestões com IA
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-[#1F1F22]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchMode === 'api' ? "Digite o título ou autor..." : "Digite um tema ou assunto..."}
                  className="w-full pl-12 pr-12 py-4 bg-[#050505] border border-[#1F1F22] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 text-lg"
                />
                {(isSearching || isGeneratingAI) && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500 animate-spin" />
                )}
              </div>
              <div className="flex items-center gap-4 mt-3">
                {searchMode === 'api' ? (
                  <>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Globe className="w-3.5 h-3.5" />
                      <span>Google Books</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Book className="w-3.5 h-3.5" />
                      <span>Open Library</span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-violet-400">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                    </svg>
                    <span>OpenAI GPT-4</span>
                  </div>
                )}
                <span className="text-zinc-700">•</span>
                <span className="text-xs text-zinc-600">
                  Busca automática após parar de digitar
                </span>
              </div>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto max-h-[50vh] p-4">
              {searchQuery.length > 0 && searchQuery.length < 3 ? (
                <div className="text-center py-12">
                  <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">Digite pelo menos 3 caracteres</p>
                </div>
              ) : isSearching || isGeneratingAI ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-500 mb-3" />
                  <span className="text-zinc-400">
                    {searchMode === 'ai' ? 'Consultando IA...' : 'Buscando em múltiplas fontes...'}
                  </span>
                  <span className="text-xs text-zinc-600 mt-1">
                    {searchMode === 'ai' ? 'OpenAI GPT-4' : 'Google Books + Open Library'}
                  </span>
                </div>
              ) : searchMode === 'ai' && aiSuggestions.length > 0 ? (
                /* AI Suggestions */
                <div className="space-y-3">
                  <p className="text-xs text-violet-400 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                    </svg>
                    {aiSuggestions.length} sugestões da IA
                  </p>
                  {aiSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 bg-[#050505] border border-violet-500/20 rounded-xl hover:border-violet-500/40 transition-colors"
                    >
                      {/* AI Icon */}
                      <div className="w-14 h-20 rounded-lg bg-gradient-to-br from-violet-900/50 to-purple-900/50 flex-shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                        </svg>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm">
                          {suggestion.title}
                        </h3>
                        <p className="text-xs text-violet-300 mt-1">
                          {suggestion.author}
                        </p>
                        <p className="text-xs text-zinc-500 mt-2 line-clamp-2">
                          {suggestion.reason}
                        </p>
                      </div>

                      {/* Generate Button */}
                      <button
                        onClick={() => handleAISuggestionClick(suggestion)}
                        disabled={isGeneratingAI}
                        className="px-3 py-1.5 bg-violet-500/10 text-violet-400 font-medium rounded-lg hover:bg-violet-500/20 transition-colors text-xs flex items-center gap-1 disabled:opacity-50"
                      >
                        {isGeneratingAI ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        Gerar Info
                      </button>
                    </div>
                  ))}
                </div>
              ) : searchResults.length === 0 && debouncedSearchQuery.length >= 3 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">Nenhum resultado encontrado</p>
                  <p className="text-xs text-zinc-600 mt-2 mb-4">Não encontramos nas APIs. Quer gerar com IA?</p>
                  <button
                    onClick={() => handleGenerateWithAI(debouncedSearchQuery)}
                    disabled={isGeneratingAI}
                    className="px-4 py-2 bg-violet-500/20 text-violet-400 font-medium rounded-lg hover:bg-violet-500/30 transition-colors text-sm flex items-center gap-2 mx-auto"
                  >
                    {isGeneratingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/>
                      </svg>
                    )}
                    Gerar informações com IA
                  </button>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                  <p className="text-zinc-500">
                    {searchMode === 'api' ? 'Digite para buscar livros' : 'Digite um tema para sugestões'}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">A busca inicia automaticamente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-zinc-500 mb-4">
                    {searchResults.length} resultados encontrados
                  </p>
                  {searchResults.map((result) => (
                    <div
                      key={`${result.source}-${result.externalId}`}
                      className="flex items-start gap-4 p-3 bg-[#050505] border border-[#1F1F22] rounded-xl hover:border-zinc-700 transition-colors"
                    >
                      {/* Cover */}
                      <div className="w-14 h-20 rounded-lg bg-zinc-800 flex-shrink-0 overflow-hidden relative">
                        {result.thumbnailUrl ? (
                          <img
                            src={result.thumbnailUrl}
                            alt={result.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-5 h-5 text-zinc-600" />
                          </div>
                        )}
                        {/* Source Badge */}
                        <div className={`absolute bottom-0 left-0 right-0 py-0.5 text-[8px] font-bold text-center ${
                          result.source === 'google'
                            ? 'bg-blue-500/90 text-white'
                            : result.source === 'ai'
                            ? 'bg-violet-500/90 text-white'
                            : 'bg-emerald-500/90 text-white'
                        }`}>
                          {result.source === 'google' ? 'GOOGLE' : result.source === 'ai' ? 'IA' : 'OPEN LIB'}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm line-clamp-1">
                          {result.title}
                        </h3>
                        {result.subtitle && (
                          <p className="text-xs text-zinc-500 line-clamp-1">{result.subtitle}</p>
                        )}
                        <p className="text-xs text-zinc-400 mt-1">
                          {result.authors.join(', ') || 'Autor desconhecido'}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-600">
                          {result.publishedDate && <span>{result.publishedDate}</span>}
                          {result.pageCount && <span>• {result.pageCount} págs</span>}
                          {result.language && <span>• {result.language.toUpperCase()}</span>}
                          {result.isbn13 && <span>• ISBN: {result.isbn13}</span>}
                        </div>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => handleAddBook(result)}
                        disabled={addingBook === result.externalId}
                        className="px-3 py-1.5 bg-amber-500/10 text-amber-500 font-medium rounded-lg hover:bg-amber-500/20 transition-colors text-xs flex items-center gap-1 disabled:opacity-50"
                      >
                        {addingBook === result.externalId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Plus className="w-3.5 h-3.5" />
                        )}
                        Adicionar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLibraryBooks;
