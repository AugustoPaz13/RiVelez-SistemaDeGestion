package com.rivelez.service;

import com.rivelez.dto.*;
import com.rivelez.entity.*;
import com.rivelez.repository.OrderRepository;
import com.rivelez.repository.ProductRepository;
import com.rivelez.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de pedidos
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final TableRepository tableRepository;

    private static final AtomicLong orderCounter = new AtomicLong(1);

    /**
     * Obtiene todos los pedidos
     */
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene pedidos activos (no pagados)
     */
    public List<OrderDTO> getActiveOrders() {
        return orderRepository.findActiveOrders().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene pedidos pendientes (para cocina)
     */
    public List<OrderDTO> getPendingOrders() {
        return orderRepository.findPendingOrders().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un pedido por ID
     */
    public OrderDTO getOrderById(Long id) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return toDTO(order);
    }

    /**
     * Obtiene un pedido por número
     */
    public OrderDTO getOrderByNumero(String numeroPedido) {
        CustomerOrder order = orderRepository.findByNumeroPedido(numeroPedido)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return toDTO(order);
    }

    /**
     * Obtiene pedidos por estado
     */
    public List<OrderDTO> getOrdersByStatus(OrderStatus estado) {
        return orderRepository.findByEstado(estado).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene pedidos de una mesa
     */
    public List<OrderDTO> getOrdersByTable(Integer numeroMesa) {
        return orderRepository.findByNumeroMesa(numeroMesa).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo pedido
     */
    @Transactional
    public OrderDTO createOrder(CreateOrderRequest request) {
        // Generar número de pedido único
        String numeroPedido = generateOrderNumber();

        CustomerOrder order = CustomerOrder.builder()
                .numeroPedido(numeroPedido)
                .numeroMesa(request.getNumeroMesa())
                .personas(request.getPersonas())
                .estado(OrderStatus.NUEVO)
                .subtotal(BigDecimal.ZERO)
                .total(BigDecimal.ZERO)
                .build();

        // Agregar items
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + itemRequest.getProductoId()));

            OrderItem item = OrderItem.builder()
                    .producto(product)
                    .nombreProducto(product.getNombre())
                    .cantidad(itemRequest.getCantidad())
                    .precioUnitario(product.getPrecio())
                    .observaciones(itemRequest.getObservaciones())
                    .build();

            order.addItem(item);
        }

        order.recalcularTotales();
        CustomerOrder saved = orderRepository.save(order);

        // Actualizar estado de la mesa
        tableRepository.findByNumero(request.getNumeroMesa()).ifPresent(table -> {
            table.setEstado(TableStatus.OCCUPIED);
            table.setPedidoActualId(saved.getId());
            table.setOcupantes(request.getPersonas());
            table.setHoraInicio(LocalDateTime.now());
            tableRepository.save(table);
        });

        return toDTO(saved);
    }

    /**
     * Agrega items a un pedido existente
     */
    @Transactional
    public OrderDTO addItemsToOrder(Long orderId, List<OrderItemRequest> items) {
        CustomerOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (order.getEstado() == OrderStatus.PAGADO) {
            throw new RuntimeException("No se pueden agregar items a un pedido pagado");
        }

        for (OrderItemRequest itemRequest : items) {
            Product product = productRepository.findById(itemRequest.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            OrderItem item = OrderItem.builder()
                    .producto(product)
                    .nombreProducto(product.getNombre())
                    .cantidad(itemRequest.getCantidad())
                    .precioUnitario(product.getPrecio())
                    .observaciones(itemRequest.getObservaciones())
                    .build();

            order.addItem(item);
        }

        order.recalcularTotales();
        return toDTO(orderRepository.save(order));
    }

    /**
     * Actualiza el estado de un pedido
     */
    @Transactional
    public OrderDTO updateOrderStatus(Long id, OrderStatus nuevoEstado) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        order.setEstado(nuevoEstado);

        // Si el pedido se paga, liberar la mesa
        if (nuevoEstado == OrderStatus.PAGADO) {
            tableRepository.findByNumero(order.getNumeroMesa()).ifPresent(table -> {
                table.setEstado(TableStatus.AVAILABLE);
                table.setPedidoActualId(null);
                table.setOcupantes(null);
                table.setHoraInicio(null);
                tableRepository.save(table);
            });
        }

        return toDTO(orderRepository.save(order));
    }

    /**
     * Procesa el pago de un pedido
     */
    @Transactional
    public OrderDTO processPayment(Long id, PaymentMethod metodoPago, BigDecimal propina) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        order.setMetodoPago(metodoPago);
        if (propina != null) {
            order.setPropina(propina);
        }
        order.recalcularTotales();
        order.setEstado(OrderStatus.PAGADO);

        // Liberar la mesa
        tableRepository.findByNumero(order.getNumeroMesa()).ifPresent(table -> {
            table.setEstado(TableStatus.AVAILABLE);
            table.setPedidoActualId(null);
            table.setOcupantes(null);
            table.setHoraInicio(null);
            tableRepository.save(table);
        });

        return toDTO(orderRepository.save(order));
    }

    /**
     * Cancela un pedido
     */
    @Transactional
    public void cancelOrder(Long id) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (order.getEstado() == OrderStatus.PAGADO) {
            throw new RuntimeException("No se puede cancelar un pedido pagado");
        }

        // Liberar la mesa
        tableRepository.findByNumero(order.getNumeroMesa()).ifPresent(table -> {
            table.setEstado(TableStatus.AVAILABLE);
            table.setPedidoActualId(null);
            table.setOcupantes(null);
            table.setHoraInicio(null);
            tableRepository.save(table);
        });

        orderRepository.delete(order);
    }

    /**
     * Genera un número de pedido único
     */
    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long counter = orderCounter.getAndIncrement();
        return String.format("PED-%s-%04d", date, counter);
    }

    /**
     * Convierte entidad a DTO
     */
    private OrderDTO toDTO(CustomerOrder order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
                .map(item -> OrderItemDTO.builder()
                        .id(item.getId())
                        .productoId(item.getProducto() != null ? item.getProducto().getId() : null)
                        .nombreProducto(item.getNombreProducto())
                        .cantidad(item.getCantidad())
                        .precioUnitario(item.getPrecioUnitario())
                        .subtotal(item.getSubtotal())
                        .observaciones(item.getObservaciones())
                        .build())
                .collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .numeroPedido(order.getNumeroPedido())
                .numeroMesa(order.getNumeroMesa())
                .personas(order.getPersonas())
                .estado(order.getEstado())
                .items(itemDTOs)
                .subtotal(order.getSubtotal())
                .propina(order.getPropina())
                .total(order.getTotal())
                .metodoPago(order.getMetodoPago())
                .fechaCreacion(order.getFechaCreacion())
                .fechaActualizacion(order.getFechaActualizacion())
                .build();
    }
}
