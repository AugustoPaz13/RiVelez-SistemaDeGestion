// Tipos de negocio del restaurante

// Estados de mesa
export type TableStatus = 'disponible' | 'ocupada' | 'reservada' | 'pagada';

// Estados de pedido
export type OrderStatus = 'nuevo' | 'recibido' | 'en-preparacion' | 'listo' | 'entregado' | 'pagado' | 'retrasado' | 'cancelado';

// Métodos de pago
export type PaymentMethod = 'efectivo' | 'tarjeta-debito' | 'tarjeta-credito' | 'transferencia' | 'qr';

// Categorías de productos
export type ProductCategory = 'entrada' | 'principal' | 'postre' | 'bebida' | 'alcohol';

// Item del pedido
export interface OrderItem {
    id: string;
    productoId: string;
    nombre: string;
    imagen?: string;
    cantidad: number;
    precio: number;
    observaciones?: string;
}

// Pedido completo
export interface Order {
    id: string;
    numeroMesa: number;
    numeroPedido: string;
    items: OrderItem[];
    estado: OrderStatus;
    hora: string;
    personas: number;
    subtotal: number;
    propina?: number;
    total: number;
    metodoPago?: PaymentMethod;
    listoParaPagar?: boolean;
    metodoPagoSolicitado?: PaymentMethod;
    fechaCreacion: string;
}

// Mesa
export type Mesa = Table;
export interface Table {
    id: number;
    numero: number;
    capacidad: number;
    estado: TableStatus;
    ocupantes?: number;
    pedidoActualId?: string;
    horaInicio?: string;
}

// Producto del menú
export interface Product {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: ProductCategory;
    disponible: boolean;
    imagen?: string;
    ingredientes?: string[];
}

// Item del carrito (para cliente)
export interface CartItem {
    producto: Product;
    cantidad: number;
}

// Stock/Inventario
export interface StockItem {
    id: string;
    nombre: string;
    cantidad: number;
    unidad: string; // kg, litros, unidades, etc
    nivelMinimo: number;
    ultimaActualizacion: string;
}

// Movimiento de stock
export interface StockMovement {
    id: string;
    itemId: string;
    tipo: 'entrada' | 'salida' | 'ajuste';
    cantidad: number;
    motivo: string;
    usuario: string;
    fecha: string;
}

// Promoción
export interface Promotion {
    id: string;
    nombre: string;
    descripcion: string;
    tipo: 'porcentaje' | 'fijo' | '2x1' | 'combo';
    valor: number;
    alcance: 'producto' | 'categoria' | 'todo';
    productosAplicables?: string[];
    condiciones?: {
        diasSemana?: number[]; // 0=domingo, 1=lunes, etc
        horarioInicio?: string;
        horarioFin?: string;
        medioPago?: PaymentMethod;
    };
    vigenciaInicio: string;
    vigenciaFin: string;
    activa: boolean;
}

// Tipos para reportes
export interface SalesReport {
    fecha: string;
    ventaTotal: number;
    pedidosCompletados: number;
    ticketPromedio: number;
}

export interface ProductSalesReport {
    productoId: string;
    nombre: string;
    cantidadVendida: number;
    ingresoTotal: number;
}

export interface PaymentMethodReport {
    metodo: PaymentMethod;
    cantidad: number;
    total: number;
    porcentaje: number;
}
