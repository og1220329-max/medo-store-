import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { SITE } from "@/lib/constants";
import "@/app/globals.css";
import { CartProvider } from "@/store/cart";
import { ToastProvider } from "@/store/toast";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { FloatingButtons } from "@/components/layout/floating-buttons";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — شحن شدات ببجي وخدمات الألعاب الرقمية`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "متجر ميدو ستور — شحن شدات ببجي موبايل والكورية، خدمات السوشيال ميديا، والمنتجات الرقمية بأسعار منافسة وتنفيذ سريع ودفع آمن.",
  keywords: [
    "شحن شدات ببجي",
    "شدات ببجي",
    "ببجي موبايل",
    "UC",
    "خدمات السوشيال ميديا",
    "متابعين انستجرام",
    "مشاهدات يوتيوب",
    "متجر العاب",
    "شحن العاب",
  ],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — متجر الألعاب والخدمات الرقمية`,
    description:
      "شحن شدات ببجي، خدمات السوشيال ميديا، والمنتجات الرقمية بسرعة وأمان.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — متجر الألعاب والخدمات الرقمية`,
    description: "شحن شدات ببجي وخدمات رقمية بسرعة وأمان.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.url },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} font-cairo`}>
        <CartProvider>
          <ToastProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-volt-600 focus:px-4 focus:py-2 focus:text-white"
            >
              تخطي إلى المحتوى
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
            <MobileBottomNav />
            <FloatingButtons />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}