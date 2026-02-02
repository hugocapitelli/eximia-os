// SavingIndicator Component - Shows save status
// EXIMIA-205

import { Cloud, CloudOff, Check, Loader2 } from 'lucide-react';

type SyncStatus = 'synced' | 'pending' | 'offline' | 'error';

interface SavingIndicatorProps {
  status: SyncStatus;
  isSaving: boolean;
}

export function SavingIndicator({ status, isSaving }: SavingIndicatorProps) {
  const getStatusConfig = () => {
    if (isSaving) {
      return {
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        text: 'Salvando...',
        className: 'text-amber-500',
      };
    }

    switch (status) {
      case 'synced':
        return {
          icon: <Check className="w-4 h-4" />,
          text: 'Salvo',
          className: 'text-green-500',
        };
      case 'pending':
        return {
          icon: <Cloud className="w-4 h-4" />,
          text: 'Sincronizando...',
          className: 'text-amber-500',
        };
      case 'offline':
        return {
          icon: <CloudOff className="w-4 h-4" />,
          text: 'Offline',
          className: 'text-gray-500',
        };
      case 'error':
        return {
          icon: <CloudOff className="w-4 h-4" />,
          text: 'Erro ao salvar',
          className: 'text-red-500',
        };
      default:
        return {
          icon: <Cloud className="w-4 h-4" />,
          text: '',
          className: 'text-gray-400',
        };
    }
  };

  const config = getStatusConfig();

  // Don't show if synced and not saving (fade out after a moment)
  if (status === 'synced' && !isSaving) {
    return (
      <div className="fixed bottom-20 right-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-sm opacity-0 animate-fade-out pointer-events-none">
        <span className={config.className}>{config.icon}</span>
        <span className="text-gray-600 dark:text-gray-400">{config.text}</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-30 flex items-center gap-2 px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-sm">
      <span className={config.className}>{config.icon}</span>
      <span className="text-gray-600 dark:text-gray-400">{config.text}</span>
    </div>
  );
}
