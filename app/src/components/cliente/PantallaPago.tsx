import { useState } from 'react';
import { CreditCard, Banknote, Smartphone, QrCode, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { MetodoPago } from '../../types/restaurant';
import { orderService } from '../../services/orderService';

interface PantallaPagoProps {
  total: number;
  numeroMesa: number;
  orderId: string; // ID del pedido para notificar al backend
  onVolverAPedido: () => void;
  onPagoExitoso: (metodoPago: string) => void;
}

export function PantallaPago({
  total,
  numeroMesa,
  orderId,
  onVolverAPedido,
  onPagoExitoso,
}: PantallaPagoProps) {
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<MetodoPago | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metodosPago = [
    { id: 'efectivo' as MetodoPago, nombre: 'Efectivo', icon: Banknote, color: '#10b981' },
    { id: 'tarjeta' as MetodoPago, nombre: 'Tarjeta', icon: CreditCard, color: '#3b82f6' },
    { id: 'transferencia' as MetodoPago, nombre: 'Transferencia', icon: Smartphone, color: '#a855f7' },
    { id: 'qr' as MetodoPago, nombre: 'Código QR', icon: QrCode, color: '#6366f1' },
  ];

  const procesarPago = async () => {
    if (!metodoSeleccionado) return;

    setProcesando(true);
    setError(null);

    try {
      const metodoPagoNombre = metodosPago.find(m => m.id === metodoSeleccionado)?.nombre || '';

      // Notificar al backend que el cliente eligió método de pago
      if (orderId) {
        await orderService.markReadyToPay(orderId, metodoPagoNombre);
      }

      // Simular pequeña demora para mejor UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      setProcesando(false);
      onPagoExitoso(metodoPagoNombre);
    } catch (err) {
      console.error('Error al notificar método de pago:', err);
      setProcesando(false);
      setError('Error al notificar al cajero. Intenta nuevamente.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onVolverAPedido}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
            >
              <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Elegir Método de Pago</h1>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Mesa {numeroMesa}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Total a pagar */}
        <div style={{ background: 'linear-gradient(to right, #3b82f6, #6366f1)', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem', textAlign: 'center', color: 'white' }}>
          <p style={{ opacity: 0.9, marginBottom: '0.5rem', fontSize: '0.875rem' }}>Total a Pagar</p>
          <p style={{ fontSize: '2.25rem', fontWeight: '700', margin: 0 }}>${total.toFixed(2)}</p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', border: '2px solid #fca5a5', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <XCircle style={{ width: '1.5rem', height: '1.5rem', color: '#dc2626', flexShrink: 0, marginTop: '0.25rem' }} />
            <div>
              <h3 style={{ color: '#7f1d1d', marginBottom: '0.25rem', fontSize: '1.125rem', fontWeight: '600' }}>Pago Rechazado</h3>
              <p style={{ color: '#991b1b', margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {/* Métodos de pago */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>Selecciona un método de pago</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            {metodosPago.map(metodo => {
              const Icon = metodo.icon;
              const seleccionado = metodoSeleccionado === metodo.id;

              return (
                <button
                  key={metodo.id}
                  onClick={() => setMetodoSeleccionado(metodo.id)}
                  disabled={procesando}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '0.75rem',
                    border: seleccionado ? `2px solid ${metodo.color}` : '2px solid #e5e7eb',
                    backgroundColor: seleccionado ? `${metodo.color}10` : 'white', // 10 opacity hex
                    cursor: procesando ? 'not-allowed' : 'pointer',
                    opacity: procesando ? 0.5 : 1,
                    transition: 'all 0.2s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!procesando && !seleccionado) {
                      e.currentTarget.style.borderColor = metodo.color;
                      e.currentTarget.style.backgroundColor = `${metodo.color}05`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!seleccionado) {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ backgroundColor: metodo.color, padding: '1rem', borderRadius: '9999px' }}>
                      <Icon style={{ width: '2rem', height: '2rem', color: 'white' }} />
                    </div>
                    <span style={{ color: '#111827', fontWeight: '500', fontSize: '0.875rem' }}>{metodo.nombre}</span>
                    {seleccionado && (
                      <CheckCircle2 style={{ width: '1.5rem', height: '1.5rem', color: '#3b82f6' }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informando al cajero */}
        {procesando && (
          <div style={{ backgroundColor: '#fef3c7', borderRadius: '0.75rem', padding: '2rem', textAlign: 'center', border: '2px solid #f59e0b' }}>
            <div style={{ display: 'inline-block', width: '4rem', height: '4rem', border: '4px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '9999px', animation: 'spin 1s linear infinite', marginBottom: '1rem' }}></div>
            <h3 style={{ color: '#92400e', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>Informando al cajero...</h3>
            <p style={{ color: '#b45309', margin: 0 }}>Por favor espera un momento</p>
          </div>
        )}

        {/* Botón de confirmación */}
        {metodoSeleccionado && !procesando && (
          <button
            onClick={procesarPago}
            style={{ width: '100%', padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '1.125rem', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
          >
            Confirmar Método de Pago
          </button>
        )}
      </div>
    </div>
  );
}
