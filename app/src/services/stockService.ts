import api from './api';
import { StockItem } from '../types';

// Interface de respuesta del backend
interface StockItemDTO {
    id: number;
    nombre: string;
    cantidadActual: number;
    cantidadMinima: number;
    unidadMedida: string;
    costoUnitario?: number;
}

interface AdjustStockRequest {
    tipo: string; // ENTRADA, SALIDA, AJUSTE
    cantidad: number;
    motivo?: string;
}

// Mapeo de backend a frontend
const mapStockItemDTOToStockItem = (dto: StockItemDTO): StockItem => ({
    id: dto.id.toString(),
    nombre: dto.nombre,
    cantidad: dto.cantidadActual,
    unidad: dto.unidadMedida,
    nivelMinimo: dto.cantidadMinima,
    ultimaActualizacion: new Date().toISOString(),
});

export const stockService = {
    // Obtener todo el stock
    getAll: async (): Promise<StockItem[]> => {
        const response = await api.get<StockItemDTO[]>('/stock');
        return response.data.map(mapStockItemDTOToStockItem);
    },

    // Obtener items con bajo stock
    getLowStock: async (): Promise<StockItem[]> => {
        const response = await api.get<StockItemDTO[]>('/stock/low');
        return response.data.map(mapStockItemDTOToStockItem);
    },

    // Obtener item por ID
    getById: async (id: string): Promise<StockItem> => {
        const response = await api.get<StockItemDTO>(`/stock/${id}`);
        return mapStockItemDTOToStockItem(response.data);
    },

    // Ajustar stock (entrada/salida/ajuste)
    adjustStock: async (id: string, tipo: 'entrada' | 'salida' | 'ajuste', cantidad: number, motivo?: string): Promise<StockItem> => {
        const request: AdjustStockRequest = {
            tipo: tipo.toUpperCase(),
            cantidad,
            motivo,
        };
        const response = await api.post<StockItemDTO>(`/stock/${id}/adjust`, request);
        return mapStockItemDTOToStockItem(response.data);
    },
};
