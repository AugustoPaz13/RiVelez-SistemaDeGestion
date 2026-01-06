package com.rivelez.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * DTO para respuesta de reportes
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportSummaryDTO {

    // KPIs principales
    private BigDecimal ventasTotales;
    private Long totalPedidos;
    private BigDecimal ticketPromedio;
    private Double ocupacionPromedio;

    // Comparaciones con período anterior (porcentaje)
    private Double ventasCambio;
    private Double pedidosCambio;
    private Double ticketCambio;
    private Double ocupacionCambio;

    // Datos para gráficos
    private List<VentaDiaria> ventasPorDia;
    private List<ProductoVendido> topProductos;
    private Map<String, Double> metodosPago;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VentaDiaria {
        private String fecha;
        private BigDecimal ventas;
        private Long pedidos;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProductoVendido {
        private String nombre;
        private Long cantidad;
        private BigDecimal ingresos;
    }
}
