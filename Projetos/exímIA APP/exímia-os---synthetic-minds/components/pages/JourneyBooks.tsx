
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  BookOpen,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  Star,
  Clock,
  CheckCircle2,
  Bookmark,
  LayoutGrid,
  List,
  Calendar,
  User,
  Tag,
  ChevronRight,
  Brain,
  Lightbulb,
  Quote
} from 'lucide-react';

type ReadingStatus = 'reading' | 'completed' | 'want_to_read' | 'abandoned';
type BookCategory = 'business' | 'self_help' | 'psychology' | 'technology' | 'philosophy' | 'biography';

interface Book {
  id: string;
  title: string;
  author: string;
  authorId?: string;
  coverUrl?: string;
  category: BookCategory;
  status: ReadingStatus;
  rating?: number;
  progress: number;
  totalPages: number;
  currentPage: number;
  startDate?: string;
  finishDate?: string;
  notes: number;
  highlights: number;
  linkedMindId?: string;
}

const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'The Boron Letters',
    author: 'Gary Halbert',
    authorId: 'gary-halbert',
    category: 'business',
    status: 'completed',
    rating: 5,
    progress: 100,
    totalPages: 120,
    currentPage: 120,
    startDate: '2025-12-01',
    finishDate: '2025-12-15',
    notes: 24,
    highlights: 45,
    linkedMindId: 'gary-halbert'
  },
  {
    id: 'b2',
    title: 'Ogilvy on Advertising',
    author: 'David Ogilvy',
    authorId: 'david-ogilvy',
    category: 'business',
    status: 'reading',
    progress: 65,
    totalPages: 224,
    currentPage: 145,
    startDate: '2026-01-10',
    notes: 12,
    highlights: 28,
    linkedMindId: 'david-ogilvy'
  },
  {
    id: 'b3',
    title: 'Cant Hurt Me',
    author: 'David Goggins',
    authorId: 'david-goggins',
    category: 'self_help',
    status: 'completed',
    rating: 5,
    progress: 100,
    totalPages: 364,
    currentPage: 364,
    startDate: '2025-11-01',
    finishDate: '2025-11-20',
    notes: 18,
    highlights: 52,
    linkedMindId: 'david-goggins'
  },
  {
    id: 'b4',
    title: 'Zero to One',
    author: 'Peter Thiel',
    category: 'business',
    status: 'reading',
    progress: 35,
    totalPages: 195,
    currentPage: 68,
    startDate: '2026-01-20',
    notes: 8,
    highlights: 15,
  },
  {
    id: 'b5',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'psychology',
    status: 'want_to_read',
    progress: 0,
    totalPages: 499,
    currentPage: 0,
    notes: 0,
    highlights: 0,
  },
  {
    id: 'b6',
    title: 'The Hard Thing About Hard Things',
    author: 'Ben Horowitz',
    category: 'business',
    status: 'want_to_read',
    progress: 0,
    totalPages: 304,
    currentPage: 0,
    notes: 0,
    highlights: 0,
  },
  {
    id: 'b7',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'philosophy',
    status: 'completed',
    rating: 4,
    progress: 100,
    totalPages: 443,
    currentPage: 443,
    startDate: '2025-09-01',
    finishDate: '2025-10-05',
    notes: 32,
    highlights: 67,
  },
  {
    id: 'b8',
    title: 'Elon Musk',
    author: 'Walter Isaacson',
    authorId: 'elon-musk',
    category: 'biography',
    status: 'reading',
    progress: 20,
    totalPages: 688,
    currentPage: 137,
    startDate: '2026-01-25',
    notes: 5,
    highlights: 12,
    linkedMindId: 'elon-musk'
  },
];

const getStatusColor = (status: ReadingStatus) => {
  switch (status) {
    case 'reading': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
    case 'completed': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
    case 'want_to_read': return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
    case 'abandoned': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  }
};

const getStatusLabel = (status: ReadingStatus) => {
  switch (status) {
    case 'reading': return 'Lendo';
    case 'completed': return 'Concluído';
    case 'want_to_read': return 'Quero Ler';
    case 'abandoned': return 'Abandonado';
  }
};

const getCategoryLabel = (category: BookCategory) => {
  switch (category) {
    case 'business': return 'Negócios';
    case 'self_help': return 'Desenvolvimento';
    case 'psychology': return 'Psicologia';
    case 'technology': return 'Tecnologia';
    case 'philosophy': return 'Filosofia';
    case 'biography': return 'Biografia';
  }
};

