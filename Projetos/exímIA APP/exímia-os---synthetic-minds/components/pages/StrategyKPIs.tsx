
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Target,
  RefreshCw,
  Edit2,
  History
} from 'lucide-react';

interface KPI {
  id: string;
  name: string;
  description: string;
  category: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  status: 'green' | 'yellow' | 'red';
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  lastUpdated: string;
  history: { date: string; value: number }[];
}

const MOCK_KPIS: KPI[] = [
  {
    id: 'kpi1',
    name: 'MRR',
    description: 'Monthly Recurring Revenue',
    category: 'Revenue',
    currentValue: 45000,
    targetValue: 100000,
    unit: 'R$',
    status: 'yellow',
    trend: 'up',
    trendValue: 12.5,
    lastUpdated: 'Hoje',
    history: [
      { date: 'Out', value: 32000 },
      { date: 'Nov', value: 38000 },
      { date: 'Dez', value: 42000 },
      { date: 'Jan', value: 45000 },
    ]
  },
  {
    id: 'kpi2',
    name: 'WAU',
    description: 'Weekly Active Users',
    category: 'Engagement',
    currentValue: 45,
    targetValue: 100,
    unit: 'users',
    status: 'yellow',
    trend: 'up',
    trendValue: 8.3,
    lastUpdated: 'Ontem',
    history: [
      { date: 'Sem 1', value: 25 },
      { date: 'Sem 2', value: 32 },
      { date: 'Sem 3', value: 40 },
      { date: 'Sem 4', value: 45 },
    ]
  },
  {
    id: 'kpi3',
    name: 'Churn Rate',
    description: 'Taxa de cancelamento mensal',
    category: 'Retention',
    currentValue: 2.5,
    targetValue: 5,
    unit: '%',
    status: 'green',
    trend: 'down',
    trendValue: -0.5,
    lastUpdated: 'Hoje',
    history: [
      { date: 'Out', value: 4.2 },
      { date: 'Nov', value: 3.8 },
      { date: 'Dez', value: 3.0 },
      { date: 'Jan', value: 2.5 },
    ]
  },
  {
    id: 'kpi4',
    name: 'NPS',
    description: 'Net Promoter Score',
    category: 'Satisfaction',
    currentValue: 42,
    targetValue: 50,
    unit: 'score',
    status: 'yellow',
    trend: 'up',
    trendValue: 5,
    lastUpdated: 'Há 3 dias',
    history: [
      { date: 'Out', value: 35 },
      { date: 'Nov', value: 38 },
      { date: 'Dez', value: 40 },
      { date: 'Jan', value: 42 },
    ]
  },
  {
    id: 'kpi5',
    name: 'CAC',
    description: 'Customer Acquisition Cost',
    category: 'Unit Economics',
    currentValue: 450,
    targetValue: 300,
    unit: 'R$',
    status: 'red',
    trend: 'stable',
    trendValue: 0,
    lastUpdated: 'Hoje',
    history: [
      { date: 'Out', value: 480 },
      { date: 'Nov', value: 460 },
      { date: 'Dez', value: 455 },
      { date: 'Jan', value: 450 },
    ]
  },
  {
    id: 'kpi6',
    name: 'LTV',
    description: 'Lifetime Value',
    category: 'Unit Economics',
    currentValue: 2800,
    targetValue: 3000,
    unit: 'R$',
    status: 'yellow',
    trend: 'up',
    trendValue: 4.2,
    lastUpdated: 'Ontem',
    history: [
      { date: 'Out', value: 2400 },
      { date: 'Nov', value: 2550 },
      { date: 'Dez', value: 2700 },
      { date: 'Jan', value: 2800 },
    ]
  }
];

const CATEGORIES = ['Todos', 'Revenue', 'Engagement', 'Retention', 'Satisfaction', 'Unit Economics'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'green': return 'border-l-emerald-500 bg-emerald-900/10';
    case 'yellow': return 'border-l-amber-500 bg-amber-900/10';
    case 'red': return 'border-l-red-500 bg-red-900/10';
    default: return 'border-l-zinc-500';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
    default: return <Minus className="w-4 h-4 text-zinc-400" />;
  }
};

const formatValue = (value: number, unit: string) => {
  if (unit === 'R$') return `R$ ${value.toLocaleString()}`;
  if (unit === '%') return `${value}%`;
  return `${value} ${unit}`;
};

