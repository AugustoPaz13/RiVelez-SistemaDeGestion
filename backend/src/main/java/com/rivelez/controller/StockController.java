package com.rivelez.controller;

import com.rivelez.dto.AdjustStockRequest;
import com.rivelez.dto.CreateStockItemRequest;
import com.rivelez.dto.StockItemDTO;
import com.rivelez.dto.StockMovementDTO;
import com.rivelez.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    /**
     * Obtener todo el stock
     * GET /api/stock
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('GERENTE', 'COCINERO')")
    public ResponseEntity<List<StockItemDTO>> getAllStock() {
        return ResponseEntity.ok(stockService.getAllStockItems());
    }

    /**
     * Obtener items con bajo stock
     * GET /api/stock/low
     */
    @GetMapping("/low")
    @PreAuthorize("hasAnyRole('GERENTE', 'COCINERO')")
    public ResponseEntity<List<StockItemDTO>> getLowStock() {
        return ResponseEntity.ok(stockService.getLowStockItems());
    }

    /**
     * Obtener item por ID
     * GET /api/stock/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('GERENTE', 'COCINERO')")
    public ResponseEntity<StockItemDTO> getStockItem(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(stockService.getStockItemById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener historial de movimientos
     * GET /api/stock/{id}/movements
     */
    @GetMapping("/{id}/movements")
    @PreAuthorize("hasAnyRole('GERENTE')")
    public ResponseEntity<List<StockMovementDTO>> getStockMovements(@PathVariable Long id) {
        return ResponseEntity.ok(stockService.getStockMovements(id));
    }

    /**
     * Crear nuevo item
     * POST /api/stock
     */
    @PostMapping
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> createStockItem(@Valid @RequestBody CreateStockItemRequest request) {
        try {
            StockItemDTO created = stockService.createStockItem(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Ajustar stock (Entrada/Salida/Ajuste)
     * POST /api/stock/{id}/adjust
     */
    @PostMapping("/{id}/adjust")
    @PreAuthorize("hasAnyRole('GERENTE', 'COCINERO')")
    public ResponseEntity<?> adjustStock(
            @PathVariable Long id,
            @Valid @RequestBody AdjustStockRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(stockService.adjustStock(id, request, userDetails.getUsername()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
