
import React, { useState, useEffect } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { SearchBar } from '../molecules/SearchBar';
import { Modal } from '../molecules/Modal';
import { 
  Copy, 
  FileText, 
  Search, 
  Filter, 
  Star, 
  Zap, 
  Tag, 
  MousePointer2, 
  Plus,
  Sparkles,
  Save,
  BarChart2,
  RefreshCw,
  LayoutTemplate,
  Globe,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Download,
  Trash2,
  MoreHorizontal,
  Wand2,
  Import,
  Check,
  Library,
  History,
  Share2
} from 'lucide-react';

// --- Types ---

type ViewMode = 'list' | 'grid';
type CopyCategory = 'Headline' | 'CTA' | 'Email' | 'Ad' | 'Social' | 'Sales' | 'Hook';

interface CopyItem {
    id: string;
    content: string;
    category: CopyCategory;
    tags: string[];
    performance: {
        metric: string; // 'CTR', 'Open Rate', 'Conv.'
        value: string;
        trend: 'up' | 'down' | 'stable';
        score: number; // 0-100
    };
    usageCount: number;
    lastUsed: string;
    variations?: string[];
    isFavorite?: boolean;
}

// --- Mock Data ---

const MOCK_COPIES: CopyItem[] = [
    { 
        id: '1', 
        content: "Pare de trabalhar 80h/semana para ganhar o que um funcionário ganha em 40.", 
        category: 'Headline', 
        tags: ['tempo', 'empreendedor', 'provocativo'],
        performance: { metric: 'CTR', value: '4.2%', trend: 'up', score: 92 },
        usageCount: 5,
        lastUsed: '12/01/2026',
        variations: [
            "Você trabalha 80h para ganhar menos que seu funcionário?",
            "80 horas de trabalho, salário de 40. Faz sentido?"
        ]
    },
    { 
        id: '2', 
        content: "Descubra em 5 minutos o gargalo da sua operação.", 
        category: 'CTA', 
        tags: ['urgência', 'curiosidade', 'benefício'],
        performance: { metric: 'Conv.', value: '8.1%', trend: 'up', score: 88 },
        usageCount: 12,
        lastUsed: 'Ontem'
    },
    { 
        id: '3', 
        content: "A verdade sobre escala que ninguém te conta: não é sobre vender mais, é sobre entregar melhor.", 
        category: 'Social', 
        tags: ['educativo', 'autoridade', 'contrarian'],
        performance: { metric: 'Engage', value: '3.5%', trend: 'stable', score: 75 },
        usageCount: 3,
        lastUsed: 'Há 3 dias'
    },
    { 
        id: '4', 
        content: "Últimas 24h: O acesso ao Método ExímIA vai fechar.", 
        category: 'Email', 
        tags: ['escassez', 'urgência'],
        performance: { metric: 'Open Rate', value: '48%', trend: 'down', score: 85 },
        usageCount: 2,
        lastUsed: 'Semana passada'
    },
];

const FRAMEWORKS = [
    { name: 'AIDA', desc: 'Attention, Interest, Desire, Action', usage: 'Sales Pages' },
    { name: 'PAS', desc: 'Problem, Agitation, Solution', usage: 'Ads & Social' },
    { name: 'BAB', desc: 'Before, After, Bridge', usage: 'Case Studies' },
    { name: '4Us', desc: 'Useful, Urgent, Unique, Ultra-specific', usage: 'Headlines' },
];

// --- Components ---

