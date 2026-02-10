# Figma to Code Mapping

## Overview
Figma-inspired UI components created for ShopHub e-commerce platform following modern design patterns and best practices.

## Components Created

### 1. ProductCard (`ProductCard.tsx`)
**Design Features:**
- Hover animations with framer-motion
- Quick action buttons (wishlist, quick view)
- Discount badges and stock status
- Star rating display
- Responsive image optimization
- Accessibility labels

**Props:**
```typescript
{
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  image: string;
  category?: string;
  rating?: number;
  inStock?: boolean;
}
```

### 2. ProductGrid (`ProductGrid.tsx`)
**Design Features:**
- Responsive grid layout (1/2/4 columns)
- Stagger animation on load
- Customizable columns per breakpoint

**Props:**
```typescript
{
  products: Product[];
  columns?: { mobile: number; tablet: number; desktop: number };
}
```

### 3. SearchHeader (`SearchHeader.tsx`)
**Design Features:**
- Animated focus state
- Clear button with fade transition
- Autocomplete ready
- Keyboard accessible

## Design Principles Applied

1. **Motion Design**: Subtle animations using framer-motion for better UX
2. **Responsive**: Mobile-first approach with breakpoint customization
3. **Accessibility**: ARIA labels, keyboard navigation, focus states
4. **Performance**: Next.js Image optimization, lazy loading
5. **Modern Styling**: Tailwind CSS with consistent design tokens

## Usage Example

```tsx
import { ProductGrid, SearchHeader } from '@/components/from-figma';

const products = [
  {
    id: '1',
    name: 'Product Name',
    price: 999,
    comparePrice: 1299,
    image: '/product.jpg',
    category: 'Electronics',
    rating: 4,
    inStock: true
  }
];

<SearchHeader onSearch={(q) => console.log(q)} />
<ProductGrid products={products} />
```

## Files Created
- `src/components/from-figma/ProductCard.tsx`
- `src/components/from-figma/ProductGrid.tsx`
- `src/components/from-figma/SearchHeader.tsx`
- `src/components/from-figma/index.ts`
