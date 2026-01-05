package com.rivelez.repository;

import com.rivelez.entity.StockItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para items de stock
 */
@Repository
public interface StockItemRepository extends JpaRepository<StockItem, Long> {

    Optional<StockItem> findByNombre(String nombre);

    boolean existsByNombre(String nombre);

    @Query("SELECT s FROM StockItem s WHERE s.cantidadActual <= s.cantidadMinima")
    List<StockItem> findLowStockItems();

    List<StockItem> findAllByOrderByNombreAsc();
}
