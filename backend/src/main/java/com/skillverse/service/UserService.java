package com.skillverse.service;

import com.skillverse.dto.Dtos.UpdateUserRequest;
import com.skillverse.dto.Dtos.UserDto;
import com.skillverse.model.Skill;
import com.skillverse.model.User;
import com.skillverse.repository.SkillRepository;
import com.skillverse.repository.UserRepository;
import com.skillverse.web.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ReviewService reviewService;

    public UserService(UserRepository userRepository, SkillRepository skillRepository, ReviewService reviewService) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.reviewService = reviewService;
    }

    public UserDto get(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));
        return UserDto.from(user, reviewService.averageRating(id));
    }

    public List<UserDto> list() {
        return userRepository.findAll().stream()
                .map(u -> UserDto.from(u, reviewService.averageRating(u.getId())))
                .toList();
    }

    public UserDto update(String id, UpdateUserRequest req) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));

        if (req.name() != null) user.setName(req.name());
        if (req.college() != null) user.setCollege(req.college());
        if (req.branch() != null) user.setBranch(req.branch());
        if (req.year() != null) user.setYear(req.year());
        if (req.bio() != null) user.setBio(req.bio());
        if (req.profileImage() != null) user.setProfileImage(req.profileImage());
        if (req.teachSkills() != null) {
            user.setTeachSkills(new ArrayList<>(req.teachSkills()));
            registerSkills(req.teachSkills());
        }
        if (req.learnSkills() != null) {
            user.setLearnSkills(new ArrayList<>(req.learnSkills()));
            registerSkills(req.learnSkills());
        }

        User saved = userRepository.save(user);
        return UserDto.from(saved, reviewService.averageRating(id));
    }

    public void addSkill(String userId, String skillName, String type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Student not found"));

        List<String> target = "TEACH".equalsIgnoreCase(type) ? user.getTeachSkills() : user.getLearnSkills();
        boolean exists = target.stream().anyMatch(s -> s.equalsIgnoreCase(skillName));
        if (!exists) target.add(skillName);

        registerSkills(List.of(skillName));
        userRepository.save(user);
    }

    /** Keeps the shared skill catalogue in sync with what students type. */
    private void registerSkills(List<String> names) {
        for (String name : names) {
            if (name == null || name.isBlank()) continue;
            if (skillRepository.findByNameIgnoreCase(name.trim()).isEmpty()) {
                skillRepository.save(new Skill(name.trim(), "General"));
            }
        }
    }
}
