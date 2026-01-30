import axios from 'axios';

// URL da API configuravel via variavel de ambiente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para adicionar token (se disponível)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('sb-access-token'); // Supabase token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authApi = {
    login: async (ra: string, password: string) => {
        const response = await api.post('/auth/login', { ra, password });
        return response.data;
    }
};

export const dashboardApi = {
    getStats: async (userId?: string) => {
        const response = await api.get('/dashboard/stats', {
            params: userId ? { user_id: userId } : {}
        });
        return response.data;
    }
};

// Helper para obter dados do usuário logado
const getLoggedUser = () => {
    try {
        const userData = localStorage.getItem('user-data');
        if (userData) {
            return JSON.parse(userData);
        }
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
    return null;
};

export const disciplinesApi = {
    list: async (userId?: string, role?: string) => {
        // Se não passar parâmetros, tenta pegar do usuário logado
        const user = getLoggedUser();
        const params: any = {};
        if (userId || user?.id) {
            params.user_id = userId || user?.id;
        }
        if (role || user?.role) {
            params.role = role || user?.role;
        }
        const response = await api.get('/disciplines', { params });
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post('/disciplines', data);
        return response.data;
    },
    get: async (disciplineId: string) => {
        const response = await api.get(`/disciplines/${disciplineId}`);
        return response.data;
    },
    update: async (disciplineId: string, data: any) => {
        const response = await api.put(`/disciplines/${disciplineId}`, data);
        return response.data;
    },
    getStats: async (disciplineId: string) => {
        const response = await api.get(`/classes/${disciplineId}/stats`);
        return response.data;
    },
    getTeachers: async (disciplineId: string | number) => {
        const response = await api.get(`/disciplines/${disciplineId}/teachers`);
        return response.data;
    },
    addTeacher: async (disciplineId: string | number, teacherId: number) => {
        const response = await api.post(`/disciplines/${disciplineId}/teachers`, { teacher_id: teacherId });
        return response.data;
    },
    removeTeacher: async (disciplineId: string | number, teacherId: number) => {
        const response = await api.delete(`/disciplines/${disciplineId}/teachers/${teacherId}`);
        return response.data;
    },
    getStudents: async (disciplineId: string | number) => {
        const response = await api.get(`/disciplines/${disciplineId}/students`);
        return response.data;
    },
    addStudent: async (disciplineId: string | number, studentId: number) => {
        const response = await api.post(`/disciplines/${disciplineId}/students`, { student_id: studentId });
        return response.data;
    },
    addStudentsBatch: async (disciplineId: string | number, studentIds: string[]) => {
        const response = await api.post(`/disciplines/${disciplineId}/students/batch`, studentIds);
        return response.data;
    },
    removeStudent: async (disciplineId: string | number, studentId: number) => {
        const response = await api.delete(`/disciplines/${disciplineId}/students/${studentId}`);
        return response.data;
    },
    uploadImage: async (disciplineId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/disciplines/${disciplineId}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    getCourses: async (disciplineId: string) => {
        const response = await api.get(`/disciplines/${disciplineId}/courses`);
        return response.data;
    },
    getChapters: async (disciplineId: string) => {
        const response = await api.get(`/disciplines/${disciplineId}/chapters`);
        return response.data;
    },
    createChapter: async (disciplineId: string, data: any) => {
        const response = await api.post(`/disciplines/${disciplineId}/chapters`, data);
        return response.data;
    }
};

export const adminApi = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
    getLogs: async () => {
        const response = await api.get('/admin/logs');
        return response.data;
    },
    createAction: async (data: { type: string, message: string, author: string }) => {
        const response = await api.post('/admin/actions', data);
        return response.data;
    },
    getSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },
    saveSettings: async (settings: any) => {
        const response = await api.post('/admin/settings', settings);
        return response.data;
    },
    // Upload system logo
    uploadLogo: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/admin/settings/upload-logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    // Upload login page logo
    uploadLoginLogo: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/admin/settings/upload-login-logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    // Upload login page background
    uploadLoginBg: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/admin/settings/upload-login-bg', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // ============================================
    // Performance & System Monitoring
    // ============================================
    getPerformance: async () => {
        const response = await api.get('/admin/performance');
        return response.data;
    },
    getStorageStats: async () => {
        const response = await api.get('/admin/storage');
        return response.data;
    },

    // ============================================
    // Backups
    // ============================================
    listBackups: async () => {
        const response = await api.get('/admin/backups');
        return response.data;
    },
    createBackup: async () => {
        const response = await api.post('/admin/backups');
        return response.data;
    },

    // ============================================
    // Security Actions
    // ============================================
    forceLogoutAll: async () => {
        const response = await api.post('/admin/force-logout');
        return response.data;
    },
    clearCache: async () => {
        const response = await api.post('/admin/clear-cache');
        return response.data;
    },

    // ============================================
    // Enhanced Logs
    // ============================================
    searchLogs: async (params: { query?: string; log_type?: string; limit?: number; offset?: number }) => {
        const response = await api.get('/admin/logs/search', { params });
        return response.data;
    },
    exportLogs: async (format: 'json' | 'csv' = 'json') => {
        const response = await api.get('/admin/logs/export', {
            params: { format },
            responseType: format === 'csv' ? 'blob' : 'json'
        });
        return response.data;
    }
};

