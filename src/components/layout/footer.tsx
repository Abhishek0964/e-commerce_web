import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <h3 className="mb-4 text-lg font-bold">ShopHub</h3>
                        <p className="text-sm text-muted-foreground">
                            Your one-stop destination for quality products at great prices.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Shop</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/products" className="text-muted-foreground hover:text-primary">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=electronics" className="text-muted-foreground hover:text-primary">
                                    Electronics
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=fashion" className="text-muted-foreground hover:text-primary">
                                    Fashion
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=sports" className="text-muted-foreground hover:text-primary">
                                    Sports
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/orders" className="text-muted-foreground hover:text-primary">
                                    My Orders
                                </Link>
                            </li>
                            <li>
                                <Link href="/wishlist" className="text-muted-foreground hover:text-primary">
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link href="/profile" className="text-muted-foreground hover:text-primary">
                                    My Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="mb-4 text-lg font-semibold">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-primary">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved. Built with ❤️ for India.</p>
                </div>
            </div>
        </footer>
    );
}
