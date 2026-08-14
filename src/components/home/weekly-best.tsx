"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function WeeklyBest() {
  const products = [
    {
      id: "p-uc-60",
      slug: "pubg-uc-60",
      title: "شحن شدات ببجي 60",
      price: "38.4 ج.م",
      oldPrice: "53 ج.م",
      savings: "وفر 15 ج.م",
      badge: "الأكثر مبيعاً",
      image: "/images/uc-60-card.png",
    },
    {
      id: "p-uc-120",
      slug: "pubg-uc-120",
      title: "شحن شدات ببجي 120",
      price: "68.8 ج.م",
      oldPrice: "90 ج.م",
      savings: "وفر 20 ج.م",
      badge: "خصم 10%",
      image: "/images/uc-120-card.png",
    },
    {
      id: "p-uc-325",
      slug: "pubg-uc-325",
      title: "شحن شدات ببجي 325",
      price: "175.79 ج.م",
      oldPrice: "205 ج.م",
      savings: "وفر 30 ج.م",
      badge: "خصم 10%",
      image: "/images/uc-325-card.png",
    },
  ];

  return (
    <section className="relative w-full bg-[#08090d] py-10 md:py-14 overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8">
        
        {/* =========================================================
            SECTION HEADER (Right-aligned in RTL)
        ========================================================= */}
        <div className="mb-6 md:mb-8 text-right flex flex-col items-start rtl:items-end">
          {/* Top Decorative Red Accent */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="h-0.5 w-6 bg-[#DF0112]" />
            <span className="size-1.5 rotate-45 bg-[#DF0112]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            الأكثر مبيعاً
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 mt-2 font-medium">
            المنتجات التي يفضلها عملاؤنا هذا الأسبوع
          </p>
        </div>

        {/* =========================================================
            2-COLUMN GRID
            Desktop: Large Banner (Left / ~58%) | 3 Stacked Cards (Right / ~42%)
            Mobile/Tablet: Stacked vertically
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          
          {/* =======================================================
              RIGHT COLUMN in RTL: 3 Stacked Horizontal Product Cards
          ======================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4 order-2 lg:order-1">
            {products.map((item, idx) => {
              const productUrl = `/products/${item.slug}`;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group relative flex items-center justify-between rounded-[20px] border border-white/[0.08] bg-[#0b0d12] p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-[#10121a] hover:shadow-[0_12px_35px_rgba(223,1,18,0.14)] flex-1 min-h-[125px] sm:min-h-[135px] cursor-pointer"
                >
                  <Link
                    href={productUrl}
                    className="absolute inset-0 z-10"
                    aria-label={item.title}
                  />

                  {/* Thumbnail (Left in RTL) */}
                  <div className="relative size-20 sm:size-22 md:size-24 shrink-0 overflow-hidden rounded-[14px] bg-black/60 border border-white/10 p-1 flex items-center justify-center transition-all duration-300 group-hover:border-red-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain rounded-[10px] transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Product Info (Right in RTL) */}
                  <div className="flex flex-col text-right justify-center min-w-0 flex-1 ps-3 sm:ps-4">
                    {/* Badge */}
                    {item.badge && (
                      <span className="w-fit text-[11px] font-bold text-red-400 bg-red-950/60 border border-red-500/25 px-2.5 py-0.5 rounded-full mb-1.5 self-end">
                        {item.badge}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-snug">
                      {item.title}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-center justify-end gap-2.5 mt-2 flex-wrap">
                      {item.savings && (
                        <span className="text-[11px] sm:text-xs font-extrabold text-emerald-400 bg-emerald-950/50 border border-emerald-500/25 px-2 py-0.5 rounded-md">
                          {item.savings}
                        </span>
                      )}

                      {item.oldPrice && (
                        <span className="line-through text-xs sm:text-sm text-slate-500 font-medium">
                          {item.oldPrice}
                        </span>
                      )}

                      <span className="text-base sm:text-lg md:text-xl font-black text-[#DF0112]">
                        {item.price}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* =======================================================
              LEFT COLUMN in RTL: Large Featured PUBG Promotional Banner
          ======================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-7 relative group rounded-[24px] overflow-hidden border border-red-500/80 bg-[#0b0d12] shadow-[0_0_35px_rgba(223,1,18,0.25)] min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] order-1 lg:order-2 flex flex-col justify-end transition-all duration-300 hover:shadow-[0_0_50px_rgba(223,1,18,0.4)]"
          >
            {/* Clickable Overlay Link */}
            <Link
              href="/products"
              className="absolute inset-0 z-10"
              title="ابدأ رحلتك في PUBG - تسوق الآن"
            />

            {/* Background High-Quality PUBG Promotional Artwork */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/best-seller-banner.png"
              alt="ابدأ رحلتك في PUBG"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
              loading="lazy"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
