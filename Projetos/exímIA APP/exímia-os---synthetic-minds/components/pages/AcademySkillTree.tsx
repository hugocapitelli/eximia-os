
import React, { useState } from 'react';
import { ACADEMY_COURSES } from '../../constants';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { SkillTreeGrid } from '../academy/SkillTreeGrid';
import { useSkillTree } from '../../hooks/useSkillTree';
import {
  Zap,
  Lock,
  CheckCircle2,
  ChevronRight,
  Star,
  Trophy,
  Target,
  ArrowLeft,
  BookOpen,
  Code,
  Brain,
  TrendingUp,
  Users,
  Palette,
  Rocket,
  TreeDeciduous
} from 'lucide-react';

interface SkillNode {
  id: string;
  name: string;
  category: string;
  level: number; // 0-5 (0 = locked, 5 = mastered)
  xpRequired: number;
  currentXp: number;
  icon: React.ReactNode;
  prerequisites: string[];
  courses: string[];
  position: { x: number; y: number };
}

// Mock skill tree data
const SKILL_TREE: SkillNode[] = [
  // Product Track
  { id: 'product-fundamentals', name: 'Product Fundamentals', category: 'Product', level: 4, xpRequired: 1000, currentXp: 850, icon: <Target className="w-6 h-6" />, prerequisites: [], courses: ['pm-101'], position: { x: 0, y: 0 } },
  { id: 'discovery', name: 'Product Discovery', category: 'Product', level: 2, xpRequired: 1500, currentXp: 600, icon: <Brain className="w-6 h-6" />, prerequisites: ['product-fundamentals'], courses: ['pm-discovery'], position: { x: 1, y: 0 } },
  { id: 'strategy', name: 'Product Strategy', category: 'Product', level: 1, xpRequired: 2000, currentXp: 200, icon: <TrendingUp className="w-6 h-6" />, prerequisites: ['discovery'], courses: ['pm-strategy'], position: { x: 2, y: 0 } },

  // Engineering Track
  { id: 'frontend-basics', name: 'Frontend Basics', category: 'Engineering', level: 3, xpRequired: 1200, currentXp: 1000, icon: <Code className="w-6 h-6" />, prerequisites: [], courses: ['frontend-101'], position: { x: 0, y: 1 } },
  { id: 'react-advanced', name: 'React Advanced', category: 'Engineering', level: 2, xpRequired: 1800, currentXp: 800, icon: <Rocket className="w-6 h-6" />, prerequisites: ['frontend-basics'], courses: ['react-advanced'], position: { x: 1, y: 1 } },
  { id: 'system-design', name: 'System Design', category: 'Engineering', level: 0, xpRequired: 2500, currentXp: 0, icon: <Brain className="w-6 h-6" />, prerequisites: ['react-advanced'], courses: ['sys-design'], position: { x: 2, y: 1 } },

  // Business Track
  { id: 'sales-101', name: 'Sales Fundamentals', category: 'Business', level: 2, xpRequired: 1000, currentXp: 700, icon: <Users className="w-6 h-6" />, prerequisites: [], courses: ['prospectando-clientes'], position: { x: 0, y: 2 } },
  { id: 'high-ticket', name: 'High Ticket Sales', category: 'Business', level: 0, xpRequired: 2000, currentXp: 0, icon: <Trophy className="w-6 h-6" />, prerequisites: ['sales-101'], courses: ['fechando-contratos'], position: { x: 1, y: 2 } },
  { id: 'growth', name: 'Growth Marketing', category: 'Business', level: 1, xpRequired: 1500, currentXp: 300, icon: <TrendingUp className="w-6 h-6" />, prerequisites: ['sales-101'], courses: ['growth-101'], position: { x: 2, y: 2 } },

  // AI Track
  { id: 'ai-basics', name: 'AI Fundamentals', category: 'AI', level: 3, xpRequired: 1000, currentXp: 900, icon: <Zap className="w-6 h-6" />, prerequisites: [], courses: ['ai-basics'], position: { x: 0, y: 3 } },
  { id: 'prompting', name: 'Prompt Engineering', category: 'AI', level: 2, xpRequired: 1500, currentXp: 750, icon: <Brain className="w-6 h-6" />, prerequisites: ['ai-basics'], courses: ['ai-prompting'], position: { x: 1, y: 3 } },
  { id: 'ai-products', name: 'AI Product Design', category: 'AI', level: 0, xpRequired: 2500, currentXp: 0, icon: <Rocket className="w-6 h-6" />, prerequisites: ['prompting', 'discovery'], courses: [], position: { x: 2, y: 3 } },
];

const CATEGORIES = ['All', 'Product', 'Engineering', 'Business', 'AI'];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Product': return 'from-purple-500 to-purple-700';
    case 'Engineering': return 'from-blue-500 to-blue-700';
    case 'Business': return 'from-amber-500 to-amber-700';
    case 'AI': return 'from-emerald-500 to-emerald-700';
    default: return 'from-zinc-500 to-zinc-700';
  }
};

const getLevelLabel = (level: number) => {
  switch (level) {
    case 0: return 'Bloqueado';
    case 1: return 'Aprendiz';
    case 2: return 'Praticante';
    case 3: return 'Proficiente';
    case 4: return 'Avançado';
    case 5: return 'Mestre';
    default: return 'Desconhecido';
  }
};

