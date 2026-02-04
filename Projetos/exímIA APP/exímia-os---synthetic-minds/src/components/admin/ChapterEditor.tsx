import { useState, useCallback } from 'react';
import { Save, X, ChevronUp, ChevronDown } from 'lucide-react';
import { SummaryChapter, ActionResult } from '@/types/biblioteca';

interface ChapterEditorProps {
  chapter: SummaryChapter | null;
  summaryId: string;
  onSave: (chapter: Partial<SummaryChapter>) => Promise<ActionResult<SummaryChapter>>;
  onCancel: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function ChapterEditor({
  chapter,
  summaryId,
  onSave,
  onCancel,
  canMoveUp = false,
  canMoveDown = false,
  onMoveUp,
  onMoveDown,
}: ChapterEditorProps) {
  const [title, setTitle] = useState(chapter?.title || '');
  const [subtitle, setSubtitle] = useState(chapter?.subtitle || '');
  const [content, setContent] = useState(chapter?.content || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const result = await onSave({
        ...chapter,
        title,
        subtitle: subtitle || undefined,
        content,
      } as Partial<SummaryChapter>);

      if (!result.success) {
        setError(result.error || 'Failed to save chapter');
      } else {
        // Close editor on success
        onCancel();
      }
    } catch (err) {
      setError('Error saving chapter');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }, [title, subtitle, content, chapter, onSave, onCancel]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {chapter ? `Edit Chapter ${chapter.chapter_number}` : 'New Chapter'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter title..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle (optional)</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Chapter subtitle..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Content - Markdown */}
          <div>
            <label className="block text-sm font-medium mb-2">Content (Markdown) *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter chapter content in Markdown format..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 font-mono text-sm"
              rows={15}
            />
            <p className="text-xs text-gray-400 mt-2">
              Supports Markdown: **bold**, *italic*, # headings, - lists, [links](url), etc.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            {canMoveUp && (
              <button
                onClick={onMoveUp}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Move chapter up"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            )}
            {canMoveDown && (
              <button
                onClick={onMoveDown}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Move chapter down"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Chapter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
