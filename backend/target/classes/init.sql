-- =============================================
-- Script de inicialización de la base de datos
-- RiVélez - Sistema de Gestión de Restaurante
-- =============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS rivelez_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Crear usuario y asignar permisos
CREATE USER IF NOT EXISTS 'rivelez_user'@'localhost' IDENTIFIED BY 'rivelez_pass';
GRANT ALL PRIVILEGES ON rivelez_db.* TO 'rivelez_user'@'localhost';
FLUSH PRIVILEGES;

-- Usar la base de datos
USE rivelez_db;

-- Nota: Las tablas serán creadas automáticamente por Hibernate (ddl-auto=update)
-- Este script solo prepara la base de datos y el usuario
