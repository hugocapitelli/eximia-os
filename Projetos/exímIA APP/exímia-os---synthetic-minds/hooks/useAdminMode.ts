import { useState, useEffect, useCallback } from 'react';

const ADMIN_STORAGE_KEY = 'eximia-admin-mode';

export type AdminModule =
  | 'academy-studio'
  | 'library-editor'
  | 'ds-manager'
  | null;

export interface AdminModeState {
  // Basic admin state
  isAdmin: boolean;
  isEditorMode: boolean;
  toggleAdmin: () => void;
  toggleEditorMode: () => void;
  setEditorMode: (value: boolean) => void;

  // Module tracking
  activeModule: AdminModule;
  setActiveModule: (module: AdminModule) => void;

  // Unsaved changes tracking
  unsavedChanges: boolean;
  markUnsaved: () => void;
  clearUnsaved: () => void;

  // Save state
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
}

export const useAdminMode = (): AdminModeState => {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [isEditorMode, setIsEditorMode] = useState<boolean>(false);
  const [activeModule, setActiveModuleState] = useState<AdminModule>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(ADMIN_STORAGE_KEY, String(isAdmin));
  }, [isAdmin]);

  // Warn before leaving if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const toggleAdmin = useCallback(() => {
    setIsAdmin(prev => !prev);
    if (isAdmin) {
      setIsEditorMode(false);
      setActiveModuleState(null);
      setUnsavedChanges(false);
    }
  }, [isAdmin]);

  const toggleEditorMode = useCallback(() => {
    if (isAdmin) {
      setIsEditorMode(prev => !prev);
    }
  }, [isAdmin]);

  const setEditorModeValue = useCallback((value: boolean) => {
    if (isAdmin) {
      setIsEditorMode(value);
    }
  }, [isAdmin]);

  const setActiveModule = useCallback((module: AdminModule) => {
    if (unsavedChanges) {
      const confirm = window.confirm('Você tem alterações não salvas. Deseja continuar?');
      if (!confirm) return;
    }
    setActiveModuleState(module);
    setUnsavedChanges(false);
  }, [unsavedChanges]);

  const markUnsaved = useCallback(() => {
    setUnsavedChanges(true);
  }, []);

  const clearUnsaved = useCallback(() => {
    setUnsavedChanges(false);
  }, []);

  return {
    isAdmin,
    isEditorMode,
    toggleAdmin,
    toggleEditorMode,
    setEditorMode: setEditorModeValue,
    activeModule,
    setActiveModule,
    unsavedChanges,
    markUnsaved,
    clearUnsaved,
    isSaving,
    setIsSaving,
  };
};

export default useAdminMode;
