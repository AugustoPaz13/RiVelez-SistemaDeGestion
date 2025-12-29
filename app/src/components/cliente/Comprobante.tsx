import { CheckCircle2, Home } from 'lucide-react';
import { ItemCarrito } from '../../types/restaurant';

interface ComprobanteProps {
  numeroMesa: number;
  items: ItemCarrito[];
  total: number;
  metodoPago: string;
  onVolverAlInicio: () => void;
}

export function Comprobante({ numeroMesa, items, total, metodoPago, onVolverAlInicio }: ComprobanteProps) {
  const subtotal = items.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const propina = subtotal * 0.10;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1565c0', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '42rem', width: '100%' }}>
        {/* Mensaje de confirmación */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', backgroundColor: '#dcfce7', borderRadius: '9999px', marginBottom: '1rem' }}>
            <CheckCircle2 style={{ width: '3rem', height: '3rem', color: '#10b981' }} />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#065f46', marginBottom: '0.5rem' }}>¡Pedido Confirmado!</h1>
          <p style={{ color: '#047857', marginBottom: '1rem' }}>
            El mesero ha sido notificado de tu método de pago preferido
          </p>
        </div>

        {/* Detalles del pedido */}
        <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Resumen del Pedido</h2>
            <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Mesa {numeroMesa}</p>
          </div>

          <div style={{ borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb', paddingTop: '1rem', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>Productos ordenados</h3>
            {items.map(item => (
              <div key={item.producto.id} style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
                <div style={{ flex: 1 }}>
                  <span>{item.producto.nombre}</span>
                  <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>x{item.cantidad}</span>
                </div>
                <span style={{ fontWeight: '600' }}>${(item.producto.precio * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
              <span>Propina (10%)</span>
              <span>${propina.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: '700', color: '#111827', paddingTop: '0.5rem', borderTop: '1px solid #e5e7eb' }}>
              <span>Total a Pagar</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ backgroundColor: '#eff6ff', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e40af', margin: 0 }}>Método de Pago Seleccionado</h3>
            <p style={{ color: '#3b82f6', fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>{metodoPago}</p>
            <p style={{ color: '#6b7280', marginTop: '1rem', margin: 0 }}>
              El mesero se acercará a tu mesa para procesar el pago cuando estés listo
            </p>
          </div>
        </div>

        {/* Botón volver */}
        <div style={{ marginTop: '1.5rem' }}>
          <button
            onClick={onVolverAlInicio}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem 1.5rem', backgroundColor: 'white', color: '#3b82f6', borderRadius: '0.75rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
          >
            <Home style={{ width: '1.25rem', height: '1.25rem' }} />
            Volver al Inicio
          </button>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', color: 'white' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '500', margin: 0 }}>¡Gracias por tu pedido!</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.9 }}>Tu comida estará lista en breve</p>
        </div>
      </div>
    </div>
  );
}
