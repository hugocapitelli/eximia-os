
import React, { useState, useCallback } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  GanttChart,
  Plus,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Target
} from 'lucide-react';

type ViewMode = 'gantt' | 'timeline' | 'kanban';
type ZoomLevel = 'day' | 'week' | 'month' | 'quarter';

interface RoadmapItem {
  id: string;
  title: string;
  type: 'initiative' | 'milestone';
  startDate: Date;
  endDate: Date;
  progress: number;
  status: 'planned' | 'in_progress' | 'completed' | 'at_risk' | 'behind';
  owner: string;
  color: string;
}

const MOCK_ITEMS: RoadmapItem[] = [
  {
    id: 'r1',
    title: 'MVP ExímIA OS',
    type: 'initiative',
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 1, 28),
    progress: 45,
    status: 'in_progress',
    owner: 'Hugo C.',
    color: 'bg-blue-500'
  },
  {
    id: 'r2',
    title: 'Design System v1',
    type: 'milestone',
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 0, 15),
    progress: 100,
    status: 'completed',
    owner: 'Sarah D.',
    color: 'bg-emerald-500'
  },
  {
    id: 'r3',
    title: 'Academy Socrática',
    type: 'initiative',
    startDate: new Date(2026, 1, 1),
    endDate: new Date(2026, 2, 15),
    progress: 10,
    status: 'planned',
    owner: 'Alan N.',
    color: 'bg-purple-500'
  },
  {
    id: 'r4',
    title: 'Connection Layer',
    type: 'initiative',
    startDate: new Date(2026, 0, 1),
    endDate: new Date(2026, 0, 30),
    progress: 20,
    status: 'at_risk',
    owner: 'Tech Team',
    color: 'bg-amber-500'
  },
  {
    id: 'r5',
    title: 'Finance Module',
    type: 'initiative',
    startDate: new Date(2026, 2, 1),
    endDate: new Date(2026, 3, 30),
    progress: 0,
    status: 'planned',
    owner: 'TBD',
    color: 'bg-indigo-500'
  }
];

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-500';
    case 'in_progress': return 'bg-blue-500';
    case 'at_risk': return 'bg-amber-500';
    case 'behind': return 'bg-red-500';
    default: return 'bg-zinc-500';
  }
};

