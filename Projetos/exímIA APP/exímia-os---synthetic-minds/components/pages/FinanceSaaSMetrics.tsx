
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Users,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Target,
  Zap,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface SaaSMetric {
  id: string;
  name: string;
  shortName: string;
  value: number;
  previousValue: number;
  unit: string;
  format: 'currency' | 'percentage' | 'number' | 'ratio' | 'months';
  target?: number;
  description: string;
  trend: 'up' | 'down' | 'stable';
  isGoodWhenUp: boolean;
  history: number[];
}

const MOCK_METRICS: SaaSMetric[] = [
  {
    id: 'm1', name: 'Monthly Recurring Revenue', shortName: 'MRR',
    value: 45000, previousValue: 42000, unit: 'R$', format: 'currency',
    target: 100000, description: 'Receita mensal recorrente de assinaturas',
    trend: 'up', isGoodWhenUp: true,
    history: [32000, 35000, 38000, 40000, 42000, 45000]
  },
  {
    id: 'm2', name: 'Annual Recurring Revenue', shortName: 'ARR',
    value: 540000, previousValue: 504000, unit: 'R$', format: 'currency',
    target: 1200000, description: 'Receita anual recorrente (MRR x 12)',
    trend: 'up', isGoodWhenUp: true,
    history: [384000, 420000, 456000, 480000, 504000, 540000]
  },
  {
    id: 'm3', name: 'Customer Acquisition Cost', shortName: 'CAC',
    value: 450, previousValue: 480, unit: 'R$', format: 'currency',
    target: 300, description: 'Custo médio para adquirir um cliente',
    trend: 'down', isGoodWhenUp: false,
    history: [520, 510, 490, 485, 480, 450]
  },
  {
    id: 'm4', name: 'Lifetime Value', shortName: 'LTV',
    value: 2800, previousValue: 2600, unit: 'R$', format: 'currency',
    target: 3000, description: 'Valor total gerado por um cliente',
    trend: 'up', isGoodWhenUp: true,
    history: [2200, 2350, 2450, 2550, 2600, 2800]
  },
  {
    id: 'm5', name: 'LTV:CAC Ratio', shortName: 'LTV:CAC',
    value: 6.2, previousValue: 5.4, unit: 'x', format: 'ratio',
    target: 8, description: 'Proporção entre LTV e CAC (ideal > 3x)',
    trend: 'up', isGoodWhenUp: true,
    history: [4.2, 4.6, 5.0, 5.3, 5.4, 6.2]
  },
  {
    id: 'm6', name: 'Churn Rate', shortName: 'Churn',
    value: 2.5, previousValue: 3.0, unit: '%', format: 'percentage',
    target: 2, description: 'Taxa de cancelamento mensal',
    trend: 'down', isGoodWhenUp: false,
    history: [4.2, 3.8, 3.5, 3.2, 3.0, 2.5]
  },
  {
    id: 'm7', name: 'Net Revenue Retention', shortName: 'NRR',
    value: 108, previousValue: 105, unit: '%', format: 'percentage',
    target: 120, description: 'Retenção líquida de receita (com expansão)',
    trend: 'up', isGoodWhenUp: true,
    history: [98, 100, 102, 103, 105, 108]
  },
  {
    id: 'm8', name: 'CAC Payback', shortName: 'Payback',
    value: 4.5, previousValue: 5.2, unit: 'meses', format: 'months',
    target: 3, description: 'Meses para recuperar o CAC',
    trend: 'down', isGoodWhenUp: false,
    history: [7.0, 6.5, 6.0, 5.5, 5.2, 4.5]
  },
  {
    id: 'm9', name: 'Average Revenue Per User', shortName: 'ARPU',
    value: 180, previousValue: 165, unit: 'R$', format: 'currency',
    description: 'Receita média por usuário/mês',
    trend: 'up', isGoodWhenUp: true,
    history: [140, 148, 155, 160, 165, 180]
  },
  {
    id: 'm10', name: 'Active Customers', shortName: 'Clientes',
    value: 250, previousValue: 230, unit: '', format: 'number',
    target: 500, description: 'Total de clientes ativos pagantes',
    trend: 'up', isGoodWhenUp: true,
    history: [180, 195, 210, 220, 230, 250]
  },
];

const formatValue = (value: number, format: string) => {
  switch (format) {
    case 'currency':
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    case 'percentage':
      return `${value}%`;
    case 'ratio':
      return `${value}x`;
    case 'months':
      return `${value} meses`;
    default:
      return value.toLocaleString();
  }
};

const getChangePercent = (current: number, previous: number) => {
  return ((current - previous) / previous * 100).toFixed(1);
};

const getStatusColor = (metric: SaaSMetric) => {
  const change = metric.value - metric.previousValue;
  const isPositiveChange = change > 0;
  const isGood = metric.isGoodWhenUp ? isPositiveChange : !isPositiveChange;

  if (isGood) return 'text-emerald-400';
  return 'text-rose-400';
};

