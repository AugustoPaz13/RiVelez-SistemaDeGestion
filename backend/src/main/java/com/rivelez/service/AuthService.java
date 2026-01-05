package com.rivelez.service;

import com.rivelez.dto.AuthResponse;
import com.rivelez.dto.LoginRequest;
import com.rivelez.dto.RegisterRequest;
import com.rivelez.dto.UserDTO;
import com.rivelez.entity.User;
import com.rivelez.repository.UserRepository;
import com.rivelez.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Servicio de autenticación
 */
@Service
@RequiredArgsConstructor
public class AuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final AuthenticationManager authenticationManager;

        /**
         * Registra un nuevo usuario
         */
        public AuthResponse register(RegisterRequest request) {
                // Verificar si el usuario ya existe
                if (userRepository.existsByUsername(request.getUsername())) {
                        return AuthResponse.builder()
                                        .message("El usuario ya existe")
                                        .build();
                }

                // Crear el usuario
                User user = User.builder()
                                .username(request.getUsername())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .nombre(request.getNombre())
                                .role(request.getRole())
                                .activo(true)
                                .build();

                userRepository.save(user);

                // Generar token
                String token = jwtService.generateToken(user);

                return AuthResponse.builder()
                                .token(token)
                                .username(user.getUsername())
                                .nombre(user.getNombre())
                                .role(user.getRole())
                                .message("Usuario registrado exitosamente")
                                .build();
        }

        /**
         * Autentica un usuario existente
         */
        public AuthResponse login(LoginRequest request) {
                try {
                        // Verificar si el usuario existe
                        var optUser = userRepository.findByUsername(request.getUsername());
                        if (optUser.isEmpty()) {
                                return AuthResponse.builder().message("Usuario no encontrado").build();
                        }

                        User dbUser = optUser.get();

                        // Verificar password
                        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), dbUser.getPassword());

                        if (!passwordMatches) {
                                return AuthResponse.builder().message("Contraseña incorrecta").build();
                        }

                        if (!dbUser.isActivo()) {
                                return AuthResponse.builder().message("Usuario desactivado").build();
                        }

                        // Autenticar con Spring Security
                        authenticationManager.authenticate(
                                        new UsernamePasswordAuthenticationToken(
                                                        request.getUsername(),
                                                        request.getPassword()));

                        String token = jwtService.generateToken(dbUser);

                        return AuthResponse.builder()
                                        .token(token)
                                        .username(dbUser.getUsername())
                                        .nombre(dbUser.getNombre())
                                        .role(dbUser.getRole())
                                        .message("Login exitoso")
                                        .build();
                } catch (Exception e) {
                        return AuthResponse.builder()
                                        .message("Credenciales inválidas")
                                        .build();
                }
        }

        /**
         * Obtiene la información del usuario autenticado
         */
        public UserDTO getCurrentUser(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

                return UserDTO.builder()
                                .id(user.getId())
                                .username(user.getUsername())
                                .nombre(user.getNombre())
                                .role(user.getRole())
                                .activo(user.isActivo())
                                .fechaCreacion(user.getFechaCreacion())
                                .build();
        }
}
