import React from 'react';
import { X, ChevronLeft, Upload } from 'lucide-react';

interface ManualEntryModalProps {
  onClose: () => void;
  onBack?: () => void;
}

const ManualEntryModal: React.FC<ManualEntryModalProps> = ({ onClose, onBack }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border dark:border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b dark:border-slate-700/50">
          <div className="flex items-center gap-3">
             {onBack && (
                <button onClick={onBack} className="text-slate-500 hover:text-primary transition-colors">
                    <ChevronLeft size={24} />
                </button>
             )}
             <h3 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight">CADASTRO MANUAL</h3>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6">
            <form className="flex flex-col gap-6">
                
                {/* Cover Upload */}
                <div className="flex justify-center">
                    <div className="w-32 h-48 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                        <Upload size={24} className="text-slate-400 group-hover:text-primary mb-2" />
                        <span className="text-xs text-slate-500 group-hover:text-primary font-medium">Adicionar Capa</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Título</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Ex: O Hobbit"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Autor</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Ex: J.R.R. Tolkien"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Editora</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="Ex: HarperCollins"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
                         <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white">
                            <option>Fantasia</option>
                            <option>Ficção Científica</option>
                            <option>Biografia</option>
                            <option>Negócios</option>
                            <option>Desenvolvimento Pessoal</option>
                         </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Número de Páginas</label>
                        <input 
                            type="number" 
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="0"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">ISBN (Opcional)</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400"
                            placeholder="000-0000000000"
                        />
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sinopse / Notas</label>
                    <textarea 
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#232f48] border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 min-h-[100px]"
                        placeholder="Escreva uma breve descrição..."
                    ></textarea>
                </div>
            </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                Cancelar
            </button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-colors">
                Salvar Livro
            </button>
        </div>

      </div>
    </div>
  );
};

export default ManualEntryModal;