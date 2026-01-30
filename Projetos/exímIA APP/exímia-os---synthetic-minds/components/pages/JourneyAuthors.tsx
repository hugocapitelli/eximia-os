
import React, { useState } from 'react';
import { JOURNEY_BOOKS, CLONES } from '../../constants';
import { SearchBar } from '../molecules/SearchBar';
import { Button } from '../atoms/Button';
import {
  BookOpen,
  Brain,
  Users,
  ChevronRight,
  ExternalLink,
  Sparkles,
  BookMarked
} from 'lucide-react';

interface Author {
  name: string;
  booksCount: number;
  books: typeof JOURNEY_BOOKS;
  hasMind: boolean;
  mindId?: string;
}

export const JourneyAuthors: React.FC<{ onNavigateToMind?: (mindId: string) => void }> = ({ onNavigateToMind }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  // Extract unique authors from books
  const authorsMap = new Map<string, Author>();
  JOURNEY_BOOKS.forEach(book => {
    if (!authorsMap.has(book.author)) {
      // Check if author has a Mind clone
      const mindClone = CLONES.find(c =>
        c.name.toLowerCase().includes(book.author.toLowerCase()) ||
        book.author.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())
      );

      authorsMap.set(book.author, {
        name: book.author,
        booksCount: 1,
        books: [book],
        hasMind: !!mindClone,
        mindId: mindClone?.id
      });
    } else {
      const author = authorsMap.get(book.author)!;
      author.booksCount++;
      author.books.push(book);
    }
  });

  const authors = Array.from(authorsMap.values())
    .filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.booksCount - a.booksCount);

  const totalBooks = JOURNEY_BOOKS.length;
  const authorsWithMinds = authors.filter(a => a.hasMind).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Autores</h1>
          <p className="text-zinc-400 mt-1 font-serif text-lg">
            Explore os autores da sua biblioteca.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-amber-900/20 rounded-lg text-amber-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">{authors.length}</p>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Autores</p>
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">{totalBooks}</p>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Livros</p>
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">{authorsWithMinds}</p>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Com AI Mind</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 max-w-md">
        <SearchBar placeholder="Buscar autor..." onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {/* Authors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map(author => (
          <div
            key={author.name}
            className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer group"
            onClick={() => setSelectedAuthor(author)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-lg font-bold text-zinc-300">
                  {author.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                    {author.name}
                  </h3>
                  <p className="text-sm text-zinc-500">{author.booksCount} {author.booksCount === 1 ? 'livro' : 'livros'}</p>
                </div>
              </div>
              {author.hasMind && (
                <div className="px-2 py-1 bg-purple-900/30 border border-purple-500/30 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">AI Mind</span>
                </div>
              )}
            </div>

            {/* Books preview */}
            <div className="space-y-2">
              {author.books.slice(0, 2).map(book => (
                <div key={book.id} className="flex items-center gap-2 text-sm text-zinc-400">
                  <BookMarked className="w-4 h-4 text-zinc-600" />
                  <span className="truncate">{book.title}</span>
                </div>
              ))}
              {author.books.length > 2 && (
                <p className="text-xs text-zinc-600">+{author.books.length - 2} mais</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button className="text-sm text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors">
                Ver livros <ChevronRight className="w-4 h-4" />
              </button>
              {author.hasMind && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onNavigateToMind && author.mindId) {
                      onNavigateToMind(author.mindId);
                    }
                  }}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors"
                >
                  Conversar <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {authors.length === 0 && (
        <div className="py-16 text-center border-2 border-dashed border-zinc-800 rounded-xl">
          <Users className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
          <p className="text-zinc-400">Nenhum autor encontrado.</p>
        </div>
      )}

      {/* Author Detail Modal */}
      {selectedAuthor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedAuthor(null)}>
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-2xl font-bold text-zinc-300">
                {selectedAuthor.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100">{selectedAuthor.name}</h2>
                <p className="text-zinc-400">{selectedAuthor.booksCount} livros na sua biblioteca</p>
              </div>
            </div>

            {selectedAuthor.hasMind && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-purple-300">AI Mind Disponível</span>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  Este autor tem uma mente sintética disponível. Converse diretamente com uma IA treinada no estilo e conhecimento deste autor.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    if (onNavigateToMind && selectedAuthor.mindId) {
                      onNavigateToMind(selectedAuthor.mindId);
                    }
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Iniciar Conversa
                </Button>
              </div>
            )}

            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Livros</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedAuthor.books.map(book => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-14 rounded ${book.coverUrl || 'bg-gradient-to-br from-amber-700 to-amber-900'} flex items-center justify-center`}>
                      <BookOpen className="w-5 h-5 text-white/50" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{book.title}</p>
                      <p className="text-xs text-zinc-500">{book.category || 'Sem categoria'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    book.status === 'completed' ? 'bg-emerald-900/30 text-emerald-400' :
                    book.status === 'reading' ? 'bg-blue-900/30 text-blue-400' :
                    'bg-zinc-800 text-zinc-400'
                  }`}>
                    {book.status === 'completed' ? 'Concluído' : book.status === 'reading' ? 'Lendo' : 'Na fila'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="ghost" onClick={() => setSelectedAuthor(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
