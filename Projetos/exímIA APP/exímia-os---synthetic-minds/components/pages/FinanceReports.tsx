
import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  FileText,
  Plus,
  ArrowLeft,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Printer,
  Share2,
  Eye,
  MoreHorizontal
} from 'lucide-react';

type ReportType = 'dre' | 'balance' | 'cashflow' | 'budget' | 'custom';
type ReportStatus = 'ready' | 'generating' | 'scheduled' | 'error';
type ReportPeriod = 'monthly' | 'quarterly' | 'annual';

interface Report {
  id: string;
  title: string;
  type: ReportType;
  period: ReportPeriod;
  status: ReportStatus;
  generatedAt?: string;
  scheduledFor?: string;
  size?: string;
  format: 'pdf' | 'xlsx' | 'csv';
  workspace: 'personal' | 'business';
}

const MOCK_REPORTS: Report[] = [
  { id: 'r1', title: 'DRE Janeiro 2026', type: 'dre', period: 'monthly', status: 'ready', generatedAt: '2026-01-28 10:30', size: '245 KB', format: 'pdf', workspace: 'business' },
  { id: 'r2', title: 'Balanço Patrimonial Q4 2025', type: 'balance', period: 'quarterly', status: 'ready', generatedAt: '2026-01-05 14:20', size: '1.2 MB', format: 'xlsx', workspace: 'business' },
  { id: 'r3', title: 'Fluxo de Caixa 2025', type: 'cashflow', period: 'annual', status: 'ready', generatedAt: '2026-01-02 09:00', size: '890 KB', format: 'pdf', workspace: 'business' },
  { id: 'r4', title: 'Orçamento vs Realizado Jan', type: 'budget', period: 'monthly', status: 'generating', workspace: 'business', format: 'pdf' },
  { id: 'r5', title: 'DRE Fevereiro 2026', type: 'dre', period: 'monthly', status: 'scheduled', scheduledFor: '2026-02-01 08:00', format: 'pdf', workspace: 'business' },
  { id: 'r6', title: 'Resumo Finanças Pessoais', type: 'custom', period: 'monthly', status: 'ready', generatedAt: '2026-01-25 18:45', size: '156 KB', format: 'pdf', workspace: 'personal' },
  { id: 'r7', title: 'Investimentos 2025', type: 'custom', period: 'annual', status: 'ready', generatedAt: '2026-01-10 11:00', size: '320 KB', format: 'xlsx', workspace: 'personal' },
];

const REPORT_TEMPLATES = [
  { id: 't1', name: 'DRE (Demonstração de Resultado)', type: 'dre', icon: BarChart3, description: 'Receitas, custos e lucro do período' },
  { id: 't2', name: 'Balanço Patrimonial', type: 'balance', icon: PieChart, description: 'Ativos, passivos e patrimônio líquido' },
  { id: 't3', name: 'Fluxo de Caixa', type: 'cashflow', icon: TrendingUp, description: 'Entradas e saídas de caixa' },
  { id: 't4', name: 'Orçamento vs Realizado', type: 'budget', icon: FileSpreadsheet, description: 'Comparativo planejado x executado' },
];

const getTypeLabel = (type: ReportType) => {
  switch (type) {
    case 'dre': return 'DRE';
    case 'balance': return 'Balanço';
    case 'cashflow': return 'Fluxo de Caixa';
    case 'budget': return 'Orçamento';
    case 'custom': return 'Personalizado';
  }
};

const getTypeColor = (type: ReportType) => {
  switch (type) {
    case 'dre': return 'bg-blue-900/30 text-blue-400 border-blue-500/30';
    case 'balance': return 'bg-purple-900/30 text-purple-400 border-purple-500/30';
    case 'cashflow': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30';
    case 'budget': return 'bg-amber-900/30 text-amber-400 border-amber-500/30';
    case 'custom': return 'bg-zinc-800 text-zinc-400 border-zinc-700';
  }
};

