
import React, { useState, useEffect, useRef } from 'react';
import { SOURCE_ITEMS } from '../../constants';
import { Button } from '../atoms/Button';
// Removed Modal import usage for main flows
import { Modal } from '../molecules/Modal';
import { Badge } from '../atoms/Badge';
import { 
  Search, 
  Link, 
  Youtube, 
  FileText, 
  Mic, 
  Upload, 
  Sparkles,
  ExternalLink,
  MoreVertical,
  Plus,
  CheckCircle2,
  Loader2,
  Tag,
  ArrowRight,
  MessageSquare,
  Bot,
  Send,
  Network,
  Grid,
  List,
  Filter,
  Share2,
  Copy,
  BookOpen,
  Layout,
  Mail,
  Film,
  Brain,
  ArrowLeft,
  X
} from 'lucide-react';

// --- Types & Mock Data Extensions ---

type ViewMode = 'grid' | 'list' | 'graph' | 'import' | 'detail';
type ProcessingStage = 'idle' | 'extract' | 'transcribe' | 'summarize' | 'insights' | 'tagging' | 'complete';

interface ProcessingStep {
    id: ProcessingStage;
    label: string;
    icon: React.ElementType;
}

const INSIGHTS_MOCK = [
    { type: 'quote', content: "Não pergunte se gostam da sua ideia, pergunte como resolvem o problema hoje.", tag: 'Validação' },
    { type: 'concept', content: "A Regra dos 2 Minutos: Se leva menos de 2 minutos, faça agora. Isso elimina o custo cognitivo de gerenciar a tarefa.", tag: 'Produtividade' },
    { type: 'stat', content: "90% das startups falham não por falta de tecnologia, mas por falta de clientes.", tag: 'Startup' },
];

const GRAPH_NODES = [
    { id: '1', x: 50, y: 50, label: 'Validação', type: 'topic', size: 60 },
    { id: '2', x: 20, y: 30, label: 'The Mom Test', type: 'source', size: 40 },
    { id: '3', x: 80, y: 30, label: 'Lean Startup', type: 'source', size: 40 },
    { id: '4', x: 50, y: 80, label: 'Customer Discovery', type: 'topic', size: 50 },
    { id: '5', x: 20, y: 70, label: 'Steve Blank', type: 'author', size: 35 },
    { id: '6', x: 80, y: 70, label: 'Eric Ries', type: 'author', size: 35 },
];

const GRAPH_EDGES = [
    { from: '1', to: '2' },
    { from: '1', to: '3' },
    { from: '1', to: '4' },
    { from: '4', to: '5' },
    { from: '3', to: '6' },
];

// --- Components ---

