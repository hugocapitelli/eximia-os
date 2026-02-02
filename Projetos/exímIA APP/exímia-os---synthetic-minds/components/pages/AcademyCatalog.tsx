import React, { useState } from 'react';
import { ACADEMY_COURSES } from '../../constants';
import { AcademyCourseCard } from '../academy/AcademyCourseCard';
import { SearchBar } from '../molecules/SearchBar';
import { Filter, Star, Zap } from 'lucide-react';

interface AcademyCatalogProps {
    onNavigateToCourse: (courseId: string) => void;
}

export const AcademyCatalog: React.FC<AcademyCatalogProps> = ({ onNavigateToCourse }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedLevel, setSelectedLevel] = useState('All');

    const categories = ['All', ...Array.from(new Set(ACADEMY_COURSES.map(c => c.category)))];
    const levels = ['All', 'Iniciante', 'Intermediário', 'Avançado'];

    const filteredCourses = ACADEMY_COURSES.filter(course => {
        const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
        const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
        return matchesCategory && matchesLevel;
    });

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">Catálogo de Cursos</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-serif text-lg max-w-2xl">
                    Explore conhecimentos profundos curados por Mentes Sintéticas. 
                </p>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-[#18181B] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                <div className="w-full lg:w-96">
                    <SearchBar />
                </div>
                
                <div className="flex flex-1 flex-wrap gap-4 items-center">
                     <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Categorias:</span>
                     </div>
                     <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`
                                    px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                    ${selectedCategory === cat 
                                        ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' 
                                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}
                                `}
                            >
                                {cat}
                            </button>
                        ))}
                     </div>
                </div>

                 <div className="flex gap-2 flex-wrap">
                    {levels.map(level => (
                         <button
                            key={level}
                            onClick={() => setSelectedLevel(level)}
                            className={`
                                text-xs font-medium transition-colors px-2
                                ${selectedLevel === level ? 'text-eximia-600 dark:text-eximia-400 font-bold' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}
                            `}
                        >
                            {level}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Featured Section (if All selected) */}
            {selectedCategory === 'All' && selectedLevel === 'All' && (
                <div className="mb-12">
                     <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-zinc-700 shadow-xl">
                        <div className="flex-1 relative z-10">
                            <div className="inline-flex items-center gap-2 bg-eximia-500/20 text-eximia-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-eximia-500/30">
                                <Zap className="w-3 h-3 fill-current" /> Destaque
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Liderança Socrática</h2>
                            <p className="text-zinc-300 text-lg mb-8 max-w-xl font-serif">
                                Aprenda a arte de liderar através de perguntas. Transforme sua equipe desenvolvendo autonomia e pensamento crítico.
                            </p>
                            <button 
                                onClick={() => onNavigateToCourse('lead-socratic')}
                                className="bg-eximia-500 hover:bg-eximia-400 text-zinc-900 font-bold px-6 py-3 rounded-lg transition-colors"
                            >
                                Começar Agora
                            </button>
                        </div>
                        <div className="w-full md:w-1/3 aspect-video bg-zinc-700/50 rounded-lg flex items-center justify-center relative backdrop-blur-sm border border-white/10">
                             <Star className="w-16 h-16 text-white/20" />
                             {/* Decorative circles */}
                             <div className="absolute -top-10 -right-10 w-40 h-40 bg-eximia-500/20 rounded-full blur-3xl" />
                             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
                        </div>
                     </div>
                </div>
            )}

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map(course => (
                     <div key={course.id} className="h-[380px]">
                        <AcademyCourseCard 
                            course={course} 
                            onClick={() => onNavigateToCourse(course.id)} 
                        />
                     </div>
                ))}
                
                {filteredCourses.length === 0 && (
                     <div className="col-span-full py-20 text-center">
                         <p className="text-zinc-500 text-lg">Nenhum curso encontrado com estes filtros.</p>
                         <button 
                            onClick={() => {setSelectedCategory('All'); setSelectedLevel('All')}}
                            className="text-eximia-600 dark:text-eximia-400 font-medium mt-2 hover:underline"
                        >
                             Limpar filtros
                         </button>
                     </div>
                )}
            </div>
        </div>
    );
};