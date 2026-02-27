import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';
import { Package, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(products(image_url))') // Fetch first product image
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (!orders || orders.length === 0) {
        return (
            <div className="container py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
                <div className="rounded-full bg-muted p-6 mb-6">
                    <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-4">My Orders</h1>
                <p className="text-muted-foreground mb-8 text-lg">You haven&apos;t placed any orders yet.</p>
                <Link href="/products">
                    <Button size="lg">Start Shopping</Button>
                </Link>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800';
            case 'shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'delivered': return <CheckCircle2 className="h-4 w-4 mr-1" />;
            case 'cancelled': return <XCircle className="h-4 w-4 mr-1" />;
            default: return <Clock className="h-4 w-4 mr-1" />;
        }
    };

    return (
        <div className="container py-8 md:py-12">
            <ScrollFrameAnimation delay={0.1}>
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
                    <Link href="/products">
                        <Button variant="ghost">Continue Shopping</Button>
                    </Link>
                </div>

                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="group border rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow bg-card hover:border-primary/50 relative overflow-hidden">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-sm text-muted-foreground">#{order.id.slice(0, 8)}</span>
                                        <Badge variant="outline" className={`${getStatusColor(order.status)} border px-2 py-0.5`}>
                                            {getStatusIcon(order.status)}
                                            <span className="capitalize">{order.status}</span>
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Placed on {formatDate(order.created_at)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto mt-2 md:mt-0">
                                    {/* Preview Images (if available) */}
                                    <div className="flex -space-x-3 overflow-hidden">
                                        {order.order_items?.slice(0, 3).map((item: any, i: number) => (
                                            item.products?.image_url ? (
                                                <div key={i} className="h-10 w-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={item.products.image_url} alt="Product" className="h-full w-full object-cover" />
                                                </div>
                                            ) : null
                                        ))}
                                        {/* {(order.order_items?.length || 0) > 3 && (
                                            <div className="h-10 w-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium">
                                                +{order.order_items.length - 3}
                                            </div>
                                        )} */}
                                    </div>

                                    <div className="text-right min-w-[80px]">
                                        <div className="text-sm text-muted-foreground">Total</div>
                                        <div className="font-bold text-lg">
                                            ₹{order.total_amount.toLocaleString('en-IN')}
                                        </div>
                                    </div>

                                    <Link href={`/orders/${order.id}`} className="absolute inset-0 md:static md:inset-auto">
                                        <Button variant="outline" size="sm" className="hidden md:flex">View Details</Button>
                                        <span className="sr-only">View Details for order #{order.id}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollFrameAnimation>
        </div>
    );
}
