import type { Product } from "@/lib/types";

export const jsonLd = {
  organization(): string {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "OnlineStore",
      name: "MEDO STORE",
      description: "متجر شحن شدات ببجي والخدمات الرقمية",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      sameAs: [],
    });
  },

  product(product: Product, baseUrl: string): string {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image,
      sku: product.id,
      brand: { "@type": "Brand", name: "MEDO STORE" },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewsCount,
      },
      offers: {
        "@type": "Offer",
        url: `${baseUrl}/products/${product.slug}`,
        priceCurrency: "EGP",
        price: product.price,
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      },
    });
  },

  webSite(): string {
    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "MEDO STORE",
      url: process.env.NEXT_PUBLIC_SITE_URL,
      inLanguage: "ar",
    });
  },
};