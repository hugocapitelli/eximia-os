
import React from 'react';
import { ViewType } from '../types';

interface ChapterDetailProps {
  onNavigate: (view: ViewType) => void;
}

const ChapterDetail: React.FC<ChapterDetailProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto p-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
            <span className="text-harven-gold">Marketing Avançado</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-harven-dark">Capítulo 2.2</span>
          </nav>
          <h1 className="text-5xl font-display font-bold text-harven-dark leading-tight tracking-tight">
            Configuração de Testes A/B de Alta Performance
          </h1>
          <div className="flex gap-6 mt-2">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-harven-border">
              <span className="material-symbols-outlined text-harven-gold text-[18px]">schedule</span>
              <span className="text-xs font-bold text-harven-dark uppercase tracking-tight">45 minutos</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-harven-border">
              <span className="material-symbols-outlined text-harven-gold text-[18px]">psychology</span>
              <span className="text-xs font-bold text-harven-dark uppercase tracking-tight">Nível Intermediário</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-harven-border p-8 shadow-sm">
              <h3 className="text-xl font-display font-bold text-harven-dark mb-6">Objetivos de Aprendizagem</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: 'target', text: 'Definir hipóteses de teste claras e mensuráveis.' },
                  { icon: 'rule', text: 'Calcular o tamanho da amostra para significância estatística.' },
                  { icon: 'science', text: 'Diferenciar testes A/B de testes multivariados.' },
                  { icon: 'monitoring', text: 'Interpretar resultados e evitar falsos positivos.' },
                ].map((obj, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="size-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary-dark">
                      <span className="material-symbols-outlined text-[16px] fill-1">{obj.icon}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-snug">{obj.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-display font-bold text-harven-dark">Pré-requisitos</h3>
              <div className="flex gap-4">
                <div className="flex-1 bg-harven-bg/50 border border-harven-border p-4 rounded-xl flex items-center gap-4 opacity-70">
                   <span className="material-symbols-outlined text-green-600 fill-1">check_circle</span>
                   <div>
                     <p className="text-xs font-bold text-harven-dark">Capítulo 2.1: KPIs</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Concluído</p>
                   </div>
                </div>
                <div className="flex-1 border border-harven-border p-4 rounded-xl flex items-center gap-4 bg-white">
                   <span className="material-symbols-outlined text-harven-gold">warning</span>
                   <div>
                     <p className="text-xs font-bold text-harven-dark">Noções de Estatística</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Recomendado</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-harven-dark rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Seu Progresso</h4>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-display font-bold">45%</span>
                <span className="text-sm text-gray-400 font-bold mb-2">DO CAPÍTULO</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden mb-8">
                <div className="h-full bg-primary w-[45%] rounded-full shadow-[0_0_10px_rgba(208,255,0,0.5)]"></div>
              </div>
              <button 
                onClick={() => onNavigate('CHAPTER_READER')}
                className="w-full bg-primary hover:bg-primary-dark transition-all text-harven-dark py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined fill-1">play_arrow</span>
                RETOMAR CAPÍTULO
              </button>
            </div>

            <div className="bg-white border border-harven-border rounded-2xl p-6 flex flex-col gap-4">
               <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-harven-bg flex items-center justify-center">
                    <span className="material-symbols-outlined text-harven-gold">psychology</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-harven-dark">Tutor Socrático</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Pronto para interagir</p>
                  </div>
               </div>
               <p className="text-xs text-gray-500 leading-relaxed italic">
                 "Neste capítulo, eu ajudarei você a questionar a validade dos seus dados antes de tomar decisões precipitadas."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;
