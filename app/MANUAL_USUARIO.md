# Manual de Usuario - Sistema RiVelez

Este manual describe cómo utilizar las funcionalidades principales del sistema para cada perfil de usuario.

---

## 1. Acceso al Sistema

Al ingresar a la aplicación, verá la pantalla de inicio de sesión.
- **Personal (Gerente, Cajero, Cocinero):** Ingrese su usuario y contraseña.
- **Clientes:** Pueden escanear el código QR (simulado) o ingresar directamente a la interfaz de cliente sin login.

> **Usuarios de prueba:**
> - Gerente: `gerente` / `admin123`
> - Cajero: `cajero1` / `cajero123`
> - Cocinero: `cocinero1` / `cocina123`

---

## 2. Módulo Gerente

El Gerente tiene acceso total a la administración.

### 2.1 Dashboard
- **Vista General:** Al ingresar, verá gráficos de ventas y métricas clave del día.
- **Navegación:** Utilice la barra lateral para acceder a las distintas secciones.

### 2.2 Gestión de Usuarios
- Vaya a la sección **Usuarios**.
- **Crear:** Haga clic en "Nuevo Usuario", complete los datos y seleccione el rol.
- **Editar/Eliminar:** Use los botones de acción en la tabla de usuarios existente.

### 2.3 Reportes
- Acceda a **Reportes** para ver estadísticas detalladas.
- Puede filtrar las ventas por fecha o categoría de producto.

---

## 3. Módulo Cajero

El Cajero es responsable de las mesas y los cobros.

### 3.1 Vista de Mesas
- Verá un mapa de todas las mesas del restaurante con códigos de color:
    - 🟢 **Verde:** Libre
    - 🔴 **Rojo:** Ocupada
    - 🟡 **Amarillo:** Reservada

### 3.2 Cobrar una Mesa
1.  Haga clic en una mesa **Ocupada**.
2.  Verá el detalle del pedido.
3.  Haga clic en **"Procesar Pago"**.
4.  Seleccione el método (Efectivo o Tarjeta).
5.  Confirme la operación para liberar la mesa.

---

## 4. Módulo Cocinero

El Cocinero gestiona la preparación de los platos.

### 4.1 Comanda Digital
- Los pedidos nuevos aparecen automáticamente en la pantalla como tarjetas.
- **Iniciar Preparación:** Haga clic en "Comenzar" o arrastre el pedido a "En Proceso".
- **Finalizar Plato:** Cuando la comida esté lista, marque el pedido como "Listo para Servir" para notificar al mozo/cajero.

---

## 5. Módulo Cliente

Interfaz para el comensal en la mesa.

### 5.1 Realizar Pedido
1.  Seleccione su número de mesa (si no ingresó por QR).
2.  Navegue por el menú digital y agregue productos con el botón **"+"**.
3.  Toque el icono del **Carrito** para revisar su selección.
4.  Presione **"Confirmar Pedido"** para enviarlo a cocina.

### 5.2 Pedir la Cuenta
- Desde la vista de estado de pedido, puede solicitar la cuenta o pagar digitalmente (funcionalidad simulada).
