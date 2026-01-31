import { EmptyState } from '@/components/ui/empty-state';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    // Wishlist will be fetched from database when auth is implemented
    const wishlistItems: any[] = [];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

                {wishlistItems.length === 0 ? (
                    <EmptyState
                        icon={<Heart className="h-16 w-16" />}
                        title="Your wishlist is empty"
                        description="Save your favorite products for later"
                        action={{
                            label: 'Browse Products',
                            href: '/products',
                        }}
                    />
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {/* Wishlist items will be rendered here */}
                    </div>
                )}
            </div>
        </div>
    );
}
