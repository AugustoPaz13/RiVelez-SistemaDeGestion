package com.rivelez.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Estados posibles de una mesa
 */
public enum TableStatus {
    AVAILABLE, // Disponible
    OCCUPIED, // Ocupada
    RESERVED, // Reservada
    PAGADA; // Pagada (esperando ser liberada)

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }
}
