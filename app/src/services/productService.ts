import api from './api';
import { Product, ProductCategory } from '../types';

// Interfaces para requests del backend
interface ProductRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string; // Backend espera string en mayúsculas
    disponible: boolean;
    imagen?: string;
    ingredientes?: string;
}

// Interface de respuesta del backend (usa Long/number para id)
interface ProductDTO {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: string; // Viene en minúsculas del backend
    disponible: boolean;
    imagen?: string;
    ingredientes?: string;
}

// Convierte ProductDTO del backend a Product del frontend
const mapProductDTOToProduct = (dto: ProductDTO): Product => ({
    id: dto.id.toString(),
    nombre: dto.nombre,
    descripcion: dto.descripcion || '',
    precio: dto.precio,
    categoria: dto.categoria as ProductCategory,
    disponible: dto.disponible,
    imagen: dto.imagen,
    ingredientes: typeof dto.ingredientes === 'string' ? dto.ingredientes.split(',').map(i => i.trim()) : [],
});

// Convierte Product del frontend a ProductRequest del backend
const mapProductToRequest = (product: Partial<Product>): ProductRequest => ({
    nombre: product.nombre || '',
    descripcion: product.descripcion || '',
    precio: product.precio || 0,
    categoria: (product.categoria || 'principal').toUpperCase(),
    disponible: product.disponible ?? true,
    imagen: product.imagen,
    ingredientes: product.ingredientes?.join(', '),
});

export const productService = {
    // Obtener todos los productos
    getAll: async (): Promise<Product[]> => {
        const response = await api.get<ProductDTO[]>('/products');
        return response.data.map(mapProductDTOToProduct);
    },

    // Obtener productos disponibles
    getAvailable: async (): Promise<Product[]> => {
        const response = await api.get<ProductDTO[]>('/products/available');
        return response.data.map(mapProductDTOToProduct);
    },

    // Obtener producto por ID
    getById: async (id: string): Promise<Product> => {
        const response = await api.get<ProductDTO>(`/products/${id}`);
        return mapProductDTOToProduct(response.data);
    },

    // Obtener productos por categoría
    getByCategory: async (category: ProductCategory): Promise<Product[]> => {
        const response = await api.get<ProductDTO[]>(`/products/category/${category.toUpperCase()}`);
        return response.data.map(mapProductDTOToProduct);
    },

    // Buscar productos
    search: async (query: string): Promise<Product[]> => {
        const response = await api.get<ProductDTO[]>(`/products/search?q=${encodeURIComponent(query)}`);
        return response.data.map(mapProductDTOToProduct);
    },

    // Crear producto
    create: async (product: Partial<Product>): Promise<Product> => {
        const response = await api.post<ProductDTO>('/products', mapProductToRequest(product));
        return mapProductDTOToProduct(response.data);
    },

    // Actualizar producto
    update: async (id: string, product: Partial<Product>): Promise<Product> => {
        const response = await api.put<ProductDTO>(`/products/${id}`, mapProductToRequest(product));
        return mapProductDTOToProduct(response.data);
    },

    // Cambiar disponibilidad
    toggleAvailability: async (id: string): Promise<Product> => {
        const response = await api.patch<ProductDTO>(`/products/${id}/toggle-availability`);
        return mapProductDTOToProduct(response.data);
    },

    // Eliminar producto
    delete: async (id: string): Promise<void> => {
        await api.delete(`/products/${id}`);
    },
};
