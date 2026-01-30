
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  MessageCircle,
  Plus,
  Brain,
  Sparkles,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Send,
  Lightbulb,
  HelpCircle,
  BookOpen,
  Star,
  Zap
} from 'lucide-react';

interface SocraticSession {
  id: string;
  topic: string;
  courseId?: string;
  courseName?: string;
  status: 'active' | 'completed' | 'paused';
  messagesCount: number;
  insightsGenerated: number;
  startedAt: string;
  lastActivityAt: string;
  rating?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'standard' | 'clarification' | 'challenge' | 'synthesis' | 'feedback';
  timestamp: Date;
}

// Mock sessions
const MOCK_SESSIONS: SocraticSession[] = [
  {
    id: 's1',
    topic: 'Product Discovery vs Delivery',
    courseId: 'pm-101',
    courseName: 'Product Management 101',
    status: 'active',
    messagesCount: 12,
    insightsGenerated: 3,
    startedAt: '28 Jan 2026',
    lastActivityAt: 'Há 2 horas'
  },
  {
    id: 's2',
    topic: 'Jobs to be Done Framework',
    courseId: 'pm-discovery',
    courseName: 'Product Discovery',
    status: 'completed',
    messagesCount: 24,
    insightsGenerated: 5,
    startedAt: '25 Jan 2026',
    lastActivityAt: '26 Jan 2026',
    rating: 5
  },
  {
    id: 's3',
    topic: 'React Hooks Best Practices',
    courseId: 'react-advanced',
    courseName: 'React Advanced',
    status: 'paused',
    messagesCount: 8,
    insightsGenerated: 2,
    startedAt: '20 Jan 2026',
    lastActivityAt: '22 Jan 2026'
  }
];

// Mock conversation
const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: 'Vamos explorar o conceito de Product Discovery. Na sua opinião, qual é a diferença fundamental entre Discovery e Delivery no contexto de produto?',
    type: 'clarification',
    timestamp: new Date()
  },
  {
    id: 'm2',
    role: 'user',
    content: 'Acho que Discovery é sobre entender o problema e Delivery é sobre construir a solução.',
    type: 'standard',
    timestamp: new Date()
  },
  {
    id: 'm3',
    role: 'assistant',
    content: 'Interessante perspectiva! Você mencionou "entender o problema". Mas será que apenas entender é suficiente? O que acontece se entendermos o problema errado? Como podemos validar nossa compreensão antes de partir para a construção?',
    type: 'challenge',
    timestamp: new Date()
  },
  {
    id: 'm4',
    role: 'user',
    content: 'Podemos fazer entrevistas com usuários e validar hipóteses com protótipos.',
    type: 'standard',
    timestamp: new Date()
  },
  {
    id: 'm5',
    role: 'assistant',
    content: '💡 **Insight Gerado**: Discovery não é apenas sobre "entender" o problema, mas sobre validar continuamente nossas hipóteses através de evidências empíricas (entrevistas, protótipos, dados) antes de investir recursos em desenvolvimento.\n\nIsso nos leva a uma próxima questão: Como você priorizaria quais hipóteses validar primeiro?',
    type: 'synthesis',
    timestamp: new Date()
  }
];

const getMessageTypeIcon = (type: Message['type']) => {
  switch (type) {
    case 'clarification': return <HelpCircle className="w-4 h-4" />;
    case 'challenge': return <Zap className="w-4 h-4" />;
    case 'synthesis': return <Lightbulb className="w-4 h-4" />;
    case 'feedback': return <Star className="w-4 h-4" />;
    default: return null;
  }
};

const getMessageTypeBadge = (type: Message['type']) => {
  switch (type) {
    case 'clarification': return 'Clarificação';
    case 'challenge': return 'Desafio';
    case 'synthesis': return 'Síntese';
    case 'feedback': return 'Feedback';
    default: return null;
  }
};

