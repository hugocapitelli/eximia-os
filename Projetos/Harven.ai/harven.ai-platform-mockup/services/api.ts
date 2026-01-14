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
    create: async (chapterId: string, data: any) => {
        const response = await api.post(`/chapters/${chapterId}/contents`, data);
        return response.data;
    },
    delete: async (contentId: string) => {
        const response = await api.delete(`/contents/${contentId}`);
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
    }
};

export default api;
