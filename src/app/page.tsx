import type { Metadata } from "next";
import { getStore } from "@/lib/db/store";
import { Hero } from "@/components/home/hero";
import { TrustBar } from "@/components/home/trust-bar";
import { Categories } from "@/components/home/categories";
import { BannerSlider } from "@/components/home/banner-slider";
import { FeaturedProducts } from "@/components/home/featured-products";
import { OffersSection } from "@/components/home/offers-section";
import { WhyUs } from "@/components/home/why-us";
import { Reviews } from "@/components/home/reviews";
import { FAQSection } from "@/components/home/faq";
import { ContactSection } from "@/components/home/contact-section";
import { SocialMediaStrip } from "@/components/home/social-media-strip";
import { WeeklyBest } from "@/components/home/weekly-best";

export const metadata: Metadata = {
  title: "متجر الألعاب والخدمات الرقمية — شحن شدات ببجي وسوشيال ميديا",
  description:
    "اشحن شدات ببجي موبايل والكورية، اطلب خدمات السوشيال ميديا والمنتجات الرقمية بسرعة وأمان من متجر ببجي ستور.",
  keywords: ["شدات ببجي", "شحن ببجي", "متابعين انستجرام", "خدمات رقمية", "PUBG STORE"],
  openGraph: {
    title: "PUBG STORE — متجر شحن شدات ببجي والخدمات الرقمية",
  },
};

export default async function HomePage() {
  const store = await getStore();
  const socialCategory = store.categories.find((c) => c.slug === "social-media");
  const sections = new Map(store.homepage.map((h) => [h.key, h]));

  const bestSection = sections.get("best-sellers") || sections.get("weekly-best");
  const weeklyProducts = store.products
    .filter((p) => p.active && (p.bestSeller || p.featured))
    .sort((a, b) => {
      // Prioritize TikTok and Popularity products, then best sellers
      const isTopA = a.slug.includes("tiktok") || a.slug.includes("popularity") ? 1 : 0;
      const isTopB = b.slug.includes("tiktok") || b.slug.includes("popularity") ? 1 : 0;
      return isTopB - isTopA;
    });

  return (
    <>
      {sections.get("hero")?.enabled !== false && <Hero />}
      {sections.get("categories")?.enabled !== false && (
        <Categories categories={store.categories} socialCategory={socialCategory} />
      )}
      {bestSection?.enabled !== false && (
        <WeeklyBest
          products={weeklyProducts}
          title={bestSection?.title || "أفضل المنتجات لهذا الأسبوع"}
          subtitle={bestSection?.subtitle || "استعرض أكثر المنتجات طلباً من عملائنا واختر ما يناسبك بكل سهولة."}
        />
      )}
      {sections.get("featured")?.enabled !== false && (
        <FeaturedProducts mode="featured" />
      )}
      {sections.get("banner-slider")?.enabled !== false && <BannerSlider />}
      {sections.get("offers")?.enabled !== false && <OffersSection />}
      {sections.get("social-media")?.enabled !== false && <SocialMediaStrip />}
      {sections.get("why-us")?.enabled !== false && <WhyUs />}
      {sections.get("reviews")?.enabled !== false && (
        <Reviews
          reviews={store.reviews
            .filter((r) => r.approved !== false)
            .sort((a, b) => Number(b.featured) - Number(a.featured))}
        />
      )}
      {sections.get("faq")?.enabled !== false && <FAQSection compact />}
      {sections.get("contact")?.enabled !== false && <ContactSection settings={store.settings} />}
    </>
  );
}