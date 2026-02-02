
import React, { useState } from 'react';
import { FINANCE_ACCOUNTS, FINANCE_CARDS, FINANCE_TRANSACTIONS, FINANCE_INSIGHTS } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { 
  Wallet, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  AlertTriangle, 
  ArrowRight,
  MoreVertical,
  Plus,
  Building2,
  User
} from 'lucide-react';

export const FinanceDashboard: React.FC = () => {
  const [workspace, setWorkspace] = useState<'personal' | 'business'>('personal');

  const accounts = FINANCE_ACCOUNTS.filter(a => a.workspace === workspace);
  const cards = FINANCE_CARDS.filter(c => c.workspace === workspace);
  const transactions = FINANCE_TRANSACTIONS.filter(t => t.workspace === workspace);
  const insights = FINANCE_INSIGHTS.filter(i => i.workspace === workspace);

  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, curr) => acc + Math.abs(curr.amount), 0);
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Finance Control
          </h1>
          <p className="text-zinc-500 mt-1 font-serif text-lg">
            Fluxo de caixa e patrimônio unificados.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#0A0A0A] p-1 rounded-lg border border-[#1F1F22]">
            <button 
                onClick={() => setWorkspace('personal')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${workspace === 'personal' ? 'bg-[#1F1F22] text-white border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <User className="w-3 h-3" />
                Pessoal
            </button>
            <button 
                onClick={() => setWorkspace('business')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${workspace === 'business' ? 'bg-[#1F1F22] text-white border border-zinc-700' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
                <Building2 className="w-3 h-3" />
                Business
            </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#0A0A0A] border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group">
              <div className="relative z-10">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Saldo Total</p>
                  <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">{formatCurrency(totalBalance)}</h2>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className="text-emerald-500 font-bold">+12%</span> vs mês anterior
                  </div>
              </div>
              <div className="absolute right-0 top-0 p-8 opacity-5">
                  <Wallet className="w-32 h-32 text-white" />
              </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F22] p-8 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 text-zinc-500">
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Saídas Mensais</span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-200">{formatCurrency(totalExpenses)}</h3>
              <p className="text-xs text-zinc-600 mt-1">Principal: {transactions[0]?.category || 'Diversos'}</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F22] p-8 rounded-2xl flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2 text-zinc-500">
                  <PieChart className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{workspace === 'business' ? 'Burn Rate' : 'Taxa de Poupança'}</span>
              </div>
              <h3 className="text-2xl font-bold text-zinc-200">{workspace === 'business' ? 'R$ 12k/mês' : '35%'}</h3>
              <p className="text-xs text-zinc-600 mt-1">{workspace === 'business' ? 'Runway: 8 meses' : 'Meta: 40%'}</p>
          </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column */}
          <div className="space-y-8">
              <section>
                  <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Contas Bancárias</h3>
                      <button className="text-zinc-500 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3">
                      {accounts.map(acc => (
                          <div key={acc.id} className="flex items-center justify-between p-4 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl hover:border-zinc-700 transition-all cursor-pointer">
                              <div className="flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-lg ${acc.bankColor} flex items-center justify-center text-white font-bold text-xs`}>
                                      {acc.name.substring(0,2).toUpperCase()}
                                  </div>
                                  <div>
                                      <p className="font-bold text-sm text-zinc-200">{acc.name}</p>
                                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{acc.type}</p>
                                  </div>
                              </div>
                              <span className="font-mono text-sm font-medium text-zinc-400">
                                  {formatCurrency(acc.balance)}
                              </span>
                          </div>
                      ))}
                  </div>
              </section>

              <section>
                  <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Cartões</h3>
                      <button className="text-zinc-500 hover:text-white transition-colors"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="space-y-3">
                      {cards.map(card => (
                          <div key={card.id} className="p-5 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
                              <div className="relative z-10">
                                  <div className="flex justify-between items-start mb-6">
                                      <div className="flex items-center gap-2">
                                          <CreditCard className="w-4 h-4 text-zinc-500" />
                                          <span className="font-bold text-sm text-zinc-300">{card.name}</span>
                                      </div>
                                      <Badge variant="outline">Dia {card.closingDay}</Badge>
                                  </div>
                                  
                                  <div className="flex justify-between items-end mb-3">
                                      <span className="text-xl font-bold text-white">{formatCurrency(card.current)}</span>
                                      <span className="text-xs text-zinc-600">/ {formatCurrency(card.limit)}</span>
                                  </div>
                                  <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full ${(card.current / card.limit) > 0.8 ? 'bg-rose-600' : 'bg-blue-600'}`} 
                                        style={{ width: `${(card.current / card.limit) * 100}%` }}
                                      ></div>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>
          </div>

          {/* Right Column: Transactions */}
          <div className="lg:col-span-2">
              <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl overflow-hidden h-full flex flex-col">
                  <div className="p-6 border-b border-[#1F1F22] flex justify-between items-center">
                      <h3 className="font-bold text-white">Transações Recentes</h3>
                      <div className="flex gap-2">
                          <Button size="sm" variant="secondary">Filtrar</Button>
                      </div>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                      <table className="w-full text-left text-sm">
                          <thead className="bg-[#0F0F11] text-zinc-500 font-bold text-[10px] uppercase tracking-wider border-b border-[#1F1F22]">
                              <tr>
                                  <th className="px-6 py-4">Descrição</th>
                                  <th className="px-6 py-4">Categoria</th>
                                  <th className="px-6 py-4">Data</th>
                                  <th className="px-6 py-4 text-right">Valor</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-[#1F1F22]">
                              {transactions.map(t => (
                                  <tr key={t.id} className="hover:bg-[#121214] transition-colors group">
                                      <td className="px-6 py-4 font-medium text-zinc-300 group-hover:text-white transition-colors">{t.title}</td>
                                      <td className="px-6 py-4">
                                          <span className="inline-flex items-center px-2 py-1 rounded bg-[#151518] border border-[#27272A] text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                              {t.category}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-zinc-500 text-xs font-mono">{t.date}</td>
                                      <td className={`px-6 py-4 text-right font-mono font-medium ${t.amount < 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                          {formatCurrency(t.amount)}
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>

      </div>
    </div>
  );
};
