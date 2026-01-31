import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ProductWithDetails } from '@/types/product';

// Cart Item extends basic product info
export interface CartItem {
    id: string; // Product ID
    slug: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    maxStock: number;
    variantId?: string; // For future variants
}

interface CartStore {
    items: CartItem[];
    isOpen: boolean;

    // Actions
    addItem: (product: ProductWithDetails, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;

    // UI Actions
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;

    // Computed
    getTotalItems: () => number;
    getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, quantity = 1) => {
                const currentItems = get().items;
                const existingItem = currentItems.find((item) => item.id === product.id);

                // Calculate stock limit
                const maxStock = (product.inventory?.quantity || 0) - (product.inventory?.reserved || 0);

                if (existingItem) {
                    // Update quantity if item exists
                    const newQuantity = Math.min(existingItem.quantity + quantity, maxStock);

                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: newQuantity, maxStock } // Update maxStock too in case it changed
                                : item
                        ),
                        isOpen: true, // Auto-open drawer
                    });
                } else {
                    // Add new item
                    const newItem: CartItem = {
                        id: product.id,
                        slug: product.slug,
                        name: product.name,
                        price: product.price, // Using current price (ignoring sale logic for simplicity for now, ideally checks sale_price)
                        image: product.images?.[0]?.url,
                        quantity: Math.min(quantity, maxStock),
                        maxStock,
                    };

                    set({
                        items: [...currentItems, newItem],
                        isOpen: true, // Auto-open drawer
                    });
                }
            },

            removeItem: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                const { items } = get();
                const item = items.find((i) => i.id === productId);

                if (!item) return;

                // Clamp quantity between 1 and maxStock
                const validQuantity = Math.max(1, Math.min(quantity, item.maxStock));

                set({
                    items: items.map((i) =>
                        i.id === productId ? { ...i, quantity: validQuantity } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),

            openDrawer: () => set({ isOpen: true }),
            closeDrawer: () => set({ isOpen: false }),
            toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getSubtotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'shophub-cart', // unique name for localStorage
            storage: createJSONStorage(() => localStorage), // use localStorage
            skipHydration: true, // we'll handle hydration manually to avoid server match errors
        }
    )
);
