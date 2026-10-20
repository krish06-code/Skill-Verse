package com.skillverse.controller;

import com.skillverse.dto.Dtos.ReviewRequest;
import com.skillverse.model.Review;
import com.skillverse.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{userId}")
    public List<Review> list(@PathVariable String userId) {
        return reviewService.forUser(userId);
    }

    @PostMapping
    public Review create(@Valid @RequestBody ReviewRequest request) {
        return reviewService.create(request);
    }
}
