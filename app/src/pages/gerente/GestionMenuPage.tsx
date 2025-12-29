import { useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogContent } from '../../components/ui/dialog';
import { UtensilsCrossed, Plus, Edit, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { mockMenu } from '../../data';
import { Product, ProductCategory } from '../../types';

export default function GestionMenuPage() {
    const [products, setProducts] = useState<Product[]>(mockMenu);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState<ProductCategory | 'all'>('all');
    const [showDialog, setShowDialog] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: 'principal' as ProductCategory,
        disponible: true,
    });

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || product.categoria === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAdd = () => {
        setEditingProduct(null);
        setFormData({
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria: 'principal',
            disponible: true,
        });
        setShowDialog(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            nombre: product.nombre,
            descripcion: product.descripcion,
            precio: product.precio,
            categoria: product.categoria,
            disponible: product.disponible,
        });
        setShowDialog(true);
    };

    const handleSave = () => {
        if (!formData.nombre || formData.precio <= 0) {
            alert('Complete los campos requeridos');
            return;
        }

        if (editingProduct) {
            setProducts(products.map(p =>
                p.id === editingProduct.id ? { ...p, ...formData } : p
            ));
        } else {
            const newProduct: Product = {
                id: `p${Date.now()}`,
                ...formData,
                ingredientes: [],
            };
            setProducts([...products, newProduct]);
        }
        setShowDialog(false);
    };

    const handleToggleAvailability = (productId: string) => {
        setProducts(products.map(p =>
            p.id === productId ? { ...p, disponible: !p.disponible } : p
        ));
    };

    const handleDelete = (productId: string) => {
        if (confirm('¿Está seguro de eliminar este producto?')) {
            setProducts(products.filter(p => p.id !== productId));
        }
    };

    const getCategoryLabel = (cat: ProductCategory) => {
        const labels: Record<ProductCategory, string> = {
            'entrada': 'Entrada',
            'principal': 'Principal',
            'postre': 'Postre',
            'bebida': 'Bebida',
            'alcohol': 'Alcohol',
        };
        return labels[cat];
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
            <Navbar />

            <div style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
                            <UtensilsCrossed style={{ display: 'inline', width: '2rem', height: '2rem', marginRight: '0.5rem' }} />
                            G2: Gestionar Menú
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                            CRUD de productos, categorías y disponibilidad
                        </p>
                    </div>

                    {/* Filtros y búsqueda */}
                    <Card style={{ marginBottom: '1.5rem' }}>
                        <CardContent style={{ padding: '1rem', paddingTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                                <Search style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: '#9ca3af' }} />
                                <Input
                                    placeholder="Buscar productos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ paddingLeft: '2.5rem' }}
                                />
                            </div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value as ProductCategory | 'all')}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db',
                                    fontSize: '0.875rem',
                                    minWidth: '150px'
                                }}
                            >
                                <option value="all">Todas las categorías</option>
                                <option value="entrada">Entradas</option>
                                <option value="principal">Principales</option>
                                <option value="postre">Postres</option>
                                <option value="bebida">Bebidas</option>
                                <option value="alcohol">Alcohol</option>
                            </select>
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
                                Nuevo Producto
                            </button>
                        </CardContent>
                    </Card>

                    {/* Grid de productos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {filteredProducts.map((product) => (
                            <Card key={product.id}>
                                <CardHeader>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                        <div style={{ flex: 1 }}>
                                            <CardTitle style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                                {product.nombre}
                                            </CardTitle>
                                            <Badge variant="outline" style={{ fontSize: '0.75rem' }}>
                                                {getCategoryLabel(product.categoria)}
                                            </Badge>
                                        </div>
                                        <Badge variant={product.disponible ? 'default' : 'secondary'}>
                                            {product.disponible ? 'Disponible' : 'No disponible'}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', minHeight: '2.5rem' }}>
                                        {product.descripcion}
                                    </p>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0055A4', marginBottom: '1rem' }}>
                                        ${product.precio.toFixed(2)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            title="Editar producto"
                                            onClick={() => handleEdit(product)}
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
                                            title={product.disponible ? 'Marcar como no disponible' : 'Marcar como disponible'}
                                            onClick={() => handleToggleAvailability(product.id)}
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
                                            {product.disponible ? <EyeOff style={{ width: '1rem', height: '1rem' }} /> : <Eye style={{ width: '1rem', height: '1rem' }} />}
                                        </button>
                                        <button
                                            title="Eliminar producto"
                                            onClick={() => handleDelete(product.id)}
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
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredProducts.length === 0 && (
                        <Card>
                            <CardContent style={{ padding: '3rem', paddingTop: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                No se encontraron productos
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Dialog */}
            <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
                <DialogHeader>
                    <DialogTitle>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</DialogTitle>
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
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Descripción
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db',
                                    minHeight: '80px',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Precio *
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Categoría *
                            </label>
                            <select
                                value={formData.categoria}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as ProductCategory })}
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    borderRadius: '0.375rem',
                                    border: '1px solid #d1d5db'
                                }}
                            >
                                <option value="entrada">Entrada</option>
                                <option value="principal">Principal</option>
                                <option value="postre">Postre</option>
                                <option value="bebida">Bebida</option>
                                <option value="alcohol">Alcohol</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.disponible}
                                onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                                style={{ width: '1rem', height: '1rem' }}
                            />
                            <label style={{ fontSize: '0.875rem' }}>Producto disponible</label>
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
