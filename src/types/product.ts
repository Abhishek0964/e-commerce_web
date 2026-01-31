import { Database } from './database';

// Base types from database
export type Category = Database['public']['Tables']['categories']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Inventory = Database['public']['Tables']['inventory']['Row'];

// Product image structure
export interface ProductImage {
    url: string;
    alt: string;
}

// Extended product with computed fields
export interface ProductWithDetails extends Product {
    category?: Category | null;
    inventory?: Inventory | null;
    available_stock?: number;
}

// Product filters for listing
export interface ProductFilters {
    category?: string;
    search?: string;
    is_featured?: boolean;
    min_price?: number;
    max_price?: number;
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

// Pagination
export interface PaginationParams {
    page?: number;
    limit?: number;
}

// Product list response
export interface ProductListResponse {
    products: ProductWithDetails[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