export const StrategyKPIs: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);

  const filteredKPIs = selectedCategory === 'Todos'
    ? MOCK_KPIS
    : MOCK_KPIS.filter(kpi => kpi.category === selectedCategory);

  const alertKPIs = MOCK_KPIS.filter(kpi => kpi.status === 'red');

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
            <h1 className="text-3xl font-bold text-zinc-100">KPIs</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Monitore os indicadores-chave do negócio.
            </p>
          </div>
        </div>
        <Button icon={<Plus className="w-4 h-4" />}>Novo KPI</Button>
      </div>

      {/* Alerts */}
      {alertKPIs.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="font-semibold text-red-300">KPIs em Alerta</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertKPIs.map(kpi => (
              <span key={kpi.id} className="px-3 py-1 bg-red-900/30 rounded-full text-sm text-red-300">
                {kpi.name}: {formatValue(kpi.currentValue, kpi.unit)} (meta: {formatValue(kpi.targetValue, kpi.unit)})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-zinc-100 text-zinc-900'
                : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredKPIs.map(kpi => {
          const progress = (kpi.currentValue / kpi.targetValue) * 100;

          return (
            <div
              key={kpi.id}
              className={`bg-[#0A0A0A] border border-zinc-800 border-l-4 rounded-xl p-5 hover:border-zinc-700 transition-all cursor-pointer ${getStatusColor(kpi.status)}`}
              onClick={() => setSelectedKPI(kpi)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">{kpi.category}</p>
                  <h3 className="text-lg font-semibold text-zinc-100">{kpi.name}</h3>
                  <p className="text-xs text-zinc-500">{kpi.description}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(kpi.trend)}
                  <span className={`text-sm font-medium ${
                    kpi.trend === 'up' ? 'text-emerald-400' :
                    kpi.trend === 'down' ? 'text-red-400' :
                    'text-zinc-400'
                  }`}>
                    {kpi.trendValue > 0 ? '+' : ''}{kpi.trendValue}%
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-3xl font-bold text-zinc-100">
                  {formatValue(kpi.currentValue, kpi.unit)}
                </p>
                <p className="text-sm text-zinc-500">
                  Meta: {formatValue(kpi.targetValue, kpi.unit)}
                </p>
              </div>

              {/* Mini Progress Bar */}
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    kpi.status === 'green' ? 'bg-emerald-500' :
                    kpi.status === 'yellow' ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span>{Math.round(progress)}% do target</span>
                <span>Atualizado: {kpi.lastUpdated}</span>
              </div>

              {/* Sparkline */}
              <div className="mt-4 h-12 flex items-end gap-1">
                {kpi.history.map((point, idx) => {
                  const maxValue = Math.max(...kpi.history.map(p => p.value));
                  const height = (point.value / maxValue) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-zinc-700 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-[8px] text-zinc-600 mt-1">{point.date}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI Detail Modal */}
      {selectedKPI && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedKPI(null)}>
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider">{selectedKPI.category}</p>
                <h2 className="text-xl font-bold text-zinc-100">{selectedKPI.name}</h2>
                <p className="text-sm text-zinc-400">{selectedKPI.description}</p>
              </div>
              <Badge variant={selectedKPI.status === 'green' ? 'default' : selectedKPI.status === 'yellow' ? 'secondary' : 'destructive'}>
                {selectedKPI.status === 'green' ? 'No Target' : selectedKPI.status === 'yellow' ? 'Em Risco' : 'Abaixo'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 uppercase mb-1">Valor Atual</p>
                <p className="text-2xl font-bold text-zinc-100">{formatValue(selectedKPI.currentValue, selectedKPI.unit)}</p>
              </div>
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 uppercase mb-1">Meta</p>
                <p className="text-2xl font-bold text-zinc-100">{formatValue(selectedKPI.targetValue, selectedKPI.unit)}</p>
              </div>
            </div>

            {/* History Chart */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Histórico</h3>
              <div className="h-32 flex items-end gap-2">
                {selectedKPI.history.map((point, idx) => {
                  const maxValue = Math.max(...selectedKPI.history.map(p => p.value));
                  const height = (point.value / maxValue) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t transition-all hover:from-indigo-500"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-zinc-500 mt-2">{point.date}</span>
                      <span className="text-xs text-zinc-400">{point.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedKPI(null)}>Fechar</Button>
              <Button className="flex-1" icon={<RefreshCw className="w-4 h-4" />}>Atualizar Valor</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
