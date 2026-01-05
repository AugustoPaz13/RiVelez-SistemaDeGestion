package com.rivelez.dto;

import com.rivelez.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferir información de usuario (sin contraseña)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String username;
    private String nombre;
    private UserRole role;
    private boolean activo;
    private LocalDateTime fechaCreacion;
}
