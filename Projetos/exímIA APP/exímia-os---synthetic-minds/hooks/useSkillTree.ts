import { useState, useEffect, useCallback, useMemo } from 'react';

export type SkillNodeState = 'locked' | 'available' | 'in_progress' | 'completed' | 'mastered';

export interface SkillNode {
  id: string;
  name: string;
  icon: string;
  state: SkillNodeState;
  progress: number; // 0-100
  tier: number; // 1=basic, 2=intermediate, 3=advanced, 4=master
  prerequisites: string[];
  coursesRequired: string[];
  coursesCompleted: string[];
  description?: string;
}

export interface SkillConnection {
  from: string;
  to: string;
  isActive: boolean;
}

const SKILLS_STORAGE_KEY = 'eximia-skill-tree';

// Initial skill tree data for exímIA OS
const INITIAL_SKILLS: SkillNode[] = [
  // Tier 4 (Master)
  {
    id: 'master',
    name: 'Master',
    icon: '🎯',
    state: 'locked',
    progress: 0,
    tier: 4,
    prerequisites: ['analise', 'design', 'inovacao'],
    coursesRequired: ['master-thesis'],
    coursesCompleted: [],
    description: 'Maestria completa - domínio de todas as áreas',
  },
  // Tier 3 (Advanced)
  {
    id: 'analise',
    name: 'Análise',
    icon: '📊',
    state: 'in_progress',
    progress: 65,
    tier: 3,
    prerequisites: ['metricas', 'research'],
    coursesRequired: ['analytics-advanced', 'data-science'],
    coursesCompleted: ['analytics-advanced'],
    description: 'Análise avançada de dados e insights',
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    state: 'available',
    progress: 0,
    tier: 3,
    prerequisites: ['sketch'],
    coursesRequired: ['design-systems', 'ux-mastery'],
    coursesCompleted: [],
    description: 'Design de produtos e experiências',
  },
  {
    id: 'inovacao',
    name: 'Inovação',
    icon: '💡',
    state: 'locked',
    progress: 0,
    tier: 3,
    prerequisites: ['ideacao', 'execucao'],
    coursesRequired: ['innovation-lab'],
    coursesCompleted: [],
    description: 'Inovação e pensamento disruptivo',
  },
  // Tier 2 (Intermediate)
  {
    id: 'metricas',
    name: 'Métricas',
    icon: '📈',
    state: 'completed',
    progress: 100,
    tier: 2,
    prerequisites: ['kpis', 'dashboards'],
    coursesRequired: ['metrics-101', 'kpi-design'],
    coursesCompleted: ['metrics-101', 'kpi-design'],
    description: 'Definição e acompanhamento de métricas',
  },
  {
    id: 'research',
    name: 'Research',
    icon: '🔍',
    state: 'completed',
    progress: 100,
    tier: 2,
    prerequisites: ['labs', 'docs'],
    coursesRequired: ['user-research', 'qual-quant'],
    coursesCompleted: ['user-research', 'qual-quant'],
    description: 'Pesquisa de usuários e mercado',
  },
  {
    id: 'sketch',
    name: 'Sketch',
    icon: '✏️',
    state: 'completed',
    progress: 100,
    tier: 2,
    prerequisites: ['ui', 'wireframe'],
    coursesRequired: ['sketching-101', 'rapid-prototype'],
    coursesCompleted: ['sketching-101', 'rapid-prototype'],
    description: 'Esboços rápidos e prototipagem',
  },
  {
    id: 'ideacao',
    name: 'Ideação',
    icon: '💭',
    state: 'in_progress',
    progress: 40,
    tier: 2,
    prerequisites: [],
    coursesRequired: ['design-thinking', 'brainstorm'],
    coursesCompleted: ['design-thinking'],
    description: 'Geração de ideias e conceitos',
  },
  {
    id: 'execucao',
    name: 'Execução',
    icon: '🚀',
    state: 'available',
    progress: 0,
    tier: 2,
    prerequisites: ['speed', 'goals'],
    coursesRequired: ['agile-basics', 'delivery'],
    coursesCompleted: [],
    description: 'Entrega e execução de projetos',
  },
  // Tier 1 (Basic)
  {
    id: 'kpis',
    name: 'KPIs',
    icon: '📉',
    state: 'mastered',
    progress: 100,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['kpi-fundamentals'],
    coursesCompleted: ['kpi-fundamentals'],
    description: 'Indicadores-chave de performance',
  },
  {
    id: 'dashboards',
    name: 'Dashboards',
    icon: '📊',
    state: 'completed',
    progress: 100,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['dashboard-design'],
    coursesCompleted: ['dashboard-design'],
    description: 'Criação de dashboards efetivos',
  },
  {
    id: 'labs',
    name: 'Labs',
    icon: '🔬',
    state: 'completed',
    progress: 100,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['ux-labs'],
    coursesCompleted: ['ux-labs'],
    description: 'Laboratórios de experimentação',
  },
  {
    id: 'docs',
    name: 'Docs',
    icon: '📚',
    state: 'completed',
    progress: 100,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['documentation'],
    coursesCompleted: ['documentation'],
    description: 'Documentação e especificações',
  },
  {
    id: 'ui',
    name: 'UI',
    icon: '🖌',
    state: 'completed',
    progress: 100,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['ui-basics'],
    coursesCompleted: ['ui-basics'],
    description: 'Design de interface',
  },
  {
    id: 'wireframe',
    name: 'Wireframe',
    icon: '📐',
    state: 'completed',
    progress: 100,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['wireframing-101'],
    coursesCompleted: ['wireframing-101'],
    description: 'Wireframes e estrutura de páginas',
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: '⚡',
    state: 'completed',
    progress: 100,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['productivity'],
    coursesCompleted: ['productivity'],
    description: 'Velocidade e produtividade',
  },
  {
    id: 'goals',
    name: 'Goals',
    icon: '🎯',
    state: 'in_progress',
    progress: 60,
    tier: 1,
    prerequisites: [],
    coursesRequired: ['goal-setting', 'okr'],
    coursesCompleted: ['goal-setting'],
    description: 'Definição de metas e OKRs',
  },
];

