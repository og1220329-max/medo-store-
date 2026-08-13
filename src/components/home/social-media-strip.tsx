"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Instagram, Music2, Youtube } from "lucide-react";
import { SOCIAL_SERVICES } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/primitives";

export function SocialMediaStrip() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-l from-night-800 via-night-900 to-night-800 p-8 md:p-12">
        <div className="pointer-events-none absolute -end-20 -top-20 size-64 rounded-full bg-fuchsia-600/15 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -start-16 size-64 rounded-full bg-sky-600/15 blur-[100px]" />

        <div className="relative grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-3.5 py-1 text-xs font-bold text-fuchsia-300">
              خدمات السوشيال ميديا
            </span>
            <h3 className="text-2xl font-black text-white md:text-3xl">
              نمّ حساباتك على كل المنصات
            </h3>
            <p className="mt-3 max-w-md text-sm leading-7 text-slate-400">
              متابعين، لايكات، ومشاهدات حقيقية وآمنة لإنستجرام وتيك توك
              ويوتيوب — بدون الحاجة لكلمة مرور حسابك.
            </p>
            <Link href="/services/social-media" className="mt-6 inline-block">
              <Button>
                تصفح الخدمات
                <ArrowLeft className="size-4.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {SOCIAL_SERVICES.slice(0, 6).map((s, i) => {
              const Icon =
                s.icon === "Instagram"
                  ? Instagram
                  : s.icon === "Youtube"
                  ? Youtube
                  : Music2;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  whileHover={{ y: -5 }}
                  className="rounded-2xl glass p-4 text-center"
                >
                  <span
                    className={`mx-auto mb-2.5 flex size-11 items-center justify-center rounded-xl text-white ${
                      s.platform === "instagram"
                        ? "bg-gradient-to-br from-fuchsia-500 to-rose-500"
                        : s.platform === "youtube"
                        ? "bg-gradient-to-br from-rose-500 to-rose-700"
                        : "bg-gradient-to-br from-night-700 to-night-900 border border-white/10"
                    }`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <p className="text-xs font-black text-white">{s.service}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    يبدأ من {s.minPrice} ج.م
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}