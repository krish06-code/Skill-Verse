package com.skillverse.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;
    // 64-byte secret suitable for HMAC-SHA512
    private static final String SECRET = "9d723d653b119b64b6cb033b71779fec5d521b7d0e1ff2c9e6adca8c45299583";
    private static final long EXPIRATION = 86400000L;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, EXPIRATION);
    }

    @Test
    @DisplayName("generateToken produces valid token and extractUserId retrieves subject")
    void tokenGenerationAndExtraction() {
        String userId = "student_12345";
        String email = "test@skillverse.com";

        String token = jwtService.generateToken(userId, email);
        assertThat(token).isNotBlank();

        String extractedId = jwtService.extractUserId(token);
        assertThat(extractedId).isEqualTo(userId);
    }
}
