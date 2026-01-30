
import React, { useState } from 'react';
import { JOURNEY_BOOKS, CLONES } from '../../constants';
import { Button } from '../atoms/Button';
import {
  ArrowLeft,
  BookOpen,
  User,
  Brain,
  ExternalLink,
  Globe,
  Twitter,
  Linkedin,
  Plus,
  Settings,
  PenTool,
  Zap
} from 'lucide-react';

interface AuthorDetailPageProps {
  authorName: string;
  onBack: () => void;
  onNavigateToBook?: (bookId: string) => void;
  onNavigateToMind?: (mindId: string) => void;
  isAdmin?: boolean;
}

// Mock author data (in production, this would come from an API)
const AUTHORS_DATA: Record<string, {
  name: string;
  specialty: string;
  bio: string;
  birthYear?: number;
  nationality?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  notableWorks: string[];
  awards?: string[];
}> = {
  'Cal Newport': {
    name: 'Cal Newport',
    specialty: 'Produtividade & Foco',
    bio: 'Cal Newport e um professor associado de Ciencia da Computacao na Universidade de Georgetown. Ele e autor de sete livros, incluindo os bestsellers "Deep Work" e "Digital Minimalism". Sua pesquisa academica foca em teoria da computacao distribuida, enquanto seus livros e blog exploram a intersecao de cultura digital e sucesso profissional.',
    birthYear: 1982,
    nationality: 'Americano',
    website: 'calnewport.com',
    twitter: '@caboron',
    notableWorks: ['Deep Work', 'Digital Minimalism', 'So Good They Can\'t Ignore You', 'A World Without Email'],
    awards: ['New York Times Bestseller', 'Wall Street Journal Bestseller']
  },
  'James Clear': {
    name: 'James Clear',
    specialty: 'Habitos & Comportamento',
    bio: 'James Clear e um autor e palestrante focado em habitos, tomada de decisao e melhoria continua. Seu trabalho apareceu no New York Times, Time e Entrepreneur. Seu livro "Atomic Habits" vendeu mais de 10 milhoes de copias mundialmente e foi traduzido para mais de 50 idiomas.',
    nationality: 'Americano',
    website: 'jamesclear.com',
    twitter: '@JamesClear',
    notableWorks: ['Atomic Habits'],
    awards: ['#1 New York Times Bestseller']
  },
  'Nassim Taleb': {
    name: 'Nassim Nicholas Taleb',
    specialty: 'Filosofia & Risco',
    bio: 'Nassim Nicholas Taleb e um ensaista, estudioso, estatistico e ex-trader de opcoes e gestor de risco. Ele e autor da serie "Incerto", que examina sorte, incerteza, probabilidade e conhecimento. Seus livros foram traduzidos para mais de 40 idiomas.',
    birthYear: 1960,
    nationality: 'Libanes-Americano',
    twitter: '@nntaleb',
    notableWorks: ['The Black Swan', 'Antifragile', 'Fooled by Randomness', 'Skin in the Game'],
    awards: ['Foreign Policy Top Global Thinker']
  },
  'Marty Cagan': {
    name: 'Marty Cagan',
    specialty: 'Produto & Tecnologia',
    bio: 'Marty Cagan e o fundador do Silicon Valley Product Group. Antes disso, ele serviu como executivo responsavel por definir e construir produtos para algumas das empresas de tecnologia mais bem-sucedidas do mundo, incluindo Hewlett-Packard, Netscape e eBay.',
    nationality: 'Americano',
    website: 'svpg.com',
    twitter: '@caboron',
    linkedin: 'martycagan',
    notableWorks: ['Inspired', 'Empowered'],
  },
  'Steven Pinker': {
    name: 'Steven Pinker',
    specialty: 'Psicologia & Linguistica',
    bio: 'Steven Pinker e um psicologo cognitivo canadense-americano, linguista e autor de ciencia popular. Ele e professor no Departamento de Psicologia da Universidade de Harvard e e conhecido por sua defesa da psicologia evolucionaria e da teoria computacional da mente.',
    birthYear: 1954,
    nationality: 'Canadense-Americano',
    website: 'stevenpinker.com',
    twitter: '@sapinker',
    notableWorks: ['The Better Angels of Our Nature', 'Enlightenment Now', 'The Language Instinct', 'How the Mind Works'],
    awards: ['Humanist of the Year', 'Time 100 Most Influential People']
  },
  'Aldous Huxley': {
    name: 'Aldous Huxley',
    specialty: 'Ficcao & Filosofia',
    bio: 'Aldous Leonard Huxley foi um escritor e filosofo ingles. Ele escreveu quase 50 livros, tanto romances quanto obras de nao-ficcao, bem como ensaios, narrativas e poemas. Nascido em uma familia proeminente de intelectuais, ele e mais conhecido por seu romance distopico "Admiravel Mundo Novo".',
    birthYear: 1894,
    nationality: 'Britanico',
    notableWorks: ['Brave New World', 'The Doors of Perception', 'Island', 'Point Counter Point'],
  }
};

