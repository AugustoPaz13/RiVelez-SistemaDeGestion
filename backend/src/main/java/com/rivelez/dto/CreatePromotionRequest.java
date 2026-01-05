package com.rivelez.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePromotionRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String description;

    @NotNull(message = "El descuento es obligatorio")
    @Min(value = 1)
    @Max(value = 100)
    private Double porcentajeDescuento;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDateTime fechaInicio;

    @NotNull(message = "La fecha de fin es obligatoria")
    @Future(message = "La fecha de fin debe ser futura")
    private LocalDateTime fechaFin;

    private List<Long> productoIds; // Si es null o vacío, aplica a todo (?) o a nada. Definamos: vacio = general.
}
