import React, { useState } from 'react';
import { STRATEGY_CYCLES, STRATEGY_INITIATIVES } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { 
  Crosshair, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  MoreHorizontal, 
  Plus, 
  Map,
  Flag,
  Calendar
} from 'lucide-react';

export const StrategyDashboard: React.FC = () => {
  const activeCycle = STRATEGY_CYCLES.find(c => c.status === 'active');
  const initiatives = STRATEGY_INITIATIVES.filter(i => i.cycleId === activeCycle?.id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'must_have': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'should_have': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'nice_to_have': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-zinc-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': case 'completed': return 'text-emerald-500';
      case 'attention': return 'text-amber-500';
      case 'critical': return 'text-rose-500';
      default: return 'text-zinc-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Badge variant="primary" className="bg-rose-500/10 text-rose-500 border-rose-500/20">StratOS v5.0</Badge>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
            Strategy Hub
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
            Direção clara. Execução implacável.
          </p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" icon={<Map className="w-4 h-4" />}>Roadmap</Button>
             <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Nova Iniciativa</Button>
        </div>
      </header>

      {/* Cycle Hero Card */}
      {activeCycle && (
        <div className="bg-zinc-900 dark:bg-[#18181B] border border-zinc-800 rounded-2xl p-8 mb-12 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crosshair className="w-64 h-64 text-eximia-500" />
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-eximia-500 text-xs font-bold uppercase tracking-wider mb-2">Ciclo Atual</p>
                        <h2 className="text-3xl font-bold text-white mb-2">{activeCycle.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {activeCycle.startDate} - {activeCycle.endDate}</span>
                            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium">{activeCycle.type}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                        <div className="flex items-center gap-2 justify-end">
                            <span className={`w-2 h-2 rounded-full ${activeCycle.health === 'on_track' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span className="text-white font-bold capitalize">{activeCycle.health.replace('_', ' ')}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700/50 mb-6">
                    <h3 className="text-sm font-bold text-zinc-300 mb-2 flex items-center gap-2">
                        <Flag className="w-4 h-4 text-eximia-500" /> Visão do Ciclo
                    </h3>
                    <p className="text-zinc-400 font-serif italic text-lg leading-relaxed">
                        "{activeCycle.vision}"
                    </p>
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                        <span className="text-zinc-500 font-medium">Progresso do Ciclo</span>
                        <span className="text-white font-bold">{activeCycle.progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-eximia-600 to-eximia-400 h-full rounded-full transition-all duration-500" style={{ width: `${activeCycle.progress}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Initiatives Grid */}
      <section>
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Target className="w-5 h-5 text-eximia-500" />
                  Iniciativas Estratégicas
              </h2>
              <div className="flex gap-2">
                  <button className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 px-3 py-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">Todas</button>
                  <button className="text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">Em Progresso</button>
              </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
              {initiatives.map(initiative => (
                  <div key={initiative.id} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:border-eximia-500/30 transition-colors shadow-sm group">
                      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                          
                          {/* Priority Indicator */}
                          <div className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center border ${getPriorityColor(initiative.priority)}`}>
                              <span className="text-xs font-bold uppercase">{initiative.priority === 'must_have' ? 'P1' : initiative.priority === 'should_have' ? 'P2' : 'P3'}</span>
                          </div>

                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 truncate">{initiative.title}</h3>
                                  <Badge variant="outline" className="text-[10px]">{initiative.deadline}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-xs text-zinc-500">
                                  <span className="flex items-center gap-1">👤 {initiative.owner}</span>
                                  <span className="flex items-center gap-1">🎯 {initiative.kpi}</span>
                              </div>
                          </div>

                          {/* Progress Section */}
                          <div className="w-full md:w-48">
                              <div className="flex justify-between items-center text-xs mb-1.5">
                                  <span className={`font-bold capitalize flex items-center gap-1.5 ${getStatusColor(initiative.status)}`}>
                                      {initiative.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                                      {initiative.status === 'attention' && <AlertTriangle className="w-3 h-3" />}
                                      {initiative.status.replace('_', ' ')}
                                  </span>
                                  <span className="font-mono text-zinc-400">{initiative.progress}%</span>
                              </div>
                              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${initiative.status === 'completed' ? 'bg-emerald-500' : 'bg-zinc-900 dark:bg-zinc-100'}`} 
                                    style={{ width: `${initiative.progress}%` }}
                                  ></div>
                              </div>
                          </div>

                          <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100 transition-all">
                              <MoreHorizontal className="w-5 h-5" />
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </section>
    </div>
  );
};