import React, { useState } from 'react';
import { CLONES } from '../../constants';
import { CloneCard } from '../molecules/CloneCard';
import { Button } from '../atoms/Button';
import { SearchBar } from '../molecules/SearchBar';
import { 
  Plus, 
  LayoutGrid, 
  List, 
  Brain, 
  Activity, 
  ChevronRight, 
  ArrowRight, 
  ArrowLeft,
  BarChart2, 
  Settings, 
  Cpu, 
  GitBranch, 
  History,
  Box,
  FileText,
  MessageSquare,
  Search,
  Filter,
  Sparkles,
  Command,
  Zap,
  Play,
  Share2,
  MoreVertical,
  Book,
  Grid
} from 'lucide-react';

const TraitCard: React.FC<{ title: string; type: string; description: string }> = ({ title, type, description }) => {
    let typeColor = 'text-zinc-500 border-zinc-800 bg-zinc-900';
    if (type === 'Critical') typeColor = 'text-rose-400 border-rose-900/30 bg-rose-950/10';
    if (type === 'Absolute') typeColor = 'text-amber-400 border-amber-900/30 bg-amber-950/10';
    if (type === 'Non-Linear') typeColor = 'text-minds-400 border-minds-900/30 bg-minds-950/10';

    return (
        <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-5 hover:border-zinc-700 transition-colors group">
            <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${typeColor}`}>
                    {type}
                </span>
                <Activity className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-colors" />
            </div>
            <h4 className="text-sm font-bold text-zinc-200 mb-2">{title}</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
                {description}
            </p>
        </div>
    );
};

interface SyntheticMindsProps {
    onOpenChat?: (cloneId: string) => void;
}

export const SyntheticMinds: React.FC<SyntheticMindsProps> = ({ onOpenChat }) => {
    const [view, setView] = useState<'gallery' | 'profile' | 'chat'>('gallery');
    const [selectedCloneId, setSelectedCloneId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('DNA');

    const handleSelectClone = (id: string) => {
        setSelectedCloneId(id);
        setView('profile');
    };

    const handleBack = () => {
        if (view === 'chat') {
            setView('profile');
        } else {
            setView('gallery');
            setSelectedCloneId(null);
        }
    };

    const handleOpenChat = () => {
        if (onOpenChat && selectedCloneId) {
            onOpenChat(selectedCloneId);
        } else {
            setView('chat');
        }
    };

    const selectedClone = CLONES.find(c => c.id === selectedCloneId);

    // --- GALLERY VIEW ---
    if (view === 'gallery') {
        return (
            <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
                {/* Top Nav Bar */}
                <div className="sticky top-0 z-40 backdrop-blur-md bg-[#050505]/80 border-b border-[#1F1F22]">
                    <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <nav className="hidden md:flex items-center gap-6">
                                <button className="text-xs font-bold tracking-widest transition-colors text-white">MENTES</button>
                                <button className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">ARENA</button>
                                <button className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">PIPELINE</button>
                                <div className="h-4 w-[1px] bg-zinc-800" />
                                <button className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">DNA MENTAL</button>
                            </nav>
                        </div>

                        <div className="flex items-center gap-6">
                             <div className="relative group hidden md:block">
                                 <Search className="absolute left-0 top-1.5 w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                 <input
                                     type="text"
                                     placeholder="BUSCAR..."
                                     className="bg-transparent border-b border-zinc-800 text-[10px] font-bold tracking-widest py-1 pl-5 w-32 focus:w-48 focus:border-zinc-500 focus:outline-none transition-all text-zinc-300 placeholder-zinc-700 uppercase"
                                 />
                             </div>
                             <div className="flex items-center gap-2 text-zinc-500 text-xs">
                                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                 <span className="text-[10px] font-bold tracking-widest uppercase">Online</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1800px] mx-auto px-6 py-8">
                    {/* Filter Bar */}
                    <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 hide-scrollbar">
                        {['TODOS', 'COPYWRITING', 'STRATEGY', 'PROGRAMMING', 'BUSINESS', 'EDUCATION'].map((filter, idx) => (
                            <button
                                key={filter}
                                className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all whitespace-nowrap border ${
                                    idx === 0
                                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                        : 'bg-[#0A0A0A] text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Section Header */}
                    <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xs font-bold text-zinc-500 tracking-[0.2em]">TODAS AS MENTES</h2>
                            <div className="h-[1px] w-12 bg-zinc-800" />
                        </div>
                        <span className="text-[10px] font-bold text-zinc-600 tracking-wider">{CLONES.length} mentes</span>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {CLONES.map(clone => (
                            <div key={clone.id} className="h-[320px]">
                                <CloneCard clone={clone} onClick={() => handleSelectClone(clone.id)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- PROFILE VIEW ---
    if (!selectedClone) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
             {/* Nav Back Bar */}
             <div className="border-b border-[#1F1F22] bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-20">
                <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-4">
                    <button 
                        onClick={handleBack} 
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-wider">Voltar</span>
                    </button>
                    
                    <span className="text-zinc-700">/</span>
                    <span className="text-sm font-bold text-white">{selectedClone.name}</span>
                    
                    <div className="ml-auto flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded">System Operational</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto px-6 py-8">
                
                {/* Hero Profile Section */}
                <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-10">
                    {/* Left: Avatar & Title */}
                    <div className="flex-1 flex gap-6 items-center">
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-b from-zinc-800 to-black p-0.5 shadow-2xl relative group">
                             <div className="w-full h-full rounded-xl bg-zinc-900 overflow-hidden flex items-center justify-center">
                                {selectedClone.avatarUrl.length > 2 ? (
                                    <img src={selectedClone.avatarUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-zinc-700">{selectedClone.avatarUrl}</span>
                                )}
                             </div>
                             <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-[#1F1F22] px-2 py-0.5 rounded text-[9px] font-mono text-zinc-500 whitespace-nowrap">
                                 ID: {selectedClone.id}_X
                             </div>
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-5xl font-bold text-white tracking-tight leading-none uppercase">{selectedClone.name}</h1>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-lg text-minds-400 font-serif italic border-l-2 border-minds-500/50 pl-3">
                                    {selectedClone.domain}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-2 py-1 bg-cyan-900/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase rounded">
                                    TIER 01
                                </div>
                                <div className="px-2 py-1 bg-minds-900/20 border border-minds-500/30 text-minds-400 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                                    <Cpu className="w-3 h-3" /> Clone Cognitivo
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Stats Modules */}
                    <div className="flex gap-4">
                        {/* Apex Score */}
                        <div className="w-40 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 flex flex-col justify-between group hover:border-zinc-700 transition-colors">
                            <div className="flex justify-between items-start">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Apex Score</span>
                                <Activity className="w-3 h-3 text-zinc-600" />
                            </div>
                            <div>
                                <span className="text-3xl font-bold text-white">{selectedClone.stats?.apexScore || '8.5'}</span>
                                <span className="text-xs text-zinc-600">/10</span>
                            </div>
                            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[85%] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>
                        </div>

                        {/* Neural Data */}
                        <div className="w-40 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 flex flex-col justify-between group hover:border-zinc-700 transition-colors">
                            <div className="flex justify-between items-start">
                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Neural Data</span>
                                <Brain className="w-3 h-3 text-zinc-600" />
                            </div>
                            <div>
                                <span className="text-3xl font-bold text-white">{selectedClone.stats?.neuralData || '9'}</span>
                                <span className="text-xs text-zinc-600">files</span>
                            </div>
                            <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                                <div className="bg-minds-500 h-full w-[90%] shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 justify-center">
                             <button className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
                                 <Settings className="w-4 h-4" />
                             </button>
                             <button
                                 onClick={handleOpenChat}
                                 className="w-10 h-10 rounded-lg bg-minds-500 hover:bg-minds-400 text-white flex items-center justify-center shadow-glow-purple transition-all"
                                 title="Iniciar Chat com esta Mente"
                             >
                                 <Play className="w-4 h-4 fill-current ml-0.5" />
                             </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-[#1F1F22] mb-8">
                    <div className="flex gap-8">
                        {['Geral', 'DNA', 'Comunicacao', 'Historia', 'Artefatos (13)', 'Conteudos', 'Fragmentos'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`
                                    pb-4 text-xs font-bold uppercase tracking-widest transition-colors relative
                                    ${activeTab === tab 
                                        ? 'text-minds-400' 
                                        : 'text-zinc-600 hover:text-zinc-400'}
                                `}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-minds-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                {activeTab === 'DNA' && selectedClone.dna ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* LEFT: Visao Geral / Semantic Field */}
                        <div className="lg:col-span-3 space-y-2">
                            <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-lg p-3 flex items-center justify-between text-zinc-300 hover:bg-zinc-900/50 cursor-pointer transition-colors group">
                                <div className="flex items-center gap-3">
                                    <LayoutGrid className="w-4 h-4 text-zinc-500 group-hover:text-minds-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Visao Geral</span>
                                </div>
                            </div>
                            <div className="bg-[#050505] text-zinc-600 p-3 flex items-center gap-3 cursor-pointer hover:text-zinc-400 transition-colors">
                                <Book className="w-4 h-4" />
                                <span className="text-xs font-medium">Campo Semantico</span>
                            </div>
                            <div className="bg-[#050505] text-zinc-600 p-3 flex items-center gap-3 cursor-pointer hover:text-zinc-400 transition-colors">
                                <FileText className="w-4 h-4" />
                                <span className="text-xs font-medium">Exemplos</span>
                            </div>
                            <div className="bg-[#050505] text-zinc-600 p-3 flex items-center gap-3 cursor-pointer hover:text-zinc-400 transition-colors">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-xs font-medium">Catchphrases</span>
                            </div>
                        </div>

                        {/* CENTER: DNA Cirurgico */}
                        <div className="lg:col-span-6 space-y-8">
                            <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-8">
                                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-8 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-minds-500" /> DNA Cirúrgico
                                </h3>

                                <div className="space-y-8">
                                    {selectedClone.dna.sliders.map((slider, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
                                                <span>{slider.leftLabel}</span>
                                                <span>{slider.rightLabel}</span>
                                            </div>
                                            
                                            {/* Custom Range Slider Look */}
                                            <div className="h-2 bg-zinc-900 rounded-full relative overflow-hidden">
                                                {/* Gradient Background */}
                                                <div 
                                                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-transparent via-minds-500 to-transparent opacity-50 blur-sm" 
                                                    style={{ width: '100%' }}
                                                />
                                                {/* Thumb position */}
                                                <div 
                                                    className="absolute top-0 bottom-0 w-2 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                                                    style={{ left: `${slider.value}%` }}
                                                />
                                                {/* Fill */}
                                                <div 
                                                    className="absolute top-0 bottom-0 left-0 bg-zinc-800 w-full"
                                                    style={{ clipPath: `polygon(0 0, ${slider.value}% 0, ${slider.value}% 100%, 0 100%)`, background: 'linear-gradient(90deg, #2E1065 0%, #8B5CF6 100%)' }}
                                                />
                                            </div>
                                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-600">
                                                {slider.label.toUpperCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 pt-8 border-t border-[#1F1F22]">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Power Words</h4>
                                        <button className="text-[10px] text-minds-400 hover:underline">Ver Arsenal →</button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedClone.dna.powerWords.map(word => (
                                            <span key={word} className="px-3 py-1.5 bg-[#151518] border border-[#27272A] text-zinc-300 text-xs font-mono rounded hover:border-zinc-500 hover:text-white transition-colors cursor-default">
                                                {word}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Traits */}
                            <div>
                                <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <GitBranch className="w-4 h-4 text-minds-500" /> Sistema Operacional Comportamental
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedClone.dna.traits.map((trait, idx) => (
                                        <TraitCard key={idx} {...trait} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Operational Mode */}
                        <div className="lg:col-span-3">
                            <div className="bg-gradient-to-b from-[#0A0A0A] to-[#050505] border border-[#1F1F22] rounded-xl p-8 text-center h-full relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-minds-900/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                                    <div className="w-20 h-20 rounded-full bg-[#0F0F11] border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl shadow-black/50">
                                        <Cpu className="w-8 h-8 text-minds-400 animate-pulse-slow" />
                                    </div>
                                    
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Modo Operacional</p>
                                    <h3 className="text-xl font-bold text-white mb-2">{selectedClone.dna.operationalMode.title}</h3>
                                    <p className="text-sm text-zinc-400 font-serif italic leading-relaxed">
                                        {selectedClone.dna.operationalMode.description}
                                    </p>

                                    <div className="mt-8 flex gap-2">
                                        <span className="px-3 py-1 rounded-full bg-minds-900/30 border border-minds-500/30 text-minds-300 text-[10px] font-bold uppercase">
                                            {selectedClone.dna.archetype.name.split('-')[0]}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-rose-900/20 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase">
                                            3w4
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="py-24 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                        <Command className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 font-medium">Conteúdo criptografado ou em desenvolvimento.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // --- CHAT VIEW ---
    if (view === 'chat' && selectedClone) {
        return (
            <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans flex flex-col">
                {/* Chat Header */}
                <div className="border-b border-[#1F1F22] bg-[#0A0A0A]/50 backdrop-blur-md sticky top-0 z-20">
                    <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center gap-4">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 hover:bg-zinc-800 transition-all group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-wider">Voltar</span>
                        </button>

                        <span className="text-zinc-700">/</span>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-minds-900/30 border border-minds-500/30 flex items-center justify-center text-minds-400 text-xs font-bold">
                                {selectedClone.avatarUrl.length > 2 ? selectedClone.avatarUrl.slice(0,2).toUpperCase() : selectedClone.avatarUrl}
                            </div>
                            <div>
                                <span className="text-sm font-bold text-white">Chat com {selectedClone.name}</span>
                                <p className="text-[10px] text-zinc-500">{selectedClone.domain}</p>
                            </div>
                        </div>

                        <div className="ml-auto flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                        </div>
                    </div>
                </div>

                {/* Chat Messages Area */}
                <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 overflow-y-auto">
                    <div className="space-y-6">
                        {/* System Message */}
                        <div className="text-center py-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-minds-900/20 border border-minds-500/20 text-minds-400 text-xs">
                                <Brain className="w-4 h-4" />
                                <span>Sessão iniciada com {selectedClone.name}</span>
                            </div>
                        </div>

                        {/* Example Messages */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-lg bg-minds-900/30 border border-minds-500/30 flex items-center justify-center text-minds-400 text-xs font-bold flex-shrink-0">
                                {selectedClone.avatarUrl.length > 2 ? selectedClone.avatarUrl.slice(0,2).toUpperCase() : selectedClone.avatarUrl}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-zinc-500 mb-1">{selectedClone.name}</p>
                                <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl rounded-tl-none p-4">
                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        Olá! Sou {selectedClone.name}, especialista em {selectedClone.domain.toLowerCase()}.
                                        Como posso ajudá-lo hoje?
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Input */}
                <div className="border-t border-[#1F1F22] bg-[#0A0A0A] p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3 items-end">
                            <div className="flex-1 relative">
                                <textarea
                                    placeholder={`Pergunte algo para ${selectedClone.name}...`}
                                    className="w-full bg-[#050505] border border-[#1F1F22] rounded-xl py-3 px-4 text-sm text-zinc-300 focus:outline-none focus:border-minds-500/30 transition-colors resize-none"
                                    rows={2}
                                />
                            </div>
                            <button className="px-6 py-3 bg-minds-500 hover:bg-minds-400 text-white rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-glow-purple">
                                <MessageSquare className="w-4 h-4" />
                                Enviar
                            </button>
                        </div>
                        <p className="text-[10px] text-zinc-600 mt-2 text-center">
                            {selectedClone.name} pode cometer erros. Verifique informações importantes.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};