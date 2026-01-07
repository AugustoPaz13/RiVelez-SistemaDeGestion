import { Navbar } from '../../components/layout/Navbar';
import { useNavigate } from 'react-router-dom';
import { Users, UtensilsCrossed, Package, TrendingUp, Tag, MessageSquare } from 'lucide-react';

export default function GerentePage() {
    const navigate = useNavigate();

    const modules = [
        { id: 'usuarios', name: 'Gestionar Usuarios', icon: Users, path: '/gerente/usuarios', color: '#3b82f6', description: 'Administrar empleados y permisos' },
        { id: 'menu', name: 'Gestionar Menú', icon: UtensilsCrossed, path: '/gerente/menu', color: '#10b981', description: 'Editar platos y categorías' },
        { id: 'stock', name: 'Control de Stock', icon: Package, path: '/gerente/stock', color: '#f59e0b', description: 'Inventario y reposición' },
        { id: 'reportes', name: 'Reportes', icon: TrendingUp, path: '/gerente/reportes', color: '#8b5cf6', description: 'Estadísticas y análisis' },
        { id: 'promociones', name: 'Promociones', icon: Tag, path: '/gerente/promociones', color: '#ec4899', description: 'Ofertas y descuentos' },
        { id: 'resenas', name: 'Reseñas de Clientes', icon: MessageSquare, path: '/gerente/resenas', color: '#06b6d4', description: 'Opiniones y calificaciones' }
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
            <Navbar />
            <div style={{ padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header mejorado */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        padding: 'clamp(1.5rem, 3vw, 2rem)',
                        marginBottom: '2rem',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
                            fontWeight: '700',
                            color: '#111827',
                            marginBottom: '0.5rem'
                        }}>
                            Dashboard del Gerente - RiVélez
                        </h1>
                        <p style={{ color: '#6b7280', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
                            Selecciona un módulo para gestionar el restaurante
                        </p>
                    </div>

                    {/* Grid de módulos mejorado */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 'clamp(1rem, 2vw, 1.5rem)'
                    }}>
                        {modules.map((module) => {
                            const Icon = module.icon;
                            return (
                                <button
                                    key={module.id}
                                    onClick={() => navigate(module.path)}
                                    style={{
                                        backgroundColor: 'white',
                                        borderRadius: '1rem',
                                        padding: '2rem',
                                        border: 'none',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.15)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    {/* Icono grande */}
                                    <div style={{
                                        backgroundColor: module.color,
                                        width: '4rem',
                                        height: '4rem',
                                        borderRadius: '1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow: `0 8px 16px -4px ${module.color}40`
                                    }}>
                                        <Icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                                    </div>

                                    {/* Contenido */}
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.25rem',
                                            fontWeight: '700',
                                            color: '#111827',
                                            marginBottom: '0.5rem'
                                        }}>
                                            {module.name}
                                        </h3>
                                        <p style={{
                                            color: '#6b7280',
                                            fontSize: '0.875rem',
                                            lineHeight: '1.5'
                                        }}>
                                            {module.description}
                                        </p>
                                    </div>

                                    {/* Botón de acción */}
                                    <div style={{
                                        marginTop: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: module.color,
                                        fontWeight: '600',
                                        fontSize: '0.875rem'
                                    }}>
                                        <span>Acceder al módulo</span>
                                        <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer informativo */}
                    <div style={{
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        marginTop: '2rem',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: 'white', fontSize: '0.875rem', opacity: 0.9 }}>
                            💡 Tip: Usa los reportes para analizar el rendimiento del restaurante y tomar decisiones informadas
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
