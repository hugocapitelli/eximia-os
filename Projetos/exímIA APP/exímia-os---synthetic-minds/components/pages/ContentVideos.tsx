import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { SearchBar } from '../molecules/SearchBar';
import { Modal } from '../molecules/Modal';
import { 
  Video, 
  Plus, 
  Youtube, 
  Smartphone, 
  Clock, 
  FileText, 
  MoreHorizontal, 
  Play, 
  Film, 
  Sparkles, 
  Timer, 
  Download, 
  Copy,
  ArrowLeft,
  Check,
  Target,
  Users,
  Wand2,
  Mic,
  Monitor,
  Save,
  Maximize2,
  RefreshCw,
  Settings,
  ChevronDown,
  Layout,
  AlertTriangle,
  BarChart2,
  Image as ImageIcon,
  Share2,
  Grid,
  List,
  Eye,
  X
} from 'lucide-react';

// --- Types ---

type ViewState = 'dashboard' | 'wizard' | 'editor' | 'teleprompter';
type VideoFormat = 'youtube_long' | 'youtube_short' | 'reels' | 'vsl' | 'webinar' | 'linkedin';
type ScriptStatus = 'draft' | 'ready' | 'recorded' | 'published';

interface VideoScript {
    id: string;
    title: string;
    format: VideoFormat;
    duration: string;
    status: ScriptStatus;
    updatedAt: string;
    content: string;
}

interface WizardData {
    format: VideoFormat;
    topic: string;
    objective: string;
    tone: string;
    structure: string;
}

// --- Mock Data ---

const MOCK_SCRIPTS: VideoScript[] = [
    { 
        id: '1', 
        title: '5 Erros de Empreendedores Iniciantes', 
        format: 'youtube_long', 
        duration: '12:30', 
        status: 'recorded', 
        updatedAt: 'Há 2 dias',
        content: ''
    },
    { 
        id: '2', 
        title: 'Hook de Produtividade #1', 
        format: 'reels', 
        duration: '00:45', 
        status: 'draft', 
        updatedAt: 'Há 1 semana',
        content: ''
    },
    { 
        id: '3', 
        title: 'VSL: Método ExímIA', 
        format: 'vsl', 
        duration: '25:00', 
        status: 'ready', 
        updatedAt: 'Ontem',
        content: ''
    },
];

