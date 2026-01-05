package com.rivelez.controller;

import com.rivelez.dto.TableDTO;
import com.rivelez.dto.TableRequest;
import com.rivelez.entity.TableStatus;
import com.rivelez.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de mesas
 */
@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    /**
     * Obtener todas las mesas
     * GET /api/tables
     */
    @GetMapping
    public ResponseEntity<List<TableDTO>> getAllTables() {
        return ResponseEntity.ok(tableService.getAllTables());
    }

    /**
     * Obtener mesa por ID
     * GET /api/tables/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<TableDTO> getTableById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(tableService.getTableById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener mesa por número
     * GET /api/tables/numero/{numero}
     */
    @GetMapping("/numero/{numero}")
    public ResponseEntity<TableDTO> getTableByNumero(@PathVariable Integer numero) {
        try {
            return ResponseEntity.ok(tableService.getTableByNumero(numero));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener mesas por estado
     * GET /api/tables/estado/{estado}
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<TableDTO>> getTablesByStatus(@PathVariable TableStatus estado) {
        return ResponseEntity.ok(tableService.getTablesByStatus(estado));
    }

    /**
     * Crear nueva mesa
     * POST /api/tables
     */
    @PostMapping
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> createTable(@Valid @RequestBody TableRequest request) {
        try {
            TableDTO created = tableService.createTable(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Actualizar mesa
     * PUT /api/tables/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO')")
    public ResponseEntity<?> updateTable(@PathVariable Long id, @Valid @RequestBody TableRequest request) {
        try {
            return ResponseEntity.ok(tableService.updateTable(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cambiar estado de mesa
     * PATCH /api/tables/{id}/estado
     */
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('GERENTE', 'CAJERO')")
    public ResponseEntity<?> updateTableStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        try {
            TableStatus estado = TableStatus.valueOf((String) body.get("estado"));
            Integer ocupantes = body.get("ocupantes") != null ? (Integer) body.get("ocupantes") : null;

            return ResponseEntity.ok(tableService.updateTableStatus(id, estado, ocupantes));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Eliminar mesa
     * DELETE /api/tables/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> deleteTable(@PathVariable Long id) {
        try {
            tableService.deleteTable(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
