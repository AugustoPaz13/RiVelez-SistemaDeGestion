import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, ChefHat, AlertCircle, X, ShoppingBag, CreditCard, Banknote, Smartphone, QrCode, LogOut } from 'lucide-react';
import { ItemCarrito, MetodoPago } from '../../types/restaurant';
import { orderService } from '../../services/orderService';
import { toast } from 'sonner';

interface EstadoPedidoProps {
    orderId: string;
    numeroMesa: number;
    items: ItemCarrito[];
    total: number;
    fechaCreacionPedido?: string;
    onVolverAlInicio: () => void;
    onVolverAlMenu?: () => void;
    onLiberarMesa?: () => void;
}

type EstadoPedidoType = 'nuevo' | 'recibido' | 'en-preparacion' | 'listo' | 'entregado' | 'pagado' | 'retrasado';
type FaseType = 'cancelacion' | 'seguimiento';

export function EstadoPedido({ orderId, numeroMesa, items, total, fechaCreacionPedido, onVolverAlInicio, onVolverAlMenu, onLiberarMesa }: EstadoPedidoProps) {
    const [estado, setEstado] = useState<EstadoPedidoType>('nuevo');
    const [fase, setFase] = useState<FaseType>('cancelacion');
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(120);
    const [pedidoCancelado, setPedidoCancelado] = useState(false);
    const [pedidoPagado, setPedidoPagado] = useState(false);
    const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<MetodoPago | null>(null);
    const [procesandoPago, setProcesandoPago] = useState(false);

    const metodosPago = [
        { id: 'efectivo' as MetodoPago, nombre: 'Efectivo', icon: Banknote, color: '#10b981' },
        { id: 'tarjeta' as MetodoPago, nombre: 'Tarjeta', icon: CreditCard, color: '#3b82f6' },
        { id: 'transferencia' as MetodoPago, nombre: 'Transferencia', icon: Smartphone, color: '#a855f7' },
        { id: 'qr' as MetodoPago, nombre: 'QR', icon: QrCode, color: '#6366f1' },
    ];

    // Calcular tiempo restante basado en fechaCreacionPedido
    useEffect(() => {
        if (fechaCreacionPedido) {
            const creacionTime = new Date(fechaCreacionPedido).getTime();
            const ahora = Date.now();
            const tiempoTranscurrido = Math.floor((ahora - creacionTime) / 1000);
            const tiempoRestante = Math.max(0, 120 - tiempoTranscurrido);
            setTimeRemaining(tiempoRestante);

            // Si ya pasaron los 2 minutos, ir directo a fase seguimiento
            if (tiempoRestante === 0) {
                setFase('seguimiento');
            }
        }
    }, [fechaCreacionPedido]);

    // Polling de estado real
    useEffect(() => {
        if (!orderId || pedidoCancelado) return;

        const checkStatus = async () => {
            try {
                const order = await orderService.getById(orderId);
                if (order) {
                    const nuevoEstado = order.estado as EstadoPedidoType;
                    setEstado(nuevoEstado);

                    // Si el estado cambia a algo que no sea 'nuevo' (ej: cocinero lo tomó),
                    // forzamos el fin de la fase de cancelación
                    if (nuevoEstado !== 'nuevo' && fase === 'cancelacion') {
                        setFase('seguimiento');
                    }

                    if (nuevoEstado === 'pagado') {
                        setPedidoPagado(true);
                    }
                }
            } catch (error) {
                console.error("Error al verificar estado:", error);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 2000); // Polling más rápido (2s) para mejor UX
        return () => clearInterval(interval);
    }, [orderId, pedidoCancelado, fase]);

    // Countdown timer
    useEffect(() => {
        if (fase !== 'cancelacion') return;
        if (pedidoCancelado) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setFase('seguimiento');
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [fase, pedidoCancelado]);

    const handleCancelarPedido = async () => {
        try {
            await orderService.cancel(orderId);
            setPedidoCancelado(true);
            setShowCancelDialog(false);
            toast.success("Pedido cancelado exitosamente");
        } catch (error) {
            console.error(error);
            toast.error("No se pudo cancelar el pedido. Puede que ya esté en preparación.");
        }
    };

    const handlePagar = async () => {
        if (!metodoPagoSeleccionado) {
            toast.error("Selecciona un método de pago");
            return;
        }

        // Verificar que el pedido esté listo
        if (estado !== 'listo' && estado !== 'entregado') {
            toast.error("El pedido debe estar listo para poder pagar");
            return;
        }

        setProcesandoPago(true);
        try {
            // Notificar al cajero
            await orderService.markReadyToPay(orderId, metodosPago.find(m => m.id === metodoPagoSeleccionado)?.nombre || '');
            toast.success("¡Cajero notificado! El pago será procesado en caja.");
            // Aquí no marcamos como pagado porque lo hace el cajero
        } catch (error) {
            console.error(error);
            toast.error("Error al notificar al cajero");
        } finally {
            setProcesandoPago(false);
        }
    };

    const handleAbandonarMesa = () => {
        if (!pedidoPagado && !pedidoCancelado) {
            toast.error("Debes pagar el pedido primero para abandonar la mesa");
            return;
        }
        onLiberarMesa?.();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getEstadoInfo = () => {
        if (pedidoCancelado) {
            return { icon: X, color: '#ef4444', bgColor: '#fee2e2', text: 'Pedido Cancelado', description: 'Tu pedido ha sido cancelado' };
        }
        switch (estado) {
            case 'nuevo':
            case 'recibido':
                return { icon: Clock, color: '#f59e0b', bgColor: '#fef3c7', text: 'En Cola', description: 'Esperando que el cocinero inicie la preparación' };
            case 'en-preparacion':
                return { icon: ChefHat, color: '#3b82f6', bgColor: '#dbeafe', text: 'En Preparación', description: 'El chef está preparando tu pedido' };
            case 'retrasado':
                return { icon: AlertCircle, color: '#ea580c', bgColor: '#ffedd5', text: 'Demorado', description: 'Pedimos disculpas, tu pedido tiene una leve demora' };
            case 'listo':
                return { icon: ShoppingBag, color: '#8b5cf6', bgColor: '#ede9fe', text: '¡Pedido Listo!', description: 'Tu pedido está listo para servir' };
            case 'entregado':
                return { icon: CheckCircle2, color: '#10b981', bgColor: '#dcfce7', text: 'Entregado', description: 'Disfruta tu comida' };
            case 'pagado':
                return { icon: CheckCircle2, color: '#10b981', bgColor: '#dcfce7', text: '¡Pagado!', description: 'Gracias por tu compra' };
            default:
                return { icon: Clock, color: '#9ca3af', bgColor: '#f3f4f6', text: 'Procesando...', description: 'Verificando estado' };
        }
    };

    const estadoInfo = getEstadoInfo();
    const Icon = estadoInfo.icon;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e', padding: '1.5rem' }}>
            <div style={{ maxWidth: '48rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Header */}
                <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: '0 0 0.5rem 0' }}>Mesa {numeroMesa}</h2>
                    <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>Pedido: {orderId}</p>
                </div>

                {/* ========== FASE 1: CANCELACIÓN (primeros 2 minutos) ========== */}
                {fase === 'cancelacion' && !pedidoCancelado && (
                    <>
                        {/* Mensaje Cocina Notificada */}
                        <div style={{ backgroundColor: '#d1fae5', border: '3px solid #10b981', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', backgroundColor: '#10b981', borderRadius: '9999px', marginBottom: '1rem' }}>
                                <ChefHat style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                            </div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#065f46', margin: '0 0 0.5rem 0' }}>
                                ¡Cocina Notificada!
                            </h1>
                            <p style={{ color: '#047857', fontSize: '1rem', margin: 0 }}>
                                Tu pedido ha sido enviado a cocina
                            </p>
                        </div>

                        {/* Countdown + Cancelar */}
                        <div style={{ backgroundColor: '#fef3c7', border: '2px solid #f59e0b', borderRadius: '0.75rem', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock style={{ width: '1.25rem', height: '1.25rem', color: '#92400e' }} />
                                    <span style={{ color: '#92400e', fontWeight: '600' }}>Puedes cancelar en:</span>
                                </div>
                                <span style={{ fontSize: '1.75rem', fontWeight: '700', color: '#d97706' }}>
                                    {formatTime(timeRemaining)}
                                </span>
                            </div>
                            <button
                                onClick={() => setShowCancelDialog(true)}
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <X style={{ width: '1.25rem', height: '1.25rem' }} />
                                Cancelar Pedido
                            </button>
                        </div>

                        {/* Abandonar Mesa (deshabilitado) */}
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                            <button
                                disabled
                                style={{ width: '100%', padding: '1rem', backgroundColor: '#6b7280', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: '600', cursor: 'not-allowed', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            >
                                <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
                                Abandonar Mesa
                            </button>
                            <p style={{ color: '#fef3c7', fontSize: '0.875rem', textAlign: 'center', marginTop: '0.75rem' }}>
                                ⚠️ Debes cancelar el pedido primero para abandonar la mesa
                            </p>
                        </div>
                    </>
                )}

                {/* ========== FASE 2: SEGUIMIENTO Y PAGO (después de 2 minutos) ========== */}
                {fase === 'seguimiento' && !pedidoCancelado && (
                    <>
                        {/* Estado del Pedido */}
                        <div style={{ backgroundColor: estadoInfo.bgColor, border: `3px solid ${estadoInfo.color}`, borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', backgroundColor: 'white', borderRadius: '9999px', marginBottom: '1rem' }}>
                                <Icon style={{ width: '2.5rem', height: '2.5rem', color: estadoInfo.color }} />
                            </div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: estadoInfo.color, margin: '0 0 0.5rem 0' }}>
                                {estadoInfo.text}
                            </h1>
                            <p style={{ color: '#374151', fontSize: '1rem', margin: 0 }}>
                                {estadoInfo.description}
                            </p>
                        </div>

                        {/* Método de Pago (solo si no está pagado) */}
                        {!pedidoPagado && (
                            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem', textAlign: 'center' }}>
                                    Selecciona Método de Pago
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                                    {metodosPago.map(metodo => {
                                        const MetodoIcon = metodo.icon;
                                        const selected = metodoPagoSeleccionado === metodo.id;
                                        return (
                                            <button
                                                key={metodo.id}
                                                onClick={() => setMetodoPagoSeleccionado(metodo.id)}
                                                disabled={procesandoPago}
                                                style={{
                                                    padding: '1rem 0.5rem',
                                                    borderRadius: '0.5rem',
                                                    border: selected ? `3px solid ${metodo.color}` : '2px solid #e5e7eb',
                                                    backgroundColor: selected ? `${metodo.color}15` : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}
                                            >
                                                <MetodoIcon style={{ width: '1.5rem', height: '1.5rem', color: metodo.color }} />
                                                <span style={{ fontSize: '0.75rem', color: '#374151', fontWeight: selected ? '600' : '400' }}>{metodo.nombre}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Botón Pagar */}
                                <button
                                    onClick={handlePagar}
                                    disabled={!metodoPagoSeleccionado || procesandoPago || (estado !== 'listo' && estado !== 'entregado')}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: (estado === 'listo' || estado === 'entregado') && metodoPagoSeleccionado ? '#10b981' : '#9ca3af',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.5rem',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: (estado === 'listo' || estado === 'entregado') && metodoPagoSeleccionado ? 'pointer' : 'not-allowed',
                                        opacity: (estado === 'listo' || estado === 'entregado') && metodoPagoSeleccionado ? 1 : 0.5
                                    }}
                                >
                                    {procesandoPago ? 'Procesando...' :
                                        (estado !== 'listo' && estado !== 'entregado') ? 'Espera a que el pedido esté listo' :
                                            `Pagar $${total.toFixed(2)}`}
                                </button>
                            </div>
                        )}

                        {/* Mensaje de Pago Exitoso */}
                        {pedidoPagado && (
                            <div style={{ backgroundColor: '#dcfce7', border: '3px solid #10b981', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center' }}>
                                <CheckCircle2 style={{ width: '3rem', height: '3rem', color: '#10b981', margin: '0 auto 1rem auto' }} />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#065f46', marginBottom: '0.5rem' }}>
                                    ¡Pago Completado!
                                </h3>
                                <p style={{ color: '#047857', margin: 0 }}>
                                    Gracias por tu compra. ¡Disfruta tu comida!
                                </p>
                            </div>
                        )}

                        {/* Abandonar Mesa */}
                        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '1.5rem' }}>
                            <button
                                onClick={handleAbandonarMesa}
                                disabled={!pedidoPagado}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: pedidoPagado ? '#ef4444' : '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: pedidoPagado ? 'pointer' : 'not-allowed',
                                    opacity: pedidoPagado ? 1 : 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
                                Abandonar Mesa
                            </button>
                            {!pedidoPagado && (
                                <p style={{ color: '#fef3c7', fontSize: '0.875rem', textAlign: 'center', marginTop: '0.75rem' }}>
                                    ⚠️ Debes pagar primero para abandonar la mesa
                                </p>
                            )}
                        </div>
                    </>
                )}

                {/* ========== PEDIDO CANCELADO ========== */}
                {pedidoCancelado && (
                    <>
                        <div style={{ backgroundColor: '#fee2e2', border: '3px solid #ef4444', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', backgroundColor: '#ef4444', borderRadius: '9999px', marginBottom: '1rem' }}>
                                <X style={{ width: '2.5rem', height: '2.5rem', color: 'white' }} />
                            </div>
                            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#991b1b', margin: '0 0 0.5rem 0' }}>
                                Pedido Cancelado
                            </h1>
                            <p style={{ color: '#b91c1c', fontSize: '1rem', margin: 0 }}>
                                Tu pedido ha sido cancelado exitosamente
                            </p>
                        </div>

                        {/* Botón Modificar Pedido (Volver al Menú sin perder mesa) */}
                        {onVolverAlMenu && (
                            <button
                                onClick={onVolverAlMenu}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    marginBottom: '1rem',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <ChefHat style={{ width: '1.25rem', height: '1.25rem' }} />
                                Modificar Pedido
                            </button>
                        )}

                        {/* Abandonar Mesa (habilitado porque canceló) */}
                        <button
                            onClick={onLiberarMesa}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.75rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <LogOut style={{ width: '1.25rem', height: '1.25rem' }} />
                            Abandonar Mesa
                        </button>
                    </>
                )}

                {/* Resumen del Pedido */}
                <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem' }}>
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
            </div>

            {/* Dialog de confirmación de cancelación */}
            {showCancelDialog && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '2rem', maxWidth: '28rem', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                            <AlertCircle style={{ width: '2rem', height: '2rem', color: '#ef4444' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827', margin: 0 }}>
                                ¿Cancelar Pedido?
                            </h3>
                        </div>
                        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                            ¿Estás seguro de que deseas cancelar tu pedido?
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                onClick={() => setShowCancelDialog(false)}
                                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
                            >
                                No, volver
                            </button>
                            <button
                                onClick={handleCancelarPedido}
                                style={{ flex: 1, padding: '0.75rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: '600', cursor: 'pointer' }}
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
