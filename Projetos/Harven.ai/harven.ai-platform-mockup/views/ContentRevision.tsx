
import React, { useState, useRef } from 'react';
import { ViewType } from '../types';

interface ContentRevisionProps {
    onNavigate?: (view: ViewType) => void;
}

const ContentRevision: React.FC<ContentRevisionProps> = ({ onNavigate }) => {
  const [showFileModal, setShowFileModal] = useState(false);
  
  // Refs para manipulação do input de arquivo
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFileType, setPendingFileType] = useState<'PDF' | 'VIDEO' | 'AUDIO'>('PDF');

  // Mock Data for questions
  const [questions, setQuestions] = useState([
      { id: 1, text: 'Como a exclusão de bens intermediários no cálculo do PIB evita a dupla contagem de valor na economia?', answer: 'A exclusão garante que apenas o valor agregado em cada etapa seja contado, pois o valor dos bens intermediários já está incorporado no preço final.', difficulty: 'Fácil', type: 'Conceitual' },
      { id: 2, text: 'Explique a relação entre a taxa de juros e a demanda agregada.', answer: 'O aumento da taxa de juros tende a reduzir o consumo e o investimento, diminuindo a demanda agregada.', difficulty: 'Médio', type: 'Analítico' }
  ]);

  const [files, setFiles] = useState([
      { name: 'Aula 04 - Introdução à Macroeconomia.pdf', type: 'PDF' }
  ]);

  const handleAddFileClick = () => {
      setShowFileModal(true);
  };

  const triggerFileUpload = (type: 'PDF' | 'VIDEO' | 'AUDIO') => {
      setPendingFileType(type);
      // Pequeno timeout para garantir que o estado pendingFileType atualize antes do clique (embora o accept seja visual)
      setTimeout(() => {
          if (fileInputRef.current) {
              fileInputRef.current.click();
          }
      }, 50);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setFiles([...files, { name: file.name, type: pendingFileType }]);
          setShowFileModal(false);
          // Limpar o input para permitir selecionar o mesmo arquivo novamente se necessário
          e.target.value = '';
      }
  };

  const handleRemoveFile = (index: number) => {
      // Impede a exclusão do primeiro arquivo (index 0)
      if (index === 0) return;
      setFiles(files.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
      const newId = questions.length + 1;
      setQuestions([...questions, { id: newId, text: '', answer: '', difficulty: 'Fácil', type: 'Conceitual' }]);
  };

  const updateQuestion = (id: number, field: string, value: string) => {
      setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const deleteQuestion = (id: number) => {
      setQuestions(questions.filter(q => q.id !== id));
  };

  const handleApprove = () => {
      // Simulate saving and go to "Preview/Final View" which is ChapterReader
      if (onNavigate) onNavigate('CHAPTER_READER');
  };

  const getAcceptAttribute = () => {
      switch (pendingFileType) {
          case 'PDF': return '.pdf,.doc,.docx,.txt';
          case 'VIDEO': return 'video/*,.mp4,.mov,.avi';
          case 'AUDIO': return 'audio/*,.mp3,.wav';
          default: return '*/*';
      }
  };

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden relative">
      <div className="bg-white px-8 py-6 border-b border-harven-border sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto flex justify-between items-start gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-display font-bold text-harven-dark tracking-tight">Revisão de Conteúdo</h2>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-green-200">Em Edição</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">schedule</span> Processado em 45s</div>
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">menu_book</span> 1 Capítulo</div>
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[18px]">quiz</span> {questions.length} Perguntas</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 border border-harven-border hover:bg-gray-50 rounded-lg text-xs font-bold text-harven-dark">DESCARTAR</button>
            <button className="px-4 py-2 border border-harven-border hover:bg-gray-50 rounded-lg text-xs font-bold text-harven-dark">REPROCESSAR IA</button>
            <button 
                onClick={handleApprove}
                className="px-6 py-2 bg-primary hover:bg-primary-dark text-harven-dark font-bold rounded-lg text-sm shadow-xl shadow-primary/20 flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                APROVAR E PUBLICAR
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-8">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Source Material Mock */}
          <div className="bg-white rounded-2xl border border-harven-border flex flex-col overflow-hidden shadow-sm">
            <div className="px-6 py-3 bg-harven-bg border-b border-harven-border flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Fontes de Conteúdo</span>
              <button 
                onClick={handleAddFileClick}
                className="flex items-center gap-1 text-[10px] font-bold text-primary-dark hover:underline uppercase"
              >
                  <span className="material-symbols-outlined text-[14px]">add</span> Adicionar Arquivo
              </button>
            </div>
            
            {/* File List */}
            <div className="p-4 bg-gray-50 border-b border-harven-border flex gap-2 overflow-x-auto no-scrollbar">
                {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-harven-border shadow-sm flex-shrink-0">
                        <span className="material-symbols-outlined text-gray-400 text-[18px]">
                            {f.type === 'VIDEO' ? 'movie' : f.type === 'AUDIO' ? 'headphones' : 'picture_as_pdf'}
                        </span>
                        <span className="text-xs font-bold text-harven-dark">{f.name}</span>
                        {/* Apenas mostra botão de excluir se NÃO for o primeiro arquivo */}
                        {i > 0 && (
                            <button 
                                onClick={() => handleRemoveFile(i)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-12 text-harven-dark/80 font-sans leading-relaxed space-y-6 custom-scrollbar bg-white">
               <h3 className="text-xl font-bold text-harven-dark">1. Definição e Conceitos Básicos</h3>
               <p className="bg-primary/20 p-1 rounded">A Macroeconomia é o ramo da economia que estuda o comportamento, a estrutura e o desempenho de uma economia como um todo.</p>
               <p>Diferente da microeconomia, que foca em agentes individuais, a macroeconomia analisa indicadores agregados como o Produto Interno Bruto (PIB), taxas de desemprego e índices de preços.</p>
               <p className="bg-primary/20 p-1 rounded">Um dos conceitos centrais é o PIB, que representa a soma de todos os bens e serviços finais produzidos em uma região durante um período determinado.</p>
               <p>É crucial entender que apenas bens finais são contabilizados para evitar a dupla contagem de insumos.</p>
               <h3 className="text-xl font-bold text-harven-dark mt-10">2. A Importância da Política Monetária</h3>
               <p className="bg-harven-gold/20 p-1 rounded">A política monetária refere-se às ações tomadas pelo banco central, como o Banco Central do Brasil, para controlar a oferta de moeda e as taxas de juros.</p>
               <p>O objetivo principal é garantir a estabilidade da moeda (controle da inflação) e o pleno emprego.</p>
            </div>
          </div>

          {/* Questions Editor Workspace */}
          <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-4">
             <div className="flex justify-between items-end px-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Estrutura & Perguntas</span>
                <span className="bg-harven-gold/10 text-harven-gold text-[10px] font-bold px-2 py-1 rounded uppercase">Editor Ativo</span>
             </div>

             <div className="space-y-4">
               {/* Chapter Block */}
               <div className="bg-white rounded-xl border-l-4 border-primary shadow-sm overflow-hidden group hover:shadow-md transition-all">
                  <div className="p-5 flex justify-between items-center cursor-pointer bg-harven-bg/10">
                    <div>
                       <h4 className="font-bold text-harven-dark">Capítulo 1: Conceitos de PIB</h4>
                       <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Baseado na página 1</p>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="text-gray-300 hover:text-primary-dark transition-colors"><span className="material-symbols-outlined text-[20px]">edit</span></button>
                    </div>
                  </div>
                  
                  <div className="p-5 border-t border-harven-bg bg-harven-bg/10 flex flex-col gap-4">
                     {questions.map((q, idx) => (
                        <div key={q.id} className="bg-white p-4 rounded-xl border border-harven-border shadow-sm relative group/card">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[10px] font-black text-gray-300 uppercase">Pergunta {idx + 1}</span>
                                <div className="flex gap-2">
                                    <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase">{q.difficulty}</span>
                                    <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">{q.type}</span>
                                </div>
                            </div>
                            
                            <textarea 
                                className="w-full text-sm font-bold text-harven-dark leading-snug border-none p-0 resize-none focus:ring-0 bg-transparent mb-4"
                                value={q.text}
                                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                placeholder="Digite a pergunta aqui..."
                                rows={2}
                            />
                            
                            <div className="p-3 bg-harven-bg/50 rounded-lg border-l-2 border-harven-gold">
                                <p className="text-[10px] font-bold text-harven-gold uppercase mb-1">Resposta Esperada:</p>
                                <textarea 
                                    className="w-full text-xs text-gray-600 leading-relaxed italic border-none p-0 resize-none focus:ring-0 bg-transparent"
                                    value={q.answer}
                                    onChange={(e) => updateQuestion(q.id, 'answer', e.target.value)}
                                    placeholder="Defina a resposta esperada..."
                                    rows={3}
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <button onClick={() => deleteQuestion(q.id)} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">delete</span> Excluir</button>
                            </div>
                        </div>
                     ))}

                     <button 
                        onClick={handleAddQuestion}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold text-xs uppercase hover:border-primary hover:text-primary-dark hover:bg-white transition-all flex items-center justify-center gap-2"
                     >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Adicionar Pergunta
                     </button>
                  </div>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Input de arquivo oculto */}
      <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept={getAcceptAttribute()}
          onChange={handleFileChange}
      />

      {/* Modal de Seleção de Tipo de Arquivo */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-harven-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
             <div className="p-6 border-b border-harven-border bg-harven-bg flex justify-between items-center">
               <h3 className="text-lg font-display font-bold text-harven-dark">Adicionar Arquivo</h3>
               <button onClick={() => setShowFileModal(false)} className="text-gray-400 hover:text-harven-dark">
                 <span className="material-symbols-outlined">close</span>
               </button>
             </div>
             
             <div className="p-6 grid grid-cols-1 gap-3">
                <button 
                    onClick={() => triggerFileUpload('PDF')}
                    className="flex items-center gap-4 p-4 border border-harven-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group text-left"
                >
                    <div className="size-10 rounded-full bg-harven-bg flex items-center justify-center group-hover:bg-primary group-hover:text-harven-dark transition-colors">
                        <span className="material-symbols-outlined">description</span>
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-harven-dark">Texto / Documento</span>
                        <span className="text-xs text-gray-500">PDF, DOCX, TXT</span>
                    </div>
                </button>

                <button 
                    onClick={() => triggerFileUpload('VIDEO')}
                    className="flex items-center gap-4 p-4 border border-harven-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group text-left"
                >
                    <div className="size-10 rounded-full bg-harven-bg flex items-center justify-center group-hover:bg-primary group-hover:text-harven-dark transition-colors">
                        <span className="material-symbols-outlined">movie</span>
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-harven-dark">Vídeo</span>
                        <span className="text-xs text-gray-500">MP4, MOV, AVI</span>
                    </div>
                </button>

                <button 
                    onClick={() => triggerFileUpload('AUDIO')}
                    className="flex items-center gap-4 p-4 border border-harven-border rounded-xl hover:border-primary hover:bg-primary/5 transition-all group text-left"
                >
                    <div className="size-10 rounded-full bg-harven-bg flex items-center justify-center group-hover:bg-primary group-hover:text-harven-dark transition-colors">
                        <span className="material-symbols-outlined">headphones</span>
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-harven-dark">Áudio</span>
                        <span className="text-xs text-gray-500">MP3, WAV</span>
                    </div>
                </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ContentRevision;
