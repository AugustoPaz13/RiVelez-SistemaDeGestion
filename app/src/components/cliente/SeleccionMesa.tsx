import { Users, RefreshCw } from 'lucide-react';
import { Mesa } from '../../types/restaurant.types';

interface SeleccionMesaProps {
  mesas: Mesa[];
  onSeleccionarMesa: (numeroMesa: number) => void;
  onActualizar: () => void;
}

export function SeleccionMesa({ mesas, onSeleccionarMesa, onActualizar }: SeleccionMesaProps) {
  const mesasDisponibles = mesas.filter(m => m.estado === 'disponible');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e5d9e', padding: '1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
          padding: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>
                Bienvenido al restaurante RiVélez
              </h1>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Selecciona una mesa disponible para comenzar
              </p>
            </div>
            <button
              onClick={onActualizar}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              <RefreshCw style={{ width: '1rem', height: '1rem' }} />
              Actualizar
            </button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: '#10b981', borderRadius: '0.25rem' }}></div>
              <span style={{ color: '#374151', fontSize: '0.875rem' }}>{mesasDisponibles.length} Disponibles</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: '#ef4444', borderRadius: '0.25rem' }}></div>
              <span style={{ color: '#374151', fontSize: '0.875rem' }}>{mesas.filter(m => m.estado === 'ocupada').length} Ocupadas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: '#8b5cf6', borderRadius: '0.25rem' }}></div>
              <span style={{ color: '#374151', fontSize: '0.875rem' }}>{mesas.filter(m => m.estado === 'pagada').length} Pagadas</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: '#f59e0b', borderRadius: '0.25rem' }}></div>
              <span style={{ color: '#374151', fontSize: '0.875rem' }}>{mesas.filter(m => m.estado === 'reservada').length} Reservadas</span>
            </div>
          </div>
        </div>

        {/* Mensaje si no hay mesas disponibles */}
        {mesasDisponibles.length === 0 && (
          <div style={{
            backgroundColor: '#fef3c7',
            border: '2px solid #fbbf24',
            borderRadius: '1rem',
            padding: '2rem',
            textAlign: 'center' as const
          }}>
            <h2 style={{ color: '#92400e', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '600' }}>
              No hay mesas disponibles
            </h2>
            <p style={{ color: '#b45309', marginBottom: '1rem' }}>
              Por favor, espera un momento mientras se libera una mesa
            </p>
            <button
              onClick={onActualizar}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#d97706',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Volver a consultar
            </button>
          </div>
        )}

        {/* Grid de mesas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {mesas.map((mesa) => {
            const isDisponible = mesa.estado === 'disponible';
            const isPagada = mesa.estado === 'pagada';
            const bgColor = isDisponible ? '#ffffff' : isPagada ? '#f3e8ff' : mesa.estado === 'ocupada' ? '#dbeafe' : '#fef3c7';
            const borderColor = isDisponible ? '#10b981' : isPagada ? '#a78bfa' : '#d1d5db';

            return (
              <button
                key={mesa.id}
                onClick={() => isDisponible && onSeleccionarMesa(mesa.numero)}
                disabled={!isDisponible}
                style={{
                  backgroundColor: bgColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '0.75rem',
                  padding: '1.5rem',
                  cursor: isDisponible ? 'pointer' : 'not-allowed',
                  opacity: isDisponible ? 1 : 0.6,
                  boxShadow: isDisponible ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (isDisponible) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = isDisponible ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none';
                }}
              >
                <div style={{ textAlign: 'center' as const, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ color: '#374151', fontSize: '0.875rem' }}>Mesa</div>
                  <div style={{ color: '#111827', fontSize: '1.875rem', fontWeight: '700' }}>{mesa.numero}</div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#6b7280' }}>
                    <Users style={{ width: '1rem', height: '1rem' }} />
                    <span style={{ fontSize: '0.875rem' }}>{mesa.capacidad} personas</span>
                  </div>

                  <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    color: 'white',
                    backgroundColor: mesa.estado === 'disponible' ? '#10b981' : mesa.estado === 'ocupada' ? '#ef4444' : mesa.estado === 'pagada' ? '#8b5cf6' : '#f59e0b',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {mesa.estado === 'disponible' ? 'Disponible' :
                      mesa.estado === 'ocupada' ? 'Ocupada' :
                        mesa.estado === 'pagada' ? 'Pagada' :
                          'Reservada'}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
