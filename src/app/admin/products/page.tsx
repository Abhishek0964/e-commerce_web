import { ProductListTable } from '@/components/admin/ProductListTable';

export default function AdminProductsPage() {
    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Product Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your product catalog
                </p>
            </div>

            <ProductListTable />
        </div>
    );
}
