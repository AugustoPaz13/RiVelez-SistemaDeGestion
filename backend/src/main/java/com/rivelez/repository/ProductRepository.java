package com.rivelez.repository;

import com.rivelez.entity.Product;
import com.rivelez.entity.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para operaciones CRUD de productos
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoria(ProductCategory categoria);

    List<Product> findByDisponible(boolean disponible);

    List<Product> findByCategoriaAndDisponible(ProductCategory categoria, boolean disponible);

    List<Product> findByNombreContainingIgnoreCase(String nombre);

    List<Product> findAllByOrderByCategoriaAscNombreAsc();
}
