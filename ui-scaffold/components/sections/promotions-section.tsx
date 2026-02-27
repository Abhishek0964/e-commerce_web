'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getPromotions } from '@/lib/api';
import { Promotion } from '@/lib/types';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

export function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        const data = await getPromotions();
        setPromotions(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadPromotions();
  }, []);

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <div className="text-center space-y-4 mb-12">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto" />
          <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <ScrollFrameAnimation className="text-center space-y-4 mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
          Featured Promotions
        </h2>
        <p className="text-lg text-muted-foreground">
          Discover our latest deals and exclusive offers
        </p>
      </ScrollFrameAnimation>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.map((promo, index) => (
          <ScrollFrameAnimation
            key={promo.id}
            delay={index * 0.1}
            className="group surface-elevated overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Promotion Image */}
            <div className="relative overflow-hidden bg-muted aspect-video">
              <img
                src={promo.image}
                alt={promo.imageAlt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />

              {/* Badge */}
              {promo.badge && (
                <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-4 py-1 rounded-full text-xs font-bold tracking-wide">
                  {promo.badge}
                </div>
              )}

              {/* Discount overlay */}
              {promo.discountPercent && (
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                  {promo.discountPercent}% OFF
                </div>
              )}
            </div>

            {/* Promotion Content */}
            <div className="p-6 space-y-4 flex flex-col">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {promo.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {promo.description}
                </p>
              </div>

              {promo.link && (
                <Link href={promo.link}>
                  <Button className="w-full button-primary">
                    Shop Now
                  </Button>
                </Link>
              )}
            </div>
          </ScrollFrameAnimation>
        ))}
      </div>
    </section>
  );
}
