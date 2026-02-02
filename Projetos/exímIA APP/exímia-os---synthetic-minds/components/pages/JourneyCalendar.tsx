
import React, { useState } from 'react';
import { JOURNEY_HABITS, JOURNEY_GOALS } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Target,
  Repeat,
  Zap,
  MoreHorizontal,
  CheckCircle2,
  Circle
} from 'lucide-react';

type ViewMode = 'day' | 'week' | 'month';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'habit' | 'goal' | 'task' | 'block';
  time?: string;
  duration?: number; // minutes
  color: string;
  completed?: boolean;
}

// Generate mock events from habits and goals
const generateEvents = (date: Date): CalendarEvent[] => {
  const events: CalendarEvent[] = [];

  // Add habits as recurring events
  JOURNEY_HABITS.forEach((habit, index) => {
    if (habit.frequency === 'daily' || (habit.frequency === 'weekly' && date.getDay() === 1)) {
      events.push({
        id: `habit-${habit.id}`,
        title: habit.name,
        type: 'habit',
        time: habit.time || `${8 + index}:00`,
        duration: 30,
        color: 'bg-emerald-500',
        completed: habit.completedToday
      });
    }
  });

  // Add goal deadlines
  JOURNEY_GOALS.forEach(goal => {
    if (goal.deadline) {
      events.push({
        id: `goal-${goal.id}`,
        title: goal.title,
        type: 'goal',
        color: 'bg-amber-500',
      });
    }
  });

  // Add some mock time blocks
  events.push(
    { id: 'block-1', title: 'Deep Work', type: 'block', time: '09:00', duration: 120, color: 'bg-blue-500' },
    { id: 'block-2', title: 'Meetings', type: 'block', time: '14:00', duration: 60, color: 'bg-purple-500' },
    { id: 'task-1', title: 'Review PRD', type: 'task', time: '16:00', duration: 45, color: 'bg-zinc-500' }
  );

  return events.sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });
};

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 6am to 8pm

