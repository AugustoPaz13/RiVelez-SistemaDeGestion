import api from './api';

// Interfaz local de Promotion (frontend)
interface Promotion {
    id: string;
    nombre: string;
    tipo: 'porcentaje' | 'fijo' | '2x1' | 'combo';
    valor: number;
    alcance: 'producto' | 'categoria' | 'todo';
    productoId?: string;
    categoriaId?: string;
    fechaInicio: string;
    fechaFin: string;
    activo: boolean;
    diasSemana?: number[];
    horaInicio?: string;
    horaFin?: string;
}

// Interfaz del backend
interface PromotionDTO {
    id: number;
    nombre: string;
    description?: string;
    porcentajeDescuento: number;
    fechaInicio: string;
    fechaFin: string;
    activa: boolean;
    productoIds?: number[];
    productoNombres?: string[];
}

// Mapeo de backend a frontend
const mapPromotionDTOToPromotion = (dto: PromotionDTO): Promotion => ({
    id: dto.id.toString(),
    nombre: dto.nombre,
    tipo: 'porcentaje', // El backend solo soporta porcentaje por ahora
    valor: dto.porcentajeDescuento,
    alcance: dto.productoIds && dto.productoIds.length > 0 ? 'producto' : 'todo',
    fechaInicio: dto.fechaInicio ? dto.fechaInicio.split('T')[0] : '',
    fechaFin: dto.fechaFin ? dto.fechaFin.split('T')[0] : '',
    activo: dto.activa,
});

export const promotionService = {
    // Obtener todas las promociones
    getAll: async (): Promise<Promotion[]> => {
        const response = await api.get<PromotionDTO[]>('/promotions');
        return response.data.map(mapPromotionDTOToPromotion);
    },

    // Obtener promociones activas
    getActive: async (): Promise<Promotion[]> => {
        const response = await api.get<PromotionDTO[]>('/promotions/active');
        return response.data.map(mapPromotionDTOToPromotion);
    },

    // Obtener promoción por ID
    getById: async (id: string): Promise<Promotion> => {
        const response = await api.get<PromotionDTO>(`/promotions/${id}`);
        return mapPromotionDTOToPromotion(response.data);
    },

    // Crear promoción
    create: async (promotion: Partial<Promotion>): Promise<Promotion> => {
        const request = {
            nombre: promotion.nombre,
            description: '',
            porcentajeDescuento: promotion.valor,
            fechaInicio: promotion.fechaInicio,
            fechaFin: promotion.fechaFin,
            activa: promotion.activo ?? true,
            productoIds: [],
        };
        const response = await api.post<PromotionDTO>('/promotions', request);
        return mapPromotionDTOToPromotion(response.data);
    },

    // Activar/Desactivar
    toggle: async (id: string): Promise<Promotion> => {
        const response = await api.patch<PromotionDTO>(`/promotions/${id}/toggle`);
        return mapPromotionDTOToPromotion(response.data);
    },

    // Eliminar
    delete: async (id: string): Promise<void> => {
        await api.delete(`/promotions/${id}`);
    },
};