export const usersApi = {
    list: async (role?: string) => {
        const params = role ? { role } : {};
        const response = await api.get('/users', { params });
        return response.data;
    },
    create: async (user: any) => {
        const response = await api.post('/users', user);
        return response.data;
    },
    createBatch: async (users: any[]) => {
        const response = await api.post('/users/batch', users);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/users/${id}`, data);
        return response.data;
    },
    get: async (id: string) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },
    uploadAvatar: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/users/${id}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },
    deleteAvatar: async (id: string) => {
        const response = await api.delete(`/users/${id}/avatar`);
        return response.data;
    }
};

export const coursesApi = {
    list: async (userId?: string, role?: string) => {
        // Lista todos os cursos filtrados por usuário
        const user = getLoggedUser();
        const params: any = {};
        if (userId || user?.id) {
            params.user_id = userId || user?.id;
        }
        if (role || user?.role) {
            params.role = role || user?.role;
        }
        const response = await api.get('/courses', { params });
        return response.data;
    },
    listByClass: async (classId: string) => {
        const response = await api.get(`/classes/${classId}/courses`);
        return response.data;
    },
    get: async (courseId: string) => {
        const response = await api.get(`/courses/${courseId}`);
        return response.data;
    },
    create: async (classId: string, data: any) => {
        const response = await api.post(`/classes/${classId}/courses`, data);
        return response.data;
    },
    update: async (courseId: string, data: any) => {
        const response = await api.put(`/courses/${courseId}`, data);
        return response.data;
    },
    delete: async (courseId: string) => {
        const response = await api.delete(`/courses/${courseId}`);
        return response.data;
    },
    uploadImage: async (courseId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/courses/${courseId}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export const chaptersApi = {
    list: async (courseId: string) => {
        const response = await api.get(`/courses/${courseId}/chapters`);
        return response.data;
    },
    create: async (courseId: string, data: any) => {
        const response = await api.post(`/courses/${courseId}/chapters`, data);
        return response.data;
    },
    update: async (chapterId: string, data: any) => {
        const response = await api.put(`/chapters/${chapterId}`, data);
        return response.data;
    },
    delete: async (chapterId: string) => {
        const response = await api.delete(`/chapters/${chapterId}`);
        return response.data;
    }
};

export const contentsApi = {
    list: async (chapterId: string) => {
        const response = await api.get(`/chapters/${chapterId}/contents`);
        return response.data;
    },
    get: async (contentId: string) => {
        const response = await api.get(`/contents/${contentId}`);
        return response.data;
    },
    create: async (chapterId: string, data: any) => {
        const response = await api.post(`/chapters/${chapterId}/contents`, data);
        return response.data;
    },
    update: async (contentId: string, data: any) => {
        const response = await api.put(`/contents/${contentId}`, data);
        return response.data;
    },
    delete: async (contentId: string) => {
        const response = await api.delete(`/contents/${contentId}`);
        return response.data;
    },
    uploadFile: async (chapterId: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/chapters/${chapterId}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
};

export const questionsApi = {
    list: async (contentId: string) => {
        const response = await api.get(`/contents/${contentId}/questions`);
        return response.data;
    },
    create: async (contentId: string, items: any[]) => {
        const response = await api.post(`/contents/${contentId}/questions`, { items });
        return response.data;
    },
    update: async (questionId: string, data: any) => {
        const response = await api.put(`/questions/${questionId}`, data);
        return response.data;
    },
    delete: async (questionId: string) => {
        const response = await api.delete(`/questions/${questionId}`);
        return response.data;
    },
    updateBatch: async (contentId: string, questions: any[]) => {
        const response = await api.put(`/contents/${contentId}/questions/batch`, { items: questions });
        return response.data;
    }
};

// ============================================
// Upload API - Upload de arquivos genérico
// ============================================
export const uploadApi = {
    // Upload genérico de arquivo (video, audio, document)
    upload: async (file: File, type?: 'video' | 'audio' | 'document') => {
        const formData = new FormData();
        formData.append('file', file);
        if (type) {
            formData.append('type', type);
        }

        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 300000 // 5 minutos para uploads grandes
        });
        return response.data;
    },

    // Upload de vídeo específico
    uploadVideo: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload/video', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 600000 // 10 minutos para vídeos grandes
        });
        return response.data;
    },

    // Upload de áudio específico
    uploadAudio: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/upload/audio', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 300000 // 5 minutos
        });
        return response.data;
    }
};

// ============================================
// AI API - Harven AI Agents (6 agentes completos)
// ============================================
export const aiApi = {
    // Verificar status do servico de IA
    getStatus: async () => {
        const response = await api.get('/api/ai/status');
        return response.data;
    },

    // 1. Harven_Creator - Gerar perguntas socraticas
    generateQuestions: async (data: {
        chapter_content: string;
        chapter_title?: string;
        learning_objective?: string;
        difficulty?: 'iniciante' | 'intermediario' | 'avancado';
        max_questions?: number;
    }) => {
        const response = await api.post('/api/ai/creator/generate', data, {
            timeout: 60000 // 60 segundos (IA pode demorar)
        });
        return response.data;
    },

    // 2. Harven_Socrates - Dialogo socratico
    socraticDialogue: async (data: {
        student_message: string;
        chapter_content: string;
        initial_question: { text: string; skill?: string; intention?: string };
        conversation_history?: Array<{ role: string; content: string; timestamp?: string }>;
        interactions_remaining?: number;
        session_id?: string;
        chapter_id?: string;
    }) => {
        const response = await api.post('/api/ai/socrates/dialogue', data, {
            timeout: 30000 // 30 segundos
        });
        return response.data;
    },

    // 3. Harven_Analyst - Detectar conteudo de IA
    detectAI: async (data: {
        text: string;
        context?: any;
        interaction_metadata?: any;
    }) => {
        const response = await api.post('/api/ai/analyst/detect', data, {
            timeout: 20000 // 20 segundos
        });
        return response.data;
    },

    // 4. Harven_Editor - Refinar respostas do tutor
    editResponse: async (data: {
        orientador_response: string;
        context?: any;
    }) => {
        const response = await api.post('/api/ai/editor/edit', data, {
            timeout: 30000 // 30 segundos
        });
        return response.data;
    },

    // 5. Harven_Tester - Validar qualidade das respostas
    validateResponse: async (data: {
        edited_response: string;
        context?: any;
    }) => {
        const response = await api.post('/api/ai/tester/validate', data, {
            timeout: 30000 // 30 segundos
        });
        return response.data;
    },

    // 6. Harven_Organizer - Gerenciar sessoes e exportacoes
    organizeSession: async (data: {
        action: 'save_message' | 'finalize_session' | 'export_to_moodle' | 'get_session_status' | 'validate_export_payload';
        payload: any;
        metadata?: any;
    }) => {
        const response = await api.post('/api/ai/organizer/session', data, {
            timeout: 20000 // 20 segundos
        });
        return response.data;
    },

    // Preparar exportacao para Moodle
    prepareMoodleExport: async (sessionData: any) => {
        const response = await api.post('/api/ai/organizer/prepare-export', sessionData);
        return response.data;
    },

    // Estimar custo
    estimateCost: async (promptTokens: number, completionTokens: number, model?: string) => {
        const response = await api.get('/api/ai/estimate-cost', {
            params: { prompt_tokens: promptTokens, completion_tokens: completionTokens, model }
        });
        return response.data;
    }
};

// ============================================
// Text-to-Speech API (ElevenLabs)
// ============================================
export const ttsApi = {
    // Verificar status do TTS
    getStatus: async () => {
        const response = await api.get('/api/ai/tts/status');
        return response.data;
    },

    // Listar vozes disponíveis
    getVoices: async () => {
        const response = await api.get('/api/ai/tts/voices');
        return response.data;
    },

    // Gerar áudio a partir de texto
    generate: async (data: {
        text: string;
        voice_id?: string;
        model_id?: string;
        content_id?: string;
    }) => {
        const response = await api.post('/api/ai/tts/generate', data, {
            timeout: 120000 // 2 minutos (áudio pode demorar)
        });
        return response.data;
    },

    // Gerar resumo narrado de um conteúdo (estilo NotebookLM)
    generateSummary: async (data: {
        content_id: string;
        style?: 'resumo' | 'explicacao' | 'podcast';
        voice_id?: string;
    }) => {
        const response = await api.post('/api/ai/tts/generate-summary', data, {
            timeout: 180000 // 3 minutos (gera script + áudio)
        });
        return response.data;
    },

    // Transcrever áudio para texto (Speech-to-Text com Whisper)
    transcribe: async (data: {
        content_id: string;
        audio_url?: string;
    }) => {
        const response = await api.post('/api/ai/transcribe', data, {
            timeout: 300000 // 5 minutos para arquivos longos
        });
        return response.data;
    }
};

// ============================================
// Notifications API
// ============================================
export const notificationsApi = {
    // Get notifications for a user
    list: async (userId: string, unreadOnly: boolean = false) => {
        const response = await api.get(`/notifications/${userId}`, {
            params: { unread_only: unreadOnly }
        });
        return response.data;
    },

    // Get unread count
    getCount: async (userId: string) => {
        const response = await api.get(`/notifications/${userId}/count`);
        return response.data;
    },

    // Create a notification
    create: async (data: {
        user_id: string;
        title: string;
        message: string;
        type?: 'info' | 'warning' | 'success' | 'error';
        link?: string;
    }) => {
        const response = await api.post('/notifications', data);
        return response.data;
    },

    // Mark as read
    markAsRead: async (notificationId: string) => {
        const response = await api.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    // Mark all as read
    markAllAsRead: async (userId: string) => {
        const response = await api.put(`/notifications/${userId}/read-all`);
        return response.data;
    },

    // Delete notification
    delete: async (notificationId: string) => {
        const response = await api.delete(`/notifications/${notificationId}`);
        return response.data;
    }
};

// ============================================
// Global Search API
// ============================================
export const searchApi = {
    // Global search across all entities
    search: async (query: string, userId?: string, role?: string) => {
        const response = await api.get('/search', {
            params: { q: query, user_id: userId, role }
        });
        return response.data;
    }
};

// ============================================
// User Stats & Activities API
// ============================================
export const userStatsApi = {
    // Get user statistics
    getStats: async (userId: string) => {
        const response = await api.get(`/users/${userId}/stats`);
        return response.data;
    },

    // Get user activities
    getActivities: async (userId: string, limit: number = 10, offset: number = 0) => {
        const response = await api.get(`/users/${userId}/activities`, {
            params: { limit, offset }
        });
        return response.data;
    },

    // Record a new activity
    recordActivity: async (userId: string, activity: {
        action: string;
        target_type?: string;
        target_id?: string;
        target_title?: string;
        metadata?: Record<string, any>;
    }) => {
        const response = await api.post(`/users/${userId}/activities`, activity);
        return response.data;
    },

    // Get user certificates
    getCertificates: async (userId: string) => {
        const response = await api.get(`/users/${userId}/certificates`);
        return response.data;
    },

    // Get user achievements (with summary)
    getAchievements: async (userId: string, includeLocked: boolean = true) => {
        const response = await api.get(`/users/${userId}/achievements`, {
            params: { include_locked: includeLocked }
        });
        return response.data;
    },

    // Unlock a specific achievement
    unlockAchievement: async (userId: string, achievementId: string) => {
        const response = await api.post(`/users/${userId}/achievements/${achievementId}/unlock`);
        return response.data;
    },

    // Get course progress
    getCourseProgress: async (userId: string, courseId: string) => {
        const response = await api.get(`/users/${userId}/courses/${courseId}/progress`);
        return response.data;
    },

    // Mark content as completed
    completeContent: async (userId: string, courseId: string, contentId: string, timeSpentMinutes: number = 0) => {
        const response = await api.post(
            `/users/${userId}/courses/${courseId}/complete-content/${contentId}`,
            null,
            { params: { time_spent_minutes: timeSpentMinutes } }
        );
        return response.data;
    }
};

// ============================================
// Chat Sessions API (Persistence & Moodle Export)
// ============================================
export const chatSessionsApi = {
    // Create or get existing session for user+content
    createOrGet: async (data: {
        user_id: string;
        content_id: string;
        chapter_id?: string;
        course_id?: string;
    }) => {
        const response = await api.post('/chat-sessions', data);
        return response.data;
    },

    // Get session by ID with all messages
    get: async (sessionId: string) => {
        const response = await api.get(`/chat-sessions/${sessionId}`);
        return response.data;
    },

    // Get session by content ID and user ID
    getByContent: async (contentId: string, userId: string) => {
        const response = await api.get(`/chat-sessions/by-content/${contentId}`, {
            params: { user_id: userId }
        });
        return response.data;
    },

    // Get all sessions for a user
    listByUser: async (userId: string, status?: string) => {
        const response = await api.get(`/users/${userId}/chat-sessions`, {
            params: status ? { status } : {}
        });
        return response.data;
    },

    // Add a message to a session
    addMessage: async (sessionId: string, message: {
        role: 'user' | 'assistant' | 'system';
        content: string;
        agent_type?: string;
        metadata?: Record<string, any>;
    }) => {
        const response = await api.post(`/chat-sessions/${sessionId}/messages`, message);
        return response.data;
    },

    // Get all messages from a session
    getMessages: async (sessionId: string) => {
        const response = await api.get(`/chat-sessions/${sessionId}/messages`);
        return response.data;
    },

    // Mark session as completed
    complete: async (sessionId: string, performanceScore?: number) => {
        const response = await api.put(`/chat-sessions/${sessionId}/complete`, null, {
            params: performanceScore !== undefined ? { performance_score: performanceScore } : {}
        });
        return response.data;
    },

    // Export session to Moodle LMS format
    exportToMoodle: async (sessionId: string) => {
        const response = await api.post(`/chat-sessions/${sessionId}/export-moodle`);
        return response.data;
    },

    // Batch export multiple sessions
    batchExportToMoodle: async (filters: {
        user_id?: string;
        course_id?: string;
        status?: string;
    }) => {
        const response = await api.get('/export/moodle/batch', { params: filters });
        return response.data;
    }
};

// ============================================
// Integrations API - JACAD & Moodle
// ============================================
export const integrationsApi = {
    // --- Status & Conexão ---

    // Testar conexão com sistema externo
    testConnection: async (system: 'moodle' | 'jacad') => {
        const response = await api.post('/integrations/test-connection', null, {
            params: { system }
        });
        return response.data;
    },

    // Obter status de todas as integrações
    getStatus: async () => {
        const response = await api.get('/integrations/status');
        return response.data;
    },

    // Obter logs de sincronização
    getLogs: async (params?: { system?: string; status?: string; limit?: number }) => {
        const response = await api.get('/integrations/logs', { params });
        return response.data;
    },

    // Obter mapeamentos de IDs externos
    getMappings: async (entityType?: string) => {
        const response = await api.get('/integrations/mappings', {
            params: entityType ? { entity_type: entityType } : {}
        });
        return response.data;
    },

    // --- JACAD ---

    // Sincronização completa com JACAD
    jacadSync: async () => {
        const response = await api.post('/integrations/jacad/sync', null, {
            timeout: 60000 // 60 segundos para operações de sync
        });
        return response.data;
    },

    // Importar alunos do JACAD
    jacadImportStudents: async () => {
        const response = await api.post('/integrations/jacad/import-students', null, {
            timeout: 60000
        });
        return response.data;
    },

    // Importar disciplinas do JACAD
    jacadImportDisciplines: async () => {
        const response = await api.post('/integrations/jacad/import-disciplines', null, {
            timeout: 60000
        });
        return response.data;
    },

    // Buscar aluno no JACAD pelo RA
    getJacadStudent: async (ra: string) => {
        const response = await api.get(`/integrations/jacad/student/${ra}`);
        return response.data;
    },

    // Buscar aluno para login (verifica JACAD + banco local)
    lookupStudentForLogin: async (ra: string) => {
        const response = await api.get(`/integrations/lookup-student/${ra}`);
        return response.data;
    },

    // --- Moodle ---

    // Sincronização completa com Moodle (export + import ratings)
    moodleSync: async () => {
        const response = await api.post('/integrations/moodle/sync', null, {
            timeout: 60000
        });
        return response.data;
    },

    // Exportar sessões para o Moodle
    moodleExportSessions: async (data?: {
        user_id?: string;
        discipline_id?: string;
        start_date?: string;
        end_date?: string;
        export_format?: 'portfolio' | 'xapi';
    }) => {
        const response = await api.post('/integrations/moodle/export-sessions', data || {}, {
            timeout: 60000
        });
        return response.data;
    },

    // Obter avaliações recebidas do Moodle
    getMoodleRatings: async (params?: { user_id?: string; session_id?: string }) => {
        const response = await api.get('/integrations/moodle/ratings', { params });
        return response.data;
    },

    // Importar usuários do Moodle
    moodleImportUsers: async () => {
        const response = await api.post('/integrations/moodle/import-users');
        return response.data;
    }
};

export default api;
