
import React, { useState } from 'react';
import { INBOX_ITEMS } from '../../constants';
import { InboxItem } from '../../types';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { 
  Inbox as InboxIcon, 
  Mic, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal, 
  Play, 
  FileText 
} from 'lucide-react';

export const Inbox: React.FC = () => {
  const [items, setItems] = useState<InboxItem[]>(INBOX_ITEMS);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleCapture = () => {
    if (!inputValue.trim()) return;
    const newItem: InboxItem = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: inputValue,
      timestamp: 'Agora',
      status: 'pending',
      aiSuggestion: inputValue.toLowerCase().includes('ler') ? {
        targetModule: 'Journey',
        targetType: 'Book',
        confidence: 85,
        reason: "Palavra-chave 'ler' detectada."
      } : undefined
    };
    setItems([newItem, ...items]);
    setInputValue('');
  };

  const handleProcess = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCapture();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <div className="p-4 bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl text-white shadow-lg">
          <InboxIcon className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Universal Inbox</h1>
          <p className="text-zinc-500 text-sm mt-1">Capture tudo. Organize depois.</p>
        </div>
        <div className="ml-auto">
             <Badge variant={items.length === 0 ? 'success' : 'default'}>
                {items.length} ITENS PENDENTES
             </Badge>
        </div>
      </div>

      {/* Quick Capture Bar */}
      <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#1F1F22] shadow-xl mb-12 relative z-20">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="No que você está pensando?"
            className="w-full bg-[#050505] border border-[#1F1F22] rounded-xl p-4 text-lg text-zinc-200 focus:outline-none focus:border-zinc-700 resize-none h-24 placeholder-zinc-700 font-serif"
          />
          <div className="flex justify-between items-center mt-4 px-1">
             <div className="flex gap-2">
                 <button 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded-lg transition-colors flex items-center gap-2 border ${isRecording ? 'bg-rose-950/20 border-rose-900 text-rose-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                 >
                    <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                    {isRecording && <span className="text-[10px] font-bold uppercase">Gravando</span>}
                 </button>
                 <button className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                 </button>
                 <button className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors">
                    <LinkIcon className="w-4 h-4" />
                 </button>
             </div>
             <Button onClick={handleCapture} disabled={!inputValue.trim()} size="sm">
                Capturar
             </Button>
          </div>
        </div>
      </div>

      {/* Inbox Items List */}
      <div className="space-y-4">
          {items.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-[#1F1F22] rounded-2xl">
                  <InboxIcon className="w-12 h-12 mx-auto mb-4 text-zinc-800" />
                  <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest">Inbox Zero</p>
              </div>
          ) : (
              items.map((item) => (
                  <div key={item.id} className="bg-[#0A0A0A] rounded-xl border border-[#1F1F22] p-6 hover:border-zinc-800 transition-colors group animate-in slide-in-from-bottom-4 duration-300">
                    <div className="flex gap-5">
                        <div className="shrink-0 mt-1">
                            {item.type === 'voice' ? (
                                <div className="w-10 h-10 rounded-lg bg-blue-900/20 border border-blue-900/50 flex items-center justify-center text-blue-500">
                                    <Mic className="w-5 h-5" />
                                </div>
                            ) : item.type === 'link' ? (
                                <div className="w-10 h-10 rounded-lg bg-purple-900/20 border border-purple-900/50 flex items-center justify-center text-purple-500">
                                    <LinkIcon className="w-5 h-5" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                                    <FileText className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">{item.timestamp}</span>
                                <button className="text-zinc-600 hover:text-zinc-400">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-zinc-300 text-base font-serif leading-relaxed mb-4">
                                {item.content}
                            </p>

                            {item.type === 'voice' && (
                                <div className="flex items-center gap-3 bg-zinc-900 p-2 rounded-lg border border-zinc-800 w-fit mb-4">
                                    <button className="w-6 h-6 flex items-center justify-center bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                                        <Play className="w-3 h-3 ml-0.5" />
                                    </button>
                                    <div className="h-1 w-24 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-1/3"></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-zinc-500">{item.audioDuration}</span>
                                </div>
                            )}

                            {item.aiSuggestion && (
                                <div className="mt-4 bg-zinc-900/50 border-l-2 border-amber-500 p-3 pl-4 rounded-r-lg flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Sparkles className="w-3 h-3 text-amber-500" />
                                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                                                Smart Triage ({item.aiSuggestion.confidence}%)
                                            </span>
                                        </div>
                                        <p className="text-xs text-zinc-400">
                                            Mover para <strong>{item.aiSuggestion.targetModule}</strong>?
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleProcess(item.id)} className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-emerald-500 transition-colors"><CheckCircle2 className="w-4 h-4" /></button>
                                        <button className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-500 transition-colors"><XCircle className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};
