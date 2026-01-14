
import React, { useState } from 'react';
import { ViewType } from '../types';

interface CourseEditProps {
  onNavigate: (view: ViewType) => void;
}

const CourseEdit: React.FC<CourseEditProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'settings'>('content');

  // Mock de estrutura
  const modules = [
    { id: 1, title: 'Conceitos Fundamentais', chapters: ['Definição de Limite', 'Limites Laterais'] },
    { id: 2, title: 'Limites Infinitos', chapters: ['Assíntotas', 'Continuidade'] },
  ];

  return (
    <div className="flex flex-col h-full bg-harven-bg">
      {/* Edit Header */}
      <div className="bg-white border-b border-harven-border px-8 py-5 flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
         <div className="flex items-center gap-4">
            <div>
               <h1 className="text-xl font-display font-bold text-harven-dark flex items-center gap-2 cursor-default">
                  Introdução aos Limites
                  <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-green-200">Publicado</span>
               </h1>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Curso em: Cálculo Diferencial (MT-101)</p>
            </div>
         </div>
         <div className="flex gap-3">
            <button className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-harven-dark uppercase tracking-widest">Pré-visualizar</button>
            <button className="px-6 py-2 bg-primary hover:bg-primary-dark text-harven-dark font-bold rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
               <span className="material-symbols-outlined text-[18px]">save</span>
               Salvar
            </button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
         {/* Sidebar Navigation */}
         <div className="w-64 bg-white border-r border-harven-border flex flex-col py-6">
            <nav className="space-y-1 px-4">
               <button
                  onClick={() => setActiveTab('content')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'content' ? 'bg-harven-bg text-harven-dark shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
               >
                  <span className="material-symbols-outlined">menu_book</span> Conteúdo
               </button>
               <button
                  onClick={() => setActiveTab('resources')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'resources' ? 'bg-harven-bg text-harven-dark shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
               >
                  <span className="material-symbols-outlined">folder_open</span> Recursos
               </button>
               <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-harven-bg text-harven-dark shadow-inner' : 'text-gray-400 hover:bg-gray-50'}`}
               >
                  <span className="material-symbols-outlined">tune</span> Ajustes
               </button>
            </nav>
         </div>

         {/* Content Area */}
         <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               
               {activeTab === 'content' && (
                  <>
                     <div className="bg-white p-8 rounded-2xl border border-harven-border shadow-sm space-y-6">
                        <div className="flex justify-between items-start">
                           <h3 className="text-lg font-display font-bold text-harven-dark">Estrutura do Curso</h3>
                           <button className="text-primary-dark text-xs font-bold uppercase hover:underline">+ Novo Módulo</button>
                        </div>
                        
                        <div className="space-y-6">
                           {modules.map((module) => (
                              <div key={module.id} className="border border-harven-border rounded-xl overflow-hidden">
                                 <div className="bg-harven-bg/50 p-4 flex justify-between items-center border-b border-harven-border">
                                    <div className="flex items-center gap-3">
                                       <span className="material-symbols-outlined text-gray-400 cursor-move">drag_handle</span>
                                       <h4 className="font-bold text-harven-dark">{module.title}</h4>
                                    </div>
                                    <div className="flex gap-2">
                                       <button className="p-1 text-gray-400 hover:text-harven-dark"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                       <button className="p-1 text-gray-400 hover:text-red-500"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                    </div>
                                 </div>
                                 <div className="p-2 space-y-1">
                                    {module.chapters.map((chapter, idx) => (
                                       <div key={idx} className="flex items-center justify-between p-3 hover:bg-harven-bg rounded-lg group transition-colors">
                                          <div className="flex items-center gap-3">
                                             <div className="size-1.5 rounded-full bg-primary"></div>
                                             <span className="text-sm font-medium text-gray-600">{chapter}</span>
                                          </div>
                                          <button 
                                            onClick={() => onNavigate('CONTENT_REVISION')}
                                            className="text-[10px] font-bold text-gray-400 uppercase opacity-0 group-hover:opacity-100 hover:text-primary-dark transition-all"
                                          >
                                             Editar Conteúdo
                                          </button>
                                       </div>
                                    ))}
                                    <button 
                                       onClick={() => onNavigate('CONTENT_CREATION')}
                                       className="w-full py-2 text-xs font-bold text-gray-400 uppercase border border-dashed border-gray-300 rounded-lg hover:border-primary hover:text-primary-dark hover:bg-white transition-all"
                                    >
                                       + Adicionar Capítulo
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </>
               )}

               {activeTab === 'resources' && (
                  <div className="bg-white p-8 rounded-2xl border border-harven-border shadow-sm space-y-6">
                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:bg-harven-bg transition-all cursor-pointer">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">cloud_upload</span>
                        <p className="text-sm font-bold text-gray-500">Arraste arquivos complementares aqui</p>
                        <p className="text-xs text-gray-400 mt-1">PDFs, Planilhas, Imagens</p>
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between p-4 border border-harven-border rounded-lg">
                           <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                              <span className="text-sm font-bold text-harven-dark">Tabela de Derivadas.pdf</span>
                           </div>
                           <button className="text-gray-400 hover:text-red-500"><span className="material-symbols-outlined">delete</span></button>
                        </div>
                     </div>
                  </div>
               )}

               {activeTab === 'settings' && (
                  <div className="bg-white p-8 rounded-2xl border border-harven-border shadow-sm space-y-6">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Capa do Curso</label>
                        <div className="flex gap-2">
                            <input className="w-full bg-harven-bg border-none rounded-lg p-3 text-sm font-medium focus:ring-1 focus:ring-primary text-harven-dark" placeholder="URL da imagem (https://...)" defaultValue="https://picsum.photos/seed/math1/400/200" />
                            <label className="px-4 bg-harven-bg hover:bg-gray-200 rounded-lg cursor-pointer flex items-center justify-center border border-transparent transition-colors" title="Upload de Arquivo">
                                <span className="material-symbols-outlined text-gray-500">upload_file</span>
                                <input type="file" className="hidden" accept="image/*" />
                            </label>
                        </div>
                        <p className="text-[9px] text-gray-400">Recomendado: 1200x600px. Você pode colar uma URL ou enviar um arquivo.</p>
                     </div>
                     <div className="flex items-center justify-between pt-4 border-t border-harven-bg">
                        <div>
                           <h4 className="font-bold text-harven-dark text-sm">Visibilidade</h4>
                           <p className="text-xs text-gray-400">Alunos podem acessar este curso?</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" defaultChecked />
                           <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                     </div>
                  </div>
               )}

            </div>
         </div>
      </div>
    </div>
  );
};

export default CourseEdit;
