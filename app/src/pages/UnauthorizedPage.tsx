export default function UnauthorizedPage() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            padding: '2rem',
        }}>
            <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                maxWidth: '500px',
            }}>
                <h1 style={{ fontSize: '4rem', margin: 0, color: '#dc2626' }}>403</h1>
                <h2 style={{ fontSize: '1.5rem', marginTop: '1rem', color: '#1f2937' }}>
                    Acceso No Autorizado
                </h2>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                    No tienes permisos para acceder a esta sección del sistema.
                </p>
                <button
                    onClick={() => window.history.back()}
                    style={{
                        marginTop: '2rem',
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#0055A4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontWeight: '500',
                    }}
                >
                    Volver
                </button>
            </div>
        </div>
    );
}
