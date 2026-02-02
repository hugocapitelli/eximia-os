
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  TrendingDown,
  Plus,
  ArrowLeft,
  Receipt,
  Calendar,
  CreditCard,
  Building2,
  User,
  Tag,
  PieChart,
  AlertTriangle,
  Filter
} from 'lucide-react';

type ExpenseCategory = 'fixed' | 'variable' | 'investment' | 'discretionary';
type PaymentMethod = 'credit' | 'debit' | 'pix' | 'transfer';

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  subcategory: string;
  paymentMethod: PaymentMethod;
  date: string;
  recurring: boolean;
  workspace: 'personal' | 'business';
}

const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', title: 'Servidor AWS', amount: 2800, category: 'fixed', subcategory: 'Infraestrutura', paymentMethod: 'credit', date: '2026-01-10', recurring: true, workspace: 'business' },
  { id: 'e2', title: 'Salários Equipe', amount: 35000, category: 'fixed', subcategory: 'Folha', paymentMethod: 'transfer', date: '2026-01-05', recurring: true, workspace: 'business' },
  { id: 'e3', title: 'Google Workspace', amount: 890, category: 'fixed', subcategory: 'Software', paymentMethod: 'credit', date: '2026-01-15', recurring: true, workspace: 'business' },
  { id: 'e4', title: 'Marketing Digital', amount: 5500, category: 'variable', subcategory: 'Marketing', paymentMethod: 'credit', date: '2026-01-20', recurring: false, workspace: 'business' },
  { id: 'e5', title: 'Consultoria Jurídica', amount: 3000, category: 'variable', subcategory: 'Jurídico', paymentMethod: 'pix', date: '2026-01-18', recurring: false, workspace: 'business' },
  { id: 'e6', title: 'Aluguel', amount: 3500, category: 'fixed', subcategory: 'Moradia', paymentMethod: 'debit', date: '2026-01-05', recurring: true, workspace: 'personal' },
  { id: 'e7', title: 'Supermercado', amount: 1200, category: 'variable', subcategory: 'Alimentação', paymentMethod: 'credit', date: '2026-01-22', recurring: false, workspace: 'personal' },
  { id: 'e8', title: 'Academia', amount: 180, category: 'fixed', subcategory: 'Saúde', paymentMethod: 'credit', date: '2026-01-10', recurring: true, workspace: 'personal' },
  { id: 'e9', title: 'Curso Online', amount: 497, category: 'investment', subcategory: 'Educação', paymentMethod: 'credit', date: '2026-01-12', recurring: false, workspace: 'personal' },
  { id: 'e10', title: 'Restaurante', amount: 350, category: 'discretionary', subcategory: 'Lazer', paymentMethod: 'credit', date: '2026-01-25', recurring: false, workspace: 'personal' },
];

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
};

const getCategoryColor = (category: ExpenseCategory) => {
  switch (category) {
    case 'fixed': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
    case 'variable': return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
    case 'investment': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
    case 'discretionary': return 'bg-purple-900/30 text-purple-400 border-purple-500/30';
  }
};

const getCategoryLabel = (category: ExpenseCategory) => {
  switch (category) {
    case 'fixed': return 'Fixo';
    case 'variable': return 'Variável';
    case 'investment': return 'Investimento';
    case 'discretionary': return 'Discricionário';
  }
};

const getPaymentIcon = (method: PaymentMethod) => {
  switch (method) {
    case 'credit': return <CreditCard className="w-3 h-3" />;
    case 'debit': return <CreditCard className="w-3 h-3" />;
    case 'pix': return <Receipt className="w-3 h-3" />;
    case 'transfer': return <Building2 className="w-3 h-3" />;
  }
};

