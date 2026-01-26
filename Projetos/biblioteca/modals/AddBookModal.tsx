import React, { useState } from 'react';
import { X, Save, Loader, Search as SearchIcon, BookOpen, Check } from 'lucide-react';
import { bookService } from '../services/bookService';
import { searchBooks, type BookSearchResult } from '../services/googleBooksService';

interface AddBookModalProps {
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [selectedBook, setSelectedBook] = useState<BookSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);

  // Manual form data
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    isbn: '',
    notes: '',
    cover_url: '',
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const results = await searchBooks(searchQuery, 5);
      setSearchResults(results);

      if (results.length === 0) {
        setError('Nenhum livro encontrado. Tente outro termo ou adicione manualmente.');
      }
    } catch (err) {
      console.error('Error searching books:', err);
      setError('Erro ao buscar livros. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBook = (book: BookSearchResult) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category || '',
      isbn: book.isbn || '',
      notes: book.description || '',
      cover_url: book.coverUrl || '',
    });
  };

  const handleSaveBook = async () => {
    setError('');

    if (!formData.title.trim() || !formData.author.trim()) {
      setError('Título e autor são obrigatórios');
      return;
    }

    try {
      setSaving(true);

      await bookService.createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category.trim() || null,
        isbn: formData.isbn.trim() || null,
        notes: formData.notes.trim() || null,
        cover_url: formData.cover_url.trim() || null,
        status: 'available',
        rating: null,
        added_date: new Date().toISOString(),
      });

      onClose();
      window.location.reload();
    } catch (err) {
      console.error('Error creating book:', err);
      setError('Erro ao adicionar livro. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border dark:border-slate-700 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b dark:border-slate-700/50">
          <div>
            <h3 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight">
              ADICIONAR NOVO LIVRO
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Busque por título, autor ou ISBN
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={saving}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!showManualForm && !selectedBook && (
            <>
              {/* Search Bar */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-slate-400" size={20} />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Digite o nome do livro ou ISBN..."
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#232f48] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={loading || !searchQuery.trim()}
                  className="px-6 py-3 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <SearchIcon size={20} />
                      Buscar
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Resultados da Busca ({searchResults.length})
                  </h4>
                  {searchResults.map((book, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary bg-white dark:bg-[#232f48] hover:bg-primary/5 dark:hover:bg-primary/10 transition-all cursor-pointer group"
                      onClick={() => handleSelectBook(book)}
                    >
                      {/* Cover */}
                      {book.coverUrl ? (
                        <div
                          className="w-20 h-28 rounded-lg bg-cover bg-center flex-shrink-0 shadow-md"
                          style={{ backgroundImage: `url("${book.coverUrl}")` }}
                        />
                      ) : (
                        <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center flex-shrink-0">
                          <BookOpen className="text-slate-400" size={32} />
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h5>
                        <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">{book.author}</p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                          {book.publisher && <span>📚 {book.publisher}</span>}
                          {book.publishedYear && <span>📅 {book.publishedYear}</span>}
                          {book.isbn && <span>🔢 {book.isbn}</span>}
                        </div>
                      </div>

                      {/* Select Button */}
                      <div className="flex items-center">
                        <button className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors flex items-center gap-2">
                          <Check size={16} />
                          Selecionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Manual Entry Link */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowManualForm(true)}
                  className="text-primary hover:text-primary-hover font-medium text-sm underline"
                >
                  Não encontrou? Adicionar manualmente
                </button>
              </div>
            </>
          )}

          {/* Manual Form or Edit Selected Book */}
          {(showManualForm || selectedBook) && (
            <div className="space-y-4">
              {selectedBook && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg text-sm mb-4 flex items-center gap-2">
                  <Check size={16} />
                  Livro selecionado! Revise os dados abaixo antes de salvar.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Hábitos Atômicos"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#232f48] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Autor *</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="Ex: James Clear"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#232f48] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Categoria</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Personal Development"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#232f48] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">ISBN</label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    placeholder="Ex: 978-8550807560"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#232f48] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">URL da Capa</label>
                  <input
                    type="url"
                    value={formData.cover_url}
                    onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#232f48] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Notas</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Adicione suas anotações..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#232f48] text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {(showManualForm || selectedBook) && (
          <div className="px-6 py-4 border-t dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowManualForm(false);
                setSelectedBook(null);
                setFormData({ title: '', author: '', category: '', isbn: '', notes: '', cover_url: '' });
              }}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors disabled:opacity-50"
            >
              Voltar
            </button>
            <button
              onClick={handleSaveBook}
              disabled={saving || !formData.title.trim() || !formData.author.trim()}
              className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Adicionar Livro
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBookModal;