import { getProducts } from '@/lib/products';
import { ProductCard } from './product-card';

interface RelatedProductsProps {
    categoryId: string;
    currentProductId: string;
    limit?: number;
}

export async function RelatedProducts({
    categoryId,
    currentProductId,
    limit = 4,
}: RelatedProductsProps) {
    // Fetch products from the same category
    const { products } = await getProducts({ category: categoryId }, { limit: limit + 1, page: 1 });

    // Exclude the current product
    const relatedProducts = products.filter(p => p.id !== currentProductId).slice(0, limit);

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <section className="border-t bg-muted/30 py-12">
            <div className="container mx-auto px-4">
                <h2 className="mb-8 text-2xl font-bold">Related Products</h2>

                {/* Desktop: Grid, Mobile: Horizontal scroll */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {relatedProducts.map((product, index) => (
                        <div
                            key={product.id}
                            style={{
                                // Staggered animation delay
                                animationDelay: `${index * 100}ms`,
                            }}
                            className="motion-safe:animate-[fadeInUp_0.5s_ease-out_forwards] motion-safe:opacity-0"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
