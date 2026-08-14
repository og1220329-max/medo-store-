"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function WeeklyBest() {
  const items = [
    {
      id: "tiktok-7000",
      title: "شحن تيك توك - 7000 كوين",
      price: "4,200 ج.م",
      image: "/images/weekly-tiktok-7000.png",
      href: "/products",
    },
    {
      id: "pubg-bike",
      title: "دعم شعبية - دراجة نارية",
      price: "370 ج.م",
      image: "/images/weekly-popularity-bike.png",
      href: "/products",
    },
    {
      id: "tiktok-17500",
      title: "شحن تيك توك - 17500 كوين",
      price: "9,999 ج.م",
      image: "/images/weekly-tiktok-17500.png",
      href: "/products",
    },
  ];

  return (
    <section className="relative w-full bg-[#08090d] py-8 overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-6 text-right">
          <span className="text-xs md:text-sm font-bold text-[#DF0112] block mb-1">
            الأكثر طلباً
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight">
            أفضل المنتجات لهذا الأسبوع
          </h2>
          <p className="text-xs md:text-sm text-slate-400 mt-1.5 font-medium">
            استعرض أكثر المنتجات طلبًا من عملائنا واختر ما يناسبك بكل سهولة.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          {/* Left Column (3 Horizontal Cards in RTL) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 order-2 lg:order-1">
            {items.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.015, y: -2 }}
                transition={{ duration: 0.2 }}
                className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-[#0d0f15]/90 p-4 transition-all duration-300 hover:border-red-500/40 hover:bg-[#12141d] hover:shadow-[0_10px_30px_rgba(223,1,18,0.15)] flex-1 min-h-[96px]"
              >
                <Link
                  href={item.href}
                  className="absolute inset-0 z-10"
                  aria-label={item.title}
                />

                {/* Text (Right in RTL) */}
                <div className="flex flex-col text-right justify-center">
                  <h3 className="text-sm md:text-base font-black text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs md:text-sm font-bold text-slate-300 mt-1">
                    {item.price}
                  </span>
                </div>

                {/* Thumbnail (Left in RTL) */}
                <div className="relative size-16 md:size-20 shrink-0 overflow-hidden rounded-xl bg-black/40 border border-white/10 p-1 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column (Large Featured PUBG Promo Banner) */}
          <motion.div
            whileHover={{ scale: 1.008 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 relative group rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 bg-[#0c0d12] shadow-[0_15px_60px_rgba(0,0,0,0.8)] min-h-[320px] lg:min-h-[340px] order-1 lg:order-2 flex flex-col justify-end"
          >
            <Link
              href="/products"
              className="absolute inset-0 z-10"
              title="ابدأ رحلتك في PUBG - تسوق الآن"
            />

            {/* Background Artwork */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/weekly-pubg-promo.png"
              alt="ابدأ رحلتك في PUBG"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />

            {/* Interactive Bottom Sheen and Fallback Content Overlay */}
            <div className="relative z-10 p-5 md:p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-between gap-4">
              <div className="flex flex-col text-right">
                <h3 className="text-xl md:text-2xl font-black text-white drop-shadow-md">
                  ابدأ رحلتك في PUBG
                </h3>
                <p className="text-xs md:text-sm text-slate-300 mt-1 font-medium drop-shadow-sm">
                  شدات، خدمات، حسابات ودعم الشعبية في مكان واحد.
                </p>
              </div>

              <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#DF0112] text-white text-xs md:text-sm font-bold shadow-lg shadow-red-900/50 group-hover:bg-red-600 transition-colors shrink-0">
                تسوق الآن
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
