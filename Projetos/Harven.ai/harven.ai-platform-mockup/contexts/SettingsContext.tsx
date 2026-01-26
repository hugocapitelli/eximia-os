
import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminApi } from '../services/api';

export interface SystemSettingsData {
    platform_name: string;
    base_url: string;
    support_email: string;
    primary_color: string;
    logo_url: string;
    login_logo_url: string;
    login_bg_url: string;
    module_auto_register: boolean;
    module_ai_tutor: boolean;
    module_gamification: boolean;
    module_dark_mode: boolean;
    limit_tokens: number;
    limit_upload_mb: number;
    openai_key?: string;
    anthropic_connected: boolean;
    sso_azure: boolean;
    sso_google: boolean;
    pwd_min_length: number;
    pwd_special_chars: boolean;
    pwd_expiration: boolean;
    session_timeout: string;
    force_2fa: boolean;
    
    // Novos campos
    moodle_url: string;
    moodle_token: string;
    smtp_server: string;
    smtp_port: number;
    smtp_user: string;
    smtp_password: string;
    firewall_blocked_ips: string;
    firewall_whitelist: string;
    backup_enabled: boolean;
    backup_frequency: string;
    backup_retention: number;
}

interface SettingsContextType {
    settings: SystemSettingsData;
    loading: boolean;
    refreshSettings: () => Promise<void>;
    updateSettings: (newSettings: Partial<SystemSettingsData>) => Promise<void>;
}

const defaultSettings: SystemSettingsData = {
    platform_name: 'Academy Platform',
    base_url: 'https://app.school.com',
    support_email: 'suporte@school.com',
    primary_color: '#D0FF00',
    logo_url: '/assets/logo/2.png',
    login_logo_url: '/assets/logo/2.png',
    login_bg_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu1xjVy8-tTUa7Rg2hEmktsCWJxqvIX3OK7FpFaopQvyB8ps8bXXqzl_7FBXD-GmLEoNwL_Vn0JXKVXExgfnVuv2fOLBuEVkQrOoAFLDlJdpil7xF9AC4oCYQKTHjMF5hx2wAiR8Mq2VMgbuU8cUP-P2skdbiqEceR7SQhgUTqGzZwQLEy_MQQ5OPD3_Gikr7z2kOnX_sJySZmgWkS5-e0HWvvzjqrOZMboTNlYU-yrYOhrzKdfuHYrxdNQ4OHtsc8gdDZyg2zpng',
    module_auto_register: true,
    module_ai_tutor: true,
    module_gamification: true,
    module_dark_mode: true,
    limit_tokens: 2048,
    limit_upload_mb: 500,
    anthropic_connected: false,
    sso_azure: true,
    sso_google: false,
    pwd_min_length: 8,
    pwd_special_chars: true,
    pwd_expiration: false,
    session_timeout: '30 minutos',
    force_2fa: false,
    
    // Defaults novos
    moodle_url: '',
    moodle_token: '',
    smtp_server: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    firewall_blocked_ips: '',
    firewall_whitelist: '',
    backup_enabled: true,
    backup_frequency: 'Diário',
    backup_retention: 30
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<SystemSettingsData>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const applyBranding = (data: SystemSettingsData) => {
        // Aplica cor primária dinamicamente
        document.documentElement.style.setProperty('--primary-color', data.primary_color);
        // Opcional: Calcular cores derivadas (hover, dark) se necessário

        // Atualiza título da aba
        document.title = data.platform_name;

        // Atualiza favicon (avançado, simplificado aqui)
    };

    const refreshSettings = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getSettings();
            if (data) {
                // Mescla com defaults para garantir que todos campos existam
                const merged = { ...defaultSettings, ...data };
                setSettings(merged);
                applyBranding(merged);
            }
        } catch (error) {
            console.error("Erro ao carregar settings", error);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings: Partial<SystemSettingsData>) => {
        // Otimistic update
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        applyBranding(updated);

        // Persist
        await adminApi.saveSettings(updated);
    };

    useEffect(() => {
        refreshSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, refreshSettings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
