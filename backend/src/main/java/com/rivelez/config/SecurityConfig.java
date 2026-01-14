package com.rivelez.config;

import com.rivelez.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.Customizer;

/**
 * Configuración de Spring Security
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Recursos estáticos frontend (Monolito)
                        .requestMatchers("/", "/index.html", "/assets/**", "/vite.svg", "/*.ico", "/*.json", "/*.png")
                        .permitAll()
                        // Endpoints públicos
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/health").permitAll()
                        .requestMatchers("/api/debug/**").permitAll() // DEBUG
                        .requestMatchers("/api/public/**").permitAll()
                        // Endpoints de productos (lectura pública)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/products/**").permitAll()
                        // Endpoints de mesas (lectura pública)
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/tables/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/tables/*/release").permitAll()
                        // Endpoints para pedidos de clientes
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/orders").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/orders/table/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/orders/numero/**").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/orders/*").permitAll() // Permitir
                                                                                                                  // cancelación
                                                                                                                  // por
                                                                                                                  // cliente
                                                                                                                  // (soft
                                                                                                                  // delete)
                        // Endpoints de promociones (lectura pública de activas)
                        .requestMatchers("/api/promotions/active").permitAll()
                        // Endpoints de reseñas (público para clientes)
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/reviews").permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/reviews/**").permitAll()
                        // Endpoints protegidos por rol
                        .requestMatchers("/api/gerente/**").hasRole("GERENTE")
                        .requestMatchers("/api/cajero/**").hasAnyRole("GERENTE", "CAJERO")
                        .requestMatchers("/api/cocinero/**").hasAnyRole("GERENTE", "COCINERO")
                        .requestMatchers("/api/cliente/**").hasAnyRole("GERENTE", "CAJERO", "COCINERO", "CLIENTE")
                        .requestMatchers("/api/stock/**").hasAnyRole("GERENTE", "COCINERO")
                        // Rutas de React Router (SPA) - Permitir acceso para que el index.html las
                        // maneje
                        .requestMatchers("/login", "/admin/**", "/cocina", "/cajero", "/menu").permitAll()
                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
