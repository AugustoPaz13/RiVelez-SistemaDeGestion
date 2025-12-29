import { useState, useEffect } from 'react';
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

// Mock data - pedidos simulados con nuevas funcionalidades
const mockOrders: KitchenOrder[] = [
    {
        id: 'PED-001',
        tableNumber: 1,
        status: 'nuevo',
        receivedAt: new Date(Date.now() - 1 * 60000).toISOString(),
        canBeCancelled: true,
        cancellationDeadline: new Date(Date.now() + 1 * 60000).toISOString(),
        people: 4,
        items: [
            {
                id: '1',
                name: 'Pizza Margarita',
                quantity: 2,
                image: '/images/products/pizza-margarita.png',
                ingredients: [
                    { id: 'ing-001', name: 'Harina', quantityNeeded: 0.5, unit: 'kg' },
                    { id: 'ing-002', name: 'Queso Mozzarella', quantityNeeded: 0.3, unit: 'kg' },
                    { id: 'ing-003', name: 'Salsa de Tomate', quantityNeeded: 0.2, unit: 'L' }
                ]
            },
            { id: '2', name: 'Ensalada César', quantity: 1, image: '/images/products/ensalada-cesar.png' }
        ]
    },
    {
        id: 'PED-002',
        tableNumber: 3,
        status: 'nuevo',
        receivedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        canBeCancelled: false,
        people: 2,
        items: [
            { id: '3', name: 'Hamburguesa Clásica', quantity: 1, image: '/images/products/hamburguesa-clasica.png', notes: 'Término medio' }
        ]
    },
    {
        id: 'PED-003',
        tableNumber: 5,
        status: 'en-preparacion',
        receivedAt: new Date(Date.now() - 25 * 60000).toISOString(),
        startedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        canBeCancelled: false,
        people: 3,
        items: [
            { id: '4', name: 'Pasta Carbonara', quantity: 2, image: '/images/products/pasta-carbonara.png' },
            { id: '5', name: 'Risotto de Hongos', quantity: 1, image: '/images/products/risotto-hongos.png' }
        ]
    },
    {
        id: 'PED-004',
        tableNumber: 7,
        status: 'retrasado',
        receivedAt: new Date(Date.now() - 40 * 60000).toISOString(),
        startedAt: new Date(Date.now() - 30 * 60000).toISOString(),
        canBeCancelled: false,
        people: 6,
        items: [
            { id: '6', name: 'Parrillada Mixta', quantity: 1, image: '/images/products/parrillada-mixta.png' }
        ]
    },
    {
        id: 'PED-005',
        tableNumber: 2,
        status: 'listo',
        receivedAt: new Date(Date.now() - 35 * 60000).toISOString(),
        startedAt: new Date(Date.now() - 25 * 60000).toISOString(),
        completedAt: new Date(Date.now() - 2 * 60000).toISOString(),
        canBeCancelled: false,
        people: 2,
        items: [
            { id: '7', name: 'Pizza Margarita', quantity: 1, image: '/images/products/pizza-margarita.png' },
            { id: '8', name: 'Ensalada César', quantity: 2, image: '/images/products/ensalada-cesar.png' }
        ]
    }
];

export default function CocineroPage() {
    const [orders, setOrders] = useState<KitchenOrder[]>(mockOrders);
    const [selectedOrder, setSelectedOrder] = useState<KitchenOrder | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [, setCurrentTime] = useState(new Date());
    const [currentTimeDisplay, setCurrentTimeDisplay] = useState('');
    const [newOrderNotification, setNewOrderNotification] = useState<KitchenOrder | null>(null);
    const [isNotifying, setIsNotifying] = useState(false);
    const [notificationComplete, setNotificationComplete] = useState(false);

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

    // Simular llegada de nuevos pedidos - mostrar popup automáticamente
    useEffect(() => {
        const timer = setTimeout(() => {
            const newOrder = orders.find(o => o.status === 'nuevo' && !newOrderNotification);
            if (newOrder) {
                setNewOrderNotification(newOrder);
            }
        }, 2000); // 2 segundos después de cargar
        return () => clearTimeout(timer);
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

    // TODO: Conectar con BD cuando esté lista
    const deductStockForOrder = (order: KitchenOrder) => {
        console.log('=== DESCUENTO DE STOCK ===');
        order.items.forEach(item => {
            if (item.ingredients) {
                item.ingredients.forEach(ingredient => {
                    const totalNeeded = ingredient.quantityNeeded * item.quantity;
                    console.log(`Descontar: ${totalNeeded}${ingredient.unit} de ${ingredient.name}`);
                });
            }
        });
        console.log('=== FIN DESCUENTO ===');
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

            // Notificar al cliente
            await notifyClient('en-preparacion');

            // Descuento de stock
            deductStockForOrder(selectedOrder);

            setOrders(orders.map(order =>
                order.id === selectedOrder.id
                    ? {
                        ...order,
                        status: 'en-preparacion',
                        startedAt: new Date().toISOString(),
                        canBeCancelled: false
                    }
                    : order
            ));
            toast.success('Pedido en preparación - Stock descontado');
        }
    };

    const handleCompleteOrder = async () => {
        if (selectedOrder) {
            setDialogOpen(false);

            // Mostrar loading de notificación
            await notifyClient('listo');

            // Una vez notificado, actualizar estado
            setOrders(orders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: 'listo', completedAt: new Date().toISOString() }
                    : order
            ));
            toast.success('¡Pedido listo para servir!');
        }
    };

    const handleMarkDelayed = async () => {
        if (selectedOrder) {
            setDialogOpen(false);

            // Notificar al cliente
            await notifyClient('retrasado');

            setOrders(orders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: 'retrasado' }
                    : order
            ));
            toast.warning('Pedido marcado como retrasado', {
                style: { backgroundColor: '#fef3c7', color: '#92400e' }
            });
        }
    };

    const handleResumeOrder = async () => {
        if (selectedOrder) {
            setDialogOpen(false);

            // Notificar al cliente
            await notifyClient('en-preparacion');

            setOrders(orders.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: 'en-preparacion' }
                    : order
            ));
            toast.success('Pedido vuelto a preparación');
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
                                            style={{
                                                flex: 1,
                                                backgroundColor: '#9ca3af',
                                                cursor: 'not-allowed',
                                                opacity: 0.6
                                            }}
                                        >
                                            Esperar período de cancelación
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleStartOrder}
                                            style={{ flex: 1, backgroundColor: '#3b82f6' }}
                                        >
                                            Comenzar a Preparar
                                        </Button>
                                    )}
                                    <Button
                                        onClick={handleMarkDelayed}
                                        style={{ flex: 0.6, backgroundColor: '#f59e0b' }}
                                    >
                                        Retrasado
                                    </Button>
                                </div>
                            )}

                            {selectedOrder.status === 'en-preparacion' && (
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <Button
                                        onClick={handleCompleteOrder}
                                        style={{ flex: 1, backgroundColor: '#10b981' }}
                                    >
                                        Marcar como Listo
                                    </Button>
                                    <Button
                                        onClick={handleMarkDelayed}
                                        style={{ flex: 0.6, backgroundColor: '#f59e0b' }}
                                    >
                                        Retrasado
                                    </Button>
                                </div>
                            )}

                            {selectedOrder.status === 'retrasado' && (
                                <Button
                                    onClick={handleResumeOrder}
                                    style={{ flex: 1, backgroundColor: '#3b82f6' }}
                                >
                                    Volver a Preparación
                                </Button>
                            )}

                            <Button
                                variant="outline"
                                onClick={() => setDialogOpen(false)}
                            >
                                Cerrar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}
