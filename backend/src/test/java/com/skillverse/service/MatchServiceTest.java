package com.skillverse.service;

import com.skillverse.dto.Dtos.MatchResultDto;
import com.skillverse.model.Skill;
import com.skillverse.model.User;
import com.skillverse.repository.SkillRepository;
import com.skillverse.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatNoException;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private SkillRepository skillRepository;

    @Mock
    private ReviewService reviewService;

    private MatchService matchService;

    @BeforeEach
    void setUp() {
        matchService = new MatchService(userRepository, skillRepository, reviewService);
    }

    @Test
    @DisplayName("Regression test: matchesFor must not throw NullPointerException when a user has no reviews (averageRating is null)")
    void matchesFor_handlesNullAverageRatingWithoutNPE() {
        User user1 = new User();
        user1.setId("u1");
        user1.setName("Alice");
        user1.setTeachSkills(List.of("Java", "Spring Boot"));
        user1.setLearnSkills(List.of("React", "TypeScript"));

        User user2 = new User();
        user2.setId("u2");
        user2.setName("Bob");
        user2.setTeachSkills(List.of("React", "CSS"));
        user2.setLearnSkills(List.of("Java"));

        when(userRepository.findById("u1")).thenReturn(Optional.of(user1));
        when(userRepository.findAll()).thenReturn(List.of(user1, user2));
        when(skillRepository.findAll()).thenReturn(List.of(
                new Skill("Java", "Backend"),
                new Skill("Spring Boot", "Backend"),
                new Skill("React", "Frontend"),
                new Skill("TypeScript", "Frontend"),
                new Skill("CSS", "Frontend")
        ));
        // Bob has no reviews -> reviewService returns null
        when(reviewService.averageRating("u2")).thenReturn(null);

        assertThatNoException().isThrownBy(() -> {
            List<MatchResultDto> matches = matchService.matchesFor("u1");
            assertThat(matches).hasSize(1);
            MatchResultDto match = matches.get(0);
            assertThat(match.user().id()).isEqualTo("u2");
            assertThat(match.user().rating()).isNull();
            assertThat(match.theyCanTeachYou()).contains("React");
            assertThat(match.youCanTeachThem()).contains("Java");
            assertThat(match.twoWay()).isTrue();
            assertThat(match.matchPercentage()).isGreaterThan(0);
        });
    }

    @Test
    @DisplayName("matchesFor includes rating bonus when averageRating is present")
    void matchesFor_includesRatingBonusWhenPresent() {
        User user1 = new User();
        user1.setId("u1");
        user1.setName("Alice");
        user1.setTeachSkills(List.of("Java"));
        user1.setLearnSkills(List.of("Python"));

        User user2 = new User();
        user2.setId("u2");
        user2.setName("Charlie");
        user2.setTeachSkills(List.of("Python"));
        user2.setLearnSkills(List.of("Java"));

        when(userRepository.findById("u1")).thenReturn(Optional.of(user1));
        when(userRepository.findAll()).thenReturn(List.of(user1, user2));
        when(skillRepository.findAll()).thenReturn(List.of());
        when(reviewService.averageRating("u2")).thenReturn(4.8);

        List<MatchResultDto> matches = matchService.matchesFor("u1");
        assertThat(matches).hasSize(1);
        assertThat(matches.get(0).user().rating()).isEqualTo(4.8);
        assertThat(matches.get(0).twoWay()).isTrue();
    }
}