const getTargetStatus = (metric: SaaSMetric) => {
  if (!metric.target) return null;

  const progress = metric.isGoodWhenUp
    ? (metric.value / metric.target) * 100
    : (metric.target / metric.value) * 100;

  if (progress >= 100) return { color: 'bg-emerald-500', label: 'Atingido' };
  if (progress >= 75) return { color: 'bg-amber-500', label: 'Próximo' };
  return { color: 'bg-zinc-600', label: 'Em progresso' };
};

export const FinanceSaaSMetrics: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedMetric, setSelectedMetric] = useState<SaaSMetric | null>(null);

  // Key metrics for hero section
  const mrrMetric = MOCK_METRICS.find(m => m.shortName === 'MRR')!;
  const ltvCacMetric = MOCK_METRICS.find(m => m.shortName === 'LTV:CAC')!;
  const churnMetric = MOCK_METRICS.find(m => m.shortName === 'Churn')!;
  const nrrMetric = MOCK_METRICS.find(m => m.shortName === 'NRR')!;

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
            <h1 className="text-3xl font-bold text-zinc-100">SaaS Metrics</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Métricas essenciais para empresas SaaS.
            </p>
          </div>
        </div>
        <Button variant="secondary" icon={<RefreshCw className="w-4 h-4" />}>Atualizar Dados</Button>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[mrrMetric, ltvCacMetric, churnMetric, nrrMetric].map(metric => {
          const changePercent = getChangePercent(metric.value, metric.previousValue);
          const isPositive = parseFloat(changePercent) > 0;
          const isGood = metric.isGoodWhenUp ? isPositive : !isPositive;

          return (
            <div
              key={metric.id}
              className="bg-gradient-to-br from-[#0A0A0A] to-zinc-900 border border-zinc-800 rounded-xl p-5 cursor-pointer hover:border-zinc-700 transition-all"
              onClick={() => setSelectedMetric(metric)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{metric.shortName}</span>
                <div className={`flex items-center gap-1 ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span className="text-sm font-medium">{changePercent}%</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-zinc-100 mb-1">{formatValue(metric.value, metric.format)}</p>
              <p className="text-xs text-zinc-500">{metric.description}</p>

              {/* Mini Sparkline */}
              <div className="mt-4 h-8 flex items-end gap-0.5">
                {metric.history.map((val, idx) => {
                  const max = Math.max(...metric.history);
                  const height = (val / max) * 100;
                  return (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t ${idx === metric.history.length - 1 ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                      style={{ height: `${height}%` }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* All Metrics Grid */}
      <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-200">Todas as Métricas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 text-left">Métrica</th>
                <th className="px-5 py-4 text-right">Valor Atual</th>
                <th className="px-5 py-4 text-right">Anterior</th>
                <th className="px-5 py-4 text-right">Variação</th>
                <th className="px-5 py-4 text-right">Target</th>
                <th className="px-5 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {MOCK_METRICS.map(metric => {
                const changePercent = getChangePercent(metric.value, metric.previousValue);
                const isPositive = parseFloat(changePercent) > 0;
                const isGood = metric.isGoodWhenUp ? isPositive : !isPositive;
                const targetStatus = getTargetStatus(metric);

                return (
                  <tr
                    key={metric.id}
                    className="hover:bg-zinc-900/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedMetric(metric)}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                          <span className="text-xs font-bold text-zinc-400">{metric.shortName.slice(0, 3)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-zinc-200">{metric.name}</p>
                          <p className="text-xs text-zinc-500">{metric.shortName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-medium text-zinc-200">
                      {formatValue(metric.value, metric.format)}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-zinc-500">
                      {formatValue(metric.previousValue, metric.format)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className={`flex items-center justify-end gap-1 ${isGood ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                        <span className="font-medium">{changePercent}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-zinc-500">
                      {metric.target ? formatValue(metric.target, metric.format) : '-'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {targetStatus ? (
                        <Badge className={`${targetStatus.color} text-white`}>
                          {targetStatus.label}
                        </Badge>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Metric Detail Modal */}
      {selectedMetric && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedMetric(null)}>
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{selectedMetric.shortName}</p>
                <h2 className="text-xl font-bold text-zinc-100">{selectedMetric.name}</h2>
                <p className="text-sm text-zinc-400 mt-1">{selectedMetric.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-900/50 rounded-lg p-4">
                <p className="text-xs text-zinc-500 uppercase mb-1">Valor Atual</p>
                <p className="text-2xl font-bold text-zinc-100">{formatValue(selectedMetric.value, selectedMetric.format)}</p>
              </div>
              {selectedMetric.target && (
                <div className="bg-zinc-900/50 rounded-lg p-4">
                  <p className="text-xs text-zinc-500 uppercase mb-1">Target</p>
                  <p className="text-2xl font-bold text-zinc-100">{formatValue(selectedMetric.target, selectedMetric.format)}</p>
                </div>
              )}
            </div>

            {/* History Chart */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Histórico (6 meses)</h3>
              <div className="h-32 flex items-end gap-2">
                {selectedMetric.history.map((val, idx) => {
                  const max = Math.max(...selectedMetric.history);
                  const height = (val / max) * 100;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t transition-all hover:from-indigo-500"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-zinc-500 mt-2">{formatValue(val, selectedMetric.format)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedMetric(null)}>Fechar</Button>
              <Button className="flex-1" icon={<Target className="w-4 h-4" />}>Definir Meta</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
