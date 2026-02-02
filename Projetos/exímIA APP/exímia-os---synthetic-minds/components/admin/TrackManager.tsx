import React, { useState } from 'react';
import {
  GripVertical,
  PenTool,
  Trash2,
  ChevronRight,
  Search,
  Layers,
  Plus,
} from 'lucide-react';
import { AcademyTrack } from '../../types';
import { Button } from '../atoms/Button';

interface TrackManagerProps {
  tracks: AcademyTrack[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (ids: string[]) => void;
  onAssignCourses: (trackId: string) => void;
}

export const TrackManager: React.FC<TrackManagerProps> = ({
  tracks,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  onAssignCourses,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const filteredTracks = tracks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDragStart = (trackId: string) => {
    setDraggedItem(trackId);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newOrder = [...tracks.map((t) => t.id)];
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
          placeholder="Buscar trilhas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
        />
      </div>

      {/* Tracks List */}
      <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[40px_1fr_120px_100px_80px] gap-4 px-4 py-3 border-b border-[#1F1F22] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          <div></div>
          <div>Trilha</div>
          <div>Cursos</div>
          <div>Progresso</div>
          <div className="text-right">Ações</div>
        </div>

        {/* Rows */}
        {filteredTracks.length === 0 ? (
          <div className="py-12 text-center">
            <Layers className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">Nenhuma trilha encontrada</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4"
              icon={<Plus className="w-4 h-4" />}
              onClick={onAdd}
            >
              Criar Trilha
            </Button>
          </div>
        ) : (
          filteredTracks.map((track) => {
            const progress =
              track.courseCount && track.completedCount
                ? Math.round((track.completedCount / track.courseCount) * 100)
                : 0;

            return (
              <div
                key={track.id}
                draggable
                onDragStart={() => handleDragStart(track.id)}
                onDragOver={(e) => handleDragOver(e, track.id)}
                onDragEnd={handleDragEnd}
                className={`
                  grid grid-cols-[40px_1fr_120px_100px_80px] gap-4 px-4 py-3
                  border-b border-[#1F1F22] last:border-b-0
                  hover:bg-white/5 transition-colors group
                  ${draggedItem === track.id ? 'opacity-50 bg-amber-500/10' : ''}
                `}
              >
                {/* Drag Handle */}
                <div className="flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400" />
                </div>

                {/* Track Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}
                  >
                    {track.emoji ? (
                      <span className="text-xl">{track.emoji}</span>
                    ) : (
                      <Layers className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-zinc-500 truncate">
                      {track.description || 'Sem descrição'}
                    </p>
                  </div>
                </div>

                {/* Courses Count */}
                <div className="flex items-center">
                  <button
                    onClick={() => onAssignCourses(track.id)}
                    className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-amber-400 transition-colors"
                  >
                    <span>{track.courseCount || 0} cursos</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Progress */}
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          progress === 100 ? 'bg-emerald-500' : 'bg-zinc-400'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(track.id)}
                    className="p-2 text-zinc-500 hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PenTool className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(track.id)}
                    className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span>{filteredTracks.length} trilhas</span>
        <span>
          {tracks.reduce((acc, t) => acc + (t.courseCount || 0), 0)} cursos no
          total
        </span>
      </div>
    </div>
  );
};

export default TrackManager;
