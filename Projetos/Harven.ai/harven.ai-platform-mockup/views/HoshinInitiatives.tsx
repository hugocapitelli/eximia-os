
import React, { useState, useMemo } from 'react';
import { HoshinInitiative, HoshinPerspective, InitiativeStatus } from '../types';
import InitiativeModal from '../modals/InitiativeModal';

const PERSPECTIVAS: HoshinPerspective[] = [
  { id: '1', name: 'Aprendizado e Crescimento', icon: 'school', color: 'blue' },
  { id: '2', name: 'Processos Internos', icon: 'settings', color: 'orange' },
  { id: '3', name: 'Mercado e Clientes', icon: 'target', color: 'red' },
  { id: '4', name: 'Perenidade Financeira', icon: 'savings', color: 'green' }
];

const MOCK_INITIATIVES: HoshinInitiative[] = [
  { id: 'i1', code: '01.01', title: 'Desenvolver Habilidades de Execução Solo', owner: 'Hugo Correa', startDate: '2026-01-01', deadline: '2026-06-30', status: 'ON_TRACK', perspectiveId: '1', level: 'STRATEGIC', iceScore: 243 },
  { id: 'i2', code: '01.01.01', title: 'Gestão e Otimização do Tempo', owner: 'Maria Silva', startDate: '2026-01-12', deadline: '2026-02-28', status: 'ATTENTION', perspectiveId: '1', parentId: 'i1', level: 'TACTICAL', iceScore: 81 },
  { id: 'i3', code: '03.01', title: 'Implementar Tutor Harven (Piloto)', owner: 'Hugo Correa', startDate: '2026-01-15', deadline: '2026-02-28', status: 'CRITICAL', perspectiveId: '3', level: 'STRATEGIC', iceScore: 180 }
];

const HoshinInitiatives: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [initiatives, setInitiatives] = useState<HoshinInitiative[]>(MOCK_INITIATIVES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HoshinInitiative | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return initiatives.filter(i => 
      i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.code.includes(searchTerm)
    );
  }, [initiatives, searchTerm]);

  const handleSave = (item: HoshinInitiative) => {
    if (editingItem) {
      setInitiatives(prev => prev.map(i => i.id === item.id ? item : i));
    } else {
      const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
      setInitiatives(prev => [...prev, newItem]);
    }
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setInitiatives(prev => prev.filter(i => i.id !== id));
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getStatusBadge = (status: InitiativeStatus) => {
    const configs = {
      NOT_PLANNED: { color: 'bg-gray-100 text-gray-500', label: 'Não Planejada' },
      PLANNED: { color: 'bg-blue-100 text-blue-600', label: 'Planejada' },
      ON_TRACK: { color: 'bg-green-100 text-green-700', label: 'Conforme' },
      ATTENTION: { color: 'bg-harven-gold/20 text-harven-gold', label: 'Atenção' },
      CRITICAL: { color: 'bg-red-100 text-red-600', label: 'Crítico' },
      DONE: { color: 'bg-harven-dark text-white', label: 'Concluída' }
    };
    const c = configs[status];
    return <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${c.color}`}>{c.label}</span>;
  };

  const TreeItem: React.FC<{ item: HoshinInitiative, depth: number }> = ({ item, depth = 0 }) => {
    const children = initiatives.filter(i => i.parentId === item.id);
    return (
      <div className="flex flex-col">
        <div 
          onClick={() => { setEditingItem(item); setIsModalOpen(true); }}
          className={`flex items-center gap-4 p-4 border-b border-harven-bg hover:bg-primary/5 transition-all cursor-pointer group animate-in slide-in-from-left-2`}
          style={{ paddingLeft: `${depth * 2 + 1}rem` }}
        >
          <div className="flex-1 flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-gray-400 bg-harven-bg px-2 py-0.5 rounded">{item.code}</span>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-harven-dark group-hover:text-primary-dark">{item.title}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.owner} • {item.deadline}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-0.5">ICE</span>
              <span className="text-xs font-black text-harven-dark">{item.iceScore}</span>
            </div>
            {getStatusBadge(item.status)}
            <button className="p-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-harven-dark transition-all">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
        </div>
        {children.map(child => <TreeItem key={child.id} item={child} depth={depth + 1} />)}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-harven-dark text-3xl font-bold">track_changes</span>
          </div>
          <div>
            <h2 className="text-3xl font-display font-bold text-harven-dark tracking-tight">Gestão de Iniciativas</h2>
            <p className="text-gray-500">Ciclo Estratégico Hoshin Kanri 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-harven-border rounded-xl p-1 flex shadow-sm">
             <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-harven-dark text-primary' : 'text-gray-400 hover:text-harven-dark'}`}>
                <span className="material-symbols-outlined text-[20px]">account_tree</span>
             </button>
             <button onClick={() => setViewMode('kanban')} className={`p-2.5 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-harven-dark text-primary' : 'text-gray-400 hover:text-harven-dark'}`}>
                <span className="material-symbols-outlined text-[20px]">view_kanban</span>
             </button>
          </div>
          <button 
            onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
            className="bg-primary hover:bg-primary-dark transition-all text-harven-dark font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Nova Iniciativa
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-harven-border shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-harven-gold">search</span>
          <input 
            className="w-full bg-harven-bg border-none rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-primary" 
            placeholder="Buscar por título ou código..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-harven-bg hover:bg-harven-border rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest transition-all flex items-center gap-2">
           <span className="material-symbols-outlined text-[18px]">filter_alt</span> Filtros
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-harven-border shadow-sm overflow-hidden min-h-[500px]">
        {viewMode === 'list' ? (
          <div className="flex flex-col">
            {PERSPECTIVAS.map(p => (
              <div key={p.id} className="flex flex-col border-b border-harven-border last:border-none">
                <div className="px-6 py-4 bg-harven-bg/50 flex items-center gap-3">
                  <span className={`material-symbols-outlined text-${p.color}-500 font-bold`}>{p.icon}</span>
                  <h3 className="text-sm font-black text-harven-dark uppercase tracking-widest">{p.name}</h3>
                </div>
                {filteredItems.filter(i => i.perspectiveId === p.id && !i.parentId).map(item => (
                  <TreeItem key={item.id} item={item} depth={0} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 grid grid-cols-5 gap-6 h-full overflow-x-auto">
            {['PLANNED', 'ON_TRACK', 'ATTENTION', 'CRITICAL', 'DONE'].map(status => (
              <div key={status} className="flex flex-col gap-4 min-w-[250px]">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{status}</span>
                  <span className="size-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {filteredItems.filter(i => i.status === status).length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {filteredItems.filter(i => i.status === status).map(i => (
                    <div 
                      key={i.id} 
                      onClick={() => { setEditingItem(i); setIsModalOpen(true); }}
                      className="bg-white p-4 rounded-xl border border-harven-border shadow-sm hover:border-primary transition-all cursor-pointer group"
                    >
                      <span className="text-[9px] font-mono font-bold text-gray-400 block mb-1">{i.code}</span>
                      <h4 className="text-sm font-bold text-harven-dark group-hover:text-primary-dark mb-4">{i.title}</h4>
                      <div className="flex justify-between items-center pt-3 border-t border-harven-bg">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{i.owner.split(' ')[0]}</span>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px] text-harven-gold">bolt</span>
                          <span className="text-[10px] font-black text-harven-dark">{i.iceScore}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <InitiativeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        onDelete={handleDelete}
        initiative={editingItem}
        perspectives={PERSPECTIVAS}
        allInitiatives={initiatives}
      />
    </div>
  );
};

export default HoshinInitiatives;
