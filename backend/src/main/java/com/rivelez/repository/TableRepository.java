package com.rivelez.repository;

import com.rivelez.entity.RestaurantTable;
import com.rivelez.entity.TableStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones CRUD de mesas
 */
@Repository
public interface TableRepository extends JpaRepository<RestaurantTable, Long> {

    Optional<RestaurantTable> findByNumero(Integer numero);

    List<RestaurantTable> findByEstado(TableStatus estado);

    boolean existsByNumero(Integer numero);

    List<RestaurantTable> findAllByOrderByNumeroAsc();
}
