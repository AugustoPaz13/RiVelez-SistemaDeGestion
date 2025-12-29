import { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { TableCard } from '../../components/cajero/TableCard';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Search, RefreshCw, Users, CreditCard, Trash2, Banknote, FileText, CheckCircle2, Printer, Mail } from 'lucide-react';
import { toast, Toaster } from '../../components/ui/sonner';

interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
}

interface TableData {
    tableNumber: number;
    status: 'available' | 'occupied' | 'reserved';
    guests?: number;
    items: OrderItem[];
    startTime?: string;
}

const initialTables: TableData[] = [
    {
        tableNumber: 1,
        status: 'occupied',
        guests: 4,
        startTime: '14:30',
        items: [
            { id: '1', name: 'Pizza Margarita', quantity: 2, price: 12.50 },
            { id: '2', name: 'Coca Cola', quantity: 4, price: 2.50 },
            { id: '3', name: 'Ensalada César', quantity: 1, price: 8.00 },
            { id: '4', name: 'Helado de Chocolate', quantity: 2, price: 4.50 }
        ]
    },
    { tableNumber: 2, status: 'available', guests: 0, items: [] },
    {
        tableNumber: 3,
        status: 'occupied',
        guests: 2,
        startTime: '15:15',
        items: [
            { id: '5', name: 'Hamburguesa Clásica', quantity: 2, price: 10.00 },
            { id: '6', name: 'Papas Fritas', quantity: 2, price: 4.00 },
            { id: '7', name: 'Cerveza Artesanal', quantity: 2, price: 6.50 }
        ]
    },
    { tableNumber: 4, status: 'reserved', guests: 0, items: [] },
    {
        tableNumber: 5,
        status: 'occupied',
        guests: 3,
        startTime: '13:45',
        items: [
            { id: '8', name: 'Pasta Carbonara', quantity: 1, price: 14.00 },
            { id: '9', name: 'Risotto de Hongos', quantity: 1, price: 15.50 },
            { id: '10', name: 'Tiramisú', quantity: 2, price: 5.50 },
            { id: '11', name: 'Café Espresso', quantity: 3, price: 2.00 }
        ]
    },
    { tableNumber: 6, status: 'available', guests: 0, items: [] },
    {
        tableNumber: 7,
        status: 'occupied',
        guests: 6,
        startTime: '14:00',
        items: [
            { id: '12', name: 'Parrillada Mixta', quantity: 1, price: 45.00 },
            { id: '13', name: 'Vino Tinto', quantity: 2, price: 18.00 },
            { id: '14', name: 'Agua Mineral', quantity: 4, price: 1.50 }
        ]
    },
    { tableNumber: 8, status: 'available', guests: 0, items: [] },
    {
        tableNumber: 9,
        status: 'occupied',
        guests: 2,
        startTime: '15:30',
        items: [
            { id: '15', name: 'Sushi Variado', quantity: 1, price: 22.00 },
            { id: '16', name: 'Té Verde', quantity: 2, price: 2.50 }
        ]
    },
    { tableNumber: 10, status: 'available', guests: 0, items: [] },
    { tableNumber: 11, status: 'reserved', guests: 0, items: [] },
    { tableNumber: 12, status: 'available', guests: 0, items: [] }
];

type DialogView = 'order' | 'payment' | 'processing' | 'success' | 'rejected' | 'cancel-confirm' | 'delete-confirm' | 'receipt' | null;

