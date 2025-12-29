import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Páginas por rol
import CajeroPage from './pages/cajero/CajeroPage';
import ClientePage from './pages/cliente/ClientePage';
import CocineroPage from './pages/cocinero/CocineroPage';
import GerentePage from './pages/gerente/GerentePage';

// Módulos del gerente (versiones placeholder)
import GestionUsuariosPage from './pages/gerente/GestionUsuariosPage';
import GestionMenuPage from './pages/gerente/GestionMenuPage';
import ControlStockPage from './pages/gerente/ControlStockPage';
import ReportesPage from './pages/gerente/ReportesPage';
import PromocionesPage from './pages/gerente/PromocionesPage';

function AppRoutes() {
    const { authState } = useAuth();

    const getDefaultRoute = () => {
        if (!authState.isAuthenticated || !authState.user) {
            return '/login';
        }

        switch (authState.user.role) {
            case 'gerente':
                return '/gerente';
            case 'cajero':
                return '/cajero';
            case 'cocinero':
                return '/cocinero';
            case 'cliente':
                return '/cliente';
            default:
                return '/login';
        }
    };

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    authState.isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <LoginPage />
                }
            />

            <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Cajero */}
            <Route
                path="/cajero"
                element={
                    <ProtectedRoute allowedRoles={['cajero']}>
                        <CajeroPage />
                    </ProtectedRoute>
                }
            />

            {/* Cliente - Acceso público (vía QR code) */}
            <Route
                path="/cliente"
                element={<ClientePage />}
            />

            {/* Cocinero */}
            <Route
                path="/cocinero"
                element={
                    <ProtectedRoute allowedRoles={['cocinero']}>
                        <CocineroPage />
                    </ProtectedRoute>
                }
            />

            {/* Gerente */}
            <Route
                path="/gerente"
                element={
                    <ProtectedRoute allowedRoles={['gerente']}>
                        <GerentePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gerente/usuarios"
                element={
                    <ProtectedRoute allowedRoles={['gerente']}>
                        <GestionUsuariosPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gerente/menu"
                element={
                    <ProtectedRoute allowedRoles={['gerente']}>
                        <GestionMenuPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gerente/stock"
                element={
                    <ProtectedRoute allowedRoles={['gerente']}>
                        <ControlStockPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gerente/reportes"
                element={
                    <ProtectedRoute allowedRoles={['gerente']}>
                        <ReportesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/gerente/promociones"
                element={
                    <ProtectedRoute allowedRoles={['gerente']}>
                        <PromocionesPage />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
        </Routes>
    );
}

function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </HashRouter>
    );
}

export default App;
