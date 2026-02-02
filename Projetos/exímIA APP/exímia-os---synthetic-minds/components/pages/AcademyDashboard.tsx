
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ACADEMY_COURSES, ACADEMY_TRACKS, ACADEMY_SKILLS, ACADEMY_ACHIEVEMENTS, FEATURED_COURSES_IDS } from '../../constants';
import { AcademyCourseCard } from '../academy/AcademyCourseCard';
import { HeroCarousel } from '../academy/HeroCarousel';
import { TrackCardLarge } from '../academy/TrackCardLarge';
import { TrackCardFullWidth } from '../academy/TrackCardFullWidth';
import { Button } from '../atoms/Button';
import { SearchBar } from '../molecules/SearchBar';
import { GraduationCap, Trophy, Flame, Play, Search, User, Zap, Settings, PenTool, GripVertical, Trash2, Layers, Target, MessageSquare, TrendingUp, BookOpen, Award, Brain, Code, Rocket, ChevronRight, Plus, Upload } from 'lucide-react';
import { AcademyCourse, AcademyTrack, Skill, Achievement } from '../../types';

interface AcademyDashboardProps {
    onNavigateToCourse: (courseId: string) => void;
    onEditCourse?: (courseId: string) => void;
    onNavigate?: (pageId: string) => void;
}

