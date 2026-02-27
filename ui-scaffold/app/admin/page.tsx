'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { getAdminStats } from '@/lib/api';
import { AdminDashboardStats } from '@/lib/types';
import {
  TrendingUp,
  ShoppingCart,
  Users,
  Package,
} from 'lucide-react';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  delay = 0,
}: {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  delay?: number;
}) {
  const isPositive = change >= 0;

  return (
    <ScrollFrameAnimation
      delay={delay}
      className="surface-elevated p-6 rounded-lg space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
        <div className="p-3 bg-primary/10 rounded-lg text-primary">
          {Icon}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-3xl font-bold text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
        <p
          className={`text-sm font-medium flex items-center gap-1 ${
            isPositive ? 'text-accent' : 'text-destructive'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          {isPositive ? '+' : ''}{change}% vs last month
        </p>
      </div>
    </ScrollFrameAnimation>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load dashboard stats</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Key metrics */}
        <div>
          <ScrollFrameAnimation className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Overview</h2>
          </ScrollFrameAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              change={stats.revenueChangePercent}
              icon={<Package className="h-6 w-6" />}
              delay={0}
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              change={stats.ordersChangePercent}
              icon={<ShoppingCart className="h-6 w-6" />}
              delay={0.1}
            />
            <StatCard
              title="Total Customers"
              value={stats.totalCustomers}
              change={stats.customersChangePercent}
              icon={<Users className="h-6 w-6" />}
              delay={0.2}
            />
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              change={0}
              icon={<Package className="h-6 w-6" />}
              delay={0.3}
            />
          </div>
        </div>

        {/* Recent activity placeholder */}
        <ScrollFrameAnimation className="surface-elevated p-6 rounded-lg">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Orders</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Order ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  {
                    id: '#12345',
                    customer: 'John Doe',
                    amount: '$299.99',
                    status: 'Shipped',
                    date: 'Jan 15, 2026',
                  },
                  {
                    id: '#12346',
                    customer: 'Jane Smith',
                    amount: '$149.50',
                    status: 'Processing',
                    date: 'Jan 14, 2026',
                  },
                  {
                    id: '#12347',
                    customer: 'Bob Wilson',
                    amount: '$499.99',
                    status: 'Delivered',
                    date: 'Jan 13, 2026',
                  },
                ].map((order) => (
                  <tr key={order.id} className="hover:bg-secondary transition-colors">
                    <td className="py-4 px-4 font-medium text-foreground">
                      {order.id}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {order.customer}
                    </td>
                    <td className="py-4 px-4 font-medium text-foreground">
                      {order.amount}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-accent/10 text-accent'
                            : order.status === 'Shipped'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-secondary text-foreground'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollFrameAnimation>

        {/* Quick actions */}
        <ScrollFrameAnimation className="surface-elevated p-6 rounded-lg">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'View All Orders', href: '#' },
              { label: 'Manage Products', href: '/admin/products' },
              { label: 'Customer List', href: '/admin/customers' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="p-4 bg-secondary hover:bg-secondary/80 rounded-lg text-center font-medium text-foreground transition-colors"
              >
                {action.label}
              </a>
            ))}
          </div>
        </ScrollFrameAnimation>
      </div>
    </AdminLayout>
  );
}
