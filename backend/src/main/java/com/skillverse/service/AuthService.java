package com.skillverse.service;

import com.skillverse.dto.Dtos.AuthResponse;
import com.skillverse.dto.Dtos.LoginRequest;
import com.skillverse.dto.Dtos.RegisterRequest;
import com.skillverse.dto.Dtos.UserDto;
import com.skillverse.model.User;
import com.skillverse.repository.UserRepository;
import com.skillverse.security.JwtService;
import com.skillverse.web.ApiException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ReviewService reviewService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, ReviewService reviewService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.reviewService = reviewService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ApiException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        User user = new User();
        user.setName(request.name().trim());
        user.setEmail(request.email().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setCollege(request.college().trim());
        user.setBranch(request.branch().trim());
        user.setYear(request.year().trim());
        user.setBio("");
        user.setSkillPoints(0);
        user.setTeachSkills(new ArrayList<>());
        user.setLearnSkills(new ArrayList<>());

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getId(), saved.getEmail());
        return new AuthResponse(token, UserDto.from(saved, null));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail());
        return new AuthResponse(token, UserDto.from(user, reviewService.averageRating(user.getId())));
    }
}
