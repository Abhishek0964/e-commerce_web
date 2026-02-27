'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartPage() {
  // Mock cart data - will be replaced with real cart context/state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      price: 199.99,
      quantity: 1,
      image: '/images/product-1.jpg',
    },
    {
      id: '3',
      name: 'USB-C Cable Bundle',
      price: 24.99,
      quantity: 2,
      image: '/images/product-3.jpg',
    },
  ]);

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <ScrollFrameAnimation className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your cart is empty
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Add some products to your cart to get started.
          </p>
          <Link href="/products">
            <Button size="lg" className="button-primary">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </ScrollFrameAnimation>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <ScrollFrameAnimation className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
      </ScrollFrameAnimation>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="surface-elevated rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {cartItems.map((item, index) => (
                <ScrollFrameAnimation
                  key={item.id}
                  delay={index * 0.1}
                  className="p-6 flex gap-6 items-center"
                >
                  {/* Product image */}
                  <div className="w-24 h-24 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E';
                      }}
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="font-semibold text-foreground hover:text-primary transition-colors mb-2">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold text-foreground">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity control */}
                  <div className="flex items-center border border-input rounded-lg">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      className="px-3 py-1 hover:bg-secondary transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-1 font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      className="px-3 py-1 hover:bg-secondary transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-24">
                    <p className="text-lg font-bold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </ScrollFrameAnimation>
              ))}
            </div>
          </div>

          {/* Continue shopping */}
          <div className="mt-6">
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <ScrollFrameAnimation className="surface-elevated p-6 space-y-6 sticky top-20">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-accent font-semibold">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border my-4 pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {subtotal <= 100 && (
              <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg text-sm text-accent">
                Free shipping on orders over $100!
              </div>
            )}

            <Button size="lg" className="w-full button-primary">
              Proceed to Checkout
            </Button>

            <div className="pt-4 space-y-2 text-xs text-muted-foreground text-center">
              <p>✓ Free returns within 30 days</p>
              <p>✓ Secure checkout</p>
              <p>✓ Satisfaction guaranteed</p>
            </div>
          </ScrollFrameAnimation>
        </div>
      </div>
    </div>
  );
}
