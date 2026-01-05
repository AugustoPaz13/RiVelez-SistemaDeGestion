package com.rivelez.controller;

import com.rivelez.dto.ProductDTO;
import com.rivelez.dto.ProductRequest;
import com.rivelez.entity.ProductCategory;
import com.rivelez.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de productos
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    /**
     * Obtener todos los productos
     * GET /api/products
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    /**
     * Obtener solo productos disponibles (para clientes)
     * GET /api/products/available
     */
    @GetMapping("/available")
    public ResponseEntity<List<ProductDTO>> getAvailableProducts() {
        return ResponseEntity.ok(productService.getAvailableProducts());
    }

    /**
     * Obtener producto por ID
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.getProductById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Obtener productos por categoría
     * GET /api/products/category/{categoria}
     */
    @GetMapping("/category/{categoria}")
    public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable ProductCategory categoria) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoria));
    }

    /**
     * Obtener productos disponibles por categoría
     * GET /api/products/category/{categoria}/available
     */
    @GetMapping("/category/{categoria}/available")
    public ResponseEntity<List<ProductDTO>> getAvailableProductsByCategory(@PathVariable ProductCategory categoria) {
        return ResponseEntity.ok(productService.getAvailableProductsByCategory(categoria));
    }

    /**
     * Buscar productos por nombre
     * GET /api/products/search?q={query}
     */
    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam("q") String query) {
        return ResponseEntity.ok(productService.searchProducts(query));
    }

    /**
     * Crear nuevo producto
     * POST /api/products
     */
    @PostMapping
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request) {
        try {
            ProductDTO created = productService.createProduct(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Actualizar producto
     * PUT /api/products/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        try {
            return ResponseEntity.ok(productService.updateProduct(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cambiar disponibilidad de producto
     * PATCH /api/products/{id}/toggle-availability
     */
    @PatchMapping("/{id}/toggle-availability")
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(productService.toggleAvailability(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Eliminar producto
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('GERENTE')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