export const JourneyBooks: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = MOCK_BOOKS
    .filter(b => filterStatus === 'all' || b.status === filterStatus)
    .filter(b =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const currentlyReading = MOCK_BOOKS.filter(b => b.status === 'reading');
  const completedCount = MOCK_BOOKS.filter(b => b.status === 'completed').length;
  const totalPages = MOCK_BOOKS.filter(b => b.status === 'completed').reduce((acc, b) => acc + b.totalPages, 0);
  const totalHighlights = MOCK_BOOKS.reduce((acc, b) => acc + b.highlights, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Biblioteca</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Gerencie seus livros e anotações.
            </p>
          </div>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Adicionar Livro</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Lendo Agora</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{currentlyReading.length}</p>
          <p className="text-xs text-zinc-600 mt-1">livros em progresso</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Concluídos</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
          <p className="text-xs text-zinc-600 mt-1">livros finalizados</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Páginas</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{totalPages.toLocaleString()}</p>
          <p className="text-xs text-zinc-600 mt-1">páginas lidas</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Lightbulb className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Highlights</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{totalHighlights}</p>
          <p className="text-xs text-zinc-600 mt-1">trechos destacados</p>
        </div>
      </div>

      {/* Currently Reading */}
      {currentlyReading.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-zinc-200 mb-4">Lendo Agora</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentlyReading.map(book => (
              <div
                key={book.id}
                className="bg-gradient-to-br from-[#0A0A0A] to-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer"
                onClick={() => setSelectedBook(book)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-24 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-zinc-200 truncate">{book.title}</h3>
                    <p className="text-sm text-zinc-500">{book.author}</p>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                        <span>Página {book.currentPage} de {book.totalPages}</span>
                        <span>{book.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                    </div>
                    {book.linkedMindId && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-minds-400">
                        <Brain className="w-3 h-3" />
                        <span>Mind disponível</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar livros..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'reading', 'completed', 'want_to_read'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {status === 'all' ? 'Todos' : getStatusLabel(status as ReadingStatus)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'}`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Books Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredBooks.map(book => (
            <div
              key={book.id}
              className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all cursor-pointer group"
              onClick={() => setSelectedBook(book)}
            >
              <div className="aspect-[2/3] bg-zinc-800 rounded-lg mb-3 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                <BookOpen className="w-10 h-10 text-zinc-600" />
              </div>
              <h3 className="font-semibold text-zinc-200 text-sm truncate mb-1">{book.title}</h3>
              <p className="text-xs text-zinc-500 truncate mb-2">{book.author}</p>
              <Badge className={`${getStatusColor(book.status)} text-[10px]`}>
                {getStatusLabel(book.status)}
              </Badge>
              {book.rating && (
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={`w-3 h-3 ${star <= book.rating! ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 text-left">Livro</th>
                <th className="px-5 py-4 text-left">Categoria</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-center">Progresso</th>
                <th className="px-5 py-4 text-center">Rating</th>
                <th className="px-5 py-4 text-right">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredBooks.map(book => (
                <tr
                  key={book.id}
                  className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedBook(book)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-zinc-800 rounded flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-zinc-600" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200">{book.title}</p>
                        <p className="text-xs text-zinc-500">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-400">{getCategoryLabel(book.category)}</td>
                  <td className="px-5 py-4">
                    <Badge className={getStatusColor(book.status)}>
                      {getStatusLabel(book.status)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <div className="w-20 mx-auto">
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 text-center mt-1">{book.progress}%</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    {book.rating ? (
                      <div className="flex items-center justify-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${star <= book.rating! ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-zinc-400">{book.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedBook(null)}>
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex gap-4 mb-6">
              <div className="w-24 h-36 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-8 h-8 text-zinc-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100 mb-1">{selectedBook.title}</h2>
                <p className="text-zinc-400 mb-2">{selectedBook.author}</p>
                <Badge className={getStatusColor(selectedBook.status)}>
                  {getStatusLabel(selectedBook.status)}
                </Badge>
                {selectedBook.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= selectedBook.rating! ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-500 uppercase mb-1">Páginas</p>
                <p className="text-lg font-bold text-zinc-200">{selectedBook.currentPage}/{selectedBook.totalPages}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-500 uppercase mb-1">Notas</p>
                <p className="text-lg font-bold text-zinc-200">{selectedBook.notes}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-3 text-center">
                <p className="text-xs text-zinc-500 uppercase mb-1">Highlights</p>
                <p className="text-lg font-bold text-zinc-200">{selectedBook.highlights}</p>
              </div>
            </div>

            {selectedBook.linkedMindId && (
              <div className="bg-minds-900/20 border border-minds-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-minds-400" />
                  <span className="font-semibold text-minds-300">Mind Disponível</span>
                </div>
                <p className="text-sm text-minds-300/70">
                  Converse com a mente de {selectedBook.author} baseada nos conceitos deste livro.
                </p>
                <Button variant="secondary" size="sm" className="mt-3" icon={<ChevronRight className="w-4 h-4" />}>
                  Iniciar Conversa
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedBook(null)}>Fechar</Button>
              <Button className="flex-1" icon={<Quote className="w-4 h-4" />}>Ver Anotações</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
