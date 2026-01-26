import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
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
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    }
};

export const disciplinesApi = {
    list: async () => {
        const response = await api.get('/disciplines');
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
    }
};

export const coursesApi = {
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

export default api;
