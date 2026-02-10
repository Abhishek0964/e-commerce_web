'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, Package } from 'lucide-react';

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
    {
        title: 'Products',
        href: '/admin/products',
        icon: ShoppingBag,
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
    },
    {
        title: 'Return to Store',
        href: '/',
        icon: Package,
        variant: 'outline'
    }
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden h-screen w-64 flex-col border-r bg-muted/40 md:flex">
            <div className="flex h-16 items-center border-b px-6">
                <Link className="flex items-center gap-2 font-semibold" href="/admin">
                    <LayoutDashboard className="h-6 w-6" />
                    <span>ShopHub Admin</span>
                </Link>
            </div>
            <nav className="flex flex-1 flex-col gap-2 p-4">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary',
                            pathname === item.href
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground',
                            item.variant === 'outline' && "mt-auto border hover:bg-muted"
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
