
import React, { useState } from 'react';
import { SOURCE_ITEMS } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Modal } from '../molecules/Modal';
import { 
  Plus, 
  Calendar, 
  Instagram, 
  Linkedin, 
  Twitter, 
  MoreHorizontal, 
  Image as ImageIcon, 
  BarChart2, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  Check, 
  Send, 
  Save, 
  RefreshCw, 
  Copy, 
  Layout, 
  Type, 
  Layers, 
  Wand2, 
  ArrowLeft, 
  Target, 
  Users, 
  MessageSquare, 
  FileText, 
  Monitor, 
  Smartphone, 
  Grid,
  Hash,
  List,
  Youtube,
  Link as LinkIcon,
  Mic,
  Search,
  Filter,
  CalendarDays,
  CheckCircle2,
  Eye,
  Trash2,
  Edit2
} from 'lucide-react';

// --- Types & Interfaces ---

type CreationMode = 'scratch' | 'repurpose' | 'batch';
type ContentFormat = 'post' | 'carousel' | 'thread';
type WizardStep = 'mode' | 'context' | 'editor';
type RepurposeSource = 'curador' | 'copybank' | 'manual';
type ViewMode = 'calendar' | 'list';

interface Slide {
    id: number;
    type: 'cover' | 'content' | 'cta';
    title: string;
    body: string;
    image?: string;
}

// --- Component ---

