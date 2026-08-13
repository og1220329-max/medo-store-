"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import type { Store } from "@/lib/types";
import { SectionHeading } from "@/components/ui/common";
import { Button } from "@/components/ui/primitives";

export function ContactSection({ settings }: { settings: Store["settings"] }) {

  const channels = [
    {
      label: "واتساب",
      value: settings.whatsapp,
      href: `https://wa.me/${settings.whatsapp}`,
      icon: MessageCircle,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      label: "تيليجرام",
      value: `@${settings.telegram}`,
      href: `https://t.me/${settings.telegram}`,
      icon: Send,
      color: "from-sky-500 to-cyan-600",
    },
    {
      label: "فيسبوك",
      value: `/${settings.facebook}`,
      href: `https://facebook.com/${settings.facebook}`,
      icon: Facebook,
      color: "from-blue-500 to-blue-700",
    },
    {
      label: "إنستجرام",
      value: `@${settings.instagram}`,
      href: `https://instagram.com/${settings.instagram}`,
      icon: Instagram,
      color: "from-fuchsia-500 to-rose-500",
    },
    {
      label: "البريد الإلكتروني",
      value: settings.email,
      href: `mailto:${settings.email}`,
      icon: Mail,
      color: "from-volt-500 to-glow-500",
    },
  ];

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-volt-500/50 to-transparent" />
      <div className="pointer-events-none absolute start-1/3 top-1/2 size-80 -translate-y-1/2 rounded-full bg-glow-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-4xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-[2.5rem] glass-strong p-8 md:p-14"
        >
          <SectionHeading
            center
            eyebrow="الدعم الفني"
            title="تحتاج مساعدة؟ فريق الدعم جاهز لخدمتك."
            subtitle="افتح تذكرة من صفحة تواصل معنا أو راسلنا مباشرة عبر القنوات التالية — نرد خلال دقائق."
          />

          <div className="grid gap-3.5 sm:grid-cols-2">
            {channels.map((ch, i) => (
              <motion.a
                key={ch.label}
                href={ch.href}
                target={ch.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
                className="group flex items-center gap-4 rounded-2xl glass p-4 text-start transition hover:border-volt-500/30"
              >
                <span
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${ch.color} text-white shadow-lg`}
                >
                  <ch.icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black text-white">
                    {ch.label}
                  </span>
                  <span className="block truncate text-xs text-slate-500" dir="ltr">
                    {ch.value}
                  </span>
                </span>
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.35 }}
              className="flex items-center justify-center rounded-2xl border border-volt-500/30 bg-volt-500/10 p-4 sm:col-span-2"
            >
              <Link href="/contact" className="w-full">
                <Button variant="outline" size="lg" className="w-full">
                  افتح تذكرة دعم
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}