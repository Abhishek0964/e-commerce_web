
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage({
    searchParams,
}: {
    searchParams: { orderId: string };
}) {
    return (
        <div className="container flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="rounded-full bg-green-100 p-6 dark:bg-green-900/20 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                Thank you for your purchase. Your order ID is <span className="font-mono">{searchParams.orderId}</span>.
                We have received your order and will begin processing it shortly.
            </p>
            <div className="flex gap-4">
                <Link href="/orders">
                    <Button variant="outline">View My Orders</Button>
                </Link>
                <Link href="/products">
                    <Button>Continue Shopping</Button>
                </Link>
            </div>
        </div>
    );
}
