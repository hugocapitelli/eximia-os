
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Modal } from '../molecules/Modal';
import { 
  Plus, 
  Mail, 
  Users, 
  MousePointer2, 
  MoreHorizontal, 
  Send, 
  Clock, 
  FileEdit,
  GitMerge,
  Sparkles,
  ArrowRight,
  Eye,
  Zap,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Wand2,
  PlayCircle,
  PauseCircle,
  BarChart2,
  ArrowLeft,
  Search,
  Settings,
  ThumbsUp,
  LayoutTemplate,
  Globe
} from 'lucide-react';

// --- Types ---

type ViewState = 'dashboard' | 'wizard' | 'editor-broadcast' | 'editor-sequence';
type EmailType = 'Newsletter' | 'Announcement' | 'Promotional' | 'Educational';
type SequenceType = 'Welcome' | 'Nurture' | 'Launch' | 'Onboarding';

interface Newsletter {
    id: string;
    subject: string;
    type: EmailType;
    status: 'draft' | 'scheduled' | 'sent';
    sentAt?: string;
    metrics?: { opens: string; clicks: string; unsub: string };
    updatedAt: string;
}

interface Sequence {
    id: string;
    name: string;
    type: SequenceType;
    status: 'active' | 'paused' | 'draft';
    emailsCount: number;
    activeLeads: number;
    completionRate: string;
}

interface WizardData {
    mode: 'broadcast' | 'sequence';
    channel: 'email' | 'website';
    topic: string;
    targetAudience: string;
    goal: string;
    tone: string;
}

// --- Mock Data ---

const MOCK_NEWSLETTERS: Newsletter[] = [
    { id: '1', subject: '5 lições que aprendi validando minha startup', type: 'Newsletter', status: 'sent', sentAt: '25 Jan, 09:00', metrics: { opens: '48.2%', clicks: '15.3%', unsub: '0.1%' }, updatedAt: '25 Jan' },
    { id: '2', subject: 'O framework que uso para tomar decisões difíceis', type: 'Educational', status: 'scheduled', sentAt: '28 Jan, 09:00', updatedAt: 'Hoje' },
    { id: '3', subject: 'Últimas horas: Vagas para a Mentoria', type: 'Promotional', status: 'draft', updatedAt: '2 horas atrás' },
];

const MOCK_SEQUENCES: Sequence[] = [
    { id: 's1', name: 'Welcome Sequence (Lead Magnet)', type: 'Welcome', status: 'active', emailsCount: 5, activeLeads: 234, completionRate: '52%' },
    { id: 's2', name: 'Nurture - Validação de Ideias', type: 'Nurture', status: 'paused', emailsCount: 7, activeLeads: 89, completionRate: '34%' },
];

const SEQUENCE_TEMPLATES = [
    { id: 'welcome', name: 'Welcome Sequence', emails: 5, desc: 'Apresentar, entregar valor e oferta suave.' },
    { id: 'launch', name: 'Product Launch', emails: 7, desc: 'Antecipação, abertura e urgência.' },
    { id: 'nurture', name: 'Long Term Nurture', emails: 12, desc: 'Educação contínua e autoridade.' },
];

// --- Sub-Components ---

