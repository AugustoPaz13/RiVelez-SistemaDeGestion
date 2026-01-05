package com.rivelez.controller;

import com.rivelez.dto.CreateOrderRequest;
import com.rivelez.dto.OrderDTO;
import com.rivelez.dto.OrderItemRequest;
import com.rivelez.entity.OrderStatus;
import com.rivelez.entity.PaymentMethod;
import com.rivelez.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de pedidos
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Obtener todos los pedidos
     * GET /api/orders
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO')")
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    /**
     * Obtener pedidos activos (no pagados)
     * GET /api/orders/active
     */
    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO', 'COCINERO')")
    public ResponseEntity<List<OrderDTO>> getActiveOrders() {
        return ResponseEntity.ok(orderService.getActiveOrders());
    }

    /**
     * Obtener pedidos pendientes (para cocina)
     * GET /api/orders/pending
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO', 'COCINERO')")
    public ResponseEntity<List<OrderDTO>> getPendingOrders() {
        return ResponseEntity.ok(orderService.getPendingOrders());
    }

    /**
     * Obtener pedido por ID
     * GET /api/orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener pedido por número
     * GET /api/orders/numero/{numeroPedido}
     */
    @GetMapping("/numero/{numeroPedido}")
    public ResponseEntity<OrderDTO> getOrderByNumero(@PathVariable String numeroPedido) {
        try {
            return ResponseEntity.ok(orderService.getOrderByNumero(numeroPedido));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener pedidos por estado
     * GET /api/orders/status/{estado}
     */
    @GetMapping("/status/{estado}")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO', 'COCINERO')")
    public ResponseEntity<List<OrderDTO>> getOrdersByStatus(@PathVariable OrderStatus estado) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(estado));
    }

    /**
     * Obtener pedidos de una mesa
     * GET /api/orders/table/{numeroMesa}
     */
    @GetMapping("/table/{numeroMesa}")
    public ResponseEntity<List<OrderDTO>> getOrdersByTable(@PathVariable Integer numeroMesa) {
        return ResponseEntity.ok(orderService.getOrdersByTable(numeroMesa));
    }

    /**
     * Crear nuevo pedido
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            OrderDTO created = orderService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Agregar items a un pedido
     * POST /api/orders/{id}/items
     */
    @PostMapping("/{id}/items")
    public ResponseEntity<?> addItemsToOrder(
            @PathVariable Long id,
            @Valid @RequestBody List<OrderItemRequest> items) {
        try {
            return ResponseEntity.ok(orderService.addItemsToOrder(id, items));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Actualizar estado del pedido
     * PATCH /api/orders/{id}/status
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO', 'COCINERO')")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            OrderStatus nuevoEstado = OrderStatus.valueOf(body.get("estado"));
            return ResponseEntity.ok(orderService.updateOrderStatus(id, nuevoEstado));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Procesar pago del pedido
     * POST /api/orders/{id}/pay
     */
    @PostMapping("/{id}/pay")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO')")
    public ResponseEntity<?> processPayment(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            PaymentMethod metodoPago = PaymentMethod.valueOf((String) body.get("metodoPago"));
            BigDecimal propina = body.get("propina") != null ? new BigDecimal(body.get("propina").toString()) : null;

            return ResponseEntity.ok(orderService.processPayment(id, metodoPago, propina));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cancelar pedido
     * DELETE /api/orders/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO')")
    public ResponseEntity<?> cancelOrder(@PathVariable Long id) {
        try {
            orderService.cancelOrder(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
