import React from 'react';
import { ArrowLeft, Save, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '../atoms/Button';

interface Breadcrumb {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface AdminHeaderProps {
  breadcrumbs: Breadcrumb[];
  onSave?: () => void;
  onBack?: () => void;
  hasUnsavedChanges?: boolean;
  isSaving?: boolean;
  saveLabel?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  breadcrumbs,
  onSave,
  onBack,
  hasUnsavedChanges = false,
  isSaving = false,
  saveLabel = 'Salvar',
}) => {
  return (
    <div
      className="sticky top-0 z-40 px-6 py-4 mb-6"
      style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(5, 5, 5, 0.95) 50%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.15)',
      }}
    >
      <div className="max-w-[1800px] mx-auto flex items-center justify-between">
        {/* Left: Back + Breadcrumbs */}
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight className="w-4 h-4 text-zinc-600" />
                )}
                {crumb.onClick || crumb.href ? (
                  <button
                    onClick={crumb.onClick}
                    className={`text-sm font-medium transition-colors ${
                      idx === breadcrumbs.length - 1
                        ? 'text-white'
                        : 'text-zinc-500 hover:text-amber-400'
                    }`}
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={`text-sm font-medium ${
                      idx === breadcrumbs.length - 1
                        ? 'text-white'
                        : 'text-zinc-500'
                    }`}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Right: Unsaved indicator + Save button */}
        <div className="flex items-center gap-4">
          {/* Unsaved Changes Indicator */}
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                Alterações não salvas
              </span>
            </div>
          )}

          {/* Save Button */}
          {onSave && (
            <Button
              variant="primary"
              onClick={onSave}
              disabled={isSaving || !hasUnsavedChanges}
              icon={
                isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
              className={`
                ${hasUnsavedChanges
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-900'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }
                border-transparent transition-all
              `}
            >
              {isSaving ? 'Salvando...' : saveLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
