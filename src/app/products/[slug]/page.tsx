import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { getProductBySlug } from '@/lib/products';
import { ProductImageGallery } from '@/components/products/product-image-gallery';
import { PriceDisplay } from '@/components/products/price-display';
import { StockBadge } from '@/components/products/stock-badge';
import { ProductActions } from '@/components/products/product-actions';
import { ProductDetailsAccordion } from '@/components/products/product-details-accordion';
import { RelatedProducts } from '@/components/products/related-products';
import type { ProductImage } from '@/types/product';
import type { Metadata } from 'next';

interface ProductDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: `${product.name} - ShopHub`,
        description: product.description || product.name,
    };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const images = (product.images as unknown as ProductImage[]) || [];

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                    {/* Image Gallery */}
                    <div>
                        <ProductImageGallery images={images} productName={product.name} />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        {/* Header: Category, Badges, Name */}
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-2">
                                {product.category && (
                                    <Badge variant="secondary" className="text-sm">
                                        {product.category.name}
                                    </Badge>
                                )}
                                {product.is_featured && (
                                    <Badge variant="default">Featured</Badge>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold leading-tight lg:text-4xl">
                                {product.name}
                            </h1>
                        </div>

                        {/* Price & Stock */}
                        <div className="space-y-2">
                            <PriceDisplay
                                price={product.price}
                                compareAtPrice={product.compare_at_price}
                                size="large"
                            />
                            <StockBadge availableStock={product.available_stock || 0} />
                        </div>

                        {/* Actions: Quantity & Add to Cart */}
                        <ProductActions product={product} />

                        {/* Accordion Details */}
                        <ProductDetailsAccordion description={product.description || undefined} />
                    </div>
                </div>

                {/* Related Products */}
                {product.category && (
                    <div className="mt-16">
                        <RelatedProducts
                            categoryId={product.category.id}
                            currentProductId={product.id}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
