import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Users } from 'lucide-react';

interface TableCardProps {
    tableNumber: number;
    status: 'available' | 'occupied' | 'reserved';
    guests?: number;
    total?: number;
    onClick: () => void;
}

export function TableCard({ tableNumber, status, guests, total, onClick }: TableCardProps) {
    const statusColors = {
        available: { bg: 'rgba(16,185,129,0.1)', text: '#047857', border: 'rgba(16,185,129,0.2)' },
        occupied: { bg: 'rgba(239,68,68,0.1)', text: '#dc2626', border: 'rgba(239,68,68,0.2)' },
        reserved: { bg: 'rgba(245,158,11,0.1)', text: '#d97706', border: 'rgba(245,158,11,0.2)' }
    };

    const statusLabels = {
        available: 'Disponible',
        occupied: 'Ocupada',
        reserved: 'Reservada'
    };

    const colors = statusColors[status];

    return (
        <Card
            style={{
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: status === 'occupied' ? '2px solid rgba(239,68,68,0.5)' : '1px solid #e5e7eb'
            }}
            onClick={onClick}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '';
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span style={{ color: '#6b7280' }}>Mesa</span>
                    <Badge
                        variant="outline"
                        style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`
                        }}
                    >
                        {statusLabels[status]}
                    </Badge>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2.25rem', fontWeight: '700' }}>{tableNumber}</div>
                </div>

                {status === 'occupied' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#6b7280' }}>
                            <Users style={{ width: '1rem', height: '1rem' }} />
                            <span>{guests} persona{guests !== 1 ? 's' : ''}</span>
                        </div>
                        {total !== undefined && (
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ color: '#6b7280' }}>Total: </span>
                                <span style={{ fontWeight: '600' }}>${total.toFixed(2)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}
