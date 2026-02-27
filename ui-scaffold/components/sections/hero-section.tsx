'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getHeroSection } from '@/lib/api';
import { HeroSection as HeroSectionType } from '@/lib/types';
import { shouldReduceMotion } from '@/lib/motion-config';

export function HeroSection() {
  const [heroData, setHeroData] = useState<HeroSectionType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = shouldReduceMotion();

  useEffect(() => {
    const loadHero = async () => {
      try {
        const data = await getHeroSection();
        setHeroData(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadHero();
  }, []);

  if (isLoading) {
    return (
      <section className="relative w-full h-96 bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto" />
          <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
        </div>
      </section>
    );
  }

  if (!heroData) {
    return null;
  }

  return (
    <section
      className="relative w-full min-h-96 flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(217, 91, 60%, 0.1) 0%, rgba(30, 100, 55%, 0.1) 100%)`,
      }}
    >
      {/* Background placeholder - image would go here safely */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('${heroData.backgroundImage}')`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        role="presentation"
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 py-16 sm:py-24 text-center"
        style={{
          opacity: prefersReducedMotion ? 1 : undefined,
          animation: prefersReducedMotion
            ? undefined
            : 'fadeInUp 0.8s ease-out forwards',
        }}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance mb-6">
          {heroData.title}
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground text-balance mb-8">
          {heroData.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={heroData.ctaLink}>
            <Button
              size="lg"
              className="w-full sm:w-auto button-primary"
              style={{
                animation: prefersReducedMotion
                  ? undefined
                  : 'slideUp 0.8s ease-out 0.2s forwards',
                opacity: prefersReducedMotion ? 1 : 0,
              }}
            >
              {heroData.ctaText}
            </Button>
          </Link>
          <Link href="/products?category=electronics">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              style={{
                animation: prefersReducedMotion
                  ? undefined
                  : 'slideUp 0.8s ease-out 0.3s forwards',
                opacity: prefersReducedMotion ? 1 : 0,
              }}
            >
              Browse Electronics
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          @keyframes fadeInUp {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideUp {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        }
      `}</style>
    </section>
  );
}
