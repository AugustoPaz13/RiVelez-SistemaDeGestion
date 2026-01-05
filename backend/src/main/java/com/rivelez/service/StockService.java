package com.rivelez.service;

import com.rivelez.dto.AdjustStockRequest;
import com.rivelez.dto.CreateStockItemRequest;
import com.rivelez.dto.StockItemDTO;
import com.rivelez.dto.StockMovementDTO;
import com.rivelez.entity.StockItem;
import com.rivelez.entity.StockMovement;
import com.rivelez.entity.StockMovementType;
import com.rivelez.repository.StockItemRepository;
import com.rivelez.repository.StockMovementRepository;
import com.rivelez.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockItemRepository stockItemRepository;
    private final StockMovementRepository stockMovementRepository;
    private final UserRepository userRepository;

    /**
     * Obtiene todos los items de stock
     */
    public List<StockItemDTO> getAllStockItems() {
        return stockItemRepository.findAllByOrderByNombreAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene items con bajo stock
     */
    public List<StockItemDTO> getLowStockItems() {
        return stockItemRepository.findLowStockItems().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un item por ID
     */
    public StockItemDTO getStockItemById(Long id) {
        StockItem item = stockItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item de stock no encontrado"));
        return toDTO(item);
    }

    /**
     * Crea un nuevo item de stock
     */
    @Transactional
    public StockItemDTO createStockItem(CreateStockItemRequest request) {
        if (stockItemRepository.existsByNombre(request.getNombre())) {
            throw new RuntimeException("Ya existe un item con ese nombre");
        }

        StockItem item = StockItem.builder()
                .nombre(request.getNombre())
                .cantidadActual(request.getCantidadActual())
                .cantidadMinima(request.getCantidadMinima())
                .unidadMedida(request.getUnidadMedida())
                .costoUnitario(request.getCostoUnitario())
                .build();

        StockItem savedItem = stockItemRepository.save(item);

        // Registrar movimiento inicial si la cantidad > 0
        if (request.getCantidadActual() > 0) {
            StockMovement movement = StockMovement.builder()
                    .item(savedItem)
                    .tipo(StockMovementType.ENTRADA)
                    .cantidad(request.getCantidadActual())
                    .motivo("Stock inicial")
                    .build();
            stockMovementRepository.save(movement);
        }

        return toDTO(savedItem);
    }

    /**
     * Ajusta el stock manualmente (Entrada/Salida/Ajuste)
     */
    @Transactional
    public StockItemDTO adjustStock(Long id, AdjustStockRequest request, String username) {
        StockItem item = stockItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item de stock no encontrado"));

        int nuevaCantidad = item.getCantidadActual();
        int cambio = request.getCantidad();

        // Validar que la cantidad en el request sea positiva (la lógica de signo
        // depende del tipo)
        if (cambio <= 0) {
            throw new RuntimeException("La cantidad debe ser positiva");
        }

        switch (request.getTipo()) {
            case ENTRADA:
                nuevaCantidad += cambio;
                break;
            case SALIDA:
                nuevaCantidad -= cambio;
                if (nuevaCantidad < 0) {
                    throw new RuntimeException("Stock insuficiente para realizar la salida");
                }
                break;
            case AJUSTE:
                // Ajuste establece el valor absoluto
                // Calculamos el cambio real para el historial
                // Si ajuste es 50 y tengo 40 -> Entraron 10
                // Si ajuste es 30 y tengo 40 -> Salieron 10
                // Pero aquí guardamos el movimiento como AJUSTE y la cantidad que se estableció

                // Opción: Guardar el delta.
                // Si tengo 40 y ajusto a 50, el delta es +10. Motivo: Ajuste.
                // Si tengo 40 y ajusto a 30, el delta es -10.

                // Pero para simplificar el historial, guardamos el cambio.
                // Sin embargo, StockMovement guarda "cantidad" del movimiento.
                // En caso de AJUSTE, registramos la diferencia.
                int diferencia = request.getCantidad() - item.getCantidadActual();
                if (diferencia == 0)
                    return toDTO(item); // Sin cambios

                nuevaCantidad = request.getCantidad();
                cambio = Math.abs(diferencia); // El movimiento registra la magnitud del cambio
                break;
        }

        item.setCantidadActual(nuevaCantidad);
        StockItem savedItem = stockItemRepository.save(item);

        // Registrar movimiento
        StockMovement movement = StockMovement.builder()
                .item(savedItem)
                .tipo(request.getTipo())
                .cantidad(cambio)
                .motivo(request.getMotivo())
                .usuario(userRepository.findByUsername(username).orElse(null))
                .build();
        stockMovementRepository.save(movement);

        return toDTO(savedItem);
    }

    /**
     * Obtiene historial de movimientos de un item
     */
    public List<StockMovementDTO> getStockMovements(Long itemId) {
        return stockMovementRepository.findByItemIdOrderByFechaDesc(itemId).stream()
                .map(this::toMovementDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convierte entidad item a DTO
     */
    private StockItemDTO toDTO(StockItem item) {
        return StockItemDTO.builder()
                .id(item.getId())
                .nombre(item.getNombre())
                .cantidadActual(item.getCantidadActual())
                .cantidadMinima(item.getCantidadMinima())
                .unidadMedida(item.getUnidadMedida())
                .costoUnitario(item.getCostoUnitario())
                .bajoStock(item.getCantidadActual() <= item.getCantidadMinima())
                .build();
    }

    /**
     * Convierte entidad movimiento a DTO
     */
    private StockMovementDTO toMovementDTO(StockMovement movement) {
        return StockMovementDTO.builder()
                .id(movement.getId())
                .itemId(movement.getItem().getId())
                .nombreItem(movement.getItem().getNombre())
                .tipo(movement.getTipo())
                .cantidad(movement.getCantidad())
                .motivo(movement.getMotivo())
                .fecha(movement.getFecha())
                .usuarioNombre(movement.getUsuario() != null ? movement.getUsuario().getUsername() : "Sistema")
                .build();
    }
}
