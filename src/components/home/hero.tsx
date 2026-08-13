"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Headphones,
  Award,
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
    <section className="relative w-full bg-[#08090d] pt-2 pb-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-[1600px] h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(223,1,18,0.18)_0%,_transparent_75%)]" />

      <div className="relative mx-auto w-full max-w-[1600px] px-2 sm:px-4 md:px-6">
        {/* Full Big Banner Container */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-red-500/30 bg-[#0c0d14] shadow-[0_12px_60px_rgba(223,1,18,0.25)] hover:border-red-500/60 transition-colors duration-300"
        >
          <Link
            href="/products"
            className="block relative w-full aspect-[1024/473] overflow-hidden cursor-pointer"
            title="متجر ميدو للبطاقات الرقمية - اضغط للتسوق"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/medo-hero-banner.png"
              alt="متجر ميدو للبطاقات الرقمية - تسوق الحين"
              className="w-full h-full object-cover sm:object-fill transition-transform duration-500 group-hover:scale-[1.01]"
              priority-load="true"
            />
            {/* Interactive Subtle Glow Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </Link>
        </motion.div>

        {/* Feature Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-3.5 rounded-2xl border border-white/10 bg-[#10121a]/90 p-3 sm:p-4 backdrop-blur-sm transition-all duration-200 hover:border-red-500/30 hover:bg-[#151724]"
              >
                <div className={`flex size-10 sm:size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} border ${item.borderColor} ${item.textColor}`}>
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