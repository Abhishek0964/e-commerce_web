import { HeroSection } from '@/components/sections/hero-section';
import { PromotionsSection } from '@/components/sections/promotions-section';
import { FeaturedProductsSection } from '@/components/sections/featured-products-section';

export default function Page() {
  return (
    <div className="w-full">
      <HeroSection />
      <PromotionsSection />
      <FeaturedProductsSection
        title="Best Sellers"
        subtitle="Shop our most popular products"
        limit={4}
      />
      <FeaturedProductsSection
        title="Electronics"
        subtitle="Browse our electronics collection"
        category="electronics"
        limit={4}
        showViewAll={false}
      />
    </div>
  );
}
