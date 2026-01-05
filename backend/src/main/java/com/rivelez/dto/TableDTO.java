package com.rivelez.dto;

import com.rivelez.entity.TableStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de mesas
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableDTO {

    private Long id;
    private Integer numero;
    private Integer capacidad;
    private TableStatus estado;
    private Integer ocupantes;
    private Long pedidoActualId;
    private LocalDateTime horaInicio;
}
