"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Sparkles } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface WeeklyBestProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  badge?: string;
  bannerTitle?: string;
  bannerSubtitle?: string;
  bannerImage?: string;
  bannerCta?: string;
  bannerHref?: string;
}

export function WeeklyBest({
  products = [],
  title = "أفضل المنتجات لهذا الأسبوع",
  subtitle = "استعرض أكثر المنتجات طلباً من عملائنا واختر ما يناسبك بكل سهولة.",
  badge = "الأكثر طلباً",
  bannerTitle = "ابدأ رحلتك في PUBG",
  bannerSubtitle = "شدات، خدمات، حسابات وشحن سريع في مكان واحد.",
  bannerImage = "/images/weekly-pubg-promo.png",
  bannerCta = "تسوق الآن",
  bannerHref = "/products",
}: WeeklyBestProps) {
  // Select top 3 featured / best selling products dynamically
  const displayItems = products.length >= 3
    ? products.slice(0, 3)
    : [
        {
          id: "p-tiktok-7000",
          slug: "tiktok-coins-7000",
          name: "شحن تيك توك - 7000 كوين",
          price: 4200,
          oldPrice: 5000,
          image: "/images/product-tiktok-7000.jpg",
          badge: "الأكثر طلباً",
        },
        {
          id: "p-pubg-pop-bike",
          slug: "pubg-popularity-bike",
          name: "دعم شعبية - دراجة نارية",
          price: 370,
          oldPrice: 450,
          image: "/images/product-popularity-bike.jpg",
          badge: "20 ألف شعبية",
        },
        {
          id: "p-tiktok-17500",
          slug: "tiktok-coins-17500",
          name: "شحن تيك توك - 17500 كوين",
          price: 9999,
          oldPrice: 11500,
          image: "/images/product-tiktok-17500.jpg",
          badge: "باقة VIP",
        },
      ];

  return (
    <section className="relative w-full bg-[#08090d] py-10 md:py-14 overflow-hidden border-t border-b border-white/[0.04]">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/2 start-0 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,_rgba(223,1,18,0.08)_0%,_transparent_70%)]" />
      <div className="pointer-events-none absolute top-1/2 end-0 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle,_rgba(223,1,18,0.05)_0%,_transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8">
        
        {/* =========================================================
            SECTION HEADER (Right-aligned in RTL)
        ========================================================= */}
        <div className="mb-6 md:mb-8 text-right">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-950/40 border border-red-500/25 mb-2">
            <span className="size-1.5 rounded-full bg-[#DF0112] animate-pulse" />
            <span className="text-xs font-extrabold text-[#ff3a45] tracking-wide">
              {badge}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 font-medium max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* =========================================================
            2-COLUMN GRID
            Desktop: Large Banner (Left / 58%) | 3 Stacked Cards (Right / 42%)
            Mobile/Tablet: Stacked vertically
        ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
          
          {/* =======================================================
              RIGHT COLUMN in RTL: 3 Stacked Horizontal Product Cards
          ======================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 sm:gap-4 order-2 lg:order-1">
            {displayItems.map((item, idx) => {
              const itemSlug = (item as Product).slug || (item as any).id;
              const productUrl = `/products/${itemSlug}`;
              const discountPct =
                item.oldPrice && item.oldPrice > item.price
                  ? Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
                  : null;

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="group relative flex items-center justify-between rounded-[20px] border border-white/[0.08] bg-[#0b0d12] p-4 md:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/40 hover:bg-[#10121a] hover:shadow-[0_12px_35px_rgba(223,1,18,0.14)] flex-1 min-h-[125px] sm:min-h-[135px] cursor-pointer"
                >
                  <Link
                    href={productUrl}
                    className="absolute inset-0 z-10"
                    aria-label={item.name}
                  />

                  {/* Product Info (Right in RTL) */}
                  <div className="flex flex-col text-right justify-center min-w-0 flex-1 pe-3 sm:pe-4">
                    {/* Optional Badge */}
                    {item.badge && (
                      <span className="w-fit text-[10px] sm:text-[11px] font-bold text-red-400 bg-red-950/50 border border-red-500/25 px-2 py-0.5 rounded-md mb-1.5 truncate">
                        {item.badge}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-sm sm:text-base md:text-lg font-black text-white group-hover:text-red-400 transition-colors line-clamp-1 leading-snug">
                      {item.name}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-base sm:text-lg md:text-xl font-black text-[#DF0112]">
                        {typeof item.price === "number"
                          ? formatCurrency(item.price)
                          : item.price}
                      </span>

                      {item.oldPrice && (
                        <span className="line-through text-xs sm:text-sm text-slate-500 font-medium">
                          {typeof item.oldPrice === "number"
                            ? formatCurrency(item.oldPrice)
                            : item.oldPrice}
                        </span>
                      )}

                      {discountPct && (
                        <span className="text-[10px] sm:text-xs font-extrabold text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          وفر {discountPct}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail (Left in RTL) */}
                  <div className="relative size-20 sm:size-22 md:size-24 shrink-0 overflow-hidden rounded-[14px] bg-black/60 border border-white/10 p-1.5 flex items-center justify-center transition-all duration-300 group-hover:border-red-500/30">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image || "/images/uc-660.svg"}
                      alt={item.name}
                      className="w-full h-full object-contain rounded-[10px] transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* =======================================================
              LEFT COLUMN in RTL: Large Featured Promotional Banner (~60% width)
          ======================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-7 relative group rounded-[24px] overflow-hidden border border-white/[0.09] bg-[#0b0d12] shadow-[0_20px_60px_rgba(0,0,0,0.85)] min-h-[380px] sm:min-h-[420px] lg:min-h-[450px] order-1 lg:order-2 flex flex-col justify-end transition-all duration-300 hover:border-red-500/35 hover:shadow-[0_25px_70px_rgba(223,1,18,0.18)]"
          >
            {/* Clickable Overlay Link */}
            <Link
              href={bannerHref}
              className="absolute inset-0 z-10"
              title={`${bannerTitle} - ${bannerCta}`}
            />

            {/* Background High-Quality PUBG Promotional Artwork */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bannerImage}
              alt={bannerTitle}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
              loading="lazy"
            />

            {/* Dark Gradient Overlay for optimal contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />

            {/* Floating Top Badge */}
            <div className="absolute top-4 sm:top-6 end-4 sm:end-6 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-xs font-bold text-white shadow-lg">
                <Sparkles className="size-3.5 text-amber-400" />
                <span>عروض حصرية</span>
              </span>
            </div>

            {/* Bottom Content Area */}
            <div className="relative z-10 p-5 sm:p-7 md:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex flex-col text-right">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] tracking-tight">
                  {bannerTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 font-medium drop-shadow-md max-w-md">
                  {bannerSubtitle}
                </p>
              </div>

              {/* Red CTA Pill Button */}
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-l from-[#DF0112] to-[#b0010e] text-white text-xs sm:text-sm font-black shadow-[0_10px_25px_rgba(223,1,18,0.5)] border border-red-400/40 transition-all duration-300 group-hover:brightness-110 group-hover:scale-105">
                  <ShoppingCart className="size-4" />
                  <span>{bannerCta}</span>
                </span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
