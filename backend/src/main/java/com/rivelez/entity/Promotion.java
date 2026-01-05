package com.rivelez.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Promoción
 */
@Entity
@Table(name = "promotions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false)
    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "El porcentaje de descuento es obligatorio")
    @Min(value = 1, message = "El descuento debe ser al menos 1%")
    @Max(value = 100, message = "El descuento no puede superar el 100%")
    @Column(nullable = false)
    private Double porcentajeDescuento;

    @NotNull(message = "La fecha de inicio es obligatoria")
    @Column(nullable = false)
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    @Future(message = "La fecha de fin debe ser futura")
    @Column(nullable = false)
    private LocalDateTime fechaFin;

    @Column(nullable = false)
    private boolean activa = true;

    // Productos a los que aplica (si está vacío, aplica a todo el pedido o se
    // maneja por lógica)
    // En este MVP simple, podemos asociar productos específicos.
    @ManyToMany
    @JoinTable(name = "promotion_products", joinColumns = @JoinColumn(name = "promotion_id"), inverseJoinColumns = @JoinColumn(name = "product_id"))
    private List<Product> productos = new ArrayList<>();

    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        return activa && now.isAfter(fechaInicio) && now.isBefore(fechaFin);
    }
}
