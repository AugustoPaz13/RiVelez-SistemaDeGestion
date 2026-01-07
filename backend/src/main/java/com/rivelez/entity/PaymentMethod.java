package com.rivelez.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Métodos de pago disponibles
 */
public enum PaymentMethod {
    EFECTIVO,
    TARJETA_DEBITO,
    TARJETA_CREDITO,
    TRANSFERENCIA,
    QR,
    OTRO;

    @JsonValue
    public String toValue() {
        return name().toLowerCase().replace("_", "-");
    }
}
