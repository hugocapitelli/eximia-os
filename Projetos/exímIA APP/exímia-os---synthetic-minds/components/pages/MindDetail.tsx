
import React, { useState, useRef, useEffect } from 'react';
import { CLONES } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  ArrowLeft,
  Send,
  Brain,
  Sparkles,
  Settings,
  MoreVertical,
  Paperclip,
  Mic,
  Image,
  Clock,
  Zap,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Cpu,
  Activity,
  BookOpen,
  MessageSquare,
  Star
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  reactions?: { likes: number; dislikes: number };
}

interface MindDetailProps {
  mindId?: string;
  onBack?: () => void;
}

// Simulated responses based on mind personality
const getMindResponse = (mindId: string, userMessage: string): string => {
  const responses: Record<string, string[]> = {
    'gary-halbert': [
      "Let me tell you something that took me 20 years and millions of dollars to learn... The headline is EVERYTHING. Get that right, and the rest almost writes itself.",
      "You know what the biggest mistake most copywriters make? They try to be clever instead of clear. Clarity ALWAYS beats cleverness.",
      "Listen, I've written copy that's generated over $100 million in sales. And here's the secret: Always lead with the benefit that keeps your prospect awake at 3 AM.",
      "Stop trying to sell to everyone. Find your starving crowd first. A mediocre offer to a desperate market will outsell a brilliant offer to the wrong people.",
    ],
    'david-ogilvy': [
      "Research, research, research. I never stop testing, and neither should you. The consumer isn't a moron—she's your wife.",
      "The headline is the most important element in most advertisements. It's the telegram that decides whether the reader will look at the copy.",
      "What you say is more important than how you say it. You cannot bore people into buying your product.",
      "Every advertisement should be thought of as a contribution to the complex symbol which is the brand image.",
    ],
    'elon-musk': [
      "First principles thinking is the key. Strip everything down to the fundamental truths and reason up from there.",
      "If something is important enough, you do it even if the odds are against you. That's how we built SpaceX.",
      "Work like hell. I mean you just have to put in 80-100 hour weeks. This improves the odds of success.",
      "Failure is an option here. If things are not failing, you're not innovating enough.",
    ],
    'david-goggins': [
      "Stay hard! You haven't even scratched the surface of your potential. Most people tap out at 40% of their capability.",
      "Suffering is the true test of life. Embrace it. Callous your mind like you callous your hands.",
      "Nobody cares what you did yesterday. What are you going to do today? That's all that matters.",
      "Stop making excuses. Take ownership of your life. You're the only one who can change your situation.",
    ],
  };

  const mindResponses = responses[mindId] || [
    "That's an interesting perspective. Let me share my thoughts on this...",
    "Based on my experience and knowledge, here's what I would suggest...",
    "Let me think about this from multiple angles...",
  ];

  return mindResponses[Math.floor(Math.random() * mindResponses.length)];
};

