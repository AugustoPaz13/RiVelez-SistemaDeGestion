import { useState, useEffect } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Card, CardContent } from '../../components/ui/card';
import { Star, MessageSquare, Loader2, Filter } from 'lucide-react';
import { reviewService, ReviewDTO, ReviewStats } from '../../services/reviewService';

export default function ResenasGerentePage() {
    const [reviews, setReviews] = useState<ReviewDTO[]>([]);
    const [stats, setStats] = useState<ReviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filterRating, setFilterRating] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [reviewsData, statsData] = await Promise.all([
                reviewService.getAll(),
                reviewService.getAverage()
            ]);
            setReviews(reviewsData);
            setStats(statsData);
        } catch (error) {
            console.error('Error cargando reseñas:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = filterRating
        ? reviews.filter(r => r.calificacion === filterRating)
        : reviews;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
            <Navbar />

            <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', color: 'white' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MessageSquare style={{ width: '2rem', height: '2rem' }} />
                        Reseñas de Clientes
                    </h1>
                    <p style={{ opacity: 0.8 }}>Gestión y monitoreo de satisfacción del cliente</p>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <Card style={{ borderRadius: '1rem' }}>
                        <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem', textAlign: 'center' }}>
                            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Calificación Promedio</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0055A4' }}>
                                    {stats?.promedio || '-'}
                                </span>
                                <Star style={{ width: '2rem', height: '2rem', color: '#f59e0b', fill: '#f59e0b' }} />
                            </div>
                        </CardContent>
                    </Card>

                    <Card style={{ borderRadius: '1rem' }}>
                        <CardContent style={{ padding: '1.5rem', paddingTop: '1.5rem', textAlign: 'center' }}>
                            <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>Total de Reseñas</p>
                            <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0055A4' }}>
                                {stats?.total || 0}
                            </span>
                        </CardContent>
                    </Card>
                </div>

                {/* Filtros */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                    <button
                        onClick={() => setFilterRating(null)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            border: 'none',
                            backgroundColor: filterRating === null ? 'white' : 'rgba(255,255,255,0.1)',
                            color: filterRating === null ? '#0055A4' : 'white',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <Filter style={{ width: '1rem', height: '1rem' }} />
                        Todas
                    </button>
                    {[5, 4, 3, 2, 1].map(stars => (
                        <button
                            key={stars}
                            onClick={() => setFilterRating(stars)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '9999px',
                                border: 'none',
                                backgroundColor: filterRating === stars ? 'white' : 'rgba(255,255,255,0.1)',
                                color: filterRating === stars ? '#f59e0b' : 'white',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                            }}
                        >
                            {stars} <Star style={{ width: '1rem', height: '1rem', fill: 'currentColor' }} />
                        </button>
                    ))}
                </div>

                {/* Lista de Reseñas */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'white' }}>
                        <Loader2 className="animate-spin" style={{ width: '3rem', height: '3rem' }} />
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {filteredReviews.map(review => (
                            <Card key={review.id} style={{ borderRadius: '1rem', overflow: 'hidden' }}>
                                <CardContent style={{ padding: '2rem', paddingTop: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    style={{
                                                        width: '1.25rem',
                                                        height: '1.25rem',
                                                        color: star <= review.calificacion ? '#f59e0b' : '#e5e7eb',
                                                        fill: star <= review.calificacion ? '#f59e0b' : 'none'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                            {review.fechaCreacion}
                                        </span>
                                    </div>

                                    {review.comentario && (
                                        <p style={{ color: '#374151', marginBottom: '1rem', lineHeight: '1.5' }}>
                                            "{review.comentario}"
                                        </p>
                                    )}

                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#6b7280', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                                        <span>Mesa {review.numeroMesa}</span>
                                        {review.numeroPedido && <span>Pedido #{review.numeroPedido}</span>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredReviews.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.7)' }}>
                                <p style={{ fontSize: '1.25rem' }}>No hay reseñas con este filtro</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
