import React, { useContext } from 'react';
import { PERSONAL_DEVELOPMENT } from '../constants';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown, CheckCircle, Tag, Filter, Grid, List, MoreHorizontal, User } from 'lucide-react';
import { SearchContext } from '../App';

const CategoryView: React.FC = () => {
  const navigate = useNavigate();
  const { searchQuery } = useContext(SearchContext);

  const filteredBooks = searchQuery 
    ? PERSONAL_DEVELOPMENT.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : PERSONAL_DEVELOPMENT;

  return (
    <main className="flex-1 px-4 py-6 md:px-10 lg:px-20 max-w-[1440px] mx-auto w-full">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-medium text-sm transition hover:bg-primary-hover">
                    <ArrowUpDown size={18} /> Sort by Title
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#232f48] text-slate-900 dark:text-white border border-slate-200 dark:border-transparent font-medium text-sm transition hover:bg-slate-50 dark:hover:bg-[#2d3b55]">
                    <CheckCircle size={18} /> Sort by Status
                </button>
                 <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#232f48] text-slate-900 dark:text-white border border-slate-200 dark:border-transparent font-medium text-sm transition hover:bg-slate-50 dark:hover:bg-[#2d3b55]">
                    <Tag size={18} /> Sort by Tags
                </button>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-[#232f48] text-slate-900 dark:text-white border border-slate-200 dark:border-transparent font-medium text-sm transition hover:bg-slate-50 dark:hover:bg-[#2d3b55]">
                    <Filter size={18} /> Filter
                </button>
                 <button className="flex items-center justify-center size-9 rounded-lg bg-white dark:bg-[#232f48] border border-slate-200 dark:border-transparent text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#2d3b55]">
                    <Grid size={20} />
                </button>
                 <button className="flex items-center justify-center size-9 rounded-lg bg-transparent text-slate-500 dark:text-[#92a4c9] hover:bg-slate-100 dark:hover:bg-[#232f48]">
                    <List size={20} />
                </button>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredBooks.map((book) => (
                <div key={book.id} className="group relative flex flex-col gap-3">
                    <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-sm group-hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>
                        <div 
                            className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-300 group-hover:scale-105" 
                            style={{ backgroundImage: `url("${book.coverUrl}")` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                         <button className="absolute bottom-3 right-3 size-8 bg-primary rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg hover:bg-primary-hover">
                            <MoreHorizontal size={18} />
                        </button>
                    </div>
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-slate-900 dark:text-white text-base font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/books/${book.id}`)}>{book.title}</h3>
                        </div>
                        <p className="text-slate-500 dark:text-[#92a4c9] text-sm font-normal leading-normal mb-2">{book.author}</p>
                        
                        {/* Status Chip */}
                        <div className="flex items-center gap-2">
                            {book.status === 'available' ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                                    <span className="size-1.5 rounded-full bg-green-600 dark:bg-green-400"></span>
                                    Disponível
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                                    <User size={12} />
                                    Com {book.loanedTo}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Add New Placeholder - Show only if not searching or if relevant */}
            {!searchQuery && (
            <div className="flex flex-col gap-3 group cursor-pointer">
                <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg border-2 border-dashed border-slate-200 dark:border-[#232f48] flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <span className="text-2xl">+</span>
                    </div>
                    <p className="text-sm font-medium text-primary">Add New Book</p>
                </div>
            </div>
            )}
        </div>
    </main>
  );
};

export default CategoryView;