package com.rivelez.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Pedido del cliente
 */
@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_pedido", unique = true, nullable = false)
    private String numeroPedido;

    @Column(name = "numero_mesa", nullable = false)
    private Integer numeroMesa;

    @Column(nullable = false)
    private Integer personas;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus estado = OrderStatus.NUEVO;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal propina;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pago")
    private PaymentMethod metodoPago;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime fechaActualizacion;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        fechaActualizacion = fechaCreacion;
        if (numeroPedido == null) {
            // Generar número de pedido temporal (se reemplaza en el servicio)
            numeroPedido = "PED-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }

    /**
     * Agrega un item al pedido
     */
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
        recalcularTotales();
    }

    /**
     * Elimina un item del pedido
     */
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
        recalcularTotales();
    }

    /**
     * Recalcula subtotal y total
     */
    public void recalcularTotales() {
        this.subtotal = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.total = this.subtotal;
        if (this.propina != null) {
            this.total = this.total.add(this.propina);
        }
    }
}
