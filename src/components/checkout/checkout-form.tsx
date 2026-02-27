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
import { AnimatePresence, motion } from 'framer-motion';
import { ScrollFrameAnimation } from '../animations/scroll-frame-animation';
import { shouldReduceMotion } from '@/lib/motion-config';

export function CheckoutForm() {
    const router = useRouter();
    const { user, supabase } = useAuth();
    const { items, clearCart } = useCartStore();

    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('');
    const [showAddAddress, setShowAddAddress] = useState(false);
    const reducedMotion = shouldReduceMotion();

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
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                    <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some items before checking out.</p>
                <Button onClick={() => router.push('/products')}>Browse Products</Button>
            </div>
        );
    }

    return (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <ScrollFrameAnimation delay={0.1}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-semibold">Shipping Address</h2>
                        {!showAddAddress && (
                            <Button variant="outline" size="sm" onClick={() => setShowAddAddress(true)}>
                                + Add New
                            </Button>
                        )}
                    </div>

                    <div className="relative min-h-[300px]">
                        <AnimatePresence mode="wait">
                            {!showAddAddress && addresses.length > 0 ? (
                                <motion.div
                                    key="list"
                                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId} className="grid gap-4 sm:grid-cols-2">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-transparent bg-secondary hover:bg-secondary/80'}`}>
                                                <RadioGroupItem value={addr.id} id={addr.id} className="sr-only" />
                                                <Label htmlFor={addr.id} className="cursor-pointer flex-1 flex flex-col gap-1">
                                                    <div className="font-bold text-lg">{addr.name}</div>
                                                    <div className="text-sm text-muted-foreground leading-relaxed">
                                                        {addr.street}<br />
                                                        {addr.city}, {addr.state} {addr.zip}<br />
                                                        {addr.country}
                                                    </div>
                                                </Label>
                                                {selectedAddressId === addr.id && (
                                                    <motion.div
                                                        layoutId={reducedMotion ? undefined : "check"}
                                                        className="absolute top-4 right-4 text-primary"
                                                    >
                                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                                    </motion.div>
                                                )}
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={reducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <form onSubmit={handleAddAddress} className="space-y-4 p-6 rounded-xl border bg-card/50 backdrop-blur-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-semibold text-lg">New Address Details</h3>
                                            {addresses.length > 0 && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddAddress(false)}>Cancel</Button>
                                            )}
                                        </div>

                                        <div className="grid gap-4">
                                            <div className="grid gap-2">
                                                <Label>Full Name</Label>
                                                <Input
                                                    value={newAddress.name}
                                                    onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                                    required
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Street Address</Label>
                                                <Input
                                                    value={newAddress.street}
                                                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                                    required
                                                    className="bg-background"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label>City</Label>
                                                    <Input
                                                        value={newAddress.city}
                                                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                                        required
                                                        className="bg-background"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>State</Label>
                                                    <Input
                                                        value={newAddress.state}
                                                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                                        required
                                                        className="bg-background"
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
                                                        className="bg-background"
                                                    />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label>Country</Label>
                                                    <Input
                                                        value={newAddress.country}
                                                        disabled
                                                        className="bg-muted"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <Button type="submit" disabled={loading} className="w-full">
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                                Save & Continue
                                            </Button>
                                        </div>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </ScrollFrameAnimation>
            </div>

            <div className="lg:col-span-1">
                <ScrollFrameAnimation delay={0.2} className="sticky top-24">
                    <div className="rounded-xl border bg-card shadow-sm p-6 space-y-6">
                        <h3 className="text-xl font-bold">Order Summary</h3>

                        <div className="space-y-4 max-h-[300px] overflow-auto pr-2 custom-scrollbar">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted shrink-0">
                                        {item.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground text-xs">No Img</div>
                                        )}
                                        <div className="absolute bottom-0 right-0 bg-background/80 px-1.5 py-0.5 text-[10px] font-medium border-tl rounded-tl">
                                            x{item.quantity}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium leading-tight line-clamp-2">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">₹{(item.price).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-sm font-semibold">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{items.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-muted-foreground">
                                <span>Shipping</span>
                                <span className="text-green-600 font-medium">Free</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>₹{items.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full text-base"
                            onClick={handlePayment}
                            disabled={loading || !selectedAddressId}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? 'Processing...' : `Pay ₹${items.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString('en-IN')}`}
                        </Button>

                        <p className="text-xs text-center text-muted-foreground">
                            Secure payment via Razorpay. Encrypted & Safe.
                        </p>
                    </div>
                </ScrollFrameAnimation>
            </div>
        </div>
    );
}
