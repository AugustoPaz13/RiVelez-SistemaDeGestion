// Types for Cliente module
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
    imagen: string;
}

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

export type MetodoPago = 'efectivo' | 'tarjeta' | 'transferencia';
