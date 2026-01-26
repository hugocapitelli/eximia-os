
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-harven-bg overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
      {/* Banner & Header */}
      <div className="relative h-64 w-full bg-harven-dark overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/texture/1600/400')] bg-cover opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-harven-bg via-transparent to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto w-full px-8 pb-12 -mt-20 relative z-10 flex flex-col gap-8">
        {/* Profile Info Card */}
        <div className="bg-white rounded-2xl border border-harven-border p-8 shadow-lg flex flex-col md:flex-row gap-8 items-start md:items-end">
          <div className="relative">
            <div className="size-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
               <img src="https://picsum.photos/seed/student/400/400" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-1 right-1 size-8 bg-primary rounded-full border-4 border-white flex items-center justify-center text-harven-dark shadow-sm" title="Status: Online">
               <span className="material-symbols-outlined text-[16px] fill-1">check</span>
            </div>
          </div>
          
          <div className="flex-1 mb-2">
             <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-display font-bold text-harven-dark">Lucas Martins</h1>
                <span className="bg-harven-gold text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Premium</span>
             </div>
             <p className="text-gray-500 font-medium">Estudante de Engenharia de Software • 3º Semestre</p>
             <div className="flex items-center gap-4 mt-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">location_on</span> São Paulo, BR</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">calendar_month</span> Membro desde 2023</span>
             </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
             <Button variant="outline" onClick={() => navigate('/account')}>
                <span className="material-symbols-outlined mr-2">settings</span>
                Configurar
             </Button>
             <Button>
                <span className="material-symbols-outlined mr-2">share</span>
                Compartilhar
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: About & Skills */}
           <div className="space-y-8">
              <Card className="p-6 space-y-4">
                 <h3 className="font-display font-bold text-harven-dark text-lg">Sobre Mim</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">
                    Apaixonado por tecnologia e inteligência artificial. Atualmente focando em desenvolvimento full-stack e aprendizado de máquina. Sempre em busca de novos desafios e projetos open-source para contribuir.
                 </p>
                 <div className="pt-4 border-t border-harven-border">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Interesses</h4>
                    <div className="flex flex-wrap gap-2">
                       {['React', 'TypeScript', 'Python', 'AI Ethics', 'UX Design'].map(tag => (
                          <span key={tag} className="bg-harven-bg text-harven-dark px-3 py-1 rounded-full text-xs font-bold border border-harven-border">
                             {tag}
                          </span>
                       ))}
                    </div>
                 </div>
              </Card>

              <Card className="p-6 space-y-4">
                 <h3 className="font-display font-bold text-harven-dark text-lg">Estatísticas</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-harven-bg p-4 rounded-xl text-center">
                       <span className="block text-2xl font-display font-bold text-harven-dark">12</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Cursos Concluídos</span>
                    </div>
                    <div className="bg-harven-bg p-4 rounded-xl text-center">
                       <span className="block text-2xl font-display font-bold text-harven-dark">340h</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Horas Estudadas</span>
                    </div>
                    <div className="bg-harven-bg p-4 rounded-xl text-center">
                       <span className="block text-2xl font-display font-bold text-harven-dark">9.8</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Média Geral</span>
                    </div>
                    <div className="bg-harven-bg p-4 rounded-xl text-center">
                       <span className="block text-2xl font-display font-bold text-harven-dark">15</span>
                       <span className="text-[10px] font-bold text-gray-400 uppercase">Certificados</span>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Right Column: Recent Activity */}
           <div className="lg:col-span-2 space-y-8">
              <Card className="p-8">
                 <h3 className="font-display font-bold text-harven-dark text-lg mb-6">Atividade Recente</h3>
                 <div className="relative border-l-2 border-harven-bg space-y-8 ml-3 pl-8">
                    {[
                       { action: 'Concluiu o curso', target: 'UX Design Avançado', time: 'Há 2 dias', icon: 'school', color: 'bg-primary text-harven-dark' },
                       { action: 'Ganhou a medalha', target: 'Erudito Socrático', time: 'Há 5 dias', icon: 'emoji_events', color: 'bg-harven-gold text-white' },
                       { action: 'Comentou em', target: 'Fórum de Machine Learning', time: 'Há 1 semana', icon: 'forum', color: 'bg-blue-100 text-blue-600' },
                       { action: 'Iniciou o curso', target: 'Estruturas de Dados', time: 'Há 2 semanas', icon: 'play_arrow', color: 'bg-gray-100 text-gray-500' },
                    ].map((item, i) => (
                       <div key={i} className="relative">
                          <div className={`absolute -left-[43px] top-0 size-8 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${item.color}`}>
                             <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                          </div>
                          <div className="bg-white hover:bg-harven-bg/30 p-4 rounded-xl border border-harven-border transition-colors cursor-default">
                             <p className="text-sm text-harven-dark">
                                <span className="font-bold">{item.action}</span> <span className="font-medium text-gray-600">"{item.target}"</span>
                             </p>
                             <p className="text-xs text-gray-400 font-bold uppercase mt-1">{item.time}</p>
                          </div>
                       </div>
                    ))}
                 </div>
                 <Button variant="ghost" fullWidth className="mt-6 text-gray-400 hover:text-harven-dark">Ver Histórico Completo</Button>
              </Card>

              <Card className="p-8">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-display font-bold text-harven-dark text-lg">Certificados em Destaque</h3>
                      <button className="text-xs font-bold text-primary-dark hover:underline uppercase">Ver Todos</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[1, 2].map((cert) => (
                          <div key={cert} className="aspect-video bg-harven-bg rounded-xl border border-harven-border relative group overflow-hidden cursor-pointer">
                              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                                  <span className="material-symbols-outlined text-6xl">workspace_premium</span>
                              </div>
                              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                  <span className="material-symbols-outlined text-harven-gold text-3xl mb-2">verified</span>
                                  <h4 className="font-display font-bold text-harven-dark">Certificado de Excelência</h4>
                                  <p className="text-xs text-gray-500 mt-1">Engenharia de Software • 2024</p>
                              </div>
                              <div className="absolute inset-0 bg-harven-dark/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                  <Button variant="primary" size="sm" className="gap-2">
                                      <span className="material-symbols-outlined text-[16px]">download</span> Baixar
                                  </Button>
                              </div>
                          </div>
                      ))}
                  </div>
              </Card>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
