
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  TrendingUp,
  Plus,
  ArrowLeft,
  DollarSign,
  Calendar,
  Filter,
  Download,
  ChevronRight,
  Building2,
  User,
  Repeat,
  BarChart3,
  Target
} from 'lucide-react';

type RevenueType = 'recurring' | 'one_time' | 'variable';
type RevenueStatus = 'received' | 'pending' | 'overdue';

interface Revenue {
  id: string;
  title: string;
  client?: string;
  amount: number;
  type: RevenueType;
  status: RevenueStatus;
  date: string;
  category: string;
  workspace: 'personal' | 'business';
}

const MOCK_REVENUES: Revenue[] = [
  { id: 'r1', title: 'Contrato Mensal - Cliente A', client: 'TechCorp', amount: 15000, type: 'recurring', status: 'received', date: '2026-01-15', category: 'SaaS', workspace: 'business' },
  { id: 'r2', title: 'Projeto Consultoria', client: 'StartupX', amount: 8500, type: 'one_time', status: 'pending', date: '2026-01-28', category: 'Consultoria', workspace: 'business' },
  { id: 'r3', title: 'Licença Enterprise', client: 'BigCo', amount: 45000, type: 'recurring', status: 'received', date: '2026-01-10', category: 'SaaS', workspace: 'business' },
  { id: 'r4', title: 'Workshop IA', client: 'Academy Corp', amount: 3500, type: 'one_time', status: 'received', date: '2026-01-05', category: 'Educação', workspace: 'business' },
  { id: 'r5', title: 'Comissão Afiliados', amount: 2800, type: 'variable', status: 'received', date: '2026-01-20', category: 'Afiliados', workspace: 'business' },
  { id: 'r6', title: 'Salário', amount: 12000, type: 'recurring', status: 'received', date: '2026-01-05', category: 'Emprego', workspace: 'personal' },
  { id: 'r7', title: 'Freelance Design', client: 'DesignHub', amount: 3000, type: 'one_time', status: 'pending', date: '2026-01-30', category: 'Freelance', workspace: 'personal' },
  { id: 'r8', title: 'Dividendos Investimentos', amount: 850, type: 'variable', status: 'received', date: '2026-01-15', category: 'Investimentos', workspace: 'personal' },
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const getStatusColor = (status: RevenueStatus) => {
  switch (status) {
    case 'received': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
    case 'pending': return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
    case 'overdue': return 'bg-red-900/30 text-red-400 border-red-500/30';
  }
};

const getTypeIcon = (type: RevenueType) => {
  switch (type) {
    case 'recurring': return <Repeat className="w-4 h-4" />;
    case 'one_time': return <DollarSign className="w-4 h-4" />;
    case 'variable': return <BarChart3 className="w-4 h-4" />;
  }
};

export const FinanceRevenues: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [workspace, setWorkspace] = useState<'personal' | 'business'>('business');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState('2026-01');

  const filteredRevenues = MOCK_REVENUES
    .filter(r => r.workspace === workspace)
    .filter(r => filterType === 'all' || r.type === filterType);

  const totalReceived = filteredRevenues.filter(r => r.status === 'received').reduce((acc, r) => acc + r.amount, 0);
  const totalPending = filteredRevenues.filter(r => r.status === 'pending').reduce((acc, r) => acc + r.amount, 0);
  const recurringTotal = filteredRevenues.filter(r => r.type === 'recurring' && r.status === 'received').reduce((acc, r) => acc + r.amount, 0);

  // Group by category
  const byCategory = filteredRevenues.reduce((acc, r) => {
    if (!acc[r.category]) acc[r.category] = 0;
    acc[r.category] += r.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCategoryValue = Math.max(...Object.values(byCategory));

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
            <h1 className="text-3xl font-bold text-zinc-100">Receitas</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Acompanhe suas entradas de caixa.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#0A0A0A] p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setWorkspace('personal')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${workspace === 'personal' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <User className="w-3 h-3" /> Pessoal
            </button>
            <button
              onClick={() => setWorkspace('business')}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${workspace === 'business' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <Building2 className="w-3 h-3" /> Business
            </button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Nova Receita</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Recebido</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalReceived)}</p>
          <p className="text-xs text-zinc-600 mt-1">Este mês</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">A Receber</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(totalPending)}</p>
          <p className="text-xs text-zinc-600 mt-1">Pendentes</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Repeat className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">MRR</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(recurringTotal)}</p>
          <p className="text-xs text-zinc-600 mt-1">Receita Recorrente</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Target className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Meta</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">78%</p>
          <p className="text-xs text-zinc-600 mt-1">do target mensal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            {['all', 'recurring', 'one_time', 'variable'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterType === type
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {type === 'all' ? 'Todas' : type === 'recurring' ? 'Recorrente' : type === 'one_time' ? 'Única' : 'Variável'}
              </button>
            ))}
          </div>

          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4 text-left">Descrição</th>
                    <th className="px-5 py-4 text-left">Tipo</th>
                    <th className="px-5 py-4 text-left">Status</th>
                    <th className="px-5 py-4 text-left">Data</th>
                    <th className="px-5 py-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredRevenues.map(revenue => (
                    <tr key={revenue.id} className="hover:bg-zinc-900/30 transition-colors cursor-pointer">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-zinc-200">{revenue.title}</p>
                          {revenue.client && (
                            <p className="text-xs text-zinc-500">{revenue.client}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-zinc-400">
                          {getTypeIcon(revenue.type)}
                          <span className="text-xs capitalize">{revenue.type.replace('_', ' ')}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={getStatusColor(revenue.status)}>
                          {revenue.status === 'received' ? 'Recebido' : revenue.status === 'pending' ? 'Pendente' : 'Atrasado'}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-zinc-500 text-xs font-mono">
                        {new Date(revenue.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-medium text-emerald-400">
                        {formatCurrency(revenue.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Por Categoria</h3>
          <div className="space-y-4">
            {sortedCategories.map(([category, amount]) => (
              <div key={category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-zinc-300">{category}</span>
                  <span className="text-sm font-mono text-zinc-400">{formatCurrency(amount)}</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                    style={{ width: `${(amount / maxCategoryValue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-300">Total</span>
              <span className="text-lg font-bold text-emerald-400">
                {formatCurrency(filteredRevenues.reduce((acc, r) => acc + r.amount, 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
