import { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '../../components/ui/dialog';
import { Tag, Plus, Edit, Trash2, Calendar } from 'lucide-react';

interface Promotion {
    id: string;
    nombre: string;
    tipo: 'porcentaje' | 'fijo' | '2x1' | 'combo';
    valor: number;
    alcance: 'producto' | 'categoria' | 'todo';
    productoId?: string;
    categoriaId?: string;
    fechaInicio: string;
    fechaFin: string;
    activo: boolean;
    diasSemana?: number[];
    horaInicio?: string;
    horaFin?: string;
}

const initialPromotions: Promotion[] = [
    {
        id: '1',
        nombre: '20% en Pizzas',
        tipo: 'porcentaje',
        valor: 20,
        alcance: 'categoria',
        categoriaId: 'pizzas',
        fechaInicio: '2025-12-01',
        fechaFin: '2025-12-31',
        activo: true,
        diasSemana: [1, 2, 3, 4, 5], // Lunes a Viernes
    },
    {
        id: '2',
        nombre: 'Happy Hour',
        tipo: 'porcentaje',
        valor: 30,
        alcance: 'categoria',
        categoriaId: 'bebidas',
        fechaInicio: '2025-12-01',
        fechaFin: '2025-12-31',
        activo: true,
        horaInicio: '17:00',
        horaFin: '19:00',
    },
];

export default function PromocionesPage() {
    const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
    const [showDialog, setShowDialog] = useState(false);
    const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'porcentaje' as Promotion['tipo'],
        valor: 0,
        alcance: 'todo' as Promotion['alcance'],
        fechaInicio: '',
        fechaFin: '',
        activo: true,
    });

    const handleAdd = () => {
        setEditingPromotion(null);
        setFormData({
            nombre: '',
            tipo: 'porcentaje',
            valor: 0,
            alcance: 'todo',
            fechaInicio: '',
            fechaFin: '',
            activo: true,
        });
        setShowDialog(true);
    };

    const handleEdit = (promotion: Promotion) => {
        setEditingPromotion(promotion);
        setFormData({
            nombre: promotion.nombre,
            tipo: promotion.tipo,
            valor: promotion.valor,
            alcance: promotion.alcance,
            fechaInicio: promotion.fechaInicio,
            fechaFin: promotion.fechaFin,
            activo: promotion.activo,
        });
        setShowDialog(true);
    };

    const handleSave = () => {
        if (!formData.nombre || formData.valor <= 0) {
            alert('Complete los campos requeridos');
            return;
        }

        if (editingPromotion) {
            setPromotions(promotions.map(p =>
                p.id === editingPromotion.id ? { ...p, ...formData } : p
            ));
        } else {
            const newPromotion: Promotion = {
                id: String(Date.now()),
                ...formData,
            };
            setPromotions([...promotions, newPromotion]);
        }
        setShowDialog(false);
    };

    const handleToggleStatus = (id: string) => {
        setPromotions(promotions.map(p =>
            p.id === id ? { ...p, activo: !p.activo } : p
        ));
    };

    const handleDelete = (id: string) => {
        if (confirm('¿Está seguro de eliminar esta promoción?')) {
            setPromotions(promotions.filter(p => p.id !== id));
        }
    };

    const getTipoLabel = (tipo: string) => {
        const labels: Record<string, string> = {
            'porcentaje': 'Descuento %',
            'fijo': 'Descuento Fijo',
            '2x1': '2x1',
            'combo': 'Combo',
        };
        return labels[tipo] || tipo;
    };

    const getAlcanceLabel = (alcance: string) => {
        const labels: Record<string, string> = {
            'producto': 'Producto Específico',
            'categoria': 'Categoría',
            'todo': 'Todo el Menú',
        };
        return labels[alcance] || alcance;
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
            <Navbar />

            <div style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
                            <Tag style={{ display: 'inline', width: '2rem', height: '2rem', marginRight: '0.5rem' }} />
                            G5: Definir Promociones
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Configuración de descuentos y reglas de promociones
                        </p>
                    </div>

                    {/* Botón agregar */}
                    <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            onClick={handleAdd}
                            style={{
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                            <Plus style={{ width: '1rem', height: '1rem' }} />
                            Nueva Promoción
                        </button>
                    </div>

                    {/* Lista de promociones */}
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {promotions.map((promo) => (
                            <Card key={promo.id} style={{ borderRadius: '1rem' }}>
                                <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>{promo.nombre}</h3>
                                                <Badge variant={promo.activo ? 'default' : 'secondary'}>
                                                    {promo.activo ? 'Activa' : 'Inactiva'}
                                                </Badge>
                                            </div>
                                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#6b7280' }}>
                                                <span>
                                                    <strong style={{ color: '#111827' }}>Tipo:</strong> {getTipoLabel(promo.tipo)}
                                                </span>
                                                <span>
                                                    <strong style={{ color: '#111827' }}>Valor:</strong> {promo.tipo === 'porcentaje' ? `${promo.valor}%` : `$${promo.valor}`}
                                                </span>
                                                <span>
                                                    <strong style={{ color: '#111827' }}>Alcance:</strong> {getAlcanceLabel(promo.alcance)}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                                                <Calendar className="w-4 h-4" />
                                                <span>{promo.fechaInicio} a {promo.fechaFin}</span>
                                            </div>
                                            {promo.horaInicio && promo.horaFin && (
                                                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                                                    <strong style={{ color: '#111827' }}>Horario:</strong> {promo.horaInicio} - {promo.horaFin}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                            <button
                                                title="Editar promoción"
                                                onClick={() => handleEdit(promo)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    backgroundColor: 'white',
                                                    color: '#3b82f6',
                                                    border: '1px solid #3b82f6',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#eff6ff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'white';
                                                }}
                                            >
                                                <Edit style={{ width: '1rem', height: '1rem' }} />
                                            </button>
                                            <button
                                                title={promo.activo ? 'Desactivar promoción' : 'Activar promoción'}
                                                onClick={() => handleToggleStatus(promo.id)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    backgroundColor: 'white',
                                                    color: promo.activo ? '#ef4444' : '#10b981',
                                                    border: `1px solid ${promo.activo ? '#ef4444' : '#10b981'}`,
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = promo.activo ? '#fef2f2' : '#ecfdf5';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'white';
                                                }}
                                            >
                                                {promo.activo ? 'Desactivar' : 'Activar'}
                                            </button>
                                            <button
                                                title="Eliminar promoción"
                                                onClick={() => handleDelete(promo.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    backgroundColor: 'white',
                                                    color: '#dc2626',
                                                    border: '1px solid #dc2626',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#fee2e2';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'white';
                                                }}
                                            >
                                                <Trash2 style={{ width: '1rem', height: '1rem' }} />
                                            </button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {promotions.length === 0 && (
                        <Card>
                            <CardContent style={{ padding: '3rem', paddingTop: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                No hay promociones configuradas
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <DialogHeader>
                    <DialogTitle>{editingPromotion ? 'Editar Promoción' : 'Nueva Promoción'}</DialogTitle>
                </DialogHeader>
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Nombre *
                            </label>
                            <Input
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                placeholder="Ej: Happy Hour, 2x1 en Pizzas"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                    Tipo *
                                </label>
                                <select
                                    value={formData.tipo}
                                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                                    style={{
                                        width: '100%',
                                        padding: '0.5rem',
                                        borderRadius: '0.375rem',
                                        border: '1px solid #d1d5db'
                                    }}
                                >
                                    <option value="porcentaje">Descuento %</option>
                                    <option value="fijo">Descuento Fijo</option>
                                    <option value="2x1">2x1</option>
                                    <option value="combo">Combo</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                    Valor *
                                </label>
                                <Input
                                    type="number"
                                    value={formData.valor}
                                    onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
                                    placeholder={formData.tipo === 'porcentaje' ? '20' : '50'}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Alcance *
                            </label>
                            <select
                                value={formData.alcance}
                                onChange={(e) => setFormData({ ...formData, alcance: e.target.value as any })}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db'
                                }}
                            >
                                <option value="todo">Todo el Menú</option>
                                <option value="categoria">Por Categoría</option>
                                <option value="producto">Producto Específico</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                    Fecha Inicio *
                                </label>
                                <Input
                                    type="date"
                                    value={formData.fechaInicio}
                                    onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                    Fecha Fin *
                                </label>
                                <Input
                                    type="date"
                                    value={formData.fechaFin}
                                    onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.activo}
                                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                                style={{ width: '1rem', height: '1rem' }}
                            />
                            <label style={{ fontSize: '0.875rem' }}>Promoción activa</label>
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
