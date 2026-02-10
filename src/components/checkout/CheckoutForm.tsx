'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CreditCard, Lock } from 'lucide-react';

// Zod validation schema
const checkoutSchema = z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
    address: z.string().min(10, 'Address must be at least 10 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().regex(/^\d{6}$/, 'Invalid pincode'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CheckoutFormProps {
    cartItems: CartItem[];
    totalAmount: number;
}

export function CheckoutForm({ cartItems, totalAmount }: CheckoutFormProps) {
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
    });

    const simulatePayment = async (): Promise<{ success: boolean; orderId: string }> => {
        // Simulate payment processing delay (2-3 seconds)
        const delay = Math.random() * 1000 + 2000; // 2-3 seconds
        await new Promise((resolve) => setTimeout(resolve, delay));

        // 90% success rate for simulation
        const success = Math.random() > 0.1;
        const orderId = `ORD${Date.now()}`;

        return { success, orderId };
    };

    const onSubmit = async (data: CheckoutFormData) => {
        setIsProcessing(true);

        try {
            // Simulate payment processing
            const { success, orderId } = await simulatePayment();

            if (success) {
                // Store order data in localStorage for success page
                localStorage.setItem(
                    'lastOrder',
                    JSON.stringify({
                        orderId,
                        customerName: data.fullName,
                        email: data.email,
                        items: cartItems,
                        totalAmount,
                        shippingAddress: {
                            address: data.address,
                            city: data.city,
                            state: data.state,
                            pincode: data.pincode,
                        },
                        paymentMethod,
                        createdAt: new Date().toISOString(),
                    })
                );

                // Clear cart
                localStorage.removeItem('cart');

                // Redirect to success page
                router.push(`/order-success?id=${orderId}`);
            } else {
                // Simulate payment failure
                alert('Payment failed! Please try again or choose a different payment method.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 50;
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name *</label>
                        <input
                            {...register('fullName')}
                            type="text"
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="John Doe"
                        />
                        {errors.fullName && (
                            <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input
                                {...register('email')}
                                type="email"
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="john@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Phone *</label>
                            <input
                                {...register('phone')}
                                type="tel"
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="9876543210"
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Address *</label>
                        <textarea
                            {...register('address')}
                            rows={3}
                            className="w-full border rounded-lg px-3 py-2"
                            placeholder="House/Flat No., Street Name, Area"
                        />
                        {errors.address && (
                            <p className="text-sm text-red-600 mt-1">{errors.address.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">City *</label>
                            <input
                                {...register('city')}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="Mumbai"
                            />
                            {errors.city && (
                                <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">State *</label>
                            <input
                                {...register('state')}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="Maharashtra"
                            />
                            {errors.state && (
                                <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Pincode *</label>
                            <input
                                {...register('pincode')}
                                type="text"
                                className="w-full border rounded-lg px-3 py-2"
                                placeholder="400001"
                            />
                            {errors.pincode && (
                                <p className="text-sm text-red-600 mt-1">{errors.pincode.message}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition">
                        <input
                            type="radio"
                            name="payment"
                            value="razorpay"
                            checked={paymentMethod === 'razorpay'}
                            onChange={() => setPaymentMethod('razorpay')}
                            className="w-4 h-4"
                        />
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                            <p className="font-medium">Card / UPI / Netbanking (Razorpay)</p>
                            <p className="text-sm text-muted-foreground">
                                Secure payment via Razorpay (Simulated)
                            </p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition">
                        <input
                            type="radio"
                            name="payment"
                            value="cod"
                            checked={paymentMethod === 'cod'}
                            onChange={() => setPaymentMethod('cod')}
                            className="w-4 h-4"
                        />
                        <div className="flex-1">
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive</p>
                        </div>
                    </label>
                </div>

                {paymentMethod === 'razorpay' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            This is a <strong>simulated payment</strong> for demo purposes. No actual
                            charges will be made.
                        </p>
                    </div>
                )}
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal ({cartItems.length} items)</span>
                        <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (GST 18%)</span>
                        <span>₹{tax}</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>₹{total}</span>
                    </div>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isProcessing ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>Place Order (₹{total})</>
                )}
            </button>

            <p className="text-center text-sm text-muted-foreground">
                By placing your order, you agree to our Terms & Conditions
            </p>
        </form>
    );
}
