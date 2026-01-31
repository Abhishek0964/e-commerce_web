import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';

export default function OrdersPage() {
    // Orders will be fetched from database when auth is implemented
    const orders: any[] = [];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">My Orders</h1>

                {orders.length === 0 ? (
                    <EmptyState
                        icon={<Package className="h-16 w-16" />}
                        title="No orders yet"
                        description="Start shopping to see your orders here"
                        action={{
                            label: 'Browse Products',
                            href: '/products',
                        }}
                    />
                ) : (
                    <div className="space-y-4">
                        {/* Order cards will be rendered here */}
                        <div className="rounded-lg border p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold">Order #12345</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Placed on January 1, 2026
                                    </p>
                                </div>
                                <Badge>Processing</Badge>
                            </div>
                            <div className="mt-4 border-t pt-4">
                                <div className="flex justify-between">
                                    <span>Total</span>
                                    <span className="font-semibold">₹0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
