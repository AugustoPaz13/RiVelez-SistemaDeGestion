package com.rivelez.entity;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Roles de usuario en el sistema
 */
public enum UserRole {
    GERENTE,
    CAJERO,
    COCINERO,
    CLIENTE;

    @JsonValue
    public String toValue() {
        return name().toLowerCase();
    }
}
