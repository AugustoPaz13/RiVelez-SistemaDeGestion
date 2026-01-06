package com.rivelez.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Estados posibles de un pedido
 */
public enum OrderStatus {
    NUEVO, // Recién creado
    RECIBIDO, // Recibido en cocina
    EN_PREPARACION, // Cocinando
    LISTO, // Listo para servir
    ENTREGADO, // Entregado al cliente
    RETRASADO, // Pedido demorado
    CANCELADO, // Cancelado por cliente
    PAGADO; // Pagado y cerrado

    @JsonValue
    public String toValue() {
        return name().toLowerCase().replace("_", "-");
    }
}