export const AcademyDashboard: React.FC<AcademyDashboardProps> = ({ onNavigateToCourse, onEditCourse, onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('TODOS');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [localCourses, setLocalCourses] = useState<AcademyCourse[]>(ACADEMY_COURSES);
  const [localTracks, setLocalTracks] = useState<AcademyTrack[]>(ACADEMY_TRACKS);
  const [localSkills, setLocalSkills] = useState<Skill[]>(ACADEMY_SKILLS);
  const [localAchievements, setLocalAchievements] = useState<Achievement[]>(ACADEMY_ACHIEVEMENTS);
  const [activeSection, setActiveSection] = useState<'cursos' | 'trilhas' | 'skilltree' | 'progresso' | 'socratico'>('cursos');
  const [featuredCourseIds, setFeaturedCourseIds] = useState<string[]>(FEATURED_COURSES_IDS);

  // Memoized featured courses for carousel (PM1-001)
  const featuredCourses = useMemo(() => {
    return featuredCourseIds
      .map(id => ACADEMY_COURSES.find(c => c.id === id))
      .filter((c): c is AcademyCourse => c !== undefined);
  }, [featuredCourseIds]);

  // Handler to remove course from carousel
  const handleRemoveFromCarousel = (courseId: string) => {
    setFeaturedCourseIds(prev => prev.filter(id => id !== courseId));
  };

  // Drag & Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Track drag refs
  const dragTrackItem = useRef<number | null>(null);
  const dragOverTrackItem = useRef<number | null>(null);

  // Skill drag refs
  const dragSkillItem = useRef<number | null>(null);
  const dragOverSkillItem = useRef<number | null>(null);

  // Custom filters based on the screenshot
  const filters = ['TODOS', 'AGENTES', 'AUTOMAÇÃO', 'EVENTOS', 'FUNDAMENTOS', 'BUSINESS', 'MAKERS', 'MENTALIDADE', 'NEGÓCIOS', 'PROGRAMAÇÃO', 'RAG', 'VENDAS'];

  // Update local list when filter changes
  useEffect(() => {
      const filtered = selectedFilter === 'TODOS' 
        ? ACADEMY_COURSES 
        : ACADEMY_COURSES.filter(c => c.category.toUpperCase() === selectedFilter || c.tags?.some(t => t.toUpperCase() === selectedFilter));
      setLocalCourses(filtered);
  }, [selectedFilter]);

  const handleNavClick = (pageId: string) => {
      if (onNavigate) {
          onNavigate(pageId);
      }
  };

  const handleCourseClick = (courseId: string) => {
      if (isAdminMode && onEditCourse) {
          onEditCourse(courseId);
      } else {
          onNavigateToCourse(courseId);
      }
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      if (!isAdminMode) {
          e.preventDefault();
          return;
      }
      dragItem.current = position;
      // Visual feedback
      e.currentTarget.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      if (!isAdminMode) return;
      e.preventDefault(); // Necessary to allow dropping
      
      dragOverItem.current = position;
      
      const dragIndex = dragItem.current;
      const dragOverIndex = dragOverItem.current;

      if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) return;

      // Reorder Logic
      const newCourses = [...localCourses];
      const draggedItemContent = newCourses[dragIndex];
      
      // Remove from old index and insert at new index
      newCourses.splice(dragIndex, 1);
      newCourses.splice(dragOverIndex, 0, draggedItemContent);
      
      // Update ref to track the item's new position continuously
      dragItem.current = dragOverIndex;
      
      setLocalCourses(newCourses);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      dragItem.current = null;
      dragOverItem.current = null;
      e.currentTarget.style.opacity = '1'; // Reset opacity
  };

  // --- Track Drag & Drop Handlers ---
  const handleTrackDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      if (!isAdminMode) { e.preventDefault(); return; }
      dragTrackItem.current = position;
      e.currentTarget.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = "move";
  };

  const handleTrackDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      if (!isAdminMode) return;
      e.preventDefault();
      dragOverTrackItem.current = position;
      const dragIndex = dragTrackItem.current;
      const dragOverIndex = dragOverTrackItem.current;
      if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) return;
      const newTracks = [...localTracks];
      const draggedItemContent = newTracks[dragIndex];
      newTracks.splice(dragIndex, 1);
      newTracks.splice(dragOverIndex, 0, draggedItemContent);
      dragTrackItem.current = dragOverIndex;
      setLocalTracks(newTracks);
  };

  const handleTrackDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      dragTrackItem.current = null;
      dragOverTrackItem.current = null;
      e.currentTarget.style.opacity = '1';
  };

  // --- Skill Drag & Drop Handlers ---
  const handleSkillDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      if (!isAdminMode) { e.preventDefault(); return; }
      dragSkillItem.current = position;
      e.currentTarget.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = "move";
  };

  const handleSkillDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
      if (!isAdminMode) return;
      e.preventDefault();
      dragOverSkillItem.current = position;
      const dragIndex = dragSkillItem.current;
      const dragOverIndex = dragOverSkillItem.current;
      if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) return;
      const newSkills = [...localSkills];
      const draggedItemContent = newSkills[dragIndex];
      newSkills.splice(dragIndex, 1);
      newSkills.splice(dragOverIndex, 0, draggedItemContent);
      dragSkillItem.current = dragOverIndex;
      setLocalSkills(newSkills);
  };

  const handleSkillDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      dragSkillItem.current = null;
      dragOverSkillItem.current = null;
      e.currentTarget.style.opacity = '1';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans transition-colors duration-500">
       
       {/* Top Navigation */}
       <div className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-500 ${isAdminMode ? 'bg-[#1a1500]/80 border-amber-500/20' : 'bg-[#050505]/80 border-[#1F1F22]'}`}>
           <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
               <div className="flex items-center gap-8">
                   <nav className="hidden md:flex items-center gap-6">
                       <button
                         onClick={() => setActiveSection('cursos')}
                         className={`text-xs font-bold tracking-widest transition-colors ${
                           activeSection === 'cursos' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                         }`}
                       >
                         CURSOS
                       </button>
                       <button
                         onClick={() => setActiveSection('trilhas')}
                         className={`text-xs font-bold tracking-widest transition-colors ${
                           activeSection === 'trilhas' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                         }`}
                       >
                         TRILHAS
                       </button>
                       <button
                         onClick={() => setActiveSection('skilltree')}
                         className={`text-xs font-bold tracking-widest transition-colors ${
                           activeSection === 'skilltree' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                         }`}
                       >
                         SKILL TREE
                       </button>
                       <div className="h-4 w-[1px] bg-zinc-800" />
                       <button
                         onClick={() => setActiveSection('progresso')}
                         className={`text-xs font-bold tracking-widest transition-colors ${
                           activeSection === 'progresso' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                         }`}
                       >
                         PROGRESSO
                       </button>
                       <button
                         onClick={() => setActiveSection('socratico')}
                         className={`text-xs font-bold tracking-widest transition-colors ${
                           activeSection === 'socratico' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                         }`}
                       >
                         SOCRÁTICO
                       </button>
                   </nav>
               </div>

               <div className="flex items-center gap-6">
                   <div className="relative hidden md:block group">
                       <Search className="absolute left-0 top-1.5 w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                       <input 
                           type="text" 
                           placeholder="BUSCAR..." 
                           className="bg-transparent border-b border-zinc-800 text-[10px] font-bold tracking-widest py-1 pl-5 w-32 focus:w-48 focus:border-zinc-500 focus:outline-none transition-all text-zinc-300 placeholder-zinc-700"
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

       {/* Main Content */}
       <div className="max-w-[1800px] mx-auto px-6 py-8">

           {/* === CURSOS SECTION === */}
           {activeSection === 'cursos' && (
             <>
               {/* Hero Carousel (PM1-001) */}
               <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                 <HeroCarousel
                   courses={featuredCourses}
                   autoPlayInterval={5000}
                   onCourseClick={handleCourseClick}
                   isEditorMode={isAdminMode}
                   onRemoveCourse={handleRemoveFromCarousel}
                 />
               </div>

               {isAdminMode && (
                   <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
                       <div className="flex items-center gap-4">
                           <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20"><Layers className="w-6 h-6" /></div>
                           <div><h2 className="text-lg font-bold text-white">Painel de Curadoria</h2><p className="text-sm text-zinc-400">Arraste para reordenar. O card encolhe para revelar as ferramentas.</p></div>
                       </div>
                       <div className="flex gap-3">
                           <Button variant="secondary" icon={<Zap className="w-4 h-4" />}>Gerar com AI</Button>
                           <Button variant="primary" icon={<Play className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900">Novo Curso</Button>
                       </div>
                   </div>
               )}

               {/* Filter Bar */}
               <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 hide-scrollbar">
                   {filters.map(filter => (
                       <button key={filter} onClick={() => setSelectedFilter(filter)} className={`px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest transition-all whitespace-nowrap border ${selectedFilter === filter ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]' : 'bg-[#0A0A0A] text-zinc-500 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'}`}>{filter}</button>
                   ))}
               </div>

               {/* Section Header */}
               <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4">
                   <div className="flex items-center gap-4"><h2 className="text-xs font-bold text-zinc-500 tracking-[0.2em]">TODOS OS CURSOS</h2><div className="h-[1px] w-12 bg-zinc-800" /></div>
                   <span className="text-[10px] font-bold text-zinc-600 tracking-wider">{localCourses.length} cursos</span>
               </div>

               {/* Course Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {localCourses.map((course, index) => (
                       <div
                            key={course.id}
                            className={`h-[360px] relative group perspective-1000 ${isAdminMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                            draggable={isAdminMode}
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnter={(e) => handleDragEnter(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => e.preventDefault()}
                       >
                           {isAdminMode && (
                               <div className="absolute inset-0 z-0 animate-in fade-in duration-500 pointer-events-none">
                                   <div className="absolute inset-0 rounded-2xl border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
                               </div>
                           )}

                           <div className={`
                               h-full w-full transition-all duration-300 ease-out relative z-10 origin-center
                               ${isAdminMode ? 'scale-[0.90] cursor-default' : 'hover:-translate-y-2 cursor-pointer'}
                           `}>
                               <AcademyCourseCard
                                   course={course}
                                   onClick={() => !isAdminMode && handleCourseClick(course.id)}
                               />
                           </div>

                           {isAdminMode && (
                               <div className="absolute inset-0 z-20 pointer-events-none animate-in fade-in duration-500">
                                   <div className="absolute top-2 left-2 pointer-events-auto">
                                       <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white shadow-xl hover:scale-110 transition-all cursor-grab active:cursor-grabbing">
                                           <GripVertical className="w-4 h-4" />
                                       </button>
                                   </div>
                                   <div className="absolute top-2 right-2 pointer-events-auto">
                                       <button
                                           onClick={(e) => { e.stopPropagation(); onEditCourse && onEditCourse(course.id); }}
                                           className="w-10 h-10 bg-amber-500 border-2 border-amber-300 rounded-full flex items-center justify-center text-zinc-900 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-110 hover:rotate-12 transition-all"
                                       >
                                           <PenTool className="w-4 h-4 fill-current" />
                                       </button>
                                   </div>
                                   <div className="absolute bottom-2 right-2 pointer-events-auto">
                                       <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-950 hover:border-rose-500 transition-all shadow-xl">
                                           <Trash2 className="w-4 h-4" />
                                       </button>
                                   </div>
                                   <div onClick={() => onEditCourse && onEditCourse(course.id)} className="absolute inset-0 flex items-center justify-center cursor-pointer group/edit pointer-events-auto">
                                       <div className="w-1/2 h-1/2 flex items-center justify-center">
                                            <div className="px-5 py-2.5 bg-black/90 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-widest shadow-2xl opacity-0 group-hover/edit:opacity-100 transition-all duration-300 flex items-center gap-2 transform translate-y-4 group-hover/edit:translate-y-0">
                                                <Settings className="w-3 h-3" /> Gerenciar
                                            </div>
                                       </div>
                                   </div>
                               </div>
                           )}
                       </div>
                   ))}
               </div>

               {!isAdminMode && (
                   <div className="mt-20 relative rounded-3xl bg-[#0A0A0A] border border-zinc-800 p-12 overflow-hidden">
                       <div className="relative z-10 max-w-xl">
                           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/50 mb-6">
                               <Zap className="w-3 h-3 text-white" />
                               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NOVO RECURSO</span>
                           </div>
                           <h2 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
                               Sincronize com<br />
                               <span className="text-[#d4b589]">Inteligência.</span>
                           </h2>
                       </div>
                       <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-[#d4b589]/10 to-transparent blur-3xl pointer-events-none" />
                   </div>
               )}
             </>
           )}

           {/* === TRILHAS SECTION (PM1-002 Redesign) === */}
           {activeSection === 'trilhas' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {!isAdminMode ? (
                 <div className="mb-12 text-center">
                   <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Trilhas de Aprendizado</h1>
                   <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                     Caminhos estruturados para dominar competências complexas. Siga o mapa e construa seu legado.
                   </p>
                 </div>
               ) : (
                 <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20"><Layers className="w-6 h-6" /></div>
                     <div><h2 className="text-lg font-bold text-white">Editor de Trilhas</h2><p className="text-sm text-zinc-400">Arraste para reordenar. Clique para editar.</p></div>
                   </div>
                   <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900">Nova Trilha</Button>
                 </div>
               )}

               {/* PM2-003: Full-width stacked cards */}
               <div className="flex flex-col gap-6 max-w-5xl mx-auto" role="list" aria-label="Lista de trilhas">
                 {localTracks.map((track, index) => (
                   <div
                     key={track.id}
                     draggable={isAdminMode}
                     onDragStart={(e) => handleTrackDragStart(e, index)}
                     onDragEnter={(e) => handleTrackDragEnter(e, index)}
                     onDragEnd={handleTrackDragEnd}
                     onDragOver={(e) => e.preventDefault()}
                   >
                     <TrackCardFullWidth
                       track={track}
                       onNavigate={(id) => handleNavClick('academy-tracks')}
                       isEditorMode={isAdminMode}
                       onEdit={(id) => console.log('Edit track:', id)}
                       onDelete={(id) => setLocalTracks(prev => prev.filter(t => t.id !== id))}
                     />
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* === SKILL TREE SECTION === */}
           {activeSection === 'skilltree' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {!isAdminMode ? (
                 <div className="mb-8">
                   <h1 className="text-3xl font-bold text-white mb-2">Skill Tree</h1>
                   <p className="text-zinc-400 font-serif">Visualize e evolua suas habilidades.</p>
                 </div>
               ) : (
                 <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20"><Target className="w-6 h-6" /></div>
                     <div><h2 className="text-lg font-bold text-white">Editor de Skills</h2><p className="text-sm text-zinc-400">Defina quais skills aparecem para os usuários.</p></div>
                   </div>
                   <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900">Nova Skill</Button>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {localSkills.map((skill, idx) => (
                   <div
                     key={idx}
                     className={`relative group ${isAdminMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                     draggable={isAdminMode}
                     onDragStart={(e) => handleSkillDragStart(e, idx)}
                     onDragEnter={(e) => handleSkillDragEnter(e, idx)}
                     onDragEnd={handleSkillDragEnd}
                     onDragOver={(e) => e.preventDefault()}
                   >
                     {isAdminMode && (
                       <div className="absolute inset-0 z-0 animate-in fade-in duration-500 pointer-events-none">
                         <div className="absolute inset-0 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]" />
                       </div>
                     )}

                     <div className={`bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6 relative z-10 transition-all ${isAdminMode ? 'scale-[0.92]' : ''}`}>
                       <div className="flex items-center justify-between mb-4">
                         <div>
                           <h3 className="text-white font-bold">{skill.name}</h3>
                           <p className="text-xs text-zinc-500 uppercase tracking-wider">{skill.category}</p>
                         </div>
                         <span className="text-2xl font-bold text-amber-400">{skill.level}%</span>
                       </div>
                       <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-500" style={{ width: `${skill.level}%` }} />
                       </div>
                     </div>

                     {isAdminMode && (
                       <div className="absolute inset-0 z-20 pointer-events-none animate-in fade-in duration-500">
                         <div className="absolute top-2 left-2 pointer-events-auto">
                           <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-zinc-400 hover:text-white shadow-xl hover:scale-110 transition-all cursor-grab active:cursor-grabbing">
                             <GripVertical className="w-4 h-4" />
                           </button>
                         </div>
                         <div className="absolute top-2 right-2 pointer-events-auto">
                           <button className="w-10 h-10 bg-amber-500 border-2 border-amber-300 rounded-full flex items-center justify-center text-zinc-900 shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:scale-110 hover:rotate-12 transition-all">
                             <PenTool className="w-4 h-4 fill-current" />
                           </button>
                         </div>
                         <div className="absolute bottom-2 right-2 pointer-events-auto">
                           <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-950 hover:border-rose-500 transition-all shadow-xl">
                             <Trash2 className="w-4 h-4" />
                           </button>
                         </div>
                       </div>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* === PROGRESSO SECTION === */}
           {activeSection === 'progresso' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {!isAdminMode ? (
                 <div className="mb-8">
                   <h1 className="text-3xl font-bold text-white mb-2">Seu Progresso</h1>
                   <p className="text-zinc-400 font-serif">Acompanhe sua evolução e conquistas.</p>
                 </div>
               ) : (
                 <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20"><Trophy className="w-6 h-6" /></div>
                     <div><h2 className="text-lg font-bold text-white">Editor de Conquistas</h2><p className="text-sm text-zinc-400">Gerencie badges e métricas de progresso.</p></div>
                   </div>
                   <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900">Nova Conquista</Button>
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className={`bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6 text-center relative ${isAdminMode ? 'group' : ''}`}>
                   {isAdminMode && (
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900"><PenTool className="w-4 h-4" /></button>
                     </div>
                   )}
                   <div className="w-16 h-16 rounded-full bg-amber-900/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                     <Flame className="w-8 h-8 text-amber-500" />
                   </div>
                   <p className="text-3xl font-bold text-white">12</p>
                   <p className="text-xs text-zinc-500 uppercase tracking-wider">Dias de Streak</p>
                 </div>
                 <div className={`bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6 text-center relative ${isAdminMode ? 'group' : ''}`}>
                   {isAdminMode && (
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900"><PenTool className="w-4 h-4" /></button>
                     </div>
                   )}
                   <div className="w-16 h-16 rounded-full bg-emerald-900/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                     <Trophy className="w-8 h-8 text-emerald-500" />
                   </div>
                   <p className="text-3xl font-bold text-white">{localAchievements.filter(a => a.status === 'unlocked').length}</p>
                   <p className="text-xs text-zinc-500 uppercase tracking-wider">Conquistas</p>
                 </div>
                 <div className={`bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6 text-center relative ${isAdminMode ? 'group' : ''}`}>
                   {isAdminMode && (
                     <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900"><PenTool className="w-4 h-4" /></button>
                     </div>
                   )}
                   <div className="w-16 h-16 rounded-full bg-blue-900/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                     <BookOpen className="w-8 h-8 text-blue-500" />
                   </div>
                   <p className="text-3xl font-bold text-white">{ACADEMY_COURSES.filter(c => c.progress > 0).length}</p>
                   <p className="text-xs text-zinc-500 uppercase tracking-wider">Cursos em Progresso</p>
                 </div>
               </div>

               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-white">Conquistas {isAdminMode ? '(Todas)' : 'Recentes'}</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {(isAdminMode ? localAchievements : localAchievements.slice(0, 4)).map(achievement => (
                   <div key={achievement.id} className={`bg-[#0A0A0A] border rounded-xl p-4 relative group ${achievement.status === 'unlocked' ? 'border-amber-500/30' : 'border-[#1F1F22] opacity-50'} ${isAdminMode ? 'hover:border-amber-500/50' : ''}`}>
                     {isAdminMode && (
                       <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900"><PenTool className="w-3 h-3" /></button>
                         <button className="w-6 h-6 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-rose-500"><Trash2 className="w-3 h-3" /></button>
                       </div>
                     )}
                     <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${achievement.status === 'unlocked' ? 'bg-amber-900/30 text-amber-400' : 'bg-zinc-800 text-zinc-600'}`}>
                         <achievement.icon className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">{achievement.title}</p>
                         <p className="text-[10px] text-zinc-500">{achievement.description}</p>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           )}

           {/* === SOCRATICO SECTION === */}
           {activeSection === 'socratico' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               {!isAdminMode ? (
                 <div className="mb-8">
                   <h1 className="text-3xl font-bold text-white mb-2">Sessões Socráticas</h1>
                   <p className="text-zinc-400 font-serif">Aprenda através do diálogo e questionamento guiado.</p>
                 </div>
               ) : (
                 <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex items-center justify-between animate-in fade-in duration-300">
                   <div className="flex items-center gap-4">
                     <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500 border border-amber-500/20"><MessageSquare className="w-6 h-6" /></div>
                     <div><h2 className="text-lg font-bold text-white">Editor Socrático</h2><p className="text-sm text-zinc-400">Configure temas, prompts e parâmetros da IA.</p></div>
                   </div>
                   <div className="flex gap-3">
                     <Button variant="secondary" icon={<Zap className="w-4 h-4" />}>Configurar IA</Button>
                     <Button variant="primary" icon={<Plus className="w-4 h-4" />} className="bg-amber-500 hover:bg-amber-400 text-zinc-900">Novo Tema</Button>
                   </div>
                 </div>
               )}

               <div className={`bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl p-8 text-center relative ${isAdminMode ? 'group' : ''}`}>
                 {isAdminMode && (
                   <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900"><PenTool className="w-4 h-4" /></button>
                   </div>
                 )}
                 <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-900/30 to-purple-600/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-6">
                   <MessageSquare className="w-10 h-10 text-purple-400" />
                 </div>
                 <h2 className="text-xl font-bold text-white mb-2">Inicie uma Sessão Socrática</h2>
                 <p className="text-zinc-400 mb-6 max-w-md mx-auto">Escolha um tema e aprenda através de perguntas e reflexões guiadas por IA.</p>
                 <button className={`px-8 py-4 font-bold rounded-lg transition-all ${isAdminMode ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_20px_rgba(147,51,234,0.3)]'}`} disabled={isAdminMode}>
                   {isAdminMode ? 'Desativado no Editor' : 'Começar Diálogo'}
                 </button>
               </div>

               <div className="mt-8">
                 <div className="flex justify-between items-center mb-4">
                   <h2 className="text-lg font-bold text-white">{isAdminMode ? 'Temas Disponíveis' : 'Sessões Anteriores'}</h2>
                 </div>
                 <div className="space-y-3">
                   <div className={`bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group ${isAdminMode ? 'hover:border-amber-500/50' : 'hover:border-zinc-700'}`}>
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center text-purple-400">
                         <MessageSquare className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">Product Discovery</p>
                         <p className="text-xs text-zinc-500">{isAdminMode ? 'Tema ativo • 15 perguntas' : 'Há 2 dias • 15 min'}</p>
                       </div>
                     </div>
                     {isAdminMode ? (
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900"><PenTool className="w-3 h-3" /></button>
                         <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-rose-500"><Trash2 className="w-3 h-3" /></button>
                       </div>
                     ) : (
                       <ChevronRight className="w-5 h-5 text-zinc-600" />
                     )}
                   </div>
                   <div className={`bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4 flex items-center justify-between transition-colors cursor-pointer group ${isAdminMode ? 'hover:border-amber-500/50' : 'hover:border-zinc-700'}`}>
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center text-purple-400">
                         <MessageSquare className="w-5 h-5" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">System Design Principles</p>
                         <p className="text-xs text-zinc-500">{isAdminMode ? 'Tema ativo • 22 perguntas' : 'Há 1 semana • 22 min'}</p>
                       </div>
                     </div>
                     {isAdminMode ? (
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-zinc-900"><PenTool className="w-3 h-3" /></button>
                         <button className="w-8 h-8 bg-[#121214] border border-zinc-700 rounded-full flex items-center justify-center text-rose-500"><Trash2 className="w-3 h-3" /></button>
                       </div>
                     ) : (
                       <ChevronRight className="w-5 h-5 text-zinc-600" />
                     )}
                   </div>
                 </div>
               </div>
             </div>
           )}

       </div>
    </div>
  );
};
