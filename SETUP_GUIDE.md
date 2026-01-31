# ShopHub E-Commerce Frontend - Setup Guide

## 🚨 REQUIRED: Database Migrations

Before the website will display products, you **MUST** run the database migrations in your Supabase project.

### Step 1: Access Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Migrations (In Order!)

Execute these migration files **in order**:

#### Migration 1: Create Categories Table
```bash
File: supabase/migrations/20260131000000_create_categories.sql
```
Copy the entire contents and execute in SQL Editor.

#### Migration 2: Create Products & Inventory Tables
```bash
File: supabase/migrations/20260131000001_create_products.sql
```
Copy the entire contents and execute in SQL Editor.

#### Migration 3: Seed Data (20 Products)
```bash
File: supabase/migrations/20260131000002_seed_data.sql
```
Copy the entire contents and execute in SQL Editor.

### Step 3: Verify Data

Run this verification query in SQL Editor:

```sql
-- Should return 5
SELECT COUNT(*) FROM categories;

-- Should return 20
SELECT COUNT(*) FROM products WHERE is_active = true;

-- Should return 20
SELECT COUNT(*) FROM inventory;

-- View sample products
SELECT name, slug, price FROM products LIMIT 5;
```

## 🚀 Running the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📄 Pages Available

After running migrations, all these pages will work:

- `/` - Home page with featured products and categories
- `/products` - Products listing with filters and pagination
- `/products/{slug}` - Product detail pages (e.g., `/products/wireless-bluetooth-headphones`)
- `/cart` - Shopping cart (empty state for now)
- `/checkout` - Checkout page
- `/orders` - Order history (empty state)
- `/profile` - User profile
- `/wishlist` - Wishlist (empty state)

## 🎨 What's Implemented

✅ **20 realistic products** across 5 categories (Electronics, Fashion, Home & Kitchen, Books, Sports)  
✅ **Product images** from Unsplash CDN  
✅ **Responsive design** - mobile-first approach  
✅ **Server-side rendering** for optimal performance  
✅ **SEO-ready** with dynamic metadata  
✅ **Category filtering** and **search**  
✅ **Pagination** on product listing  
✅ **Price in Indian Rupees** (₹)

## 📝 Sample Product Slugs to Test

- `wireless-bluetooth-headphones`
- `smartphone-5g-128gb`
- `laptop-14-inch-ultra-slim`
- `womens-running-shoes`
- `adjustable-dumbbell-set-20kg`
- `healthy-indian-cooking`

## 🔧 Technical Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui patterns
- **Images**: Unsplash CDN + Next.js Image optimization
- **TypeScript**: Strict mode

## ⚠️ Not Yet Implemented

These features are planned for future milestones:

- Authentication (Supabase Auth)
- Cart functionality (Zustand store)
- Payment integration (Razorpay)
- Admin dashboard
- Reviews and ratings
- Wishlist functionality

## 🐛 Troubleshooting

### Products not showing?
→ Make sure you ran all 3 database migrations in Supabase

### Images not loading?
→ Check that `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL`

### TypeScript errors?
→ Run `npm install` to ensure all dependencies are installed

## 📚 Documentation

- Full implementation details: See `walkthrough.md` in artifacts
- Task breakdown: See `task.md` in artifacts
- Implementation plan: See `implementation_plan.md` in artifacts

---

**Built with ❤️ for the Indian market**
