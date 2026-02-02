
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
// Removed Modal import
import { Modal } from '../molecules/Modal';
import { SOURCE_ITEMS } from '../../constants';
import { 
  BookOpen, 
  Plus, 
  Search, 
  FileText, 
  Download, 
  MoreVertical, 
  Sparkles,
  Layers,
  ArrowRight,
  Wand2,
  CheckCircle2,
  ArrowLeft,
  PenTool,
  Save,
  Bot,
  LayoutTemplate,
  Image as ImageIcon,
  Palette,
  Settings,
  ChevronDown,
  Trash2,
  GripVertical,
  Type,
  Maximize2,
  RefreshCw,
  Library,
  Share2,
  Eye,
  Zap
} from 'lucide-react';

// --- Types ---

type ViewState = 'dashboard' | 'wizard' | 'editor';
type EbookType = 'Lead Magnet' | 'Mini Guide' | 'Deep Dive' | 'Full Book';
type EditorTab = 'structure' | 'write' | 'design' | 'cover';

interface EbookProject {
    id: string;
    title: string;
    subtitle: string;
    type: EbookType;
    status: 'draft' | 'completed';
    progress: number;
    chapters: Chapter[];
    theme: string;
    coverImage?: string;
    wordCount: number;
    updatedAt: string;
}

interface Chapter {
    id: string;
    title: string;
    content: string;
    status: 'empty' | 'draft' | 'done';
}

const MOCK_EBOOKS: EbookProject[] = [
    { 
        id: '1', 
        title: 'Guia de Validação', 
        subtitle: 'Como testar ideias sem gastar dinheiro',
        type: 'Lead Magnet', 
        status: 'draft', 
        progress: 35, 
        chapters: [
            { id: 'c1', title: 'O Problema da Suposição', content: '...', status: 'done' },
            { id: 'c2', title: 'Framework de Entrevistas', content: '', status: 'draft' }
        ],
        theme: 'Modern',
        wordCount: 1250,
        updatedAt: 'Há 2 horas'
    },
    { 
        id: '2', 
        title: 'Product Management Deep Dive', 
        subtitle: 'Do Discovery ao Delivery',
        type: 'Deep Dive', 
        status: 'completed', 
        progress: 100, 
        chapters: Array(8).fill({id:'x', title:'Chapter', content:'', status:'done'}),
        theme: 'Academic',
        wordCount: 15400,
        updatedAt: '2 dias atrás'
    },
];

// --- Mock AI Generators ---

const generateOutline = (topic: string, type: string) => {
    const outlines = [
        { title: "Introdução & Promessa", status: 'empty' },
        { title: "O Contexto Atual", status: 'empty' },
        { title: "O Framework Principal", status: 'empty' },
        { title: "Passo 1: Fundamentos", status: 'empty' },
        { title: "Passo 2: Execução", status: 'empty' },
        { title: "Estudos de Caso", status: 'empty' },
        { title: "Conclusão & Próximos Passos", status: 'empty' },
    ];
    return outlines.map((o, i) => ({ id: `new-${i}`, title: o.title, content: '', status: 'empty' as const }));
};

// --- Component ---

