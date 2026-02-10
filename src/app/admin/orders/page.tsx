
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminOrdersPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Basic admin check (middleware handles role protection via redirect, 
    // but we double check or assume middleware does it. 
    // Ideally middleware checks role, or we check profile role here).
    // Current middleware only checks auth.
    // We should check profile.is_admin here.

    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

    if (!profile?.is_admin) {
        return (
            <div className="container py-10 text-center">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    const { data: orders } = await supabase
        .from('orders')
        .select('*, profiles(full_name, email)') // Join profiles if possible? Relations usually setup on user_id
        .order('created_at', { ascending: false });
    // Note: 'profiles' join requires FK relationship. 
    // orders.user_id references auth.users. 
    // But profiles.id references auth.users.
    // So they are related. 
    // If no explicit FK in Supabase UI, join might fail.
    // We will assume `orders.user_id` FKey to `auth.users` doesn't help join `profiles`.
    // We need an explicit FK from orders.user_id to profiles.id OR just manual fetch.
    // I'll stick to basic order data for now to avoid join errors if FK missing.

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Orders</h1>
                <Link href="/admin">
                    <Button variant="outline">Back to Dashboard</Button>
                </Link>
            </div>

            <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-left bg-white dark:bg-slate-900">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b">
                        <tr>
                            <th className="p-4">Order ID</th>
                            <th className="p-4">User ID</th>
                            <th className="p-4">Total</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Date</th>
                            {/* <th className="p-4">Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order) => (
                            <tr key={order.id} className="border-b last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                                <td className="p-4 text-sm font-mono truncate max-w-[150px]" title={order.user_id}>{order.user_id}</td>
                                <td className="p-4 font-medium">₹{order.total_amount.toLocaleString('en-IN')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold capitalize
                                ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">{formatDate(order.created_at)}</td>
                            </tr>
                        ))}
                        {!orders?.length && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
