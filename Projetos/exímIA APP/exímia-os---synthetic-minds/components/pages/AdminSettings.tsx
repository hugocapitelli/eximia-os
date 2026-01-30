import React, { useState } from 'react';
import { Settings, Shield, Bell, Palette, Database, Globe, ChevronRight } from 'lucide-react';
import { AdminPanel, AdminHeader } from '../admin';

interface SettingSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  settings: {
    id: string;
    label: string;
    description?: string;
    type: 'toggle' | 'select' | 'text';
    value: boolean | string;
    options?: { value: string; label: string }[];
  }[];
}

const SETTINGS_SECTIONS: SettingSection[] = [
  {
    id: 'general',
    icon: <Globe className="w-5 h-5" />,
    title: 'Geral',
    description: 'Configurações gerais do sistema',
    settings: [
      { id: 'language', label: 'Idioma', type: 'select', value: 'pt-BR', options: [
        { value: 'pt-BR', label: 'Português (Brasil)' },
        { value: 'en-US', label: 'English (US)' },
        { value: 'es', label: 'Español' },
      ]},
      { id: 'timezone', label: 'Fuso Horário', type: 'select', value: 'America/Sao_Paulo', options: [
        { value: 'America/Sao_Paulo', label: 'São Paulo (GMT-3)' },
        { value: 'America/New_York', label: 'New York (GMT-5)' },
        { value: 'Europe/London', label: 'London (GMT+0)' },
      ]},
    ],
  },
  {
    id: 'appearance',
    icon: <Palette className="w-5 h-5" />,
    title: 'Aparência',
    description: 'Personalize a interface',
    settings: [
      { id: 'dark-mode', label: 'Modo Escuro', description: 'Sempre ativo nesta versão', type: 'toggle', value: true },
      { id: 'compact-sidebar', label: 'Sidebar Compacta', description: 'Reduz o tamanho da navegação', type: 'toggle', value: false },
      { id: 'animations', label: 'Animações', description: 'Ativar transições e animações', type: 'toggle', value: true },
    ],
  },
  {
    id: 'notifications',
    icon: <Bell className="w-5 h-5" />,
    title: 'Notificações',
    description: 'Gerencie alertas e avisos',
    settings: [
      { id: 'push-notifications', label: 'Notificações Push', description: 'Receba alertas no navegador', type: 'toggle', value: true },
      { id: 'email-notifications', label: 'Notificações por Email', description: 'Resumo semanal de atividades', type: 'toggle', value: false },
      { id: 'sound', label: 'Sons', description: 'Alertas sonoros para novas mensagens', type: 'toggle', value: false },
    ],
  },
  {
    id: 'security',
    icon: <Shield className="w-5 h-5" />,
    title: 'Segurança',
    description: 'Configurações de segurança',
    settings: [
      { id: '2fa', label: 'Autenticação em Dois Fatores', description: 'Adicione uma camada extra de segurança', type: 'toggle', value: false },
      { id: 'session-timeout', label: 'Timeout da Sessão', type: 'select', value: '30', options: [
        { value: '15', label: '15 minutos' },
        { value: '30', label: '30 minutos' },
        { value: '60', label: '1 hora' },
        { value: '0', label: 'Nunca' },
      ]},
    ],
  },
  {
    id: 'data',
    icon: <Database className="w-5 h-5" />,
    title: 'Dados',
    description: 'Gerenciamento de dados',
    settings: [
      { id: 'auto-save', label: 'Salvamento Automático', description: 'Salvar alterações automaticamente', type: 'toggle', value: true },
      { id: 'cache', label: 'Cache Local', description: 'Armazenar dados para acesso offline', type: 'toggle', value: true },
    ],
  },
];

interface AdminSettingsProps {
  onBack: () => void;
  onNavigate?: (pageId: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  onBack,
  onNavigate,
}) => {
  const [settings, setSettings] = useState<Record<string, boolean | string>>(() => {
    const initial: Record<string, boolean | string> = {};
    SETTINGS_SECTIONS.forEach((section) => {
      section.settings.forEach((setting) => {
        initial[setting.id] = setting.value;
      });
    });
    return initial;
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('general');

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleSettingChange = (settingId: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [settingId]: value }));
    setHasUnsavedChanges(true);
  };

  const currentSection = SETTINGS_SECTIONS.find((s) => s.id === activeSection);

  return (
    <div className="min-h-screen bg-[#050505]">
      <AdminHeader
        breadcrumbs={[
          { label: 'Admin', onClick: onBack },
          { label: 'Configurações' },
        ]}
        onBack={onBack}
        onSave={handleSave}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />

      <div className="max-w-6xl mx-auto px-6 pb-12">
        <AdminPanel
          icon={Settings}
          title="Configurações"
          description="Gerencie as configurações gerais do sistema."
          showDefaultActions={false}
        />

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {SETTINGS_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {section.icon}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{section.title}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    activeSection === section.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            {currentSection && (
              <div className="bg-[#0A0A0A] border border-[#1F1F22] rounded-xl p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">{currentSection.title}</h2>
                  <p className="text-sm text-zinc-500 mt-1">{currentSection.description}</p>
                </div>

                <div className="space-y-6">
                  {currentSection.settings.map((setting) => (
                    <div
                      key={setting.id}
                      className="flex items-center justify-between py-3 border-b border-[#1F1F22] last:border-0"
                    >
                      <div className="flex-1">
                        <label className="font-medium text-white">{setting.label}</label>
                        {setting.description && (
                          <p className="text-sm text-zinc-500 mt-0.5">{setting.description}</p>
                        )}
                      </div>

                      {setting.type === 'toggle' && (
                        <button
                          onClick={() => handleSettingChange(setting.id, !settings[setting.id])}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings[setting.id] ? 'bg-amber-500' : 'bg-zinc-700'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings[setting.id] ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      )}

                      {setting.type === 'select' && setting.options && (
                        <select
                          value={settings[setting.id] as string}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          className="px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        >
                          {setting.options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}

                      {setting.type === 'text' && (
                        <input
                          type="text"
                          value={settings[setting.id] as string}
                          onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                          className="w-64 px-3 py-2 bg-[#050505] border border-[#1F1F22] rounded-lg text-white text-sm focus:outline-none focus:border-amber-500/50"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
