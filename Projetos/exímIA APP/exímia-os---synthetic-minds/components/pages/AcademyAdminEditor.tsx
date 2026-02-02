
import React, { useState, useRef, useEffect } from 'react';
import { ACADEMY_COURSES, ACADEMY_LESSONS } from '../../constants';
import { AcademyLesson } from '../../types';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { 
    ChevronLeft, 
    Save, 
    Eye, 
    Plus, 
    Trash2, 
    GripVertical, 
    Video, 
    FileText, 
    Layout, 
    Settings,
    Image as ImageIcon,
    Sparkles,
    Wand2,
    Bot,
    MessageSquarePlus,
    ListChecks,
    RefreshCw,
    Maximize2,
    PanelRightClose,
    PanelRightOpen,
    Zap,
    X,
    Upload
} from 'lucide-react';

interface AcademyAdminEditorProps {
    courseId: string;
    onBack: () => void;
}

// Mock AI Generators
const AI_PROMPTS = {
    outline: (title: string) => `# ${title}\n\n## 1. Introdução\n- Contexto do problema\n- Por que isso importa?\n\n## 2. Conceito Chave\n- Definição\n- Exemplo prático\n\n## 3. Aplicação\n- Passo a passo\n- Erros comuns\n\n## 4. Conclusão\n- Recapitulação\n- Próximos passos`,
    socratic: (content: string) => `> "O conhecimento não pode ser forçado; deve ser descoberto."\n\n${content}\n\n### Reflexão Guiada\n1. Com base no que vimos, qual seria a consequência imediata de ignorar este princípio?\n2. Como isso se conecta com sua experiência anterior?`,
    quiz: () => `## Quiz de Fixação\n\n**Pergunta 1:** Qual o principal objetivo desta técnica?\na) Aumentar complexidade\nb) Reduzir risco (Correta)\nc) Gerar leads\n\n**Pergunta 2:** O que define um bom MVP?\na) Funcionalidades completas\nb) Design perfeito\nc) Validação de hipótese (Correta)`
};

