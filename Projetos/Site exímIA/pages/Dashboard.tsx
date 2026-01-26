import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { READING_NOW, RECENTLY_ADDED, PERSONAL_DEVELOPMENT, BUSINESS_BOOKS } from '../constants';
import { BookOpen, TrendingUp, Brain } from 'lucide-react';
import { SearchContext } from '../App';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery } = useContext(SearchContext);

  // Helper function to filter books
  const filterBooks = (books: typeof READING_NOW) => {
    if (!searchQuery) return books;
    const lowerQuery = searchQuery.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) || 
      book.author.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredReadingNow = filterBooks(READING_NOW);
  const filteredRecentlyAdded = filterBooks(RECENTLY_ADDED);
  const filteredPersonalDev = filterBooks(PERSONAL_DEVELOPMENT);
  const filteredBusiness = filterBooks(BUSINESS_BOOKS);

  // If search is active, show flat list of all matches or keep sections? 
  // Keeping sections is better for context unless results are scarce.
  // For simplicity, we hide sections if they become empty due to filter.

  return (
    <main className="flex-1 px-4 md:px-10 lg:px-40 py-8 w-full max-w-[1600px] mx-auto pb-32">
      
      {/* SECTION: LENDO AGORA */}
      {filteredReadingNow.length > 0 && (
      <div className="mb-12">
        <div className="flex items-center justify-between px-2 pb-4 pt-2">
          <h2 className="text-slate-900 dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] uppercase">Lendo Agora ({filteredReadingNow.length})</h2>
          <button className="text-sm font-medium text-primary hover:text-primary-hover transition-colors">View All</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
          {filteredReadingNow.map((book) => (
            <div 
              key={book.id} 
              onClick={() => navigate(`/books/${book.id}`)}
              className="group flex flex-col gap-3 relative rounded-xl bg-white dark:bg-[#1a2332] p-4 shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-none cursor-pointer"
            >
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg">
                <div 
                  className="w-full h-full bg-center bg-no-repeat bg-cover transform group-hover:scale-105 transition-transform duration-500" 
                  style={{ backgroundImage: `url("${book.coverUrl}")` }}
                ></div>
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-md px-2 py-1 flex items-center gap-1">
                  <BookOpen size={14} className="text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">Reading</span>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-700">
                  <div className="h-full bg-primary" style={{ width: `${book.progress}%` }}></div>
                </div>
              </div>
              <div>
                <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight mb-1">{book.title}</h3>
                <p className="text-slate-500 dark:text-[#92a4c9] text-sm font-normal leading-normal">with Hugo • {book.addedDate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* SECTION: RECÉM ADICIONADOS */}
      {filteredRecentlyAdded.length > 0 && (
      <div className="mb-10">
        <h2 className="text-slate-900 dark:text-white text-[18px] font-bold leading-tight tracking-[-0.015em] px-2 pb-4 pt-2 uppercase opacity-90">Recém Adicionados</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
          {filteredRecentlyAdded.map((book) => (
             <div key={book.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
               <div 
                  className="w-full aspect-[2/3] bg-center bg-no-repeat bg-cover rounded-lg shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all" 
                  style={{ backgroundImage: `url("${book.coverUrl}")` }}
               ></div>
             </div>
          ))}
        </div>
      </div>
      )}

      {/* SECTION: DESENVOLVIMENTO PESSOAL */}
      {filteredPersonalDev.length > 0 && (
      <div className="mb-10">
         <div 
            className="flex items-center gap-2 px-2 pb-4 pt-2 cursor-pointer group"
            onClick={() => navigate('/category/personal-development')}
        >
            <Brain size={24} className="text-primary group-hover:text-primary-hover transition-colors" />
            <h2 className="text-slate-900 dark:text-white text-[18px] font-bold leading-tight tracking-[-0.015em] uppercase opacity-90 group-hover:text-primary transition-colors">Desenvolvimento Pessoal</h2>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {filteredPersonalDev.slice(0, 5).map((book) => (
                <div key={book.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                    <div 
                        className="w-full aspect-[2/3] bg-center bg-no-repeat bg-cover rounded-lg shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all" 
                        style={{ backgroundImage: `url("${book.coverUrl}")` }}
                    ></div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{book.title}</p>
                </div>
            ))}
         </div>
      </div>
      )}

       {/* SECTION: NEGÓCIOS & ESTRATÉGIA */}
       {filteredBusiness.length > 0 && (
       <div className="mb-10">
         <div className="flex items-center gap-2 px-2 pb-4 pt-2">
            <TrendingUp size={24} className="text-primary" />
            <h2 className="text-slate-900 dark:text-white text-[18px] font-bold leading-tight tracking-[-0.015em] uppercase opacity-90">Negócios & Estratégia</h2>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {filteredBusiness.map((book) => (
                <div key={book.id} className="flex flex-col gap-2 group cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                    <div 
                        className="w-full aspect-[2/3] bg-center bg-no-repeat bg-cover rounded-lg shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all" 
                        style={{ backgroundImage: `url("${book.coverUrl}")` }}
                    ></div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{book.title}</p>
                </div>
            ))}
         </div>
      </div>
      )}

      {/* No Results Message */}
      {searchQuery && 
       !filteredReadingNow.length && 
       !filteredRecentlyAdded.length && 
       !filteredPersonalDev.length && 
       !filteredBusiness.length && (
         <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl font-bold text-slate-700 dark:text-slate-300">Nenhum livro encontrado</p>
            <p className="text-slate-500">Tente buscar por outro termo.</p>
         </div>
      )}

    </main>
  );
};

export default Dashboard;