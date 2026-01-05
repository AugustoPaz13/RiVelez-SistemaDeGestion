package com.rivelez.dto;

import com.rivelez.entity.OrderStatus;
import com.rivelez.entity.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO para transferencia de datos de pedidos
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long id;
    private String numeroPedido;
    private Integer numeroMesa;
    private Integer personas;
    private OrderStatus estado;
    private List<OrderItemDTO> items;
    private BigDecimal subtotal;
    private BigDecimal propina;
    private BigDecimal total;
    private PaymentMethod metodoPago;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}
