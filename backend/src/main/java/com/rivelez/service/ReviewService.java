package com.rivelez.service;

import com.rivelez.dto.ReviewDTO;
import com.rivelez.entity.Review;
import com.rivelez.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    public ReviewDTO create(ReviewDTO dto) {
        if (dto.getNumeroPedido() != null && reviewRepository.existsByNumeroPedido(dto.getNumeroPedido())) {
            throw new RuntimeException("Ya existe una reseña para este pedido");
        }

        Review review = Review.builder()
                .calificacion(dto.getCalificacion())
                .comentario(dto.getComentario())
                .numeroMesa(dto.getNumeroMesa())
                .numeroPedido(dto.getNumeroPedido())
                .build();

        Review saved = reviewRepository.save(review);
        return toDTO(saved);
    }

    public List<ReviewDTO> getRecent(int limit) {
        return reviewRepository.findTop10ByOrderByFechaCreacionDesc()
                .stream()
                .limit(limit)
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ReviewDTO> getAll() {
        return reviewRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public double getAverageRating() {
        List<Review> reviews = reviewRepository.findAll();
        if (reviews.isEmpty()) {
            return 0.0;
        }
        return reviews.stream()
                .mapToInt(Review::getCalificacion)
                .average()
                .orElse(0.0);
    }

    private ReviewDTO toDTO(Review review) {
        return ReviewDTO.builder()
                .id(review.getId())
                .calificacion(review.getCalificacion())
                .comentario(review.getComentario())
                .numeroMesa(review.getNumeroMesa())
                .numeroPedido(review.getNumeroPedido())
                .fechaCreacion(review.getFechaCreacion() != null ? review.getFechaCreacion().format(FORMATTER) : null)
                .build();
    }
}
