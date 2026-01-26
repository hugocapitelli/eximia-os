import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useUserStats } from '../hooks/useUser';
import { useActiveLoans } from '../hooks/useLoans';
import { ArrowLeft, BookOpen, TrendingUp, Clock, Loader, Calendar } from 'lucide-react';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, loading: loadingUser } = useUser();
    const { stats, loading: loadingStats } = useUserStats();
    const { loans, loading: loadingLoans } = useActiveLoans();

    if (loadingUser || loadingStats) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="w-12 h-12 animate-spin text-primary" />
                    <p className="text-slate-600 dark:text-slate-400">Carregando perfil...</p>
                </div>
            </main>
        );
    }

    if (!user) {
        return (
            <main className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Perfil não encontrado</p>
                    <button onClick={() => navigate('/')} className="text-primary hover:underline">
                        Voltar para a biblioteca
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 px-4 md:px-10 lg:px-40 py-8 w-full max-w-[1400px] mx-auto">
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

            {/* Profile Header */}
            <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-[#2a3441] p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Avatar */}
                    <div
                        className="w-24 h-24 rounded-full bg-center bg-cover shadow-lg"
                        style={{ backgroundImage: user.avatar_url ? `url("${user.avatar_url}")` : 'none' }}
                    >
                        {!user.avatar_url && (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                                {user.name.substring(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{user.name}</h1>
                        <p className="text-slate-600 dark:text-slate-400 mb-1">{user.email}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-500">
                            Membro desde {user.member_since}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3441] p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <BookOpen className="text-green-500" size={24} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Livros Lidos</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.booksRead}</p>
                </div>

                <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3441] p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <TrendingUp className="text-blue-500" size={24} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Lendo Agora</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.readingNow}</p>
                </div>

                <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3441] p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Clock className="text-purple-500" size={24} />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Tempo Médio</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.avgTime}</p>
                </div>
            </div>

            {/* Active Loans */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-primary rounded-full"></span>
                    Empréstimos Ativos
                </h2>

                {loadingLoans ? (
                    <div className="flex justify-center py-8">
                        <Loader className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : loans.length === 0 ? (
                    <div className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3441] p-8 text-center">
                        <p className="text-slate-500 dark:text-slate-400">Nenhum empréstimo ativo no momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loans.map((loan: any) => (
                            <div
                                key={loan.id}
                                className="bg-white dark:bg-[#1a2332] rounded-xl border border-slate-200 dark:border-[#2a3441] p-5 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => navigate(`/books/${loan.book_id}`)}
                            >
                                <div className="flex items-start gap-3">
                                    {loan.books?.cover_url && (
                                        <div
                                            className="w-12 h-16 rounded bg-cover bg-center flex-shrink-0"
                                            style={{ backgroundImage: `url("${loan.books.cover_url}")` }}
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 mb-1">
                                            {loan.books?.title || 'Livro'}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                                            Emprestado para: {loan.person_name}
                                        </p>
                                        {loan.due_date && (
                                            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                                                <Calendar size={12} />
                                                <span>Devolução: {new Date(loan.due_date).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default Profile;
