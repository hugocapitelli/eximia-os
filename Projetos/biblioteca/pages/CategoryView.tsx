import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import { ArrowLeft, Loader } from 'lucide-react';

const CategoryView: React.FC = () => {
    const navigate = useNavigate();
    const { id: category } = useParams();
    const { books, loading, error } = useBooks({ category });

    if (loading) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-slate-600 dark:text-slate-400">Carregando livros...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 px-4 md:px-10 lg:px-40 py-8 w-full max-w-[1600px] mx-auto">
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

            {/* Category Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    {category || 'Todos os Livros'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">{books.length} {books.length === 1 ? 'livro encontrado' : 'livros encontrados'}</p>
            </div>

            {/* Books Grid */}
            {books.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Nenhum livro nesta categoria</p>
                    <button onClick={() => navigate('/')} className="text-primary hover:underline">
                        Ver todos os livros
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            onClick={() => navigate(`/books/${book.id}`)}
                            className="flex flex-col gap-3 group cursor-pointer"
                        >
                            <div
                                className="w-full aspect-[2/3] bg-center bg-no-repeat bg-cover rounded-lg shadow-md group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300"
                                style={{ backgroundImage: `url("${book.cover_url}")` }}
                            >
                                {/* Status Badge */}
                                {book.status !== 'available' && (
                                    <div className="p-2">
                                        <span
                                            className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${book.status === 'reading'
                                                    ? 'bg-blue-500/90 text-white'
                                                    : book.status === 'loaned'
                                                        ? 'bg-orange-500/90 text-white'
                                                        : 'bg-red-500/90 text-white'
                                                }`}
                                        >
                                            {book.status === 'reading' ? 'Lendo' : book.status === 'loaned' ? 'Emprestado' : 'Atrasado'}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-primary transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{book.author}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
};

export default CategoryView;