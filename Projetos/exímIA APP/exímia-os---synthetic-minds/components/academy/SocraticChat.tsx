import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { Button } from '../atoms/Button';
import { Send, Sparkles, Brain, RefreshCw } from 'lucide-react';

interface SocraticChatProps {
  initialMessage?: string;
  onComplete?: () => void;
}

export const SocraticChat: React.FC<SocraticChatProps> = ({ initialMessage, onComplete }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      addMessage('ai', initialMessage, 'clarification');
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (sender: 'ai' | 'user', text: string, type: ChatMessage['type'] = 'standard') => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      text,
      timestamp: new Date(),
      type,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateSocraticResponse = (userText: string) => {
    setIsThinking(true);
    
    // Simulating "Analyst" and "Socrates" agents delay
    setTimeout(() => {
      let response = "";
      let type: ChatMessage['type'] = 'standard';

      // Very basic simulated socratic logic based on turn count
      const turnCount = messages.filter(m => m.sender === 'ai').length;

      if (turnCount === 1) {
         response = "Interessante. Por que você assume que essa é a única abordagem viável? Você considerou os riscos de viabilidade técnica?";
         type = 'challenge';
      } else if (turnCount === 2) {
         response = "E se o cenário mudasse e você tivesse metade do tempo? Como isso afetaria sua decisão de priorização mencionada anteriormente?";
         type = 'challenge';
      } else if (turnCount >= 3) {
         response = "Excelente síntese. Você identificou que o valor percebido pelo usuário é mais crítico que a perfeição técnica. Isso se alinha com o conceito de 'Riskiest Assumption Test'.";
         type = 'feedback';
         if (onComplete) onComplete();
      } else {
         response = "Pode explicar melhor o que você quer dizer com isso?";
         type = 'clarification';
      }

      addMessage('ai', response, type);
      setIsThinking(false);
    }, 2500);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    addMessage('user', inputValue, 'standard');
    const text = inputValue;
    setInputValue('');
    generateSocraticResponse(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-[#18181B] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
         <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-eximia-100 dark:bg-eximia-900/30 flex items-center justify-center text-eximia-600 dark:text-eximia-400">
                 <Brain className="w-4 h-4" />
             </div>
             <div>
                 <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Socrates AI</h3>
                 <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Session Active</p>
             </div>
         </div>
         <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" title="Reset Session">
             <RefreshCw className="w-4 h-4" />
         </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-zinc-50/50 dark:bg-[#09090B]">
        {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                    max-w-[85%] rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-sm
                    ${msg.sender === 'user' 
                        ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-tr-sm' 
                        : 'bg-white dark:bg-[#1F1F22] border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-sm'}
                `}>
                    {msg.sender === 'ai' && (
                        <div className="mb-2 flex items-center gap-2">
                             <span className={`
                                text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                                ${msg.type === 'clarification' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 
                                  msg.type === 'challenge' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
                                  msg.type === 'feedback' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                                  'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}
                             `}>
                                 {msg.type}
                             </span>
                        </div>
                    )}
                    <p className="whitespace-pre-wrap font-serif text-[15px]">{msg.text}</p>
                </div>
            </div>
        ))}
        
        {isThinking && (
            <div className="flex justify-start">
                <div className="bg-white dark:bg-[#1F1F22] border border-zinc-200 dark:border-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-eximia-500 animate-pulse" />
                    <span className="text-xs text-zinc-500 font-medium animate-pulse">Socrates está analisando...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-[#18181B] border-t border-zinc-200 dark:border-zinc-800">
        <div className="relative">
            <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Responda para aprofundar seu entendimento..."
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-eximia-400 focus:border-eximia-400 resize-none h-[60px] custom-scrollbar text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
            />
            <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || isThinking}
                className="absolute right-2 top-2 p-2 bg-eximia-400 text-zinc-900 rounded-lg hover:bg-eximia-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <Send className="w-4 h-4" />
            </button>
        </div>
        <p className="text-[10px] text-zinc-400 text-center mt-2">
            A IA analisará sua resposta em busca de profundidade e lógica.
        </p>
      </div>
    </div>
  );
};