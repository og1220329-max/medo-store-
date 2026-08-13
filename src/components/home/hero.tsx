"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  ShieldCheck,
  Headphones,
  Tag,
  Star,
  Shield,
  MessageCircle,
} from "lucide-react";

export function Hero() {
  const features = [
    {
      icon: Zap,
      title: "تنفيذ فوري وسريع",
      subtitle: "يتم تنفيذ طلبك في دقائق",
    },
    {
      icon: ShieldCheck,
      title: "دفع آمن 100%",
      subtitle: "جميع طرق الدفع متاحة وآمنة",
    },
    {
      icon: Headphones,
      title: "دعم فني متواصل 24/7",
      subtitle: "فريق دعم جاهز لخدمتك",
    },
    {
      icon: Tag,
      title: "أفضل أسعار السوق",
      subtitle: "أرخص الأسعار وأفضل العروض",
    },
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces",
  ];

  return (
    <section className="relative w-full bg-[#08090d] pt-3 pb-8 overflow-hidden">
      {/* Dynamic Ambient Red Spotlight */}
      <div className="pointer-events-none absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-6xl h-[500px] bg-[radial-gradient(ellipse_at_top,_rgba(223,1,18,0.22)_0%,_rgba(223,1,18,0.05)_50%,_transparent_75%)]" />

      <div className="relative mx-auto w-full max-w-7xl px-3 sm:px-5 md:px-8">
        
        {/* Master Esports Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group rounded-2xl md:rounded-3xl overflow-hidden border border-red-500/25 bg-[#050608] shadow-[0_15px_70px_rgba(223,1,18,0.25)] hover:shadow-[0_20px_80px_rgba(223,1,18,0.38)] transition-all duration-300"
        >
          <Link
            href="/products"
            className="block relative w-full aspect-[984/400] overflow-hidden cursor-pointer"
            title="متجر ميدو للبطاقات الرقمية — اضغط للتسوق"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/medo-hero-banner.jpg"
              alt="متجر ميدو للبطاقات الرقمية - تسوق الحين"
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.012] [image-rendering:-webkit-optimize-contrast]"
              loading="eager"
            />
            {/* Subtle interactive sheen */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </motion.div>

        {/* 4 Feature Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 sm:mt-5 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-3.5 rounded-2xl border border-white/10 bg-[#0d0f15]/90 p-3.5 sm:p-4 backdrop-blur-md transition-all duration-200 hover:border-red-500/40 hover:bg-[#131622] hover:-translate-y-0.5"
              >
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-red-950/30 border border-red-500/30 text-[#DF0112] shadow-inner">
                  <Icon className="size-5 sm:size-5.5" />
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

        {/* Bottom Trust & Payment Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-4 rounded-2xl border border-white/10 bg-[#0d0f15]/90 p-3.5 sm:p-4 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Left in RTL: Payment Methods */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
              <Shield className="size-4 text-emerald-400" />
              <span>طرق دفع مضمونة وآمنة</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* InstaPay */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#4b1d6e]/90 text-white text-[11px] font-black tracking-wide border border-purple-500/30">
                instaPay
              </div>
              {/* Vodafone Cash */}
              <div className="flex items-center justify-center px-2 py-1 rounded-md bg-[#e60000] text-white text-[11px] font-black border border-red-400/40">
                vodafone cash
              </div>
              {/* Fawry */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#ffcc00] text-black text-[11px] font-black border border-amber-400/40">
                Fawry
              </div>
              {/* Contact */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#004b93] text-white text-[11px] font-black border border-blue-400/40">
                Contact
              </div>
              {/* VISA */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#1a1f71] text-white text-[11px] font-black tracking-wider border border-blue-300/30">
                VISA
              </div>
              {/* Mastercard */}
              <div className="flex items-center justify-center px-2 py-1 rounded-md bg-[#222329] border border-white/15">
                <div className="flex -space-x-1.5 rtl:space-x-reverse">
                  <span className="size-3.5 rounded-full bg-[#eb001b] inline-block opacity-90" />
                  <span className="size-3.5 rounded-full bg-[#f79e1b] inline-block opacity-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Center in RTL: Ratings & Over 10,000 Customers */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center -space-x-2 rtl:space-x-reverse">
              {avatars.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={img}
                  alt={`Customer ${i + 1}`}
                  className="size-7 rounded-full object-cover border-2 border-[#0d0f15]"
                />
              ))}
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-right">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                تقييم 4.9 من أكثر من 10,000 عميل
              </span>
            </div>

            <div className="flex flex-col items-center px-2.5 py-0.5 rounded-lg bg-red-950/30 border border-red-500/20">
              <span className="text-sm font-black text-[#DF0112]">+10K</span>
              <span className="text-[10px] text-slate-400">عميل راضي</span>
            </div>
          </div>

          {/* Right in RTL: WhatsApp Support Link */}
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 hover:opacity-90 transition group shrink-0"
          >
            <div className="flex flex-col text-left rtl:text-right">
              <span className="text-[11px] text-slate-400 font-medium">تحتاج مساعدة؟</span>
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                تواصل معنا الآن
              </span>
            </div>
            <div className="flex size-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-green-950/40 group-hover:scale-105 transition-transform">
              <MessageCircle className="size-5 fill-white text-white" />
            </div>
          </a>
        </motion.div>

      </div>
    </section>
  );
}