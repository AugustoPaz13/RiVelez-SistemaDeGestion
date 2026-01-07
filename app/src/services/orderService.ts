import api from './api';
import { Order, OrderStatus, PaymentMethod } from '../types';

// Interfaces del backend
interface OrderItemDTO {
    id: number;
    productoId: number;
    nombreProducto: string;
    imagenProducto?: string;
    categoriaProducto?: string; // Para filtrar bebidas en cocina
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    observaciones?: string;
}

interface OrderDTO {
    id: number;
    numeroPedido: string;
    numeroMesa: number;
    personas: number;
    estado: string;
    items: OrderItemDTO[];
    subtotal: number;
    propina: number | null;
    total: number;
    metodoPago: string | null;
    listoParaPagar: boolean | null;
    metodoPagoSolicitado: string | null;
    fechaCreacion: string;
    fechaActualizacion: string;
}



// Mapeo de backend a frontend
const mapOrderDTOToOrder = (dto: OrderDTO): Order => ({
    id: dto.id.toString(),
    numeroPedido: dto.numeroPedido,
    numeroMesa: dto.numeroMesa,
    personas: dto.personas,
    estado: dto.estado as OrderStatus,
    items: dto.items.map(item => ({
        id: item.id.toString(),
        productoId: item.productoId.toString(),
        nombre: item.nombreProducto,
        imagen: item.imagenProducto,
        categoria: item.categoriaProducto, // Añadido para filtrar
        cantidad: item.cantidad,
        precio: item.precioUnitario,
        observaciones: item.observaciones,
    })),
    hora: dto.fechaCreacion ? new Date(dto.fechaCreacion).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : '',
    subtotal: dto.subtotal,
    propina: dto.propina || 0,
    total: dto.total,
    metodoPago: dto.metodoPago as PaymentMethod | undefined,
    listoParaPagar: dto.listoParaPagar ?? undefined,
    metodoPagoSolicitado: dto.metodoPagoSolicitado as PaymentMethod | undefined,
    fechaCreacion: dto.fechaCreacion,
});

export const orderService = {
    // Obtener todos los pedidos
    getAll: async (): Promise<Order[]> => {
        const response = await api.get<OrderDTO[]>('/orders');
        return response.data.map(mapOrderDTOToOrder);
    },

    // Obtener pedidos activos (no pagados)
    getActive: async (): Promise<Order[]> => {
        const response = await api.get<OrderDTO[]>('/orders/active');
        return response.data.map(mapOrderDTOToOrder);
    },

    // Obtener pedidos pendientes (para cocina)
    getPending: async (): Promise<Order[]> => {
        const response = await api.get<OrderDTO[]>('/orders/pending');
        return response.data.map(mapOrderDTOToOrder);
    },

    // Obtener pedido por ID
    getById: async (id: string): Promise<Order> => {
        const response = await api.get<OrderDTO>(`/orders/${id}`);
        return mapOrderDTOToOrder(response.data);
    },

    // Obtener pedidos de una mesa
    getByTable: async (numeroMesa: number): Promise<Order[]> => {
        const response = await api.get<OrderDTO[]>(`/orders/table/${numeroMesa}`);
        return response.data.map(mapOrderDTOToOrder);
    },

    // Obtener pedidos por estado
    getByStatus: async (estado: OrderStatus): Promise<Order[]> => {
        const response = await api.get<OrderDTO[]>(`/orders/status/${estado.toUpperCase().replace('-', '_')}`);
        return response.data.map(mapOrderDTOToOrder);
    },

    // Crear nuevo pedido
    create: async (data: { numeroMesa: number; personas: number; items: { productoId: number; cantidad: number; observaciones?: string }[] }): Promise<Order> => {
        const response = await api.post<OrderDTO>('/orders', data);
        return mapOrderDTOToOrder(response.data);
    },

    // Agregar items a pedido existente
    addItems: async (orderId: string, items: { productoId: string; cantidad: number; observaciones?: string }[]): Promise<Order> => {
        const response = await api.post<OrderDTO>(`/orders/${orderId}/items`, items.map(i => ({
            productoId: parseInt(i.productoId),
            cantidad: i.cantidad,
            observaciones: i.observaciones,
        })));
        return mapOrderDTOToOrder(response.data);
    },

    // Actualizar estado del pedido
    updateStatus: async (id: string, estado: OrderStatus): Promise<Order> => {
        const response = await api.patch<OrderDTO>(`/orders/${id}/status`, {
            estado: estado.toUpperCase().replace('-', '_'),
        });
        return mapOrderDTOToOrder(response.data);
    },

    // Procesar pago
    processPayment: async (id: string, metodoPago: PaymentMethod, propina?: number): Promise<Order> => {
        const response = await api.post<OrderDTO>(`/orders/${id}/pay`, {
            metodoPago: metodoPago.toUpperCase().replace('-', '_'),
            propina,
        });
        return mapOrderDTOToOrder(response.data);
    },

    // Marcar como listo para pagar (cliente eligió método de pago)
    markReadyToPay: async (id: string, metodoPago: string): Promise<Order> => {
        // Mapear nombres de métodos del frontend a enum del backend
        const metodoPagoMap: Record<string, string> = {
            'Efectivo': 'EFECTIVO',
            'Tarjeta': 'TARJETA_CREDITO',
            'Transferencia': 'TRANSFERENCIA',
            'Código QR': 'QR',
        };
        const response = await api.post<OrderDTO>(`/orders/${id}/ready-to-pay`, {
            metodoPago: metodoPagoMap[metodoPago] || 'OTRO',
        });
        return mapOrderDTOToOrder(response.data);
    },

    // Cancelar pedido
    cancel: async (id: string): Promise<void> => {
        await api.delete(`/orders/${id}`);
    },

    // Descartar pedido (Cocina)
    dismiss: async (id: string): Promise<void> => {
        await api.delete(`/orders/${id}/dismiss`);
    },
};
