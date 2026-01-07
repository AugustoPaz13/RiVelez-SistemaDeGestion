package com.rivelez.repository;

import com.rivelez.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByNumeroMesaOrderByFechaCreacionDesc(Integer numeroMesa);

    List<Review> findAllByOrderByFechaCreacionDesc();

    List<Review> findTop10ByOrderByFechaCreacionDesc();

    boolean existsByNumeroPedido(String numeroPedido);
}
