package com.rivelez.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Entidad para items de stock (ingredientes)
 */
@Entity
@Table(name = "stock_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Column(nullable = false, unique = true)
    private String nombre;

    @NotNull(message = "La cantidad actual es obligatoria")
    @Min(value = 0, message = "La cantidad no puede ser negativa")
    @Column(nullable = false)
    private Integer cantidadActual;

    @NotNull(message = "La cantidad mínima es obligatoria")
    @Min(value = 0, message = "La cantidad mínima no puede ser negativa")
    @Column(nullable = false)
    private Integer cantidadMinima;

    @NotBlank(message = "La unidad de medida es obligatoria")
    @Column(nullable = false)
    private String unidadMedida; // kg, litro, unidad, etc.

    @Column(precision = 10, scale = 2)
    private BigDecimal costoUnitario;
}
