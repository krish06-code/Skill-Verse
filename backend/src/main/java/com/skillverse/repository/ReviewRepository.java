package com.skillverse.repository;

import com.skillverse.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByReviewedUserId(String reviewedUserId);
}
