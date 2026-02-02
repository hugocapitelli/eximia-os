
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_BLUEPRINT, MOCK_COURSES_LIST } from '../../constants';
import { CourseBlueprint, CourseModule } from '../../types';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
// Removed Modal import
import { 
  PenSquare, 
  Folder, 
  FileText, 
  Search, 
  ShieldCheck,
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Play, 
  Pencil, 
  ChevronDown, 
  Layout, 
  RefreshCw, 
  Zap, 
  MoreHorizontal, 
  Filter, 
  Users, 
  Timer, 
  Sparkles, 
  ArrowRight, 
  Target,
  Brain,
  Cpu,
  Activity,
  Layers,
  BarChart,
  ArrowLeft,
  Check,
  AlertTriangle,
  Plus,
  Heart,
  Lightbulb,
  Compass,
  PanelRightClose,
  PanelRightOpen,
  Bot,
  MessageSquarePlus,
  X,
  ListChecks,
  Wand2,
  Save,
  Download,
  Share2,
  FileJson,
  Upload,
  Globe,
  Lock,
  Tag,
  Image as ImageIcon,
  Settings,
  Video,
  GripVertical,
  Trash2,
  FileVideo,
  Link as LinkIcon
} from 'lucide-react';

// --- Types ---

type ViewState = 'dashboard' | 'wizard' | 'generating' | 'blueprint' | 'editor' | 'export' | 'content-stage' | 'publish';

interface WizardData {
    // 1. Ponto de Partida
    title: string;
    syllabusScope: string; // O que entra e não entra
    duration: string;
    format: string; // Híbrido, Ativo, etc.
    
    // 2 & 3. Persona & Empatia
    targetAudience: string;
    personaContext: string;
    pains: string;
    desires: string;

    // 4. Resultados Mensuráveis
    smartGoal: string;
    deliverables: string; // Produtos finais

    // 5. Competências (CHA-V)
    skills: string; // Habilidades (verbos)
    attitudes: string; // Postura/Valores

    // 6. Diagnóstico Contextual
    contextCurrent: string; // Hoje
    contextFuture: string; // Amanhã
}

const INITIAL_WIZARD_DATA: WizardData = {
    title: '',
    syllabusScope: '',
    duration: '',
    format: 'Híbrido / Ativo',
    targetAudience: '',
    personaContext: '',
    pains: '',
    desires: '',
    smartGoal: '',
    deliverables: '',
    skills: '',
    attitudes: '',
    contextCurrent: '',
    contextFuture: ''
};

// --- Mock AI Prompts for LXD ---
const LXD_AI_PROMPTS = {
    activities: (stage: string, context: string) => `Sugestão de Atividades para ${stage}:\n1. [Ativa] Estudo de caso interativo sobre ${context}.\n2. [Reflexiva] Debate em pares: "O que faria diferente?".\n3. [Prática] Simulação rápida do cenário.`,
    objectives: (topic: string) => `Objetivos de Aprendizagem (Bloom):\n- Analisar os componentes críticos de ${topic}.\n- Criar um protótipo funcional de solução.\n- Avaliar trade-offs em cenários de alta pressão.`,
    tension: (current: string) => `Refinamento de Tensão:\n"${current}"\n\nSugestão Mais Forte:\n"Você tem 24h para escalar ou seu concorrente compra sua empresa por centavos."`
};

// --- Components ---

