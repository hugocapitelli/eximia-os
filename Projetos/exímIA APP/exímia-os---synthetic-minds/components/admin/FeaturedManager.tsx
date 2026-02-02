import React, { useState } from 'react';
import {
  GripVertical,
  Plus,
  X,
  Search,
  Star,
  Image,
} from 'lucide-react';
import { AcademyCourse } from '../../types';
import { Button } from '../atoms/Button';

interface FeaturedManagerProps {
  allCourses: AcademyCourse[];
  featuredIds: string[];
  onUpdateFeatured: (ids: string[]) => void;
  maxFeatured?: number;
}

export const FeaturedManager: React.FC<FeaturedManagerProps> = ({
  allCourses,
  featuredIds,
  onUpdateFeatured,
  maxFeatured = 5,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const featuredCourses = featuredIds
    .map((id) => allCourses.find((c) => c.id === id))
    .filter(Boolean) as AcademyCourse[];

  const availableCourses = allCourses
    .filter((c) => !featuredIds.includes(c.id))
    .filter((c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAdd = (courseId: string) => {
    if (featuredIds.length < maxFeatured) {
      onUpdateFeatured([...featuredIds, courseId]);
    }
    setShowAddModal(false);
  };

  const handleRemove = (courseId: string) => {
    onUpdateFeatured(featuredIds.filter((id) => id !== courseId));
  };

  const handleDragStart = (courseId: string) => {
    setDraggedItem(courseId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newOrder = [...featuredIds];
    const draggedIdx = newOrder.indexOf(draggedItem);
    const targetIdx = newOrder.indexOf(targetId);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedItem);

    onUpdateFeatured(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          Configure os cursos que aparecem no carrossel principal.
        </p>
        <span className="text-xs text-zinc-600">
          {featuredIds.length}/{maxFeatured} slots
        </span>
      </div>

      {/* Featured List */}
      <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl overflow-hidden">
        {featuredCourses.length === 0 ? (
          <div className="py-12 text-center">
            <Star className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm mb-4">
              Nenhum curso em destaque
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setShowAddModal(true)}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-900 border-transparent"
            >
              Adicionar Destaque
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-[#1F1F22]">
            {featuredCourses.map((course, index) => (
              <div
                key={course.id}
                draggable
                onDragStart={() => handleDragStart(course.id)}
                onDragOver={(e) => handleDragOver(e, course.id)}
                onDragEnd={handleDragEnd}
                className={`
                  flex items-center gap-4 p-4 group
                  hover:bg-white/5 transition-colors
                  ${draggedItem === course.id ? 'opacity-50 bg-amber-500/10' : ''}
                `}
              >
                {/* Order + Drag */}
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-500 text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                  </div>
                </div>

                {/* Thumbnail */}
                <div
                  className="w-16 h-10 rounded-lg bg-zinc-800 bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: course.thumbnail
                      ? `url(${course.thumbnail})`
                      : undefined,
                  }}
                >
                  {!course.thumbnail && (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-4 h-4 text-zinc-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {course.title}
                  </h4>
                  <p className="text-xs text-zinc-500">{course.instructor}</p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(course.id)}
                  className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Button */}
      {featuredCourses.length > 0 && featuredCourses.length < maxFeatured && (
        <Button
          variant="secondary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setShowAddModal(true)}
          className="w-full"
        >
          Adicionar Destaque ({featuredIds.length}/{maxFeatured})
        </Button>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-lg m-4 p-6 rounded-2xl"
            style={{
              background: '#0A0A0A',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">
                Adicionar Destaque
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#050505] border border-[#1F1F22] rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Available Courses */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {availableCourses.length === 0 ? (
                <p className="text-center text-zinc-500 py-4">
                  Nenhum curso disponível
                </p>
              ) : (
                availableCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleAdd(course.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-amber-500/10 transition-colors text-left group"
                  >
                    <div
                      className="w-12 h-8 rounded bg-zinc-800 bg-cover bg-center flex-shrink-0"
                      style={{
                        backgroundImage: course.thumbnail
                          ? `url(${course.thumbnail})`
                          : undefined,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white truncate group-hover:text-amber-50">
                        {course.title}
                      </h4>
                      <p className="text-xs text-zinc-500">{course.instructor}</p>
                    </div>
                    <Plus className="w-4 h-4 text-zinc-500 group-hover:text-amber-500" />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedManager;
