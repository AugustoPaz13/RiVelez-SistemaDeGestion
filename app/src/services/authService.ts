import api from './api';
import { LoginCredentials, AuthResponse, User } from '../types';

export const authService = {
    login: async (credentials: LoginCredentials): Promise<User> => {
        const response = await api.post<AuthResponse>('/auth/login', credentials);
        // El backend ahora devuelve role en minúsculas gracias a @JsonValue
        const { token, username, nombre, role } = response.data;

        return {
            id: 0, // El backend no devuelve ID en el login
            username,
            nombre,
            role: role as any, // Ya viene en minúsculas del backend
            token,
            activo: true
        };
    },

    register: async (userData: any) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    }
};
