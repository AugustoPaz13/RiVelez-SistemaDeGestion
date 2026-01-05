package com.rivelez.controller;

import com.rivelez.dto.CreatePromotionRequest;
import com.rivelez.dto.PromotionDTO;
import com.rivelez.service.PromotionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/promotions")
@RequiredArgsConstructor
public class PromotionController {

    private final PromotionService promotionService;

    // Obtener todas las promociones (Gerente/Cajero)
    @GetMapping
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO')")
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        return ResponseEntity.ok(promotionService.getAllPromotions());
    }

    // Obtener promociones activas (Público/Clientes)
    @GetMapping("/active")
    public ResponseEntity<List<PromotionDTO>> getActivePromotions() {
        return ResponseEntity.ok(promotionService.getActivePromotions());
    }

    // Obtener promoción por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO')")
    public ResponseEntity<PromotionDTO> getPromotionById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(promotionService.getPromotionById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Crear promoción (Gerente)
    @PostMapping
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> createPromotion(@Valid @RequestBody CreatePromotionRequest request) {
        try {
            PromotionDTO created = promotionService.createPromotion(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Eliminar promoción (Gerente)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> deletePromotion(@PathVariable Long id) {
        try {
            promotionService.deletePromotion(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Activar/Desactivar promoción
    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> togglePromotion(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(promotionService.toggleStatus(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
