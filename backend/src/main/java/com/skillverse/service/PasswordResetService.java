package com.skillverse.service;

import com.skillverse.model.PasswordResetToken;
import com.skillverse.model.User;
import com.skillverse.repository.PasswordResetTokenRepository;
import com.skillverse.repository.UserRepository;
import com.skillverse.web.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class PasswordResetService {

    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long TOKEN_TTL_MINUTES = 60;

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;

    @Value("${skillverse.app.base-url:http://localhost:8080}")
    private String appBaseUrl;

    public PasswordResetService(UserRepository userRepository,
                                PasswordResetTokenRepository tokenRepository,
                                PasswordEncoder passwordEncoder,
                                MailService mailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailService = mailService;
    }

    /** Always succeeds from the caller's point of view so emails cannot be enumerated. */
    public void requestReset(String email) {
        Optional<User> maybeUser = userRepository.findByEmailIgnoreCase(email.trim());
        if (maybeUser.isEmpty()) return;

        User user = maybeUser.get();
        tokenRepository.deleteByUserId(user.getId());

        byte[] raw = new byte[32];
        RANDOM.nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);

        tokenRepository.save(new PasswordResetToken(
                hash(token), user.getId(), Instant.now().plus(TOKEN_TTL_MINUTES, ChronoUnit.MINUTES)));

        String link = appBaseUrl.replaceAll("/+$", "") + "/reset-password?token=" + token;
        mailService.send(
                user.getEmail(),
                "Reset your Skill Verse password",
                "Hi " + user.getName() + ",\n\n"
                        + "We received a request to reset your Skill Verse password.\n"
                        + "Open the link below within " + TOKEN_TTL_MINUTES + " minutes to choose a new password:\n\n"
                        + link + "\n\n"
                        + "If you did not request this, you can safely ignore this email.\n");
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken record = tokenRepository.findByTokenHash(hash(token))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "This reset link is invalid or has already been used"));

        if (record.isUsed() || record.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "This reset link has expired. Please request a new one.");
        }

        User user = userRepository.findById(record.getUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Account no longer exists"));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        record.setUsed(true);
        tokenRepository.save(record);
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
