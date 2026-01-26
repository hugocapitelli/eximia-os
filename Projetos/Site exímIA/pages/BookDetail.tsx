import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IMAGES, LOAN_HISTORY } from '../constants';
import { ArrowLeft, BookOpen, Edit, QrCode, MapPin, Star, Quote, ChevronRight } from 'lucide-react';
import BorrowModal from '../modals/BorrowModal';

const BookDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

  // Mock data for the specific "Atomic Habits" book view
  // In a real app, we would fetch based on ID.
  const book = {
      title: "Hábitos Atômicos",
      author: "James Clear",
      coverUrl: IMAGES.atomicHabits,
      publisher: "Alta Books",
      location: "Estante A",
      category: "Autoajuda",
      synopsis: 'Um método fácil e comprovado de criar bons hábitos e se livrar dos maus. Não importa seus objetivos, "Hábitos Atômicos" oferece um método eficaz para você se aprimorar — todos os dias. James Clear, um dos mais expoentes especialistas na criação de hábitos, revela as estratégias práticas que o ensinarão, exatamente, como criar bons hábitos, abandonar os maus e fazer pequenas mudanças que levarão a resultados notáveis.',
      rating: 5.0,
      tags: ["#produtividade", "#psicologia", "#autoajuda"],
      mySummary: '"Conceito fundamental sobre agregar ganhos marginais de 1%. Excelente leitura para reestruturar a rotina matinal."'
  };

  return (
    <>
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
        >
          <ArrowLeft size={18} />
          Voltar para a biblioteca
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Cover */}
        <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800 group">
                <div 
                    className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-105" 
                    style={{ backgroundImage: `url("${book.coverUrl}")` }}
                ></div>
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-700 dark:text-green-300 text-xs font-bold uppercase tracking-wider shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Disponível
                    </span>
                </div>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex flex-col gap-3 mt-4">
                 <button 
                    onClick={() => setIsBorrowModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20"
                >
                    <BookOpen size={20} />
                    Pegar Emprestado
                 </button>
                 <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-lg transition-colors">
                        <Edit size={18} />
                        Editar
                    </button>
                     <button className="flex items-center justify-center size-12 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
                        <QrCode size={20} />
                    </button>
                 </div>
            </div>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">{book.title}</h1>
                    <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium">{book.author}</p>
                </div>
                
                {/* Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 py-6 border-y border-slate-200 dark:border-[#2a3441]">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Publisher</span>
                        <span className="text-slate-900 dark:text-slate-200 font-medium">{book.publisher}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Location</span>
                        <div className="flex items-center gap-1 text-slate-900 dark:text-slate-200 font-medium">
                            <MapPin size={16} className="text-primary" />
                            {book.location}
                        </div>
                    </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Category</span>
                        <span className="text-slate-900 dark:text-slate-200 font-medium">{book.category}</span>
                    </div>
                </div>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-4">
                    <button 
                        onClick={() => setIsBorrowModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-primary/25 active:scale-95"
                    >
                        <BookOpen size={20} />
                        Pegar Emprestado
                    </button>
                    <button className="flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium py-2.5 px-6 rounded-lg transition-all active:scale-95">
                        <Edit size={18} />
                        Editar
                    </button>
                     <button className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 font-medium py-2.5 px-4 rounded-lg transition-colors ml-auto">
                        <QrCode size={20} />
                        <span className="text-sm">Imprimir QR</span>
                    </button>
                </div>
            </div>

            {/* Synopsis */}
            <section>
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                    Sinopse Oficial
                </h3>
                <div className="bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3441] p-6 rounded-xl shadow-sm">
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{book.synopsis}</p>
                </div>
            </section>

             {/* Review & Summary */}
             <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3441] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                    <div>
                         <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Avaliação</h3>
                         <div className="flex items-center gap-1 mb-6">
                             {[1,2,3,4,5].map(star => (
                                 <Star key={star} size={24} className="text-yellow-400 fill-yellow-400" />
                             ))}
                             <span className="ml-2 text-slate-900 dark:text-white font-bold text-lg">{book.rating.toFixed(1)}</span>
                         </div>
                    </div>
                    <div>
                        <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {book.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium border border-slate-200 dark:border-slate-600">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3441] p-6 rounded-xl shadow-sm relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Quote size={64} className="text-slate-500 dark:text-white rotate-12" />
                     </div>
                     <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3 relative z-10">Meu Resumo</h3>
                     <p className="text-slate-600 dark:text-slate-300 italic relative z-10">{book.mySummary}</p>
                     <button className="mt-4 text-primary text-sm font-medium hover:underline flex items-center gap-1 relative z-10">
                        Editar nota <Edit size={12} />
                     </button>
                </div>
             </section>

            {/* History */}
             <section>
                 <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                         <span className="w-1 h-5 bg-primary rounded-full"></span>
                         Histórico de Empréstimos
                     </h3>
                     <button className="text-sm text-primary hover:text-primary/80 font-medium">Ver todos</button>
                 </div>
                 <div className="bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3441] rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-[#151b28] border-b border-slate-200 dark:border-[#2a3441] text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Data Retirada</th>
                                    <th className="px-6 py-4">Quem</th>
                                    <th className="px-6 py-4">Data Devolução</th>
                                    <th className="px-6 py-4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-[#2a3441] text-sm">
                                {LOAN_HISTORY.map((loan, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">{loan.loanDate}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`size-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${idx === 0 ? 'bg-indigo-500' : idx === 1 ? 'bg-pink-500' : 'bg-gray-500'}`}>
                                                    {loan.personInitials}
                                                </div>
                                                <span className="text-slate-900 dark:text-white">{loan.personName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{loan.returnDate}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                                loan.status === 'returned' 
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                            }`}>
                                                {loan.status === 'returned' ? 'Devolvido' : 'Arquivado'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
             </section>
        </div>
      </div>
    </main>

    {isBorrowModalOpen && <BorrowModal onClose={() => setIsBorrowModalOpen(false)} />}
    </>
  );
};

export default BookDetail;
