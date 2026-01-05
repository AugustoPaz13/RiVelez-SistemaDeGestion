package com.rivelez.config;

import com.rivelez.entity.*;
import com.rivelez.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Carga datos iniciales en la base de datos al arrancar la aplicación
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

        private final UserRepository userRepository;
        private final TableRepository tableRepository;
        private final ProductRepository productRepository;
        private final StockItemRepository stockItemRepository;
        private final StockMovementRepository stockMovementRepository;
        private final PromotionRepository promotionRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                loadUsers();
                loadTables();
                loadProducts();
                loadStock();
                loadPromotions();
        }

        private void loadUsers() {
                System.out.println("DEBUG: Iniciando loadUsers(). Count: " + userRepository.count());

                // Primero verificar si los usuarios demo existen con passwords correctos
                var existingGerente = userRepository.findByUsername("gerente");
                if (existingGerente.isPresent()) {
                        // Verificar si la contraseña coincide
                        boolean passwordOk = passwordEncoder.matches("admin123", existingGerente.get().getPassword());
                        System.out.println("DEBUG: Gerente existe, password OK: " + passwordOk);

                        if (!passwordOk) {
                                // Actualizar el password del gerente
                                User gerente = existingGerente.get();
                                String newPassword = passwordEncoder.encode("admin123");
                                System.out.println("DEBUG: Actualizando password de gerente. Nuevo hash: "
                                                + newPassword.substring(0, 20) + "...");
                                gerente.setPassword(newPassword);
                                userRepository.save(gerente);
                                System.out.println("DEBUG: Password de gerente actualizado");
                        }
                } else if (userRepository.count() == 0) {
                        log.info("Cargando usuarios demo...");
                        System.out.println("DEBUG: Creando usuarios...");

                        String gerentePassword = passwordEncoder.encode("admin123");
                        System.out.println(
                                        "DEBUG: Password gerente encoded: " + gerentePassword.substring(0, 20) + "...");

                        userRepository.save(User.builder()
                                        .username("gerente").password(gerentePassword)
                                        .nombre("Gerente Principal").role(UserRole.GERENTE).activo(true).build());

                        userRepository.save(User.builder()
                                        .username("cajero1").password(passwordEncoder.encode("cajero123"))
                                        .nombre("Juan Cajero").role(UserRole.CAJERO).activo(true).build());

                        userRepository.save(User.builder()
                                        .username("cocinero1").password(passwordEncoder.encode("cocina123"))
                                        .nombre("María Cocinera").role(UserRole.COCINERO).activo(true).build());

                        log.info("Usuarios demo creados exitosamente");
                }
        }

        private void loadTables() {
                if (tableRepository.count() == 0) {
                        log.info("Cargando mesas demo...");

                        for (int i = 1; i <= 10; i++) {
                                tableRepository.save(RestaurantTable.builder()
                                                .numero(i)
                                                .capacidad(i <= 4 ? 2 : (i <= 7 ? 4 : 6))
                                                .estado(TableStatus.AVAILABLE)
                                                .build());
                        }
                        log.info("10 mesas creadas exitosamente");
                }
        }

        private void loadProducts() {
                if (productRepository.count() == 0) {
                        log.info("Cargando productos demo...");

                        // Entradas
                        saveProduct("Empanadas (x3)", "Empanadas caseras de carne cortada a cuchillo", "3500",
                                        ProductCategory.ENTRADA);
                        saveProduct("Provoleta", "Queso provolone a la parrilla con orégano", "4200",
                                        ProductCategory.ENTRADA);
                        saveProduct("Tabla de Fiambres", "Selección de jamón, queso y aceitunas", "5500",
                                        ProductCategory.ENTRADA);

                        // Platos Principales
                        saveProduct("Bife de Chorizo", "Corte premium de 400g con guarnición a elección", "12500",
                                        ProductCategory.PRINCIPAL);
                        saveProduct("Milanesa Napolitana", "Milanesa de ternera con jamón, queso y salsa", "9800",
                                        ProductCategory.PRINCIPAL);
                        saveProduct("Pasta del Día", "Consultar variedad del día", "7500", ProductCategory.PRINCIPAL);
                        saveProduct("Suprema de Pollo", "Pechuga grillada con verduras salteadas", "8200",
                                        ProductCategory.PRINCIPAL);

                        // Postres
                        saveProduct("Flan Casero", "Flan con dulce de leche y crema", "3200", ProductCategory.POSTRE);
                        saveProduct("Tiramisú", "Postre italiano con café y mascarpone", "4000",
                                        ProductCategory.POSTRE);
                        saveProduct("Helado (3 bochas)", "Selección de sabores artesanales", "3500",
                                        ProductCategory.POSTRE);

                        // Bebidas
                        saveProduct("Agua Mineral", "500ml con o sin gas", "1200", ProductCategory.BEBIDA);
                        saveProduct("Gaseosa", "Línea Coca-Cola 500ml", "1500", ProductCategory.BEBIDA);
                        saveProduct("Jugo Natural", "Naranja o Pomelo exprimido", "2200", ProductCategory.BEBIDA);
                        saveProduct("Café", "Espresso, cortado o con leche", "1800", ProductCategory.BEBIDA);

                        // Bebidas Alcohólicas
                        saveProduct("Cerveza Artesanal", "Pinta 500ml - Rubia, Roja o Negra", "3000",
                                        ProductCategory.ALCOHOL);
                        saveProduct("Vino Malbec", "Copa de vino tinto Malbec", "2800", ProductCategory.ALCOHOL);
                        saveProduct("Fernet con Coca", "Trago clásico argentino", "3500", ProductCategory.ALCOHOL);

                        log.info("Productos demo creados exitosamente");
                }
        }

        private void saveProduct(String nombre, String des, String precio, ProductCategory cat) {
                productRepository.save(Product.builder()
                                .nombre(nombre).descripcion(des).precio(new BigDecimal(precio)).categoria(cat)
                                .disponible(true).build());
        }

        private void loadStock() {
                if (stockItemRepository.count() == 0) {
                        log.info("Cargando stock demo...");
                        createStockItem("Lomo", 50, 10, "kg", new BigDecimal("8000"));
                        createStockItem("Pollo", 30, 5, "kg", new BigDecimal("4500"));
                        createStockItem("Carne Picada", 20, 5, "kg", new BigDecimal("5000"));
                        createStockItem("Papas", 100, 20, "kg", new BigDecimal("800"));
                        createStockItem("Cebolla", 40, 10, "kg", new BigDecimal("600"));
                        createStockItem("Tomate", 30, 5, "kg", new BigDecimal("1200"));
                        createStockItem("Lechuga", 20, 5, "kg", new BigDecimal("1500"));
                        createStockItem("Coca Cola 500ml", 120, 24, "unidad", new BigDecimal("800"));
                        createStockItem("Agua Mineral", 100, 24, "unidad", new BigDecimal("600"));
                        createStockItem("Cerveza Rubia", 60, 12, "litro", new BigDecimal("1800"));
                        createStockItem("Harina 0000", 50, 10, "kg", new BigDecimal("900"));
                        createStockItem("Huevos", 30, 6, "docena", new BigDecimal("1800"));
                        createStockItem("Queso Mozzarella", 25, 5, "kg", new BigDecimal("6500"));
                        createStockItem("Pan", 40, 10, "kg", new BigDecimal("1200"));
                        log.info("Stock demo cargado exitosamente");
                }
        }

        private void createStockItem(String nombre, int cantidad, int minimo, String unidad, BigDecimal costo) {
                StockItem item = StockItem.builder()
                                .nombre(nombre).cantidadActual(cantidad).cantidadMinima(minimo)
                                .unidadMedida(unidad).costoUnitario(costo).build();
                StockItem saved = stockItemRepository.save(item);
                stockMovementRepository.save(StockMovement.builder()
                                .item(saved).tipo(StockMovementType.ENTRADA).cantidad(cantidad)
                                .motivo("Stock Inicial").fecha(java.time.LocalDateTime.now()).build());
        }

        private void loadPromotions() {
                if (promotionRepository.count() == 0) {
                        log.info("Cargando promociones demo...");

                        promotionRepository.save(Promotion.builder()
                                        .nombre("Happy Hour Cerveza")
                                        .description("2x1 en cervezas artesanales de 18:00 a 20:00")
                                        .porcentajeDescuento(50.0)
                                        .fechaInicio(LocalDateTime.now().minusDays(1))
                                        .fechaFin(LocalDateTime.now().plusMonths(1))
                                        .activa(true)
                                        .build());

                        promotionRepository.save(Promotion.builder()
                                        .nombre("Descuento Mediodía")
                                        .description("20% de descuento en todos los platos principales")
                                        .porcentajeDescuento(20.0)
                                        .fechaInicio(LocalDateTime.now().minusDays(1))
                                        .fechaFin(LocalDateTime.now().plusMonths(3))
                                        .activa(true)
                                        .build());

                        log.info("Promociones cargadas exitosamente");
                }
        }
}
