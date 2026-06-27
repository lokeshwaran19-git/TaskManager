package com.taskflow.controller;

import com.taskflow.dto.ApiResponse;
import com.taskflow.dto.LoginRequest;
import com.taskflow.dto.LoginResponse;
import com.taskflow.dto.RegisterRequest;
import com.taskflow.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> registerUser(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> loginUser(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }
}
