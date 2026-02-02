import React from 'react';
import { BRAND_IDENTITY } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Palette, FileImage, Mic, Plus, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Download } from 'lucide-react';

export const BrandDashboard: React.FC = () => {
    // Brand Health Calculation (Mock)
    const brandHealth = 88;

    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
            {/* Hero */}
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">v5.0 Stable</Badge>
                        <Badge variant="primary">Estratégico</Badge>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">{BRAND_IDENTITY.name} Identity</h1>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-2 font-serif text-lg">"{BRAND_IDENTITY.tagline}"</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" icon={<ShieldCheck className="w-4 h-4" />}>Brand Check</Button>
                    <Button icon={<Plus className="w-4 h-4" />}>Novo Asset</Button>
                </div>
            </header>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Brand Health Card */}
                <div className="bg-zinc-900 dark:bg-[#18181B] border border-zinc-800 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <ShieldCheck className="w-32 h-32 text-eximia-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">Brand Health Score</h3>
                        <div className="flex items-end gap-3 mb-2">
                            <span className="text-4xl font-bold text-white">{brandHealth}%</span>
                            <span className="text-emerald-500 text-sm font-bold mb-1.5">▲ Otimizado</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-eximia-500 h-full w-[88%] rounded-full shadow-[0_0_15px_rgba(253,191,104,0.4)]"></div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-3">Consistência visual detectada em 88% dos canais.</p>
                    </div>
                </div>

                {/* Quick Actions / Shortcuts */}
                <div className="col-span-2 bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                    <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-4">Acesso Rápido</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-eximia-500/50 hover:bg-eximia-50 dark:hover:bg-eximia-900/10 transition-all group">
                            <Palette className="w-8 h-8 text-zinc-400 group-hover:text-eximia-500 mb-3 transition-colors" />
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">Visual Identity</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group">
                            <Mic className="w-8 h-8 text-zinc-400 group-hover:text-blue-500 mb-3 transition-colors" />
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">Voice & Tone</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-100 dark:border-zinc-800 hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all group">
                            <FileImage className="w-8 h-8 text-zinc-400 group-hover:text-purple-500 mb-3 transition-colors" />
                            <span className="font-bold text-zinc-700 dark:text-zinc-300">Asset Library</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Assets */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Arquivos Recentes</h2>
                        <button className="text-sm text-eximia-600 dark:text-eximia-400 hover:underline flex items-center gap-1">
                            Ver biblioteca <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="bg-white dark:bg-[#18181B] rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
                        {BRAND_IDENTITY.assets.slice(0, 4).map((asset, idx) => (
                            <div key={asset.id} className="flex items-center p-4 border-b border-zinc-100 dark:border-zinc-800 last:border-0 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 mr-4">
                                    {asset.type === 'logo' ? <Palette className="w-5 h-5" /> : 
                                     asset.type === 'video' ? <FileImage className="w-5 h-5" /> : <FileImage className="w-5 h-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">{asset.name}</h4>
                                    <p className="text-xs text-zinc-500">{asset.category} • {asset.size}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={asset.status === 'approved' ? 'success' : asset.status === 'review' ? 'warning' : 'default'}>
                                        {asset.status}
                                    </Badge>
                                    <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications / Needs Attention */}
                <div>
                     <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Atenção Necessária</h2>
                     <div className="space-y-4">
                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 p-4 rounded-xl flex gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">Revisão Pendente</h4>
                                <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-1 leading-relaxed">
                                    O documento "Presentation Template" aguarda aprovação de design há 2 dias.
                                </p>
                                <button className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline">Revisar Agora</button>
                            </div>
                        </div>

                         <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl">
                            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mb-2">Completar Perfil da Marca</h4>
                            <div className="flex justify-between items-center text-xs text-zinc-500 mb-2">
                                <span>Progresso</span>
                                <span>85%</span>
                            </div>
                             <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-3">
                                <div className="bg-blue-500 h-full w-[85%] rounded-full"></div>
                            </div>
                            <p className="text-xs text-zinc-500">Adicione exemplos de "Do's and Don'ts" para melhorar o guia de voz.</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};