export const StrategyRoadmap: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('gantt');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1));

  const navigate = (direction: number) => {
    const newDate = new Date(currentDate);
    if (zoomLevel === 'month') {
      newDate.setMonth(newDate.getMonth() + direction * 3);
    } else if (zoomLevel === 'quarter') {
      newDate.setMonth(newDate.getMonth() + direction * 6);
    } else {
      newDate.setMonth(newDate.getMonth() + direction);
    }
    setCurrentDate(newDate);
  };

  const getTimelineUnits = useCallback(() => {
    const units: { label: string; date: Date }[] = [];
    const start = new Date(currentDate);
    start.setDate(1);

    const count = zoomLevel === 'month' ? 4 : zoomLevel === 'quarter' ? 2 : 30;

    for (let i = 0; i < count; i++) {
      const date = new Date(start);
      if (zoomLevel === 'month' || zoomLevel === 'quarter') {
        date.setMonth(start.getMonth() + i);
        units.push({ label: `${MONTHS[date.getMonth()]} ${date.getFullYear()}`, date });
      } else {
        date.setDate(start.getDate() + i);
        units.push({ label: `${date.getDate()} ${MONTHS[date.getMonth()]}`, date });
      }
    }
    return units;
  }, [currentDate, zoomLevel]);

  const getItemPosition = useCallback((item: RoadmapItem) => {
    const timelineStart = new Date(currentDate);
    timelineStart.setDate(1);
    const timelineEnd = new Date(timelineStart);
    timelineEnd.setMonth(timelineEnd.getMonth() + 4);

    const totalDuration = timelineEnd.getTime() - timelineStart.getTime();
    const itemStart = Math.max(item.startDate.getTime(), timelineStart.getTime()) - timelineStart.getTime();
    const itemEnd = Math.min(item.endDate.getTime(), timelineEnd.getTime()) - timelineStart.getTime();
    const itemDuration = itemEnd - itemStart;

    return {
      left: `${(itemStart / totalDuration) * 100}%`,
      width: `${(itemDuration / totalDuration) * 100}%`,
    };
  }, [currentDate]);

  const today = new Date();
  const timelineStart = new Date(currentDate);
  timelineStart.setDate(1);
  const timelineEnd = new Date(timelineStart);
  timelineEnd.setMonth(timelineEnd.getMonth() + 4);
  const todayPosition = ((today.getTime() - timelineStart.getTime()) / (timelineEnd.getTime() - timelineStart.getTime())) * 100;

  const timelineUnits = getTimelineUnits();

  // Kanban columns
  const kanbanColumns = [
    { id: 'planned', title: 'Planejado', items: MOCK_ITEMS.filter(i => i.status === 'planned') },
    { id: 'in_progress', title: 'Em Progresso', items: MOCK_ITEMS.filter(i => i.status === 'in_progress' || i.status === 'at_risk') },
    { id: 'completed', title: 'Concluído', items: MOCK_ITEMS.filter(i => i.status === 'completed') },
  ];

  return (
    <div className="max-w-full mx-auto px-6 py-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Roadmap</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Visualize suas iniciativas no tempo.
            </p>
          </div>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Adicionar Item</Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4">
        {/* Navigation */}
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5 text-zinc-400" />
          </button>
          <h2 className="text-lg font-semibold text-zinc-100 min-w-[200px] text-center">
            Q1 2026
          </h2>
          <button onClick={() => navigate(1)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
          <Button variant="ghost" size="sm">Hoje</Button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1">
            {(['gantt', 'timeline', 'kanban'] as ViewMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`p-2 rounded-md transition-all ${
                  viewMode === mode ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={mode.charAt(0).toUpperCase() + mode.slice(1)}
              >
                {mode === 'gantt' ? <GanttChart className="w-5 h-5" /> :
                 mode === 'timeline' ? <List className="w-5 h-5" /> :
                 <LayoutGrid className="w-5 h-5" />}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1">
            {(['week', 'month', 'quarter'] as ZoomLevel[]).map(zoom => (
              <button
                key={zoom}
                onClick={() => setZoomLevel(zoom)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  zoomLevel === zoom ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {zoom === 'week' ? 'Semana' : zoom === 'month' ? 'Mês' : 'Trimestre'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gantt View */}
      {viewMode === 'gantt' && (
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
          {/* Timeline Header */}
          <div className="flex border-b border-zinc-800">
            <div className="w-64 shrink-0 p-4 font-semibold text-zinc-400 border-r border-zinc-800">
              Iniciativa
            </div>
            <div className="flex-1 flex">
              {timelineUnits.map((unit, idx) => (
                <div key={idx} className="flex-1 p-4 text-center text-sm text-zinc-500 border-l border-zinc-800">
                  {unit.label}
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="relative">
            {/* Today Line */}
            {todayPosition >= 0 && todayPosition <= 100 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-20"
                style={{ left: `calc(256px + ${todayPosition}% * (100% - 256px) / 100)` }}
              >
                <div className="absolute -top-1 -left-2 px-1 py-0.5 bg-amber-500 text-xs text-black font-semibold rounded">
                  Hoje
                </div>
              </div>
            )}

            {MOCK_ITEMS.map((item) => {
              const position = getItemPosition(item);

              return (
                <div key={item.id} className="flex items-center border-b border-zinc-800/50 hover:bg-zinc-900/30">
                  {/* Item Label */}
                  <div className="w-64 shrink-0 p-4 border-r border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(item.status)}`} />
                      <span className="font-medium text-zinc-200 truncate">{item.title}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{item.owner}</p>
                  </div>

                  {/* Gantt Bar */}
                  <div className="flex-1 relative h-16 p-2">
                    <div
                      className={`absolute top-3 bottom-3 ${item.color} rounded-lg cursor-pointer hover:brightness-110 transition-all flex items-center px-3`}
                      style={{ left: position.left, width: position.width, minWidth: '80px' }}
                    >
                      {/* Progress Fill */}
                      <div
                        className="absolute inset-0 bg-white/20 rounded-lg"
                        style={{ width: `${item.progress}%` }}
                      />
                      <span className="relative text-xs text-white font-medium truncate">
                        {item.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Kanban View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanColumns.map(column => (
            <div key={column.id} className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-4">
              <h3 className="font-semibold text-zinc-100 mb-4 flex items-center justify-between">
                {column.title}
                <Badge variant="secondary">{column.items.length}</Badge>
              </h3>
              <div className="space-y-3">
                {column.items.map(item => (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-all cursor-pointer">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="font-medium text-zinc-200">{item.title}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span>{item.owner}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          {MOCK_ITEMS.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()).map(item => (
            <div key={item.id} className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getStatusColor(item.status)}`}>
                  {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-white" /> :
                   item.status === 'at_risk' ? <AlertTriangle className="w-5 h-5 text-white" /> :
                   <Clock className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-100">{item.title}</h3>
                    <Badge variant={item.type === 'milestone' ? 'default' : 'secondary'}>
                      {item.type === 'milestone' ? 'Milestone' : 'Iniciativa'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {item.startDate.toLocaleDateString('pt-BR')} - {item.endDate.toLocaleDateString('pt-BR')}
                    </span>
                    <span>{item.owner}</span>
                  </div>
                  <div className="mt-3 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-100">{item.progress}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
