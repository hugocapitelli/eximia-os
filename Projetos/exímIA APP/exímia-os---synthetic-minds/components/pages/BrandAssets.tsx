import React, { useState } from 'react';
import { BRAND_IDENTITY } from '../../constants';
import { Badge } from '../atoms/Badge';
import { SearchBar } from '../molecules/SearchBar';
import { Button } from '../atoms/Button';
import { FileImage, MoreVertical, Download, Filter, Plus, FileText, Type } from 'lucide-react';

export const BrandAssets: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const filters = ['All', 'Logo', 'Image', 'Video', 'Document', 'Font'];

    const filteredAssets = activeFilter === 'All' 
        ? BRAND_IDENTITY.assets 
        : BRAND_IDENTITY.assets.filter(a => a.type.toLowerCase() === activeFilter.toLowerCase());

    const getIconForType = (type: string) => {
        switch(type) {
            case 'logo': return <FileImage className="w-8 h-8 text-eximia-500" />;
            case 'font': return <Type className="w-8 h-8 text-zinc-500" />;
            case 'document': return <FileText className="w-8 h-8 text-blue-500" />;
            default: return <FileImage className="w-8 h-8 text-zinc-400" />;
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Biblioteca de Assets</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-1 font-serif text-lg">
                        Central de arquivos oficiais. Sempre atualizados.
                    </p>
                </div>
                <Button icon={<Plus className="w-4 h-4" />}>Upload Asset</Button>
            </div>

            {/* Toolbar */}
             <div className="bg-white dark:bg-[#18181B] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="w-full md:w-96">
                    <SearchBar />
                </div>
                
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                     <Filter className="w-4 h-4 text-zinc-400 mr-2 shrink-0" />
                     {filters.map(filter => (
                         <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`
                                px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
                                ${activeFilter === filter 
                                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900' 
                                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}
                            `}
                         >
                             {filter}
                         </button>
                     ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAssets.map(asset => (
                    <div key={asset.id} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-sm group">
                        {/* Thumbnail Area */}
                        <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center relative">
                            {asset.thumbnailUrl ? (
                                <img src={asset.thumbnailUrl} alt={asset.name} className="w-full h-full object-cover" />
                            ) : (
                                getIconForType(asset.type)
                            )}
                            
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                 <button className="p-2 bg-white rounded-full text-zinc-900 hover:scale-110 transition-transform shadow-lg" title="Download">
                                     <Download className="w-4 h-4" />
                                 </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate pr-2" title={asset.name}>{asset.name}</h3>
                                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">{asset.category} • {asset.size}</p>
                            <div className="flex items-center justify-between">
                                <Badge variant={asset.status === 'approved' ? 'success' : asset.status === 'review' ? 'warning' : 'default'} className="text-[10px]">
                                    {asset.status}
                                </Badge>
                                <span className="text-[10px] text-zinc-400">{asset.updatedAt}</span>
                            </div>
                        </div>
                    </div>
                ))}

                 {/* Upload Placeholder */}
                 <button className="border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center p-6 text-zinc-400 hover:text-eximia-500 hover:border-eximia-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all gap-2 min-h-[260px]">
                    <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">Upload Novo Asset</span>
                </button>
            </div>
        </div>
    );
};