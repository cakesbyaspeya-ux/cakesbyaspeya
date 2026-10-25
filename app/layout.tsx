import type { Metadata } from 'next';
import { Playfair_Display, Inter, Caveat } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FloatingWhatsAppButton } from '@/components/layout/FloatingWhatsAppButton';
import { NoticeBanner } from '@/components/layout/NoticeBanner';
import { PwaInstallPrompt } from '@/components/layout/PwaInstallPrompt';

// ── Fonts ────────────────────────────────────────────────
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
});

// ── Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cakesbyaspeya.vercel.app'
  ),
  title: {
    default: 'Cakes by Aspeya | Custom Cakes & Desserts in Chittagong',
    template: '%s | Cakes by Aspeya',
  },
  description:
    'Fresh-baked custom cakes, cheesecakes, and desserts delivered across Chittagong. Order on WhatsApp.',
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
    title: 'Cakes by Aspeya | Custom Cakes & Desserts in Chittagong',
    description:
      'Fresh-baked custom cakes, cheesecakes, and desserts delivered across Chittagong.',
    locale: 'en_BD',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cakes by Aspeya',
    description: 'Fresh-baked custom cakes & desserts in Chittagong.',
  },
  robots: { index: true, follow: true },
};

// ── Root Layout ──────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html 
      lang="en" 
      className={`${playfair.variable} ${inter.variable} ${caveat.variable} bg-cream`}
      style={{ colorScheme: 'light' }}
    >
      <body className="bg-cream text-ink font-body antialiased">
        <CartProvider>
          <NoticeBanner />
          <Navbar />
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <Footer />
          <PwaInstallPrompt />
          <FloatingWhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}