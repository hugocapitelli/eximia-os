
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  Rocket,
  Plus,
  ChevronRight,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  ArrowLeft,
  Target,
  Flag,
  Link2
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'completed' | 'in_progress' | 'pending';
}

interface Initiative {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerAvatar: string;
  priority: 'must_have' | 'should_have' | 'could_have';
  status: 'planned' | 'in_progress' | 'completed' | 'blocked';
  progress: number;
  startDate: string;
  endDate: string;
  kpiTarget: string;
  milestones: Milestone[];
  linkedObjectiveId?: string;
}

const MOCK_INITIATIVES: Initiative[] = [
  {
    id: 'i1',
    title: 'Lançar MVP ExímIA OS',
    description: 'Desenvolver e lançar a primeira versão funcional da plataforma com módulos core.',
    owner: 'Hugo Capitelli',
    ownerAvatar: 'HC',
    priority: 'must_have',
    status: 'in_progress',
    progress: 45,
    startDate: '01 Jan 2026',
    endDate: '28 Fev 2026',
    kpiTarget: 'WAU > 100',
    milestones: [
      { id: 'm1', title: 'Design System v1', dueDate: '15 Jan', status: 'completed' },
      { id: 'm2', title: 'Auth + Journey', dueDate: '31 Jan', status: 'in_progress' },
      { id: 'm3', title: 'Academy Beta', dueDate: '15 Fev', status: 'pending' },
      { id: 'm4', title: 'Public Launch', dueDate: '28 Fev', status: 'pending' },
    ],
    linkedObjectiveId: 'o1'
  },
  {
    id: 'i2',
    title: 'Validar Academy Socrática',
    description: 'Testar metodologia de ensino socrático com IA e medir eficácia.',
    owner: 'Alan Nicolas',
    ownerAvatar: 'AN',
    priority: 'should_have',
    status: 'planned',
    progress: 10,
    startDate: '01 Fev 2026',
    endDate: '15 Mar 2026',
    kpiTarget: 'Completion Rate > 40%',
    milestones: [
      { id: 'm5', title: 'Socratic Engine', dueDate: '15 Fev', status: 'pending' },
      { id: 'm6', title: 'Beta Testing', dueDate: '01 Mar', status: 'pending' },
    ],
    linkedObjectiveId: 'o2'
  },
  {
    id: 'i3',
    title: 'Estruturar Connection Layer',
    description: 'Implementar arquitetura de conexão entre módulos com Event Bus.',
    owner: 'Tech Team',
    ownerAvatar: 'TT',
    priority: 'must_have',
    status: 'blocked',
    progress: 20,
    startDate: '01 Jan 2026',
    endDate: '30 Jan 2026',
    kpiTarget: 'Latency < 100ms',
    milestones: [
      { id: 'm7', title: 'Event Bus Setup', dueDate: '10 Jan', status: 'completed' },
      { id: 'm8', title: 'Entity Links', dueDate: '20 Jan', status: 'in_progress' },
      { id: 'm9', title: 'Full Integration', dueDate: '30 Jan', status: 'pending' },
    ],
    linkedObjectiveId: 'o3'
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'must_have': return 'bg-red-900/30 text-red-400 border-red-500/30';
    case 'should_have': return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
    case 'could_have': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
    default: return 'bg-zinc-800 text-zinc-400';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'text-emerald-400';
    case 'in_progress': return 'text-blue-400';
    case 'blocked': return 'text-red-400';
    default: return 'text-zinc-400';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return <CheckCircle2 className="w-5 h-5" />;
    case 'in_progress': return <Clock className="w-5 h-5" />;
    case 'blocked': return <AlertTriangle className="w-5 h-5" />;
    default: return <Flag className="w-5 h-5" />;
  }
};

export const StrategyInitiatives: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const filteredInitiatives = filterPriority === 'all'
    ? MOCK_INITIATIVES
    : MOCK_INITIATIVES.filter(i => i.priority === filterPriority);

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
            <h1 className="text-3xl font-bold text-zinc-100">Iniciativas</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Projetos estratégicos e seus milestones.
            </p>
          </div>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Nova Iniciativa</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-blue-900/20 rounded-lg text-blue-400">
            <Rocket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">{MOCK_INITIATIVES.length}</p>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total</p>
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-emerald-900/20 rounded-lg text-emerald-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">
              {MOCK_INITIATIVES.filter(i => i.status === 'in_progress').length}
            </p>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Em Progresso</p>
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-red-900/20 rounded-lg text-red-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">
              {MOCK_INITIATIVES.filter(i => i.status === 'blocked').length}
            </p>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Bloqueadas</p>
          </div>
        </div>
        <div className="bg-[#18181B] p-4 rounded-xl border border-zinc-800 flex items-center gap-4">
          <div className="p-3 bg-purple-900/20 rounded-lg text-purple-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-zinc-100">
              {Math.round(MOCK_INITIATIVES.reduce((acc, i) => acc + i.progress, 0) / MOCK_INITIATIVES.length)}%
            </p>
            <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Média Progresso</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-6">
        {['all', 'must_have', 'should_have', 'could_have'].map(priority => (
          <button
            key={priority}
            onClick={() => setFilterPriority(priority)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterPriority === priority
                ? 'bg-zinc-100 text-zinc-900'
                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {priority === 'all' ? 'Todas' : priority === 'must_have' ? 'Must Have' : priority === 'should_have' ? 'Should Have' : 'Could Have'}
          </button>
        ))}
      </div>

      {/* Initiatives List */}
      <div className="space-y-4">
        {filteredInitiatives.map(initiative => (
          <div
            key={initiative.id}
            className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getStatusColor(initiative.status)} bg-opacity-20`}
                     style={{ backgroundColor: `currentColor`, opacity: 0.1 }}>
                  {getStatusIcon(initiative.status)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-zinc-100">{initiative.title}</h3>
                    <Badge className={getPriorityColor(initiative.priority)}>
                      {initiative.priority.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-zinc-400 mb-2 max-w-xl">{initiative.description}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {initiative.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {initiative.startDate} - {initiative.endDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {initiative.kpiTarget}
                    </span>
                    {initiative.linkedObjectiveId && (
                      <span className="flex items-center gap-1 text-indigo-400">
                        <Link2 className="w-3 h-3" />
                        Linked to OKR
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-zinc-100">{initiative.progress}%</p>
                  <p className={`text-xs ${getStatusColor(initiative.status)}`}>
                    {initiative.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                style={{ width: `${initiative.progress}%` }}
              />
            </div>

            {/* Milestones */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {initiative.milestones.map((milestone, idx) => (
                <div
                  key={milestone.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border shrink-0 ${
                    milestone.status === 'completed' ? 'bg-emerald-900/20 border-emerald-500/30' :
                    milestone.status === 'in_progress' ? 'bg-blue-900/20 border-blue-500/30' :
                    'bg-zinc-900 border-zinc-800'
                  }`}
                >
                  {milestone.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : milestone.status === 'in_progress' ? (
                    <Clock className="w-4 h-4 text-blue-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-600" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-zinc-200">{milestone.title}</p>
                    <p className="text-xs text-zinc-500">{milestone.dueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
