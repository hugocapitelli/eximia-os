import React, { useState } from 'react';
import { Image, GripVertical, Trash2, Plus, Search, X, Star, Clock, BookOpen, Palette, Check } from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';
import { ACADEMY_COURSES } from '../../constants';
import { AcademyCourse } from '../../types';
import { CarouselTheme, CAROUSEL_THEMES } from '../academy/HeroCarousel';

// Theme labels for UI
const THEME_LABELS: Record<CarouselTheme, string> = {
  'purple-magenta': 'Roxo Magenta',
  'ocean-blue': 'Azul Oceano',
  'emerald-green': 'Verde Esmeralda',
  'sunset-orange': 'Laranja Pôr-do-Sol',
  'royal-gold': 'Dourado Real',
  'deep-rose': 'Rosa Profundo',
  'cyber-teal': 'Teal Cyber',
  'midnight-indigo': 'Índigo Meia-Noite',
};

interface AdminHeroCarouselEditorProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminHeroCarouselEditor: React.FC<AdminHeroCarouselEditorProps> = ({
  onBack,
  onNavigate,
}) => {
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    ACADEMY_COURSES.filter((c) => c.isFeatured).map((c) => c.id)
  );
  const [selectedTheme, setSelectedTheme] = useState<CarouselTheme>('purple-magenta');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const maxFeatured = 5;
  const featuredCourses = featuredIds
    .map((id) => ACADEMY_COURSES.find((c) => c.id === id))
    .filter(Boolean) as AcademyCourse[];

  const availableCourses = ACADEMY_COURSES.filter(
    (c) => !featuredIds.includes(c.id)
  ).filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleAddCourse = (courseId: string) => {
    if (featuredIds.length < maxFeatured) {
      setFeaturedIds([...featuredIds, courseId]);
      setHasUnsavedChanges(true);
    }
    setShowAddModal(false);
    setSearchQuery('');
  };

  const handleRemoveCourse = (courseId: string) => {
    setFeaturedIds(featuredIds.filter((id) => id !== courseId));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Academy Studio', onClick: onBack },
          { label: 'Hero Carousel' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={Image}
          title="Hero Carousel"
          description={`Configure os cursos destacados no carrossel da Academy. ${featuredIds.length}/${maxFeatured} slots utilizados.`}
          onAddNew={featuredIds.length < maxFeatured ? () => setShowAddModal(true) : undefined}
          addNewLabel="Adicionar Curso"
          showDefaultActions={featuredIds.length < maxFeatured}
        />

        {/* Slots Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: maxFeatured }).map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-colors ${
                idx < featuredIds.length ? 'bg-amber-500' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Theme Selector */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tema de Cores</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(CAROUSEL_THEMES) as CarouselTheme[]).map((themeKey) => {
              const theme = CAROUSEL_THEMES[themeKey];
              const isSelected = selectedTheme === themeKey;
              return (
                <button
                  key={themeKey}
                  onClick={() => {
                    setSelectedTheme(themeKey);
                    setHasUnsavedChanges(true);
                  }}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-500/20'
                      : 'border-[#1F1F22] hover:border-zinc-600'
                  }`}
                >
                  {/* Theme Preview */}
                  <div
                    className="h-16 w-full"
                    style={{ background: theme.gradient }}
                  >
                    <div
                      className="h-full w-full opacity-60"
                      style={{ background: theme.wave }}
                    />
                  </div>

                  {/* Theme Label */}
                  <div className="px-3 py-2 bg-[#0A0A0A]">
                    <span className={`text-xs font-medium ${isSelected ? 'text-amber-500' : 'text-zinc-400'}`}>
                      {THEME_LABELS[themeKey]}
                    </span>
                  </div>

                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-black" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Courses List */}
        <div className="space-y-3">
          {featuredCourses.length === 0 ? (
            <div className="text-center py-16 bg-[#0A0A0A] border border-[#1F1F22] rounded-xl">
              <Image className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 text-lg">Nenhum curso destacado</p>
              <p className="text-zinc-600 text-sm mt-1">
                Adicione cursos para exibir no carrossel
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-4 py-2 bg-amber-500 text-black text-sm font-bold rounded-lg hover:bg-amber-400 transition-colors"
              >
                <Plus className="w-4 h-4 inline-block mr-1" />
                Adicionar Curso
              </button>
            </div>
          ) : (
            featuredCourses.map((course, index) => (
              <div
                key={course.id}
                className="bg-[#0A0A0A] border border-[#1F1F22] hover:border-zinc-700 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Position & Drag */}
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center bg-amber-500/10 text-amber-500 text-xs font-bold rounded">
                      {index + 1}
                    </span>
                    <div className="cursor-grab active:cursor-grabbing text-zinc-600">
                      <GripVertical className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded">
                        {course.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white truncate">{course.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.lessonsCount} lições
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveCourse(course.id)}
                    className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-white/5 rounded-lg transition-colors"
                    aria-label="Remover do carrossel"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add More Button */}
        {featuredCourses.length > 0 && featuredCourses.length < maxFeatured && (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 w-full p-4 border-2 border-dashed border-zinc-800 hover:border-amber-500/30 rounded-xl text-zinc-500 hover:text-amber-500 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar mais cursos ({maxFeatured - featuredIds.length} restantes)
          </button>
        )}
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddModal(false);
            setSearchQuery('');
          }}
        >
          <div
            className="bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-[#1F1F22] flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Adicionar Curso ao Carrossel</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                }}
                className="p-2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-[#1F1F22]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                  autoFocus
                />
              </div>
            </div>

            {/* Course List */}
            <div className="max-h-[400px] overflow-y-auto">
              {availableCourses.length === 0 ? (
                <div className="p-8 text-center text-zinc-500">
                  {searchQuery
                    ? 'Nenhum curso encontrado'
                    : 'Todos os cursos já foram adicionados'}
                </div>
              ) : (
                availableCourses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => handleAddCourse(course.id)}
                    className="w-full p-4 hover:bg-white/5 transition-colors text-left border-b border-[#1F1F22] last:border-b-0"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider rounded">
                        {course.category}
                      </span>
                    </div>
                    <h4 className="font-medium text-white">{course.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
                      {course.description}
                    </p>
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

export default AdminHeroCarouselEditor;
