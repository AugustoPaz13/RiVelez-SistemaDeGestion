package com.rivelez.dto;

import com.rivelez.entity.ProductCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para transferencia de datos de productos
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private ProductCategory categoria;
    private boolean disponible;
    private String imagen;
    private List<String> ingredientes;
}
