
import React, { useState } from 'react';

const StudentHistory: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'CHAT' | 'QUIZ'>('ALL');

  const history = [
    {
      id: 1,
      type: 'CHAT',
      date: 'Hoje, 10:45',
      course: 'Marketing Avançado',
      topic: 'Testes A/B - Significância Estatística',
      result: 'Concluído',
      score: null,
      details: 'Debate socrático sobre p-valor e riscos de falso positivo.'
    },
    {
      id: 2,
      type: 'QUIZ',
      date: 'Ontem, 16:20',
      course: 'Cálculo Diferencial',
      topic: 'Quiz: Derivadas Parciais',
      result: 'Aprovado',
      score: '9/10',
      details: 'Excelente desempenho em regra da cadeia.'
    },
    {
      id: 3,
      type: 'CHAT',
      date: '14 Out, 09:10',
      course: 'Deep Learning',
      topic: 'Backpropagation',
      result: 'Incompleto',
      score: null,
      details: 'Interrupção durante a explicação do gradiente descendente.'
    },
    {
      id: 5,
      type: 'CHAT',
      date: '10 Out, 11:30',
      course: 'Finanças Corporativas',
      topic: 'WACC e CAPM',
      result: 'Concluído',
      score: null,
      details: 'Discussão aprofundada sobre custo de capital.'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'CHAT': return 'psychology';
      case 'QUIZ': return 'quiz';
      default: return 'history';
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'CHAT': return 'harven-gold';
      case 'QUIZ': return 'primary';
      default: return 'gray-500';
    }
  };

  const filteredHistory = filter === 'ALL' ? history : history.filter(h => h.type === filter);

  return (
    <div className="max-w-5xl mx-auto p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-display font-bold text-harven-dark tracking-tight">Histórico de Atividades</h2>
          <p className="text-gray-500 mt-1">Revise suas interações socráticas e avaliações passadas.</p>
        </div>
        
        <div className="bg-white border border-harven-border rounded-lg p-1 flex shadow-sm">
           {[
             { id: 'ALL', label: 'Tudo', icon: 'view_list' },
             { id: 'CHAT', label: 'Debates', icon: 'forum' },
             { id: 'QUIZ', label: 'Quizzes', icon: 'quiz' }
           ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
                  filter === tab.id 
                  ? 'bg-harven-dark text-primary shadow-sm' 
                  : 'text-gray-400 hover:text-harven-dark'
                }`}
             >
                <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="relative border-l-2 border-harven-border ml-4 md:ml-6 space-y-8 pb-10">
        {filteredHistory.map((item, index) => (
           <div key={item.id} className="relative pl-8 md:pl-10 group">
              {/* Timeline Dot */}
              <div className={`absolute -left-[9px] top-0 size-4 rounded-full border-2 border-white shadow-sm transition-transform group-hover:scale-125 bg-${getColor(item.type)}`}></div>
              
              <div className="bg-white rounded-xl border border-harven-border p-6 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col md:flex-row gap-6">
                 
                 {/* Left Info */}
                 <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border bg-${getColor(item.type).replace('text-', '')}/10 text-${getColor(item.type)} border-${getColor(item.type)}/20`}>
                          {item.type === 'CHAT' ? 'Debate Socrático' : item.type}
                       </span>
                       <span className="text-xs font-bold text-gray-400">{item.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-harven-dark group-hover:text-primary-dark transition-colors">
                       {item.topic}
                    </h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mt-1 mb-3">
                       {item.course}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                       {item.details}
                    </p>
                 </div>

                 {/* Right Status/Action */}
                 <div className="flex md:flex-col items-center justify-between md:items-end gap-4 min-w-[140px] border-t md:border-t-0 md:border-l border-harven-bg pt-4 md:pt-0 md:pl-6">
                    <div className="text-right">
                       <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">Resultado</span>
                       {item.score ? (
                          <span className="text-xl font-display font-bold text-harven-dark">{item.score}</span>
                       ) : (
                          <span className={`text-sm font-bold ${item.result === 'Concluído' ? 'text-green-600' : 'text-orange-500'}`}>{item.result}</span>
                       )}
                    </div>
                    
                    <button className="px-4 py-2 rounded-lg border border-harven-border hover:bg-harven-dark hover:text-primary hover:border-harven-dark transition-all text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                       Review
                       <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                 </div>
              </div>
           </div>
        ))}

        {filteredHistory.length === 0 && (
           <div className="pl-10 text-gray-400 italic text-sm">Nenhuma atividade encontrada neste filtro.</div>
        )}
      </div>
    </div>
  );
};

export default StudentHistory;
