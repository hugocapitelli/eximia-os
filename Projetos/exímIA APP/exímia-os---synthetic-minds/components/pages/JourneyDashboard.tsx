import React from 'react';
import { GoalCard } from '../journey/GoalCard';
import { HabitRow } from '../journey/HabitRow';
import { BookCard } from '../journey/BookCard';
import { JOURNEY_GOALS, JOURNEY_HABITS, JOURNEY_BOOKS } from '../../constants';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { Plus, ChevronRight, Target, Flame, Book, Zap } from 'lucide-react';

export const JourneyDashboard: React.FC = () => {
  // Mock handler for check habit
  const handleCheckHabit = (id: string) => {
    console.log('Toggle habit:', id);
  };

  const activeGoals = JOURNEY_GOALS.filter(g => g.status === 'in_progress').slice(0, 3);
  const todaysHabits = JOURNEY_HABITS; // For demo show all
  const currentBooks = JOURNEY_BOOKS.filter(b => b.status === 'reading');

  // Stats (Mocked)
  const stats = [
    { label: 'Metas', value: '8/12', sub: '67%', icon: Target, color: 'text-blue-500' },
    { label: 'Hábitos', value: '5/8', sub: '63%', icon: Zap, color: 'text-amber-500' },
    { label: 'Streak', value: '45', sub: 'dias 🔥', icon: Flame, color: 'text-orange-500' },
    { label: 'Leitura', value: '3', sub: 'livros', icon: Book, color: 'text-emerald-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      
      {/* 1. Header & Welcome */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <Badge variant="primary">25 de Janeiro, 2026</Badge>
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Bom dia, Hugo 🚀
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
            Você tem <span className="text-eximia-600 dark:text-eximia-400 font-bold">{todaysHabits.filter(h => !h.completedToday).length} hábitos</span> pendentes e <span className="text-eximia-600 dark:text-eximia-400 font-bold">{activeGoals.length} metas</span> em foco hoje.
          </p>
        </div>
        <div className="flex gap-3">
             <Button variant="outline" size="sm">Log Diário</Button>
             <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>Novo Registro</Button>
        </div>
      </header>

      {/* 2. Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#18181B] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</span>
                        <span className={`text-xs font-bold ${stat.color}`}>{stat.sub}</span>
                    </div>
                </div>
                <div className={`p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 ${stat.color} bg-opacity-10`}>
                    <stat.icon className="w-5 h-5" />
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN (2/3) */}
        <div className="lg:col-span-2 space-y-10">
            
            {/* Metas em Foco */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Target className="w-5 h-5 text-eximia-500" />
                        Metas em Foco
                    </h2>
                    <button className="text-sm text-zinc-500 hover:text-eximia-500 transition-colors flex items-center">
                        Ver todas <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeGoals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} />
                    ))}
                    {/* Add Goal Card Placeholder */}
                    <button className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center p-6 text-zinc-400 hover:text-eximia-500 hover:border-eximia-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all gap-2 h-full min-h-[160px]">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Nova Meta</span>
                    </button>
                </div>
            </section>

             {/* Sugestões IA (Banner) */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-500/20 rounded-xl p-5 flex items-start gap-4 relative overflow-hidden">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1 relative z-10">
                    <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-1">Sugestão ExímIA</h4>
                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-3">
                        Identificamos que você está lendo <strong>"Inspired"</strong>. O curso <em>"Product Discovery Fundamentals"</em> na Academia pode acelerar sua meta de <strong>Lançar MVP</strong>.
                    </p>
                    <div className="flex gap-3">
                        <button className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors">Ver Curso</button>
                        <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 px-3 py-1.5 transition-colors">Dispensar</button>
                    </div>
                </div>
            </div>

        </div>

        {/* RIGHT COLUMN (1/3) */}
        <div className="space-y-10">
            
            {/* Hábitos de Hoje */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        Hábitos de Hoje
                    </h2>
                </div>
                <div className="space-y-3">
                    {todaysHabits.map(habit => (
                        <HabitRow key={habit.id} habit={habit} onCheck={handleCheckHabit} />
                    ))}
                </div>
            </section>

             {/* Lendo Agora */}
             <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <Book className="w-5 h-5 text-emerald-500" />
                        Lendo Agora
                    </h2>
                </div>
                <div className="space-y-3">
                    {currentBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            </section>

        </div>
      </div>
    </div>
  );
};