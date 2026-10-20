package com.skillverse.dto;

import com.skillverse.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class Dtos {

    public record RegisterRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password,
            @NotBlank String college,
            @NotBlank String branch,
            @NotBlank String year
    ) {}

    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    public record UserDto(
            String id,
            String name,
            String email,
            String college,
            String branch,
            String year,
            String bio,
            String profileImage,
            int skillPoints,
            List<String> teachSkills,
            List<String> learnSkills,
            Double rating
    ) {
        public static UserDto from(User u, Double rating) {
            return new UserDto(
                    u.getId(), u.getName(), u.getEmail(), u.getCollege(), u.getBranch(), u.getYear(),
                    u.getBio(), u.getProfileImage(), u.getSkillPoints(),
                    u.getTeachSkills(), u.getLearnSkills(), rating
            );
        }
    }

    public record AuthResponse(String token, UserDto user) {}

    public record MatchResultDto(
            UserDto user,
            int matchPercentage,
            List<String> theyCanTeachYou,
            List<String> youCanTeachThem,
            List<String> sharedInterests,
            boolean twoWay
    ) {}

    public record UpdateUserRequest(
            String name, String college, String branch, String year, String bio, String profileImage,
            List<String> teachSkills, List<String> learnSkills
    ) {}

    public record AddSkillRequest(@NotBlank String skillName, @NotBlank String type) {}

    public record ConnectionRequest(@NotBlank String senderId, @NotBlank String receiverId) {}

    public record ConnectionStatusRequest(@NotBlank String status) {}

    public record MessageRequest(@NotBlank String senderId, @NotBlank String receiverId, @NotBlank String message) {}

    public record ReviewRequest(
            @NotBlank String reviewerId,
            String reviewerName,
            @NotBlank String reviewedUserId,
            @Min(1) @Max(5) int rating,
            @NotBlank String comment
    ) {}

    public record MessageDto(String id, String senderId, String receiverId, String message, String timestamp) {}

    public record OkResponse(boolean ok) {}

    public record ForgotPasswordRequest(@NotBlank @Email String email) {}

    public record ResetPasswordRequest(
            @NotBlank String token,
            @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password
    ) {}
}
