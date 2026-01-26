import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';

const LabelExport: React.FC = () => {
    const navigate = useNavigate();

    return (
        <main className="flex-1 px-4 md:px-10 lg:px-40 py-8 w-full max-w-[1400px] mx-auto">
            <div className="mb-8">
                <button
                    onClick={() => navigate('/')}
                    className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={18} />
                    Voltar para a biblioteca
                </button>
            </div>

            <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
                    <Printer className="text-slate-400" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
                    Central de Etiquetas
                </h1>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Recurso em desenvolvimento. Em breve você poderá imprimir etiquetas para seus livros.
                </p>
            </div>
        </main>
    );
};

export default LabelExport;