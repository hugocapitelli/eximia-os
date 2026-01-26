import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBook } from '../hooks/useBooks';
import { useLoanHistory } from '../hooks/useLoans';
import { ArrowLeft, BookOpen, Edit, QrCode, MapPin, Star, Quote, Loader } from 'lucide-react';
import BorrowModal from '../modals/BorrowModal';

const BookDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);

    // Fetch book data and loan history
    const { book, loading: loadingBook, error: errorBook } = useBook(id);
    const { loans, loading: loadingLoans } = useLoanHistory(id);

    if (loadingBook) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-slate-600 dark:text-slate-400">Carregando livro...</p>
                </div>
            </main>
        );
    }

    if (errorBook || !book) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Livro não encontrado</p>
                    <button onClick={() => navigate('/')} className="text-primary hover:underline">
                        Voltar para a biblioteca
                    </button>
                </div>
            </main>
        );
    }

    const getStatusBadge = () => {
        const statusConfig = {
            available: { color: 'green', label: 'Disponível', animated: true },
            loaned: { color: 'orange', label: 'Emprestado', animated: false },
            reading: { color: 'blue', label: 'Lendo', animated: true },
            overdue: { color: 'red', label: 'Atrasado', animated: false },
        };

        const config = statusConfig[book.status] || statusConfig.available;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-${config.color}-500/20 backdrop-blur-md border border-${config.color}-500/30 text-${config.color}-700 dark:text-${config.color}-300 text-xs font-bold uppercase tracking-wider shadow-sm`}>
                {config.animated && <span className={`w-2 h-2 rounded-full bg-${config.color}-500 animate-pulse`}></span>}
                {config.label}
            </span>
        );
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
                                style={{ backgroundImage: `url("${book.cover_url}")` }}
                            ></div>
                            <div className="absolute top-4 left-4">{getStatusBadge()}</div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex flex-col gap-3 mt-4">
                            <button
                                onClick={() => setIsBorrowModalOpen(true)}
                                disabled={book.status === 'loaned' || book.status === 'reading'}
                                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-lg shadow-primary/20"
                            >
                                <BookOpen size={20} />
                                {book.status === 'loaned' ? 'Emprestado' : book.status === 'reading' ? 'Lendo' : 'Pegar Emprestado'}
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
                                {book.isbn && (
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">ISBN</span>
                                        <span className="text-slate-900 dark:text-slate-200 font-medium">{book.isbn}</span>
                                    </div>
                                )}
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Categoria</span>
                                    <span className="text-slate-900 dark:text-slate-200 font-medium">{book.category || 'Sem categoria'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Adicionado em</span>
                                    <span className="text-slate-900 dark:text-slate-200 font-medium">
                                        {new Date(book.added_date).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden lg:flex items-center gap-4">
                                <button
                                    onClick={() => setIsBorrowModalOpen(true)}
                                    disabled={book.status === 'loaned' || book.status === 'reading'}
                                    className="flex items-center justify-center gap-2 bg-primary hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-primary/25 active:scale-95"
                                >
                                    <BookOpen size={20} />
                                    {book.status === 'loaned' ? 'Emprestado' : book.status === 'reading' ? 'Lendo' : 'Pegar Emprestado'}
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

                        {/* Notes */}
                        {book.notes && (
                            <section>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                                    Notas
                                </h3>
                                <div className="bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3441] p-6 rounded-xl shadow-sm">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{book.notes}</p>
                                </div>
                            </section>
                        )}

                        {/* Review & Rating */}
                        {book.rating && (
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3441] p-6 rounded-xl shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Avaliação</h3>
                                        <div className="flex items-center gap-1 mb-6">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={24}
                                                    className={star <= book.rating! ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 dark:text-slate-600'}
                                                />
                                            ))}
                                            <span className="ml-2 text-slate-900 dark:text-white font-bold text-lg">{book.rating.toFixed(1)}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* History */}
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="w-1 h-5 bg-primary rounded-full"></span>
                                    Histórico de Empréstimos
                                </h3>
                            </div>

                            {loadingLoans ? (
                                <div className="flex justify-center py-8">
                                    <Loader className="w-8 h-8 animate-spin text-primary" />
                                </div>
                            ) : loans.length === 0 ? (
                                <div className="bg-white dark:bg-[#1a2332] border border-slate-200 dark:border-[#2a3441] rounded-xl p-8 text-center">
                                    <p className="text-slate-500 dark:text-slate-400">Nenhum empréstimo registrado ainda.</p>
                                </div>
                            ) : (
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
                                                {loans.map((loan, idx) => (
                                                    <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                                                            {new Date(loan.loan_date).toLocaleDateString('pt-BR')}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className={`size-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${idx % 3 === 0 ? 'bg-indigo-500' : idx % 3 === 1 ? 'bg-pink-500' : 'bg-gray-500'
                                                                    }`}>
                                                                    {loan.person_initials}
                                                                </div>
                                                                <span className="text-slate-900 dark:text-white">{loan.person_name}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                                                            {loan.return_date ? new Date(loan.return_date).toLocaleDateString('pt-BR') : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${loan.status === 'returned'
                                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                                                                        : loan.status === 'active'
                                                                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800'
                                                                            : 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                                                                    }`}
                                                            >
                                                                {loan.status === 'returned' ? 'Devolvido' : loan.status === 'active' ? 'Ativo' : 'Arquivado'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            {isBorrowModalOpen && <BorrowModal bookId={book.id} bookTitle={book.title} onClose={() => setIsBorrowModalOpen(false)} />}
        </>
    );
};

export default BookDetail;
