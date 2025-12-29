import { User } from '../types';

export const mockUsers: User[] = [
    {
        id: '1',
        username: 'gerente',
        password: 'admin123',
        role: 'gerente',
        nombre: 'Juan Pérez',
        activo: true,
        fechaCreacion: '2024-01-01',
    },
    {
        id: '2',
        username: 'cajero1',
        password: 'cajero123',
        role: 'cajero',
        nombre: 'María González',
        activo: true,
        fechaCreacion: '2024-01-15',
    },
    {
        id: '3',
        username: 'cocinero1',
        password: 'cocina123',
        role: 'cocinero',
        nombre: 'Carlos Rodríguez',
        activo: true,
        fechaCreacion: '2024-01-10',
    },
    {
        id: '4',
        username: 'cajero2',
        password: 'cajero123',
        role: 'cajero',
        nombre: 'Ana Martínez',
        activo: true,
        fechaCreacion: '2024-02-01',
    },
    {
        id: '5',
        username: 'cocinero2',
        password: 'cocina123',
        role: 'cocinero',
        nombre: 'Luis Fernández',
        activo: false,
        fechaCreacion: '2024-01-20',
    },
];
