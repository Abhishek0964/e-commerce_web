import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, CheckCircle2, Clock, Truck, Package } from 'lucide-react';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

function OrderStatusTimeline({ status }: { status: string }) {
    const steps = [
        { id: 'placed', label: 'Order Placed', icon: Clock },
        { id: 'processing', label: 'Processing', icon: Package },
        { id: 'shipped', label: 'Shipped', icon: Truck },
        { id: 'delivered', label: 'Delivered', icon: CheckCircle2 },
    ];

    // Simple mapping for demo. In real app, order would have exact dates for each.
    // 'pending' -> 0 active, 'confirmed' -> 1 active...
    const getActiveStep = (s: string) => {
        switch (s.toLowerCase()) {
            case 'pending': return 0;
            case 'confirmed': return 1;
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'delivered': return 3;
            default: return 0; // cancelled etc
        }
    };

    const activeIndex = getActiveStep(status);

    return (
        <div className="relative flex justify-between w-full max-w-3xl mx-auto my-8">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full" />
            <div
                className="absolute top-1/2 left-0 h-1 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, i) => {
                const Icon = step.icon;
                const isActive = i <= activeIndex;
                const isCurrent = i === activeIndex;

                return (
                    <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                        <div className={`
                            h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300
                            ${isActive ? 'border-primary bg-primary text-primary-foreground' : 'border-muted text-muted-foreground bg-background'}
                            ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                        `}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}


export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect('/login');

    const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (!order) return notFound();

    if (order.user_id !== user.id) return notFound();

    const { data: items } = await supabase
        .from('order_items')
        .select('quantity, price_at_time, products(name, image_url)')
        .eq('order_id', order.id);

    return (
        <div className="container py-8 md:py-12">
            <ScrollFrameAnimation>
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/orders">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
                        <p className="text-sm text-muted-foreground">ID: #{order.id}</p>
                    </div>
                </div>

                <div className="bg-card border rounded-xl p-8 mb-8 shadow-sm">
                    <div className="text-center mb-4">
                        <h2 className="text-lg font-semibold">Order Status</h2>
                        <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                    </div>
                    <OrderStatusTimeline status={order.status} />
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-muted/40 px-6 py-4 border-b">
                                <h2 className="font-semibold">Items</h2>
                            </div>
                            <div className="divide-y p-0">
                                {items?.map((item: any, idx: number) => (
                                    <div key={idx} className="flex p-6 gap-4 hover:bg-muted/20 transition-colors">
                                        <div className="h-20 w-20 rounded-md border bg-muted overflow-hidden shrink-0">
                                            {item.products?.image_url ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={item.products.image_url} alt={item.products.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-muted-foreground">No Img</div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-base mb-1">{item.products?.name}</h3>
                                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right font-medium">
                                            ₹{item.price_at_time.toLocaleString('en-IN')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-6">
                            <h2 className="font-semibold text-lg border-b pb-2">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between border-t pt-3 font-bold text-base">
                                    <span>Total</span>
                                    <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card border rounded-xl p-6 shadow-sm space-y-4">
                            <h2 className="font-semibold text-lg border-b pb-2">Shipping Details</h2>
                            <div className="text-sm leading-relaxed text-muted-foreground">
                                <p className="font-medium text-foreground mb-1">{order.shipping_name}</p>
                                <p>{order.shipping_address_line1}</p>
                                {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                                <p>{order.shipping_city}, {order.shipping_state}</p>
                                <p>{order.shipping_pincode}</p>
                            </div>
                            {order.shipping_phone && (
                                <div className="pt-2 border-t mt-2 text-sm">
                                    <span className="text-muted-foreground">Phone:</span> {order.shipping_phone}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollFrameAnimation>
        </div>
    );
}