export const ContentSocial: React.FC = () => {
  // Main State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  // Wizard State
  const [currentStep, setCurrentStep] = useState<WizardStep>('mode');
  const [creationMode, setCreationMode] = useState<CreationMode>('scratch');
  
  // Context State (Scratch)
  const [postTopic, setPostTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [objective, setObjective] = useState('educate');
  const [format, setFormat] = useState<ContentFormat>('post');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['linkedin']);

  // Context State (Repurpose)
  const [repurposeSource, setRepurposeSource] = useState<RepurposeSource>('curador');
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [repurposeOutputs, setRepurposeOutputs] = useState<string[]>(['linkedin_post']);
  
  // Context State (Batch)
  const [batchFrequency, setBatchFrequency] = useState({ instagram: 5, linkedin: 3, twitter: 5 });
  const [batchPillars, setBatchPillars] = useState<string[]>(['Autoridade']);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const [generatedSlides, setGeneratedSlides] = useState<Slide[]>([]);
  const [activePreview, setActivePreview] = useState<string>('linkedin');
  
  // Carousel Editor State
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Scheduling State
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');

  // --- Mock Data ---
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
      const day = i - 2; 
      return day > 0 && day <= 31 ? day : null;
  });

  const posts = [
      { id: 1, platform: 'instagram', type: 'carousel', title: '5 Erros de Empreendedores', time: '09:00', status: 'scheduled', image: true, date: '28 Jan', engagement: '1.2k' },
      { id: 2, platform: 'linkedin', type: 'text', title: 'A diferença entre escalar e crescer', time: '12:00', status: 'scheduled', image: false, date: '28 Jan', engagement: '850' },
      { id: 3, platform: 'twitter', type: 'thread', title: 'Mini-thread: No-code tools', time: '15:00', status: 'draft', image: false, date: '30 Jan', engagement: '-' },
      { id: 4, platform: 'linkedin', type: 'text', title: 'Como contratar devagar e demitir rápido', time: '10:00', status: 'published', image: false, date: '27 Jan', engagement: '2.4k' },
      { id: 5, platform: 'instagram', type: 'carousel', title: 'Bastidores do escritório novo', time: '18:00', status: 'published', image: true, date: '26 Jan', engagement: '3.1k' },
  ];

  const contentPillars = ['Autoridade', 'Bastidores', 'Vendas', 'Educativo', 'Inspiracional', 'Pessoal', 'Contrarian'];

  // --- Handlers ---

  const resetState = () => {
      setCurrentStep('mode');
      setPostTopic('');
      setGeneratedContent({});
      setGeneratedSlides([]);
      setTargetAudience('');
      setSelectedSourceId(null);
      setRepurposeOutputs(['linkedin_post']);
  };

  const handleCloseCreate = () => {
      setIsCreateModalOpen(false);
      setTimeout(resetState, 300);
  };

  const handleOpenDetail = (post: any) => {
      setSelectedPost(post);
      setIsDetailModalOpen(true);
  };

  const handleBack = () => {
      if (currentStep === 'editor') setCurrentStep('context');
      else if (currentStep === 'context') setCurrentStep('mode');
  };

  const togglePlatform = (p: string) => {
    if (selectedPlatforms.includes(p)) {
        const newVal = selectedPlatforms.filter(x => x !== p);
        setSelectedPlatforms(newVal);
        if (activePreview === p && newVal.length > 0) setActivePreview(newVal[0]);
    } else {
        setSelectedPlatforms(prev => [...prev, p]);
        setActivePreview(p);
    }
  };

  const toggleRepurposeOutput = (id: string) => {
      if (repurposeOutputs.includes(id)) {
          setRepurposeOutputs(prev => prev.filter(x => x !== id));
      } else {
          setRepurposeOutputs(prev => [...prev, id]);
      }
  };

  const toggleBatchPillar = (pillar: string) => {
      if (batchPillars.includes(pillar)) {
          setBatchPillars(prev => prev.filter(p => p !== pillar));
      } else {
          setBatchPillars(prev => [...prev, pillar]);
      }
  };

  const generateSlides = () => {
      const slides: Slide[] = [
          { id: 1, type: 'cover', title: `5 Verdades sobre ${postTopic || 'Isso'}`, body: 'Arrasta para o lado 👉', image: 'bg-gradient-to-br from-purple-900 to-black' },
          { id: 2, type: 'content', title: 'O Erro Comum', body: 'A maioria das pessoas foca na ferramenta, não no processo. Isso gera complexidade desnecessária.', image: '' },
          { id: 3, type: 'content', title: 'A Solução', body: 'Simplifique antes de automatizar. Se o processo é ruim, a automação só vai escalar o caos.', image: '' },
          { id: 4, type: 'cta', title: 'Gostou?', body: 'Salve este post para consultar depois.', image: 'bg-zinc-900' },
      ];
      setGeneratedSlides(slides);
  };

  const simulateTyping = async (platform: string, text: string) => {
      let currentText = '';
      const chunks = text.split(''); 
      const speed = 3; 
      
      for (let i = 0; i < chunks.length; i += speed) {
          await new Promise(r => setTimeout(r, 5));
          currentText += chunks.slice(i, i + speed).join('');
          setGeneratedContent(prev => ({...prev, [platform]: currentText}));
      }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent({}); 

    if (format === 'carousel' || (creationMode === 'repurpose' && repurposeOutputs.includes('carousel'))) {
        setTimeout(() => {
            generateSlides();
            setIsGenerating(false);
            setCurrentStep('editor');
        }, 1500);
        return;
    }

    let platformsToGen = selectedPlatforms;
    if (creationMode === 'repurpose') {
        platformsToGen = [];
        if (repurposeOutputs.includes('linkedin_post')) platformsToGen.push('linkedin');
        if (repurposeOutputs.includes('twitter_thread')) platformsToGen.push('twitter');
        if (repurposeOutputs.includes('instagram_caption')) platformsToGen.push('instagram');
    }

    const promises = platformsToGen.map(async (platform) => {
        let text = '';
        if (platform === 'linkedin') {
            text = `🚀 **${postTopic || 'O Futuro do Negócio'}**\n\n🎯 Objetivo: ${objective === 'sell' ? 'Venda Direta' : 'Educação'}\n👤 Para: ${targetAudience || 'Todos'}\n\nMuitos empreendedores ignoram um fato crucial sobre este tema. A verdade é que a escala não vem da força bruta, mas da alavancagem inteligente.\n\n👇 Qual sua maior dificuldade hoje nessa área?\n\n#Business #Growth #Estratégia #${postTopic.split(' ')[0] || 'Leadership'}`;
        } else if (platform === 'twitter') {
            text = `🧵 1/5 A verdade brutal sobre ${postTopic || 'escalar negócios'}.\n\nAbra a thread 👇\n\n2/5 A maioria foca em vendas antes de arrumar a casa.\n\n3/5 Alavancagem = Código + Mídia.\n\n4/5 Contrate devagar, demita rápido.\n\n5/5 RT se concorda. 🚀`;
        } else if (platform === 'instagram') {
            text = `A Verdade Sobre ${postTopic}\n\nLeia a legenda 👇\n\nEste é o erro que custa milhões para empresas que não olham para ${targetAudience}.\n\nSalve este post para consultar depois 💾\n\n.\n.\n.\n#empreendedorismo #startups #${postTopic.replace(' ', '').toLowerCase()}`;
        }
        
        await simulateTyping(platform, text);
    });

    await Promise.all(promises);
    setIsGenerating(false);
    setCurrentStep('editor');
  };

  const handleConfirmSchedule = () => {
      setIsScheduleModalOpen(false);
      handleCloseCreate();
      // Add logic to save post to list/db here
  };

  const getPlatformIcon = (platform: string, size = "w-4 h-4") => {
      switch(platform) {
          case 'instagram': return <Instagram className={`${size} text-pink-500`} />;
          case 'linkedin': return <Linkedin className={`${size} text-blue-600`} />;
          case 'twitter': return <Twitter className={`${size} text-sky-500`} />;
          default: return <Calendar className={`${size} text-zinc-500`} />;
      }
  };

  const getSourceIcon = (type: string) => {
      switch(type) {
          case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
          case 'pdf': return <FileText className="w-5 h-5 text-orange-500" />;
          case 'url': return <LinkIcon className="w-5 h-5 text-blue-500" />;
          case 'audio': return <Mic className="w-5 h-5 text-purple-500" />;
          default: return <FileText className="w-5 h-5 text-zinc-500" />;
      }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
            Social Media
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
            Motor de produção e distribuição multicanal.
          </p>
        </div>
        <div className="flex gap-3 items-center">
             <div className="flex bg-[#0A0A0A] border border-[#1F1F22] rounded-lg p-1">
                 <button onClick={() => setViewMode('calendar')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'calendar' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Calendário</button>
                 <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${viewMode === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Lista</button>
             </div>
             <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateModalOpen(true)}>Novo Post</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Area: Calendar or List */}
          <div className="lg:col-span-2 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 min-h-[600px] flex flex-col">
              
              {/* --- VIEW: CALENDAR --- */}
              {viewMode === 'calendar' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-eximia-500" /> Janeiro 2026
                        </h3>
                        <div className="flex gap-2">
                            <button className="p-1 hover:bg-zinc-800 rounded text-zinc-400"><ChevronLeft className="w-5 h-5" /></button>
                            <button className="p-1 hover:bg-zinc-800 rounded text-zinc-400"><ChevronRight className="w-5 h-5" /></button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 mb-2">
                        {days.map(day => (
                            <div key={day} className="text-center text-[10px] font-bold text-zinc-500 uppercase tracking-wider py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-px bg-zinc-800 border border-zinc-800 rounded-lg overflow-hidden flex-1">
                        {calendarDays.map((day, idx) => (
                            <div key={idx} className="bg-[#18181B] min-h-[100px] p-2 relative hover:bg-zinc-900 transition-colors group flex flex-col">
                                {day && (
                                    <>
                                        <span className={`text-xs font-bold ${day === 28 ? 'text-eximia-500' : 'text-zinc-400'}`}>{day}</span>
                                        {day === 28 && (
                                            <div className="mt-2 space-y-1">
                                                <div className="h-1.5 w-full bg-pink-500/20 rounded-full" title="Instagram"></div>
                                                <div className="h-1.5 w-2/3 bg-blue-600/20 rounded-full" title="LinkedIn"></div>
                                            </div>
                                        )}
                                        {day === 30 && (
                                            <div className="mt-2 space-y-1">
                                                <div className="h-1.5 w-full bg-sky-500/20 rounded-full" title="Twitter"></div>
                                            </div>
                                        )}
                                        
                                        <button onClick={() => setIsCreateModalOpen(true)} className="absolute bottom-2 right-2 p-1 rounded-full bg-zinc-800 text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-white transition-all">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                  </>
              )}

              {/* --- VIEW: LIST --- */}
              {viewMode === 'list' && (
                  <div className="flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                          <div className="relative w-64">
                              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                              <input type="text" placeholder="Buscar posts..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 py-2 text-sm text-white focus:outline-none focus:border-eximia-500" />
                          </div>
                          <div className="flex gap-2">
                              <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white"><Filter className="w-4 h-4" /></button>
                          </div>
                      </div>

                      <div className="overflow-y-auto custom-scrollbar flex-1">
                          <table className="w-full text-left text-sm">
                              <thead className="bg-zinc-900/50 text-zinc-500 font-bold border-b border-zinc-800">
                                  <tr>
                                      <th className="p-4 rounded-tl-lg">Conteúdo</th>
                                      <th className="p-4">Canal</th>
                                      <th className="p-4">Data</th>
                                      <th className="p-4">Status</th>
                                      <th className="p-4 rounded-tr-lg text-right">Ações</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-800">
                                  {posts.map(post => (
                                      <tr key={post.id} className="hover:bg-zinc-900/30 transition-colors group">
                                          <td className="p-4">
                                              <div className="flex items-center gap-3">
                                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border border-zinc-800 ${post.image ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
                                                      {post.image ? <ImageIcon className="w-4 h-4 text-zinc-400" /> : <FileText className="w-4 h-4 text-zinc-400" />}
                                                  </div>
                                                  <p className="font-medium text-white truncate max-w-[200px]">{post.title}</p>
                                              </div>
                                          </td>
                                          <td className="p-4">
                                              <div className="flex items-center gap-2">
                                                  {getPlatformIcon(post.platform)}
                                                  <span className="capitalize text-zinc-400">{post.platform}</span>
                                              </div>
                                          </td>
                                          <td className="p-4 text-zinc-400 font-mono text-xs">{post.date} • {post.time}</td>
                                          <td className="p-4">
                                              <Badge variant={post.status === 'scheduled' ? 'primary' : post.status === 'published' ? 'success' : 'default'}>
                                                  {post.status}
                                              </Badge>
                                          </td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => handleOpenDetail(post)} className="text-zinc-500 hover:text-white transition-colors">
                                                  <MoreHorizontal className="w-4 h-4" />
                                              </button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>

          {/* Sidebar: Upcoming / Stats */}
          <div className="space-y-6">
              <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Próximos Posts</h3>
                  <Badge variant="outline">{posts.filter(p => p.status === 'scheduled').length} Agendados</Badge>
              </div>

              <div className="space-y-4">
                  {posts.slice(0,3).map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => handleOpenDetail(post)}
                        className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 hover:border-eximia-500/30 transition-all group cursor-pointer"
                      >
                          <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                  {getPlatformIcon(post.platform)}
                                  <span className="text-xs font-bold text-zinc-300 capitalize">{post.platform}</span>
                              </div>
                              <MoreHorizontal className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                          </div>
                          
                          <div className="flex gap-3 mb-3">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-zinc-700 ${post.image ? 'bg-zinc-800' : 'bg-zinc-900'}`}>
                                  {post.image ? <ImageIcon className="w-5 h-5 text-zinc-500" /> : <BarChart2 className="w-5 h-5 text-zinc-500" />}
                              </div>
                              <div>
                                  <h4 className="text-sm font-bold text-white line-clamp-2 leading-tight">{post.title}</h4>
                                  <p className="text-[10px] text-zinc-500 mt-1 capitalize">{post.type}</p>
                              </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                              <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
                                  <Clock className="w-3 h-3" /> {post.time}
                              </div>
                              <Badge variant={post.status === 'scheduled' ? 'primary' : 'default'} className="text-[9px]">
                                  {post.status === 'scheduled' ? 'Agendado' : 'Rascunho'}
                              </Badge>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* --- MASTER CREATION MODAL --- */}
      <Modal isOpen={isCreateModalOpen} onClose={handleCloseCreate} title="Social Content Engine" size="xl">
          <div className="h-[650px] flex flex-col">
              
              {/* STEP 1: MODE SELECTION */}
              {currentStep === 'mode' && (
                  <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4">
                      <h2 className="text-2xl font-bold text-white text-center mb-8">Como você quer criar hoje?</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                          <button 
                            onClick={() => { setCreationMode('scratch'); setCurrentStep('context'); }}
                            className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-eximia-500/50 hover:bg-zinc-800 transition-all text-left flex flex-col items-center text-center gap-4"
                          >
                              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform text-eximia-500">
                                  <Sparkles className="w-8 h-8" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-white text-lg mb-2">Do Zero</h3>
                                  <p className="text-sm text-zinc-500">Crie a partir de uma ideia, tópico ou insight rápido.</p>
                              </div>
                          </button>

                          <button 
                            onClick={() => { setCreationMode('repurpose'); setCurrentStep('context'); }}
                            className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-800 transition-all text-left flex flex-col items-center text-center gap-4"
                          >
                              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform text-blue-500">
                                  <RefreshCw className="w-8 h-8" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-white text-lg mb-2">Repurpose</h3>
                                  <p className="text-sm text-zinc-500">Transforme vídeos, artigos ou áudios em múltiplos posts.</p>
                              </div>
                          </button>

                          <button 
                            onClick={() => { setCreationMode('batch'); setCurrentStep('context'); }}
                            className="group p-8 bg-zinc-900 border border-zinc-800 rounded-2xl hover:border-purple-500/50 hover:bg-zinc-800 transition-all text-left flex flex-col items-center text-center gap-4"
                          >
                              <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform text-purple-500">
                                  <Layers className="w-8 h-8" />
                              </div>
                              <div>
                                  <h3 className="font-bold text-white text-lg mb-2">Batch</h3>
                                  <p className="text-sm text-zinc-500">Planeje e gere o calendário da semana inteira.</p>
                              </div>
                          </button>
                      </div>
                  </div>
              )}

              {/* STEP 2: CONTEXT & CONFIG */}
              {currentStep === 'context' && (
                  <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-right-8 overflow-hidden">
                      <div className="flex-1 overflow-y-auto custom-scrollbar px-1">
                          
                          {/* --- MODE: REPURPOSE UI --- */}
                          {creationMode === 'repurpose' && (
                              <div className="max-w-3xl mx-auto space-y-8 py-4">
                                  {/* 1. Source Selector */}
                                  <div>
                                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">1. Escolha a Fonte</label>
                                      <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-zinc-800 mb-6">
                                          {[
                                              { id: 'curador', label: 'Biblioteca Curador', icon: Layers },
                                              { id: 'copybank', label: 'Copy Bank', icon: FileText },
                                              { id: 'manual', label: 'Manual / Colar', icon: Type }
                                          ].map(opt => (
                                              <button
                                                  key={opt.id}
                                                  onClick={() => setRepurposeSource(opt.id as RepurposeSource)}
                                                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${repurposeSource === opt.id ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                              >
                                                  <opt.icon className="w-4 h-4" />
                                                  {opt.label}
                                              </button>
                                          ))}
                                      </div>

                                      {/* Source Content Area */}
                                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 min-h-[250px]">
                                          {repurposeSource === 'curador' && (
                                              <div className="space-y-4">
                                                  <div className="relative">
                                                      <Search className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                                                      <input type="text" placeholder="Buscar na biblioteca..." className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500" />
                                                  </div>
                                                  <div className="grid gap-3">
                                                      {SOURCE_ITEMS.map(item => (
                                                          <div 
                                                            key={item.id} 
                                                            onClick={() => setSelectedSourceId(item.id)}
                                                            className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${selectedSourceId === item.id ? 'bg-blue-900/20 border-blue-500/50' : 'bg-[#0A0A0A] border-zinc-800 hover:border-zinc-700'}`}
                                                          >
                                                              <div className="p-2 bg-zinc-900 rounded-lg">{getSourceIcon(item.type)}</div>
                                                              <div className="flex-1 min-w-0">
                                                                  <h4 className="text-sm font-bold text-zinc-200 truncate">{item.title}</h4>
                                                                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                                      <span>{item.metadata}</span>
                                                                      <span>•</span>
                                                                      <span>{item.insightsCount} insights</span>
                                                                  </div>
                                                              </div>
                                                              {selectedSourceId === item.id && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                                                          </div>
                                                      ))}
                                                  </div>
                                              </div>
                                          )}

                                          {repurposeSource === 'manual' && (
                                              <div className="space-y-4">
                                                  <textarea 
                                                      className="w-full h-40 bg-[#0A0A0A] border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 focus:outline-none focus:border-blue-500 resize-none"
                                                      placeholder="Cole o texto, transcrição ou notas aqui..."
                                                      value={postTopic}
                                                      onChange={(e) => setPostTopic(e.target.value)}
                                                  />
                                                  <div className="flex gap-2">
                                                      <input type="text" placeholder="Ou cole uma URL..." className="flex-1 bg-[#0A0A0A] border border-zinc-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
                                                      <Button variant="secondary" size="sm">Extrair</Button>
                                                  </div>
                                              </div>
                                          )}
                                          
                                          {repurposeSource === 'copybank' && (
                                              <div className="text-center py-10 text-zinc-500">
                                                  <p>Conecte-se ao Copy Bank para selecionar assets vencedores.</p>
                                              </div>
                                          )}
                                      </div>
                                  </div>

                                  {/* 2. Output Configuration */}
                                  <div>
                                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">2. O que vamos gerar?</label>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                          {[
                                              { id: 'linkedin_post', label: 'Post LinkedIn', icon: Linkedin, desc: 'Texto Longo' },
                                              { id: 'instagram_carousel', label: 'Carrossel', icon: Layout, desc: '5-7 Slides' },
                                              { id: 'twitter_thread', label: 'Thread X', icon: Twitter, desc: 'Sequência' },
                                              { id: 'instagram_caption', label: 'Legenda Insta', icon: Instagram, desc: 'Curto + Hashtags' },
                                          ].map(out => (
                                              <div 
                                                key={out.id}
                                                onClick={() => toggleRepurposeOutput(out.id)}
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${repurposeOutputs.includes(out.id) ? 'bg-blue-900/20 border-blue-500/50 ring-1 ring-blue-500/20' : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'}`}
                                              >
                                                  <div className={`mb-3 ${repurposeOutputs.includes(out.id) ? 'text-blue-400' : 'text-zinc-500'}`}>
                                                      <out.icon className="w-6 h-6" />
                                                  </div>
                                                  <p className="font-bold text-sm text-zinc-200">{out.label}</p>
                                                  <p className="text-xs text-zinc-500">{out.desc}</p>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* --- MODE: BATCH UI --- */}
                          {creationMode === 'batch' && (
                              <div className="max-w-3xl mx-auto space-y-8 py-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      {/* 1. Week & Frequency */}
                                      <div className="space-y-6">
                                          <div>
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">1. Semana Alvo</label>
                                              <div className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                                                  <CalendarDays className="w-5 h-5 text-purple-500" />
                                                  <div>
                                                      <p className="font-bold text-white text-sm">Próxima Semana</p>
                                                      <p className="text-xs text-zinc-500">02 Fev - 08 Fev</p>
                                                  </div>
                                                  <button className="ml-auto text-xs text-zinc-400 hover:text-white underline">Alterar</button>
                                              </div>
                                          </div>

                                          <div>
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">2. Frequência por Canal</label>
                                              <div className="space-y-3">
                                                  {[
                                                      { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-500' },
                                                      { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-500' },
                                                      { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: 'text-sky-500' }
                                                  ].map(p => (
                                                      <div key={p.id} className="flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                                                          <div className="flex items-center gap-3">
                                                              <p.icon className={`w-4 h-4 ${p.color}`} />
                                                              <span className="text-sm font-medium text-zinc-300">{p.label}</span>
                                                          </div>
                                                          <div className="flex items-center gap-3">
                                                              <button 
                                                                onClick={() => setBatchFrequency({...batchFrequency, [p.id]: Math.max(0, batchFrequency[p.id as keyof typeof batchFrequency] - 1)})}
                                                                className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400"
                                                              >-</button>
                                                              <span className="w-4 text-center font-bold text-white text-sm">{batchFrequency[p.id as keyof typeof batchFrequency]}</span>
                                                              <button 
                                                                onClick={() => setBatchFrequency({...batchFrequency, [p.id]: batchFrequency[p.id as keyof typeof batchFrequency] + 1})}
                                                                className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-zinc-700 text-white"
                                                              >+</button>
                                                          </div>
                                                      </div>
                                                  ))}
                                              </div>
                                          </div>
                                      </div>

                                      {/* 2. Pillars & Strategy */}
                                      <div className="space-y-6">
                                          <div>
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">3. Pilares de Conteúdo</label>
                                              <div className="flex flex-wrap gap-2">
                                                  {contentPillars.map(pillar => (
                                                      <button
                                                          key={pillar}
                                                          onClick={() => toggleBatchPillar(pillar)}
                                                          className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${batchPillars.includes(pillar) ? 'bg-purple-900/30 border-purple-500 text-purple-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'}`}
                                                      >
                                                          {pillar}
                                                      </button>
                                                  ))}
                                              </div>
                                          </div>

                                          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                                              <div className="flex items-center gap-2 mb-3">
                                                  <Sparkles className="w-4 h-4 text-amber-500" />
                                                  <h4 className="text-sm font-bold text-white">Estratégia Sugerida</h4>
                                              </div>
                                              <p className="text-xs text-zinc-400 leading-relaxed">
                                                  Com base nos pilares selecionados, a IA irá focar em posts educacionais no LinkedIn (ter/qui) e conteúdo de bastidores nos Stories (diário).
                                              </p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* --- MODE: SCRATCH UI (Original) --- */}
                          {creationMode === 'scratch' && (
                              <div className="max-w-2xl mx-auto space-y-8 py-4">
                                  <div>
                                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Sobre o que vamos falar?</label>
                                      <textarea 
                                          value={postTopic}
                                          onChange={(e) => setPostTopic(e.target.value)}
                                          className="w-full h-32 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-lg text-zinc-200 focus:outline-none focus:border-eximia-500/50 resize-none placeholder-zinc-700 font-serif"
                                          placeholder="Descreva o tema, cole um link ou digite insights principais..."
                                          autoFocus
                                      />
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                      <div>
                                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Objetivo</label>
                                          <div className="space-y-2">
                                              {['educate', 'entertain', 'sell', 'engage'].map(obj => (
                                                  <button
                                                      key={obj}
                                                      onClick={() => setObjective(obj)}
                                                      className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${objective === obj ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                                                  >
                                                      {obj === 'educate' && '🎓 Educar / Ensinar'}
                                                      {obj === 'entertain' && '🍿 Entreter / Viralizar'}
                                                      {obj === 'sell' && '💰 Vender / Converter'}
                                                      {obj === 'engage' && '💬 Engajar / Conversar'}
                                                  </button>
                                              ))}
                                          </div>
                                      </div>
                                      
                                      <div className="space-y-6">
                                          <div>
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Formato</label>
                                              <div className="flex gap-2">
                                                  <button 
                                                    onClick={() => setFormat('post')}
                                                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${format === 'post' ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                                                  >
                                                      <FileText className="w-5 h-5 mx-auto mb-1" />
                                                      <span className="text-xs font-bold">Post</span>
                                                  </button>
                                                  <button 
                                                    onClick={() => setFormat('carousel')}
                                                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${format === 'carousel' ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                                                  >
                                                      <Layout className="w-5 h-5 mx-auto mb-1" />
                                                      <span className="text-xs font-bold">Carrossel</span>
                                                  </button>
                                                  <button 
                                                    onClick={() => setFormat('thread')}
                                                    className={`flex-1 p-3 rounded-lg border text-center transition-all ${format === 'thread' ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                                                  >
                                                      <List className="w-5 h-5 mx-auto mb-1" />
                                                      <span className="text-xs font-bold">Thread</span>
                                                  </button>
                                              </div>
                                          </div>

                                          <div>
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Público Alvo</label>
                                              <input 
                                                  type="text"
                                                  value={targetAudience}
                                                  onChange={(e) => setTargetAudience(e.target.value)}
                                                  placeholder="Ex: CTOs de Startups..."
                                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-eximia-500/50"
                                              />
                                          </div>
                                      </div>
                                  </div>

                                  <div>
                                      <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Canais de Destino</label>
                                      <div className="flex flex-wrap gap-3">
                                          {[
                                              { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-500' },
                                              { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
                                              { id: 'twitter', icon: Twitter, label: 'Twitter/X', color: 'text-sky-500' }
                                          ].map(p => (
                                              <button 
                                                key={p.id}
                                                onClick={() => togglePlatform(p.id)}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${selectedPlatforms.includes(p.id) ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
                                              >
                                                  <p.icon className={`w-4 h-4 ${selectedPlatforms.includes(p.id) ? p.color : 'text-zinc-500'}`} />
                                                  <span className="text-sm font-medium">{p.label}</span>
                                                  {selectedPlatforms.includes(p.id) && <Check className="w-3 h-3 ml-1 text-emerald-500" />}
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>

                      <div className="pt-6 border-t border-zinc-800 flex justify-between items-center mt-4">
                          <button onClick={handleBack} className="text-zinc-500 hover:text-white flex items-center gap-2 text-sm font-bold">
                              <ArrowLeft className="w-4 h-4" /> Voltar
                          </button>
                          <Button 
                            variant="primary" 
                            onClick={handleGenerate}
                            disabled={isGenerating || (creationMode === 'scratch' && !postTopic) || (creationMode === 'repurpose' && !selectedSourceId && !postTopic)}
                            icon={isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                          >
                              {isGenerating ? 'Processando...' : creationMode === 'batch' ? 'Gerar Calendário' : 'Gerar Conteúdo'}
                          </Button>
                      </div>
                  </div>
              )}

              {/* STEP 3: EDITOR (Text or Carousel) */}
              {currentStep === 'editor' && (
                  <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in">
                      {/* Top Bar inside Step */}
                      <div className="flex justify-between items-center mb-4 pb-4 border-b border-zinc-800">
                          <button onClick={handleBack} className="text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                              <ArrowLeft className="w-3 h-3" /> Configuração
                          </button>
                          <div className="flex gap-2">
                              <Button variant="secondary" size="sm" icon={<Save className="w-3 h-3" />}>Salvar Rascunho</Button>
                              <Button variant="primary" size="sm" icon={<Send className="w-3 h-3" />} onClick={() => setIsScheduleModalOpen(true)}>Agendar</Button>
                          </div>
                      </div>

                      {/* --- CAROUSEL BUILDER MODE --- */}
                      {(format === 'carousel' || (creationMode === 'repurpose' && repurposeOutputs.includes('carousel'))) ? (
                          <div className="flex-1 flex gap-6 overflow-hidden">
                              {/* Left: Slides List */}
                              <div className="w-64 border-r border-zinc-800 pr-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                                  {generatedSlides.map((slide, idx) => (
                                      <div 
                                        key={slide.id}
                                        onClick={() => setActiveSlideIndex(idx)}
                                        className={`p-3 rounded-xl border cursor-pointer transition-all ${idx === activeSlideIndex ? 'bg-zinc-800 border-zinc-600' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}
                                      >
                                          <div className="flex justify-between items-center mb-2">
                                              <span className="text-[10px] font-bold text-zinc-500 uppercase">Slide {idx + 1}</span>
                                              <Badge variant="outline" className="text-[9px]">{slide.type}</Badge>
                                          </div>
                                          <p className="text-xs text-white font-medium truncate">{slide.title}</p>
                                      </div>
                                  ))}
                                  <button className="w-full py-3 border border-dashed border-zinc-700 rounded-xl text-zinc-500 text-xs font-bold hover:text-white hover:border-zinc-500 transition-colors flex items-center justify-center gap-2">
                                      <Plus className="w-3 h-3" /> Adicionar Slide
                                  </button>
                              </div>

                              {/* Center: Visual Preview */}
                              <div className="flex-1 bg-[#050505] flex items-center justify-center p-8">
                                  {generatedSlides[activeSlideIndex] && (
                                      <div className={`aspect-square w-full max-w-[400px] bg-zinc-900 rounded-none border border-zinc-800 relative overflow-hidden shadow-2xl flex flex-col p-8 ${generatedSlides[activeSlideIndex].image || ''}`}>
                                          <div className="flex-1 flex flex-col justify-center relative z-10">
                                              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">{generatedSlides[activeSlideIndex].title}</h2>
                                              <p className="text-lg text-zinc-300 font-medium leading-relaxed">{generatedSlides[activeSlideIndex].body}</p>
                                          </div>
                                          <div className="mt-auto flex justify-between items-center pt-8 border-t border-white/10 relative z-10">
                                              <span className="text-sm text-white/50 font-bold">@eximia.os</span>
                                              <span className="text-sm text-white/50 font-bold">{activeSlideIndex + 1}/{generatedSlides.length}</span>
                                          </div>
                                          {/* Overlay for gradients */}
                                          {generatedSlides[activeSlideIndex].image && <div className="absolute inset-0 bg-black/20 z-0" />}
                                      </div>
                                  )}
                              </div>

                              {/* Right: Slide Editor */}
                              <div className="w-80 border-l border-zinc-800 pl-4 overflow-y-auto custom-scrollbar">
                                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Editar Slide</h3>
                                  {generatedSlides[activeSlideIndex] && (
                                      <div className="space-y-4">
                                          <div>
                                              <label className="block text-xs text-zinc-500 mb-1">Título</label>
                                              <input 
                                                  type="text" 
                                                  value={generatedSlides[activeSlideIndex].title}
                                                  onChange={(e) => {
                                                      const newSlides = [...generatedSlides];
                                                      newSlides[activeSlideIndex].title = e.target.value;
                                                      setGeneratedSlides(newSlides);
                                                  }}
                                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-eximia-500 outline-none"
                                              />
                                          </div>
                                          <div>
                                              <label className="block text-xs text-zinc-500 mb-1">Conteúdo</label>
                                              <textarea 
                                                  value={generatedSlides[activeSlideIndex].body}
                                                  onChange={(e) => {
                                                      const newSlides = [...generatedSlides];
                                                      newSlides[activeSlideIndex].body = e.target.value;
                                                      setGeneratedSlides(newSlides);
                                                  }}
                                                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-eximia-500 outline-none h-32 resize-none"
                                              />
                                          </div>
                                          
                                          <div className="pt-4 border-t border-zinc-800">
                                              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Design</label>
                                              <div className="grid grid-cols-2 gap-2">
                                                  <button className="bg-zinc-800 hover:bg-zinc-700 text-xs text-white py-2 rounded-lg border border-zinc-700">Imagem</button>
                                                  <button className="bg-zinc-800 hover:bg-zinc-700 text-xs text-white py-2 rounded-lg border border-zinc-700">Cor Sólida</button>
                                              </div>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      ) : (
                          // --- TEXT POST EDITOR ---
                          <div className="flex-1 flex gap-8 h-full overflow-hidden">
                              {/* Left: Input & Tools */}
                              <div className="w-1/2 flex flex-col space-y-4">
                                  {/* Platform Tabs */}
                                  <div className="flex border-b border-zinc-800">
                                      {(creationMode === 'repurpose' ? repurposeOutputs : selectedPlatforms).map(p => {
                                          const platformName = p.includes('linkedin') ? 'linkedin' : p.includes('twitter') ? 'twitter' : 'instagram';
                                          return (
                                              <button
                                                key={p}
                                                onClick={() => setActivePreview(platformName)}
                                                className={`
                                                    flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2
                                                    ${activePreview === platformName ? 'border-eximia-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}
                                                `}
                                              >
                                                  {getPlatformIcon(platformName)} {platformName}
                                              </button>
                                          );
                                      })}
                                  </div>

                                  <textarea
                                      className="flex-1 w-full bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-sm text-zinc-200 focus:outline-none focus:border-eximia-500/50 resize-none placeholder-zinc-600 font-serif leading-relaxed"
                                      value={generatedContent[activePreview] || ''}
                                      onChange={(e) => setGeneratedContent({...generatedContent, [activePreview]: e.target.value})}
                                  />
                                  
                                  <div className="flex justify-between items-center text-xs text-zinc-500 px-2">
                                      <span>{generatedContent[activePreview]?.length || 0} caracteres</span>
                                      <div className="flex gap-2">
                                          <button className="hover:text-white flex items-center gap-1"><Hash className="w-3 h-3"/> Hashtags</button>
                                          <button className="hover:text-white flex items-center gap-1"><Sparkles className="w-3 h-3"/> Improve</button>
                                      </div>
                                  </div>
                              </div>

                              {/* Right: AI Hooks & Tools */}
                              <div className="w-1/2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 overflow-y-auto custom-scrollbar">
                                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                      <Target className="w-4 h-4 text-eximia-500" /> Hook Variations
                                  </h3>
                                  <div className="space-y-3 mb-8">
                                      {[
                                          "A verdade brutal sobre escalar que ninguém te conta.",
                                          "Pare de perder tempo com estratégias que não funcionam.",
                                          "3 sinais de que seu negócio está prestes a estagnar."
                                      ].map((hook, i) => (
                                          <div key={i} className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-800 hover:border-zinc-600 cursor-pointer group flex justify-between items-start">
                                              <p className="text-sm text-zinc-300 italic">"{hook}"</p>
                                              <button className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-white"><Copy className="w-3 h-3"/></button>
                                          </div>
                                      ))}
                                  </div>

                                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                      <Monitor className="w-4 h-4 text-blue-500" /> Platform Preview
                                  </h3>
                                  <div className="bg-white text-black p-4 rounded-lg border border-zinc-200">
                                      <div className="flex items-center gap-2 mb-3">
                                          <div className="w-8 h-8 bg-zinc-200 rounded-full"></div>
                                          <div>
                                              <div className="h-2 w-24 bg-zinc-200 rounded mb-1"></div>
                                              <div className="h-2 w-16 bg-zinc-100 rounded"></div>
                                          </div>
                                      </div>
                                      <div className="space-y-1">
                                          <div className="h-2 w-full bg-zinc-100 rounded"></div>
                                          <div className="h-2 w-full bg-zinc-100 rounded"></div>
                                          <div className="h-2 w-2/3 bg-zinc-100 rounded"></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
      </Modal>

      {/* --- SCHEDULE MODAL --- */}
      <Modal isOpen={isScheduleModalOpen} onClose={() => setIsScheduleModalOpen(false)} title="Agendar Publicação" size="sm">
          <div className="space-y-6">
              <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Data da Publicação</label>
                  <input 
                      type="date" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eximia-500"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                  />
              </div>
              <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Horário</label>
                  <input 
                      type="time" 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-eximia-500"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                  />
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                  <div className="flex-1">
                      <p className="text-sm font-bold text-white">Auto-Publicar</p>
                      <p className="text-xs text-zinc-500">Publicar automaticamente sem notificação.</p>
                  </div>
                  <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                  <Button variant="secondary" onClick={() => setIsScheduleModalOpen(false)}>Cancelar</Button>
                  <Button variant="primary" icon={<Check className="w-4 h-4" />} onClick={() => { setIsScheduleModalOpen(false); handleCloseCreate(); }}>Confirmar Agendamento</Button>
              </div>
          </div>
      </Modal>

      {/* --- POST DETAIL MODAL --- */}
      <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Detalhes do Post" size="md">
          {selectedPost && (
              <div className="space-y-6">
                  <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                          {getPlatformIcon(selectedPost.platform, "w-5 h-5")}
                          <div>
                              <h3 className="text-lg font-bold text-white">{selectedPost.title}</h3>
                              <p className="text-xs text-zinc-500 capitalize">{selectedPost.type} • {selectedPost.status}</p>
                          </div>
                      </div>
                      <div className="flex gap-2">
                          <button className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-zinc-800 rounded text-zinc-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Preview</span>
                          <span className="text-xs font-mono text-zinc-400">{selectedPost.date} às {selectedPost.time}</span>
                      </div>
                      <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-zinc-600 border border-zinc-800">
                          {selectedPost.image ? <ImageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                      </div>
                      <p className="mt-4 text-sm text-zinc-300 font-serif leading-relaxed">
                          {selectedPost.title} - Este é um texto simulado para visualização do conteúdo do post selecionado. Em uma implementação real, o conteúdo completo estaria aqui.
                      </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Engajamento</p>
                          <p className="text-xl font-bold text-white">{selectedPost.engagement}</p>
                      </div>
                      <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                          <p className="text-xs text-zinc-500 uppercase font-bold mb-1">Cliques</p>
                          <p className="text-xl font-bold text-white">342</p>
                      </div>
                  </div>

                  <div className="flex justify-end pt-4">
                      <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>Fechar</Button>
                  </div>
              </div>
          )}
      </Modal>
    </div>
  );
};