export const AcademySkillTree: React.FC<{ onBack?: () => void; onNavigateToCourse?: (courseId: string) => void }> = ({ onBack, onNavigateToCourse }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');

  // Use the new skill tree hook
  const { stats } = useSkillTree();

  const filteredSkills = selectedCategory === 'All'
    ? SKILL_TREE
    : SKILL_TREE.filter(s => s.category === selectedCategory);

  // Stats from legacy system (for backwards compat)
  const totalXP = SKILL_TREE.reduce((acc, s) => acc + s.currentXp, 0);
  const unlockedSkills = SKILL_TREE.filter(s => s.level > 0).length;
  const masteredSkills = SKILL_TREE.filter(s => s.level === 5).length;

  // Calculate user level from XP
  const userLevel = Math.floor(totalXP / 1000) + 1;
  const xpForNextLevel = (userLevel * 1000) - totalXP;

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
            <h1 className="text-3xl font-bold text-zinc-100 italic font-serif">Skill Tree</h1>
            <p className="text-zinc-400 mt-1 text-base">
              Visualize e evolua suas habilidades.
            </p>
          </div>
        </div>
      </div>

      {/* User Level Card */}
      <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-500/30 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{userLevel}</span>
            </div>
            <div>
              <p className="text-sm text-amber-400/80 uppercase tracking-wider font-semibold">Seu Nível</p>
              <p className="text-2xl font-bold text-amber-100">
                {userLevel < 5 ? 'Aprendiz' : userLevel < 10 ? 'Explorador' : userLevel < 20 ? 'Especialista' : 'Mestre'}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-amber-900/50 rounded-full w-32">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all"
                    style={{ width: `${((1000 - xpForNextLevel) / 1000) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-amber-400">{xpForNextLevel} XP para o próximo</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">{totalXP.toLocaleString()}</p>
              <p className="text-xs text-zinc-400 uppercase">XP Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">{unlockedSkills}</p>
              <p className="text-xs text-zinc-400 uppercase">Desbloqueadas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-zinc-100">{masteredSkills}</p>
              <p className="text-xs text-zinc-400 uppercase">Dominadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle + Category Filter */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg mr-4">
            <button
              onClick={() => setViewMode('tree')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'tree'
                  ? 'bg-amber-500 text-black'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <TreeDeciduous className="w-4 h-4" />
              Árvore
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-black'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Target className="w-4 h-4" />
              Grid
            </button>
          </div>

          {/* Category Filter (only for grid view) */}
          {viewMode === 'grid' && CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RPG Skill Tree View (NEW) */}
      {viewMode === 'tree' && (
        <div className="mb-8">
          <SkillTreeGrid onNavigateToCourse={onNavigateToCourse} />
        </div>
      )}

      {/* Legacy Grid View */}
      {viewMode === 'grid' && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.map(skill => {
          const isLocked = skill.level === 0;
          const progress = (skill.currentXp / skill.xpRequired) * 100;

          return (
            <div
              key={skill.id}
              onClick={() => !isLocked && setSelectedSkill(skill)}
              className={`bg-[#0A0A0A] border rounded-xl p-5 transition-all ${
                isLocked
                  ? 'border-zinc-800/50 opacity-50 cursor-not-allowed'
                  : 'border-zinc-800 hover:border-zinc-700 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryColor(skill.category)}`}>
                  {isLocked ? <Lock className="w-6 h-6 text-white/50" /> : skill.icon}
                </div>
                <Badge variant={isLocked ? 'secondary' : skill.level === 5 ? 'default' : 'outline'}>
                  {getLevelLabel(skill.level)}
                </Badge>
              </div>

              <h3 className={`font-semibold mb-1 ${isLocked ? 'text-zinc-500' : 'text-zinc-100'}`}>
                {skill.name}
              </h3>
              <p className="text-sm text-zinc-500 mb-4">{skill.category}</p>

              {/* Progress */}
              {!isLocked && (
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-zinc-400">{skill.currentXp.toLocaleString()} XP</span>
                    <span className="text-zinc-500">{skill.xpRequired.toLocaleString()} XP</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getCategoryColor(skill.category)} rounded-full transition-all`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {isLocked && skill.prerequisites.length > 0 && (
                <p className="text-xs text-zinc-600 mt-2">
                  Requer: {skill.prerequisites.join(', ')}
                </p>
              )}

              {skill.level === 5 && (
                <div className="flex items-center gap-2 mt-3 text-amber-400">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Habilidade Dominada!</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}

      {/* Skill Detail Modal (Legacy Grid View) */}
      {viewMode === 'grid' && selectedSkill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSkill(null)}>
          <div className="bg-[#0A0A0A] border border-zinc-800 rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${getCategoryColor(selectedSkill.category)}`}>
                {selectedSkill.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-100">{selectedSkill.name}</h2>
                <p className="text-zinc-400">{selectedSkill.category}</p>
              </div>
            </div>

            {/* Level Progress */}
            <div className="bg-zinc-900/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-400">Nível Atual</span>
                <span className="text-lg font-bold text-zinc-100">{getLevelLabel(selectedSkill.level)}</span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map(lvl => (
                  <div
                    key={lvl}
                    className={`flex-1 h-2 rounded-full ${
                      lvl <= selectedSkill.level
                        ? `bg-gradient-to-r ${getCategoryColor(selectedSkill.category)}`
                        : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">{selectedSkill.currentXp.toLocaleString()} XP</span>
                <span className="text-zinc-500">Próximo: {selectedSkill.xpRequired.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Related Courses */}
            {selectedSkill.courses.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Cursos Relacionados</h3>
                <div className="space-y-2 mb-6">
                  {selectedSkill.courses.map(courseId => {
                    const course = ACADEMY_COURSES.find(c => c.id === courseId);
                    if (!course) return null;
                    return (
                      <div key={courseId} className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-zinc-500" />
                          <div>
                            <p className="text-sm font-medium text-zinc-200">{course.title}</p>
                            <p className="text-xs text-zinc-500">{course.lessonsCount} aulas • {course.duration}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setSelectedSkill(null)}>Fechar</Button>
              <Button className="flex-1">Continuar Aprendendo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
