import React from 'react';
import { ACADEMY_COURSES } from '../../constants';
import { AcademyCourseCard } from '../academy/AcademyCourseCard';
import { User, Search, Heart, ArrowLeft } from 'lucide-react';

interface AcademyFavoritesProps {
    onNavigateToCourse: (courseId: string) => void;
    onNavigate: (pageId: string) => void;
}

export const AcademyFavorites: React.FC<AcademyFavoritesProps> = ({ onNavigateToCourse, onNavigate }) => {
    const favoriteCourses = ACADEMY_COURSES.filter(c => c.isFavorite);

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
            {/* Top Navigation */}
            <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-[#1F1F22]">
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <button onClick={() => onNavigate('academy-dashboard')} className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">EXPLORAR</button>
                            <button onClick={() => onNavigate('academy-tracks')} className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">TRILHAS</button>
                            <button onClick={() => onNavigate('academy-favorites')} className="text-xs font-bold tracking-widest transition-colors text-white">FAVORITOS</button>
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
                                className="bg-transparent border-b border-zinc-800 text-[10px] font-bold tracking-widest py-1 pl-5 w-32 focus:w-48 focus:border-zinc-500 focus:outline-none transition-all text-zinc-300 placeholder-zinc-700"
                            />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                             <User className="w-full h-full p-1.5 text-zinc-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1800px] mx-auto px-6 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <Heart className="w-6 h-6 text-rose-500 fill-current" />
                    <h1 className="text-2xl font-bold text-white tracking-tight">Meus Favoritos</h1>
                </div>

                {favoriteCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favoriteCourses.map(course => (
                            <div key={course.id} className="h-[360px]">
                                <AcademyCourseCard 
                                    course={course} 
                                    onClick={() => onNavigateToCourse(course.id)} 
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-zinc-800 rounded-xl">
                        <Heart className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <p className="text-zinc-500 text-lg">Você ainda não favoritou nenhum curso.</p>
                        <button onClick={() => onNavigate('academy-dashboard')} className="text-eximia-400 text-sm font-bold mt-2 hover:underline">
                            Explorar Cursos
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};