export const JourneyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = generateEvents(selectedDate);

  // Navigation
  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Get week days for week view
  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });
  };

  // Get month days for month view
  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: (Date | null)[] = [];

    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">Calendário</h1>
          <p className="text-zinc-400 mt-1 font-serif text-lg">
            Organize seu tempo e blocos de foco.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={goToToday}>Hoje</Button>
          <Button size="sm" icon={<Plus className="w-4 h-4" />}>Novo Evento</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <h2 className="text-lg font-semibold text-zinc-100 min-w-[200px] text-center">
            {viewMode === 'day' && currentDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            {viewMode === 'week' && `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {viewMode === 'month' && `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
          </h2>
          <button onClick={() => navigate(1)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1">
          {(['day', 'week', 'month'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {mode === 'day' ? 'Dia' : mode === 'week' ? 'Semana' : 'Mês'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3 bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
          {/* Week View */}
          {viewMode === 'week' && (
            <>
              {/* Week header */}
              <div className="grid grid-cols-8 border-b border-zinc-800">
                <div className="p-3 text-center text-zinc-500 text-sm">Horário</div>
                {getWeekDays().map((day, i) => (
                  <div
                    key={i}
                    className={`p-3 text-center border-l border-zinc-800 cursor-pointer hover:bg-zinc-900/50 transition-colors ${
                      isToday(day) ? 'bg-amber-900/20' : ''
                    }`}
                    onClick={() => setSelectedDate(day)}
                  >
                    <p className="text-xs text-zinc-500 uppercase">{DAYS[day.getDay()]}</p>
                    <p className={`text-lg font-semibold ${
                      isToday(day) ? 'text-amber-400' : isSelected(day) ? 'text-zinc-100' : 'text-zinc-400'
                    }`}>
                      {day.getDate()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Time grid */}
              <div className="max-h-[500px] overflow-y-auto">
                {HOURS.map(hour => (
                  <div key={hour} className="grid grid-cols-8 border-b border-zinc-800/50">
                    <div className="p-2 text-xs text-zinc-500 text-right pr-3">
                      {String(hour).padStart(2, '0')}:00
                    </div>
                    {getWeekDays().map((day, i) => (
                      <div
                        key={i}
                        className="min-h-[60px] border-l border-zinc-800/50 p-1 hover:bg-zinc-900/30 transition-colors"
                      >
                        {/* Render events for this hour */}
                        {isSelected(day) && events
                          .filter(e => e.time && parseInt(e.time.split(':')[0]) === hour)
                          .map(event => (
                            <div
                              key={event.id}
                              className={`${event.color} rounded px-2 py-1 text-xs text-white mb-1 cursor-pointer hover:brightness-110 transition-all`}
                              style={{ minHeight: event.duration ? `${event.duration / 2}px` : 'auto' }}
                            >
                              <p className="font-medium truncate">{event.title}</p>
                              {event.time && <p className="text-white/70">{event.time}</p>}
                            </div>
                          ))
                        }
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Month View */}
          {viewMode === 'month' && (
            <>
              <div className="grid grid-cols-7 border-b border-zinc-800">
                {DAYS.map(day => (
                  <div key={day} className="p-3 text-center text-xs text-zinc-500 uppercase font-semibold">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {getMonthDays().map((day, i) => (
                  <div
                    key={i}
                    className={`min-h-[100px] border-b border-r border-zinc-800/50 p-2 ${
                      day && isToday(day) ? 'bg-amber-900/10' : ''
                    } ${day ? 'cursor-pointer hover:bg-zinc-900/50' : ''} transition-colors`}
                    onClick={() => day && setSelectedDate(day)}
                  >
                    {day && (
                      <>
                        <p className={`text-sm font-medium mb-1 ${
                          isToday(day) ? 'text-amber-400' : isSelected(day) ? 'text-zinc-100' : 'text-zinc-400'
                        }`}>
                          {day.getDate()}
                        </p>
                        {/* Show event dots */}
                        <div className="flex flex-wrap gap-1">
                          {[1,2,3].slice(0, Math.floor(Math.random() * 4)).map((_, j) => (
                            <div key={j} className="w-2 h-2 rounded-full bg-emerald-500" />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Day View */}
          {viewMode === 'day' && (
            <div className="max-h-[600px] overflow-y-auto">
              {HOURS.map(hour => (
                <div key={hour} className="flex border-b border-zinc-800/50">
                  <div className="w-20 p-3 text-sm text-zinc-500 text-right shrink-0">
                    {String(hour).padStart(2, '0')}:00
                  </div>
                  <div className="flex-1 min-h-[80px] p-2 hover:bg-zinc-900/30 transition-colors border-l border-zinc-800/50">
                    {events
                      .filter(e => e.time && parseInt(e.time.split(':')[0]) === hour)
                      .map(event => (
                        <div
                          key={event.id}
                          className={`${event.color} rounded-lg px-3 py-2 text-white mb-2 cursor-pointer hover:brightness-110 transition-all flex items-center justify-between`}
                          style={{ minHeight: event.duration ? `${event.duration}px` : 'auto' }}
                        >
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-white/70">{event.time} - {event.duration}min</p>
                          </div>
                          {event.completed !== undefined && (
                            event.completed
                              ? <CheckCircle2 className="w-5 h-5 text-white" />
                              : <Circle className="w-5 h-5 text-white/50" />
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Day Summary */}
        <div className="space-y-4">
          {/* Selected Date */}
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-900/20 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-semibold text-zinc-100">
                  {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </p>
                <p className="text-sm text-zinc-500">
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Eventos</span>
                <span className="text-zinc-100 font-medium">{events.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Hábitos</span>
                <span className="text-zinc-100 font-medium">{events.filter(e => e.type === 'habit').length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Blocos de Foco</span>
                <span className="text-zinc-100 font-medium">{events.filter(e => e.type === 'block').length}</span>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Agenda do Dia</h3>
            <div className="space-y-2">
              {events.map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-900/50 transition-colors cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full ${event.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{event.title}</p>
                    {event.time && (
                      <p className="text-xs text-zinc-500">{event.time}</p>
                    )}
                  </div>
                  {event.type === 'habit' && (
                    <Repeat className="w-4 h-4 text-zinc-600" />
                  )}
                  {event.type === 'goal' && (
                    <Target className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Ações Rápidas</h3>
            <div className="space-y-2">
              <Button variant="ghost" size="sm" className="w-full justify-start" icon={<Clock className="w-4 h-4" />}>
                Bloco de Foco
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" icon={<Target className="w-4 h-4" />}>
                Deadline de Meta
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start" icon={<Zap className="w-4 h-4" />}>
                Tarefa Rápida
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