export const AcademySocraticSessions: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedSession, setSelectedSession] = useState<SocraticSession | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: `m${messages.length + 1}`,
      role: 'user',
      content: inputMessage,
      type: 'standard',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `m${messages.length + 2}`,
        role: 'assistant',
        content: 'Excelente reflexão! Vamos aprofundar esse ponto. Você consegue pensar em um exemplo prático do seu dia a dia onde isso se aplicaria?',
        type: 'challenge',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  // Session List View
  if (!selectedSession) {
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
              <h1 className="text-3xl font-bold text-zinc-100">Sessões Socráticas</h1>
              <p className="text-zinc-400 mt-1 font-serif text-lg">
                Aprenda através do diálogo guiado por IA.
              </p>
            </div>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Nova Sessão</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
            <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">{MOCK_SESSIONS.length}</p>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Sessões</p>
            </div>
          </div>
          <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
            <div className="p-3 bg-amber-900/20 rounded-lg text-amber-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {MOCK_SESSIONS.reduce((acc, s) => acc + s.insightsGenerated, 0)}
              </p>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Insights</p>
            </div>
          </div>
          <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-900/20 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {MOCK_SESSIONS.filter(s => s.status === 'completed').length}
              </p>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Completas</p>
            </div>
          </div>
          <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
            <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100">
                {MOCK_SESSIONS.reduce((acc, s) => acc + s.messagesCount, 0)}
              </p>
              <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Mensagens</p>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {MOCK_SESSIONS.map(session => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    session.status === 'active' ? 'bg-emerald-900/20' :
                    session.status === 'completed' ? 'bg-purple-900/20' :
                    'bg-zinc-800'
                  }`}>
                    <Brain className={`w-6 h-6 ${
                      session.status === 'active' ? 'text-emerald-400' :
                      session.status === 'completed' ? 'text-purple-400' :
                      'text-zinc-500'
                    }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                        {session.topic}
                      </h3>
                      <Badge variant={
                        session.status === 'active' ? 'default' :
                        session.status === 'completed' ? 'secondary' :
                        'outline'
                      }>
                        {session.status === 'active' ? 'Ativa' :
                         session.status === 'completed' ? 'Concluída' : 'Pausada'}
                      </Badge>
                    </div>
                    {session.courseName && (
                      <p className="text-sm text-zinc-500 flex items-center gap-1 mb-2">
                        <BookOpen className="w-4 h-4" />
                        {session.courseName}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        {session.messagesCount} mensagens
                      </span>
                      <span className="flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        {session.insightsGenerated} insights
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {session.lastActivityAt}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.rating && (
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(star => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${star <= session.rating! ? 'text-amber-400 fill-amber-400' : 'text-zinc-600'}`}
                        />
                      ))}
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {MOCK_SESSIONS.length === 0 && (
          <div className="py-16 text-center border-2 border-dashed border-zinc-800 rounded-xl">
            <Brain className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">Nenhuma sessão socrática ainda.</p>
            <Button variant="ghost" size="sm" className="mt-4" icon={<Plus className="w-4 h-4" />}>
              Iniciar Primeira Sessão
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Chat View
  return (
    <div className="h-screen flex flex-col bg-[#050505]">
      {/* Chat Header */}
      <div className="border-b border-zinc-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedSession(null)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <div>
              <h1 className="font-semibold text-zinc-100">{selectedSession.topic}</h1>
              {selectedSession.courseName && (
                <p className="text-sm text-zinc-500">{selectedSession.courseName}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default">
              <Sparkles className="w-3 h-3 mr-1" />
              Método Socrático
            </Badge>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                {message.role === 'assistant' && message.type !== 'standard' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1 rounded ${
                      message.type === 'clarification' ? 'bg-blue-900/30 text-blue-400' :
                      message.type === 'challenge' ? 'bg-amber-900/30 text-amber-400' :
                      message.type === 'synthesis' ? 'bg-emerald-900/30 text-emerald-400' :
                      'bg-purple-900/30 text-purple-400'
                    }`}>
                      {getMessageTypeIcon(message.type)}
                    </div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      {getMessageTypeBadge(message.type)}
                    </span>
                  </div>
                )}
                <div className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-amber-600 text-white'
                    : 'bg-zinc-800 text-zinc-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-zinc-800 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Sua resposta..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
          />
          <Button onClick={handleSendMessage} icon={<Send className="w-4 h-4" />}>
            Enviar
          </Button>
        </div>
        <p className="text-xs text-zinc-600 text-center mt-2">
          O assistente usa o método socrático para guiar seu aprendizado através de perguntas.
        </p>
      </div>
    </div>
  );
};
