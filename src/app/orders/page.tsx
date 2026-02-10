
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (!orders || orders.length === 0) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-3xl font-bold mb-4">My Orders</h1>
                <p className="text-muted-foreground mb-8">You haven't placed any orders yet.</p>
                <Link href="/products">
                    <Button>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <h1 className="text-3xl font-bold mb-8">My Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="font-semibold">Order #{order.id.slice(0, 8)}</div>
                            <div className="text-sm text-muted-foreground">{formatDate(order.created_at)}</div>
                            <div className="text-sm mt-1">
                                Status: <span className="capitalize font-medium">{order.status}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="font-bold text-lg">
                                ₹{order.total_amount.toLocaleString('en-IN')}
                            </div>
                            <Link href={`/orders/${order.id}`}>
                                <Button variant="outline" size="sm">View Details</Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
