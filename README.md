# Sistema de Gestión de Restaurante (RiVélez)

**Trabajo Final - Sistemas II**
**Universidad Nacional de Villa Mercedes (UNViMe)**
**Carrera:** Ingenieria en Sistemas
**Año:** 2do Año - 2do Cuatrimestre

---

## 📋 Descripción del Proyecto

Este proyecto consiste en el desarrollo de un **Producto Mínimo Viable (MVP)** de un sistema integral para la gestión de un restaurante. El sistema simula el flujo operativo completo de un establecimiento gastronómico, integrando las funcionalidades de los diferentes roles involucrados: Gerente, Cajero, Cocinero y Cliente.

El objetivo principal es demostrar la arquitectura frontend, la lógica de negocio del lado del cliente, la experiencia de usuario (UX/UI) y la interacción entre diferentes módulos funcionales.

## ⚠️ Alcance del Prototipo (MVP)

Es importante destacar que **esta versión es un prototipo funcional del frontend**.

- **Frontend:** Desarrollado completamente en React con TypeScript, implementando lógica robusta de cliente, manejo de estado y validaciones.
- **Backend & Base de Datos:** **Pendiente de implementación**. Actualmente, el sistema utiliza **datos simulados (mock data)** y **almacenamiento local (localStorage)** para persistir el estado durante la sesión.
- **Persistencia:** Al no contar con una base de datos real (SQL/NoSQL) conectada, los cambios pueden perderse si se limpia la caché del navegador o se reinicia el entorno de desarrollo.

### � Próximos Pasos (Hoja de Ruta)
Para convertir este MVP en un producto de producción, se requiere:
1.  **Desarrollo de API RESTful:** Implementación de un backend (Node.js/Express, Python/Django, o similar) para procesar la lógica de negocio en el servidor.
2.  **Integración de Base de Datos:** Migración de los datos mock a una base de datos relacional (PostgreSQL/MySQL) para asegurar la integridad y persistencia de la información.
3.  **Autenticación JWT:** Reemplazar el login simulado por un sistema seguro de tokens.

---

## � Módulos y Funcionalidades

El sistema cuenta con cuatro módulos principales, accesibles mediante un sistema de login basado en roles:

### 👨‍💼 Módulo Gerente
Diseñado para la administración estratégica y operativa.
- **Gestión de Usuarios:** Alta, baja y modificación de personal (Cajeros, Cocineros).
- **Gestión de Menú:** Administración de productos, precios y categorías.
- **Control de Stock:** Visualización de inventario.
- **Reportes:** Dashboard con KPIs de ventas, ocupación y métricas de rendimiento.
- **Promociones:** Configuración de descuentos y ofertas especiales.

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

## 📦 Instalación y Ejecución Local

Para ejecutar el proyecto en su entorno local:

1.  **Pre-requisitos:** Asegúrese de tener instalado Node.js (v18 o superior).
2.  **Clonar el repositorio:**
    (Paso omitido si ya tiene los archivos)
3.  **Instalar dependencias:**
    ```bash
    cd app
    npm install
    ```
4.  **Iniciar servidor de desarrollo:**
    ```bash
    npm run dev
    ```
    El sistema estará disponible en `http://localhost`.

5.  **Compilar para producción:**
    ```bash
    npm run build
    ```

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
