import React from 'react';
import { Goal } from '../../types';
import { Target, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Badge } from '../atoms/Badge';

interface GoalCardProps {
  goal: Goal;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const getStatusColor = () => {
    switch (goal.status) {
      case 'completed': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
      case 'in_progress': return 'text-eximia-600 dark:text-eximia-400 bg-eximia-50 dark:bg-eximia-400/10 border-eximia-200 dark:border-eximia-400/20';
      case 'paused': return 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      default: return 'text-zinc-500 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700';
    }
  };

  return (
    <div className="bg-white dark:bg-[#18181B] rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      
      {/* Scope Badge */}
      <div className="flex justify-between items-start mb-3">
        <Badge variant="outline" className="text-xs">{goal.scope}</Badge>
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{goal.category}</span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4 group-hover:text-eximia-600 dark:group-hover:text-eximia-400 transition-colors">
        {goal.title}
      </h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-zinc-500 font-medium">Progresso</span>
          <span className="font-bold text-zinc-900 dark:text-zinc-100">{goal.progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-eximia-400 rounded-full transition-all duration-500"
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/50">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
           {goal.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <TrendingUp className="w-3.5 h-3.5" />}
           <span>{goal.status === 'in_progress' ? 'Em andamento' : 'Concluído'}</span>
        </div>
        {goal.deadline && (
            <span className="text-xs text-zinc-400 font-medium font-mono">{goal.deadline}</span>
        )}
      </div>

      {/* Status Indicator Stripe */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusColor().split(' ')[0].replace('text-', 'bg-')}`} />
    </div>
  );
};