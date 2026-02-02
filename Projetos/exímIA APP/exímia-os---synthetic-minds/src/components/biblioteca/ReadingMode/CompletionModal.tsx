// CompletionModal Component - Congratulations modal when finishing book
// EXIMIA-205

import { Trophy, RotateCcw, X } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  bookTitle: string;
  totalChapters: number;
  onReread: () => void;
  onClose: () => void;
}

export function CompletionModal({
  isOpen,
  bookTitle,
  totalChapters,
  onReread,
  onClose,
}: CompletionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Trophy Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Parabéns! 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Você completou a leitura de
        </p>
        <p className="text-lg font-semibold text-amber-600 dark:text-amber-400 mb-4">
          {bookTitle}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
          {totalChapters} capítulos lidos
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onReread}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reler
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium"
          >
            Voltar à Biblioteca
          </button>
        </div>
      </div>
    </div>
  );
}
