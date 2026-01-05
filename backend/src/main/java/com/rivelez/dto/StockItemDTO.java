package com.rivelez.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockItemDTO {

    private Long id;
    private String nombre;
    private Integer cantidadActual;
    private Integer cantidadMinima;
    private String unidadMedida;
    private BigDecimal costoUnitario;
    private boolean bajoStock; // Campo calculado
}
