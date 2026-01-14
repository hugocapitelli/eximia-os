import React, { useState, useEffect } from 'react';
import { ViewType } from '../types';
import { coursesApi, chaptersApi, disciplinesApi } from '../services/api';

interface DisciplineEditProps {
   onNavigate: (view: ViewType) => void;
   disciplineId?: string | null;
   initialTab?: 'info' | 'syllabus' | 'settings';
   type?: 'class' | 'course'; // New prop to distinguish
}

const DisciplineEdit: React.FC<DisciplineEditProps> = ({ onNavigate, disciplineId, initialTab = 'info', type = 'course' }) => {
   const [activeTab, setActiveTab] = useState<'info' | 'syllabus' | 'settings'>(initialTab);
   const [selectedIcon, setSelectedIcon] = useState('calculate');
   const [customIcon, setCustomIcon] = useState<string | null>(null);

   // Real Data State
   const [course, setCourse] = useState<any>(null);
   const [chapters, setChapters] = useState<any[]>([]); // Only for course type
   const [loading, setLoading] = useState(false);

   // New Chapter State
   const [showChapterModal, setShowChapterModal] = useState(false);
   const [newChapterTitle, setNewChapterTitle] = useState('');

   useEffect(() => {
      if (disciplineId) {
         loadData();
      }
   }, [disciplineId, type]);

   const loadData = async () => {
      setLoading(true);
      try {
         if (type === 'class') {
            const data = await disciplinesApi.get(disciplineId!);
            setCourse(data); // Reusing 'course' state for generic 'item'
            // Classes don't have chapters directly in this view, so we skip chaptersApi
         } else {
            const data = await coursesApi.get(disciplineId!);
            const chs = await chaptersApi.list(disciplineId!);
            setCourse(data);
            setChapters(chs);
         }
      } catch (e) {
         console.error("Erro ao carregar dados", e);
      } finally {
         setLoading(false);
      }
   };

   const handleAddChapter = async () => {
      if (!newChapterTitle || !disciplineId) return;
      try {
         await chaptersApi.create(disciplineId, { title: newChapterTitle, order: chapters.length + 1 });
         setNewChapterTitle('');
         setShowChapterModal(false);
         loadData();
      } catch (e) {
         console.error("Error creating chapter", e);
      }
   };

   const handleDeleteChapter = async (id: string) => {
      if (!confirm("Tem certeza que deseja apagar este capítulo?")) return;
      try {
         await chaptersApi.delete(id);
         loadData();
      } catch (e) {
         console.error("Error deleting chapter", e);
      }
   };

   const availableIcons = [
      'school', 'code', 'science', 'history_edu',
      'palette', 'psychology', 'calculate', 'database',
      'biotech', 'gavel', 'balance', 'architecture'
   ];

   const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0];
         setCustomIcon(URL.createObjectURL(file));
      }
   };

   const handleUpdateCourse = async () => {
      if (!course || !disciplineId) return;
      try {
         if (type === 'class') {
            await disciplinesApi.update(disciplineId, {
               title: course.title,
               description: course.description
            });
            alert("Turma atualizada com sucesso!");
         } else {
            await coursesApi.update(disciplineId, {
               title: course.title,
               description: course.description,
               instructor_id: course.instructor_id,
               image_url: course.image_url
            });
            alert("Curso atualizado com sucesso!");
         }
      } catch (e) {
         console.error("Erro ao atualizar", e);
         alert("Erro ao salvar alterações.");
      }
   };

   return (
      <div className="flex flex-col h-full bg-harven-bg">
         {/* Edit Header */}
         <div className="bg-white border-b border-harven-border px-8 py-5 flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-4">
               <div>
                  <h1 className="text-xl font-display font-bold text-harven-dark flex items-center gap-2">
                     {course?.title || 'Carregando...'}
                     <span className="bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase border border-green-200">Ativa</span>
                  </h1>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{type === 'class' ? 'Turma' : 'Curso'} • {disciplineId}</p>
               </div>
            </div>
            <div className="flex gap-3">
               <button onClick={() => onNavigate('INSTRUCTOR_LIST')} className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-harven-dark uppercase tracking-widest">Voltar</button>
               <button onClick={handleUpdateCourse} className="px-6 py-2 bg-primary hover:bg-primary-dark text-harven-dark font-bold rounded-lg text-xs uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  Salvar Alterações
               </button>
            </div>
         </div>

         <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-white border-r border-harven-border flex flex-col py-6">
               <nav className="space-y-1 px-4">
                  {[
                     { id: 'info', label: 'Informações Gerais', icon: 'info' },
                     ...(type !== 'class' ? [{ id: 'syllabus', label: 'Estrutura Curricular', icon: 'account_tree' }] : []),
                     { id: 'settings', label: 'Configurações', icon: 'settings' },
                  ].map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === item.id
                           ? 'bg-harven-bg text-harven-dark shadow-inner'
                           : 'text-gray-400 hover:bg-gray-50 hover:text-harven-dark'
                           }`}
                     >
                        <span className={`material-symbols-outlined ${activeTab === item.id ? 'fill-1' : ''}`}>{item.icon}</span>
                        {item.label}
                     </button>
                  ))}
               </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
               <div className="max-w-4xl mx-auto space-y-8">

                  {activeTab === 'info' && course && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <section className="bg-white p-8 rounded-2xl border border-harven-border shadow-sm space-y-6">
                           <h3 className="text-lg font-display font-bold text-harven-dark border-b border-harven-bg pb-4">Dados Básicos</h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome da Disciplina</label>
                                 <input
                                    className="w-full bg-harven-bg border-none rounded-lg p-3 text-sm font-medium focus:ring-1 focus:ring-primary text-harven-dark"
                                    value={course.title}
                                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">URL da Imagem de Capa</label>
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Imagem de Capa</label>
                                 <div className="flex gap-4 items-center">
                                    {(course.image_url || course.image) && (
                                       <img src={course.image_url || course.image} className="w-16 h-16 rounded-lg object-cover border border-harven-border" />
                                    )}
                                    <input
                                       type="file"
                                       accept="image/*"
                                       className="w-full text-sm text-gray-500
                                          file:mr-4 file:py-2 file:px-4
                                          file:rounded-full file:border-0
                                          file:text-xs file:font-semibold
                                          file:bg-primary file:text-harven-dark
                                          hover:file:bg-primary-dark"
                                       onChange={async (e) => {
                                          if (e.target.files && e.target.files[0]) {
                                             try {
                                                const res = await coursesApi.uploadImage(course.id, e.target.files[0]);
                                                setCourse({ ...course, image_url: res.image_url });
                                                alert("Imagem atualizada!");
                                             } catch (err) {
                                                console.error(err);
                                                alert("Erro no upload");
                                             }
                                          }
                                       }}
                                    />
                                 </div>
                              </div>
                              <div className="col-span-2 space-y-1.5">
                                 <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição da Ementa</label>
                                 <textarea
                                    className="w-full bg-harven-bg border-none rounded-lg p-3 text-sm font-medium focus:ring-1 focus:ring-primary text-harven-dark min-h-[120px] resize-none"
                                    value={course.description || ''}
                                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                                 />
                              </div>
                           </div>
                        </section>

                        {type !== 'class' && (
                           <section className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm space-y-6">
                              <h3 className="text-lg font-display font-bold text-red-700 border-b border-red-200 pb-4">Zona de Perigo</h3>
                              <div className="flex justify-between items-center">
                                 <div>
                                    <p className="text-sm font-bold text-red-900">Excluir este Curso</p>
                                    <p className="text-xs text-red-600">Esta ação não pode ser desfeita. Todos os módulos e conteúdos serão apagados.</p>
                                 </div>
                                 <button
                                    onClick={async () => {
                                       if (confirm("TEM CERTEZA? Essa ação é irreversível.")) {
                                          try {
                                             await coursesApi.delete(course.id);
                                             alert("Curso excluído.");
                                             onNavigate('INSTRUCTOR_DETAIL', null); // Go back to Class list
                                          } catch (e) {
                                             console.error(e);
                                             alert("Erro ao excluir.");
                                          }
                                       }
                                    }}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest"
                                 >
                                    Excluir Curso
                                 </button>
                              </div>
                           </section>
                        )}
                     </div>
                  )}

                  {activeTab === 'syllabus' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center">
                           <p className="text-gray-500 text-sm">Organize a hierarquia de cursos/módulos desta disciplina.</p>
                           <button onClick={() => setShowChapterModal(true)} className="bg-harven-dark text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-black transition-colors">
                              <span className="material-symbols-outlined text-[16px]">add</span> Adicionar Módulo
                           </button>
                        </div>

                        {showChapterModal && (
                           <div className="bg-white p-4 rounded-xl border border-harven-border shadow-md animate-in zoom-in-95">
                              <h4 className="font-bold mb-2">Novo Módulo</h4>
                              <div className="flex gap-2">
                                 <input
                                    autoFocus
                                    className="flex-1 bg-harven-bg border-none rounded-lg px-3 py-2 text-sm"
                                    placeholder="Ex: Introdução aos Limites"
                                    value={newChapterTitle}
                                    onChange={(e) => setNewChapterTitle(e.target.value)}
                                 />
                                 <button onClick={handleAddChapter} className="bg-primary px-4 py-2 rounded-lg font-bold text-xs text-harven-dark">Criar</button>
                                 <button onClick={() => setShowChapterModal(false)} className="bg-gray-100 px-4 py-2 rounded-lg font-bold text-xs text-gray-500">Cancelar</button>
                              </div>
                           </div>
                        )}

                        <div className="space-y-4">
                           {chapters.map((chapter, i) => (
                              <div key={chapter.id} className="bg-white p-4 rounded-xl border border-harven-border flex items-center gap-4 group hover:border-primary transition-all">
                                 <div className="flex flex-col gap-1 text-gray-300">
                                    <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
                                 </div>
                                 <div className="size-10 bg-harven-bg rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm">{i + 1}</div>
                                 <div className="flex-1">
                                    <h4 className="font-bold text-harven-dark">{chapter.title}</h4>
                                    <p className="text-xs text-gray-400">{chapter.status}</p>
                                 </div>
                                 <button
                                    onClick={() => {
                                       // TODO: Navigate to Chapter Detail / Content edit if needed
                                       onNavigate('CONTENT_CREATION', chapter.id); // Passing chapter.id for content creation
                                    }}
                                    className="px-3 py-1.5 bg-primary/10 text-primary-dark rounded-lg text-xs font-bold hover:bg-primary hover:text-harven-dark transition-colors"
                                 >
                                    Gerenciar Conteúdo
                                 </button>
                                 <button
                                    onClick={() => handleDeleteChapter(chapter.id)}
                                    className="size-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors"
                                 >
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                 </button>
                              </div>
                           ))}

                           {chapters.length === 0 && !loading && (
                              <div className="text-center py-10 text-gray-400 flex flex-col items-center gap-4">
                                 <span className="material-symbols-outlined text-4xl opacity-20">folder_open</span>
                                 <div>
                                    <p>Nenhum módulo criado ainda.</p>
                                    <p className="text-xs">Crie módulos para organizar o conteúdo da disciplina.</p>
                                 </div>
                                 <button onClick={() => setShowChapterModal(true)} className="bg-primary text-harven-dark text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-[16px]">add</span> Criar Primeiro Módulo
                                 </button>
                              </div>
                           )}

                           {loading && (
                              <div className="flex justify-center py-10">
                                 <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                              </div>
                           )}
                        </div>
                     </div>
                  )}

               </div>
            </div>
         </div>
      </div>
   );
};

export default DisciplineEdit;
