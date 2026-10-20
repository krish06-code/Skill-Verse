package com.skillverse.service;

import com.skillverse.dto.Dtos.ReviewRequest;
import com.skillverse.model.Review;
import com.skillverse.model.User;
import com.skillverse.repository.ReviewRepository;
import com.skillverse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private UserRepository userRepository;

    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        reviewService = new ReviewService(reviewRepository, userRepository);
    }

    @Test
    @DisplayName("averageRating returns null when user has no reviews")
    void averageRating_returnsNullWhenNoReviews() {
        when(reviewRepository.findByReviewedUserId("u_none")).thenReturn(List.of());

        Double avg = reviewService.averageRating("u_none");
        assertThat(avg).isNull();
    }

    @Test
    @DisplayName("averageRating calculates rounded average when reviews exist")
    void averageRating_calculatesAverageWhenReviewsExist() {
        Review r1 = new Review("r1", "Reviewer 1", "u_target", 4, "Good");
        Review r2 = new Review("r2", "Reviewer 2", "u_target", 5, "Great");
        when(reviewRepository.findByReviewedUserId("u_target")).thenReturn(List.of(r1, r2));

        Double avg = reviewService.averageRating("u_target");
        assertThat(avg).isEqualTo(4.5);
    }

    @Test
    @DisplayName("create saves review and awards skill points")
    void create_savesReviewAndAwardsPoints() {
        User targetUser = new User();
        targetUser.setId("u_target");
        targetUser.setSkillPoints(50);

        when(userRepository.findById("u_target")).thenReturn(Optional.of(targetUser));
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ReviewRequest request = new ReviewRequest("u_rev", "Reviewer", "u_target", 5, "Excellent mentor!");
        Review created = reviewService.create(request);

        assertThat(created.getRating()).isEqualTo(5);
        assertThat(created.getComment()).isEqualTo("Excellent mentor!");

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getSkillPoints()).isEqualTo(75); // 50 + 5*5
    }
}
