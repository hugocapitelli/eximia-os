import React, { useState } from 'react';
import { BookOpen, GripVertical, PenTool, Trash2, Eye, FileText, User } from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';
import { BOOKS_DATA } from '../../constants';
import { Book } from '../../types';

interface AdminLibraryBooksProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminLibraryBooks: React.FC<AdminLibraryBooksProps> = ({
  onBack,
  onNavigate,
}) => {
  const [books, setBooks] = useState<Book[]>(BOOKS_DATA);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingBook, setEditingBook] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  const filteredBooks = books.filter((book) => {
    if (filterStatus === 'all') return true;
    return book.status === filterStatus;
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleAddBook = () => {
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: 'Novo Livro',
      author: 'Autor',
      authorId: '',
      coverUrl: '',
      description: 'Descrição do livro',
      category: 'Produtividade',
      status: 'draft',
      progress: 0,
      chapters: [],
      readingTime: '0h',
      rating: 0,
      totalReaders: 0,
    };
    setBooks([newBook, ...books]);
    setHasUnsavedChanges(true);
    setEditingBook(newBook.id);
  };

  const handleDeleteBook = (bookId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      setBooks(books.filter((b) => b.id !== bookId));
      setHasUnsavedChanges(true);
    }
  };

  const handleToggleStatus = (bookId: string) => {
    setBooks(
      books.map((b) =>
        b.id === bookId
          ? { ...b, status: b.status === 'published' ? 'draft' : 'published' }
          : b
      )
    );
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Library Editor', onClick: onBack },
          { label: 'Gerenciar Livros' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={BookOpen}
          title="Gerenciar Livros"
          description="Adicione e edite livros da biblioteca. Organize conteúdo por categorias e autores."
          onAddNew={handleAddBook}
          onGenerateAI={() => console.log('Generate with AI')}
          addNewLabel="Novo Livro"
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === status
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                  : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {status === 'all' && 'Todos'}
              {status === 'published' && 'Publicados'}
              {status === 'draft' && 'Rascunhos'}
              <span className="ml-2 px-1.5 py-0.5 bg-zinc-800 rounded text-[10px]">
                {status === 'all'
                  ? books.length
                  : books.filter((b) => b.status === status).length}
              </span>
            </button>
          ))}
        </div>

        {/* Book List */}
        <div className="space-y-3">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">Nenhum livro encontrado</p>
              <p className="text-zinc-600 text-sm mt-1">
                {filterStatus !== 'all'
                  ? 'Tente outro filtro ou adicione um novo livro'
                  : 'Clique em "Novo Livro" para começar'}
              </p>
            </div>
          ) : (
            filteredBooks.map((book) => (
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
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
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
                      {book.status === 'draft' && (
                        <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded">
                          Rascunho
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded">
                        {book.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white truncate">{book.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                      <User className="w-3.5 h-3.5" />
                      <span>{book.author}</span>
                      <span className="text-zinc-700">•</span>
                      <span>{book.chapters?.length || 0} capítulos</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(book.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        book.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                      }`}
                    >
                      {book.status === 'published' ? 'Publicado' : 'Publicar'}
                    </button>
                    <button
                      onClick={() => console.log('Preview', book.id)}
                      className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      aria-label="Visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingBook(editingBook === book.id ? null : book.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        editingBook === book.id
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'text-zinc-500 hover:text-amber-500 hover:bg-white/5'
                      }`}
                      aria-label="Editar"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
                      className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                {editingBook === book.id && (
                  <div className="mt-4 pt-4 border-t border-[#1F1F22]">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Título
                        </label>
                        <input
                          type="text"
                          value={book.title}
                          onChange={(e) => {
                            setBooks(
                              books.map((b) =>
                                b.id === book.id ? { ...b, title: e.target.value } : b
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Autor
                        </label>
                        <input
                          type="text"
                          value={book.author}
                          onChange={(e) => {
                            setBooks(
                              books.map((b) =>
                                b.id === book.id ? { ...b, author: e.target.value } : b
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Descrição
                      </label>
                      <textarea
                        value={book.description}
                        onChange={(e) => {
                          setBooks(
                            books.map((b) =>
                              b.id === book.id ? { ...b, description: e.target.value } : b
                            )
                          );
                          setHasUnsavedChanges(true);
                        }}
                        rows={2}
                        className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLibraryBooks;
