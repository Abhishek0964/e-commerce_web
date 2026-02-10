
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { redirect, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    // Await params before using (Next.js 15+ requirement, good practice)
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

    // Security check: Ensure user owns order (RLS handles this usually, but explicit check good)
    if (order.user_id !== user.id) return notFound(); // Or 403

    // Fetch Items
    const { data: items } = await supabase
        .from('order_items')
        .select('quantity, price_at_time, products(name, image_url)') // Join with products
        .eq('order_id', order.id);

    // Address
    const address = order.shipping_address;

    return (
        <div className="container py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <Link href="/orders">
                    <Button variant="outline">Back to Orders</Button>
                </Link>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Items</h2>
                        <div className="space-y-4">
                            {items?.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center border-b last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        {item.products?.image_url && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.products.image_url} alt={item.products.name} className="w-16 h-16 object-cover rounded" />
                                        )}
                                        <div>
                                            <div className="font-medium">{item.products?.name}</div>
                                            <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <div className="font-medium">
                                        ₹{item.price_at_time.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="border rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Order Summary</h2>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Order ID</span>
                            <span className="font-mono text-sm">{order.id.slice(0, 8)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span>{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <span className="capitalize font-medium">{order.status}</span>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>₹{order.total_amount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="border rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Shipping Address</h2>
                        <div className="text-sm leading-relaxed">
                            <div className="font-medium">{address?.name}</div>
                            <div>{address?.street}</div>
                            <div>{address?.city}, {address?.state}</div>
                            <div>{address?.zip}</div>
                            <div>{address?.country}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
