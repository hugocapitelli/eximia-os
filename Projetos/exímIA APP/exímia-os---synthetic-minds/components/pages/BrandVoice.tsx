import React from 'react';
import { BRAND_IDENTITY } from '../../constants';
import { Badge } from '../atoms/Badge';
import { Quote, MessageSquare, Mic2 } from 'lucide-react';

export const BrandVoice: React.FC = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
             <div className="mb-10">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">Voz & Mensagem</h1>
                <p className="text-zinc-600 dark:text-zinc-400 font-serif text-lg">
                    Como nos comunicamos. O tom, a personalidade e as narrativas principais.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                 {/* Archetypes */}
                 <div className="lg:col-span-2">
                     <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-eximia-500" />
                        Arquétipos de Marca
                     </h2>
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                         {BRAND_IDENTITY.archetypes.map((archetype, idx) => (
                             <div key={idx} className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm hover:border-eximia-500/50 transition-colors relative overflow-hidden">
                                 <div className="absolute top-0 right-0 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-bl-lg text-xs font-mono text-zinc-500">
                                     {archetype.percentage}%
                                 </div>
                                 <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-2">{archetype.name}</h3>
                                 <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                     {archetype.description}
                                 </p>
                                 <div className="mt-4 w-full bg-zinc-100 dark:bg-zinc-800 h-1 rounded-full overflow-hidden">
                                     <div className="bg-eximia-500 h-full opacity-80" style={{ width: `${archetype.percentage}%` }}></div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* Mission / Vision */}
                 <div className="space-y-6">
                     <div className="bg-zinc-900 dark:bg-zinc-800 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
                         <Quote className="absolute top-4 right-4 w-10 h-10 text-white/10" />
                         <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Missão</h3>
                         <p className="font-serif text-lg leading-relaxed">"{BRAND_IDENTITY.mission}"</p>
                     </div>
                      <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
                         <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Visão</h3>
                         <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{BRAND_IDENTITY.vision}</p>
                     </div>
                 </div>
            </div>

            {/* Tone of Voice */}
            <section className="mb-16">
                 <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                    <Mic2 className="w-5 h-5 text-blue-500" />
                    Tom de Voz
                 </h2>
                 
                 <div className="bg-white dark:bg-[#18181B] border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm space-y-8">
                     {BRAND_IDENTITY.tones.map((tone, idx) => (
                         <div key={idx}>
                             <div className="flex justify-between items-end mb-2">
                                 <span className="text-sm font-medium text-zinc-500">{tone.leftLabel}</span>
                                 <Badge variant="outline">{tone.attribute}</Badge>
                                 <span className="text-sm font-medium text-zinc-500">{tone.rightLabel}</span>
                             </div>
                             <div className="relative h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full">
                                 <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-eximia-500 border-2 border-white dark:border-zinc-900 rounded-full shadow-md"
                                    style={{ left: `${tone.value}%` }}
                                 ></div>
                             </div>
                         </div>
                     ))}
                 </div>
            </section>

             {/* Do's and Don'ts */}
             <section>
                 <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">Diretrizes de Copywriting</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-6 rounded-xl">
                         <h3 className="text-emerald-700 dark:text-emerald-400 font-bold mb-4 flex items-center gap-2">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-200 dark:bg-emerald-800 text-xs">✓</span>
                             Faça (Do)
                         </h3>
                         <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                             <li className="flex gap-2">
                                 <span>•</span>
                                 <span>Use verbos de ação no imperativo para botões e chamadas.</span>
                             </li>
                             <li className="flex gap-2">
                                 <span>•</span>
                                 <span>Seja conciso. Corte palavras desnecessárias.</span>
                             </li>
                             <li className="flex gap-2">
                                 <span>•</span>
                                 <span>Fale sobre o benefício para o usuário, não a feature.</span>
                             </li>
                         </ul>
                     </div>

                     <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 p-6 rounded-xl">
                         <h3 className="text-rose-700 dark:text-rose-400 font-bold mb-4 flex items-center gap-2">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-200 dark:bg-rose-800 text-xs">✕</span>
                             Não Faça (Don't)
                         </h3>
                         <ul className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
                             <li className="flex gap-2">
                                 <span>•</span>
                                 <span>Não use jargões técnicos sem explicação.</span>
                             </li>
                             <li className="flex gap-2">
                                 <span>•</span>
                                 <span>Evite voz passiva ("O arquivo foi enviado" → "Enviamos o arquivo").</span>
                             </li>
                             <li className="flex gap-2">
                                 <span>•</span>
                                 <span>Não use exclamações excessivas!!!</span>
                             </li>
                         </ul>
                     </div>
                 </div>
             </section>
        </div>
    );
};