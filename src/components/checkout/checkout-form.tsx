'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { useAuth } from '@/hooks/use-auth';
import { loadRazorpay } from '@/lib/load-razorpay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
// import { CartSummary } from '@/components/cart/cart-summary';

export function CheckoutForm() {
    const router = useRouter();
    const { user, supabase } = useAuth();
    const { items, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [showAddAddress, setShowAddAddress] = useState(false);

    // New Address State
    const [newAddress, setNewAddress] = useState({
        name: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: 'India'
    });

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchAddresses = async () => {
        const { data } = await supabase
            .from('addresses')
            .select('*')
            .order('is_default', { ascending: false });

        // Cast to any[] to avoid strict type issues with missing generated types
        const addrData = data as any[];

        if (addrData) {
            setAddresses(addrData);
            if (addrData.length > 0) setSelectedAddressId(addrData[0]?.id || '');
            else setShowAddAddress(true);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('addresses')
                // @ts-ignore
                .insert({
                    user_id: user?.id,
                    ...newAddress,
                    is_default: addresses.length === 0
                })
                .select()
                .single();

            if (error) throw error;

            const newData = data as any;
            setAddresses([...addresses, newData]);
            setSelectedAddressId(newData.id);
            setShowAddAddress(false);
            toast.success('Address added');
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!selectedAddressId) {
            toast.error('Please select an address');
            return;
        }

        setLoading(true);

        try {
            // 1. Initiate Order
            const res = await fetch('/api/checkout/create-order', {
                method: 'POST',
                body: JSON.stringify({
                    items: items.map(i => ({ productId: i.id, quantity: i.quantity })),
                    addressId: selectedAddressId
                }),
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            const isLoaded = await loadRazorpay();
            if (!isLoaded) throw new Error('Razorpay SDK failed to load');

            // 2. Open Razorpay
            const options = {
                key: data.keyId,
                amount: data.amount * 100,
                currency: data.currency,
                name: 'ShopHub',
                description: 'Order Payment',
                order_id: data.orderId,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    try {
                        const verifyRes = await fetch('/api/checkout/verify', {
                            method: 'POST',
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                dbOrderId: data.dbOrderId
                            }),
                            headers: { 'Content-Type': 'application/json' }
                        });

                        if (!verifyRes.ok) throw new Error('Payment verification failed');

                        toast.success('Payment Successful!');
                        clearCart();
                        router.push(`/order-success?orderId=${data.dbOrderId}`);

                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user?.user_metadata?.full_name,
                    email: user?.email,
                },
                theme: {
                    color: '#000000',
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();

        } catch (error: any) {
            toast.error(error.message || 'Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return <div>Cart is empty</div>;
    }

    return (
        <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
                <h2 className="text-xl font-semibold">Shipping Address</h2>

                {!showAddAddress && addresses.length > 0 ? (
                    <div className="space-y-4">
                        <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                            {addresses.map((addr) => (
                                <div key={addr.id} className="flex items-center space-x-2 border p-4 rounded-lg">
                                    <RadioGroupItem value={addr.id} id={addr.id} />
                                    <Label htmlFor={addr.id} className="cursor-pointer flex-1">
                                        <div className="font-semibold">{addr.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {addr.street}, {addr.city}, {addr.state} {addr.zip}
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                        <Button variant="outline" onClick={() => setShowAddAddress(true)}>
                            + Add New Address
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleAddAddress} className="space-y-4 border p-4 rounded-lg">
                        <h3 className="font-medium">New Address</h3>
                        <div className="grid gap-2">
                            <Label>Name</Label>
                            <Input
                                value={newAddress.name}
                                onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Street</Label>
                            <Input
                                value={newAddress.street}
                                onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>City</Label>
                                <Input
                                    value={newAddress.city}
                                    onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>State</Label>
                                <Input
                                    value={newAddress.state}
                                    onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>ZIP Code</Label>
                                <Input
                                    value={newAddress.zip}
                                    onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={loading}>Save Address</Button>
                            {addresses.length > 0 && (
                                <Button type="button" variant="ghost" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                            )}
                        </div>
                    </form>
                )}
            </div>

            <div>
                <div className="sticky top-20">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    {/* Note: We reuse logic from CartSummary but simplify */}
                    <div className="border rounded-lg p-6 bg-slate-50 dark:bg-slate-900 space-y-4">
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t pt-4 font-bold flex justify-between">
                            <span>Total (INR)</span>
                            <span>₹{items.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString('en-IN')}</span>
                        </div>

                        <Button
                            size="lg"
                            className="w-full"
                            onClick={handlePayment}
                            disabled={loading || !selectedAddressId}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Processing...' : 'Pay Now'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
