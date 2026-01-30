import React from 'react';
import { LucideIcon, Zap, Plus } from 'lucide-react';
import { Button } from '../atoms/Button';

interface AdminPanelProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  showDefaultActions?: boolean;
  onAddNew?: () => void;
  onGenerateAI?: () => void;
  addNewLabel?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  icon: Icon,
  title,
  description,
  children,
  actions,
  showDefaultActions = true,
  onAddNew,
  onGenerateAI,
  addNewLabel = 'Novo Item',
}) => {
  return (
    <div
      className="mb-8 p-6 rounded-2xl animate-in fade-in duration-300"
      style={{
        background: 'rgba(245, 158, 11, 0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="p-3 rounded-xl text-amber-500"
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            <p className="text-sm text-zinc-400">{description}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {actions}
          {showDefaultActions && (
            <>
              {onGenerateAI && (
                <Button
                  variant="secondary"
                  icon={<Zap className="w-4 h-4" />}
                  onClick={onGenerateAI}
                >
                  Gerar com AI
                </Button>
              )}
              {onAddNew && (
                <Button
                  variant="primary"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={onAddNew}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-900 border-transparent"
                >
                  {addNewLabel}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Panel Content */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default AdminPanel;
