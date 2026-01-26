import React, { useState } from 'react';
import { X, CheckCircle, Loader, Calendar } from 'lucide-react';
import { loanService } from '../services/loanService';

interface BorrowModalProps {
    bookId: string;
    bookTitle: string;
    onClose: () => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ bookId, bookTitle, onClose }) => {
    const [personName, setPersonName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!personName.trim()) {
            setError('Por favor, informe o nome da pessoa');
            return;
        }

        try {
            setLoading(true);

            // Generate initials from name
            const initials = personName
                .trim()
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

            // Create loan
            await loanService.createLoan({
                book_id: bookId,
                person_name: personName.trim(),
                person_initials: initials,
                due_date: dueDate || null,
                status: 'active',
            });

            // Close modal and refresh page
            onClose();
            window.location.reload(); // Simple refresh to update UI
        } catch (err) {
            console.error('Error creating loan:', err);
            setError('Erro ao criar empréstimo. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate minimum date (today)
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-background-dark border dark:border-[#2a3441] w-full max-w-[480px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b dark:border-[#2a3441]">
                    <div>
                        <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">PEGAR EMPRESTADO</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-normal mt-1">Registre o empréstimo deste livro.</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#2a3441]"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleSubmit} className="flex flex-col flex-1">
                    <div className="overflow-y-auto px-6 py-6 flex flex-col gap-6">
                        {/* Selected Book Info */}
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-[#1a2332] p-4 rounded-xl border dark:border-[#2a3441]">
                            <div className="flex flex-col justify-center flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary uppercase tracking-wider">
                                        Livro Selecionado
                                    </span>
                                </div>
                                <p className="text-slate-900 dark:text-white text-lg font-medium leading-tight line-clamp-2">{bookTitle}</p>
                            </div>
                        </div>

                        {/* Person Name */}
                        <div>
                            <label htmlFor="personName" className="block text-slate-700 dark:text-white text-sm font-bold mb-2">
                                Nome da Pessoa *
                            </label>
                            <input
                                type="text"
                                id="personName"
                                value={personName}
                                onChange={(e) => setPersonName(e.target.value)}
                                placeholder="Digite o nome completo"
                                disabled={loading}
                                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-[#2a3441] bg-white dark:bg-[#1a2332] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                required
                            />
                        </div>

                        {/* Due Date */}
                        <div>
                            <label htmlFor="dueDate" className="block text-slate-700 dark:text-white text-sm font-bold mb-2">
                                Data de Devolução (Opcional)
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="dueDate"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    min={today}
                                    disabled={loading}
                                    className="w-full px-4 py-3 pl-11 rounded-lg border border-slate-300 dark:border-[#2a3441] bg-white dark:bg-[#1a2332] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                />
                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">
                                Deixe em branco se não houver prazo definido
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="p-6 pt-4 border-t dark:border-[#2a3441] bg-slate-50 dark:bg-[#111722] flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="w-full sm:w-auto px-6 py-3 rounded-lg border border-slate-300 dark:border-[#2a3441] text-slate-700 dark:text-slate-400 text-sm font-medium hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !personName.trim()}
                            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin" />
                                    Criando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Confirmar Empréstimo
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BorrowModal;