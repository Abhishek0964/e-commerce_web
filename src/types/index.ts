export * from './database';

// Product types
export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    compare_at_price: number | null;
    category_id: string | null;
    images: string[];
    is_featured: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductWithInventory extends Product {
    inventory?: {
        quantity: number;
        reserved: number;
    };
    category?: {
        name: string;
        slug: string;
    };
}

// Cart types
export interface CartItem {
    id: string;
    product_id: string;
    quantity: number;
    product: Product;
}

// Order types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
    id: string;
    order_number: string;
    user_id: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
    order_status: OrderStatus;
    payment_status: PaymentStatus;
    created_at: string;
    updated_at: string;
}

export interface OrderWithItems extends Order {
    order_items: Array<{
        id: string;
        product_name: string;
        product_image: string | null;
        unit_price: number;
        quantity: number;
        subtotal: number;
    }>;
}

// User types
export interface UserProfile {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    role: 'user' | 'admin';
    avatar_url: string | null;
}

// Address types
export interface Address {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    pincode: string;
    is_default: boolean;
}

// Review types
export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    is_verified_purchase: boolean;
    is_approved: boolean;
    created_at: string;
    user?: {
        full_name: string | null;
        avatar_url: string | null;
    };
}
