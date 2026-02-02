import React, { useState } from 'react';
import { JOURNEY_GOALS } from '../../constants';
import { GoalCard } from '../journey/GoalCard';
import { Button } from '../atoms/Button';
import { Plus, Target, CalendarRange } from 'lucide-react';

export const JourneyGoals: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Life', 'Yearly', 'Quarterly', 'Monthly'];

  const filteredGoals = activeTab === 'All' 
    ? JOURNEY_GOALS 
    : JOURNEY_GOALS.filter(g => g.scope === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Metas & Objetivos</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">Transforme visão em realidade através de execução estruturada.</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Nova Meta</Button>
      </div>

      {/* Stats / Context */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
         <div className="bg-zinc-50 dark:bg-[#18181B] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
               <Target className="w-6 h-6" />
            </div>
            <div>
               <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{JOURNEY_GOALS.length}</p>
               <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total de Metas</p>
            </div>
         </div>
         <div className="bg-zinc-50 dark:bg-[#18181B] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
               <CalendarRange className="w-6 h-6" />
            </div>
            <div>
               <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{JOURNEY_GOALS.filter(g => g.status === 'completed').length}</p>
               <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Concluídas</p>
            </div>
         </div>
         <div className="bg-zinc-50 dark:bg-[#18181B] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center">
             <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-zinc-500 uppercase">Taxa de Sucesso</span>
                <span className="text-sm font-bold text-eximia-600 dark:text-eximia-400">25%</span>
             </div>
             <div className="h-2 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-eximia-400 w-1/4 rounded-full"></div>
             </div>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 hide-scrollbar">
        {tabs.map(tab => (
           <button
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
               activeTab === tab 
                 ? 'bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 shadow-lg' 
                 : 'bg-white dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
        
        {/* Empty State placeholder if needed */}
        {filteredGoals.length === 0 && (
             <div className="col-span-full py-16 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                 <p className="text-zinc-400">Nenhuma meta encontrada neste escopo.</p>
                 <Button variant="ghost" size="sm" className="mt-2" icon={<Plus className="w-4 h-4"/>}>Criar Meta</Button>
             </div>
        )}
      </div>
    </div>
  );
};