import React from 'react';
import { ACADEMY_ACHIEVEMENTS, ACADEMY_SKILLS } from '../../constants';
import { Badge } from '../atoms/Badge';
import { Trophy, Lock, Medal, Star, TrendingUp } from 'lucide-react';

export const AcademyAchievements: React.FC = () => {
    const unlockedCount = ACADEMY_ACHIEVEMENTS.filter(a => a.status === 'unlocked').length;
    const totalXP = 1250; // Mocked for now

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in font-sans">
             {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Conquistas & Progresso</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-serif text-lg">
                    Seu legado de aprendizado quantificado.
                </p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-500/20 flex items-center gap-5">
                     <div className="w-16 h-16 rounded-full bg-white/50 dark:bg-black/20 flex items-center justify-center text-amber-600 dark:text-amber-500 shadow-sm">
                         <Trophy className="w-8 h-8" />
                     </div>
                     <div>
                         <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider mb-1">Badges Desbloqueados</p>
                         <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{unlockedCount} <span className="text-lg text-zinc-500 dark:text-zinc-400 font-medium">/ {ACADEMY_ACHIEVEMENTS.length}</span></p>
                     </div>
                 </div>

                 <div className="bg-zinc-50 dark:bg-[#18181B] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-5">
                     <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-indigo-500 shadow-sm">
                         <Star className="w-8 h-8" />
                     </div>
                     <div>
                         <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Total XP</p>
                         <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{totalXP}</p>
                     </div>
                 </div>

                  <div className="bg-zinc-50 dark:bg-[#18181B] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-5">
                     <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-emerald-500 shadow-sm">
                         <Medal className="w-8 h-8" />
                     </div>
                     <div>
                         <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Nível Atual</p>
                         <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Scholar I</p>
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Badges Column (2/3) */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                        <Medal className="w-5 h-5 text-eximia-500" /> 
                        Galeria de Badges
                    </h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ACADEMY_ACHIEVEMENTS.map(achievement => (
                            <div 
                                key={achievement.id}
                                className={`
                                    flex items-start gap-4 p-4 rounded-xl border transition-all
                                    ${achievement.status === 'unlocked' 
                                        ? 'bg-white dark:bg-[#1F1F22] border-zinc-200 dark:border-zinc-800 shadow-sm' 
                                        : 'bg-zinc-50 dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/50 opacity-60 grayscale'}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-lg flex items-center justify-center shrink-0
                                    ${achievement.status === 'unlocked' 
                                        ? 'bg-gradient-to-br from-eximia-100 to-eximia-200 dark:from-eximia-900/40 dark:to-eximia-800/40 text-eximia-700 dark:text-eximia-400' 
                                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'}
                                `}>
                                    {achievement.status === 'unlocked' ? <achievement.icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{achievement.title}</h3>
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{achievement.description}</p>
                                    
                                    {achievement.status === 'unlocked' && achievement.unlockedAt && (
                                        <p className="text-[10px] text-eximia-600 dark:text-eximia-500 font-mono mt-2">Desbloqueado em {achievement.unlockedAt}</p>
                                    )}
                                    
                                    {achievement.status === 'locked' && achievement.progress !== undefined && (
                                        <div className="mt-2 w-full bg-zinc-200 dark:bg-zinc-700 h-1 rounded-full overflow-hidden">
                                            <div className="bg-zinc-400 h-full" style={{ width: `${achievement.progress}%` }} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skill Tree Column (1/3) */}
                <div>
                     <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500" /> 
                        Skill Tree
                    </h2>
                    
                    <div className="bg-white dark:bg-[#18181B] rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm space-y-6">
                        {ACADEMY_SKILLS.map((skill, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="font-bold text-sm text-zinc-700 dark:text-zinc-300">{skill.name}</span>
                                    <Badge variant="outline">{skill.category}</Badge>
                                </div>
                                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full relative z-10"
                                        style={{ width: `${skill.level}%` }}
                                    />
                                    {/* Grid lines for visual effect */}
                                    <div className="absolute inset-0 flex justify-between px-2 z-20 opacity-30">
                                        <div className="w-[1px] h-full bg-white dark:bg-zinc-900" />
                                        <div className="w-[1px] h-full bg-white dark:bg-zinc-900" />
                                        <div className="w-[1px] h-full bg-white dark:bg-zinc-900" />
                                    </div>
                                </div>
                                <div className="text-right mt-1">
                                    <span className="text-xs font-mono text-zinc-400">Lvl {Math.floor(skill.level / 10) + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                            Continue completando lições para evoluir sua árvore de habilidades. Novas skills desbloqueiam novos Clones.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};