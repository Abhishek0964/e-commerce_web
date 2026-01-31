import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CheckoutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Checkout Form */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Shipping Address */}
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
                            <div className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border px-3 py-2"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full rounded-md border px-3 py-2"
                                            placeholder="+91 1234567890"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">
                                        Address Line 1
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-md border px-3 py-2"
                                        placeholder="Street address"
                                    />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full rounded-md border px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-lg border p-6">
                            <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
                            <p className="text-muted-foreground">
                                Payment integration will be available after checkout flow is complete
                            </p>
                        </div>
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
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>₹0</span>
                            </div>
                            <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                <span>Total</span>
                                <span>₹0</span>
                            </div>
                        </div>
                        <Button size="lg" className="mt-6 w-full" disabled>
                            Place Order
                        </Button>
                        <Link href="/cart" className="mt-4 block text-center">
                            <Button variant="ghost" className="w-full">
                                Back to Cart
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
