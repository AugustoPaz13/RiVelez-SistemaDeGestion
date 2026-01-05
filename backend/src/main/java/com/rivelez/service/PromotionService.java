package com.rivelez.service;

import com.rivelez.dto.CreatePromotionRequest;
import com.rivelez.dto.PromotionDTO;
import com.rivelez.entity.Product;
import com.rivelez.entity.Promotion;
import com.rivelez.repository.ProductRepository;
import com.rivelez.repository.PromotionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final ProductRepository productRepository;

    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<PromotionDTO> getActivePromotions() {
        return promotionRepository.findActivePromotions(LocalDateTime.now()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PromotionDTO getPromotionById(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
        return toDTO(promotion);
    }

    @Transactional
    public PromotionDTO createPromotion(CreatePromotionRequest request) {
        Promotion promotion = Promotion.builder()
                .nombre(request.getNombre())
                .description(request.getDescription())
                .porcentajeDescuento(request.getPorcentajeDescuento())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .activa(true)
                .productos(new ArrayList<>())
                .build();

        if (request.getProductoIds() != null && !request.getProductoIds().isEmpty()) {
            List<Product> products = productRepository.findAllById(request.getProductoIds());
            promotion.setProductos(products);
        }

        return toDTO(promotionRepository.save(promotion));
    }

    @Transactional
    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promoción no encontrada");
        }
        promotionRepository.deleteById(id);
    }

    @Transactional
    public PromotionDTO toggleStatus(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
        promotion.setActiva(!promotion.isActiva());
        return toDTO(promotionRepository.save(promotion));
    }

    private PromotionDTO toDTO(Promotion promotion) {
        return PromotionDTO.builder()
                .id(promotion.getId())
                .nombre(promotion.getNombre())
                .description(promotion.getDescription())
                .porcentajeDescuento(promotion.getPorcentajeDescuento())
                .fechaInicio(promotion.getFechaInicio())
                .fechaFin(promotion.getFechaFin())
                .activa(promotion.isActiva())
                .productoIds(promotion.getProductos().stream().map(Product::getId).collect(Collectors.toList()))
                .productoNombres(promotion.getProductos().stream().map(Product::getNombre).collect(Collectors.toList()))
                .build();
    }
}
