package com.rivelez.dto;

import com.rivelez.entity.TableStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear/actualizar mesas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableRequest {

    @NotNull(message = "El número de mesa es obligatorio")
    private Integer numero;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    private Integer capacidad;

    private TableStatus estado;

    private Integer ocupantes;
}
