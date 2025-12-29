export interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado: 'disponible' | 'ocupada' | 'reservada';
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen?: string;
}

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

export interface Pedido {
  mesa: number;
  items: ItemCarrito[];
  total: number;
  estado: 'pendiente' | 'confirmado' | 'pagado';
  timestamp: number;
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia' | 'qr';
