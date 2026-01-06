package com.rivelez.service;

import com.rivelez.dto.ReportSummaryDTO;
import com.rivelez.dto.ReportSummaryDTO.VentaDiaria;
import com.rivelez.dto.ReportSummaryDTO.ProductoVendido;
import com.rivelez.entity.CustomerOrder;
import com.rivelez.entity.OrderItem;
import com.rivelez.entity.OrderStatus;
import com.rivelez.entity.PaymentMethod;
import com.rivelez.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Servicio para generación de reportes
 */
@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;

    /**
     * Obtiene resumen de reportes para los últimos N días
     */
    public ReportSummaryDTO getSummary(int dias) {
        LocalDateTime desde = LocalDateTime.now().minusDays(dias).withHour(0).withMinute(0);
        LocalDateTime desdePeriodoAnterior = desde.minusDays(dias);

        // Pedidos del período actual (solo PAGADOS)
        List<CustomerOrder> pedidosActuales = orderRepository.findByFechaCreacionBetween(desde, LocalDateTime.now())
                .stream()
                .filter(o -> o.getEstado() == OrderStatus.PAGADO)
                .collect(Collectors.toList());

        // Pedidos del período anterior para comparación
        List<CustomerOrder> pedidosAnteriores = orderRepository.findByFechaCreacionBetween(desdePeriodoAnterior, desde)
                .stream()
                .filter(o -> o.getEstado() == OrderStatus.PAGADO)
                .collect(Collectors.toList());

        // Calcular KPIs
        BigDecimal ventasTotales = pedidosActuales.stream()
                .map(CustomerOrder::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal ventasAnteriores = pedidosAnteriores.stream()
                .map(CustomerOrder::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalPedidos = pedidosActuales.size();
        long pedidosAnterioresCount = pedidosAnteriores.size();

        BigDecimal ticketPromedio = totalPedidos > 0
                ? ventasTotales.divide(BigDecimal.valueOf(totalPedidos), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal ticketAnterior = pedidosAnterioresCount > 0
                ? ventasAnteriores.divide(BigDecimal.valueOf(pedidosAnterioresCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // Calcular cambios porcentuales
        double ventasCambio = calcularCambioPorcentual(ventasAnteriores, ventasTotales);
        double pedidosCambio = calcularCambioPorcentual(pedidosAnterioresCount, totalPedidos);
        double ticketCambio = calcularCambioPorcentual(ticketAnterior, ticketPromedio);

        // Ventas por día
        List<VentaDiaria> ventasPorDia = calcularVentasPorDia(pedidosActuales, dias);

        // Top productos
        List<ProductoVendido> topProductos = calcularTopProductos(pedidosActuales, 5);

        // Métodos de pago
        Map<String, Double> metodosPago = calcularMetodosPago(pedidosActuales);

        return ReportSummaryDTO.builder()
                .ventasTotales(ventasTotales)
                .totalPedidos(totalPedidos)
                .ticketPromedio(ticketPromedio)
                .ocupacionPromedio(78.0) // Placeholder - requiere tracking de mesas
                .ventasCambio(ventasCambio)
                .pedidosCambio(pedidosCambio)
                .ticketCambio(ticketCambio)
                .ocupacionCambio(5.2) // Placeholder
                .ventasPorDia(ventasPorDia)
                .topProductos(topProductos)
                .metodosPago(metodosPago)
                .build();
    }

    private double calcularCambioPorcentual(BigDecimal anterior, BigDecimal actual) {
        if (anterior.compareTo(BigDecimal.ZERO) == 0) {
            return actual.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return actual.subtract(anterior)
                .divide(anterior, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .doubleValue();
    }

    private double calcularCambioPorcentual(long anterior, long actual) {
        if (anterior == 0) {
            return actual > 0 ? 100.0 : 0.0;
        }
        return ((double) (actual - anterior) / anterior) * 100;
    }

    private List<VentaDiaria> calcularVentasPorDia(List<CustomerOrder> pedidos, int dias) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM");
        Map<LocalDate, List<CustomerOrder>> porDia = pedidos.stream()
                .collect(Collectors.groupingBy(o -> o.getFechaCreacion().toLocalDate()));

        List<VentaDiaria> resultado = new ArrayList<>();
        LocalDate hoy = LocalDate.now();

        for (int i = dias - 1; i >= 0; i--) {
            LocalDate fecha = hoy.minusDays(i);
            List<CustomerOrder> delDia = porDia.getOrDefault(fecha, Collections.emptyList());

            BigDecimal ventas = delDia.stream()
                    .map(CustomerOrder::getTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            resultado.add(VentaDiaria.builder()
                    .fecha(fecha.format(formatter))
                    .ventas(ventas)
                    .pedidos((long) delDia.size())
                    .build());
        }

        return resultado;
    }

    private List<ProductoVendido> calcularTopProductos(List<CustomerOrder> pedidos, int limit) {
        Map<String, Long> cantidades = new HashMap<>();
        Map<String, BigDecimal> ingresos = new HashMap<>();

        for (CustomerOrder pedido : pedidos) {
            for (OrderItem item : pedido.getItems()) {
                String nombre = item.getNombreProducto();
                cantidades.merge(nombre, (long) item.getCantidad(), Long::sum);
                ingresos.merge(nombre, item.getSubtotal(), BigDecimal::add);
            }
        }

        return cantidades.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(limit)
                .map(e -> ProductoVendido.builder()
                        .nombre(e.getKey())
                        .cantidad(e.getValue())
                        .ingresos(ingresos.get(e.getKey()))
                        .build())
                .collect(Collectors.toList());
    }

    private Map<String, Double> calcularMetodosPago(List<CustomerOrder> pedidos) {
        Map<PaymentMethod, Long> conteo = pedidos.stream()
                .filter(o -> o.getMetodoPago() != null)
                .collect(Collectors.groupingBy(CustomerOrder::getMetodoPago, Collectors.counting()));

        long total = conteo.values().stream().mapToLong(Long::longValue).sum();

        Map<String, Double> resultado = new HashMap<>();
        if (total > 0) {
            for (Map.Entry<PaymentMethod, Long> entry : conteo.entrySet()) {
                String nombre = switch (entry.getKey()) {
                    case EFECTIVO -> "Efectivo";
                    case TARJETA_DEBITO -> "Débito";
                    case TARJETA_CREDITO -> "Crédito";
                    case TRANSFERENCIA -> "Transferencia";
                    case QR -> "QR";
                };
                resultado.put(nombre, (entry.getValue() * 100.0) / total);
            }
        }

        return resultado;
    }
}
