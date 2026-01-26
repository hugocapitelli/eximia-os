import React from 'react';
import { X, ChevronLeft, Upload, UserPlus } from 'lucide-react';

interface AddPersonModalProps {
  onClose: () => void;
  onBack?: () => void;
}

const AddPersonModal: React.FC<AddPersonModalProps> = ({ onClose, onBack }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-background-dark border border-[#2a3441] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#2a3441]">
          <div className="flex items-center gap-3">
             {onBack && (
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors">
                    <ChevronLeft size={24} />
                </button>
             )}
             <h3 className="text-white tracking-tight text-xl font-bold leading-tight">ADICIONAR PESSOA</h3>
          </div>
          <button onClick={onClose} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#2a3441] transition-colors text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            
            {/* Avatar Upload */}
            <div className="flex justify-center">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#3f4a5a] flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-[#1a2332] transition-colors group">
                    <Upload size={24} className="text-slate-400 group-hover:text-primary mb-1" />
                    <span className="text-[10px] text-slate-500 group-hover:text-primary font-medium">Foto</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Nome Completo</label>
                    <input 
                        type="text" 
                        className="w-full px-4 py-3 bg-[#1a2332] border border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-500"
                        placeholder="Ex: Carlos Silva"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-300">Email (Opcional)</label>
                    <input 
                        type="email" 
                        className="w-full px-4 py-3 bg-[#1a2332] border border-[#2a3441] rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-slate-500"
                        placeholder="exemplo@email.com"
                    />
                </div>
                <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                    <UserPlus className="text-primary" size={20} />
                    <p className="text-xs text-primary-hover">Esta pessoa poderá ser selecionada para empréstimos futuros.</p>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#2a3441] bg-[#111722] flex justify-end items-center gap-3">
            <button onClick={onClose} className="px-5 py-2.5 rounded-lg border border-[#2a3441] text-slate-400 font-medium hover:text-white hover:bg-[#1a2332] transition-colors">
                Cancelar
            </button>
            <button onClick={onClose} className="px-5 py-2.5 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/20 transition-colors">
                Adicionar
            </button>
        </div>

      </div>
    </div>
  );
};

export default AddPersonModal;