const FORMATS = [
    { id: 'youtube_long', label: 'YouTube Long', icon: Youtube, desc: '8-30 min • 16:9', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'reels', label: 'Reels / Shorts', icon: Smartphone, desc: '15-60s • 9:16', color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
    { id: 'linkedin', label: 'LinkedIn Video', icon: Monitor, desc: '1-3 min • 1:1', color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'vsl', label: 'VSL (Vendas)', icon: Film, desc: '15-45 min • 16:9', color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { id: 'webinar', label: 'Webinar', icon: Users, desc: '45-90 min • 16:9', color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

const HOOK_TEMPLATES = [
    "Você sabia que 90% das startups falham? E que a maioria falha pelo MESMO motivo?",
    "Eu perdi R$50k cometendo esse erro, e hoje vou te ensinar como evitar.",
    "Pare de fazer [X]. É isso que está matando seu crescimento.",
    "O segredo que ninguém te conta sobre [Tópico].",
];

// --- Components ---

export const ContentVideos: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [scripts, setScripts] = useState<VideoScript[]>(MOCK_SCRIPTS);
  const [activeScript, setActiveScript] = useState<VideoScript | null>(null);
  
  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
      format: 'youtube_long',
      topic: '',
      objective: 'educate',
      tone: 'Conversacional',
      structure: 'listicle'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Editor State
  const [editorContent, setEditorContent] = useState('');
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true);
  const [selectedHook, setSelectedHook] = useState(0);

  // Teleprompter State
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(1);
  const [teleprompterFontSize, setTeleprompterFontSize] = useState(48);
  const [isPlaying, setIsPlaying] = useState(false);
  const teleprompterRef = useRef<HTMLDivElement>(null);

  // --- Handlers ---

  const handleStartWizard = () => {
      setWizardStep(1);
      setWizardData({ format: 'youtube_long', topic: '', objective: 'educate', tone: 'Conversacional', structure: 'listicle' });
      setView('wizard');
  };

  const handleCloseWizard = () => {
      setView('dashboard');
  };

  const handleWizardNext = () => {
      if (wizardStep < 3) {
          setWizardStep(wizardStep + 1);
      } else {
          generateScript();
      }
  };

  const generateScript = () => {
      setIsGenerating(true);
      setTimeout(() => {
          const newScript: VideoScript = {
              id: Math.random().toString(36).substr(2, 9),
              title: wizardData.topic || 'Novo Roteiro',
              format: wizardData.format,
              duration: 'Estimando...',
              status: 'draft',
              updatedAt: 'Agora',
              content: `## [00:00-00:05] HOOK
[ON CAMERA - close up, expressão séria]

"${HOOK_TEMPLATES[0]}"

[TEXT ON SCREEN: "90%"]

[PAUSE - 1 segundo]

"E que a maioria falha pelo **MESMO** motivo?"

[TRANSITION: zoom out]

---

## [00:05-00:45] INTRO

[ON CAMERA - médio, energia mais leve]

"E aí, pessoal! Eu sou o Hugo, e hoje eu vou te mostrar os 5 erros que quase destruíram meu negócio."

[B-ROLL: fotos antigas da empresa/escritório]

"Há 3 anos, eu estava cometendo TODOS esses erros sem nem perceber. Foi só quando..."

---

## [00:45-02:30] ERRO #1: A FALÁCIA DA CONSTRUÇÃO

[ON CAMERA]

O primeiro erro é construir antes de vender.
`
          };
          setScripts([newScript, ...scripts]);
          setActiveScript(newScript);
          setEditorContent(newScript.content);
          setIsGenerating(false);
          setView('editor');
      }, 2000);
  };

  const handleOpenScript = (script: VideoScript) => {
      setActiveScript(script);
      setEditorContent(script.content || `Roteiro para: ${script.title}`);
      setView('editor');
  };

  // Teleprompter Logic
  useEffect(() => {
      let interval: ReturnType<typeof setInterval>;
      if (isPlaying && view === 'teleprompter' && teleprompterRef.current) {
          interval = setInterval(() => {
              if (teleprompterRef.current) {
                  teleprompterRef.current.scrollTop += teleprompterSpeed;
              }
          }, 20);
      }
      return () => clearInterval(interval);
  }, [isPlaying, view, teleprompterSpeed]);

  const getFormatDetails = (id: string) => FORMATS.find(f => f.id === id) || FORMATS[0];

  // --- MAIN RENDER ---
  return (
    <>
      {/* --- DASHBOARD VIEW --- */}
      {view === 'dashboard' && (
        <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                Vídeo Scripts
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
                Roteiros otimizados para retenção e conversão.
              </p>
            </div>
            <div className="flex gap-3">
                 <SearchBar />
                 <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleStartWizard}>Novo Roteiro</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {[
                  { label: 'Scripts Totais', value: '24', icon: FileText, color: 'text-zinc-400' },
                  { label: 'Gravados', value: '12', icon: Video, color: 'text-emerald-500' },
                  { label: 'Em Produção', value: '5', icon: Clock, color: 'text-amber-500' },
                  { label: 'Taxa de Retenção', value: '68%', icon: BarChart2, color: 'text-blue-500' },
              ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl flex items-center justify-between">
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

          {/* Recent Scripts */}
          <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Scripts Recentes</h3>
              {scripts.map(script => {
                  const fmt = getFormatDetails(script.format);
                  return (
                      <div key={script.id} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-eximia-500/30 transition-all group flex items-center justify-between cursor-pointer" onClick={() => handleOpenScript(script)}>
                          <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border ${fmt.bg} ${fmt.border} ${fmt.color}`}>
                                  <fmt.icon className="w-6 h-6" />
                              </div>
                              <div>
                                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-eximia-500 transition-colors">{script.title}</h3>
                                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded border border-zinc-200 dark:border-zinc-800">
                                          {fmt.label}
                                      </span>
                                      <span className="flex items-center gap-1.5">
                                          <Timer className="w-3.5 h-3.5" /> {script.duration}
                                      </span>
                                      <span>Editado {script.updatedAt}</span>
                                  </div>
                              </div>
                          </div>

                          <div className="flex items-center gap-6">
                              <Badge variant={script.status === 'recorded' ? 'success' : script.status === 'ready' ? 'primary' : 'default'} className="uppercase">
                                  {script.status}
                              </Badge>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Teleprompter">
                                      <Monitor className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors">
                                      <MoreHorizontal className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>
        </div>
      )}

      {/* --- WIZARD VIEW (FULL SCREEN) --- */}
      {view === 'wizard' && (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-8 bg-[#050505]">
              <div className="w-full max-w-2xl">
                  <button onClick={handleCloseWizard} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Cancelar
                  </button>
                  
                  <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                      {/* Wizard Progress */}
                      <div className="h-1 w-full bg-zinc-900 mb-8">
                          <div className="h-full bg-eximia-500 transition-all duration-500" style={{ width: `${(wizardStep / 3) * 100}%` }} />
                      </div>

                      <div className="flex-1 flex flex-col">
                          {wizardStep === 1 && (
                              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                                  <span className="text-eximia-500 text-xs font-bold uppercase tracking-wider mb-2 block">Passo 1 de 3</span>
                                  <h2 className="text-3xl font-bold text-white mb-8">Escolha o Formato</h2>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {FORMATS.map(fmt => (
                                          <div 
                                            key={fmt.id}
                                            onClick={() => setWizardData({...wizardData, format: fmt.id as VideoFormat})}
                                            className={`
                                                p-6 rounded-xl border cursor-pointer transition-all flex flex-col items-center text-center gap-4 group
                                                ${wizardData.format === fmt.id 
                                                    ? `bg-zinc-900 border-eximia-500 ring-1 ring-eximia-500` 
                                                    : 'bg-[#0A0A0A] border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900'}
                                            `}
                                          >
                                              <div className={`p-3 rounded-full ${wizardData.format === fmt.id ? fmt.bg : 'bg-zinc-900 group-hover:bg-zinc-800'} ${fmt.color}`}>
                                                  <fmt.icon className="w-6 h-6" />
                                              </div>
                                              <div>
                                                  <h3 className="font-bold text-white mb-1">{fmt.label}</h3>
                                                  <p className="text-xs text-zinc-500">{fmt.desc}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {wizardStep === 2 && (
                              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                                  <span className="text-eximia-500 text-xs font-bold uppercase tracking-wider mb-2 block">Passo 2 de 3</span>
                                  <h2 className="text-3xl font-bold text-white mb-8">Sobre o Vídeo</h2>
                                  
                                  <div className="space-y-6 max-w-2xl">
                                      <div>
                                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tema Principal</label>
                                          <input 
                                              type="text" 
                                              className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eximia-500 transition-colors"
                                              placeholder="Ex: Como validar uma ideia sem gastar dinheiro..."
                                              value={wizardData.topic}
                                              onChange={(e) => setWizardData({...wizardData, topic: e.target.value})}
                                              autoFocus
                                          />
                                      </div>

                                      <div className="grid grid-cols-2 gap-6">
                                          <div>
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Objetivo</label>
                                              <select 
                                                  className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eximia-500 transition-colors appearance-none"
                                                  value={wizardData.objective}
                                                  onChange={(e) => setWizardData({...wizardData, objective: e.target.value})}
                                              >
                                                  <option value="educate">Educar / Ensinar</option>
                                                  <option value="entertain">Entreter</option>
                                                  <option value="sell">Vender / Converter</option>
                                                  <option value="authority">Gerar Autoridade</option>
                                              </select>
                                          </div>
                                          <div>
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tom</label>
                                              <select 
                                                  className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eximia-500 transition-colors appearance-none"
                                                  value={wizardData.tone}
                                                  onChange={(e) => setWizardData({...wizardData, tone: e.target.value})}
                                              >
                                                  <option>Conversacional</option>
                                                  <option>Alta Energia</option>
                                                  <option>Profissional</option>
                                                  <option>Polêmico</option>
                                              </select>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {wizardStep === 3 && (
                              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                                  <span className="text-eximia-500 text-xs font-bold uppercase tracking-wider mb-2 block">Passo 3 de 3</span>
                                  <h2 className="text-3xl font-bold text-white mb-8">Estrutura Narrativa</h2>
                                  
                                  <div className="space-y-4 max-w-2xl">
                                      {[
                                          { id: 'listicle', label: 'Listicle (Lista)', desc: 'X Passos, X Erros, X Dicas. Ótimo para retenção.' },
                                          { id: 'how_to', label: 'How-to (Passo a Passo)', desc: 'Tutorial prático de como fazer algo.' },
                                          { id: 'story', label: 'Story-based (Jornada)', desc: 'Narrativa pessoal com lição aprendida.' },
                                          { id: 'problem_solution', label: 'Problema / Solução', desc: 'Identifica dor e apresenta o remédio.' },
                                      ].map(struct => (
                                          <div 
                                            key={struct.id}
                                            onClick={() => setWizardData({...wizardData, structure: struct.id})}
                                            className={`
                                                flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                                                ${wizardData.structure === struct.id 
                                                    ? 'bg-zinc-900 border-eximia-500 ring-1 ring-eximia-500' 
                                                    : 'bg-[#0A0A0A] border-zinc-800 hover:border-zinc-600'}
                                            `}
                                          >
                                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${wizardData.structure === struct.id ? 'border-eximia-500' : 'border-zinc-600'}`}>
                                                  {wizardData.structure === struct.id && <div className="w-2.5 h-2.5 bg-eximia-500 rounded-full" />}
                                              </div>
                                              <div>
                                                  <h4 className="text-sm font-bold text-white">{struct.label}</h4>
                                                  <p className="text-xs text-zinc-500">{struct.desc}</p>
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {/* Navigation */}
                          <div className="flex justify-between items-center mt-12 pt-8 border-t border-zinc-800">
                              <Button variant="ghost" onClick={() => setWizardStep(Math.max(1, wizardStep - 1))} disabled={wizardStep === 1}>
                                  Voltar
                              </Button>
                              <Button 
                                variant="primary" 
                                onClick={handleWizardNext} 
                                disabled={isGenerating || (wizardStep === 2 && !wizardData.topic)}
                                icon={isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                              >
                                  {isGenerating ? 'Escrevendo Roteiro...' : wizardStep === 3 ? 'Gerar Roteiro' : 'Próximo'}
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- EDITOR VIEW --- */}
      {view === 'editor' && (
          <div className="h-screen bg-[#050505] flex flex-col font-sans overflow-hidden">
              {/* Header */}
              <div className="h-16 border-b border-[#1F1F22] flex items-center justify-between px-6 bg-[#0A0A0A] shrink-0 z-20">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setView('dashboard')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                          <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="h-6 w-[1px] bg-zinc-800" />
                      <div>
                          <h2 className="font-bold text-white text-sm">{activeScript?.title}</h2>
                          <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[9px] py-0">{getFormatDetails(activeScript?.format || 'youtube_long').label}</Badge>
                              <span className="text-[10px] text-zinc-500">Rascunho salvo</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <button onClick={() => setAiSidebarOpen(!aiSidebarOpen)} className={`p-2 rounded-lg transition-colors ${aiSidebarOpen ? 'bg-eximia-500/10 text-eximia-500' : 'text-zinc-500 hover:text-white'}`}>
                          <Layout className="w-5 h-5" />
                      </button>
                      <Button variant="secondary" icon={<Monitor className="w-4 h-4" />} onClick={() => setView('teleprompter')}>Teleprompter</Button>
                      <Button variant="primary" icon={<Download className="w-4 h-4" />}>Exportar</Button>
                  </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                  {/* Main Editor */}
                  <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full h-full border-x border-[#1F1F22]/50 bg-[#050505]">
                      {/* Toolbar */}
                      <div className="h-10 border-b border-[#1F1F22] bg-[#0A0A0A] flex items-center px-4 gap-2">
                          {['B', 'I', 'U'].map(t => (
                              <button key={t} className="w-6 h-6 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded text-xs font-serif font-bold">{t}</button>
                          ))}
                          <div className="w-[1px] h-4 bg-zinc-800 mx-2" />
                          <button className="text-xs text-zinc-500 hover:text-white px-2 py-1 hover:bg-zinc-800 rounded">Hook</button>
                          <button className="text-xs text-zinc-500 hover:text-white px-2 py-1 hover:bg-zinc-800 rounded">Intro</button>
                          <button className="text-xs text-zinc-500 hover:text-white px-2 py-1 hover:bg-zinc-800 rounded">CTA</button>
                      </div>
                      
                      <textarea 
                          value={editorContent}
                          onChange={(e) => setEditorContent(e.target.value)}
                          className="flex-1 w-full bg-transparent p-8 text-lg text-zinc-300 font-serif leading-relaxed focus:outline-none resize-none custom-scrollbar whitespace-pre-wrap"
                          placeholder="Comece seu roteiro..."
                      />
                  </div>

                  {/* Right Sidebar: AI Tools */}
                  {aiSidebarOpen && (
                      <div className="w-80 border-l border-[#1F1F22] bg-[#0A0A0A] flex flex-col shrink-0">
                          <div className="p-4 border-b border-[#1F1F22]">
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-eximia-500" /> Studio AI
                              </h3>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
                              {/* Retention Analysis */}
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center">
                                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Score de Retenção</h4>
                                      <span className="text-emerald-500 font-bold text-sm">78%</span>
                                  </div>
                                  <div className="space-y-2">
                                      {[
                                          { label: 'Hook (0-5s)', score: 95, color: 'bg-emerald-500' },
                                          { label: 'Intro (5-45s)', score: 82, color: 'bg-emerald-500' },
                                          { label: 'Corpo', score: 65, color: 'bg-amber-500' },
                                          { label: 'CTA Final', score: 85, color: 'bg-emerald-500' },
                                      ].map((item, idx) => (
                                          <div key={idx} className="group cursor-default">
                                              <div className="flex justify-between text-[10px] text-zinc-400 mb-1">
                                                  <span>{item.label}</span>
                                                  <span>{item.score}%</span>
                                              </div>
                                              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                                                  <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.score}%` }} />
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                      <div className="flex items-center gap-2 mb-1 text-amber-500 text-xs font-bold">
                                          <AlertTriangle className="w-3 h-3" /> Sugestão
                                      </div>
                                      <p className="text-xs text-zinc-400">O corpo do vídeo está longo. Considere adicionar um "Pattern Interrupt" ou B-Roll aos 2:30.</p>
                                  </div>
                              </div>

                              {/* Hook Variations */}
                              <div>
                                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Variações de Hook</h4>
                                  <div className="space-y-2">
                                      {HOOK_TEMPLATES.map((hook, i) => (
                                          <div 
                                            key={i} 
                                            className={`p-3 rounded-lg border cursor-pointer text-xs leading-relaxed transition-all ${selectedHook === i ? 'bg-zinc-800 border-eximia-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
                                            onClick={() => setSelectedHook(i)}
                                          >
                                              "{hook}"
                                          </div>
                                      ))}
                                      <button className="w-full py-2 border border-dashed border-zinc-800 rounded-lg text-zinc-500 text-xs hover:text-white hover:border-zinc-600 flex items-center justify-center gap-2">
                                          <RefreshCw className="w-3 h-3" /> Gerar Mais
                                      </button>
                                  </div>
                              </div>

                              {/* B-Roll Suggestions */}
                              <div>
                                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Sugestões de B-Roll</h4>
                                  <div className="space-y-2">
                                      {[
                                          { time: '00:15', desc: 'Gráfico de falência de startups (Stock)', icon: BarChart2 },
                                          { time: '00:40', desc: 'Pessoa frustrada no escritório (Stock)', icon: Users },
                                          { time: '01:20', desc: 'Screen recording da ferramenta', icon: Monitor },
                                      ].map((broll, i) => (
                                          <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors">
                                              <span className="text-[10px] font-mono text-zinc-500">{broll.time}</span>
                                              <broll.icon className="w-3 h-3 shrink-0" />
                                              <span className="text-xs truncate">{broll.desc}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* --- TELEPROMPTER VIEW --- */}
      {view === 'teleprompter' && (
          <div className="fixed inset-0 z-50 bg-black text-white flex flex-col font-sans">
              {/* Teleprompter Header */}
              <div className="h-16 flex items-center justify-between px-8 bg-zinc-900 border-b border-zinc-800 shrink-0">
                  <button onClick={() => setView('editor')} className="text-zinc-400 hover:text-white flex items-center gap-2">
                      <ArrowLeft className="w-5 h-5" /> Sair
                  </button>
                  
                  <div className="flex items-center gap-8">
                      {/* Controls */}
                      <div className="flex items-center gap-4 bg-black rounded-full px-4 py-2 border border-zinc-800">
                          <button onClick={() => setTeleprompterFontSize(s => Math.max(20, s - 4))} className="text-zinc-400 hover:text-white text-xs font-bold">A-</button>
                          <span className="text-xs text-zinc-500 w-8 text-center">{teleprompterFontSize}px</span>
                          <button onClick={() => setTeleprompterFontSize(s => Math.min(100, s + 4))} className="text-zinc-400 hover:text-white text-sm font-bold">A+</button>
                      </div>

                      <div className="flex items-center gap-4 bg-black rounded-full px-4 py-2 border border-zinc-800">
                          <span className="text-xs text-zinc-500 uppercase font-bold">Speed</span>
                          <input 
                              type="range" 
                              min="0.5" 
                              max="5" 
                              step="0.5" 
                              value={teleprompterSpeed} 
                              onChange={(e) => setTeleprompterSpeed(parseFloat(e.target.value))}
                              className="w-24 accent-eximia-500"
                          />
                          <span className="text-xs text-white w-6 text-center">{teleprompterSpeed}x</span>
                      </div>
                  </div>

                  <Button 
                    variant={isPlaying ? 'secondary' : 'primary'} 
                    onClick={() => setIsPlaying(!isPlaying)}
                    icon={isPlaying ? <X className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  >
                      {isPlaying ? 'Pausar' : 'Iniciar'}
                  </Button>
              </div>

              {/* Scrolling Area */}
              <div className="flex-1 relative overflow-hidden flex justify-center">
                  {/* Focus Marker */}
                  <div className="absolute top-[40%] left-0 right-0 h-24 border-y-2 border-eximia-500/30 bg-eximia-500/5 z-10 pointer-events-none" />
                  
                  {/* Mirrored Text Option could go here */}
                  <div 
                    ref={teleprompterRef}
                    className="w-full max-w-4xl px-8 overflow-y-auto hide-scrollbar pb-[50vh] pt-[40vh] text-center"
                    style={{ scrollBehavior: 'auto' }} // Smooth scrolling handled by JS interval
                  >
                      <div 
                        className="font-sans font-bold leading-relaxed text-zinc-100 transition-all duration-300"
                        style={{ fontSize: `${teleprompterFontSize}px` }}
                      >
                          {editorContent.split('\n').map((line, i) => {
                              // Filter out markdown/production notes for clean reading
                              if (line.trim().startsWith('[') || line.trim().startsWith('##')) return null;
                              if (!line.trim()) return <br key={i} />;
                              return <p key={i} className="mb-8">{line.replace(/\*\*/g, '')}</p>;
                          })}
                      </div>
                  </div>
              </div>
          </div>
      )}
    </>
  );
};