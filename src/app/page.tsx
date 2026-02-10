import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/product-grid';
import { HomeHero } from '@/components/home/home-hero';
import { CategoryGrid } from '@/components/home/category-grid';
import { getFeaturedProducts, getCategories } from '@/lib/products';

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(6),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <HomeHero />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products">
            <Button
              variant="outline"
              icon={<ArrowRight className="h-4 w-4" />}
              iconPosition="right"
            >
              View All
            </Button>
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <p className="text-center text-muted-foreground">
            No featured products available
          </p>
        )}
      </section>

      {/* Categories */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-3xl font-bold">Shop by Category</h2>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-16">
        <div className="rounded-2xl bg-gradient-amazon p-12 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Start Shopping?
          </h2>
          <p className="mb-8 text-xl">
            Explore our wide range of quality products
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="secondary"
              icon={<ArrowRight className="h-5 w-5" />}
              iconPosition="right"
            >
              Browse All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