export const AuthorDetailPage: React.FC<AuthorDetailPageProps> = ({
  authorName,
  onBack,
  onNavigateToBook,
  onNavigateToMind,
  isAdmin = false
}) => {
  const [isAdminMode, setIsAdminMode] = useState(isAdmin);

  // Find author data
  const authorKey = Object.keys(AUTHORS_DATA).find(key =>
    key.toLowerCase() === authorName.toLowerCase() ||
    authorName.toLowerCase().includes(key.split(' ')[0].toLowerCase())
  );
  const author = authorKey ? AUTHORS_DATA[authorKey] : null;

  // Find author's books in library
  const authorBooks = JOURNEY_BOOKS.filter(book =>
    book.author.toLowerCase().includes(authorName.split(' ')[0].toLowerCase())
  );

  // Check if author has a Mind clone
  const authorMind = CLONES.find(clone =>
    clone.name.toLowerCase().includes(authorName.split(' ')[0].toLowerCase())
  );

  if (!author) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
        <div className="sticky top-0 z-40 backdrop-blur-md bg-[#050505]/80 border-b border-[#1F1F22]">
          <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center">
            <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest">VOLTAR</span>
            </button>
          </div>
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-12 text-center">
          <User className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Autor nao encontrado</h1>
          <p className="text-zinc-500">Nao temos informacoes sobre "{authorName}" ainda.</p>
          {isAdminMode && (
            <Button variant="primary" className="mt-6" icon={<Plus className="w-4 h-4" />}>
              Adicionar Autor
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
      {/* Top Navigation */}
      <div className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${isAdminMode ? 'bg-[#1a1500]/80 border-amber-500/20' : 'bg-[#050505]/80 border-[#1F1F22]'}`}>
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold tracking-widest">VOLTAR</span>
          </button>

          {/* Admin Mode Toggle */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300
              ${isAdminMode
                ? 'bg-amber-500 text-zinc-900 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}
            `}
          >
            {isAdminMode ? <Settings className="w-3 h-3 animate-spin-slow" /> : <PenTool className="w-3 h-3" />}
            <span className="text-[10px] font-bold uppercase tracking-wider">{isAdminMode ? 'Editor Ativo' : 'Editar'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-12">
        {/* Admin Panel */}
        {isAdminMode && (
          <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20"><User className="w-6 h-6" /></div>
              <div>
                <h2 className="text-lg font-bold text-white">Editor de Autor</h2>
                <p className="text-sm text-zinc-400">Edite informacoes ou crie um Mind para este autor.</p>
              </div>
            </div>
            <div className="flex gap-3">
              {!authorMind && (
                <Button variant="secondary" icon={<Brain className="w-4 h-4" />}>Criar Mind</Button>
              )}
              <Button variant="primary" icon={<PenTool className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900">Editar Perfil</Button>
            </div>
          </div>
        )}

        {/* Author Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">
          {/* Author Avatar */}
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-amber-900/30 to-amber-600/10 border-2 border-amber-500/30 flex items-center justify-center shrink-0 shadow-2xl">
            <span className="text-6xl font-bold text-amber-400">
              {author.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <p className="text-xs text-amber-500 uppercase tracking-widest mb-2">{author.specialty}</p>
            <h1 className="text-4xl font-bold text-white mb-4">{author.name}</h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-zinc-500">
              {author.nationality && (
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {author.nationality}
                </span>
              )}
              {author.birthYear && (
                <span>Nascido em {author.birthYear}</span>
              )}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mb-6">
              {author.website && (
                <a href={`https://${author.website}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <Globe className="w-4 h-4 text-zinc-400" />
                </a>
              )}
              {author.twitter && (
                <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <Twitter className="w-4 h-4 text-zinc-400" />
                </a>
              )}
              {author.linkedin && (
                <a href={`https://linkedin.com/in/${author.linkedin}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                  <Linkedin className="w-4 h-4 text-zinc-400" />
                </a>
              )}
            </div>

            {/* Mind Link */}
            {authorMind && (
              <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-bold text-white">Mind Disponivel</p>
                    <p className="text-xs text-zinc-500">Converse com o clone de {authorMind.name}</p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<ExternalLink className="w-3 h-3" />}
                  onClick={() => onNavigateToMind && onNavigateToMind(authorMind.id)}
                >
                  Abrir Mind
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Biography */}
        <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Biografia</h2>
          <p className="text-zinc-300 leading-relaxed font-serif text-lg">
            {author.bio}
          </p>
        </div>

        {/* Awards */}
        {author.awards && author.awards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Premios & Reconhecimentos</h2>
            <div className="flex flex-wrap gap-2">
              {author.awards.map((award, idx) => (
                <span key={idx} className="px-4 py-2 bg-amber-900/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-bold">
                  {award}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Books in Library */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Livros na Sua Biblioteca</h2>
          {authorBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {authorBooks.map(book => (
                <div
                  key={book.id}
                  className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 hover:border-zinc-700 transition-colors cursor-pointer group"
                  onClick={() => onNavigateToBook && onNavigateToBook(book.id)}
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-24 bg-zinc-800 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6 text-zinc-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold group-hover:text-amber-400 transition-colors">{book.title}</h3>
                      <p className="text-xs text-zinc-500 mb-2">{book.category}</p>
                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        book.status === 'reading' ? 'bg-blue-900/30 text-blue-400' :
                        book.status === 'completed' ? 'bg-emerald-900/30 text-emerald-400' :
                        'bg-zinc-800 text-zinc-500'
                      }`}>
                        {book.status === 'reading' ? 'Lendo' : book.status === 'completed' ? 'Concluido' : 'Na Fila'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl">
              <BookOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 mb-4">Voce ainda nao tem livros deste autor na biblioteca.</p>
              <Button variant="secondary" icon={<Plus className="w-4 h-4" />}>Adicionar Livro</Button>
            </div>
          )}
        </div>

        {/* Notable Works */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Obras Notaveis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {author.notableWorks.map((work, idx) => (
              <div key={idx} className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 text-center hover:border-zinc-700 transition-colors">
                <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                <p className="text-sm text-white font-medium">{work}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
