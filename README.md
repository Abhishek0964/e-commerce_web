# Maison — Considered Goods, Delivered

Maison is a premium, modern e-commerce marketplace for curated apparel, footwear, electronics, and home goods. Built with a highly responsive, aesthetics-focused interface using React, Vite, Tailwind CSS, and Supabase.

[![Vercel Deployment](https://img.shields.io/badge/deployed_on-vercel-black.svg?style=flat&logo=vercel)](https://e-commerce-web-9ad5.vercel.app/)
[![Supabase Database](https://img.shields.io/badge/powered_by-supabase-green.svg?style=flat&logo=supabase)](https://supabase.com/)

---

## ✨ Features

- **🛍️ Curated Catalog:** Beautiful grid layouts with tag highlights (New, Bestseller, Sale) and rating stars.
- **🔍 Advanced Search & Filter:** Filter products by categories, brands, price range, and ratings.
- **🛒 Persistent Shopping Cart:** Sliding sidebar cart with automatic subtotaling, shipping calculation, and secure checkout simulation.
- **❤️ Wishlist:** Save your favorite items to a personal wishlist (fully synchronized with the database).
- **🌗 Dark Mode:** Sleek, harmonic custom color palette transitions between light and dark modes.
- **🔐 User Authentication:** Full signup/signin system powered by Supabase Auth with secure password constraints.
- **📍 Address Book & Orders:** Manage default shipping addresses and view order history records.

---

## 🛠️ Tech Stack

- **Frontend Core:** [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v3](https://tailwindcss.com/), [PostCSS](https://postcss.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Backend-as-a-Service:** [Supabase](https://supabase.com/) (Postgres DB, Auth, RLS Policies)
- **Deployment:** [Vercel](https://vercel.com/) (with client-side SPA routing rules)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and [npm](https://www.npmjs.com/) installed.

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Abhishek0964/e-commerce_web.git
   cd e-commerce_web
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and specify your Supabase API credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-api-key
   ```

4. **Initialize Database Schema:**
   Apply the migrations found in the `/supabase/migrations` folder to your Supabase instance to create tables, populate seeds, and set up Row Level Security (RLS) policies.

5. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

---

## 📦 Production Build

To compile a highly optimized production bundle:
```bash
npm run build
```
This builds static assets into the `dist/` directory. You can preview the production bundle locally with:
```bash
npm run preview
```

---

## ☁️ Vercel Deployment

When deploying to Vercel, please ensure the following:

1. **Environment Variables:**
   Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under the project settings on Vercel.
2. **SPA Routing:**
   A `vercel.json` file is included in this repository to rewrite all subroute requests (like `/shop` or `/checkout`) to `index.html`, preventing Vercel from throwing 404 errors on direct navigation.

---

## 📁 Project Structure

```
├── public/                 # Static assets (favicons, manifest)
├── src/
│   ├── components/         # Reusable UI & layout elements
│   │   ├── layout/         # Header, Footer, Sidebar Cart Drawer
│   │   └── ui/             # Toast, Price, Badge, Skeleton loaders
│   ├── context/            # React Context Providers (Auth, Cart, Wishlist, Theme)
│   ├── lib/                # Client queries, formatting utilities, hooks
│   ├── pages/              # Main view templates (Shop, Product details, Checkout)
│   ├── types.ts            # Shared TypeScript interfaces
│   └── main.tsx            # Application entry point
├── supabase/
│   └── migrations/         # SQL database schema and seeds
├── vercel.json             # Vercel routing rules
└── vite.config.ts          # Vite bundler configurations
```

---

## 🛡️ License

This project is open-source and available under the MIT License.
