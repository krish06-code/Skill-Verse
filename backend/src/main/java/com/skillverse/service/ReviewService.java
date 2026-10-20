package com.skillverse.service;

import com.skillverse.dto.Dtos.ReviewRequest;
import com.skillverse.model.Review;
import com.skillverse.repository.ReviewRepository;
import com.skillverse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    public List<Review> forUser(String userId) {
        return reviewRepository.findByReviewedUserId(userId);
    }

    public Double averageRating(String userId) {
        List<Review> reviews = reviewRepository.findByReviewedUserId(userId);
        if (reviews.isEmpty()) return null;
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        return Math.round(avg * 10) / 10.0;
    }

    public Review create(ReviewRequest request) {
        String reviewerName = request.reviewerName();
        if (reviewerName == null || reviewerName.isBlank()) {
            reviewerName = userRepository.findById(request.reviewerId())
                    .map(u -> u.getName()).orElse("Student");
        }
        Review review = reviewRepository.save(new Review(
                request.reviewerId(), reviewerName, request.reviewedUserId(),
                request.rating(), request.comment()));

        // Reviews earn the reviewed student skill points.
        userRepository.findById(request.reviewedUserId()).ifPresent(u -> {
            u.setSkillPoints(u.getSkillPoints() + request.rating() * 5);
            userRepository.save(u);
        });

        return review;
    }
}
