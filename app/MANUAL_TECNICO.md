# Manual Técnico - Sistema RiVelez

## 1. Arquitectura del Sistema

El sistema sigue una arquitectura de **Single Page Application (SPA)** basada en componentes. La lógica de negocio está desacoplada de la interfaz de usuario mediante hooks personalizados y contextos (Context API), permitiendo una gestión de estado limpia y escalar.

### 1.1 Diagrama Conceptual (Frontend MVP)

```mermaid
graph TD
    User[Usuario] -->|Interactúa| UI[Interfaz de Usuario (React)]
    UI -->|Consume| Contexts[Contextos (Auth, AppState)]
    Contexts -->|Lee/Escribe| MockData[Datos Mock (Memoria/LocalStorage)]
    MockData -.->|Simula| DB[Base de Datos (Futuro)]
```

## 2. Estructura de Directorios

El proyecto sigue una estructura modular organizada funcionalidad y tipo de recurso.

```
app/src/
├── components/         # Bloques constructivos de la UI
│   ├── cajero/         # Componentes específicos del módulo Cajero
│   ├── cliente/        # Componentes específicos del módulo Cliente
│   ├── cocinero/       # Componentes específicos del módulo Cocinero
│   ├── gerente/        # Componentes específicos del módulo Gerente
│   ├── layout/         # Componentes estructurales (Navbar, Sidebar)
│   └── ui/             # Biblioteca de componentes base (Botones, Inputs, Cards)
│
├── contexts/           # Gestión de estado global
│   ├── AuthContext.tsx # Manejo de sesión y roles
│   └── (Otros contextos globales)
│
├── data/               # Capa de Datos Simulada (Mock Data)
│   ├── mockData.ts     # Definición de usuarios, productos y mesas iniciales
│   └── ...
│
├── pages/              # Vistas principales (Rutas)
│   ├── cajero/         # Pantallas accesibles por rol Cajero
│   ├── cliente/        # Pantallas accesibles por rol Cliente
│   ├── cocinero/       # Pantallas accesibles por rol Cocinero
│   └── gerente/        # Pantallas accesibles por rol Gerente
│
├── types/              # Definiciones de Tipos TypeScript (Interfaces)
│   ├── index.ts        # Tipos globales (User, Product, Order)
│   └── ...
│
└── utils/              # Funciones auxiliares y helpers
```

## 3. Principales Decisiones Técnicas

### 3.1 Gestión de Estado
Se optó por **React Context API** en lugar de Redux para este MVP debido a que la complejidad del estado global es moderada. Context permite compartir datos como el usuario autenticado y el estado del carrito de compras sin "prop drilling" excesivo.

### 3.2 Persistencia de Datos (Simulada)
Para evitar que los datos se reinicien al recargar la página durante una demostración, se implementaron mecanismos que sincronizan el estado en memoria con `localStorage`.
- **Lectura:** Al iniciar, la aplicación intenta leer el estado guardado.
- **Escritura:** Cada cambio crítico (nuevo pedido, cambio de usuario) actualiza el almacenamiento local.

### 3.3 Estilos y Diseño
Se utilizó **Tailwind CSS** para agilizar el desarrollo mediante clases de utilidad. Esto permite:
- Consistencia en el diseño (colores, espaciados).
- Facilidad para implementar diseño responsivo.
- Reducción del tamaño del bundle CSS final (purga de estilos no usados).

## 4. Tipado de Datos (TypeScript)

El uso de TypeScript asegura la integridad de los datos a través de interfaces estrictas.

**Ejemplo de Interfaces Core:**

```typescript
// Usuario del sistema
export interface User {
    id: string;
    username: string;
    role: 'gerente' | 'cajero' | 'cocinero' | 'cliente';
    nombre: string;
}

// Producto del menú
export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    available: boolean;
}
```

## 5. Seguridad (Simulada para MVP)

- **Rutas Protegidas:** Se implementó un componente `ProtectedRoute` que verifica si existe un usuario autenticado en el contexto antes de renderizar las rutas privadas.
- **Control de Roles:** Además de estar autenticado, el sistema valida que el rol del usuario coincida con los permisos requeridos para la ruta específica (ej. un Cajero no puede acceder a `/gerente`).

---
**Nota:** Este documento técnico describe la implementación actual del prototipo. La versión final de producción requerirá documentación adicional sobre la API del servidor y el esquema de base de datos relacional.
