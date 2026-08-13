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
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces",
  ];

  return (
    <section className="relative w-full bg-[#08090d] pt-4 pb-8 overflow-hidden">
      <div className="relative mx-auto w-full max-w-[1400px] px-4 md:px-8">
        
        {/* Master Esports Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative group rounded-2xl md:rounded-[1.8rem] overflow-hidden border border-white/10 bg-[#050608] shadow-[0_15px_70px_rgba(223,1,18,0.22)]"
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
              className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01]"
              loading="eager"
            />
          </Link>
        </motion.div>

        {/* 4 Feature Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 sm:gap-3.5 rounded-2xl border border-white/10 bg-[#0d0f15] p-3.5 sm:p-4 transition-all duration-200 hover:border-red-500/40 hover:bg-[#12141c]"
              >
                <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-full bg-red-950/40 border border-red-500/40 text-[#DF0112]">
                  <Icon className="size-5 sm:size-5.5 text-[#DF0112]" />
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
          className="mt-4 rounded-2xl border border-white/10 bg-[#0d0f15] p-3.5 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          {/* Left in RTL: Payment Methods */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <Shield className="size-4 text-slate-400" />
              <span>طرق دفع مضمونة وآمنة</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {/* InstaPay */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#4b1d6e] text-white text-[11px] font-black tracking-wide">
                instaPay
              </div>
              {/* Vodafone Cash */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#e60000] text-white text-[11px] font-black">
                vodafone cash
              </div>
              {/* Fawry */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#ffcc00] text-black text-[11px] font-black">
                Fawry
              </div>
              {/* Contact */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#004b93] text-white text-[11px] font-black">
                Contact
              </div>
              {/* VISA */}
              <div className="flex items-center justify-center px-2.5 py-1 rounded-md bg-[#1a1f71] text-white text-[11px] font-black tracking-wider">
                VISA
              </div>
              {/* Mastercard */}
              <div className="flex items-center justify-center px-2 py-1 rounded-md bg-[#222329] border border-white/10">
                <div className="flex -space-x-1.5 rtl:space-x-reverse">
                  <span className="size-3.5 rounded-full bg-[#eb001b] inline-block" />
                  <span className="size-3.5 rounded-full bg-[#f79e1b] inline-block" />
                </div>
              </div>
            </div>
          </div>

          {/* Center in RTL: Ratings & Customer Trust */}
          <div className="flex items-center gap-3">
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
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                تقييم 4.9 من أكثر من 10,000 عميل
              </span>
            </div>

            <div className="flex flex-col items-center ps-2 border-s border-white/10">
              <span className="text-sm font-black text-[#DF0112]">+10K</span>
              <span className="text-[10px] text-slate-400 font-medium">عميل راضي</span>
            </div>
          </div>

          {/* Right in RTL: WhatsApp Contact */}
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