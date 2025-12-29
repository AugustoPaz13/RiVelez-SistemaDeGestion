import { useState } from 'react';
import { Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Producto, ItemCarrito } from '../../types/restaurant';

interface MenuDigitalProps {
  productos: Producto[];
  carrito: ItemCarrito[];
  onAgregarAlCarrito: (producto: Producto) => void;
  onRemoverDelCarrito: (productoId: number) => void;
  onIrARevisarPedido: () => void;
  numeroMesa: number;
  onVolverAMesas: () => void;
}

export function MenuDigital({
  productos,
  carrito,
  onAgregarAlCarrito,
  onRemoverDelCarrito,
  onIrARevisarPedido,
  numeroMesa,
  onVolverAMesas,
}: MenuDigitalProps) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todos');

  const categorias = ['Todos', ...Array.from(new Set(productos.map(p => p.categoria)))];

  const productosFiltrados = categoriaSeleccionada === 'Todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrecio = carrito.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);

  const getCantidadEnCarrito = (productoId: number) => {
    const item = carrito.find(i => i.producto.id === productoId);
    return item ? item.cantidad : 0;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e' }}>
      {/* Header fijo */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={onVolverAMesas}
                style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ArrowLeft style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
              </button>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>Menú Digital</h1>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>Mesa {numeroMesa}</p>
              </div>
            </div>

            <button
              onClick={onIrARevisarPedido}
              disabled={carrito.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: carrito.length === 0 ? '#d1d5db' : '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: carrito.length === 0 ? 'not-allowed' : 'pointer',
                position: 'relative',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => { if (carrito.length > 0) e.currentTarget.style.backgroundColor = '#2563eb'; }}
              onMouseLeave={(e) => { if (carrito.length > 0) e.currentTarget.style.backgroundColor = '#3b82f6'; }}
            >
              <ShoppingCart style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Revisar Pedido</span>
              {totalItems > 0 && (
                <span style={{ position: 'absolute', top: '-0.5rem', right: '-0.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '9999px', width: '1.5rem', height: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '600' }}>
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Filtros de categoría */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {categorias.map(categoria => (
              <button
                key={categoria}
                onClick={() => setCategoriaSeleccionada(categoria)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.5rem',
                  whiteSpace: 'nowrap',
                  border: 'none',
                  backgroundColor: categoriaSeleccionada === categoria ? '#3b82f6' : '#f3f4f6',
                  color: categoriaSeleccionada === categoria ? 'white' : '#374151',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (categoriaSeleccionada !== categoria) e.currentTarget.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  if (categoriaSeleccionada !== categoria) e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
              >
                {categoria}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de productos */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {productosFiltrados.map(producto => {
            const cantidad = getCantidadEnCarrito(producto.id);

            return (
              <div
                key={producto.id}
                style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)'}
              >
                <div style={{ height: '12rem', overflow: 'hidden' }}>
                  {producto.imagen ? (
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ height: '100%', background: 'linear-gradient(to bottom right, #dbeafe, #c7d2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#9ca3af' }}>{producto.categoria}</span>
                    </div>
                  )}
                </div>

                <div style={{ padding: '1rem' }}>
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 0.25rem 0' }}>{producto.nombre}</h3>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{producto.descripcion}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: '#3b82f6', fontSize: '1.25rem', fontWeight: '700' }}>${producto.precio.toFixed(2)}</span>

                    {cantidad === 0 ? (
                      <button
                        onClick={() => onAgregarAlCarrito(producto)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.2s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                      >
                        <Plus style={{ width: '1rem', height: '1rem' }} />
                        Agregar
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => onRemoverDelCarrito(producto.id)}
                          style={{ padding: '0.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                        >
                          <Minus style={{ width: '1rem', height: '1rem' }} />
                        </button>
                        <span style={{ color: '#111827', minWidth: '2rem', textAlign: 'center', fontWeight: '600' }}>{cantidad}</span>
                        <button
                          onClick={() => onAgregarAlCarrito(producto)}
                          style={{ padding: '0.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                        >
                          <Plus style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer flotante con total */}
      {carrito.length > 0 && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderTop: '1px solid #e5e7eb', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.1)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
              <p style={{ color: '#111827', fontSize: '1.125rem', fontWeight: '700', margin: 0 }}>Total: ${totalPrecio.toFixed(2)}</p>
            </div>
            <button
              onClick={onIrARevisarPedido}
              style={{ padding: '0.75rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Revisar Pedido
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
