import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Layers,
  Star,
  Sparkles,
} from 'lucide-react';
import { ACADEMY_COURSES, ACADEMY_TRACKS } from '../../constants';
import {
  AdminPanel,
  AdminHeader,
  CourseManager,
  TrackManager,
  FeaturedManager,
} from '../admin';

type TabId = 'courses' | 'tracks' | 'featured';

interface AdminAcademyStudioProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminAcademyStudio: React.FC<AdminAcademyStudioProps> = ({
  onBack,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('courses');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Local state for courses and tracks
  const [courses, setCourses] = useState(ACADEMY_COURSES);
  const [tracks, setTracks] = useState(ACADEMY_TRACKS);
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    ACADEMY_COURSES.filter((c) => c.isFeatured).map((c) => c.id)
  );

  const tabs = [
    { id: 'courses' as TabId, label: 'Cursos', icon: BookOpen, count: courses.length },
    { id: 'tracks' as TabId, label: 'Trilhas', icon: Layers, count: tracks.length },
    { id: 'featured' as TabId, label: 'Destaques', icon: Star, count: featuredIds.length },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  // Course handlers
  const handleAddCourse = () => {
    console.log('Add course');
    setHasUnsavedChanges(true);
  };

  const handleEditCourse = (id: string) => {
    onNavigate?.(`academy-editor`);
  };

  const handleDeleteCourse = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const handleReorderCourses = (ids: string[]) => {
    const ordered = ids
      .map((id) => courses.find((c) => c.id === id))
      .filter(Boolean) as typeof courses;
    setCourses(ordered);
    setHasUnsavedChanges(true);
  };

  const handleTogglePublish = (id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'published' ? 'draft' : 'published' }
          : c
      )
    );
    setHasUnsavedChanges(true);
  };

  const handlePreviewCourse = (id: string) => {
    onNavigate?.('academy-lesson');
  };

  // Track handlers
  const handleAddTrack = () => {
    console.log('Add track');
    setHasUnsavedChanges(true);
  };

  const handleEditTrack = (id: string) => {
    console.log('Edit track:', id);
    setHasUnsavedChanges(true);
  };

  const handleDeleteTrack = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta trilha?')) {
      setTracks((prev) => prev.filter((t) => t.id !== id));
      setHasUnsavedChanges(true);
    }
  };

  const handleReorderTracks = (ids: string[]) => {
    const ordered = ids
      .map((id) => tracks.find((t) => t.id === id))
      .filter(Boolean) as typeof tracks;
    setTracks(ordered);
    setHasUnsavedChanges(true);
  };

  const handleAssignCourses = (trackId: string) => {
    console.log('Assign courses to track:', trackId);
  };

  // Featured handlers
  const handleUpdateFeatured = (ids: string[]) => {
    setFeaturedIds(ids);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Admin Header */}
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Academy Studio' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        {/* Admin Panel */}
        <AdminPanel
          icon={GraduationCap}
          title="Academy Studio"
          description="Gerencie cursos, trilhas e conteúdo destacado da Academy."
          onAddNew={activeTab === 'courses' ? handleAddCourse : activeTab === 'tracks' ? handleAddTrack : undefined}
          onGenerateAI={() => console.log('Generate with AI')}
          addNewLabel={activeTab === 'courses' ? 'Novo Curso' : activeTab === 'tracks' ? 'Nova Trilha' : undefined}
          showDefaultActions={activeTab !== 'featured'}
        />

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#1F1F22] pb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === tab.id
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    activeTab === tab.id
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <CourseManager
            courses={courses}
            onAdd={handleAddCourse}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            onReorder={handleReorderCourses}
            onTogglePublish={handleTogglePublish}
            onPreview={handlePreviewCourse}
          />
        )}

        {activeTab === 'tracks' && (
          <TrackManager
            tracks={tracks}
            onAdd={handleAddTrack}
            onEdit={handleEditTrack}
            onDelete={handleDeleteTrack}
            onReorder={handleReorderTracks}
            onAssignCourses={handleAssignCourses}
          />
        )}

        {activeTab === 'featured' && (
          <FeaturedManager
            allCourses={courses}
            featuredIds={featuredIds}
            onUpdateFeatured={handleUpdateFeatured}
            maxFeatured={5}
          />
        )}
      </div>
    </div>
  );
};

export default AdminAcademyStudio;
