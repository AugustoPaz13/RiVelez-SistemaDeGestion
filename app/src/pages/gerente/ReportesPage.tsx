import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { FileText, Download, Calendar, Loader2 } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { reportService, ReportSummary } from '../../services/reportService';

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function ReportesPage() {
    const [report, setReport] = useState<ReportSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dias, setDias] = useState(7);

    useEffect(() => {
        loadReport();
    }, [dias]);

    const loadReport = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await reportService.getSummary(dias);
            setReport(data);
        } catch (err) {
            console.error('Error cargando reportes:', err);
            setError('Error al cargar los reportes. Verifique que el servidor esté funcionando.');
        } finally {
            setLoading(false);
        }
    };

    const paymentMethodsData = report ? Object.entries(report.metodosPago).map(([name, value], index) => ({
        name,
        value: Math.round(value),
        color: COLORS[index % COLORS.length]
    })) : [];

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatChange = (value: number) => {
        const sign = value >= 0 ? '+' : '';
        return `${sign}${value.toFixed(1)}%`;
    };

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
                                <select
                                    value={dias}
                                    onChange={(e) => setDias(Number(e.target.value))}
                                    style={{ padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #d1d5db' }}
                                >
                                    <option value={7}>Últimos 7 días</option>
                                    <option value={30}>Último mes</option>
                                    <option value={90}>Último trimestre</option>
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

                    {loading && (
                        <Card style={{ borderRadius: '1rem' }}>
                            <CardContent style={{ padding: '3rem', paddingTop: '3rem', textAlign: 'center' }}>
                                <Loader2 className="animate-spin" style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem', color: '#0055A4' }} />
                                <p style={{ color: '#6b7280' }}>Cargando reportes...</p>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Card style={{ borderRadius: '1rem', backgroundColor: '#fef2f2' }}>
                            <CardContent style={{ padding: '2rem', paddingTop: '2rem', textAlign: 'center', color: '#dc2626' }}>
                                {error}
                            </CardContent>
                        </Card>
                    )}

                    {report && !loading && !error && (
                        <>
                            {/* KPIs */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <Card style={{ borderRadius: '1rem' }}>
                                    <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ventas Totales</p>
                                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>{formatCurrency(report.ventasTotales)}</p>
                                        <p style={{ fontSize: '0.75rem', color: report.ventasCambio >= 0 ? '#10b981' : '#ef4444' }}>
                                            {formatChange(report.ventasCambio)} vs. período anterior
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card style={{ borderRadius: '1rem' }}>
                                    <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total Pedidos</p>
                                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>{report.totalPedidos}</p>
                                        <p style={{ fontSize: '0.75rem', color: report.pedidosCambio >= 0 ? '#10b981' : '#ef4444' }}>
                                            {formatChange(report.pedidosCambio)} vs. período anterior
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card style={{ borderRadius: '1rem' }}>
                                    <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ticket Promedio</p>
                                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>{formatCurrency(report.ticketPromedio)}</p>
                                        <p style={{ fontSize: '0.75rem', color: report.ticketCambio >= 0 ? '#10b981' : '#f59e0b' }}>
                                            {formatChange(report.ticketCambio)} vs. período anterior
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card style={{ borderRadius: '1rem' }}>
                                    <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Ocupación Promedio</p>
                                        <p style={{ fontSize: '2rem', fontWeight: '700', color: '#0055A4' }}>{report.ocupacionPromedio.toFixed(0)}%</p>
                                        <p style={{ fontSize: '0.75rem', color: report.ocupacionCambio >= 0 ? '#10b981' : '#ef4444' }}>
                                            {formatChange(report.ocupacionCambio)} vs. período anterior
                                        </p>
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
                                            <LineChart data={report.ventasPorDia}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="fecha" />
                                                <YAxis />
                                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
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
                                                    data={paymentMethodsData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={(entry) => `${entry.name}: ${entry.value}%`}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {paymentMethodsData.map((entry, index) => (
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
                                                {report.topProductos.map((product, index) => (
                                                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                        <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{product.nombre}</td>
                                                        <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem' }}>{product.cantidad}</td>
                                                        <td style={{ padding: '1rem', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600', color: '#0055A4' }}>
                                                            {formatCurrency(product.ingresos)}
                                                        </td>
                                                    </tr>
                                                ))}
                                                {report.topProductos.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                                                            No hay datos de ventas para este período
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
