import { useState } from 'react';
import { Star, Send, X } from 'lucide-react';
import { reviewService } from '../../services/reviewService';

interface ReviewFormProps {
    numeroMesa: number;
    numeroPedido?: string;
    onClose: () => void;
    onSubmitted?: () => void;
}

export function ReviewForm({ numeroMesa, numeroPedido, onClose, onSubmitted }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await reviewService.create({
                calificacion: rating,
                comentario: comment || undefined,
                numeroMesa,
                numeroPedido,
            });
            setSubmitted(true);
            setTimeout(() => {
                onSubmitted?.();
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Error al enviar reseña:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    padding: '2rem',
                    textAlign: 'center',
                    maxWidth: '400px',
                    animation: 'fadeIn 0.3s ease-out',
                }}>
                    <div style={{
                        width: '4rem',
                        height: '4rem',
                        backgroundColor: '#dcfce7',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem',
                    }}>
                        <Star style={{ width: '2rem', height: '2rem', color: '#16a34a', fill: '#16a34a' }} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        ¡Gracias por tu valoración!
                    </h3>
                    <p style={{ color: '#6b7280' }}>Tu opinión nos ayuda a mejorar</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                padding: '1.5rem',
                width: '90%',
                maxWidth: '400px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>¿Cómo fue tu experiencia?</h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.25rem',
                        }}
                    >
                        <X style={{ width: '1.5rem', height: '1.5rem', color: '#9ca3af' }} />
                    </button>
                </div>

                {/* Stars */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginBottom: '1.5rem',
                }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.25rem',
                                transition: 'transform 0.1s',
                                transform: (hoveredRating >= star || rating >= star) ? 'scale(1.1)' : 'scale(1)',
                            }}
                        >
                            <Star
                                style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    color: (hoveredRating >= star || rating >= star) ? '#f59e0b' : '#d1d5db',
                                    fill: (hoveredRating >= star || rating >= star) ? '#f59e0b' : 'none',
                                    transition: 'all 0.15s',
                                }}
                            />
                        </button>
                    ))}
                </div>

                {/* Rating text */}
                <p style={{
                    textAlign: 'center',
                    color: rating > 0 ? '#374151' : '#9ca3af',
                    marginBottom: '1rem',
                    fontSize: '0.875rem',
                }}>
                    {rating === 0 && 'Seleccioná una calificación'}
                    {rating === 1 && 'Muy malo 😞'}
                    {rating === 2 && 'Malo 😕'}
                    {rating === 3 && 'Regular 😐'}
                    {rating === 4 && 'Bueno 🙂'}
                    {rating === 5 && '¡Excelente! 🤩'}
                </p>

                {/* Comment */}
                <textarea
                    placeholder="¿Querés dejarnos un comentario? (opcional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '0.5rem',
                        resize: 'none',
                        height: '80px',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                    }}
                />

                {/* Submit button */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            backgroundColor: 'white',
                            color: '#6b7280',
                            border: '1px solid #e5e7eb',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Omitir
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                        style={{
                            flex: 2,
                            padding: '0.75rem',
                            backgroundColor: rating === 0 ? '#d1d5db' : '#0055A4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontWeight: '600',
                            cursor: rating === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: isSubmitting ? 0.7 : 1,
                        }}
                    >
                        <Send style={{ width: '1rem', height: '1rem' }} />
                        {isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
