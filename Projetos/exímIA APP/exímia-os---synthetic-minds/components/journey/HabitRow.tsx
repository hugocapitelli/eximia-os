import React from 'react';
import { Habit } from '../../types';
import { Check, Flame, Clock } from 'lucide-react';

interface HabitRowProps {
  habit: Habit;
  onCheck: (id: string) => void;
}

export const HabitRow: React.FC<HabitRowProps> = ({ habit, onCheck }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-[#1F1F22] border border-zinc-200 dark:border-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
      <div className="flex items-center gap-4">
        {/* Checkbox Button */}
        <button 
          onClick={() => onCheck(habit.id)}
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300
            ${habit.completedToday 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
              : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-transparent hover:border-emerald-400 hover:text-emerald-400/20'}
          `}
        >
          <Check className="w-5 h-5" strokeWidth={3} />
        </button>

        {/* Info */}
        <div>
          <h4 className={`text-sm font-semibold transition-colors ${habit.completedToday ? 'text-zinc-400 line-through decoration-zinc-400' : 'text-zinc-900 dark:text-zinc-100'}`}>
            {habit.name}
          </h4>
          <div className="flex items-center gap-3 mt-0.5">
             {habit.time && (
                 <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-mono">
                    <Clock className="w-3 h-3" />
                    {habit.time}
                 </span>
             )}
             <span className="text-[10px] text-zinc-400 uppercase tracking-wide">{habit.frequency === 'daily' ? 'Diário' : 'Semanal'}</span>
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${habit.streak > 0 ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400' : 'text-zinc-400'}`}>
        <Flame className={`w-4 h-4 ${habit.streak > 0 ? 'fill-current' : ''}`} />
        <span className="text-xs font-bold font-mono">{habit.streak}</span>
      </div>
    </div>
  );
};