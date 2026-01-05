import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, LoginCredentials } from '../types';
// import { mockUsers } from '../data'; // Eliminado
import { authService } from '../services/authService';

interface AuthContextType {
    authState: AuthState;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const savedUser = localStorage.getItem('rivelez_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setAuthState({
                    user,
                    isAuthenticated: true,
                });
            } catch (error) {
                console.error('Error loading saved user:', error);
                localStorage.removeItem('rivelez_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials): Promise<boolean> => {
        setIsLoading(true);

        try {
            const user = await authService.login(credentials);
            if (user) {
                setAuthState({
                    user,
                    isAuthenticated: true,
                });
                localStorage.setItem('rivelez_user', JSON.stringify(user));
                setIsLoading(false);
                return true;
            }
        } catch (error) {
            console.error("Login error", error);
        }

        setIsLoading(false);
        return false;
    };

    const logout = () => {
        setAuthState({
            user: null,
            isAuthenticated: false,
        });
        localStorage.removeItem('rivelez_user');
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
