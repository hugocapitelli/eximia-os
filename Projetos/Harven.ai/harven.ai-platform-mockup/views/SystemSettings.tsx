
import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';

import { useSettings } from '../contexts/SettingsContext';

const SystemSettings: React.FC = () => {
    const { settings, updateSettings, loading: contextLoading } = useSettings();
    const [activeTab, setActiveTab] = useState<'general' | 'integrations' | 'security' | 'logs'>('general');
    const [logs, setLogs] = useState<any[]>([]);

    const [showLoginPreview, setShowLoginPreview] = useState(false);

    useEffect(() => {
        loadLogs();
    }, []);

    // ... loadLogs ...

    const loadLogs = async () => {
        try {
            const data = await adminApi.getLogs();
            setLogs(data);
        } catch (error) {
            console.error("Erro ao carregar logs", error);
        }
    };

    const handleSave = async () => {
        // O salvar é automático no updateSettings, mas podemos manter botão para feedback explícito ou forçar refresh
        alert("Configurações já foram aplicadas e salvas!");
    };

    // Handler genérico para inputs
    const handleChange = (field: string, value: any) => {
        updateSettings({ [field]: value });
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);

            // Atualiza globalmente
            updateSettings({ logo_url: imageUrl });

            // TODO: Upload real
        }
    };

    const handleLoginLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);

            // Atualiza globalmente
            updateSettings({ login_logo_url: imageUrl });

            // TODO: Upload real
        }
    };

    const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);

            // Atualiza globalmente
            updateSettings({ login_bg_url: imageUrl });

            // TODO: Upload real
        }
    };

    const handleRestoreColor = () => {
        updateSettings({ primary_color: '#D0FF00' });
    };

    return (
        <div className="flex flex-col flex-1 h-full overflow-hidden bg-harven-bg dark:bg-gray-950">
            {/* Sticky Header with Tabs */}
            <div className="bg-white dark:bg-gray-900 border-b border-harven-border dark:border-gray-800 px-8 py-4 flex-shrink-0 z-10 sticky top-0 shadow-sm">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar w-full md:w-auto">
                        {[
                            { id: 'general', label: 'Geral' },
                            { id: 'integrations', label: 'Integrações' },
                            { id: 'security', label: 'Segurança' },
                            { id: 'logs', label: 'Logs de Auditoria' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`text-sm font-bold pb-4 -mb-4 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-harven-dark dark:text-primary border-b-4 border-primary'
                                    : 'text-gray-400 hover:text-harven-dark dark:hover:text-gray-200 border-b-4 border-transparent'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex justify-end w-full md:w-auto">
                        <button
                            onClick={handleSave}
                            disabled={contextLoading}
                            className="bg-primary hover:bg-primary-dark transition-all text-harven-dark font-bold px-5 py-2 rounded-lg text-xs shadow-lg shadow-primary/20 uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            {contextLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                <div className="max-w-6xl mx-auto flex flex-col gap-10">
                    <LoginPreviewModal
                        isOpen={showLoginPreview}
                        onClose={() => setShowLoginPreview(false)}
                        settings={settings}
                    />

                    {/* TAB: GERAL */}
                    {activeTab === 'general' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Identidade */}
                                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-harven-border dark:border-gray-700 p-8 shadow-sm space-y-6">
                                    <h4 className="text-xs font-black text-harven-gold uppercase tracking-widest border-b border-harven-bg pb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">badge</span> Identidade do Site
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nome da Plataforma</label>
                                            <input
                                                className="w-full bg-harven-bg dark:bg-gray-900 border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary text-harven-dark dark:text-white"
                                                value={settings.platform_name || ''}
                                                onChange={(e) => handleChange('platform_name', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">E-mail de Suporte</label>
                                        <input
                                            className="w-full bg-harven-bg dark:bg-gray-900 border-none rounded-lg py-3 px-4 text-sm focus:ring-1 focus:ring-primary text-harven-dark dark:text-white"
                                            value={settings.support_email || ''}
                                            onChange={(e) => handleChange('support_email', e.target.value)}
                                        />
                                        <p className="text-[9px] font-bold text-gray-400 uppercase italic">Visível para alunos no rodapé.</p>
                                    </div>
                                </div>

                                {/* Branding */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-harven-border dark:border-gray-700 p-8 shadow-sm space-y-6">
                                    <h4 className="text-xs font-black text-harven-gold uppercase tracking-widest border-b border-harven-bg pb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">palette</span> Branding
                                    </h4>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-harven-dark dark:text-white uppercase">Cor Primária</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={handleRestoreColor}
                                                    title="Restaurar padrão"
                                                    className="size-6 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 text-gray-500 transition-colors">
                                                    <span className="material-symbols-outlined text-[12px]">restart_alt</span>
                                                </button>
                                                <div className="flex items-center gap-2 cursor-pointer group">
                                                    <input
                                                        type="color"
                                                        value={settings.primary_color || '#D0FF00'}
                                                        onChange={(e) => handleChange('primary_color', e.target.value)}
                                                        className="w-8 h-8 rounded-full border-none p-0 overflow-hidden cursor-pointer"
                                                    />
                                                    <span className="text-[10px] font-mono font-bold text-gray-400 group-hover:text-harven-dark">{settings.primary_color}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-harven-bg space-y-3">
                                            <label className="text-xs font-bold text-harven-dark uppercase block">Logotipo Oficial (Sistema)</label>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-harven-dark p-3 rounded-lg flex items-center justify-center border border-harven-border">
                                                    <img src={settings.logo_url} alt="Logo White" className="h-8 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>

                                            <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 group hover:border-primary transition-all cursor-pointer bg-harven-bg/30 mt-2 relative">
                                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary-dark text-2xl">upload_file</span>
                                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-harven-dark">ATUALIZAR LOGO DO SISTEMA</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                                            </label>
                                        </div>

                                        <div className="pt-4 border-t border-harven-bg space-y-3">
                                            <label className="text-xs font-bold text-harven-dark uppercase block">Logotipo de Login</label>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 bg-harven-dark p-3 rounded-lg flex items-center justify-center border border-harven-border">
                                                    <img src={settings.login_logo_url} alt="Login Logo" className="h-8 w-auto object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                                                </div>
                                            </div>

                                            <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 group hover:border-primary transition-all cursor-pointer bg-harven-bg/30 mt-2 relative">
                                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary-dark text-2xl">upload_file</span>
                                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-harven-dark">ATUALIZAR LOGO DE LOGIN</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleLoginLogoUpload} />
                                            </label>
                                        </div>

                                        <div className="pt-4 border-t border-harven-bg space-y-3">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-harven-dark uppercase block">Imagem de Fundo (Login)</label>
                                                <button
                                                    onClick={() => setShowLoginPreview(true)}
                                                    className="text-[10px] font-bold text-primary-dark hover:underline uppercase flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                                                    Visualizar Exemplo
                                                </button>
                                            </div>
                                            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden border border-harven-border relative group">
                                                <img src={settings.login_bg_url} className="w-full h-full object-cover" />
                                                <button onClick={() => setShowLoginPreview(true)} className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                                    <span className="text-white text-xs font-bold uppercase">Visualizar Tela Inteira</span>
                                                </button>
                                            </div>

                                            <label className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 group hover:border-primary transition-all cursor-pointer bg-harven-bg/30 mt-2 relative">
                                                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary-dark text-2xl">image</span>
                                                <span className="text-[10px] font-bold text-gray-400 group-hover:text-harven-dark">ALTERAR WALLPAPER</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={handleBgUpload} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Funcionalidades */}
                                <div className="bg-white rounded-2xl border border-harven-border p-8 shadow-sm space-y-6">
                                    <h4 className="text-xs font-black text-harven-gold uppercase tracking-widest border-b border-harven-bg pb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">toggle_on</span> Módulos
                                    </h4>
                                    <div className="space-y-4">
                                        {[
                                            { key: 'module_ai_tutor', label: 'Tutor Socrático (AI)', desc: 'Habilita o chat de IA nos capítulos.' },
                                            { key: 'module_gamification', label: 'Gamificação & Ranking', desc: 'Exibe leaderboards e medalhas.' },
                                            { key: 'module_dark_mode', label: 'Modo Escuro', desc: 'Permite alternar tema.' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex justify-between items-start group">
                                                <div>
                                                    <p className="text-sm font-bold text-harven-dark dark:text-white group-hover:text-primary-dark transition-colors">{item.label}</p>
                                                    <p className="text-[10px] text-gray-400">{item.desc}</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer mt-1">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={settings[item.key] === true}
                                                        onChange={(e) => handleChange(item.key, e.target.checked)}
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Limites */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-harven-border dark:border-gray-700 p-8 shadow-sm space-y-6">
                                    <h4 className="text-xs font-black text-harven-gold uppercase tracking-widest border-b border-harven-bg pb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[18px]">data_usage</span> Quotas & Limites
                                    </h4>
                                    <div className="space-y-5">
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max. Tokens IA / Resposta</label>
                                                <span className="text-[10px] font-bold text-harven-dark dark:text-white">{settings.limit_tokens}</span>
                                            </div>
                                            <input
                                                type="range"
                                                className="w-full accent-primary"
                                                min="512"
                                                max="4096"
                                                value={settings.limit_tokens || 2048}
                                                onChange={(e) => handleChange('limit_tokens', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-harven-dark dark:text-white uppercase">Limite Upload (MB)</span>
                                            <input
                                                className="w-24 bg-harven-bg dark:bg-gray-900 border-none rounded-lg py-1.5 px-3 text-sm font-bold text-right focus:ring-1 focus:ring-primary text-harven-dark dark:text-white"
                                                value={settings.limit_upload_mb || 500}
                                                onChange={(e) => handleChange('limit_upload_mb', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex gap-3 items-center">
                                            <span className="material-symbols-outlined text-orange-500">warning</span>
                                            <div>
                                                <p className="text-[10px] font-bold text-orange-700 uppercase">Armazenamento (Mock)</p>
                                                <p className="text-xs font-bold text-orange-900">75% Utilizado (750GB / 1TB)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* TAB: INTEGRAÇÕES */}
                    {activeTab === 'integrations' && (
                        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white rounded-2xl border border-harven-border p-8 shadow-sm">
                                <h3 className="text-lg font-display font-bold text-harven-dark mb-6">Provedores de Inteligência Artificial</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="border border-harven-border rounded-xl p-6 flex flex-col gap-4 hover:border-primary transition-colors bg-white">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                                                    <span className="material-symbols-outlined">smart_toy</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-harven-dark text-sm">OpenAI API</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Modelo: GPT-4o</p>
                                                </div>
                                            </div>
                                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${settings.openai_key ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                <span className={`size-1.5 rounded-full ${settings.openai_key ? 'bg-green-600' : 'bg-gray-400'}`}></span> {settings.openai_key ? 'Conectado' : 'Sem chave'}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chave de API</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="password"
                                                    value={settings.openai_key || ''}
                                                    onChange={(e) => handleChange('openai_key', e.target.value)}
                                                    placeholder="sk-..."
                                                    className="flex-1 bg-harven-bg border-none rounded text-xs text-gray-500 font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-harven-border rounded-xl p-6 flex flex-col gap-4 hover:border-primary transition-colors bg-white">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                                                    <span className="material-symbols-outlined">neurology</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-600 text-sm">Anthropic Claude</h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Modelo: Sonnet 3.5</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleChange('anthropic_connected', !settings.anthropic_connected)}
                                                className={`border px-3 py-1 rounded text-[10px] font-bold uppercase transition-colors ${settings.anthropic_connected ? 'bg-green-100 border-green-200 text-green-700' : 'bg-white border-gray-300 text-gray-500'}`}
                                            >
                                                {settings.anthropic_connected ? 'Conectado' : 'Conectar'}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Habilite para usar como modelo alternativo ou de fallback.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-harven-border p-8 shadow-sm">
                                <h3 className="text-lg font-display font-bold text-harven-dark mb-6">Autenticação (SSO)</h3>
                                <div className="space-y-4">
                                    {[
                                        { key: 'sso_azure', name: 'Microsoft Azure AD', icon: 'window' },
                                        { key: 'sso_google', name: 'Google Workspace', icon: 'radio_button_checked' },
                                    ].map((sso, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border border-harven-border rounded-xl bg-white">
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-gray-500">{sso.icon}</span>
                                                <span className="text-sm font-bold text-harven-dark">{sso.name}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-[10px] font-bold uppercase ${settings[sso.key] ? 'text-green-600' : 'text-gray-400'}`}>{settings[sso.key] ? 'Ativo' : 'Inativo'}</span>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        className="sr-only peer"
                                                        checked={settings[sso.key] === true}
                                                        onChange={(e) => handleChange(sso.key, e.target.checked)}
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                                </label>
                                                <button className="size-8 flex items-center justify-center rounded-lg hover:bg-harven-bg text-gray-400"><span className="material-symbols-outlined text-[18px]">settings</span></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: SEGURANÇA */}
                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="bg-white rounded-2xl border border-harven-border p-8 shadow-sm">
                                <h3 className="text-lg font-display font-bold text-harven-dark mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-red-500">lock</span>
                                    Políticas de Acesso
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Senhas</h4>
                                        <div className="space-y-3">
                                            <label className="flex items-center gap-3 p-3 border border-harven-border rounded-lg cursor-pointer hover:bg-harven-bg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-primary focus:ring-primary"
                                                    checked={settings.pwd_min_length >= 8}
                                                    onChange={(e) => handleChange('pwd_min_length', e.target.checked ? 8 : 4)}
                                                />
                                                <span className="text-sm font-bold text-harven-dark">Exigir Mínimo de 8 Caracteres</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-harven-border rounded-lg cursor-pointer hover:bg-harven-bg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-primary focus:ring-primary"
                                                    checked={settings.pwd_special_chars === true}
                                                    onChange={(e) => handleChange('pwd_special_chars', e.target.checked)}
                                                />
                                                <span className="text-sm font-bold text-harven-dark">Exigir Caracteres Especiais (!@#)</span>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 border border-harven-border rounded-lg cursor-pointer hover:bg-harven-bg transition-colors">
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-primary focus:ring-primary"
                                                    checked={settings.pwd_expiration === true}
                                                    onChange={(e) => handleChange('pwd_expiration', e.target.checked)}
                                                />
                                                <span className="text-sm font-bold text-harven-dark">Expiração de Senha (90 dias)</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Sessão</h4>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Timeout de Sessão Ociosa</label>
                                            <select
                                                className="w-full bg-harven-bg border-none rounded-lg p-3 text-sm font-medium focus:ring-1 focus:ring-primary text-harven-dark"
                                                value={settings.session_timeout || '30 minutos'}
                                                onChange={(e) => handleChange('session_timeout', e.target.value)}
                                            >
                                                <option>15 minutos</option>
                                                <option>30 minutos</option>
                                                <option>1 hora</option>
                                                <option>Nunca</option>
                                            </select>
                                        </div>
                                        <div className="pt-2">
                                            <button className="w-full py-3 bg-red-50 text-red-600 font-bold text-xs uppercase rounded-lg border border-red-100 hover:bg-red-100 transition-colors">
                                                Forçar Logout de Todos os Usuários
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-harven-border p-8 shadow-sm flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-harven-dark">Autenticação de Dois Fatores (2FA)</h4>
                                    <p className="text-xs text-gray-500 mt-1">Obrigar administradores e professores a usarem 2FA.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.force_2fa === true}
                                        onChange={(e) => handleChange('force_2fa', e.target.checked)}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* TAB: LOGS */}
                    {activeTab === 'logs' && (
                        <div className="bg-white rounded-2xl border border-harven-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 min-h-[500px] flex flex-col">
                            <div className="p-6 border-b border-harven-border flex flex-col md:flex-row justify-between items-center gap-4 bg-harven-bg/30">
                                <h3 className="font-display font-bold text-harven-dark flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400">history</span>
                                    Registro de Auditoria
                                </h3>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <input className="bg-white border border-harven-border rounded-lg px-4 py-2 text-xs w-full md:w-64" placeholder="Buscar por usuário ou ação..." />
                                    <button className="bg-white border border-harven-border px-3 py-2 rounded-lg text-gray-500 hover:text-harven-dark"><span className="material-symbols-outlined text-[18px]">download</span></button>
                                </div>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-left">
                                    <thead className="bg-harven-bg/50 border-b border-harven-border text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                        <tr>
                                            <th className="p-4">Ação</th>
                                            <th className="p-4">Mensagem</th>
                                            <th className="p-4">Autor</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-harven-bg">
                                        {logs && logs.length > 0 ? logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-harven-bg/20 transition-colors">
                                                <td className="p-4 text-sm font-bold text-harven-dark">{log.type || 'System'}</td>
                                                <td className="p-4 text-xs font-medium text-gray-600">{log.msg}</td>
                                                <td className="p-4 text-xs font-medium text-gray-500 font-mono">{log.author}</td>
                                                <td className="p-4 text-xs text-gray-400 font-mono">{log.status}</td>
                                                <td className="p-4 text-right text-xs font-bold text-gray-500">{new Date(log.created_at).toLocaleDateString()}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-400 text-sm">Nenhum log encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-harven-border bg-harven-bg/20 flex justify-center">
                                <button className="text-xs font-bold text-primary-dark hover:underline uppercase tracking-widest">Carregar Mais Antigos</button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
export default SystemSettings;

const LoginPreviewModal: React.FC<{ isOpen: boolean; onClose: () => void; settings: any }> = ({ isOpen, onClose, settings }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-[60] bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-2 shadow-sm transition-colors">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className="flex h-full w-full overflow-hidden bg-[#f8f9fa] font-sans pointer-events-none select-none">
                    {/* Lado Esquerdo - Imagem & Branding */}
                    <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center items-center bg-[#1c2d1b] overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <img
                                alt="Background Preview"
                                className="w-full h-full object-cover"
                                src={settings.login_bg_url}
                            />
                            <div className="absolute inset-0 bg-[#1c2d1b]/70 mix-blend-multiply"></div>
                            <div className="absolute inset-0 bg-black/20"></div>
                        </div>

                        <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
                            <img src={settings.login_logo_url} className="h-8 w-auto object-contain brightness-0 invert" alt="Logo" onError={(e: any) => e.currentTarget.style.display = 'none'} />
                        </div>

                        <div className="relative z-10 p-12 flex flex-col items-center justify-center h-full text-center max-w-xl">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 font-display">
                                Bem-vindo ao <span style={{ color: settings.primary_color }}>{settings.platform_name}</span>
                            </h1>
                            <p className="text-white/90 text-lg font-light leading-relaxed max-w-md">
                                Plataforma educacional que forma pensamento crítico através da inteligência artificial
                            </p>
                        </div>

                        <div className="absolute bottom-8 left-8 z-20 text-xs text-white/60">
                            © 2026 Harven education. All rights reserved.
                        </div>
                    </div>

                    {/* Lado Direito - Formulário de Login (Simulado) */}
                    <div className="w-full lg:w-1/2 flex flex-col relative bg-[#f8f9fa] h-full justify-center items-center p-12">
                        <div className="w-full max-w-md opacity-80">
                            <div className="flex flex-col mb-8">
                                <h2 className="text-3xl font-bold tracking-tight text-[#1c2d1b] mb-2 font-display">Acesse sua conta</h2>
                                <p className="text-gray-500 text-sm">Entre com seu RA e senha institucional</p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[#1a1d0c] text-sm font-semibold">RA (Registro Acadêmico)</label>
                                    <div className="h-12 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[#1a1d0c] text-sm font-semibold">Senha</label>
                                    <div className="h-12 w-full bg-gray-100 rounded-lg border border-gray-200"></div>
                                </div>
                                <div className="h-12 w-full rounded-lg flex items-center justify-center font-bold text-[#1c2d1b] uppercase tracking-wide shadow-sm" style={{ backgroundColor: settings.primary_color }}>
                                    Entrar
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 text-xs font-bold text-red-500 bg-red-100 px-3 py-1 rounded-full">
                            MODO DE VISUALIZAÇÃO
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
