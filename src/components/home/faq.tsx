"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/constants";
import { useState } from "react";
import { SectionHeading } from "@/components/ui/common";
import { cn } from "@/lib/utils";

export function FAQSection({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(0);
  const items = compact ? FAQS.slice(0, 4) : FAQS;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-20">
      <SectionHeading
        center
        eyebrow="الأسئلة الشائعة"
        title="إجابات لكل أسئلتك"
        subtitle="كل ما تحتاج معرفته عن الدفع والتنفيذ والمتابعة في مكان واحد."
      />

      <div className="space-y-3">
        {items.map((faq, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className={cn(
                "overflow-hidden rounded-2xl glass transition-colors",
                isOpen && "border-volt-500/30 bg-white/6"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start focus-ring"
              >
                <span className="text-sm font-black text-white md:text-base">
                  {faq.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    isOpen
                      ? "bg-volt-500/20 text-volt-300"
                      : "bg-white/5 text-slate-400"
                  )}
                >
                  <ChevronDown className="size-4.5" />
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-sm leading-7 text-slate-400">
                  {faq.a}
                </p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}