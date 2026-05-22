package com.example.tasktracker.auth;

public record AuthResponse(String token, Long userId, String email, String displayName) {
}
