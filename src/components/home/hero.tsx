"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Star,
  Zap,
  ShieldCheck,
  Headphones,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
} from "lucide-react";

export function Hero() {
  // Real-time dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 8,
    minutes: 45,
    seconds: 12,
  });

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: Zap,
      title: "تنفيذ سريع",
      subtitle: "خلال دقائق معدودة",
    },
    {
      icon: ShieldCheck,
      title: "دفع آمن",
      subtitle: "جميع طرق الدفع",
    },
    {
      icon: Headphones,
      title: "دعم 24/7",
      subtitle: "فريق دعم محترف",
    },
    {
      icon: Award,
      title: "أسعار تنافسية",
      subtitle: "أفضل الأسعار في السوق",
    },
  ];

  return (
    <section className="relative w-full bg-[#08090d] overflow-hidden">
      {/* Background Banner with Realistic PUBG Soldier and Crate */}
      <div className="relative min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/images/pubg-hero-bg.jpg')`,
            backgroundPosition: "center 30%",
          }}
        >
          {/* Radial & Gradient Overlays for Cinematic Dark Contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090d]/95 via-[#08090d]/70 to-[#08090d]/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-[#08090d]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Floating Sparks / Embers subtle glow */}
        <div className="absolute top-1/4 right-1/3 size-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 size-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 md:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right Side: Hero Copy & Feature List */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8 flex flex-col items-start text-right"
            >
              {/* Eyebrow subtitle */}
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-xs md:text-sm font-bold text-slate-300 tracking-wide">
                  أفضل متجر لشحن شدات ببجي والخدمات الرقمية
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.15] tracking-tight">
                اشحن شدات ببجي
                <br />
                <span className="text-white">بأسرع وقت </span>
                <span className="text-[#DF0112] drop-shadow-[0_0_25px_rgba(223,1,18,0.7)]">
                  وأفضل
                </span>
                <span className="text-white"> سعر</span>
              </h1>

              {/* Subtext description */}
              <p className="mt-5 max-w-xl text-sm md:text-base font-medium text-slate-300/90 leading-relaxed">
                نوفر لك أفضل الأسعار وأسرع تنفيذ لشدات ببجي وجميع الخدمات الرقمية بأمان تام.
              </p>

              {/* CTA Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2.5 rounded-lg bg-[#DF0112] hover:bg-[#c20110] px-7 py-3 text-sm font-black text-white shadow-lg shadow-red-950/60 transition duration-200 transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="size-4" />
                  <span>تسوق الآن</span>
                </Link>

                <Link
                  href="/offers"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition duration-200"
                >
                  <Star className="size-4 text-amber-400" />
                  <span>استكشف العروض</span>
                </Link>
              </div>

              {/* 4 Feature Badges in Single Row */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-6 border-t border-white/10 w-full max-w-3xl">
                {features.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-3 text-right"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                        <Icon className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-black text-white">
                          {item.title}
                        </span>
                        <span className="text-[10px] md:text-xs text-slate-400">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Left Side: Special Offer Countdown Card Overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-4 flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-[320px] rounded-2xl bg-[#10121a]/85 border border-white/10 p-5 shadow-2xl backdrop-blur-xl relative">
                
                {/* Offer Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-400">
                    <Flame className="size-3 text-amber-400" />
                    <span>عرض اليوم</span>
                  </div>

                  {/* Carousel controls */}
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => setActiveSlide((s) => (s > 0 ? s - 1 : 2))}
                      className="hover:text-white transition p-1"
                      aria-label="السابق"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                    <button
                      onClick={() => setActiveSlide((s) => (s < 2 ? s + 1 : 0))}
                      className="hover:text-white transition p-1"
                      aria-label="التالي"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Offer Headline & Big Percentage */}
                <div className="mt-4 text-center">
                  <span className="text-xs font-semibold text-slate-400">خصم حتي</span>
                  <div className="text-5xl font-black text-[#DF0112] tracking-tight drop-shadow-[0_0_20px_rgba(223,1,18,0.5)] my-1">
                    20%
                  </div>
                  <p className="text-xs font-bold text-slate-200">
                    على جميع المنتجات
                  </p>
                </div>

                {/* Live Countdown Timer Grid */}
                <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                  {/* Days */}
                  <div className="flex flex-col items-center justify-center rounded-lg bg-[#07080b] border border-white/10 py-2 px-1">
                    <span className="text-base font-black text-white font-mono">
                      {String(timeLeft.days).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">يوم</span>
                  </div>

                  {/* Hours */}
                  <div className="flex flex-col items-center justify-center rounded-lg bg-[#07080b] border border-white/10 py-2 px-1">
                    <span className="text-base font-black text-white font-mono">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">ساعة</span>
                  </div>

                  {/* Minutes */}
                  <div className="flex flex-col items-center justify-center rounded-lg bg-[#07080b] border border-white/10 py-2 px-1">
                    <span className="text-base font-black text-white font-mono">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">دقيقة</span>
                  </div>

                  {/* Seconds */}
                  <div className="flex flex-col items-center justify-center rounded-lg bg-[#07080b] border border-white/10 py-2 px-1">
                    <span className="text-base font-black text-[#DF0112] font-mono">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">ثانية</span>
                  </div>
                </div>

                {/* Shop Offer CTA Button */}
                <div className="mt-5">
                  <Link
                    href="/offers"
                    className="flex w-full items-center justify-center rounded-lg bg-[#07080b] hover:bg-[#151722] border border-white/15 hover:border-[#DF0112]/50 py-2.5 text-xs font-bold text-white transition shadow-md"
                  >
                    تسوق العرض
                  </Link>
                </div>

                {/* Slider Pagination Dots */}
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <button
                      key={dot}
                      onClick={() => setActiveSlide(dot)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === dot ? "w-5 bg-[#DF0112]" : "w-1.5 bg-white/20"
                      }`}
                      aria-label={`شريحة ${dot + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}