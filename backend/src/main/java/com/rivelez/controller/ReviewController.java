package com.rivelez.controller;

import com.rivelez.dto.ReviewDTO;
import com.rivelez.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO created = reviewService.create(reviewDTO);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<ReviewDTO>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAll());
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ReviewDTO>> getRecentReviews(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(reviewService.getRecent(limit));
    }

    @GetMapping("/average")
    public ResponseEntity<Map<String, Object>> getAverageRating() {
        double average = reviewService.getAverageRating();
        int count = reviewService.getAll().size();
        return ResponseEntity.ok(Map.of(
                "promedio", Math.round(average * 10.0) / 10.0,
                "total", count));
    }
}
