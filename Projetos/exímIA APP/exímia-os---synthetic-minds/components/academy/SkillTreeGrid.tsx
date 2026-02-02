import React, { useState, useCallback } from 'react';
import { useSkillTree, SkillNode as SkillNodeType } from '../../hooks/useSkillTree';
import { SkillDetailModal } from './SkillDetailModal';
import { Target } from 'lucide-react';

interface SkillTreeGridProps {
  onNavigateToCourse?: (courseId: string) => void;
  isEditorMode?: boolean;
}

// Skill categories for display
const SKILL_CATEGORIES: Record<string, { label: string; color: string }> = {
  product: { label: 'PRODUCT', color: 'text-amber-500' },
  business: { label: 'BUSINESS', color: 'text-blue-400' },
  engineering: { label: 'ENGINEERING', color: 'text-emerald-400' },
  management: { label: 'MANAGEMENT', color: 'text-violet-400' },
  design: { label: 'DESIGN', color: 'text-pink-400' },
  data: { label: 'DATA', color: 'text-cyan-400' },
};

// Map skill to category based on tier/type
const getSkillCategory = (skill: SkillNodeType): { label: string; color: string } => {
  // Simple mapping based on skill name/characteristics
  if (skill.name.toLowerCase().includes('kpi') || skill.name.toLowerCase().includes('métrica') || skill.name.toLowerCase().includes('dashboard')) {
    return SKILL_CATEGORIES.data;
  }
  if (skill.name.toLowerCase().includes('design') || skill.name.toLowerCase().includes('ui') || skill.name.toLowerCase().includes('sketch') || skill.name.toLowerCase().includes('wireframe')) {
    return SKILL_CATEGORIES.design;
  }
  if (skill.name.toLowerCase().includes('research') || skill.name.toLowerCase().includes('labs') || skill.name.toLowerCase().includes('docs')) {
    return SKILL_CATEGORIES.product;
  }
  if (skill.name.toLowerCase().includes('goal') || skill.name.toLowerCase().includes('exec') || skill.name.toLowerCase().includes('speed')) {
    return SKILL_CATEGORIES.management;
  }
  if (skill.name.toLowerCase().includes('inovação') || skill.name.toLowerCase().includes('ideação')) {
    return SKILL_CATEGORIES.business;
  }
  return SKILL_CATEGORIES.product;
};

// Skill Card Component matching Image 1
const SkillCard: React.FC<{
  skill: SkillNodeType;
  onClick: () => void;
}> = ({ skill, onClick }) => {
  const category = getSkillCategory(skill);
  const progress = skill.progress || 0;

  return (
    <div
      onClick={onClick}
      className="
        bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-5
        cursor-pointer transition-all duration-200
        hover:border-zinc-700 hover:bg-zinc-900/50
        group
      "
    >
      {/* Header: Title + Percentage */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-amber-50 transition-colors">
            {skill.name}
          </h3>
          <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${category.color}`}>
            {category.label}
          </p>
        </div>
        <span className="text-2xl font-bold text-amber-500">
          {progress}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export const SkillTreeGrid: React.FC<SkillTreeGridProps> = ({
  onNavigateToCourse,
  isEditorMode = false,
}) => {
  const {
    skills,
    selectedSkill,
    isLoading,
    selectSkill,
  } = useSkillTree();

  const [showModal, setShowModal] = useState(false);

  // Group skills by general categories for display
  const groupedSkills = React.useMemo(() => {
    // Create display groups - take a representative sample
    const groups = [
      { name: 'Product Discovery', category: 'PRODUCT', progress: 45, id: 'product-discovery' },
      { name: 'Strategic Thinking', category: 'BUSINESS', progress: 30, id: 'strategic-thinking' },
      { name: 'System Architecture', category: 'ENGINEERING', progress: 10, id: 'system-architecture' },
      { name: 'Leadership', category: 'MANAGEMENT', progress: 15, id: 'leadership' },
    ];

    // If we have real skills, use them instead
    if (skills.length > 0) {
      const realGroups: Array<{ name: string; category: string; progress: number; id: string }> = [];

      // Get unique skill groups
      const seenCategories = new Set<string>();
      skills.forEach(skill => {
        const cat = getSkillCategory(skill);
        if (!seenCategories.has(cat.label) && realGroups.length < 6) {
          seenCategories.add(cat.label);
          realGroups.push({
            name: skill.name,
            category: cat.label,
            progress: skill.progress,
            id: skill.id,
          });
        }
      });

      // Fill remaining with defaults if needed
      if (realGroups.length < 4) {
        groups.forEach(g => {
          if (realGroups.length < 4 && !realGroups.find(r => r.category === g.category)) {
            realGroups.push(g);
          }
        });
      }

      return realGroups;
    }

    return groups;
  }, [skills]);

  const handleCardClick = useCallback((skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      selectSkill(skill.id);
      setShowModal(true);
    }
  }, [skills, selectSkill]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    selectSkill(null);
  }, [selectSkill]);

  const handleStartCourse = useCallback((courseId: string) => {
    if (onNavigateToCourse) {
      onNavigateToCourse(courseId);
      handleCloseModal();
    }
  }, [onNavigateToCourse, handleCloseModal]);

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-amber-500 animate-spin mb-4" />
        <p className="text-zinc-500 text-sm">Carregando habilidades...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 2-column grid of skill cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupedSkills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => handleCardClick(skill.id)}
            className="
              bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-5
              cursor-pointer transition-all duration-200
              hover:border-zinc-700 hover:bg-zinc-900/50
              group
            "
          >
            {/* Header: Title + Percentage */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-50 transition-colors">
                  {skill.name}
                </h3>
                <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                  skill.category === 'PRODUCT' ? 'text-amber-500' :
                  skill.category === 'BUSINESS' ? 'text-blue-400' :
                  skill.category === 'ENGINEERING' ? 'text-emerald-400' :
                  skill.category === 'MANAGEMENT' ? 'text-violet-400' :
                  'text-amber-500'
                }`}>
                  {skill.category}
                </p>
              </div>
              <span className="text-2xl font-bold text-amber-500">
                {skill.progress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state if no skills */}
      {groupedSkills.length === 0 && (
        <div className="w-full flex flex-col items-center justify-center py-16">
          <Target className="w-12 h-12 text-zinc-600 mb-4" />
          <p className="text-zinc-400 text-lg font-medium mb-2">Nenhuma habilidade encontrada</p>
          <p className="text-zinc-600 text-sm">As habilidades serão desbloqueadas conforme você progride.</p>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selectedSkill && (
        <SkillDetailModal
          skill={selectedSkill}
          onClose={handleCloseModal}
          onStartCourse={handleStartCourse}
        />
      )}
    </div>
  );
};

export default SkillTreeGrid;
