import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { OrderCard, KitchenOrder } from '../../components/cocinero/OrderCard';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from '../../components/ui/sonner';
import { Toaster } from '../../components/ui/sonner';
import { Bell, ChefHat, Clock, ClipboardList, CheckCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order, OrderStatus } from '../../types';

// Función para mapear Order del backend a KitchenOrder del frontend
const mapOrderToKitchenOrder = (order: Order): KitchenOrder => {
    // Mapear estado del backend al formato del frontend
    const statusMap: Record<string, KitchenOrder['status']> = {
        'nuevo': 'nuevo',
        'recibido': 'nuevo',
        'en-preparacion': 'en-preparacion',
        'listo': 'listo',
        'retrasado': 'retrasado',
        'cancelado': 'cancelado',
        'entregado': 'listo',
        'pagado': 'listo',
    };

    const fechaCreacion = new Date(order.fechaCreacion);
    // Período de cancelación: 2 minutos desde la creación
    const cancellationDeadline = new Date(fechaCreacion.getTime() + 2 * 60 * 1000);
    const now = new Date();
    const canBeCancelled = now < cancellationDeadline && (order.estado === 'nuevo' || order.estado === 'recibido');

    return {
        id: order.numeroPedido,
        tableNumber: order.numeroMesa,
        status: statusMap[order.estado] || 'nuevo',
        receivedAt: order.fechaCreacion,
        startedAt: order.estado === 'en-preparacion' ? order.fechaCreacion : undefined,
        completedAt: order.estado === 'listo' || order.estado === 'entregado' ? order.fechaCreacion : undefined,
        canBeCancelled,
        cancellationDeadline: cancellationDeadline.toISOString(),
        people: order.personas,
        items: order.items.map(item => ({
            id: item.id,
            name: item.nombre,
            quantity: item.cantidad,
            image: item.imagen || 'images/products/default.png',
            notes: item.observaciones,
        })),
        // Guardar ID original para llamadas a la API
        _originalId: order.id,
    } as KitchenOrder & { _originalId: string };
};

