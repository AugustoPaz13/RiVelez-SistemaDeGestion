package com.rivelez.dto;

import com.rivelez.entity.StockMovementType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdjustStockRequest {

    @NotNull(message = "El tipo de movimiento es obligatorio")
    private StockMovementType tipo;

    @NotNull(message = "La cantidad es obligatoria")
    private Integer cantidad;

    private String motivo;
}
