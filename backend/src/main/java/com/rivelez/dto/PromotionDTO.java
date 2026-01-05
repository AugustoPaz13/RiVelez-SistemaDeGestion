package com.rivelez.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDTO {

    private Long id;
    private String nombre;
    private String description;
    private Double porcentajeDescuento;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private boolean activa;
    private List<Long> productoIds;
    private List<String> productoNombres;
}
