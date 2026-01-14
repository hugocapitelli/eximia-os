
import React from 'react';

const StudentMonitor: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <div className="bg-white border-b border-harven-border px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 flex-shrink-0 z-10 shadow-sm">
        <div>
          <h1 className="text-2xl font-display font-bold text-harven-dark">Conversas dos Alunos</h1>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Acompanhe interações em tempo real e intervenha quando necessário.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative">
             <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-harven-gold">search</span>
             <input className="bg-harven-bg border-none rounded-lg text-sm pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary w-64" placeholder="Buscar aluno..." />
           </div>
           <button className="bg-white border border-harven-border p-2 rounded-lg text-gray-400 hover:text-harven-dark shadow-sm">
             <span className="material-symbols-outlined">filter_list</span>
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 flex gap-6">
        {/* Contact List */}
        <div className="w-80 bg-white rounded-2xl border border-harven-border flex flex-col overflow-hidden shadow-sm">
           <div className="p-4 border-b border-harven-bg flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">Recentes</span>
              <span className="bg-harven-bg px-2 py-0.5 rounded text-[10px] font-bold text-harven-dark">24 ATIVOS</span>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {[
                { name: 'Ana Silva', time: 'Há 2 min', chapter: 'Cap. 3 - Termodinâmica', count: 12, alert: 'Baixo', color: 'orange' },
                { name: 'Bruno Santos', time: 'Há 1 hora', chapter: 'Cap. 1 - Introdução', count: 5, alert: 'Normal', color: 'green' },
                { name: 'Carlos Lima', time: 'Ontem', chapter: 'Cap. 2 - Cinemática', count: 8, alert: 'Médio', color: 'yellow' },
                { name: 'Daniela Costa', time: 'Ontem', chapter: 'Cap. 3 - Termodinâmica', count: 15, alert: 'Alto', color: 'red' },
              ].map((student, i) => (
                <div key={i} className={`p-4 border-b border-harven-bg cursor-pointer hover:bg-harven-bg/30 transition-all ${i === 0 ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-bold text-harven-dark">{student.name}</span>
                    <span className="text-[9px] font-bold text-gray-400">{student.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 mb-3 uppercase tracking-tighter">
                    <span className="material-symbols-outlined text-[14px]">menu_book</span> {student.chapter}
                  </p>
                  <div className="flex justify-between items-center">
                     <span className="text-[9px] font-bold text-harven-dark">{student.count} PERGUNTAS</span>
                     <span className={`bg-${student.color}-50 text-${student.color}-600 border border-${student.color}-100 text-[8px] font-black px-1.5 py-0.5 rounded uppercase`}>{student.alert}</span>
                  </div>
                </div>
              ))}
           </div>
        </div>

        {/* Chat Workspace */}
        <div className="flex-1 bg-white rounded-2xl border border-harven-border flex flex-col overflow-hidden shadow-sm">
           <div className="p-4 border-b border-harven-border flex justify-between items-center bg-white shadow-sm z-10">
              <div className="flex items-center gap-3">
                 <img src="https://picsum.photos/seed/ana/100/100" className="size-10 rounded-full border-2 border-primary" alt="Ana" />
                 <div>
                    <h3 className="text-base font-bold text-harven-dark leading-tight">Ana Silva</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Discutindo: Segunda Lei da Termodinâmica</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <button className="size-10 bg-harven-bg rounded-lg flex items-center justify-center text-gray-400 hover:text-harven-dark transition-colors"><span className="material-symbols-outlined">person</span></button>
                 <button className="size-10 bg-harven-bg rounded-lg flex items-center justify-center text-gray-400 hover:text-harven-dark transition-colors"><span className="material-symbols-outlined">more_horiz</span></button>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar bg-[#fbfcf8]">
              <div className="flex justify-center mb-4">
                 <span className="text-[9px] font-bold text-gray-400 uppercase bg-harven-bg px-3 py-1 rounded-full">Hoje, 10:23</span>
              </div>

              <div className="flex flex-col gap-1 max-w-[80%] self-start">
                 <div className="flex items-end gap-2">
                    <div className="size-8 rounded-full bg-harven-dark flex items-center justify-center text-primary flex-shrink-0 shadow-md">
                       <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    <div className="bg-white border border-harven-border border-l-4 border-l-harven-gold p-4 rounded-2xl rounded-tl-none shadow-sm">
                       <p className="text-sm text-harven-dark leading-relaxed">Olá Ana! Notei que você está revisando os conceitos de entropia. Você pode me explicar o que acontece com a entropia do universo em um processo irreversível?</p>
                    </div>
                 </div>
                 <span className="text-[9px] font-bold text-gray-400 ml-10 uppercase">Harven AI • 10:23</span>
              </div>

              <div className="flex flex-col gap-1 max-w-[80%] self-end">
                 <div className="flex items-end gap-2 flex-row-reverse">
                    <img src="https://picsum.photos/seed/ana/100/100" className="size-8 rounded-full shadow-md flex-shrink-0 border border-primary" alt="Ana" />
                    <div className="bg-primary/10 border border-primary/20 border-l-4 border-l-primary p-4 rounded-2xl rounded-tr-none shadow-sm">
                       <p className="text-sm text-harven-dark leading-relaxed">Oi! Então, eu acho que a entropia diminui? Porque a energia está sendo gasta, então as coisas ficam mais organizadas?</p>
                    </div>
                 </div>
                 <span className="text-[9px] font-bold text-gray-400 mr-10 uppercase text-right">Ana Silva • 10:25</span>
              </div>

              <div className="flex justify-center w-full my-2">
                 <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex gap-4 max-w-[90%] items-start shadow-sm border-l-4 border-l-orange-400">
                    <span className="material-symbols-outlined text-orange-500 fill-1">error</span>
                    <div>
                       <p className="text-[11px] font-bold text-orange-600 uppercase mb-0.5">Dificuldade Conceitual Detectada</p>
                       <p className="text-xs text-orange-800 leading-relaxed italic">A aluna demonstrou uma concepção equivocada sobre a relação entre energia e organização (entropia).</p>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-1 max-w-[80%] self-start">
                 <div className="flex items-end gap-2">
                    <div className="size-8 rounded-full bg-harven-dark flex items-center justify-center text-primary flex-shrink-0 shadow-md">
                       <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                    </div>
                    <div className="bg-white border border-harven-border border-l-4 border-l-harven-gold p-4 rounded-2xl rounded-tl-none shadow-sm">
                       <p className="text-sm text-harven-dark leading-relaxed">Essa é uma confusão muito comum! Vamos pensar juntos: quando um cubo de gelo derrete (processo irreversível), a água fica mais ou menos "bagunçada" molecularmente?</p>
                    </div>
                 </div>
                 <span className="text-[9px] font-bold text-gray-400 ml-10 uppercase">Harven AI • 10:26</span>
              </div>
           </div>

           <div className="p-4 bg-white border-t border-harven-border flex justify-between items-center gap-4">
              <div className="flex gap-2">
                 <button className="bg-primary hover:bg-primary-dark transition-all text-harven-dark px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
                   <span className="material-symbols-outlined text-[18px] fill-1">send</span>
                   Intervir na Conversa
                 </button>
                 <button className="bg-white border border-harven-border text-harven-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">Ver Desempenho</button>
              </div>
              <button className="size-10 bg-harven-bg rounded-lg flex items-center justify-center text-gray-400 hover:text-harven-dark transition-colors"><span className="material-symbols-outlined text-[20px]">ios_share</span></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentMonitor;
