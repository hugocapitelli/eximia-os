/**
 * CreateAuthorInlineModal Component - Story 7.6.0
 *
 * Nested modal for creating authors within ManualAddBookModal
 *
 * Accessibility Features:
 * - role="dialog" and aria-modal="true"
 * - Focus trapped in nested modal
 * - Escape key closes modal
 * - Proper z-index stacking
 * - All form fields have associated labels
 * - Error messages use role="alert"
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { useFocusTrap, useKeyboardNavigation } from '../../src/hooks/useAccessibility';
import { createAuthor } from '@/services/biblioteca';
import type { Author } from '@/types/biblioteca';

// ============================================================
// TYPES
// ============================================================

interface CreateAuthorInlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthorCreated?: (author: Author) => void;
}

interface FormData {
  name: string;
  bio: string;
  photoUrl: string;
}

interface FormErrors {
  name?: string;
  [key: string]: string | undefined;
}

// ============================================================
// COMPONENT
// ============================================================

export const CreateAuthorInlineModal: React.FC<CreateAuthorInlineModalProps> = ({
  isOpen,
  onClose,
  onAuthorCreated,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    photoUrl: '',
  });

  // ============================================================
  // EFFECTS
  // ============================================================

  // Focus trap inside nested modal
  useFocusTrap(isOpen, modalRef);

  // Keyboard navigation (Escape to close)
  useKeyboardNavigation(() => onClose(), undefined, modalRef);

  // Focus management for accessibility
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput = modalRef.current.querySelector('input');
      firstInput?.focus();
    }
  }, [isOpen]);

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do autor é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, preencha os campos obrigatórios');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createAuthor(
        formData.name.trim(),
        formData.bio || undefined,
        formData.photoUrl || undefined
      );

      if (result.success && result.data) {
        toast.success('Autor criado com sucesso!');
        onAuthorCreated?.(result.data);
        onClose();
        // Reset form
        setFormData({
          name: '',
          bio: '',
          photoUrl: '',
        });
        setErrors({});
      } else {
        toast.error(result.error || 'Falha ao criar autor');
      }
    } catch (err) {
      console.error('Error creating author:', err);
      toast.error('Erro ao criar autor');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        role="none"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-[#0A0A0A] border border-[#1F1F22] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-author-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#1F1F22] shrink-0">
          <h2 id="create-author-modal-title" className="text-lg font-bold text-white tracking-tight">
            Criar Novo Autor
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded-lg"
            aria-label="Fechar modal"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <Input
                label="Nome do Autor *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite o nome completo"
                error={errors.name}
                disabled={isLoading}
                required
                autoFocus
              />
            </div>

            {/* Bio Field */}
            <div className="space-y-1.5">
              <label htmlFor="bio" className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Biografia
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Breve descrição do autor (opcional)"
                disabled={isLoading}
                rows={3}
                className="w-full rounded-lg px-4 py-2 transition-all duration-200 bg-[#121214] border border-zinc-800 focus:border-zinc-600 focus:ring-2 focus:ring-zinc-900/50 focus:ring-offset-2 focus:ring-offset-black text-zinc-200 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              />
            </div>

            {/* Photo URL Field */}
            <div>
              <Input
                label="URL da Foto"
                name="photoUrl"
                type="url"
                value={formData.photoUrl}
                onChange={handleInputChange}
                placeholder="https://exemplo.com/foto.jpg"
                disabled={isLoading}
              />
            </div>

            {/* Help Text */}
            <div className="flex items-start gap-2 p-3 bg-minds-950/30 border border-minds-900/50 rounded-lg">
              <div className="text-minds-400 flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs text-minds-300">
                Você pode completar o perfil do autor depois. Por enquanto, apenas o nome é obrigatório.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#1F1F22] shrink-0">
          <Button
            type="button"
            variant="secondary"
            color="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            color="purple"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Criando...' : 'Criar Autor'}
          </Button>
        </div>
      </div>
    </div>
  );
};
