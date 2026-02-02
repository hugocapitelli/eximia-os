// NoteCard Component - Display a single note
// EXIMIA-108

import { Trash2, Edit2, Book } from 'lucide-react';
import type { UserNote } from '../../types/biblioteca';

interface NoteCardProps {
  note: UserNote;
  onEdit?: (note: UserNote) => void;
  onDelete?: (noteId: string) => void;
  showBookInfo?: boolean;
}

export function NoteCard({
  note,
  onEdit,
  onDelete,
  showBookInfo = false,
}: NoteCardProps) {
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4 hover:shadow-md transition-shadow">
      {/* Book Info (optional) */}
      {showBookInfo && note.catalog && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <Book className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            {note.catalog.title}
          </span>
        </div>
      )}

      {/* Note Content */}
      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-4">
        {note.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm">
        {/* Date */}
        <span className="text-gray-500 dark:text-gray-500">
          {formatDate(note.created_at)}
        </span>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(note)}
              className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-colors"
              aria-label="Editar nota"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              aria-label="Excluir nota"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
