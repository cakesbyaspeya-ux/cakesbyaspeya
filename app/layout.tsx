import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsAppButton } from '@/components/layout/FloatingWhatsAppButton';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cakesbyaspeya.vercel.app'
  ),
  title: {
    default: 'Cakes by Aspeya — Custom Cakes & Desserts in Chittagong',
    template: '%s · Cakes by Aspeya',
  },
  description:
    'Handcrafted custom cakes, cheesecakes, and desserts. Baked to order and delivered across Chattogram.',
  applicationName: 'Cakes by Aspeya',
  authors: [{ name: 'Cakes by Aspeya' }],
  keywords: [
    'cakes Chittagong',
    'custom cake Chittagong',
    'birthday cake Chittagong',
    'cheesecake Chittagong',
    'desserts Chittagong',
    'cake delivery Chittagong',
  ],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    siteName: 'Cakes by Aspeya',
    title: 'Cakes by Aspeya — Custom Cakes & Desserts in Chittagong',
    description:
      'Handcrafted custom cakes, cheesecakes, and desserts. Baked to order and delivered across Chattogram.',
    locale: 'en_BD',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <Footer />
          <FloatingWhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}