export const ContentCopyBank: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [copies, setCopies] = useState<CopyItem[]>(MOCK_COPIES);
  
  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFrameworksOpen, setIsFrameworksOpen] = useState(false);
  
  // Selection / Detail State
  const [selectedCopy, setSelectedCopy] = useState<CopyItem | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [importText, setImportText] = useState('');

  // --- Handlers ---

  const handleOpenDetail = (copy: CopyItem) => {
      setSelectedCopy(copy);
      setIsDetailModalOpen(true);
  };

  const handleGenerateVariation = (type: string) => {
      if (!selectedCopy) return;
      setIsGenerating(true);
      
      // Simulate AI generation
      setTimeout(() => {
          const newVar = `[${type} Variation] ${selectedCopy.content} (AI Generated)`;
          const updatedCopy = { 
              ...selectedCopy, 
              variations: [...(selectedCopy.variations || []), newVar] 
          };
          setSelectedCopy(updatedCopy);
          // Update in main list too
          setCopies(prev => prev.map(c => c.id === updatedCopy.id ? updatedCopy : c));
          setIsGenerating(false);
      }, 1000);
  };

  const handleImport = () => {
      if (!importText) return;
      const lines = importText.split('\n').filter(line => line.trim().length > 0);
      const newCopies = lines.map((line, idx) => ({
          id: `new-${Date.now()}-${idx}`,
          content: line,
          category: 'Headline' as CopyCategory, // Default
          tags: ['importado'],
          performance: { metric: 'N/A', value: '-', trend: 'stable' as const, score: 0 },
          usageCount: 0,
          lastUsed: 'Nunca'
      }));
      setCopies([...newCopies, ...copies]);
      setImportText('');
      setIsImportModalOpen(false);
  };

  const getScoreColor = (score: number) => {
      if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      if (score >= 70) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
  };

  const filteredCopies = copies.filter(c => {
      const matchesTab = activeTab === 'Todas' || c.category === activeTab;
      const matchesSearch = c.content.toLowerCase().includes(searchQuery.toLowerCase()) || c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
            Copy Bank
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
            Repositório central de alta conversão.
          </p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" icon={<Library className="w-4 h-4" />} onClick={() => setIsFrameworksOpen(true)}>Frameworks</Button>
            <Button variant="outline" icon={<Import className="w-4 h-4" />} onClick={() => setIsImportModalOpen(true)}>Importar</Button>
            <Button 
                variant="primary" 
                icon={<Plus className="w-4 h-4" />} 
                onClick={() => { setSelectedCopy(null); setIsDetailModalOpen(true); }}
            >
                Nova Copy
            </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {[
              { label: 'Total Copies', value: copies.length, icon: FileText, color: 'text-zinc-400' },
              { label: 'Top Performers', value: copies.filter(c => c.performance.score > 85).length, icon: Star, color: 'text-amber-500' },
              { label: 'Taxa de Reuso', value: '3.2x', icon: RefreshCw, color: 'text-blue-500' },
              { label: 'Melhor CTR', value: '8.1%', icon: MousePointer2, color: 'text-emerald-500' },
          ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-center justify-between">
                  <div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                      <h3 className={`text-2xl font-bold ${stat.color.replace('text-', 'text-zinc-900 dark:text-')}`}>{stat.value}</h3>
                  </div>
                  <div className={`p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-5 h-5" />
                  </div>
              </div>
          ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 hide-scrollbar">
              {['Todas', 'Headline', 'CTA', 'Email', 'Ad', 'Social', 'Sales'].map(tab => (
                  <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`
                          px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border
                          ${activeTab === tab 
                              ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-transparent' 
                              : 'bg-transparent text-zinc-500 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'}
                      `}
                  >
                      {tab}
                  </button>
              ))}
          </div>
          <div className="w-full lg:w-96">
              <input 
                  type="text" 
                  placeholder="Buscar por texto, tag ou gatilho..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-eximia-500 transition-colors"
              />
          </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCopies.map(copy => (
              <div 
                key={copy.id} 
                onClick={() => handleOpenDetail(copy)}
                className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-eximia-500/50 hover:shadow-lg transition-all group cursor-pointer flex flex-col h-full"
              >
                  <div className="flex justify-between items-start mb-4">
                      <Badge variant="outline">{copy.category}</Badge>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-bold border ${getScoreColor(copy.performance.score)}`}>
                          {copy.performance.score >= 90 && <Zap className="w-3 h-3 fill-current" />}
                          {copy.performance.value} {copy.performance.metric}
                      </div>
                  </div>
                  
                  <p className="text-lg font-serif text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6 flex-1 line-clamp-4">
                      "{copy.content}"
                  </p>

                  <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                          {copy.tags.map(tag => (
                              <span key={tag} className="text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded border border-zinc-200 dark:border-zinc-800">
                                  #{tag}
                              </span>
                          ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                          <span className="flex items-center gap-1">
                              <History className="w-3 h-3" /> {copy.lastUsed}
                          </span>
                          <span className="flex items-center gap-1 group-hover:text-eximia-500 transition-colors">
                              Usado {copy.usageCount}x <ArrowRight className="w-3 h-3 ml-1" />
                          </span>
                      </div>
                  </div>
              </div>
          ))}
          
          {/* Empty State / Add New */}
          <button 
            onClick={() => { setSelectedCopy(null); setIsDetailModalOpen(true); }}
            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 text-zinc-400 hover:text-eximia-500 hover:border-eximia-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all gap-4 min-h-[300px]"
          >
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <Plus className="w-8 h-8" />
              </div>
              <div className="text-center">
                  <span className="text-lg font-bold block mb-1">Adicionar Nova Copy</span>
                  <span className="text-sm">Manual ou via Framework</span>
              </div>
          </button>
      </div>

      {/* --- MODAL: COPY DETAIL & VARIATIONS --- */}
      <Modal 
        isOpen={isDetailModalOpen} 
        onClose={() => setIsDetailModalOpen(false)} 
        title={selectedCopy ? "Detalhes da Copy" : "Nova Copy"}
        size="lg"
      >
          <div className="flex flex-col h-[600px]">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
                  <div className="space-y-8">
                      {/* Main Copy Area */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 relative group">
                          <div className="absolute top-4 right-4 flex gap-2">
                              <button className="p-2 bg-black/50 rounded-lg text-zinc-400 hover:text-white hover:bg-eximia-500 transition-colors" title="Copiar">
                                  <Copy className="w-4 h-4" />
                              </button>
                          </div>
                          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">Conteúdo Original</label>
                          <textarea 
                            className="w-full bg-transparent text-xl font-serif text-white leading-relaxed resize-none focus:outline-none min-h-[120px]"
                            defaultValue={selectedCopy?.content}
                            placeholder="Escreva sua copy aqui..."
                          />
                          
                          {selectedCopy && (
                              <div className="flex gap-4 mt-6 pt-6 border-t border-zinc-800">
                                  <div>
                                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Performance Score</p>
                                      <div className={`flex items-center gap-2 text-lg font-bold ${getScoreColor(selectedCopy.performance.score).split(' ')[0]}`}>
                                          <BarChart2 className="w-5 h-5" />
                                          {selectedCopy.performance.score}/100
                                      </div>
                                  </div>
                                  <div className="w-[1px] bg-zinc-800" />
                                  <div>
                                      <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Métrica Principal</p>
                                      <p className="text-zinc-300 font-mono text-sm">{selectedCopy.performance.metric}: {selectedCopy.performance.value}</p>
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* AI Variations Engine */}
                      <div className="space-y-4">
                          <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-eximia-500" /> Variações Inteligentes
                              </h3>
                              <div className="flex gap-2">
                                  {['Mais Curto', 'Mais Urgente', 'Pergunta', 'Story'].map(type => (
                                      <button 
                                        key={type}
                                        onClick={() => handleGenerateVariation(type)}
                                        disabled={isGenerating}
                                        className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors disabled:opacity-50"
                                      >
                                          {type}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className="space-y-3">
                              {isGenerating && (
                                  <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center gap-3 animate-pulse">
                                      <Wand2 className="w-4 h-4 text-eximia-500" />
                                      <span className="text-sm text-zinc-400">A IA está criando variações...</span>
                                  </div>
                              )}
                              
                              {selectedCopy?.variations?.map((variation, idx) => (
                                  <div key={idx} className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 transition-colors flex justify-between gap-4">
                                      <p className="text-sm text-zinc-300 font-serif">{variation}</p>
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                          <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white" title="Copiar"><Copy className="w-4 h-4" /></button>
                                          <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-emerald-500" title="Usar"><Check className="w-4 h-4" /></button>
                                      </div>
                                  </div>
                              ))}
                              
                              {(!selectedCopy?.variations || selectedCopy.variations.length === 0) && !isGenerating && (
                                  <div className="text-center py-8 text-zinc-500 text-sm italic">
                                      Nenhuma variação gerada ainda. Selecione um estilo acima.
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className="pt-6 mt-6 border-t border-zinc-800 flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Fechar</Button>
                  <Button variant="primary" icon={<Save className="w-4 h-4" />}>Salvar Alterações</Button>
              </div>
          </div>
      </Modal>

      {/* --- MODAL: IMPORT SWIPE FILE --- */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Importar Swipe File"
        size="md"
      >
          <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                  <p className="text-sm text-zinc-400 mb-2">Cole suas copies abaixo (uma por linha). O sistema irá categorizar automaticamente.</p>
              </div>
              <textarea 
                  className="w-full h-64 bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-eximia-500 resize-none font-mono"
                  placeholder="Cole aqui..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>Cancelar</Button>
                  <Button variant="primary" icon={<Import className="w-4 h-4" />} onClick={handleImport}>Importar {importText.split('\n').filter(l => l.trim()).length} Itens</Button>
              </div>
          </div>
      </Modal>

      {/* --- MODAL: FRAMEWORKS --- */}
      <Modal
        isOpen={isFrameworksOpen}
        onClose={() => setIsFrameworksOpen(false)}
        title="Biblioteca de Frameworks"
        size="lg"
      >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FRAMEWORKS.map((fw, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-eximia-500/50 cursor-pointer transition-all group" onClick={() => { setIsFrameworksOpen(false); setIsDetailModalOpen(true); setSelectedCopy(null); /* Logic to pre-fill */ }}>
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-bold text-white group-hover:text-eximia-500 transition-colors">{fw.name}</h4>
                          <Badge variant="outline">{fw.usage}</Badge>
                      </div>
                      <p className="text-sm text-zinc-400">{fw.desc}</p>
                  </div>
              ))}
          </div>
      </Modal>

    </div>
  );
};
