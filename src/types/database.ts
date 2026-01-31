/**
 * Database types - will be auto-generated from Supabase
 * Run: npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    phone: string | null;
                    role: 'user' | 'admin';
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
            };
            categories: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    image_url: string | null;
                    parent_id: string | null;
                    display_order: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['categories']['Insert']>;
            };
            products: {
                Row: {
                    id: string;
                    name: string;
                    slug: string;
                    description: string | null;
                    price: number;
                    compare_at_price: number | null;
                    category_id: string | null;
                    images: Json;
                    is_featured: boolean;
                    is_active: boolean;
                    meta_title: string | null;
                    meta_description: string | null;
                    view_count: number;
                    created_at: string;
                    updated_at: string;
                    deleted_at: string | null;
                };
                Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'view_count' | 'created_at' | 'updated_at' | 'deleted_at'>;
                Update: Partial<Database['public']['Tables']['products']['Insert']>;
            };
            inventory: {
                Row: {
                    id: string;
                    product_id: string;
                    quantity: number;
                    reserved: number;
                    low_stock_threshold: number;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['inventory']['Row'], 'id' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['inventory']['Insert']>;
            };
            cart_items: {
                Row: {
                    id: string;
                    user_id: string;
                    product_id: string;
                    quantity: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['cart_items']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['cart_items']['Insert']>;
            };
            wishlist_items: {
                Row: {
                    id: string;
                    user_id: string;
                    product_id: string;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['wishlist_items']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['wishlist_items']['Insert']>;
            };
            addresses: {
                Row: {
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
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['addresses']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['addresses']['Insert']>;
            };
            orders: {
                Row: {
                    id: string;
                    user_id: string;
                    order_number: string;
                    subtotal: number;
                    shipping_cost: number;
                    tax: number;
                    total: number;
                    shipping_name: string;
                    shipping_phone: string;
                    shipping_address_line1: string;
                    shipping_address_line2: string | null;
                    shipping_city: string;
                    shipping_state: string;
                    shipping_pincode: string;
                    order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
                    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
                    razorpay_order_id: string | null;
                    razorpay_payment_id: string | null;
                    razorpay_signature: string | null;
                    created_at: string;
                    updated_at: string;
                    paid_at: string | null;
                    shipped_at: string | null;
                    delivered_at: string | null;
                };
                Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at' | 'paid_at' | 'shipped_at' | 'delivered_at'>;
                Update: Partial<Database['public']['Tables']['orders']['Insert']>;
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string;
                    product_name: string;
                    product_image: string | null;
                    unit_price: number;
                    quantity: number;
                    subtotal: number;
                    created_at: string;
                };
                Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id' | 'created_at'>;
                Update: Partial<Database['public']['Tables']['order_items']['Insert']>;
            };
            reviews: {
                Row: {
                    id: string;
                    product_id: string;
                    user_id: string;
                    rating: number;
                    title: string | null;
                    comment: string | null;
                    is_verified_purchase: boolean;
                    is_approved: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
            };
        };
        Functions: {
            reserve_inventory: {
                Args: { p_product_id: string; p_quantity: number };
                Returns: boolean;
            };
            commit_inventory: {
                Args: { p_product_id: string; p_quantity: number };
                Returns: void;
            };
            release_inventory: {
                Args: { p_product_id: string; p_quantity: number };
                Returns: void;
            };
        };
    };
}
