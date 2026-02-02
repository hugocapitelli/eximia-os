
import React, { useState } from 'react';
import { ACADEMY_COURSES, ACADEMY_ACHIEVEMENTS, ACADEMY_SKILLS } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import {
  Trophy,
  Flame,
  Zap,
  Star,
  Target,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Download,
  Share2,
  CheckCircle2,
  Lock,
  ArrowLeft
} from 'lucide-react';

interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  issuedAt: string;
  verificationCode: string;
  downloadUrl?: string;
}

// Mock certificates
const CERTIFICATES: Certificate[] = [
  { id: 'cert-1', courseId: 'pm-101', courseName: 'Product Management 101', issuedAt: '15 Jan 2026', verificationCode: 'EXM-PM101-2026-001' },
  { id: 'cert-2', courseId: 'frontend-101', courseName: 'Frontend Basics', issuedAt: '10 Jan 2026', verificationCode: 'EXM-FE101-2026-002' },
];

// Mock XP history
const XP_HISTORY = [
  { date: '29 Jan', xp: 150, source: 'Aula Concluída' },
  { date: '28 Jan', xp: 200, source: 'Quiz Perfeito' },
  { date: '27 Jan', xp: 100, source: 'Streak Bonus' },
  { date: '26 Jan', xp: 150, source: 'Aula Concluída' },
  { date: '25 Jan', xp: 300, source: 'Curso Finalizado' },
];

export const AcademyProgress: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'certificates'>('overview');

  // Calculate stats
  const totalXP = 4850;
  const currentLevel = Math.floor(totalXP / 1000) + 1;
  const xpInCurrentLevel = totalXP % 1000;
  const currentStreak = 12;
  const coursesCompleted = ACADEMY_COURSES.filter(c => c.progress === 100).length;
  const totalHoursLearned = 24;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Progresso</h1>
            <p className="text-zinc-400 mt-1 font-serif text-lg">
              Acompanhe sua evolução e conquistas.
            </p>
          </div>
        </div>
      </div>

      {/* Level Card */}
      <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/30 border border-purple-500/30 rounded-2xl p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Level Badge */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-500/20">
                <span className="text-4xl font-black text-white">{currentLevel}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center border-4 border-[#0A0A0A]">
                <Star className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <p className="text-sm text-purple-300/80 uppercase tracking-wider font-semibold">Nível Atual</p>
              <p className="text-3xl font-bold text-white mb-2">
                {currentLevel < 5 ? 'Aprendiz' : currentLevel < 10 ? 'Explorador' : currentLevel < 20 ? 'Especialista' : 'Mestre'}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-48 h-3 bg-purple-900/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                    style={{ width: `${(xpInCurrentLevel / 1000) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-purple-300">{xpInCurrentLevel} / 1,000 XP</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
              <Zap className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalXP.toLocaleString()}</p>
              <p className="text-xs text-purple-300/70 uppercase">XP Total</p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
              <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{currentStreak}</p>
              <p className="text-xs text-purple-300/70 uppercase">Dias Streak</p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
              <BookOpen className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{coursesCompleted}</p>
              <p className="text-xs text-purple-300/70 uppercase">Cursos</p>
            </div>
            <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{totalHoursLearned}h</p>
              <p className="text-xs text-purple-300/70 uppercase">Aprendizado</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-zinc-800 pb-4">
        {(['overview', 'achievements', 'certificates'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {tab === 'overview' ? 'Visão Geral' : tab === 'achievements' ? 'Conquistas' : 'Certificados'}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* XP History */}
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Histórico de XP
            </h2>
            <div className="space-y-3">
              {XP_HISTORY.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-900/30 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{item.source}</p>
                      <p className="text-xs text-zinc-500">{item.date}</p>
                    </div>
                  </div>
                  <span className="text-emerald-400 font-semibold">+{item.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Progress */}
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" />
              Habilidades
            </h2>
            <div className="space-y-4">
              {ACADEMY_SKILLS.map(skill => (
                <div key={skill.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-300">{skill.name}</span>
                    <span className="text-xs text-zinc-500">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Calendar */}
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-400" />
              Streak dos Últimos 30 Dias
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, i) => {
                const hasActivity = Math.random() > 0.3;
                const intensity = hasActivity ? Math.floor(Math.random() * 3) + 1 : 0;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md ${
                      intensity === 0 ? 'bg-zinc-800' :
                      intensity === 1 ? 'bg-emerald-900/50' :
                      intensity === 2 ? 'bg-emerald-700/50' :
                      'bg-emerald-500'
                    }`}
                    title={`Dia ${i + 1}`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-4 text-xs text-zinc-500">
              <span>Menos</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-zinc-800" />
                <div className="w-4 h-4 rounded bg-emerald-900/50" />
                <div className="w-4 h-4 rounded bg-emerald-700/50" />
                <div className="w-4 h-4 rounded bg-emerald-500" />
              </div>
              <span>Mais</span>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACADEMY_ACHIEVEMENTS.map(achievement => {
            const Icon = achievement.icon;
            const isUnlocked = achievement.status === 'unlocked';

            return (
              <div
                key={achievement.id}
                className={`bg-[#0A0A0A] border rounded-xl p-5 transition-all ${
                  isUnlocked ? 'border-zinc-800 hover:border-zinc-700' : 'border-zinc-800/50 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${
                    isUnlocked ? 'bg-gradient-to-br from-amber-500 to-amber-700' : 'bg-zinc-800'
                  }`}>
                    {isUnlocked ? <Icon className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-zinc-600" />}
                  </div>
                  {isUnlocked && (
                    <Badge variant="default">Desbloqueada</Badge>
                  )}
                </div>

                <h3 className={`font-semibold mb-1 ${isUnlocked ? 'text-zinc-100' : 'text-zinc-500'}`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-zinc-500 mb-3">{achievement.description}</p>

                {isUnlocked && achievement.unlockedAt && (
                  <p className="text-xs text-zinc-600">Conquistada em {achievement.unlockedAt}</p>
                )}

                {!isUnlocked && achievement.progress !== undefined && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-500">Progresso</span>
                      <span className="text-zinc-400">{achievement.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-zinc-600 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          {CERTIFICATES.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-zinc-800 rounded-xl">
              <Award className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">Nenhum certificado ainda.</p>
              <p className="text-sm text-zinc-600 mt-1">Complete cursos para obter certificados.</p>
            </div>
          ) : (
            CERTIFICATES.map(cert => (
              <div key={cert.id} className="bg-[#0A0A0A] border border-zinc-800 rounded-xl p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-100">{cert.courseName}</h3>
                      <p className="text-sm text-zinc-500">Emitido em {cert.issuedAt}</p>
                      <p className="text-xs text-zinc-600 font-mono mt-1">{cert.verificationCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" icon={<Share2 className="w-4 h-4" />}>
                      Compartilhar
                    </Button>
                    <Button size="sm" icon={<Download className="w-4 h-4" />}>
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
