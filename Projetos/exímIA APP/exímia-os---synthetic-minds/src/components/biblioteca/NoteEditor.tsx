// NoteEditor Component - Create/Edit notes
// EXIMIA-108

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import type { UserNote } from '../../types/biblioteca';

interface NoteEditorProps {
  isOpen: boolean;
  note?: UserNote | null;
  catalogId: string;
  onSave: (content: string, noteId?: string) => Promise<void>;
  onClose: () => void;
}

export function NoteEditor({
  isOpen,
  note,
  catalogId,
  onSave,
  onClose,
}: NoteEditorProps) {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = !!note;
  const maxLength = 2000;

  useEffect(() => {
    if (note) {
      setContent(note.content);
    } else {
      setContent('');
    }
  }, [note, isOpen]);

  const handleSave = async () => {
    if (!content.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(content.trim(), note?.id);
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSave();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar Nota' : 'Nova Nota'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva sua nota aqui..."
            maxLength={maxLength}
            rows={6}
            className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border-0 resize-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>Ctrl/Cmd + Enter para salvar</span>
            <span>
              {content.length}/{maxLength}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim() || isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Salvar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
