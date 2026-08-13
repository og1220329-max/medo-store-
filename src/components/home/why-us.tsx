"use client";

import { motion } from "framer-motion";
import { Gem, Headphones, Lock, Zap } from "lucide-react";
import { WHY_US } from "@/lib/constants";
import { SectionHeading } from "@/components/ui/common";

const ICONS: Record<string, typeof Zap> = {
  Zap,
  Lock,
  Headphones,
  Gem,
};

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading
        center
        eyebrow="لماذا نحن"
        title="لماذا تختارنا؟"
        subtitle="لأن راحتك وثقتك أولويتنا — نقدم تجربة شراء رقمية احترافية بالكامل."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_US.map((item, i) => {
          const Icon = ICONS[item.icon] || Zap;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl glass p-6 text-center transition-shadow hover:shadow-glow"
            >
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-volt-500/60 to-transparent opacity-0 transition group-hover:opacity-100" />
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-volt-500/20 to-glow-500/20 text-volt-300 transition group-hover:from-volt-500 group-hover:to-glow-500 group-hover:text-white group-hover:shadow-glow">
                <Icon className="size-6" />
              </span>
              <h3 className="text-lg font-black text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}