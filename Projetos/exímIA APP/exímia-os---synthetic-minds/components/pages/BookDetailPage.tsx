
import React, { useState, useEffect } from 'react';
import { Book } from '../../types';
import { JOURNEY_BOOKS, ACADEMY_COURSES, CLONES } from '../../constants';
import { getCatalogBooks } from '@/services/biblioteca/catalog';
import type { BookCatalogView } from '@/types/biblioteca';
import { Button } from '../atoms/Button';
import {
  ArrowLeft,
  BookOpen,
  User,
  Plus,
  Trash2,
  PenTool,
  ChevronRight,
  Star,
  Clock,
  FileText,
  GraduationCap,
  List,
  MessageSquare,
  ExternalLink,
  Brain
} from 'lucide-react';

interface BookDetailPageProps {
  bookId: string;
  onBack: () => void;
  onNavigateToAuthor?: (authorName: string) => void;
  onNavigateToCourse?: (courseId: string) => void;
  onStartReading?: () => void;
}

export const BookDetailPage: React.FC<BookDetailPageProps> = ({
  bookId,
  onBack,
  onNavigateToAuthor,
  onNavigateToCourse,
  onStartReading
}) => {
  const [activeTab, setActiveTab] = useState<'sinopse' | 'anotacoes' | 'resumos'>('sinopse');
  const [notes, setNotes] = useState<Array<{ id: string; content: string; page?: number; createdAt: string }>>([
    { id: '1', content: 'Conceito interessante sobre foco profundo e distração.', page: 45, createdAt: 'Há 2 dias' },
    { id: '2', content: 'Aplicar técnica de time-blocking no meu dia a dia.', page: 120, createdAt: 'Há 1 semana' },
  ]);
  const [newNote, setNewNote] = useState('');
  const [book, setBook] = useState<BookCatalogView | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch book from database
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const result = await getCatalogBooks({ limit: 100 });
        if (result.success && result.data) {
          const foundBook = result.data.data.find(b => b.id === bookId);
          setBook(foundBook || null);
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-200 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-200 flex items-center justify-center">
        <p>Livro não encontrado</p>
      </div>
    );
  }

  // Find related courses by category
  const bookCategory = book.categories?.[0] || 'geral';
  const relatedCourses = ACADEMY_COURSES.filter(course =>
    course.category.toLowerCase() === bookCategory?.toLowerCase() ||
    course.tags?.some(tag => tag.toLowerCase() === bookCategory?.toLowerCase())
  ).slice(0, 3);

  // Check if author has a Mind clone
  const authorName = book.author_name || 'Desconhecido';
  const authorMind = CLONES.find(clone =>
    clone.name.toLowerCase().includes(authorName.split(' ')[0].toLowerCase())
  );

  // Mock TOC for resumos
  const tocItems = [
    { id: '1', title: 'Parte 1: A Hipótese do Foco Profundo', page: 1 },
    { id: '2', title: 'Regra 1: Trabalhe com Profundidade', page: 35 },
    { id: '3', title: 'Regra 2: Abrace o Tédio', page: 95 },
    { id: '4', title: 'Regra 3: Abandone as Redes Sociais', page: 155 },
    { id: '5', title: 'Regra 4: Drene o Superficial', page: 215 },
  ];

  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([
        { id: Date.now().toString(), content: newNote, createdAt: 'Agora' },
        ...notes
      ]);
      setNewNote('');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
      {/* Top Navigation */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-[#050505]/80 border-b border-[#1F1F22]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest">VOLTAR</span>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => setActiveTab('sinopse')}
              className={`text-xs font-bold tracking-widest transition-colors ${
                activeTab === 'sinopse' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              SINOPSE
            </button>
            <button
              onClick={() => setActiveTab('anotacoes')}
              className={`text-xs font-bold tracking-widest transition-colors ${
                activeTab === 'anotacoes' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ANOTACOES
            </button>
            <button
              onClick={() => setActiveTab('resumos')}
              className={`text-xs font-bold tracking-widest transition-colors ${
                activeTab === 'resumos' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              RESUMOS
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
              book.status === 'reading' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
              book.status === 'completed' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
              'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}>
              {book.status === 'reading' ? 'Lendo' : book.status === 'completed' ? 'Concluído' : 'Na Fila'}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Book Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Book Cover */}
          <div className="w-48 h-72 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center shrink-0 border border-zinc-700 shadow-2xl">
            <BookOpen className="w-16 h-16 text-zinc-600" />
          </div>

          {/* Book Info */}
          <div className="flex-1">
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">{bookCategory}</p>
            <h1 className="text-4xl font-bold text-white mb-4">{book.title}</h1>

            {/* Author Card */}
            <div
              className="inline-flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl mb-6 cursor-pointer hover:border-zinc-700 transition-colors group"
              onClick={() => onNavigateToAuthor && onNavigateToAuthor(authorName)}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-900/30 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
                {authorName.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-bold group-hover:text-amber-400 transition-colors">{authorName}</p>
                <p className="text-xs text-zinc-500">Ver perfil do autor</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            </div>

            {/* Progress & Reading Button (PM1-005) */}
            <div className="mb-6">
              {book.status === 'reading' && (
                <>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-400">Progresso</span>
                    <span className="text-white font-bold">{book.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{ width: `${book.progress}%` }} />
                  </div>
                  {book.currentPage && book.totalPage && (
                    <p className="text-xs text-zinc-500 mb-4">Página {book.currentPage} de {book.totalPage}</p>
                  )}
                </>
              )}
              <Button
                variant="primary"
                onClick={onStartReading}
                icon={<BookOpen className="w-4 h-4" />}
                className="w-full md:w-auto"
              >
                {book.status === 'reading' ? 'Continuar Leitura' : 'Começar Leitura'}
              </Button>
            </div>

            {/* Mind Link */}
            {authorMind && (
              <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Mind disponível</p>
                    <p className="text-xs text-zinc-500">Converse com o clone de {authorMind.name}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" icon={<ExternalLink className="w-3 h-3" />}>
                  Abrir Mind
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'sinopse' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-zinc-500" />
                Sinopse
              </h2>
              <p className="text-zinc-300 leading-relaxed font-serif text-lg">
                {book.description || `"${book.title}" é uma obra essencial de ${authorName} que explora conceitos fundamentais em ${bookCategory}. Este livro oferece insights profundos e práticos que podem transformar sua perspectiva e abordagem sobre o tema.`}
              </p>
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-zinc-500" />
                  Cursos Relacionados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {relatedCourses.map(course => (
                    <div
                      key={course.id}
                      className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 hover:border-zinc-700 transition-colors cursor-pointer group"
                      onClick={() => onNavigateToCourse && onNavigateToCourse(course.id)}
                    >
                      <h3 className="text-white font-bold mb-2 group-hover:text-amber-400 transition-colors">{course.title}</h3>
                      <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'anotacoes' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Add Note */}
            <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-zinc-500" />
                Nova Anotacao
              </h2>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Escreva sua anotacao sobre o livro..."
                className="w-full h-24 bg-[#121214] border border-zinc-800 rounded-xl p-4 text-zinc-200 placeholder-zinc-600 focus:border-zinc-600 focus:outline-none resize-none"
              />
              <div className="flex justify-end mt-4">
                <Button variant="primary" onClick={handleAddNote} icon={<Plus className="w-4 h-4" />}>
                  Adicionar
                </Button>
              </div>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {notes.map(note => (
                <div key={note.id} className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 group hover:border-zinc-700 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <MessageSquare className="w-3 h-3" />
                      <span>{note.createdAt}</span>
                      {note.page && <span>• Página {note.page}</span>}
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-rose-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-zinc-300">{note.content}</p>
                </div>
              ))}

              {notes.length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma anotacao ainda. Comece a registrar seus insights!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'resumos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* TOC Sidebar */}
              <div className="md:col-span-1">
                <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <List className="w-5 h-5 text-zinc-500" />
                    Indice
                  </h2>
                  <div className="space-y-2">
                    {tocItems.map((item, idx) => (
                      <button
                        key={item.id}
                        className="w-full text-left p-3 rounded-lg hover:bg-zinc-800/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-zinc-600 w-6">{idx + 1}.</span>
                          <span className="text-sm text-zinc-400 group-hover:text-white transition-colors">{item.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumo Content */}
              <div className="md:col-span-2">
                <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Resumo Executivo</h2>

                  <div className="prose prose-invert prose-zinc max-w-none">
                    <p className="text-zinc-300 leading-relaxed font-serif text-lg mb-6">
                      "{book.title}" apresenta uma tese central sobre a importância do foco profundo no mundo moderno. O autor argumenta que a capacidade de concentracao intensa esta se tornando cada vez mais rara e, portanto, mais valiosa.
                    </p>

                    <h3 className="text-lg font-bold text-white mt-8 mb-4">Principais Conceitos</h3>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                        <span className="text-zinc-400">Trabalho profundo vs. trabalho superficial: distincao fundamental para produtividade</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                        <span className="text-zinc-400">O papel da tecnologia na fragmentacao da atencao</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Star className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                        <span className="text-zinc-400">Estrategias praticas para cultivar sessoes de foco intenso</span>
                      </li>
                    </ul>

                    <div className="mt-8 p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl">
                      <p className="text-amber-400 font-bold text-sm mb-2">Insight Principal</p>
                      <p className="text-zinc-300 italic font-serif">
                        "A capacidade de realizar trabalho profundo esta se tornando cada vez mais rara exatamente no momento em que esta se tornando cada vez mais valiosa em nossa economia."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
