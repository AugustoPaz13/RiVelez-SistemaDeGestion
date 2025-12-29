import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, ChefHat, AlertCircle, X } from 'lucide-react';
import { ItemCarrito } from '../../types/restaurant';

interface EstadoPedidoProps {
    numeroMesa: number;
    items: ItemCarrito[];
    total: number;
    metodoPago: string;
    onVolverAlInicio: () => void;
}

type EstadoPedido = 'nuevo' | 'en-preparacion' | 'listo';

export function EstadoPedido({ numeroMesa, items, total, metodoPago, onVolverAlInicio }: EstadoPedidoProps) {
    const [estado, setEstado] = useState<EstadoPedido>('nuevo');
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutos en segundos
    const [pedidoCancelado, setPedidoCancelado] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (estado !== 'nuevo' || pedidoCancelado) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [estado, pedidoCancelado]);

    // Simular cambios de estado (en producción vendría del backend via WebSocket)
    useEffect(() => {
        if (pedidoCancelado) return;

        const timer1 = setTimeout(() => setEstado('en-preparacion'), 15000); // 15s
        const timer2 = setTimeout(() => setEstado('listo'), 30000); // 30s

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [pedidoCancelado]);

    const handleCancelarPedido = () => {
        setPedidoCancelado(true);
        setShowCancelDialog(false);
        // Aquí se haría la llamada al backend para cancelar y reembolsar
        console.log('Pedido cancelado - Reembolsando $', total.toFixed(2));
    };

    const canCancel = estado === 'nuevo' && timeRemaining > 0 && !pedidoCancelado;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getEstadoInfo = () => {
        if (pedidoCancelado) {
            return {
                icon: X,
                color: '#ef4444',
                bgColor: '#fee2e2',
                text: 'Pedido Cancelado',
                description: 'Tu pedido ha sido cancelado exitosamente'
            };
        }

        switch (estado) {
            case 'nuevo':
                return {
                    icon: Clock,
                    color: '#f59e0b',
                    bgColor: '#fef3c7',
                    text: 'Pedido Recibido',
                    description: 'Tu pedido está en cola, pronto comenzará su preparación'
                };
            case 'en-preparacion':
                return {
                    icon: ChefHat,
                    color: '#3b82f6',
                    bgColor: '#dbeafe',
                    text: 'En Preparación',
                    description: 'Nuestro chef está preparando tu pedido'
                };
            case 'listo':
                return {
                    icon: CheckCircle2,
                    color: '#10b981',
                    bgColor: '#dcfce7',
                    text: '¡Pedido Listo!',
                    description: 'Tu pedido está listo para servir'
                };
        }
    };

    const estadoInfo = getEstadoInfo();
    const Icon = estadoInfo.icon;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e', padding: '1.5rem' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Header info mesa */}
                <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>Mesa {numeroMesa}</h2>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Método de pago: {metodoPago}</p>
                </div>

                {/* Estado actual */}
                <div style={{ backgroundColor: estadoInfo.bgColor, border: `3px solid ${estadoInfo.color}`, borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', backgroundColor: 'white', borderRadius: '9999px', marginBottom: '1rem' }}>
                        <Icon style={{ width: '2.5rem', height: '2.5rem', color: estadoInfo.color }} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: estadoInfo.color, margin: '0 0 0.5rem 0' }}>
                        {estadoInfo.text}
                    </h1>
                    <p style={{ color: '#374151', fontSize: '1rem', margin: 0 }}>
                        {estadoInfo.description}
                    </p>
                </div>

                {/* Countdown de cancelación */}
                {canCancel && (
                    <div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '0.75rem', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#92400e' }} />
                                <span style={{ color: '#92400e', fontWeight: '600' }}>Tiempo para cancelar:</span>
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: '#d97706' }}>
                                {formatTime(timeRemaining)}
                            </span>
                        </div>
                        <button
                            onClick={() => setShowCancelDialog(true)}
                            style={{ width: '100%', padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background-color 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                        >
                            <X style={{ width: '1.25rem', height: '1.25rem' }} />
                            Cancelar Pedido
                        </button>
                    </div>
                )}

                {/* Mensaje de reembolso */}
                {pedidoCancelado && (
                    <div style={{ backgroundColor: '#dcfce7', border: '2px solid #10b981', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
                        <CheckCircle2 style={{ width: '3rem', height: '3rem', color: '#10b981', margin: '0 auto 1rem auto' }} />
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#065f46', marginBottom: '0.5rem' }}>
                            Reembolso Procesado
                        </h3>
                        <p style={{ color: '#047857', margin: 0 }}>
                            Se ha reembolsado ${total.toFixed(2)} a tu método de pago ({metodoPago})
                        </p>
                    </div>
                )}

                {/* Resumen del pedido */}
                <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                        Resumen del Pedido
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {items.map(item => (
                            <div key={item.producto.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
                                <div>
                                    <span>{item.producto.nombre}</span>
                                    <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>x{item.cantidad}</span>
                                </div>
                                <span style={{ fontWeight: '600' }}>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.75rem', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Botón volver (solo si está cancelado o listo) */}
                {(pedidoCancelado || estado === 'listo') && (
                    <button
                        onClick={onVolverAlInicio}
                        style={{ width: '100%', padding: '1rem 1.5rem', backgroundColor: 'white', color: '#3b82f6', border: 'none', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                        {pedidoCancelado ? 'Volver al Inicio' : '¡Disfrutar la Comida!'}
                    </button>
                )}
            </div>

            {/* Dialog de confirmación de cancelación */}
            {showCancelDialog && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '28rem', width: '100%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertCircle style={{ width: '2rem', height: '2rem', color: '#ef4444' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                ¿Cancelar Pedido?
                            </h3>
                        </div>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            Estás a punto de cancelar tu pedido. Se te reembolsará el monto total de ${total.toFixed(2)} a tu método de pago ({metodoPago}).
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowCancelDialog(false)}
                                style={{ flex: 1, padding: '0.75rem 1.5rem', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                            >
                                No, volver
                            </button>
                            <button
                                onClick={handleCancelarPedido}
                                style={{ flex: 1, padding: '0.75rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                            >
                                Sí, cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
