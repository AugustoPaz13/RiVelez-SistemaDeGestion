import { Navbar } from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';

import { FileText, Download, Calendar } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const salesData = [
    { fecha: '20/12', ventas: 4500, pedidos: 45 },
    { fecha: '21/12', ventas: 5200, pedidos: 52 },
    { fecha: '22/12', ventas: 4800, pedidos: 48 },
    { fecha: '23/12', ventas: 6100, pedidos: 61 },
    { fecha: '24/12', ventas: 7200, pedidos: 72 },
    { fecha: '25/12', ventas: 5900, pedidos: 59 },
];

const topProducts = [
    { nombre: 'Pizza Margarita', cantidad: 85, ingresos: 1062.50 },
    { nombre: 'Hamburguesa Clásica', cantidad: 72, ingresos: 720.00 },
    { nombre: 'Pasta Carbonara', cantidad: 65, ingresos: 910.00 },
    { nombre: 'Parrillada Mixta', cantidad: 38, ingresos: 1710.00 },
    { nombre: 'Ensalada César', cantidad: 45, ingresos: 360.00 },
];

const paymentMethods = [
    { name: 'Efectivo', value: 42, color: '#10b981' },
    { name: 'Tarjeta', value: 35, color: '#3b82f6' },
    { name: 'Transferencia', value: 18, color: '#8b5cf6' },
    { name: 'QR', value: 5, color: '#f59e0b' },
];

export default function ReportesPage() {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
            <Navbar />

            <div style={{ padding: '2rem' }}>
                <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'white' }}>
                            <FileText style={{ display: 'inline', width: '2rem', height: '2rem', marginRight: '0.5rem' }} />
                            G4: Generar Reportes
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>
                            Análisis de ventas, ocupación y rendimiento
                        </p>
                    </div>

                    {/* Filtros */}
                    <Card style={{ marginBottom: '1.5rem', borderRadius: '1rem' }}>
                        <CardContent style={{ padding: '1rem', paddingTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <select style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}>
                                    <option>Últimos 7 días</option>
                                    <option>Último mes</option>
                                    <option>Último trimestre</option>
                                    <option>Personalizado</option>
                                </select>
                            </div>
                            <button
                                title="Descargar reporte en formato PDF"
                                style={{
                                    backgroundColor: 'white',
                                    color: '#3b82f6',
                                    border: '1px solid #3b82f6',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                <Download style={{ width: '1rem', height: '1rem' }} />
                                Exportar PDF
                            </button>
                            <button
                                title="Descargar reporte en formato Excel"
                                style={{
                                    backgroundColor: 'white',
                                    color: '#3b82f6',
                                    border: '1px solid #3b82f6',
                                    borderRadius: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    transition: 'background-color 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                                <Download style={{ width: '1rem', height: '1rem' }} />
                                Exportar Excel
                            </button>
                        </CardContent>
                    </Card>

                    {/* KPIs */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Card style={{ borderRadius: '1rem' }}>
                            <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ventas Totales</p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>$33,700</p>
                                <p style={{ fontSize: '0.75rem', color: '#10b981' }}>+12.5% vs. semana anterior</p>
                            </CardContent>
                        </Card>

                        <Card style={{ borderRadius: '1rem' }}>
                            <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Pedidos</p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>337</p>
                                <p style={{ fontSize: '0.75rem', color: '#10b981' }}>+8.3% vs. semana anterior</p>
                            </CardContent>
                        </Card>

                        <Card style={{ borderRadius: '1rem' }}>
                            <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ticket Promedio</p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>$100</p>
                                <p style={{ fontSize: '0.75rem', color: '#f59e0b' }}>+2.1% vs. semana anterior</p>
                            </CardContent>
                        </Card>

                        <Card style={{ borderRadius: '1rem' }}>
                            <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ocupación Promedio</p>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>78%</p>
                                <p style={{ fontSize: '0.75rem', color: '#10b981' }}>+5.2% vs. semana anterior</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Gráficos */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                        {/* Ventas por día */}
                        <Card style={{ borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle>Ventas por Día</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="fecha" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="ventas" stroke="#0055A4" strokeWidth={2} name="Ventas ($)" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Métodos de pago */}
                        <Card style={{ borderRadius: '1rem' }}>
                            <CardHeader>
                                <CardTitle>Métodos de Pago</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={paymentMethods}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: ${entry.value}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {paymentMethods.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Productos más vendidos */}
                    <Card style={{ borderRadius: '1rem' }}>
                        <CardHeader>
                            <CardTitle>Top 5 Productos Más Vendidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', fontSize: '0.875rem' }}>Producto</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem' }}>Cantidad</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.875rem' }}>Ingresos</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topProducts.map((product, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{product.nombre}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem' }}>{product.cantidad}</td>
                                                <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#0055A4' }}>
                                                    ${product.ingresos.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
