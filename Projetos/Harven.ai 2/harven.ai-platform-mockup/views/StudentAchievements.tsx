
import React, { useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { Card } from '../components/ui/Card';
import { Progress } from '../components/ui/Progress';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const StudentAchievements: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  // Dados Mockados do Usuário
  const userStats = {
    level: 12,
    title: "Erudito Socrático",
    currentXP: 2450,
    nextLevelXP: 3000,
    streak: 14,
    globalRank: 42,
    totalBadges: 24
  };

  // Dados Mockados das Medalhas
  const badges = [
    { id: 1, name: "Primeiro Passo", description: "Concluiu o primeiro módulo de qualquer curso.", icon: "flag", rarity: "common", unlocked: true, date: "12 Out, 2023" },
    { id: 2, name: "Mestre da Retórica", description: "Venceu 5 debates contra a IA sem falácias.", icon: "record_voice_over", rarity: "legendary", unlocked: true, date: "15 Out, 2023" },
    { id: 3, name: "Fogo do Conhecimento", description: "Manteve uma ofensiva de 7 dias seguidos.", icon: "local_fire_department", rarity: "rare", unlocked: true, date: "Ontem" },
    { id: 4, name: "Bibliotecário", description: "Baixou 50 materiais de apoio.", icon: "library_books", rarity: "common", unlocked: true, date: "Hoje" },
    { id: 5, name: "100% Focado", description: "Assistiu 2 horas de aula sem pausar.", icon: "timer", rarity: "epic", unlocked: false, progressValue: 60, progressLabel: "1h 12m / 2h" },
    { id: 6, name: "Filósofo Rei", description: "Atingiu o nível 20 na plataforma.", icon: "crown", rarity: "legendary", unlocked: false, progressValue: 60, progressLabel: "Nível 12 / 20" },
    { id: 7, name: "Colaborador", description: "Teve 10 comentários curtidos na comunidade.", icon: "forum", rarity: "rare", unlocked: false, progressValue: 40, progressLabel: "4 / 10" },
    { id: 8, name: "Polímata", description: "Concluiu cursos em 3 áreas diferentes.", icon: "school", rarity: "epic", unlocked: false, progressValue: 33, progressLabel: "1 / 3" },
  ];

  // Dados Mockados do Leaderboard
  const leaderboard = [
    { rank: 1, name: "Julia M.", xp: 15400, avatar: "https://picsum.photos/seed/u1/100/100", isUser: false },
    { rank: 2, name: "Roberto C.", xp: 14200, avatar: "https://picsum.photos/seed/u2/100/100", isUser: false },
    { rank: 3, name: "Ana P.", xp: 13850, avatar: "https://picsum.photos/seed/u3/100/100", isUser: false },
    { rank: 42, name: "Você", xp: 12450, avatar: "https://picsum.photos/seed/student/100/100", isUser: true },
    { rank: 43, name: "Carlos D.", xp: 12100, avatar: "https://picsum.photos/seed/u4/100/100", isUser: false },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'text-harven-gold bg-harven-gold/10 border-harven-gold/20';
      case 'epic': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'rare': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const filteredBadges = badges.filter(b => {
    if (activeTab === 'unlocked') return b.unlocked;
    if (activeTab === 'locked') return !b.unlocked;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-8 flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Hero Section - Level & Stats */}
      <div className="bg-foreground rounded-2xl p-8 text-background shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 size-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 size-40 bg-harven-gold/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          {/* Level Circle - SVG Customizado mantido pois é específico desta view */}
          <div className="relative size-32 flex-shrink-0">
             <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className="text-primary" strokeDasharray={`${(userStats.currentXP / userStats.nextLevelXP) * 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">Nível</span>
                <span className="text-4xl font-display font-bold">{userStats.level}</span>
             </div>
          </div>

          <div className="flex-1 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h2 className="text-3xl font-display font-bold tracking-tight">{userStats.title}</h2>
                <span className="bg-harven-gold text-foreground text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Premium</span>
             </div>
             <p className="text-gray-400 text-sm mb-4">
                Você acumulou <strong>{userStats.currentXP} XP</strong>. Faltam apenas <strong>{userStats.nextLevelXP - userStats.currentXP} XP</strong> para o nível 13.
             </p>
             <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3">
                   <span className="material-symbols-outlined text-orange-500 fill-1">local_fire_department</span>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Ofensiva</p>
                      <p className="text-sm font-bold">{userStats.streak} dias seguidos</p>
                   </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 flex items-center gap-3">
                   <span className="material-symbols-outlined text-harven-gold fill-1">military_tech</span>
                   <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Conquistas</p>
                      <p className="text-sm font-bold">{userStats.totalBadges} desbloqueadas</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Badges Grid */}
        <div className="lg:col-span-2 flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-foreground">Medalhas & Insígnias</h3>
              
              <Tabs 
                items={[
                    { id: 'all', label: 'Todas' },
                    { id: 'unlocked', label: 'Obtidas' },
                    { id: 'locked', label: 'Bloqueadas' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
                className="bg-white border border-border"
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBadges.map((badge) => (
                 <Card 
                   key={badge.id} 
                   className={`p-5 transition-all duration-300 group ${
                     badge.unlocked 
                     ? 'hover:border-primary/50' 
                     : 'bg-muted/50 border-border opacity-80'
                   }`}
                 >
                    <div className="flex items-start gap-4">
                       <div className={`size-14 rounded-full flex items-center justify-center border-4 flex-shrink-0 ${
                          badge.unlocked 
                          ? getRarityColor(badge.rarity) 
                          : 'bg-muted text-muted-foreground border-border'
                       }`}>
                          <span className="material-symbols-outlined text-[28px]">{badge.icon}</span>
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {badge.name}
                             </h4>
                             {!badge.unlocked && (
                                <span className="material-symbols-outlined text-[16px] text-muted-foreground">lock</span>
                             )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                             {badge.description}
                          </p>
                          
                          {badge.unlocked ? (
                             <p className="text-[10px] font-bold text-green-600 mt-3 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Desbloqueado em {badge.date}
                             </p>
                          ) : (
                             <div className="mt-3">
                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground mb-1">
                                   <span>Progresso</span>
                                   <span>{badge.progressLabel}</span>
                                </div>
                                <Progress value={badge.progressValue} className="h-1.5" />
                             </div>
                          )}
                       </div>
                    </div>
                 </Card>
              ))}
           </div>
        </div>

        {/* Right Column: Leaderboard Widget */}
        <div className="flex flex-col gap-6">
           <Card className="flex flex-col h-fit">
              <div className="p-5 border-b border-border flex justify-between items-center bg-muted/20">
                 <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                    <span className="material-symbols-outlined text-harven-gold">trophy</span>
                    Ranking Global
                 </h3>
                 <button 
                    onClick={() => setShowLeaderboardModal(true)}
                    className="text-[10px] font-bold text-primary-dark hover:underline uppercase"
                 >
                    Ver Tudo
                 </button>
              </div>
              <div className="flex flex-col">
                 {leaderboard.map((user, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-3 p-4 border-b border-border last:border-none transition-colors ${
                        user.isUser ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-muted/10 border-l-4 border-l-transparent'
                      }`}
                    >
                       <div className={`size-8 rounded flex items-center justify-center font-black text-sm ${
                          user.rank === 1 ? 'bg-harven-gold text-white shadow-sm' :
                          user.rank === 2 ? 'bg-gray-300 text-white' :
                          user.rank === 3 ? 'bg-orange-300 text-white' :
                          'text-muted-foreground bg-muted'
                       }`}>
                          {user.rank}
                       </div>
                       <Avatar src={user.avatar} fallback={user.name} size="sm" />
                       <div className="flex-1">
                          <p className={`text-sm font-bold ${user.isUser ? 'text-foreground' : 'text-muted-foreground'}`}>
                             {user.name} {user.isUser && '(Você)'}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground">{user.xp.toLocaleString()} XP</p>
                       </div>
                       {user.rank <= 3 && (
                          <span className="material-symbols-outlined text-harven-gold fill-1 text-[16px]">star</span>
                       )}
                    </div>
                 ))}
              </div>
              <div className="p-4 text-center bg-muted/20">
                 <p className="text-[10px] text-muted-foreground">Ranking atualiza a cada 24 horas.</p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentAchievements;
