import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AuthListener } from "@/components/auth/auth-listener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | ShopHub',
    default: 'ShopHub - Premium E-Commerce',
  },
  description: "Discover quality products at great prices. Electronics, Fashion, Home & Kitchen.",
  openGraph: {
    title: 'ShopHub',
    description: 'Your one-stop shop for premium products.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'ShopHub',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopHub',
    description: 'Premium E-Commerce Store',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AuthListener />
        <Toaster />
      </body>
    </html>
  );
}
