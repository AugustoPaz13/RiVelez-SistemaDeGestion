import api from './api';
import { Table, TableStatus } from '../types';

// Interface de respuesta del backend
interface TableDTO {
    id: number;
    numero: number;
    capacidad: number;
    estado: string;
    ocupantes: number | null;
    pedidoActualId: number | null;
    horaInicio: string | null;
}

// Mapeo de backend a frontend
const mapTableDTOToTable = (dto: TableDTO): Table => {
    // Mapear estado de mayúsculas a minúsculas
    const statusMap: Record<string, TableStatus> = {
        'AVAILABLE': 'disponible',
        'OCCUPIED': 'ocupada',
        'RESERVED': 'reservada',
        'PAGADA': 'pagada',
    };

    return {
        id: dto.numero, // Usamos numero como id ya que el frontend usa number
        numero: dto.numero,
        capacidad: dto.capacidad,
        estado: statusMap[dto.estado] || dto.estado.toLowerCase() as TableStatus,
        ocupantes: dto.ocupantes || 0,
        pedidoActualId: dto.pedidoActualId?.toString(),
        horaInicio: dto.horaInicio || undefined,
    };
};

export const tableService = {
    // Obtener todas las mesas
    getAll: async (): Promise<Table[]> => {
        const response = await api.get<TableDTO[]>('/tables');
        return response.data.map(mapTableDTOToTable);
    },

    // Obtener mesa por número
    getByNumero: async (numero: number): Promise<Table> => {
        const response = await api.get<TableDTO>(`/tables/numero/${numero}`);
        return mapTableDTOToTable(response.data);
    },

    // Obtener mesas por estado
    getByStatus: async (estado: TableStatus): Promise<Table[]> => {
        const response = await api.get<TableDTO[]>(`/tables/estado/${estado.toUpperCase()}`);
        return response.data.map(mapTableDTOToTable);
    },

    // Cambiar estado de mesa
    updateStatus: async (id: number, estado: TableStatus, ocupantes?: number): Promise<Table> => {
        const response = await api.patch<TableDTO>(`/tables/${id}/estado`, {
            estado: estado.toUpperCase(),
            ocupantes,
        });
        return mapTableDTOToTable(response.data);
    },

    // Liberar mesa (Cliente)
    releaseTable: async (id: number): Promise<Table> => {
        const response = await api.post<TableDTO>(`/tables/${id}/release`);
        return mapTableDTOToTable(response.data);
    }
};
