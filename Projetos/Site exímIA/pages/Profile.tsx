import React from 'react';
import { CURRENT_USER, READING_NOW, IMAGES } from '../constants';
import { Library, BookOpen, Timer, Plus } from 'lucide-react';

const Profile: React.FC = () => {
  // Mock Loaned data cards specifically for the profile view
  const loanedBooks = [
      { id: '101', title: "O Design do Dia a Dia", cover: IMAGES.designEveryday, status: "Atrasado", color: "bg-red-500", text: "Atrasado" },
      { id: '102', title: "Estruturas de Dados", cover: IMAGES.dataStructures, status: "Devolve hoje", color: "bg-orange-500", text: "Devolve hoje" },
      { id: '103', title: "1984", cover: IMAGES.nineteenEightyFour, status: "2 dias", color: "bg-primary", text: "2 dias" },
      { id: '104', title: "Duna", cover: IMAGES.dune, status: "5 dias", color: "bg-primary", text: "5 dias" },
      { id: '105', title: "Hábitos Atômicos", cover: IMAGES.atomicHabits, status: "1 semana", color: "bg-green-600", text: "1 semana" },
      { id: '106', title: "O Hobbit", cover: IMAGES.hobbit, status: "Renovado", color: "bg-blue-400", text: "Renovado" },
  ];

  return (
    <main className="px-5 md:px-20 xl:px-40 flex flex-1 justify-center py-5">
      <div className="flex flex-col max-w-[960px] flex-1">
         {/* Profile Header */}
         <div className="flex p-4 w-full flex-col gap-4 items-center mb-8">
            <div className="flex gap-4 flex-col items-center">
                 <div 
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full min-h-32 w-32 shadow-xl border-4 border-white dark:border-[#232f48]" 
                    style={{ backgroundImage: `url("${CURRENT_USER.avatarUrl}")` }}
                ></div>
                <div className="flex flex-col items-center justify-center">
                    <p className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em] text-center">{CURRENT_USER.name}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                        <p className="text-slate-500 dark:text-[#92a4c9] text-base font-normal leading-normal text-center">{CURRENT_USER.email}</p>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-500 dark:bg-[#92a4c9]"></span>
                        <p className="text-slate-500 dark:text-[#92a4c9] text-base font-normal leading-normal text-center">Membro desde {CURRENT_USER.memberSince}</p>
                    </div>
                </div>
            </div>
         </div>

         {/* Stats Section */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 mb-8">
            <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#232f48] shadow-sm border border-slate-200 dark:border-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Library size={24} />
                    </div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Livros Lidos</p>
                </div>
                <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight mt-2">{CURRENT_USER.stats.booksRead}</p>
            </div>
             <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#232f48] shadow-sm border border-slate-200 dark:border-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <BookOpen size={24} />
                    </div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Lendo Agora</p>
                </div>
                <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight mt-2">{CURRENT_USER.stats.readingNow}</p>
            </div>
             <div className="flex flex-1 flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#232f48] shadow-sm border border-slate-200 dark:border-transparent">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Timer size={24} />
                    </div>
                    <p className="text-slate-900 dark:text-white text-base font-medium leading-normal">Tempo Médio</p>
                </div>
                <p className="text-slate-900 dark:text-white tracking-light text-3xl font-bold leading-tight mt-2">{CURRENT_USER.stats.avgTime}</p>
            </div>
         </div>

         {/* Loaned Books Section */}
         <div className="flex flex-col mb-8">
             <div className="flex items-center justify-between px-4 pb-3">
                 <h2 className="text-slate-900 dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em]">LIVROS EMPRESTADOS</h2>
                 <a href="#" className="text-primary text-sm font-medium hover:underline">Ver todos</a>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4">
                 {loanedBooks.map(book => (
                     <div key={book.id} className="group relative cursor-pointer overflow-hidden rounded-xl aspect-[2/3] shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" 
                            style={{ backgroundImage: `url("${book.cover}")` }}
                        ></div>
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                             <div className={`${book.color}/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded w-fit mb-1`}>
                                 {book.text}
                             </div>
                             <p className="text-white text-sm font-bold line-clamp-2">{book.title}</p>
                         </div>
                     </div>
                 ))}
             </div>
         </div>

         {/* Favorite Tags Section */}
         <div className="flex flex-col">
             <h2 className="text-slate-900 dark:text-white text-[20px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3">TAGS FAVORITAS</h2>
             <div className="flex flex-wrap gap-3 p-4">
                 {["Ficção Científica", "Tecnologia", "Design", "História", "Biografia", "Psicologia"].map(tag => (
                     <span key={tag} className="px-4 py-2 rounded-full bg-white dark:bg-[#232f48] border border-slate-200 dark:border-transparent text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-[#2f3e5e] cursor-pointer transition-colors">
                         {tag}
                     </span>
                 ))}
                 <button className="px-4 py-2 rounded-full bg-transparent border border-dashed border-slate-500 dark:border-[#92a4c9] text-slate-500 dark:text-[#92a4c9] text-sm font-medium hover:border-primary hover:text-primary cursor-pointer transition-colors flex items-center gap-1">
                     <Plus size={16} /> Adicionar tag
                 </button>
             </div>
         </div>

      </div>
    </main>
  );
};

export default Profile;
