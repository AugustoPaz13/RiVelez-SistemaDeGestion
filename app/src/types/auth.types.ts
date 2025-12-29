// Tipos de autenticación
export type UserRole = 'gerente' | 'cajero' | 'cocinero' | 'cliente';

export interface User {
    id: string;
    username: string;
    password: string;
    role: UserRole;
    nombre: string;
    activo: boolean;
    fechaCreacion?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}
