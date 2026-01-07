import api from './api';

export interface ReviewDTO {
    id?: number;
    calificacion: number;
    comentario?: string;
    numeroMesa: number;
    numeroPedido?: string;
    fechaCreacion?: string;
}

export interface ReviewStats {
    promedio: number;
    total: number;
}

export const reviewService = {
    create: async (review: ReviewDTO): Promise<ReviewDTO> => {
        const response = await api.post<ReviewDTO>('/reviews', review);
        return response.data;
    },

    getAll: async (): Promise<ReviewDTO[]> => {
        const response = await api.get<ReviewDTO[]>('/reviews');
        return response.data;
    },

    getRecent: async (limit: number = 10): Promise<ReviewDTO[]> => {
        const response = await api.get<ReviewDTO[]>(`/reviews/recent?limit=${limit}`);
        return response.data;
    },

    getAverage: async (): Promise<ReviewStats> => {
        const response = await api.get<ReviewStats>('/reviews/average');
        return response.data;
    },
};
