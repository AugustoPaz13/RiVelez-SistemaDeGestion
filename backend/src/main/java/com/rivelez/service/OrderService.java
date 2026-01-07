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
import jakarta.annotation.PostConstruct;

/**
 * Servicio para gestión de pedidos
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final TableRepository tableRepository;

    private final com.rivelez.repository.StockItemRepository stockItemRepository;
    private final com.rivelez.repository.StockMovementRepository stockMovementRepository;

    private static final AtomicLong orderCounter = new AtomicLong(1);

    @PostConstruct
    public void initOrderCounter() {
        orderRepository.findTopByOrderByIdDesc().ifPresent(order -> {
            String numero = order.getNumeroPedido();
            if (numero != null && numero.startsWith("PED-")) {
                try {
                    // Formato PED-yyyyMMdd-XXXX
                    String[] parts = numero.split("-");
                    if (parts.length == 3) {
                        String datePart = parts[1];
                        String dateNow = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

                        if (datePart.equals(dateNow)) {
                            long lastSeq = Long.parseLong(parts[2]);
                            orderCounter.set(lastSeq + 1);
                            System.out.println("Contador de pedidos sincronizado desde BD: Siguiente=" + (lastSeq + 1));
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error sincronizando contador de pedidos: " + e.getMessage());
                }
            }
        });
    }

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

        // Agregar items y verificar si son solo bebidas
        boolean soloBebidasFlag = true;

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

            // Verificar si el producto NO es bebida/alcohol
            if (product.getCategoria() != ProductCategory.BEBIDA &&
                    product.getCategoria() != ProductCategory.ALCOHOL) {
                soloBebidasFlag = false;
            }
        }

        order.recalcularTotales();

        // Si el pedido contiene SOLO bebidas, va directo a LISTO (no pasa por cocina)
        if (soloBebidasFlag) {
            order.setEstado(OrderStatus.LISTO);
            System.out.println("Pedido #" + numeroPedido + " contiene solo bebidas - Estado: LISTO (no va a cocina)");
        }

        CustomerOrder savedOrder = orderRepository.save(order);

        // Actualizar stock (Consumo)
        updateStock(savedOrder, true);

        // Actualizar estado de la mesa
        tableRepository.findByNumero(request.getNumeroMesa()).ifPresent(table -> {
            table.setEstado(TableStatus.OCCUPIED);
            table.setPedidoActualId(savedOrder.getId());
            table.setOcupantes(request.getPersonas());
            table.setHoraInicio(LocalDateTime.now());
            tableRepository.save(table);
        });

        return toDTO(savedOrder);
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

        // Lógica de descuento de stock movida a createOrder
        // if (nuevoEstado == OrderStatus.EN_PREPARACION && order.getEstado() !=
        // OrderStatus.EN_PREPARACION) {
        // deductStockForOrder(order);
        // }

        order.setEstado(nuevoEstado);

        // Si el pedido se paga, NO liberar la mesa automáticamente
        // La mesa se libera explícitamente por el cliente o mozo
        /*
         * if (nuevoEstado == OrderStatus.PAGADO) {
         * tableRepository.findByNumero(order.getNumeroMesa()).ifPresent(table -> {
         * table.setEstado(TableStatus.AVAILABLE);
         * table.setPedidoActualId(null);
         * table.setOcupantes(null);
         * table.setHoraInicio(null);
         * tableRepository.save(table);
         * });
         * }
         */

        return toDTO(orderRepository.save(order));
    }

    /**
     * Procesa el pago de un pedido
     */
    @Transactional
    public OrderDTO processPayment(Long id, PaymentMethod metodoPago, BigDecimal propina) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Validar que el pedido esté listo o entregado antes de procesar pago
        if (order.getEstado() != OrderStatus.LISTO && order.getEstado() != OrderStatus.ENTREGADO) {
            throw new RuntimeException("El pedido debe estar listo o entregado para procesar el pago. Estado actual: "
                    + order.getEstado());
        }

        order.setMetodoPago(metodoPago);
        if (propina != null) {
            order.setPropina(propina);
        }
        order.recalcularTotales();
        order.setEstado(OrderStatus.PAGADO);

        // Actualizar estado de la mesa a PAGADA para indicar que ya pagaron pero no se
        // han ido
        tableRepository.findByNumero(order.getNumeroMesa()).ifPresent(table -> {
            table.setEstado(TableStatus.PAGADA);
            tableRepository.save(table);
        });

        return toDTO(orderRepository.save(order));
    }

    /**
     * Marca un pedido como listo para pagar (cliente eligió método de pago)
     */
    @Transactional
    public OrderDTO markReadyToPay(Long id, PaymentMethod metodoPago) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        order.setListoParaPagar(true);
        order.setMetodoPagoSolicitado(metodoPago);

        return toDTO(orderRepository.save(order));
    }

    /**
     * Cancela un pedido
     */
    @Transactional
    public void cancelOrder(Long id) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        if (!canBeCancelled(order)) {
            throw new RuntimeException("El pedido no puede ser cancelado en este estado");
        }

        order.setEstado(OrderStatus.CANCELADO);

        // Restaurar stock
        updateStock(order, false);

        orderRepository.save(order);
    }

    /**
     * Elimina definitivamente un pedido cancelado (Dismiss desde cocina)
     */
    @Transactional
    public void dismissCancellation(Long id) {
        CustomerOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        // Solo permitir borrar si está cancelado (u otros estados finales si se
        // requiere limpieza)
        if (order.getEstado() != OrderStatus.CANCELADO) {
            throw new RuntimeException("Solo se pueden descartar pedidos cancelados");
        }

        // Aquí si liberamos recursos si fuera necesario, pero la mesa sigue ocupada por
        // el cliente
        // hasta que decida irse. Si el cliente ya se fue, el mozo libera la mesa.

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
                        .imagenProducto(item.getProducto() != null ? item.getProducto().getImagen() : null)
                        .categoriaProducto(
                                item.getProducto() != null ? item.getProducto().getCategoria().toValue() : null)
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
                .listoParaPagar(order.getListoParaPagar())
                .metodoPagoSolicitado(order.getMetodoPagoSolicitado())
                .fechaCreacion(order.getFechaCreacion())
                .fechaActualizacion(order.getFechaActualizacion())
                .build();
    }

    private boolean canBeCancelled(CustomerOrder order) {
        // Solo se puede cancelar si no está PAGADO, NI ENTREGADO
        // Y si han pasado < 2 minutos (validado en frontend, aquí validamos estado)
        // Opcional: Validar tiempo del servidor

        return order.getEstado() != OrderStatus.PAGADO &&
                order.getEstado() != OrderStatus.ENTREGADO &&
                order.getEstado() != OrderStatus.CANCELADO;
    }

    private void updateStock(CustomerOrder order, boolean consume) {
        for (OrderItem item : order.getItems()) {
            Product product = item.getProducto();
            if (product == null)
                continue;

            String ingredientesJson = product.getIngredientes();
            if (ingredientesJson == null || ingredientesJson.isBlank()) {
                // Fallback: intentar buscar por nombre del producto
                stockItemRepository.findByNombre(product.getNombre()).ifPresent(stockItem -> {
                    deductOrRestoreStock(stockItem, item.getCantidad(), consume, order.getNumeroPedido());
                });
                continue;
            }

            // Parsear ingredientes JSON: [{"nombre":"Lomo","cantidad":1},...]
            try {
                // Usamos un parsing simple sin dependencias externas
                String cleaned = ingredientesJson.trim();
                if (cleaned.startsWith("[") && cleaned.endsWith("]")) {
                    cleaned = cleaned.substring(1, cleaned.length() - 1);
                }

                // Split por objetos JSON
                String[] ingredientes = cleaned.split("\\},\\s*\\{");

                for (String ingrediente : ingredientes) {
                    // Limpiar y parsear cada ingrediente
                    ingrediente = ingrediente.replace("{", "").replace("}", "").replace("\"", "");

                    String nombreIngrediente = null;
                    int cantidadIngrediente = 1;

                    String[] props = ingrediente.split(",");
                    for (String prop : props) {
                        String[] kv = prop.split(":");
                        if (kv.length == 2) {
                            String key = kv[0].trim();
                            String value = kv[1].trim();
                            if (key.equals("nombre")) {
                                nombreIngrediente = value;
                            } else if (key.equals("cantidad")) {
                                try {
                                    cantidadIngrediente = Integer.parseInt(value);
                                } catch (NumberFormatException e) {
                                    cantidadIngrediente = 1;
                                }
                            }
                        }
                    }

                    if (nombreIngrediente != null) {
                        final String finalNombre = nombreIngrediente;
                        final int finalCantidad = cantidadIngrediente * item.getCantidad();

                        stockItemRepository.findByNombre(finalNombre).ifPresent(stockItem -> {
                            deductOrRestoreStock(stockItem, finalCantidad, consume, order.getNumeroPedido());
                        });
                    }
                }
            } catch (Exception e) {
                System.err.println(
                        "Error parseando ingredientes para producto " + product.getNombre() + ": " + e.getMessage());
            }
        }
    }

    private void deductOrRestoreStock(StockItem stockItem, int cantidad, boolean consume, String numeroPedido) {
        int nuevaCantidad;
        StockMovementType tipo;
        String motivo;

        if (consume) {
            nuevaCantidad = stockItem.getCantidadActual() - cantidad;
            tipo = StockMovementType.SALIDA;
            motivo = "Venta Pedido #" + numeroPedido;
            if (nuevaCantidad < 0) {
                System.out.println("ADVERTENCIA: Stock negativo para " + stockItem.getNombre());
            }
        } else {
            nuevaCantidad = stockItem.getCantidadActual() + cantidad;
            tipo = StockMovementType.ENTRADA;
            motivo = "Restauración (Cancelación) Pedido #" + numeroPedido;
        }

        stockItem.setCantidadActual(nuevaCantidad);
        stockItemRepository.save(stockItem);

        StockMovement movement = StockMovement.builder()
                .item(stockItem)
                .tipo(tipo)
                .cantidad(cantidad)
                .motivo(motivo)
                .fecha(LocalDateTime.now())
                .build();

        stockMovementRepository.save(movement);
    }
}
