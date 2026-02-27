import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { CursorBackground } from '@/components/animations/cursor-background'
import { MainLayout } from '@/components/layout/main-layout'

import './globals.css'

const geistSans = Geist({ subsets: ['latin'] })
const geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopHub - Premium Electronics & Accessories',
  description: 'Discover premium electronics and accessories at unbeatable prices',
  generator: 'v0.app',
  keywords: ['electronics', 'accessories', 'shopping', 'online store'],
  creators: ['ShopHub'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} font-sans antialiased`}>
        <CursorBackground />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
