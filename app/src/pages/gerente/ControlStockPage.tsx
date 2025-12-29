import { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '../../components/ui/dialog';
import { Package, TrendingDown, AlertCircle, Search } from 'lucide-react';
import { mockStock } from '../../data';
import { StockItem } from '../../types';

type MovementType = 'entrada' | 'salida' | 'ajuste';

export default function ControlStockPage() {
    const [stock, setStock] = useState<StockItem[]>(mockStock);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDialog, setShowDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
    const [movementType, setMovementType] = useState<MovementType>('entrada');
    const [quantity, setQuantity] = useState(0);
    const [notes, setNotes] = useState('');

    const filteredStock = stock.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleMovement = (item: StockItem) => {
        setSelectedItem(item);
        setMovementType('entrada');
        setQuantity(0);
        setNotes('');
        setShowDialog(true);
    };

    const handleSave = () => {
        if (!selectedItem || quantity <= 0) {
            alert('Ingrese una cantidad válida');
            return;
        }

        setStock(stock.map(item => {
            if (item.id === selectedItem.id) {
                let newQuantity = item.cantidad;
                if (movementType === 'entrada') {
                    newQuantity += quantity;
                } else if (movementType === 'salida') {
                    newQuantity = Math.max(0, newQuantity - quantity);
                } else {
                    newQuantity = quantity;
                }
                return { ...item, cantidad: newQuantity };
            }
            return item;
        }));

        setShowDialog(false);
    };

    const getStockStatus = (item: StockItem) => {
        if (item.cantidad === 0) return { label: 'Sin stock', color: 'destructive' };
        if (item.cantidad <= item.nivelMinimo) return { label: 'Stock bajo', color: 'warning' };
        return { label: 'Stock OK', color: 'default' };
    };

    const lowStockCount = stock.filter(item => item.cantidad <= item.nivelMinimo).length;
    const outOfStockCount = stock.filter(item => item.cantidad === 0).length;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
            <Navbar />

            <div style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
                            <Package style={{ display: 'inline', width: '2rem', height: '2rem', marginRight: '0.5rem' }} />
                            G3: Controlar Stock
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Registro de entradas, salidas y alertas de inventario
                        </p>
                    </div>

                    {/* Alertas y estadísticas */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Card>
                            <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                        <AlertCircle style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Sin Stock</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{outOfStockCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                        <TrendingDown style={{ width: '1.5rem', height: '1.5rem', color: '#f59e0b' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Stock Bajo</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{lowStockCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ backgroundColor: '#dbeafe', padding: '0.75rem', borderRadius: '0.5rem' }}>
                                        <Package style={{ width: '1.5rem', height: '1.5rem', color: '#0055A4' }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Total Items</p>
                                        <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>{stock.length}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Búsqueda */}
                    <Card style={{ marginBottom: '1.5rem' }}>
                        <CardContent style={{ padding: '1rem', paddingTop: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                                <Input
                                    placeholder="Buscar en inventario..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tabla de stock */}
                    <Card style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                        <CardContent style={{ padding: 0 }}>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Producto</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Unidad</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem' }}>Cantidad</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem' }}>Mínimo</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>Estado</th>
                                            <th style={{ padding: '1rem', textAlign: 'center', fontWeight: '600', fontSize: '0.875rem' }}>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStock.map((item) => {
                                            const status = getStockStatus(item);
                                            return (
                                                <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{item.nombre}</td>
                                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>{item.unidad}</td>
                                                    <td style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right', fontWeight: '600' }}>
                                                        {item.cantidad}
                                                    </td>
                                                    <td style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right', color: '#6b7280' }}>
                                                        {item.nivelMinimo}
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <Badge variant={status.color as any}>{status.label}</Badge>
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <button
                                                            title="Registrar entrada/salida de stock"
                                                            onClick={() => handleMovement(item)}
                                                            style={{
                                                                backgroundColor: '#3b82f6',
                                                                color: 'white',
                                                                borderRadius: '0.5rem',
                                                                padding: '0.5rem 1rem',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                fontWeight: '600',
                                                                fontSize: '0.875rem',
                                                                transition: 'background-color 0.2s'
                                                            }}
                                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                                                        >
                                                            Movimiento
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Dialog de movimiento */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <DialogHeader>
                    <DialogTitle>Registrar Movimiento - {selectedItem?.nombre}</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>
                                Stock actual: <strong>{selectedItem?.cantidad} {selectedItem?.unidad}</strong>
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Tipo de Movimiento
                            </label>
                            <select
                                value={movementType}
                                onChange={(e) => setMovementType(e.target.value as MovementType)}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db'
                                }}
                            >
                                <option value="entrada">Entrada (Agregar)</option>
                                <option value="salida">Salida (Restar)</option>
                                <option value="ajuste">Ajuste (Establecer cantidad)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Cantidad
                            </label>
                            <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Notas (opcional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Proveedor, motivo, etc..."
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db',
                                    minHeight: '60px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <Button onClick={handleSave} style={{ flex: 1 }}>Guardar</Button>
                            <Button onClick={() => setShowDialog(false)} variant="outline" style={{ flex: 1 }}>Cancelar</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
