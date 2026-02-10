import { ProductManageForm } from '@/components/admin/ProductManageForm';

export default function AdminProductManagePage() {
    return (
        <div className="container max-w-4xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Product</h1>
                <p className="text-muted-foreground mt-2">
                    Add a new product to your catalog
                </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
                <ProductManageForm
                    onSuccess={() => {
                        window.location.href = '/admin/products';
                    }}
                />
            </div>
        </div>
    );
}
