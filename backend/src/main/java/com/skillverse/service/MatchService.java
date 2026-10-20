package com.skillverse.service;

import com.skillverse.dto.Dtos.MatchResultDto;
import com.skillverse.model.Skill;
import com.skillverse.model.User;
import com.skillverse.repository.SkillRepository;
import com.skillverse.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Complementary skill matching.
 *
 * A pair is a good match when what I want to learn is what they can teach,
 * and what I can teach is what they want to learn. Skills in the same
 * category earn partial credit, and reputation gives a small boost.
 */
@Service
public class MatchService {

    private static final double DIRECT_WEIGHT_LEARN = 0.55;
    private static final double DIRECT_WEIGHT_TEACH = 0.35;
    private static final double RELATED_CREDIT = 0.4;

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ReviewService reviewService;

    public MatchService(UserRepository userRepository, SkillRepository skillRepository, ReviewService reviewService) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.reviewService = reviewService;
    }

    public List<MatchResultDto> matchesFor(String userId) {
        User me = userRepository.findById(userId).orElseThrow();
        Map<String, String> categories = categoryIndex();
        List<MatchResultDto> results = new ArrayList<>();

        for (User other : userRepository.findAll()) {
            if (other.getId().equals(me.getId())) continue;
            Double rating = reviewService.averageRating(other.getId());
            results.add(buildMatch(me, other, categories, rating));
        }

        results.sort(Comparator.comparingInt(MatchResultDto::matchPercentage).reversed()
                .thenComparing(m -> m.user().name()));
        return results;
    }

    private MatchResultDto buildMatch(User me, User other, Map<String, String> categories, Double rating) {
        Set<String> myLearn = normalize(me.getLearnSkills());
        Set<String> myTeach = normalize(me.getTeachSkills());
        Set<String> theirTeach = normalize(other.getTeachSkills());
        Set<String> theirLearn = normalize(other.getLearnSkills());

        Set<String> theyCanTeachYou = intersection(myLearn, theirTeach);
        Set<String> youCanTeachThem = intersection(myTeach, theirLearn);
        Set<String> sharedInterests = intersection(myLearn, theirLearn);

        double learnScore = coverage(myLearn, theirTeach, categories);
        double teachScore = coverage(myTeach, theirLearn, categories);

        double score = (learnScore * DIRECT_WEIGHT_LEARN) + (teachScore * DIRECT_WEIGHT_TEACH);

        boolean twoWay = !theyCanTeachYou.isEmpty() && !youCanTeachThem.isEmpty();
        if (twoWay) score += 0.10;
        if (!sharedInterests.isEmpty()) score += 0.03;

        // Reputation nudge: a well-reviewed, active student ranks slightly higher.
        if (rating != null && rating > 0) score += ((rating - 3.0) / 2.0) * 0.04;
        score += Math.min(other.getSkillPoints(), 500) / 500.0 * 0.03;

        // Nothing complementary at all should never look like a good match.
        if (theyCanTeachYou.isEmpty() && youCanTeachThem.isEmpty()) score = Math.min(score, 0.25);

        int percentage = (int) Math.round(Math.max(0.0, Math.min(1.0, score)) * 100);

        return new MatchResultDto(
                com.skillverse.dto.Dtos.UserDto.from(other, rating),
                percentage,
                original(other.getTeachSkills(), theyCanTeachYou),
                original(me.getTeachSkills(), youCanTeachThem),
                original(me.getLearnSkills(), sharedInterests),
                twoWay);
    }

    /** Exact matches count fully, same-category matches count partially. */
    private double coverage(Set<String> wanted, Set<String> offered, Map<String, String> categories) {
        if (wanted.isEmpty()) return 0;
        Set<String> offeredCategories = offered.stream()
                .map(categories::get)
                .filter(c -> c != null)
                .collect(Collectors.toSet());

        double total = 0;
        for (String skill : wanted) {
            if (offered.contains(skill)) {
                total += 1.0;
            } else {
                String category = categories.get(skill);
                if (category != null && offeredCategories.contains(category)) total += RELATED_CREDIT;
            }
        }
        return total / wanted.size();
    }

    private Map<String, String> categoryIndex() {
        Map<String, String> index = new HashMap<>();
        for (Skill skill : skillRepository.findAll()) {
            if (skill.getName() != null && skill.getCategory() != null) {
                index.put(skill.getName().trim().toLowerCase(Locale.ROOT), skill.getCategory());
            }
        }
        return index;
    }

    /** Maps normalized keys back to the nicely cased skill names for display. */
    private List<String> original(List<String> source, Set<String> normalizedKeys) {
        if (source == null) return List.of();
        return source.stream()
                .filter(s -> s != null && normalizedKeys.contains(s.trim().toLowerCase(Locale.ROOT)))
                .distinct()
                .toList();
    }

    private Set<String> normalize(List<String> skills) {
        if (skills == null) return Set.of();
        return skills.stream()
                .filter(s -> s != null && !s.isBlank())
                .map(s -> s.trim().toLowerCase(Locale.ROOT))
                .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private Set<String> intersection(Set<String> a, Set<String> b) {
        Set<String> copy = new LinkedHashSet<>(a);
        copy.retainAll(b);
        return copy;
    }
}
