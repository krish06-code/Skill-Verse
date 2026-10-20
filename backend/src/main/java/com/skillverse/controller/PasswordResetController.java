package com.skillverse.controller;

import com.skillverse.dto.Dtos.ForgotPasswordRequest;
import com.skillverse.dto.Dtos.OkResponse;
import com.skillverse.dto.Dtos.ResetPasswordRequest;
import com.skillverse.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot-password")
    public OkResponse forgot(@Valid @RequestBody ForgotPasswordRequest request) {
        passwordResetService.requestReset(request.email());
        return new OkResponse(true);
    }

    @PostMapping("/reset-password")
    public OkResponse reset(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.token(), request.password());
        return new OkResponse(true);
    }
}
