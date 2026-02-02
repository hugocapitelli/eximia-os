import React from 'react';
import { BRAND_IDENTITY } from '../../constants';
import { Badge } from '../atoms/Badge';
import { Copy, Download, Info } from 'lucide-react';

export const BrandVisualIdentity: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
             <div className="mb-10">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Identidade Visual</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-serif text-lg">
                    Cores, tipografia e logotipos que definem a estética {BRAND_IDENTITY.name}.
                </p>
            </div>

            {/* Colors */}
            <section className="mb-16">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-eximia-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Paleta de Cores</h2>
                </div>
                
                <div className="space-y-8">
                    {BRAND_IDENTITY.palettes.map((palette, idx) => (
                        <div key={idx}>
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">{palette.name}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {palette.colors.map((color, cIdx) => (
                                    <div key={cIdx} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow group">
                                        <div 
                                            className="h-24 w-full rounded-lg mb-3 shadow-inner relative"
                                            style={{ backgroundColor: color.hex }}
                                        >
                                            <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                                                <Copy className="w-6 h-6 text-white drop-shadow-md" />
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-zinc-900 dark:text-zinc-100">{color.name}</p>
                                                <p className="text-xs text-zinc-500 mt-0.5 font-mono">{color.hex}</p>
                                            </div>
                                            <Badge variant="outline">{color.usage}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Typography */}
            <section className="mb-16 border-t border-zinc-200 dark:border-zinc-800 pt-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Tipografia</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Primary Font */}
                    <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-sans font-bold text-9xl text-zinc-900 dark:text-zinc-100 select-none">
                            Aa
                        </div>
                        <div className="relative z-10">
                            <Badge className="mb-4">Primary / UI</Badge>
                            <h3 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 font-sans">Inter</h3>
                            <p className="text-zinc-500 mb-8 max-w-sm">
                                Usada para interface, títulos e elementos de navegação. Otimizada para legibilidade em telas.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="flex items-baseline gap-4">
                                    <span className="w-24 text-sm text-zinc-400">Regular</span>
                                    <span className="text-xl font-sans font-normal">The quick brown fox jumps over the lazy dog.</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="w-24 text-sm text-zinc-400">Medium</span>
                                    <span className="text-xl font-sans font-medium">The quick brown fox jumps over the lazy dog.</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="w-24 text-sm text-zinc-400">Bold</span>
                                    <span className="text-xl font-sans font-bold">The quick brown fox jumps over the lazy dog.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Font */}
                    <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-serif font-bold text-9xl text-zinc-900 dark:text-zinc-100 select-none">
                            Ag
                        </div>
                         <div className="relative z-10">
                            <Badge className="mb-4">Secondary / Editorial</Badge>
                            <h3 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 font-serif">Source Serif 4</h3>
                            <p className="text-zinc-500 mb-8 max-w-sm">
                                Usada para textos longos, citações e momentos de sofisticação. Traz a elegância do editorial.
                            </p>
                            
                            <div className="space-y-4">
                                <div className="flex items-baseline gap-4">
                                    <span className="w-24 text-sm text-zinc-400">Regular</span>
                                    <span className="text-xl font-serif font-normal">The quick brown fox jumps over the lazy dog.</span>
                                </div>
                                <div className="flex items-baseline gap-4">
                                    <span className="w-24 text-sm text-zinc-400">Semibold</span>
                                    <span className="text-xl font-serif font-semibold">The quick brown fox jumps over the lazy dog.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Logos */}
            <section className="border-t border-zinc-200 dark:border-zinc-800 pt-10">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-1.5 h-6 bg-zinc-900 dark:bg-zinc-100 rounded-full"></div>
                    <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Logotipos</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-zinc-50 dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center gap-6 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="h-20 w-20 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg">
                             <span className="text-white dark:text-black font-bold text-2xl">EX</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">Monogram</p>
                            <p className="text-xs text-zinc-500">Uso primário em avatares e apps.</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-sm text-xs font-medium hover:bg-zinc-50">SVG</button>
                             <button className="p-2 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-sm text-xs font-medium hover:bg-zinc-50">PNG</button>
                        </div>
                    </div>
                     <div className="bg-zinc-50 dark:bg-[#09090B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 flex flex-col items-center justify-center gap-6 group hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                        <div className="h-20 px-6 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center shadow-lg">
                             <span className="text-white dark:text-black font-bold text-xl">EXÍMIA OS</span>
                        </div>
                        <div className="text-center">
                            <p className="font-bold text-zinc-900 dark:text-zinc-100">Wordmark</p>
                            <p className="text-xs text-zinc-500">Uso em headers e materiais oficiais.</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-sm text-xs font-medium hover:bg-zinc-50">SVG</button>
                             <button className="p-2 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700 shadow-sm text-xs font-medium hover:bg-zinc-50">PNG</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};