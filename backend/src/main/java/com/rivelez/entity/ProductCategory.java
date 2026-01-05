package com.rivelez.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Categorías de productos del menú
 */
public enum ProductCategory {
    ENTRADA,
    PRINCIPAL,
    POSTRE,
    BEBIDA,
    ALCOHOL;

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }
}
