
import { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/checkout-form';

export const metadata: Metadata = {
    title: 'Checkout | ShopHub',
    description: 'Complete your purchase',
};

export default function CheckoutPage() {
    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            <CheckoutForm />
        </div>
    );
}
