
import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { contentsApi, questionsApi } from '../services/api';

interface ContentCreationProps {
   onNavigate: (view: ViewType, data?: any) => void;
   chapterId?: string | null;
}

const ContentCreation: React.FC<ContentCreationProps> = ({ onNavigate, chapterId }) => {
   const [file, setFile] = useState<File | null>(null);
   const [mediaType, setMediaType] = useState<'text' | 'video' | 'audio'>('text');

   // Flow enforced: Upload -> Selection (Method) -> Processing/Manual
   const [step, setStep] = useState<'upload' | 'selection' | 'manual' | 'ai_processing'>('upload');
   const [processingProgress, setProcessingProgress] = useState(0);
   const [processingStage, setProcessingStage] = useState('Inicializando...');

   // Manual Creation Data
   const [contentTitle, setContentTitle] = useState('Novo Conteúdo Manual');
   const [textContent, setTextContent] = useState('');
   const [manualQuestions, setManualQuestions] = useState<any[]>([
      { question_text: '', expected_answer: '', difficulty: 'medium' }
   ]);

   const handleFileDrop = (e: React.DragEvent) => {
      e.preventDefault();
      const fileName = mediaType === 'text' ? 'Nova_Aula_05.pdf' : mediaType === 'video' ? 'Aula_Video_01.mp4' : 'Audio_Explainer.mp3';
      // Mock file object (would be real file in production drop)
      const mockFile = { name: fileName, size: 2048000 } as any;
      setFile(mockFile);
      setContentTitle(fileName);
      setStep('selection');
   };

   const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         setFile(e.target.files[0]);
         setContentTitle(e.target.files[0].name);
         setStep('selection');
      }
   };

   const startAIProcessing = () => {
      setStep('ai_processing');
      let progress = 0;
      const stages = ['Lendo Arquivo...', 'Transcrevendo (Whisper)...', 'Analisando Estrutura Semântica...', 'Gerando Embeddings...', 'Finalizando...'];

      const interval = setInterval(() => {
         progress += 5;
         setProcessingProgress(progress);

         const stageIndex = Math.floor((progress / 100) * stages.length);
         setProcessingStage(stages[Math.min(stageIndex, stages.length - 1)]);

         if (progress >= 100) {
            clearInterval(interval);
            setTimeout(async () => {
               // Creating mocked AI content for now, but saving to DB
               await saveContentAndQuestions(true);
               onNavigate('INSTRUCTOR_LIST'); // Or go back to discipline/chapter
            }, 500);
         }
      }, 200);
   };

   const addQuestionField = () => {
      setManualQuestions([...manualQuestions, { question_text: '', expected_answer: '', difficulty: 'medium' }]);
   };

   const updateQuestion = (index: number, field: string, value: string) => {
      const newQs = [...manualQuestions];
      newQs[index] = { ...newQs[index], [field]: value };
      setManualQuestions(newQs);
   };

   const saveContentAndQuestions = async (isAI: boolean = false) => {
      if (!chapterId) {
         alert("Erro: ID do capítulo não encontrado.");
         return;
      }

      try {
         // 1. Create Content
         const newContent = await contentsApi.create(chapterId, {
            title: contentTitle,
            type: mediaType, // 'text', 'video', 'audio'
            text_content: isAI ? "Conteúdo gerado via AI..." : textContent, // Simplified for now
            content_url: file ? `https://fake-storage/${file.name}` : null,
            order: 0 // TODO: fetch count
         });

         // 2. Create Questions (if manual or mocked AI)
         if (newContent && newContent.id) {
            const questionsToSave = isAI
               ? [
                  { question_text: "Qual o conceito principal abordado?", expected_answer: "O conceito de...", difficulty: "medium" },
                  { question_text: "Como isso se aplica na vida real?", expected_answer: "Exemplo prático...", difficulty: "hard" }
               ]
               : manualQuestions.filter(q => q.question_text.trim() !== '');

            if (questionsToSave.length > 0) {
               await questionsApi.create(newContent.id, questionsToSave);
            }
         }

         if (!isAI) {
            alert("Conteúdo e Perguntas salvos com sucesso!");
            onNavigate('DISCIPLINE_EDIT', null); // Ideally go back to previous view logic
         }

      } catch (e) {
         console.error("Erro ao salvar conteúdo", e);
         alert("Erro ao salvar conteúdo.");
      }
   };

   return (
      <div className="flex flex-col flex-1 h-full bg-harven-bg">
         <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-8 h-full">

            {/* Header da View */}
            <div>
               <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                  <span className="cursor-pointer hover:text-harven-dark" onClick={() => onNavigate('DISCIPLINE_EDIT', null)}>Voltar</span>
                  <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  <span className="text-harven-dark">Gerenciador de Conteúdo</span>
               </nav>
               <h1 className="text-3xl font-display font-bold text-harven-dark">
                  Adicionar Conteúdo
               </h1>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Capítulo ID: {chapterId || 'N/A'}</p>
            </div>

            {/* STEP 1: UPLOAD */}
            {step === 'upload' && (
               <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">

                  {/* Media Type Selector */}
                  <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-harven-border shadow-sm">
                     <button
                        onClick={() => setMediaType('text')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${mediaType === 'text' ? 'bg-harven-dark text-white' : 'text-gray-400 hover:text-harven-dark'}`}
                     >
                        <span className="material-symbols-outlined text-[18px]">description</span> Documento
                     </button>
                     <button
                        onClick={() => setMediaType('video')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${mediaType === 'video' ? 'bg-harven-dark text-white' : 'text-gray-400 hover:text-harven-dark'}`}
                     >
                        <span className="material-symbols-outlined text-[18px]">movie</span> Vídeo
                     </button>
                     <button
                        onClick={() => setMediaType('audio')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 ${mediaType === 'audio' ? 'bg-harven-dark text-white' : 'text-gray-400 hover:text-harven-dark'}`}
                     >
                        <span className="material-symbols-outlined text-[18px]">headphones</span> Áudio
                     </button>
                  </div>

                  <div
                     className="w-full max-w-2xl border-2 border-dashed border-gray-300 rounded-3xl p-12 flex flex-col items-center justify-center bg-white hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group relative"
                     onDragOver={(e) => e.preventDefault()}
                     onDrop={handleFileDrop}
                  >
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileInput} accept={mediaType === 'text' ? '.pdf,.doc,.docx,.txt' : mediaType === 'video' ? '.mp4,.mov' : '.mp3,.wav'} />
                     <div className="size-20 bg-harven-bg rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary-dark">
                           {mediaType === 'text' ? 'cloud_upload' : mediaType === 'video' ? 'video_file' : 'audio_file'}
                        </span>
                     </div>
                     <h3 className="text-xl font-bold text-harven-dark mb-2">
                        {mediaType === 'text' ? 'Arraste seu documento (PDF/DOC)' : mediaType === 'video' ? 'Arraste seu vídeo (MP4/MOV)' : 'Arraste seu áudio (MP3/WAV)'}
                     </h3>
                     <p className="text-gray-500 mb-8">Conteúdo base para a aula</p>
                     <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {mediaType === 'text' && <span>PDF • DOCX • PPTX • TXT</span>}
                        {mediaType === 'video' && <span>MP4 • MOV • AVI • WEBM</span>}
                        {mediaType === 'audio' && <span>MP3 • WAV • OGG • M4A</span>}
                     </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                     <button onClick={() => setStep('manual')} className="text-gray-400 hover:text-harven-dark font-bold text-sm underline">Pular upload e criar manualmente</button>
                  </div>
               </div>
            )}

            {/* STEP 2: SELECTION (METHOD) */}
            {step === 'selection' && (
               <div className="flex-1 flex flex-col gap-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white p-4 rounded-xl border border-harven-border flex items-center gap-4 shadow-sm">
                     <div className="size-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                        <span className="material-symbols-outlined">
                           {mediaType === 'text' ? 'description' : mediaType === 'video' ? 'movie' : 'headphones'}
                        </span>
                     </div>
                     <div className="flex-1">
                        <p className="text-sm font-bold text-harven-dark">{file?.name || contentTitle}</p>
                        <p className="text-xs text-gray-400">Pronto para processamento</p>
                     </div>
                     <button onClick={() => setStep('upload')} className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase">Trocar</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full max-h-[400px]">
                     {/* Card AI */}
                     <button
                        onClick={startAIProcessing}
                        className="bg-white border-2 border-primary/20 rounded-3xl p-8 flex flex-col gap-6 text-left hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all group relative overflow-hidden"
                     >
                        <div className="absolute top-6 right-6">
                           <span className="bg-primary text-harven-dark text-[10px] font-black px-2 py-1 rounded uppercase shadow-sm">BETA</span>
                        </div>
                        <div className="absolute top-0 right-0 size-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors"></div>
                        <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-harven-dark shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                           <span className="material-symbols-outlined text-3xl fill-1">auto_awesome</span>
                        </div>
                        <div>
                           <h3 className="text-2xl font-display font-bold text-harven-dark mb-2">Processamento Inteligente (IA)</h3>
                           <p className="text-gray-500 leading-relaxed">
                              A Harven AI analisará o conteúdo, extrairá conceitos-chave e gerará automaticamente perguntas socráticas e a estrutura da aula.
                           </p>
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-primary-dark uppercase tracking-wide">
                           Recomendado <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                     </button>

                     {/* Card Manual */}
                     <button
                        onClick={() => setStep('manual')}
                        className="bg-white border-2 border-harven-border rounded-3xl p-8 flex flex-col gap-6 text-left hover:border-gray-400 transition-all group"
                     >
                        <div className="size-14 bg-harven-bg rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-colors">
                           <span className="material-symbols-outlined text-3xl">edit_document</span>
                        </div>
                        <div>
                           <h3 className="text-2xl font-display font-bold text-harven-dark mb-2">Processamento Manual</h3>
                           <p className="text-gray-500 leading-relaxed">
                              Você define a estrutura do capítulo e escreve as perguntas e respostas esperadas manualmente. Ideal para controle total.
                           </p>
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-gray-400 group-hover:text-harven-dark uppercase tracking-wide transition-colors">
                           Selecionar <span className="material-symbols-outlined">arrow_forward</span>
                        </div>
                     </button>
                  </div>
               </div>
            )}

            {/* STEP 3: MANUAL EDITOR */}
            {step === 'manual' && (
               <div className="flex-1 bg-white rounded-2xl border border-harven-border shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="p-6 border-b border-harven-border bg-harven-bg flex justify-between items-center">
                     <h3 className="font-bold text-harven-dark flex items-center gap-2">
                        <span className="material-symbols-outlined text-gray-400">edit</span>
                        Editor Manual de Conteúdo
                     </h3>
                     <button onClick={() => setStep('selection')} className="text-gray-400 hover:text-harven-dark">Cancelar</button>
                  </div>
                  <div className="p-8 flex-1 overflow-y-auto space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Título do Conteúdo</label>
                        <input
                           className="w-full bg-harven-bg border-none rounded-lg p-3 focus:ring-1 focus:ring-primary text-harven-dark"
                           placeholder="Ex: Introdução à Derivadas"
                           value={contentTitle}
                           onChange={e => setContentTitle(e.target.value)}
                        />
                     </div>

                     {mediaType === 'text' && (
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Texto do Conteúdo (Opcional se houver anexo)</label>
                           <textarea
                              className="w-full bg-harven-bg border-none rounded-lg p-3 focus:ring-1 focus:ring-primary min-h-[100px] text-harven-dark resize-none"
                              placeholder="Cole aqui o texto da aula..."
                              value={textContent}
                              onChange={e => setTextContent(e.target.value)}
                           />
                        </div>
                     )}

                     <div className="border-t border-harven-border pt-6">
                        <div className="flex justify-between items-center mb-4">
                           <h4 className="font-bold text-harven-dark">Perguntas Socráticas</h4>
                           <button onClick={addQuestionField} className="text-xs font-bold text-primary-dark hover:underline">+ Adicionar Outra</button>
                        </div>

                        <div className="space-y-6">
                           {manualQuestions.map((q, idx) => (
                              <div key={idx} className="bg-harven-bg p-4 rounded-xl border border-gray-200">
                                 <div className="space-y-3">
                                    <div>
                                       <label className="text-[10px] font-bold text-gray-400 uppercase">Pergunta</label>
                                       <input
                                          className="w-full bg-white border-none rounded-lg p-2 text-sm text-harven-dark"
                                          placeholder="Ex: Como X se relaciona com Y?"
                                          value={q.question_text}
                                          onChange={(e) => updateQuestion(idx, 'question_text', e.target.value)}
                                       />
                                    </div>
                                    <div>
                                       <label className="text-[10px] font-bold text-gray-400 uppercase">Resposta Esperada</label>
                                       <textarea
                                          className="w-full bg-white border-none rounded-lg p-2 text-sm text-harven-dark h-20 resize-none"
                                          placeholder="Ex: O aluno deve responder que..."
                                          value={q.expected_answer}
                                          onChange={(e) => updateQuestion(idx, 'expected_answer', e.target.value)}
                                       />
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="p-6 border-t border-harven-border bg-gray-50 flex justify-end gap-3">
                     <button
                        onClick={() => saveContentAndQuestions(false)}
                        className="px-6 py-2 bg-primary hover:bg-primary-dark text-harven-dark rounded-lg text-sm font-bold shadow-lg shadow-primary/20"
                     >
                        Salvar Conteúdo
                     </button>
                  </div>
               </div>
            )}

            {/* STEP 4: AI PROCESSING LOADER */}
            {step === 'ai_processing' && (
               <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-700">
                  <div className="w-full max-w-md text-center space-y-8">
                     <div className="relative size-32 mx-auto">
                        <div className="absolute inset-0 border-4 border-harven-bg rounded-full"></div>
                        <div
                           className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"
                           style={{ animationDuration: '1.5s' }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="material-symbols-outlined text-4xl text-harven-gold animate-pulse">psychology</span>
                        </div>
                     </div>

                     <div>
                        <h3 className="text-2xl font-display font-bold text-harven-dark mb-2">Analisando Conteúdo</h3>
                        <p className="text-primary-dark font-mono text-sm">{processingStage}</p>
                     </div>

                     <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                           className="bg-primary h-full rounded-full transition-all duration-300 ease-out"
                           style={{ width: `${processingProgress}%` }}
                        ></div>
                     </div>

                     <p className="text-xs text-gray-400">Salvando no banco de dados e gerando perguntas...</p>
                  </div>
               </div>
            )}

         </div>
      </div>
   );
};

export default ContentCreation;