// Generate connections from skill prerequisites
const generateConnections = (skills: SkillNode[]): SkillConnection[] => {
  const connections: SkillConnection[] = [];

  skills.forEach(skill => {
    skill.prerequisites.forEach(prereqId => {
      const prereq = skills.find(s => s.id === prereqId);
      if (prereq) {
        const isActive = prereq.state === 'completed' || prereq.state === 'mastered';
        connections.push({
          from: prereqId,
          to: skill.id,
          isActive,
        });
      }
    });
  });

  return connections;
};

export interface UseSkillTreeReturn {
  skills: SkillNode[];
  connections: SkillConnection[];
  selectedSkill: SkillNode | null;
  hoveredSkill: SkillNode | null;
  isLoading: boolean;
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    locked: number;
    mastered: number;
  };
  selectSkill: (skillId: string | null) => void;
  hoverSkill: (skillId: string | null) => void;
  getSkill: (skillId: string) => SkillNode | undefined;
  getSkillsByTier: (tier: number) => SkillNode[];
  updateSkillProgress: (skillId: string, progress: number) => void;
  completeSkill: (skillId: string) => void;
}

export const useSkillTree = (): UseSkillTreeReturn => {
  const [skills, setSkills] = useState<SkillNode[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(SKILLS_STORAGE_KEY);
    if (stored) {
      try {
        setSkills(JSON.parse(stored));
      } catch {
        setSkills(INITIAL_SKILLS);
        localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(INITIAL_SKILLS));
      }
    } else {
      setSkills(INITIAL_SKILLS);
      localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(INITIAL_SKILLS));
    }
    setIsLoading(false);
  }, []);

  // Calculate connections from skill data
  const connections = useMemo(() => generateConnections(skills), [skills]);

  // Get selected skill object
  const selectedSkill = useMemo(() => {
    if (!selectedSkillId) return null;
    return skills.find(s => s.id === selectedSkillId) || null;
  }, [skills, selectedSkillId]);

  // Get hovered skill object
  const hoveredSkill = useMemo(() => {
    if (!hoveredSkillId) return null;
    return skills.find(s => s.id === hoveredSkillId) || null;
  }, [skills, hoveredSkillId]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = skills.length;
    const completed = skills.filter(s => s.state === 'completed').length;
    const inProgress = skills.filter(s => s.state === 'in_progress').length;
    const locked = skills.filter(s => s.state === 'locked').length;
    const mastered = skills.filter(s => s.state === 'mastered').length;
    return { total, completed, inProgress, locked, mastered };
  }, [skills]);

  const selectSkill = useCallback((skillId: string | null) => {
    setSelectedSkillId(skillId);
  }, []);

  const hoverSkill = useCallback((skillId: string | null) => {
    setHoveredSkillId(skillId);
  }, []);

  const getSkill = useCallback((skillId: string) => {
    return skills.find(s => s.id === skillId);
  }, [skills]);

  const getSkillsByTier = useCallback((tier: number) => {
    return skills.filter(s => s.tier === tier);
  }, [skills]);

  const updateSkillProgress = useCallback((skillId: string, progress: number) => {
    setSkills(prev => {
      const updated = prev.map(s => {
        if (s.id === skillId) {
          let newState: SkillNodeState = s.state;
          if (progress === 100) {
            newState = 'completed';
          } else if (progress > 0) {
            newState = 'in_progress';
          }
          return { ...s, progress, state: newState };
        }
        return s;
      });
      localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeSkill = useCallback((skillId: string) => {
    setSkills(prev => {
      const updated = prev.map(s => {
        if (s.id === skillId) {
          return { ...s, progress: 100, state: 'completed' as SkillNodeState };
        }
        return s;
      });

      // Update dependent skills to 'available' if prerequisites are met
      const withUnlocks = updated.map(s => {
        if (s.state === 'locked') {
          const prereqsMet = s.prerequisites.every(prereqId => {
            const prereq = updated.find(p => p.id === prereqId);
            return prereq && (prereq.state === 'completed' || prereq.state === 'mastered');
          });
          if (prereqsMet) {
            return { ...s, state: 'available' as SkillNodeState };
          }
        }
        return s;
      });

      localStorage.setItem(SKILLS_STORAGE_KEY, JSON.stringify(withUnlocks));
      return withUnlocks;
    });
  }, []);

  return {
    skills,
    connections,
    selectedSkill,
    hoveredSkill,
    isLoading,
    stats,
    selectSkill,
    hoverSkill,
    getSkill,
    getSkillsByTier,
    updateSkillProgress,
    completeSkill,
  };
};

export default useSkillTree;