export const ContentEbooks: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [projects, setProjects] = useState<EbookProject[]>(MOCK_EBOOKS);
  const [activeProject, setActiveProject] = useState<EbookProject | null>(null);
  
  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({ topic: '', type: 'Lead Magnet' as EbookType, audience: '', sources: [] as string[] });
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [generatedOutline, setGeneratedOutline] = useState<Chapter[]>([]);

  // Editor State
  const [activeTab, setActiveTab] = useState<EditorTab>('structure');
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const [isWritingAI, setIsWritingAI] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // --- Handlers ---

  const handleCreateNew = () => {
      setWizardStep(1);
      setWizardData({ topic: '', type: 'Lead Magnet', audience: '', sources: [] });
      setGeneratedOutline([]);
      setView('wizard');
  };

  const handleCloseWizard = () => {
      setView('dashboard');
  };

  const handleWizardNext = () => {
      if (wizardStep === 1) setWizardStep(2);
      else if (wizardStep === 2) {
          setIsGeneratingOutline(true);
          setTimeout(() => {
              setGeneratedOutline(generateOutline(wizardData.topic, wizardData.type));
              setIsGeneratingOutline(false);
              setWizardStep(3);
          }, 1500);
      } else if (wizardStep === 3) {
          // Finalize creation
          const newProject: EbookProject = {
              id: Math.random().toString(36).substr(2, 9),
              title: wizardData.topic || 'Sem Título',
              subtitle: 'Subtítulo gerado pela IA',
              type: wizardData.type,
              status: 'draft',
              progress: 0,
              chapters: generatedOutline,
              theme: 'Modern',
              wordCount: 0,
              updatedAt: 'Agora'
          };
          setProjects([newProject, ...projects]);
          setActiveProject(newProject);
          setActiveChapterId(newProject.chapters[0].id);
          setView('editor');
      }
  };

  const handleOpenProject = (project: EbookProject) => {
      setActiveProject(project);
      setActiveChapterId(project.chapters[0]?.id || null);
      setView('editor');
  };

  const handleAIWrite = async () => {
      if (!activeProject || !activeChapterId) return;
      setIsWritingAI(true);
      
      const chapterIndex = activeProject.chapters.findIndex(c => c.id === activeChapterId);
      const currentContent = activeProject.chapters[chapterIndex].content;
      
      const newText = "\n\nEste é um parágrafo gerado pela IA que expande o conceito anteriormente apresentado. A ideia é demonstrar como o Ebook Generator pode acelerar o processo de escrita mantendo a voz da marca.";
      const chunks = newText.split('');
      
      let buildText = currentContent;
      for (let i = 0; i < chunks.length; i++) {
          await new Promise(r => setTimeout(r, 15));
          buildText += chunks[i];
          // Update local state for visualization (in a real app, optimize this)
          const updatedChapters = [...activeProject.chapters];
          updatedChapters[chapterIndex].content = buildText;
          updatedChapters[chapterIndex].status = 'draft';
          setActiveProject({ ...activeProject, chapters: updatedChapters, wordCount: activeProject.wordCount + 1 });
      }
      
      setIsWritingAI(false);
  };

  return (
    <>
      {/* --- DASHBOARD VIEW --- */}
      {view === 'dashboard' && (
        <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                Ebook Generator
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
                Transforme conhecimento em produtos digitais profissionais.
              </p>
            </div>
            <div className="flex gap-3">
                <Button variant="outline" icon={<Library className="w-4 h-4" />}>Templates</Button>
                <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={handleCreateNew}>Novo Ebook</Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {[
                  { label: 'Ebooks Criados', value: '12', color: 'text-zinc-100' },
                  { label: 'Palavras Geradas', value: '45.2k', color: 'text-emerald-500' },
                  { label: 'Downloads', value: '1.8k', color: 'text-blue-500' },
                  { label: 'Tempo Economizado', value: '120h', color: 'text-amber-500' },
              ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl">
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                      <h3 className={`text-2xl font-bold ${stat.color}`}>{stat.value}</h3>
                  </div>
              ))}
          </div>

          <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">Projetos Recentes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create Card */}
              <button 
                onClick={handleCreateNew}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50 dark:bg-[#121214] hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all group min-h-[280px]"
              >
                  <div className="w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Wand2 className="w-8 h-8 text-zinc-400 group-hover:text-eximia-500 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">Criar com IA</h3>
                  <p className="text-sm text-zinc-500 mt-2 max-w-[200px] text-center">Do zero ou a partir de fontes do Curador.</p>
              </button>

              {/* Project Cards */}
              {projects.map(project => (
                  <div 
                    key={project.id}
                    onClick={() => handleOpenProject(project)}
                    className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-eximia-500/50 transition-all cursor-pointer group flex flex-col min-h-[280px]"
                  >
                      <div className="h-32 bg-zinc-100 dark:bg-zinc-900 relative border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden">
                          {project.coverImage ? (
                              <img src={project.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          ) : (
                              <div className="text-center p-4">
                                  <h4 className="font-serif font-bold text-zinc-400 text-lg leading-tight">{project.title}</h4>
                              </div>
                          )}
                          <div className="absolute top-4 right-4">
                              <Badge variant="default" className="bg-black/50 backdrop-blur text-white border-white/10">{project.type}</Badge>
                          </div>
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-eximia-500 transition-colors">{project.title}</h3>
                          <p className="text-sm text-zinc-500 mb-6 line-clamp-2">{project.subtitle}</p>
                          
                          <div className="mt-auto">
                              <div className="flex justify-between items-end mb-2">
                                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{project.status}</span>
                                  <span className="text-xs font-mono text-zinc-400">{project.progress}%</span>
                              </div>
                              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                  <div className="bg-eximia-500 h-full transition-all" style={{ width: `${project.progress}%` }} />
                              </div>
                              <div className="flex justify-between items-center mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                      <FileText className="w-3 h-3" /> {project.wordCount} palavras
                                  </span>
                                  <span className="text-[10px] text-zinc-400">{project.updatedAt}</span>
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
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
                      {/* Wizard Content */}
                      <div className="h-1 w-full bg-zinc-900 mb-8">
                          <div className="h-full bg-eximia-500 transition-all duration-500" style={{ width: `${(wizardStep / 3) * 100}%` }} />
                      </div>

                      <div className="flex-1 flex flex-col">
                          {wizardStep === 1 && (
                              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                                  <span className="text-eximia-500 text-xs font-bold uppercase tracking-wider mb-2 block">Passo 1 de 3</span>
                                  <h2 className="text-3xl font-bold text-white mb-8">Sobre o que vamos escrever?</h2>
                                  
                                  <div className="space-y-8">
                                      <div>
                                          <label className="block text-sm font-bold text-zinc-400 mb-3">Tema ou Título Provisório</label>
                                          <input 
                                            type="text" 
                                            className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-5 py-4 text-lg text-white focus:border-eximia-500 focus:ring-1 focus:ring-eximia-500 outline-none transition-all"
                                            placeholder="Ex: Guia Definitivo de Validação de Startups..."
                                            value={wizardData.topic}
                                            onChange={e => setWizardData({...wizardData, topic: e.target.value})}
                                            autoFocus
                                          />
                                      </div>

                                      <div>
                                          <label className="block text-sm font-bold text-zinc-400 mb-3">Tipo de Material</label>
                                          <div className="grid grid-cols-2 gap-4">
                                              {['Lead Magnet', 'Mini Guide', 'Deep Dive', 'Full Book'].map(type => (
                                                  <div 
                                                    key={type}
                                                    onClick={() => setWizardData({...wizardData, type: type as EbookType})}
                                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${wizardData.type === type ? 'bg-eximia-900/20 border-eximia-500 text-white' : 'bg-[#0A0A0A] border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                                                  >
                                                      <span className="font-bold block mb-1">{type}</span>
                                                      <span className="text-xs opacity-70">
                                                          {type === 'Lead Magnet' ? '10-20 páginas • Foco em conversão' :
                                                          type === 'Mini Guide' ? '20-40 páginas • Framework específico' :
                                                          type === 'Deep Dive' ? '40-80 páginas • Material de curso' : '80+ páginas • Autoridade total'}
                                                      </span>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {wizardStep === 2 && (
                              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                                  <span className="text-eximia-500 text-xs font-bold uppercase tracking-wider mb-2 block">Passo 2 de 3</span>
                                  <h2 className="text-3xl font-bold text-white mb-8">Contexto e Fontes</h2>
                                  
                                  <div className="space-y-8">
                                      <div>
                                          <label className="block text-sm font-bold text-zinc-400 mb-3">Para quem é este livro?</label>
                                          <textarea 
                                            className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-5 py-4 text-base text-white focus:border-eximia-500 outline-none h-32 resize-none"
                                            placeholder="Descreva a persona, suas dores e o que ela espera aprender..."
                                            value={wizardData.audience}
                                            onChange={e => setWizardData({...wizardData, audience: e.target.value})}
                                          />
                                      </div>

                                      <div>
                                          <label className="block text-sm font-bold text-zinc-400 mb-3">Fontes do Curador[IA] (Opcional)</label>
                                          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto custom-scrollbar p-1">
                                              {SOURCE_ITEMS.slice(0,3).map(source => (
                                                  <div key={source.id} className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-zinc-800 rounded-lg hover:border-zinc-600 cursor-pointer">
                                                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${wizardData.sources.includes(source.id) ? 'bg-eximia-500 border-eximia-500 text-black' : 'border-zinc-600'}`}>
                                                          {wizardData.sources.includes(source.id) && <CheckCircle2 className="w-3 h-3" />}
                                                      </div>
                                                      <div className="flex-1">
                                                          <p className="text-sm font-bold text-zinc-300 truncate">{source.title}</p>
                                                          <p className="text-xs text-zinc-500">{source.metadata} • {source.insightsCount} insights</p>
                                                      </div>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {wizardStep === 3 && (
                              <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                                  <span className="text-eximia-500 text-xs font-bold uppercase tracking-wider mb-2 block">Passo 3 de 3</span>
                                  <h2 className="text-3xl font-bold text-white mb-2">Estrutura Sugerida</h2>
                                  <p className="text-zinc-400 mb-8">A IA criou este esboço baseado no seu tema. Edite ou reorganize antes de começar.</p>
                                  
                                  {isGeneratingOutline ? (
                                      <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-4">
                                          <Sparkles className="w-12 h-12 text-eximia-500 animate-spin-slow" />
                                          <p className="animate-pulse">Analisando tópico e estruturando capítulos...</p>
                                      </div>
                                  ) : (
                                      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4 space-y-2">
                                          {generatedOutline.map((chapter, idx) => (
                                              <div key={idx} className="flex items-center gap-4 p-3 bg-zinc-900 border border-zinc-800 rounded-lg group hover:border-zinc-700">
                                                  <div className="text-zinc-600 cursor-grab hover:text-zinc-300"><GripVertical className="w-4 h-4" /></div>
                                                  <span className="text-xs font-mono text-zinc-500 w-6">{(idx + 1).toString().padStart(2, '0')}</span>
                                                  <input 
                                                    className="flex-1 bg-transparent border-none text-sm text-zinc-300 focus:ring-0 p-0 font-medium"
                                                    value={chapter.title}
                                                    onChange={() => {}} // Mock edit
                                                  />
                                                  <button className="text-zinc-600 hover:text-rose-500"><Trash2 className="w-4 h-4" /></button>
                                              </div>
                                          ))}
                                          <button className="w-full py-2 border border-dashed border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-wider rounded-lg hover:text-white hover:border-zinc-600 transition-colors">
                                              + Adicionar Capítulo
                                          </button>
                                      </div>
                                  )}
                              </div>
                          )}

                          {/* Footer Navigation */}
                          <div className="flex justify-between items-center mt-8 pt-8 border-t border-zinc-800">
                              <Button variant="ghost" onClick={() => setWizardStep(Math.max(1, wizardStep - 1))} disabled={wizardStep === 1}>
                                  Voltar
                              </Button>
                              <div className="flex gap-2">
                                  {wizardStep === 3 && !isGeneratingOutline && (
                                      <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />} onClick={() => setIsGeneratingOutline(true)}>
                                          Regenerar
                                      </Button>
                                  )}
                                  <Button 
                                    variant="primary" 
                                    onClick={handleWizardNext} 
                                    disabled={!wizardData.topic || isGeneratingOutline}
                                    icon={wizardStep === 3 ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                                  >
                                      {wizardStep === 3 ? 'Criar Ebook' : 'Próximo'}
                                  </Button>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- EDITOR VIEW --- */}
      {view === 'editor' && activeProject && (
          <div className="h-screen bg-[#050505] flex flex-col font-sans overflow-hidden">
              
              {/* Top Bar */}
              <header className="h-14 border-b border-[#1F1F22] flex items-center justify-between px-4 bg-[#0A0A0A] shrink-0 z-20">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setView('dashboard')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                          <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div className="h-6 w-[1px] bg-zinc-800" />
                      <div>
                          <h2 className="text-sm font-bold text-white">{activeProject.title}</h2>
                          <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-[9px] py-0">{activeProject.type}</Badge>
                              <span className="text-[10px] text-zinc-500">{activeProject.wordCount} palavras</span>
                          </div>
                      </div>
                  </div>

                  {/* Central Tabs */}
                  <div className="flex bg-[#121214] p-1 rounded-lg border border-[#1F1F22]">
                      {[
                          { id: 'structure', label: 'Estrutura', icon: Layers },
                          { id: 'write', label: 'Escrita', icon: PenTool },
                          { id: 'design', label: 'Design', icon: Palette },
                          { id: 'cover', label: 'Capa', icon: ImageIcon },
                      ].map(tab => (
                          <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as EditorTab)}
                              className={`
                                  flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all
                                  ${activeTab === tab.id 
                                      ? 'bg-zinc-800 text-white shadow-sm' 
                                      : 'text-zinc-500 hover:text-zinc-300'}
                              `}
                          >
                              <tab.icon className="w-3.5 h-3.5" />
                              {tab.label}
                          </button>
                      ))}
                  </div>

                  <div className="flex items-center gap-3">
                      <Button variant="secondary" size="sm" icon={<Eye className="w-3.5 h-3.5" />}>Preview</Button>
                      <Button variant="primary" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={() => setIsExportModalOpen(true)}>Exportar</Button>
                  </div>
              </header>

              <div className="flex-1 flex overflow-hidden">
                  
                  {/* Sidebar: Navigation (Always visible for structure/write) */}
                  {(activeTab === 'structure' || activeTab === 'write') && (
                      <aside className="w-72 border-r border-[#1F1F22] bg-[#0A0A0A] flex flex-col shrink-0">
                          <div className="p-4 border-b border-[#1F1F22] flex justify-between items-center">
                              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Capítulos</h3>
                              <button className="text-zinc-500 hover:text-white"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-2 space-y-1">
                              {activeProject.chapters.map((chapter, idx) => (
                                  <button
                                      key={chapter.id}
                                      onClick={() => setActiveChapterId(chapter.id)}
                                      className={`
                                          w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-start gap-3 transition-colors
                                          ${activeChapterId === chapter.id ? 'bg-zinc-900 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200'}
                                      `}
                                  >
                                      <span className="text-xs font-mono text-zinc-600 mt-0.5">{(idx + 1).toString().padStart(2, '0')}</span>
                                      <span className="line-clamp-2">{chapter.title}</span>
                                      {chapter.status === 'done' && <CheckCircle2 className="w-3 h-3 text-emerald-500 ml-auto mt-1 shrink-0" />}
                                  </button>
                              ))}
                          </div>
                      </aside>
                  )}

                  {/* Main Content Area */}
                  <main className="flex-1 flex flex-col bg-[#050505] relative overflow-hidden">
                      
                      {activeTab === 'write' && activeChapterId && (
                          <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full h-full border-x border-[#1F1F22]/50 bg-[#050505] shadow-2xl">
                              {/* Writing Toolbar */}
                              <div className="h-12 border-b border-[#1F1F22] flex items-center justify-between px-4 bg-[#0A0A0A]/50 backdrop-blur-sm">
                                  <div className="flex gap-1">
                                      {['B', 'I', 'U'].map(t => (
                                          <button key={t} className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded font-serif font-bold">{t}</button>
                                      ))}
                                      <div className="w-[1px] h-4 bg-zinc-800 mx-2 self-center" />
                                      <button className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:bg-zinc-800 rounded">H1</button>
                                      <button className="px-3 py-1.5 text-xs text-zinc-500 hover:text-white hover:bg-zinc-800 rounded">H2</button>
                                  </div>
                                  <div className="text-xs text-zinc-600">Salvando...</div>
                              </div>

                              {/* Editor */}
                              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                                  <h1 className="text-4xl font-bold text-white mb-8 font-sans tracking-tight">
                                      {activeProject.chapters.find(c => c.id === activeChapterId)?.title}
                                  </h1>
                                  <textarea 
                                      className="w-full h-full bg-transparent resize-none outline-none text-lg text-zinc-300 font-serif leading-relaxed placeholder-zinc-700"
                                      placeholder="Comece a escrever..."
                                      value={activeProject.chapters.find(c => c.id === activeChapterId)?.content}
                                      onChange={() => {}} // Handled in real logic
                                  />
                              </div>

                              {/* AI Assistant Bar */}
                              <div className="p-4 border-t border-[#1F1F22] bg-[#0A0A0A]">
                                  <div className="flex gap-3">
                                      <button 
                                        onClick={handleAIWrite}
                                        disabled={isWritingAI}
                                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 py-3 rounded-xl border border-zinc-800 transition-all disabled:opacity-50"
                                      >
                                          {isWritingAI ? <Sparkles className="w-4 h-4 animate-spin text-eximia-500" /> : <Sparkles className="w-4 h-4 text-eximia-500" />}
                                          <span className="text-sm font-bold">{isWritingAI ? 'Escrevendo...' : 'Continuar com IA'}</span>
                                      </button>
                                      <button className="px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white tooltip" title="Expandir">
                                          <Maximize2 className="w-4 h-4" />
                                      </button>
                                      <button className="px-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white tooltip" title="Simplificar">
                                          <Type className="w-4 h-4" />
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}

                      {activeTab === 'design' && (
                          <div className="flex-1 p-12 overflow-y-auto">
                              <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                                  {/* Settings */}
                                  <div className="space-y-8">
                                      <div>
                                          <h3 className="text-lg font-bold text-white mb-4">Templates</h3>
                                          <div className="grid grid-cols-2 gap-4">
                                              {['Modern', 'Classic', 'Minimal', 'Bold'].map(theme => (
                                                  <div 
                                                    key={theme}
                                                    className={`aspect-[3/4] border rounded-lg p-3 cursor-pointer hover:scale-105 transition-all flex flex-col gap-2 ${activeProject.theme === theme ? 'border-eximia-500 bg-zinc-900' : 'border-zinc-800 bg-[#0A0A0A] hover:border-zinc-600'}`}
                                                  >
                                                      <div className="flex-1 bg-zinc-800/50 rounded flex flex-col gap-1 p-2">
                                                          <div className="h-2 w-2/3 bg-zinc-700 rounded mb-1" />
                                                          <div className="h-1 w-full bg-zinc-700/50 rounded" />
                                                          <div className="h-1 w-full bg-zinc-700/50 rounded" />
                                                      </div>
                                                      <span className="text-xs text-center font-bold text-zinc-400">{theme}</span>
                                                  </div>
                                              ))}
                                          </div>
                                      </div>

                                      <div>
                                          <h3 className="text-lg font-bold text-white mb-4">Estilo</h3>
                                          <div className="space-y-4">
                                              <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                                                  <span className="text-sm text-zinc-300">Tipografia</span>
                                                  <ChevronDown className="w-4 h-4 text-zinc-500" />
                                              </div>
                                              <div className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                                                  <span className="text-sm text-zinc-300">Cores (Brand)</span>
                                                  <div className="flex gap-1">
                                                      <div className="w-4 h-4 rounded-full bg-eximia-500" />
                                                      <div className="w-4 h-4 rounded-full bg-zinc-900 border border-white/20" />
                                                  </div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Preview */}
                                  <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 flex justify-center items-center shadow-inner">
                                      <div className="aspect-[1/1.414] h-full bg-white text-black shadow-2xl rounded-sm p-12 flex flex-col">
                                          <h1 className="text-4xl font-bold mb-4 font-sans tracking-tight">Capítulo 1: O Início</h1>
                                          <p className="text-lg font-serif leading-relaxed text-zinc-800">
                                              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                          </p>
                                          {/* Mock elements */}
                                          <div className="my-8 p-6 bg-zinc-100 border-l-4 border-black italic font-serif text-zinc-700">
                                              "A inovação distingue um líder de um seguidor."
                                          </div>
                                          <p className="text-lg font-serif leading-relaxed text-zinc-800">
                                              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                          </p>
                                          <div className="mt-auto flex justify-between text-xs text-zinc-400 font-sans border-t pt-4">
                                              <span>Guia de Validação</span>
                                              <span>Página 12</span>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {activeTab === 'cover' && (
                          <div className="flex-1 p-12 flex flex-col items-center justify-center">
                              <div className="flex gap-12 items-center">
                                  {/* Controls */}
                                  <div className="w-80 space-y-6">
                                      <h2 className="text-2xl font-bold text-white">Capa do Ebook</h2>
                                      <div className="space-y-4">
                                          <div>
                                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Título</label>
                                              <input type="text" value={activeProject.title} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Subtítulo</label>
                                              <input type="text" value={activeProject.subtitle} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-white" />
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Imagem de Fundo</label>
                                              <div className="grid grid-cols-3 gap-2">
                                                  <button className="aspect-square bg-zinc-800 rounded-lg border border-zinc-700 hover:border-eximia-500"></button>
                                                  <button className="aspect-square bg-gradient-to-br from-blue-900 to-black rounded-lg border border-zinc-700 hover:border-eximia-500"></button>
                                                  <button className="aspect-square flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-500 hover:text-white">
                                                      <ImageIcon className="w-5 h-5" />
                                                  </button>
                                              </div>
                                          </div>
                                          <Button className="w-full" variant="secondary" icon={<Wand2 className="w-4 h-4" />}>Gerar com IA</Button>
                                      </div>
                                  </div>

                                  {/* Preview */}
                                  <div className="relative group perspective-1000">
                                      <div className="w-[400px] aspect-[1/1.5] bg-zinc-900 rounded-r-2xl rounded-l-md shadow-2xl border-r-8 border-b-8 border-zinc-950 transform rotate-y-12 transition-transform duration-500 hover:rotate-y-0 relative overflow-hidden flex flex-col p-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                                          
                                          <div className="relative z-10 flex-1 flex flex-col justify-end">
                                              <h1 className="text-5xl font-bold text-white leading-tight mb-4 drop-shadow-lg">{activeProject.title}</h1>
                                              <p className="text-xl text-zinc-300 font-medium mb-8 drop-shadow-md">{activeProject.subtitle}</p>
                                              <div className="w-12 h-1 bg-eximia-500 mb-4"></div>
                                              <p className="text-sm font-bold text-white uppercase tracking-widest">ExímIA Ventures</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                  </main>
              </div>

              {/* Export Modal */}
              <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Exportar Ebook" size="sm">
                  <div className="space-y-6">
                      <div className="space-y-4">
                          {['PDF (Impressão)', 'EPUB (E-readers)', 'MOBI (Kindle)', 'Web (HTML)'].map((fmt, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-600 transition-colors">
                                  <div className="flex items-center gap-3">
                                      <div className="p-2 bg-zinc-800 rounded text-zinc-400">
                                          {i === 0 ? <FileText className="w-5 h-5" /> : i === 3 ? <Share2 className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                                      </div>
                                      <span className="font-bold text-white">{fmt}</span>
                                  </div>
                                  <input type="radio" name="format" className="accent-eximia-500" defaultChecked={i === 0} />
                              </div>
                          ))}
                      </div>
                      <div className="flex justify-end gap-3 pt-2">
                          <Button variant="secondary" onClick={() => setIsExportModalOpen(false)}>Cancelar</Button>
                          <Button variant="primary" icon={<Download className="w-4 h-4" />}>Exportar Agora</Button>
                      </div>
                  </div>
              </Modal>
          </div>
      )}
    </>
  );
};
