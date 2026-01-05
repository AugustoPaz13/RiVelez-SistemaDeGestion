package com.rivelez.entity;

/**
 * Tipos de movimiento de stock
 */
public enum StockMovementType {
    ENTRADA, // Compra de insumos
    SALIDA, // Uso en cocina (no automático por ahora) o merma
    AJUSTE // Corrección de inventario
}
