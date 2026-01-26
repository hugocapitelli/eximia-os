
import React, { useState, useEffect } from 'react';
import { HoshinInitiative, HoshinPerspective, InitiativeStatus, InitiativeLevel } from '../types';

interface InitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (initiative: HoshinInitiative) => void;
  onDelete?: (id: string) => void;
  initiative?: HoshinInitiative | null;
  perspectives: HoshinPerspective[];
  allInitiatives: HoshinInitiative[];
}

const InitiativeModal: React.FC<InitiativeModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  initiative, 
  perspectives,
  allInitiatives 
}) => {
  const [formData, setFormData] = useState<Partial<HoshinInitiative>>({
    title: '',
    code: '',
    owner: '',
    status: 'PLANNED',
    level: 'STRATEGIC',
    perspectiveId: perspectives[0]?.id || '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    description: '',
    iceScore: 0
  });

  const [ice, setIce] = useState({ impact: 5, confidence: 5, ease: 5 });

  useEffect(() => {
    if (initiative) {
      setFormData({ ...initiative });
    } else {
      setFormData({
        title: '',
        code: '',
        owner: '',
        status: 'PLANNED',
        level: 'STRATEGIC',
        perspectiveId: perspectives[0]?.id || '',
        startDate: new Date().toISOString().split('T')[0],
        deadline: '',
        description: '',
        parentId: null
      });
    }
    setIce({ impact: 5, confidence: 5, ease: 5 });
  }, [initiative, isOpen]);

  useEffect(() => {
    const score = ice.impact * ice.confidence * ice.ease;
    setFormData(prev => ({ ...prev, iceScore: score }));
  }, [ice]);

  const handleParentChange = (parentId: string) => {
    if (!parentId) {
      setFormData(prev => ({ ...prev, parentId: null, level: 'STRATEGIC' }));
      return;
    }
    const parent = allInitiatives.find(i => i.id === parentId);
    if (parent) {
      const newLevel: InitiativeLevel = parent.level === 'STRATEGIC' ? 'TACTICAL' : 'OPERATIONAL';
      setFormData(prev => ({
        ...prev,
        parentId,
        perspectiveId: parent.perspectiveId,
        level: newLevel
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-harven-dark/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-harven-border bg-harven-bg flex justify-between items-center">
          <h3 className="text-xl font-display font-bold text-harven-dark">
            {initiative ? 'Editar Iniciativa' : 'Nova Iniciativa Estratégica'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-harven-dark transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-1 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Código</label>
                  <input 
                    className="w-full bg-harven-bg border-none rounded-lg px-4 py-2.5 text-sm font-mono focus:ring-1 focus:ring-primary"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    placeholder="01.01"
                  />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Título da Iniciativa</label>
                  <input 
                    className="w-full bg-harven-bg border-none rounded-lg px-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-primary"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    placeholder="Ex: Expansão de Canais Digitais"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Iniciativa Pai</label>
                  <select 
                    className="w-full bg-harven-bg border-none rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.parentId || ''}
                    onChange={e => handleParentChange(e.target.value)}
                  >
                    <option value="">Nenhuma (Estratégica)</option>
                    {allInitiatives.filter(i => i.level !== 'OPERATIONAL' && i.id !== initiative?.id).map(i => (
                      <option key={i.id} value={i.id}>{i.code} - {i.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Responsável</label>
                  <input 
                    className="w-full bg-harven-bg border-none rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.owner}
                    onChange={e => setFormData({...formData, owner: e.target.value})}
                    placeholder="Nome do owner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Perspectiva</label>
                  <select 
                    className="w-full bg-harven-bg border-none rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary disabled:opacity-50"
                    value={formData.perspectiveId}
                    onChange={e => setFormData({...formData, perspectiveId: e.target.value})}
                    disabled={!!formData.parentId}
                  >
                    {perspectives.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Prazo</label>
                  <input 
                    type="date"
                    className="w-full bg-harven-bg border-none rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary"
                    value={formData.deadline}
                    onChange={e => setFormData({...formData, deadline: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                  <select 
                    className="w-full bg-harven-bg border-none rounded-lg px-4 py-2.5 text-sm font-bold focus:ring-1 focus:ring-primary"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as InitiativeStatus})}
                  >
                    <option value="PLANNED">Planejada</option>
                    <option value="ON_TRACK">Conforme</option>
                    <option value="ATTENTION">Atenção</option>
                    <option value="CRITICAL">Crítico</option>
                    <option value="DONE">Concluída</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Descrição</label>
                <textarea 
                  className="w-full bg-harven-bg border-none rounded-lg px-4 py-3 text-sm min-h-[100px] focus:ring-1 focus:ring-primary resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Detalhes da execução..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-harven-bg rounded-2xl p-6 border border-harven-border shadow-inner">
                <h4 className="text-xs font-black text-harven-gold uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">bolt</span> Priorização ICE
                </h4>
                <div className="space-y-6">
                  {[
                    { key: 'impact', label: 'Impacto', color: 'bg-primary' },
                    { key: 'confidence', label: 'Confiança', color: 'bg-blue-400' },
                    { key: 'ease', label: 'Facilidade', color: 'bg-green-400' }
                  ].map(metric => (
                    <div key={metric.key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{metric.label}</span>
                        <span className="text-sm font-black text-harven-dark">{(ice as any)[metric.key]}</span>
                      </div>
                      <input 
                        type="range" min="1" max="10" 
                        className="w-full accent-harven-dark"
                        value={(ice as any)[metric.key]}
                        onChange={e => setIce({...ice, [metric.key]: parseInt(e.target.value)})}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-white/20 flex flex-col items-center">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">ICE SCORE</span>
                  <span className="text-4xl font-display font-black text-harven-dark">{formData.iceScore}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-harven-border bg-harven-bg flex justify-between items-center">
          {initiative && onDelete ? (
            <button 
              onClick={() => { if(confirm('Excluir?')) onDelete(initiative.id); }}
              className="text-red-500 hover:text-red-600 text-xs font-bold uppercase flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span> Excluir
            </button>
          ) : <div />}
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-harven-border text-xs font-bold text-gray-500 hover:bg-white transition-all uppercase">Cancelar</button>
            <button 
              onClick={() => onSave(formData as HoshinInitiative)}
              className="px-8 py-2.5 bg-primary hover:bg-primary-dark text-harven-dark font-bold rounded-xl text-sm shadow-xl shadow-primary/20 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
              Salvar Iniciativa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InitiativeModal;