const getStatusIcon = (status: ReportStatus) => {
  switch (status) {
    case 'ready': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'generating': return <Clock className="w-4 h-4 text-amber-400 animate-pulse" />;
    case 'scheduled': return <Calendar className="w-4 h-4 text-blue-400" />;
    case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
  }
};

const getStatusLabel = (status: ReportStatus) => {
  switch (status) {
    case 'ready': return 'Pronto';
    case 'generating': return 'Gerando...';
    case 'scheduled': return 'Agendado';
    case 'error': return 'Erro';
  }
};

export const FinanceReports: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewReport, setShowNewReport] = useState(false);

  const filteredReports = MOCK_REPORTS
    .filter(r => r.workspace === 'business')
    .filter(r => filterType === 'all' || r.type === filterType)
    .filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const readyReports = MOCK_REPORTS.filter(r => r.status === 'ready').length;
  const scheduledReports = MOCK_REPORTS.filter(r => r.status === 'scheduled').length;

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
            <h1 className="text-3xl font-bold text-zinc-100">Relatórios</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Gere e gerencie relatórios financeiros.
            </p>
          </div>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNewReport(true)}>
          Novo Relatório
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Total</span>
          </div>
          <p className="text-2xl font-bold text-zinc-100">{MOCK_REPORTS.length}</p>
          <p className="text-xs text-zinc-600 mt-1">Relatórios criados</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Prontos</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{readyReports}</p>
          <p className="text-xs text-zinc-600 mt-1">Disponíveis para download</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Calendar className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Agendados</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{scheduledReports}</p>
          <p className="text-xs text-zinc-600 mt-1">Para geração futura</p>
        </div>

        <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 text-zinc-500 mb-2">
            <Download className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Este Mês</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">12</p>
          <p className="text-xs text-zinc-600 mt-1">Downloads realizados</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar relatórios..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'dre', 'balance', 'cashflow', 'budget'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterType === type
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {type === 'all' ? 'Todos' : getTypeLabel(type as ReportType)}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-zinc-900/50 text-zinc-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-5 py-4 text-left">Relatório</th>
                <th className="px-5 py-4 text-left">Tipo</th>
                <th className="px-5 py-4 text-left">Período</th>
                <th className="px-5 py-4 text-left">Status</th>
                <th className="px-5 py-4 text-left">Data</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredReports.map(report => (
                <tr key={report.id} className="hover:bg-zinc-900/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="font-medium text-zinc-200">{report.title}</p>
                        <p className="text-xs text-zinc-500">{report.format.toUpperCase()} {report.size && `• ${report.size}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge className={getTypeColor(report.type)}>
                      {getTypeLabel(report.type)}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-zinc-400 capitalize">
                    {report.period === 'monthly' ? 'Mensal' : report.period === 'quarterly' ? 'Trimestral' : 'Anual'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <span className="text-zinc-400">{getStatusLabel(report.status)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-zinc-500 text-xs font-mono">
                    {report.generatedAt || report.scheduledFor || '-'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {report.status === 'ready' && (
                        <>
                          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Visualizar">
                            <Eye className="w-4 h-4 text-zinc-400" />
                          </button>
                          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Download">
                            <Download className="w-4 h-4 text-zinc-400" />
                          </button>
                          <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors" title="Compartilhar">
                            <Share2 className="w-4 h-4 text-zinc-400" />
                          </button>
                        </>
                      )}
                      <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Report Modal */}
      {showNewReport && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowNewReport(false)}>
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-zinc-100 mb-2">Novo Relatório</h2>
            <p className="text-sm text-zinc-400 mb-6">Selecione um template para começar</p>

            <div className="space-y-3 mb-6">
              {REPORT_TEMPLATES.map(template => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    className="w-full flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all text-left"
                  >
                    <div className="p-3 bg-zinc-800 rounded-lg">
                      <Icon className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{template.name}</p>
                      <p className="text-xs text-zinc-500">{template.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setShowNewReport(false)}>Cancelar</Button>
              <Button className="flex-1">Criar Personalizado</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
