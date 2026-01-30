
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  Target,
  Plus,
  ChevronRight,
  Calendar,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  ArrowLeft,
  Flag,
  Zap
} from 'lucide-react';

interface KeyResult {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  progress: number;
}

interface Objective {
  id: string;
  title: string;
  owner: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'completed';
  progress: number;
  keyResults: KeyResult[];
}

interface Cycle {
  id: string;
  title: string;
  type: 'Trimestral' | 'Semestral' | 'Anual';
  status: 'active' | 'planning' | 'completed';
  progress: number;
  startDate: string;
  endDate: string;
  vision: string;
  objectives: Objective[];
}

// Mock data
const MOCK_CYCLES: Cycle[] = [
  {
    id: 'c1',
    title: 'Q1 2026: The Foundation',
    type: 'Trimestral',
    status: 'active',
    progress: 35,
    startDate: '01 Jan 2026',
    endDate: '31 Mar 2026',
    vision: 'Estabelecer a infraestrutura core do ExímIA OS e validar PMF com 100 usuários beta.',
    objectives: [
      {
        id: 'o1',
        title: 'Lançar MVP ExímIA OS',
        owner: 'Hugo Capitelli',
        status: 'on_track',
        progress: 45,
        keyResults: [
          { id: 'kr1', title: 'WAU (Weekly Active Users)', target: 100, current: 45, unit: 'users', progress: 45 },
          { id: 'kr2', title: 'Core features shipped', target: 10, current: 6, unit: 'features', progress: 60 },
          { id: 'kr3', title: 'Bug-free releases', target: 5, current: 3, unit: 'releases', progress: 60 },
        ]
      },
      {
        id: 'o2',
        title: 'Validar Academy Socrática',
        owner: 'Alan Nicolas',
        status: 'at_risk',
        progress: 25,
        keyResults: [
          { id: 'kr4', title: 'Completion Rate', target: 40, current: 15, unit: '%', progress: 37 },
          { id: 'kr5', title: 'NPS Score', target: 50, current: 42, unit: 'score', progress: 84 },
        ]
      },
      {
        id: 'o3',
        title: 'Estruturar Connection Layer',
        owner: 'Tech Team',
        status: 'behind',
        progress: 20,
        keyResults: [
          { id: 'kr6', title: 'Event Bus Latency', target: 100, current: 250, unit: 'ms', progress: 40 },
          { id: 'kr7', title: 'Entity Links Created', target: 1000, current: 120, unit: 'links', progress: 12 },
        ]
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on_track': case 'completed': return 'text-emerald-400 bg-emerald-900/20';
    case 'at_risk': return 'text-amber-400 bg-amber-900/20';
    case 'behind': return 'text-red-400 bg-red-900/20';
    default: return 'text-zinc-400 bg-zinc-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'on_track': return 'No Caminho';
    case 'at_risk': return 'Em Risco';
    case 'behind': return 'Atrasado';
    case 'completed': return 'Concluído';
    default: return status;
  }
};

export const StrategyCycles: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedCycle, setSelectedCycle] = useState<Cycle | null>(MOCK_CYCLES[0]);
  const [selectedObjective, setSelectedObjective] = useState<Objective | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Ciclos & OKRs</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Gerencie seus ciclos estratégicos e objetivos.
            </p>
          </div>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Novo Ciclo</Button>
      </div>

      {/* Active Cycle Card */}
      {selectedCycle && (
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/20 border border-indigo-500/30 rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="default">{selectedCycle.type}</Badge>
                <Badge variant={selectedCycle.status === 'active' ? 'default' : 'secondary'}>
                  {selectedCycle.status === 'active' ? 'Ativo' : selectedCycle.status}
                </Badge>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedCycle.title}</h2>
              <p className="text-indigo-200/80 mb-4 max-w-2xl">{selectedCycle.vision}</p>
              <div className="flex items-center gap-4 text-sm text-indigo-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedCycle.startDate} - {selectedCycle.endDate}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {selectedCycle.objectives.length} Objetivos
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="#1e1b4b" strokeWidth="12" />
                  <circle
                    cx="64" cy="64" r="56" fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="12"
                    strokeDasharray={`${selectedCycle.progress * 3.51} 351`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{selectedCycle.progress}%</span>
                </div>
              </div>
              <p className="text-sm text-indigo-300 mt-2">Progresso do Ciclo</p>
            </div>
          </div>
        </div>
      )}

      {/* Objectives Grid */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
          <Flag className="w-5 h-5 text-amber-400" />
          Objetivos do Ciclo
        </h3>
      </div>

      <div className="space-y-4">
        {selectedCycle?.objectives.map(objective => (
          <div
            key={objective.id}
            className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer"
            onClick={() => setSelectedObjective(selectedObjective?.id === objective.id ? null : objective)}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getStatusColor(objective.status)}`}>
                  {objective.status === 'on_track' ? <TrendingUp className="w-5 h-5" /> :
                   objective.status === 'at_risk' ? <AlertTriangle className="w-5 h-5" /> :
                   objective.status === 'behind' ? <Clock className="w-5 h-5" /> :
                   <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-100">{objective.title}</h4>
                  <p className="text-sm text-zinc-500">Owner: {objective.owner}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-100">{objective.progress}%</p>
                  <p className={`text-xs ${getStatusColor(objective.status).split(' ')[0]}`}>
                    {getStatusLabel(objective.status)}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 text-zinc-600 transition-transform ${
                  selectedObjective?.id === objective.id ? 'rotate-90' : ''
                }`} />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full rounded-full transition-all ${
                  objective.status === 'on_track' ? 'bg-emerald-500' :
                  objective.status === 'at_risk' ? 'bg-amber-500' :
                  objective.status === 'behind' ? 'bg-red-500' :
                  'bg-emerald-500'
                }`}
                style={{ width: `${objective.progress}%` }}
              />
            </div>

            {/* Key Results (Expanded) */}
            {selectedObjective?.id === objective.id && (
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <h5 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Key Results</h5>
                {objective.keyResults.map(kr => (
                  <div key={kr.id} className="bg-zinc-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-300">{kr.title}</span>
                      <span className="text-sm font-medium text-zinc-100">
                        {kr.current} / {kr.target} {kr.unit}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        style={{ width: `${Math.min(kr.progress, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 text-right">{kr.progress}%</p>
                  </div>
                ))}
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />}>Add Key Result</Button>
                  <Button variant="ghost" size="sm" icon={<Zap className="w-4 h-4" />}>Update Progress</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Objective Button */}
      <div className="mt-6">
        <Button variant="outline" className="w-full" icon={<Plus className="w-4 h-4" />}>
          Adicionar Objetivo
        </Button>
      </div>
    </div>
  );
};