export default function CocineroPage() {
    const [orders, setOrders] = useState<(KitchenOrder & { _originalId?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<(KitchenOrder & { _originalId?: string }) | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [, setCurrentTime] = useState(new Date());
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState('');
    const [newOrderNotification, setNewOrderNotification] = useState<KitchenOrder | null>(null);
    const [cancelledOrderNotification, setCancelledOrderNotification] = useState<KitchenOrder | null>(null);
    const [isNotifying, setIsNotifying] = useState(false);
    const [notificationComplete, setNotificationComplete] = useState(false);
    const [previousOrderIds, setPreviousOrderIds] = useState<Set<string>>(new Set());

    // Función para cargar pedidos del backend
    const fetchOrders = useCallback(async () => {
        try {
            const pendingOrders = await orderService.getPending();
            const mappedOrders = pendingOrders.map(mapOrderToKitchenOrder);

            // Detectar nuevos pedidos para notificación
            const currentIds = new Set(mappedOrders.map(o => o.id));
            const newOrders = mappedOrders.filter(o =>
                !previousOrderIds.has(o.id) && o.status === 'nuevo'
            );

            if (newOrders.length > 0 && previousOrderIds.size > 0) {
                // Hay nuevos pedidos - mostrar notificación del primero
                setNewOrderNotification(newOrders[0]);
            }

            // Detectar pedidos cancelados (que aparecen con status 'cancelado')
            const cancelledOrders = mappedOrders.filter(o => o.status === 'cancelado');
            if (cancelledOrders.length > 0) {
                // Mostrar alerta del primero que encontremos
                setCancelledOrderNotification(cancelledOrders[0]);
            }

            setPreviousOrderIds(currentIds);
            setOrders(mappedOrders);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            toast.error('Error al cargar pedidos del servidor');
        } finally {
            setLoading(false);
        }
    }, [previousOrderIds]);

    // Cargar pedidos inicialmente y configurar polling
    useEffect(() => {
        fetchOrders();

        // Polling cada 5 segundos para actualización en tiempo real
        const interval = setInterval(fetchOrders, 5000);

        return () => clearInterval(interval);
    }, []); // Solo ejecutar una vez al montar

    // Refetch cuando cambia la función (para detectar nuevos pedidos)
    useEffect(() => {
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    // Auto-actualizar cada segundo para countdown y reloj
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now);
            setCurrentTimeDisplay(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleCardClick = (order: KitchenOrder) => {
        setSelectedOrder(order);
        setDialogOpen(true);
    };

    const handleConfirmOrderReceipt = () => {
        if (newOrderNotification) {
            toast.info('Pedido confirmado como recibido');
            setNewOrderNotification(null);
        }
    };

    const handleDismissCancellation = async () => {
        if (cancelledOrderNotification) {
            try {
                // Llamar al backend para eliminar definitivamente (dismiss)
                // Llamar al backend para eliminar definitivamente (dismiss)
                if ((cancelledOrderNotification as any)._originalId) {
                    await orderService.dismiss((cancelledOrderNotification as any)._originalId);
                }
                setCancelledOrderNotification(null);
                fetchOrders(); // Recargar para que desaparezca
                toast.info('Notificación de cancelación descartada');
            } catch (_error) {
                console.error('Error al descartar cancelación:', _error);
                toast.error('Error al descartar notificación');
            }
        }
    };

    const notifyClient = async (status: 'en-preparacion' | 'retrasado' | 'listo') => {
        setIsNotifying(true);
        setNotificationComplete(false);

        // Simular notificación
        await new Promise(resolve => setTimeout(resolve, 2000));

        setNotificationComplete(true);

        // Guardar el estado para el mensaje
        (window as any).lastNotificationStatus = status;

        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsNotifying(false);
        setNotificationComplete(false);
    };

    const handleStartOrder = async () => {
        if (selectedOrder) {
            // Verificar si aún está en período de cancelación
            if (selectedOrder.canBeCancelled && selectedOrder.cancellationDeadline) {
                const now = new Date();
                const deadline = new Date(selectedOrder.cancellationDeadline);

                if (now < deadline) {
                    const remaining = Math.ceil((deadline.getTime() - now.getTime()) / 1000);
                    toast.error(`Espera ${remaining}s para comenzar (período de cancelación)`);
                    return;
                }
            }

            setDialogOpen(false);

            try {
                // Notificar al cliente (visual)
                await notifyClient('en-preparacion');

                // Actualizar estado en el backend (el descuento de stock se hace automáticamente)
                if (selectedOrder._originalId) {
                    await orderService.updateStatus(selectedOrder._originalId, 'en-preparacion' as OrderStatus);
                }

                // Refrescar lista de pedidos
                await fetchOrders();
                toast.success('Pedido en preparación - Stock descontado');
            } catch (error) {
                console.error('Error al actualizar estado:', error);
                toast.error('Error al actualizar el pedido');
            }
        }
    };

    const handleCompleteOrder = async () => {
        if (selectedOrder) {
            setDialogOpen(false);

            try {
                // Mostrar loading de notificación
                await notifyClient('listo');

                // Actualizar estado en el backend
                if (selectedOrder._originalId) {
                    await orderService.updateStatus(selectedOrder._originalId, 'listo' as OrderStatus);
                }

                // Refrescar lista de pedidos
                await fetchOrders();
                toast.success('¡Pedido listo para servir!');
            } catch (error) {
                console.error('Error al actualizar estado:', error);
                toast.error('Error al marcar pedido como listo');
            }
        }
    };

    const handleMarkDelayed = async () => {
        if (selectedOrder) {
            setDialogOpen(false);

            try {
                // Notificar al cliente (visual)
                await notifyClient('retrasado');

                // Actualizar estado en el backend
                if (selectedOrder._originalId) {
                    await orderService.updateStatus(selectedOrder._originalId, 'retrasado' as OrderStatus);
                }

                // Refrescar lista de pedidos
                await fetchOrders();
                toast.warning('Pedido marcado como retrasado - Cliente notificado', {
                    style: { backgroundColor: '#fef3c7', color: '#92400e' }
                });
            } catch (error) {
                console.error('Error al actualizar estado:', error);
                toast.error('Error al marcar como retrasado');
            }
        }
    };

    const handleResumeOrder = async () => {
        if (selectedOrder) {
            // Verificar si aún está en período de cancelación (Loophole Check)
            if (selectedOrder.canBeCancelled && selectedOrder.cancellationDeadline) {
                const now = new Date();
                const deadline = new Date(selectedOrder.cancellationDeadline);

                if (now < deadline) {
                    const remaining = Math.ceil((deadline.getTime() - now.getTime()) / 1000);
                    toast.error(`Espera ${remaining}s para retomar (período de cancelación)`);
                    return;
                }
            }
            setDialogOpen(false);

            try {
                // Notificar al cliente (visual)
                await notifyClient('en-preparacion');

                // Actualizar estado en el backend
                if (selectedOrder._originalId) {
                    await orderService.updateStatus(selectedOrder._originalId, 'en-preparacion' as OrderStatus);
                }

                // Refrescar lista de pedidos
                await fetchOrders();
                toast.success('Pedido vuelto a preparación');
            } catch (error) {
                console.error('Error al actualizar estado:', error);
                toast.error('Error al actualizar el pedido');
            }
        }
    };

    // Filtrar pedidos por estado (ocultar el que está en popup)
    const nuevosOrders = orders.filter(o => o.status === 'nuevo' && o.id !== newOrderNotification?.id);
    const enPreparacionOrders = orders.filter(o => o.status === 'en-preparacion');
    const retrasadosOrders = orders.filter(o => o.status === 'retrasado');
    const listosOrders = orders.filter(o => o.status === 'listo');

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e', padding: 'clamp(0.75rem, 2vw, 2rem)' }}>
                <Toaster />

                {/* Loading Overlay - Notificación al Cliente */}
                {isNotifying && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999
                    }}>
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '1rem',
                            padding: '3rem',
                            textAlign: 'center',
                            maxWidth: '400px',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}>
                            {!notificationComplete ? (
                                <>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        border: '4px solid #e5e7eb',
                                        borderTopColor: '#3b82f6',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite',
                                        margin: '0 auto 1.5rem'
                                    }} />
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
                                        Notificando al cliente...
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                                        Enviando actualización del pedido
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        backgroundColor: '#10b981',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 1.5rem'
                                    }}>
                                        <CheckCircle2 style={{ width: '40px', height: '40px', color: 'white' }} />
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#10b981', marginBottom: '0.5rem' }}>
                                        Cliente notificado
                                    </h3>
                                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                                        {(window as any).lastNotificationStatus === 'en-preparacion' ? 'Pedido en preparación' :
                                            (window as any).lastNotificationStatus === 'retrasado' ? 'Pedido retrasado' :
                                                'Pedido listo para servir'}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Popup de Nuevo Pedido */}
                {newOrderNotification && (
                    <div style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        animation: 'slideInRight 0.3s ease-out',
                        maxWidth: '95%',
                        width: '400px'
                    }}>
                        <Card style={{
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                            border: '4px solid #ef4444',
                            backgroundColor: '#fee2e2'
                        }}>
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        backgroundColor: '#ef4444',
                                        padding: '0.75rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Bell style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                                    </div>
                                    <div>
                                        <CardTitle style={{ color: '#991b1b', marginBottom: '0.25rem' }}>
                                            ¡Nuevo Pedido!
                                        </CardTitle>
                                        <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>
                                            Mesa {newOrderNotification.tableNumber} - {newOrderNotification.id}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ color: '#7c2d12', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        Items del pedido:
                                    </p>
                                    {newOrderNotification.items.map(item => (
                                        <div key={item.id} style={{
                                            backgroundColor: 'white',
                                            padding: '0.75rem',
                                            borderRadius: '0.375rem',
                                            border: '1px solid #fecaca',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <span style={{ color: '#374151', fontWeight: '500' }}>{item.name}</span>
                                                <span style={{ color: '#6b7280' }}>x{item.quantity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <Button
                                    onClick={handleConfirmOrderReceipt}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '0.75rem'
                                    }}
                                >
                                    Confirmar Recepción
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header Profesional */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.5rem',
                        padding: 'clamp(1rem, 3vw, 1.5rem)',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 768 ? 'flex-start' : 'center', gap: '1rem' }}>
                            <div>
                                <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                                    Sistema de Cocina - Restaurante
                                </h1>
                                <p style={{ color: '#6b7280', fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>Gestión de pedidos</p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '1rem', alignItems: window.innerWidth < 768 ? 'stretch' : 'center', width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                                < div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    <Badge style={{
                                        backgroundColor: '#fee2e2',
                                        color: '#991b1b',
                                        border: '1px solid #fecaca',
                                        padding: '0.4rem 0.75rem',
                                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                                    }}>
                                        {nuevosOrders.length} Nuevos
                                    </Badge>
                                    <Badge style={{
                                        backgroundColor: '#dbeafe',
                                        color: '#1e40af',
                                        border: '1px solid #bfdbfe',
                                        padding: '0.4rem 0.75rem',
                                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                                    }}>
                                        {enPreparacionOrders.length} En Prep.
                                    </Badge>
                                    <Badge style={{
                                        backgroundColor: '#fef3c7',
                                        color: '#92400e',
                                        border: '1px solid #fde68a',
                                        padding: '0.4rem 0.75rem',
                                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                                    }}>
                                        {retrasadosOrders.length} Retrasados
                                    </Badge>
                                    <Badge style={{
                                        backgroundColor: '#d1fae5',
                                        color: '#065f46',
                                        border: '1px solid #a7f3d0',
                                        padding: '0.4rem 0.75rem',
                                        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                                    }}>
                                        {listosOrders.length} Listos
                                    </Badge>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: window.innerWidth < 768 ? 'space-between' : 'flex-start' }}>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            fetchOrders();
                                            toast.info('Actualizando pedidos...');
                                        }}
                                        style={{ display: 'flex', gap: '0.5rem', padding: '0.5rem 0.75rem', fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                                    >
                                        <RefreshCw style={{ width: '1rem', height: '1rem' }} />
                                        {window.innerWidth >= 640 && 'Actualizar'}
                                    </Button>
                                    <div style={{ color: '#6b7280', fontSize: 'clamp(0.75rem, 2vw, 1rem)', fontWeight: '500' }}>
                                        {currentTimeDisplay}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Profesionales con Iconos */}
                    <div style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
                    }}>
                        <Tabs defaultValue="nuevos" style={{ width: '100%' }}>
                            <TabsList style={{
                                width: '100%',
                                display: window.innerWidth < 768 ? 'flex' : 'grid',
                                gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(4, 1fr)' : undefined,
                                overflowX: window.innerWidth < 768 ? 'auto' : undefined,
                                backgroundColor: 'transparent',
                                padding: '0.5rem'
                            }}>
                                <TabsTrigger value="nuevos" style={{ gap: '0.5rem', padding: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '500', whiteSpace: 'nowrap', minWidth: window.innerWidth < 768 ? '140px' : 'auto' }}>
                                    <ClipboardList style={{ width: '1.125rem', height: '1.125rem' }} />
                                    {window.innerWidth >= 640 ? 'Nuevos Pedidos' : 'Nuevos'}
                                </TabsTrigger>
                                <TabsTrigger value="preparacion" style={{ gap: '0.5rem', padding: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '500', whiteSpace: 'nowrap', minWidth: window.innerWidth < 768 ? '140px' : 'auto' }}>
                                    <ChefHat style={{ width: '1.125rem', height: '1.125rem' }} />
                                    {window.innerWidth >= 640 ? 'En Preparación' : 'En Prep.'}
                                </TabsTrigger>
                                <TabsTrigger value="retrasados" style={{ gap: '0.5rem', padding: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '500', whiteSpace: 'nowrap', minWidth: window.innerWidth < 768 ? '140px' : 'auto' }}>
                                    <Clock style={{ width: '1.125rem', height: '1.125rem' }} />
                                    Retrasados
                                </TabsTrigger>
                                <TabsTrigger value="listos" style={{ gap: '0.5rem', padding: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', fontWeight: '500', whiteSpace: 'nowrap', minWidth: window.innerWidth < 768 ? '140px' : 'auto' }}>
                                    <CheckCircle style={{ width: '1.125rem', height: '1.125rem' }} />
                                    Listos
                                </TabsTrigger>
                            </TabsList>

                            {/* Tab de Nuevos */}
                            <TabsContent value="nuevos" style={{ padding: '1rem' }}>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            border: '4px solid #e5e7eb',
                                            borderTopColor: '#3b82f6',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite',
                                            margin: '0 auto 1rem'
                                        }} />
                                        <p style={{ fontSize: '1.125rem' }}>Cargando pedidos...</p>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                            gap: '1.5rem'
                                        }}>
                                            {nuevosOrders.map(order => (
                                                <OrderCard
                                                    key={order.id}
                                                    order={order}
                                                    onClick={() => handleCardClick(order)}
                                                />
                                            ))}
                                        </div>
                                        {nuevosOrders.length === 0 && (
                                            <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                                                <p style={{ fontSize: '1.125rem' }}>No hay pedidos nuevos</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </TabsContent>

                            {/* Tab de En Preparación */}
                            <TabsContent value="preparacion" style={{ padding: '1rem' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    {enPreparacionOrders.map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onClick={() => handleCardClick(order)}
                                        />
                                    ))}
                                </div>
                                {enPreparacionOrders.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                                        <p style={{ fontSize: '1.125rem' }}>No hay pedidos en preparación</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Tab de Retrasados */}
                            <TabsContent value="retrasados" style={{ padding: '1rem' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    {retrasadosOrders.map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onClick={() => handleCardClick(order)}
                                        />
                                    ))}
                                </div>
                                {retrasadosOrders.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                                        <p style={{ fontSize: '1.125rem' }}>No hay pedidos retrasados</p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Tab de Listos */}
                            <TabsContent value="listos" style={{ padding: '1rem' }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                    gap: '1.5rem'
                                }}>
                                    {listosOrders.map(order => (
                                        <OrderCard
                                            key={order.id}
                                            order={order}
                                            onClick={() => handleCardClick(order)}
                                        />
                                    ))}
                                </div>
                                {listosOrders.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
                                        <p style={{ fontSize: '1.125rem' }}>No hay pedidos listos</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>

            {/* Modal de detalle de pedido */}
            {selectedOrder && (
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="lg">
                    <DialogHeader>
                        <DialogTitle>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>{selectedOrder.id} - Mesa {selectedOrder.tableNumber}</span>
                                <Badge style={{
                                    backgroundColor: selectedOrder.status === 'nuevo' ? '#ef4444' :
                                        selectedOrder.status === 'en-preparacion' ? '#3b82f6' :
                                            selectedOrder.status === 'retrasado' ? '#f59e0b' : '#10b981',
                                    color: 'white',
                                    padding: '0.5rem 1rem',
                                    fontSize: '0.875rem'
                                }}>
                                    {selectedOrder.status === 'nuevo' ? 'Nuevo' :
                                        selectedOrder.status === 'en-preparacion' ? 'En Preparación' :
                                            selectedOrder.status === 'retrasado' ? 'Retrasado' : 'Listo'}
                                </Badge>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogContent>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                Items del Pedido
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {selectedOrder.items.map(item => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '0.5rem'
                                    }}>
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '0.375rem'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{item.name}</h4>
                                            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                                Cantidad: {item.quantity}
                                            </p>
                                            {item.notes && (
                                                <p style={{ color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                                    Nota: {item.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Botones de acción según estado */}
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', flexDirection: 'column' }}>
                            {selectedOrder.status === 'nuevo' && (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    {selectedOrder.canBeCancelled && selectedOrder.cancellationDeadline &&
                                        new Date() < new Date(selectedOrder.cancellationDeadline) ? (
                                        <Button
                                            disabled
                                            className="bg-gray-400 opacity-60 cursor-not-allowed rounded-xl h-12 text-base shadow-sm"
                                            style={{ flex: 1 }}
                                        >
                                            <Clock className="w-5 h-5 mr-2" />
                                            Esperar ({Math.ceil((new Date(selectedOrder.cancellationDeadline).getTime() - new Date().getTime()) / 1000)}s)
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleStartOrder}
                                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
                                            style={{ flex: 1 }}
                                        >
                                            <ChefHat className="w-5 h-5 mr-2" />
                                            Preparar
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleMarkDelayed}
                                        disabled={selectedOrder.canBeCancelled && selectedOrder.cancellationDeadline && new Date() < new Date(selectedOrder.cancellationDeadline) ? true : false}
                                        className={`hover:bg-amber-600 text-white rounded-xl h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02] ${selectedOrder.canBeCancelled && selectedOrder.cancellationDeadline && new Date() < new Date(selectedOrder.cancellationDeadline) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{ backgroundColor: '#f59e0b', flex: 1 }}
                                    >
                                        <Clock className="w-5 h-5 mr-2" />
                                        Retrasado
                                    </Button>
                                </div>
                            )}

                            {selectedOrder.status === 'en-preparacion' && (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <Button
                                        onClick={handleCompleteOrder}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
                                        style={{ flex: 1 }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                        Listo
                                    </Button>
                                    <Button
                                        onClick={handleMarkDelayed}
                                        className="hover:bg-amber-600 text-white rounded-xl h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
                                        style={{ backgroundColor: '#f59e0b', flex: 1 }}
                                    >
                                        <Clock className="w-5 h-5 mr-2" />
                                        Retrasado
                                    </Button>
                                </div>
                            )}

                            {selectedOrder.status === 'retrasado' && (
                                <Button
                                    onClick={handleResumeOrder}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 text-base font-semibold shadow-md transition-all hover:scale-[1.02]"
                                >
                                    <RefreshCw className="w-5 h-5 mr-2" />
                                    Volver a Preparación
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                                className="w-full mt-2 border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl h-10 font-medium"
                            >
                                Cerrar
                            </Button>
                        </div>
                    </DialogContent >
                </Dialog >
            )
            }
            {/* Popup de Pedido Cancelado (ALERTA ROJA) */}
            {
                cancelledOrderNotification && (
                    <div style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        animation: 'slideInRight 0.3s ease-out',
                        maxWidth: '95%',
                        width: '400px'
                    }}>
                        <Card style={{
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                            border: '4px solid #ef4444',
                            backgroundColor: '#fee2e2'
                        }}>
                            <CardHeader>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        backgroundColor: '#ef4444',
                                        padding: '0.75rem',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Bell style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                                    </div>
                                    <div>
                                        <CardTitle style={{ color: '#991b1b', marginBottom: '0.25rem' }}>
                                            ¡PEDIDO CANCELADO!
                                        </CardTitle>
                                        <p style={{ color: '#b91c1c', fontSize: '0.875rem' }}>
                                            Mesa {cancelledOrderNotification.tableNumber} - {cancelledOrderNotification.id}
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div style={{ marginBottom: '1rem' }}>
                                    <p style={{ color: '#7c2d12', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        El cliente ha cancelado este pedido.
                                    </p>
                                </div>
                                <Button
                                    onClick={handleDismissCancellation}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '0.75rem'
                                    }}
                                >
                                    Entendido - Eliminar de Vista
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                )
            }
        </>
    );
}
