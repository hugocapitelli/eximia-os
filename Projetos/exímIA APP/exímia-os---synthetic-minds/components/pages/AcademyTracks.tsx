
import React, { useState, useRef } from 'react';
import { ACADEMY_TRACKS } from '../../constants';
import { AcademyTrack } from '../../types';
import { Button } from '../atoms/Button';
import { ArrowLeft, User, Search, Map, CheckCircle2, Lock, PenTool, Settings, GripVertical, Trash2, Plus, Zap, Layers, Image as ImageIcon, Upload } from 'lucide-react';

interface AcademyTracksProps {
    onNavigate: (pageId: string) => void;
}

export const AcademyTracks: React.FC<AcademyTracksProps> = ({ onNavigate }) => {
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [localTracks, setLocalTracks] = useState<AcademyTrack[]>(ACADEMY_TRACKS);
    // Track localized image state for demo purposes (key: trackId, value: imageUrl)
    const [trackImages, setTrackImages] = useState<Record<string, string>>({});

    // Drag & Drop Refs
    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    // --- Handlers ---
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        if (!isAdminMode) {
            e.preventDefault();
            return;
        }
        dragItem.current = position;
        e.currentTarget.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
        if (!isAdminMode) return;
        e.preventDefault();
        
        dragOverItem.current = position;
        
        const dragIndex = dragItem.current;
        const dragOverIndex = dragOverItem.current;

        if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) return;

        const newTracks = [...localTracks];
        const draggedItemContent = newTracks[dragIndex];
        
        newTracks.splice(dragIndex, 1);
        newTracks.splice(dragOverIndex, 0, draggedItemContent);
        
        dragItem.current = dragOverIndex;
        setLocalTracks(newTracks);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        dragItem.current = null;
        dragOverItem.current = null;
        e.currentTarget.style.opacity = '1';
    };

    const handleImageUpload = (trackId: string) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setTrackImages(prev => ({ ...prev, [trackId]: event.target?.result as string }));
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans transition-colors duration-500">
            {/* Top Navigation */}
            <div className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors duration-500 ${isAdminMode ? 'bg-[#1a1500]/80 border-amber-500/20' : 'bg-[#050505]/80 border-[#1F1F22]'}`}>
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <button onClick={() => onNavigate('academy-dashboard')} className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">EXPLORAR</button>
                            <button onClick={() => onNavigate('academy-tracks')} className="text-xs font-bold tracking-widest transition-colors text-white">TRILHAS</button>
                            <button onClick={() => onNavigate('academy-favorites')} className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">FAVORITOS</button>
                            <div className="h-4 w-[1px] bg-zinc-800" />
                            <button onClick={() => onNavigate('academy-community')} className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-300">COMUNIDADE</button>
                            <button onClick={() => onNavigate('journey-library')} className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-300">LIVROS</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-0 top-1.5 w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            <input
                                type="text"
                                placeholder="BUSCAR..."
                                className="bg-transparent border-b border-zinc-800 text-[10px] font-bold tracking-widest py-1 pl-5 w-32 focus:w-48 focus:border-zinc-500 focus:outline-none transition-all text-zinc-300 placeholder-zinc-700 uppercase"
                            />
                        </div>
                        {/* Admin Mode Toggle */}
                        <button
                            onClick={() => setIsAdminMode(!isAdminMode)}
                            className={`
                                flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300
                                ${isAdminMode
                                    ? 'bg-amber-500 text-zinc-900 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'}
                            `}
                        >
                            {isAdminMode ? <Settings className="w-3 h-3 animate-spin-slow" /> : <PenTool className="w-3 h-3" />}
                            <span className="text-[10px] font-bold uppercase tracking-wider">{isAdminMode ? 'Editor Ativo' : 'Editar'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-12">
                {/* Header Section */}
                {!isAdminMode ? (
                    <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-500">
                        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Trilhas de Aprendizado</h1>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Caminhos estruturados para dominar competências complexas. Siga o mapa e construa seu legado.
                        </p>
                    </div>
                ) : (
                    <div className="mb-12 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20">
                                <Layers className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Editor de Trilhas</h2>
                                <p className="text-sm text-zinc-400">Arraste para reordenar ou altere as capas das trilhas.</p>
                            </div>
                        </div>
                        <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900">Nova Trilha</Button>
                    </div>
                )}

                <div className="grid gap-8">
                    {localTracks.map((track, index) => {
                        const hasCustomImage = trackImages[track.id];
                        return (
                            <div 
                                key={track.id} 
                                className={`relative group perspective-1000 min-h-[220px] ${isAdminMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                                draggable={isAdminMode}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => e.preventDefault()}
                            >
                                
                                {/* LAYER 0: ADMIN BACKPLATE */}
                                {isAdminMode && (
                                    <div className="absolute inset-0 z-0 animate-in fade-in duration-500">
                                        <div className="absolute inset-0 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
                                    </div>
                                )}

                                {/* LAYER 10: CARD CONTENT */}
                                <div className={`
                                    h-full transition-all duration-300 ease-out relative z-10 origin-center overflow-hidden rounded-2xl
                                    ${isAdminMode ? 'scale-[0.92] cursor-default' : 'hover:scale-[1.01] cursor-pointer'}
                                `}>
                                    <div className={`
                                        bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-8 h-full relative
                                        ${isAdminMode ? 'border-zinc-800' : 'hover:border-zinc-700'}
                                    `}>
                                        {/* Background Glow or Image */}
                                        {hasCustomImage ? (
                                            <div className="absolute inset-0 z-0">
                                                <img src={hasCustomImage} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" alt="track cover" />
                                                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                                            </div>
                                        ) : (
                                            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${track.color} opacity-5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:opacity-10 transition-opacity`} />
                                        )}

                                        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 h-full">
                                            <div 
                                                onClick={(e) => {
                                                    if(isAdminMode) {
                                                        e.stopPropagation();
                                                        handleImageUpload(track.id);
                                                    }
                                                }}
                                                className={`
                                                    w-20 h-20 rounded-2xl bg-gradient-to-br ${track.color} flex items-center justify-center shrink-0 shadow-lg relative overflow-hidden group/icon
                                                    ${isAdminMode ? 'cursor-pointer hover:ring-2 hover:ring-white/50' : ''}
                                                `}
                                            >
                                                <track.icon className="w-10 h-10 text-white" />
                                                {isAdminMode && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity backdrop-blur-sm">
                                                        <ImageIcon className="w-6 h-6 text-white" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="text-2xl font-bold text-white mb-2">{track.title}</h3>
                                                <p className="text-zinc-400 mb-6 leading-relaxed">{track.description}</p>
                                                
                                                <div className="flex items-center gap-6 text-sm text-zinc-500 mb-6">
                                                    <span className="flex items-center gap-2">
                                                        <Map className="w-4 h-4" /> {track.courseCount} Cursos
                                                    </span>
                                                    <span className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4" /> {track.completedCount} Concluídos
                                                    </span>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden mb-2">
                                                    <div 
                                                        className={`h-full bg-gradient-to-r ${track.color}`} 
                                                        style={{ width: `${(track.completedCount / track.courseCount) * 100}%` }}
                                                    />
                                                </div>
                                                <div className="flex justify-between text-xs text-zinc-500 font-mono">
                                                    <span>Progresso</span>
                                                    <span>{Math.round((track.completedCount / track.courseCount) * 100)}%</span>
                                                </div>
                                            </div>

                                            <div className="md:self-center">
                                                <button 
                                                    disabled={isAdminMode}
                                                    className={`
                                                        px-6 py-3 font-bold text-sm rounded-lg transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]
                                                        ${isAdminMode ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200'}
                                                    `}
                                                >
                                                    Continuar Trilha
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* LAYER 20: ADMIN CONTROLS */}
                                {isAdminMode && (
                                    <div className="absolute inset-0 z-20 pointer-events-none animate-in fade-in duration-500">
                                        
                                        {/* Left: Drag Handle */}
                                        <div className="absolute top-1/2 -translate-y-1/2 left-3 pointer-events-auto">
                                            <button className="w-8 h-12 bg-[#121214] border border-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white shadow-xl hover:scale-110 transition-all cursor-grab active:cursor-grabbing">
                                                <GripVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Top Right: Edit */}
                                        <div className="absolute top-3 right-3 pointer-events-auto">
                                            <button 
                                                onClick={() => handleImageUpload(track.id)}
                                                className="w-10 h-10 bg-amber-500 border-2 border-amber-300 rounded-full flex items-center justify-center text-zinc-900 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-110 hover:rotate-12 transition-all"
                                                title="Alterar Imagem de Fundo"
                                            >
                                                <Upload className="w-4 h-4 fill-current" />
                                            </button>
                                        </div>

                                        {/* Bottom Right: Delete */}
                                        <div className="absolute bottom-3 right-3 pointer-events-auto">
                                            <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-950 hover:border-rose-500 transition-all shadow-xl">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                    </div>
                                )}

                            </div>
                        );
                    })}

                    {/* Locked Track Example - Show only in normal mode */}
                    {!isAdminMode && (
                        <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-8 opacity-60 relative overflow-hidden grayscale">
                            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20 backdrop-blur-[1px]">
                                <div className="flex flex-col items-center gap-2">
                                    <Lock className="w-8 h-8 text-zinc-500" />
                                    <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Em Breve</span>
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10 blur-sm">
                                 <div className="w-20 h-20 rounded-2xl bg-zinc-800 flex items-center justify-center shrink-0">
                                     <div className="w-10 h-10 bg-zinc-700 rounded-full" />
                                 </div>
                                 <div className="flex-1">
                                     <div className="h-8 w-64 bg-zinc-800 rounded mb-4" />
                                     <div className="h-4 w-full bg-zinc-900 rounded mb-2" />
                                     <div className="h-4 w-2/3 bg-zinc-900 rounded" />
                                 </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
