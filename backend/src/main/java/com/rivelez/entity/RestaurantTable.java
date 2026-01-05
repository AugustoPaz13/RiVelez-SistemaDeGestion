package com.rivelez.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad Mesa del restaurante
 */
@Entity
@Table(name = "restaurant_tables")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "El número de mesa es obligatorio")
    @Column(unique = true, nullable = false)
    private Integer numero;

    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    @Column(nullable = false)
    private Integer capacidad;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TableStatus estado = TableStatus.AVAILABLE;

    @Column
    private Integer ocupantes;

    @Column(name = "pedido_actual_id")
    private Long pedidoActualId;

    @Column(name = "hora_inicio")
    private LocalDateTime horaInicio;
}
