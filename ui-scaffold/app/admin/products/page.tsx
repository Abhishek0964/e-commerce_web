'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/layout/admin-layout';
import { getAdminProducts } from '@/lib/api';
import { AdminProductManagement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductManagement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAdminProducts();
        setProducts(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header with search and add button */}
        <ScrollFrameAnimation className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Manage Products</h2>
            <p className="text-muted-foreground">{products.length} products in your store</p>
          </div>
          <Button className="button-primary gap-2">
            <Plus className="h-5 w-5" />
            Add Product
          </Button>
        </ScrollFrameAnimation>

        {/* Search bar */}
        <ScrollFrameAnimation delay={0.1}>
          <div className="surface-elevated p-4 rounded-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </ScrollFrameAnimation>

        {/* Products table */}
        <ScrollFrameAnimation delay={0.2} className="surface-elevated rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-6 text-center text-muted-foreground">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              {searchQuery ? 'No products found matching your search' : 'No products yet'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/30">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Product Name
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Price
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Sales
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-foreground">
                        {product.name}
                      </td>
                      <td className="py-4 px-6 text-foreground">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-foreground">
                        {product.stock}
                      </td>
                      <td className="py-4 px-6 text-muted-foreground">
                        {product.salesCount}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'active'
                              ? 'bg-accent/10 text-accent'
                              : product.status === 'draft'
                                ? 'bg-secondary text-foreground'
                                : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {product.status.charAt(0).toUpperCase() +
                            product.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-primary">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ScrollFrameAnimation>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <ScrollFrameAnimation delay={0.3} className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline">Next</Button>
            </div>
          </ScrollFrameAnimation>
        )}
      </div>
    </AdminLayout>
  );
}
