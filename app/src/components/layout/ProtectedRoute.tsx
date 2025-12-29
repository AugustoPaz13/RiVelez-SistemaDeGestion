import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles
}) => {
    const { authState } = useAuth();

    // Si no está autenticado, redirigir al login
    if (!authState.isAuthenticated || !authState.user) {
        return <Navigate to="/login" replace />;
    }

    // Si hay roles específicos permitidos, verificar
    if (allowedRoles && !allowedRoles.includes(authState.user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
