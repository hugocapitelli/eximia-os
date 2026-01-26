import React, { useState } from 'react';
import { IMAGES } from '../constants';
import { X, CheckCircle, Check, Plus } from 'lucide-react';
import AddPersonModal from './AddPersonModal';

interface BorrowModalProps {
  onClose: () => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({ onClose }) => {
  const [isAddPersonOpen, setIsAddPersonOpen] = useState(false);

  if (isAddPersonOpen) {
      return <AddPersonModal onClose={() => setIsAddPersonOpen(false)} onBack={() => setIsAddPersonOpen(false)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-background-dark border border-[#2a3441] w-full max-w-[560px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a3441]">
          <div>
            <h2 className="text-white text-xl font-bold tracking-tight">PEGAR EMPRESTADO</h2>
            <p className="text-slate-400 text-sm font-normal mt-1">Registre o empréstimo deste livro.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-[#2a3441]">
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto px-6 py-4 flex flex-col gap-6">
            {/* Selected Book */}
            <div className="flex items-center gap-4 bg-[#1a2332] p-4 rounded-xl border border-[#2a3441]">
                <div 
                    className="bg-center bg-no-repeat bg-cover rounded-lg w-14 h-[84px] shadow-sm flex-shrink-0" 
                    style={{ backgroundImage: `url("${IMAGES.atomicHabits}")` }}
                ></div>
                <div className="flex flex-col justify-center flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/20 text-primary-hover uppercase tracking-wider">Livro Selecionado</span>
                    </div>
                    <p className="text-white text-lg font-medium leading-tight line-clamp-1">Hábitos Atômicos</p>
                    <p className="text-slate-400 text-sm font-normal leading-normal line-clamp-1">James Clear</p>
                </div>
                <button className="text-primary hover:text-primary-hover text-sm font-medium px-3 py-2">Alterar</button>
            </div>

            {/* User Selection */}
            <div>
                <h3 className="text-white text-base font-bold leading-tight px-1 pb-3">Quem vai levar?</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    
                    {/* User 1 (Selected) */}
                    <div className="group relative cursor-pointer">
                        <input type="radio" name="user" id="user-hugo" className="peer sr-only" defaultChecked />
                        <label htmlFor="user-hugo" className="flex flex-col items-center gap-2 p-3 rounded-xl border border-primary bg-primary/10 ring-1 ring-primary transition-all cursor-pointer h-full">
                            <div className="relative">
                                <div className="w-14 h-14 bg-center bg-no-repeat bg-cover rounded-full ring-2 ring-primary" style={{ backgroundImage: `url("${IMAGES.profile}")` }}></div>
                                <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5 shadow-sm flex items-center justify-center">
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-white text-sm font-medium leading-snug">Hugo</p>
                                <p className="text-primary-hover text-xs font-medium">0 livros</p>
                            </div>
                        </label>
                    </div>

                    {/* Other Users */}
                    {[
                        {name: 'Ana', books: 1, color: 'grayscale opacity-80'},
                        {name: 'João', books: 3, color: 'grayscale opacity-80'},
                        {name: 'Maria', books: 0, color: 'grayscale opacity-80'},
                    ].map((user, idx) => (
                        <div key={idx} className="group relative cursor-pointer">
                            <input type="radio" name="user" id={`user-${user.name}`} className="peer sr-only" />
                            <label htmlFor={`user-${user.name}`} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#2a3441] bg-[#1a2332] hover:bg-[#253042] hover:border-[#3f4a5a] transition-all cursor-pointer h-full peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:ring-1 peer-checked:ring-primary">
                                <div className={`w-14 h-14 bg-center bg-no-repeat bg-cover rounded-full group-hover:grayscale-0 group-hover:opacity-100 transition-all ${user.color}`} style={{ backgroundImage: `url("https://i.pravatar.cc/150?u=${user.name}")` }}></div>
                                <div className="text-center">
                                    <p className="text-slate-400 group-hover:text-white text-sm font-medium leading-snug transition-colors">{user.name}</p>
                                    <p className="text-slate-500 group-hover:text-slate-400 text-xs font-normal transition-colors">{user.books} livro{user.books !== 1 && 's'}</p>
                                </div>
                            </label>
                        </div>
                    ))}

                    {/* Add Person Button */}
                     <div className="group relative cursor-pointer">
                        <button 
                            onClick={() => setIsAddPersonOpen(true)}
                            className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#3f4a5a] bg-transparent hover:bg-[#253042] hover:border-primary/50 transition-all cursor-pointer h-full w-full group"
                        >
                            <div className="w-14 h-14 rounded-full bg-[#1a2332] border border-[#3f4a5a] flex items-center justify-center group-hover:border-primary/50 group-hover:bg-[#1a2332] transition-all">
                                <Plus className="text-slate-400 group-hover:text-primary transition-colors" size={24} />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-400 group-hover:text-primary text-sm font-medium leading-snug transition-colors">Adicionar Pessoa</p>
                            </div>
                        </button>
                    </div>

                </div>
            </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 pt-4 border-t border-[#2a3441] bg-[#111722] flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-auto">
            <button onClick={onClose} className="w-full sm:w-auto px-6 py-3 rounded-lg border border-[#2a3441] text-slate-400 text-sm font-medium hover:text-white hover:bg-[#1a2332] transition-colors">
                Cancelar
            </button>
            <button onClick={onClose} className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/30 transition-all flex items-center justify-center gap-2">
                <CheckCircle size={18} />
                Confirmar Empréstimo
            </button>
        </div>
      </div>
    </div>
  );
};

export default BorrowModal;