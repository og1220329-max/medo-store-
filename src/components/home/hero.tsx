"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Headphones,
  Award,
  Sparkles,
  Flame,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";

export function Hero() {
  const features = [
    {
      icon: Zap,
      title: "تنفيذ فوري وسريع",
      subtitle: "خلال دقائق معدودة",
      color: "from-amber-500/20 to-amber-500/5",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
    },
    {
      icon: ShieldCheck,
      title: "دفع آمن 100%",
      subtitle: "فودافون كاش، انستاباي، فوري وبطاقات",
      color: "from-emerald-500/20 to-emerald-500/5",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
    },
    {
      icon: Headphones,
      title: "دعم فني متواصل 24/7",
      subtitle: "فريق جاهز لخدمتك على مدار الساعة",
      color: "from-blue-500/20 to-blue-500/5",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
    },
    {
      icon: Award,
      title: "أفضل أسعار السوق",
      subtitle: "عروض مستمرة وخصومات حصرية",
      color: "from-red-500/20 to-red-500/5",
      borderColor: "border-red-500/30",
      textColor: "text-[#DF0112]",
    },
  ];

  return (
    <section className="relative w-full bg-[#08090d] pt-4 pb-8 overflow-hidden">
      {/* Dynamic Ambient Red Spotlight */}
      <div className="pointer-events-none absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-5xl h-[450px] bg-[radial-gradient(ellipse_at_top,_rgba(223,1,18,0.25)_0%,_rgba(223,1,18,0.06)_50%,_transparent_75%)]" />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Status Bar Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-3.5 flex items-center justify-between gap-2 flex-wrap"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-xs font-bold text-red-300 backdrop-blur-md shadow-sm">
            <span className="flex size-2 rounded-full bg-[#DF0112] animate-ping" />
            <span className="flex size-2 -ms-3 rounded-full bg-[#DF0112]" />
            <Flame className="size-3.5 text-amber-400 ms-1" />
            <span>متجر ميدو الرسمي — شحن فوري 24/7 مع ضمان كامل</span>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition group"
          >
            <span>استعرض جميع المنتجات والشدات</span>
            <ChevronLeft className="size-4 text-[#DF0112] transition-transform group-hover:-translate-x-1" />
          </Link>
        </motion.div>

        {/* Master Esports Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative group rounded-2xl md:rounded-[2.2rem] p-[2px] bg-gradient-to-br from-red-600/70 via-red-900/30 to-red-600/70 shadow-[0_15px_70px_rgba(223,1,18,0.32)] hover:shadow-[0_20px_90px_rgba(223,1,18,0.48)] transition-all duration-500"
        >
          {/* Tactical Gaming Corner Accents */}
          <div className="pointer-events-none absolute -top-1 -start-1 size-5 border-t-2 border-s-2 border-red-500 rounded-tl-lg z-20" />
          <div className="pointer-events-none absolute -top-1 -end-1 size-5 border-t-2 border-e-2 border-red-500 rounded-tr-lg z-20" />
          <div className="pointer-events-none absolute -bottom-1 -start-1 size-5 border-b-2 border-s-2 border-red-500 rounded-bl-lg z-20" />
          <div className="pointer-events-none absolute -bottom-1 -end-1 size-5 border-b-2 border-e-2 border-red-500 rounded-br-lg z-20" />

          <div className="relative overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(2.2rem-2px)] bg-[#050608]">
            <Link
              href="/products"
              className="block relative w-full aspect-[1024/469] overflow-hidden cursor-pointer"
              title="متجر ميدو للبطاقات الرقمية — اضغط للتسوق"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/medo-hero-banner.jpg"
                alt="متجر ميدو للبطاقات الرقمية - تسوق الحين"
                className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.012] [image-rendering:-webkit-optimize-contrast] contrast-[1.04] saturate-[1.06] brightness-[1.02]"
                loading="eager"
              />
              
              {/* Subtle Edge Vignette */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[calc(1rem-1px)] md:rounded-[calc(2.2rem-2px)]" />
              
              {/* Interactive subtle sheen shimmer on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Badges Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-3.5 rounded-2xl border border-white/10 bg-[#10121a]/85 p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 hover:border-red-500/40 hover:bg-[#151724] hover:-translate-y-0.5"
              >
                <div className={`flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} border ${item.borderColor} ${item.textColor} shadow-inner`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs sm:text-sm font-black text-white truncate">
                    {item.title}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-400 truncate">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}