export default function CajeroPage() {
    const [tables, setTables] = useState<TableData[]>(initialTables);
    const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogView, setDialogView] = useState<DialogView>(null);
    const [email, setEmail] = useState('');
    const [showEmailInput, setShowEmailInput] = useState(false);
    // const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    // const [lastDeletedItem, setLastDeletedItem] = useState<{ item: OrderItem; tableNumber: number } | null>(null);

    const handleTableClick = (table: TableData) => {
        if (table.status === 'occupied') {
            setSelectedTable(table);
            setDialogView('order');
        } else if (table.status === 'available') {
            toast.info(`Mesa ${table.tableNumber} está disponible`);
        } else if (table.status === 'reserved') {
            toast.info(`Mesa ${table.tableNumber} está reservada`);
        }
    };

    const handleRemoveItem = (itemId: string) => {
        setItemToDelete(itemId);
        setDialogView('delete-confirm');
    };

    const confirmDeleteItem = () => {
        if (selectedTable && itemToDelete) {
            const itemBeingDeleted = selectedTable.items.find(item => item.id === itemToDelete);
            const updatedItems = selectedTable.items.filter(item => item.id !== itemToDelete);
            const updatedTable = { ...selectedTable, items: updatedItems };

            setSelectedTable(updatedTable);
            setTables(tables.map(table =>
                table.tableNumber === selectedTable.tableNumber ? updatedTable : table
            ));

            // Capturar el item y tableNumber en el closure del toast
            if (itemBeingDeleted) {
                const deletedItemData = { item: itemBeingDeleted, tableNumber: selectedTable.tableNumber };
                // setLastDeletedItem(deletedItemData);

                toast.success('Producto eliminado', {
                    action: {
                        label: 'Deshacer',
                        onClick: () => {
                            // Esta función captura deletedItemData específico
                            setTables(currentTables => {
                                return currentTables.map(table => {
                                    if (table.tableNumber === deletedItemData.tableNumber) {
                                        return {
                                            ...table,
                                            items: [...table.items, deletedItemData.item]
                                        };
                                    }
                                    return table;
                                });
                            });

                            setSelectedTable(currentSelected => {
                                if (currentSelected && currentSelected.tableNumber === deletedItemData.tableNumber) {
                                    return {
                                        ...currentSelected,
                                        items: [...currentSelected.items, deletedItemData.item]
                                    };
                                }
                                return currentSelected;
                            });

                            toast.success('Producto restaurado');
                        },
                    },
                });
            }

            setItemToDelete(null);
            setDialogView('order');
        }
    };



    const simulateCardPayment = async () => {
        // 30% probabilidad de rechazo
        return new Promise<{ success: boolean; reason?: string }>((resolve) => {
            setTimeout(() => {
                const isRejected = Math.random() < 0.3;

                if (isRejected) {
                    const reasons = [
                        'Fondos insuficientes',
                        'Tarjeta bloqueada',
                        'Error de comunicación',
                        'Límite de compra excedido'
                    ];
                    resolve({
                        success: false,
                        reason: reasons[Math.floor(Math.random() * reasons.length)]
                    });
                } else {
                    resolve({ success: true });
                }
            }, 2500); // Simula 2.5 segundos de procesamiento
        });
    };

    const handleSelectPayment = async (method: 'cash' | 'card') => {
        // setPaymentMethod(method);

        if (method === 'cash') {
            // Efectivo - éxito inmediato
            setDialogView('success');
            setTimeout(() => {
                setDialogView('receipt');
            }, 2000);
        } else {
            // Tarjeta - mostrar modal de procesamiento
            setDialogView('processing');

            const result = await simulateCardPayment();

            if (result.success) {
                setDialogView('success');
                setTimeout(() => {
                    setDialogView('receipt');
                }, 2000);
            } else {
                setRejectionReason(result.reason || 'Error desconocido');
                setDialogView('rejected');
            }
        }
    };

    const handleCancelPaymentConfirm = () => {
        setDialogView(null);
        setSelectedTable(null);
        // setPaymentMethod(null);
        setRejectionReason('');
        toast.info('Pago cancelado');
    };

    const handleRetryPayment = () => {
        setDialogView('payment');
        // setPaymentMethod(null);
        setRejectionReason('');
    };

    const handlePrint = () => {
        toast.success('Comprobante impreso exitosamente');
        setTimeout(() => completePayment(), 1000);
    };

    const handleSendEmail = () => {
        if (!email || !email.includes('@')) {
            toast.error('Por favor, ingrese un correo electrónico válido');
            return;
        }
        toast.success('Comprobante enviado por correo electrónico');
        setTimeout(() => completePayment(), 1000);
    };

    const completePayment = () => {
        if (selectedTable) {
            setTables(tables.map(table =>
                table.tableNumber === selectedTable.tableNumber
                    ? { ...table, status: 'available', guests: 0, items: [], startTime: undefined }
                    : table
            ));
        }
        setDialogView(null);
        setSelectedTable(null);
        setEmail('');
        setShowEmailInput(false);
    };

    const calculateTotal = (items: OrderItem[]) => {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return subtotal * 1.1;
    };

    const filteredTables = tables.filter(table =>
        table.tableNumber.toString().includes(searchTerm) ||
        (table.status === 'occupied' && table.guests?.toString().includes(searchTerm))
    );

    const occupiedCount = tables.filter(t => t.status === 'occupied').length;
    const availableCount = tables.filter(t => t.status === 'available').length;
    const reservedCount = tables.filter(t => t.status === 'reserved').length;

    const subtotal = selectedTable ? selectedTable.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <>
            <Navbar />
            <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e', padding: '1.5rem' }}>
                <Toaster />

                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.25rem' }}>Interfaz - Cajero</h1>
                                    <p style={{ color: '#6b7280' }}>Gestión de mesas y pagos</p>
                                </div>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                    <Badge style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(16,185,129,0.1)', color: '#047857', border: '1px solid rgba(16,185,129,0.2)' }}>
                                        {availableCount} Disponibles
                                    </Badge>
                                    <Badge style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.2)' }}>
                                        {occupiedCount} Ocupadas
                                    </Badge>
                                    <Badge style={{ padding: '0.5rem 1rem', backgroundColor: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(245,158,11,0.2)' }}>
                                        {reservedCount} Reservadas
                                    </Badge>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <div style={{ flex: 1, position: 'relative' }}>
                                    <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                                    <Input
                                        type="text"
                                        placeholder="Buscar mesa por número..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{ paddingLeft: '2.5rem' }}
                                    />
                                </div>
                                <Button variant="outline" onClick={() => toast.success('Datos actualizados')}>
                                    <RefreshCw style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                                    Actualizar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Grid de mesas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                        {filteredTables.map((table) => (
                            <TableCard
                                key={table.tableNumber}
                                tableNumber={table.tableNumber}
                                status={table.status}
                                guests={table.guests}
                                total={table.items.length > 0 ? calculateTotal(table.items) : undefined}
                                onClick={() => handleTableClick(table)}
                            />
                        ))}
                    </div>

                    {filteredTables.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'white' }}>
                            No se encontraron mesas
                        </div>
                    )}
                </div>

                {/* Dialog de detalles de orden */}
                <Dialog open={dialogView === 'order'} onClose={() => setDialogView(null)} maxWidth="lg">
                    <DialogHeader>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                            <div>
                                <DialogTitle>Mesa {selectedTable?.tableNumber}</DialogTitle>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                    Hora de inicio: {selectedTable?.startTime}
                                </p>
                            </div>
                            <Badge style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'rgba(59,130,246,0.1)', color: '#2563eb', border: '1px solid rgba(59,130,246,0.2)' }}>
                                <Users style={{ width: '0.875rem', height: '0.875rem' }} />
                                {selectedTable?.guests} personas
                            </Badge>
                        </div>
                    </DialogHeader>
                    <DialogContent>
                        {selectedTable && (
                            <>
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: '600' }}>Producto</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'center', fontWeight: '600' }}>Cantidad</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600' }}>Precio Unit.</th>
                                                <th style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600' }}>Subtotal</th>
                                                <th style={{ padding: '0.75rem 0.5rem', width: '3rem' }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedTable.items.map((item) => (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '0.75rem 1rem' }}>{item.name}</td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>{item.quantity}</td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                                                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>${(item.price * item.quantity).toFixed(2)}</td>
                                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                                        <button
                                                            onClick={() => handleRemoveItem(item.id)}
                                                            style={{
                                                                background: 'none',
                                                                border: 'none',
                                                                color: '#dc2626',
                                                                cursor: 'pointer',
                                                                padding: '0.25rem',
                                                                transition: 'color 0.2s'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.color = '#b91c1c'}
                                                            onMouseOut={(e) => e.currentTarget.style.color = '#dc2626'}
                                                        >
                                                            <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <Separator style={{ margin: '1.5rem 0' }} />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                                        <span>Subtotal:</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280' }}>
                                        <span>Impuestos (10%):</span>
                                        <span>${tax.toFixed(2)}</span>
                                    </div>
                                    <Separator style={{ margin: '0.5rem 0' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: '700' }}>
                                        <span>Total:</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                                    <Button variant="outline" onClick={() => setDialogView(null)} style={{ flex: 1 }}>
                                        Cerrar
                                    </Button>
                                    <Button onClick={() => setDialogView('payment')} style={{ flex: 1, backgroundColor: '#0055A4' }}>
                                        <CreditCard style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                                        Procesar Pago
                                    </Button>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Dialog de selección de método de pago */}
                <Dialog open={dialogView === 'payment'} onClose={() => setDialogView('cancel-confirm')} maxWidth="md">
                    <DialogHeader>
                        <DialogTitle>Seleccione Método de Pago</DialogTitle>
                    </DialogHeader>
                    <DialogContent>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ color: '#6b7280', marginBottom: '0.5rem', textAlign: 'center' }}>Total a pagar</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '700' }}>${total.toFixed(2)}</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                            <button
                                onClick={() => handleSelectPayment('cash')}
                                style={{
                                    height: '10rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    backgroundColor: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#15803d';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#16a34a';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <Banknote style={{ width: '4rem', height: '4rem' }} />
                                <span>Efectivo</span>
                            </button>

                            <button
                                onClick={() => handleSelectPayment('card')}
                                style={{
                                    height: '10rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '1rem',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    fontSize: '1.25rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <CreditCard style={{ width: '4rem', height: '4rem' }} />
                                <span>Tarjeta</span>
                            </button>
                        </div>

                        <Button variant="outline" onClick={() => setDialogView('order')} style={{ width: '100%' }}>
                            Cancelar
                        </Button>
                    </DialogContent>
                </Dialog>

                {/* Dialog de éxito */}
                <Dialog open={dialogView === 'success'} onClose={() => { }} maxWidth="md">
                    <DialogContent>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    backgroundColor: '#10b981',
                                    borderRadius: '50%',
                                    padding: '1.5rem',
                                    animation: 'pulse 1s ease-in-out infinite'
                                }}>
                                    <CheckCircle2 style={{ width: '5rem', height: '5rem', color: 'white' }} />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                ¡Pago Realizado con Éxito!
                            </h2>
                            <p style={{ color: '#6b7280' }}>Pago en efectivo confirmado</p>
                            <p style={{ color: '#6b7280' }}>¡Gracias por su compra!</p>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Dialog de procesando pago con tarjeta */}
                <Dialog open={dialogView === 'processing'} onClose={() => { }} maxWidth="md">
                    <DialogContent>
                        <div style={{ padding: '2rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: '4rem',
                                    height: '4rem',
                                    border: '4px solid #e5e7eb',
                                    borderTopColor: '#2563eb',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}>
                                </div>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Consultando Entidad Financiera
                            </h2>
                            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Procesando su pago con tarjeta...</p>
                            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Por favor, espere un momento</p>
                            <Button
                                variant="outline"
                                onClick={handleCancelPaymentConfirm}
                                style={{ width: '100%' }}
                            >
                                ✕ Cancelar Pago
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Dialog de pago rechazado */}
                <Dialog open={dialogView === 'rejected'} onClose={() => { }} maxWidth="md">
                    <DialogHeader>
                        <DialogTitle>Pago Rechazado</DialogTitle>
                    </DialogHeader>
                    <DialogContent>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    backgroundColor: '#fee2e2',
                                    borderRadius: '50%',
                                    padding: '1.5rem',
                                    width: '6rem',
                                    height: '6rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '3rem', color: '#dc2626', fontWeight: '700' }}>!</span>
                                </div>
                            </div>

                            <div style={{
                                backgroundColor: '#fee2e2',
                                border: '1px solid #fecaca',
                                borderRadius: '0.5rem',
                                padding: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b' }}>
                                    <span style={{ fontSize: '1.25rem' }}>⊗</span>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontWeight: '600' }}>Pago Rechazado</div>
                                        <div style={{ fontSize: '0.875rem' }}>{rejectionReason}</div>
                                    </div>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                No se pudo procesar el pago
                            </h3>
                            <p style={{ color: '#6b7280' }}>
                                El pago anterior fue rechazado. Por favor, intente con otro método.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Button
                                onClick={handleRetryPayment}
                                style={{ width: '100%', backgroundColor: '#2563eb' }}
                            >
                                Intentar con Otro Método de Pago
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelPaymentConfirm}
                                style={{ width: '100%' }}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Dialog de confirmación de cancelar pago */}
                <Dialog open={dialogView === 'cancel-confirm'} onClose={() => setDialogView('payment')} maxWidth="md">
                    <DialogContent>
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    backgroundColor: '#fee2e2',
                                    borderRadius: '50%',
                                    padding: '1.5rem',
                                    width: '6rem',
                                    height: '6rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '3rem', color: '#dc2626', fontWeight: '700' }}>!</span>
                                </div>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                                ¿Anular pago?
                            </h2>
                            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                                ¿Está seguro de que desea cancelar esta operación? La transacción volverá a estar pendiente.
                            </p>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <Button
                                    variant="outline"
                                    onClick={() => setDialogView('payment')}
                                    style={{ flex: 1 }}
                                >
                                    No, continuar con el pago
                                </Button>
                                <Button
                                    onClick={handleCancelPaymentConfirm}
                                    style={{ flex: 1, backgroundColor: '#dc2626' }}
                                >
                                    Sí, anular pago
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Dialog de confirmación de eliminar producto */}
                <Dialog open={dialogView === 'delete-confirm'} onClose={() => setDialogView('order')} maxWidth="md">
                    <DialogContent>
                        <div style={{ padding: '1rem', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    backgroundColor: '#fef3c7',
                                    borderRadius: '50%',
                                    padding: '1.5rem',
                                    width: '6rem',
                                    height: '6rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <span style={{ fontSize: '3rem', color: '#d97706', fontWeight: '700' }}>!</span>
                                </div>
                            </div>

                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                                ¿Eliminar producto?
                            </h2>
                            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
                                ¿Está seguro de que desea eliminar este producto de la orden? Esta acción no se puede deshacer.
                            </p>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setItemToDelete(null);
                                        setDialogView('order');
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={confirmDeleteItem}
                                    style={{ flex: 1, backgroundColor: '#dc2626' }}
                                >
                                    Sí, eliminar
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Dialog de comprobante */}
                <Dialog open={dialogView === 'receipt'} onClose={() => { }} maxWidth="md">
                    <DialogHeader>
                        <DialogTitle>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FileText style={{ width: '1.25rem', height: '1.25rem' }} />
                                Comprobante de Pago
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogContent>
                        <div style={{
                            border: '2px dashed #d1d5db',
                            borderRadius: '0.5rem',
                            padding: '2rem',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem'
                        }}>
                            {/* Logo */}
                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <img
                                    src="/logo-rivelez.png"
                                    alt="RiVelez"
                                    style={{ width: '120px', height: '120px', margin: '0 auto' }}
                                />
                            </div>

                            <div style={{ marginBottom: '1rem' }}>
                                <div>MESA: {selectedTable?.tableNumber}</div>
                                <div>
                                    FECHA: {new Date().toLocaleDateString('es-AR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid #d1d5db', marginTop: '0.75rem', marginBottom: '0.75rem' }}></div>

                            {selectedTable?.items.map((item) => {
                                const itemTotal = (item.price * item.quantity).toFixed(2);
                                const itemName = item.name.toUpperCase();
                                const nameWithQty = `${item.quantity} X ${itemName}`;
                                const dotsNeeded = Math.max(1, 28 - nameWithQty.length - itemTotal.length);
                                const dots = '.'.repeat(dotsNeeded);

                                return (
                                    <div key={item.id} style={{ lineHeight: '1.75' }}>
                                        {nameWithQty} {dots} {itemTotal}
                                    </div>
                                );
                            })}

                            <div style={{ borderTop: '1px dashed #9ca3af', marginTop: '0.75rem', marginBottom: '0.75rem' }}></div>

                            <div>
                                <div style={{ lineHeight: '1.75' }}>SUBTOTAL ......... {subtotal.toFixed(2)}</div>
                                <div style={{ lineHeight: '1.75' }}>IVA (10%) ........ {tax.toFixed(2)}</div>
                                <div style={{ lineHeight: '1.75' }}>TOTAL ............ {total.toFixed(2)}</div>
                            </div>

                            <div style={{ borderTop: '1px solid #d1d5db', marginTop: '1rem', marginBottom: '1rem' }}></div>

                            <div style={{ textAlign: 'center', fontWeight: '700' }}>
                                <p>GRACIAS POR SU VISITA!</p>
                            </div>
                        </div>

                        {showEmailInput && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                                    Correo Electrónico
                                </label>
                                <Input
                                    type="email"
                                    placeholder="cliente@ejemplo.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {!showEmailInput && (
                                <>
                                    <Button
                                        onClick={handlePrint}
                                        style={{ width: '100%', backgroundColor: '#0055A4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Printer style={{ width: '1rem', height: '1rem' }} />
                                        Imprimir Comprobante
                                    </Button>

                                    <Button
                                        onClick={() => setShowEmailInput(true)}
                                        variant="outline"
                                        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Mail style={{ width: '1rem', height: '1rem' }} />
                                        Enviar por Correo Electrónico
                                    </Button>
                                </>
                            )}

                            {showEmailInput && (
                                <>
                                    <Button
                                        onClick={handleSendEmail}
                                        style={{ width: '100%', backgroundColor: '#0055A4', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    >
                                        <Mail style={{ width: '1rem', height: '1rem' }} />
                                        Enviar Comprobante
                                    </Button>

                                    <Button
                                        onClick={() => setShowEmailInput(false)}
                                        variant="outline"
                                        style={{ width: '100%' }}
                                    >
                                        Cancelar
                                    </Button>
                                </>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}
