// AdminChapterEditorPage - Editor for summary chapters
// EXIMIA-208

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Loader2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  isAdmin,
  getSummaryWithChapters,
  updateSummary,
  createChapter,
  updateChapter,
  deleteChapter,
  reorderChapters,
} from '../../services/biblioteca';
import type { BookSummary, SummaryChapter } from '../../types/biblioteca';
import toast from 'react-hot-toast';

export const AdminChapterEditorPage: React.FC = () => {
  const { summaryId } = useParams<{ summaryId: string }>();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<BookSummary | null>(null);
  const [chapters, setChapters] = useState<SummaryChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState<Record<string, Partial<SummaryChapter>>>({});

  // Check admin access
  useEffect(() => {
    const checkAccess = async () => {
      const admin = await isAdmin();
      if (!admin) {
        toast.error('Acesso não autorizado');
        navigate('/biblioteca');
      }
    };
    checkAccess();
  }, [navigate]);

  // Load summary and chapters
  useEffect(() => {
    if (!summaryId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const result = await getSummaryWithChapters(summaryId);
        if (result.success && result.data) {
          setSummary(result.data);
          setChapters(result.data.chapters);
          if (result.data.chapters.length > 0) {
            setSelectedChapter(result.data.chapters[0].id);
          }
        } else {
          toast.error(result.error || 'Erro ao carregar resumo');
        }
      } catch (error) {
        toast.error('Erro ao carregar resumo');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [summaryId]);

  // Get current chapter
  const currentChapter = chapters.find((c) => c.id === selectedChapter);
  const currentEdits = selectedChapter ? editedContent[selectedChapter] : undefined;
  const chapterData = currentChapter
    ? { ...currentChapter, ...currentEdits }
    : null;

  // Handle chapter edit
  const handleChapterEdit = useCallback(
    (field: keyof SummaryChapter, value: string) => {
      if (!selectedChapter) return;
      setEditedContent((prev) => ({
        ...prev,
        [selectedChapter]: {
          ...prev[selectedChapter],
          [field]: value,
        },
      }));
    },
    [selectedChapter]
  );

  // Save current chapter
  const handleSaveChapter = useCallback(async () => {
    if (!selectedChapter || !currentEdits) return;

    setSaving(true);
    try {
      const result = await updateChapter(selectedChapter, currentEdits);
      if (result.success && result.data) {
        setChapters((prev) =>
          prev.map((c) => (c.id === selectedChapter ? { ...c, ...result.data } : c))
        );
        setEditedContent((prev) => {
          const next = { ...prev };
          delete next[selectedChapter];
          return next;
        });
        toast.success('Capítulo salvo');
      } else {
        toast.error(result.error || 'Erro ao salvar');
      }
    } catch (error) {
      toast.error('Erro ao salvar capítulo');
    } finally {
      setSaving(false);
    }
  }, [selectedChapter, currentEdits]);

  // Add new chapter
  const handleAddChapter = useCallback(async () => {
    if (!summaryId) return;

    setSaving(true);
    try {
      const newChapterNumber = chapters.length + 1;
      const result = await createChapter({
        summary_id: summaryId,
        chapter_number: newChapterNumber,
        title: `Capítulo ${newChapterNumber}`,
        content: '',
        order_index: newChapterNumber - 1,
      });

      if (result.success && result.data) {
        setChapters((prev) => [...prev, result.data!]);
        setSelectedChapter(result.data.id);
        toast.success('Capítulo criado');
      } else {
        toast.error(result.error || 'Erro ao criar capítulo');
      }
    } catch (error) {
      toast.error('Erro ao criar capítulo');
    } finally {
      setSaving(false);
    }
  }, [summaryId, chapters.length]);

  // Delete chapter
  const handleDeleteChapter = useCallback(async (chapterId: string) => {
    if (!confirm('Tem certeza que deseja excluir este capítulo?')) return;

    setSaving(true);
    try {
      const result = await deleteChapter(chapterId);
      if (result.success) {
        setChapters((prev) => prev.filter((c) => c.id !== chapterId));
        if (selectedChapter === chapterId) {
          setSelectedChapter(chapters[0]?.id || null);
        }
        toast.success('Capítulo excluído');
      } else {
        toast.error(result.error || 'Erro ao excluir');
      }
    } catch (error) {
      toast.error('Erro ao excluir capítulo');
    } finally {
      setSaving(false);
    }
  }, [selectedChapter, chapters]);

  // Move chapter up/down
  const handleMoveChapter = useCallback(
    async (chapterId: string, direction: 'up' | 'down') => {
      const currentIndex = chapters.findIndex((c) => c.id === chapterId);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= chapters.length) return;

      const newChapters = [...chapters];
      [newChapters[currentIndex], newChapters[newIndex]] = [
        newChapters[newIndex],
        newChapters[currentIndex],
      ];

      // Update chapter numbers
      const updatedChapters = newChapters.map((c, i) => ({
        ...c,
        chapter_number: i + 1,
      }));

      setChapters(updatedChapters);

      // Persist reorder
      if (summaryId) {
        const orderMap = updatedChapters.reduce(
          (acc, c) => ({ ...acc, [c.id]: c.chapter_number }),
          {} as Record<string, number>
        );
        await reorderChapters(summaryId, orderMap);
      }
    },
    [chapters, summaryId]
  );

  // Toggle publish status
  const handleTogglePublish = useCallback(async () => {
    if (!summaryId || !summary) return;

    setSaving(true);
    try {
      const newStatus = summary.status === 'published' ? 'draft' : 'published';
      const result = await updateSummary(summaryId, { status: newStatus });

      if (result.success && result.data) {
        setSummary(result.data);
        toast.success(
          newStatus === 'published' ? 'Resumo publicado!' : 'Resumo despublicado'
        );
      } else {
        toast.error(result.error || 'Erro ao atualizar status');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status');
    } finally {
      setSaving(false);
    }
  }, [summaryId, summary]);

  if (!summaryId) {
    return <Navigate to="/admin/summaries" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!summary) {
    return <Navigate to="/admin/summaries" replace />;
  }

  const hasUnsavedChanges = Object.keys(editedContent).length > 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#050505] sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin/summaries')}
                className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold">{summary.title}</h1>
                <p className="text-sm text-zinc-500">
                  {chapters.length} capítulos • Versão {summary.version}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Toggle */}
              <button
                onClick={handleTogglePublish}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  summary.status === 'published'
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                }`}
              >
                {summary.status === 'published' ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Publicado
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Rascunho
                  </>
                )}
              </button>

              {/* Save Button */}
              <button
                onClick={handleSaveChapter}
                disabled={saving || !hasUnsavedChanges}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Salvar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chapters Sidebar */}
        <aside className="w-72 border-r border-zinc-800 bg-zinc-900/50">
          <div className="p-4 border-b border-zinc-800">
            <button
              onClick={handleAddChapter}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Capítulo
            </button>
          </div>

          <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChapter === chapter.id
                    ? 'bg-amber-500/20 border border-amber-500/50'
                    : 'hover:bg-zinc-800'
                }`}
                onClick={() => setSelectedChapter(chapter.id)}
              >
                <GripVertical className="w-4 h-4 text-zinc-600" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chapter.title}</p>
                  <p className="text-xs text-zinc-500">Cap. {chapter.chapter_number}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveChapter(chapter.id, 'up');
                    }}
                    disabled={index === 0}
                    className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveChapter(chapter.id, 'down');
                    }}
                    disabled={index === chapters.length - 1}
                    className="p-1 hover:bg-zinc-700 rounded disabled:opacity-30"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChapter(chapter.id);
                    }}
                    className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chapter Editor */}
        <main className="flex-1 p-6 overflow-y-auto">
          {chapterData ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Título do Capítulo
                </label>
                <input
                  type="text"
                  value={chapterData.title}
                  onChange={(e) => handleChapterEdit('title', e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-900 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Subtítulo (opcional)
                </label>
                <input
                  type="text"
                  value={chapterData.subtitle || ''}
                  onChange={(e) => handleChapterEdit('subtitle', e.target.value)}
                  placeholder="Subtítulo do capítulo"
                  className="w-full px-4 py-3 bg-zinc-900 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Conteúdo (Markdown suportado)
                </label>
                <textarea
                  value={chapterData.content}
                  onChange={(e) => handleChapterEdit('content', e.target.value)}
                  rows={20}
                  placeholder="Escreva o conteúdo do capítulo aqui...

Você pode usar Markdown:
# Título
## Subtítulo
**negrito**
*itálico*
- lista
> citação"
                  className="w-full px-4 py-3 bg-zinc-900 rounded-lg border border-zinc-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">
              Selecione um capítulo para editar
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminChapterEditorPage;
