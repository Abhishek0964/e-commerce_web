'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Mail, Phone, MapPin } from 'lucide-react';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    orders: 5,
    totalSpent: '$1,299.95',
    joined: 'Jan 2026',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 234-5678',
    orders: 3,
    totalSpent: '$749.97',
    joined: 'Dec 2025',
  },
  {
    id: '3',
    name: 'Bob Wilson',
    email: 'bob@example.com',
    phone: '+1 (555) 345-6789',
    orders: 8,
    totalSpent: '$2,599.92',
    joined: 'Nov 2025',
  },
];

export default function AdminCustomersPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <ScrollFrameAnimation>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Customer Management</h2>
            <p className="text-muted-foreground">{MOCK_CUSTOMERS.length} customers</p>
          </div>
        </ScrollFrameAnimation>

        {/* Search bar */}
        <ScrollFrameAnimation delay={0.1}>
          <div className="surface-elevated p-4 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search customers by name or email..."
                className="pl-10 w-full"
              />
            </div>
          </div>
        </ScrollFrameAnimation>

        {/* Customers grid */}
        <ScrollFrameAnimation delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_CUSTOMERS.map((customer, index) => (
            <div
              key={customer.id}
              className="surface-elevated p-6 rounded-lg space-y-4"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`,
                opacity: 0,
              }}
            >
              <div>
                <h3 className="font-bold text-foreground mb-1">
                  {customer.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Customer since {customer.joined}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {customer.email}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {customer.phone}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Orders</p>
                    <p className="font-bold text-foreground">{customer.orders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Spent</p>
                    <p className="font-bold text-foreground">{customer.totalSpent}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </ScrollFrameAnimation>

        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
}
