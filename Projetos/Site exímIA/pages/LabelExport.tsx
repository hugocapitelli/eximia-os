import React, { useState, useEffect } from 'react';
import { PERSONAL_DEVELOPMENT, READING_NOW, BUSINESS_BOOKS, RECENTLY_ADDED } from '../constants';
import { Printer, CheckSquare, Square, QrCode, ArrowLeft } from 'lucide-react';
import { Book } from '../types';
import { useNavigate } from 'react-router-dom';

const LabelExport: React.FC = () => {
  const navigate = useNavigate();
  // Merge all books for selection, removing duplicates based on ID
  const allBooks = React.useMemo(() => {
    const combined = [...READING_NOW, ...PERSONAL_DEVELOPMENT, ...BUSINESS_BOOKS, ...RECENTLY_ADDED];
    const unique = new Map();
    combined.forEach(book => unique.set(book.id, book));
    return Array.from(unique.values());
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === allBooks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(allBooks.map(b => b.id));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const selectedBooks = allBooks.filter(b => selectedIds.includes(b.id));

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* LEFT: Selection Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 dark:border-slate-700 flex flex-col bg-white dark:bg-[#1e293b] print:hidden h-full">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <button 
                onClick={() => navigate(-1)} 
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400"
                title="Voltar"
            >
                <ArrowLeft size={20} />
            </button>
            <div className="flex-1 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-white">Selecionar Livros</h3>
                <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {selectedIds.length}
                </span>
            </div>
        </div>
        
        <div className="p-3 bg-slate-50 dark:bg-[#1a2332] border-b border-slate-200 dark:border-slate-700">
            <button 
                onClick={toggleAll}
                className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors w-full"
            >
                {selectedIds.length === allBooks.length ? <CheckSquare size={18} className="text-primary" /> : <Square size={18} />}
                Selecionar Todos
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
            {allBooks.map(book => (
                <div 
                    key={book.id} 
                    onClick={() => toggleSelection(book.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg mb-1 cursor-pointer transition-colors ${selectedIds.includes(book.id) ? 'bg-primary/5 dark:bg-primary/10 border border-primary/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border border-transparent'}`}
                >
                     <div className={`text-primary ${selectedIds.includes(book.id) ? 'opacity-100' : 'opacity-30'}`}>
                        {selectedIds.includes(book.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                     </div>
                     <div className="flex-1 min-w-0">
                         <p className={`text-sm font-medium truncate ${selectedIds.includes(book.id) ? 'text-primary' : 'text-slate-700 dark:text-slate-300'}`}>{book.title}</p>
                         <p className="text-xs text-slate-500 truncate">{book.author}</p>
                     </div>
                </div>
            ))}
        </div>
      </div>

      {/* RIGHT: Preview & Actions */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-100 dark:bg-[#0f1520] print:bg-white print:overflow-visible print:h-auto print:block">
         {/* Toolbar (Hidden on print) */}
         <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] flex justify-between items-center print:hidden">
             <div>
                 <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pré-visualização de Impressão</h2>
                 <p className="text-sm text-slate-500">Formato: A4 (Grade 3x7)</p>
             </div>
             <button 
                onClick={handlePrint}
                disabled={selectedIds.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all"
            >
                 <Printer size={20} />
                 Imprimir Etiquetas
             </button>
         </div>

         {/* Preview Area */}
         <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
            {selectedIds.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 print:hidden">
                    <Printer size={64} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">Selecione livros para gerar etiquetas</p>
                </div>
            ) : (
                /* Print Page Container - A4 ratio ish */
                <div className="bg-white mx-auto w-full max-w-[210mm] min-h-[297mm] p-[10mm] shadow-2xl print:shadow-none print:w-full print:max-w-none print:p-0">
                    
                    {/* Grid for Labels - Typically 3 cols for address labels */}
                    <div className="grid grid-cols-3 gap-4 print:gap-2">
                        {selectedBooks.map((book) => (
                            <div key={book.id} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-2 items-center text-center h-[38mm] justify-center overflow-hidden break-inside-avoid page-break-inside-avoid print:border-slate-300">
                                <div className="flex items-center justify-center w-full gap-3">
                                    <div className="flex-shrink-0">
                                        {/* Fake QR Code */}
                                        <QrCode size={48} className="text-black" />
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wider leading-none mb-1 line-clamp-2">{book.title}</p>
                                        <p className="text-[9px] text-slate-600 leading-none line-clamp-1">{book.author}</p>
                                        <p className="text-[8px] font-mono text-slate-400 mt-1">ID: {book.id.padStart(8, '0')}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center text-xs text-slate-300 print:hidden">
                        --- Fim da Pré-visualização ---
                    </div>
                </div>
            )}
         </div>
      </div>

      <style>{`
        @media print {
            @page { margin: 1cm; size: A4; }
            body { background: white; }
            /* Hide everything that isn't the export page content */
            nav, header, aside, .print\\:hidden { display: none !important; }
            .print\\:block { display: block !important; }
            .print\\:w-full { width: 100% !important; }
            .print\\:p-0 { padding: 0 !important; }
            .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default LabelExport;