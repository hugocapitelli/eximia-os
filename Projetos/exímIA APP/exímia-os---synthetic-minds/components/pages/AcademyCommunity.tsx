import React from 'react';
import { Button } from '../atoms/Button';
import { User, Search, MessageSquare, ThumbsUp, Filter, Plus } from 'lucide-react';

interface AcademyCommunityProps {
    onNavigate: (pageId: string) => void;
}

const MOCK_DISCUSSIONS = [
    {
        id: 1,
        title: "Dúvida sobre Action Mapping no Módulo 2",
        author: "Sarah J.",
        time: "2h atrás",
        replies: 5,
        likes: 12,
        tag: "Dúvida",
        preview: "Estou tentando aplicar o conceito de backward design mas estou travada na definição dos KPIs..."
    },
    {
        id: 2,
        title: "Meu primeiro app publicado com Vibecoding! 🚀",
        author: "Mike Dev",
        time: "5h atrás",
        replies: 24,
        likes: 89,
        tag: "Showcase",
        preview: "Fala galera! Seguindo o curso do Alan, consegui lançar um SaaS de gestão de tarefas em 4 horas..."
    },
    {
        id: 3,
        title: "Sugestão de leitura complementar para Liderança Socrática",
        author: "David G.",
        time: "1d atrás",
        replies: 8,
        likes: 15,
        tag: "Recurso",
        preview: "Encontrei esse artigo do HBR que conecta perfeitamente com a aula 3 sobre perguntas poderosas..."
    }
];

export const AcademyCommunity: React.FC<AcademyCommunityProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-[#050505] text-zinc-200 font-sans">
            {/* Top Navigation */}
            <div className="sticky top-0 z-30 bg-[#050505]/80 backdrop-blur-md border-b border-[#1F1F22]">
                <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <button onClick={() => onNavigate('academy-dashboard')} className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">EXPLORAR</button>
                            <button onClick={() => onNavigate('academy-tracks')} className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">TRILHAS</button>
                            <button onClick={() => onNavigate('academy-favorites')} className="text-xs font-bold tracking-widest transition-colors text-zinc-500 hover:text-zinc-300">FAVORITOS</button>
                            <div className="h-4 w-[1px] bg-zinc-800" />
                            <button onClick={() => onNavigate('academy-community')} className="text-xs font-bold tracking-widest text-white">COMUNIDADE</button>
                            <button onClick={() => onNavigate('journey-library')} className="text-xs font-bold tracking-widest text-zinc-500 hover:text-zinc-300">LIVROS</button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative hidden md:block group">
                            <Search className="absolute left-0 top-1.5 w-3 h-3 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="BUSCAR..." 
                                className="bg-transparent border-b border-zinc-800 text-[10px] font-bold tracking-widest py-1 pl-5 w-32 focus:w-48 focus:border-zinc-500 focus:outline-none transition-all text-zinc-300 placeholder-zinc-700"
                            />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                             <User className="w-full h-full p-1.5 text-zinc-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto px-6 py-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
                        <p className="text-zinc-400">Conecte-se com outros arquitetos do futuro.</p>
                    </div>
                    <Button variant="primary" icon={<Plus className="w-4 h-4" />}>Nova Discussão</Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <div className="space-y-6">
                        <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-4">
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Topicos</h3>
                            <div className="space-y-1">
                                {['Geral', 'Dúvidas', 'Showcase', 'Recursos', 'Vagas', 'Networking'].map(topic => (
                                    <button key={topic} className="w-full text-left px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors flex justify-between group">
                                        {topic}
                                        <span className="text-[10px] text-zinc-600 group-hover:text-zinc-500">24</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Feed */}
                    <div className="lg:col-span-3 space-y-4">
                        {MOCK_DISCUSSIONS.map(post => (
                            <div key={post.id} className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6 hover:border-zinc-700 transition-colors cursor-pointer group">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                                            {post.author.substring(0,2)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-zinc-300">{post.author}</p>
                                            <p className="text-[10px] text-zinc-600">{post.time}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-500 uppercase font-bold">
                                        {post.tag}
                                    </span>
                                </div>
                                
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-eximia-400 transition-colors">{post.title}</h3>
                                <p className="text-sm text-zinc-500 mb-4 line-clamp-2">{post.preview}</p>
                                
                                <div className="flex items-center gap-6 text-zinc-600 text-xs font-medium">
                                    <span className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
                                        <MessageSquare className="w-4 h-4" /> {post.replies} respostas
                                    </span>
                                    <span className="flex items-center gap-1.5 hover:text-zinc-400 transition-colors">
                                        <ThumbsUp className="w-4 h-4" /> {post.likes} likes
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};