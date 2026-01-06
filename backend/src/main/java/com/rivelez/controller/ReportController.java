package com.rivelez.controller;

import com.rivelez.dto.ReportSummaryDTO;
import com.rivelez.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador para reportes
 */
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /**
     * Obtiene resumen de ventas para los últimos N días
     * 
     * @param dias número de días (default 7)
     */
    @GetMapping("/summary")
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<ReportSummaryDTO> getSummary(
            @RequestParam(defaultValue = "7") int dias) {
        return ResponseEntity.ok(reportService.getSummary(dias));
    }
}