const SequenceNode: React.FC<{ 
    step: number; 
    type: 'email' | 'delay' | 'trigger'; 
    title: string; 
    details: string; 
    isLast?: boolean;
    metrics?: { opens: string; clicks: string };
}> = ({ step, type, title, details, isLast, metrics }) => (
    <div className="relative pl-12 pb-10 group">
        {/* Connecting Line */}
        {!isLast && <div className="absolute left-[22px] top-10 bottom-0 w-0.5 bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />}
        
        {/* Node Icon */}
        <div className={`
            absolute left-0 top-0 w-12 h-12 rounded-full border-[6px] border-[#050505] flex items-center justify-center z-10 shadow-sm
            ${type === 'trigger' 
                ? 'bg-emerald-500 text-black' 
                : type === 'delay' 
                    ? 'bg-zinc-800 text-zinc-400' 
                    : 'bg-zinc-900 border-zinc-700 text-white'}
        `}>
            {type === 'trigger' ? <Zap className="w-5 h-5 fill-current" /> : type === 'delay' ? <Clock className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
        </div>
        
        {/* Node Card */}
        <div className={`
            rounded-xl border p-5 transition-all cursor-pointer relative shadow-sm
            ${type === 'trigger' 
                ? 'bg-[#061810] border-emerald-900/50 hover:border-emerald-500/30' 
                : type === 'delay'
                    ? 'bg-[#09090B] border-zinc-800 border-dashed hover:border-zinc-700'
                    : 'bg-[#121214] border-zinc-800 hover:border-zinc-600 hover:shadow-md hover:-translate-y-0.5'}
        `}>
            {type === 'email' && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"><FileEdit className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
            )}

            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${type === 'trigger' ? 'text-emerald-500' : 'text-zinc-500'}`}>
                    {type === 'email' ? `Email #${step}` : type.toUpperCase()}
                </span>
                {metrics && (
                    <div className="flex gap-4 text-[10px] font-mono text-zinc-400 bg-black/30 px-2 py-1 rounded">
                        <span>Open: <span className="text-white font-bold">{metrics.opens}</span></span>
                        <span>Click: <span className="text-white font-bold">{metrics.clicks}</span></span>
                    </div>
                )}
            </div>
            
            <h4 className={`text-base font-bold ${type === 'delay' ? 'text-zinc-400' : 'text-zinc-200'}`}>{title}</h4>
            <p className="text-xs text-zinc-500 mt-1">{details}</p>
        </div>
    </div>
);

// --- Main Component ---

export const ContentNewsletter: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [activeTab, setActiveTab] = useState<'broadcasts' | 'sequences'>('broadcasts');
  
  // Wizard State
  const [wizardData, setWizardData] = useState<WizardData>({
      mode: 'broadcast',
      channel: 'email',
      topic: '',
      targetAudience: '',
      goal: '',
      tone: 'Conversacional'
  });

  // Editor State
  const [subjectLine, setSubjectLine] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSubjects, setGeneratedSubjects] = useState<string[]>([]);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true);

  // --- Handlers ---

  const handleStartCreation = (mode: 'broadcast' | 'sequence') => {
      setWizardData({ ...wizardData, mode });
      setView('wizard');
  };

  const handleWizardSubmit = () => {
      if (wizardData.mode === 'broadcast') {
          // Simulate AI draft generation
          setIsGenerating(true);
          setView('editor-broadcast');
          setTimeout(() => {
              setSubjectLine(`Como ${wizardData.topic} pode mudar seu jogo`);
              setEmailBody(`Olá {first_name},\n\nNa semana passada, eu estava pensando sobre ${wizardData.topic} e percebi algo interessante...\n\n[O draft seria gerado aqui baseado no objetivo: ${wizardData.goal}]`);
              setIsGenerating(false);
          }, 1500);
      } else {
          setView('editor-sequence');
      }
  };

  const generateSubjects = () => {
      setIsGenerating(true);
      setTimeout(() => {
          setGeneratedSubjects([
              `O erro que cometi com ${wizardData.topic}`,
              `3 segredos sobre ${wizardData.topic} (que ninguém conta)`,
              `Você está ignorando ${wizardData.topic}?`,
              `Alerta: Mudança importante sobre ${wizardData.topic}`
          ]);
          setIsGenerating(false);
      }, 1000);
  };

  // --- DASHBOARD VIEW ---
  if (view === 'dashboard') {
      return (
        <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
                Newsletter Builder
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
                Engaje sua audiência com emails que convertem.
              </p>
            </div>
            <div className="flex gap-3 items-center">
                 <Button variant="outline" icon={<GitMerge className="w-4 h-4" />} onClick={() => handleStartCreation('sequence')}>Nova Sequência</Button>
                 <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => handleStartCreation('broadcast')}>Nova Newsletter</Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {[
                  { label: 'Inscritos Ativos', value: '2.4K', icon: Users, color: 'text-blue-500', trend: '+123' },
                  { label: 'Avg. Open Rate', value: '42.3%', icon: Eye, color: 'text-emerald-500', trend: '+3.2%' },
                  { label: 'Avg. Click Rate', value: '12.1%', icon: MousePointer2, color: 'text-purple-500', trend: '+1.5%' },
                  { label: 'Unsubscribe Rate', value: '0.3%', icon: AlertTriangle, color: 'text-amber-500', trend: '-0.1%' },
              ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex items-center justify-between">
                      <div>
                          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                          <div className="flex items-baseline gap-2">
                              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</h3>
                              <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{stat.trend}</span>
                          </div>
                      </div>
                      <div className={`p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg ${stat.color} bg-opacity-10`}>
                          <stat.icon className="w-5 h-5" />
                      </div>
                  </div>
              ))}
          </div>

          {/* Main Content Area */}
          <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden min-h-[500px] flex flex-col">
              {/* Tabs */}
              <div className="flex border-b border-zinc-200 dark:border-zinc-800">
                  <button 
                    onClick={() => setActiveTab('broadcasts')}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'broadcasts' ? 'border-eximia-500 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                  >
                      Broadcasts
                  </button>
                  <button 
                    onClick={() => setActiveTab('sequences')}
                    className={`px-8 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === 'sequences' ? 'border-eximia-500 text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900/50' : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                  >
                      Sequências
                  </button>
              </div>

              {/* List Content */}
              <div className="flex-1 p-6">
                  {activeTab === 'broadcasts' ? (
                      <div className="space-y-4">
                          {MOCK_NEWSLETTERS.map(newsletter => (
                              <div key={newsletter.id} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-eximia-500/30 transition-all group">
                                  <div className="flex items-center gap-4">
                                      <div className={`p-3 rounded-lg ${newsletter.status === 'sent' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}`}>
                                          {newsletter.status === 'sent' ? <Send className="w-5 h-5" /> : <FileEdit className="w-5 h-5" />}
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-eximia-600 dark:group-hover:text-eximia-400 transition-colors">{newsletter.subject}</h4>
                                          <div className="flex items-center gap-3 mt-1">
                                              <Badge variant={newsletter.status === 'sent' ? 'success' : newsletter.status === 'scheduled' ? 'primary' : 'default'}>
                                                  {newsletter.status}
                                              </Badge>
                                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                                  <Clock className="w-3 h-3" /> {newsletter.sentAt || 'Rascunho'}
                                              </span>
                                              <span className="text-xs text-zinc-500">• {newsletter.type}</span>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  {newsletter.status === 'sent' && newsletter.metrics ? (
                                      <div className="flex gap-6 text-right">
                                          <div>
                                              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Open Rate</p>
                                              <p className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">{newsletter.metrics.opens}</p>
                                          </div>
                                          <div>
                                              <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Click Rate</p>
                                              <p className="font-mono text-sm font-bold text-zinc-900 dark:text-zinc-100">{newsletter.metrics.clicks}</p>
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button size="sm" variant="secondary">Editar</Button>
                                          <button className="p-2 text-zinc-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                      </div>
                                  )}
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {MOCK_SEQUENCES.map(sequence => (
                              <div key={sequence.id} className="bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 hover:border-eximia-500/30 transition-all group cursor-pointer relative overflow-hidden">
                                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                      <GitMerge className="w-24 h-24 text-eximia-500" />
                                  </div>
                                  <div className="relative z-10">
                                      <div className="flex justify-between items-start mb-4">
                                          <Badge variant="outline">{sequence.type}</Badge>
                                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase ${sequence.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-500' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500'}`}>
                                              {sequence.status === 'active' ? <PlayCircle className="w-3 h-3" /> : <PauseCircle className="w-3 h-3" />}
                                              {sequence.status}
                                          </div>
                                      </div>
                                      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6">{sequence.name}</h3>
                                      <div className="grid grid-cols-3 gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
                                          <div>
                                              <p className="text-[10px] text-zinc-500 uppercase font-bold">Emails</p>
                                              <p className="font-mono text-zinc-900 dark:text-zinc-100">{sequence.emailsCount}</p>
                                          </div>
                                          <div>
                                              <p className="text-[10px] text-zinc-500 uppercase font-bold">Leads Ativos</p>
                                              <p className="font-mono text-zinc-900 dark:text-zinc-100">{sequence.activeLeads}</p>
                                          </div>
                                          <div>
                                              <p className="text-[10px] text-zinc-500 uppercase font-bold">Conclusão</p>
                                              <p className="font-mono text-zinc-900 dark:text-zinc-100">{sequence.completionRate}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                          <button 
                            onClick={() => handleStartCreation('sequence')}
                            className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center p-8 text-zinc-400 hover:text-eximia-500 hover:border-eximia-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all gap-3"
                          >
                              <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                  <Plus className="w-6 h-6" />
                              </div>
                              <span className="font-bold text-sm">Criar Nova Sequência</span>
                          </button>
                      </div>
                  )}
              </div>
          </div>
        </div>
      );
  }

  // --- WIZARD VIEW ---
  if (view === 'wizard') {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-8">
              <div className="w-full max-w-2xl">
                  <button onClick={() => setView('dashboard')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Cancelar
                  </button>
                  
                  <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-8 shadow-2xl">
                      <div className="flex items-center gap-3 mb-6">
                          <div className={`p-3 rounded-xl ${wizardData.mode === 'broadcast' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'}`}>
                              {wizardData.mode === 'broadcast' ? <Mail className="w-6 h-6" /> : <GitMerge className="w-6 h-6" />}
                          </div>
                          <div>
                              <h2 className="text-2xl font-bold text-white">Criar {wizardData.mode === 'broadcast' ? 'Newsletter' : 'Sequência'}</h2>
                              <p className="text-sm text-zinc-400">Defina o contexto para a IA gerar o rascunho inicial.</p>
                          </div>
                      </div>

                      <div className="space-y-6">
                          <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sobre o que é?</label>
                              <input 
                                  type="text" 
                                  className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eximia-500 transition-colors"
                                  placeholder={wizardData.mode === 'broadcast' ? "Ex: 5 lições sobre validação de startups..." : "Ex: Boas-vindas para novos leads..."}
                                  value={wizardData.topic}
                                  onChange={(e) => setWizardData({...wizardData, topic: e.target.value})}
                                  autoFocus
                              />
                          </div>

                          {wizardData.mode === 'broadcast' && (
                              <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Canal de Destino</label>
                                  <div className="grid grid-cols-2 gap-4">
                                      <button
                                          onClick={() => setWizardData({...wizardData, channel: 'email'})}
                                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${wizardData.channel === 'email' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'bg-[#0A0A0A] border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                                      >
                                          <Mail className="w-4 h-4" /> Email Newsletter
                                      </button>
                                      <button
                                          onClick={() => setWizardData({...wizardData, channel: 'website'})}
                                          className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${wizardData.channel === 'website' ? 'bg-purple-500/10 border-purple-500 text-purple-500' : 'bg-[#0A0A0A] border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                                      >
                                          <Globe className="w-4 h-4" /> Site / Blog
                                      </button>
                                  </div>
                              </div>
                          )}

                          <div className="grid grid-cols-2 gap-6">
                              <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Público Alvo</label>
                                  <input 
                                      type="text" 
                                      className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eximia-500 transition-colors"
                                      placeholder="Ex: Founders early-stage"
                                      value={wizardData.targetAudience}
                                      onChange={(e) => setWizardData({...wizardData, targetAudience: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Objetivo Principal</label>
                                  <select 
                                      className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-eximia-500 transition-colors appearance-none"
                                      value={wizardData.goal}
                                      onChange={(e) => setWizardData({...wizardData, goal: e.target.value})}
                                  >
                                      <option value="">Selecione...</option>
                                      <option value="value">Entregar Valor / Educar</option>
                                      <option value="click">Gerar Cliques (Link)</option>
                                      <option value="reply">Gerar Respostas</option>
                                      <option value="sell">Venda Direta</option>
                                  </select>
                              </div>
                          </div>

                          <div>
                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tom de Voz</label>
                              <div className="flex gap-2">
                                  {['Conversacional', 'Profissional', 'Urgente', 'Storytelling'].map(tone => (
                                      <button
                                          key={tone}
                                          onClick={() => setWizardData({...wizardData, tone})}
                                          className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${wizardData.tone === tone ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-[#0A0A0A] border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                                      >
                                          {tone}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>

                      <div className="mt-10 pt-6 border-t border-zinc-800 flex justify-end">
                          <Button 
                            variant="primary" 
                            size="lg" 
                            onClick={handleWizardSubmit} 
                            disabled={!wizardData.topic}
                            icon={isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                          >
                              {isGenerating ? 'Gerando Rascunho...' : 'Criar com IA'}
                          </Button>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- EDITOR VIEW (BROADCAST) ---
  if (view === 'editor-broadcast') {
      return (
          <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
              {/* Toolbar */}
              <div className="h-16 border-b border-[#1F1F22] flex items-center justify-between px-6 bg-[#0A0A0A]/80 backdrop-blur-md z-20 shrink-0">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setView('dashboard')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                          <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="h-6 w-[1px] bg-zinc-800" />
                      <div>
                          <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                              Editando {wizardData.channel === 'website' ? 'Post para Site' : 'Newsletter'}
                          </p>
                          <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-zinc-500" />
                              <span className="text-sm font-bold text-white">Rascunho Salvo</span>
                          </div>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <button onClick={() => setAiSidebarOpen(!aiSidebarOpen)} className={`p-2 rounded-lg transition-colors ${aiSidebarOpen ? 'bg-eximia-500/10 text-eximia-500' : 'text-zinc-500 hover:text-white'}`}>
                          <LayoutTemplate className="w-5 h-5" />
                      </button>
                      <Button variant="secondary" icon={<Eye className="w-4 h-4" />}>Preview</Button>
                      <Button variant="primary" icon={<Send className="w-4 h-4" />}>Enviar / Agendar</Button>
                  </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                  
                  {/* Main Editor */}
                  <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full h-full p-8 overflow-y-auto custom-scrollbar">
                      
                      {/* Subject Line Section */}
                      <div className="mb-8 p-6 bg-[#121214] border border-zinc-800 rounded-xl">
                          <div className="flex justify-between items-center mb-4">
                              <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{wizardData.channel === 'website' ? 'Título do Post' : 'Assunto do Email'}</label>
                              <button onClick={generateSubjects} className="text-xs text-eximia-500 hover:text-eximia-400 flex items-center gap-1 font-bold">
                                  <Sparkles className="w-3 h-3" /> Gerar Ideias
                              </button>
                          </div>
                          
                          <input 
                              type="text" 
                              value={subjectLine} 
                              onChange={(e) => setSubjectLine(e.target.value)}
                              className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-4 py-3 text-lg font-medium text-white focus:outline-none focus:border-eximia-500 mb-4"
                          />

                          {generatedSubjects.length > 0 && (
                              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                  {generatedSubjects.map((subj, idx) => (
                                      <button 
                                        key={idx} 
                                        onClick={() => setSubjectLine(subj)}
                                        className="w-full text-left px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors flex justify-between group"
                                      >
                                          {subj}
                                          <span className="opacity-0 group-hover:opacity-100 text-[10px] text-eximia-500 font-bold uppercase">Usar</span>
                                      </button>
                                  ))}
                              </div>
                          )}
                      </div>

                      {/* Body Editor */}
                      <div className="flex-1 flex flex-col bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden min-h-[500px]">
                          <div className="p-3 border-b border-zinc-800 bg-[#0A0A0A] flex gap-2 overflow-x-auto">
                              {['B', 'I', 'U', 'Link', 'H1', 'H2', 'Quote', 'List'].map(tool => (
                                  <button key={tool} className="px-3 py-1.5 rounded hover:bg-zinc-800 text-zinc-500 hover:text-white text-xs font-bold transition-colors">{tool}</button>
                              ))}
                          </div>
                          <textarea 
                              value={emailBody}
                              onChange={(e) => setEmailBody(e.target.value)}
                              className="flex-1 w-full bg-transparent p-8 text-base text-zinc-300 font-serif leading-relaxed focus:outline-none resize-none"
                              placeholder="Comece a escrever aqui..."
                          />
                      </div>
                  </div>

                  {/* Sidebar: Performance Predictor */}
                  {aiSidebarOpen && (
                      <div className="w-80 border-l border-[#1F1F22] bg-[#0A0A0A] flex flex-col shrink-0">
                          <div className="p-4 border-b border-[#1F1F22]">
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                  <BarChart2 className="w-4 h-4 text-eximia-500" /> Análise Pré-envio
                              </h3>
                          </div>
                          <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">
                              
                              {/* Scores */}
                              <div className="space-y-4">
                                  <div>
                                      <div className="flex justify-between text-xs mb-1">
                                          <span className="text-zinc-400">Score do Assunto</span>
                                          <span className="text-emerald-500 font-bold">92/100</span>
                                      </div>
                                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                                          <div className="bg-emerald-500 h-full w-[92%] rounded-full" />
                                      </div>
                                  </div>
                                  <div>
                                      <div className="flex justify-between text-xs mb-1">
                                          <span className="text-zinc-400">Legibilidade</span>
                                          <span className="text-amber-500 font-bold">75/100</span>
                                      </div>
                                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                                          <div className="bg-amber-500 h-full w-[75%] rounded-full" />
                                      </div>
                                  </div>
                              </div>

                              {/* Suggestions */}
                              <div>
                                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Sugestões de Melhoria</h4>
                                  <div className="space-y-3">
                                      <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                          <div className="flex items-center gap-2 mb-1 text-amber-500 text-xs font-bold">
                                              <AlertTriangle className="w-3 h-3" /> Spam Word Detectada
                                          </div>
                                          <p className="text-xs text-zinc-400">Evite usar "Grátis" no assunto. Tente "Cortesia" ou "Acesso Livre".</p>
                                      </div>
                                      <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                          <div className="flex items-center gap-2 mb-1 text-blue-500 text-xs font-bold">
                                              <ThumbsUp className="w-3 h-3" /> Bom Hook
                                          </div>
                                          <p className="text-xs text-zinc-400">O primeiro parágrafo gera curiosidade imediata.</p>
                                      </div>
                                  </div>
                              </div>

                              {/* Predictor */}
                              <div className="p-4 bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-xl border border-zinc-700">
                                  <h4 className="text-xs font-bold text-white mb-4">Previsão de Performance</h4>
                                  <div className="grid grid-cols-2 gap-4 text-center">
                                      <div>
                                          <p className="text-2xl font-bold text-white">45%</p>
                                          <p className="text-[10px] text-zinc-500 uppercase">Open Rate</p>
                                      </div>
                                      <div>
                                          <p className="text-2xl font-bold text-white">12%</p>
                                          <p className="text-[10px] text-zinc-500 uppercase">Click Rate</p>
                                      </div>
                                  </div>
                              </div>

                          </div>
                      </div>
                  )}
              </div>
          </div>
      );
  }

  // --- SEQUENCE BUILDER VIEW ---
  if (view === 'editor-sequence') {
      return (
          <div className="h-screen flex flex-col bg-[#050505] overflow-hidden">
               {/* Header */}
               <div className="h-16 border-b border-[#1F1F22] flex items-center justify-between px-6 bg-[#0A0A0A] shrink-0 z-20">
                  <div className="flex items-center gap-4">
                      <button onClick={() => setView('dashboard')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                          <ArrowLeft className="w-5 h-5" />
                      </button>
                      <div className="h-6 w-[1px] bg-zinc-800" />
                      <div>
                          <h2 className="font-bold text-white text-sm">{wizardData.topic || 'Nova Sequência'}</h2>
                          <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Automação Ativa</p>
                      </div>
                  </div>
                  <div className="flex gap-3">
                      <Button variant="secondary" icon={<Settings className="w-4 h-4" />}>Configurações</Button>
                      <Button variant="primary" icon={<PlayCircle className="w-4 h-4" />}>Ativar Sequência</Button>
                  </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                  {/* Canvas Area - UPDATED VISUALS */}
                  <div className="flex-1 overflow-auto p-10 bg-[#050505] flex justify-center relative">
                      <div className="absolute inset-0 bg-[radial-gradient(#1f1f22_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                      
                      <div className="max-w-2xl w-full z-10">
                          
                          {/* Trigger Node */}
                          <SequenceNode 
                              step={0} 
                              type="trigger" 
                              title="Novo Inscrito" 
                              details="Tag: 'Lead Magnet Download'" 
                          />

                          {/* Email 1 */}
                          <SequenceNode 
                              step={1} 
                              type="email" 
                              title="Bem-vindo! Aqui está seu material" 
                              details="Entrega do Ebook + História Pessoal" 
                              metrics={{ opens: '68%', clicks: '42%' }}
                          />

                          {/* Delay */}
                          <SequenceNode 
                              step={0} 
                              type="delay" 
                              title="Esperar 1 dia" 
                              details="" 
                          />

                          {/* Email 2 */}
                          <SequenceNode 
                              step={2} 
                              type="email" 
                              title="O erro #1 que vejo todos cometerem" 
                              details="Conteúdo Educativo + Agitação do Problema" 
                              metrics={{ opens: '55%', clicks: '18%' }}
                          />

                           {/* Delay */}
                           <SequenceNode 
                              step={0} 
                              type="delay" 
                              title="Esperar 2 dias" 
                              details="" 
                          />

                          {/* Email 3 */}
                          <SequenceNode 
                              step={3} 
                              type="email" 
                              title="Como resolvi isso (Case Study)" 
                              details="Prova Social + Soft CTA" 
                              isLast
                              metrics={{ opens: '48%', clicks: '12%' }}
                          />

                          {/* Add Button */}
                          <div className="flex justify-center mt-4">
                              <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-500 hover:text-white hover:border-zinc-600 transition-all text-xs font-bold uppercase tracking-wider shadow-lg">
                                  <Plus className="w-4 h-4" /> Adicionar Passo
                              </button>
                          </div>

                      </div>
                  </div>

                  {/* Templates Sidebar */}
                  <div className="w-80 border-l border-[#1F1F22] bg-[#0A0A0A] flex flex-col shrink-0">
                      <div className="p-4 border-b border-[#1F1F22]">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                              <LayoutTemplate className="w-4 h-4 text-eximia-500" /> Templates
                          </h3>
                      </div>
                      <div className="p-4 space-y-4 overflow-y-auto">
                          {SEQUENCE_TEMPLATES.map(tpl => (
                              <div key={tpl.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-eximia-500/30 cursor-pointer transition-all group">
                                  <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-zinc-200 group-hover:text-white">{tpl.name}</h4>
                                      <Badge variant="outline">{tpl.emails} Emails</Badge>
                                  </div>
                                  <p className="text-xs text-zinc-500 leading-relaxed mb-3">{tpl.desc}</p>
                                  <Button size="sm" variant="secondary" className="w-full">Aplicar</Button>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return null;
};
