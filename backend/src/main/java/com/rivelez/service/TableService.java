package com.rivelez.service;

import com.rivelez.dto.TableDTO;
import com.rivelez.dto.TableRequest;
import com.rivelez.entity.RestaurantTable;
import com.rivelez.entity.TableStatus;
import com.rivelez.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de mesas
 */
@Service
@RequiredArgsConstructor
public class TableService {

    private final TableRepository tableRepository;

    /**
     * Obtiene todas las mesas ordenadas por número
     */
    public List<TableDTO> getAllTables() {
        return tableRepository.findAllByOrderByNumeroAsc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una mesa por ID
     */
    public TableDTO getTableById(Long id) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
        return toDTO(table);
    }

    /**
     * Obtiene una mesa por número
     */
    public TableDTO getTableByNumero(Integer numero) {
        RestaurantTable table = tableRepository.findByNumero(numero)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
        return toDTO(table);
    }

    /**
     * Obtiene mesas por estado
     */
    public List<TableDTO> getTablesByStatus(TableStatus estado) {
        return tableRepository.findByEstado(estado).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea una nueva mesa
     */
    @Transactional
    public TableDTO createTable(TableRequest request) {
        if (tableRepository.existsByNumero(request.getNumero())) {
            throw new RuntimeException("Ya existe una mesa con ese número");
        }

        RestaurantTable table = RestaurantTable.builder()
                .numero(request.getNumero())
                .capacidad(request.getCapacidad())
                .estado(request.getEstado() != null ? request.getEstado() : TableStatus.AVAILABLE)
                .ocupantes(request.getOcupantes())
                .build();

        return toDTO(tableRepository.save(table));
    }

    /**
     * Actualiza una mesa existente
     */
    @Transactional
    public TableDTO updateTable(Long id, TableRequest request) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        if (request.getNumero() != null && !request.getNumero().equals(table.getNumero())) {
            if (tableRepository.existsByNumero(request.getNumero())) {
                throw new RuntimeException("Ya existe una mesa con ese número");
            }
            table.setNumero(request.getNumero());
        }

        if (request.getCapacidad() != null) {
            table.setCapacidad(request.getCapacidad());
        }
        if (request.getEstado() != null) {
            table.setEstado(request.getEstado());
        }
        if (request.getOcupantes() != null) {
            table.setOcupantes(request.getOcupantes());
        }

        return toDTO(tableRepository.save(table));
    }

    /**
     * Cambia el estado de una mesa
     */
    @Transactional
    public TableDTO updateTableStatus(Long id, TableStatus nuevoEstado, Integer ocupantes) {
        RestaurantTable table = tableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));

        table.setEstado(nuevoEstado);

        if (nuevoEstado == TableStatus.OCCUPIED) {
            table.setHoraInicio(LocalDateTime.now());
            table.setOcupantes(ocupantes);
        } else if (nuevoEstado == TableStatus.AVAILABLE) {
            table.setHoraInicio(null);
            table.setOcupantes(null);
            table.setPedidoActualId(null);
        }

        return toDTO(tableRepository.save(table));
    }

    /**
     * Elimina una mesa
     */
    @Transactional
    public void deleteTable(Long id) {
        if (!tableRepository.existsById(id)) {
            throw new RuntimeException("Mesa no encontrada");
        }
        tableRepository.deleteById(id);
    }

    /**
     * Convierte entidad a DTO
     */
    private TableDTO toDTO(RestaurantTable table) {
        return TableDTO.builder()
                .id(table.getId())
                .numero(table.getNumero())
                .capacidad(table.getCapacidad())
                .estado(table.getEstado())
                .ocupantes(table.getOcupantes())
                .pedidoActualId(table.getPedidoActualId())
                .horaInicio(table.getHoraInicio())
                .build();
    }
}