export const ContentCurator: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('Todos');
  
  // Processing State
  const [processingUrl, setProcessingUrl] = useState('');
  const [processingStage, setProcessingStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState(0);

  // Detail State
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<'summary' | 'insights' | 'chat'>('summary');

  // Chat State
  const [chatMessages, setChatMessages] = useState<{sender: 'user'|'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const startProcessing = () => {
    if (!processingUrl.trim()) return;
    setProcessingStage('extract');
    setProgress(0);
  };

  useEffect(() => {
      if (viewMode === 'import' && processingStage !== 'idle' && processingStage !== 'complete') {
          const stages: ProcessingStage[] = ['extract', 'transcribe', 'summarize', 'insights', 'tagging', 'complete'];
          const currentIndex = stages.indexOf(processingStage);
          
          if (currentIndex < stages.length - 1) {
              const timeout = setTimeout(() => {
                  setProcessingStage(stages[currentIndex + 1]);
                  setProgress(((currentIndex + 1) / (stages.length - 1)) * 100);
              }, 1500); // Simulate time per stage
              return () => clearTimeout(timeout);
          }
      }
  }, [processingStage, viewMode]);

  const handleOpenSource = (source: any) => {
      setSelectedSource(source);
      setViewMode('detail');
      setDetailTab('summary');
      setChatMessages([{sender: 'ai', text: `Analisei "${source.title}". Posso extrair citações, explicar conceitos ou encontrar conexões. O que você precisa?`}]);
  };

  const handleSendMessage = async () => {
      if (!chatInput.trim()) return;
      
      const userMsg = chatInput;
      setChatMessages(prev => [...prev, {sender: 'user', text: userMsg}]);
      setChatInput('');
      setIsTyping(true);

      setTimeout(() => {
          let response = "Com base no conteúdo: ";
          if (userMsg.toLowerCase().includes('resumo')) {
              response += "O autor argumenta que a validação precoce é contra-intuitiva, mas economiza recursos. O ponto central é evitar o viés de confirmação.";
          } else if (userMsg.toLowerCase().includes('exemplo')) {
              response += "Ele cita o caso do Dropbox, que usou um vídeo explicativo para validar demanda antes de escrever o código complexo de sincronização.";
          } else {
              response += "Essa é uma nuance interessante. O material sugere que devemos focar no comportamento passado do cliente, não em promessas futuras.";
          }
          setChatMessages(prev => [...prev, {sender: 'ai', text: response}]);
          setIsTyping(false);
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1500);
  };

  // --- Render Helpers ---

  const getSourceIcon = (type: string) => {
      switch(type) {
          case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
          case 'pdf': return <FileText className="w-5 h-5 text-orange-500" />;
          case 'url': return <Link className="w-5 h-5 text-blue-500" />;
          case 'audio': return <Mic className="w-5 h-5 text-purple-500" />;
          default: return <FileText className="w-5 h-5 text-zinc-500" />;
      }
  };

  const renderProcessingStep = (step: ProcessingStage, current: ProcessingStage, label: string, Icon: any) => {
      const stages = ['extract', 'transcribe', 'summarize', 'insights', 'tagging', 'complete'];
      const stepIndex = stages.indexOf(step);
      const currentIndex = stages.indexOf(current);
      
      let statusColor = 'text-zinc-600 border-zinc-700 bg-zinc-900';
      if (stepIndex < currentIndex) statusColor = 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10'; // Completed
      if (step === current) statusColor = 'text-amber-500 border-amber-500/20 bg-amber-500/10 animate-pulse'; // Active

      return (
          <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${statusColor} mb-2`}>
              <div className="shrink-0">
                  {stepIndex < currentIndex ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
              </div>
              <span className="text-sm font-medium">{label}</span>
              {step === current && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
          </div>
      );
  };

  return (
    <>
        {/* --- MAIN DASHBOARD VIEW --- */}
        {(viewMode === 'grid' || viewMode === 'list' || viewMode === 'graph') && (
            <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                    Curador[IA]
                </h1>
                <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
                    Sua central de inteligência e processamento de conhecimento.
                </p>
                </div>
                <div className="flex gap-3 items-center">
                    <div className="flex bg-[#0A0A0A] border border-[#1F1F22] rounded-lg p-1">
                        <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Grid className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><List className="w-4 h-4" /></button>
                        <button onClick={() => setViewMode('graph')} className={`p-2 rounded ${viewMode === 'graph' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}><Network className="w-4 h-4" /></button>
                    </div>
                    <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => { setViewMode('import'); setProcessingStage('idle'); setProcessingUrl(''); }}>Importar Fonte</Button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col gap-8">
                
                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-[#18181B] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <div className="w-full lg:w-96 relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                        <input type="text" placeholder="Buscar em todo o conhecimento..." className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-lg pl-10 py-2 text-sm text-white focus:ring-1 focus:ring-eximia-500" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
                        {['Todos', 'Vídeos', 'PDFs', 'Artigos', 'Áudios', 'Favoritos'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${activeTab === tab ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent' : 'bg-transparent border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-zinc-300'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- VIEW: GRID --- */}
                {viewMode === 'grid' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {SOURCE_ITEMS.map((source) => (
                            <div 
                                key={source.id} 
                                onClick={() => handleOpenSource(source)}
                                className="group bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-eximia-500/50 transition-all cursor-pointer flex flex-col h-[280px] hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2.5 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 group-hover:bg-eximia-500/10 group-hover:text-eximia-500 transition-colors">
                                        {getSourceIcon(source.type)}
                                    </div>
                                    <div className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500">
                                        {source.metadata}
                                    </div>
                                </div>
                                
                                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-3 leading-tight flex-1">
                                    {source.title}
                                </h4>

                                <div className="mt-auto space-y-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {source.tags.slice(0, 2).map(tag => (
                                            <span key={tag} className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded text-[10px] text-zinc-500 uppercase tracking-wide">
                                                {tag}
                                            </span>
                                        ))}
                                        {source.tags.length > 2 && <span className="text-[10px] text-zinc-500 py-0.5">+{source.tags.length - 2}</span>}
                                    </div>

                                    <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-500">
                                        <span className="flex items-center gap-1.5 group-hover:text-eximia-500 transition-colors">
                                            <Sparkles className="w-3 h-3" /> {source.insightsCount} insights
                                        </span>
                                        <span>{source.dateImported}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Upload Card */}
                        <button 
                            onClick={() => { setViewMode('import'); setProcessingStage('idle'); }}
                            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-6 text-zinc-400 hover:text-eximia-500 hover:border-eximia-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all gap-3 group h-[280px]"
                        >
                            <div className="w-14 h-14 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Plus className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-bold uppercase tracking-wider">Adicionar Fonte</span>
                        </button>
                    </div>
                )}

                {/* --- VIEW: LIST --- */}
                {viewMode === 'list' && (
                    <div className="bg-[#18181B] border border-zinc-800 rounded-xl overflow-hidden">
                        {/* List View Implementation (Simplified for brevity) */}
                        <div className="p-8 text-center text-zinc-500">List View Placeholder</div>
                    </div>
                )}

                {/* --- VIEW: GRAPH --- */}
                {viewMode === 'graph' && (
                    <div className="h-[600px] bg-[#0A0A0A] border border-zinc-800 rounded-xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
                        
                        {/* Controls */}
                        <div className="absolute top-4 right-4 flex gap-2 z-20">
                            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Plus className="w-4 h-4" /></button>
                            <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Filter className="w-4 h-4" /></button>
                        </div>

                        {/* SVG Layer for Edges */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                            {GRAPH_EDGES.map((edge, i) => {
                                const start = GRAPH_NODES.find(n => n.id === edge.from);
                                const end = GRAPH_NODES.find(n => n.id === edge.to);
                                if (!start || !end) return null;
                                return (
                                    <line 
                                        key={i}
                                        x1={`${start.x}%`} y1={`${start.y}%`}
                                        x2={`${end.x}%`} y2={`${end.y}%`}
                                        stroke="#3F3F46" strokeWidth="1" strokeOpacity="0.5"
                                    />
                                );
                            })}
                        </svg>

                        {/* Nodes */}
                        {GRAPH_NODES.map(node => (
                            <div 
                                key={node.id}
                                className={`
                                    absolute flex items-center justify-center rounded-full text-[10px] font-bold text-center cursor-pointer hover:scale-110 transition-transform shadow-lg border z-10
                                    ${node.type === 'source' ? 'bg-zinc-900 text-white border-zinc-700' : 
                                    node.type === 'topic' ? 'bg-eximia-500 text-black border-eximia-400' :
                                    'bg-zinc-800 text-zinc-400 border-zinc-700'}
                                `}
                                style={{ 
                                    left: `${node.x}%`, 
                                    top: `${node.y}%`, 
                                    width: node.size, 
                                    height: node.size,
                                    transform: 'translate(-50%, -50%)'
                                }}
                                title={node.label}
                            >
                                {node.size > 40 && node.label.split(' ')[0]}
                            </div>
                        ))}
                        
                        <div className="absolute bottom-4 left-4 p-4 bg-zinc-900/90 backdrop-blur border border-zinc-800 rounded-lg text-xs text-zinc-400">
                            <p>● Fontes</p>
                            <p className="text-eximia-500">● Tópicos</p>
                            <p className="text-zinc-600">● Autores</p>
                        </div>
                    </div>
                )}

            </div>
            </div>
        )}

      {/* --- IMPORT / PROCESSING FULL SCREEN VIEW --- */}
      {viewMode === 'import' && (
          <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-8">
              <div className="w-full max-w-3xl">
                  <div className="flex justify-between items-center mb-8">
                      <button onClick={() => setViewMode('grid')} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors">
                          <ArrowLeft className="w-4 h-4" /> Cancelar
                      </button>
                      <h2 className="text-xl font-bold text-white">{processingStage === 'complete' ? "Conteúdo Adicionado" : "Importar & Processar"}</h2>
                      <div className="w-20" /> {/* Spacer */}
                  </div>

                  <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-10 shadow-2xl">
                        {processingStage === 'idle' ? (
                            <div className="space-y-8">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                                        <Link className="w-8 h-8 text-zinc-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Adicionar nova fonte de conhecimento</h3>
                                    <p className="text-zinc-500">Cole uma URL ou faça upload de arquivos para processamento neural.</p>
                                </div>

                                <div className="relative">
                                    <input 
                                        type="text" 
                                        value={processingUrl}
                                        onChange={(e) => setProcessingUrl(e.target.value)}
                                        placeholder="Cole uma URL (YouTube, Artigo, PDF)..."
                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-6 pr-40 text-sm focus:outline-none focus:border-eximia-500 transition-all"
                                        autoFocus
                                    />
                                    <button 
                                        onClick={startProcessing}
                                        disabled={!processingUrl}
                                        className="absolute right-2 top-2 bottom-2 bg-white text-black px-6 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Analisar
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 cursor-pointer transition-all bg-zinc-900/30 hover:bg-zinc-900">
                                        <Upload className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Upload Arquivo</span>
                                        <span className="text-[10px]">PDF, MP3, MP4, TXT</span>
                                    </div>
                                    <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 cursor-pointer transition-all bg-zinc-900/30 hover:bg-zinc-900">
                                        <FileText className="w-8 h-8 mb-2" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Colar Texto</span>
                                        <span className="text-[10px]">Notas, Transcrições</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Progress Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-eximia-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                                    </div>
                                    <span className="text-xs font-mono text-eximia-500">{Math.round(progress)}%</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left: Steps */}
                                    <div>
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Pipeline Neural</h4>
                                        <div className="space-y-2">
                                            {renderProcessingStep('extract', processingStage, 'Extração de Dados', Link)}
                                            {renderProcessingStep('transcribe', processingStage, 'Transcrição Whisper', Mic)}
                                            {renderProcessingStep('summarize', processingStage, 'Resumo Executivo', FileText)}
                                            {renderProcessingStep('insights', processingStage, 'Extração de Insights', Sparkles)}
                                            {renderProcessingStep('tagging', processingStage, 'Classificação Semântica', Tag)}
                                        </div>
                                    </div>

                                    {/* Right: Live Preview */}
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative overflow-hidden h-full flex flex-col">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Bot className="w-24 h-24 text-white" />
                                        </div>
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Live Output</h4>
                                        
                                        <div className="space-y-4 font-mono text-xs text-zinc-400 flex-1">
                                            {processingStage === 'extract' && <p>Conectando à fonte... <span className="text-emerald-500">OK</span><br/>Metadados recuperados.</p>}
                                            {(processingStage === 'transcribe' || progress > 20) && <p>Áudio detectado. Iniciando modelo Whisper-large-v3... <br/><span className="text-zinc-600">"Neste vídeo vamos falar sobre..."</span></p>}
                                            {(processingStage === 'summarize' || progress > 40) && <p>Gerando resumo conciso... <br/>Identificados 3 tópicos principais.</p>}
                                            {(processingStage === 'insights' || progress > 60) && <p>Extraindo citações chave... <br/><span className="text-eximia-500">Insight #1 encontrado.</span></p>}
                                            {(processingStage === 'complete') && (
                                                <div className="flex flex-col items-center justify-center h-full text-center">
                                                    <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-2">
                                                        <CheckCircle2 className="w-6 h-6" />
                                                    </div>
                                                    <p className="text-emerald-400 font-bold">Processamento Finalizado</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {processingStage === 'complete' && (
                                    <div className="flex justify-end gap-3 pt-6 border-t border-zinc-800">
                                        <Button variant="secondary" onClick={() => setViewMode('grid')}>Fechar</Button>
                                        <Button variant="primary" icon={<ArrowRight className="w-4 h-4" />} onClick={() => handleOpenSource({title: 'Conteúdo Importado', tags: ['Novo'], insightsCount: 5, type: 'youtube'})}>Ver Detalhes</Button>
                                    </div>
                                )}
                            </div>
                        )}
                  </div>
              </div>
          </div>
      )}

      {/* --- SOURCE DETAIL FULL SCREEN VIEW --- */}
      {viewMode === 'detail' && (
          <div className="min-h-screen bg-[#050505] flex flex-col font-sans animate-in fade-in">
              {/* Header */}
              <div className="h-16 border-b border-[#1F1F22] flex items-center justify-between px-6 bg-[#0A0A0A] shrink-0 z-20 sticky top-0">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setViewMode('grid')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                          <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="h-6 w-[1px] bg-zinc-800" />
                      <h2 className="font-bold text-white text-sm truncate max-w-md">{selectedSource?.title || 'Detalhes da Fonte'}</h2>
                  </div>
                  
                  <div className="flex items-center gap-3">
                      <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                          {['summary', 'insights', 'chat'].map((tab: any) => (
                              <button
                                key={tab}
                                onClick={() => setDetailTab(tab)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors ${detailTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                              >
                                  {tab === 'summary' ? 'Resumo' : tab === 'insights' ? 'Insights' : 'Chat'}
                              </button>
                          ))}
                      </div>
                      <div className="h-6 w-[1px] bg-zinc-800 mx-2" />
                      <Button size="sm" variant="outline" icon={<ExternalLink className="w-3 h-3" />}>Original</Button>
                      <Button size="sm" variant="primary" icon={<Share2 className="w-3 h-3" />}>Usar</Button>
                  </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                  {/* Main Content Area */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                      <div className="max-w-4xl mx-auto">
                          
                          {detailTab === 'summary' && (
                              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                                  <div className="flex gap-2 mb-4">
                                      {selectedSource?.tags.map((tag: string) => (
                                          <Badge key={tag} variant="outline">{tag}</Badge>
                                      ))}
                                  </div>
                                  <div className="prose prose-invert max-w-none">
                                      <h3 className="text-2xl font-bold text-white mb-4">Resumo Executivo</h3>
                                      <p className="text-zinc-300 leading-relaxed font-serif text-lg">
                                          Este conteúdo explora os fundamentos da validação de ideias no contexto de startups. 
                                          O autor defende que a maioria dos empreendedores falha por construir produtos baseados em suposições não testadas.
                                          <br/><br/>
                                          O framework proposto foca em "Customer Discovery" antes do desenvolvimento do produto.
                                      </p>
                                      
                                      <h4 className="text-lg font-bold text-white mt-8 mb-4 uppercase tracking-wider">Tópicos Abordados</h4>
                                      <ul className="list-disc pl-5 text-zinc-400 space-y-2 text-base">
                                          <li>A falácia do "Build it and they will come"</li>
                                          <li>Como entrevistar clientes sem enviesar respostas</li>
                                          <li>Métricas de vaidade vs Métricas de verdade</li>
                                      </ul>
                                  </div>
                              </div>
                          )}

                          {detailTab === 'insights' && (
                              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                                  {INSIGHTS_MOCK.map((insight, idx) => (
                                      <div key={idx} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl group hover:border-zinc-700 transition-colors">
                                          <div className="flex justify-between items-start mb-4">
                                              <Badge variant="primary" className="bg-eximia-900/20 text-eximia-500 border-eximia-500/30">{insight.type}</Badge>
                                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                  <button className="text-zinc-500 hover:text-white" title="Copiar"><Copy className="w-4 h-4" /></button>
                                                  <button className="text-zinc-500 hover:text-white" title="Criar Post"><Share2 className="w-4 h-4" /></button>
                                              </div>
                                          </div>
                                          <p className="text-zinc-200 font-serif text-xl italic leading-relaxed">"{insight.content}"</p>
                                          <div className="mt-4 text-xs text-zinc-500 font-mono">#{insight.tag}</div>
                                      </div>
                                  ))}
                              </div>
                          )}

                          {detailTab === 'chat' && (
                              <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in">
                                  <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-4">
                                      {chatMessages.map((msg, i) => (
                                          <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-zinc-800 text-white rounded-tr-sm' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-sm'}`}>
                                                  {msg.text}
                                              </div>
                                          </div>
                                      ))}
                                      {isTyping && (
                                          <div className="flex justify-start">
                                              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl text-xs text-zinc-500 flex items-center gap-2">
                                                  <Sparkles className="w-3 h-3 animate-spin" /> Analisando contexto...
                                              </div>
                                          </div>
                                      )}
                                      <div ref={chatEndRef} />
                                  </div>
                                  <div className="relative pt-4 border-t border-zinc-800">
                                      <input 
                                          type="text" 
                                          placeholder="Pergunte algo sobre este conteúdo..."
                                          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-6 pr-14 py-4 text-sm focus:outline-none focus:border-eximia-500 transition-colors shadow-lg"
                                          value={chatInput}
                                          onChange={(e) => setChatInput(e.target.value)}
                                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                      />
                                      <button 
                                        onClick={handleSendMessage}
                                        className="absolute right-3 top-7 p-2 bg-zinc-800 text-zinc-400 rounded-lg hover:bg-eximia-500 hover:text-black transition-colors"
                                      >
                                          <Send className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Sidebar Metadata (Right) */}
                  <div className="w-80 border-l border-zinc-800 bg-[#0A0A0A] p-6 space-y-8 hidden xl:block">
                      <div>
                          <div className="aspect-video bg-zinc-900 rounded-lg flex items-center justify-center mb-4 border border-zinc-800">
                              {getSourceIcon(selectedSource?.type || 'file')}
                          </div>
                          <h4 className="font-bold text-white text-lg leading-tight mb-2">{selectedSource?.title}</h4>
                          <p className="text-xs text-zinc-500">{selectedSource?.metadata}</p>
                      </div>

                      <div className="space-y-6">
                          <div>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Qualidade</p>
                              <div className="flex items-center gap-2">
                                  <div className="flex gap-1">
                                      {[1,2,3,4,5].map(s => <div key={s} className={`w-2 h-2 rounded-full ${s <= 4 ? 'bg-emerald-500' : 'bg-zinc-800'}`} />)}
                                  </div>
                                  <span className="text-xs text-emerald-500 font-bold ml-2">Alta</span>
                              </div>
                          </div>

                          <div>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Usar Em</p>
                              <div className="grid grid-cols-2 gap-3">
                                  <button className="flex flex-col items-center justify-center p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors group">
                                      <Layout className="w-5 h-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                                      <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Post</span>
                                  </button>
                                  <button className="flex flex-col items-center justify-center p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors group">
                                      <BookOpen className="w-5 h-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                                      <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Ebook</span>
                                  </button>
                                  <button className="flex flex-col items-center justify-center p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors group">
                                      <Mail className="w-5 h-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                                      <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">News</span>
                                  </button>
                                  <button className="flex flex-col items-center justify-center p-3 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-colors group">
                                      <Film className="w-5 h-5 text-zinc-500 group-hover:text-white mb-2 transition-colors" />
                                      <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Script</span>
                                  </button>
                              </div>
                          </div>

                          <div>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3">Conexões</p>
                              <div className="space-y-2">
                                  <div className="flex items-center gap-3 text-xs text-zinc-400 p-3 hover:bg-zinc-900 rounded-lg cursor-pointer border border-transparent hover:border-zinc-800 transition-colors">
                                      <Network className="w-4 h-4 text-zinc-600" />
                                      <span className="truncate">The Lean Startup</span>
                                  </div>
                                  <div className="flex items-center gap-3 text-xs text-zinc-400 p-3 hover:bg-zinc-900 rounded-lg cursor-pointer border border-transparent hover:border-zinc-800 transition-colors">
                                      <Network className="w-4 h-4 text-zinc-600" />
                                      <span className="truncate">Steve Blank</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};
