import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
    // Cart functionality will be wired up with Zustand store later
    const cartItems: any[] = [];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <EmptyState
                        icon={<ShoppingCart className="h-16 w-16" />}
                        title="Your cart is empty"
                        description="Add some products to get started"
                        action={{
                            label: 'Browse Products',
                            href: '/products',
                        }}
                    />
                ) : (
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Cart Items */}
                        <div className="space-y-4 lg:col-span-2">
                            {/* Cart items will be rendered here */}
                        </div>

                        {/* Order Summary */}
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹0</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>₹0</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                    <span>Total</span>
                                    <span>₹0</span>
                                </div>
                            </div>
                            <Link href="/checkout" className="mt-6 block">
                                <Button size="lg" className="w-full">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
