package com.rivelez.repository;

import com.rivelez.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio para movimientos de stock
 */
@Repository
public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    List<StockMovement> findByItemIdOrderByFechaDesc(Long itemId);

    List<StockMovement> findByFechaBetweenOrderByFechaDesc(LocalDateTime inicio, LocalDateTime fin);
}
