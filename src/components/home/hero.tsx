"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Zap, ShieldCheck, Headphones, Tags } from "lucide-react";

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const EASE = [0.22, 1, 0.36, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export function Hero() {
  return (
    <section className="relative w-full bg-[#07080b] overflow-hidden">
      {/* Ambient under-glow bleeding from navbar area */}
      <div className="pointer-events-none absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-[1500px] h-[560px] bg-[radial-gradient(ellipse_at_top,_rgba(223,1,18,0.16)_0%,_transparent_68%)]" />

      <div className="relative mx-auto w-full max-w-[1400px] px-3 sm:px-6 md:px-8 pb-4">
        {/* Cinematic Master Frame */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative w-full overflow-hidden rounded-[1.75rem] md:rounded-[2.25rem] border border-[#DF0112]/35 shadow-[0_0_60px_rgba(223,1,18,0.18),0_30px_80px_-30px_rgba(0,0,0,0.9)] bg-[#050508]"
        >
          {/* ============ BACKGROUND LAYERS ============ */}
          <div className="absolute inset-0">
            {/* Deep vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_20%,transparent_40%,rgba(0,0,0,0.9)_100%)]" />
            {/* Red atmospheric depth on the right-center */}
            <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_78%_35%,rgba(223,1,18,0.22)_0%,transparent_65%)]" />
            {/* Charcoal texture */}
            <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_20%_100%,rgba(30,28,34,0.65)_0%,transparent_60%)]" />
          </div>

          {/* Cinematic bg artwork, gently blended behind */}
          <img
            src="/images/pubg-hero-bg.jpg"
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover opacity-[0.18] mix-blend-screen [mask-image:linear-gradient(to_left,rgba(0,0,0,0.75),transparent_45%)]"
          />

          {/* ============ DECORATIVE GRAPHICS ============ */}
          {/* Diagonal light streaks */}
          <div className="pointer-events-none absolute -top-24 end-[12%] h-[1500px] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-white/[0.06] to-transparent" />
          <div className="pointer-events-none absolute -top-24 end-[26%] h-[1500px] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-[#DF0112]/[0.22] to-transparent" />
          <div className="pointer-events-none absolute -top-24 start-[38%] h-[1500px] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-white/[0.04] to-transparent" />
          <div className="pointer-events-none absolute -top-24 start-[52%] h-[1500px] w-px rotate-[24deg] bg-gradient-to-b from-transparent via-[#DF0112]/[0.16] to-transparent" />

          {/* Floating red particles */}
          <div className="pointer-events-none absolute top-[16%] start-[30%] size-1.5 rounded-full bg-[#ff4d5a]/70 blur-[1px] animate-twinkle" />
          <div className="pointer-events-none absolute top-[38%] start-[22%] size-1 rounded-full bg-[#ff4d5a]/50 blur-[1px] animate-twinkle [animation-delay:0.8s]" />
          <div className="pointer-events-none absolute bottom-[24%] start-[36%] size-1 rounded-full bg-white/40 blur-[1px] animate-twinkle [animation-delay:1.4s]" />
          <div className="pointer-events-none absolute top-[30%] end-[8%] size-1.5 rounded-full bg-[#ff4d5a]/60 blur-[1px] animate-twinkle [animation-delay:2s]" />
          <div className="pointer-events-none absolute top-[58%] end-[14%] size-1 rounded-full bg-white/35 blur-[1px] animate-twinkle [animation-delay:1s]" />
          <div className="pointer-events-none absolute bottom-[18%] end-[4%] size-1 rounded-full bg-[#ff4d5a]/45 blur-[1px] animate-twinkle [animation-delay:2.6s]" />

          {/* Drifting smoke blooms */}
          <div className="pointer-events-none absolute -bottom-16 start-[22%] h-72 w-72 rounded-full bg-[#16070c] blur-3xl opacity-70 animate-drift" />
          <div className="pointer-events-none absolute -bottom-20 end-[8%] h-80 w-80 rounded-full bg-[#2a050c]/80 blur-3xl opacity-60 animate-drift-slow" />

          {/* Diamond / star ornaments on the content side */}
          <svg className="pointer-events-none absolute top-[18%] end-[10%] size-5 text-[#DF0112]/80 drop-shadow-[0_0_8px_rgba(223,1,18,0.8)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
          </svg>
          <svg className="pointer-events-none absolute top-[72%] end-[18%] size-3 text-[#DF0112]/70 drop-shadow-[0_0_8px_rgba(223,1,18,0.7)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" />
          </svg>

          {/* Thin decorative red line top & bottom */}
          <div className="pointer-events-none absolute top-5 start-10 h-px w-36 bg-gradient-to-l from-transparent via-[#DF0112]/70 to-[#DF0112]" />
          <div className="pointer-events-none absolute bottom-5 end-10 h-px w-36 bg-gradient-to-r from-transparent via-[#DF0112]/70 to-[#DF0112]" />

          {/* ============ LEFT — CHARACTER (physical-left) ============ */}
          <div className="pointer-events-none absolute inset-0 [clip-path:polygon(0_0,42%_0,42%_100%,0_100%)] opacity-50 md:opacity-100">
            <img
              src="/images/medo-character.jpg"
              alt="شخصية مقاتل ببجي"
              className="absolute bottom-0 left-0 h-[112%] w-auto max-w-none object-contain mix-blend-screen md:opacity-95 [filter:drop-shadow(0_0_22px_rgba(223,1,18,0.5))] animate-float-slow"
            />
            {/* Red rim light hugging the character's right edge */}
            <div className="absolute inset-y-0 left-[30%] w-40 bg-gradient-to-r from-transparent via-[#DF0112]/18 to-transparent [mask-image:linear-gradient(to_bottom,transparent_8%,black_50%,transparent_92%)]" />
          </div>

          {/* ============ RIGHT — MAIN CONTENT (physical-right) ============ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="relative z-10 flex min-h-[440px] md:min-h-[480px] xl:min-h-[520px] flex-col justify-center gap-4 py-10 [padding-inline-start:6%] [padding-inline-end:8%] md:gap-5 md:[padding-inline-start:5%] lg:[padding-inline-start:4%] xl:[padding-inline-start:3%] md:[padding-inline-end:40%]"
          >
            {/* Decorative red line */}
            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <span className="h-1 w-10 rounded-full bg-[#DF0112] shadow-[0_0_12px_rgba(223,1,18,0.9)]" />
              <span className="h-2 w-2 rotate-45 bg-[#DF0112] shadow-[0_0_8px_rgba(223,1,18,0.9)]" />
            </motion.div>

            {/* Main title */}
            <motion.h1
              variants={itemVariants}
              className="font-black leading-[1.02] tracking-tight"
            >
              <span className="block text-[clamp(2.6rem,5.2vw,4.6rem)] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                متجر
              </span>
              <span className="block text-[clamp(3rem,6.4vw,5.8rem)] text-[#ff2b38] drop-shadow-[0_6px_26px_rgba(223,1,18,0.55)]">
                ميدو
              </span>
            </motion.h1>

            {/* Supporting text */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl lg:text-3xl font-extrabold text-white/95 tracking-wide"
            >
              للبطاقات الرقمية
            </motion.p>

            {/* Red CTA banner */}
            <motion.div variants={itemVariants} className="mt-1.5">
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#ff3a45] via-[#e30010] to-[#a3000a] px-6 py-3.5 md:px-8 md:py-4 shadow-[0_10px_34px_-6px_rgba(223,1,18,0.65),inset_0_1px_0_rgba(255,255,255,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 -skew-x-12 translate-x-[140%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-[-140%]" />
                <span className="text-lg md:text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                  تسوق الحين
                </span>
                <span className="flex size-9 md:size-10 items-center justify-center rounded-xl bg-white/15 border border-white/25">
                  <ShoppingCart className="size-4.5 md:size-5 text-white" />
                </span>
              </Link>
            </motion.div>

            {/* Secondary service badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-gradient-to-b from-[#ffd54a] to-[#f9a825] text-[10px] shadow-[0_0_10px_rgba(255,213,74,0.5)]">
                ⚡
              </span>
              <span className="text-sm md:text-base font-bold text-white/90">خدمة فورية 24/7</span>
            </motion.div>

            {/* Primary CTA button */}
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              <Link
                href="/products"
                className="group relative inline-flex items-center gap-3 rounded-xl border border-[#DF0112]/70 bg-[#DF0112]/10 px-6 py-3 md:px-7 md:py-3.5 text-base md:text-lg font-extrabold text-white backdrop-blur-sm transition-all duration-300 hover:bg-[#DF0112] hover:shadow-[0_10px_30px_-6px_rgba(223,1,18,0.6)]"
              >
                <ShoppingCart className="size-4.5 md:size-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
                <span>تسوق الآن</span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Bottom fade into feature cards */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/45 to-transparent" />
        </motion.section>

        {/* ============ HERO BOTTOM — 4 FEATURE CARDS ============ */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto -mt-0 grid w-[92%] grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4"
        >
          {[
            {
              icon: Zap,
              title: "تنفيذ فوري وسريع",
              desc: "يتم تنفيذ طلبك في دقائق",
            },
            {
              icon: ShieldCheck,
              title: "دفع آمن 100%",
              desc: "جميع طرق الدفع متاحة وآمنة",
            },
            {
              icon: Headphones,
              title: "دعم فني متواصل 24/7",
              desc: "فريق دعم جاهز لخدمتك",
            },
            {
              icon: Tags,
              title: "أفضل أسعار السوق",
              desc: "أرخص الأسعار وأفضل العروض",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group flex items-center gap-3.5 rounded-2xl border border-white/10 bg-[#0d0f16]/85 px-4 py-4 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#DF0112]/50 hover:shadow-[0_14px_34px_-14px_rgba(223,1,18,0.4)]"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#DF0112]/15 text-[#DF0112] ring-1 ring-[#DF0112]/30 transition-colors duration-300 group-hover:bg-[#DF0112] group-hover:text-white">
                <card.icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-extrabold text-white">{card.title}</span>
                <span className="mt-0.5 block text-xs text-slate-400">{card.desc}</span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
