<<<<<<< HEAD
# ShopHub - Production E-Commerce Platform

A modern, production-grade e-commerce platform built with Next.js, TypeScript, Supabase, and Razorpay. Optimized for the Indian market.

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router, React Server Components)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Payments**: Razorpay
- **Email**: Resend
- **Deployment**: Vercel

## ✨ Features

### Customer Features
- 🔐 Authentication (Email/Password + Google OAuth)
- 🛍️ Product browsing with categories
- 🔍 Search and filtering
- 🛒 Shopping cart (guest + authenticated)
- ❤️ Wishlist
- 💳 Secure checkout with Razorpay
- 📦 Order tracking
- ⭐ Product reviews
- 👤 User profile management
- 📍 Multiple address management

### Admin Features
- 📊 Admin dashboard
- 📦 Product management
- 📁 Category management
- 📈 Order management
- 💬 Review moderation
- 👥 User overview

### Technical Features
- 🔒 Row Level Security (RLS)
- 🔄 Atomic inventory management
- 🪝 Webhook-verified payments
- 📱 Mobile-first responsive design
- 📲 PWA support
- 🌐 SEO optimized
- ♿ Accessible
- 🎨 Beautiful UI with modern design

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth routes
│   │   ├── (shop)/            # Shop routes
│   │   ├── (account)/         # User account routes
│   │   ├── (admin)/           # Admin routes
│   │   └── api/               # API routes
│   ├── components/            # React components
│   ├── lib/                   # Core utilities
│   │   ├── supabase/         # Supabase clients
│   │   └── razorpay/         # Razorpay utilities
│   ├── store/                 # Zustand stores
│   ├── types/                 # TypeScript types
│   ├── actions/               # Server Actions
│   └── validators/            # Zod schemas
├── supabase/
│   └── migrations/            # Database migrations
└── public/                    # Static assets
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or pnpm
- Supabase account
- Razorpay account (India)
- Resend account (for emails)

### 1. Clone & Install

```bash
cd /home/abhishek-choudhary/Documents/Antigravity_projects/A_test
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `RAZORPAY_WEBHOOK_SECRET` - Razorpay webhook secret
- `RESEND_API_KEY` - Resend API key
- `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:3000 for local)

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migrations (instructions in Phase 2)
3. Enable Google OAuth in Supabase Auth settings
4. Configure RLS policies

### 4. Razorpay Setup

1. Create a Razorpay account (India)
2. Get your API keys from the dashboard
3. Set up webhook endpoint: `https://your-domain.com/api/webhooks/razorpay`
4. Subscribe to `payment.captured` and `payment.failed` events

### 5. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Build

```bash
npm run build
npm start
```

## 🔐 Security

- ✅ Environment validation with Zod
- ✅ Row Level Security (RLS) on all tables
- ✅ Server-side price validation
- ✅ Webhook signature verification
- ✅ Atomic inventory reservation
- ✅ No client-side trust for critical operations

## 💳 Payment Flow

1. User adds items to cart
2. Proceeds to checkout
3. Server creates order + reserves inventory
4. Razorpay payment initiated
5. Webhook verifies payment
6. Inventory committed
7. Order confirmed
8. Email sent

## 🗄️ Database Schema

See [implementation_plan.md](/.gemini/antigravity/brain/6af0415c-866b-491c-8221-ca4372f5be9c/implementation_plan.md) for detailed schema design.

Key tables:
- `profiles` - User profiles
- `products` - Product catalog
- `categories` - Product categories
- `inventory` - Stock management
- `cart_items` - Shopping carts
- `wishlist_items` - User wishlists
- `orders` - Order records
- `order_items` - Order line items
- `addresses` - User addresses
- `reviews` - Product reviews

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables in Production

Ensure all environment variables from `.env.example` are set in your Vercel project settings.

## 📝 Development Workflow

### Phase Status

Current phase: **Phase 1 - Foundation Complete** ✅

See [task.md](/.gemini/antigravity/brain/6af0415c-866b-491c-8221-ca4372f5be9c/task.md) for full roadmap.

### Next Steps

- Phase 2: Supabase database setup
- Phase 3: Authentication system
- Phase 4: Core UI components
- Phase 5: Product catalog
- ... (see task.md for complete plan)

## 🤝 Contributing

This is a production build project. Follow strict TypeScript and code quality standards.

## 📄 License

Private project - All rights reserved

## 🆘 Support

For issues or questions, contact the development team.

---

**Built with ❤️ for the Indian market**
=======
# e-commerce_web
>>>>>>> 02a006a54b55f562d7f304dc230ce481429b7c20
