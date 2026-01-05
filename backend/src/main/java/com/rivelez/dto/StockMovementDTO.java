package com.rivelez.dto;

import com.rivelez.entity.StockMovementType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovementDTO {

    private Long id;
    private Long itemId;
    private String nombreItem;
    private StockMovementType tipo;
    private Integer cantidad;
    private String motivo;
    private LocalDateTime fecha;
    private String usuarioNombre;
}
