import React from 'react';
import { JOURNEY_HABITS } from '../../constants';
import { HabitRow } from '../journey/HabitRow';
import { Button } from '../atoms/Button';
import { Plus, Calendar, Flame, Trophy, Activity } from 'lucide-react';

export const JourneyHabits: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 animate-fade-in font-sans">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Hábitos Atômicos</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">Consistência vence intensidade.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Novo Hábito</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-xl border border-orange-200 dark:border-orange-500/30 relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2 text-orange-600 dark:text-orange-400">
                <Flame className="w-6 h-6" />
                <span className="font-bold text-sm uppercase tracking-wider">Maior Streak</span>
             </div>
             <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">45 Dias</div>
             <p className="text-xs text-orange-600/80 dark:text-orange-400/80 mt-1">Meditação Diária</p>
           </div>
           <Flame className="absolute -bottom-4 -right-4 w-32 h-32 text-orange-500/10 dark:text-orange-500/5 rotate-12" />
        </div>
         <div className="bg-zinc-50 dark:bg-[#18181B] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
           <div className="flex items-center gap-3 mb-2 text-zinc-500">
              <Activity className="w-6 h-6" />
              <span className="font-bold text-sm uppercase tracking-wider">Taxa de Conclusão</span>
           </div>
           <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">87%</div>
           <p className="text-xs text-zinc-500 mt-1">Últimos 30 dias</p>
        </div>
         <div className="bg-zinc-50 dark:bg-[#18181B] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
           <div className="flex items-center gap-3 mb-2 text-zinc-500">
              <Trophy className="w-6 h-6" />
              <span className="font-bold text-sm uppercase tracking-wider">Dias Perfeitos</span>
           </div>
           <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">12 Dias</div>
           <p className="text-xs text-zinc-500 mt-1">Todas tarefas cumpridas</p>
        </div>
      </div>

      {/* Habits List */}
      <div className="bg-white dark:bg-[#18181B] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <h3 className="font-bold text-zinc-700 dark:text-zinc-300">Hoje</h3>
           </div>
           <span className="text-xs font-mono text-zinc-500">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long'})}</span>
        </div>
        <div className="p-4 space-y-3">
          {JOURNEY_HABITS.map(habit => (
             <HabitRow key={habit.id} habit={habit} onCheck={() => {}} />
          ))}
        </div>
      </div>
    </div>
  );
};