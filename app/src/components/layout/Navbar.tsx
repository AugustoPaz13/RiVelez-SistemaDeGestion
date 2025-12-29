import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { authState, logout } = useAuth();

    if (!authState.isAuthenticated || !authState.user) {
        return null;
    }

    const getRoleLabel = (role: string) => {
        const labels: Record<string, string> = {
            'gerente': 'Gerente',
            'cajero': 'Cajero',
            'cocinero': 'Cocinero',
            'cliente': 'Cliente',
        };
        return labels[role] || role;
    };

    return (
        <nav style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            backgroundColor: '#0055A4',
            color: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}>
            {/* Logo y nombre */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                    src="/logo-rivelez.png"
                    alt="RiVelez"
                    style={{ width: '40px', height: '40px' }}
                />
                <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '700' }}>RiVelez</h2>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.9 }}>Sistema de Gestión</p>
                </div>
            </div>

            {/* Usuario y logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500' }}>
                        <UserIcon style={{ display: 'inline', width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                        {authState.user.nombre}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>
                        {getRoleLabel(authState.user.role)}
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        color: 'white'
                    }}
                >
                    <LogOut className="w-4 h-4" style={{ marginRight: '0.5rem' }} />
                    Salir
                </Button>
            </div>
        </nav>
    );
};
