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
import java.util.List;

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
        private final OrderRepository orderRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) {
                loadUsers();
                loadTables();
                loadProducts();
                loadStock();
                loadPromotions();
                loadOrders();
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
                                        ProductCategory.ENTRADA,
                                        "https://cuk-it.com/wp-content/uploads/2024/05/empanadas-carne-cuchillo-thumb.webp");
                        saveProduct("Provoleta", "Queso provolone a la parrilla con orégano", "4200",
                                        ProductCategory.ENTRADA,
                                        "https://www.los-almendros.com.ar/shop/wp-content/uploads/Receta-recetas-locos-x-la-parrilla-locosxlaparrilla-receta-provoleta-parrilla-provoleta-parrilla-receta-provoleta-provoleta-752x477-1.jpg");
                        saveProduct("Tabla de Fiambres", "Selección de jamón, queso y aceitunas", "5500",
                                        ProductCategory.ENTRADA,
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYAIC1sSogmPPvaV0rF_NLhgyELN1CPOvTGw&s");

                        // Platos Principales
                        saveProduct("Bife de Chorizo", "Corte premium de 400g con guarnición a elección", "12500",
                                        ProductCategory.PRINCIPAL,
                                        "https://www.tasteatlas.com/images/dishes/913891c87f814c73aaa1aae404111922.jpg");
                        saveProduct("Milanesa Napolitana", "Milanesa de ternera con jamón, queso y salsa", "9800",
                                        ProductCategory.PRINCIPAL,
                                        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Milanesa_napolitana_%281%29.jpg/330px-Milanesa_napolitana_%281%29.jpg");
                        saveProduct("Pasta del Día", "Consultar variedad del día", "7500",
                                        ProductCategory.PRINCIPAL,
                                        "https://rebeccasinternationalkitchen.com/wp-content/uploads/2013/11/L9-1024x682.jpg");
                        saveProduct("Suprema de Pollo", "Pechuga grillada con verduras salteadas", "8200",
                                        ProductCategory.PRINCIPAL,
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeVmLwF0CH99s1b2502IAWlkveF8_uOeLp_A&s");

                        // Postres
                        saveProduct("Flan Casero", "Flan con dulce de leche y crema", "3200",
                                        ProductCategory.POSTRE,
                                        "https://argentina.gastronomia.com/media/cache/noticia_grande/uploads/noticias/flan.Q2g4U2VHTmRnV2lKaXJ5dC8vMTQ5OTkxNDg2OC8.jpg");
                        saveProduct("Tiramisú", "Postre italiano con café y mascarpone", "4000",
                                        ProductCategory.POSTRE,
                                        "https://www.cucinare.tv/wp-content/uploads/2020/09/Tiramis%C3%BA-argentino-1579x850.jpg");
                        saveProduct("Helado (3 bochas)", "Selección de sabores artesanales", "3500",
                                        ProductCategory.POSTRE,
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt8GtUHFMttsvU0K1iCzigKIan4fxZpZsV-Q&s");

                        // Bebidas
                        saveProduct("Agua Mineral", "500ml con o sin gas", "1200",
                                        ProductCategory.BEBIDA,
                                        "https://statics.dinoonline.com.ar/imagenes/full_600x600_ma/3040004_f.jpg");
                        saveProduct("Gaseosa", "Línea Coca-Cola 500ml", "1500",
                                        ProductCategory.BEBIDA,
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFvfnPcgeowjERkPX7VvLyRZBuFRUs_flVQ&s");
                        saveProduct("Jugo Natural", "Naranja o Pomelo exprimido", "2200",
                                        ProductCategory.BEBIDA,
                                        "https://arcordiezb2c.vteximg.com.br/arquivos/ids/183684/JUGO-CEPITA-NARANJA-BOT-1-19938.jpg?v=638497641766170000");
                        saveProduct("Café", "Espresso, cortado o con leche", "1800",
                                        ProductCategory.BEBIDA,
                                        "https://img.freepik.com/vector-gratis/taza-realista-cafe-negro-elaborado-ilustracion-vector-platillo_1284-66002.jpg?semt=ais_hybrid&w=740&q=80");

                        // Bebidas Alcohólicas
                        saveProduct("Cerveza Artesanal", "Pinta 500ml - Rubia, Roja o Negra", "3000",
                                        ProductCategory.ALCOHOL,
                                        "https://jumboargentina.vtexassets.com/arquivos/ids/433499-800-600?v=636517616933330000&width=800&height=600&aspect=true");
                        saveProduct("Vino Malbec", "Copa de vino tinto Malbec", "2800",
                                        ProductCategory.ALCOHOL,
                                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTX9PH4rWcda7hMSlPhJfYWAdYj5FDQYA0CpQ&s");
                        saveProduct("Fernet con Coca", "Trago clásico argentino", "3500",
                                        ProductCategory.ALCOHOL,
                                        "https://cdn.v2.tiendanegocio.com/gallery/18711/img_18711_18ef724f4e4.png");

                        log.info("Productos demo creados exitosamente");
                }
        }

        private void saveProduct(String nombre, String des, String precio, ProductCategory cat, String imagen) {
                productRepository.save(Product.builder()
                                .nombre(nombre).descripcion(des).precio(new BigDecimal(precio)).categoria(cat)
                                .imagen(imagen).disponible(true).build());
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

        private void loadOrders() {
                if (orderRepository.count() == 0) {
                        log.info("Cargando pedidos demo para reportes...");

                        List<Product> productos = productRepository.findAll();
                        if (productos.isEmpty()) {
                                log.warn("No hay productos para crear pedidos demo");
                                return;
                        }

                        java.util.Random random = new java.util.Random(42); // Seed fijo para reproducibilidad
                        PaymentMethod[] metodos = PaymentMethod.values();

                        // Crear pedidos para los últimos 7 días
                        for (int dia = 6; dia >= 0; dia--) {
                                LocalDateTime fecha = LocalDateTime.now().minusDays(dia);
                                // Más pedidos en fin de semana
                                int pedidosDelDia = fecha.getDayOfWeek().getValue() >= 5 ? random.nextInt(10) + 8
                                                : random.nextInt(6) + 4;

                                for (int p = 0; p < pedidosDelDia; p++) {
                                        createDemoOrder(productos, metodos, fecha, random, dia * 100 + p);
                                }
                        }

                        log.info("Pedidos demo creados exitosamente: " + orderRepository.count());
                }
        }

        private void createDemoOrder(List<Product> productos, PaymentMethod[] metodos,
                        LocalDateTime fechaBase, java.util.Random random, int orderNum) {

                // Hora aleatoria del día (11:00 - 22:00)
                LocalDateTime fechaCreacion = fechaBase
                                .withHour(11 + random.nextInt(11))
                                .withMinute(random.nextInt(60));

                CustomerOrder order = CustomerOrder.builder()
                                .numeroPedido("PED-DEMO-" + String.format("%04d", orderNum))
                                .numeroMesa(random.nextInt(10) + 1)
                                .personas(random.nextInt(4) + 1)
                                .estado(OrderStatus.PAGADO)
                                .metodoPago(metodos[random.nextInt(metodos.length)])
                                .fechaCreacion(fechaCreacion)
                                .fechaActualizacion(fechaCreacion.plusMinutes(30 + random.nextInt(60)))
                                .subtotal(BigDecimal.ZERO)
                                .total(BigDecimal.ZERO)
                                .items(new java.util.ArrayList<>())
                                .build();

                // Agregar 1-4 items aleatorios
                int numItems = random.nextInt(4) + 1;
                BigDecimal subtotal = BigDecimal.ZERO;

                for (int i = 0; i < numItems; i++) {
                        Product producto = productos.get(random.nextInt(productos.size()));
                        int cantidad = random.nextInt(3) + 1;

                        OrderItem item = OrderItem.builder()
                                        .order(order)
                                        .producto(producto)
                                        .nombreProducto(producto.getNombre())
                                        .cantidad(cantidad)
                                        .precioUnitario(producto.getPrecio())
                                        .build();

                        order.getItems().add(item);
                        subtotal = subtotal.add(producto.getPrecio().multiply(BigDecimal.valueOf(cantidad)));
                }

                // Propina aleatoria (10% de las veces)
                BigDecimal propina = random.nextInt(10) == 0
                                ? subtotal.multiply(new BigDecimal("0.10"))
                                : BigDecimal.ZERO;

                order.setSubtotal(subtotal);
                order.setPropina(propina);
                order.setTotal(subtotal.add(propina));

                orderRepository.save(order);
        }
}
