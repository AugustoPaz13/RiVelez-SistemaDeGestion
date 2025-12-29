import { Navbar } from '../components/layout/Navbar';

export default function DashboardPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
            <Navbar />

            <div style={{ padding: '2rem' }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '4rem 2rem',
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#1f2937' }}>
                        ¡Bienvenido a RiVelez! 🍽️
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
                        Sistema de Gestión de Restaurante
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginTop: '3rem',
                    }}>
                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0055A4' }}>
                                Módulos en desarrollo
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Los módulos específicos por rol estarán disponibles próximamente
                            </p>
                        </div>

                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0055A4' }}>
                                Autenticación ✓
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Sistema de login con roles implementado
                            </p>
                        </div>

                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0055A4' }}>
                                Próximos pasos
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                Integración de módulos Cajero, Cliente, Cocinero y Gerente
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
