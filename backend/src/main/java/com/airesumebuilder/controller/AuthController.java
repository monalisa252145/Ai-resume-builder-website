package com.airesumebuilder.controller;

import com.airesumebuilder.dto.AuthResponse;
import com.airesumebuilder.dto.LoginRequest;
import com.airesumebuilder.dto.RegisterRequest;
import com.airesumebuilder.model.User;
import com.airesumebuilder.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(401).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "Not authenticated"));
        }
        User user = authService.getCurrentUser(userDetails.getUsername());
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "User not found"));
        }
        return ResponseEntity.ok(Map.of(
                "success", true,
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }
}
