// Tipos de autenticación
export type UserRole = 'gerente' | 'cajero' | 'cocinero' | 'cliente';

export interface User {
    id: number | string;
    username: string;
    password?: string;
    role: UserRole;
    nombre: string;
    activo: boolean;
    fechaCreacion?: string;
    token?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    username: string;
    nombre: string;
    role: UserRole;
    message: string;
}
