package com.rivelez.repository;

import com.rivelez.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    // Buscar promociones activas en este momento
    @Query("SELECT p FROM Promotion p WHERE p.activa = true AND p.fechaInicio <= :now AND p.fechaFin >= :now")
    List<Promotion> findActivePromotions(LocalDateTime now);

    List<Promotion> findByActivaTrue();
}
