'use client';

import { AdminLayout } from '@/components/layout/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';
import { Save, Bell, Lock, Globe } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('[ShopHub] Settings saved');
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-8">
        {/* Store Settings */}
        <ScrollFrameAnimation>
          <div className="surface-elevated p-6 rounded-lg space-y-6">
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Store Settings</h2>
                <p className="text-sm text-muted-foreground">
                  Manage your store information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Name
                </label>
                <Input
                  type="text"
                  placeholder="ShopHub"
                  defaultValue="ShopHub"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store Email
                </label>
                <Input
                  type="email"
                  placeholder="support@shophub.com"
                  defaultValue="support@shophub.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 0123"
                    defaultValue="+1 (555) 0123"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Currency
                  </label>
                  <select className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Store URL
                </label>
                <Input
                  type="url"
                  placeholder="https://shophub.com"
                  defaultValue="https://shophub.com"
                />
              </div>
            </div>
          </div>
        </ScrollFrameAnimation>

        {/* Notification Settings */}
        <ScrollFrameAnimation delay={0.1}>
          <div className="surface-elevated p-6 rounded-lg space-y-6">
            <div className="flex items-center gap-3">
              <Bell className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  Control notification preferences
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: 'New Orders',
                  description: 'Receive notifications for new orders',
                },
                {
                  label: 'Low Stock Alerts',
                  description: 'Get alerts when products are running low',
                },
                {
                  label: 'Customer Messages',
                  description: 'Notifications for customer inquiries',
                },
                {
                  label: 'Daily Digest',
                  description: 'Daily summary of store activity',
                },
              ].map((notification) => (
                <div
                  key={notification.label}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors"
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 border border-input rounded focus:ring-2 focus:ring-ring mt-1"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {notification.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollFrameAnimation>

        {/* Security Settings */}
        <ScrollFrameAnimation delay={0.2}>
          <div className="surface-elevated p-6 rounded-lg space-y-6">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground">
                  Manage security settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <Input type="password" placeholder="••••••••" />
              </div>

              <div className="pt-4">
                <Button variant="destructive">Change Password</Button>
              </div>
            </div>

            {/* Two-factor authentication */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline">Enable 2FA</Button>
            </div>
          </div>
        </ScrollFrameAnimation>

        {/* Save button */}
        <ScrollFrameAnimation delay={0.3} className="flex justify-end">
          <Button
            size="lg"
            className="button-primary gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-5 w-5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </ScrollFrameAnimation>
      </div>
    </AdminLayout>
  );
}
