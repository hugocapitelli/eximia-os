
import React from 'react';
import { CONTENT_METRICS, CONTENT_PIPELINE, RECENT_CONTENT } from '../../constants';
import { ContentItem } from '../../types';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { SearchBar } from '../molecules/SearchBar';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  GraduationCap, 
  BookOpen, 
  Smartphone, 
  Mail, 
  Video, 
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';

const ContentIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'course': return <GraduationCap className="w-4 h-4 text-purple-500" />;
        case 'ebook': return <BookOpen className="w-4 h-4 text-blue-500" />;
        case 'post': return <Smartphone className="w-4 h-4 text-pink-500" />;
        case 'newsletter': return <Mail className="w-4 h-4 text-amber-500" />;
        case 'video': return <Video className="w-4 h-4 text-red-500" />;
        case 'copy': return <FileText className="w-4 h-4 text-emerald-500" />;
        default: return <FileText className="w-4 h-4 text-zinc-500" />;
    }
};

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        draft: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-700',
        in_review: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        scheduled: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        published: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        archived: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700',
    };
    const labels = {
        draft: 'Rascunho',
        in_review: 'Em Revisão',
        scheduled: 'Agendado',
        published: 'Publicado',
        archived: 'Arquivado',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${styles[status as keyof typeof styles]}`}>
            {labels[status as keyof typeof labels] || status}
        </span>
    );
};

export const ContentDashboard: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight flex items-center gap-3">
            Criação & Conteúdo
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
            Fábrica de produção intelectual e ativos digitais.
          </p>
        </div>
        <div className="flex gap-3 items-center">
             <SearchBar />
             <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Novo Conteúdo</Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {CONTENT_METRICS.map((metric) => (
              <div key={metric.id} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-sm flex items-center justify-between hover:border-eximia-500/30 transition-colors">
                  <div>
                      <div className="flex items-center gap-2 mb-1">
                          <metric.icon className={`w-4 h-4 ${metric.color}`} />
                          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{metric.label}</p>
                      </div>
                      <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{metric.value}</h3>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Pipeline & Calendar */}
          <div className="lg:col-span-2 space-y-8">
              
              {/* Pipeline Visual */}
              <section className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-zinc-500" /> Pipeline de Produção
                      </h3>
                  </div>
                  
                  <div className="flex items-center justify-between relative">
                      {/* Connecting Line */}
                      <div className="absolute top-1/2 left-0 w-full h-[2px] bg-zinc-100 dark:bg-zinc-800 -z-0"></div>
                      
                      {CONTENT_PIPELINE.map((stage, idx) => (
                          <div key={stage.id} className="relative z-10 flex flex-col items-center bg-white dark:bg-[#18181B] px-2">
                              <div className="w-10 h-10 rounded-full border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-600 dark:text-zinc-300 mb-2 shadow-sm">
                                  {stage.count}
                              </div>
                              <span className="text-xs font-medium text-zinc-500">{stage.stage}</span>
                          </div>
                      ))}
                      
                      <div className="relative z-10 flex flex-col items-center bg-white dark:bg-[#18181B] px-2">
                          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white mb-2 shadow-md">
                              <CheckCircle2 className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-emerald-500">Pronto</span>
                      </div>
                  </div>
              </section>

              {/* Weekly Calendar Preview */}
              <section className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-500" /> Calendário Editorial
                      </h3>
                      <button className="text-xs font-medium text-eximia-600 dark:text-eximia-400 hover:underline">Ver Completo</button>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                      {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'].map((day, i) => (
                          <div key={day} className={`border border-zinc-100 dark:border-zinc-800 rounded-lg p-2 min-h-[100px] flex flex-col ${i === 2 ? 'bg-eximia-50 dark:bg-eximia-900/10 border-eximia-200 dark:border-eximia-800' : ''}`}>
                              <span className="text-[10px] font-bold text-zinc-400 uppercase mb-2">{day}</span>
                              {i === 2 && (
                                  <div className="p-1 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 shadow-sm mb-1">
                                      <Smartphone className="w-3 h-3 text-pink-500 mx-auto" />
                                  </div>
                              )}
                              {i === 4 && (
                                  <div className="p-1 bg-white dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 shadow-sm mb-1">
                                      <Mail className="w-3 h-3 text-amber-500 mx-auto" />
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              </section>

          </div>

          {/* RIGHT: Recent Content List */}
          <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col overflow-hidden h-fit">
              <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex justify-between items-center">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Conteúdos Recentes</h3>
                  <button className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200">Ver Todos</button>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {RECENT_CONTENT.map((item) => (
                      <div key={item.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors group cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                  <div className="p-1.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                                      <ContentIcon type={item.type} />
                                  </div>
                                  <Badge variant="outline" className="text-[10px]">{item.type}</Badge>
                              </div>
                              <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="w-4 h-4" />
                              </button>
                          </div>
                          
                          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2 truncate pr-4">{item.title}</h4>
                          
                          <div className="flex items-center justify-between">
                              <StatusBadge status={item.status} />
                              <span className="text-[10px] text-zinc-400">{item.updatedAt}</span>
                          </div>

                          {item.progress !== undefined && (
                              <div className="mt-3 w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                                  <div className="bg-eximia-500 h-full rounded-full" style={{ width: `${item.progress}%` }}></div>
                              </div>
                          )}
                      </div>
                  ))}
              </div>
              <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 text-center">
                  <button className="text-xs font-bold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 flex items-center justify-center gap-1 mx-auto">
                      Ver Arquivo <ArrowRight className="w-3 h-3" />
                  </button>
              </div>
          </div>

      </div>
    </div>
  );
};
