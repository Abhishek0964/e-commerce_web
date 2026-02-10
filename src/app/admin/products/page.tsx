import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductList } from '@/components/admin/product-list';
import { Spinner } from '@/components/ui/spinner';

export default function AdminProductsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your product catalog and inventory.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/products/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Product
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<div className="flex h-40 items-center justify-center"><Spinner /></div>}>
                <ProductList />
            </Suspense>
        </div>
    );
}
