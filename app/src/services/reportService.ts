import api from './api';

// Interfaces para respuesta del backend
interface VentaDiaria {
    fecha: string;
    ventas: number;
    pedidos: number;
}

interface ProductoVendido {
    nombre: string;
    cantidad: number;
    ingresos: number;
}

interface UltimaVenta {
    numeroPedido: string;
    numeroMesa: number;
    total: number;
    metodoPago: string;
    fecha: string;
    cantidadItems: number;
}

export interface ReportSummary {
    // KPIs principales
    ventasTotales: number;
    totalPedidos: number;
    ticketPromedio: number;
    ocupacionPromedio: number;

    // Cambios porcentuales
    ventasCambio: number;
    pedidosCambio: number;
    ticketCambio: number;
    ocupacionCambio: number;

    // Datos para gráficos
    ventasPorDia: VentaDiaria[];
    topProductos: ProductoVendido[];
    ultimasVentas: UltimaVenta[];
    metodosPago: Record<string, number>;
}

export const reportService = {
    // Obtener resumen de ventas
    getSummary: async (dias: number = 7): Promise<ReportSummary> => {
        const response = await api.get<ReportSummary>(`/reports/summary?dias=${dias}`);
        return response.data;
    },
};
