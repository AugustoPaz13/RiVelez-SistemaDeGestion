import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface Ingredient {
    id: string;
    name: string;
    quantityNeeded: number;
    unit: string;
}

export interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    image: string;
    notes?: string;
    ingredients?: Ingredient[];
}

export interface KitchenOrder {
    id: string;
    tableNumber: number;
    status: 'nuevo' | 'en-preparacion' | 'listo' | 'retrasado';
    items: OrderItem[];
    receivedAt: string;
    startedAt?: string;
    completedAt?: string;
    canBeCancelled: boolean;
    cancellationDeadline?: string;
    cancelledByClient?: boolean;
    people?: number; // Número de personas
}

interface OrderCardProps {
    order: KitchenOrder;
    onClick: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
    const getStatusConfig = (status: string) => {
        const configs = {
            'nuevo': {
                label: 'Nuevo',
                color: '#ef4444',
                bgColor: '#ffffff',
                borderColor: '#ef4444',
                badgeBg: '#fef3c7',
                badgeText: '#92400e'
            },
            'en-preparacion': {
                label: 'En Preparación',
                color: '#3b82f6',
                bgColor: '#ffffff',
                borderColor: '#3b82f6',
                badgeBg: '#dbeafe',
                badgeText: '#1e40af'
            },
            'listo': {
                label: 'Listo',
                color: '#10b981',
                bgColor: '#ffffff',
                borderColor: '#10b981',
                badgeBg: '#d1fae5',
                badgeText: '#065f46'
            },
            'retrasado': {
                label: 'Retrasado',
                color: '#f59e0b',
                bgColor: '#ffffff',
                borderColor: '#f59e0b',
                badgeBg: '#fef3c7',
                badgeText: '#92400e'
            }
        };
        return configs[status as keyof typeof configs] || configs.nuevo;
    };

    const getCancellationCountdown = (deadline: string) => {
        const now = new Date();
        const end = new Date(deadline);
        const diffMs = end.getTime() - now.getTime();

        if (diffMs <= 0) return null;

        const seconds = Math.floor(diffMs / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeElapsed = (receivedAt: string) => {
        const now = new Date();
        const received = new Date(receivedAt);
        const diffMs = now.getTime() - received.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'recién llegó';
        if (diffMins < 60) return `hace ${diffMins} min`;
        const diffHours = Math.floor(diffMins / 60);
        const remainMins = diffMins % 60;
        return `hace ${diffHours}h ${remainMins}min`;
    };

    const getFormattedTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    const statusConfig = getStatusConfig(order.status);

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: statusConfig.bgColor,
                border: `3px solid ${statusConfig.borderColor}`,
                borderRadius: '0.5rem',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)';
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.125rem', color: '#111827' }}>
                        Mesa {order.tableNumber}
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500' }}>
                        {order.id}
                    </p>
                </div>
                <Badge style={{
                    backgroundColor: statusConfig.badgeBg,
                    color: statusConfig.badgeText,
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    border: 'none'
                }}>
                    {statusConfig.label}
                </Badge>
            </div>

            {/* Info Row */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', color: '#6b7280', fontSize: '0.8125rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
                    <span>{getFormattedTime(order.receivedAt)}</span>
                </div>
                {order.people && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                        <Users style={{ width: '0.875rem', height: '0.875rem' }} />
                        <span>{order.people} {order.people === 1 ? 'persona' : 'personas'}</span>
                    </div>
                )}
            </div>

            {/* Products List */}
            <div style={{ marginBottom: '0.75rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
                    Productos ({order.items.length}):
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                    {order.items.map(item => (
                        <div key={item.id} style={{ fontSize: '0.8125rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#111827' }}>
                                <span>• {item.name}</span>
                                <span style={{ fontWeight: '600', color: '#6b7280' }}>x{item.quantity}</span>
                            </div>
                            {item.notes && (
                                <p style={{
                                    fontSize: '0.75rem',
                                    color: '#dc2626',
                                    marginTop: '0.125rem',
                                    marginLeft: '0.75rem',
                                    fontWeight: '600'
                                }}>
                                    ⚠️ {item.notes}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Countdown de cancelación */}
            {order.canBeCancelled && order.cancellationDeadline && getCancellationCountdown(order.cancellationDeadline) && (
                <div style={{
                    backgroundColor: '#fef3c7',
                    border: '2px solid #fbbf24',
                    borderRadius: '0.375rem',
                    padding: '0.5rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <Clock style={{ width: '1rem', height: '1rem', color: '#f59e0b' }} />
                    <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '700' }}>
                        Cancelable: {getCancellationCountdown(order.cancellationDeadline)}
                    </span>
                </div>
            )}

            {/* Footer - Time Elapsed */}
            <div style={{
                paddingTop: '0.75rem',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: '#6b7280',
                fontSize: '0.75rem'
            }}>
                <Clock style={{ width: '0.875rem', height: '0.875rem' }} />
                <span style={{ fontWeight: '500' }}>{getTimeElapsed(order.receivedAt)}</span>
            </div>
        </div>
    );
};
