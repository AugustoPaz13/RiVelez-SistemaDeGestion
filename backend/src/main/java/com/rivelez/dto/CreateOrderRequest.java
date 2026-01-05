package com.rivelez.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para crear un nuevo pedido
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotNull(message = "El número de mesa es obligatorio")
    private Integer numeroMesa;

    @NotNull(message = "La cantidad de personas es obligatoria")
    @Min(value = 1, message = "Debe haber al menos 1 persona")
    private Integer personas;

    @NotNull(message = "Debe incluir al menos un item")
    private List<OrderItemRequest> items;
}