export const MindDetail: React.FC<MindDetailProps> = ({ mindId = 'gary-halbert', onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: 'Sessão iniciada. Esta é uma simulação baseada em padrões cognitivos extraídos de materiais públicos.',
      timestamp: new Date(),
    },
    {
      id: 'greeting',
      role: 'assistant',
      content: 'Olá! Estou aqui para ajudá-lo com suas questões. Baseado em minha expertise e experiência, posso oferecer insights sobre copywriting, marketing, vendas e persuasão. O que você gostaria de discutir?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const mind = CLONES.find(c => c.id === mindId) || CLONES[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response with typing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: getMindResponse(mindId, inputMessage),
        timestamp: new Date(),
        reactions: { likes: 0, dislikes: 0 },
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedPrompts = [
    "Como escrever uma headline que converte?",
    "Qual é o segredo de uma boa copy?",
    "Como criar urgência sem ser agressivo?",
    "Qual sua melhor dica para vendas?",
  ];

  return (
    <div className="h-screen flex flex-col bg-[#050505]">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-[#0A0A0A]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-zinc-400" />
              </button>
            )}

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-zinc-700 to-zinc-900 p-0.5">
                  <div className="w-full h-full rounded-lg bg-zinc-900 flex items-center justify-center overflow-hidden">
                    {mind.avatarUrl.length > 2 ? (
                      <img src={mind.avatarUrl} className="w-full h-full object-cover" alt={mind.name} />
                    ) : (
                      <span className="text-lg font-bold text-zinc-600">{mind.avatarUrl}</span>
                    )}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0A0A]" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-semibold text-zinc-100">{mind.name}</h1>
                  <Badge variant="outline" className="text-[10px] py-0">
                    <Cpu className="w-3 h-3 mr-1" />
                    Clone
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500">{mind.domain}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-minds-900/30 text-minds-400 border-minds-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Ativo
            </Badge>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'system' ? (
                <div className="w-full text-center py-2">
                  <span className="text-xs text-zinc-600 bg-zinc-900/50 px-3 py-1 rounded-full">
                    {message.content}
                  </span>
                </div>
              ) : (
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-lg bg-minds-900/30 flex items-center justify-center">
                        <Brain className="w-3 h-3 text-minds-400" />
                      </div>
                      <span className="text-xs text-zinc-500">{mind.name}</span>
                      <span className="text-[10px] text-zinc-600">
                        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-amber-600 text-white rounded-br-md'
                        : 'bg-zinc-800/80 text-zinc-200 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.role === 'assistant' && message.reactions && (
                    <div className="flex items-center gap-2 mt-2">
                      <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors group">
                        <Copy className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors group">
                        <RefreshCw className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400" />
                      </button>
                      <div className="h-4 w-px bg-zinc-800 mx-1" />
                      <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors group">
                        <ThumbsUp className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors group">
                        <ThumbsDown className="w-3.5 h-3.5 text-zinc-600 group-hover:text-rose-400" />
                      </button>
                    </div>
                  )}

                  {message.role === 'user' && (
                    <div className="flex justify-end mt-1">
                      <span className="text-[10px] text-zinc-600">
                        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-minds-900/30 flex items-center justify-center">
                  <Brain className="w-3 h-3 text-minds-400 animate-pulse" />
                </div>
                <span className="text-xs text-zinc-500">{mind.name} está digitando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Suggested Prompts */}
      {messages.length <= 2 && (
        <div className="border-t border-zinc-800/50 bg-[#0A0A0A]/50">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <p className="text-xs text-zinc-500 mb-2">Sugestões:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMessage(prompt)}
                  className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-zinc-800 bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Pergunte algo a ${mind.name}...`}
                rows={1}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-24 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 resize-none min-h-[48px] max-h-[200px]"
                style={{ height: 'auto' }}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
                  <Paperclip className="w-4 h-4 text-zinc-600" />
                </button>
                <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
                  <Image className="w-4 h-4 text-zinc-600" />
                </button>
                <button className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors">
                  <Mic className="w-4 h-4 text-zinc-600" />
                </button>
              </div>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="h-12 px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-[10px] text-zinc-600 text-center mt-3">
            Esta é uma simulação baseada em padrões cognitivos. Respostas são geradas por IA.
          </p>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-zinc-100 mb-4">Configurações da Sessão</h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Temperatura</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="0" max="100" defaultValue="70" className="flex-1" />
                  <span className="text-sm text-zinc-400 w-10">0.7</span>
                </div>
                <p className="text-[10px] text-zinc-600 mt-1">Criatividade vs precisão das respostas</p>
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Contexto Máximo</label>
                <select className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-300">
                  <option>8K tokens</option>
                  <option>16K tokens</option>
                  <option>32K tokens</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase tracking-wider mb-2 block">Modo de Resposta</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-200">
                    Conversacional
                  </button>
                  <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-500">
                    Direto ao Ponto
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="ghost" className="flex-1" onClick={() => setShowSettings(false)}>Cancelar</Button>
              <Button className="flex-1">Salvar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
