import React, { useState } from 'react';
import { Layers, GripVertical, PenTool, Trash2, Plus, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';
import { ACADEMY_TRACKS } from '../../constants';
import { AcademyTrack } from '../../types';

interface AdminTrackManagerProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminTrackManager: React.FC<AdminTrackManagerProps> = ({
  onBack,
  onNavigate,
}) => {
  const [tracks, setTracks] = useState<AcademyTrack[]>(ACADEMY_TRACKS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleAddTrack = () => {
    const newTrack: AcademyTrack = {
      id: `track-${Date.now()}`,
      title: 'Nova Trilha',
      description: 'Descrição da trilha',
      icon: Sparkles,
      color: 'from-zinc-500 to-zinc-700',
      courseCount: 0,
      completedCount: 0,
    };
    setTracks([...tracks, newTrack]);
    setHasUnsavedChanges(true);
    setEditingTrack(newTrack.id);
  };

  const handleDeleteTrack = (trackId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta trilha?')) {
      setTracks(tracks.filter((t) => t.id !== trackId));
      setHasUnsavedChanges(true);
    }
  };

  const handleEditTrack = (trackId: string) => {
    setEditingTrack(editingTrack === trackId ? null : trackId);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Academy Studio', onClick: onBack },
          { label: 'Gerenciar Trilhas' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={Layers}
          title="Gerenciar Trilhas"
          description="Configure trilhas de aprendizado e organize cursos em caminhos estruturados."
          onAddNew={handleAddTrack}
          onGenerateAI={() => console.log('Generate with AI')}
          addNewLabel="Nova Trilha"
        />

        {/* Track List */}
        <div className="space-y-3">
          {tracks.length === 0 ? (
            <div className="text-center py-16">
              <Layers className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">Nenhuma trilha cadastrada</p>
              <p className="text-zinc-600 text-sm mt-1">
                Clique em "Nova Trilha" para começar
              </p>
            </div>
          ) : (
            tracks.map((track, index) => (
              <div
                key={track.id}
                className={`
                  bg-[#0A0A0A] border rounded-xl p-5 transition-all
                  ${editingTrack === track.id
                    ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                    : 'border-[#1F1F22] hover:border-zinc-700'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-zinc-600" />
                  </div>

                  {/* Track Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${track.color || 'from-zinc-600 to-zinc-700'}`}
                  >
                    {track.emoji ? (
                      <span className="text-2xl">{track.emoji}</span>
                    ) : (
                      <Layers className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{track.title}</h3>
                    <p className="text-sm text-zinc-500 truncate">{track.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-zinc-600">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {track.courseCount} cursos
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {track.completedCount} concluídos
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditTrack(track.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        editingTrack === track.id
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'text-zinc-500 hover:text-amber-500 hover:bg-white/5'
                      }`}
                      aria-label="Editar trilha"
                    >
                      <PenTool className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                      aria-label="Excluir trilha"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Edit Form */}
                {editingTrack === track.id && (
                  <div className="mt-4 pt-4 border-t border-[#1F1F22]">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Título
                        </label>
                        <input
                          type="text"
                          value={track.title}
                          onChange={(e) => {
                            setTracks(
                              tracks.map((t) =>
                                t.id === track.id ? { ...t, title: e.target.value } : t
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                          Emoji
                        </label>
                        <input
                          type="text"
                          value={track.emoji || ''}
                          onChange={(e) => {
                            setTracks(
                              tracks.map((t) =>
                                t.id === track.id ? { ...t, emoji: e.target.value } : t
                              )
                            );
                            setHasUnsavedChanges(true);
                          }}
                          className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                          placeholder="🚀"
                        />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                        Descrição
                      </label>
                      <textarea
                        value={track.description}
                        onChange={(e) => {
                          setTracks(
                            tracks.map((t) =>
                              t.id === track.id ? { ...t, description: e.target.value } : t
                            )
                          );
                          setHasUnsavedChanges(true);
                        }}
                        rows={2}
                        className="w-full px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50 resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTrackManager;
