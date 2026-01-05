package com.rivelez.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rivelez.dto.ProductDTO;
import com.rivelez.dto.ProductRequest;
import com.rivelez.entity.Product;
import com.rivelez.entity.ProductCategory;
import com.rivelez.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de productos
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Obtiene todos los productos ordenados
     */
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAllByOrderByCategoriaAscNombreAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene solo productos disponibles
     */
    public List<ProductDTO> getAvailableProducts() {
        return productRepository.findByDisponible(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un producto por ID
     */
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return toDTO(product);
    }

    /**
     * Obtiene productos por categoría
     */
    public List<ProductDTO> getProductsByCategory(ProductCategory categoria) {
        return productRepository.findByCategoria(categoria).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene productos disponibles por categoría
     */
    public List<ProductDTO> getAvailableProductsByCategory(ProductCategory categoria) {
        return productRepository.findByCategoriaAndDisponible(categoria, true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca productos por nombre
     */
    public List<ProductDTO> searchProducts(String query) {
        return productRepository.findByNombreContainingIgnoreCase(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo producto
     */
    @Transactional
    public ProductDTO createProduct(ProductRequest request) {
        Product product = Product.builder()
                .nombre(request.getNombre())
                .descripcion(request.getDescripcion())
                .precio(request.getPrecio())
                .categoria(request.getCategoria())
                .disponible(request.getDisponible() != null ? request.getDisponible() : true)
                .imagen(request.getImagen())
                .ingredientes(toJson(request.getIngredientes()))
                .build();

        return toDTO(productRepository.save(product));
    }

    /**
     * Actualiza un producto existente
     */
    @Transactional
    public ProductDTO updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (request.getNombre() != null) {
            product.setNombre(request.getNombre());
        }
        if (request.getDescripcion() != null) {
            product.setDescripcion(request.getDescripcion());
        }
        if (request.getPrecio() != null) {
            product.setPrecio(request.getPrecio());
        }
        if (request.getCategoria() != null) {
            product.setCategoria(request.getCategoria());
        }
        if (request.getDisponible() != null) {
            product.setDisponible(request.getDisponible());
        }
        if (request.getImagen() != null) {
            product.setImagen(request.getImagen());
        }
        if (request.getIngredientes() != null) {
            product.setIngredientes(toJson(request.getIngredientes()));
        }

        return toDTO(productRepository.save(product));
    }

    /**
     * Cambia la disponibilidad de un producto
     */
    @Transactional
    public ProductDTO toggleAvailability(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        product.setDisponible(!product.isDisponible());
        return toDTO(productRepository.save(product));
    }

    /**
     * Elimina un producto
     */
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Producto no encontrado");
        }
        productRepository.deleteById(id);
    }

    /**
     * Convierte lista a JSON string
     */
    private String toJson(List<String> list) {
        if (list == null)
            return null;
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            return null;
        }
    }

    /**
     * Convierte JSON string a lista
     */
    private List<String> fromJson(String json) {
        if (json == null || json.isEmpty())
            return Collections.emptyList();
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {
            });
        } catch (JsonProcessingException e) {
            return Collections.emptyList();
        }
    }

    /**
     * Convierte entidad a DTO
     */
    private ProductDTO toDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .nombre(product.getNombre())
                .descripcion(product.getDescripcion())
                .precio(product.getPrecio())
                .categoria(product.getCategoria())
                .disponible(product.isDisponible())
                .imagen(product.getImagen())
                .ingredientes(fromJson(product.getIngredientes()))
                .build();
    }
}