export const FinanceExpenses: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [workspace, setWorkspace] = useState<'personal' | 'business'>('business');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredExpenses = MOCK_EXPENSES
    .filter(e => e.workspace === workspace)
    .filter(e => filterCategory === 'all' || e.category === filterCategory);

  const totalExpenses = filteredExpenses.reduce((acc, e) => acc + e.amount, 0);
  const fixedExpenses = filteredExpenses.filter(e => e.category === 'fixed').reduce((acc, e) => acc + e.amount, 0);
  const variableExpenses = filteredExpenses.filter(e => e.category === 'variable').reduce((acc, e) => acc + e.amount, 0);

  // Group by subcategory
  const bySubcategory = filteredExpenses.reduce((acc, e) => {
    if (!acc[e.subcategory]) acc[e.subcategory] = 0;
    acc[e.subcategory] += e.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedSubcategories = Object.entries(bySubcategory).sort((a, b) => b[1] - a[1]);

  // Budget alert (mock: 80% threshold)
  const budgetUsed = 78;
  const isOverBudget = budgetUsed > 100;
  const isNearBudget = budgetUsed > 80 && budgetUsed <= 100;

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
            <h1 className="text-3xl font-bold text-zinc-100">Despesas</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Controle suas saídas de caixa.
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
          <Button icon={<Plus className="w-4 h-4" />}>Nova Despesa</Button>
        </div>
      </div>

      {/* Budget Alert */}
      {(isNearBudget || isOverBudget) && (
        <div className={`mb-6 p-4 rounded-xl border ${isOverBudget ? 'bg-red-900/20 border-red-500/30' : 'bg-amber-900/20 border-amber-500/30'}`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${isOverBudget ? 'text-red-400' : 'text-amber-400'}`} />
            <span className={`font-semibold ${isOverBudget ? 'text-red-300' : 'text-amber-300'}`}>
              {isOverBudget ? 'Orçamento Excedido!' : 'Próximo do Limite'}
            </span>
            <span className="text-zinc-400 text-sm ml-2">
              {budgetUsed}% do orçamento mensal utilizado
            </span>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <TrendingDown className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Total Gasto</span>
          </div>
          <p className="text-2xl font-bold text-rose-400">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-zinc-600 mt-1">Este mês</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Tag className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Custos Fixos</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{formatCurrency(fixedExpenses)}</p>
          <p className="text-xs text-zinc-600 mt-1">{Math.round((fixedExpenses / totalExpenses) * 100)}% do total</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <PieChart className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Variáveis</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{formatCurrency(variableExpenses)}</p>
          <p className="text-xs text-zinc-600 mt-1">{Math.round((variableExpenses / totalExpenses) * 100)}% do total</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Orçamento</span>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-purple-400">{budgetUsed}%</p>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
            <div
              className={`h-full rounded-full ${budgetUsed > 100 ? 'bg-red-500' : budgetUsed > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense List */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex items-center gap-2 mb-4">
            {['all', 'fixed', 'variable', 'investment', 'discretionary'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filterCategory === cat
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {cat === 'all' ? 'Todas' : getCategoryLabel(cat as ExpenseCategory)}
              </button>
            ))}
          </div>

          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4 text-left">Descrição</th>
                    <th className="px-5 py-4 text-left">Categoria</th>
                    <th className="px-5 py-4 text-left">Pagamento</th>
                    <th className="px-5 py-4 text-left">Data</th>
                    <th className="px-5 py-4 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {filteredExpenses.map(expense => (
                    <tr key={expense.id} className="hover:bg-zinc-900/30 transition-colors cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-zinc-200">{expense.title}</p>
                          {expense.recurring && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-500">REC</span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500">{expense.subcategory}</p>
                      </td>
                      <td className="px-5 py-4">
                        <Badge className={getCategoryColor(expense.category)}>
                          {getCategoryLabel(expense.category)}
                        </Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-zinc-400">
                          {getPaymentIcon(expense.paymentMethod)}
                          <span className="text-xs capitalize">{expense.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-zinc-500 text-xs font-mono">
                        {new Date(expense.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-5 py-4 text-right font-mono font-medium text-rose-400">
                        -{formatCurrency(expense.amount)}
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
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Por Subcategoria</h3>
          <div className="space-y-4">
            {sortedSubcategories.slice(0, 8).map(([subcategory, amount]) => {
              const percentage = (amount / totalExpenses) * 100;
              return (
                <div key={subcategory}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-300">{subcategory}</span>
                    <span className="text-sm font-mono text-zinc-400">{formatCurrency(amount)}</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1">{percentage.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
