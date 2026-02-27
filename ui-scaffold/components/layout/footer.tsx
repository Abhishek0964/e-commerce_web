import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Footer content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">
          {/* Brand section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
                S
              </div>
              <span className="font-bold text-lg">ShopHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for premium electronics and accessories.
            </p>
          </div>

          {/* Shop links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Shop</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                All Products
              </Link>
              <Link href="/products?category=electronics" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Electronics
              </Link>
              <Link href="/products?category=accessories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Accessories
              </Link>
              <Link href="/products?sortBy=newest" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                New Arrivals
              </Link>
            </nav>
          </div>

          {/* Customer service */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Customer Service</h3>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Shipping Info
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Returns
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQs
              </Link>
            </nav>
          </div>

          {/* Contact section */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <div className="flex flex-col gap-3">
              <a href="mailto:support@shophub.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                support@shophub.com
              </a>
              <a href="tel:+1-555-0123" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
                +1 (555) 0123
              </a>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>123 Tech Street, San Francisco, CA 94105</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t border-border py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} ShopHub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