export const AcademyAdminEditor: React.FC<AcademyAdminEditorProps> = ({ courseId, onBack }) => {
    const course = ACADEMY_COURSES.find(c => c.id === courseId);
    
    // State
    const [lessons, setLessons] = useState<AcademyLesson[]>(
        ACADEMY_LESSONS.filter(l => l.courseId === courseId).sort((a,b) => a.order - b.order)
    );
    const [selectedLessonId, setSelectedLessonId] = useState<string | null>(lessons[0]?.id || null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    // Course Settings State
    const [coverImage, setCoverImage] = useState<string | null>(null);
    
    // AI State
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiContext, setAiContext] = useState('');

    const activeLesson = lessons.find(l => l.id === selectedLessonId);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    if (!course) return <div>Course not found</div>;

    // --- Handlers ---

    const handleLessonChange = (field: keyof AcademyLesson, value: any) => {
        if (!selectedLessonId) return;
        setLessons(prev => prev.map(l => 
            l.id === selectedLessonId ? { ...l, [field]: value } : l
        ));
        setHasUnsavedChanges(true);
    };

    const handleAddLesson = () => {
        const newLesson: AcademyLesson = {
            id: Math.random().toString(36).substr(2, 9),
            courseId: courseId,
            title: 'Nova Aula (Rascunho)',
            order: lessons.length + 1,
            content: '',
            durationMinutes: 0,
            status: 'locked'
        };
        setLessons([...lessons, newLesson]);
        setSelectedLessonId(newLesson.id);
        setHasUnsavedChanges(true);
    };

    const handleDeleteLesson = (id: string) => {
        if (confirm('Tem certeza que deseja deletar esta aula?')) {
            const newLessons = lessons.filter(l => l.id !== id);
            setLessons(newLessons);
            if (selectedLessonId === id) setSelectedLessonId(newLessons[0]?.id || null);
            setHasUnsavedChanges(true);
        }
    };

    const handleSave = () => {
        setHasUnsavedChanges(false);
        // Mock save toast
        const btn = document.getElementById('save-btn');
        if(btn) {
            const originalText = btn.innerText;
            btn.innerText = 'Salvo!';
            setTimeout(() => btn.innerText = originalText, 2000);
        }
    };

    const handleCoverUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setCoverImage(event.target?.result as string);
                    setHasUnsavedChanges(true);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    // --- AI Simulation Logic ---

    const simulateStreaming = async (text: string) => {
        if (!activeLesson) return;
        setIsGenerating(true);
        
        let currentContent = activeLesson.content;
        // Add double newline if not empty
        if (currentContent) currentContent += '\n\n';

        const chunks = text.split('');
        
        for (let i = 0; i < chunks.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 15)); // Typing speed
            currentContent += chunks[i];
            handleLessonChange('content', currentContent);
            
            // Auto scroll to bottom
            if (textAreaRef.current) {
                textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
            }
        }
        
        setIsGenerating(false);
    };

    const runAITask = (task: 'outline' | 'socratic' | 'quiz') => {
        if (!activeLesson) return;
        
        let generatedText = '';
        switch(task) {
            case 'outline':
                generatedText = AI_PROMPTS.outline(activeLesson.title);
                break;
            case 'socratic':
                generatedText = AI_PROMPTS.socratic(activeLesson.content);
                break;
            case 'quiz':
                generatedText = AI_PROMPTS.quiz();
                break;
        }
        
        simulateStreaming(generatedText);
    };

    return (
        <div className="flex h-screen bg-[#050505] text-zinc-200 overflow-hidden font-sans">
            
            {/* 1. Navigation Sidebar (Left) */}
            <div className={`
                ${isSidebarOpen ? 'w-72' : 'w-0'} 
                border-r border-[#1F1F22] bg-[#0A0A0A] flex flex-col shrink-0 transition-all duration-300 overflow-hidden
            `}>
                <div className="p-4 border-b border-[#1F1F22] flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <button onClick={onBack} className="p-1 hover:bg-zinc-800 rounded-md transition-colors text-zinc-400 hover:text-white">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Editando Curso</p>
                            <h2 className="font-bold text-sm text-white truncate" title={course.title}>{course.title}</h2>
                        </div>
                    </div>

                    {/* Cover Image Upload Area in Sidebar */}
                    <div 
                        onClick={handleCoverUpload}
                        className="h-24 w-full bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center cursor-pointer hover:border-amber-500/50 transition-all relative overflow-hidden group"
                    >
                        {coverImage ? (
                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-zinc-500 group-hover:text-amber-500">
                                <ImageIcon className="w-6 h-6" />
                                <span className="text-[9px] uppercase font-bold">Alterar Capa</span>
                            </div>
                        )}
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Upload className="w-5 h-5 text-white" />
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleAddLesson}
                        className="w-full py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Nova Aula
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                    {lessons.map((lesson, index) => (
                        <div 
                            key={lesson.id}
                            onClick={() => setSelectedLessonId(lesson.id)}
                            className={`
                                group relative w-full text-left p-3 rounded-lg flex items-center gap-3 cursor-pointer border transition-all
                                ${lesson.id === selectedLessonId 
                                    ? 'bg-zinc-900 border-zinc-700' 
                                    : 'border-transparent hover:bg-zinc-900/50 hover:border-zinc-800'}
                            `}
                        >
                            <div className="text-zinc-600 group-hover:text-zinc-400 cursor-grab">
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${lesson.id === selectedLessonId ? 'text-white' : 'text-zinc-400'}`}>
                                    {index + 1}. {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${lesson.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {lesson.status}
                                    </span>
                                    {lesson.content.length > 50 && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Contém conteúdo" />
                                    )}
                                </div>
                            </div>
                            {lesson.id === selectedLessonId && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson.id); }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-900/30 text-zinc-500 hover:text-rose-500 rounded transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Main Editor Area (Center) */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative">
                
                {/* Top Bar */}
                <div className="h-16 border-b border-[#1F1F22] flex items-center justify-between px-6 bg-[#0A0A0A]/80 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-zinc-500 hover:text-white transition-colors">
                            <Layout className="w-5 h-5" />
                        </button>
                        <div className="h-6 w-[1px] bg-zinc-800" />
                        
                        {/* Title Input inside Header */}
                        {activeLesson ? (
                            <input 
                                type="text"
                                value={activeLesson.title}
                                onChange={(e) => handleLessonChange('title', e.target.value)}
                                className="bg-transparent border-none text-sm font-bold text-white focus:ring-0 w-64 placeholder-zinc-600"
                                placeholder="Título da Aula"
                            />
                        ) : <span className="text-sm font-bold text-zinc-500">Selecione uma aula</span>}
                    </div>

                    <div className="flex items-center gap-3">
                        {hasUnsavedChanges && (
                            <span className="text-xs text-amber-500 italic mr-2 flex items-center gap-1 animate-pulse">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Não salvo
                            </span>
                        )}
                        
                        <div className="h-6 w-[1px] bg-zinc-800 mx-2" />

                        <button 
                            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${isAIPanelOpen ? 'bg-minds-500/10 text-minds-400 border border-minds-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                        >
                            <Sparkles className="w-4 h-4" /> AI Copilot
                        </button>

                        <button 
                            id="save-btn"
                            onClick={handleSave}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg text-xs font-bold hover:bg-white transition-colors shadow-lg"
                        >
                            <Save className="w-4 h-4" /> Salvar
                        </button>
                    </div>
                </div>

                {/* Editor Body */}
                {activeLesson ? (
                    <div className="flex-1 overflow-hidden flex flex-col relative">
                        
                        {/* Toolbar */}
                        <div className="border-b border-[#1F1F22] p-2 flex items-center gap-1 bg-[#0A0A0A]">
                            <div className="flex items-center gap-1 px-2">
                                {['B', 'I', 'U'].map(btn => (
                                    <button key={btn} className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded text-xs font-serif font-bold">
                                        {btn}
                                    </button>
                                ))}
                            </div>
                            <div className="w-[1px] h-4 bg-zinc-800 mx-2" />
                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors">
                                <ImageIcon className="w-3.5 h-3.5" /> Mídia
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors">
                                <Video className="w-3.5 h-3.5" /> Embed
                            </button>
                            
                            <div className="ml-auto flex items-center gap-2">
                                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider">
                                    {activeLesson.content.length} chars
                                </span>
                            </div>
                        </div>

                        {/* Text Area */}
                        <textarea 
                            ref={textAreaRef}
                            value={activeLesson.content}
                            onChange={(e) => handleLessonChange('content', e.target.value)}
                            className="flex-1 w-full bg-[#050505] p-8 text-base text-zinc-300 font-serif leading-relaxed focus:outline-none resize-none custom-scrollbar selection:bg-minds-500/30 selection:text-minds-200"
                            placeholder="Comece a escrever o conteúdo da aula ou use o Copilot..."
                            spellCheck={false}
                        />

                        {/* Floating "Generate" Indicator */}
                        {isGenerating && (
                            <div className="absolute bottom-8 right-8 bg-black/80 backdrop-blur-md border border-minds-500/30 text-minds-400 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-2 fade-in">
                                <Sparkles className="w-4 h-4 animate-spin-slow" />
                                Gerando conteúdo...
                                <button 
                                    onClick={() => setIsGenerating(false)}
                                    className="ml-2 hover:text-white"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <Settings className="w-12 h-12 mb-4 opacity-20" />
                        <p>Selecione uma aula para editar.</p>
                    </div>
                )}
            </div>

            {/* 3. AI Copilot Sidebar (Right) */}
            <div className={`
                ${isAIPanelOpen ? 'w-80 border-l' : 'w-0'} 
                border-[#1F1F22] bg-[#0A0A0A] flex flex-col shrink-0 transition-all duration-300 overflow-hidden relative z-30
            `}>
                <div className="p-4 border-b border-[#1F1F22] flex items-center justify-between bg-zinc-900/30">
                    <div className="flex items-center gap-2 text-minds-400">
                        <Bot className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">AI Copilot</span>
                    </div>
                    <button onClick={() => setIsAIPanelOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                        <PanelRightClose className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {/* Context Context */}
                    <div className="mb-6 p-3 rounded-lg bg-minds-900/10 border border-minds-500/20">
                        <p className="text-[10px] font-bold text-minds-500 uppercase tracking-wider mb-1">Contexto Ativo</p>
                        <p className="text-xs text-zinc-400 line-clamp-2">
                            Curso: {course.title} <br/>
                            Aula: {activeLesson?.title}
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Geração</h3>
                            <div className="grid grid-cols-1 gap-2">
                                <button 
                                    onClick={() => runAITask('outline')}
                                    disabled={!activeLesson || isGenerating}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-minds-500/50 hover:bg-zinc-800 text-left transition-all group"
                                >
                                    <div className="p-2 rounded bg-zinc-800 text-zinc-400 group-hover:text-minds-400 group-hover:bg-zinc-900 transition-colors">
                                        <ListChecks className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-200">Criar Roteiro</p>
                                        <p className="text-[10px] text-zinc-500">Estrutura de tópicos</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => runAITask('socratic')}
                                    disabled={!activeLesson || isGenerating}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-minds-500/50 hover:bg-zinc-800 text-left transition-all group"
                                >
                                    <div className="p-2 rounded bg-zinc-800 text-zinc-400 group-hover:text-minds-400 group-hover:bg-zinc-900 transition-colors">
                                        <RefreshCw className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-200">Tom Socrático</p>
                                        <p className="text-[10px] text-zinc-500">Reescrever como diálogo</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => runAITask('quiz')}
                                    disabled={!activeLesson || isGenerating}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-minds-500/50 hover:bg-zinc-800 text-left transition-all group"
                                >
                                    <div className="p-2 rounded bg-zinc-800 text-zinc-400 group-hover:text-minds-400 group-hover:bg-zinc-900 transition-colors">
                                        <MessageSquarePlus className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-200">Gerar Quiz</p>
                                        <p className="text-[10px] text-zinc-500">Baseado no conteúdo</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Chat Assistant</h3>
                            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 min-h-[150px] flex flex-col justify-end">
                                <p className="text-xs text-zinc-500 text-center mb-4">
                                    Peça sugestões específicas ou exemplos...
                                </p>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="Ex: Me dê um exemplo de..."
                                        className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-minds-500/50"
                                    />
                                    <button className="absolute right-2 top-1.5 text-minds-500 hover:text-white">
                                        <Zap className="w-3 h-3 fill-current" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};
