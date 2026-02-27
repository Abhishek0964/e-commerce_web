
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

export default function OrderSuccessPage({
    searchParams,
}: {
    searchParams: { orderId: string };
}) {
    return (
        <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center py-20">
            <ScrollFrameAnimation delay={0.1} className="flex flex-col items-center max-w-lg mx-auto">
                <div className="relative mb-8">
                    <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20 duration-1000" />
                    <div className="relative rounded-full bg-green-100 p-6 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-16 w-16" />
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-4 tracking-tight">Order Confirmed!</h1>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                    Thank you for your purchase. We have received your order <span className="font-mono font-medium text-foreground bg-secondary px-2 py-0.5 rounded text-base">{searchParams.orderId}</span> and will begin processing it shortly.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link href="/orders" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-[160px]">
                            View My Orders
                        </Button>
                    </Link>
                    <Link href="/products" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto min-w-[160px] gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Continue Shopping
                        </Button>
                    </Link>
                </div>
            </ScrollFrameAnimation>
        </div>
    );
}
