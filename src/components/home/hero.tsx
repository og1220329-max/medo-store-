"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full bg-[#08090d] pt-2 pb-6 overflow-hidden">
      {/* Subtle Ambient Red Glow */}
      <div className="pointer-events-none absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[450px] bg-[radial-gradient(ellipse_at_top,_rgba(223,1,18,0.18)_0%,_transparent_70%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 md:px-8">
        {/* Master Full Picture Hero Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl"
        >
          {/* Main Full Image with Native Aspect Ratio */}
          <div className="relative w-full aspect-[1024/579]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/medo-full-hero.jpg"
              alt="متجر ميدو للبطاقات الرقمية - تسوق الحين"
              className="w-full h-full object-contain md:object-cover [image-rendering:-webkit-optimize-contrast]"
              loading="eager"
            />

            {/* Clickable Area: Main Banner & Shop Button -> /products */}
            <Link
              href="/products"
              className="absolute top-0 inset-x-0 h-[72%] cursor-pointer z-10 group"
              title="تسوق الآن من متجر ميدو"
            >
              {/* Subtle hover feedback */}
              <div className="w-full h-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-red-600/[0.04]" />
            </Link>

            {/* Clickable Area: 4 Cards -> /products or /offers */}
            <Link
              href="/products"
              className="absolute top-[72%] inset-x-0 h-[15%] cursor-pointer z-10 group"
              title="استكشف خدمات ومزايا المتجر"
            >
              <div className="w-full h-full transition-opacity duration-300 opacity-0 group-hover:opacity-100 bg-white/[0.02]" />
            </Link>

            {/* Clickable Area: WhatsApp Support on Bottom Right (in RTL) */}
            <a
              href="https://wa.me/201000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-0 right-0 w-[25%] h-[13%] cursor-pointer z-20"
              title="تواصل معنا عبر واتساب"
            />

            {/* Clickable Area: Reviews in Bottom Center */}
            <Link
              href="/#reviews"
              className="absolute bottom-0 left-[25%] right-[25%] h-[13%] cursor-pointer z-20"
              title="آراء وتقييمات العملاء"
            />

            {/* Clickable Area: Payment Methods in Bottom Left */}
            <Link
              href="/cart"
              className="absolute bottom-0 left-0 w-[25%] h-[13%] cursor-pointer z-20"
              title="طرق الدفع المتاحة"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}