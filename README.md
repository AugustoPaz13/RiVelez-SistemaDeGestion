# Sistema de Gestión de Restaurante (RiVélez)

**Trabajo Final - Sistemas II**
**Universidad Nacional de Villa Mercedes (UNViMe)**
**Carrera:** Ingenieria en Sistemas
**Año:** 2do Año - 2do Cuatrimestre

---

## 📋 Descripción del Proyecto

Este proyecto consiste en el desarrollo de un **Producto Mínimo Viable (MVP)** de un sistema integral para la gestión de un restaurante. El sistema simula el flujo operativo completo de un establecimiento gastronómico, integrando las funcionalidades de los diferentes roles involucrados: Gerente, Cajero, Cocinero y Cliente.

El objetivo principal es demostrar la arquitectura frontend, la lógica de negocio del lado del cliente, la experiencia de usuario (UX/UI) y la interacción entre diferentes módulos funcionales.

## ⚠️ Estado Actual del Proyecto

### ✅ Completado
- **Frontend:** React con TypeScript, Material-UI, y navegación por roles.
- **Backend:** Spring Boot con API RESTful, Spring Security y Spring Data JPA.
- **Base de Datos:** MySQL con esquema completo (usuarios, productos, mesas, pedidos, stock, promociones).
- **Autenticación JWT:** Login funcional con tokens JWT y BCrypt para contraseñas.
- **Datos Demo:** Carga automática de usuarios, productos y stock al iniciar el backend.
- **Módulo Cocinero Refinado:** UI mejorada con consistencia visual, lógica de cancelación robusta (anti-bypass) y etiquetas claras.
- **Gestión de Mesas:** Implementación del estado "Pagada" con diferenciación visual (color violeta) en Cliente y Cajero.

- **Integración de Datos:** Dashboard de Gerente conectado con datos reales de ventas, ocupación y promedios.
- **Sistema de Reseñas:** Módulo completo para feedback de clientes y panel de administración para gestión.
- **Corrección Pagos QR:** Flujo validado con notificación correcta y manejo de errores.
- **Persistencia Robusta:** Configuración de base de datos para retención de datos entre reinicios y sincronización automática de contadores.

### ⏳ Próximos Pasos (Futuro)
- **Integración con Hardware:** Impresoras de comandas y lectores de códigos de barras.
- **App Móvil Nativa:** Versión compilada para tablets Android/iOS.
- **Despliegue en la Nube:** Alojamiento de Backend y Base de Datos en servidores cloud (AWS/Render) para acceso remoto.

### 🚀 Para ejecutar el sistema completo:

**Terminal 1 - Backend:**
```bash
cd backend
.\mvnw.cmd spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd app
npm run dev
```

Acceder a `http://localhost:3000` y usar las credenciales de demo.

---

## � Módulos y Funcionalidades

El sistema cuenta con cuatro módulos principales, accesibles mediante un sistema de login basado en roles:

### 👨‍💼 Módulo Gerente
Diseñado para la administración estratégica y operativa.
- **Gestión de Usuarios:** Alta, baja y modificación de personal (Cajeros, Cocineros).
- **Gestión de Menú:** Administración de productos, precios y categorías.
- **Control de Stock:** Visualización de inventario.
- **Reportes:** Dashboard con KPIs de ventas, ocupación y métricas de rendimiento con datos en tiempo real.
- **Promociones:** Configuración de descuentos y ofertas especiales.
- **Reseñas de Clientes:** Panel dedicado para visualizar feedback, filtrar por estrellas y monitorear la satisfacción general.

### 🏪 Módulo Cajero
Orientado a la operación de salón.
- **Mapa de Mesas:** Visualización en tiempo real del estado (Libre, Ocupada, Reservada).
- **Procesamiento de Pagos:** Gestión de cobros y generación de comprobantes.
- **Gestión de Pedidos:** Asignación de mesas y cierre de cuentas.

