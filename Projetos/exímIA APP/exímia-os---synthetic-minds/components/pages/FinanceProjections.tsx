
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  PiggyBank,
  Rocket
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  type: 'optimistic' | 'realistic' | 'pessimistic';
  revenue: number[];
  expenses: number[];
  cashflow: number[];
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const MOCK_SCENARIOS: Scenario[] = [
  {
    id: 's1',
    name: 'Otimista',
    type: 'optimistic',
    revenue: [75000, 82000, 95000, 110000, 125000, 140000, 160000, 180000, 200000, 220000, 245000, 270000],
    expenses: [52000, 55000, 58000, 62000, 68000, 75000, 82000, 90000, 98000, 105000, 115000, 125000],
    cashflow: [23000, 27000, 37000, 48000, 57000, 65000, 78000, 90000, 102000, 115000, 130000, 145000],
  },
  {
    id: 's2',
    name: 'Realista',
    type: 'realistic',
    revenue: [70000, 75000, 82000, 90000, 100000, 110000, 120000, 132000, 145000, 158000, 172000, 188000],
    expenses: [52000, 55000, 58000, 62000, 68000, 75000, 80000, 85000, 92000, 98000, 105000, 112000],
    cashflow: [18000, 20000, 24000, 28000, 32000, 35000, 40000, 47000, 53000, 60000, 67000, 76000],
  },
  {
    id: 's3',
    name: 'Pessimista',
    type: 'pessimistic',
    revenue: [65000, 68000, 70000, 72000, 75000, 78000, 82000, 86000, 90000, 95000, 100000, 105000],
    expenses: [52000, 54000, 56000, 58000, 62000, 65000, 68000, 72000, 76000, 80000, 85000, 90000],
    cashflow: [13000, 14000, 14000, 14000, 13000, 13000, 14000, 14000, 14000, 15000, 15000, 15000],
  },
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const formatCompact = (val: number) => {
  if (val >= 1000000) return `R$ ${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `R$ ${(val / 1000).toFixed(0)}k`;
  return formatCurrency(val);
};

export const FinanceProjections: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(MOCK_SCENARIOS[1]);
  const [currentYear, setCurrentYear] = useState(2026);

  const totalRevenue = selectedScenario.revenue.reduce((a, b) => a + b, 0);
  const totalExpenses = selectedScenario.expenses.reduce((a, b) => a + b, 0);
  const totalCashflow = selectedScenario.cashflow.reduce((a, b) => a + b, 0);

  const maxValue = Math.max(...selectedScenario.revenue);
  const minCashflow = Math.min(...selectedScenario.cashflow);

  const getScenarioColor = (type: string) => {
    switch (type) {
      case 'optimistic': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
      case 'realistic': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
      case 'pessimistic': return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
      default: return 'bg-zinc-800 text-zinc-400';
    }
  };

  // Runway calculation (months until cash runs out at current burn)
  const currentCash = 150000;
  const avgBurn = (totalExpenses - totalRevenue) / 12;
  const runway = avgBurn > 0 ? Math.round(currentCash / avgBurn) : Infinity;

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
            <h1 className="text-3xl font-bold text-zinc-100">Projeções</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Simule cenários financeiros futuros.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentYear(y => y - 1)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </button>
            <span className="text-lg font-semibold text-zinc-200 min-w-[60px] text-center">{currentYear}</span>
            <button
              onClick={() => setCurrentYear(y => y + 1)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Novo Cenário</Button>
        </div>
      </div>

      {/* Scenario Selector */}
      <div className="flex items-center gap-3 mb-8">
        {MOCK_SCENARIOS.map(scenario => (
          <button
            key={scenario.id}
            onClick={() => setSelectedScenario(scenario)}
            className={`px-5 py-3 rounded-xl border transition-all ${
              selectedScenario.id === scenario.id
                ? getScenarioColor(scenario.type)
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <span className="font-semibold">{scenario.name}</span>
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Receita Projetada</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{formatCompact(totalRevenue)}</p>
          <p className="text-xs text-zinc-600 mt-1">Total {currentYear}</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Despesas Projetadas</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">{formatCompact(totalExpenses)}</p>
          <p className="text-xs text-zinc-600 mt-1">Total {currentYear}</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <PiggyBank className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Cashflow Líquido</span>
          </div>
          <p className={`text-2xl font-bold ${totalCashflow >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
            {formatCompact(totalCashflow)}
          </p>
          <p className="text-xs text-zinc-600 mt-1">Acumulado {currentYear}</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Rocket className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Runway</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">
            {runway === Infinity ? '∞' : `${runway} meses`}
          </p>
          <p className="text-xs text-zinc-600 mt-1">
            {runway === Infinity ? 'Lucrativo' : `Com caixa atual de ${formatCompact(currentCash)}`}
          </p>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-zinc-200">Projeção Mensal - Cenário {selectedScenario.name}</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-zinc-400">Receita</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-zinc-400">Despesas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-zinc-400">Cashflow</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="h-64 flex items-end gap-2">
          {MONTHS.map((month, idx) => {
            const revenueHeight = (selectedScenario.revenue[idx] / maxValue) * 100;
            const expenseHeight = (selectedScenario.expenses[idx] / maxValue) * 100;
            const cashflowHeight = Math.abs(selectedScenario.cashflow[idx] / maxValue) * 50;

            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-48 flex items-end justify-center gap-1">
                  <div
                    className="w-1/3 bg-emerald-500/80 rounded-t transition-all hover:bg-emerald-500"
                    style={{ height: `${revenueHeight}%` }}
                    title={`Receita: ${formatCurrency(selectedScenario.revenue[idx])}`}
                  />
                  <div
                    className="w-1/3 bg-rose-500/80 rounded-t transition-all hover:bg-rose-500"
                    style={{ height: `${expenseHeight}%` }}
                    title={`Despesas: ${formatCurrency(selectedScenario.expenses[idx])}`}
                  />
                  <div
                    className={`w-1/3 rounded-t transition-all ${selectedScenario.cashflow[idx] >= 0 ? 'bg-blue-500/80 hover:bg-blue-500' : 'bg-amber-500/80 hover:bg-amber-500'}`}
                    style={{ height: `${cashflowHeight}%` }}
                    title={`Cashflow: ${formatCurrency(selectedScenario.cashflow[idx])}`}
                  />
                </div>
                <span className="text-xs text-zinc-500">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Details Table */}
      <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800">
          <h3 className="font-semibold text-zinc-200">Detalhamento Mensal</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 text-left">Mês</th>
                <th className="px-5 py-4 text-right">Receita</th>
                <th className="px-5 py-4 text-right">Despesas</th>
                <th className="px-5 py-4 text-right">Cashflow</th>
                <th className="px-5 py-4 text-right">Margem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {MONTHS.map((month, idx) => {
                const margin = ((selectedScenario.revenue[idx] - selectedScenario.expenses[idx]) / selectedScenario.revenue[idx]) * 100;
                return (
                  <tr key={month} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-5 py-4 font-medium text-zinc-200">{month} {currentYear}</td>
                    <td className="px-5 py-4 text-right font-mono text-emerald-400">
                      {formatCurrency(selectedScenario.revenue[idx])}
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-rose-400">
                      {formatCurrency(selectedScenario.expenses[idx])}
                    </td>
                    <td className={`px-5 py-4 text-right font-mono ${selectedScenario.cashflow[idx] >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                      {formatCurrency(selectedScenario.cashflow[idx])}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className={`text-sm font-medium ${margin >= 20 ? 'text-emerald-400' : margin >= 10 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {margin.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-zinc-900/50 font-semibold">
              <tr>
                <td className="px-5 py-4 text-zinc-200">Total {currentYear}</td>
                <td className="px-5 py-4 text-right font-mono text-emerald-400">{formatCurrency(totalRevenue)}</td>
                <td className="px-5 py-4 text-right font-mono text-rose-400">{formatCurrency(totalExpenses)}</td>
                <td className={`px-5 py-4 text-right font-mono ${totalCashflow >= 0 ? 'text-blue-400' : 'text-amber-400'}`}>
                  {formatCurrency(totalCashflow)}
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm text-zinc-300">
                    {((totalRevenue - totalExpenses) / totalRevenue * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
