"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Headphones,
  Award,
  Sparkles,
} from "lucide-react";

export function Hero() {
  const features = [
    {
      icon: Zap,
      title: "تنفيذ فوري وسريع",
      subtitle: "يصلك طلبك خلال دقائق معدودة",
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
    <section className="relative w-full bg-[#08090d] pt-3 pb-8 overflow-hidden">
      {/* Cinematic Ambient Glow Behind Hero */}
      <div className="pointer-events-none absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-[1600px] h-[550px] bg-[radial-gradient(ellipse_at_top,_rgba(223,1,18,0.22)_0%,_rgba(223,1,18,0.05)_45%,_transparent_75%)]" />

      <div className="relative mx-auto w-full max-w-[1600px] px-3 sm:px-5 md:px-8">
        
        {/* Main Gaming Banner with Precision Frame & Red Neon Edge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative group rounded-2xl md:rounded-[2rem] p-[1.5px] bg-gradient-to-r from-red-600/50 via-red-500/20 to-red-600/50 shadow-[0_15px_60px_rgba(223,1,18,0.28)] hover:shadow-[0_20px_80px_rgba(223,1,18,0.4)] transition-all duration-500"
        >
          <div className="relative overflow-hidden rounded-[calc(1rem-1px)] md:rounded-[calc(2rem-1.5px)] bg-[#0c0d14]">
            <Link
              href="/products"
              className="block relative w-full aspect-[1024/469] overflow-hidden cursor-pointer"
              title="متجر ميدو للبطاقات الرقمية — اضغط للتسوق"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/medo-hero-banner.png"
                alt="متجر ميدو للبطاقات الرقمية - تسوق الحين"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                loading="eager"
              />
              
              {/* Sleek Dark Edge Vignette to blend perfectly into dark mode */}
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[calc(1rem-1px)] md:rounded-[calc(2rem-1.5px)]" />
              
              {/* Interactive subtle sheen shimmer on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090d]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Badges Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-5 sm:mt-7 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
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