import { Card } from '../ui/card';
import { Users, CreditCard, Banknote, Smartphone, QrCode } from 'lucide-react';

interface TableCardProps {
    tableNumber: number;
    status: 'available' | 'occupied' | 'reserved' | 'ready-to-pay';
    guests?: number;
    total?: number;
    paymentMethod?: string;
    onClick: () => void;
}

export function TableCard({ tableNumber, status, guests, total, paymentMethod, onClick }: TableCardProps) {
    const statusConfig = {
        available: {
            bg: 'white',
            border: '#10b981',
            text: 'Disponible',
            badgeBg: '#10b981',
            badgeText: 'white'
        },
        occupied: {
            bg: 'white',
            border: '#ef4444', // Red border for occupied
            text: 'Ocupada',
            badgeBg: '#ef4444',
            badgeText: 'white'
        },
        reserved: {
            bg: 'white',
            border: '#f59e0b',
            text: 'Reservada',
            badgeBg: '#f59e0b',
            badgeText: 'white'
        },
        'ready-to-pay': {
            bg: '#fef3c7', // Yellow bg for ready to pay
            border: '#f59e0b',
            text: '¡Listo para pagar!',
            badgeBg: '#ea580c', // Darker orange/red for high visibility
            badgeText: 'white'
        },
        pagada: {
            bg: '#f3e8ff', // Purple bg for paid
            border: '#8b5cf6',
            text: 'Pagada (Esperando liberación)',
            badgeBg: '#7c3aed',
            badgeText: 'white'
        }
    };

    const config = statusConfig[status];

    const getPaymentIcon = () => {
        if (!paymentMethod) return null;
        const method = paymentMethod.toLowerCase();
        if (method.includes('efectivo')) return <Banknote style={{ width: '1rem', height: '1rem' }} />;
        if (method.includes('tarjeta')) return <CreditCard style={{ width: '1rem', height: '1rem' }} />;
        if (method.includes('transferencia')) return <Smartphone style={{ width: '1rem', height: '1rem' }} />;
        if (method.includes('qr')) return <QrCode style={{ width: '1rem', height: '1rem' }} />;
        return <CreditCard style={{ width: '1rem', height: '1rem' }} />;
    };

    return (
        <Card
            style={{
                backgroundColor: config.bg,
                border: `2px solid ${config.border}`,
                borderRadius: '0.75rem',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                animation: status === 'ready-to-pay' ? 'pulse 2s infinite' : undefined,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '220px' // Ensure consistent height
            }}
            onClick={onClick}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
            }}
        >
            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                }
            `}</style>

            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                <div style={{ color: '#374151', fontSize: '0.875rem' }}>Mesa</div>
                <div style={{ color: '#111827', fontSize: '2.25rem', fontWeight: '700' }}>{tableNumber}</div>

                {/* Info de ocupación y total (si aplica) */}
                {(guests !== undefined && guests > 0) ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#6b7280' }}>
                        <Users style={{ width: '1rem', height: '1rem' }} />
                        <span>{guests} persona{guests !== 1 ? 's' : ''}</span>
                    </div>
                ) : (
                    <div style={{ height: '1.5rem' }}></div> // Spacer to keep layout if no guests info
                )}

                {total !== undefined && (status === 'occupied' || status === 'ready-to-pay') && (
                    <div style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                        <span style={{ color: '#6b7280' }}>Total: </span>
                        <span style={{ fontWeight: '600', fontSize: '1.125rem' }}>${total.toFixed(2)}</span>
                    </div>
                )}

                {/* Mostrar método de pago si está listo para pagar */}
                {status === 'ready-to-pay' && paymentMethod && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'white',
                        borderRadius: '0.5rem',
                        padding: '0.5rem',
                        marginTop: '0.25rem',
                        border: '1px solid #fcd34d'
                    }}>
                        {getPaymentIcon()}
                        <span style={{ color: '#92400e', fontWeight: '600', fontSize: '0.875rem' }}>
                            {paymentMethod}
                        </span>
                    </div>
                )}
            </div>

            {/* Badge estilo botón al final */}
            <div style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem', // Más grande como en cliente
                    borderRadius: '9999px',
                    color: config.badgeText,
                    backgroundColor: config.badgeBg,
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    {config.text}
                </div>
            </div>
        </Card>
    );
}
