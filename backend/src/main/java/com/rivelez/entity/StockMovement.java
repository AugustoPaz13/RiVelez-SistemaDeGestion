package com.rivelez.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad para registrar movimientos de stock
 */
@Entity
@Table(name = "stock_movements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_item_id", nullable = false)
    private StockItem item;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StockMovementType tipo;

    @Column(nullable = false)
    private Integer cantidad; // Positivo sumará, negativo restará (según lógica de negocio)

    @Column(columnDefinition = "TEXT")
    private String motivo;

    @Column(nullable = false)
    private LocalDateTime fecha;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User usuario; // Quién realizó el movimiento

    @PrePersist
    protected void onCreate() {
        fecha = LocalDateTime.now();
    }
}
