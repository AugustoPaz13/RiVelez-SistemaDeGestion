package com.rivelez.repository;

import com.rivelez.entity.CustomerOrder;
import com.rivelez.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio para operaciones CRUD de pedidos
 */
@Repository
public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    Optional<CustomerOrder> findByNumeroPedido(String numeroPedido);

    List<CustomerOrder> findByEstado(OrderStatus estado);

    List<CustomerOrder> findByNumeroMesa(Integer numeroMesa);

    List<CustomerOrder> findByNumeroMesaAndEstadoNot(Integer numeroMesa, OrderStatus estado);

    List<CustomerOrder> findByEstadoIn(List<OrderStatus> estados);

    List<CustomerOrder> findByFechaCreacionBetween(LocalDateTime inicio, LocalDateTime fin);

    @Query("SELECT o FROM CustomerOrder o WHERE o.estado NOT IN ('PAGADO') ORDER BY o.fechaCreacion DESC")
    List<CustomerOrder> findActiveOrders();

    @Query("SELECT o FROM CustomerOrder o WHERE o.estado IN ('NUEVO', 'RECIBIDO', 'EN_PREPARACION', 'RETRASADO', 'LISTO', 'CANCELADO') ORDER BY o.fechaCreacion ASC")
    List<CustomerOrder> findPendingOrders();

    @Query("SELECT COUNT(o) FROM CustomerOrder o WHERE o.estado = 'PAGADO' AND o.fechaCreacion >= :desde")
    Long countCompletedOrdersSince(LocalDateTime desde);
}
