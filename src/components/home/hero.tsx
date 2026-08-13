"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ShieldCheck, Headphones, Tags } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const FEATURE_CARDS = [
  { icon: Zap,         title: "تنفيذ فوري وسريع",     desc: "يتم تنفيذ طلبك في دقائق" },
  { icon: ShieldCheck, title: "دفع آمن 100%",          desc: "جميع طرق الدفع متاحة وآمنة" },
  { icon: Headphones,  title: "دعم فني متواصل 24/7",   desc: "فريق دعم جاهز لخدمتك" },
  { icon: Tags,        title: "أفضل أسعار السوق",      desc: "أرخص الأسعار وأفضل العروض" },
];

export function Hero() {
  return (
    <section className="relative w-full bg-[#07080b] pt-3 pb-6">
      {/* Ambient glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(223,1,18,0.14)_0%,transparent_70%)]"
      />

      <div className="relative mx-auto w-[calc(100%-48px)] max-w-[1440px] sm:w-[calc(100%-64px)] md:w-[calc(100%-80px)]">

        {/* ====================================================
            HERO ARTWORK — reference image displayed as-is
            with transparent clickable hotspots layered on top
        ==================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="relative w-full overflow-hidden rounded-[1.5rem] border border-[#DF0112]/30 shadow-[0_0_60px_rgba(223,1,18,0.18),0_24px_72px_-20px_rgba(0,0,0,0.95)]"
        >
          {/* The ACTUAL hero artwork — completely unmodified */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/medo-full-hero.jpg"
            alt="متجر ميدو للبطاقات الرقمية"
            className="w-full h-auto block [image-rendering:-webkit-optimize-contrast]"
            loading="eager"
            fetchPriority="high"
            draggable={false}
          />

          {/* ================================================
              TRANSPARENT HOTSPOT OVERLAYS
              Percentage-based so they scale with the image.
              The image natural ratio is 1024 × 579 ≈ 56.5%
              All positions derived from pixel inspection.
          ================================================ */}

          {/* 
            HOW THE GRID WORKS (image is 1024 × 579):
            ─────────────────────────────────────────
            "تسوق الحين" red banner:
              left  ≈ 515px / 1024 = 50.3%
              top   ≈ 268px / 579  = 46.3%
              width ≈ 456px / 1024 = 44.5%
              height≈ 64px  / 579  = 11.1%

            "تسوق الآن" button (right):
              left  ≈ 702px / 1024 = 68.6%
              top   ≈ 350px / 579  = 60.4%
              width ≈ 270px / 1024 = 26.4%
              height≈ 52px  / 579  = 9.0%

            "خدمة فورية 24/7" badge (left of above button):
              left  ≈ 510px / 1024 = 49.8%
              top   ≈ 350px / 579  = 60.4%
              width ≈ 185px / 1024 = 18.1%
              height≈ 52px  / 579  = 9.0%
          -->

          {/* HOTSPOT 1 — "تسوق الحين" large red CTA banner */}
          <Link
            href="/products"
            aria-label="تسوق الحين"
            className="absolute cursor-pointer select-none outline-none bg-transparent"
            style={{
              left:   "50.3%",
              top:    "46.3%",
              width:  "44.5%",
              height: "11.1%",
            }}
          />

          {/* HOTSPOT 2 — "تسوق الآن" red button (right side) */}
          <Link
            href="/products"
            aria-label="تسوق الآن"
            className="absolute cursor-pointer select-none outline-none bg-transparent"
            style={{
              left:   "68.6%",
              top:    "60.4%",
              width:  "26.4%",
              height: "9.0%",
            }}
          />

          {/* HOTSPOT 3 — "خدمة فورية 24/7" badge */}
          <Link
            href="/contact"
            aria-label="خدمة فورية 24/7"
            className="absolute cursor-pointer select-none outline-none bg-transparent"
            style={{
              left:   "49.8%",
              top:    "60.4%",
              width:  "18.1%",
              height: "9.0%",
            }}
          />

          {/* HOTSPOT 4 — WhatsApp button (bottom right of image) */}
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="تواصل معنا عبر واتساب"
            className="absolute cursor-pointer select-none outline-none bg-transparent"
            style={{
              left:   "82%",
              top:    "82%",
              width:  "12%",
              height: "11%",
            }}
          />
        </motion.div>

        {/* ====================================================
            4 PREMIUM FEATURE CARDS — separate HTML below hero
        ==================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: EASE }}
          className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4"
        >
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.title}
              className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-[#0c0e14]/90 px-4 py-4 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#DF0112]/50 hover:shadow-[0_14px_34px_-14px_rgba(223,1,18,0.4)]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#DF0112]/12 text-[#DF0112] ring-1 ring-[#DF0112]/30 transition-all duration-300 group-hover:bg-[#DF0112] group-hover:text-white group-hover:ring-transparent">
                <card.icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-white">
                  {card.title}
                </span>
                <span className="mt-0.5 block text-xs text-slate-400">
                  {card.desc}
                </span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