const StepIndicator: React.FC<{ currentStep: number; totalSteps: number }> = ({ currentStep, totalSteps }) => {
    return (
        <div className="flex items-center justify-center gap-2 mb-8">
            {[...Array(totalSteps)].map((_, i) => (
                <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= currentStep ? 'w-8 bg-cyan-500' : 'w-2 bg-zinc-800'}`}
                />
            ))}
        </div>
    );
};

const QualityScorecard: React.FC<{ score: any }> = ({ score }) => {
    const getRatingColor = (rating: string) => {
        if (rating === 'EXCELLENT') return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10';
        if (rating === 'GOOD') return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
        return 'text-amber-500 border-amber-500/30 bg-amber-500/10';
    };

    return (
        <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-lg">
            <div className="flex justify-between items-start mb-6 z-10">
                <div>
                    <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-2">Quality Score</h3>
                    <div className={`inline-flex items-center px-3 py-1 rounded text-xs font-bold border ${getRatingColor(score.rating)}`}>
                        {score.rating}
                    </div>
                </div>
                <div className="text-5xl font-bold text-white tracking-tighter">{score.overall}</div>
            </div>

            <div className="space-y-5 z-10">
                {Object.entries(score.dimensions).map(([key, value]: [string, any]) => (
                    <div key={key}>
                        <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500 mb-1.5">
                            <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className={value >= 90 ? 'text-emerald-500' : 'text-zinc-400'}>{value}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ease-out ${value >= 90 ? 'bg-emerald-500' : value >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`} 
                                style={{ width: `${value}%` }} 
                            />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Background Decorative */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-tl from-emerald-900/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        </div>
    );
};

const ProblemMotorCard: React.FC<{ module: CourseModule; onClick: () => void }> = ({ module, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="group flex flex-col bg-[#121214] border border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-zinc-900/80 h-full relative overflow-hidden shadow-lg hover:shadow-cyan-900/10 hover:-translate-y-1"
        >
            {/* Hover Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none -mr-10 -mt-10" />

            <div className="flex justify-between items-start mb-5 relative z-10">
                <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-600 transition-colors">
                    MÓDULO {module.moduleNumber}
                </Badge>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800">
                    <Clock className="w-3 h-3" />
                    {module.durationHours}h
                </div>
            </div>
            
            <h4 className="text-lg font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
                {module.title}
            </h4>
            
            <div className="bg-black/40 border border-zinc-800/80 rounded-xl p-5 relative overflow-hidden flex-1 flex flex-col group-hover:border-zinc-700 transition-colors">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                
                <div className="mb-4">
                    <p className="text-[9px] font-bold text-cyan-600 group-hover:text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5 transition-colors">
                        <RefreshCw className="w-3 h-3" /> Motor do Problema
                    </p>
                    <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">{module.problemMotor.title}</p>
                </div>

                <p className="text-xs text-zinc-400 font-serif italic leading-relaxed mb-6 flex-1 border-l-2 border-zinc-800 pl-3 py-1">
                    "{module.problemMotor.scenario}"
                </p>

                <div className="grid grid-cols-1 gap-2 mt-auto">
                    <div className="bg-zinc-900/80 rounded px-3 py-2 border border-zinc-800 flex justify-between items-center group-hover:bg-zinc-900 transition-colors">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Tensão</p>
                        <p className="text-sm text-zinc-300 font-medium truncate ml-2 max-w-[140px]" title={module.problemMotor.tension}>{module.problemMotor.tension}</p>
                    </div>
                    <div className="bg-zinc-900/80 rounded px-3 py-2 border border-zinc-800 flex justify-between items-center group-hover:bg-zinc-900 transition-colors">
                        <p className="text-[8px] text-zinc-500 uppercase font-bold tracking-wider">Entrega</p>
                        <p className="text-sm text-zinc-300 font-medium truncate ml-2 max-w-[140px]" title={module.problemMotor.deliverable}>{module.problemMotor.deliverable}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Jornada ELC+</span>
                    <div className="flex gap-1">
                        {[1,2,3,4,5,6].map(i => (
                            <div 
                                key={i} 
                                className={`w-8 h-1 rounded-full transition-colors ${i <= (module.elcStructure?.length || 6) ? 'bg-cyan-600 group-hover:bg-cyan-400' : 'bg-zinc-800'}`} 
                                title={`Stage ${i}`} 
                            />
                        ))}
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:text-cyan-400 text-zinc-500 transition-all group-hover:scale-110">
                    <ChevronRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};

const EngineProcessing: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const steps = [
        { id: '1', label: 'Mapeando Persona & Empatia...', icon: Users },
        { id: '2', label: 'Definindo Resultados Mensuráveis (SMART)...', icon: Target },
        { id: '3', label: 'Desdobrando Competências (CHA-V)...', icon: Layers },
        { id: '4', label: 'Roteirizando Jornada Experiencial (Kolb)...', icon: Activity },
        { id: '5', label: 'Validando Consistência Pedagógica...', icon: ShieldCheck },
    ];

    useEffect(() => {
        if (step < steps.length) {
            const timeout = setTimeout(() => setStep(step + 1), 800); // 800ms per step
            return () => clearTimeout(timeout);
        } else {
            const timeout = setTimeout(onComplete, 500);
            return () => clearTimeout(timeout);
        }
    }, [step]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[600px] max-w-2xl mx-auto">
            <div className="relative mb-12">
                <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 relative z-10">
                    <Brain className="w-10 h-10 text-cyan-500 animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl animate-pulse" />
                
                {/* Orbital particles */}
                <div className="absolute inset-0 animate-spin-slow opacity-30">
                    <div className="w-3 h-3 bg-white rounded-full absolute -top-4 left-1/2" />
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight">LXD Engine Processing</h2>

            <div className="w-full space-y-3">
                {steps.map((s, idx) => (
                    <div 
                        key={s.id} 
                        className={`
                            flex items-center gap-4 p-4 rounded-xl border transition-all duration-500
                            ${idx === step 
                                ? 'bg-cyan-950/30 border-cyan-500/30 text-white scale-105 shadow-glow' 
                                : idx < step 
                                    ? 'bg-[#121214] border-zinc-800 text-zinc-500' 
                                    : 'opacity-30 border-transparent'}
                        `}
                    >
                        <div className={`p-2 rounded-lg ${idx === step ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-900'}`}>
                            {idx < step ? <Check className="w-5 h-5 text-emerald-500" /> : <s.icon className="w-5 h-5" />}
                        </div>
                        <span className="font-mono text-sm tracking-wide">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ElcStageEditor: React.FC<{ 
    stage: string; 
    percentage: number; 
    color: string; 
    verb: string;
    onGenerate: () => void;
    onManualUpdate: (content: string) => void;
    generatedContent?: string;
}> = ({ stage, percentage, color, verb, onGenerate, onManualUpdate, generatedContent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempContent, setTempContent] = useState('');

    useEffect(() => {
        setTempContent(generatedContent || '');
    }, [generatedContent]);

    const handleSave = () => {
        onManualUpdate(tempContent);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempContent(generatedContent || '');
        setIsEditing(false);
    };

    return (
        <div className="flex gap-4 p-4 border-l-2 border-zinc-800 hover:border-zinc-600 transition-colors group items-start">
            <div className="w-32 shrink-0 pt-1">
                <div className={`text-[10px] font-bold px-2 py-1 rounded w-fit mb-2 ${color} bg-opacity-10 border border-opacity-20`}>
                    {percentage}% | {verb}
                </div>
                <h4 className="text-sm font-bold text-zinc-300">{stage}</h4>
            </div>
            
            <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-lg p-3 group-hover:bg-zinc-900 transition-colors relative">
                
                {isEditing ? (
                    <div className="space-y-3 animate-in fade-in">
                        <textarea 
                            value={tempContent}
                            onChange={(e) => setTempContent(e.target.value)}
                            className="w-full bg-black/30 border border-zinc-700 rounded-md p-3 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 resize-none h-32"
                            placeholder="Descreva a atividade..."
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={handleCancel}
                                className="px-3 py-1.5 rounded text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleSave}
                                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-zinc-700 transition-colors flex items-center gap-1"
                            >
                                <Check className="w-3 h-3" /> Salvar
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {generatedContent ? (
                            <div className="relative">
                                <div className="text-xs text-zinc-300 whitespace-pre-wrap animate-in fade-in leading-relaxed pr-6">
                                    {generatedContent}
                                </div>
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="absolute top-0 right-0 p-1 text-zinc-500 hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Editar Atividade"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <p className="text-xs text-zinc-500 italic mb-1">Nenhuma atividade definida.</p>
                                <div className="flex gap-2">
                                    <div 
                                        onClick={onGenerate}
                                        className="h-8 flex-1 border-2 border-dashed border-zinc-800 rounded flex items-center justify-center text-zinc-600 text-xs hover:border-cyan-500/50 hover:text-cyan-500 cursor-pointer transition-all hover:bg-cyan-500/5"
                                    >
                                        <Sparkles className="w-3 h-3 mr-2" /> Gerar com IA
                                    </div>
                                    <div 
                                        onClick={() => setIsEditing(true)}
                                        className="h-8 w-8 border-2 border-dashed border-zinc-800 rounded flex items-center justify-center text-zinc-600 text-xs hover:border-zinc-600 hover:text-white cursor-pointer transition-all hover:bg-zinc-800"
                                        title="Adicionar Manualmente"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

// --- Main Pages ---

export const CourseDesigner: React.FC = () => {
    const [view, setView] = useState<ViewState>('dashboard');
    
    // Wizard State
    const [wizardStep, setWizardStep] = useState(1);
    const [wizardData, setWizardData] = useState<WizardData>(INITIAL_WIZARD_DATA);
    
    // Module Selection
    const [selectedModule, setSelectedModule] = useState<number | null>(null);
    
    // AI & Editor State
    const [blueprint, setBlueprint] = useState<CourseBlueprint>(MOCK_BLUEPRINT);
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedStages, setGeneratedStages] = useState<Record<string, string>>({});
    
    // New Content Editor State
    const [stagedLessons, setStagedLessons] = useState<{
        id: string, 
        title: string, 
        content: string, 
        videoUrl: string, 
        videoFile?: File | null,
        activeTab?: 'link' | 'upload' 
    }[]>([]);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    // Initialize staged lessons based on blueprint modules
    useEffect(() => {
        if (blueprint) {
            const lessons = blueprint.modules.map((m, idx) => ({
                id: `l-${idx}`,
                title: m.title,
                content: `Conteúdo base gerado para: ${m.problemMotor.scenario}`,
                videoUrl: '',
                videoFile: null,
                activeTab: 'link' as 'link' | 'upload'
            }));
            setStagedLessons(lessons);
        }
    }, [blueprint]);

    const handleStartWizard = () => {
        setWizardStep(1);
        setWizardData(INITIAL_WIZARD_DATA);
        setView('wizard');
    };
    
    const handleCloseWizard = () => {
        setView('dashboard');
    };

    const handleNextStep = () => {
        if (wizardStep < 4) {
            setWizardStep(wizardStep + 1);
        } else {
            setView('generating');
        }
    };

    const handlePrevStep = () => {
        if (wizardStep > 1) setWizardStep(wizardStep - 1);
    };
    
    const handleGenerationComplete = () => {
        // Here we would typically update the blueprint with wizard data
        setView('blueprint');
    };

    // New handler to open existing project
    const handleOpenProject = (course: any) => {
        // We'll update the wizardData to simulate viewing this specific course
        setWizardData({
            ...INITIAL_WIZARD_DATA,
            title: course.title,
            duration: `${course.modules * 4} horas (Estimado)`,
            targetAudience: 'Público Geral', // Mock
        });
        setView('blueprint');
    };

    const handleModuleSelect = (moduleNumber: number) => {
        setSelectedModule(moduleNumber);
        setGeneratedStages({}); // Reset generation for new module
        setView('editor');
    };

    const handleApproveBlueprint = () => {
        setView('export');
    };

    const handleGoToContentStage = () => {
        setView('content-stage');
    };

    const handleGoToFinalPublish = () => {
        setView('publish');
    };

    const handleFinalPublish = () => {
        // Simulating Publish action
        const btn = document.getElementById('publish-btn');
        if (btn) {
            btn.innerHTML = '<span class="animate-spin mr-2">⏳</span> Processando...';
            setTimeout(() => {
                alert("Curso enviado para o Academy com sucesso!");
                setView('dashboard');
            }, 1500);
        }
    };

    const handleImageUpload = () => {
        // Simulate file upload
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setCoverImage(event.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    const simulateGeneration = async (key: string, text: string) => {
        setIsGenerating(true);
        let currentText = '';
        const chunks = text.split('');
        
        // Simular typing
        for (let i = 0; i < chunks.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 5));
            currentText += chunks[i];
            setGeneratedStages(prev => ({ ...prev, [key]: currentText }));
        }
        setIsGenerating(false);
    };

    const handleGenerateActivity = (stageName: string, moduleContext: string) => {
        const text = LXD_AI_PROMPTS.activities(stageName, moduleContext);
        simulateGeneration(stageName, text);
    };

    const handleManualActivityUpdate = (stageName: string, content: string) => {
        setGeneratedStages(prev => ({ ...prev, [stageName]: content }));
    };

    const updateStagedLesson = (id: string, field: 'content' | 'videoUrl' | 'videoFile' | 'activeTab', value: any) => {
        setStagedLessons(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    };

    const handleLessonVideoUpload = (lessonId: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                updateStagedLesson(lessonId, 'videoFile', file);
            }
        };
        input.click();
    };

    // --- MAIN RENDER ---
    return (
        <>
            {/* --- DASHBOARD VIEW --- */}
            {view === 'dashboard' && (
                <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
                    {/* Header */}
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Course Designer <span className="text-sm font-normal text-zinc-500 ml-2">LXD Engine</span></h1>
                            <p className="text-zinc-400 mt-2 text-lg font-serif">Engine de arquitetura pedagógica baseado na Roda de Experiências (Kolb).</p>
                        </div>
                        <Button onClick={handleStartWizard} icon={<Sparkles className="w-4 h-4" />} className="bg-cyan-600 hover:bg-cyan-500 text-white border-transparent shadow-[0_0_20px_rgba(8,145,178,0.4)]">
                            Novo Blueprint LXD
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        {[
                            { label: 'Cursos Gerados', value: '12', icon: Folder },
                            { label: 'Avg Quality Score', value: '94.2', icon: ShieldCheck },
                            { label: 'Retenção Média', value: '88%', icon: Activity },
                            { label: 'Tempo Economizado', value: '340h', icon: Clock },
                        ].map((stat, i) => (
                            <div key={i} className="bg-[#121214] border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                </div>
                                <div className="p-3 rounded-lg bg-zinc-900 text-zinc-500">
                                    <stat.icon className="w-5 h-5" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Projects */}
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Projetos Recentes
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {MOCK_COURSES_LIST.slice(0, 3).map(course => (
                            <div 
                                key={course.id} 
                                onClick={() => handleOpenProject(course)}
                                className="bg-[#121214] border border-zinc-800 rounded-xl p-6 hover:border-zinc-600 transition-colors group cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-lg bg-zinc-900 ${course.status === 'PUBLICADO' ? 'text-emerald-500' : 'text-cyan-500'}`}>
                                        <course.icon className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="text-[10px]">{course.status}</Badge>
                                </div>
                                <h4 className="text-lg font-bold text-zinc-200 mb-2 group-hover:text-white transition-colors">{course.title}</h4>
                                <div className="flex items-center gap-4 text-xs text-zinc-500">
                                    <span>{course.modules} Módulos</span>
                                    <span>•</span>
                                    <span>{course.lessons} Aulas</span>
                                    <span>•</span>
                                    <span>Atualizado {course.lastUpdated}</span>
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
                            <StepIndicator currentStep={wizardStep} totalSteps={4} />
                            
                            {wizardStep === 1 && (
                                <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <h2 className="text-2xl font-bold text-white mb-6">1. Ponto de Partida</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-400 mb-2">Título / Tema</label>
                                            <input 
                                                type="text" 
                                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors" 
                                                value={wizardData.title} 
                                                onChange={e => setWizardData({...wizardData, title: e.target.value})} 
                                                placeholder="Ex: Liderança Socrática" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-zinc-400 mb-2">Escopo da Ementa</label>
                                            <textarea 
                                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-xl px-4 py-3 text-white h-32 focus:outline-none focus:border-cyan-500 transition-colors resize-none" 
                                                value={wizardData.syllabusScope} 
                                                onChange={e => setWizardData({...wizardData, syllabusScope: e.target.value})} 
                                                placeholder="O que será abordado? O que não será?" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {wizardStep > 1 && (
                                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in py-10">
                                    <div className="p-8 bg-zinc-900/50 border border-zinc-800 border-dashed rounded-2xl max-w-md">
                                        <Zap className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-zinc-300 mb-2">Step {wizardStep} Placeholder</h3>
                                        <p className="text-zinc-400 text-sm">
                                            Simulating configuration for step {wizardStep}. Click next to proceed.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-8 mt-8 border-t border-zinc-800 flex justify-between">
                                <Button onClick={handlePrevStep} variant="ghost" disabled={wizardStep === 1}>Anterior</Button>
                                <Button onClick={handleNextStep} variant="primary" className="bg-white text-black hover:bg-zinc-200 px-8">
                                    {wizardStep === 4 ? 'Processar Blueprint' : 'Próximo'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- GENERATING VIEW --- */}
            {view === 'generating' && (
                <div className="min-h-screen flex items-center justify-center bg-[#050505]">
                    <EngineProcessing onComplete={handleGenerationComplete} />
                </div>
            )}

            {/* --- EXPORT VIEW (Post-Approval) --- */}
            {view === 'export' && (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#050505] animate-in fade-in zoom-in-95 duration-500">
                    <div className="max-w-2xl w-full text-center">
                        <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                            <Check className="w-12 h-12 text-emerald-500" />
                        </div>
                        
                        <h1 className="text-4xl font-bold text-white mb-4">Blueprint Aprovado!</h1>
                        <p className="text-zinc-400 text-lg mb-12">
                            A estrutura pedagógica foi validada. O que você deseja fazer agora?
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <button className="flex flex-col items-center justify-center p-6 bg-[#121214] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group">
                                <FileJson className="w-8 h-8 text-zinc-500 group-hover:text-white mb-3 transition-colors" />
                                <span className="text-sm font-bold text-zinc-300">Exportar JSON</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 bg-[#121214] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group">
                                <Download className="w-8 h-8 text-zinc-500 group-hover:text-white mb-3 transition-colors" />
                                <span className="text-sm font-bold text-zinc-300">Baixar PDF</span>
                            </button>
                            <button className="flex flex-col items-center justify-center p-6 bg-[#121214] border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all group">
                                <Share2 className="w-8 h-8 text-zinc-500 group-hover:text-white mb-3 transition-colors" />
                                <span className="text-sm font-bold text-zinc-300">Copiar Link Notion</span>
                            </button>
                            <button 
                                onClick={handleGoToContentStage}
                                className="flex flex-col items-center justify-center p-6 bg-cyan-900/20 border border-cyan-500/30 rounded-xl hover:bg-cyan-900/30 hover:border-cyan-500 transition-all group shadow-lg shadow-cyan-900/10"
                            >
                                <Upload className="w-8 h-8 text-cyan-500 mb-3" />
                                <span className="text-sm font-bold text-cyan-400">Enviar para Academy</span>
                            </button>
                        </div>

                        <button 
                            onClick={() => setView('dashboard')}
                            className="text-zinc-500 hover:text-zinc-300 text-sm font-medium"
                        >
                            Voltar ao Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* --- CONTENT STAGING VIEW --- */}
            {view === 'content-stage' && (
                <div className="min-h-screen bg-[#050505] flex flex-col p-8 animate-in slide-in-from-right-8 duration-500">
                    <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setView('export')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Edição de Conteúdo</h1>
                                    <p className="text-zinc-400 text-sm">Adicione textos e vídeos às aulas geradas.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" icon={<Save className="w-4 h-4" />}>Salvar Rascunho</Button>
                                <Button onClick={handleGoToFinalPublish} variant="primary" icon={<ArrowRight className="w-4 h-4" />}>Avançar para Publicação</Button>
                            </div>
                        </div>

                        <div className="flex-1 bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden flex">
                            {/* Sidebar List */}
                            <div className="w-80 border-r border-zinc-800 bg-[#0A0A0A] overflow-y-auto p-4 space-y-2">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 pl-2">Estrutura do Curso</h3>
                                {stagedLessons.map((lesson, idx) => (
                                    <div key={lesson.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-cyan-500/50 cursor-pointer group">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xs font-bold text-zinc-400 group-hover:text-white">Aula {idx + 1}</span>
                                            {(lesson.videoUrl || lesson.videoFile) && <Video className="w-3 h-3 text-cyan-500" />}
                                        </div>
                                        <p className="text-sm text-zinc-300 truncate">{lesson.title}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Editor Area */}
                            <div className="flex-1 p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {stagedLessons.map((lesson) => (
                                        <div key={lesson.id} className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6 mb-6">
                                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-cyan-500" /> {lesson.title}
                                            </h3>
                                            
                                            <div className="space-y-6">
                                                {/* Video Source Selection */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">Fonte de Vídeo</label>
                                                        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                                                            <button 
                                                                onClick={() => updateStagedLesson(lesson.id, 'activeTab', 'link')}
                                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1.5 ${(!lesson.activeTab || lesson.activeTab === 'link') ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                            >
                                                                <LinkIcon className="w-3 h-3" /> Link Externo
                                                            </button>
                                                            <button 
                                                                onClick={() => updateStagedLesson(lesson.id, 'activeTab', 'upload')}
                                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1.5 ${lesson.activeTab === 'upload' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                                                            >
                                                                <Upload className="w-3 h-3" /> Upload Arquivo
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {(!lesson.activeTab || lesson.activeTab === 'link') ? (
                                                        <div className="flex gap-2 animate-in fade-in">
                                                            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-zinc-500 flex items-center justify-center"><LinkIcon className="w-4 h-4" /></div>
                                                            <input 
                                                                type="text" 
                                                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors h-10 placeholder-zinc-600"
                                                                placeholder="Cole a URL do vídeo (YouTube, Vimeo, etc)..."
                                                                value={lesson.videoUrl}
                                                                onChange={(e) => updateStagedLesson(lesson.id, 'videoUrl', e.target.value)}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="animate-in fade-in">
                                                            {lesson.videoFile ? (
                                                                <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-lg group">
                                                                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded"><FileVideo className="w-5 h-5" /></div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-white truncate">{lesson.videoFile.name}</p>
                                                                        <p className="text-xs text-zinc-500">{(lesson.videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                                    </div>
                                                                    <button 
                                                                        onClick={() => updateStagedLesson(lesson.id, 'videoFile', null)}
                                                                        className="p-2 hover:bg-zinc-800 rounded text-zinc-500 hover:text-rose-500 transition-colors"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <div 
                                                                    onClick={() => handleLessonVideoUpload(lesson.id)}
                                                                    className="border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all group"
                                                                >
                                                                    <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                                        <Upload className="w-5 h-5 text-zinc-500 group-hover:text-cyan-500" />
                                                                    </div>
                                                                    <p className="text-sm font-medium text-zinc-400 group-hover:text-white">Clique para selecionar o vídeo</p>
                                                                    <p className="text-xs text-zinc-600 mt-1">MP4, MOV ou WEBM (Max 2GB)</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Conteúdo de Texto</label>
                                                    <textarea 
                                                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm text-zinc-300 focus:outline-none focus:border-cyan-500 h-32 resize-y font-serif leading-relaxed placeholder-zinc-600"
                                                        value={lesson.content}
                                                        onChange={(e) => updateStagedLesson(lesson.id, 'content', e.target.value)}
                                                        placeholder="Digite o conteúdo da aula..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- PUBLISH VIEW --- */}
            {view === 'publish' && (
                <div className="min-h-screen bg-[#050505] flex flex-col items-center p-8 animate-in slide-in-from-right-8 duration-500">
                    <div className="w-full max-w-5xl">
                        <button onClick={() => setView('content-stage')} className="flex items-center gap-2 text-zinc-500 hover:text-white mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Voltar
                        </button>

                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">Configuração Academy</h1>
                                <p className="text-zinc-400">Prepare os metadados finais e a capa do curso.</p>
                            </div>
                            <Badge variant="primary" className="bg-cyan-500/10 text-cyan-500 border-cyan-500/20 px-3 py-1">
                                Status: Rascunho
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Preview Card */}
                            <div>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Preview & Capa</p>
                                <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl overflow-hidden shadow-2xl relative group">
                                    <div 
                                        onClick={handleImageUpload}
                                        className="h-40 w-full bg-gradient-to-br from-cyan-900/40 via-blue-900/20 to-transparent flex items-center justify-center relative cursor-pointer group/image"
                                    >
                                        {coverImage ? (
                                            <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-30 text-white group-hover/image:opacity-10 transition-opacity">
                                                <ImageIcon className="w-12 h-12" />
                                            </div>
                                        )}
                                        
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity backdrop-blur-sm">
                                            <div className="flex flex-col items-center text-white">
                                                <Upload className="w-6 h-6 mb-2" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Alterar Capa</span>
                                            </div>
                                        </div>

                                        <div className="absolute top-4 left-4 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 text-white">
                                            <Heart className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 mb-2 block">
                                            PROGRAMAÇÃO
                                        </span>
                                        <h3 className="font-bold text-lg text-white leading-tight mb-4">
                                            {wizardData.title || MOCK_BLUEPRINT.metadata.title}
                                        </h3>
                                        <div className="flex items-center justify-between pt-4 border-t border-[#1F1F22]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400 font-bold border border-zinc-700">AN</div>
                                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Alan Nicolas</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono">
                                                <Play className="w-3.5 h-3.5" />
                                                <span>{MOCK_BLUEPRINT.modules.length * 4} aulas</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Form */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6">
                                    <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                        <Settings className="w-4 h-4 text-zinc-500" /> Detalhes Principais
                                    </h3>
                                    
                                    <div className="space-y-5">
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Título do Curso</label>
                                            <input 
                                                type="text" 
                                                defaultValue={wizardData.title || MOCK_BLUEPRINT.metadata.title}
                                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                            />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Categoria</label>
                                                <div className="relative">
                                                    <select className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 focus:outline-none focus:border-cyan-500 appearance-none">
                                                        <option>Programação</option>
                                                        <option>Design</option>
                                                        <option>Business</option>
                                                        <option>Marketing</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Nível</label>
                                                <div className="relative">
                                                    <select className="w-full bg-[#0A0A0A] border border-zinc-800 rounded-lg px-4 py-3 text-zinc-300 focus:outline-none focus:border-cyan-500 appearance-none">
                                                        <option>Iniciante</option>
                                                        <option>Intermediário</option>
                                                        <option>Avançado</option>
                                                    </select>
                                                    <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-zinc-500 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Tags</label>
                                            <div className="flex items-center gap-2 p-2 bg-[#0A0A0A] border border-zinc-800 rounded-lg">
                                                <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300 flex items-center gap-1">
                                                    AI <X className="w-3 h-3 cursor-pointer hover:text-white" />
                                                </span>
                                                <span className="px-2 py-1 bg-zinc-800 rounded text-xs text-zinc-300 flex items-center gap-1">
                                                    No-Code <X className="w-3 h-3 cursor-pointer hover:text-white" />
                                                </span>
                                                <input 
                                                    type="text" 
                                                    placeholder="Adicionar tag..." 
                                                    className="bg-transparent border-none text-sm text-white focus:ring-0 placeholder-zinc-600 flex-1 min-w-[100px]" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-1">Visibilidade</h3>
                                        <p className="text-xs text-zinc-500">Defina quem pode acessar este curso.</p>
                                    </div>
                                    <div className="flex bg-[#0A0A0A] p-1 rounded-lg border border-zinc-800">
                                        <button className="px-4 py-2 rounded bg-zinc-800 text-white text-xs font-bold flex items-center gap-2">
                                            <Lock className="w-3 h-3" /> Privado
                                        </button>
                                        <button className="px-4 py-2 rounded text-zinc-500 hover:text-zinc-300 text-xs font-bold flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Público
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button 
                                        id="publish-btn"
                                        onClick={handleFinalPublish}
                                        className="px-8 py-3 bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition-all shadow-lg flex items-center gap-2"
                                    >
                                        <Upload className="w-4 h-4" /> Publicar no Academy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- BLUEPRINT VIEW --- */}
            {view === 'blueprint' && (
                <div className="max-w-[1800px] mx-auto px-6 py-8 animate-in fade-in duration-700 font-sans">
                    {/* Blueprint Header */}
                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setView('dashboard')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-white">{wizardData.title || MOCK_BLUEPRINT.metadata.title}</h1>
                                    <Badge variant="outline" className="border-cyan-500/30 text-cyan-500 bg-cyan-500/10">LXD Blueprint v1.0</Badge>
                                </div>
                                <p className="text-zinc-500 text-sm font-mono flex items-center gap-4">
                                    <span>{wizardData.targetAudience || MOCK_BLUEPRINT.metadata.targetAudience}</span>
                                    <span className="text-zinc-700">|</span>
                                    <span>{wizardData.duration || MOCK_BLUEPRINT.metadata.totalDuration}</span>
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="secondary" icon={<FileText className="w-4 h-4" />}>Export JSON</Button>
                            <Button 
                                variant="primary" 
                                className="bg-cyan-600 hover:bg-cyan-500 text-white border-transparent" 
                                icon={<Check className="w-4 h-4" />}
                                onClick={handleApproveBlueprint}
                            >
                                Aprovar Blueprint
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        
                        {/* LEFT COLUMN: Strategic Context */}
                        <div className="space-y-6">
                            {/* Quality Scorecard */}
                            <QualityScorecard score={MOCK_BLUEPRINT.qualityScore} />

                            {/* Transformation Matrix */}
                            <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4" /> Diagnóstico da Transformação
                                </h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-zinc-900/50 rounded-lg border-l-2 border-zinc-700">
                                        <p className="text-[10px] text-zinc-500 font-bold mb-1 uppercase">Contexto Atual</p>
                                        <p className="text-sm text-zinc-400 italic leading-relaxed">
                                            "{wizardData.contextCurrent || "Processos manuais, equipe reativa..."}"
                                        </p>
                                    </div>
                                    <div className="flex justify-center text-zinc-600">
                                        <ArrowRight className="w-4 h-4 rotate-90" />
                                    </div>
                                    <div className="p-4 bg-amber-900/10 rounded-lg border-l-2 border-amber-500">
                                        <p className="text-[10px] text-amber-500 font-bold mb-1 uppercase">Contexto Futuro</p>
                                        <p className="text-sm text-amber-100 italic leading-relaxed">
                                            "{wizardData.contextFuture || "Autonomia, cultura de dados e velocidade."}"
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Competency Map (CHA-V) */}
                            <div className="bg-[#121214] border border-zinc-800 rounded-xl p-6 shadow-sm">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Layers className="w-4 h-4" /> Competências (CHA-V)
                                </h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                                        <span className="text-cyan-500 font-bold shrink-0 w-4">C</span> 
                                        <span>Fundamentos de LXD e Andragogia.</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                                        <span className="text-cyan-500 font-bold shrink-0 w-4">H</span> 
                                        <span>{wizardData.skills || "Desenhar jornadas experienciais."}</span>
                                    </li>
                                    <li className="flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
                                        <span className="text-cyan-500 font-bold shrink-0 w-4">A</span> 
                                        <span>{wizardData.attitudes || "Empatia profunda pelo aprendiz."}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Experiential Modules */}
                        <div className="lg:col-span-3">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-zinc-500" /> Jornada Experiencial
                                    </h2>
                                    <p className="text-xs text-zinc-500 mt-1">Baseado na Roda de Experiências (Sentir → Internalizar)</p>
                                </div>
                                <span className="text-xs text-zinc-500 font-mono">{MOCK_BLUEPRINT.modules.length} Módulos Gerados</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {blueprint.modules.map(module => (
                                    <ProblemMotorCard 
                                        key={module.moduleNumber} 
                                        module={module} 
                                        onClick={() => handleModuleSelect(module.moduleNumber)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- EDITOR VIEW (ELC+ DETAIL) --- */}
            {view === 'editor' && selectedModule && (
                <div className="flex h-screen bg-[#050505] overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Editor Header */}
                        <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#0A0A0A]/80 backdrop-blur-sm shrink-0">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setView('blueprint')} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-wider mb-0.5">Editando Módulo {selectedModule}</p>
                                    <h1 className="text-lg font-bold text-white">{blueprint.modules.find(m => m.moduleNumber === selectedModule)?.title}</h1>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${isAIPanelOpen ? 'bg-cyan-950/30 text-cyan-400 border border-cyan-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
                                >
                                    <Sparkles className="w-4 h-4" /> AI Copilot
                                </button>
                                <Button variant="primary" size="sm" icon={<Save className="w-4 h-4" />}>Salvar Alterações</Button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                                
                                {/* Left: Problem Motor Context */}
                                <div className="space-y-6">
                                    <div className="bg-cyan-950/10 border border-cyan-900/30 p-6 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <RefreshCw className="w-24 h-24 text-cyan-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <h3 className="text-xs font-bold text-cyan-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Target className="w-4 h-4" /> Problema-Motor (Tensão)
                                            </h3>
                                            <h4 className="text-xl font-bold text-white mb-2">{blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.title}</h4>
                                            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
                                                {blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario}
                                            </p>
                                            
                                            <div className="space-y-3">
                                                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Tensão</span>
                                                    <p className="text-sm text-zinc-300">{blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.tension}</p>
                                                </div>
                                                <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                                                    <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Entrega</span>
                                                    <p className="text-sm text-zinc-300">{blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.deliverable}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl">
                                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Objetivos de Aprendizagem (ABCD)</h3>
                                        <ul className="space-y-3">
                                            {blueprint.modules.find(m => m.moduleNumber === selectedModule)?.objectives.map((obj, i) => (
                                                <li key={i} className="flex gap-3 text-sm text-zinc-300">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                                    {obj}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Right: ELC+ Timeline Editor */}
                                <div className="lg:col-span-2">
                                    <div className="flex justify-between items-end mb-6">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            <Activity className="w-5 h-5 text-zinc-500" /> Roda de Experiências (Kolb)
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-xs text-zinc-500 uppercase tracking-wider">Engine Optimized</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
                                        <ElcStageEditor 
                                            stage="1. SENTIR (Experiência Concreta)" 
                                            verb="Vivenciar" 
                                            percentage={15} 
                                            color="text-rose-400 border-rose-500 bg-rose-500"
                                            onGenerate={() => handleGenerateActivity("SENTIR", blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario || '')}
                                            onManualUpdate={(content) => handleManualActivityUpdate("SENTIR", content)}
                                            generatedContent={generatedStages["SENTIR"]}
                                        />
                                        <ElcStageEditor 
                                            stage="2. OBSERVAR (Observação Reflexiva)" 
                                            verb="Organizar" 
                                            percentage={10} 
                                            color="text-amber-400 border-amber-500 bg-amber-500"
                                            onGenerate={() => handleGenerateActivity("OBSERVAR", blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario || '')}
                                            onManualUpdate={(content) => handleManualActivityUpdate("OBSERVAR", content)}
                                            generatedContent={generatedStages["OBSERVAR"]}
                                        />
                                        <ElcStageEditor 
                                            stage="3. PENSAR (Fundamentação Conceitual)" 
                                            verb="Teorizar" 
                                            percentage={20} 
                                            color="text-blue-400 border-blue-500 bg-blue-500"
                                            onGenerate={() => handleGenerateActivity("PENSAR", blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario || '')}
                                            onManualUpdate={(content) => handleManualActivityUpdate("PENSAR", content)}
                                            generatedContent={generatedStages["PENSAR"]}
                                        />
                                        <ElcStageEditor 
                                            stage="4. FAZER (Experimentação Prática)" 
                                            verb="Aplicar" 
                                            percentage={25} 
                                            color="text-emerald-400 border-emerald-500 bg-emerald-500"
                                            onGenerate={() => handleGenerateActivity("FAZER", blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario || '')}
                                            onManualUpdate={(content) => handleManualActivityUpdate("FAZER", content)}
                                            generatedContent={generatedStages["FAZER"]}
                                        />
                                        <ElcStageEditor 
                                            stage="5. VALIDAR (Habilitação)" 
                                            verb="Melhorar" 
                                            percentage={15} 
                                            color="text-purple-400 border-purple-500 bg-purple-500"
                                            onGenerate={() => handleGenerateActivity("VALIDAR", blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario || '')}
                                            onManualUpdate={(content) => handleManualActivityUpdate("VALIDAR", content)}
                                            generatedContent={generatedStages["VALIDAR"]}
                                        />
                                        <ElcStageEditor 
                                            stage="6. INTERNALIZAR (Incorporação)" 
                                            verb="Ritualizar" 
                                            percentage={15} 
                                            color="text-cyan-400 border-cyan-500 bg-cyan-500"
                                            onGenerate={() => handleGenerateActivity("INTERNALIZAR", blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario || '')}
                                            onManualUpdate={(content) => handleManualActivityUpdate("INTERNALIZAR", content)}
                                            generatedContent={generatedStages["INTERNALIZAR"]}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Copilot Sidebar */}
                    <div className={`
                        ${isAIPanelOpen ? 'w-80 border-l' : 'w-0'} 
                        border-[#1F1F22] bg-[#0A0A0A] flex flex-col shrink-0 transition-all duration-300 overflow-hidden relative z-30
                    `}>
                        <div className="p-4 border-b border-[#1F1F22] flex items-center justify-between bg-zinc-900/30">
                            <div className="flex items-center gap-2 text-cyan-400">
                                <Bot className="w-5 h-5" />
                                <span className="font-bold text-sm tracking-wide">LXD Copilot</span>
                            </div>
                            <button onClick={() => setIsAIPanelOpen(false)} className="text-zinc-500 hover:text-zinc-300">
                                <PanelRightClose className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                            <div className="mb-6 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider mb-1">Contexto do Módulo</p>
                                <p className="text-xs text-zinc-400 line-clamp-3 italic">
                                    "{blueprint.modules.find(m => m.moduleNumber === selectedModule)?.problemMotor.scenario}"
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Ações Rápidas</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        <button 
                                            disabled={isGenerating}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800 text-left transition-all group"
                                        >
                                            <div className="p-2 rounded bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-zinc-900 transition-colors">
                                                <ListChecks className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-200">Gerar Atividades</p>
                                                <p className="text-[10px] text-zinc-500">Para toda a jornada</p>
                                            </div>
                                        </button>

                                        <button 
                                            disabled={isGenerating}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800 text-left transition-all group"
                                        >
                                            <div className="p-2 rounded bg-zinc-800 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-zinc-900 transition-colors">
                                                <Wand2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-zinc-200">Refinar Tensão</p>
                                                <p className="text-[10px] text-zinc-500">Aumentar o drama</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Chat Assistant</h3>
                                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 min-h-[150px] flex flex-col justify-end">
                                        <p className="text-xs text-zinc-500 text-center mb-4">
                                            Como posso ajudar com a arquitetura pedagógica?
                                        </p>
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Ex: Sugira uma dinâmica de quebra-gelo..."
                                                className="w-full bg-[#0A0A0A] border border-zinc-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500/50"
                                            />
                                            <button className="absolute right-2 top-1.5 text-cyan-500 hover:text-white">
                                                <Zap className="w-3 h-3 fill-current" />
                                            </button>
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
