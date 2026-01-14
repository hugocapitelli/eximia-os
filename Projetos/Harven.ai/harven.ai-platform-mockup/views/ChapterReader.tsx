
import React, { useState, useRef, useEffect } from 'react';
import { UserRole } from '../types';

interface ChapterReaderProps {
    userRole?: UserRole;
}

const ChapterReader: React.FC<ChapterReaderProps> = ({ userRole = 'STUDENT' }) => {
  // Estado para armazenar qual pergunta socrática está selecionada
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  // Estado para controlar se o chat está em tela cheia
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Novos estados para a funcionalidade solicitada
  const [contentType, setContentType] = useState<'TEXT' | 'VIDEO' | 'AUDIO'>('TEXT');
  const [interactionCount, setInteractionCount] = useState(0);
  const MAX_INTERACTIONS = 3;

  // Estado de Edição (Instrutor)
  const [isEditing, setIsEditing] = useState(false);

  // Ref para o input do chat para focar automaticamente
  const chatInputRef = useRef<HTMLTextAreaElement>(null);

  const socraticQuestions = [
    {
      id: 'q1',
      question: "Explique a Significância Estatística",
      description: "Por que 0.05 é o padrão da indústria e não 0.01?",
      icon: "analytics"
    },
    {
      id: 'q2',
      question: "O que é o Erro Tipo II?",
      description: "Como falsos negativos podem matar um produto inovador?",
      icon: "warning"
    },
    {
      id: 'q3',
      question: "Como definir o tamanho da amostra?",
      description: "Qual o impacto de testar com poucos usuários?",
      icon: "groups"
    }
  ];

  const handleQuestionSelect = (questionText: string) => {
    // Se estiver editando, não abre o chat, talvez permita editar a pergunta (mock)
    if (isEditing) return;

    setSelectedQuestion(questionText);
    setIsFullScreen(false); // Garante que comece em split-screen
  };

  const closeChat = () => {
    setSelectedQuestion(null);
    setIsFullScreen(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleSend = () => {
    if (interactionCount >= MAX_INTERACTIONS) return;

    if (chatInputRef.current && chatInputRef.current.value.trim() !== "") {
        // Apenas limpa o input para simular o envio no mockup
        chatInputRef.current.value = '';
        chatInputRef.current.focus();
        setInteractionCount(prev => prev + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  // Foca no input quando o chat abre
  useEffect(() => {
    if (selectedQuestion && chatInputRef.current && interactionCount < MAX_INTERACTIONS) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 500);
    }
  }, [selectedQuestion, isFullScreen, interactionCount]);

  // Cálculo de classes de altura para transição suave
  const getContentHeight = () => {
    if (!selectedQuestion) return 'h-full';
    return isFullScreen ? 'h-0 opacity-0 overflow-hidden' : 'h-[50%]';
  };

  const getChatHeight = () => {
    if (!selectedQuestion) return 'h-0';
    return isFullScreen ? 'h-full' : 'h-[50%]';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white relative">
      
      {/* 
         Content Area 
         - Transição suave de altura e opacidade
      */}
      <div className={`w-full overflow-y-auto relative scrollbar-hide transition-all duration-500 ease-in-out ${getContentHeight()}`}>
        
        {/* Instructor Editing Toolbar (Sticky) */}
        {isEditing && (
            <div className="sticky top-4 left-0 right-0 z-50 flex justify-center animate-in slide-in-from-top-4 fade-in duration-300 pointer-events-none">
                <div className="bg-harven-dark/90 backdrop-blur-md text-white p-2 rounded-xl shadow-2xl flex items-center gap-1 pointer-events-auto border border-white/10">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Negrito"><span className="material-symbols-outlined text-[20px]">format_bold</span></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Itálico"><span className="material-symbols-outlined text-[20px]">format_italic</span></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Link"><span className="material-symbols-outlined text-[20px]">link</span></button>
                    <div className="w-px h-6 bg-white/20 mx-1"></div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-primary" title="Reescrever com IA"><span className="material-symbols-outlined text-[20px]">auto_fix_high</span></button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" title="Adicionar Imagem"><span className="material-symbols-outlined text-[20px]">add_photo_alternate</span></button>
                    <div className="w-px h-6 bg-white/20 mx-1"></div>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="px-4 py-1.5 bg-primary text-harven-dark font-bold rounded-lg text-xs uppercase tracking-wide hover:bg-primary-dark transition-colors ml-1"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        )}

        <div className="max-w-3xl mx-auto p-12 flex flex-col gap-8">
          <header className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-harven-gold">
                   Capítulo 2.2 • TESTES A/B
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Botão de Edição para Instrutor */}
                    {userRole === 'INSTRUCTOR' && (
                        <button 
                            onClick={() => setIsEditing(!isEditing)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border ${isEditing ? 'bg-primary text-harven-dark border-primary' : 'bg-white text-gray-500 border-harven-border hover:border-gray-400'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{isEditing ? 'check' : 'edit'}</span>
                            {isEditing ? 'Concluir' : 'Editar Conteúdo'}
                        </button>
                    )}

                    {/* Content Format Selector */}
                    <div className="bg-harven-bg p-1 rounded-lg flex items-center gap-1">
                        <button 
                            onClick={() => setContentType('TEXT')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${contentType === 'TEXT' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">article</span> Texto
                        </button>
                        <button 
                            onClick={() => setContentType('VIDEO')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${contentType === 'VIDEO' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">play_circle</span> Vídeo
                        </button>
                        <button 
                            onClick={() => setContentType('AUDIO')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${contentType === 'AUDIO' ? 'bg-white text-harven-dark shadow-sm' : 'text-gray-400 hover:text-harven-dark'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">headphones</span> Áudio
                        </button>
                    </div>
                </div>
            </div>
            
            <h1 
                className={`text-4xl md:text-5xl font-display font-bold text-harven-dark leading-tight tracking-tight ${isEditing ? 'border-2 border-dashed border-gray-300 p-2 rounded-lg bg-gray-50' : ''}`}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
            >
              A Anatomia de um Teste Vencedor
            </h1>
            <div className="h-1 w-24 bg-primary rounded-full"></div>
          </header>

          {/* RENDERIZAÇÃO DO CONTEÚDO BASEADO NO TIPO */}
          
          {contentType === 'TEXT' && (
            <article className={`prose prose-lg max-w-none text-harven-dark/80 leading-relaxed font-sans text-lg space-y-8 animate-in fade-in duration-500 ${isEditing ? 'outline-2 outline-dashed outline-gray-200 p-4 rounded-xl' : ''}`}>
                <div contentEditable={isEditing} suppressContentEditableWarning={true} className="outline-none">
                    <p>
                    Muitas empresas cometem o erro de testar cores de botões ou frases aleatórias sem uma hipótese estruturada. No <strong>Growth Hacking</strong>, o teste A/B não é apenas sobre o que funciona, mas sobre <em>por que</em> funciona.
                    </p>
                    
                    <div className="bg-harven-bg border border-harven-border rounded-2xl p-8 space-y-4 shadow-inner my-8">
                        <h4 className="text-sm font-bold text-harven-dark uppercase tracking-widest flex items-center gap-2">
                            <span className="material-symbols-outlined text-harven-gold">lightbulb</span>
                            A Hipótese Perfeita
                        </h4>
                        <p className="text-base text-gray-600">
                            Uma hipótese deve seguir o formato: "Se eu [mudar X], então [Y acontecerá] porque [motivo psicológico Z]."
                        </p>
                    </div>

                    <p>
                    Imagine que você está otimizando a página de checkout. Se você reduzir o número de campos do formulário, a conversão deve aumentar. Mas por quê? É por causa da redução da carga cognitiva ou apenas velocidade? O teste deve isolar essa variável.
                    </p>
                </div>

                <div className={`grid grid-cols-2 gap-8 my-12 ${isEditing ? 'pointer-events-none opacity-50 grayscale' : ''}`}>
                <div className="bg-white border-2 border-harven-border rounded-xl p-6 flex flex-col items-center gap-4 group hover:border-primary transition-all cursor-help">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Variante A (Controle)</span>
                    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="w-3/4 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                    <button className="w-1/2 h-8 bg-gray-300 rounded shadow-sm"></button>
                </div>
                <div className="bg-white border-2 border-primary rounded-xl p-6 flex flex-col items-center gap-4 group transition-all cursor-help">
                    <span className="text-xs font-bold text-primary-dark uppercase tracking-widest">Variante B (Teste)</span>
                    <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="w-3/4 h-2 bg-gray-200 rounded-full"></div>
                    </div>
                    <button className="w-1/2 h-8 bg-primary rounded shadow-lg shadow-primary/20"></button>
                </div>
                </div>

                <p contentEditable={isEditing} suppressContentEditableWarning={true} className="outline-none">
                Um teste só é válido se atingir o <strong>P-valor</strong> abaixo de 0.05. Sem isso, você está apenas observando ruído estatístico.
                </p>
            </article>
          )}

          {contentType === 'VIDEO' && (
             <div className="w-full aspect-video bg-black rounded-2xl shadow-2xl relative overflow-hidden group animate-in fade-in duration-500">
                <img src="https://picsum.photos/seed/videoframe/1200/800" className="w-full h-full object-cover opacity-60" alt="Video Thumbnail" />
                
                {isEditing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                        <button className="bg-white text-harven-dark px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined">upload</span>
                            Substituir Vídeo
                        </button>
                    </div>
                )}

                {!isEditing && (
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 cursor-pointer group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white text-5xl fill-1">play_arrow</span>
                    </div>
                    </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                   <h3 className="text-white font-bold text-lg">Aula 2.2: Configurando o Google Optimize</h3>
                   <div className="flex items-center gap-4 mt-2">
                       <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-1/3 bg-primary"></div>
                       </div>
                       <span className="text-white text-xs font-mono">04:20 / 12:45</span>
                   </div>
                </div>
             </div>
          )}

          {contentType === 'AUDIO' && (
              <div className={`bg-harven-dark rounded-2xl p-8 shadow-xl flex flex-col gap-6 animate-in fade-in duration-500 relative ${isEditing ? 'border-2 border-primary border-dashed' : ''}`}>
                 {isEditing && (
                     <div className="absolute top-4 right-4 flex gap-2">
                         <button className="p-2 bg-white/10 rounded hover:bg-white/20 text-white"><span className="material-symbols-outlined">edit</span></button>
                         <button className="p-2 bg-white/10 rounded hover:bg-white/20 text-white"><span className="material-symbols-outlined">upload</span></button>
                     </div>
                 )}
                 <div className="flex items-center gap-6">
                    <div className="size-24 bg-gray-800 rounded-xl flex items-center justify-center">
                       <span className="material-symbols-outlined text-4xl text-primary">headphones</span>
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold text-white">Podcast: Anatomia do Teste</h3>
                       <p className="text-gray-400 mt-1">Narração por Dr. Elena Vance</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                     <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">replay_10</span></button>
                     <button className="size-12 bg-primary rounded-full flex items-center justify-center text-harven-dark hover:scale-105 transition-transform">
                        <span className="material-symbols-outlined text-2xl fill-1">play_arrow</span>
                     </button>
                     <button className="text-gray-400 hover:text-white"><span className="material-symbols-outlined">forward_10</span></button>
                     <div className="flex-1 h-12 flex items-center gap-1">
                        {[...Array(30)].map((_, i) => (
                           <div key={i} className="flex-1 bg-primary/40 rounded-full" style={{ height: `${Math.random() * 100}%` }}></div>
                        ))}
                     </div>
                 </div>
              </div>
          )}

          {/* Socratic Trigger Section */}
          <section className="mt-8 pb-20 pt-10 border-t border-harven-border animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-harven-dark flex items-center justify-center text-primary shadow-lg">
                        <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-display font-bold text-harven-dark">Desafio Socrático</h3>
                        <p className="text-sm text-gray-500">Selecione um tópico para debater com a IA e validar seu aprendizado.</p>
                    </div>
               </div>
               {isEditing && (
                   <button className="px-4 py-2 border border-dashed border-primary text-primary-dark font-bold rounded-lg text-xs uppercase hover:bg-primary/5 transition-all flex items-center gap-2">
                       <span className="material-symbols-outlined">add</span> Nova Pergunta
                   </button>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {socraticQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionSelect(q.question)}
                  className={`relative p-6 rounded-xl text-left border transition-all duration-300 group overflow-hidden ${
                    selectedQuestion === q.question && !isEditing
                      ? 'bg-harven-dark border-harven-dark ring-2 ring-primary ring-offset-2'
                      : 'bg-white border-harven-border hover:border-primary hover:shadow-md'
                  }`}
                >
                  {isEditing && (
                      <div className="absolute top-2 right-2 flex gap-1 z-20">
                          <div className="p-1.5 bg-gray-100 rounded-md hover:bg-gray-200 text-gray-500"><span className="material-symbols-outlined text-[16px]">edit</span></div>
                          <div className="p-1.5 bg-red-50 rounded-md hover:bg-red-100 text-red-500"><span className="material-symbols-outlined text-[16px]">delete</span></div>
                      </div>
                  )}

                  <div className={`absolute top-0 right-0 p-4 opacity-10 transition-transform group-hover:scale-110 ${selectedQuestion === q.question ? 'text-white' : 'text-harven-dark'}`}>
                     <span className="material-symbols-outlined text-[64px]">{q.icon}</span>
                  </div>
                  
                  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                     <span className={`material-symbols-outlined text-[28px] ${selectedQuestion === q.question && !isEditing ? 'text-primary' : 'text-gray-400 group-hover:text-primary-dark'}`}>
                       {q.icon}
                     </span>
                     <div>
                        <h4 className={`font-bold text-sm mb-2 leading-tight ${selectedQuestion === q.question && !isEditing ? 'text-white' : 'text-harven-dark'}`}>
                          {q.question}
                        </h4>
                        <p className={`text-xs leading-relaxed ${selectedQuestion === q.question && !isEditing ? 'text-gray-400' : 'text-gray-500'}`}>
                          {q.description}
                        </p>
                     </div>
                     
                     <div className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 mt-2 ${selectedQuestion === q.question && !isEditing ? 'text-primary' : 'text-gray-300 group-hover:text-primary-dark'}`}>
                        {isEditing ? 'Editar Configuração' : selectedQuestion === q.question ? 'Em Discussão' : 'Iniciar Debate'} 
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                     </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 
         Socratic Chat Panel 
         - Animação slide-in-from-bottom.
         - Altura controlada pelo state isFullScreen.
      */}
      {selectedQuestion && !isEditing && (
        <aside 
          className={`w-full bg-harven-bg border-t border-harven-border flex flex-col z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out ${getChatHeight()}`}
        >
          {/* Header do Chat */}
          <div className="h-16 bg-harven-dark flex items-center justify-between px-8 border-b border-white/5 flex-shrink-0 relative overflow-hidden">
            {/* Background Pattern no Header */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                 <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                   <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
                 </div>
                 <span className="absolute -bottom-1 -right-1 size-2.5 bg-green-500 rounded-full border-2 border-harven-dark"></span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                   <h3 className="text-white text-sm font-bold leading-tight">Socrates AI</h3>
                   <span className="bg-white/10 text-[9px] font-bold px-1.5 py-0.5 rounded text-gray-300 border border-white/5 uppercase">Beta</span>
                </div>
                <p className="text-primary text-[10px] uppercase font-black tracking-widest truncate max-w-[200px] sm:max-w-none opacity-80">
                    {selectedQuestion}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 relative z-10">
                <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1 border border-white/5 mr-4">
                   <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Interações</span>
                   <div className="flex gap-1">
                      {[...Array(MAX_INTERACTIONS)].map((_, i) => (
                          <div key={i} className={`size-1.5 rounded-full ${i < interactionCount ? 'bg-red-500' : 'bg-primary'}`}></div>
                      ))}
                   </div>
                   <span className="text-[10px] font-bold text-white ml-1">{interactionCount}/{MAX_INTERACTIONS}</span>
                </div>
                
                <button 
                  onClick={toggleFullScreen}
                  className="text-gray-400 hover:text-white hover:bg-white/10 transition-all p-2 rounded-lg group" 
                  title={isFullScreen ? "Restaurar" : "Tela Cheia"}
                >
                    <span className="material-symbols-outlined text-[20px] group-active:scale-95 transition-transform">
                      {isFullScreen ? 'close_fullscreen' : 'open_in_full'}
                    </span>
                </button>
                <div className="w-px h-4 bg-white/20 mx-1"></div>
                <button 
                onClick={closeChat}
                className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all p-2 rounded-lg group"
                title="Fechar Debate"
                >
                  <span className="material-symbols-outlined text-[20px] group-active:scale-95 transition-transform">close</span>
                </button>
            </div>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 overflow-y-auto p-8 bg-[#f5f5f0] custom-scrollbar">
            <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-4">
                
                {/* AI Message */}
                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-harven-gold uppercase tracking-[0.2em]">Socrates AI</span>
                        <span className="text-[9px] font-bold text-gray-300">AGORA</span>
                    </div>
                    
                    <div className="bg-white border border-harven-border p-8 rounded-2xl rounded-tl-none shadow-sm space-y-6 max-w-3xl relative">
                        {/* Aspas decorativas */}
                        <span className="absolute top-4 left-4 text-6xl font-display text-gray-100 -z-10 select-none">“</span>
                        
                        <p className="text-base text-harven-dark leading-relaxed font-medium">
                            Excelente escolha de tópico. Vamos desconstruir a ideia de <strong>"{selectedQuestion}"</strong>.
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Muitas vezes, aceitamos o P-valor de 0.05 como uma "linha mágica" que separa o sucesso do fracasso. Mas se você estivesse testando um algoritmo médico vital, você aceitaria 5% de chance de erro? E se fosse apenas a cor de um botão em um site pequeno?
                        </p>
                        <div className="border-l-4 border-primary pl-6 py-2 bg-primary/5 rounded-r-lg">
                           <p className="text-sm text-harven-dark leading-relaxed font-bold italic">
                              "Como o custo do erro (risco) deve influenciar o nível de significância que escolhemos para um teste?"
                           </p>
                        </div>
                    </div>
                </div>

                {/* User Responses */}
                {interactionCount > 0 && (
                     <div className="flex flex-col gap-2 self-end max-w-3xl w-full items-end animate-in fade-in slide-in-from-bottom-2">
                        <div className="bg-harven-dark text-white p-6 rounded-2xl rounded-tr-none shadow-md">
                           <p className="text-sm leading-relaxed">
                             Acredito que em cenários médicos o risco é alto demais para 5%, então deveríamos usar um P-valor muito menor. Já para botões, o risco é baixo.
                           </p>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 mr-2 uppercase">Você • Há instantes</span>
                     </div>
                )}
                
                {interactionCount > 0 && (
                     <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-harven-gold uppercase tracking-[0.2em]">Socrates AI</span>
                         </div>
                         <div className="bg-white border border-harven-border p-6 rounded-2xl rounded-tl-none shadow-sm max-w-3xl">
                            <p className="text-sm text-harven-dark leading-relaxed">
                               Precisamente. Então você concorda que o contexto define a regra estatística. Sendo assim, como você explicaria para um CEO que um teste "falhou" estatisticamente, mas ainda assim pode ser uma boa decisão de negócio implementar a mudança?
                            </p>
                         </div>
                     </div>
                )}
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="p-6 bg-white border-t border-harven-border flex-shrink-0 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
            <div className="max-w-5xl mx-auto w-full relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary to-harven-gold rounded-2xl opacity-0 transition-opacity duration-300 ${isFullScreen && interactionCount < MAX_INTERACTIONS ? 'group-focus-within:opacity-20' : 'group-focus-within:opacity-50'}`}></div>
              <textarea 
                ref={chatInputRef}
                onKeyDown={handleKeyDown}
                disabled={interactionCount >= MAX_INTERACTIONS}
                className="relative w-full bg-harven-bg border-none rounded-2xl p-5 pr-28 text-sm text-harven-dark placeholder-gray-400 focus:ring-0 min-h-[70px] max-h-[120px] shadow-inner resize-none transition-all focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
                placeholder={interactionCount >= MAX_INTERACTIONS ? "Limite de interações atingido para este tópico." : "Digite sua resposta aqui..."}
              />
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                 {interactionCount < MAX_INTERACTIONS ? (
                    <>
                        <button className="text-gray-400 hover:text-harven-dark p-2 transition-colors rounded-full hover:bg-gray-100">
                            <span className="material-symbols-outlined text-[20px]">mic</span>
                        </button>
                        <button 
                        onClick={handleSend}
                        className="h-10 px-6 bg-primary rounded-xl text-harven-dark shadow-lg shadow-primary/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 group/btn"
                        >
                        <span className="text-xs font-bold mr-2">ENVIAR</span>
                        <span className="material-symbols-outlined fill-1 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform text-[18px]">send</span>
                        </button>
                    </>
                 ) : (
                    <div className="h-10 px-4 bg-gray-200 rounded-xl text-gray-500 flex items-center justify-center text-xs font-bold gap-2 cursor-not-allowed">
                        <span className="material-symbols-outlined text-[18px]">block</span>
                        Limite Atingido
                    </div>
                 )}
              </div>
            </div>
            <div className="max-w-5xl mx-auto mt-3 flex justify-between items-center px-2">
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest hidden sm:block">
                  {interactionCount >= MAX_INTERACTIONS 
                     ? "Você completou o ciclo socrático para este tópico." 
                     : "Pressione Enter para enviar • Shift + Enter para quebrar linha"}
               </p>
               <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                  <div className={`size-1.5 rounded-full ${interactionCount >= MAX_INTERACTIONS ? 'bg-red-500' : 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]'}`}></div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                      {interactionCount >= MAX_INTERACTIONS ? "Ciclo Fechado" : "Conexão Segura"}
                  </span>
               </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default ChapterReader;
