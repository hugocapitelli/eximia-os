import React, { useState } from 'react';
import {
  GripVertical,
  PenTool,
  Trash2,
  Eye,
  EyeOff,
  ChevronRight,
  MoreVertical,
  Search,
  BookOpen,
} from 'lucide-react';
import { AcademyCourse } from '../../types';

interface CourseManagerProps {
  courses: AcademyCourse[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
  onTogglePublish: (id: string) => void;
  onPreview: (id: string) => void;
}

export const CourseManager: React.FC<CourseManagerProps> = ({
  courses,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  onTogglePublish,
  onPreview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (courseId: string) => {
    setDraggedItem(courseId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newOrder = [...courses.map((c) => c.id)];
    const draggedIdx = newOrder.indexOf(draggedItem);
    const targetIdx = newOrder.indexOf(targetId);

    newOrder.splice(draggedIdx, 1);
    newOrder.splice(targetIdx, 0, draggedItem);

    onReorder(newOrder);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Buscar cursos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>

      {/* Course List */}
      <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-4 px-4 py-3 border-b border-[#1F1F22] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          <div></div>
          <div>Curso</div>
          <div>Progresso</div>
          <div>Status</div>
          <div className="text-right">Ações</div>
        </div>

        {/* Rows */}
        {filteredCourses.length === 0 ? (
          <div className="py-12 text-center">
            <BookOpen className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Nenhum curso encontrado</p>
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div
              key={course.id}
              draggable
              onDragStart={() => handleDragStart(course.id)}
              onDragOver={(e) => handleDragOver(e, course.id)}
              onDragEnd={handleDragEnd}
              className={`
                grid grid-cols-[40px_1fr_120px_100px_80px] gap-4 px-4 py-3
                border-b border-[#1F1F22] last:border-b-0
                hover:bg-white/5 transition-colors group
                ${draggedItem === course.id ? 'opacity-50 bg-amber-500/10' : ''}
              `}
            >
              {/* Drag Handle */}
              <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
              </div>

              {/* Course Info */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-lg flex-shrink-0 bg-cover bg-center"
                  style={{
                    backgroundImage: course.thumbnail
                      ? `url(${course.thumbnail})`
                      : 'linear-gradient(135deg, #27272a 0%, #18181b 100%)',
                  }}
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-white truncate">
                    {course.title}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate">
                    {course.instructor || 'Sem instrutor'}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-zinc-500">
                      {course.completedLessons || 0}/{course.totalLessons || 0}
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{
                        width: `${
                          course.totalLessons
                            ? ((course.completedLessons || 0) / course.totalLessons) *
                              100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center">
                <button
                  onClick={() => onTogglePublish(course.id)}
                  className={`
                    flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors
                    ${
                      course.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
                    }
                  `}
                >
                  {course.status === 'published' ? (
                    <>
                      <Eye className="w-3 h-3" /> Público
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Rascunho
                    </>
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-1">
                <button
                  onClick={() => onPreview(course.id)}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(course.id)}
                  className="p-2 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                  title="Editar"
                >
                  <PenTool className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(course.id)}
                  className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>{filteredCourses.length} cursos</span>
        <span>
          {courses.filter((c) => c.status === 'published').length} publicados •{' '}
          {courses.filter((c) => c.status !== 'published').length} rascunhos
        </span>
      </div>
    </div>
  );
};

export default CourseManager;