### 👨‍🍳 Módulo Cocinero
Pantalla de visualización para la cocina (Kitchen Display System).
- **Comanda Digital:** Recepción de pedidos en tiempo real.
- **Estados de Pedido:** Flujo de trabajo (Pendiente -> En Preparación -> Listo para Servir).

### 🍽️ Módulo Cliente
Interfaz de autogestión para los comensales.
- **Menú Digital:** Exploración de platos con imágenes y descripciones.
- **Carrito de Compras:** Selección de productos y personalización.
- **Seguimiento:** Visualización del estado del pedido en tiempo real.
- **Feedback:** Posibilidad de calificar la experiencia y dejar comentarios al finalizar el pedido.

---

## 🛠️ Stack Tecnológico

- **Frontend Framework:** React 18
- **Lenguaje:** TypeScript (para tipado estático robusto)
- **Build Tool:** Vite (para desarrollo rápido y optimizado)
- **Estilos:** Tailwind CSS (diseño responsivo y moderno)
- **Componentes UI:** Shadcn/ui (basado en Radix UI)
- **Gestión de Estado:** React Context API
- **Enrutamiento:** React Router DOM v6
- **Gráficos:** Recharts (para dashboard gerencial)
- **Iconografía:** Lucide React

---

## 🌐 Acceso Online (Demo)

¡No es necesario instalar nada para usar el sistema!
Puede acceder a la versión desplegada en la nube acá:
� **[]**

---

## 💻 Instalación y Ejecución Local (Para Desarrolladores)

Si desea descargar el código y ejecutarlo en su propia computadora:

### Opción 1: Ejecución Monolítica (Recomendada)
Esta opción ejecuta el Frontend y Backend juntos en el mismo servidor (puerto 8080), simulando un entorno de producción.

1.  **Ejecutar Script de Inicio:**
    En la raíz del proyecto, ejecutar con PowerShell:
    ```powershell
    .\run_monolith_local.ps1
    ```
    Esto construirá el frontend, lo copiará al backend y ejecutará el servidor.
    
    El sistema estará disponible en `http://localhost:8080`.

### Opción 2: Ejecución Separada (Desarrollo)
Para desarrollar y tener recarga en caliente (HMR).

1.  **Terminal 1 - Backend:**
    ```bash
    cd backend
    .\mvnw.cmd spring-boot:run
    ```

2.  **Terminal 2 - Frontend:**
    ```bash
    cd app
    npm run dev
    ```
    Acceder a `http://localhost:5173`.

---

## ☁️ Despliegue (Deployment)

El proyecto está configurado para desplegarse como un **Monolito Dockerizado** (Frontend servido por Spring Boot).

### Pasos Rápidos para Railway:
1.  Subir el repositorio a GitHub.
2.  Crear proyecto en [Railway](https://railway.app/) desde GitHub.
3.  Agregar base de datos MySQL en Railway.
4.  Configurar variables de entorno en el servicio del backend:
    -   `DB_URL`: `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}`
    -   `DB_USER`: `${{MySQL.MYSQLUSER}}`
    -   `DB_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
    -   `PORT`: `8080`
5.  Railway detectará el `Dockerfile` y desplegará la aplicación completa.

---

## � Credenciales de Acceso (Demo)

Para probar los diferentes roles, utilice las siguientes credenciales:

| Rol | Usuario | Contraseña |
| :--- | :--- | :--- |
| **Gerente** | `gerente` | `admin123` |
| **Cajero** | `cajero1` | `cajero123` |
| **Cocinero** | `cocinero1`| `cocina123` |
| **Cliente** | N/A | Acceso libre ("Escanear QR") |

---

## 📱 Diseño Responsivo

El sistema ha sido desarrollado bajo la metodología Mobile First y Desktop First según el módulo, asegurando su usabilidad en:
- **Tablets/Móviles:** Para módulos de Cliente y Cocinero/Cajero (operativa táctil).
- **Escritorio:** Para el módulo de Gerente (dashboard y administración detallada).

---

**Desarrollado por:** Augusto Paz
**Materia:** Sistemas de Información II
