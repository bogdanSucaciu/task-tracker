package com.example.tasktracker.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.tasktracker.user.User;
import com.example.tasktracker.user.UserRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

class AuthServiceTest {

    private final UserRepository userRepository = Mockito.mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtService jwtService = new JwtService("test-secret-test-secret-test-secret-1234", 60);
    private final AuthService authService = new AuthService(userRepository, passwordEncoder, jwtService);

    @Test
    void registerCreatesUserAndReturnsToken() {
        RegisterRequest request = new RegisterRequest("USER@example.com", "password123", "User One");
        when(userRepository.existsByEmail("user@example.com")).thenReturn(false);

        AuthResponse response = authService.register(request);

        assertThat(response.token()).isNotBlank();
        assertThat(response.email()).isEqualTo("user@example.com");
        verify(userRepository).save(Mockito.any(User.class));
    }

    @Test
    void loginRejectsWrongPassword() {
        User user = new User("user@example.com", "User One", passwordEncoder.encode("password123"));
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        assertThatThrownBy(() -> authService.login(new LoginRequest("user@example.com", "wrong-password")))
            .isInstanceOf(BadCredentialsException.class);
    }
}
