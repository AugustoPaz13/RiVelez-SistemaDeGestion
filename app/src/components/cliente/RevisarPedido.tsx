import { ArrowLeft, Trash2, Plus, Minus, Send } from 'lucide-react';
import { ItemCarrito } from '../../types/restaurant';

interface RevisarPedidoProps {
  carrito: ItemCarrito[];
  numeroMesa: number;
  onVolverAlMenu: () => void;
  onConfirmarPedido: () => void;
  onAgregarCantidad: (productoId: number) => void;
  onRemoverCantidad: (productoId: number) => void;
  onEliminarItem: (productoId: number) => void;
}

export function RevisarPedido({
  carrito,
  numeroMesa,
  onVolverAlMenu,
  onConfirmarPedido,
  onAgregarCantidad,
  onRemoverCantidad,
  onEliminarItem,
}: RevisarPedidoProps) {
  const subtotal = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  const propina = subtotal * 0.10;
  const total = subtotal + propina;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={onVolverAlMenu}
              style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
            </button>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Revisar Pedido</h1>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Mesa {numeroMesa}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Lista de items */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>Tu Pedido</h2>

          {carrito.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              <p style={{ margin: '0 0 1rem 0' }}>No hay productos en tu pedido</p>
              <button
                onClick={onVolverAlMenu}
                style={{ padding: '0.5rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
              >
                Volver al Menú
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {carrito.map(item => (
                <div
                  key={item.producto.id}
                  style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}
                >
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.25rem 0' }}>{item.producto.nombre}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>{item.producto.descripcion}</p>
                    <p style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>${item.producto.precio.toFixed(2)} c/u</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.25rem' }}>
                      <button
                        onClick={() => onRemoverCantidad(item.producto.id)}
                        style={{ padding: '0.25rem', borderRadius: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Minus style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      </button>
                      <span style={{ color: '#111827', fontWeight: '600', minWidth: '2rem', textAlign: 'center' }}>{item.cantidad}</span>
                      <button
                        onClick={() => onAgregarCantidad(item.producto.id)}
                        style={{ padding: '0.25rem', borderRadius: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Plus style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                      </button>
                    </div>

                    <div style={{ color: '#111827', fontWeight: '700', minWidth: '5rem', textAlign: 'right' }}>
                      ${(item.producto.precio * item.cantidad).toFixed(2)}
                    </div>

                    <button
                      onClick={() => onEliminarItem(item.producto.id)}
                      style={{ padding: '0.5rem', color: '#ef4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'transform 0.2s' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Trash2 style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Resumen */}
        {carrito.length > 0 && (
          <>
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827', margin: 0 }}>Resumen</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#374151' }}>
                  <span>Propina sugerida (10%)</span>
                  <span>${propina.toFixed(2)}</span>
                </div>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: '700', color: '#111827' }}>
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Botón confirmar */}
            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
              <button
                onClick={onConfirmarPedido}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem 1.5rem', backgroundColor: '#10b981', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
              >
                <Send style={{ width: '1.25rem', height: '1.25rem' }} />
                Confirmar y Enviar Pedido a la Cocina
              </button>
              <p style={{ color: '#6b7280', textAlign: 'center', marginTop: '0.75rem', fontSize: '0.875rem' }}>
                Al confirmar, tu pedido será enviado a la cocina para su preparación
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
