import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { Search, X, Camera, ArrowRight, ChevronRight, ImageOff, Building2, Barcode, Calendar } from 'lucide-react';
import ManualEntryModal from './ManualEntryModal';

interface AddBookModalProps {
  onClose: () => void;
}

const AddBookModal: React.FC<AddBookModalProps> = ({ onClose }) => {
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  if (isManualEntryOpen) {
    return <ManualEntryModal onClose={() => setIsManualEntryOpen(false)} onBack={() => setIsManualEntryOpen(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl overflow-hidden border dark:border-slate-700 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b dark:border-slate-700/50">
          <h3 className="text-slate-900 dark:text-white tracking-tight text-xl font-bold leading-tight">CADASTRAR NOVO LIVRO</h3>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            
            {/* Search Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Buscar por título, autor ou ISBN</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-slate-400" size={20} />
                  </div>
                  <input 
                    className="block w-full rounded-lg border-slate-300 dark:border-none bg-slate-50 dark:bg-[#232f48] text-slate-900 dark:text-white pl-10 pr-10 py-3 text-base focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-400 transition-shadow shadow-sm" 
                    placeholder="Digite o nome do livro..." 
                    type="text" 
                    defaultValue="Hábitos Atômicos"
                  />
                  <button className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-3 sm:py-0 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary hover:border-primary/30 transition-all shadow-sm whitespace-nowrap group">
                    <Camera className="text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors" size={20} />
                    <span className="text-sm font-bold">Tirar Foto</span>
                    </button>
                    <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg px-6 bg-primary hover:bg-primary-hover text-white text-base font-bold transition-colors shadow-lg shadow-primary/20">
                        Buscar
                    </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resultados da Busca</h4>
              
              {/* Result 1 (Best Match) */}
              <div className="group relative flex flex-col sm:flex-row p-4 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors gap-5">
                <div className="flex-shrink-0 w-24 h-36 rounded-lg overflow-hidden shadow-md bg-slate-800">
                  <img src={IMAGES.atomicHabits} alt="Atomic Habits" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col flex-1 min-w-0 justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h5 className="text-lg font-bold text-slate-900 dark:text-white leading-snug truncate pr-2">Hábitos Atômicos</h5>
                      <span className="inline-flex items-center rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-500 ring-1 ring-inset ring-green-500/20 whitespace-nowrap">Melhor Resultado</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">James Clear</p>
                    <div className="mt-3 flex flex-wrap gap-y-1 gap-x-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Building2 size={12} />
                        <span>Editora Alta Life</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Barcode size={12} />
                        <span>978-8550807560</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>2019</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 pt-4 flex items-center justify-end">
                    <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all">
                      <span>Selecionar Este</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Result 2 (Generic) */}
              <div className="flex flex-col sm:flex-row p-4 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-5 opacity-70 hover:opacity-100">
                <div className="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-slate-800 opacity-80">
                  <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-slate-500">
                    <ImageOff size={24} />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-w-0 justify-center">
                  <h5 className="text-base font-semibold text-slate-900 dark:text-white leading-snug">Resumo: Hábitos Atômicos</h5>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Book Summary Publishing</p>
                  <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-slate-500 dark:text-slate-500">
                    <span>Kindle Edition</span>
                    <span>ASIN: B08...</span>
                  </div>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center justify-end">
                  <button className="text-sm font-medium text-primary hover:text-primary-hover px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors">
                      Selecionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 flex justify-between items-center">
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors">
            Não encontrou o livro?
          </button>
          <button 
            onClick={() => setIsManualEntryOpen(true)}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
          >
            <span>Cadastro Manual</span>
            <ChevronRight size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddBookModal;